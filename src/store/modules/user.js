/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-11-01 10:23:28
 * @LastEditors: GuiShun
 */
import { login, getInfo, logout, editPassWord } from "@/api/user";
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from "@/utils/auth";
import { resetRouter } from "@/router";
import router from "../../router";
let getCurUserInfo = (userInfo) => {
  if (getUserInfo() === undefined) {
    return getUserInfo()
  } else {
    return JSON.parse(getUserInfo())
  }
}
const state = {
  token: getToken(),
  userId: JSON.parse(sessionStorage.getItem("userId")),
  avatar: "",
  // userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
  // userInfo: JSON.parse(localStorage.getItem("userInfo")),
  userInfo: getCurUserInfo() ,
  menus: JSON.parse(sessionStorage.getItem("menus")),
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERId: (state, userId) => {
    sessionStorage.setItem("userId", JSON.stringify(userId)); //添加到sessionStorage
    state.userId = userId;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USERINFO: (state, userInfo) => {
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo)); //添加到sessionStorage
    // localStorage.setItem("userInfo", JSON.stringify(userInfo)); //添加到sessionStorage 
    state.userInfo = userInfo;
  },
  SET_MENU: (state, menus) => {
    sessionStorage.setItem("menus", JSON.stringify(menus)); //添加到sessionStorage
    state.menus = menus;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ user_name: username.trim(), user_password: password })
        .then(response => {
          const { data } = response;
          commit("SET_USERINFO", data);
          commit("SET_USERId", data.currentUser.user_id);
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          setUserInfo(data);
          getInfo({ userId: data.currentUser.user_id, funcType: 1 }).then(
            response => {
              const { data: menu } = response;
              commit("SET_MENU", menu);
            }
          ).catch(err=>{
            console.log(err)
          });
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // // get user info
  getInfo({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      getInfo(params)
        .then(response => {
          const { data } = response;
          commit("SET_MENU", data);
          if (!data) {
            reject("请重新登录");
          }
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 修改密码
  editPassWord({ commit }, userInfo) {
    // commit("SET_PASSWORD", user_password);
    return new Promise((resolve, reject) => {
      editPassWord(userInfo)
        .then(response => {
          const data = response;
          if (data.code != 0) {
            reject("密码修改失败");
          }
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_USERId", "");
          sessionStorage.removeItem("userInfo"); //移除sessionStorage
          sessionStorage.removeItem("userId"); //移除sessionStorage
          removeToken();
          removeUserInfo();
          resetRouter();
          // localStorage.clear();
          resolve();

          commit("SET_USERINFO", {
            currentUser: {
              user_full_name: ""
            }
          });
          window.location.reload();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      removeToken();
      removeUserInfo();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
