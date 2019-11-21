import request from '@/utils/request'

export function queryUploadStatisticsByTime(params) {
  return request({
    url: '/UploadCaseStatistics/queryUploadStatisticsByTime',
    method: 'get',
    params
  })
}