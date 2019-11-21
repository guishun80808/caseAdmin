/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-20 22:49:10
 * @LastEditTime: 2019-09-27 13:03:08
 * @LastEditors: Please set LastEditors
 */
import request from "@/utils/request";

export function queryGroupById(params) {
  return request({
    url: "group/queryGroupById",
    method: "get",
    params
  });
}
export function searchGroupList(params) {
  return request({
    url: "group/queryAllGroups",
    method: "get",
    params
  });
}

export function addGroup(data) {
  return request({
    url: "/group/addGroup",
    method: "post",
    data
  });
}

export function editGroup(data) {
  return request({
    url: "/group/updateGroup",
    method: "post",
    data
  });
}

export function delGroup(params) {
  return request({
    url: "/group/deleteGroup",
    method: "get",
    params
  });
}


export function addGroupJob(data) {
  return request({
    url: "/groupJobDept/addJobDept",
    method: "post",
    data
  });
}

export function editGroupJob(data) {
  return request({
    url: "/groupJobDept/updateJobDept",
    method: "post",
    data
  });
}

export function delGroupJob(params) {
  return request({
    url: "/groupJobDept/delJobDept",
    method: "get",
    params
  });
}

export function addGroupRole(data) {
  return request({
    url: "/groupRoleResource/addRoleResource",
    method: "post",
    data
  });
}

export function editGroupRole(data) {
  return request({
    url: "/groupRoleResource/updateRoleResource",
    method: "post",
    data
  });
}

export function delGroupRole(params) {
  return request({
    url: "/groupRoleResource/delRoleResource",
    method: "get",
    params
  });
}
