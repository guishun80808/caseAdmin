<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-19 15:33:03
 * @LastEditTime: 2019-10-25 16:09:13
 * @LastEditors: GuiShun
 -->
<template>
  <div id="duties">
    <el-row :gutter="10" style="margin:0">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <!-- <el-form-item label="职务名称：">
              <el-input v-model="params.jobName" placeholder="请输入" class="search_input"></el-input>
            </el-form-item>-->
            <el-form-item>
              <!-- <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
              <el-button
                type="primary"
                icon="el-icon-plus"
                v-auth="['job:add']"
                @click="handleAddDuty"
              >新增</el-button>
              <!-- <el-button type="primary" @click="handleReset">重置</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="table-content">
      <el-table :data="dutiesData" style="width: 100%" border height="710">
        <el-table-column type="index" label width="50"></el-table-column>
        <el-table-column prop="jobName" label="职务名称"></el-table-column>
        <el-table-column prop="createUserName" label="创建人"></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template
            slot-scope="scope"
          >{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>
        <el-table-column label="上次更新时间">
          <template
            slot-scope="scope"
          >{{ scope.row.lastUpdateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
        </el-table-column>
        <el-table-column prop="description" label="职务描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-auth="['job:update']"
              plain
              @click="handleEditDuty(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-auth="['job:delete']"
              plain
              @click="handleDelDuty(scope.row)"
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
        :hide-on-single-page="false"
      ></el-pagination>
    </div>
    <!-- addDuty -->
    <el-row>
      <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="formParams" :model="formParams" :rules="rules" label-width="120px">
          <el-form-item label="职务名称：" prop="jobName">
            <el-input v-model="formParams.jobName" placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
          <el-form-item label="职务描述：" prop="description">
            <el-input v-model="formParams.description" placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDutyCancel">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { searchDutyList, addDuty, editDuty, delDuty } from "@/api/admin/duties";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
export default {
  props: {},
  data() {
    return {
      params: {
        current_page: 1,
        page_size: 10
      },
      total: 0,
      formParams: {
        jobId: "",
        jobName: "",
        description: "",
        createUserId: ""
      },
      rules: {
        jobName: [
          { required: true, message: "请输入职务名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入职务描述", trigger: "blur" }
        ]
      },
      dutiesData: [],
      dialogFormVisible: false,
      diaTitle: ""
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    }),
    ...mapGetters(["userInfo"])
  },
  created() {},
  mounted() {
    this.handleSearch();
  },
  watch: {},
  methods: {
    async handleSearch() {
      try {
        const { data, total } = await searchDutyList(this.params);
        this.dutiesData = data;
        this.total = total;
      } catch {
        this.dutiesData = [];
        // this.$message({
        //   message: "无相关数据",
        //   type: "warning"
        // });
      }
    },

    handleAddDuty() {
      this.formParams.jobName = "";
      this.formParams.description = "";
      this.formParams.createUserId = this.userInfo.currentUser.user_id;
      delete this.formParams.jobId;
      this.diaTitle = "新增职务信息";
      this.dialogFormVisible = true;
    },
    async addDuty() {
      console.log(this.formParams);
      try {
        const { data } = await addDuty(this.formParams);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.handleSearch();
      } catch {
        console.log("err");
        this.$message({
          message: "新增失败",
          type: "error"
        });
      }
    },
    saveAddDuty() {
      this.$refs.formParams.validate(valid => {
        if (valid) {
          this.addDuty();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleReset() {
      this.params.jobName = "";
    },
    handleEditDuty(row) {
      this.formParams.jobId = row.jobId;
      this.formParams.jobName = row.jobName;
      this.formParams.description = row.description;
      delete this.formParams.createUserId;
      this.dialogFormVisible = true;
      this.diaTitle = "编辑职务信息";
      console.log(row);
    },
    async editDuty() {
      console.log(this.formParams);
      try {
        const { data } = await editDuty(this.formParams);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.handleSearch();
      } catch {
        console.log("err");
        this.$message({
          message: "编辑失败",
          type: "error"
        });
      }
    },
    saveEditDuty() {
      this.$refs.formParams.validate(valid => {
        if (valid) {
          this.editDuty();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async delDuty(param) {
      try {
        const { data } = await delDuty(param);
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
    handleDelDuty(row) {
      let param = { jobId: row.jobId };
      console.log(param);
      this.$confirm("确定删除此职务吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delDuty(param);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          param.dutyId = "";
        });
    },
    save() {
      if (this.diaTitle == "新增职务信息") {
        console.log("xz");
        this.saveAddDuty();
      } else if (this.diaTitle == "编辑职务信息") {
        console.log("bj");
        this.saveEditDuty();
      }
    },
    addDutyCancel() {
      this.dialogFormVisible = false;
      this.formParams.jobId = "";
      this.formParams.jobName = "";
      this.formParams.description = "";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.params.page_size = val;
      this.handleSearch();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.params.current_page = val;
      this.handleSearch();
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
#duties .el-form-item__error {
  /* left: 90px; */
}
#duties .el-select {
  display: block;
}
</style>
