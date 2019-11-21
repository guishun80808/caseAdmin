/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-20 11:34:59
 * @LastEditTime: 2019-09-26 11:58:59
 * @LastEditors: Please set LastEditors
 */
import request from "@/utils/request";

export function searchDutyList(params) {
  return request({
    url: "/job/queryAll",
    method: "get",
    params
  });
}

export function addDuty(data) {
  return request({
    url: "/job/add",
    method: "post",
    data
  });
}

export function editDuty(data) {
  return request({
    url: "/job/update",
    method: "post",
    data
  });
}

export function delDuty(params) {
  return request({
    url: "job/delete",
    method: "get",
    params
  });
}
