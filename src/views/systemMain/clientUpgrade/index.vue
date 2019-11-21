<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-31 10:27:56
 * @LastEditors: GuiShun
 -->
<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="3" class="first-input">
          <el-select
            v-model="params.fileType"
            clearable
            placeholder="请选择文件类型"
            @change="handleSearch"
          >
            <el-option
              v-for="item in fileTypeArray"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
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
            auth="['clientServer:upload]"
            @click="uploadFile"
          >上传</el-button>
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
        <el-table-column type="index" label width="40"></el-table-column>
        <el-table-column label="文件类型" width>
          <template slot-scope="scope">{{getFileType(scope.row.fileType)}}</template>
        </el-table-column>
        <el-table-column prop="clientName" label="文件名" width></el-table-column>
        <el-table-column label="上传时间" width>
          <template slot-scope="scope">{{scope.row.uploadTime.substring(0,10)}}</template>
        </el-table-column>
        <el-table-column prop="clientVersion" label="版本号" width></el-table-column>
        <el-table-column prop="updateContent" label="升级内容" width></el-table-column>
        <el-table-column prop="uploadUserName" label="上传人" width></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="to_lead"
              v-auth="['clientServer:download']"
              @click.native="downloadClient(scope.row.clientId)"
            >
              <span class="glyphicon glyphicon-arrow-up"></span>
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="params.current_page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  queryAllFile,
  uploadFile,
  downloadClient
} from "@/api/systemMain/clientUpgrade";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { debuglog } from "util";
import { setTimeout } from "timers";
import Vue from "vue";
export default {
  directives: { waves },
  computed: {
    ...mapGetters(["allCourtList", "allCaseTypeList"])
  },
  data() {
    return {
      params: {
        current_page: 1, //当前页
        page_size: 20, //每页显示数据量
        fileType: ""
      },
      total: 0,
      fileTypeArray: [
        {
          value: "",
          text: "全部文件"
        },
        {
          value: "zip",
          text: "升级包"
        },
        {
          value: "rar",
          text: "完整包"
        },
        {
          value: "msi",
          text: "安装包"
        },
        {
          value: "pdf",
          text: "操作手册"
        },
        {
          value: "exe",
          text: "插件"
        },
        {
          value: "mp4",
          text: "操作视频"
        }
      ],
      caseInfoList: [],
      dialogFormVisible: false,
      ruleForm: {
        functionCode: "",
        functionName: ""
      },
      rules: {
        functionName: [
          { required: true, message: "请输入功能名称", trigger: "blur" }
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        functionCode: [
          { required: true, message: "请输入功能代称", trigger: "blur" }
        ]
      },
      tableHeight: 700
    };
  },
  created() {
    this.handleSearch();
  },
  mounted() {
    // this.handleSearch();
  },
  watch: {
    // caseInfoList: {
    //   handler(newName, oldName) {
    //     console.log(this.caseInfoList);
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    async handleSearch() {
      this.funList = [];
      // this.listLoading = true;
      try {
        const { data: caseInfoList, total } = await queryAllFile(this.params);
        this.caseInfoList = caseInfoList;
        this.total = total;
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
      } catch {
        console.log(this.funList);
        this.caseInfoList = [];
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
          showClose: true,
          message: "请选择要上传的文件",
          type: "error"
        });
        return;
      }

      let fd = new FormData();
      fd.append("filedata", fileObj); //文件对象
      try {
        const { data } = await uploadFile(fd);
        this.$message({
          showClose: true,
          message: "上传文件成功",
          type: "success"
        });
        this.$refs.file.value = ""; // 清空file文件
        this.handleSearch();
      } catch (err) {
        this.$refs.file.value = ""; // 清空file文件
        // this.$message({
        //   message: "上传文件失败",
        //   type: "error"
        // });
      }
    },
    handleSizeChange(pageSize) {
      this.params.page_size = pageSize;
      this.handleSearch(1);
    },
    handleCurrentChange(currentPge) {
      this.params.current_page = currentPge;
      this.handleSearch();
    },
    getFileType(fileType) {
      let text = "";
      if (fileType == "zip") {
        text = "升级包";
      } else if (fileType == "rar") {
        text = "完整包";
      } else if (fileType == "msi") {
        text = "安装包";
      } else if (fileType == "pdf") {
        text = "操作手册";
      } else if (fileType == "exe") {
        text = "插件";
      } else if (fileType == "mp4") {
        text = "操作视频";
      } else {
        text = "";
      }
      return text;
    },
    downloadClient(clientId) {
      location.href =
        "/court/clientServer/downloadClient" + "?" + "clientId=" + clientId;
    }
  }
};
</script>

<style scoped lang="scss">
.filter-container {
  .form-control {
    margin-top: 2px;
    width: 100%;
    height: 32px;
    line-height: 24px;
    border: 1px solid #dcdfe6;
    font-size: 12px;
  }
  .el-button--medium {
    padding: 8px 8px;
    font-size: 12px;
  }
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
.btn-list {
  margin-right: 8px;
}
.con-code-ico {
  left: 0;
  width: 30px;
  height: 30px;
  background: center center no-repeat;
  cursor: pointer;
  position: relative;
  box-shadow: none;
}

.con-code-icot {
  /*float: left;*/
  left: 0%;
  top: 40%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  background: center center no-repeat;
  color: #f39443;
  cursor: pointer;
  position: relative;
  box-shadow: none;
}

.con-code-icog {
  /*float: left;*/

  left: 0%;
  top: 40%;
  margin-top: 2px;
  margin-bottom: 2px;
  min-width: 80px;
  max-width: none;
  height: 30px;
  line-height: 25px;
  /*background: center center no-repeat;*/
  color: white;
  background-color: #0099cc;
  cursor: pointer;
  position: relative;
  box-shadow: none;
  border: none;
  /*overflow:visible;
    text-overflow: ellipsis;
    white-space: nowrap;*/
}
.con-code-icog:hover {
  cursor: pointer;
  background: #1b8bb1;
  /*overflow:visible;*/
}

.con-code-icod {
  /*float: left;*/

  left: 0%;
  top: 40%;
  margin-top: 2px;
  margin-bottom: 2px;
  /*width: auto;*/
  min-width: 80px;
  max-width: none;
  height: 30px;
  line-height: 25px;
  /*background: center center no-repeat;*/
  color: black;
  background-color: #eaedf1;
  cursor: pointer;
  position: relative;
  box-shadow: none;
  border: none;
  /*overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;*/
}

.con-code-icod:hover {
  cursor: pointer;
  background: #abbbd0;
}

.datagrid-row-selected {
  background: #d1f1f9 !important;
  /* color: #fff; */
}
.content .el-table {
  margin-bottom: 10px;
}
</style>

