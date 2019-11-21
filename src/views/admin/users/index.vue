<template>
  <div id="usersManage">
    <div v-if="groupShow">
      <!-- <div>{{allCourtList}}</div> -->
      <el-row :gutter="10" style="margin:0">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple">
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
              </el-form-item> -->
              <el-form-item label="用户名：">
                <el-input v-model="searchParms.user_name" placeholder class="search_input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="onAddUser"
                  v-auth="['user:add']"
                >新增</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <!-- 用户列表展示 -->
      <el-row :gutter="10" style="margin:0" class="userTableRow">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple-light">
            <el-table
              ref="singleTable"
              :data="allUserTable"
              highlight-current-row
              border
              @current-change="handleCurrentChange"
              style="width: 100%;text-align: center;"
              height="710"
            >
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <!-- <el-table-column property="role_name" width="" label="角色" align="center"></el-table-column> -->
              <el-table-column property="user_name" width label="用户名" align="center"></el-table-column>
              <el-table-column property="user_full_name" width label="用户全名" align="center"></el-table-column>
              <!-- <el-table-column property=""  label="职务" align="center">
              <template slot-scope="scope">
                <div
                  v-html="getCbrDetail(scope.row)"
                  @click="delComment($event)"
                  style="text-align:center;white-space:normal;height:auto;"
                  class="datagrid-cell datagrid-cell-c3-cbrList"
                ></div>
              </template>
              </el-table-column>-->
              <!-- <el-table-column label="部门职务列表">
              <template slot-scope="scope">
                <span
                  size="mini"
                  type="primary"
                  style="cursor: pointer;color: #409EFF;"
                  plain
                  @click="jobsSearch(scope.row)"
                >查看详情</span>
              </template>
              </el-table-column>-->
              <el-table-column property width="360" label="法院/庭室/职务" align="center">
                <!-- <template slot-scope="scope">
                  <span v-html="scope.row.court_name"></span>
                  <span>/</span>
                  <span v-html="scope.row.court_room_name"></span>
                </template>-->
                <template slot-scope="scope">
                  <!-- <div v-for="(item,key) in scope.row.deptList" style="text-align: left;"> -->
                  <div v-for="(item,key) in scope.row.deptList">
                    <span v-if="scope.row.deptList.length>1">{{key+1}}：</span>
                    <span data-key-id="item.courtId">{{item.courtName}}</span>
                    <span v-if="item.courtName">/</span>
                    <span v-else>-/&nbsp;&nbsp;</span>
                    <span>{{item.courtRoomName}}</span>
                    <span v-if="item.courtRoomName">/</span>
                    <span v-else>- /&nbsp;&nbsp;</span>
                    <span>{{item.jobName}}</span>
                    <span v-if="!item.jobName">-</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column property="last_login_ip" label="上次登录IP" align="center"></el-table-column>
              <el-table-column label="操作" prop align="center" width="285">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="onEditUser(scope.$index, scope.row)"
                    v-auth="['user:update']"
                  >编辑用户</el-button>
                  <!-- v-if="scope.row.user_name!='root'" -->
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    :disabled="scope.row.user_name=='root'"
                    :title="titleName(scope.row)"
                    @click="onDelUser(scope.$index, scope.row)"
                    v-auth="['user:delete']"
                  >删除</el-button>
                  
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="jobsSearch(scope.row)"
                    v-auth="['user:updateJob']"
                  >编辑职务</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-row class="pageRow">
        <div class="block">
          <!-- <span class="demonstration">完整功能</span> -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChangePage"
            :current-page="currentPage1"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="30"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-row>
      <!-- addUser -->
      <el-row>
        <el-dialog title="添加用户信息" :visible.sync="dialogFormVisible">
          <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
            <el-form-item label="用户名：" prop="user_name">
              <el-input v-model="addForm.user_name"></el-input>
            </el-form-item>
            <el-form-item label="用户全名：" prop="user_full_name">
              <el-input v-model="addForm.user_full_name"></el-input>
            </el-form-item>
            <!-- :rules="[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]"-->
            <el-form-item prop="user_email" label="邮箱：">
              <el-input v-model="addForm.user_email"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddUserNext(addForm)">下一步</el-button>
          </div>
        </el-dialog>
      </el-row>

       <!-- addGroup -->
    <el-dialog title="新增用户职务部门：" :visible.sync="dialogFormVisibleGroup" class="addGroupDialog" width>
      <el-form ref="addForm" 
        :model="addForm"
        label-width="0px"
        class="demo-ruleForm">
        <el-form-item label="" 
          v-for="(domain, index) in addForm.deptList"
          :key="domain.key">
          <el-select v-model="domain.jobId" :clearable="clearable" placeholder="请选择职务：">
            <el-option
              v-for="item in allDutyList"
              :key="item.jobId"
              :label="item.jobName"
              :value="item.jobId"
            ></el-option>
          </el-select>
          <el-select
            v-model="domain.courtId"
            :clearable="clearable"
            placeholder="请选择法院："
            class="search_select"
            @change="courtChange"
            v-bind:data-index="index"
            @blur="submitClick1">
            <el-option
              v-for="item in allCourtList"
              :key="item.court_id"
              :label="item.court_name"
              :value="item.court_id"
            ></el-option>
            
          </el-select>
          <el-select
            v-model="domain.courtRoomId"
            :clearable="clearable"
            placeholder="请选择庭室："
            class="search_select" >
            <el-option
              v-for="item in domain.courtRoom"
              :key="item.court_room_id"
              :label="item.court_room_name"
              :value="item.court_room_id"
            ></el-option>
            <!-- <el-option
              v-for="item in court_roomList"
              :key="item.court_room_id"
              :label="item.court_room_name"
              :value="item.court_room_id"
            ></el-option> -->
          </el-select>
          <el-button style="margin-left:20px;" type="danger" @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item class="addGroup">
          <i class="el-icon-circle-plus" title="增加职务" @click="addDomain"></i>
          <!-- <el-button type="danger" icon="el-icon-circle-plus" @click="addDomain" ></el-button> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGroupCancel">上一步</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
      <!--editUser -->
      <el-row>
        <el-dialog title="编辑用户信息" :visible.sync="EdiDdialogFormVisible">
          <el-form ref="form" :model="addForm" :rules="rules" label-width="120px">
            <!-- <el-form-item label="归属法院：">
            <el-select
              v-model="addForm.court_id"
              clearable
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
          <el-form-item label="庭室名称：">
            <el-select
              v-model="addForm.court_room_id"
              clearable
              placeholder="请选择"
              @change="courtRoomChange"
              
            >
              <el-option
                v-for="item in court_roomList"
                :key="item.court_room_id"
                :label="item.court_room_name"
                :value="item.court_room_id"
              ></el-option>
            </el-select>
            </el-form-item>-->
            <el-form-item label="用户名：" prop="user_name">
              <el-input v-model="addForm.user_name"></el-input>
            </el-form-item>
            <el-form-item label="用户全名：" prop="user_full_name">
              <el-input v-model="addForm.user_full_name"></el-input>
            </el-form-item>
            <el-form-item prop="user_email" label="邮箱:">
              <el-input v-model="addForm.user_email"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="EdiDdialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="EditUserSure()">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
    </div>
    <router-view @hideGroup="hideGroup($event)"></router-view>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { searchResList, getDept } from "@/api/admin/resource";
