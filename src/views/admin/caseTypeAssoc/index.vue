<template>
  <div id="AssocCourt" class="caseTypeCourt">
    <!-- 案件关联管理 列表展示  -->
    <el-row :gutter="10" style="margin:0" class="userTableRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple-light">
          <el-table
            ref="singleTable"
            :data="caseTypeAssocList"
            highlight-current-row
            row-key="directory_id"
            border
            @current-change="handleCurrentChange"
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            style="width: 100%;text-align: center;"
            height="800"
            
          >
            <!-- <el-table-column type="index" width="50"></el-table-column> -->
            <el-table-column property="directory_name" label="目录名称" width="400"></el-table-column>
            <el-table-column label="关键字" width="800">
              <template slot-scope="scope">
                <div
                  v-html="getKeyword(scope.row)"
                  @click="delComment($event)"
                  style="text-align:center;white-space:normal;height:auto;"
                  class="datagrid-cell datagrid-cell-c3-cbrList"
                ></div>
              </template>
            </el-table-column>
            <el-table-column property label="操作" align="center" width>
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">增加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- addkeyName -->
    <el-row>
      <el-dialog title="添加关键词信息" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="addForm" :rules="rules" label-width="120px">
          <el-form-item label="关键词名称：" prop="keyName">
            <el-input v-model="addForm.keyName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddKeySure()">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  AssocManage,
  DelByKeyId,
  addKey
} from "@/api/admin/caseTypeManage";

export default {
  data() {
    return {
      caseTypeAssocList: [],
      directoryModelId: "",
      keyId: "",
      dialogFormVisible: false,
      addForm: {
        directoryId:"",
        directoryModelId:"",
        keyName:""
      },
      rules: {
        keyName: [
          { required: true, message: "请输入关键词名称", trigger: "blur" },
          { min: 0, message: "关键词名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    // ...mapGetters(["allRoleList", "allCourtList"])
  },
  created() {
    this.directoryModelId = this.$route.query.directory_model_id;
  },
  mounted() {
    this.AssocManage();
  },
  watch: {},
  methods: {
    // 获取法院关键字列表
    async AssocManage() {
      this.listLoading = true;
      try {
        const { data: caseTypeAssocList } = await AssocManage({
          directoryModelId: this.directoryModelId
        });
        this.listLoading = false;
        this.caseTypeAssocList = caseTypeAssocList;
        // this.getClerkCbrAssociation(this.params);
      } catch {
        this.$message({
          message: "加载失败",
          type: "success"
        });
      }
    },
    // 根据keyId删除关键字
    async DelByKeyId(addForm) {
      this.listLoading = true;
      try {
        const { data: code } = await DelByKeyId(
          // {court_id: addForm.court_id}
          this.keyId
        );
        this.listLoading = false;
        this.AssocManage();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      } catch {
        this.$message({
          message: "删除失败",
          type: "success"
        });
      }
    },
    // 添加关键词信息
    async addKey(addForm) {
      this.listLoading = true;
      try {
        const { data: code } = await addKey(this.addForm);
        this.listLoading = false;
        // this.getClerkCbrAssociation(this.params);
        this.AssocManage();
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.dialogFormVisible = false;
      } catch {
        this.$message({
          message: "添加失败",
          type: "success"
        });
      }
    },
    AddKeySure() {
      if (this.addForm.keyName =="") {
        this.$message({
          message: "请输入关键词名称",
          type: "warn"
        });
        return;
      }
      this.addKey(this.addForm);
    },
    handleClick(row) {
      this.addForm.keyName="";
      this.addForm.directoryId = row.directory_id;
      this.addForm.directoryModelId = row.directory_model_id;
      this.dialogFormVisible = true;
    },
    //获取承办人数组
    getKeyword(cellValue) {
      // console.log(cellValue)
      let str = "";
      if (cellValue.recongizeKeyList.length > 0) {
        cellValue.recongizeKeyList.forEach(method => {
          str +=
            method.keyName +
            '<span class="con-code-icot" data-key-id="' +
            method.keyId +
            '">删除 </span>&nbsp;&nbsp;';
        });
      }
      return str;
    },
    delComment: function(event) {
      if (event.target.nodeName === "SPAN") {
        // 获取触发事件对象的属性
        this.keyId = event.target.dataset;
        // this.delClerkCbrAssociation(this.del_autoId)
        this.open();
      }
    },
    open() {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(response => {
          // console.log(response);
          this.DelByKeyId();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // setCurrent(row) {
    //   this.$refs.singleTable.setCurrentRow(row);
    // },
    handleCurrentChange(val) {
      this.currentRow = val;
      //   console.log(this.currentRow);
    },
    
  },
  components: {}
};
</script>

<style scoped lang="scss">


.el-row {
  margin: 0;
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 200px;
}
.el-form-item {
  margin-right: 20px;
}
.userTableRow {
  height: 800px;
  // overflow-y: scroll;
}
.pageRow {
  margin-top: 15px;
}
.el-dialog {
  width: 500px;
}
#AssocCourt .con-code-icot{
    color: #F56C6C;
    background: #fef0f0;
    border-color: #fbc4c4;
}
</style>
<style lang="css">
  #AssocCourt .con-code-icot{
    color: #F56C6C;
    background: #fef0f0;
    border-color: #fbc4c4;
    cursor: pointer;
    margin-left: 3px;
}
</style>


