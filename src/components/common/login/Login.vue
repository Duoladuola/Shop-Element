<template>
  <div class="login">
    <div class="login-box">
      <!-- 1、头像区域 -->
      <div class="avatar">
        <img src="~assets/img/wode.svg" alt="">
      </div>
      <!-- 2、登录表单区域 -->
      <el-form label-width="0px" class="login-form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item >
        <!-- 按钮区域 -->
        <el-form-item class="button">
          <el-button type="primary" @click="loginBtnClick">登录</el-button>
          <el-button type="info" @click="resetBtnClick">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginCheck } from 'network/login'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 用户点击取消按钮的话，需要清空用户的输入form表单内容
    resetBtnClick () {
      this.$refs.loginFormRef.resetFields()
    },
    loginBtnClick () {
      // element提供的表单预验证功能
      this.$refs.loginFormRef.validate(vaild => {
        if (!vaild) return
        // 预验证成功后发起网络请求
        loginCheck(this.loginForm).then(res => {
          if (res.meta.status !== 200) {
            this.$message.error('登录失败')
          } else {
            this.$message.success('登录成功')
            // 登录成功的同时跳转到home页面
            // 1、保存token到sessionStorage
            // console.log(res)
            window.sessionStorage.setItem('token', res.data.token)
            // 2、编程式导航跳转到主页
            this.$router.push('/home')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login{
  background-color: #2b4b6b;
  height: 100%;
}
.login-box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50% ,-50%);
}
.login-box .avatar{
  height: 130px;
  width: 130px;
  border: 1px solid #ddd;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50% , -45%);
  background-color: #fff;
  box-shadow: 0 0 5px #eee;
}
.avatar img{
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
.login-form{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 20px;
}
.login-form .button{
  display: flex;
  justify-content: flex-end;
}
</style>>
