<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 09:18:00
 * @LastEditTime: 2019-10-23 16:24:08
 * @LastEditors: GuiShun
 -->
<template>
  <div class="content-table">
    <el-table
      ref="multipleTable"
      :data="caseInfoList"
      v-loading="listLoading"
      tooltip-effect="dark"
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column type="index" label width="50"></el-table-column>
      <el-table-column prop="case_name" label="案号" width></el-table-column>
      <el-table-column prop="case_type_name" label="案件编号" width></el-table-column>
      <el-table-column prop="case_type_name" label="案件类型" width></el-table-column>
      <el-table-column prop="court_name" label="归属法院" width></el-table-column>
      <el-table-column prop="court_room_name" label="处理状态" width></el-table-column>
      <el-table-column prop="deal_user_name" label="上传人" width></el-table-column>
      <el-table-column prop="deal_user_name" label="处理人" width></el-table-column>
      <el-table-column label="创建时间" width>
        <template slot-scope="scope">{{ scope.row.la_date }}</template>
      </el-table-column>
    </el-table>
    <router-view />
  </div>
</template>

<script>
import { queryAllSubCaseInfo } from "@/api/caseManage/caseDetailManage";
export default {
  data() {
    return {
      case_id: "",
      listLoading: false,
      caseInfoList: [],
      tableHeight: 700
    };
  },
  computed: {},
  created() {
    this.case_id = this.$route.query.caseId;
    console.log(this.case_id);
  },
  mounted() {
    this.queryAllSubCaseInfo();
  },
  methods: {
    async queryAllSubCaseInfo() {
      this.listLoading = true;
      try {
        const { data: caseInfoList } = await queryAllSubCaseInfo({
          case_id: this.case_id
        });
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
        this.listLoading = false;
      } catch {
        this.caseInfoList = [];
        this.listLoading = false;
        // this.$message({
        //    showClose: true,
        //   message: "无相关信息",
        //   type: "success"
        // });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.content-table {
  height: 1050px;
}
</style>
