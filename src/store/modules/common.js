/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-10-23 11:34:06
 * @LastEditors: GuiShun
 */
// import { login, logout } from "@/api/user";
import {
  getAllCourtList,
  getAllCourtTreeList
} from "@/api/admin/courtList";
import { getRoles } from "@/api/admin/role";
import {
  queryAllCourtList,
  queryAllCaseTypeList,
  queryAllRoleList,
  queryAllSplcList,
  queryAllDirectories
} from "@/api/common";
const state = {
  allCourtList: [],
  allCourtTreeList: [],
  allRoleList: [],

  allCaseTypeList: [],
  allSplcList: [],
  allDirectories: [],
  dealCaseStatusArray: [
    //处理状态
    {
      value: 0,
      text: "上传中"
    },
    {
      value: 1,
      text: "未处理"
    },
    {
      value: 2,
      text: "处理中"
    },
    {
      value: 3,
      text: "处理完成"
    }
  ],
  caseLockArray: [
    //锁定状态
    {
      value: 0,
      text: "未锁定"
    },
    {
      value: 1,
      text: "已锁定"
    }
  ],
  pushCaseStatusList: [
    {
      value: 0,
      text: "未推送"
    },
    {
      value: 1,
      text: "已第一次推送成功"
    },
    {
      value: 2,
      text: "第一次推送失败"
    },
    {
      value: 3,
      text: "分类完成推送成功"
    },
    {
      value: 4,
      text: "分类完成推送失败"
    }
  ],
  invalidFlagList: [
    {
      value: 0,
      text: "正常"
    },
    {
      value: 1,
      text: "失效"
    }
  ],
  outShow: false,
  curMenuList: []
};

const mutations = {
  SET_ALLCOURTLIST: (state, allCourtList) => {
    state.allCourtList = allCourtList;
  },
  SET_ALLCOURTREELIST: (state, allCourtTreeList) => {
    state.allCourtTreeList = allCourtTreeList;
  },
  SET_ALLROLELIST: (state, allRoleList) => {
    state.allRoleList = allRoleList;
  },

  SET_ALLCASETYPELIST: (state, allCaseTypeList) => {
    state.allCaseTypeList = allCaseTypeList;
  },
  SET_ALLSPLCLIST: (state, allSplcList) => {
    state.allSplcList = allSplcList;
  },
  SET_ALLDIRECTORIES: (state, allDirectories) => {
    state.allDirectories = allDirectories;
  },
  SET_MENULIST: (state, menuList) => {
    sessionStorage.setItem("curMenuList", JSON.stringify(menuList)); //添加到sessionStorage
    state.menuList = menuList;
  }
};

const actions = {
  getAllCourtList({ commit }) {
    return new Promise((resolve, reject) => {
      queryAllCourtList()
        .then(response => {
          const { data } = response;
          commit("SET_ALLCOURTLIST", data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getAllCourtTreeList({ commit }) {
    return new Promise((resolve, reject) => {
      getAllCourtTreeList()
        .then(response => {
          const { data } = response;
          commit("SET_ALLCOURTREELIST", data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getRoles({ commit }) {
    return new Promise((resolve, reject) => {
      getRoles()
        .then(response => {
          if (response !== undefined) {
            const { data } = response;
            commit("SET_ALLROLELIST", data);
            resolve()
          } else {
            const data = [];
            commit("SET_ALLROLELIST", data);
            resolve()
          }
          ;
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  queryAllCaseTypeList({ commit }) {
    return new Promise((resolve, reject) => {
      queryAllCaseTypeList()
        .then(response => {
          const { data } = response;
          commit("SET_ALLCASETYPELIST", data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  queryAllRoleList({ commit }) {
    return new Promise((resolve, reject) => {
      queryAllRoleList()
        .then(response => {
          const { data } = response;
          commit("SET_ALLROLELIST", data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  queryAllSplcList({ commit }, params) {
    return new Promise((resolve, reject) => {
      queryAllSplcList(params)
        .then(response => {
          const { data } = response;
          commit("SET_ALLSPLCLIST", data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  queryAllDirectories({ commit }, params) {
    return new Promise((resolve, reject) => {
      queryAllDirectories(params)
        .then(response => {
          const { data } = response;
          commit("SET_ALLDIRECTORIES", data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
