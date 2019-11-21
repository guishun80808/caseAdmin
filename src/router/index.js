/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 11:31:12
 * @LastEditTime: 2019-10-24 09:29:28
 * @LastEditors: GuiShun
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/notfind",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/welcome",
    name: "SystemManage",
    hidden: true,
    meta: { title: "", icon: "dashboard" },
    children: [
      {
        path: "/welcome",
        hidden: true,
        name: "Welcome",
        component: () => import("@/views/welcome"),
        meta: { title: "首页", affix: true }
      },
    ]
  },
  {
    path: "/adminstration",
    component: Layout,
    redirect: "/adminstration/users",
    name: "系统管理",
    meta: {
      title: "系统管理",
      icon: "example",
      icon: "dashboard"
    },
    children: [
      {
        path: "/adminstration/users",
        name: "Users",
        component: () => import("@/views/admin/users/index"),
        meta: { title: "用户管理"},
        children: [
          {
            path: "/adminstration/userJob",
            name: "UserJob",
            hidden: true,
            component: () => import("@/views/admin/users/userjobs"),
            meta: { title: "用户职务列表", activeMenu: "/adminstration/users" }
          }
        ]
      },
      {
        path: "/adminstration/roles",
        name: "Roles",
        component: () => import("@/views/admin/roles/index"),
        meta: { title: "角色管理" },
        children: [
          {
            path: "/adminstration/rolesEdit",
            name: "RolesEdit",
            hidden: true,
            component: () => import("@/views/admin/roles/rolesEdit"),
            meta: { title: "角色功能编辑", activeMenu: "/adminstration/roles" }
          }
        ]
      },
      {
        path: "/adminstration/courtManage",
        name: "CourtManage",
        component: () => import("@/views/admin/courtManage/index"),
        meta: { title: "法院管理" }
      },
      {
        path: "/adminstration/courtRoomManage",
        name: "CourtRoomManage",
        component: () => import("@/views/admin/courtRoomManage/index"),
        meta: { title: "庭室管理" }
      },
      {
        path: "/adminstration/duties",
        name: "Duties",
        component: () => import("@/views/admin/duties/index"),
        meta: { title: "职务管理" }
      },
      {
        path: "/adminstration/group",
        name: "Group",
        component: () => import("@/views/admin/group/index"),
        meta: { title: "权限组管理" },
        children: [
          {
            path: "/adminstration/groupJob",
            name: "GroupJob",
            hidden: true,
            component: () => import("@/views/admin/group/jobs"),
            meta: {
              title: "权限组部门职务列表",
              activeMenu: "/adminstration/group"
            }
          },
          {
            path: "/adminstration/groupRole",
            name: "GroupRole",
            hidden: true,
            component: () => import("@/views/admin/group/roles"),
            meta: {
              title: "权限组角色资源列表",
              activeMenu: "/adminstration/group"
            }
          }
        ]
      },
      {
        path: "/adminstration/func",
        name: "Func",
        component: () => import("@/views/admin/func/index"),
        meta: { title: "功能管理" }
      },
      {
        path: "/adminstration/resource",
        name: "Resource",
        component: () => import("@/views/admin/resource/index"),
        meta: { title: "资源管理" },
        children: [
          {
            path: "/adminstration/source",
            name: "Source",
            hidden: true,
            component: () => import("@/views/admin/resource/source"),
            meta: {
              title: "资源相关部门详情",
              activeMenu: "/adminstration/resource"
            }
          }
        ]
      },
      {
        path: "/admin/caseTypeManage",
        name: "CaseTypeManage",
        component: () => import("@/views/admin/caseTypeManage/index"),
        meta: { title: "案件类型管理" }
      },
      {
        path: "/admin/caseTypeDetail",
        name: "CaseTypeDetail",
        component: () => import("@/views/admin/caseTypeDetail"),
        hidden: true,
        meta: { title: "案件类型详情" }
      },
      {
        path: "/admin/caseTypeAssoc",
        name: "CaseTypeAssoc",
        component: () => import("@/views/admin/caseTypeAssoc"),
        hidden: true,
        meta: { title: "案件类型关联管理" }
      },
      {
        path: "/admin/caseTypeAutoClass",
        name: "CaseTypeAutoClass",
        component: () => import("@/views/admin/caseTypeAutoClass"),
        hidden: true,
        meta: { title: "案件自动分类管理" }
      },
      {
        path: "/noperm",
        component: () => import("@/views/noperm"),
        hidden: true,
        meta: {
          title: "暂无访问权限",
        }
      }
    ]
  },
  {
    path: "/caseManage",
    component: Layout,
    redirect: "noRedirect",
    name: "CaseManage",
    meta: { title: "案件管理", icon: "example" },
    children: [
      {
        path: "/caseManage/caseDetailManage",
        component: () => import("@/views/caseManage/caseDetailManage"),
        name: "CaseDetailManage",
        meta: { title: "案件详情管理" },
        redirect: "/caseManage/caseDetailManage/caseDetailList",
        children: [
          {
            path: "/caseManage/caseDetailManage/caseDetailList",
            component: () =>
              import("@/views/caseManage/caseDetailManage/caseDetailList"),
            name: "CaseDetailList",
            hidden: true,
            meta: {
              title: "案件详情管理",
              activeMenu: "/caseManage/caseDetailManage"
            }
          },
          {
            path: "/caseManage/caseDetailManage/caseDetail",
            component: () =>
              import("@/views/caseManage/caseDetailManage/caseDetail"),
            name: "CaseDetail",
            hidden: true,
            meta: {
              title: "查看详情",
              activeMenu: "/caseManage/caseDetailManage"
            }
          }
        ]
      },
      {
        path: "/caseManage/childCase",
        name: "ChildCase",
        component: () => import("@/views/caseManage/childCase"),
        meta: { title: "子案件管理" }
      },
      {
        path: "/caseManage/childCasePush",
        name: "ChildCasePush",
        component: () => import("@/views/caseManage/childCasePush"),
        meta: { title: "子案件推送管理" }
      },
      {
        path: "/caseManage/childCasePushLogCom",
        name: "ChildCasePushLogCom",
        component: () => import("@/views/caseManage/childCasePushLog"),
        hidden: true,
        meta: {
          title: "查看日志",
          activeMenu: "/caseManage/childCasePush"
        }
      },
      {
        path: "/caseManage/childCaseBeiJing",
        name: "ChildCaseBeiJing",
        component: () => import("@/views/caseManage/childCaseBeiJing"),
        meta: { title: "北京子案件管理" }
      },
      {
        path: "/caseManage/caseListsHeNan",
        component: () => import("@/views/caseManage/caseListsHeNan"),
        name: "CaseListsHeNan",
        meta: { title: "河南案件列表" },
        redirect: "/caseManage/caseListsHeNan/caseListsHeNanP",
        children: [
          {
            path: "/caseManage/caseListsHeNan/caseListsHeNanP",
            component: () =>
              import("@/views/caseManage/caseListsHeNan/caseListsHeNanP"),
            name: "CaseDetailManagePlist",
            hidden: true,
            meta: {
              title: "河南案件列表",
              activeMenu: "/caseManage/caseListsHeNan"
            }
          },
          {
            path: "/caseManage/caseListsHeNan/caseDetail",
            component: () =>
              import("@/views/caseManage/caseListsHeNan/caseDetail"),
            name: "CaseDetailHnList",
            hidden: true,
            meta: {
              title: "查看详情",
              activeMenu: "/caseManage/caseListsHeNan"
            }
          }
        ]
      },
      {
        path: "/caseManage/caseDetailHeNan",
        component: () => import("@/views/caseManage/caseDetailHeNan"),
        name: "CaseListsHeNanDe",
        meta: { title: "河南案件" },
        redirect: "/caseManage/caseDetailHeNan/caseDetailHeNanP",
        children: [
          {
            path: "/caseManage/caseDetailHeNan/caseDetailHeNanP",
            component: () =>
              import("@/views/caseManage/caseDetailHeNan/caseDetailHeNanP"),
            name: "CaseDetailManageP",
            hidden: true,
            meta: {
              title: "河南案件",
              activeMenu: "/caseManage/caseDetailHeNan"
            }
          },
          {
            path: "/caseManage/caseDetailHeNan/caseDetail",
            component: () =>
              import("@/views/caseManage/caseDetailHeNan/caseDetail"),
            name: "CaseDetailHeNanList",
            hidden: true,
            meta: {
              title: "查看详情",
              activeMenu: "/caseManage/caseDetailHeNan"
            }
          }
        ]
      },
      {
        path: "/caseManage/childCaseHeNan",
        name: "ChildCaseHeNan",
        component: () => import("@/views/caseManage/childCaseHeNan"),
        meta: { title: "河南子案件" }
      },
      {
        path: "/caseManage/caseListsPushHeNan",
        name: "CaseListsPushHeNan",
        redirect: "/caseManage/caseListsPushHeNan/caseListsPushHeNanPage",
        component: () => import("@/views/caseManage/caseListsPushHeNan"),
        meta: { title: "河南推送管理" },
        children: [
          {
            path: "/caseManage/caseListsPushHeNan/caseListsPushHeNanPage",
            component: () =>
              import(
                "@/views/caseManage/caseListsPushHeNan/caseListsPushHeNanPage"
              ),
            name: "CaseListsPushHeNanPage",
            hidden: true,
            meta: {
              title: "河南推送管理",
              activeMenu: "/caseManage/caseListsPushHeNan"
            }
          },
          {
            path: "/caseManage/childCasePushLog",
            name: "ChildCasePushLog",
            component: () => import("@/views/caseManage/childCasePushLog"),
            hidden: true,
            meta: {
              title: "查看日志",
              activeMenu: "/caseManage/caseListsPushHeNan"
            }
          }
        ]
      },
      {
        path: "/caseManage/caseListsPushBeiJing",
        name: "CaseListsPushBeiJing",
        redirect: "/caseManage/caseListsPushBeiJing/caseListsPushBeiJingPage",
        component: () => import("@/views/caseManage/caseListsPushBeiJing"),
        meta: { title: "北京案件推送管理" },
        children: [
          {
            path: "/caseManage/caseListsPushBeiJing/caseListsPushBeiJingPage",
            component: () =>
              import(
                "@/views/caseManage/caseListsPushBeiJing/caseListsPushBeiJingPage"
              ),
            name: "CaseListsPushBeiJingPage",
            hidden: true,
            meta: {
              title: "北京案件推送管理",
              activeMenu: "/caseManage/caseListsPushBeiJing"
            }
          },
          {
            path: "/caseManage/caseListsPushBeiJing/childCasePushLog",
            name: "ChildCasePushLogBj",
            component: () =>
              import(
                "@/views/caseManage/caseListsPushBeiJing/childCasePushLog"
              ),
            hidden: true,
            meta: {
              title: "查看日志",
              activeMenu: "/caseManage/caseListsPushBeiJing"
            }
          }
        ]
      }
    ]
  },

  {
    path: "/systemMain",
    component: Layout,
    redirect: "noRedirect",
    name: "SystemMain",
    meta: { title: "系统维护", icon: "component" },
    children: [
      {
        path: "/systemMain/updateManage",
        name: "UpdateManage",
        component: () => import("@/views/systemMain/updateManage"),
        meta: { title: "系统升级" }
      },
      {
        path: "/systemMain/temporaryList",
        name: "TemporaryList",
        component: () => import("@/views/systemMain/temporaryList"),
        meta: { title: "临时表管理" }
      },
      {
        path: "/systemMain/comProperty",
        name: "ComProperty",
        component: () => import("@/views/systemMain/comProperty"),
        meta: { title: "配置管理" }
      },
      {
        path: "/systemMain/serverManager",
        name: "ServerManager",
        component: () => import("@/views/systemMain/serverManager"),
        meta: { title: "服务器管理" }
      },
      {
        path: "/systemMain/funManager",
        name: "FunManager",
        component: () => import("@/views/systemMain/funManager"),
        meta: { title: "功能开关" }
      },
      {
        path: "/systemMain/clientUpgrade",
        name: "ClientUpgrade",
        component: () => import("@/views/systemMain/clientUpgrade"),
        meta: { title: "客户端升级管理" }
      },
      {
        path: "/systemMain/caseCheckMan",
        name: "CaseCheckMan",
        redirect: "/systemMain/caseCheck",
        component: () => import("@/views/systemMain/caseCheckMan"),
        meta: { title: "合格性验证规则管理" },
        children: [
          {
            path: "/systemMain/caseCheck",
            name: "CaseCheck",
            hidden: true,
            component: () =>
              import("@/views/systemMain/caseCheckMan/caseCheck"),
            meta: {
              title: "合格性验证规则管理",
              activeMenu: "/systemMain/caseCheckMan"
            }
          },
          {
            path: "/systemMain/caseCheckType",
            name: "CaseCheckType",
            hidden: true,
            component: () =>
              import("@/views/systemMain/caseCheckMan/caseCheckType"),
            meta: { title: "验证方式", activeMenu: "/systemMain/caseCheckMan" }
          }
        ]
      }
    ]
  },
  //统计信息
  {
    path: "/totalInfor",
    component: Layout,
    redirect: "noRedirect",
    name: "TotalInfor",
    meta: { title: "统计信息", icon: "chart" },
    children: [
      {
        path: "/totalInfor/uploadTotal",
        name: "UploadTotal",
        component: () => import("@/views/totalInfor/uploadTotal"),
        meta: { title: "上传统计" }
      },
      {
        path: "/totalInfor/dealTotal",
        name: "DealTotal",
        component: () => import("@/views/totalInfor/dealTotal"),
        meta: { title: "处理统计" }
      },
      {
        path: "/totalInfor/ownDealCount",
        name: "OwnDealCount",
        component: () => import("@/views/totalInfor/ownDealCount"),
        meta: { title: "个人处理量" }
      },
      {
        path: "/totalInfor/dailyDealCount",
        name: "DailyDealCount",
        component: () => import("@/views/totalInfor/dailyDealCount"),
        meta: { title: "每日处理量" }
      },
      {
        path: "/totalInfor/courtUseCount",
        name: "CourtUseCount",
        component: () => import("@/views/totalInfor/courtUseCount"),
        meta: { title: "法院使用量" }
      },
      {
        path: "/totalInfor/courtClerkUseCount",
        name: "CourtClerkUseCount",
        component: () => import("@/views/totalInfor/courtClerkUseCount"),
        meta: { title: "书记员使用量" }
      },
      {
        path: "/totalInfor/henanStatisticalCbr",
        name: "HenanStatisticalCbr",
        component: () => import("@/views/totalInfor/henanStatisticalCbr"),
        meta: { title: "承办人扫描量" }
      },
      {
        path: "/totalInfor/henanStatistical",
        name: "HenanStatistical",
        component: () => import("@/views/totalInfor/henanStatistical"),
        meta: { title: "扫描量统计" }
      },
      {
        path: "/totalInfor/henanreview",
        name: "HenanReview",
        component: () => import("@/views/totalInfor/henanreview"),
        meta: { title: "审查监管" }
      }
    ]
  },


  // 404 page must be placed at the end !!!

  { path: "*", redirect: "/notfind", hidden: true }
];
export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/welcome",
    name: "SystemManage",
    hidden: true,
    meta: { title: "", icon: "dashboard" },
    children: [
      {
        path: "/welcome",
        hidden: true,
        name: "Welcome",
        component: () => import("@/views/welcome"),
        meta: { title: "首页", affix: true }
      },
    ]
  },
  {
    path: "/adminstration",
    component: Layout,
    redirect: "/adminstration/users",
    name: "系统管理",
    meta: {
      title: "系统管理",
      icon: "example",
      icon: "dashboard"
    },
    children: [
      {
        path: "/adminstration/users",
        name: "Users",
        component: () => import("@/views/admin/users/index"),
        meta: { title: "用户管理" },
        children: [
          {
            path: "/adminstration/userJob",
            name: "UserJob",
            hidden: true,
            component: () => import("@/views/admin/users/userjobs"),
            meta: { title: "用户职务列表", activeMenu: "/adminstration/users" }
          }
        ]
      },
      {
        path: "/adminstration/roles",
        name: "Roles",
        component: () => import("@/views/admin/roles/index"),
        meta: { title: "角色管理" },
        children: [
          {
            path: "/adminstration/rolesEdit.vue",
            name: "rolesEdit",
            hidden: true,
            component: () => import("@/views/admin/roles/rolesEdit"),
            meta: { title: "角色功能编辑", activeMenu: "/adminstration/roles" }
          }
        ]
      },
      {
        path: "/adminstration/courtManage",
        name: "CourtManage",
        component: () => import("@/views/admin/courtManage/index"),
        meta: { title: "法院管理" }
      },
      {
        path: "/adminstration/courtRoomManage",
        name: "CourtRoomManage",
        component: () => import("@/views/admin/courtRoomManage/index"),
        meta: { title: "庭室管理" }
      },
      {
        path: "/adminstration/duties",
        name: "Duties",
        component: () => import("@/views/admin/duties/index"),
        meta: { title: "职务管理" }
      },
      {
        path: "/adminstration/group",
        name: "Group",
        component: () => import("@/views/admin/group/index"),
        meta: { title: "权限组管理" },
        children: [
          {
            path: "/adminstration/groupJob",
            name: "GroupJob",
            hidden: true,
            component: () => import("@/views/admin/group/jobs"),
            meta: {
              title: "权限组部门职务列表",
              activeMenu: "/adminstration/group"
            }
          },
          {
            path: "/adminstration/groupRole",
            name: "GroupRole",
            hidden: true,
            component: () => import("@/views/admin/group/roles"),
            meta: {
              title: "权限组角色资源列表",
              activeMenu: "/adminstration/group"
            }
          }
        ]
      },
      {
        path: "/adminstration/func",
        name: "Func",
        component: () => import("@/views/admin/func/index"),
        meta: { title: "功能管理" }
      },
      {
        path: "/adminstration/resource",
        name: "Resource",
        component: () => import("@/views/admin/resource/index"),
        meta: { title: "资源管理" },
        children: [
          {
            path: "/adminstration/source",
            name: "Source",
            hidden: true,
            component: () => import("@/views/admin/resource/source"),
            meta: {
              title: "资源相关部门详情",
              activeMenu: "/adminstration/resource"
            }
          }
        ]
      },
      {
        path: "/noperm",
        component: () => import("@/views/noperm"),
        hidden: true,
        meta: {
          title: "暂无访问权限",
        }
      }
    ]
  },
  {
    path: "/caseManage",
    component: Layout,
    redirect: "noRedirect",
    name: "CaseManage",
    meta: { title: "案件管理", icon: "example" },
    children: [
      {
        path: "/caseManage/caseDetailManage",
        component: () => import("@/views/caseManage/caseDetailManage"),
        name: "CaseDetailManage",
        meta: { title: "案件详情管理" },
        redirect: "/caseManage/caseDetailManage/caseDetailList",
        children: [
          {
            path: "/caseManage/caseDetailManage/caseDetailList",
            component: () =>
              import("@/views/caseManage/caseDetailManage/caseDetailList"),
            name: "CaseDetailList",
            hidden: true,
            meta: {
              title: "案件详情管理",
              activeMenu: "/caseManage/caseDetailManage"
            }
          },
          {
            path: "/caseManage/caseDetailManage/caseDetail",
            component: () =>
              import("@/views/caseManage/caseDetailManage/caseDetail"),
            name: "CaseDetail",
            hidden: true,
            meta: {
              title: "查看详情",
              activeMenu: "/caseManage/caseDetailManage"
            }
          }
        ]
      },
      {
        path: "/caseManage/childCase",
        name: "ChildCase",
        component: () => import("@/views/caseManage/childCase"),
        meta: { title: "子案件管理" }
      },
      {
        path: "/caseManage/childCasePush",
        name: "ChildCasePush",
        component: () => import("@/views/caseManage/childCasePush"),
        meta: { title: "子案件推送管理" }
      },
      {
        path: "/caseManage/childCaseBeiJing",
        name: "ChildCaseBeiJing",
        component: () => import("@/views/caseManage/childCaseBeiJing"),
        meta: { title: "北京子案件管理" }
      },
      {
        path: "/caseManage/caseListsHeNan",
        component: () => import("@/views/caseManage/caseListsHeNan"),
        name: "CaseListsHeNan",
        meta: { title: "河南案件列表" },
        redirect: "/caseManage/caseListsHeNan/caseListsHeNanP",
        children: [
          {
            path: "/caseManage/caseListsHeNan/caseListsHeNanP",
            component: () =>
              import("@/views/caseManage/caseListsHeNan/caseListsHeNanP"),
            name: "CaseDetailManagePlist",
            hidden: true,
            meta: {
              title: "河南案件列表",
              activeMenu: "/caseManage/caseListsHeNan"
            }
          },
          {
            path: "/caseManage/caseListsHeNan/caseDetail",
            component: () =>
              import("@/views/caseManage/caseListsHeNan/caseDetail"),
            name: "CaseDetailHnList",
            hidden: true,
            meta: {
              title: "查看详情",
              activeMenu: "/caseManage/caseListsHeNan"
            }
          }
        ]
      },
      {
        path: "/caseManage/caseDetailHeNan",
        component: () => import("@/views/caseManage/caseDetailHeNan"),
        name: "CaseListsHeNanDe",
        meta: { title: "河南案件" },
        redirect: "/caseManage/caseDetailHeNan/caseDetailHeNanP",
        children: [
          {
            path: "/caseManage/caseDetailHeNan/caseDetailHeNanP",
            component: () =>
              import("@/views/caseManage/caseDetailHeNan/caseDetailHeNanP"),
            name: "CaseDetailManageP",
            hidden: true,
            meta: {
              title: "河南案件",
              activeMenu: "/caseManage/caseDetailHeNan"
            }
          },
          {
            path: "/caseManage/caseDetailHeNan/caseDetail",
            component: () =>
              import("@/views/caseManage/caseDetailHeNan/caseDetail"),
            name: "CaseDetailHeNanList",
            hidden: true,
            meta: {
              title: "查看详情",
              activeMenu: "/caseManage/caseDetailHeNan"
            }
          }
        ]
      },
      {
        path: "/caseManage/childCaseHeNan",
        name: "ChildCaseHeNan",
        component: () => import("@/views/caseManage/childCaseHeNan"),
        meta: { title: "河南子案件" }
      },
      {
        path: "/caseManage/caseListsPushHeNan",
        name: "CaseListsPushHeNan",
        redirect: "/caseManage/caseListsPushHeNan/caseListsPushHeNanPage",
        component: () => import("@/views/caseManage/caseListsPushHeNan"),
        meta: { title: "河南推送管理" },
        children: [
          {
            path: "/caseManage/caseListsPushHeNan/caseListsPushHeNanPage",
            component: () =>
              import(
                "@/views/caseManage/caseListsPushHeNan/caseListsPushHeNanPage"
              ),
            name: "CaseListsPushHeNanPage",
            hidden: true,
            meta: {
              title: "河南推送管理",
              activeMenu: "/caseManage/caseListsPushHeNan"
            }
          },
          {
            path: "/caseManage/childCasePushLog",
            name: "ChildCasePushLog",
            component: () => import("@/views/caseManage/childCasePushLog"),
            hidden: true,
            meta: {
              title: "查看日志",
              activeMenu: "/caseManage/caseListsPushHeNan"
            }
          }
        ]
      },
      {
        path: "/caseManage/caseListsPushBeiJing",
        name: "CaseListsPushBeiJing",
        redirect: "/caseManage/caseListsPushBeiJing/caseListsPushBeiJingPage",
        component: () => import("@/views/caseManage/caseListsPushBeiJing"),
        meta: { title: "北京案件推送管理" },
        children: [
          {
            path: "/caseManage/caseListsPushBeiJing/caseListsPushBeiJingPage",
            component: () =>
              import(
                "@/views/caseManage/caseListsPushBeiJing/caseListsPushBeiJingPage"
              ),
            name: "CaseListsPushBeiJingPage",
            hidden: true,
            meta: {
              title: "北京案件推送管理",
              activeMenu: "/caseManage/caseListsPushBeiJing"
            }
          },
          {
            path: "/caseManage/caseListsPushBeiJing/childCasePushLog",
            name: "ChildCasePushLogBj",
            component: () =>
              import(
                "@/views/caseManage/caseListsPushBeiJing/childCasePushLog"
              ),
            hidden: true,
            meta: {
              title: "查看日志",
              activeMenu: "/caseManage/caseListsPushBeiJing"
            }
          }
        ]
      }
    ]
  },

  {
    path: "/systemMain",
    component: Layout,
    redirect: "noRedirect",
    name: "SystemMain",
    meta: { title: "系统维护", icon: "component" },
    children: [
      {
        path: "/systemMain/updateManage",
        name: "UpdateManage",
        component: () => import("@/views/systemMain/updateManage"),
        meta: { title: "系统升级" }
      },
      {
        path: "/systemMain/temporaryList",
        name: "TemporaryList",
        component: () => import("@/views/systemMain/temporaryList"),
        meta: { title: "临时表管理" }
      },
      {
        path: "/systemMain/comProperty",
        name: "ComProperty",
        component: () => import("@/views/systemMain/comProperty"),
        meta: { title: "配置管理" }
      },
      {
        path: "/systemMain/serverManager",
        name: "ServerManager",
        component: () => import("@/views/systemMain/serverManager"),
        meta: { title: "服务器管理" }
      },
      {
        path: "/systemMain/funManager",
        name: "FunManager",
        component: () => import("@/views/systemMain/funManager"),
        meta: { title: "功能开关" }
      },
      {
        path: "/systemMain/clientUpgrade",
        name: "ClientUpgrade",
        component: () => import("@/views/systemMain/clientUpgrade"),
        meta: { title: "客户端升级管理" }
      },
      {
        path: "/systemMain/caseCheckMan",
        name: "CaseCheckMan",
        redirect: "/systemMain/caseCheck",
        component: () => import("@/views/systemMain/caseCheckMan"),
        meta: { title: "合格性验证规则管理" },
        children: [
          {
            path: "/systemMain/caseCheck",
            name: "CaseCheck",
            hidden: true,
            component: () =>
              import("@/views/systemMain/caseCheckMan/caseCheck"),
            meta: {
              title: "合格性验证规则管理",
              activeMenu: "/systemMain/caseCheckMan"
            }
          },
          {
            path: "/systemMain/caseCheckType",
            name: "CaseCheckType",
            hidden: true,
            component: () =>
              import("@/views/systemMain/caseCheckMan/caseCheckType"),
            meta: { title: "验证方式", activeMenu: "/systemMain/caseCheckMan" }
          }
        ]
      }
    ]
  },
  //统计信息
  {
    path: "/totalInfor",
    component: Layout,
    redirect: "noRedirect",
    name: "TotalInfor",
    meta: { title: "统计信息", icon: "chart" },
    children: [
      {
        path: "/totalInfor/uploadTotal",
        name: "UploadTotal",
        component: () => import("@/views/totalInfor/uploadTotal"),
        meta: { title: "上传统计" }
      },
      {
        path: "/totalInfor/dealTotal",
        name: "DealTotal",
        component: () => import("@/views/totalInfor/dealTotal"),
        meta: { title: "处理统计" }
      },
      {
        path: "/totalInfor/ownDealCount",
        name: "OwnDealCount",
        component: () => import("@/views/totalInfor/ownDealCount"),
        meta: { title: "个人处理量" }
      },
      {
        path: "/totalInfor/dailyDealCount",
        name: "DailyDealCount",
        component: () => import("@/views/totalInfor/dailyDealCount"),
        meta: { title: "每日处理量" }
      },
      {
        path: "/totalInfor/courtUseCount",
        name: "CourtUseCount",
        component: () => import("@/views/totalInfor/courtUseCount"),
        meta: { title: "法院使用量" }
      },
      {
        path: "/totalInfor/courtClerkUseCount",
        name: "CourtClerkUseCount",
        component: () => import("@/views/totalInfor/courtClerkUseCount"),
        meta: { title: "书记员使用量" }
      },
      {
        path: "/totalInfor/henanStatisticalCbr",
        name: "HenanStatisticalCbr",
        component: () => import("@/views/totalInfor/henanStatisticalCbr"),
        meta: { title: "承办人扫描量" }
      },
      {
        path: "/totalInfor/henanStatistical",
        name: "HenanStatistical",
        component: () => import("@/views/totalInfor/henanStatistical"),
        meta: { title: "扫描量统计" }
      },
      {
        path: "/totalInfor/henanreview",
        name: "HenanReview",
        component: () => import("@/views/totalInfor/henanreview"),
        meta: { title: "审查监管" }
      }
    ]
  },
];
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
