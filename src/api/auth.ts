import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.TokenResponse>({
    url: '/api/auth/user/login',
    params
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

/**
 * 刷新访问令牌
 * @param refreshToken 刷新令牌
 * @returns 新的访问令牌信息
 */
export function fetchRefreshToken(params: Api.Auth.refreshTokenParams) {
  return request.post<Api.Auth.TokenResponse>({
    url: '/api/auth/refresh',
    params
  })
}
