<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 16:21:39
 * @LastEditTime: 2019-10-23 17:17:18
 * @LastEditors: GuiShun
 -->
<template>
  <div>
    <div class="filter-container" id="dearTotal">
      <el-row>
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="paramsData" class="demo-form-inline">
            <el-form-item label="起始时间：">
              <el-date-picker
                v-model="paramsData.start_time"
                type="date"
                value-format="timestamp"
                @change="getStartTime"
                placeholder="选择开始日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker
                v-model="paramsData.end_time"
                type="date"
                value-format="timestamp"
                @change="getEndTime"
                placeholder="选择结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="queryDealCaseStatistics()"
              >搜索</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                icon="el-icon-edit"
                @click="handleReset"
              >重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-row>
    </div>
    <el-row :gutter="10" style="margin:0" class="userTableRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple-light" >
          <el-table
            ref="singleTable"
            :data="uploadTotaList"
            highlight-current-row
            border
            @current-change="handleCurrentChange"
            style="width: 100%;text-align: center;"
            height="710"
          >
            <el-table-column type="index" label width="50" align="center"></el-table-column>
            <el-table-column prop="user_full_name" label="处理人" align="center" width></el-table-column>
            <el-table-column prop="case_count" label="处理批次总数" align="center" width></el-table-column>
            <el-table-column prop="distinct_case_count" label="处理案件总数" align="center" width></el-table-column>
            <el-table-column prop="file_count" label="处理文件总数" align="center" width></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row class="pageRow">
      <div class="block">
        <!-- <span class="demonstration">完整功能</span> -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChangePage"
          :current-page="currentPage1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="30"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          v-show="pagerShow"
        ></el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { queryDealCaseStatistics } from "@/api/totalInfor/dealTotal";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import qs from "qs";
export default {
  directives: { waves },
  computed: {
    // ...mapGetters(["allCourtList", "allCaseTypeList"])
  },
  data() {
    return {
      paramsData: {
        current_page: 1,
        page_size: 30,
         start_time: new Date().setMonth(0, 1),
        end_time: new Date().setMonth(new Date().getMonth()),
        pages: 1
      },
      uploadTotaList: [],
      total: 0,
      currentPage1: 1,
      downloadLoading: false,
      // listLoading: true,
      pagerShow: false
    };
  },
  created() {},
  mounted() {
    // this.queryUploadStatisticsByTime(this.paramsData);
      this.getTimeDay();
     this.queryDealCaseStatistics() 
    // this.$message({
    //   type: "warning",
    //   message: "请选择起始时间"
    // });
  },
  watch: {},
  methods: {
    getStartTime() {
      if (this.paramsData.end_time < this.paramsData.start_time) {
        this.$message({
          showClose: true,
          message: "起始时间不能大于结束时间",
          type: "warning"
        });
      }
    },
    getEndTime() {
      if (this.paramsData.end_time < this.paramsData.start_time) {
        this.$message({
          showClose: true,
          message: "结束时间不能小于起始时间",
          type: "warning"
        });
      }
    },
    getTimeDay() {
      var timestamp = parseInt(new Date().getTime());
      this.paramsData.end_time = timestamp;
      this.paramsData.start_time = timestamp - 24 * 60 * 60 * 1000*365;
      // this.paramsData.TimeFrom=new Date();
      // this.paramsData.TimeTo=new Date();
    },
    queryDealCaseStatistics(params) {
      queryDealCaseStatistics(this.paramsData)
        .then(response => {
          this.uploadTotaList = response.data;
          this.total = response.total;
          if (this.total > 0) {
            this.pagerShow = true;
          } else {
            this.$message({
              type: "info",
              message: "该时间段内没有处理信息"
            });
          }
        })
        .catch(() => {
          // this.uploadTotaList = [];
          // this.pagerShow = true;
          // this.$message({
          //   type: "warning",
          //   message: "请选择起始时间"
          // });
        });
    },
    handleReset() {
      this.paramsData = {
        current_page: 1,
        page_size: 30,
        start_time: "",
        end_time: "",
        pages: 1
      };
    },

    handleCurrentChange(val) {
      this.paramsData.page_size = val;
    },
    //分页
    handleSizeChange(val) {
      this.paramsData.page_size = val;
      this.queryDealCaseStatistics(this.params);
    },
    handleCurrentChangePage(val) {
      this.paramsData.current_page = val;
      this.queryDealCaseStatistics(this.paramsData);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.filter-container {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
  // margin-bottom: 30px;
  .el-row {
    .first-input {
      margin-left: 10px;
    }
    .el-col {
      margin-right: 30px;
    }
  }
}
.pageRow {
  margin-top: 15px;
}
</style>
