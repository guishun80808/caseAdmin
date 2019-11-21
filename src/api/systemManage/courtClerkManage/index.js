import request from '@/utils/request'

export function getClerkCbrAssociation(params) {
  return request({
    url: '/clerkCbrAssociation/queryCbrList',
    method: 'get',
    params
  })
}
export function delClerkCbrAssociation(params) {
  return request({
    url: '/clerkCbrAssociation/deleteCbrById',
    method: 'get',
    params
  })
}
export function addCbr(params) {
  return request({
    url: '/clerkCbrAssociation/addCbr',
    method: 'get',
    params
  })
}

