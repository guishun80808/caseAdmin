/*
 * @Description: GuiShun
 * @Author: your name
 * @Date: 2019-08-06 10:42:16
 * @LastEditTime: 2019-09-03 15:53:43
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request'

export function getAllCheckList(params) {
  return request({
    url: '/caseCheck/checkConfigureSelect',
    method: 'get',
    params 
  })
}

export function addCaseCheck(params) {
  return request({
    url: '/caseCheck/checkConfigureAdd',
    method: 'get',
    params 
  })
}

export function delCaseCheck(params) {
  return request({
    url: '/caseCheck/checkConfigureDel',
    method: 'get',
    params 
  })
}

export function editCaseCheck(data) {
  return request({
    url: '/caseCheck/checkConfigureUpdate',
    method: 'post',
    data 
  })
}

//获取单个目录信息
export function queryOneDirectory(params) {
  return request({
    url: '/directory/queryOneDirectory',
    method: 'get',
    params 
  })
}

