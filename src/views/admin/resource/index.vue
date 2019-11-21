<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-19 15:33:03
 * @LastEditTime: 2019-10-25 17:37:07
 * @LastEditors: GuiShun
 -->
<template>
  <div id="resource">
    <div v-if="groupShow">
      <el-row :gutter="10" style="margin:0">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple">
            <el-form :inline="true" :model="params" class="demo-form-inline">
              <el-form-item label="资源名称：">
                <el-input v-model="params.resourceName" placeholder="请输入" class="search_input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="onAddRes" v-auth="['resource:add']">新增</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div class="table-content">
        <el-table :data="resourcesData" style="width: 100%" border height="750">
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="resourceName" label="资源名称" align="center"></el-table-column>
          <!-- <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column> -->
          <el-table-column label="创建时间" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
          </el-table-column>
          <el-table-column label="更新时间" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.lastUpdateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
          </el-table-column>
          <el-table-column prop="description" label="资源描述" align="center"></el-table-column>
          <el-table-column label="资源相关部门" align="center">
            <template slot-scope="scope">
              <span
                size="mini"
                type="primary"
                style="cursor: pointer;color: #409EFF;"
                plain
                v-auth="['resourceDept:list']"
                @click="resSearch(scope.row)"
              >查看详情</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作"  width="150" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="onEditRes(scope.row)" v-auth="['resource:update']">编辑</el-button>
              <el-button size="mini" type="danger" plain @click="onDelRes(scope.row)" v-auth="['resource:delete']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- addRes -->
      <!-- <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width="25%"> -->
      <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width>
        <el-form
          ref="formParams"
          :model="formParams"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="资源名称：" prop="resourceName">
            <el-input v-model="formParams.resourceName" placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
          <el-form-item label="资源描述：" prop="description">
            <el-input v-model="formParams.description" placeholder="请输入" class="search_input"></el-input>
          </el-form-item> 
          <!-- 部门选择B -->
          <el-form-item label="部门选择：" prop="dept" style="display:none">
            <el-table
              :data="options"
              style="width: 100%;margin-bottom: 20px;height:300px;overflow-y: auto;"
              row-key="court_id"
              border
              ref="multipleTable"
              default-expand-all
              @selection-change="handleSelectionChange"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                prop="court_name"
                label="法院名称"
                sortable
                width="380"
                label-class-name="use"
              >
                <template slot-scope="scope">
                  <i class="el-icon-folder-opened" v-if="scope.row.children.length<1"></i>
                  {{scope.row.court_name}}
                </template>
              </el-table-column>
              <el-table-column prop=" " label="庭室" sortable>
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.row.courtRoomList.length>0"
                    @change="changeSelect"
                    @focus="clickSelect(scope.row)"
                    ref="selectOption"
                    v-model="dataModel[scope.row.index]"
                    multiple
                    placeholder="请选择"
                    width="280"
                  >
                    <el-option
                      v-if="falg"
                      v-for="item in scope.row.courtRoomList"
                      :key="item.court_room_id"
                      :label="item.court_room_name"
                      :value="item.court_room_id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- 部门选择E -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addResCancel">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view @hideGroup="hideGroup($event)"></router-view>
  </div>
</template>

<script>
import {
  searchResList,
  addRes,
  editRes,
  delRes,
  getDept,
  getSelects
} from "@/api/admin/resource";
import { mapState } from "vuex";
import Treeselect from "@riophae/vue-treeselect";
import { parseTime } from "@/utils";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { debuglog } from "util";

