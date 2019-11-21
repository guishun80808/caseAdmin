<!--
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-09-18 11:31:12
 * @LastEditTime: 2019-10-24 15:57:14
 * @LastEditors: GuiShun
 -->
<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar @sendData="handleReceive" />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <span>{{userInfo.currentUser.user_name}}</span>
        </el-form-item>
        <el-form-item label="原始密码" prop="oldPass">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            placeholder="请输入原始密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" placeholder="请输入新密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            placeholder="请再次输入新密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
        name: ""
      },
      rules: {
        oldPass: [{ validator: validatePass, trigger: "change" }],
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }]
      },
      dialogVisible: false
    };
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters(["userInfo"]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  mounted() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.checkPass.length < 6) {
            this.$message({
              showClose: true,
              type: "warning",
              message: "密码长度至少为六位！"
            });
            return;
          }
          let data = {
            oldPassword: this.ruleForm.oldPass,
            newPassword: this.ruleForm.pass,
            checkPassword: this.ruleForm.checkPass
          };
          this.$store
            .dispatch("user/editPassWord", data)
            .then(() => {
              this.$message({
                showClose: true,
                type: "success",
                message: "密码修改成功！"
              });
              this.dialogVisible = false;
            })
            .catch(() => {
              // this.$message({
              //   showClose: true,
              //   type: "error",
              //   message: "密码修改失败！"
              // });
              this.ruleForm.oldPass = "";
              this.ruleForm.pass = "";
              this.ruleForm.checkPass = "";
              this.dialogVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    handleReceive(payload) {
      this.dialogVisible = payload;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs["ruleForm"].resetFields();
    },
    getAllCourtList() {
      this.$store
        .dispatch("common/getAllCourtList")
        .then(() => {})
        .catch(() => {
          console.log("获取法院列表失败array");
        });
    },
    getAllCaseTypeList() {
      this.$store
        .dispatch("common/queryAllCaseTypeList")
        .then(() => {})
        .catch(() => {
          console.log("获取案件类型列表失败");
        });
    },
  },
  created() {
    this.getAllCaseTypeList();
    this.getAllCourtList();
    
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
