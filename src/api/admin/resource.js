/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-20 22:49:10
 * @LastEditTime: 2019-10-12 14:55:12
 * @LastEditors: GuiShun
 */
import request from "@/utils/request";

export function searchResList(params) {
  return request({
    url: "/resource/queryList",
    method: "get",
    params
  });
}

export function addRes(data) {
  return request({
    url: "/resource/addResource",
    method: "post",
    data
  });
}

export function editRes(data) {
  return request({
    url: "/resource/updateResource",
    method: "post",
    data
  });
}

export function delRes(data) {
  return request({
    url: "/resource/deleteResource",
    method: "post",
    data
  });
}
export function getDept() {
  return request({
    url: "/dept/queryDeptTree",
    method: "get"
    // data
  });
}

export function getSelects(params) {
  return request({
    url: "/dept/queryDeptList",
    method: "get",
    params
  });
}

export function queryAllList() {
  return request({
    url: "/dept/queryAllList",
    method: "get"
  });
}

export function queryResList(params) {
  return request({
    url: "/dept/queryByResourceId",
    method: "get",
    params
  });
}

export function delResList(data) {
  return request({
    url: "/dept/delResourceDept",
    method: "post",
    data
  });
}

export function addResList(data) {
  return request({
    url: "/dept/addResourceDept",
    method: "post",
    data
  });
}
