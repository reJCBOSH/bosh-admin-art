import request from '@/utils/http'

export function fetchGetRoleList(params?: object) {
  return request.get<any>({
    url: '/api/system/role/list',
    params
  })
}

export function fetchGetRoleInfo(params?: object) {
  return request.get<any>({
    url: '/api/system/role/info',
    params
  })
}

export function fetchAddRole(params: object) {
  return request.post<any>({
    url: '/api/system/role/add',
    params
  })
}

export function fetchEditRole(params: object) {
  return request.post<any>({
    url: '/api/system/role/edit',
    params
  })
}

export function fetchDelRole(params: object) {
  return request.post<any>({
    url: '/api/system/role/del',
    params
  })
}

export function fetchSetStatus(params: object) {
  return request.post<any>({
    url: '/api/system/role/setStatus',
    params
  })
}

export function fetchGetRoleMenu(params: object) {
  return request.get<any>({
    url: '/api/system/role/menu',
    params
  })
}

export function fetchGetRoleMenuIds(params: object) {
  return request.get<any>({
    url: '/api/system/role/menuIds',
    params
  })
}

export function fetchGetRoleDeptIds(params: object) {
  return request.get<any>({
    url: '/api/system/role/deptIds',
    params
  })
}

export function fetchSetRoleMenuAuth(params: object) {
  return request.post<any>({
    url: '/api/system/role/setMenuAuth',
    params
  })
}

export function fetchSetRoleDataAuth(params: object) {
  return request.post<any>({
    url: '/api/system/role/setDataAuth',
    params
  })
}
