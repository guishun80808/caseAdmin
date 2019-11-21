<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-19 15:33:03
 * @LastEditTime: 2019-10-25 17:48:25
 * @LastEditors: GuiShun
 -->
<template>
  <div id="UserJob">
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
      <el-table :data="groupjobsInfo" style="width: 100%" border>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="jobName" label="职务名称"></el-table-column>
        <el-table-column prop="courtName" label="法院"></el-table-column>
        <el-table-column prop="courtRoomName" label="庭室"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="onEditGroup(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain @click="onDelGroup(scope.row)">删除</el-button>
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
    <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width>
      <el-form
        ref="formParams"
        :model="formParams"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="职务：">
          <el-select v-model="formParams.jobId" :clearable="clearable" placeholder="请选择">
            <el-option
              v-for="item in allDutyList"
              :key="item.jobId"
              :label="item.jobName"
              :value="item.jobId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法院：" prop="courtId">
          <el-select
            v-model="formParams.courtId"
            :clearable="clearable"
            placeholder="请选择"
            class="search_select"
            @change="courtChange"
          >
            <el-option
              v-for="item in allCourtList"
              :key="item.court_id"
              :label="item.court_name"
              :value="item.court_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="庭室：" prop="courtRoomId">
          <el-select
            v-model="formParams.courtRoomId"
            :clearable="clearable"
            placeholder="请选择"
            class="search_select"
          >
            <el-option
              v-for="item in courtRoomList"
              :key="item.court_room_id"
              :label="item.court_room_name"
              :value="item.court_room_id"
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
import {getAllUserList,EditUser,delUser ,addUser,addUserJob,editUserJob,delUserJobDept,UserJobDeptByUserId} from "@//api/admin/userList";
import {
  getAllCourtList,
  getCourtRoomById
} from "@/api/admin/courtList";
import { searchDutyList } from "@/api/admin/duties";
import { mapState, mapGetters } from "vuex";
export default {
  props: {},
  data() {
    return {
      clearable: true,
      groupjobsInfo: [],
      allCourtList: [],
      allDutyList: [],
      allResList: [],
      params: {
        current_page: 1,
        page_size: 10
      },
      total: 0,
      groupId: {
        groupId: ""
      },
      addParams:{},
      formParams: {
        jobId: "",
        courtId: "",
        courtRoomId: "",
        id: "",
        userId: "",
      },
      rules: {
        courtId: [{ required: true, message: "请选择法院", trigger: "change" }],
        courtRoomId: [
          { required: true, message: "请选择庭室", trigger: "change" }
        ]
      },
      groupsData: [],
      dialogFormVisible: false,
      dialogFormRoles: false,
      dialogFormJobs: false,
      diaTitle: "",
      groupShow: false,
      courtRoomList: []
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    }),
    ...mapGetters(["allRoleList"])
  },
  created() {},
  mounted() {
    this.groupHide();
    this.getAllCourtList();
    this.getAllDuties();
    let groupjobsdatas = sessionStorage.getItem("groupjobsdatas");
    //this.formParams.groupId = JSON.parse(groupjobsdatas).groupId;
    this.formParams.userId = JSON.parse(groupjobsdatas).user_id;
    this.groupId.groupId = JSON.parse(groupjobsdatas).groupId;
    this.groupjobsInfo = JSON.parse(groupjobsdatas).deptList;
    this.onSearch({userId:this.formParams.userId});
    // this.addParams=JSON.parse(groupjobsdatas);

  },
  watch: {},
  methods: {
    courtChange(val) {
      this.courtRoomList = [];
      let courtItem = {};
      courtItem = this.allCourtList.find(item => {
        //这里的userList就是上面遍历的数据源
        return item.court_id === val; //筛选出匹配数据
      });
      let courtId = {
        court_id: courtItem.court_id
      };
      this.formParams.courtRoomId=null;
      //更新后方法调用：根据法院id查询庭室
      this.getCourtRoomById(courtId);
    },
    async getAllCourtList() {
      try {
        const { data } = await getAllCourtList();
        this.allCourtList = data;
      } catch {}
    },
    async getAllDuties() {
      try {
        const { data } = await searchDutyList();
        this.allDutyList = data;
      } catch {}
    },
    async getCourtRoomById(coutrId) {
      try {
        const { data } = await getCourtRoomById(coutrId);
        this.courtRoomList = data;
      } catch {}
    },
    
    async onSearch(userId) {
      try {
        const { data } = await UserJobDeptByUserId(userId);
        this.groupjobsInfo= data;
      } catch {
        // this.$message({
        //   message: "查询成功",
        //   type: "success"
        // });
      }
    },
    groupHide() {
      this.$emit("hideGroup", "false");
    },
   
    onAddGroup() {
      this.diaTitle = "新增";
      delete this.formParams.id;
      this.clearable = true;
      this.dialogFormVisible = true;
    },
    async addUserJob() {
      var parms=[];
      parms.push(this.formParams)
      try {
        const { data } = await addUserJob(parms);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.onSearch({userId:this.formParams.userId});
        // this.formParams.id = "";
        this.formParams.jobId = "";
        this.formParams.courtId = "";
        this.formParams.courtRoomId = "";
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
           this.addUserJob();
        } else {
          return false;
        }
      });
    },
    onReset() {
      this.params.groupName = "";
    },
    onEditGroup(row) {
      console.log(row)
      this.formParams.id = row.id;
      this.formParams.courtId = row.courtId;
      this.formParams.jobId = row.jobId;
      if(row.courtId){
        this.getCourtRoomById({ court_id: row.courtId });
      }
      this.formParams.courtRoomId = row.courtRoomId;
      this.dialogFormVisible = true;
      this.clearable = false;
      this.diaTitle = "编辑";
    },
    async editUserJob() {
      try {
        const { data } = await editUserJob(this.formParams);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.onSearch({userId:this.formParams.userId});
        this.formParams.id = "";
        this.formParams.jobId = "";
        this.formParams.courtId = "";
        this.formParams.courtRoomId = "";
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
          this.editUserJob();
        } else {
          return false;
        }
      });
    },
    async delUserJobDept(param) {
      try {
       const { data } = await delUserJobDept(param);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.onSearch({userId:this.formParams.userId});
      } catch {
        this.$message({
          message: "删除失败,请联系管理员!",
          type: "error"
        });
      }
    },
    onDelGroup(row) {
      let param = { id: row.id };
      this.$confirm("确定删除此信息吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delUserJobDept(param);
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
      this.formParams.jobId = "";
      this.formParams.courtId = "";
      this.formParams.courtRoomId = "";
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
