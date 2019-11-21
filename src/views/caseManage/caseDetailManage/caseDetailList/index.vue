<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-12 09:18:00
 * @LastEditTime: 2019-10-23 17:08:33
 * @LastEditors:GuiShun
 -->
<template>
  <div>
    <div>
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
              @click="handleSearch(1)"
            >搜索</el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="handleReset"
            >重置</el-button>
            <el-button
              v-waves
              :loading="downloadLoading"
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="handleDownload"
            >下载</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="content content-table">
        <el-table
          ref="multipleTable"
          :data="caseInfoList"
          tooltip-effect="dark"
          style="width: 100%"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" label width="50"></el-table-column>
          <el-table-column type="selection" width></el-table-column>
          <el-table-column label="立案时间" width>
            <template slot-scope="scope">{{ scope.row.la_date }}</template>
          </el-table-column>
          <el-table-column prop="case_name" label="案号" width></el-table-column>
          <el-table-column prop="case_type_name" label="案件类型" width></el-table-column>
          <el-table-column prop="court_name" label="归属法院" width="280"></el-table-column>
          <el-table-column prop="court_room_name" label="归属庭室" width></el-table-column>
          <el-table-column prop="deal_user_name" label="处理人" width></el-table-column>
          <el-table-column fixed="right" label="查看详情" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
              <!-- <router-link :to="{ path: '/caseManage/caseDetailManage/caseDetail?caseId='+scope.row.case_id}" append>详情</router-link> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="case_type_name" label="案件类型" show-overflow-tooltip></el-table-column> -->
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
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  queryCasesList,
  downloadCasesInfo
} from "@/api/caseManage/caseDetailManage";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import qs from "qs";
export default {
  directives: { waves },
  computed: {
    ...mapGetters(["allCourtList", "allCaseTypeList", ""])
  },
  data() {
    return {
      paramsData: {
        current_page: 1,
        page_size: 20,
        case_type_id: "",
        court_id: "",
        case_name: "",
        start_time: new Date().setMonth(0, 1),
        end_time: new Date().setMonth(new Date().getMonth()),
        pages: 1,
        total: 0
      },
      outShow: true,
      caseInfoList: [],
      multipleSelection: [],
      downloadParam: [],
      downloadLoading: false,
      // listLoading: true,
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
        this.$message({
           showClose: true,
          message: "无相关案件信息",
          type: "success"
        });
      }
    },
    handleReset() {
      this.paramsData.case_type_id = "";
      this.paramsData.court_id = "";
      this.paramsData.caseName = "";
      this.paramsData.start_time = "";
      this.paramsData.end_time = "";
    },
    async handleDownload() {
      // console.log(this.downloadParam);
      let _that = this;
      _that.downloadLoading = true;
      let data;
      data = JSON.stringify(_that.downloadParam);
      await downloadCasesInfo(data)
        .then(res => {
          _that.$message({
            message: "下载完成",
            type: "success"
          });
          _that.downloadLoading = false;
        })
        .catch(res => {
          _that.$message({
            message: "下载失败",
            type: "error"
          });
          _that.downloadLoading = false;
        });
    },
    handleClick(row) {
      this.caseId = row.case_id;
      this.outShow = !this.outShow;
      // this.SET_OUTSHOW(!this.outShow);
      // this.$store.dispatch("common/setOutShow", !this.outShow);
      // this.$router.push(`/caseManage/caseDetailManage/caseDetail?caseId=${this.caseId}`);
      // this.$router.push({  //此方法传参会在url显示
      //   name:"CaseDetail",
      //   parms: {
      //     caseId: this.caseId
      //   }
      // path: "/caseManage/caseDetail",
      // query: {
      //  caseId: this.caseId
      // }
      // });
      this.$router.push({ name: "CaseDetail", query: { caseId: this.caseId } });
    },
    handleSelectionChange(val) {
      let _that = this;
      _that.downloadParam = [];
      _that.multipleSelection = val;
      // console.log(_that.multipleSelection);
      _that.multipleSelection.forEach(function(item, index) {
        let caseInfo = _that.createCaseInfoObj(
          item.case_type_id,
          item.case_code,
          item.court_id,
          item.case_name
        );
        _that.downloadParam.push(caseInfo);
      });
    },
    createCaseInfoObj(case_type_id, case_code, court_id, case_name) {
      var obj = new Object();
      obj.case_type_id = case_type_id;
      obj.case_code = case_code;
      obj.court_id = court_id;
      obj.case_name = case_name;
      return obj;
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.handleSearch(1);
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.handleSearch(currentPge);
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
.content .el-table{
  margin-bottom: 15px;
}
</style>
