<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-13 09:35:38
 * @LastEditTime: 2019-10-21 14:38:08
 * @LastEditors:GuiShun
 -->
<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="caseInfoList"
      v-loading="listLoading"
      tooltip-effect="dark"
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column type="index" label width="50"></el-table-column>
      <el-table-column prop="log_id" label="日志ID" width></el-table-column>
      <el-table-column label="上传时间" width="180">
        <template slot-scope="scope">{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template>
      </el-table-column>
      <el-table-column label="推送状态" width>
        <template slot-scope="scope">{{ getPushCaseStatus(scope.row.push_status) }}</template>
      </el-table-column>
      <el-table-column label="推送状态" width>
        <template slot-scope="scope">{{ getPushType(scope.row.push_type) }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="日志详情" style="text-align:center" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="handleClick(scope.row.log_desc)" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="paramsData.current_page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="paramsData.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paramsData.total"
      v-show="pagerShow"
    ></el-pagination>
  </div>
</template>

<script>
import { queryAlllogInfo } from "@/api/caseManage/childCasePush";
import { parseTime } from "@/utils";
export default {
  data() {
    return {
      paramsData: {
        current_page: 1,
        page_size: 20,
        case_id: "",
        pages: 1,
        total: 0
      },
      listLoading: false,
      pagerShow: false,
      caseInfoList: [],
      tableHeight: 700
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.queryAlllogInfo(1);
  },
  methods: {
    async queryAlllogInfo(curpage) {
      this.paramsData.case_id = this.$route.query.case_id;
      this.listLoading = true;
      try {
        const { data: caseInfoList, total } = await queryAlllogInfo(
          this.paramsData
        );
        this.paramsData.total = total;
        this.$nextTick(() => {
          this.tableHeight =
            window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 160;
          // 监听窗口大小变化
          let self = this;
          window.onresize = function() {
            self.tableHeight =
              window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 160;
          };
        });
        // this.listLoading = false;
        if (this.paramsData.total > this.paramsData.page_size) {
          this.pagerShow = true;
        }
        this.caseInfoList = caseInfoList;
        this.listLoading = false;
      } catch {
        this.caseInfoList = [];
        this.listLoading = false;
        this.pagerShow = true;
        // this.$message({
        //   showClose: true,
        //   message: "无相关信息",
        //   type: "success"
        // });
      }
    },
    getPushCaseStatus(state) {
      // switch (state) {
    },
    getPushType(text) {
      switch (text) {
        case 0:
          text = "推送文件到统一存储";
          break;
        case 1:
          text = "推送分类结果";
          break;
        case 2:
          text = "推送封皮卷内目录到统一存储";
          break;
        case 3:
          text = "推送封皮卷内目录到华宇";
          break;
        case 4:
          text = "全卷删除";
          break;
        case 5:
          text = "本卷删除";
          break;
        case 6:
          text = "文件删除";
          break;
        default:
          text = "--";
      }
      return text;
    },
    handleClick(doc) {
      this.$alert(doc, {
        confirmButtonText: "确定",
        callback: action => {
          // this.$message({
          //   type: 'info',
          //   message: `action: ${ action }`
          // });
        }
      });
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.queryAlllogInfo(1);
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.queryAlllogInfo(currentPge);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