export default {
  props: {},
  data() {
    return {
      // value:
      falg: 1,
      trunOn: 0,
      allRoleList: [],
      allResList: [],
      params: {
        resourceName: "",
        currentPage: 1,
        pageSize: 10
      },
      courtRoomName: "",
      selectedOptions: [],
      defaultParams: {
        label: "court_name",
        value: "court_id",
        children: "children",
        multiple: true
      },
      options: [],
      total: 56,
      formParams: {
        // resourceId: "",
        resourceName: "",
        createUserId: "",
        description: "",
        createTime: "",
        dept: []
      },
      addCourObj: {},
      rules: {
        resourceName: [
          { required: true, message: "请输入资源名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入资源类型", trigger: "blur" }
        ],
        resource: [
          { required: true, message: "请选择资源", trigger: "change" }
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      resourcesData: [],
      dialogFormVisible: false,
      diaTitle: "",
      // dataModel: [{ court_room_id: 28 }, { court_room_id: 30 }]
      dataModel: [],
      groupShow: true
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    })
  },
  created() {},
  mounted() {
    this.onSearch();
    this.getDept();
    this.dialogFormVisible = false;
  },
  watch: {},
  methods: {
    hideGroup(e) {
      this.groupShow = false;
    },
    resSearch(row) {
      this.groupShow = false;
      // console.log(row);
      let resdatas = "";
      resdatas = JSON.stringify(row);
      sessionStorage.setItem("resdatas", resdatas);
      this.$router.push({ name: "Source" });
    },
    // 获取所有部门：法院、庭室
    async getDept() {
      // try {
      //   const { data, total } = await getDept();
      //   this.options = data;
      //   for (let i = 0; i < this.options.length; i++) {
      //     const element = this.options[i];
      //     element.index = i;
      //     if (element.children && element.children.length > 0) {
      //       for (let index = 0; index < element.children.length; index++) {
      //         const ele = element.children[index];
      //         ele.index = index + this.options.length;
      //       }
      //     }
      //   }
      //   console.log(this.dataModel);
      //   // this.resourcesData = data;
      //   // this.total = total;
      // } catch {}
    },
    handleSelec(row, index) {
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取所选择的庭室id数组
    changeSelect(val) {
      // this.courtRoomName==""
      for (var key in this.addCourObj) {
        for (var i in this.addCourObj.courtRoomList) {
          if (this.addCourObj.courtRoomList[i].court_room_id == val[0]) {
            this.addCourObj.courtRoomIdList = val;
          }
        }
      }
      // this.addCourObj.court_roomList=val;
    },
    // 获取当前庭室的所属法院
    clickSelect(row) {
      this.total = 0;
      if (this.multipleSelection) {
        let item = this.multipleSelection.find(item => {
          return item.court_id == row.court_id;
        });
        if (!item) {
          this.$message({
            message: "请选择对应的法院",
            type: "warning"
          });
          this.falg = 0;
          return;
        }
      } else {
        this.$message({
          message: "请选择对应的法院",
          type: "warning"
        });
        this.falg = 0;
        return;
      }
      var objString = JSON.stringify(this.addCourObj) == "{}";
      if (!objString) {
        this.formParams.dept.push(this.addCourObj);
        this.addCourObj = {};
      }
      this.falg = 1;
      this.addCourObj.court_id = row.court_id;
      this.addCourObj.court_name = row.court_name;
      this.addCourObj.courtRoomList = row.courtRoomList;
    },
    ForChildren(arr) {
      for (var i in arr) {
        if (arr[i].children.length > 0) {
          this.ForChildren(arr[i].children);
        } else {
          this.defaultParams.children = "courtRoomList";
        }
      }
    },
    async onSearch() {
      try {
        const { data, total } = await searchResList(this.params);
        this.resourcesData = data;
        this.total = total;
      } catch {
        this.resourcesData = [];
        // this.$message({
        //   message: "无相关数据",
        //   type: "warning"
        // });
      }
    },
    onAddRes() {
      // this.$refs.multipleTable.clearSelection();
      this.formParams.resourceId = "";
      this.formParams.resourceName = "";
      this.formParams.description = "";
      this.formParams.createTime = "";
      this.diaTitle = "新增资源信息";
      this.dialogFormVisible = true;
      this.formParams.createUserId = this.userId;
      this.formParams.dept = [];
      // this.getDept();
      // this.$refs.multipleTable.toggleRowSelection(this.$refs.multipleTable.data[0],true);
    },
    async addRes(formParams) {
      try {
        const { data } = await addRes(this.formParams);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.onSearch();
      } catch {
        this.$message({
          message: "新增失败",
          type: "error"
        });
      }
    },
    saveAddRes() {
      this.$refs.formParams.validate(valid => {
        if (valid) {
          let item = this.formParams.dept.find(item => {
            return item.court_id == this.addCourObj.court_id;
          });
          if (item) {
            for (var i in this.formParams.dept) {
              if (
                this.formParams.dept[i].court_id == this.addCourObj.court_id
              ) {
                this.formParams.dept[
                  i
                ].courtRoomIdList = this.addCourObj.courtRoomIdList;
              }
            }
          } else {
            this.formParams.dept.push(this.addCourObj);
          }
          this.formParams.createTime = parseInt(new Date().getTime());
          this.addRes(this.formParams);
          this.dialogFormVisible = false;
        } else {
          this.formParams.dept.push(this.addCourObj);
          this.$message({
            message: "请输入必要的信息",
            type: "warning"
          });
          return false;
        }
      });
    },
    onReset() {
      this.params.resourceName = "";
    },
    onEditRes(row) {
      // this.dataModel
      this.dataModel[row.index] = [];
      let self = this;
      self.diaTitle = "编辑资源信息";
      getSelects({ resourceId: row.resourceId })
        .then(function(data) {
          let datas = data.data;
          for (let index = 0; index < datas.courtList.length; index++) {
            let element = datas.courtList[index];
            for (let index = 0; index < self.options.length; index++) {
              let ele = self.options[index];
              if (ele.court_id == element.court_id) {
                self.$refs.multipleTable.toggleRowSelection(ele, true);
              }
              // debugger
              if (ele.children && ele.children.length > 0) {
                for (let i = 0; i < ele.children.length; i++) {
                  const e = ele.children[i];
                  if (e.court_id == element.court_id) {
                    self.$refs.multipleTable.toggleRowSelection(e, true);
                  }
                }
              }
            }
          }
          self.dialogFormVisible = true;
          self.formParams.resourceId = row.resourceId;
          self.formParams.resourceName = row.resourceName;
          self.formParams.description = row.description;
          self.formParams.createUserId = row.createUserId;
        })
        .catch(function(res) {
          console.log(res);
        });
    },
    selectedRoom(row) {},
    // 编辑资源信息
    async editRes() {
      // console.log(this.formParams);
      this.formParams.dept = [];
      try {
        const { data } = await editRes(this.formParams);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.onSearch();
      } catch {
        console.log("err");
        this.$message({
          message: "编辑失败",
          type: "error"
        });
      }
    },
    saveEditRes() {
      this.$refs.formParams.validate(valid => {
        if (valid) {
          this.editRes();
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    //删除资源
    async delRes(param) {
      try {
        const { data } = await delRes(param);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.onSearch();
      } catch (e) {
        this.$message({
          message: "删除失败,请联系管理员!",
          type: "error"
        });
      }
    },
    onDelRes(row) {
      let param = { resourceId: row.resourceId };
      this.$confirm("确定删除此资源吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRes(param);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          param.resId = "";
        });
    },
    save() {
      if (this.diaTitle == "新增资源信息") {
        this.saveAddRes();
      } else if (this.diaTitle == "编辑资源信息") {
        this.saveEditRes();
      }
    },
    addResCancel() {
      this.dialogFormVisible = false;
      this.formParams.resourceId = "";
      this.formParams.resourceName = "";
      this.formParams.description = "";
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
#resource .el-select {
  display: block;
}
</style>
<style>

</style>
