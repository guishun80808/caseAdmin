import request from '@/utils/request'

export function getAllCaseTypeList() {
  return request({
    url: '/cover/querySplc',
    method: 'get',
  })
}
export function getAllCaseTypeListBj() {
  return request({
    url: '/splc/queryAll',
    method: 'get',
  })
}
export function queryAllDirectories(params) {
  return request({
    url: '/directory/queryAllDirectories',
    method: 'get',
    params
  })
}
export function addRootDir(data) {
  return request({
    url: '/directory/addDirectory',
    method: 'post',
    data
  })
}
export function delRootDir(params) {
  return request({
    url: '/directory/delDirectory',
    method: 'get',
    params
  })
}
export function updateDir(data) {
  return request({
    url: '/directory/updateDirectory',
    method: 'post',
    data
  })
}
export function AssocManage(params) {
  return request({
    url: '/recongise/queryByDirModelId',
    method: 'get',
    params
  })
}
export function DelByKeyId(params) {
  return request({
    url: '/recongise/delKey',
    method: 'get',
    params
  })
}
export function addKey(data) {
  return request({
    url: '/recongise/addKey',
    method: 'post',
    data
  })
}
export function getAutoClassInfor(params) {
  return request({
    url: '/hbRecong/newQueryByDirModel',
    method: 'get',
    params
  })
}
export function newAddRecong(data) {
  return request({
    url: '/hbRecong/newAddRecong',
    method: 'post',
    data
  })
}
export function newDeleteRecong(params) {
  return request({
    url: '/hbRecong/newDeleteRecong',
    method: 'get',
    params
  })
}
export function updateRecong(data) {
  return request({
    url: '/hbRecong/updateRecong',
    method: 'post',
    data
  })
}
export function updateDirIndex(data) {
  return request({
    url: '/directory/updateDirIndex',
    method: 'post',
    data
  })
}