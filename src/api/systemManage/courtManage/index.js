/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-05 17:21:42
 * @LastEditTime: 2019-08-05 17:21:42
 * @LastEditors: your name
 */
import request from '@/utils/request'

export function getAllCourtList() {
  return request({
    url: '/courtInfo/queryTree',
    method: 'post',
  })
}


export function addCourt(data) {
  return request({
    url: '/courtInfo/addCourtInfo',
    method: 'post',
    data
  })
}

export function editCourt(data) {
  return request({
    url: '/courtInfo/updateCourtInfo',
    method: 'post',
    data
  })
}

export function delCourt(data) {
  return request({
    url: '/courtInfo/deleteCourtInfo',
    method: 'post',
    data
  })
}
