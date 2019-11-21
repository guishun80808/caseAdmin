<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-24 09:34:37
 * @LastEditors: GuiShun
 -->
<template>
  <div>
    <div class="filter-container" ref="upFile">
      <el-row>
        <el-col :span="3">
          <input
            type="file"
            nv-file-select
            uploader="uploader"
            class="form-control"
            ref="file"
            file-model="myFile"
          />
        </el-col>
        <el-col :span="5" class="btn-box">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-top"
            v-auth="['system:upgrade']"
            @click="uploadFile()"
          >提交</el-button>
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
        <el-table-column label="升级类型" width>
          <template slot-scope="scope">{{ getVerType(scope.row.verType) }}</template>
        </el-table-column>
        <el-table-column label="升级时间" width="180">
          <template
            slot-scope="scope"
          >{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>
        <el-table-column label="升级详情" width>
          <template slot-scope="scope">{{ getUpdateDetail(scope.row.updateDetail) }}</template>
        </el-table-column>
        <el-table-column prop="revision" label="升级版本" width></el-table-column>
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
import { querySystemList, uploadFile } from "@/api/systemMain/updateManage";
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
        page_size: 10,
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
    this.querySystemList(1);
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
    async querySystemList(currentPage) {
      // this.listLoading = true;
      this.paramsData.current_page = currentPage;
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
      // console.log(this.paramsData);
      try {
        const { data: caseInfoList, total } = await querySystemList(
          this.paramsData
        );
        this.caseInfoList = caseInfoList;
        this.paramsData.total = total;
        // this.listLoading = false;
        this.pagerShow = true;

        // console.log(this.pagerShow);
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
    async uploadFile() {
      let fileObj = this.$refs.file.files[0];
      if (fileObj == "" || fileObj == null) {
        this.$message({
          message: "请选择要上传的文件",
          type: "error"
        });
        return;
      }
      let fileType = fileObj.name
        .slice(fileObj.name.lastIndexOf(".") + 1)
        .toLowerCase();
      console.log(fileType);
      console.log(!/\.(zip|rar)$/.test(fileType));
      if (fileType == "zip" || fileType == "rar") {
        let fd = new FormData();
        fd.append("upFile", fileObj); //文件对象
        try {
          await uploadFile(fd);
          this.$message({
            message: "上传文件成功",
            type: "success"
          });
          this.$refs.file.value = ""; // 清空file文件
        } catch {
          this.$message({
            message: "上传文件失败",
            type: "error"
          });
        }
        this.$refs.file.value = ""; // 清空file文件
      } else {
        this.$message({
          message: "上传文件格式不支持",
          type: "error"
        });
        return;
      }
    },
    getVerType(state) {
      switch (state) {
        case 0:
          state = state;
          break;
        case 1:
          state = state;
          break;
        default:
          state = state;
      }
      return state;
    },
    getUpdateDetail(state) {
      var text = "";
      if (state == "success") {
        text = "升级成功";
      }
      return text;
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.querySystemList(1);
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.querySystemList(currentPge);
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
      .form-control {
        margin-top: 2px;
        width: 100%;
        height: 32px;
        line-height: 24px;
        border: 1px solid #dcdfe6;
        font-size: 12px;
      }
    }
  }
}
.content .el-table {
  margin-bottom: 15px;
}
</style>
