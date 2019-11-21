import request from '@/utils/request'

export function getAllUserList(params) {
  return request({
    url: '/user/queryUser',
    method: 'get',
    params
  })
}
export function getCourtRoomById(params) {
  return request({
    url: '/courtRoom/queryByCourtId',
    method: 'get',
    params
  })
}
export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}
export function delUser(params) {
  return request({
    url: '/user/delUser',
    method: 'get',
    params
  })
}
export function EditUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}


