/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 11:31:12
 * @LastEditTime: 2019-10-17 15:52:43
 * @LastEditors:GuiShun
 */
import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

// 引入字体图标  涉及table中的展开和折叠图标
import "./iconfont/iconfont.css";

import "@/icons"; // icon
// import "@/permission1"; // permission control
import "@/permission"; // permission control
import * as filters from "./filters"; // global filters

import lodash from "lodash";
Vue.prototype.lodash = lodash;

import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

Vue.use(VXETable)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from "../mock";
// if (process.env.NODE_ENV === "production") {
//   mockXHR();
// }

const auth = value => {
  let auth;
  if (typeof value === "string") {
    auth = store.getters["permission/hasAuthorization"](value);
  } else {
    auth = value.some(item => {
      return store.getters["permission/hasAuthorization"](item);
    });
  }
  return auth;
};

// 注册 v-auth 指令
Vue.directive("auth", {
  inserted: (el, binding) => {
    if (!auth(binding.value)) {
      el.remove();
    }
  }
});

// 挂载 this.$auth() 方法
Vue.prototype.$auth = auth;

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
