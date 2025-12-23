import request from '@/utils/http'

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表
 */
export function fetchGetUserList(params?: object) {
  return request.get<any>({
    url: '/api/system/user/list',
    params
  })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetSelfInfo() {
  return request.get<Api.Auth.UserInfo>({
    url: '/api/system/user/getSelfInfo'
    // 自定义请求头
    // headers: {
    //   'X-Custom-Header': 'your-custom-value'
    // }
  })
}

export function fetchAddUser(params: object) {
  return request.post<any>({
    url: '/api/system/user/add',
    params
  })
}

export function fetchEditUser(params: object) {
  return request.post<any>({
    url: '/api/system/user/edit',
    params
  })
}

export function fetchDelUser(params: object) {
  return request.post<any>({
    url: '/api/system/user/del',
    params
  })
}

export function fetchSetStatus(params: object) {
  return request.post<any>({
    url: '/api/system/user/setStatus',
    params
  })
}

export function fetchResetPassword(params: object) {
  return request.post<any>({
    url: '/api/system/user/resetPassword',
    params
  })
}
