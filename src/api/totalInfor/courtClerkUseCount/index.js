import request from '@/utils/request'

export function queryCourtClerkUserCount(params) {
  return request({
    url: '/courtStatistics/queryUserStatistics',
    method: 'get',
    params
  })
}