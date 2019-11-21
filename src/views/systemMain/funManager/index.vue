<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-09-05 17:36:09
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="2" class="btn-box first-input">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            @click="addFunOpen"
          >新增功能</el-button>
        </el-col>
        <el-col :span="20">
          <span
            style="display:inline-block;margin-right:20px;margin-top:8px;"
            v-for="item in funList"
            v-waves
            type="primary"
          >
            <span style=" cursor: pointer;color:red" @click="delFun(item)">删除</span>
            {{item.text}}
          </span>
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
        <el-table-column label="服务器名称" width>
          <template slot-scope="scope">{{ scope.row.serverProvince + scope.row.serverCity }}</template>
        </el-table-column>
        <el-table-column label="功能列表" width>
          <template slot-scope="scope">
            <button
              v-for="item in scope.row.function"
              v-waves
              class="filter-item btn-list"
              type="primary"
              :class="{'con-code-icog':item.functionInvalidFlag == 0,'con-code-icod':item.functionInvalidFlag == 1}"
              @click="clickUpdateFun(item)"
            >{{item.functionName}}</button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新增功能" :visible.sync="dialogFormVisible">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="功能名称" prop="functionName">
            <el-input v-model="ruleForm.functionName"></el-input>
          </el-form-item>
          <el-form-item label="功能代称" prop="functionCode">
            <el-input v-model="ruleForm.functionCode"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancle">取 消</el-button>
          <el-button type="primary" @click="addSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  getAllServes,
  addFunction,
  deleteFun,
  updateFunView
} from "@/api/systemMain/serverManager";
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
      functionId: "",
      funList: [],
      caseInfoList: [],
      btnHtml: "",
      dialogFormVisible: false,
      ruleForm: {
        functionCode: "",
        functionName: ""
      },
      upLoadFunParam: {
        functionId: "", //功能id
        serverId: "", //服务器名称
        functionInvalidFlag: "" //是否使用
      },
      functionId: { functionId: "" },
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
        const { data: caseInfoList } = await getAllServes();
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
        for (
          let index = 0;
          index < this.caseInfoList[0].function.length;
          index++
        ) {
          const element = this.caseInfoList[0].function[index];
          this.funList.push({
            text: element.functionName,
            value: element.functionId,
            functionInvalidFlag: element.functionInvalidFlag
          });
        }
      } catch {
        this.caseInfoList = [];
        // this.$message({
        //   message: "无相关案件信息",
        //   type: "success"
        // });
      }
    },
    addFunOpen() {
      this.ruleForm = {
        functionCode: "",
        functionName: ""
      };
      this.dialogFormVisible = true;
    },
    addCancle() {
      this.dialogFormVisible = false;
      this.ruleForm = {
        functionCode: "",
        functionName: ""
      };
    },
    addSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addSaveFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async addSaveFun() {
      try {
        await addFunction(this.ruleForm);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.handleSearch();
      } catch {
        this.$message({
          message: "新增失败",
          type: "error"
        });
      }
      this.dialogFormVisible = false;
      this.ruleForm = {
        functionCode: "",
        functionName: ""
      };
    },
    async deleteFun(funId) {
      try {
        await deleteFun(funId);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.handleSearch();
      } catch {
        this.$message({
          message: "删除失败,请联系管理员!",
          type: "error"
        });
      }
    },
    delFun(item) {
      this.functionId.functionId = item.value;
      this.$confirm(
        `确定删除<span style="color:red">${item.text}</span>功能吗, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          this.deleteFun(this.functionId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          this.functionId.functionId = "";
        });
    },
    async updateFunView(param) {
      console.log(param);
      try {
        await updateFunView(param);
        this.handleSearch();
      } catch {
        this.$message({
          message: "切换失败",
          type: "error"
        });
      }
    },
    clickUpdateFun(item) {
      this.upLoadFunParam.functionId = item.functionId;
      this.upLoadFunParam.serverId = item.serverId;
      if (item.functionInvalidFlag == "0") {
        this.upLoadFunParam.functionInvalidFlag = 1;
      }
      if (item.functionInvalidFlag == "1") {
        this.upLoadFunParam.functionInvalidFlag = 0;
      }
      this.updateFunView(this.upLoadFunParam);
    }
  }
};
</script>

<style scoped lang="scss">
.filter-container {
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
</style>

