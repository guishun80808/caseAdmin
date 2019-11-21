import request from '@/utils/request'

export function addRole(data) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data
  })
}
export function delRole(params) {
  return request({
    url: '/role/delRole',
    method: 'get',
    params
  })
}
export function editRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data
  })
}


