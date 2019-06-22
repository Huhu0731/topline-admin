<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt>
      </div>
      <div class="login-form">
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="handleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-login" type="primary">登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '17635950228',
        code: ''
      }
    }
  },
  methods: {

    // 请求获取初始化验证码参数
    handleSendCode () {
      // console.log('handleSendCode')
      let { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        console.log(res.data)
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
