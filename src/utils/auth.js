/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-10-23 10:34:34
 * @LastEditors: GuiShun
 */
import Cookies from 'js-cookie'

const TokenKey = 'my_token'
const UserInfoKey = 'my_userInfo'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token,"0")
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getUserInfo() {
  return Cookies.get(UserInfoKey)
}

export function setUserInfo(UserInfo) {
  //浏览器会话结束时过期
  return Cookies.set(UserInfoKey, JSON.stringify(UserInfo),"0")
}

export function removeUserInfo() {
  return Cookies.remove(UserInfoKey)
}


