/*
* @Description: GuiShun
* @Author: your name
* @Date: 2019-08-06 10:42:16
 * @LastEditTime: 2019-09-06 16:46:53
 * @LastEditors: Please set LastEditors
*/
import request from '@/utils/request'

export function getAllCheckList() {
 return request({  
   url: '/caseCheck/checkConfigureSelect',
   method: 'post',
 })
}

export function addCaseCheck(params) {
 return request({
   url: '/caseCheck/checkTypeConfigureAdd',
   method: 'get',
   params 
 })
}

export function delCaseCheck(params) {
 return request({
   url: '/caseCheck/checkTypeConfigureDel',
   method: 'get',
   params 
 })
}
export function delCaseCheckFs(params) {
 return request({
   url: '/caseCheck/checkTypeConfigureDel',
   method: 'get',
   params 
 })
}

export function editCaseCheck(data) {
 return request({
   url: '/caseCheck/checkTypeConfigureUpdate',
   method: 'post',
   data 
 })
}

export function addCaseCheckFs(params) {
 return request({
   url: '/caseCheck/checkTypeConfigureAdd',
   method: 'get',
   params 
 })
}

export function editCaseCheckFs(data) {
  return request({
    url: '/caseCheck/checkTypeConfigureUpdate',
    method: 'post',
    data 
  })
 }

