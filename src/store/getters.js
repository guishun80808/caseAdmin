/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-10-14 15:48:52
 * @LastEditors: GuiShun
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userId: state => state.user.userId,
  menus: state => state.user.menus,
  userInfo: state => state.user.userInfo,
  allCourtList: state => state.common.allCourtList, //法院列表
  allCourtTreeList: state => state.common.allCourtTreeList, //法院树形列表
  allRoleList: state => state.common.allRoleList, //角色列表

  allCaseTypeList: state => state.common.allCaseTypeList, //案件类型列表
  dealCaseStatusArray: state => state.common.dealCaseStatusArray, //处理状态
  caseLockArray: state => state.common.caseLockArray, //锁定状态
  pushCaseStatusList: state => state.common.pushCaseStatusList, //推送状态
  invalidFlagList: state => state.common.invalidFlagList, //失效状态
  allSplcList: state => state.common.allSplcList, //审判程序
  allDirectories: state => state.common.allDirectories, //一级目录列表
  curMenuList: state => state.common.curMenuList //一级目录列表
};
export default getters;
