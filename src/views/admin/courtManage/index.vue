<!--
 * @Description: In User Settings Edit
 * @Author: ChenJian
 * @Date: 2019-08-19 09:15:27
 * @LastEditTime: 2019-10-15 11:57:53
 * @LastEditors: GuiShun
 -->
<template>
  <div id="courtList" class="courtListCenter">
    <!-- <el-row :gutter="10" style="margin:0">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="searchParms" class="demo-form-inline">
            <el-form-item label="法院名：">
              <el-input v-model="searchParms.court_name" placeholder class="search_input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>-->
    <el-form :inline="true" :model="searchParms" class="demo-form-inline">
      <!-- <el-form-item label="角色：">
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
      </el-form-item>-->
      <!-- <el-form-item label="法院名称：">
        <el-input v-model="searchParms.user_name" placeholder class="search_input"></el-input>
      </el-form-item>-->
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" @click="">搜索</el-button> -->
        <el-button type="primary" icon="el-icon-plus" @click="courtAdd">新增</el-button>
        <!-- <el-button type="primary" @click="">重置</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="allCourtTreeList"
      style="width: 100%;margin-bottom: 20px;"
      class="userTableRow"
      row-key="court_id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="court_name" label="法院名称" width="380" label-class-name="use">
        <template slot-scope="scope">
          <i class="el-icon-folder-opened" v-if="scope.row.children.length<1"></i>
          {{scope.row.court_name}}
        </template>
        <!-- <i class="el-icon-document"></i> -->
      </el-table-column>
      <el-table-column prop="court_short_name" label="法院简称" width="380" align="center"></el-table-column>
      <el-table-column prop="court_code" label="外部法院代码" align="center"></el-table-column>
      <el-table-column label="操作" prop align="center" width="285">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="onEditCourt(scope.row)"
            v-auth="['user:update']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="delCourtSave(scope.row)"
            v-auth="['user:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-dialog title="新增法院信息" :visible.sync="dialogFormVisibleL">
        <el-form ref="addForm" :model="addForm" label-width="120px" :rules="rules">
          <span
            class="vue-treeselect-lable el-form-item__label"
            style="width: 120px;font-size: 14px;color: #000;"
          >请选择：</span>
          <treeselect
            v-model="value"
            placeholder="所属"
            :options="allCourtTreeListTree"
            :close-on-select="true"
            :clearable="true"
            :normalizer="normalizer"
            @select="selectCou"
          />
          <el-form-item label="法院名称：" prop="court_name">
            <el-input v-model="addForm.court_name"></el-input>
          </el-form-item>
          <el-form-item label="法院简称：" prop="court_short_name">
            <el-input v-model="addForm.court_short_name"></el-input>
          </el-form-item>
          <el-form-item label="法院代码：" prop="court_code">
            <el-input v-model="addForm.court_code"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cacelAdd">取 消</el-button>
          <el-button type="primary" @click="courtAddSave(addForm)">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
    <el-row>
      <el-dialog title="编辑法院信息" :visible.sync="dialogFormVisibleB">
        <el-form ref="addForm" :model="addForm" label-width="120px" :rules="rules">
          <span
            class="vue-treeselect-lable el-form-item__label"
            style="width: 120px;font-size: 14px;color: #000;"
          >请选择：</span>
          <treeselect
            v-model="value"
            placeholder="所属"
            :options="allCourtTreeListTree"
            :close-on-select="true"
            :clearable="true"
            :normalizer="normalizer"
            @select="selectCou"
          />
          <el-form-item label="法院名称：" prop="court_name">
            <el-input v-model="addForm.court_name"></el-input>
          </el-form-item>
          <el-form-item label="法院简称：" prop="court_short_name">
            <el-input v-model="addForm.court_short_name"></el-input>
          </el-form-item>
          <el-form-item label="法院代码：" prop="court_code">
            <el-input v-model="addForm.court_code"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cacelAdd">取 消</el-button>
          <el-button type="primary" @click="courtEditSave(addForm)">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { validUserNum } from "@/utils/validate";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  getAllCourtList,
  searchCourtByName,
  addCourt,
  editCourt,
  delCourt
} from "@/api/admin/courtList";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  computed: {
    ...mapGetters(["allCourtList", "allCourtTreeList"])
  },
  data() {
    const validateUserNum = (rule, value, callback) => {
      if (!validUserNum(value)) {
        callback(new Error("请输入数字法院代码"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        court_name: [
          { required: true, message: "请输入法院名称", trigger: "blur" }
        ],
        court_short_name: [
          { required: true, message: "请输入法院简称", trigger: "blur" }
        ],
        court_code: [
          { required: true, trigger: "blur", validator: validateUserNum }
        ]
      },
      value: null,
      searchParms: {
        court_name: ""
      },
      addForm: {
        court_name: "",
        court_code: "",
        court_short_name: "",
        parent_id: ""
      },
      allCourtTreeListTree: [],
      dialogFormVisibleL: false,
      dialogFormVisibleB: false
    };
  },
  created() {},
  mounted() {
    //条用仓库中的方法
    let self = this;
    self.$store.dispatch("common/getAllCourtList").then(function() {});
    // self.getAllCourtList();
    self.$store.dispatch("common/getAllCourtTreeList").then(function() {});
  },
  watch: {},
  methods: {
    normalizer(node) {
      //去掉children=[]的children属性\
      if (node.children && node.children.length === 0) {
        delete node.children;
      }
      return {
        id: node.court_id,
        label: node.court_name,
        children: node.children
      };
    },
    selectCou(node, instanceId) {
      this.addForm.parent_id = node.court_id;
    },
    cacelAdd() {
      this.dialogFormVisibleB = false;
      this.dialogFormVisibleL = false;
      this.addForm = {
        court_name: "",
        court_code: "",
        court_short_name: "",
        parent_id: ""
      };
      this.value = null;
    },
    courtAdd() {
      this.dialogFormVisibleL = true;
      // this.$store.dispatch("common/getAllCourtTreeList").then(function() {});
      this.allCourtTreeListTree = JSON.parse(
        JSON.stringify(this.allCourtTreeList)
      );
    },
    async addCourt() {
      if (this.value === undefined) {
        this.addForm.parent_id = 0;
      }
      try {
        const { code } = await addCourt(this.addForm);
        if (code == 0) {
          this.$message({
            message: "新增成功",
            type: "success"
          });
          this.$store
            .dispatch("common/getAllCourtTreeList")
            .then(function() {});
          this.addForm = {
            court_name: "",
            court_code: "",
            court_short_name: "",
            parent_id: ""
          };
          this.value = null;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async editCourt() {
      if (this.value === undefined) {
        this.addForm.parent_id = 0;
      }
      try {
        const { code } = await editCourt(this.addForm);
        if (code == 0) {
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          delete this.addForm.court_id;
          this.$store
            .dispatch("common/getAllCourtTreeList")
            .then(function() {});
          this.addForm = {
            court_id: "",
            court_name: "",
            court_code: "",
            court_short_name: "",
            parent_id: ""
          };
          this.value = null;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async delCourt(row) {
      try {
        const { code } = await delCourt({ court_id: row.court_id });
        if (code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.$store
            .dispatch("common/getAllCourtTreeList")
            .then(function() {});
        }
      } catch (err) {
        console.log(err);
      }
    },
    delCourtSave(row) {
      this.$confirm("确定删除此功能吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delCourt(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          param.funcId = "";
        });
    },
    courtAddSave() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addCourt();
          this.dialogFormVisibleL = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    courtEditSave() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.editCourt();
          this.dialogFormVisibleB = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onEditCourt(row) {
      this.addForm.court_name = row.court_name;
      this.addForm.court_short_name = row.court_short_name;
      this.addForm.court_code = row.court_code;
      this.addForm.parent_id = row.parent_id;
      this.addForm.court_id = row.court_id;
      if (row.parent_id === 0) {
        this.value = null;
      } else {
        this.value = row.parent_id;
      }
      // this.$store.dispatch("common/getAllCourtTreeList").then(function() {});
      this.allCourtTreeListTree = JSON.parse(
        JSON.stringify(this.allCourtTreeList)
      );
      this.dialogFormVisibleB = true;
    },
    onDelCourt() {},
    // getAllCourtList() {
    //   getAllCourtList().then(response => {
    //     this.allCourtList = response.data;
    //   });
    // },
    async getAllCourtList() {
      // 直接请求接口，
      //   axios.get("/api/getRoleList").then(function(res){
      //       console.log(res)
      //   }).catch(function(res){
      //       console.log(res)
      //   });
      // 直接api请求接口，
      //   const { data } = await getAllCourtList();
      //      this.allCourtList = data;
      //      this.total=data.length;
    },
    async searchCourtByName() {
      const { data } = await searchCourtByName(this.searchParms);
      this.allCourtList = data;
    },
    onSearch() {
      this.searchCourtByName(this.searchParms);
      this.$message({
        message: "暂无法院查询接口",
        type: "warning"
      });
    }
  },
  components: {
    Treeselect
  }
};
</script>

<style scoped lang="scss">
.userTableRow {
  height: 780px;
  overflow-y: auto;
}
#courtList .vue-treeselect {
  margin-left: 120px;
  margin-bottom: 20px;
}
</style>
