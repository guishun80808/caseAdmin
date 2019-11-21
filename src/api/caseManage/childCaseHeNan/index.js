/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-06 10:42:55
 * @LastEditTime: 2019-08-13 12:04:34
 * @LastEditors: GuiShun
 */
import request from '@/utils/request'

export function queryCasesList(params) {
  return request({
    url: '/subCaseInfo/querySubCaseInfo', 
    method: 'get',
    params 
  })
}