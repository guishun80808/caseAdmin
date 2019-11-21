import request from '@/utils/request'

export function getQueryDealCount(params) {
  return request({
    url: '/queryCount/queryDealCount',
    method: 'get',
    params
  })
}