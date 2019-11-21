/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-10-22 15:07:52
 * @LastEditors: GuiShun
 */
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['admin', 'editor','root']
  // return valid_map.indexOf(str.trim()) >= 0
  if (str) {
    return str.length > 2;
  }
}

export function validUserNum(str) {
  const result = /^\d+$/.test(str)
  return result
}
