/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 11:32:52
 * @LastEditTime: 2019-10-24 16:48:44
 * @LastEditors: GuiShun
 */
import { asyncRoutes, constantRoutes } from "@/router";
import { getBtns } from "@/api/user";
import store from "@/store";
function hasAuthorization(authorization, route) {
  if (route.meta && route.meta.auth) {
    return authorization.some(auth => {
      return route.meta.auth.some(routeAuth => {
        return routeAuth === auth;
      });
    });
  } else {
    return true;
  }
}

export function filterAsyncRoutes(routes, authorization) {
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasAuthorization(authorization, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authorization);
      }
      res.push(tmp);
    }
  });
  return res;
}

const state = {
  routes: [],
  addRoutes: [],
  authorization: JSON.parse(sessionStorage.getItem("authorization"))||[]
};

const getters = {
  hasAuthorization: state => authorization => {
    return state.authorization.some(auth => {
      return auth === authorization;
    });
  }
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  SET_AUTHHORIZATION: (state, authorization) => {
    sessionStorage.setItem("authorization", JSON.stringify(authorization)); //添加到sessionStorage
    state.authorization = authorization;
  },
};

const actions = {
  generateRoutes({ commit }, authList) {
    //根据用户角色生成路由并返回
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, authList);
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    });
  },
  getBtns({ commit }, ) {
    // let userId = { userId: JSON.parse(sessionStorage.getItem("userId")) }
    let userId = { userId: store.getters.userInfo.currentUser.user_id }
    getBtns(userId).then(response => {
      const { data } = response;
      commit("SET_AUTHHORIZATION", data);
    })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
