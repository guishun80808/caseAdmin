<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-18 16:50:56
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
             v-auth="['clientServer:add']"
            @click="addServerOpen"
          >新增</el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-s-tools"
            v-show="true"
            v-auth="['clientServer:switch']"
            @click="functionMan"
          >功能开关</el-button>
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
        <el-table-column prop="serverProvince" label="省" width></el-table-column>
        <el-table-column prop="serverCity" label="市" width></el-table-column>
        <el-table-column prop="primaryServerIp" label="主服务器" width></el-table-column>
        <el-table-column prop="fuzzySearchIp" label="模糊搜索" width></el-table-column>
        <el-table-column prop="ocrIp" label="OCR识别" width></el-table-column>
        <el-table-column prop="deepLearnIp" label="深度学习" width></el-table-column>
        <el-table-column prop="huayuCaseIp" label="查询华宇" width></el-table-column>
        <el-table-column prop="otherIp" label="其他" width></el-table-column>
        <el-table-column prop="anotherIp" label="额外其他" width></el-table-column>
        <el-table-column label="是否使用" width>
          <template slot-scope="scope">{{ scope.row.invalidFlag==0?"使用":"不使用" }}</template>
        </el-table-column>
        <el-table-column label="开放更新" width>
          <template slot-scope="scope">{{ getInvalid( scope.row.updateFlag )}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="editSaveOpen(scope.row)" type="text" size="small" v-auth="['clientServer:update']">编辑</el-button>
            <el-button @click="delServer(scope.row)" type="text" style="color: red;" size="small" v-auth="['clientServer:delete']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新增服务器" :visible.sync="dialogFormVisible">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="省" prop="serverProvince">
            <el-input v-model="ruleForm.serverProvince"></el-input>
          </el-form-item>
          <el-form-item label="市" prop="serverCity">
            <el-input v-model="ruleForm.serverCity"></el-input>
          </el-form-item>
          <el-form-item label="主服务器" prop="primaryServerIp">
            <el-input v-model="ruleForm.primaryServerIp"></el-input>
          </el-form-item>
          <el-form-item label="模糊搜索" prop="fuzzySearchIp">
            <el-input v-model="ruleForm.fuzzySearchIp"></el-input>
          </el-form-item>
          <el-form-item label="OCR识别" prop="ocrIp">
            <el-input v-model="ruleForm.ocrIp"></el-input>
          </el-form-item>
          <el-form-item label="深度学习" prop="deepLearnIp">
            <el-input v-model="ruleForm.deepLearnIp"></el-input>
          </el-form-item>
          <el-form-item label="查询华宇" prop="huayuCaseIp">
            <el-input v-model="ruleForm.huayuCaseIp"></el-input>
          </el-form-item>
          <el-form-item label="其他" prop="otherIp">
            <el-input v-model="ruleForm.otherIp"></el-input>
          </el-form-item>
          <el-form-item label="额外其他" prop="anotherIp">
            <el-input v-model="ruleForm.anotherIp"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancle">取 消</el-button>
          <el-button type="primary" @click="addSave">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑服务器" :visible.sync="editFormVisible">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="省" prop="serverProvince">
            <el-input v-model="ruleForm.serverProvince"></el-input>
          </el-form-item>
          <el-form-item label="市" prop="serverCity">
            <el-input v-model="ruleForm.serverCity"></el-input>
          </el-form-item>
          <el-form-item label="主服务器" prop="primaryServerIp">
            <el-input v-model="ruleForm.primaryServerIp"></el-input>
          </el-form-item>
          <el-form-item label="模糊搜索" prop="fuzzySearchIp">
            <el-input v-model="ruleForm.fuzzySearchIp"></el-input>
          </el-form-item>
          <el-form-item label="OCR识别" prop="ocrIp">
            <el-input v-model="ruleForm.ocrIp"></el-input>
          </el-form-item>
          <el-form-item label="深度学习" prop="deepLearnIp">
            <el-input v-model="ruleForm.deepLearnIp"></el-input>
          </el-form-item>
          <el-form-item label="查询华宇" prop="huayuCaseIp">
            <el-input v-model="ruleForm.huayuCaseIp"></el-input>
          </el-form-item>
          <el-form-item label="其他" prop="otherIp">
            <el-input v-model="ruleForm.otherIp"></el-input>
          </el-form-item>
          <el-form-item label="额外其他" prop="anotherIp">
            <el-input v-model="ruleForm.anotherIp"></el-input>
          </el-form-item>
          <el-form-item label="是否使用">
            <el-select v-model="ruleForm.invalidFlag" clearable placeholder="请选择是否使用">
            <el-option
              v-for="item in invalidFlagArray"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="开放更新" >
             <el-select v-model="ruleForm.updateFlag" clearable placeholder="请选择开放更新">
            <el-option
              v-for="item in updateFlagArray"
              :key="item.value"
              :label="item.text"
              :value="item.value"
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
  getAllServes,
  addServer,
  updateServer,
  deleteServer
} from "@/api/systemMain/serverManager";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
export default {
  directives: { waves },
  computed: {
    ...mapGetters(["allCourtList", "allCaseTypeList"])
  },
  data() {
    return {
      invalidFlagArray: [
        {
          value: 0,
          text: "使用"
        },
        {
          value: 1,
          text: "不使用"
        }
      ],
      updateFlagArray: [
        {
          value: 0,
          text: "未开放"
        },
        {
          value: 1,
          text: "自由更新"
        },
        {
          value: 2,
          text: "强制更新"
        }
      ],
      caseInfoList: [],
      downloadLoading: false,
      dialogFormVisible: false,
      editFormVisible: false,
      ruleForm: {
        anotherIp: "",
        deepLearnIp: "",
        fuzzySearchIp: "",
        huayuCaseIp: "",
        ocrIp: "",
        otherIp: "",
        primaryServerIp: "",
        serverCity: "",
        serverProvince: ""
      },
      serverId: { serverId: "" },
      rules: {
        serverProvince: [
          { required: true, message: "请输入省", trigger: "blur" }
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        serverCity: [{ required: true, message: "请输入市", trigger: "blur" }],
        primaryServerIp: [
          { required: true, message: "请输入主服务器", trigger: "blur" }
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
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
      } catch {
        this.caseInfoList = [];
        // this.$message({
        //   message: "无相关案件信息",
        //   type: "success"
        // });
      }
    },
    addServerOpen() {
      this.ruleForm = {
        anotherIp: "",
        deepLearnIp: "",
        fuzzySearchIp: "",
        huayuCaseIp: "",
        ocrIp: "",
        otherIp: "",
        primaryServerIp: "",
        serverCity: "",
        serverProvince: ""
      };
      this.dialogFormVisible = true;
    },
    addCancle() {
      this.dialogFormVisible = false;
      this.ruleForm = {
        anotherIp: "",
        deepLearnIp: "",
        fuzzySearchIp: "",
        huayuCaseIp: "",
        ocrIp: "",
        otherIp: "",
        primaryServerIp: "",
        serverCity: "",
        serverProvince: ""
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
        await addServer(this.ruleForm);
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
        anotherIp: "",
        deepLearnIp: "",
        fuzzySearchIp: "",
        huayuCaseIp: "",
        ocrIp: "",
        otherIp: "",
        primaryServerIp: "",
        serverCity: "",
        serverProvince: ""
      };
    },
    editServer() {
      this.editFormVisible = true;
    },
    editCancle() {
      this.editFormVisible = false;
      this.ruleForm = {
        anotherIp: "",
        deepLearnIp: "",
        fuzzySearchIp: "",
        huayuCaseIp: "",
        ocrIp: "",
        otherIp: "",
        primaryServerIp: "",
        serverCity: "",
        serverProvince: ""
      };
    },
    editSaveOpen(row) {
      this.ruleForm = {
        anotherIp: row.anotherIp,
        deepLearnIp: row.deepLearnIp,
        fuzzySearchIp: row.fuzzySearchIp,
        huayuCaseIp: row.huayuCaseIp,
        ocrIp: row.ocrIp,
        otherIp: row.otherIp,
        primaryServerIp: row.primaryServerIp,
        serverCity: row.serverCity,
        serverProvince: row.serverProvince,
        serverId: row.serverId,
        invalidFlag:row.invalidFlag,
        updateFlag:row.updateFlag
      };
      this.editFormVisible = true;
    },
    async editSaveServer() {
      try {
        await updateServer(this.ruleForm);
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
      this.ruleForm = {
        anotherIp: "",
        deepLearnIp: "",
        fuzzySearchIp: "",
        huayuCaseIp: "",
        ocrIp: "",
        otherIp: "",
        primaryServerIp: "",
        serverCity: "",
        serverProvince: ""
      };
    },
    async deleteServer(serverId) {
      try {
        await deleteServer(serverId);
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
    delServer(row) {
      this.serverId.serverId = row.serverId;
      this.$confirm("确定删除此服务器吗, 是否继续?", "提示", {
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
          this.serverId.serverId = "";
        });
    },
    functionMan() {
      this.$router.push({ name: "FunManager" });
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
