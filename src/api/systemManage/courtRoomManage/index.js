import request from '@/utils/request'

export function getAllCourtList() {
  return request({
    url: '/courtInfo/queryTree',
    method: 'post',
  })
}
