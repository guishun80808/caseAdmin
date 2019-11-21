/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-14 09:57:33
 * @LastEditTime: 2019-08-15 17:13:01
 * @LastEditors: Please set LastEditors
 */

import request from "@/utils/request";

export function getAllServes() {
  return request({
    url: "/clientServer/queryAllServers",
    method: "get"
  });
}

export function addServer(data) {
  return request({
    url: "/clientServer/addServer",
    method: "post",
    data
  });
}

export function updateServer(data) {
  return request({
    url: "/clientServer/updateServer",
    method: "post",
    data
  });
}

export function deleteServer(params) {
  return request({
    url: "/clientServer/deleteServer",
    method: "get",
    params
  });
}

export function addFunction(data) {
  return request({
    url: "/clientServer/addFunction",
    method: "post",
    data
  });
}

export function deleteFun(params) {
  return request({
    url: "/clientServer/deleteFunction",
    method: "get",
    params
  });
}

//关闭某个功能
export function updateFunView(params) {
  return request({
    url: "/clientServer/updateServerFunction",
    method: "get",
    params
  });
}
