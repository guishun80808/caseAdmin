<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-05 15:27:51
 * @LastEditTime: 2019-10-25 16:39:52
 * @LastEditors: GuiShun
 -->
<template>
  <div id="caseCheckMan">
    <div>
      <div class="filter-container">
        <el-row style="margin-bottom:15px;">
          <el-col :span="3" class="first-input">
            <el-select
              v-model="paramsData.caseTypeId"
              @change="getAllSpcxList"
              clearable
              @clear="clearCaseType"
              placeholder="请选择案件类型"
            >
              <el-option
                v-for="item in allCaseTypeList"
                :key="item.case_type_id"
                :label="item.case_type_name"
                :value="item.case_type_id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="paramsData.spcxId" clearable placeholder="请选择审判程序">
              <el-option
                v-for="item in spcxLiistArr"
                :key="item.spcx_id"
                :label="item.spcx_name"
                :value="item.spcx_id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="paramsData.caseStatus" clearable placeholder="请选择案件状态">
              <el-option
                v-for="item in caseStatusArray"
                :key="item.caseStatusId"
                :label="item.caseStatusName"
                :value="item.caseStatusId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="paramsData.directoryLevel" clearable placeholder="请选择目录级别">
              <el-option
                v-for="item in directoryLevelList"
                :key="item.directoryLevel"
                :label="item.directoryLevel"
                :value="item.directoryLevel"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="7" class="btn-box">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch(1)"
            >搜索</el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-circle-close"
              @click="handleReset"
            >重置</el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="addOpen"
            >新增</el-button>
            <!-- <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-camera"
              @click="handleToType"
            >验证方式</el-button>-->
          </el-col>
        </el-row>
      </div>
      <div class="content">
        <el-table
          ref="multipleTable"
          :data="caseInfoList"
          tooltip-effect="dark"
          style="width: 100%;margin-bottom:10px;"
          :height="tableHeight"
        >
          <el-table-column type="index" label width="50"></el-table-column>
          <el-table-column prop="caseTypeName" label="案件类型" width></el-table-column>
          <el-table-column prop="spcxName" label="审判程序" width></el-table-column>
          <el-table-column prop="rootDirectoryName" label="一级目录所属卷" width></el-table-column>
          <el-table-column prop="directoryName" label="目录" width></el-table-column>
          <el-table-column prop="caseStatus" label="案件状态" width>
            <template slot-scope="scope">{{ getCaseStatus(scope.row.caseStatus) }}</template>
          </el-table-column>
          <el-table-column prop="directoryLevel" label="目录级数" width></el-table-column>
          <el-table-column fixed="right" label="操作" style="text-align:center" width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="editOpen(scope.row)" size="small">编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleOpen(scope.row)"
                style="color: red;"
              >删除</el-button>
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
        <el-dialog title="新增信息" :visible.sync="dialogFormVisible">
          <el-form
            :model="addParams"
            :rules="rules"
            ref="ruleAddForm"
            label-width="100px"
            class="demo-ruleForm"
            show-message
          >
            <el-form-item label="案件类型" prop="caseTypeId">
              <el-select
                v-model="addParams.caseTypeId"
                @change="getAddAllSpcxList"
                placeholder="请选择案件类型"
              >
                <el-option
                  v-for="item in allCaseTypeList"
                  :key="item.case_type_id"
                  :label="item.case_type_name"
                  :value="item.case_type_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审判程序" prop="caseTypeId">
              <el-select
                v-model="addParams.spcxId"
                @change="getAllDirectories"
                placeholder="请选择审判程序"
              >
                <el-option
                  v-for="item in spcxLiistArr"
                  :key="item.spcx_id"
                  :label="item.spcx_name"
                  :value="item.spcx_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="一级目录" prop="caseTypeId">
              <el-select
                v-model="addParams.rootDirectoryId"
                @change="getsecondLeve"
                placeholder="请选择一级目录"
              >
                <el-option
                  v-for="item in curAllDirectories"
                  :key="item.directory_id"
                  :label="item.directory_name"
                  :value="item.directory_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级目录" v-if="secondLevelShow" prop="caseTypeId">
              <el-select v-model="secondId" @change="getthreeLeve" placeholder="请选择二级目录">
                <el-option
                  v-for="item in secondLevelList"
                  :key="item.secondId"
                  :label="item.directory_name"
                  :value="item.secondId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="三级目录" v-if="threeLevelShow" prop="caseTypeId">
              <el-select v-model="threeId" placeholder="请选择三级目录" @change="getfourLeve">
                <el-option
                  v-for="item in threeLevelList"
                  :key="item.threeId"
                  :label="item.directory_name"
                  :value="item.threeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="四级目录" v-if="fourLevelShow" prop="caseTypeId">
              <el-select v-model="threeId" placeholder="请选择四级目录">
                <el-option
                  v-for="item in fourLevelList"
                  :key="item.fourId"
                  :label="item.directory_name"
                  :value="item.fourId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="案件状态" prop="caseTypeId">
              <el-select
                v-model="addParams.caseStatus"
                placeholder="请选择案件状态"
                @change="getCaseStatusName"
              >
                <el-option
                  v-for="item in caseStatusArray"
                  :key="item.caseStatusId"
                  :label="item.caseStatusName"
                  :value="item.caseStatusId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click="saveAdd()">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑信息" :visible.sync="editFormVisible">
          <el-form
            :model="editParams"
            :rules="rules"
            ref="editruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="案件类型" prop="caseTypeId">
              <el-select
                v-model="editParams.caseTypeId"
                @change="selEditCaseType"
                placeholder="请选择案件类型"
              >
                <el-option
                  v-for="item in allCaseTypeList"
                  :key="item.case_type_id"
                  :label="item.case_type_name"
                  :value="item.case_type_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审判程序" prop="caseTypeId">
              <el-select v-model="editParams.spcxId" @change="selEditSpcx" placeholder="请选择审判程序">
                <el-option
                  v-for="item in spcxLiistArr"
                  :key="item.spcx_id"
                  :label="item.spcx_name"
                  :value="item.spcx_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="一级目录" prop="caseTypeId">
              <el-select
                v-model="editParams.rootDirectoryId"
                placeholder="请选择一级目录"
                @change="selEditFirst"
              >
                <el-option
                  v-for="item in directoryLiistArr"
                  :key="item.directory_id"
                  :label="item.directory_name"
                  :value="item.directory_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级目录" prop="caseTypeId" v-if="secondLevelShow">
              <el-select v-model="secondId" placeholder="请选择二级目录" @change="selEditSecond">
                <el-option
                  v-for="item in secondLevelList"
                  :key="item.directory_id"
                  :label="item.directory_name"
                  :value="item.directory_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="三级目录" prop="caseTypeId" v-if="threeLevelShow">
              <el-select v-model="threeId" placeholder="请选择三级目录" @click="selEditThree">
                <el-option
                  v-for="item in threeLevelList"
                  :key="item.directory_id"
                  :label="item.directory_name"
                  :value="item.directory_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="四级目录" v-if="fourLevelShow" prop="caseTypeId">
              <el-select v-model="threeId" placeholder="请选择四级目录" @change="selEditFour">
                <el-option
                  v-for="item in fourLevelList"
                  :key="item.fourId"
                  :label="item.directory_name"
                  :value="item.fourId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="案件状态" prop="caseTypeId">
              <el-select
                v-model="editParams.caseStatus"
                placeholder="请选择案件状态"
                @change="selEditStatus"
              >
                <el-option
                  v-for="item in caseStatusArray"
                  :key="item.caseStatusId"
                  :label="item.caseStatusName"
                  :value="item.caseStatusId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelEdit">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { parseTime } from "@/utils";
