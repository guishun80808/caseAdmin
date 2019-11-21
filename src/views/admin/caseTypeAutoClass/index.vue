<template>
  <div id="courtList" class="caseTypeCourt">
    <el-row :gutter="10" style="margin:0">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-button type="primary" icon="el-icon-plus" @click="onAddDir">新增</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="onEditUser">编辑</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="onDelDir">删除</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 分类目录展示 -->
    <el-row :gutter="10" style="margin:0" class="userTableRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple-light">
          <el-table
            ref="singleTable"
            highlight-current-row
            :data="AutoClassInfoList"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            @current-change="handleCurrentChange"
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            height="760"
          >
            <el-table-column prop="ml" label="目录名称" sortable width="420" label-class-name="use"></el-table-column>
            <el-table-column prop="wsmc" label="目录识别名称" sortable width="500"></el-table-column>
            <el-table-column prop="sblx" label="识别类型"></el-table-column>
            <el-table-column prop="bz" label="区分标志"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- add目录-->
    <el-row>
      <el-dialog title="添加目录信息" :visible.sync="addDirVisible">
        <el-form ref="form" :model="addDirectoryForm" :rules="rules" label-width="120px">
          <el-form-item label="目录名称：" prop="ml">
            <el-input v-model="addDirectoryForm.ml"></el-input>
          </el-form-item>
          <el-form-item label="识别名称：" prop="wsmc">
            <el-input v-model="addDirectoryForm.wsmc"></el-input>
          </el-form-item>
          <el-form-item label="识别类型：" prop>
            <el-input v-model="addDirectoryForm.sblx"></el-input>
          </el-form-item>
          <el-form-item label="区分标志：" prop>
            <el-input v-model="addDirectoryForm.bz"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDirVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddDirSure()">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
    <!-- edit目录-->
    <el-row>
      <el-dialog title="编辑目录" :visible.sync="editDirVisible">
        <el-form ref="form" :model="addDirectoryForm" :rules="rules" label-width="120px">
          <el-form-item label="目录名称：" prop="ml">
            <el-input v-model="addDirectoryForm.ml"></el-input>
          </el-form-item>
          <el-form-item label="识别名称：" prop="wsmc">
            <el-input v-model="addDirectoryForm.wsmc"></el-input>
          </el-form-item>
          <el-form-item label="识别类型：" prop>
            <el-input v-model="addDirectoryForm.sblx"></el-input>
          </el-form-item>
          <el-form-item label="区分标志：" prop>
            <el-input v-model="addDirectoryForm.bz"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDirVisible = false">取 消</el-button>
          <el-button type="primary" @click="eidtDirSure()">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {getAutoClassInfor,newAddRecong,newDeleteRecong,updateRecong,} from "@/api/admin/caseTypeManage";
