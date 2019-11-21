<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-09-02 15:38:57
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="caseCheckMan">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    // if (this.$route.name == "CaseCheck" || this.$route.name == "CaseCheckMan") {
    //   this.$router.push({
    //     name: "CaseCheck"
    //   });
    // }
  }
};
</script>

