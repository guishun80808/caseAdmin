<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-23 17:26:23
 * @LastEditors: GuiShun
 -->
<template>
  <div id="childcase-page">
    <div class="filter-container">
      <el-row style="margin-bottom:15px;">
        <el-col :span="3" class="first-input">
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
          <el-select v-model="paramsData.push_case_status" clearable placeholder="请选择推送状态">
            <el-option
              v-for="item in pushCaseStatusList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入案号" v-model="paramsData.case_name" clearable></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="first-input">
          <el-select v-model="paramsData.invalid_flag" clearable placeholder="请选择是否失效">
            <el-option
              v-for="item in invalidFlagList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
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
        <el-table-column label="上传时间" width="180">
          <template slot-scope="scope">{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>
        <el-table-column prop="case_name" label="案号" width></el-table-column>
        <el-table-column prop="court_name" label="法院名称" width></el-table-column>
        <el-table-column prop="court_room_name" label="庭室名称" width></el-table-column>
        <el-table-column prop="case_type_name" label="案件类型" width></el-table-column>
        <el-table-column prop="upload_user_name" label="上传人" width></el-table-column>
        <el-table-column prop="deal_user_name" label="处理人" width></el-table-column>
        <el-table-column label="是否失效" width>
          <template slot-scope="scope">{{ getInvalidFlag(scope.row.invalid_flag) }}</template>
        </el-table-column>
        <el-table-column prop="directory_name" label="所属卷" width></el-table-column>
        <el-table-column label="上传类型" width>
          <template slot-scope="scope">{{ getUploadType(scope.row.upload_type) }}</template>
        </el-table-column>
        <el-table-column prop="page_total" label="子案件页数" width="100"></el-table-column>
        <el-table-column label="推送状态" width>
          <template slot-scope="scope">{{ getPushCaseStatus(scope.row.push_case_status) }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" style="text-align:center" width="180">
          <template slot-scope="scope">
            <el-button @click="rePush(scope.row)" type="text" size="small">重推</el-button>
            <el-button type="text" @click="handleClick(scope.row)" size="small">查看日志</el-button>
            <el-button type="text" @click="caseModel(scope.row)" size="small">重置</el-button>
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
import { parseTime } from "@/utils";
import {
  queryCasesList,
  repush
} from "@/api/caseManage/caseListsPushHeNan";
import { caseModel } from "@/api/caseManage/childCasePush";
import waves from "@/directive/waves"; // waves directive
import qs from "qs";
export default {
  directives: { waves },
  computed: {
    ...mapGetters([
      "userInfo",
      "allCourtList",
      "pushCaseStatusList",
      "invalidFlagList"
    ])
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
        push_case_status: "", // 推送状态
        invalid_flag: "", // 是否失效
        pages: 1,
        total: 0
      },
      caseInfoList: [],
      listLoading: false,
      dealUserId: false,
      pagerShow: false,
      pushparam: {
        case_id: null //子案件信息
      },
      tableHeight: 700,
      caseId: "",
      delparam: {
        caseId: null //案件信息
      }
    };
  },
  mounted() {
    this.handleSearch(1);
  },
  methods: {
    async caseModel(row) {
      this.delparam.caseId = row.case_id;
      try {
        const { data: caseInfoList, total } = await caseModel(this.delparam);
        // if (data.code == "2701") {
        //   this.$message({
        //     message: "没有相关案件信息!",
        //     type: "success"
        //   });
        //   return;
        // } else if (data.code == "2705") {
        //   this.$message({
        //     message: "案件Id为空!",
        //     type: "success"
        //   });
        //   return;
        // } else if (data.code == "0") {
        this.$message({
          showClose: true,
          message: "重置成功!",
          type: "success"
          //   });
          // } else {
          //   this.$message({
          //     message: "重置失败",
          //     type: "success"
        });
        // }
      } catch {}
    },
    async handleSearch(currentPage) {
      this.listLoading = false;
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
      this.paramsData.case_name = "";
      this.paramsData.start_time = "";
      this.paramsData.end_time = "";
      this.paramsData.push_case_status = "";
      this.paramsData.invalid_flag = "";
      this.dealUserId = false;
    },
    async rePush(row) {
      // console.log(row.case_id);
      this.pushparam.case_id = row.case_id;
      // console.log(this.pushparam);
      try {
        const { data: caseInfoList, total } = await repush(this.pushparam);
        this.$message({
          showClose: true,
          message: "推送成功",
          type: "success"
        });
      } catch {
        this.$message({
          showClose: true,
          message: "推送失败",
          type: "error"
        });
      }
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.handleSearch(1);
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.handleSearch(currentPge);
    },
    getInvalidFlag(state) {
      switch (state) {
        case 0:
          state = "正常";
          break;
        case 1:
          state = "失效";
          break;
        default:
          state = "--";
      }
      return state;
    },
    getUploadType(state) {
      switch (state) {
        case 0:
          state = "随案上传";
          break;
        case 1:
          state = "全卷上传";
          break;
        case 2:
          state = "本卷上传";
          break;
          break;
        default:
          state = "--";
      }
      return state;
    },
    getPushCaseStatus(state) {
      switch (state) {
        case 0:
          state = "未推送";
          break;
        case 1:
          state = "已第一次推送成功";
          break;
        case 2:
          state = "第一次推送失败";
          break;
        case 3:
          state = "分类完成推送成功";
          break;
        case 4:
          state = "分类完成推送失败";
          break;
        default:
          state = "--";
      }
      return state;
    },
    userChange() {
      if (this.dealUserId == true) {
        this.paramsData.deal_user_id = this.userInfo.user_id;
      } else {
        this.paramsData.deal_user_id = "";
      }
    },
    handleClick(row) {
      this.caseId = row.case_id;
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
      this.$router.push({
        name: "ChildCasePushLog",
        query: { case_id: this.caseId }
      });
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
.content .el-table{
  margin-bottom: 15px;
}
</style>
