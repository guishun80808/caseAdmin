<!--
 * @Descripttion: 
 * @version: 
 * @Author: GuiShun
 * @Date: 2019-09-23 16:12:48
 * @LastEditors: GuiShun
 * @LastEditTime: 2019-11-01 14:39:11
 -->

<template>
  <div id="function" class="courtListCenter">
    <el-row :gutter="10" style="margin:0">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <el-form-item label="功能名称：">
              <el-input v-model="params.dimFuncName" placeholder="请输入" class="search_input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
              <!-- <el-button
                type="primary"
                v-auth="['func:add']"
                icon="el-icon-plus"
                @click="onAddFun"
              >新增</el-button>-->
              <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="table-content">
      <el-table
        :data="functionsData"
        :row-style="toggleDisplayTr"
        :cell-style="cellStyle"
        :header-row-style="headerStyle"
        border
        stripe
        height="750"
        :default-expand-all="false"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="功能名称">
          <template slot-scope="scope">
            <p :style="`margin-left: ${scope.row.__level * 20}px;margin-top:0;margin-bottom:0`">
              <i
                @click="toggleFoldingStatus(scope.row)"
                class="permission_toggleFold"
                :class="toggleFoldingClass(scope.row)"
              ></i>
              {{scope.row.funcName}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="功能类型">
          <template slot-scope="scope">{{ getfunType(scope.row.funcType) }}</template>
        </el-table-column>
        <el-table-column prop="url" label="功能url"></el-table-column>
        <el-table-column prop="permsStr" label="权限字符串"></el-table-column>
        <!-- <el-table-column prop="createUserName" label="创建人"></el-table-column> -->
        <el-table-column label="创建时间" width="180">
          <template
            slot-scope="scope"
          >{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>
        <!-- <el-table-column label="上次更新时间">
          <template
            slot-scope="scope"
          >{{ scope.row.lastUpdateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>-->
        <el-table-column prop="description" label="功能描述">
          <template slot-scope="scope">{{ getDes(scope.row) }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" width="90" prop="__level" label="层级"></el-table-column> -->

        <!-- <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="onEditFun(scope.row)"
              v-auth="['func:update']"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="onDelFun(scope.row)"
              v-auth="['func:delete']"
            >删除</el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <!-- addFun -->
    <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width="25%">
      <el-form
        ref="formParams"
        :model="formParams"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <span class="vue-treeselect-lable el-form-item__label">请选择：</span>
        <treeselect
          v-model="value"
          placeholder="请选择目录(非必填)"
          :options="treeSeleData"
          :close-on-select="true"
          :clearable="true"
          :normalizer="normalizer"
          @select="selectFun"
        />
        <el-form-item label="功能名称：" prop="funcName">
          <el-input v-model="formParams.funcName" placeholder="请输入" class="search_input"></el-input>
        </el-form-item>
        <el-form-item label="功能类型：" prop="funcType">
          <el-select
            v-model="formParams.funcType"
            clearable
            placeholder="请选择"
            class="search_select"
            @change="selseType"
          >
            <el-option
              v-for="item in allFuncType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能描述：" prop="description">
          <el-input v-model="formParams.description" placeholder="请输入" class="search_input"></el-input>
        </el-form-item>
        <el-form-item label="url：" prop="url">
          <el-input v-model="formParams.url" placeholder="请输入" class="search_input"></el-input>
        </el-form-item>
        <el-form-item label="权限字符串：" prop="permsStr">
          <el-input v-model="formParams.permsStr" placeholder="请输入" class="search_input"></el-input>
          <!-- <el-select v-model="formParams.role_id" clearable placeholder="请选择" class="search_select">
            <el-option
              v-for="item in allRoleList"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            ></el-option>
          </el-select>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFunCancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { parseTime } from "@/utils";
import { searchFunList, addFun, editFun, delFun } from "@/api/admin/function";
import { mapState, mapGetters } from "vuex";
export default {
  props: {},
  computed: {
    ...mapState({
      userId: state => state.user.userId
    }),
    ...mapGetters(["userInfo"]),
    foldAllList() {
      return this.functionsData.map(x => x.__identity);
    }
  },
  data() {
    return {
      allFuncType: [
        {
          id: 1,
          name: "菜单"
        },
        {
          id: 2,
          name: "按钮"
        },
        {
          id: 3,
          name: "接口"
        }
      ],
      treeSeleData: [],
      value: null,
      allRoleList: [],
      allResList: [],
      params: {
        dimFuncName: ""
      },
      total: 56,
      formParams: {
        funcId: "",
        funcName: "",
        funcLevel: "",
        permsStr: "", //权限字符串
        funcParentId: 0, //父id，顶层为0
        funcType: "", //类型；1--菜单，2--按钮，3--接口
        funcSortId: "", //菜单排序
        url: "",
        description: "",
        funcType: "",
        createUserId: ""
      },
      rules: {
        funcName: [
          { required: true, message: "请输入功能名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入功能类型", trigger: "blur" }
        ],
        permsStr: [
          { required: true, message: "请输入权限字符串", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入url", trigger: "blur" }],
        funcType: [{ required: true, message: "请选择类型", trigger: "change" }]
      },
      functionsData: [],
      foldList: [],
      dialogFormVisible: false,
      diaTitle: ""
    };
  },
  created() {
    let self = this;
    setTimeout(() => {
      self.foldList = self.foldAllList;
    }, 200);
  },
  mounted() {
    let self = this;
    self.onSearch();
    setTimeout(() => {
      self.foldList = self.foldAllList;
    }, 200);
  },
  watch: {},
  methods: {
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
    getfunType(type) {
      let str = "";
      if (type == 1) {
        return (str = "菜单");
      } else if (type == 2) {
        return (str = "按钮");
      } else if (type == 3) {
        return (str = "接口");
      }
    },
    selseType(id) {
      this.formParams.funcType = id;
    },
    selectFun(node, instanceId) {
      this.formParams.funcParentId = node.funcId;
    },
    toggleFoldingStatus(params) {
      this.foldList.includes(params.__identity)
        ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1)
        : this.foldList.push(params.__identity);
    },
    toggleDisplayTr({ row, index }) {
      for (let i = 0; i < this.foldList.length; i++) {
        let item = this.foldList[i];
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        if (row.__family.includes(item) && row.__identity !== item)
          return "display:none;";
      }
      return "";
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return "text-align:center";
    },
    headerStyle({ row, rowIndex }) {
      return "text-align:center";
    },
    toggleFoldingClass(params) {
      if (params.children == null) {
        params.children = [];
      }
      return params.children.length === 0
        ? "permission_placeholder"
        : this.foldList.indexOf(params.__identity) === -1
        ? "iconfont icon-minus-square-o"
        : "iconfont icon-plussquareo";
    },
    formatConversion(
      parent,
      children,
      index = 0,
      family = [],
      elderIdentity = "x"
    ) {
      // children如果长度等于0，则代表已经到了最低层
      // let page = (this.startPage - 1) * 10
      if (children == null) {
        children = [];
        children.length = 0;
      }
      if (children.length > 0) {
        children.map((x, i) => {
          if (x.children == null) {
            x.children = [];
            x.children.length = 0;
          }
          // 设置 __level 标志位 用于展示区分层级
          Vue.set(x, "__level", index + 1);
          // 设置 __family 为家族关系 为所有父级，包含本身在内
          Vue.set(x, "__family", [...family, elderIdentity + "_" + i]);
          // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
          Vue.set(x, "__identity", elderIdentity + "_" + i);
          parent.push(x);
          // 如果仍有子集，则进行递归
          if (x.children.length > 0) {
            this.formatConversion(
              parent,
              x.children,
              index + 1,
              [...family, elderIdentity + "_" + i],
              elderIdentity + "_" + i
            );
          }
        });
      }
      return parent;
    },
    async onSearch() {
      try {
        const { data } = await searchFunList(this.params);
        this.treeSeleData = data;
        this.functionsData = this.formatConversion([], data);
      } catch (error) {
        this.functionsData = [];
        console.log(error);
        // this.$message({
        //   message: "无相关数据",
        //   type: "warning"
        // });
      }
    },
    onAddFun() {
      this.diaTitle = "新增功能信息";
      this.formParams.createUserId = this.userId;
      this.dialogFormVisible = true;
    },
    async addFun() {
      if (this.value === undefined) {
        this.formParams.funcParentId = 0;
      }
      try {
        const { data } = await addFun(this.formParams);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.onSearch();
        //  window.location.reload()
      } catch {
        console.log("err");
        this.$message({
          message: "新增失败",
          type: "error"
        });
        this.dialogFormVisible = false;
      }
    },
    saveAddFun() {
      this.$refs.formParams.validate(valid => {
        if (valid) {
          this.addFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onReset() {
      this.params.funcName = "";
    },
    onEditFun(row) {
      this.formParams.funcId = row.funcId;
      this.formParams.funcName = row.funcName;
      this.formParams.permsStr = row.permsStr;
      this.formParams.funcLevel = row.funcLevel;
      this.formParams.funcParentId = row.funcParentId;
      this.formParams.funcType = row.funcType;
      this.formParams.url = row.url;
      this.formParams.description = row.description;
      this.dialogFormVisible = true;
      this.diaTitle = "编辑功能信息";
    },
    async editFun() {
      try {
        const { data } = await editFun(this.formParams);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.onSearch();
        let params = {
          userId: this.userInfo.currentUser.user_id,
          funcType: 1
        };

        this.$store
          .dispatch("user/getInfo", params)
          .then(function(res) {
            // console.log(res)
          })
          .catch(function(err) {
            // console.log(err);
          });
      } catch {
        console.log("err");
        this.$message({
          message: "编辑失败",
          type: "error"
        });
        this.dialogFormVisible = false;
      }
    },
    saveEditFun() {
      this.$refs.formParams.validate(valid => {
        if (valid) {
          this.editFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async delFun(param) {
      try {
        const { data } = await delFun(param);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.onSearch();
        window.location.reload();
      } catch {
        this.$message({
          message: "删除失败,请联系管理员!",
          type: "error"
        });
      }
    },
    getfuncId(json) {
      let self = this;
      let temp = [];
      if (!json.children) {
        return temp;
      } else {
        for (var i = 0; i < json.children.length; i++) {
          var tmps = [];
          tmps = self.getfuncId(json.children[i]);
          temp = temp.concat(tmps);
          temp.push(json.children[i].funcId);
        }
        return temp;
      }
    },
    getDes(row) {
      if (row.description) {
        return row.description;
      } else {
        return row.funcName;
      }
    },
    onDelFun(row) {
      let param = {
        funcId: row.funcId,
        childIds: []
      };
      param.childIds = this.getfuncId(row);
      this.$confirm("确定删除此功能吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delFun(param);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          param.funcId = "";
        });
    },
    save() {
      if (this.diaTitle == "新增功能信息") {
        this.saveAddFun();
      } else if (this.diaTitle == "编辑功能信息") {
        this.saveEditFun();
      }
    },
    addFunCancel() {
      this.dialogFormVisible = false;
      this.formParams.funcId = "";
      this.formParams.funcName = "";
      this.formParams.permsStr = "";
      this.formParams.funcType = "";
      this.formParams.url = "";
      this.formParams.description = "";
      this.formParams.funcParentId = 0;
    }
  },
  components: {
    Treeselect
  }
};
</script>

<style scoped lang="scss">
</style>
<style lang="scss">
#function {
  .el-select {
    display: block;
  }
  .vue-treeselect {
    // width: 60%;
    // float: right;
    margin-left: 120px;
    margin-bottom: 20px;
  }
  .vue-treeselect-lable {
    width: 120px;
  }
}
</style>