import {
  getAllUserList,
  EditUser,
  delUser,
  addUser
} from "@//api/admin/userList";
import {
  getAllCourtList,
  getCourtRoomById
} from "@/api/admin/courtList";
import { searchDutyList } from "@/api/admin/duties";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  data() {
    return {
      key:null,
      clearable: true,
      falg: 1,
      groupShow: true,
      allUserTable: [],
      court_roomList: [],
      allCourtList: [],
      options: [],
      defaultParams: {
        label: "court_name",
        value: "court_id",
        children: "courtRoomList",
        multiple: true
      },
      allDutyList: [],
      selectedOptions: [],
      searchParms: {
        user_name: "",
        current_page: 1,
        page_size: 30
      },
      value: "",
      currentRow: null,
      params: {
        current_page: 1,
        page_size: 30
      },
      total: 0,
      currentPage1: 1,

      addForm: {
        user_email: "",
        user_full_name: "",
        user_name: "",
        deptList: []
      },
      formParams: {
        jobId: "",
        courtId: "",
        courtRoomId: "",
        id: "",
        userId: "",
      },
      addCourObj: {},
      user_id: 0,
      dialogFormVisible: false,
      EdiDdialogFormVisible: false,
      dialogFormVisibleGroup:false,
      formLabelWidth: "120px",
      rules: {
        user_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 0, max: 20,   message: "不超过 20 个字符", trigger: "blur" }
        ],
        user_full_name: [
          { required: true, message: "请输入用户名全名", trigger: "blur" },
          { min: 2,message: "长度不少于 2 个字符", trigger: "blur" }
        ]
      },
      IsAdd: ""
    };
  },
  computed: {
    ...mapGetters(["allRoleList"])
    // ...mapState({
    //   userId: state => state.user.userId
    // })
  },
  created() {},
  mounted() {
    let self = this;
    // self.$store.dispatch("common/getRoles").then(function() {});
    this.getAllUserList(this.params);
    this.getAllCourtList();
    this.getDutyList();
    // this.getDept()
    this.total = this.allUserTable.length;
  },
  watch: {},
  methods: {
    addDomain() {
        this.addForm.deptList.push({
          jobId: '',
          courtId:"",
          courtRoomId:"",
          courtRoom:[],
          key: Date.now()
        });
      },
      removeDomain(item) {
        var index = this.addForm.deptList.indexOf(item)
        if (index !== -1) {
          this.addForm.deptList.splice(index, 1)
        }
      },
    titleName(row){
      if(row.user_name=="root"){
        return this.title="该用户禁止删除"
      }
    },
    hideGroup(e) {
      this.groupShow = false;
    },
    jobsSearch(row) {
      this.groupShow = false;
      console.log(row);
      let groupjobsdatas = "";
      groupjobsdatas = JSON.stringify(row);
      sessionStorage.setItem("groupjobsdatas", groupjobsdatas);
      this.$router.push({ name: "UserJob" });
    },
    async getDutyList() {
      try {
        const { data, total } = await searchDutyList(this.params);
        this.allDutyList = data;
      } catch {
        this.dutiesData = [];
      }
    },
    //所有法院列表
    async getAllCourtList() {
      try {
        const { data } = await getAllCourtList();
        this.allCourtList = data;
      } catch {
        this.allCourtList = [];
      }
    },
    //所有用户列表
    getAllUserList(params) {
      getAllUserList(params)
        .then(response => {
          this.allUserTable = response.data;
          this.total = response.total;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "没有搜到该用户信息"
          });
        });
    },
    //搜索
    onSearch() {
      this.getAllUserList(this.searchParms);
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      console.log(this.currentRow);
    },
    //分页
    handleSizeChange(val) {
      this.params.page_size = val;
      this.getAllUserList(this.params);
    },
    handleCurrentChangePage(val) {
      this.params.current_page = val;
      this.getAllUserList(this.params);
    },
    // 新增用户弹出框框
    onAddUser() {
      this.dialogFormVisible = true;
      this.addForm = {
        user_email: "",
        user_full_name: "",
        user_name: "",
        deptList: [{
          jobId: '',
          courtId:"",
          courtRoomId:"",
          courtRoom:[],
          key: Date.now()
        }]
      };
      // this.getDept();
    },
    //新增用户下一步
    AddUserNext(addForm) {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
            if(!this.addForm.user_name){
              this.$message({
                message: "用户名不能为空",
                type: "error"
              });
              return;
            }
             if(!this.addForm.user_full_name){
              this.$message({
                message: "用户全名不能为空",
                type: "error"
              });
              return;
            }
            // this.addUser(this.addForm);
            this.dialogFormVisible = false;
            this.dialogFormVisibleGroup=true;
        }else{
           this.$message({
                message: "请按要求输入",
                type: "error"
            });
        }
      })
    },
    // 新增用户职务确定
    save(){
        var find = false;
        var arr=this.addForm.deptList;
        for (var i = 0; i < arr.length; i++) {
            if(!arr[i].jobId){
              this.$message({
                message: "职务不能为空",
                type: "error"
              });
              return;
            }
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i].jobId == arr[j].jobId && arr[i].courtId==arr[j].courtId && arr[i].courtRoomId==arr[j].courtRoomId) { 
                  find = true; 
                  this.$message({
                      message: "不能重复添加",
                      type: "error"
                  });
                  return;
                  break;
                }
            }
            if (find) {
              // return
              break;
            }
        }
        this.addUser(this.addForm);
        this.dialogFormVisibleGroup=false;
    },
    addGroupCancel(){
        this.dialogFormVisibleGroup=false;
        this.dialogFormVisible=true;
    },
    // 编辑用户弹出框框
    onEditUser(index, row) {
      this.EdiDdialogFormVisible = true;
      // this.addForm = row;
        console.log(row)
        this.addForm.role_id=row.role_id;
        this.addForm.user_id=row.user_id;
        this.addForm.user_emai=row.user_emai;
        this.addForm.user_full_name=row.user_full_name;
        this.addForm.user_name=row.user_name;
        this.addForm.deptList=row.deptList;
      // this.addForm=this.currentRow;
      //更新后方法调用：根据法院id查询庭室
      // this.getCourtRoomById(this.addForm);
      // }
    },
    // 编辑用户确定
    EditUserSure() {
      if (!this.addForm.user_name) {
        this.$message({
          message: "请输入用户名",
          type: "success"
        });
        return;
      } else if (!this.addForm.user_full_name) {
        this.$message({
          message: "请输入用户名全名",
          type: "success"
        });
        return;
      } 
      this.editUser(this.addForm);
      this.EdiDdialogFormVisible = false;
    },
    //删除用户
    onDelUser(index, row) {
      this.user_id = row.user_id;
      // this.open(this.currentRow.user_id);
      this.open(row.user_id);
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
          this.delUser(this.user_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onReset() {
      this.searchParms.user_name = "";
      this.searchParms.role_id = "";
    },
    //
    submitClick1(event){
      // console.log(event)
      var tag = event.path[2];
          var index = tag.getAttribute('data-index');
          // console.log(tag);
          // console.log(index);
          this.key=index
    },
    courtChange(val) {
      // console.log(val)
      // this.addForm.court_id = val;
      this.court_roomList = [];
      //原始方法调用：根据法院id查询庭室
      // console.log(this.addForm);
      // getCourtRoomById(this.addForm).then(response => {
      //         console.log(response);
      // });
      // let obj = {};
      // obj = this.allCourtList.find(item => {
      //   //这里的userList就是上面遍历的数据源
      //   return item.court_id === val; //筛选出匹配数据
      // });
      // this.addForm.court_id_text = obj.court_name;
      // this.addForm.court_name = obj.court_name;
      //更新后方法调用：根据法院id查询庭室
      this.getCourtRoomById(val,this.key);
    },
    courtRoomChange(val) {
      // this.addForm.court_room_id = val;
      // let obj = {};
      // obj = this.court_roomList.find(item => {
      //   return item.court_room_id === val;
      // });
      // this.addForm.court_room_id_text = obj.court_room_name;
      // this.addForm.court_room_name = obj.court_room_name;
    },
    roleIdChange(val) {
      let obj = {};
      obj = this.allRoleList.find(item => {
        return item.role_id === val;
      });
      this.addForm.role_id_text = obj.role_name;
      this.addForm.role_name = obj.role_name;
    },
    dutyIdChange(val) {
      let obj = {};
      obj = this.allDutyList.find(item => {
        return item.jobId === val;
      });
      // this.addForm.jobId_text=obj.jobName;
      this.addForm.jobName = obj.jobName;
    },
    
    // 根据法院id查询庭室
    async getCourtRoomById(court_id,index) {
      this.listLoading = true;
      try {
        const { data: court_roomList } = await getCourtRoomById({
          court_id: court_id
        });
        // this.court_roomList= court_roomList;
         this.addForm.deptList[index].courtRoom= court_roomList;
        // console.log(this.court_roomList)
        this.listLoading = false;
      } catch {
        this.$message({
          message: "当前法案无庭室",
          type: "error"
        });
      }
    },
    //用户添加
    async addUser(addForm) {
      this.listLoading = true;
      try {
        const { data: IsAdd } = await addUser(addForm);
        this.listLoading = false;
        this.$message({
          message: "添加成功",
          type: "success"
        });
        //刷新用户列表
        this.getAllUserList(this.params);
      } catch {
        this.$message({
          message: "新增失败",
          type: "error"
        });
      }
    },
    //用户信息修改
    async editUser(addForm) {
      this.listLoading = true;
      try {
        const { data: IsAdd } = await EditUser(addForm);
        this.listLoading = false;
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        //刷新用户列表
        this.getAllUserList(this.params);
      } catch {
        this.$message({
          message: "编辑失败",
          type: "success"
        });
      }
    },
    //用户删除
    async delUser(user_id) {
      this.listLoading = true;
      try {
        const { data: IsAdd } = await delUser({
          user_id: user_id
        });
        this.listLoading = false;
        this.$message({
          message: "删除成功",
          type: "success"
        });
        //刷新用户列表
        this.getAllUserList(this.params);
      } catch {
        this.$message({
          message: "删除失败",
          type: "error"
        });
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.el-row {
  margin: 0;
}
.grid-content {
  // margin-bottom: 15px;
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 200px;
}
.el-form-item {
  // margin-right: 20px;
}
.userTableRow {
  height: 720px;
  // overflow-y: scroll;
}
.pageRow {
  margin-top: 15px;
}
.addGroup{
  text-align: center;

}

.el-table td,
.el-table th {
  text-align: center;
}
</style>
