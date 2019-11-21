import request from '@/utils/request'


export function getAllUserList(params) {
    return request({
      url: '/user/queryUser',
      method: 'get',
      params
    //   params: { token }
    })
  }
  
  export function EditUser(data) {
    return request({
      url: '/user/updateUser',
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
  export function addUser(data) {
    return request({
      url: '/user/addUser',
      method: 'post',
      data
    })
  }
  export function addUserJob(data) {
    return request({
      url: '/user/addUserJobDept',
      method: 'post',
      data
    })
  }
  export function editUserJob(data) {
    return request({
      url: '/user/updateUserJobDept',
      method: 'post',
      data
    })
  }
  
  export function delUserJobDept(params) {
    return request({
      url: '/user/delUserJobDept',
      method: 'get',
      params
    })
  }
  export function UserJobDeptByUserId(params) {
    return request({
      url: '/user/queryUserJobDeptByUserId',
      method: 'get',
      params
    })
  }

