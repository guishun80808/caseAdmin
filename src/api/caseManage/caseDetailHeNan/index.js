/*
 * @Description: GuiShun
 * @Author: your name
 * @Date: 2019-08-06 10:42:16
 * @LastEditTime: 2019-08-13 12:01:01
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request'

export function queryCasesList(params) {
  return request({
    url: '/caseInfo/queryCases',
    method: 'get',
    params 
  })
}