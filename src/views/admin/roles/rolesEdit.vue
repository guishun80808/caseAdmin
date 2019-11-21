<template>
  <div>
    <vxe-table
      border
      :data="tableData"
      resizable
      row-id="funcId"
      :tree-config="{children: 'children'}"
      :select-config="{labelField: 'funcName',checkRowKeys:checkRows,checkStrictly:checkStrictly }"
      @select-change="selectChangeEvent"
      height="750px"
      ref="xTree"
    >
      <!-- :select-config="{checkStrictly: true}" 通过 checkStrictly 设置父子节点不互相关联 -->
      <vxe-table-column type="selection" title="功能名称" tree-node></vxe-table-column>
      <vxe-table-column field="funcType" title="功能类型" :formatter="formatterType"></vxe-table-column>
      <!-- <vxe-table-column field="createTime" title="功能类型" :formatter="formatTime"></vxe-table-column> -->
      <!-- <vxe-table-column field="createTime" title="创建时间" :formatter="formatTime"></vxe-table-column>
      <vxe-table-column field="description" title="描述"></vxe-table-column>-->
    </vxe-table>
    <el-button type="primary" style="margin-top:15px" @click="save">保存</el-button>
  </div>
</template>

<script>
import { getFunTree, getRoleFuncTreeById, editRole } from "@/api/admin/role";
import { parseTime } from "@/utils";
import { mapState, mapGetters } from "vuex";
export default {
  props: {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      roleId: 1,
      checkStrictly: false,
      checkRows: [],
      tableData: [],
      typeList: [
        {
          funcType: 1,
          funcName: "菜单"
        },
        {
          funcType: 2,
          funcName: "按钮"
        },
        {
          funcType: 3,
          funcName: "接口"
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.roleId = this.$route.query.roleId;
    this.groupHide();
    this.getRoleFuncTreeById(this.roleId);
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.$nextTick(function() {
          //页面加载完成后执行
          this.checkStrictly = false;
        });
      },
      // 深度观察监听
      deep: true
    }
  },

  methods: {
    async getFunTree() {
      const { data } = await getFunTree();
      this.tableData = data;
      // console.log(this.tableData);
    },
    async getRoleFuncTreeById(roleId) {
      try {
        const { data } = await getRoleFuncTreeById({
          roleId: roleId
        });
        this.checkRows = data;
         this.getFunTree();
        // console.log(this.checkRows);
      } catch {}
    },
    groupHide() {
      this.$emit("hideGroup", "false");
    },
    selectChangeEvent({ selection }) {
      console.log(selection);
    },
    formatterType({ cellValue }) {
      let item = this.typeList.find(item => item.funcType === cellValue);
      return item ? item.funcName : "";
    },
    formatTime({ cellValue, row, column }) {
      //   if (cellValue === null) {
      //     return (cellValue = "");
      //   } else {
      return (cellValue = parseTime(cellValue, "{y}-{m}-{d} {h}:{i}:{s}"));
      //   }
    },
    async save() {
      let funcIdList = [];
      this.$refs.xTree.getSelectRecords().forEach(element => {
        funcIdList.push(element.funcId);
      });

      let datas = {
        funcIdList: funcIdList,
        role_desc: this.$route.query.role_desc,
        role_id: this.$route.query.roleId,
        role_name: this.$route.query.role_name
      };
      try {
        const { data } = await editRole(datas);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        let params = {
          userId: this.userInfo.currentUser.user_id,
          funcType: 1
        };
        this.$store
          .dispatch("user/getInfo", params)
          .then(function(res) {})
          .catch(function(err) {
            console.log(err);
          });
        this.getRoleFuncTreeById(this.roleId);
        this.$store.dispatch("permission/getBtns");
        //刷新角色列表
        // this.getRoles();
        // window.location.reload();
      } catch (res) {
        this.$message({
          message: "编辑失败",
          type: "error"
        });
      }
      // console.log(this.$refs.xTree.getSelectRecords());
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
