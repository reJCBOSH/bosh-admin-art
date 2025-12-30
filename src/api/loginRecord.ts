import request from '@/utils/http'

export function fetchGetLoginRecordList(params?: object) {
  return request.get<any>({
    url: '/api/system/loginRecord/list',
    params
  })
}

export function fetchGetLoginRecordInfo(params: object) {
  return request.get<any>({
    url: '/api/system/loginRecord/info',
    params
  })
}

export function fetchDelLoginRecord(params: object) {
  return request.post<any>({
    url: '/api/system/loginRecord/del',
    params
  })
}

export function fetchBatchDelLoginRecord(params: object) {
  return request.post<any>({
    url: '/api/system/loginRecord/batchDel',
    params
  })
}
