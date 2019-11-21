<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-09-05 09:52:25
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="childcase-page">
    <div class="filter-container">
      <el-row style="margin-bottom:15px">
        <!-- <el-col :span="3">
          <el-input placeholder="请输入法院编号" v-model="paramsData.courtId" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入庭室编号" v-model="paramsData.courtRoomId" clearable></el-input>
        </el-col>-->
        <el-col :span="3">
          <el-input placeholder="请输入承办人编号" v-model="paramsData.cbrId" clearable></el-input>
        </el-col>
        <el-col :span="5" class="btn-box">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查看</el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            @click="handleReset"
          >重置</el-button>
        </el-col>
      </el-row>
      <iframe :src="iframeSrc" frameborder="0" width="100%" height="750"></iframe>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { parseTime } from "@/utils";
import { queryCasesList } from "@/api/caseManage/childCase";
import { gotoDossierChange } from "@/api/common";
import waves from "@/directive/waves"; // waves directive
import qs from "qs";
export default {
  directives: { waves },
  data() {
    return {
      paramsData: {
        courtId: "", //法院id
        courtRoomId: "", //庭室信息
        cbrId: "" //承办人信息
      },
      iframeSrc: "model/case_cbr/page.html"
    };
  },
  methods: {
    handleSearch() {
      if (this.paramsData.cbrId != "") {
        this.iframeSrc = "model/case_cbr/page.html?cbrId=" + this.paramsData.cbrId
        // window.open("model/case_cbr/page.html?cbrId=" + this.paramsData.cbrId);
      } else if (this.paramsData.cbrId == "") {
        this.$message({
          message: "请输入承办人编号",
          type: "warning",
          duration: 5 * 1000
        });
      }
    },
    handleReset() {
      this.paramsData = {
        courtId: "", //法院id
        courtRoomId: "", //庭室信息
        cbrId: "" //承办人信息
      };
    }
  }
};
</script>

<style scoped lang="scss">
.filter-container {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
  margin-bottom: 30px;
  .el-row {
    .first-input {
      margin-left: 10px;
    }
    .el-col {
      margin-right: 30px;
    }
  }
}
</style>
