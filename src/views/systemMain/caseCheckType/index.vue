<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-15 14:53:45
 * @LastEditors: GuiShun
 -->
<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="5" class="btn-box first-input">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            @click="addServerOpen"
          >新增</el-button>
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
        <el-table-column prop="caseTypeName" label="案件类型" width></el-table-column>
        <el-table-column prop="spcxName" label="审判程序" width></el-table-column>
        <el-table-column label="案件状态" width>
          <template slot-scope="scope">{{ getCaseStatus(scope.row.caseStatus) }}</template>
        </el-table-column>
        <el-table-column label="校验方式" width>
          <template slot-scope="scope">{{ scope.row.caseCheckType==0?"简单校验":"严格校验" }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="editSaveOpen(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="delServer(scope.row)" type="text" style="color: red;" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新增信息" :visible.sync="dialogFormVisible">
        <el-form
          :model="addParams"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="案件类型" prop="caseTypeId">
            <el-select
              v-model="addParams.caseTypeId"
              @change="getAddAllSpcxList"
              clearable
              placeholder="请选择案件类型"
            >
              <el-option
                v-for="item in allCaseTypeList"
                :key="item.case_type_id"
                :label="item.case_type_name"
                :value="item.case_type_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审判程序" prop="spcxId">
            <el-select
              v-model="addParams.spcxId"
              clearable
              placeholder="请选择审判程序"
              @change="getSpcxName"
            >
              <el-option
                v-for="item in allSplcList"
                :key="item.spcx_id"
                :label="item.spcx_name"
                :value="item.spcx_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="案件状态" prop="caseStatus">
            <el-select
              v-model="addParams.caseStatus"
              clearable
              placeholder="请选择案件状态"
              @change="getCaseStatusName"
            >
              <el-option
                v-for="item in caseStatusArray"
                :key="item.caseStatusId"
                :label="item.caseStatusName"
                :value="item.caseStatusId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="校验方式" prop="caseStatus">
            <el-select
              v-model="addParams.caseCheckType"
              clearable
              placeholder="请选择校验方式"
              @change="getCheckTypeName"
            >
              <el-option
                v-for="item in caseCheckTypeArray"
                :key="item.caseCheckType"
                :label="item.caseCheckTypeName"
                :value="item.caseCheckType"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancle">取 消</el-button>
          <el-button type="primary" @click="addSave">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑信息" :visible.sync="editFormVisible">
        <el-form
          :model="addParams"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="案件类型" prop="caseTypeId">
            <el-select
              v-model="addParams.caseTypeId"
              @change="getAddAllSpcxList"
              clearable
              placeholder="请选择案件类型"
            >
              <el-option
                v-for="item in allCaseTypeList"
                :key="item.case_type_id"
                :label="item.case_type_name"
                :value="item.case_type_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审判程序" prop="spcxId">
            <el-select
              v-model="addParams.spcxId"
              clearable
              placeholder="请选择审判程序"
              @change="getSpcxName"
            >
              <el-option
                v-for="item in allSplcList"
                :key="item.spcx_id"
                :label="item.spcx_name"
                :value="item.spcx_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="案件状态" prop="caseStatus">
            <el-select
              v-model="addParams.caseStatus"
              clearable
              placeholder="请选择案件状态"
              @change="getCaseStatusName"
            >
              <el-option
                v-for="item in caseStatusArray"
                :key="item.caseStatusId"
                :label="item.caseStatusName"
                :value="item.caseStatusId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="校验方式" prop="caseStatus">
            <el-select
              v-model="addParams.caseCheckType"
              clearable
              placeholder="请选择校验方式"
              @change="getCheckTypeName"
            >
              <el-option
                v-for="item in caseCheckTypeArray"
                :key="item.caseCheckType"
                :label="item.caseCheckTypeName"
                :value="item.caseCheckType"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCancle">取 消</el-button>
          <el-button type="primary" @click="editSaveServer">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  getAllCheckList,
  addCaseCheck,
  delCaseCheck,
  editCaseCheck
} from "@/api/systemMain/caseCheckType";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { setTimeout } from "timers";
export default {
  directives: { waves },
  computed: {
    ...mapGetters(["allCaseTypeList", "allSplcList", "allDirectories"])
  },
  data() {
    return {
      caseInfoList: [],
      downloadLoading: false,
      dialogFormVisible: false,
      editFormVisible: false,
      serverId: { caseTypeId: "", spcxId: "", caseStatus: "" },
      rules: {
        caseTypeId: [
          { required: true, message: "请选择案件类型", trigger: "change" }
        ],
        spcxId: [
          { required: true, message: "请选择审判程序", trigger: "change" }
        ],
        caseStatus: [
          { required: true, message: "请选择案件状态", trigger: "change" }
        ],
        caseCheckType: [
          { required: true, message: "请选择校验规则", trigger: "change" }
        ]
      },
      caseStatusArray: [
        { caseStatusId: 1, caseStatusName: "案件进展阶段新移送" },
        { caseStatusId: 2, caseStatusName: "案件进展阶段立案登记" },
        { caseStatusId: 3, caseStatusName: "案件进展阶段立案审查" },
        { caseStatusId: 4, caseStatusName: "案件进展阶段立案审批" },
        { caseStatusId: 5, caseStatusName: "案件进展阶段等待分派" },
        { caseStatusId: 6, caseStatusName: "案件进展阶段等待确认" },
        { caseStatusId: 7, caseStatusName: "案件进展阶段正在审理" },
        { caseStatusId: 8, caseStatusName: "案件进展阶段立案待结" },
        { caseStatusId: 9, caseStatusName: "案件进展阶段结案报批" },
        { caseStatusId: 10, caseStatusName: "案件进展阶段已经结案" },
        { caseStatusId: 11, caseStatusName: "案件进展阶段已经归档" }
      ],
      caseCheckTypeArray: [
        {
          caseCheckType: 0,
          caseCheckTypeName: "简单校验"
        },
        {
          caseCheckType: 1,
          caseCheckTypeName: "严格校验"
        }
      ],
      addParams: {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        caseStatus: "",
        caseStatusName: "",
        caseCheckType: "",
        caseCheckTypeName: ""
      },
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
    getInvalid(value) {
      switch (value) {
        case 0:
          value = "未开放";
          break;
        case 1:
          value = "自由更新";
          break;
        case 2:
          value = "强制更新";
          break;
        case 3:
          break;
        default:
          value = "--";
          break;
      }
      return value;
    },
    async handleSearch() {
      // this.listLoading = true;
      try {
        const { data: caseInfoList } = await getAllCheckList();
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
      } catch {
        this.caseInfoList = [];
        // this.$message({
        //   message: "无相关案件信息",
        //   type: "success"
        // });
      }
    },
    addServerOpen() {
      this.addParams = {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        caseStatus: "",
        caseStatusName: "",
        caseCheckType: "",
        caseCheckTypeName: ""
      };
      this.dialogFormVisible = true;
    },
    addCancle() {
      this.dialogFormVisible = false;
      this.addParams = {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        caseStatus: "",
        caseStatusName: "",
        caseCheckType: "",
        caseCheckTypeName: ""
      };
    },
    addSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addSaveServer();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async addSaveServer() {
      try {
        await addCaseCheck(this.addParams);
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
      this.addParams = {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        caseStatus: "",
        caseStatusName: "",
        caseCheckType: "",
        caseCheckTypeName: ""
      };
    },
    editServer() {
      this.editFormVisible = true;
    },
    editCancle() {
      this.editFormVisible = false;
      this.addParams = {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        caseStatus: "",
        caseStatusName: "",
        caseCheckType: "",
        caseCheckTypeName: ""
      };
    },
    editSaveOpen(row) {
      this.addParams.caseTypeId = row.caseTypeId;
      this.addParams.caseTypeName = row.caseTypeName;
      this.addParams.spcxId = row.spcxId;
      this.addParams.spcxName = row.spcxName;
      this.addParams.caseStatus = row.caseStatus;
      this.addParams.caseStatusName = row.caseStatusName;
      this.addParams.caseCheckType = row.caseCheckType;
      this.addParams.caseCheckTypeName = row.caseCheckTypeName;
      this.getAddAllSpcxList(row.caseTypeId);
      let self = this;
      setTimeout(() => {
        self.editFormVisible = true;
      }, 500);
    },
    async editSaveServer() {
      try {
        await editCaseCheck(this.addParams);
        this.$message({
          message: "编辑成功!",
          type: "success"
        });
        this.handleSearch();
      } catch {
        this.$message({
          message: "编辑失败!",
          type: "error"
        });
      }
      this.editFormVisible = false;
      this.addParams = {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        caseStatus: "",
        caseStatusName: "",
        caseCheckType: "",
        caseCheckTypeName: ""
      };
    },
    async deleteServer(serverId) {
      try {
        await delCaseCheck(serverId);
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success"
        });
        this.handleSearch();
      } catch {
        this.$message({
          showClose: true,
          message: "删除失败,请联系管理员!",
          type: "error"
        });
      }
    },
    delServer(row) {
      this.serverId.caseTypeId = row.caseTypeId;
      this.serverId.spcxId = row.spcxId;
      this.serverId.caseStatus = row.caseStatus;
      this.$confirm("确定删除此信息吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteServer(this.serverId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          this.serverId.caseTypeId = "";
          this.serverId.spcxId = "";
          this.serverId.caseStatus = "";
        });
    },
    getCaseStatus(state) {
      switch (state) {
        case 1:
          state = "案件进展阶段新移送";
          break;
        case 2:
          state = "案件进展阶段立案登记";
          break;
        case 3:
          state = "案件进展阶段立案审查";
          break;
        case 4:
          state = "案件进展阶段立案审批";
          break;
        case 5:
          state = "案件进展阶段等待分派";
          break;
        case 6:
          state = "案件进展阶段等待确认";
          break;
        case 7:
          state = "案件进展阶段正在审理";
          break;
        case 8:
          state = "案件进展阶段立案待结";
          break;
        case 9:
          state = "案件进展阶段结案报批";
          break;
        case 10:
          state = "案件进展阶段已经结案";
          break;
        case 11:
          state = "案件进展阶段已经归档";
          break;
        default:
          state = "";
      }
      return state;
    },
    getSpcxName(item) {
      let _that = this;
      _that.allSplcList.forEach(element => {
        if (element.spcx_id == item) {
          _that.addParams.spcxName = element.spcx_name;
        }
      });
    },
    getCheckTypeName(item) {
      switch (item) {
        case 0:
          this.addParams.caseCheckTypeName = "简单校验";
          break;
        case 1:
          this.addParams.caseCheckTypeName = "严格校验";
          break;
        default:
          break;
      }
    },
    getCaseStatusName(item) {
      switch (item) {
        case 1:
          this.addParams.caseStatusName = "案件进展阶段新移送";
          break;
        case 2:
          this.addParams.caseStatusName = "案件进展阶段立案登记";
          break;
        case 3:
          this.addParams.caseStatusName = "案件进展阶段立案审查";
          break;
          this.addParams.caseStatusName = "案件进展阶段立案审批";
        case 4:
          break;
        case 5:
          this.addParams.caseStatusName = "案件进展阶段等待分派";
          break;
        case 6:
          this.addParams.caseStatusName = "案件进展阶段等待确认";
          break;
        case 7:
          this.addParams.caseStatusName = "案件进展阶段正在审理";
          break;
        case 8:
          this.addParams.caseStatusName = "案件进展阶段立案待结";
          break;
        case 9:
          this.addParams.caseStatusName = "案件进展阶段结案报批";
          break;
        case 10:
          this.addParams.caseStatusName = "案件进展阶段已经结案";
          break;
        case 11:
          this.addParams.caseStatusName = "案件进展阶段已经归档";
          break;
        default:
          break;
      }
    },
    getAddAllSpcxList(id) {
      let _that = this;
      _that.allCaseTypeList.forEach(element => {
        if (element.case_type_id == id) {
          _that.addParams.caseTypeName = element.case_type_name;
        }
      });
      _that.$store
        .dispatch("common/queryAllSplcList", {
          case_type_id: id
        })
        .then(res => {
          // console.log(this.allSplcList)
        })
        .catch(() => {
          _that.$message({
            message: "获取审判程序列表失败",
            type: "error",
            duration: 5 * 1000
          });
        });
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
