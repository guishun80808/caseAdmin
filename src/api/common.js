/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-07 09:50:48
 * @LastEditTime: 2019-10-09 16:31:42
 * @LastEditors: Please set LastEditors
 */
import request from "@/utils/request";

export function queryAllCourtList() {
  return request({
    url: "/courtInfo/queryAllCourt",
    method: "get"
  });
}

export function queryAllCaseTypeList() {
  return request({
    url: "/runpu/queryAllCaseType",
    method: "get"
  });
}

export function queryAllRoleList() {
  return request({
    url: "/role/queryAllRole",
    method: "post"
  });
}

export function queryAllSplcList(params) {
  return request({
    url: "/runpu/querySplcByCaseType",
    method: "get",
    params
  });
}

export function queryAllDirectories(params) {
  return request({
    url: "/directory/queryAllDirectories",
    method: "get",
    params
  });
}

export function queryMenuInfo(params) {
  return request({
    url: "/menuInfo/queryMenuInfo",
    method: "get",
    params
  });
}

export function queryMenuByRole(params) {
  return request({
    url: "/roleMenu/queryMenuByRole",
    method: "get",
    params
  });
}

export function bjgotoCaseDossier(params) {
  return request({
    url: "/bjsubcaseInfo/gotoCaseDossier",
    method: "get",
    params
  });
}

export function gotoDossierChange(params) {
  return request({
    url: "/subCaseInfo/gotoCaseDossier",
    method: "get",
    params
  });
}
