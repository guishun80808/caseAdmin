/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-06 10:42:57
 * @LastEditTime: 2019-08-13 15:53:19
 * @LastEditors: Please set LastEditors
 */
import request from "@/utils/request";

export function queryCasesList(params) {
  return request({
    url: "/bjcaseInfo/queryNoPushCaseInfo",
    method: "get",
    params
  });
}

export function repush(params) {
  return request({
    url: "/bjcaseInfo/pushCaseToYongyou",
    method: "get",
    params
  });
}
