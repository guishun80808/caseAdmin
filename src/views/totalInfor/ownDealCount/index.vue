<template>
  <div>
    <el-row :gutter="10" style="margin:0;margin-top:26px;" class="userTableRow">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple-light">
          <el-table
            ref="singleTable"
            :data="uploadTotaList"
            highlight-current-row
            border
            
            style="width: 100%;text-align: center;"
            height="710"
          >
            <el-table-column type="index" label width="50"></el-table-column>
            <el-table-column prop="user_full_name" label="处理人" width></el-table-column>
            <el-table-column prop="case_num" label="处理批次总数" width></el-table-column>
            <el-table-column prop="distinct_case_num" label="处理案件总数" width></el-table-column>
            <el-table-column prop="file_num" label="处理文件总数" width></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { getQueryOwnDealCount } from "@/api/totalInfor/ownDealCount";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import qs from "qs";
export default {
  directives: { waves },
  computed: {
    // ...mapGetters(["allCourtList", "allCaseTypeList"])
  },
  data() {
    return {
      paramsData: {
        current_page: 1,
        page_size: 30,
      },
      uploadTotaList: [],
      total: 0,
      currentPage1: 1,
      
     
      
    };
  },
  created() {},
  mounted() {
    this.getQueryOwnDealCount(this.paramsData);
    
  },
  watch: {},
  methods: {
    getQueryOwnDealCount(params) {
      getQueryOwnDealCount(this.paramsData)
        .then(response => {
          this.uploadTotaList = response.data;
          
        //   if (this.total > 0) {
        //     this.pagerShow = true;
        //   } else {
        //     this.$message({
        //       type: "info",
        //       message: "该时间段内没有处理信息"
        //     });
        //   }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "此用户没有处理量"
          });
        });
    },
    
   
   
  },
  components: {}
};
</script>

<style scoped lang="scss">

</style>
