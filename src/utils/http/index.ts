/**
 * HTTP 请求封装模块
 * 基于 Axios 封装的 HTTP 请求工具，提供统一的请求/响应处理
 *
 * ## 主要功能
 *
 * - 请求/响应拦截器（自动添加 Token、统一错误处理）
 * - 401 未授权自动登出（带防抖机制）
 * - 请求失败自动重试（可配置）
 * - 统一的成功/错误消息提示
 * - 支持 GET/POST/PUT/DELETE 等常用方法
 *
 * @module utils/http
 * @author Art Design Pro Team
 */

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CustomParamsSerializer,
  InternalAxiosRequestConfig
} from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiStatus } from './status'
import { HttpError, handleError, showError, showSuccess } from './error'
import { $t } from '@/locales'
import { BaseResponse } from '@/types'
import { fetchRefreshToken } from '@/api/auth'
import { stringify } from 'qs'

/** 请求配置常量 */
const REQUEST_TIMEOUT = 15000
const LOGOUT_DELAY = 500
const MAX_RETRIES = 0
const RETRY_DELAY = 1000
const UNAUTHORIZED_DEBOUNCE_TIME = 3000
const TOKEN_REFRESH_DURATION = 5 * 60 * 1000 // 5分钟

/** 不需要token的API白名单 */
const WHITE_LIST_APIS = ['/login', '/refreshToken']

/** `token`过期后，暂存待执行的请求 */
let requests: any[] = []

/** 防止重复刷新`token` */
let isRefreshing = false

/** 401防抖状态 */
let isUnauthorizedErrorShown = false
let unauthorizedTimer: NodeJS.Timeout | null = null

/** 扩展 AxiosRequestConfig */
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean
  showSuccessMessage?: boolean
}

const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

/** Axios实例 */
const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: VITE_API_URL,
  withCredentials: VITE_WITH_CREDENTIALS === 'true',
  validateStatus: (status) => status >= 200 && status < 300,
  transformResponse: [
    (data, headers) => {
      const contentType = headers['content-type']
      if (contentType?.includes('application/json')) {
        try {
          return JSON.parse(data)
        } catch {
          return data
        }
      }
      return data
    }
  ],
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
})

/** 请求拦截器 */
axiosInstance.interceptors.request.use(
  async (request: InternalAxiosRequestConfig) => {
    // 只有当数据不是FormData且没有显式设置Content-Type时才设置为application/json
    if (
      request.data &&
      !(request.data instanceof FormData) &&
      !request.headers['Content-Type'] &&
      !request.headers.get('Content-Type')
    ) {
      request.headers.set('Content-Type', 'application/json')
    }

    // 检查是否在白名单中
    const isInWhiteList = WHITE_LIST_APIS.some((url) => request.url?.includes(url))

    if (!isInWhiteList) {
      const useUser = useUserStore()
      if (useUser.accessToken) {
        const now = new Date().getTime()
        // 提前5分钟刷新，防止前端请求时access token未过期，到后端access token过期的情况
        const expired = useUser.expiresAt - now <= TOKEN_REFRESH_DURATION
        if (expired) {
          // 检查是否有refreshToken可用
          if (!useUser.refreshToken) {
            // 如果没有refreshToken，直接登出
            setTimeout(() => {
              useUserStore().logOut()
            }, LOGOUT_DELAY)
            return Promise.reject(new Error('No refresh token available'))
          }

          if (!isRefreshing) {
            isRefreshing = true
            try {
              const res = await fetchRefreshToken({ refreshToken: useUser.refreshToken })
              useUser.setToken(res.accessToken, res.refreshToken, res.expiresAt)
              request.headers.set('Authorization', useUser.formatToken(res.accessToken))

              // 成功刷新token后，处理等待队列中的请求
              const requestsCopy = [...requests]
              requests = []
              requestsCopy.forEach((callback) => callback(res.accessToken))
            } catch (error) {
              // 刷新token失败时，需要重置刷新状态，并清空待执行请求队列
              const requestsCopy = [...requests]
              requests = []

              // 通知所有等待的请求token刷新失败
              requestsCopy.forEach((callback) => callback(null))

              // 直接退出登录
              setTimeout(() => {
                useUserStore().logOut()
              }, LOGOUT_DELAY)

              return Promise.reject(error)
            } finally {
              isRefreshing = false
            }
          } else {
            // 正在刷新token，将请求加入队列等待
            return new Promise((resolve, reject) => {
              requests.push((newToken: string | null) => {
                if (newToken) {
                  request.headers.set('Authorization', useUser.formatToken(newToken))
                  resolve(request)
                } else {
                  // token刷新失败，拒绝请求
                  reject(new Error('Token refresh failed'))
                }
              })
            })
          }
        } else {
          request.headers.set('Authorization', useUser.formatToken(useUser.accessToken))
        }
      }
    }
    return request
  },
  (error) => {
    showError(createHttpError($t('httpMsg.requestConfigError'), ApiStatus.error))
    return Promise.reject(error)
  }
)

