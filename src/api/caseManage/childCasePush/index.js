/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-06 10:42:57
 * @LastEditTime: 2019-08-13 15:13:13
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request'

export function queryCasesList(params) {
  return request({
    url: '/subCaseInfo/querySubCaseInfo',
    method: 'get',
    params 
  })
}

export function repush(params) {
  return request({
    url: '/push1/pushDirectoryFile',
    method: 'get',
    params 
  })
}

export function caseModel(params) {
  return request({
    url: '/push1/deleteAllFiles',
    method: 'get',
    params 
  })
}
export function queryAlllogInfo(params) {
  return request({
    url: '/logInfo/queryByCaseId',
    method: 'get',
    params 
  })
}