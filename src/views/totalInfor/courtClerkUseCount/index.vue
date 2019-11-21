<template>
  <div>
    <div class="filter-container">
      <el-row>
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="paramsData" class="demo-form-inline" id="courtClerkTable">
              <el-form-item label="起始时间：" >
                <el-date-picker
                  v-model="paramsData.start_time"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择开始日期"
                   @change="getStartTime"
                  width="160"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker
                v-model="paramsData.end_time"
                type="date"
                value-format="timestamp"
                @change="getEndTime"
                placeholder="选择结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="归属法院：">
              <el-select
                v-model="paramsData.court_id"
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
                v-model="paramsData.court_room_id"
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
            </el-form-item>
            <el-form-item label="数据状态 ：">
              <el-select
                v-model="paramsData.is_all_text"
                
                placeholder="请选择"
               
              >
                <el-option
                  v-for="item in options"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="queryCourtClerkUserCount()"
              >搜索</el-button>
            </el-form-item>
            <el-form-item class="image">
              <!-- <div class="block" > -->
              <el-image style="width: 40px; height: 40px" :src="url" :title='titleName' @click="printExcel()"></el-image>
              <!-- </div> -->
            </el-form-item>
          </el-form>
        </div>
      </el-row>
    </div>
    <el-row :gutter="10" style="margin:0" class="userTableRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple-light">
          <el-table
            id="out-table"
            ref="singleTable"
            :data="uploadTotaList"
            highlight-current-row
            border
            @current-change="handleCurrentChange"
            style="width: 100%;text-align: center;"
            height="710"
          >
            <el-table-column type="index" label width="50"></el-table-column>
            <el-table-column prop="court_name" label="法院名称" width></el-table-column>
            <el-table-column prop="upload_user_name" label="书记员" width></el-table-column>
            <el-table-column prop="court_room_name" label="归属庭室" width></el-table-column>
            <el-table-column prop="case_num" label="上传批次数量" width></el-table-column>
            <el-table-column prop="distinct_case_num" label="上传案件数量" width></el-table-column>
            <el-table-column prop="file_num" label="上传页数" width></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { getCourtRoomById } from "@//api/systemManage/userManage";
import { queryCourtClerkUserCount } from "@/api/totalInfor/courtClerkUseCount";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import qs from "qs";
export default {
  directives: { waves },
  computed: {
    ...mapGetters(["allRoleList", "allCourtList"])
  },
  data() {
    return {
      titleName:"下载",
      court_roomList: [],
      options:[
        {name:"全部数据",is_all:0},
        {name:"有效数据",is_all:1}
      ],
      paramsData: {
        court_id: "",
        court_room_id: "",
        is_all: "",
        is_all_text: "有效数据",
        create_time: "",
        TimeFrom: "",
        TimeTo: "",
         start_time: new Date().setMonth(0, 1),
        end_time: new Date().setMonth(new Date().getMonth()),
      },
      params: {
        court_id: ""
      },
      uploadTotaList: [],
      downloadLoading: false,
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      url: require("../../../assets/print.png"),
      listLoading: true
    };
  },
  created() {},
  mounted() {
    let that = this;
    that.getTimeDay();
    that.$store.dispatch("common/getAllCourtList").then(function(){})

    that.queryCourtClerkUserCount();
  },
  watch: {},
  methods: {
    getStartTime() {
      if (this.paramsData.end_time < this.paramsData.start_time) {
        this.$message({
          showClose: true,
          message: "起始时间不能大于结束时间",
          type: "warning"
        });
      }
    },
    getEndTime() {
      if (this.paramsData.end_time < this.paramsData.start_time) {
        this.$message({
          showClose: true,
          message: "结束时间不能小于起始时间",
          type: "warning"
        });
      }
    },
    getTimeDay() {
      var timestamp = parseInt(new Date().getTime());
      this.paramsData.end_time = timestamp;
      this.paramsData.start_time = timestamp - 24 * 60 * 60 * 1000*365;
      // this.paramsData.TimeFrom=new Date();
      // this.paramsData.TimeTo=new Date();
    },
    queryCourtClerkUserCount(params) {
      if(this.paramsData.is_all_text=="有效数据"){
          this.paramsData.is_all=1
      }else {
        this.paramsData.is_all=0
      }
      queryCourtClerkUserCount(this.paramsData)
        .then(response => {
          this.uploadTotaList = response.data;
        })
        .catch(() => {
          this.uploadTotaList = [];
          // this.$message({
          //   type: "warning",
          //   message: "请选择起始时间"
          // });
        });
    },
    // 根据法院id查询庭室
    async getCourtRoomById() {
      // this.court_roomList = [];
      this.listLoading = true;
      try {
        const { data: court_roomList } = await getCourtRoomById(
          this.params
          // {court_id: addForm.court_id}
        );
        this.court_roomList = court_roomList;
        this.listLoading = false;
      } catch {
        this.court_roomList = [];
        // this.$message({
        //   message: "当前法案无庭室",
        //   type: "success"
        // });
      }
    },
    //下载导出表格
    printExcel() {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "书记员使用量.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    handleReset() {},

    handleCurrentChange(val) {
      // this.paramsData.page_size = val;
      // console.log(val);
    },
    courtChange(val) {
      this.params.court_id = val;
      this.paramsData.court_room_id="";
      //原始方法调用：根据法院id查询庭室
      // getCourtRoomById(this.addForm).then(response => {
      //         console.log(response);
      // });
      // let obj = {};
      // obj = this.allCourtList.find((item)=>{//这里的userList就是上面遍历的数据源
      //     return item.court_id === val;//筛选出匹配数据
      // });
      // this.addForm.court_id_text=obj.court_name;
      //更新后方法调用：根据法院id查询庭室;
      // this.getCourtRoomById();
      if(val){
        this.getCourtRoomById();
      }else{
        this.court_roomList = [];

      }
    },
    courtRoomChange(val) {
      // console.log(this.addForm);
      // this.addForm.court_room_id=val;
      // let obj = {};
      // obj = this.court_roomList.find((item)=>{
      //     return item.court_room_id === val;
      // });
      // this.addForm.court_room_id_text=obj.court_room_name;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.filter-container {
  .el-form-item ,.el-form-item--medium{
    margin-bottom: 15px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 160px;
  }
  
}


.pageRow {
  margin-top: 15px;
}
.demo-form-inline {
  position: relative;
}
.image {
  position: absolute;
  right: 0;
}

</style>
