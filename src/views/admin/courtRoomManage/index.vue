<template>
  <div>
    <el-row :gutter="10" style="margin:0">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <el-form-item label="归属法院：">
                <el-select
                v-model="params.court_id"
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
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
              <el-button type="primary" @click="onReset">重置</el-button>
              <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="onAddCourtRoom"
                >新增</el-button>
              <!-- v-auth="['courtRoom:add']" -->
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!--  庭室列表展示 -->
    <el-row :gutter="10" style="margin:0" class="userTableRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple-light">
          <el-table
            ref="singleTable"
            :data="court_roomList"
            highlight-current-row
            border
            @current-change="handleCurrentChange"
            style="width: 100%;text-align: center;"
             height="750"
          >
            <el-table-column type="index" width="150"></el-table-column>
            <el-table-column property="court_room_name" label="庭室名称" width="400"></el-table-column>
            <el-table-column property="court_room_code" label="庭室代码" width></el-table-column>
            <el-table-column label="操作" prop align="center" width="285">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="onEditCourtRoom(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click="onDelCourtRoom(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
     <!-- addGroup -->
    <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width>
      <el-form ref="addForm" :model="addForm"  label-width="120px">
            <el-form-item label="庭室名：" prop="user_name">
              <el-input v-model="addForm.court_room_name"></el-input>
            </el-form-item>
            <el-form-item label="庭室代码：" prop="user_full_name">
              <el-input v-model="addForm.court_room_code"></el-input>
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
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {getAllCourtList, getCourtRoomById ,delCourtRoom,editCourtRoom,addCourtRoom} from "@/api/admin/courtList";


export default {
  data() {
    return {
      court_roomList:[],
      allCourtList:[],
      params: {
        court_id: null,
      },
      diaTitle:"",
      dialogFormVisible:false,
      addForm:{
        court_room_id:"",
        court_room_name:null,
        court_room_code:null,
        court_id:null
      },
      rules:[]
    };
  },
  computed: {
    // ...mapGetters(["allCourtList"])
  },
  created() {},
  mounted() {
    this.getAllCourtList();
    // this.getCourtRoomById(this.params);
  },
  watch: {},
  methods: {
    // 根据法院id查询庭室
    // async getCourtRoomById(params) {
    //         this.listLoading = true;
    //         try {
    //             const { data: court_roomList } = await getCourtRoomById(
    //             {court_id:params.court_id}
    //             );
    //             this.court_roomList = court_roomList;
    //             this.listLoading = false;
    //         } catch {
                
    //             this.$message({
    //             message: "当前法案无庭室",
    //             type: "success"
    //             });
    //         }
    // },
     async getAllCourtList() {
      const { data } = await getAllCourtList();
      this.allCourtList = data;
      this.params.court_id=data[0].court_id; 
      this.getCourtRoomById(this.params);
    },
    // 新增庭室
    async addCourtRoom(addForm){
      try {
        const { data } = await addCourtRoom(addForm);
        this.getCourtRoomById(this.params);
        this.dialogFormVisible=false;
        this.$message({
          message: "新增成功",
          type: "success"
        });
      }catch{
        this.$message({
          message: "新增失败",
          type: "error"
        });
      }
    },
     // 编辑庭室
    async editCourtRoom(addForm){
      try {
        const { data } = await editCourtRoom(addForm);
        this.getCourtRoomById(this.params);
        this.dialogFormVisible=false;
        this.$message({
          message: "编辑成功",
          type: "success"
        });
      }catch{
        this.$message({
          message: "编辑失败",
          type: "error"
        });
      }

    },
    // 删除庭室
    async delCourtRoom(addForm){
        
        try {
          const { data } = await delCourtRoom(addForm);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        this.dialogFormVisible=false;
        this.getCourtRoomById(this.params);
      } catch {
        this.$message({
          message: "删除失败",
          type: "error"
        });
      }

    },
    getCourtRoomById(params) {
      getCourtRoomById(params).then(response => {
        this.court_roomList = response.data;
      }).catch(() => {
            this.court_roomList=[];
        });;
    },
    onSearch() {
        if(this.params.court_id==""){
            this.params.court_id=this.allCourtList[0].court_id;
            this.getCourtRoomById(this.params);
        }else{
            this.getCourtRoomById(this.params);
        }
    },
    // setCurrent(row) {
    //   this.$refs.singleTable.setCurrentRow(row);
    // },
    handleCurrentChange(val) {
      this.currentRow = val;
    
    },
    onReset(){
        this.params.court_id="";
        this.court_roomList=[];
    },
    // 
    courtChange(val){
        this.params.court_id=val;
        //原始方法调用：根据法院id查询庭室
        // getCourtRoomById(this.addForm).then(response => {
        //         console.log(response);
        // });
        // let obj = {};
        // obj = this.allCourtList.find((item)=>{//这里的userList就是上面遍历的数据源
        //     return item.court_id === val;//筛选出匹配数据
        // });
        // this.addForm.court_id_text=obj.court_name;
        //更新后方法调用：根据法院id查询庭室
        this.getCourtRoomById(this.params)
    },
    onAddCourtRoom(){
      this.dialogFormVisible=true;
      this.diaTitle="新增庭室";
      this.addForm={
        // court_room_id:"",
        court_room_name:null,
        court_room_code:null,
        court_id:this.params.court_id
      }
    },
    onEditCourtRoom(index, row){
      this.dialogFormVisible=true;
      this.diaTitle="编辑庭室";
      this.addForm={
        court_room_name: row.court_room_name,
        court_room_code: row.court_room_code,
        court_id:row.court_id,
        court_room_id:row.court_room_id
      }
    },
    onDelCourtRoom(index, row){
      var delParams={
          "court_room_id":row.court_room_id
      }
      // var params=JSON.stringify(delParams);
      this.$confirm("此操作将永久删除该庭室, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delCourtRoom(delParams);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    save(){
        if(!this.addForm.court_room_name){
          this.$message({
                message: "庭室名称不能为空",
                type: "warning"
          });
          return;
        };
         if(!this.addForm.court_room_code){
          this.$message({
                message: "庭室代码不能为空",
                type: "warning"
          });
          return;
        };
        if(this.diaTitle=="新增庭室"){
          // this.addForm.court_room_id=this.addForm.court_room_code;
          this.addCourtRoom(this.addForm);
        }else if(this.diaTitle=="编辑庭室"){
          // this.addForm.court_room_id=this.addForm.court_room_code
          this.editCourtRoom(this.addForm);
        }
    },
    addGroupCancel(){
      this.dialogFormVisible=false;
    }
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
  height: 750px;
  // overflow-y: scroll;
}
.pageRow {
  margin-top: 15px;
}
.el-dialog {
  width: 500px;
}

</style>
