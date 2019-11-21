<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-09-05 15:14:21
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="3" class="first-input">
          <el-date-picker
            v-model="paramsData.start_time"
            type="date"
            value-format="timestamp"
            placeholder="选择开始日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-date-picker
            v-model="paramsData.end_time"
            type="date"
            value-format="timestamp"
            placeholder="选择结束日期"
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
      </el-row>
      <el-row style="margin-top:20px;">
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
        <el-col :span="3" class="first-input">
          <el-select v-model="paramsData.lock_flag" clearable placeholder="请选择锁定状态">
            <el-option
              v-for="item in caseLockArray"
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
        <el-table-column prop="case_type_name" label="案件类型" width></el-table-column>
        <el-table-column prop="court_name" label="归属法院" width></el-table-column>
        <el-table-column prop="court_room_name" label="归属庭室" width></el-table-column>
        <el-table-column prop="deal_user_name" label="处理人" width></el-table-column>
        <el-table-column prop="cur_deal_user_name" label="正在处理人" width></el-table-column>
        <el-table-column label="处理状态" width>
          <template slot-scope="scope">{{ getCaseState(scope.row.deal_case_status) }}</template>
        </el-table-column>
        <el-table-column label="是否锁定" width>
          <template slot-scope="scope">{{ scope.row.lock_flag==0?"未锁定":"已锁定" }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">案件分类</el-button>
            <el-button @click="handleYuelan(scope.row)" type="text" size="small">案件阅览</el-button>
            <!-- <el-button type="text" size="small">编辑</el-button> -->
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
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { queryCasesList } from "@/api/caseManage/childCaseHeNan";
import { gotoDossierChange } from "@/api/common";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
export default {
  directives: { waves },
  computed: {
    ...mapGetters([
      "allCourtList",
      "allCaseTypeList",
      "dealCaseStatusArray",
      "caseLockArray"
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
        deal_case_status: "", // 处理状态
        lock_flag: "", // 是否锁定
        start_time: "",
        end_time: "",
        pages: 1,
        total: 0
      },
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
          message: "无相关案件信息",
          type: "success"
        });
      }
    },
    handleReset() {
      this.paramsData.case_type_id = ""
      this.paramsData.court_id = ""
      this.paramsData.caseName = ""
      this.paramsData.start_time = ""
      this.paramsData.deal_case_status = ""
      this.paramsData.lock_flag = ""
      this.paramsData.end_time = ""
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
    async gotoDossierChange(id) {
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
          message: "服务器请求失败!",
          type: "success"
        });
      }
    },
    handleClick(row) {
      this.gotoDossierChange(row.case_id);
    },
    handleYuelan(row) {
     window.open("model/filespreviewhn/page.html?caseInfoId=" + row.case_id)
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.handleSearch(1);
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.handleSearch(currentPge);
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
