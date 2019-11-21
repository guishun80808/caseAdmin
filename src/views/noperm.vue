<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-10-08 17:33:08
 * @LastEditTime: 2019-10-16 10:14:48
 * @LastEditors: GuiShun
 -->
<template>
  <div id="noprem">
    <div class="per-bg">
      <span>暂无访问权限</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "noprem"
};
</script>
<style lang="scss" scoped>
.per-bg {
  // background: url("../assets/perm.jpg");
  width: 100%;
  height: 850px;
  line-height: 850px;
  text-align: center;
  color: rgb(127, 190, 233);
  font-size: 26px;
}
</style>
