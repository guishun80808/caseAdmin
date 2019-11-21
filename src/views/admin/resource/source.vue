<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-19 15:33:03
 * @LastEditTime: 2019-10-24 10:13:30
 * @LastEditors: GuiShun
 -->
<template>
  <div id="resdep">
    <el-row :gutter="10" style="margin:0">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" @click="onAddCourt">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="table-content">
      <el-table :data="courtList" style="width: 100%" border height="750">
        <el-table-column type="index" label width="50"></el-table-column>
        <el-table-column prop="courtName" label="法院名称" align="center"></el-table-column>
        <el-table-column prop="courtRoomName" label="庭室名称" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" plain @click="onDelRes(scope.row)">删除</el-button>
          </template>''
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="25%">
      <el-form ref="formParams" label-width="120px" class="demo-ruleForm">
        <el-form-item label="部门：">
          <treeselect
            :change-on-select="true"
            :multiple="true"
            :options="resList"
            placeholder="请选择"
            v-model="resValue"
            @select="deptChange"
            :normalizer="normalizer"
          />
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
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  queryResList,
  queryAllList,
  delResList,
  addResList
} from "@/api/admin/resource";
import { searchDutyList } from "@/api/admin/duties";
import { mapState, mapGetters } from "vuex";
export default {
  props: {},
  data() {
    return {
      formParams: [],
      rules: {
        groupName: [
          { required: true, message: "请输入组名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入组描述", trigger: "blur" }
        ]
      },
      datas: [],
      resceId: {
        resourceId: ""
      },
      courtList: [],
      dialogFormVisible: false,
      resList: [],
      resValue: [],
      addParams: []
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    }),
    ...mapGetters(["allRoleList"]),
    selection: {
      get: function() {
        var that = this;
        return this.YX.filter(function(item) {
          return item.text == that.selected;
        })[0].ZY;
      }
    }
  },
  created() {},
  mounted() {
    this.groupHide();
    this.queryAllList();
    let resdatas = sessionStorage.getItem("resdatas");
    resdatas = JSON.parse(resdatas);
    this.resceId.resourceId = resdatas.resourceId;
    this.datas = resdatas;
    this.getSelects(this.resceId);
    // this.onSearch();
  },
  methods: {
    deptChange(val) {
      // console.log(val);
      // setTimeout(() => {
      //
      // }, 200);
    },
    async queryAllList() {
      const { data } = await queryAllList();
      this.resList = data;
      this.getSelects(this.resceId);
    },
    async getSelects(params) {
      try {
        const { data } = await queryResList(params);
        this.courtList = data;

        // this.resValue = [];
        if(this.courtList.length==0){
            this.resValue=[]
        }else{
          if (this.resValue.length == 0) {
          this.resList.forEach(element => {
            var childrenLength = element.courtRoomList.length;
            var num = 0;
            if (element.courtRoomList && element.courtRoomList.length > 0) {
              this.courtList.forEach((el, i) => {
                if (el.courtId == element.id) {
                  num++;
                }
              });
              if (num == childrenLength && num > 0) {
                this.resValue.push(element.id);
              } else if (num > 0) {
                this.courtList.forEach((el, i) => {
                  if (el.courtId == element.id) {
                    var courtRoomId = el.courtRoomId;
                    element.courtRoomList.forEach(room => {
                      if (room.court_room_id == courtRoomId) {
                        this.resValue.push(room.id);
                      }
                    });
                  }
                });
              }
            }
          });
        }
        }
        
      } catch {
        this.courtList = [];
      }
    },
    groupHide() {
      this.$emit("hideGroup", "false");
    },
    async delRes(param) {
      try {
        const { data } = await delResList(param);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getSelects(this.resceId);
      } catch (e) {
        this.$message({
          message: "删除失败,请联系管理员!",
          type: "error"
        });
      }
    },
    onDelRes(row) {
      let param = { id: row.id };
      this.$confirm("确定删除此项吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRes(param);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          param.resId = "";
        });
    },
    choose() {
      // 自动回选
      this.resList.forEach(element => {
        var childrenLength = element.courtRoomList.length;
        var num = 0;
        if (element.courtRoomList && element.courtRoomList.length > 0) {
          this.courtList.forEach((el, i) => {
            if (el.courtId == element.id) {
              num++;
            }
          });
          if (num == childrenLength && num > 0) {
            this.resValue.push(element.id);
          } else if (num > 0) {
            this.courtList.forEach((el, i) => {
              if (el.courtId == element.id) {
                var courtRoomId = el.courtRoomId;
                element.courtRoomList.forEach(room => {
                  if (room.court_room_id == courtRoomId) {
                    this.resValue.push(room.id);
                  }
                });
              }
            });
          }
        }
      });
    },
    onAddCourt() {
      this.addParams = [];
      // this.resValue = [];
      this.dialogFormVisible = true;
    },
    async addRes(formParams) {
      try {
        const { data } = await addResList(formParams);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        // console.log(this.resValue);
        this.getSelects(this.resceId);
      } catch (e) {
        this.$message({
          message: "新增失败",
          type: "error"
        });
      }
    },
    save() {
      let self = this;
      self.resList.forEach(element => {
        let rooms = [];
        if (element.courtRoomList && element.courtRoomList.length > 0) {
          element.courtRoomList.forEach(room => {
            self.resValue.forEach((el, i) => {
              if (room.id == el) {
                rooms.push(room.court_room_id);
                self.addParams[i] = {
                  courtId: room.court_id,
                  rooms: rooms
                };
              }
            });
          });
        }
        self.resValue.forEach(ele => {
          if (element.id == ele) {
            let item = {
              courtId: element.id,
              rooms: []
            };
            if (element.courtRoomList && element.courtRoomList.length > 0) {
              element.courtRoomList.forEach(e => {
                item.rooms.push(e.court_room_id);
              });
            }
            self.addParams.push(item);
          }
        });
      });
      self.addParams = self.unique(self.addParams);
      let paramsInfo = {
        resourceId: this.resceId.resourceId,
        courtInfo: self.addParams
      };
      // console.log(paramsInfo);
      this.addRes(paramsInfo);
      self.dialogFormVisible = false;
    },
    unique(arr) {
      if (!Array.isArray(arr)) {
        // console.log("type error");
        return;
      }
      var array = [];
      var array1 = [];
      for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i].courtId) === -1) {
          array.push(arr[i].courtId);
          array1.push(arr[i]);
        }
      }
      return array1;
    },
    addGroupCancel() {
      this.dialogFormVisible = false;
    },
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.courtRoomList && !node.courtRoomList.length) {
        delete node.courtRoomList;
      }
      return {
        id: node.id,
        // parentId: node.parent_id,
        label: node.name,
        children: node.courtRoomList
      };
    }
  },

  components: { Treeselect }
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
