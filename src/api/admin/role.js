/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 16:27:07
 * @LastEditTime: 2019-09-18 17:58:20
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request'


// export function getRoles() {
//     return request({
//       url: '/getRoleList',
//       method: 'get',
//     //   params: { token }
//     })
//   }
export function getRoles() {
    return request({
      url: '/role/queryAllRole',
      method: 'get',
    //   params: { token }
    })
  }
  
  export function getFunTree() {
    return request({
      url: '/func/queryFuncTree',
      method: 'get',
   
    })
  }
  export function delRole(params) {
    return request({
      url: '/role/delRole',
      method: 'get',
      params
    })
  }
  export function addRole(data) {
    return request({
      url: '/role/addRole',
      method: 'post',
      data
    })
  }
  export function getRoleFuncTreeById(params) {
    return request({
      url: '/role/queryRoleFuncIdList',
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
