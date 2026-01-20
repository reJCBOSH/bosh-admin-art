import request from '@/utils/http'

export function fetchGetApiList(params?: object) {
  return request.get<any>({
    url: '/api/system/api/list',
    params
  })
}

export function fetchGetApiInfo(params: object) {
  return request.get<any>({
    url: '/api/system/api/info',
    params
  })
}

export function fetchAddApi(params: object) {
  return request.post<any>({
    url: '/api/system/api/add',
    params
  })
}

export function fetchEditApi(params: object) {
  return request.post<any>({
    url: '/api/system/api/edit',
    params
  })
}

export function fetchDelApi(params: object) {
  return request.post<any>({
    url: '/api/system/api/del',
    params
  })
}

export function fetchApiGroupsGet() {
  return request.get<any>({
    url: '/api/system/api/groups'
  })
}
