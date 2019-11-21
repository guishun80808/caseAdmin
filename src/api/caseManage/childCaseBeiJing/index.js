/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-06 10:42:40
 * @LastEditTime: 2019-09-03 11:17:00
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request'

// export function queryCasesList(params) {
//   return request({
//     url: '/bjsubcaseInfo/querySubCaseInfo',
//     method: 'get',
//     params 
//   })
// }
export function queryCasesList(params) {
  return request({
    url: '/subCaseInfo/querySubCaseInfo',
    method: 'get',
    params 
  })
}





