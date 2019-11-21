<template>
  <div id="courtList" class="caseTypeCourt">
    <!-- <keep-alive> -->
      <el-row :gutter="10" style="margin:0">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple">
            <el-button type="primary" icon="el-icon-plus" @click="onAddRootDir">新增根目录</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="onAddDir">新增</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="onEditUser">编辑</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="onDelDir">删除</el-button>
            <el-button type="primary" icon="el-icon-d-caret" @click="updateDirIndex" v-if="flag>0">排序保存</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 列表展示 -->
      <!-- <el-row>
        {{caseTypeDetailList}}
      </el-row> -->
      <el-row :gutter="10" style="margin:0" class="userTableRow">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple-light">
            <el-table
              ref="dragTable"
              highlight-current-row
              :data="caseTypeDetailList"
              style="width: 100%;margin-bottom: 20px;"
              row-key="directory_id"
              border
              @current-change="handleCurrentChange"
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              height="760"
              id="directory_id"
            >
              <el-table-column
                prop="directory_name"
                label="目录名称"
                sortable
                width="380"
                label-class-name="use"
                ref="expanded"
              ></el-table-column>
              <el-table-column prop="create_user_name" label="目录创建人" sortable width="380"></el-table-column>
              <el-table-column prop="directory_type_name" label="目录类型"></el-table-column>
              <el-table-column prop="directory_desc" label="目录标识"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <!-- add根目录-->
      <el-row>
        <el-dialog title="添加根目录" :visible.sync="addRootDirVisible">
          <el-form ref="form" :model="addRootDirectoryForm" :rules="rules" label-width="120px">
            <el-form-item label="目录名称：" prop="directory_name">
              <el-input v-model="addRootDirectoryForm.directory_name"></el-input>
            </el-form-item>
            <el-form-item label="目录类型：" prop="directory_type">
              <el-select
                v-model="addRootDirectoryForm.directory_type_text"
                clearable
                placeholder="请选择"
                class="search_select"
                @change="muLvTypeChange"
              >
                <el-option
                  v-for="item in muLvTypeList"
                  :key="item.directory_type_name"
                  :label="item.directory_type_name"
                  :value="item.directory_type_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目录标识：" prop="directory_desc">
              <el-input v-model="addRootDirectoryForm.directory_desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addRootDirVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddRootDirSure()">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
      <!-- add目录-->
      <el-row>
        <el-dialog title="添加目录信息" :visible.sync="addDirVisible">
          <el-form ref="form" :model="addDirectoryForm" :rules="rules" label-width="120px">
            <el-form-item label="目录名称：" prop="directory_name">
              <el-input v-model="addDirectoryForm.directory_name"></el-input>
            </el-form-item>
            <el-form-item label="目录类型：" prop="directory_type">
              <el-select
                v-model="addDirectoryForm.directory_type_text"
                clearable
                placeholder="请选择"
                class="search_select"
                @change="muLvTypeChange"
              >
                <el-option
                  v-for="item in muLvTypeList"
                  :key="item.directory_type_name"
                  :label="item.directory_type_name"
                  :value="item.directory_type_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目录标识：" prop="directory_desc">
              <el-input v-model="addDirectoryForm.directory_desc"></el-input>
            </el-form-item>
            <el-form-item label="上级目录：" prop="parent_name">
              <el-input v-model="addDirectoryForm.parent_name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDirVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddDirSure()">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
      <!-- edit目录-->
      <el-row>
        <el-dialog title="编辑目录" :visible.sync="eidtDirVisible">
          <el-form ref="form" :model="addDirectoryForm" :rules="rules" label-width="120px">
            <el-form-item label="目录名称：" prop="directory_name">
              <el-input v-model="addDirectoryForm.directory_name"></el-input>
            </el-form-item>
            <el-form-item label="目录类型：" prop="directory_type">
              <el-select
                v-model="addDirectoryForm.directory_type_text"
                clearable
                placeholder="请选择"
                class="search_select"
                @change="muLvTypeChange"
              >
                <el-option
                  v-for="item in muLvTypeList"
                  :key="item.directory_type_name"
                  :label="item.directory_type_name"
                  :value="item.directory_type_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目录标识：" prop="directory_desc">
              <el-input v-model="addDirectoryForm.directory_desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="eidtDirVisible = false">取 消</el-button>
            <el-button type="primary" @click="eidtDirSure()">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import Sortable from "sortablejs";

import {
  getAllCaseTypeList,
  queryAllDirectories,
  addRootDir,
  delRootDir,
  updateDir,
  updateDirIndex
} from "@/api/admin/caseTypeManage";

