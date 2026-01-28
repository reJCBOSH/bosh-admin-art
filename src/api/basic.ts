import request from '@/utils/http'

export function fetchPublicKeyGet() {
  return request.get<string>({
    url: '/api/basic/publicKey',
    showErrorMessage: false
  })
}