export default {
  data() {
    return {
      id: "",
      directory_id: "",
      dirModelId: "",
      AutoClassInfoList: [],
      listLoading: false,
      addDirVisible: false,
      editDirVisible: false,
      formLabelWidth: "120px",

      addDirectoryForm: {
        bz: "",
        directoryModelId: "",
        ml: "",
        sblx: "",
        ssjlx: "",
        wsmc: ""
      },
     
      rules: {
        ml: [
          { required: true, message: "请输入目录名称", trigger: "blur" },
          { min: 0, message: "目录名称不能为空", trigger: "blur" }
        ],
        wsmc: [
          { required: true, message: "请输入识别名称", trigger: "blur" },
          { min: 0, message: "目录类型不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    // ...mapGetters(["allRoleList"])
  },
  created() {
    this.dirModelId = this.$route.query.directory_model_id;
  },
  mounted() {
    this.getAutoClassInfor();
  },
  watch: {},
  methods: {
    async getAutoClassInfor() {
      this.listLoading = true;
      try {
        const { data: AutoClassInfo } = await getAutoClassInfor({
          dirModelId: this.dirModelId
        });
        // this.AutoClassInfoList = AutoClassInfo;
        this.AutoClassInfoList = [];
        let zj = {
          ml: "正卷",
          parent_id: 0,
          children: AutoClassInfo.zj,
          ssjlx: "zj",
          id: 1
        };
        this.AutoClassInfoList.push(zj);
        let fj = {
          ml: "副卷",
          parent_id: 0,
          children: AutoClassInfo.fj,
          ssjlx: "fj",

          id: 2
        };
        this.AutoClassInfoList.push(fj);
        // this.directory_Typename(this.caseTypeDetailList);
        this.listLoading = false;
      } catch {
        this.caseTypeDetailList = [];
        this.listLoading = false;
        this.$message({
          message: "无自动分类信息",
          type: "success"
        });
      }
    },
   //分类目录删除
    async newDeleteRecong(id) {
      this.listLoading = true;
      try {
        const { code: code } = await newDeleteRecong({
          id: id
        });
        this.listLoading = false;
        if (code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          // this.queryAllDirectories();
          this.getAutoClassInfor();
        }

        //刷新角色列表
        //  this.getAllRoleList();
      } catch {
        this.$message({
          message: "删除失败",
          type: "success"
        });
      }
    },
    //添加分类目录接口
    async newAddRecong(data) {
      this.listLoading = true;
      try {
        const { code: code } = await newAddRecong(this.addDirectoryForm);
        this.listLoading = false;
        if (code == 0) {
          this.$message({
            message: "添加分类目录成功",
            type: "success"
          });
          this.addDirVisible = false;
          // this.queryAllDirectories();
          this.getAutoClassInfor();
        }
      } catch {
        // this.listLoading = false;
        this.$message({
          message: "添加分类目录失败",
          type: "success"
        });
      }
    },
    //修改分类目录接口
    async updateRecong(data) {
      this.listLoading = true;
      try {
        const { code: code } = await updateRecong(this.addDirectoryForm);
        this.listLoading = false;
        if (code == 0) {
          this.$message({
            message: "修改分类目录成功",
            type: "success"
          });
          this.editDirVisible = false;
          // this.queryAllDirectories();
          this.getAutoClassInfor();

        }
      } catch {
        // this.listLoading = false;
        this.$message({
          message: "修改分类目录失败",
          type: "success"
        });
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    //添加分类目录触发事件
    onAddDir() {
      if (this.currentRow == null) {
        this.$message({
          message: "请选择添加子目录的目录",
          warn: "success"
        });
        return;
      }
      this.addDirVisible = true;
      this.addDirectoryForm = {
        bz: "",
        directoryModelId: "",
        ml: "",
        sblx: "",
        ssjlx: "",
        wsmc: ""
      };
      this.addDirectoryForm.directoryModelId = this.dirModelId;
      this.addDirectoryForm.ssjlx = this.currentRow.ssjlx;
    },
    AddDirSure() {
      if (this.addDirectoryForm.ml == "") {
        this.$message({
          message: "目录名称必须的",
          type: "warn"
        });
        return;
      }
      if (this.addDirectoryForm.wsmc == "") {
        this.$message({
          message: "识别名称必须的",
          type: "warn"
        });
        return;
      }
      this.newAddRecong(this.addDirectoryForm);
    },

    // 编辑用户弹出框框
    onEditUser() {
      if (this.currentRow == null) {
        this.$message({
          message: "请选择要编辑的分类目录",
          type: "success"
        });
        return;
      } else {
        this.editDirVisible = true;
        this.addDirectoryForm = {
          bz: "",
          directoryModelId: "",
          ml: "",
          sblx: "",
          ssjlx: "",
          wsmc: ""
        };
        this.addDirectoryForm = this.currentRow;
      }
    },
    eidtDirSure() {
      if (this.addDirectoryForm.ml == "") {
        this.$message({
          message: "目录名称必须的",
          type: "warn"
        });
        return;
      }
      if (this.addDirectoryForm.wsmc == "") {
        this.$message({
          message: "识别名称必须的",
          type: "warn"
        });
        return;
      }
      this.updateRecong(this.addDirectoryForm);
    },

    //删除分类目录
    onDelDir() {
      if (this.currentRow == null) {
        this.$message({
          message: "请选择要删除的分类目录",
          type: "success"
        });
        return;
      } else {
        this.id = this.currentRow.id;
        this.open(this.id);
      }
    },
    open() {
      this.$confirm("此操作将永久删除该分类目录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.newDeleteRecong(this.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
   
    
  },
  components: {}
};
</script>

<style scoped lang="scss">
.el-row {
  margin: 0;
}
.grid-content {
  margin-bottom: 15px;
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 200px;
}
.el-form-item {
  margin-right: 20px;
}
.userTableRow {
  height: 760px;
  // overflow-y: scroll;
}
.pageRow {
  margin-top: 15px;
}
.el-dialog {
  width: 500px;
}
.el-table td,
.el-table th {
  text-align: center;
}
</style>
