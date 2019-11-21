<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { removeUserInfo } from "@/utils/auth";
export default {
  name: "App",
  mounted() {
    //此方法刷新页面时也会执行
    // window.addEventListener("beforeunload", () => {
    //   removeUserInfo();
    // });
  }
};
</script>
