import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

export function fetchAsyncRoutes() {
  return request.get<AppRouteRecord[]>({
    url: '/api/system/menu/asyncRoutes'
  })
}

export function fetchGetMenuList(params: object) {
  return request.get<AppRouteRecord[]>({
    url: '/api/system/menu/list',
    params
  })
}

export function fetchAddMenu(params: object) {
  return request.post<any>({
    url: '/api/system/menu/add',
    params
  })
}

export function fetchEditMenu(params: object) {
  return request.post<any>({
    url: '/api/system/menu/edit',
    params
  })
}

export function fetchDelMenu(params: object) {
  return request.post<any>({
    url: '/api/system/menu/delete',
    params
  })
}
