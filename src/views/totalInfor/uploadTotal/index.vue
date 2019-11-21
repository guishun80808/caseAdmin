<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="3">
          <el-date-picker
            v-model="paramsData.start_time"
            type="date"
            value-format="timestamp"
            @change="getStartTime"
            placeholder="选择开始日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-date-picker
            v-model="paramsData.end_time"
            type="date"
            value-format="timestamp"
            @change="getEndTime"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="5" class="btn-box">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="queryUploadStatisticsByTime()"
          >搜索</el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            @click="handleReset"
          >重置</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="10" style="margin:0" class="userTableRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple-light">
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
            <el-table-column prop="user_full_name" label="上传人" align="center" width></el-table-column>
            <el-table-column prop="case_count" label="上传批次总数" align="center" width></el-table-column>
            <el-table-column prop="distinct_case_count" label="上传案件总数" align="center" width></el-table-column>
            <el-table-column prop="file_count" label="上传文件总数" align="center" width></el-table-column>
            <el-table-column prop="court_name" label="上传人法院" align="center" width></el-table-column>
            <el-table-column prop="court_room_name" label="上传人庭室" align="center" width></el-table-column>
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
import { queryUploadStatisticsByTime } from "@/api/totalInfor/uploadTotal";
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
    this.$message({
      type: "warning",
      message: "请选择起始时间"
    });
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
    queryUploadStatisticsByTime(params) {
      queryUploadStatisticsByTime(this.paramsData)
        .then(response => {
          this.uploadTotaList = response.data;
          this.total = response.total;
          if (this.total > 0) {
            this.pagerShow = true;
          } else {
            this.$message({
              type: "info",
              message: "该时间段内没有上传信息"
            });
          }
        })
        .catch(() => {
          // this.uploadTotaList =[];
          // this.pagerShow=false;
          // this.$message({
          //     type: 'warning',
          //     message: '请选择起始时间123'
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
      // console.log(this.paramsData);
    },
    //分页
    handleSizeChange(val) {
      this.paramsData.page_size = val;
      this.queryUploadStatisticsByTime(this.params);
    },
    handleCurrentChangePage(val) {
      this.paramsData.current_page = val;
      this.queryUploadStatisticsByTime(this.paramsData);
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
.pageRow {
  margin-top: 15px;
}
</style>
