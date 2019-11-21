/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-11-01 10:25:50
 * @LastEditors: GuiShun
 */
import Router from "vue-router";
import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken, getUserInfo } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import { getInfo } from "@/api/user";
import { constantRoutes, asyncRoutes } from "./router";
// const _import = require('@/router/_import_' + process.env.NODE_ENV)//获取组件的方法
NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/", "notfind"]; // no redirect whitelist
router.$addRoutes = params => {
  router.matcher = new Router({ mode: "history" }).matcher;
  router.addRoutes(params);
};
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  const hasuserInfo = getUserInfo();
  if (hasToken && hasuserInfo && store.getters.userInfo.currentUser.user_id && JSON.parse(sessionStorage.getItem("userId"))) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      // console.log(store.getters.userInfo.currentUser.user_id)
      let myRouters = [];
      let loginPah = [];
      let notFind = {};
      let menus = [];
      menus = store.getters.menus;
      if (menus !== null) {
        store.dispatch("permission/getBtns");
        let pathsList = [];
        menus.forEach(element => {
          pathsList.push(element.menuPath)
          if (element.children && element.children.length > 0) {
            element.children.forEach(chi => {
              pathsList.push(chi.menuPath)
            })
          }
        });
        let log = pathsList.findIndex(function (val) {
          return val == to.fullPath;
        })
        if (log == -1 && to.fullPath != "/notfind" && to.fullPath != "/login" && to.fullPath != "/welcome" && to.fullPath != "/noperm" && to.fullPath != "/") {
          // next({ path: "/notfind" });
          // console.log(log)
          // return 
        }
        // let userId = store.getters.userInfo.currentUser.user_id;
        // const { data } = await getInfo({ userId:userId,funcType: 1 });
        // menus = data;
        let curRouter = router.options.routes;
        curRouter.forEach((e, i) => {
          if (e.path == "/login" || e.path == "/notfind") {
            loginPah.push(e);
            curRouter.splice(i, 1);
          } else if (e.path == "*") {
            notFind = e;
            curRouter.splice(i, 1);
          }
        });
        curRouter.forEach((e, i) => {
          if (e.path == "/login" || e.path == "/notfind") {
            loginPah.push(e);
            curRouter.splice(i, 1);
          } else if (e.path == "*") {
            notFind = e;
            curRouter.splice(i, 1);
          }
        });

        // B
        menus.forEach((menu, i) => {
          asyncRoutes.forEach(route => {
            if (menu.menuPath === route.path) {
              menu.path = route.path;
              menu.meta = route.meta;
              myRouters.push(route);
            }
          })
        })
        // E

        // menus.forEach((menu, i) => {
        //   curRouter.forEach((route, i) => {
        //     if (menu.url == route.path) {
        //       route.meta.title = menu.funcName;
        //       menu.path = route.path;
        //       menu.meta = route.meta;
        //       myRouters.push(route);
        //       myRouters.forEach(element => {
        //         element.child = [];
        //       });
        //       if (menu.children && menu.children.length > 0) {
        //         menu.children.forEach((child, i) => {
        //           route.children.forEach((childroute, i) => {
        //             if (child.url == childroute.path) {
        //               childroute.meta.title = child.funcName;
        //               child.path = childroute.path;
        //               child.meta = childroute.meta;
        //               myRouters.forEach(ele => {
        //                 ele.child.push(childroute);
        //               });
        //             }
        //           });
        //         });
        //       }
        //     }
        //   });
        // });
        myRouters = myRouters.concat(loginPah);

        myRouters.push(notFind);

        myRouters.forEach(element => {
          element.children = element.child;
        });
      }

      // router.$addRoutes(myRouters);
      // router.addRoutes(myRouters);
      next();
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
