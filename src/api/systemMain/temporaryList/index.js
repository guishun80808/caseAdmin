/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-14 09:57:33
 * @LastEditTime: 2019-08-14 11:23:59
 * @LastEditors: Please set LastEditors
 */

import request from "@/utils/request";

export function queryAllList(data) {
  return request({
    url: "/caseTmp/queryTmpSubCase",
    method: "post",
    data
  });
}

export function delTmpSubCase(params) {
  return request({
    url: "/caseTmp/delTmpSubCase",
    method: "get",
    params
  });
}

export function upLoadTmpSubCase(data) {
  return request({
    url: "/caseTmp/uploadCaseEnd",
    method: "post",
    data
  });
}
