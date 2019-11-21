import request from '@/utils/request'

export function queryCourtStatistics(params) {
  return request({
    url: '/courtStatistics/queryCourtStatistics',
    method: 'get',
    params
  })
}
export function printExcel(params) {
  return request({
    url: '/courtStatistics/exportCourtExcel',
    method: 'get',
    params
  })
}