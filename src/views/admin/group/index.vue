<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-19 15:33:03
 * @LastEditTime: 2019-10-24 10:12:58
 * @LastEditors: GuiShun
 -->
<template>
  <div id="group">
    <div v-if="groupShow">
      <el-row :gutter="10" style="margin:0">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple">
            <el-form :inline="true" :model="params" class="demo-form-inline">
              <!-- <el-form-item label="组名称：">
                <el-input v-model="params.groupName" placeholder="请输入" class="search_input"></el-input>
              </el-form-item>-->
              <el-form-item>
                <!-- <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button> -->
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  v-auth="['group:add']"
                  @click="onAddGroup"
                >新增</el-button>
                <!-- <el-button type="primary" @click="onReset">重置</el-button> -->
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div class="table-content">
        <el-table :data="groupsData" style="width: 100%" border height="710">
          <el-table-column type="index" label width="50"></el-table-column>
          <el-table-column prop="groupName" label="组名称"></el-table-column>
          <el-table-column prop="createUserName" label="创建人"></el-table-column>
          <el-table-column label="创建时间" width="180">
            <template
              slot-scope="scope"
            >{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
          </el-table-column>
          <el-table-column label="上次更新时间" width="180">
            <template
              slot-scope="scope"
            >{{ scope.row.lastUpdateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
          </el-table-column>
          <el-table-column prop="description" label="组描述"></el-table-column>
          <el-table-column label="部门职务列表">
            <template slot-scope="scope">
              <span
                size="mini"
                type="primary"
                style="cursor: pointer;color: #409EFF;"
                plain
                v-auth="['groupDeptJob:list']"
                @click="jobsSearch(scope.row)"
              >查看详情</span>
            </template>
          </el-table-column>
          <el-table-column label="角色资源列表">
            <template slot-scope="scope">
              <span
                size="mini"
                type="primary"
                style="cursor: pointer;color: #409EFF;"
                plain
                v-auth="['groupRoleResource:list']"
                @click="rolesSearch(scope.row)"
              >查看详情</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="onEditGroup(scope.row)"
                v-auth="['group:update']"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="onDelGroup(scope.row)"
                v-auth="['group:delete']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
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
          <el-form-item label="组名称：" prop="groupName">
            <el-input v-model="formParams.groupName" placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
          <el-form-item label="组描述：" prop="description">
            <el-input v-model="formParams.description" placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addGroupCancel">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view @hideGroup="hideGroup($event)"></router-view>
  </div>
</template>

<script>
import {
  searchGroupList,
  addGroup,
  editGroup,
  delGroup
} from "@/api/admin/group";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
export default {
  props: {},
  data() {
    return {
      groupShow: true,
      allRoleList: [],
      allResList: [],
      params: {
        current_page: 1,
        page_size: 10
      },
      total: 0,
      formParams: {
        groupName: "",
        groupId: "",
        createUserId: "",
        description: ""
      },
      rules: {
        groupName: [
          { required: true, message: "请输入组名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入组描述", trigger: "blur" }
        ]
      },
      groupsData: [],
      dialogFormVisible: false,
      dialogFormRoles: false,
      dialogFormJobs: false,
      diaTitle: ""
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    }),
    ...mapGetters(["userInfo"])
  },
  created() {
    // this.groupShow = true
  },
  mounted() {
    this.onSearch();
  },
  watch: {},
  methods: {
    hideGroup(e) {
      this.groupShow = false;
    },
    jobsSearch(row) {
      this.groupShow = false;
      // console.log(row);
      let groupjobsdatas = "";
      groupjobsdatas = JSON.stringify(row);
      sessionStorage.setItem("groupjobsdatas", groupjobsdatas);
      this.$router.push({ name: "GroupJob" });
    },
    rolesSearch(row) {
      this.groupShow = false;
      // console.log(row);
      let grouprolesdatas = "";
      grouprolesdatas = JSON.stringify(row);
      sessionStorage.setItem("grouprolesdatas", grouprolesdatas);
      this.$router.push({ name: "GroupRole" });
    },
    async onSearch() {
      try {
        const { data, total } = await searchGroupList(this.params);
        this.groupsData = data;
        this.total = total;
      } catch {
        this.groupsData = [];
        // this.$message({
        //   message: "无相关数据",
        //   type: "warning"
        // });
      }
    },
    onAddGroup() {
      this.formParams.groupName = "";
      this.formParams.description = "";
      this.formParams.createUserId = this.userInfo.currentUser.user_id;
      delete this.formParams.groupId;
      this.diaTitle = "新增组信息";
      this.dialogFormVisible = true;
    },
    async addGroup() {
      console.log(this.formParams);
      try {
        const { data } = await addGroup(this.formParams);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.onSearch();
      } catch {
        console.log("err");
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
      this.formParams.groupName = row.groupName;
      this.formParams.groupId = row.groupId;
      this.formParams.description = row.description;
      delete this.formParams.createUserId;
      this.dialogFormVisible = true;
      this.diaTitle = "编辑组信息";
      console.log(row);
    },
    async editGroup() {
      console.log(this.formParams);
      try {
        const { data } = await editGroup(this.formParams);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.onSearch();
      } catch {
        console.log("err");
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
        const { data } = await delGroup(param);
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
      let param = { groupId: row.groupId };
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
      if (this.diaTitle == "新增组信息") {
        this.saveAddGroup();
      } else if (this.diaTitle == "编辑组信息") {
        this.saveEditGroup();
      }
    },
    addGroupCancel() {
      this.dialogFormVisible = false;
      this.formParams.groupId = "";
      this.formParams.groupName = "";
      this.formParams.description = "";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.params.page_size = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.params.current_page = val;
      this.onSearch();
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
