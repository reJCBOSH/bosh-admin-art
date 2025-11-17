import request from '@/utils/http'

export function fetchGetDeptTree() {
  return request.get({
    url: '/api/system/dept/tree'
  })
}
