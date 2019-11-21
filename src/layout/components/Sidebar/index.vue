<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-10-24 17:48:28
 * @LastEditors: GuiShun
 -->
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in menus"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar", "userInfo", "menus"]),
    // routes() {
    //   return this.$router.options.routes;
    // },
    routes: {
      set(newRouter) {
        // console.log(newRouter);
        this.$router.options.routes = newRouter;
      },
      get() {
        return this.$router.options.routes;
      }
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {
    // console.log(this.menus)
    let params = {
      userId: this.userInfo.currentUser.user_id,
      funcType: 1
    };
    let self =this;
    self.$store
      .dispatch("user/getInfo", params)
      .then(function(res) {
        // console.log(self.menus);
      })
      .catch(function(err) {
        console.log(err);
      });
  },
  watch: {
    menus: {
      handler(newRoutes, oldRoutes) {
        // console.log(newRoutes)
        // sessionStorage.setItem("menus", JSON.stringify(newRoutes)); //添加到sessionStorage
        let myRouters = [];
        newRoutes.forEach((menu, i) => {
          this.routes.forEach((route, i) => {
            if (menu.menuPath == route.path) {
              route.meta.title = menu.funcName;
              menu.path = route.path;
              menu.meta = route.meta;
              myRouters.push(route);
              myRouters.forEach(element => {
                element.child = [];
              });
              if (menu.children && menu.children.length > 0) {
                menu.children.forEach((child, i) => {
                  route.children.forEach((childroute, i) => {
                    if (child.menuPath == childroute.path) {
                      childroute.meta.title = child.funcName;
                      child.path = childroute.path;
                      child.meta = childroute.meta;
                      myRouters.forEach(ele => {
                        ele.child.push(childroute);
                      });
                    }
                  });
                });
              }
            }
          });
        });
        myRouters.forEach(element => {
          // element.children = element.child;
        });
        this.routes = myRouters;
        this.$nextTick(function() {
          // DOM 现在更新了
          // `this` 绑定到当前实例
          // for (let index = 0; index < myRouters.length; index++) {
          //   const element = myRouters[index];
          //   this.routes[index] = element;
          // }
          // for (let i = 0; i < this.routes.length; i++) {
          //   this.routes[i] = Object.assign({}, this.routes[i], {
          //     editState: false
          //   });
          // }
        });
        // console.log(myRouters);
        // console.log(this.routes);
      },
      deep: true
    }
  }
};
</script>
