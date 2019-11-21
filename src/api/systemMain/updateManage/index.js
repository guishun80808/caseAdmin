/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-13 16:58:37
 * @LastEditTime: 2019-10-23 15:06:48
 * @LastEditors: GuiShun
 */
import request from '@/utils/request'

export function querySystemList(params) {
  return request({
    url: '/sys/queryVersions',
    method: 'get',
    params
  })
}

export function uploadFile(data) {
  return request({
    url: '/sys/upgrade',
    method: 'post',
    "Content-Type": 'multipart/form-data',
    data
  })
}
