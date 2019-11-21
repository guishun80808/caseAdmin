<template>
  <div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="caseTypeList"
        v-loading="listLoading"
        tooltip-effect="dark"
        style="width: 100%"
        height="820"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label width="50"></el-table-column>
        <el-table-column label="案件类型名称" prop="case_type_name" width></el-table-column>
        <el-table-column label="审判程序名称" prop="spcx_name" width></el-table-column>

        <el-table-column prop="short_name" label="简称" width></el-table-column>
        <el-table-column prop="directory_model_id" label="目录模板" width></el-table-column>
        <el-table-column prop label="查看详情" width>
          <template slot-scope="scope">
            <el-button @click="handleClickDetails(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="handleClickAssoc(scope.row)" type="text" size="small">关联管理</el-button>
            <el-button @click="handleClickAutoClass(scope.row)" type="text" size="small">自动分类</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="count" v-if="isFengPi>0" label="封皮模板数量" width></el-table-column>
        <!-- <el-table-column prop="" label="配置封皮模板 (模板数量/操作)" width> -->
        <el-table-column prop v-if="isFengPi>0" label="封皮模板操作)" width>
          <!-- <el-button type="text" size="small" prop="count" label="目录模板"></el-button> -->
          <template slot-scope="scope">
            <el-button @click="handleClickFengPiEdit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  getAllCaseTypeList,
  getAllCaseTypeListBj
} from "@//api/admin/caseTypeManage";

export default {
  props: {},
  data() {
    return {
      caseTypeList: [],
      listLoading: false,
      isFengPi: 1
    };
  },
  computed: {},
  created() {},
  mounted() {
    var href = document.domain;
    if (
      href == "192.1.44.241" ||
      href == "192.2.2.190" ||
      href == "192.1.44.145"
    ) {
      this.getAllCaseTypeListBj();
    } else {
      this.getAllCaseTypeList();
    }
  },
  watch: {},
  methods: {
    getAllCaseTypeList() {
      this.isFengPi = 1;
      getAllCaseTypeList()
        .then(response => {
          this.caseTypeList = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAllCaseTypeListBj() {
      this.isFengPi = 0;
      getAllCaseTypeListBj()
        .then(response => {
          this.caseTypeList = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSelectionChange(val) {
      let _that = this;
      //   _that.multipleSelection = val;
      //   _that.multipleSelection.forEach(function(item, index) {
      //     let caseInfo = _that.createCaseInfoObj(
      //       item.case_type_id,
      //       item.case_code,
      //       item.court_id,
      //       item.case_name
      //     );
      //     _that.downloadParam.push(caseInfo);
      //   });
    },
    //详情
    handleClickDetails(row) {
      console.log(row);
      this.directory_model_id = row.directory_model_id;
      //this.$router.push(`/caseManage/caseDetail?caseId=${this.caseId}`);
      // this.$router.push(`/systemManage/caseTypeDetail?directory_model_id=${this.directory_model_id}`);
      // this.$router.push({  //此方法传参会在url显示
      //   name:"CaseDetail",
      //   parms: {
      //     caseId: this.caseId
      //   }
      // path: "/caseManage/caseDetail",
      // query: {
      //  caseId: this.caseId
      // }
      // });
      this.$router.push({
        name: "CaseTypeDetail",
        query: { directory_model_id: this.directory_model_id }
      });
      //   this.$router.push({ name: "caseTpeDetail", query: { caseId: this.caseId } });
    },
    //关联管理
    handleClickAssoc(row) {
      this.directory_model_id = row.directory_model_id;
      this.$router.push({
        name: "CaseTypeAssoc",
        query: { directory_model_id: this.directory_model_id }
      });
    },
    handleClickAutoClass(row) {
      this.directory_model_id = row.directory_model_id;
      this.$router.push({
        name: "CaseTypeAutoClass",
        query: { directory_model_id: this.directory_model_id }
      });
    },
    handleClickFengPiEdit(row) {
      console.log(row);
      var case_type_id = row.case_type_id;
      var spcx_id = row.spcx_id;
      window.open(
        "model/dragl/dragl_fengpi/mainpage.html?case_type_id=" +
          case_type_id +
          "&&spcx_id=" +
          row.spcx_id
      );
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
