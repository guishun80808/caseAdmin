<template>
  <div>
    <div class="filter-container">
      <el-row>
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="paramsData" class="demo-form-inline">
            <el-form-item label="起始时间：">
              <el-date-picker
                v-model="paramsData.start_time"
                type="date"
                value-format="timestamp"
                placeholder="选择开始日期"
                @change="getStartTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker
                v-model="paramsData.end_time"
                type="date"
                value-format="timestamp"
                placeholder="选择结束日期"
                @change="getEndTime"
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
            <el-form-item>
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="queryCourtStatistics()"
              >搜索</el-button>
            </el-form-item>
            <el-form-item class="image">
              <!-- <div class="block" > -->
              <el-image style="width: 40px; height: 40px;" :title='titleName' :src="url" @click="printExcel()"></el-image>
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
            <el-table-column prop="user_num" label="使用人数" width></el-table-column>
            <el-table-column prop="case_num" label="上传批次数量" width></el-table-column>
            <el-table-column prop="distinct_case_num" label="上传案件数量" width></el-table-column>
            <el-table-column prop="file_num" label="卷宗页数" width></el-table-column>
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
import { queryCourtStatistics,printExcel } from "@/api/totalInfor/courtUseCount";
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
      paramsData: {
        // TimeFrom: "",
        // TimeTo: "",
         start_time: new Date().setMonth(0, 1),
        end_time: new Date().setMonth(new Date().getMonth()),
        court_id: ""
      },
      uploadTotaList: [],
      downloadLoading: false,
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      url: require("../../../assets/print.png"),
      listLoading: true,
    };
  },
  created() {},
  mounted() {
    let that = this;
    that.getTimeDay();
    that.$store.dispatch("common/getAllCourtList").then(function(){})

    that.queryCourtStatistics();
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
      this.paramsData.start_time = timestamp - 24 * 60 * 60 * 1000*1;

      // this.paramsData.start_time = timestamp;
      // this.paramsData.TimeFrom=new Date();
      // this.paramsData.TimeTo=new Date();
    },
    queryCourtStatistics(params) {
      queryCourtStatistics(this.paramsData)
        .then(response => {
          this.uploadTotaList = response.data;
        })
        .catch(() => {
          this.uploadTotaList = [];
          this.pagerShow = true;
          this.$message({
            type: "warning",
            message: "请选择起始时间"
          });
        });
    },
    //导出表格
    printExcel() {
            // this.listLoading = true;
            // try {
            //     const { data: court_roomList } = await printExcel(this.paramsData
            //     );
            //     this.listLoading = false;
            //     var url="../../..//courtStatistics/exportCourtExcel?court_id="+ this.paramsData.court_id+"&start_time="+this.paramsData.start_time+"&end_time="+this.paramsData.end_time;
            //     var iframe=document.createElement('iframe');
            //     iframe.style.display="none";
            //     iframe.src=url;
            //     document.body.appendChild(iframe);
            // } catch {
                
            //     this.$message({
            //       message: "下载错误",
            //       type: "warning"
            //     });
            // }
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
            "法院使用量.xlsx"
            );
        } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
        
    },
    handleReset() {},
    
    handleCurrentChange(val) {
      // console.log(val);
    },
    courtChange(val) {
      this.params.court_id = val;
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
      // this.getCourtRoomById(this.addForm)
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.filter-container {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
  margin-bottom: 30px;
  .el-row {
    .first-input {
      margin-left: 10px;
    }
    .el-col {
      margin-right: 30px;
    }
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
  cursor: pointer;
}
</style>
