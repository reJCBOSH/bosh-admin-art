import request from '@/utils/http'

export function fetchGetDeptTree() {
  return request.get<any>({
    url: '/api/system/dept/tree'
  })
}

export function fetchGetDeptList(params?: object) {
  return request.get<any>({
    url: '/api/system/dept/list',
    params
  })
}

export function fetchGetDeptInfo(params?: object) {
  return request.get<any>({
    url: '/api/system/dept/info',
    params
  })
}

export function fetchAddDept(params: object) {
  return request.post<any>({
    url: '/api/system/dept/add',
    params
  })
}

export function fetchEditDept(params: object) {
  return request.post<any>({
    url: '/api/system/dept/edit',
    params
  })
}

export function fetchDelDept(params: object) {
  return request.post<any>({
    url: '/api/system/dept/del',
    params
  })
}
