import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

export function fetchAsyncRoutes() {
  return request.get<AppRouteRecord[]>({
    url: '/api/system/menu/asyncRoutes'
  })
}
