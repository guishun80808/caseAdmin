<!--
 * @Description: In User Settings Edit
 * @Author: ChenJian
 * @Date: 2019-09-18 15:05:40
 * @LastEditTime: 2019-10-23 16:51:03
 * @LastEditors: GuiShun
 -->
<template>
  <!-- <div> -->
  <!-- <el-button v-auth="['role:btn','user:btn']">功能</el-button> -->
  <!-- </div> -->
  <div id="roleManage">
    <div v-if="groupShow">
      <el-row :gutter="10" style="margin:0">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <!-- <div class="grid-content bg-purple">
          <el-button type="primary" icon="el-icon-plus" @click="onAddUser">新增</el-button>
          </div>-->
          <div class="grid-content bg-purple">
            <el-form :inline="true" :model="searchParms" class="demo-form-inline">
              <!-- <el-form-item label="角色名：">
                <el-select
                  v-model="searchParms.role_id"
                  clearable
                  placeholder="请选择"
                  class="search_select"
                >
                  <el-option
                    v-for="item in allRoleList"
                    :key="item.role_id"
                    :label="item.role_name"
                    :value="item.role_id"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              
              <el-form-item>
                <!-- <el-button type="primary" icon="el-icon-search" @click="search_role">搜索</el-button> -->
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="onAddUser"
                  v-auth="['role:add']"
                >新增</el-button>
                <!-- <el-button type="primary" @click="onReset">重置</el-button> -->
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <!-- 角色列表展示 -->
      <el-row :gutter="10" style="margin:0" class="userTableRow">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple-light">
            <el-table
              ref="singleTable"
              :data="allRoleList"
              highlight-current-row
              border
              @current-change="handleCurrentChange"
              style="width: 100%;text-align: center;"
              height="750"
            >
              <el-table-column type="index" label="编号" width="100" align="center"></el-table-column>
              <el-table-column property="role_name" label="角色名" width align="center"></el-table-column>
              <el-table-column property="role_desc" label="简单描述" align="center"></el-table-column>
              <!-- <el-table-column property="role_funcName" label="角色功能" align="center"></el-table-column> -->
              <el-table-column label="操作" prop align="center" width="300">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="onEditUser(scope.$index, scope.row)"
                    v-auth="['role:update']"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="onEditUserFun(scope.$index, scope.row)"
                    v-auth="['role:update']"
                  >角色功能编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click="onDelUser(scope.$index, scope.row)"
                    v-auth="['role:delete']"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
     
      <!-- addUser -->
      <el-row>
        <el-dialog title="添加角色信息" :visible.sync="dialogFormVisible">
          <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
            <el-form-item label="角色名称：" prop="role_name">
              <el-input v-model="addForm.role_name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="角色功能：">
            <treeselect
              :change-on-select="true"
              :multiple="true"
              :options="role_func"
              placeholder="请选择"
              v-model="func_value"
              @select="deptChange"
              :normalizer="normalizer"
            />
            </el-form-item>-->
            <!-- <el-form-item label="角色功能：">
              <treeselect
                :change-on-select="true"
                :multiple="true"
                :options="role_func"
                placeholder="请选择"
                v-model="func_value"
                :normalizer="normalizer"
              />
            </el-form-item> -->
            <el-form-item label="简单描述：" prop="role_desc">
              <el-input v-model="addForm.role_desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddUserSure(addForm)">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
      <!--editUser -->
      <el-row>
        <el-dialog title="编辑角色信息" :visible.sync="EdiDdialogFormVisible">
          <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
            <el-form-item label="角色名称：" prop="role_name">
              <el-input v-model="addForm.role_name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="角色功能：">
            <treeselect
              :multiple="true"
              :flat="true"
              :options="role_func"
              placeholder="请选择"
              v-model="func_value"
              @select="deptChange"
              :normalizer="normalizer"
            />
            </el-form-item>-->
            <!-- <el-form-item label="角色功能：">
              <treeselect
                :change-on-select="true"
                :multiple="true"
                :options="role_func"
                placeholder="请选择"
                v-model="func_value"
                :normalizer="normalizer"
              />
            </el-form-item> -->
            <el-form-item label="简单描述：" prop="role_desc">
              <el-input v-model="addForm.role_desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="EdiDdialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="EditUserSure(addForm)">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
    </div>
    <router-view @hideGroup="hideGroup($event)"></router-view>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";

