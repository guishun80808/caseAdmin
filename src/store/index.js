/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 11:31:12
 * @LastEditTime: 2019-09-20 15:59:06
 * @LastEditors: Please set LastEditors
 */
import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
// import createAlong from "vuex-along";

Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context("./modules", true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

const store = new Vuex.Store({
  modules,
  getters,
  // plugins: [
  //   createAlong({
  //     name: "vuex-along", // 设置保存的集合名字，避免同站点下的多项目数据冲突
  //     local: {
  //       list: ["user"],
  //       isFilter: false // 过滤模块 ma 数据， 将其他的存入 localStorage
  //     },
  //     session: {
  //       list: ["user"], // 保存 count 和模块 ma 中的 a1 到 sessionStorage
  //       justSession:true
  //     },
  //     interface:{
  //       list:["user"]
  //     },
      
  //   })
  // ]
});

export default store;
