<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-31 10:17:27
 * @LastEditors: GuiShun
 -->
<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="3">
          <el-date-picker
            v-model="paramsData.start_time"
            type="date"
            value-format="timestamp"
            placeholder="选择开始日期"
            @change="getStartTime"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-date-picker
            v-model="paramsData.end_time"
            type="date"
            value-format="timestamp"
            placeholder="选择结束日期"
            @change="getEndTime"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入案号" v-model="paramsData.case_name" clearable></el-input>
        </el-col>
        <el-col :span="5" class="btn-box">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch()"
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
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="caseInfoList"
        tooltip-effect="dark"
        style="width: 100%"
        :height="tableHeight"
      >
        <el-table-column type="index" label width="50"></el-table-column>
        <el-table-column prop="case_name" label="案号" width></el-table-column>
        <el-table-column prop="court_name" label="归属法院" width></el-table-column>
        <el-table-column prop="court_room_name" label="归属庭室" width></el-table-column>
        <el-table-column prop="upload_user_name" label="上传人" width></el-table-column>
        <el-table-column label="上传时间" width="180">
          <template slot-scope="scope">{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>
        <el-table-column prop="page_total" label="文件数" width></el-table-column>
        <el-table-column fixed="right" label="查看详情" width="150">
          <template slot-scope="scope">
            <el-button @click="handleDel(scope.row)" type="text" size="small" style="color: red;" v-auth="['caseTmp:delete']">删除</el-button>
            <el-button @click="handleUploadOver(scope.row)" type="text" size="small" v-auth="['caseTmp:uploadEnd']">上传完成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="paramsData.current_page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="paramsData.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paramsData.total"
        v-show="pagerShow"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  queryAllList,
  delTmpSubCase,
  upLoadTmpSubCase
} from "@/api/systemMain/temporaryList";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
export default {
  directives: { waves },
  computed: {
    ...mapGetters(["allCourtList", "allCaseTypeList"])
  },
  data() {
    return {
      paramsData: {
        start_time: new Date().setMonth(0, 1),
        end_time: new Date().setMonth(new Date().getMonth()),
        case_name: ""
      },
      caseSubId: { sub_case_id: "" },
      caseInfoList: [],
      downloadLoading: false,
      pagerShow: false,
      tableHeight: 700
    };
  },
  created() {},
  mounted() {
    this.handleSearch();
  },
  watch: {
    // paramsData: {
    //   handler(newName, oldName) {
    //     console.log(this.paramsData);
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    async handleSearch() {
      // this.listLoading = true;
      try {
        const { data: caseInfoList } = await queryAllList(this.paramsData);
        this.caseInfoList = caseInfoList;
        this.$nextTick(() => {
          this.tableHeight =
            window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 160;
          // 监听窗口大小变化
          let self = this;
          window.onresize = function() {
            self.tableHeight =
              window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 160;
          };
        });
        // this.listLoading = false;
      } catch {
        this.caseInfoList = [];
        // this.listLoading = false;
        this.pagerShow = true;
        // this.$message({
        //   message: "无相关案件信息",
        //   type: "success"
        // });
      }
    },
    handleReset() {
      this.paramsData.case_name = "";
      this.paramsData.start_time = "";
      this.paramsData.end_time = "";
    },
    handleDel(row) {
      this.caseSubId.sub_case_id = row.sub_case_id;
      this.$confirm("您确定要删除该表吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delSubCase(this.caseSubId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async delSubCase(subCaseId) {
      try {
        const { code } = await delTmpSubCase(subCaseId);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.handleSearch();
      } catch {
        this.$message({
          type: "error",
          message: "删除失败,请联系管理员!"
        });
      }
    },
    handleUploadOver(row) {
      if (row.page_total === null) {
        this.$message({
          type: "warning",
          message: "该批次没有文件，请删除"
        });
        return;
      }
      this.caseSubId.sub_case_id = row.sub_case_id;
      this.$prompt("请输入要上传的案号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        //   inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        //   inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          if (value == row.case_name) {
            this.uploadSubCse(this.caseSubId);
          } else {
            this.$message({
              type: "error",
              message: "与当前案号不一致,无法上传!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消上传"
          });
        });
    },
    async uploadSubCse(subCaseId) {
      try {
        const { code } = await upLoadTmpSubCase(subCaseId);
        this.$message({
          type: "success",
          message: "上传成功!"
        });
        this.handleSearch();
      } catch {
        this.$message({
          type: "error",
          message: "上传失败!"
        });
      }
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.handleSearch();
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.handleSearch();
    },
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
</style>
