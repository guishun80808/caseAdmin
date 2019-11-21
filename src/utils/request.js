/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 15:12:40
 * @LastEditTime: 2019-11-01 10:30:12
 * @LastEditors: GuiShun
 */
import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import router from "@/router";
import { getToken } from "@/utils/auth";
import { debuglog } from "util";
// axios.defaults.headers.common['Authorization'] = doCookie.getCookie("SESSIONID")

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["X-Token"] = getToken();
      config.headers.common["Authorization"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // console.log(res);
    // if the custom code is not 20000, it is judged as an error.
    if (res.code == 0) {
      return res;
    } else if (res.code == 10000) {
      Message({
        message: "用户未登录或登录超时",
        type: "warning",
        duration: 3 * 1000
      });
      store.dispatch("user/logout");
    } else if (res.code == 2003) {
      Message({
        message: "用户名或密码错误",
        type: "warning",
        duration: 3 * 1000
      });
    } else if (res.code == 1008) {
      Message({
        message: "该资源下没有相关部门",
        type: "warning",
        duration: 3 * 1000
      });
    } else if (res.code == 8402) {
      Message({
        message: "选择法院时必须选择庭室",
        type: "warning",
        duration: 3 * 1000
      });
    }
    else if (res.code == 2302) {
      Message({
        message: "当前法院无庭室",
        type: "warning",
        duration: 3 * 1000
      });
    } else if (res.code == 10007) {
      Message({
        message: "原密码输入错误",
        type: "warning",
        duration: 3 * 1000
      });
    }
    else if (res.code == 5024) {
      Message({
        message: "参数传递错误",
        type: "warning",
        duration: 3 * 1000
      });
    }
    // begain 
    else if (res.code == 10001) {
      Message({
        message: "没有访问权限",
        type: "warning",
        duration: 3 * 1000
      });
      router.push({ path: "/noperm" });
    } else if (res.code == 1) {
      Message({
        message: "操作失败",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2701) {
      Message({
        message: "没有相关案件信息!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2703) {
      Message({
        message: "没有相关子案件信息!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 1003) {
      // Message({
      //   message: "没有相关功能信息!",
      //   type: "warning",
      //   duration: 5 * 1000
      // });
    } else if (res.code == 2705) {
      Message({
        message: "案件Id不能为空!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2013) {
      Message({
        message: "执行升级命令失败",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2014) {
      Message({
        message: "系统升级上传文件失败",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2104) {
      Message({
        message: "配置名称重复，当前配置名称已被占用！",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2105) {
      Message({
        message: "该配置找不到",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2409) {
      Message({
        message: "当前用户没有权限！",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2107) {
      Message({
        message: "当前配置不能修改！",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2101) {
      Message({
        message: "配置名称为空",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2106) {
      Message({
        message: "配置ID名称为空",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2611) {
      Message({
        message: "该目录名已存在!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2410) {
      Message({
        message: "该目承办人ID已存在!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2309) {
      Message({
        message: "服务器名称重复!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2312) {
      Message({
        message: "仅支持 zip/rar 等类型文件上传!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2313) {
      Message({
        message: "zip文件名不允许有中文字符!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2012) {
      Message({
        message: "参数不能为空!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2155) {
      Message({
        message: "已存在相同的参数!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2100) {
      Message({
        message: "用户未登录或登录失效!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2201) {
      Message({
        message: "案件被锁定，只有处理人可以进行该操作!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2202) {
      Message({
        message: "当前并非未处理或者处理中状态，无法进行人工分类!",
        type: "warning",
        duration: 5 * 1000
      });
    } else if (res.code == 2203) {
      Message({
        message: "案件不存在!",
        type: "warning",
        duration: 5 * 1000
      });
    }
    // else if (res.code == 5001) {
    //   Message({
    //     message: "没有相关统计!",
    //     type: "warning",
    //     duration: 5 * 1000
    //   });
    // } 
    else if (res.code == 1002) {
      Message({
        message: "时间不能为空!",
        type: "warning",
        duration: 5 * 1000
      });
    }
    else if (res.code == 500) {
      Message({
        message: "运行异常!",
        type: "error",
        duration: 5 * 1000
      });
    }
    else if (res.code > 4999 && res.code < 6000) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 3 * 1000
      });
    }
    // end   
    else {
      Message({
        message: res.message || "Error",
        type: "warning",
        duration: 3 * 1000
      });
      // // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('您已经登出，您可以取消停留在这个页面，或再次登录，确认登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      // return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 3 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