/** 响应拦截器 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const { code, msg } = response.data
    if (code === ApiStatus.success) return response
    if (code === ApiStatus.unauthorized) handleUnauthorizedError(msg)
    throw createHttpError(msg || $t('httpMsg.requestFailed'), code)
  },
  (error) => {
    // 对于白名单API，不处理401错误，避免在登录等公共接口上触发登出
    const requestUrl = error.config?.url || ''
    const isInWhiteList = WHITE_LIST_APIS.some((url) => requestUrl.includes(url))

    if (error.response?.status === ApiStatus.unauthorized && !isInWhiteList) {
      handleUnauthorizedError()
    }
    return Promise.reject(handleError(error))
  }
)

/** 统一创建HttpError */
function createHttpError(message: string, code: number) {
  return new HttpError(message, code)
}

/** 处理401错误（带防抖） */
function handleUnauthorizedError(message?: string): never {
  const error = createHttpError(message || $t('httpMsg.unauthorized'), ApiStatus.unauthorized)

  if (!isUnauthorizedErrorShown) {
    isUnauthorizedErrorShown = true
    setTimeout(() => {
      useUserStore().logOut()
    }, LOGOUT_DELAY)

    unauthorizedTimer = setTimeout(resetUnauthorizedError, UNAUTHORIZED_DEBOUNCE_TIME)

    showError(error, true)
    throw error
  }

  throw error
}

/** 重置401防抖状态 */
function resetUnauthorizedError() {
  isUnauthorizedErrorShown = false
  if (unauthorizedTimer) clearTimeout(unauthorizedTimer)
  unauthorizedTimer = null
}

/** 是否需要重试 */
function shouldRetry(statusCode: number) {
  return [
    ApiStatus.requestTimeout,
    ApiStatus.internalServerError,
    ApiStatus.badGateway,
    ApiStatus.serviceUnavailable,
    ApiStatus.gatewayTimeout
  ].includes(statusCode)
}

/** 请求重试逻辑 */
async function retryRequest<T>(
  config: ExtendedAxiosRequestConfig,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await request<T>(config)
  } catch (error) {
    if (retries > 0 && error instanceof HttpError && shouldRetry(error.code)) {
      await delay(RETRY_DELAY)
      return retryRequest<T>(config, retries - 1)
    }
    throw error
  }
}

/** 延迟函数 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 请求函数 */
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
  // POST | PUT 参数自动填充
  if (
    ['POST', 'PUT'].includes(config.method?.toUpperCase() || '') &&
    config.params &&
    !config.data
  ) {
    config.data = config.params
    config.params = undefined
  }

  try {
    const res = await axiosInstance.request<BaseResponse<T>>(config)

    // 显示成功消息
    if (config.showSuccessMessage && res.data.msg) {
      showSuccess(res.data.msg)
    }

    return res.data.data as T
  } catch (error) {
    if (error instanceof HttpError && error.code !== ApiStatus.unauthorized) {
      const showMsg = config.showErrorMessage !== false
      showError(error, showMsg)
    }
    return Promise.reject(error)
  }
}

/** API方法集合 */
const api = {
  get<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'GET' })
  },
  post<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'POST' })
  },
  put<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'PUT' })
  },
  del<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>({ ...config, method: 'DELETE' })
  },
  request<T>(config: ExtendedAxiosRequestConfig) {
    return retryRequest<T>(config)
  }
}

export default api
