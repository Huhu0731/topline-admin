<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt>
      </div>
      <div class="login-form">
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="handleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-login" type="primary" @click="handleLogin" :loading="loginLoading">登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import '@/vendor/gt.js' // gt.js 会向全局 window 暴露一个函数 initGeetest

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '17635950228',
        code: ''
      },
      loginLoading: false,
      captchaObj: null, // 通过 initGeetest 得到的极验验证码对象
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度必须为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度在必须为6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    // 请求获取初始化验证码参数
    handleSendCode () {
      // console.log('handleSendCode')
      let { mobile } = this.form

      if (this.captchaObj) {
        return this.captchaObj.verify()
      }

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data)
        const { data } = res.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind'
        }, captchaObj => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          this.captchaObj = captchaObj
          captchaObj.onReady(function () {
            // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify()
          }).onSuccess(function () {
            // your code
            // console.log('验证成功')
            // console.log(captchaObj.getValidate())
            const result = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge: result.geetest_challenge,
                validate: result.geetest_validate,
                seccode: result.geetest_seccode
              }
            }).then(res => {
              console.log(res.data)
            })
          })
        })
      })
    },

    // 点击登陆按钮
    handleLogin () {
      // console.log('123')
      // 表单验证通过才可登陆
      this.$refs['ruleForm'].validate(valid => {
        // console.log(valid) // false true
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => {
        // console.log(res.data)
        // Element 提供的 Message 消息提示组件，这也是组件调用的一种形式
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        this.loginLoading = false
        // 页面跳转
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        // console.log(err.response)
        if (err.response.status === 400) {
          this.$message.error('登录失败，手机号或验证码错误')
        }
        this.loginLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('./login_bg.jpg');
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .login-form-wrap {
    background-color: #fff;
    padding: 20px 50px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
