<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-24 09:18:32
 * @LastEditors: GuiShun
 -->
<template>
  <div>
    <div class="filter-container">
      <el-row>
        <el-col :span="3" class="first-input">
          <el-input placeholder="请输入配置名称" v-model="paramsData.propertyName" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="paramsData.updateFlag" clearable placeholder="请选择能否修改">
            <el-option
              v-for="item in updateFlagList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" class="btn-box">
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
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-plus"
            v-auth="['commonProperty:add']"
            @click="addPropertyOpen"
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
        <el-table-column type="index" label width="50"></el-table-column>
        <el-table-column prop="propertyName" label="配置名称" width></el-table-column>
        <el-table-column prop="propertyValue" label="配置值" width></el-table-column>
        <el-table-column prop="propertyDesc" label="配置描述" width></el-table-column>
        <el-table-column label="能否修改" width>
          <template slot-scope="scope">{{ scope.row.updateFlag==0?"可以修改":"不可修改" }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template
            slot-scope="scope"
          >{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              @click="editProperty(scope.row)"
              type="text"
              size="small"
              v-auth="['commonProperty:update']"
            >编辑</el-button>
            <el-button
              @click="deleProperty(scope.row)"
              type="text"
              style="color: red;"
              size="small"
              v-auth="['commonProperty:delete']"
            >删除</el-button>
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
      <el-dialog title="新增配置" :visible.sync="dialogFormVisible">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="配置名称" prop="propertyName">
            <el-input v-model="ruleForm.propertyName"></el-input>
          </el-form-item>
          <el-form-item label="配置值" prop="propertyValue">
            <el-input v-model="ruleForm.propertyValue"></el-input>
          </el-form-item>
          <el-form-item label="配置描述" prop="propertyDesc">
            <el-input v-model="ruleForm.propertyDesc"></el-input>
          </el-form-item>
          <el-form-item label="能否修改" prop="updateFlag">
            <el-select v-model="ruleForm.updateFlag" placeholder="请选择能否修改">
              <el-option label="可以修改" value="0"></el-option>
              <el-option label="不可修改" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancle">取 消</el-button>
          <el-button type="primary" @click="addSave">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑配置" :visible.sync="editFormVisible">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="配置名称" prop="propertyName">
            <el-input v-model="ruleForm.propertyName"></el-input>
          </el-form-item>
          <el-form-item label="配置值" prop="propertyValue">
            <el-input v-model="ruleForm.propertyValue"></el-input>
          </el-form-item>
          <el-form-item label="配置描述" prop="propertyDesc">
            <el-input v-model="ruleForm.propertyDesc"></el-input>
          </el-form-item>
          <el-form-item label="能否修改">
            <el-select v-model="ruleForm.updateFlag" prop="updateFlag" placeholder="请选择能否修改">
              <el-option
                v-for="item in allFlagg"
                :key="item.updateFlag"
                :label="item.name"
                :value="item.updateFlag"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCancle">取 消</el-button>
          <el-button type="primary" @click="editSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  getAllProperty,
  addProperty,
  updateProperty,
  deleteProperty
} from "@/api/systemMain/comProperty";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { setTimeout } from "timers";
export default {
  directives: { waves },
  computed: {
    ...mapGetters(["allCourtList", "allCaseTypeList"])
  },
  data() {
    return {
      allFlagg: [
        {
          updateFlag: 0,
          name: "可以修改"
        },
        {
          updateFlag: 1,
          name: "不可修改"
        }
      ],
      paramsData: {
        current_page: 1,
        page_size: 20,
        propertyName: null, //配置名称
        updateFlag: null, //能否修改
        pages: 1,
        total: 0
      },
      propertyId: { propertyId: "" },
      updateFlagList: [
        {
          value: 0,
          text: "可以修改"
        },
        {
          value: 1,
          text: "不可修改"
        }
      ],
      caseInfoList: [],
      dialogFormVisible: false,
      editFormVisible: false,
      downloadLoading: false,
      ruleForm: {
        propertyName: "",
        propertyValue: "",
        propertyDesc: "",
        updateFlag: ""
      },
      rules: {
        propertyName: [
          { required: true, message: "请输入配置名称", trigger: "blur" }
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        propertyValue: [
          { required: true, message: "请输入配置值", trigger: "blur" }
        ],
        updateFlag: [
          { required: true, message: "请选择能否修改", trigger: "change" }
        ]
      },
      formLabelWidth: "120px",
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
        const { data: caseInfoList, total } = await getAllProperty(
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
        // this.$message({
        //   message: "无相关案件信息",
        //   type: "success"
        // });
      }
    },
    handleReset() {
      this.paramsData.propertyName = "";
      this.paramsData.updateFlag = "";
    },
    editProperty(row) {
      this.ruleForm.propertyId = row.propertyId;
      this.ruleForm.propertyName = row.propertyName;
      this.ruleForm.propertyValue = row.propertyValue;
      this.ruleForm.propertyDesc = row.propertyDesc;
      this.ruleForm.updateFlag = row.updateFlag;
      this.editFormVisible = true;
    },
    async saveDelProperty(propertyId) {
      try {
        await deleteProperty(propertyId);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.paramsData = {
          propertyName: null, //配置名称
          updateFlag: null //能否修改
        };
        this.handleSearch(1);
      } catch {
        this.$message({
          message: "删除失败",
          type: "error"
        });
      }
    },
    deleProperty(row) {
      this.propertyId.propertyId = row.propertyId;
      this.$confirm("确定删除此配置吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.saveDelProperty(this.propertyId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.handleSearch(1);
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.handleSearch(currentPge);
    },
    addPropertyOpen() {
      this.dialogFormVisible = true;
      // console.log(this.ruleForm);
    },
    addCancle() {
      this.dialogFormVisible = false;
      this.ruleForm = {
        propertyName: "",
        propertyValue: "",
        propertyDesc: "",
        updateFlag: ""
      };
    },
    editCancle() {
      this.editFormVisible = false;
      this.ruleForm = {
        propertyName: "",
        propertyValue: "",
        propertyDesc: "",
        updateFlag: ""
      };
    },
    async addProperty() {
      try {
        await addProperty(this.ruleForm);
        this.$message({
          showClose: true,
          message: "新增成功",
          type: "success"
        });
        this.handleSearch(1);
      } catch {
        this.$message({
          showClose: true,
          message: "新增失败",
          type: "error"
        });
      }
      this.dialogFormVisible = false;
      this.ruleForm = {
        propertyName: "",
        propertyValue: "",
        propertyDesc: "",
        updateFlag: ""
      };
    },
    async updateProperty() {
      try {
        const { data } = await updateProperty(this.ruleForm);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.handleSearch(1);
      } catch {
        // this.$message({
        //   message: "编辑失败",
        //   type: "error"
        // });
      }
      this.editFormVisible = false;
      this.ruleForm = {
        propertyName: "",
        propertyValue: "",
        propertyDesc: "",
        updateFlag: ""
      };
    },
    editSave() {
      if (/[@\/'\\"#$%&\^*]/.test(this.ruleForm.propertyName)) {
        //特殊字符
        this.$message({
          message: "配置名称有特殊字符",
          type: "error"
        });
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.updateProperty();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addSave() {
      if (/[@\/'\\"#$%&\^*]/.test(this.ruleForm.propertyName)) {
        //特殊字符
        this.$message({
          message: "配置名称有特殊字符",
          type: "error"
        });
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addProperty();
        } else {
          console.log("error submit!!");
          return false;
        }
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
.content .el-table {
  margin-bottom: 10px;
}
</style>
