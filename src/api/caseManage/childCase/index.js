/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-06 10:42:34
 * @LastEditTime: 2019-08-13 15:13:05
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