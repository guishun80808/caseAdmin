/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-20 11:34:59
 * @LastEditTime: 2019-09-24 14:31:38
 * @LastEditors: Please set LastEditors
 */
import request from "@/utils/request";

export function searchFunList(params) {
  return request({
    url: "/func/queryFuncTree",
    method: "get",
    params
  });
}

export function addFun(data) {
  return request({
    url: "/func/addFunc",
    method: "post",
    data
  });
}

export function editFun(data) {
  return request({
    url: "/func/updateFunc",
    method: "post",
    data
  });
}

export function delFun(data) {
  return request({
    url: "/func/deleteFunc",
    method: "post",
    data
  });
}