export default {
  data() {
    return {
      flag:1,
      directory_id: "",
      listLoading: false,
      caseTypeDetailList: [],
      sortable: null,
      oldList: [],
      newList: [],
      parms: {
        current_page: 1,
        page_size: 30,
        directory_model_id: ""
      },
      addRootDirVisible: false,
      addDirVisible: false,
      eidtDirVisible: false,
      EdiDdialogFormVisible: false,
      formLabelWidth: "120px",
      addRootDirectoryForm: {
        directory_desc: "",
        directory_model_id: "",
        directory_name: "",
        directory_type: "",
        directory_type_text: "",
        parent_id: 0,
        parent_name: "eeee"
      },
      addDirectoryForm: {
        directory_desc: "",
        directory_model_id: "",
        directory_name: "",
        directory_type: "",
        directory_type_text: "",
        parent_id: "",
        parent_name: ""
      },
      muLvTypeList: [
        { directory_type: 0, directory_type_name: "正式目录" },
        { directory_type: 1, directory_type_name: "临时目录" }
      ],
      rules: {
        directory_name: [
          { required: true, message: "请输入目录名称", trigger: "blur" },
          { min: 3, max: 12, message: "目录名称不能为空", trigger: "blur" }
        ],
        directory_type: [
          { required: true, message: "请输选择目录类型", trigger: "blur" },
          { min: 3, max: 12, message: "目录类型不能为空", trigger: "blur" }
        ],
        directory_desc: [
          { required: true, message: "请输入目录标识", trigger: "blur" },
          { min: 3, max: 12, message: "目录标识不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    // ...mapGetters(["allRoleList"])
  },
  created() {
    this.parms.directory_model_id = this.$route.query.directory_model_id;
  },
  mounted() {
    this.queryAllDirectories();
  },
  watch: {},
  methods: {
    async queryAllDirectories() {
      this.listLoading = true;
      try {
        const { data: caseTypeDetailList } = await queryAllDirectories(
          this.parms
        );
        this.caseTypeDetailList = caseTypeDetailList;
        this.directory_Typename(this.caseTypeDetailList);
        this.listLoading = false;
        var href=document.domain;
        if(href=="192.1.44.241"||href=="192.2.2.190"||href=="192.1.44.145"){
            this.flag=0;
        }else{
          this.$nextTick(() => {
            this.setSort();
            this.setSortT();
          });
        } 
        
      } catch {
        this.caseTypeDetailList = [];
        this.listLoading = false;
        this.$message({
          message: "无相关案件类型详情信息",
          type: "warning"
        });
      }
    },
    //添加根目录接口
    async addRootDir(data) {
      this.listLoading = true;
      try {
        const { code: code } = await addRootDir(this.addRootDirectoryForm);
        this.listLoading = false;
        if (code == 0) {
          this.$message({
            message: "添加根目录成功",
            type: "success"
          });
          this.addRootDirVisible = false;
          this.queryAllDirectories();
        }
      } catch {
        // this.listLoading = false;
        this.$message({
          message: "添加根目录失败",
          type: "error"
        });
      }
    },
    //添加目录接口
    async addDir(data) {
      this.listLoading = true;
      try {
        const { code: code } = await addRootDir(this.addDirectoryForm);
        this.listLoading = false;
        if (code == 0) {
          this.$message({
            message: "添加目录成功",
            type: "success"
          });
          this.addDirVisible = false;
          this.queryAllDirectories();
        }
      } catch {
        // this.listLoading = false;
        this.$message({
          message: "添加根目录失败",
          type: "error"
        });
      }
    },
    //修改目录接口
    async updateDir(data) {
      this.listLoading = true;
      try {
        const { code: code } = await updateDir(this.addDirectoryForm);
        this.listLoading = false;
        if (code == 0) {
          this.$message({
            message: "修改目录成功",
            type: "success"
          });
          this.eidtDirVisible = false;
          this.queryAllDirectories();
        }
      } catch {
        // this.listLoading = false;
        this.$message({
          message: "修改目录失败",
          type: "error"
        });
      }
    },
    //拖拽接口updateDirIndex
    async updateDirIndex(data) {
      this.listLoading = true;
      if (this.newList.length == 0) {
        this.$message({
          message: "暂未有排序变更",
          type: "warning"
        });
        return;
      }
      try {
        const { code: code } = await updateDirIndex(this.newList);
        this.listLoading = false;
        if (code == 0) {
          this.$message({
            message: "目录移动成功",
            type: "success"
          });
          // this.eidtDirVisible = false;
          this.queryAllDirectories();
        }
      } catch {
        // this.listLoading = false;
        this.$message({
          message: "目录移动失败",
          type: "error"
        });
      }
    },
    //拖拽子目录
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody "
      )[0];
      this.sortable = Sortable.create(el, {
        group: {
          name: "words",
          pull: false,
          put: true
        },
        // sort:false,
        draggable: ".el-table__row--level-1",
        // ghostClass: 'blue-background-class',
        ghostClass: "sortable-ghost", // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onStart: evt => {},
        onEnd: evt => {
          console.log("evt.oldIndex:" + evt.oldIndex);
          console.log("evt.newIndex:" + evt.newIndex);
          var textList = evt.item.innerText.split(/[\s\n]/);
          // console.log(textList[0])
          var this_textName = textList[0];
          var arr_num = [];
          var num = 0;
          var dragList = [];
          var parentIndex = 0;
          var childrenTatol = 0;
          const i = 1;
          for (var key in this.caseTypeDetailList) {
            // num += this.caseTypeDetailList[key].children.length;
            num += this.caseTypeDetailList[key].children.length + parseInt(key);
            if(key>1){
              num=num-(key-1)
            }
            arr_num.push(num);
          }
          // console.log(arr_num)
          for (var key in arr_num) {
            dragList = [];
            if (evt.oldIndex <= arr_num[key] && evt.newIndex <= arr_num[key]) {
              parentIndex = parseInt(key) + 1;
              if (key == 0) {
                childrenTatol = 0;
              } else {
                childrenTatol = arr_num[key - 1];
              }
              var keyIndex = key;
              dragList = this.caseTypeDetailList[keyIndex].children;
              break;
            } else if (
              evt.oldIndex <= arr_num[key] &&
              evt.newIndex > arr_num[key]
            ) {
              this.caseTypeDetailList = [];
              this.queryAllDirectories();
              this.$message({
                message: "不可跨目录移动",
                type: "warning"
              });
              // window.history.back(-1);
              return;
            } else if (
              evt.oldIndex > arr_num[key] &&
              evt.newIndex - 1 <= arr_num[key]
            ) {
              this.caseTypeDetailList = [];
              this.queryAllDirectories();
              this.$message({
                message: "不可跨目录移动",
                type: "warning"
              });
              return;
            }
          }
          // if(parentIndex>1){
          // var newIndexValue = evt.newIndex - childrenTatol - parentIndex + 1;
          // var oldIndexValue = evt.oldIndex - childrenTatol - parentIndex + 1;
          var newIndexValue;
          var oldIndexValue
          // console.log("childrenTatol:"+childrenTatol)
              if(childrenTatol==0){
                 newIndexValue = evt.newIndex ;
                  oldIndexValue = evt.oldIndex ;
              }else{
                  newIndexValue = evt.newIndex - childrenTatol -1 ;
                  oldIndexValue = evt.oldIndex - childrenTatol  -1;
              }
          // console.log(newIndexValue);
          // console.log(oldIndexValue);
          for (var key in dragList) {
            if (dragList[key].directory_name == textList[0]) {
              dragList[key].directory_index = newIndexValue;
            } else if (
              oldIndexValue < dragList[key].directory_index &&
              dragList[key].directory_index <= newIndexValue
            ) {
              dragList[key].directory_index -= 1;
            } else if (
              oldIndexValue > dragList[key].directory_index &&
              dragList[key].directory_index >= newIndexValue
            ) {
              dragList[key].directory_index += 1;
            }
          }
          // }
          var compare = function(prop) {
            return function(obj1, obj2) {
              var val1 = obj1[prop];
              var val2 = obj2[prop];
              if (val1 < val2) {
                return -1;
              } else if (val1 > val2) {
                return 1;
              } else {
                return 0;
              }
            };
          };
          dragList.sort(compare("directory_index"));
          this.newList = dragList;
          if (evt.oldIndex == evt.newIndex) {
            this.$message({
              message: "不可移动",
              type: "warning"
            });
          } else {
            this.$message({
              message: "目录移动成功请点击保存",
              type: "success"
            });
          }
        },
        onMove: evt => {}
      });
    },
    //拖拽根目录
    setSortT() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody "
      )[0];
      this.sortable = Sortable.create(el, {
        group: {
          name: "words",
          pull: false,
          put: true
        },
        draggable: ".expanded",
        ghostClass: "sortable-ghost", // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onStart: evt => {},
        onEnd: evt => {
          // console.log("evt.oldIndex:" + evt.oldIndex);
          // console.log("evt.newIndex:" + evt.newIndex);
          var muLvNameList = this.$refs.dragTable.$el.querySelectorAll(
            ".el-table__body-wrapper > table > tbody .expanded>td:first-child"
          );
          var TextName = [];
          for (var key in muLvNameList) {
            TextName.push(muLvNameList[key].innerText);
          }
          var dragListLev0 = [];
          var oldList = this.caseTypeDetailList;

          for (var key in TextName) {
            var name = TextName[key];
            for (var i in this.caseTypeDetailList) {
              if (name == this.caseTypeDetailList[i].directory_name) {
                this.caseTypeDetailList[i].directory_index = key;
                dragListLev0.push(this.caseTypeDetailList[i]);
              }
            }
          }
          var oldIndex = [];
          var dragIndex = [];
          for (var i in oldList) {
            oldIndex.push(oldList[i].directory_index);
          }
          for (var i in dragListLev0) {
            dragIndex.push(dragListLev0[i].directory_index);
          }
          if (oldIndex.toString() == dragIndex.toString()) {
            this.$message({
              message: "不可移入子目录",
              type: "error"
            });
            this.caseTypeDetailList = [];
            this.queryAllDirectories();
          } else {
            this.caseTypeDetailList = []; //this.caseTypeDetailList=dragList;

            this.newList = dragListLev0;
           
            this.updateDirIndex();
          }

          // var textList=evt.item.innerText.split(/[\s\n]/);
          //     var this_textName=textList[0];
          //     console.log(this_textName)
          //     var arr_num=[];
          //     var num=0;
          //     var dragList=[];
          //     for(var key in this.caseTypeDetailList){
          //         num+=this.caseTypeDetailList[key].children.length;
          //         arr_num.push(num);
          //         if(this.caseTypeDetailList[key].directory_name!==this_textName){
          //             dragList.push(this.caseTypeDetailList[key]);
          //         }
          //     }
          //     console.log(arr_num);

          // for(var key in arr_num){
          //   dragList=[];
          //   if(evt.oldIndex<=arr_num[key]&&evt.newIndex<=arr_num[key]){
          //     dragList=this.caseTypeDetailList[key].children;
          //     break;
          //   }else{
          //     this.caseTypeDetailList=[];
          //     this.queryAllDirectories();
          //     this.$message({
          //     message: "不可跨目录移动",
          //       type: "warning"
          //     });
          //     return;
          //   }
          // }
          //     //重新排序
          //     for(var key in dragList){
          //         if(dragList[key].directory_name==textList[0]){
          //             dragList[key].index=evt.newIndex;
          //             dragList[key].directory_index=dragList[key].index;
          //         }
          //         else if(evt.oldIndex<dragList[key].index&&dragList[key].index<=evt.newIndex){
          //             dragList[key].index-=1;
          //             dragList[key].directory_index=dragList[key].index;
          //         }else if(evt.oldIndex>dragList[key].index&&dragList[key].index>=evt.newIndex){
          //              dragList[key].index+=1;
          //             dragList[key].directory_index=dragList[key].index;
          //         }
          //     }
        },
        onMove: evt => {}
      });
    },
    //递归目录类型
    directory_Typename(arr) {
      arr.forEach(method => {
        if (method.directory_type == 0) {
          method.directory_type_name = "正式目录";
        } else {
          method.directory_type_name = "临时目录";
        }
        if (method.children.length > 0) {
          this.directory_Typename(method.children);
        } else {
          return;
        }
      });
    },
    muLvTypeChange() {},
    AddRootDirSure() {
      if (this.addRootDirectoryForm.directory_name == "") {
        this.$message({
          message: "目录名称必须的",
          type: "warn"
        });
        return;
      }
      if (this.addRootDirectoryForm.directory_type_text == "") {
        this.$message({
          message: "请选择目录类型",
          type: "warn"
        });
        return;
      }
      if (this.addRootDirectoryForm.directory_desc == "") {
        this.$message({
          message: "请输入目录标识",
          type: "warn"
        });
        return;
      }
      // this.addRootDirectoryForm.directory_model_id=this.parms.directory_model_id;
      this.directory_type(this.addRootDirectoryForm);
      var caseTypeLength = this.caseTypeDetailList.length + 1;
      // console.log( caseTypeLength);
      // this.addRootDirectoryForm.directory_index=caseTypeLength+1;
      this.addRootDir(this.addRootDirectoryForm);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      console.log(this.currentRow);
    },
    //映射目录id
    directory_type(form) {
      if (form.directory_type_text == "正式目录") {
        form.directory_type = 0;
      } else if (form.directory_type_text == "临时目录") {
        form.directory_type = 1;
      }
    },
    //添加根目录时重置
    onAddRootDir() {
      this.addRootDirVisible = true;
      this.addRootDirectoryForm = {
        directory_desc: "",
        directory_model_id: "",
        directory_name: "",
        directory_type: "",
        directory_type_text: "",
        parent_id: 0,
        parent_name: "wwww"
      };
      // this.addRootDirectoryForm.directory_model_id = this.currentRow.directory_model_id;
      // this.parms.directory_model_id = this.$route.query.directory_model_id;
      this.addRootDirectoryForm.directory_model_id = this.$route.query.directory_model_id;
    },

    //添加目录触发事件
    onAddDir() {
      if (this.currentRow == null) {
        this.$message({
          message: "请选择添加子目录的目录",
          type: "warning"
        });
        return;
      }
      this.addDirVisible = true;
      this.addDirectoryForm = {
        directory_desc: "",
        directory_model_id: "",
        directory_name: "",
        directory_type: "",
        directory_type_text: "",
        parent_id: "",
        parent_name: ""
      };
      this.addDirectoryForm.directory_model_id = this.currentRow.directory_model_id;
      this.addDirectoryForm.parent_id = this.currentRow.directory_id;
      this.addDirectoryForm.parent_name = this.currentRow.directory_name;
    },
    AddDirSure() {
      this.directory_type(this.addDirectoryForm);
      if (this.addDirectoryForm.directory_name == "") {
        this.$message({
          message: "目录名称必须的",
          type: "warn"
        });
        return;
      }
      if (this.addDirectoryForm.directory_type_text == "") {
        this.$message({
          message: "请选择目录类型",
          type: "warn"
        });
        return;
      }
      if (this.addDirectoryForm.directory_desc == "") {
        this.$message({
          message: "请输入目录标识",
          type: "warn"
        });
        return;
      }
      this.addDirectoryForm.directory_model_id = this.parms.directory_model_id;
      this.addDir(this.addDirectoryForm);
    },

    // 编辑目录弹出框框
    onEditUser() {
      if (this.currentRow == null) {
        this.$message({
          message: "请选择要编辑的目录",
          type: "warning"
        });
        return;
      } else {
        this.eidtDirVisible = true;
        this.addDirectoryForm = this.currentRow;
        // this.addDirectoryForm.directory_name= this.currentRow.directory_name;
        // this.addDirectoryForm.directory_desc = this.currentRow.directory_desc;
        this.addDirectoryForm.directory_type_text = this.currentRow.directory_type_name;
        // this.addDirectoryForm.directory_type = this.currentRow.directory_type;
      }
    },
    eidtDirSure() {
      this.directory_type(this.addDirectoryForm);
      if (this.addDirectoryForm.directory_name == "") {
        this.$message({
          message: "目录名称必须的",
          type: "warn"
        });
        return;
      }
      if (this.addDirectoryForm.directory_type_text == "") {
        this.$message({
          message: "请选择目录类型",
          type: "warn"
        });
        return;
      }
      if (this.addDirectoryForm.directory_desc == "") {
        this.$message({
          message: "请输入目录标识",
          type: "warn"
        });
        return;
      }
      this.updateDir(this.addDirectoryForm);
    },
    //删除目录
    onDelDir() {
      if (this.currentRow == null) {
        this.$message({
          message: "请选择要删除的目录",
          type: "warning"
        });
        return;
      } else {
        this.directory_id = this.currentRow.directory_id;
        this.open(this.currentRow.directory_id);
      }
    },
    open() {
      this.$confirm("此操作将永久删除该目录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRootDir(this.directory_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //目录信息修改
    async editRole(addDirectoryForm) {
      this.listLoading = true;
      try {
        const { data: IsAdd } = await editRole(addDirectoryForm);
        this.listLoading = false;
        this.$message({
          message: "修改成功",
          type: "success"
        });
        //刷新角色列表
        this.getAllRoleList();
      } catch {
        this.$message({
          message: "修改失败",
          type: "error"
        });
      }
    },
    //目录删除
    async delRootDir(directory_id) {
      this.listLoading = true;
      try {
        const { code: code } = await delRootDir({
          directory_id: directory_id
        });
        this.listLoading = false;
        if (code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.queryAllDirectories();
        }

        //刷新角色列表
        //  this.getAllRoleList();
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
  margin-bottom: 15px;
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 200px;
}
.el-form-item {
  margin-right: 20px;
}
.userTableRow {
  height: 760px;
  // overflow-y: scroll;
}
.pageRow {
  margin-top: 15px;
}
.el-dialog {
  width: 500px;
}
.el-table td,
.el-table th {
  text-align: center;
}
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
