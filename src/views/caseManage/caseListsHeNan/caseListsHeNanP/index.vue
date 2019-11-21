<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-23 11:58:08
 * @LastEditors: GuiShun
 -->
<template>
  <div ref="page">
    <div class="filter-container">
      <el-row>
        <el-col :span="3" class="first-input">
          <el-select v-model="paramsData.court_id" clearable placeholder="请选择法院">
            <el-option
              v-for="item in allCourtList"
              :key="item.court_id"
              :label="item.court_name"
              :value="item.court_id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="paramsData.case_type_id" clearable placeholder="请选择案件类型">
            <el-option
              v-for="item in allCaseTypeList"
              :key="item.case_type_id"
              :label="item.case_type_name"
              :value="item.case_type_id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入案号" v-model="paramsData.case_name" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入案件编号"
            v-model="paramsData.case_code"
            clearable
            @clear="clearCaseCode"
          ></el-input>
        </el-col>
        <el-col :span="5" class="btn-box">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch(1)"
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
        <el-table-column prop="case_code" label="案件编号" width></el-table-column>
        <el-table-column prop="case_type_name" label="案件类型" width></el-table-column>
        <el-table-column prop="court_name" label="归属法院" width></el-table-column>
        <el-table-column prop="court_room_name" label="归属庭室" width></el-table-column>
        <el-table-column prop="deal_user_name" label="处理人" width></el-table-column>
        <el-table-column fixed="right" label="查看详情" width="100">
          <template slot-scope="scope">
            <el-button @click="showCaseFunction(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="showFilespreview(scope.row)" type="text" size="small">阅览</el-button>
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
import { queryCasesList } from "@/api/caseManage/caseListsHeNan";
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
        current_page: 1,
        page_size: 20,
        case_type_id: "",
        court_id: "",
        case_name: "",
        pages: 1,
        total: 0
      },
      caseInfoList: [],
      downloadLoading: false,
      pagerShow: false,
      tableHeight: 700
    };
  },
  created() {},
  mounted() {
    this.handleSearch(1);
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
    async handleSearch(currentPage) {
      // this.listLoading = true;
      this.paramsData.current_page = currentPage;
      try {
        const { data: caseInfoList, total } = await queryCasesList(
          this.paramsData
        );
        this.$refs.page.style.width = "99.9%";
        this.caseInfoList = caseInfoList;
        this.paramsData.total = total;
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
        if (this.paramsData.total > this.paramsData.page_size) {
          this.pagerShow = true;
        }
      } catch {
        this.caseInfoList = [];
        // this.listLoading = false;
        this.pagerShow = true;
        this.paramsData.total = 0;
        // this.$message({
        //   message: "无相关案件信息",
        //   type: "success"
        // });
      }
    },
    handleReset() {
      this.paramsData.case_type_id = "";
      this.paramsData.court_id = "";
      this.paramsData.case_name = "";
      this.paramsData.case_code = "";
      this.paramsData.start_time = "";
      this.paramsData.end_time = "";
      delete this.paramsData.case_code;
    },
    showCaseFunction(row) {
      //详情
      // window.open("model/sub_case_manager/page.html?selectID=" + row.case_id);
      this.$router.push({
        name: "CaseDetailHnList",
        query: { caseId: row.case_id }
      });
    },
    showFilespreview(row) {
      //阅览
      window.open("model/filespreviewhn/page.html?caseInfoId=" + row.case_id);
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.handleSearch(1);
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.handleSearch(currentPge);
    },
    clearCaseCode() {
      delete this.paramsData.case_code;
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

.content .el-table{
		margin-bottom: 15px;
	}
</style>
