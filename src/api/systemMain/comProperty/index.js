/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-14 09:57:33
 * @LastEditTime: 2019-08-14 14:41:19
 * @LastEditors: Please set LastEditors
 */

import request from "@/utils/request";

export function getAllProperty(params) {
    return request({
      url: "/commonProperty/queryByParam",
      method: "get",
      params
    });
  }

export function addProperty(data) {
  return request({
    url: "/commonProperty/add",
    method: "post",
    data
  });
}

export function updateProperty(data) {
  return request({
    url: "/commonProperty/update",
    method: "post",
    data
  });
}

export function deleteProperty(params) {
  return request({
    url: "/commonProperty/delete",
    method: "get",
    params
  });
}





