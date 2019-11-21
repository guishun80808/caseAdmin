import request from '@/utils/request'

export function queryDealCaseStatistics(params) {
  return request({
    url: '/DealCaseStatistics/queryDealCaseStatistics',
    method: 'get',
    params
  })
}