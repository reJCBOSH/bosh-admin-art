import request from '@/utils/http'

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表
 */
export function fetchGetUserList(params: Api.SystemManage.UserSearchParams) {
  return request.get<Api.SystemManage.UserList>({
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
