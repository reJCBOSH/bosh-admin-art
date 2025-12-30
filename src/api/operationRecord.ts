import request from '@/utils/http'

export function fetchGetOperationRecordList(params?: object) {
  return request.get<any>({
    url: '/api/system/operationRecord/list',
    params
  })
}

export function fetchGetOperationRecordInfo(params: object) {
  return request.get<any>({
    url: '/api/system/operationRecord/info',
    params
  })
}

export function fetchDelOperationRecord(params: object) {
  return request.post<any>({
    url: '/api/system/operationRecord/del',
    params
  })
}

export function fetchBatchDelOperationRecord(params: object) {
  return request.post<any>({
    url: '/api/system/operationRecord/batchDel',
    params
  })
}
