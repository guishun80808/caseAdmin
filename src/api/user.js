/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-10-22 15:45:42
 * @LastEditors: GuiShun
 */
import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data
  });
}

export function getInfo(params) {
  return request({
    url: "/user/queryFuncInfoByUserId",
    method: "get",
    params
  });
}

export function logout() {
  return request({
    url: "/user/logout",
    method: "post"
  });
}

export function getBtns(params) {
  return request({
    url: "/user/queryBtnByUserId",
    method: "get",
    params
  });
}

export function editPassWord(data) {
  return request({
    url: '/user/alterPassword',
    method: 'post',
    data
  })
}
