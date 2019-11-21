<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-11-01 16:07:22
 * @LastEditors: GuiShun
 -->
<template>
  <div id="childcase0">
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
        <el-col :span="4">
          <el-select v-model="court_id" multiple collapse-tags placeholder="请选择法院">
            <el-option
              v-for="item in allCourtList"
              :key="item.court_id"
              :label="item.court_name"
              :value="item.court_id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="case_type_id" multiple collapse-tags placeholder="请选择案件类型">
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
      </el-row>
      <el-row>
        <el-col :span="3" class="first-input">
          <el-select v-model="paramsData.deal_case_status" clearable placeholder="请选择处理状态">
            <el-option
              v-for="item in dealCaseStatusArray"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="paramsData.lock_flag" clearable placeholder="请选择锁定状态">
            <el-option
              v-for="item in caseLockArray"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          锁定处理人：
          <el-checkbox style="margin-top: 5px;" v-model="dealUserId" @change="userChange"></el-checkbox>
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
          <template
            slot-scope="scope"
          >{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>
        <el-table-column prop="case_name" label="案号" width="200"></el-table-column>
        <el-table-column prop="case_type_name" label="案件类型" width></el-table-column>
        <el-table-column prop="court_name" label="归属法院" width="280"></el-table-column>
        <el-table-column prop="court_room_name" label="归属庭室"></el-table-column>
        <el-table-column prop="deal_user_name" label="处理人" width></el-table-column>
        <el-table-column prop="cur_deal_user_name" label="正在处理人" width></el-table-column>
        <el-table-column label="处理状态" width>
          <template slot-scope="scope">{{ getCaseState(scope.row.deal_case_status) }}</template>
        </el-table-column>
        <el-table-column label="是否锁定" width>
          <template slot-scope="scope">{{ scope.row.lock_flag==0?"未锁定":"已锁定" }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="查看详情" style="text-align:center" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClickhb(scope.row)" type="text" size="small" v-auth='["hb:case:classify"]'>案件分类</el-button>
            <el-button @click="handleClickhn(scope.row)" type="text" size="small" v-auth='["hn:case:classify"]'>案件分类</el-button>
            <el-button @click="routerToYulan(scope.row)" type="text" size="small">案件阅览</el-button>
            <el-button @click="showPreview(scope.row)" type="text" size="small">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  computed: {
    ...mapGetters([
      "userInfo",
      "allCourtList",
      "allCaseTypeList",
      "dealCaseStatusArray",
      "caseLockArray"
    ])
  },
  data() {
    return {
      case_type_id: [],
      court_id: [],
      paramsData: {
        current_page: 1,
        page_size: 20,
        // case_type_id: "",
        caseTypeId: "",
        // court_id: "",
        courtId: "",
        case_name: "",
        start_time: new Date().setMonth(0, 1),
        end_time: new Date().setMonth(new Date().getMonth()),
        deal_case_status: "", // 处理状态
        lock_flag: "", // 是否锁定
        deal_user_id: "", // 是否锁定
        invalid_flag: 0, // 是否锁定
        pages: 1,
        total: 0
      },
      caseInfoList: [],
      tableHeight: 700,
      // listLoading: true,
      dealUserId: false,
      pagerShow: false
    };
  },
  mounted() {
    this.handleSearch(1);
  },
  methods: {
    async handleSearch(currentPage) {
      // this.listLoading = true;
      let self = this;
      let courtStr = "";
      let caseTypeStr = "";
      self.court_id.forEach(function(e) {
        courtStr += e + "c";
      });
      self.case_type_id.forEach(function(e) {
        caseTypeStr += e + "t";
      });
      self.paramsData.courtId = courtStr;
      self.paramsData.caseTypeId = caseTypeStr;
      self.paramsData.current_page = currentPage;
      try {
        const { data: caseInfoList, total } = await queryCasesList(
          self.paramsData
        );
        self.caseInfoList = caseInfoList;
        self.paramsData.total = total;
        self.paramsData.courtId = "";
        self.paramsData.caseTypeId = "";
        self.$nextTick(() => {
          self.tableHeight =
            window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 160;
          // 监听窗口大小变化
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
        self.paramsData.court_id = "";
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
    async gotoDossierChange(id) {
      try {
        const { code } = await gotoDossierChange({
          caseId: id
        });
        let source = 3;
        this.caseId = id;
        window.open(
          "model/dragl/dossierCase.html?selectID=" +
            this.caseId +
            "&source=" +
            source
        ); //人工分类地址获取
      } catch {
        this.$message({
          showClose: true,
          message: "服务器请求失败!",
          type: "success"
        });
      }
    },
     async gotoDossierChangehn(id) {
      try {
        const { code } = await gotoDossierChange({
          caseId: id
        });
        let source = 6;
        this.caseId = id;
        window.open(
          "model/dragl/dossierCase.html?selectID=" +
            this.caseId +
            "&source=" +
            source
        ); //人工分类地址获取
      } catch {
        this.$message({
          showClose: true,
          message: "服务器请求失败!",
          type: "success"
        });
      }
    },
    handleReset() {
      this.paramsData.caseTypeId = "";
      this.paramsData.courtId = "";
      this.paramsData.case_name = "";
      this.paramsData.start_time = "";
      this.paramsData.end_time = "";
      this.paramsData.deal_case_status = "";
      this.paramsData.lock_flag = "";
      this.paramsData.invalid_flag = "";
      this.paramsData.deal_user_id = "";
      this.court_id = [];
      this.case_type_id = [];
      this.dealUserId = false;
    },
    handleClickhb(row) {
      this.gotoDossierChange(row.case_id);
    },handleClickhn(row) {
      this.gotoDossierChangehn(row.case_id);
    },
    routerToYulan(row) {
      window.open(
        "model/common_filespreview/page.html?caseInfoId=" + row.case_id
      );
    },
    showPreview(row) {
      window.open("model/previewhn/page.html?caseInfoId=" + row.case_id);
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.handleSearch(1);
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.handleSearch(currentPge);
    },
    getCaseState(state) {
      switch (state) {
        case 0:
          state = "上传中";
          break;
        case 1:
          state = "未处理";
          break;
        case 2:
          state = "处理中";
          break;
        case 3:
          state = "处理完成";
          break;
        default:
          state = "--";
      }
      return state;
    },
    userChange() {
      if (this.dealUserId == true) {
        this.paramsData.deal_user_id = this.userInfo.currentUser.user_id;
      } else {
        this.paramsData.deal_user_id = "";
      }
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
.el-select-dropdown__item {
  width: 98%;
}
.el-select {
  width: 100%;
}
.content .el-table {
  margin-bottom: 15px;
}
.el-tag.el-tag--info {
  // width: 95%;
  // white-space: nowrap;
}
</style>
<style>
#childcase0 .el-select__tags {
  ms-flex-wrap: nowrap !important;
  flex-wrap: nowrap !important;
}
</style>
