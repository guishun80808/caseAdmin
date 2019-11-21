/*
 * @Description: In User Settings Edit
 * @Author:GuiShun
 * @Date: 2019-08-15 17:26:01
 * @LastEditTime: 2019-08-16 10:53:08
 * @LastEditors: Please set LastEditors
 */

import request from "@/utils/request";

export function queryAllFile(params) {
  return request({
    url: "/clientServer/queryAllFile",
    method: "get",
    params
  });
}

export function uploadFile(data) {
  return request({
    url: "/clientServer/uploadFile",
    method: "post",
    headers: {'content-type': undefined},
    data
  });
}

export function downloadClient(params) {
  return request({
    url: "/clientServer/downloadClient",
    method: "get",
    params
  });
}