import { async } from "q";
import {
  getRoles,
  getFunTree,
  delRole,
  addRole,
  getRoleFuncTreeById,
  editRole
} from "@/api/admin/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: {},
  data() {
    return {
      value: [],
     

      value: null,
      selectedOptions: [],
      func_value: null,
      currentRow: null,
      params: {
        current_page: 1,
        page_size: 30
      },
      searchParms: {
        user_name: "",
        role_id: "",
        current_page: 1,
        page_size: 30
      },
      total: 0,
      currentPage1: 1,
      addForm: {
        role_name: "",
        role_desc: "",
        create_user_id: "",
        funcIdList: []
      },
      role_func: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      allRoleList: [],
      role_id: 0,
      dialogFormVisible: false,
      EdiDdialogFormVisible: false,
      formLabelWidth: "120px",
      rules: {
        role_name: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        role_desc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3,  message: "不少于 3 个字符", trigger: "blur" }
        ]
      },
      IsAdd: "",
      groupShow: true
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    }),
    ...mapGetters(["sidebar", "userInfo", "menus"])
  },
  created() {},
  components: { Treeselect },
  mounted() {
    this.getRoles();
    this.getFunTree();
  },
  watch: {},
  methods: {
    hideGroup(e) {
      this.groupShow = false;
    },
    // getRoles() {
    //   axios.get("/api/getRoleList").then(function(res){
    //       console.log(res)
    //   }).catch(function(res){
    //       console.log(res)
    //   });
    // },
    async getRoles() {
      //   axios.get("/api/getRoleList").then(function(res){
      //       console.log(res)
      //   }).catch(function(res){
      //       console.log(res)
      //   });
      const { data } = await getRoles();
      this.allRoleList = data;
      this.total = data.length;
    },
    async getFunTree() {
      const { data } = await getFunTree();
      this.role_func = data;
    },
    async getRoleFuncTreeById() {
      try {
        const { data } = await getRoleFuncTreeById({
          roleId: this.addForm.role_id
        });
        this.listLoading = false;
        this.value = data;
        this.func_value = data;
        this.addForm.funcIdList = data;
      } catch {
        this.value = [];
      }
    },
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.funcId,
        label: node.funcName,
        children: node.children
      };
    },
    deptChange(val) {
      // console.log(val.funcId);
      // console.log(this.func_value);
    },
    search_role() {},
    onReset() {},
    //分页
    handleSizeChange(val) {
      this.params.page_size = val;
      // this.getAllUserList(this.params);
      this.getRoles(this.params);
    },
    handleCurrentChangePage(val) {
      this.params.current_page = val;
      // this.getAllUserList(this.params);
      this.getRoles(this.params);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      // console.log(this.currentRow);
    },
    // role_funcChange(val) {
    //   let obj = {};
    //   obj = this.role_func.find(item => {
    //     return item.role_funcId === val;
    //   });
    //   this.addForm.role_funcName = obj.role_funcName;
    // },

    // 新增角色弹出框框
    onAddUser() {
      this.dialogFormVisible = true;
      this.addForm = {
        role_name: "",
        role_desc: "",
        create_user_id: "",
        funcIdList: []
      };
      this.addForm.create_user_id = this.userId;
      this.func_value = null;
    },
    onEditUserFun(index, row) {
      // console.log(row);
      if (row.role_id == 1) {
        this.$message({
          message: "超级管理员权限禁止操作",
          type: "warning"
        });
        return;
      }
      this.$router.push({
        path: "/adminstration/rolesEdit",
        query: {
          roleId: row.role_id,
          role_name: row.role_name,
          role_desc: row.role_desc
        }
      });
    },
    // 编辑角色弹出框框
    onEditUser(index, row) {
      if (row.role_id == 1) {
        this.$message({
          message: "超级管理员权限禁止操作",
          type: "warning"
        });
        return;
      }
      this.value = [];
      this.EdiDdialogFormVisible = true;
      // this.addForm=this.currentRow;
      this.addForm.role_name = row.role_name;
      this.addForm.role_desc = row.role_desc;
      this.addForm.role_id = row.role_id;
      this.addForm.role_funcName = row.role_funcName;
      this.getRoleFuncTreeById();
      // this.addForm.role_funcId = row.role_funcId[0];
      // if (this.currentRow == null) {
      //   this.$message({
      //     message: "请选择要编辑的用户",
      //     type: "success"
      //   });
      //   return;
      // } else {
      //   this.EdiDdialogFormVisible = true;
      //   // this.addForm=this.currentRow;
      //   this.addForm.role_name = this.currentRow.role_name;
      //   this.addForm.role_desc = this.currentRow.role_desc;
      //   this.addForm.role_id = this.currentRow.role_id;
      // }
    },
    //删除角色
    onDelUser(index, row) {
      // if (this.currentRow == null) {
      //   this.$message({
      //     message: "请选择要删除的角色",
      //     type: "success"
      //   });
      //   return;
      // } else {
      //   this.role_id = this.currentRow.role_id;
      //   this.open(this.currentRow.role_id);
      // }
      if (row.role_id == 1) {
        this.$message({
          message: "超级管理员权限禁止操作",
          type: "warning"
        });
        return;
      }
      this.role_id = row.role_id;
      this.open(row.role_id);
    },
    open() {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$message({
          //         type: 'success',
          //      message: '删除成功!'
          // });
          this.delRole(this.role_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //新增角色确定
    AddUserSure(addForm) {
      // if (!this.addForm.role_name) {
      //   this.$message({
      //     message: "请输入角色名",
      //     type: "success"
      //   });
      //   return;
      // } else if (!this.addForm.role_desc) {
      //   this.$message({
      //     message: "请输入角色描述",
      //     type: "success"
      //   });
      //   return;
      // }
      
      this.addForm.funcIdList = [];
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addRole(this.addForm);
          this.dialogFormVisible = false;
        }else{
           this.$message({
                message: "请按要求输入",
                type: "error"
            });
        }
      })
      // this.addForm.funcIdList = this.func_value;
      
    },
    //角色添加
    async addRole(addForm) {
      this.listLoading = true;
      try {
        const { data: IsAdd } = await addRole(addForm);
        this.listLoading = false;
        this.$message({
          message: "添加成功",
          type: "success"
        });
        //刷新角色列表
        //  this.getAllRoleList();
        this.getRoles();
      } catch {
        this.$message({
          message: "新增失败",
          type: "error"
        });
      }
    },
    // 编辑角色确定
    EditUserSure(addForm) {
      this.addForm.funcIdList = this.func_value;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.editRole(this.addForm);
          this.EdiDdialogFormVisible = false;
        }else{
           this.$message({
                message: "请按要求输入",
                type: "error"
            });
        }
      })
      
    },
    async editRole(addForm) {
      this.listLoading = true;
      try {
        const { data: IsAdd } = await editRole(addForm);
        this.listLoading = false;
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        let params = {
          userId: this.userInfo.currentUser.user_id,
          funcType: 1
        };
        this.$store
          .dispatch("user/getInfo", params)
          .then(function(res) {})
          .catch(function(err) {
            console.log(err);
          });
        //刷新角色列表
        this.getRoles();
        // window.location.reload();
      } catch {
        this.$message({
          message: "编辑失败",
          type: "error"
        });
      }
    },
    //角色删除
    async delRole(role_id) {
      this.listLoading = true;
      try {
        const { data: IsAdd } = await delRole({
          role_id: role_id
        });
        this.listLoading = false;
        this.$message({
          message: "删除成功",
          type: "success"
        });
        //刷新角色列表
        this.getRoles();
      } catch {
        this.$message({
          message: "删除失败",
          type: "error"
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
