import request from '@/utils/request'

export function getQueryOwnDealCount(params) {
  return request({
    url: '/queryCount/queryOwnDealCount',
    method: 'get',
    params
  })
}