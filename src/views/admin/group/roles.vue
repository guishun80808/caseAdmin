<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-19 15:33:03
 * @LastEditTime: 2019-10-18 13:07:10
 * @LastEditors: GuiShun
 -->
<template>
  <div id="groupRole">
    <el-row :gutter="10" style="margin:0">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <!-- <el-form-item label="组名称：">
              <el-input v-model="params.groupName" placeholder="请输入" class="search_input"></el-input>
            </el-form-item>-->
            <el-form-item>
              <!-- <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button> -->
              <el-button type="primary" icon="el-icon-plus" @click="onAddGroup">新增</el-button>
              <!-- <el-button type="primary" @click="onReset">重置</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="table-content">
      <el-table :data="grouprolesInfo" style="width: 100%" border height="750">
        <el-table-column type="index" label width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="resourceName" label="资源名称"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="onEditGroup(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain @click="onDelGroup(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- addGroup -->
    <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width="25%">
      <el-form
        ref="formParams"
        :model="formParams"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色">
          <el-select v-model="formParams.roleId" :clearable="clearable" placeholder="请选择">
            <el-option
              v-for="item in allRoleList"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源" prop="resId">
          <el-select v-model="formParams.resId" :clearable="clearable" placeholder="请选择">
            <el-option
              v-for="item in allResList"
              :key="item.resourceId"
              :label="item.resourceName"
              :value="item.resourceId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGroupCancel">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchGroupList,
  addGroupRole,
  editGroupRole,
  delGroupRole,
  queryGroupById
} from "@/api/admin/group";
import { searchResList } from "@/api/admin/resource";
import { getRoles } from "@/api/admin/role";
import { mapState, mapGetters } from "vuex";
export default {
  props: {},
  data() {
    return {
      clearable: true,
      grouprolesInfo: [],
      allRoleList: [],
      allResList: [],
      params: {
        current_page: 1,
        page_size: 10
      },
      total: 0,
      formParams: {
        roleId: "",
        resId: "",
        groupId: "",
        id: ""
      },
      rules: {
        resId: [
          // { required: true, message: "请选择资源", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入组描述", trigger: "blur" }
        ]
      },
      groupsData: [],
      dialogFormVisible: false,
      dialogFormRoles: false,
      dialogFormJobs: false,
      diaTitle: "",
      groupShow: false,
      groupId: {
        groupId: ""
      }
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    })
  },
  created() {},
  mounted() {
    let grouprolesdatas = sessionStorage.getItem("grouprolesdatas");
    this.grouprolesInfo = JSON.parse(grouprolesdatas).groupRoleResourceVoList;
    this.groupId.groupId = JSON.parse(grouprolesdatas).groupId;
    this.formParams.groupId = JSON.parse(grouprolesdatas).groupId;
    this.getAllResList();
    this.getAllRole();
    this.onSearch();
    this.groupHide();
  },
  watch: {},
  methods: {
    async getAllResList() {
      try {
        const { data } = await searchResList();
        this.allResList = data;
      } catch (err) {
        // this.$message({
        //   message: "无相关数据",
        //   type: "warning"
        // });
      }
    },
    async getAllRole() {
      try {
        const { data } = await getRoles();
        this.allRoleList = data;
      } catch (err) {
        // this.$message({
        //   message: "无相关数据",
        //   type: "warning"
        // });
      }
    },
    groupHide() {
      this.$emit("hideGroup", "false");
    },
    async onSearch() {
      try {
        const { data } = await queryGroupById(this.groupId);
        this.grouprolesInfo = data.groupRoleResourceVoList;
      } catch (err) {
        this.grouprolesInfo = [];
        this.$message({
          message: "无相关数据",
          type: "warning"
        });
      }
    },
    onAddGroup() {
      delete this.formParams.id;
      this.diaTitle = "新增";
      this.dialogFormVisible = true;
      this.clearable = true;
    },
    async addGroup() {
      if (this.formParams.roleId === "") {
        this.$message({
          message: "角色不能为空",
          type: "warning"
        });
        return;
      }
      try {
        const { data } = await addGroupRole(this.formParams);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.onSearch();
        this.formParams.id = "";
        this.formParams.roleId = "";
        this.formParams.resId = "";
      } catch {
        this.$message({
          message: "新增失败",
          type: "error"
        });
      }
    },
    saveAddGroup() {
      this.$refs.formParams.validate(valid => {
        if (valid) {
          this.addGroup();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onReset() {
      this.params.groupName = "";
    },
    onEditGroup(row) {
      this.formParams.id = row.id;
      this.formParams.roleId = row.roleId;
      this.formParams.resId = row.resId;
      this.dialogFormVisible = true;
      this.clearable = false;
      this.diaTitle = "编辑";
    },
    async editGroup() {
      try {
        const { data } = await editGroupRole(this.formParams);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.onSearch();
        this.formParams.id = "";
        this.formParams.roleId = "";
        this.formParams.resId = "";
      } catch {
        this.$message({
          message: "编辑失败",
          type: "error"
        });
      }
    },
    saveEditGroup() {
      this.$refs.formParams.validate(valid => {
        if (valid) {
          this.editGroup();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async delGroup(param) {
      try {
        const { data } = await delGroupRole(param);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.onSearch();
      } catch {
        this.$message({
          message: "删除失败,请联系管理员!",
          type: "error"
        });
      }
    },
    onDelGroup(row) {
      let param = { id: row.id };
      this.$confirm("确定删除此组吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delGroup(param);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          param.groupId = "";
        });
    },
    save() {
      if (this.diaTitle == "新增") {
        this.saveAddGroup();
      } else if (this.diaTitle == "编辑") {
        this.saveEditGroup();
      }
    },
    addGroupCancel() {
      this.dialogFormVisible = false;
      this.formParams.id = "";
      this.formParams.roleId = "";
      this.formParams.resId = "";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.pager {
  margin-top: 20px;
}
</style>
<style>
#group .el-select {
  display: block;
}
</style>