import { queryAllSplcList, queryAllDirectories } from "@/api/common";
import {
  getAllCheckList,
  addCaseCheck,
  editCaseCheck,
  delCaseCheck,
  queryOneDirectory
} from "@/api/systemMain/caseCheckMan";
import waves from "@/directive/waves"; // waves directive
import qs from "qs";
import { setTimeout } from "timers";
import { debuglog } from "util";
export default {
  directives: { waves },
  computed: {
    ...mapGetters([
      "userInfo",
      "allCaseTypeList",
      "allSplcList",
      "allDirectories"
      // "outShow"
    ])
  },
  data() {
    return {
      outShow: true,
      curAllDirectories: [],
      dialogFormVisible: false,
      editFormVisible: false,
      secondLevelShow: false, //二级目录
      threeLevelShow: false, //三级目录
      fourLevelShow: false, //四级目录
      fiveLevelShow: false, //五级目录
      sixLevelShow: false, //六级目录
      secondId: "",
      threeId: "",
      paramsData: {
        current_page: 1, //当前页
        page_size: 20, //每页显示数据量
        caseTypeId: "",
        spcxId: "",
        directoryModelId: "",
        caseStatus: "",
        directoryLevel: "",
        pages: 1,
        total: 0
      },
      addParams: {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        directoryName: "",
        caseStatus: "",
        caseStatusName: "",
        directoryLevel: "",
        rootDirectoryId: "",
        directoryId: ""
      },
      rules: {
        caseTypeId: [{ required: true, message: "", trigger: "change" }],
        spcxId: [
          { required: true, message: "请选择审判程序", trigger: "change" }
        ],
        rootDirectoryId: [
          { required: true, message: "请选择一级目录", trigger: "change" }
        ],
        directoryIdSe: [
          { required: true, message: "请选择二级目录", trigger: "change" }
        ],
        directoryIdTh: [
          { required: true, message: "请选择三级目录", trigger: "change" }
        ],
        directoryIdFo: [
          { required: true, message: "请选择三级目录", trigger: "change" }
        ],
        caseStatus: [
          { required: true, message: "请选择案件状态", trigger: "change" }
        ]
      },
      editParams: {
        id: "",
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        directoryName: "",
        caseStatus: "",
        caseStatusName: "",
        directoryLevel: "",
        rootDirectoryId: "",
        rootDirectoryName: ""
      },
      editParamsForm: {
        id: "",
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        directoryName: "",
        caseStatus: "",
        caseStatusName: "",
        directoryLevel: "",
        rootDirectoryId: "",
        rootDirectoryName: ""
      },
      caseInfoList: [],
      DirectoryArrayList: [],
      secondLevelList: [],
      threeLevelList: [], //三级目录
      fourLevelList: [], //四级目录
      fiveLevelList: [], //五级目录
      sixLevelList: [], //六级目录
      caseStatusArray: [
        { caseStatusId: 1, caseStatusName: "案件进展阶段新移送" },
        { caseStatusId: 2, caseStatusName: "案件进展阶段立案登记" },
        { caseStatusId: 3, caseStatusName: "案件进展阶段立案审查" },
        { caseStatusId: 4, caseStatusName: "案件进展阶段立案审批" },
        { caseStatusId: 5, caseStatusName: "案件进展阶段等待分派" },
        { caseStatusId: 6, caseStatusName: "案件进展阶段等待确认" },
        { caseStatusId: 7, caseStatusName: "案件进展阶段正在审理" },
        { caseStatusId: 8, caseStatusName: "案件进展阶段立案待结" },
        { caseStatusId: 9, caseStatusName: "案件进展阶段结案报批" },
        { caseStatusId: 10, caseStatusName: "案件进展阶段已经结案" },
        { caseStatusId: 11, caseStatusName: "案件进展阶段已经归档" }
      ],
      directoryLevelList: [
        { directoryLevel: 1 },
        { directoryLevel: 2 },
        { directoryLevel: 3 }
      ],
      spcxList: [],
      caseTypeId: {
        case_type_id: ""
      },
      directoryId: "",
      pagerShow: false,
      tableHeight: 700,
      spcxLiistArr: [],
      directoryLiistArr: [],
      curModelId: "",
      curDirectoriesObj: ""
    };
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    clearCaseType() {
      this.paramsData.caseTypeId = "";
      this.paramsData.caseTypeName = "";
      this.paramsData.spcxName = "";
      this.paramsData.spcxId = "";
    },
    async handleSearch() {
      // this.listLoading = true;
      try {
        const { data: caseInfoList, total } = await getAllCheckList(
          this.paramsData
        );
        this.caseInfoList = caseInfoList;
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
        //this.$refs.multipleTable.$el.offsetTop：表格距离浏览器的高度 //50表示你想要调整的表格距离底部的高度（你可以自己随意调整），因为我们一般都有放分页组件的，所以需要给它留一个高度
        // this.listLoading = false;
        if (this.paramsData.total > this.paramsData.page_size) {
          this.pagerShow = true;
        }
      } catch {
        this.caseInfoList = [];
        // this.listLoading = false;
        this.pagerShow = true;
        this.paramsData.total = 0;
        this.$message({
          message: "无相关案件信息",
          type: "success"
        });
      }
    },
    getAllSpcxList() {
      this.queryAllSplcList(this.paramsData.caseTypeId);
      // this.$store
      //   .dispatch("common/queryAllSplcList", {
      //     case_type_id: this.paramsData.caseTypeId
      //   })
      //   .then(res => {})
      //   .catch(() => {
      //     this.$message({
      //       message: "获取审判程序列表失败",
      //       type: "error",
      //       duration: 5 * 1000
      //     });
      //   });
    },
    async queryAllSplcList(id) {
      try {
        const { data } = await queryAllSplcList({
          case_type_id: id
        });
        this.spcxLiistArr = data;
      } catch {
        this.$message({
          message: "获取审判程序列表失败",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    getAddAllSpcxList(id) {
      // console.log(id)
      this.curAllDirectories = [];
      this.spcxLiistArr = [];
      this.addParams.spcxId = "";
      this.addParams.spcxName = "";
      this.directoryLiistArr = [];
      this.addParams.rootDirectoryId = "";
      this.addParams.rootDirectoryName = "";
      this.addParams.directoryId = "";
      this.addParams.directoryName = "";
      this.secondId = "";
      this.threeId = "";
      this.fourId = "";
      this.secondLevelShow = false;
      this.threeLevelShow = false;
      this.fourLevelShow = false;
      let _that = this;
      _that.allCaseTypeList.forEach(element => {
        if (element.case_type_id == id) {
          _that.addParams.caseTypeName = element.case_type_name;
        }
      });
      this.queryAllSplcList(id);
      // _that.$store
      //   .dispatch("common/queryAllSplcList", {
      //     case_type_id: id
      //   })
      //   .then(res => {
      //     this.curAllDirectories = [];
      //   })
      //   .catch(() => {
      //     _that.$message({
      //       message: "获取审判程序列表失败",
      //       type: "error",
      //       duration: 5 * 1000
      //     });
      //   });
    },
    getEditAllSpcxList(id) {
      this.queryAllSplcList(id);
    },
    async queryAllDirectories(id) {
      try {
        const { data } = await queryAllDirectories({
          directory_model_id: id
        });
        this.directoryLiistArr = data;
      } catch {
        this.$message({
          message: "获取目录列表失败",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    getAllDirectories(item) {
      let modelId = this.getModelId(item);
      this.$store
        .dispatch("common/queryAllDirectories", {
          directory_model_id: modelId
        })
        .then(res => {
          this.curAllDirectories = this.allDirectories;
          // console.log(this.allDirectories);
        })
        .catch(() => {
          this.$message({
            message: "获取目录列表失败",
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    getsecondLeve(id) {
      let directorid = id;
      let _that = this;
      let curDirectories = null;
      _that.allDirectories.forEach(element => {
        if (element.directory_id == directorid) {
          curDirectories = element;
          _that.addParams.directoryName = element.directory_name;
        }
      });
      if (curDirectories.children.length > 0) {
        _that.secondLevelShow = true;
        _that.secondLevelList = curDirectories.children;
        _that.secondLevelList.forEach(element => {
          element.secondId = element.directory_id;
        });
        _that.addParams.directoryLevel = 2;
      } else if (curDirectories.children.length == 0) {
        _that.secondLevelShow = false;
        _that.secondLevelList = [];
        _that.addParams.directoryLevel = 1;
      }
    },
    getthreeLeve(id) {
      let directorid = id;
      this.secondId = id;
      let _that = this;
      let curDirectories = null;
      _that.addParams.directoryId = id;
      _that.secondLevelList.forEach(element => {
        if (element.directory_id == directorid) {
          curDirectories = element;
          _that.addParams.directoryName = element.directory_name;
        }
      });
      if (curDirectories.children.length > 0) {
        _that.threeLevelShow = true;
        _that.threeLevelList = curDirectories.children;
        _that.threeLevelList.forEach(element => {
          element.threeId = element.directory_id;
        });
        _that.addParams.directoryLevel = 3;
      } else if (curDirectories.children.length == 0) {
        _that.threeLevelShow = false;
        _that.threeLevelList = [];
        _that.addParams.directoryLevel = 2;
      }
    },
    getfourLeve(id) {
      let directorid = id;
      let _that = this;
      let curDirectories = null;
      _that.addParams.directoryId = id;
      _that.threeLevelList.forEach(element => {
        if (element.directory_id == directorid) {
          curDirectories = element;
          _that.addParams.directoryName = element.directory_name;
        }
      });
      if (curDirectories.children.length > 0) {
        _that.threeLevelShow = true;
        _that.fourLevelList = curDirectories.children;
        _that.fourLevelList.forEach(element => {
          element.fourId = element.directory_id;
        });
        _that.addParams.directoryLevel = 4;
      } else if (curDirectories.children.length == 0) {
        _that.threeLevelShow = false;
        _that.threeLevelList = [];
        _that.addParams.directoryLevel = 3;
      }
    },
    getModelId(spcxId) {
      let _that = this;
      let id = "";
      _that.spcxLiistArr.forEach(item => {
        if (spcxId == item.spcx_id) {
          id = item.directory_model_id;
          _that.addParams.spcxName = item.spcx_name;
          this.curModelId = id;
        }
      });
      return id;
    },
    handleReset() {
      this.paramsData.caseTypeId = "";
      this.paramsData.spcxId = "";
      this.paramsData.directoryModelId = "";
      this.paramsData.caseStatus = "";
      this.paramsData.directoryLevel = "";
    },
    handleSizeChange(pageSize) {
      this.paramsData.page_size = pageSize;
      this.handleSearch();
    },
    handleCurrentChange(currentPge) {
      this.paramsData.current_page = currentPge;
      this.handleSearch();
    },
    getCaseStatus(state) {
      switch (state) {
        case 1:
          state = "案件进展阶段新移送";
          break;
        case 2:
          state = "案件进展阶段立案登记";
          break;
        case 3:
          state = "案件进展阶段立案审查";
          break;
        case 4:
          state = "案件进展阶段立案审批";
          break;
        case 5:
          state = "案件进展阶段等待分派";
          break;
        case 6:
          state = "案件进展阶段等待确认";
          break;
        case 7:
          state = "案件进展阶段正在审理";
          break;
        case 8:
          state = "案件进展阶段立案待结";
          break;
        case 9:
          state = "案件进展阶段结案报批";
          break;
        case 10:
          state = "案件进展阶段已经结案";
          break;
        case 11:
          state = "案件进展阶段已经归档";
          break;
        default:
          state = "--";
      }
      return state;
    },
    getUploadType(state) {
      switch (state) {
        case 0:
          state = "随案上传";
          break;
        case 1:
          state = "全卷上传";
          break;
        case 2:
          state = "本卷上传";
          break;
          break;
        default:
          state = "--";
      }
      return state;
    },
    getPushCaseStatus(state) {
      switch (state) {
        case 0:
          state = "未推送";
          break;
        case 1:
          state = "已第一次推送成功";
          break;
        case 2:
          state = "第一次推送失败";
          break;
        case 3:
          state = "分类完成推送成功";
          break;
        case 4:
          state = "分类完成推送失败";
          break;
        default:
          state = "--";
      }
      return state;
    },
    handleClick(row) {
      // this.caseId = row.case_id;
      // this.$router.push({
      //   name: "ChildCasePushLog",
      //   query: { case_id: this.caseId }
      // });
    },
    deleOpen(row) {
      console.log(row);
      this.$confirm("确定删除此验证规则吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delCaseCheck(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async delCaseCheck(id) {
      try {
        await delCaseCheck({ id: id });
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.handleSearch();
      } catch {
        this.$message({
          message: "删除失败",
          type: "error"
        });
      }
    },
    addOpen() {
      this.addParams = {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        directoryName: "",
        caseStatus: "",
        caseStatusName: "",
        directoryLevel: "",
        rootDirectoryId: "",
        directoryId: ""
      };
      this.dialogFormVisible = true;
    },
    saveAdd() {
      if (this.addParams.caseTypeId == "") {
        this.$message({
          message: "请选择案件类型",
          type: "warning"
        });
        return;
      }
      if (this.addParams.spcxId === "") {
        this.$message({
          message: "请选择审判程序",
          type: "warning"
        });
        return;
      }

      if (this.addParams.rootDirectoryId == "") {
        this.$message({
          message: "请选择一级目录",
          type: "warning"
        });
        return;
      }

      if (this.secondId == "" && this.secondLevelShow) {
        this.$message({
          message: "请选择二级目录",
          type: "warning"
        });
        return;
      }
      if (this.threeId == "" && this.threeLevelShow) {
        this.$message({
          message: "请选择三级目录",
          type: "warning"
        });
        return;
      }
      if (this.fourId == "" && this.fourLevelShow) {
        this.$message({
          message: "请选择四级目录",
          type: "warning"
        });
        return;
      }
      if (this.addParams.caseStatus == "") {
        this.$message({
          message: "请选择案件状态",
          type: "warning"
        });
        return;
      }
      this.$refs.ruleAddForm.validate(valid => {
        if (valid) {
          this.addCaseCheck();
          this.handleSearch();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelAdd() {
      this.dialogFormVisible = false;
      this.secondLevelShow = false;
      this.threeLevelShow = false;
      this.addParams = {
        caseTypeId: "",
        caseTypeName: "",
        spcxId: "",
        spcxName: "",
        directoryName: "",
        caseStatus: "",
        caseStatusName: "",
        directoryLevel: "",
        rootDirectoryId: "",
        directoryId: ""
      };
    },
    async addCaseCheck() {
      try {
        await addCaseCheck(this.addParams);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.addParams = {
          id: "",
          caseTypeId: "",
          caseTypeName: "",
          spcxId: "",
          spcxName: "",
          directoryName: "",
          caseStatus: "",
          caseStatusName: "",
          directoryLevel: "",
          rootDirectoryId: "",
          directoryId: ""
        };
      } catch {
        this.$message({
          message: "新增失败",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    async editCaseCheck() {
      try {
        const { data } = await editCaseCheck(this.editParamsForm);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.editFormVisible = false;
        this.secondLevelShow = false;
        this.threeLevelShow = false;
        // this.editParamsForm.caseStatus = "";
        // this.editParamsForm.caseTypeId = "";
        // this.editParamsForm.caseTypeName = "";
        // this.editParamsForm.directoryId = "";
        // this.editParamsForm.directoryLevel = "";
        // this.editParamsForm.directoryName = "";
        // this.editParamsForm.rootDirectoryId = "";
        // this.editParamsForm.rootDirectoryName = "";
        // this.editParamsForm.spcxId = "";
        // this.editParamsForm.spcxName = "";
        // this.editParamsForm.id = "";
        this.handleSearch();
      } catch {
        // this.$message({
        //   message: "编辑失败",
        //   type: "error",
        //   duration: 5 * 1000
        // });
      }
    },
    async queryOneDirectory(id) {
      try {
        const { data } = await queryOneDirectory({ directory_id: id });
        this.curDirectoriesObj = data;
        // console.log(this.curDirectoriesObj)
        // if (directoryLevel == 3) {
        // }
      } catch {}
    },
    async editOpen(row) {
      let self = this;
      let modelId = "";
      self.editParamsForm.caseStatus = row.caseStatus;
      self.editParamsForm.caseTypeId = row.caseTypeId;
      self.editParamsForm.caseTypeName = row.caseTypeName;
      self.editParamsForm.directoryId = row.directoryId;
      self.editParamsForm.directoryLevel = row.directoryLevel;
      self.editParamsForm.directoryName = row.directoryName;
      self.editParamsForm.rootDirectoryId = row.rootDirectoryId;
      self.editParamsForm.rootDirectoryName = row.rootDirectoryName;
      self.editParamsForm.spcxId = row.spcxId;
      self.editParamsForm.spcxName = row.spcxName;
      self.editParamsForm.id = row.id;
      const { data: MyspcxList } = await queryAllSplcList({
        case_type_id: row.caseTypeId
      });
      self.spcxLiistArr = MyspcxList;
      modelId = self.getModelId(row.spcxId);
      const { data: myallDirectories } = await queryAllDirectories({
        directory_model_id: modelId
      });
      const { data: mycurDirectoriesObj } = await queryOneDirectory({
        directory_id: row.directoryId
      });
      self.directoryLiistArr = myallDirectories;
      self.curDirectoriesObj = mycurDirectoriesObj;
      self.spcxLiistArr.forEach(element => {
        if (element.spcx_id == row.spcxId) {
          self.editParams.spcxName = row.spcxName;
          self.editParams.spcxId = row.spcxName;
        }
      });
      self.allCaseTypeList.forEach(element => {
        if (element.case_type_id == row.caseTypeId) {
          self.editParams.caseTypeName = row.caseTypeName;
          self.editParams.caseTypeId = row.caseTypeName;
        }
      });
      self.directoryLiistArr.forEach(element => {
        let curSecondId = "";
        if (element.directory_id == row.rootDirectoryId) {
          self.editParams.rootDirectoryId = row.rootDirectoryName;
          self.secondLevelList = element.children;
          if (row.directoryLevel == 2) {
            self.secondId = row.directoryName;
          } else if (row.directoryLevel == 3) {
            self.threeId = row.directoryName;
            self.secondLevelList.forEach(element => {
              if (element.directory_id == self.curDirectoriesObj.parent_id) {
                self.secondId = element.directory_name;
              }
            });
          }
        }
      });
      self.editParams.caseStatus = row.caseStatus;
      self.editFormVisible = true;
      if (row.directoryLevel == 1) {
        self.secondLevelShow = false;
        self.threeLevelShow = false;
      }
      if (row.directoryLevel == 2) {
        self.secondLevelShow = true;
        self.threeLevelShow = false;
      }
      if (row.directoryLevel == 3) {
        self.secondLevelShow = true;
        self.threeLevelShow = true;
      }
      if (row.directoryLevel == 4) {
        self.secondLevelShow = true;
        self.threeLevelShow = true;
        self.fourLevelShow = true;
      }
    },
    saveEdit() {
      if (this.editParamsForm.caseTypeId == "") {
        this.$message({
          message: "请选择案件类型",
          type: "warning"
        });
        return;
      }
      if (this.editParamsForm.spcxId === "") {
        this.$message({
          message: "请选择审判程序",
          type: "warning"
        });
        return;
      }

      if (this.editParamsForm.rootDirectoryId == "") {
        this.$message({
          message: "请选择一级目录",
          type: "warning"
        });
        return;
      }

      if (this.secondId == "" && this.secondLevelShow) {
        this.$message({
          message: "请选择二级目录",
          type: "warning"
        });
        return;
      }
      if (this.threeId == "" && this.threeLevelShow) {
        this.$message({
          message: "请选择三级目录",
          type: "warning"
        });
        return;
      }
      if (this.fourId == "" && this.fourLevelShow) {
        this.$message({
          message: "请选择四级目录",
          type: "warning"
        });
        return;
      }
      if (this.editParamsForm.caseStatus == "") {
        this.$message({
          message: "请选择案件状态",
          type: "warning"
        });
        return;
      }
      this.$refs.editruleForm.validate(valid => {
        if (valid) {
          this.editCaseCheck();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelEdit() {
      this.editFormVisible = false;
      let self = this;
      setTimeout(() => {
        self.secondLevelShow = false;
        self.threeLevelShow = false;
        self.fourLevelShow = false;
        self.editParamsForm.caseStatus = "";
        self.editParamsForm.caseTypeId = "";
        self.editParamsForm.caseTypeName = "";
        self.editParamsForm.directoryId = "";
        self.editParamsForm.directoryLevel = "";
        self.editParamsForm.directoryName = "";
        self.editParamsForm.rootDirectoryId = "";
        self.editParamsForm.rootDirectoryName = "";
        self.editParamsForm.spcxId = "";
        self.editParamsForm.spcxName = "";
        self.editParamsForm.id = "";
      }, 500);
    },
    getCaseStatusName(item) {
      switch (item) {
        case 1:
          this.addParams.caseStatusName = "案件进展阶段新移送";
          break;
        case 2:
          this.addParams.caseStatusName = "案件进展阶段立案登记";
          break;
        case 3:
          this.addParams.caseStatusName = "案件进展阶段立案审查";
          break;
          this.addParams.caseStatusName = "案件进展阶段立案审批";
        case 4:
          break;
        case 5:
          this.addParams.caseStatusName = "案件进展阶段等待分派";
          break;
        case 6:
          this.addParams.caseStatusName = "案件进展阶段等待确认";
          break;
        case 7:
          this.addParams.caseStatusName = "案件进展阶段正在审理";
          break;
        case 8:
          this.addParams.caseStatusName = "案件进展阶段立案待结";
          break;
        case 9:
          this.addParams.caseStatusName = "案件进展阶段结案报批";
          break;
        case 10:
          this.addParams.caseStatusName = "案件进展阶段已经结案";
          break;
        case 11:
          this.addParams.caseStatusName = "案件进展阶段已经归档";
          break;
        default:
          break;
      }
    },
    getEditCaseStatusName(item) {
      switch (item) {
        case 1:
          this.editParams.caseStatusName = "案件进展阶段新移送";
          break;
        case 2:
          this.editParams.caseStatusName = "案件进展阶段立案登记";
          break;
        case 3:
          this.editParams.caseStatusName = "案件进展阶段立案审查";
          break;
          this.editParams.caseStatusName = "案件进展阶段立案审批";
        case 4:
          break;
        case 5:
          this.editParams.caseStatusName = "案件进展阶段等待分派";
          break;
        case 6:
          this.editParams.caseStatusName = "案件进展阶段等待确认";
          break;
        case 7:
          this.editParams.caseStatusName = "案件进展阶段正在审理";
          break;
        case 8:
          this.editParams.caseStatusName = "案件进展阶段立案待结";
          break;
        case 9:
          this.editParams.caseStatusName = "案件进展阶段结案报批";
          break;
        case 10:
          this.editParams.caseStatusName = "案件进展阶段已经结案";
          break;
        case 11:
          this.editParams.caseStatusName = "案件进展阶段已经归档";
          break;
        default:
          break;
      }
    },
    handleToType() {
      this.outShow = !this.outShow;
      // console.log(this.outShow);
      // this.SET_OUTSHOW(!this.outShow);
      this.$router.push({
        name: "CaseCheckType"
      });
    },
    selEditCaseType(id) {
      this.queryAllSplcList(id);
      this.editParamsForm.caseTypeId = id;
      this.directoryLiistArr = [];
      this.secondLevelList = [];
      this.threeLevelList = [];
      this.fourLevelList = [];
      this.secondLevelShow = false;
      this.threeLevelShow = false;
      this.fourLevelShow = false;
      this.secondId = "";
      this.threeId = "";
      this.fourId = "";
      this.editParams.rootDirectoryId = "";
      this.editParams.spcxId = "";
      this.editParamsForm.rootDirectoryId = "";
      this.editParamsForm.spcxId = "";
      let self = this;
      self.allCaseTypeList.forEach(element => {
        if (element.case_type_id == id) {
          self.editParamsForm.caseTypeName = element.case_type_name;
        }
      });
    },
    selEditSpcx(id) {
      this.directoryLiistArr = [];
      this.secondLevelList = [];
      this.threeLevelList = [];
      this.fourLevelList = [];
      this.secondLevelShow = false;
      this.threeLevelShow = false;
      this.fourLevelShow = false;
      this.secondId = "";
      this.threeId = "";
      this.fourId = "";
      this.editParams.rootDirectoryId = "";
      this.editParamsForm.rootDirectoryId = "";
      this.editParamsForm.spcxId = id;
      let modelId = this.getModelId(id);
      this.queryAllDirectories(modelId);
      let self = this;
      self.spcxLiistArr.forEach(element => {
        if (element.spcx_id == id) {
          self.editParamsForm.spcxName = element.spcx_name;
        }
      });
    },
    selEditFirst(id) {
      this.editParamsForm.rootDirectoryId = id;
      this.secondLevelList = [];
      this.threeLevelList = [];
      this.fourLevelList = [];
      this.threeLevelShow = false;
      this.fourLevelShow = false;
      this.secondId = "";
      this.threeId = "";
      this.fourId = "";
      this.editParamsForm.directorId = id;
      let self = this;
      self.directoryLiistArr.forEach(element => {
        if (element.directory_id == id) {
          self.secondLevelShow = true;
          self.secondLevelList = element.children;
          self.editParamsForm.rootDirectoryName = element.directory_name;
        }
      });
    },
    selEditSecond(id) {
      this.fourLevelList = [];
      this.threeId = "";
      this.fourId = "";
      this.editParamsForm.directorId = id;
      let self = this;
      self.secondLevelList.forEach(element => {
        if (element.directory_id == id) {
          self.threeLevelList = element.children;
          self.threeLevelShow = true;
          self.editParamsForm.directoryName = element.directory_name;
          if (element.children.length == 0) {
            self.threeLevelShow = false;
            self.editParamsForm.directoryLevel = 2;
          }
        }
      });
    },
    selEditThree(id) {
      this.editParamsForm.directorId = id;
      self.threeLevelShow = true;
      let self = this;
      self.threeLevelList.forEach(element => {
        if (element.directory_id == id) {
          self.fourLevelList = element.children;
          self.editParamsForm.directoryName = element.directory_name;
          if (element.children.length == 0) {
            this.fourLevelShow = false;
            this.editParamsForm.directoryLevel = 3;
          }
        }
      });
    },
    selEditFour() {
      this.editParamsForm.directoryLevel = 4;
      this.editParamsForm.directorId = id;
      let self = this;
      self.threeLevelList.forEach(element => {
        if (element.directory_id == id) {
          // self.fourLevelList = element.children;
          self.editParamsForm.directoryName = element.directory_name;
          // if(element.children.length == 0){
          //   this.fourLevelShow = false;
          //    this.editParamsForm.directoryLevel = 4;
          // }
        }
      });
    },
    selEditStatus(id) {
      this.editParamsForm.caseStatus = id;
      let self = this;
      self.caseStatusArray.forEach(element => {
        if (element.caseStatusId == id) {
          self.editParamsForm.caseStatusName = element.caseStatusName;
        }
      });
    },
    // ...mapMutations(["SET_OUTSHOW"])
    ...mapMutations("common/", ["SET_OUTSHOW"])
  }
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
</style>
<style>
</style>
