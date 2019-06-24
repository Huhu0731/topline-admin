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
              <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
              <!-- codeTimer开始为null !!codeTimer为false 有了定时器后 !!codeTimer为true -->
              <el-button :disabled="!!codeTimer||codeLoading" @click="handleSendCode">{{codeTimer?`剩余${codeSecons}秒`:'获取验证码'}}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree">
              <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
            </el-checkbox>
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

// import axios from 'axios'
import '@/vendor/gt.js' // gt.js 会向全局 window 暴露一个函数 initGeetest
const initCodeSeconds = 60 // 倒计时一共多少秒

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '17635950228',
        code: '',
        agree: '' // 是否同意用户协议
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
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      codeSecons: initCodeSeconds, // 倒计时的时间
      codeTimer: null, // 倒计时定时器
      saveMobile: '', // 用来存储手机号 在点击获取验证码 滑动图片出现 但是并没有去滑动 而改变了手机号码 以它来做判断
      codeLoading: false // 当网络不好的时候禁止用户多次点击
    }
  },
  methods: {

    // 请求获取初始化验证码参数
    handleSendCode () {
      // console.log('handleSendCode')
      // 点击获取验证码后 只对电话号码进行验证
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        // console.log(errorMessage) // 成功为空 失败为长度必须为11个字符
        if (errorMessage.trim().length > 0) {
          return
        }
        // 手机号码验证成功
        // 验证是否有插件对象
        if (this.captchaObj) {
          // 若有插件对象 则判断前后手机号码是否一致
          if (this.saveMobile === this.form.mobile) {
            this.captchaObj.verify()
          } else {
            // 若不一致
            // 这里还有一个小问题 就是从新调用这个方法 dom会从新创建一个弹框
            // 因此在此之前要清除之前的弹框元素
            document.body.removeChild(document.querySelector('.geetest_panel'))
            this.showGeetest()
          }
        } else {
          this.showGeetest()
        }
      })
    },
    showGeetest () {
      this.codeLoading = true
      this.$http({
        method: 'GET',
        url: `/captchas/${this.form.mobile}`
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
          captchaObj.onReady(() => {
            this.saveMobile = this.form.mobile
            // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify()
            this.codeLoading = false // 验证码显示出来后就可点击
          }).onSuccess(() => {
            // your code
            // console.log('验证成功')
            // console.log(captchaObj.getValidate())
            const result = captchaObj.getValidate()
            this.$http({
              method: 'GET',
              url: `/sms/codes/${this.form.mobile}`,
              params: {
                challenge: result.geetest_challenge,
                validate: result.geetest_validate,
                seccode: result.geetest_seccode
              }
            }).then(res => {
              console.log(res.data)
              // 发送短信后开始倒计时
              this.codeCountDown()
            })
          })
        })
      })
    },

    // 发送短信后开始倒计时
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSecons--
        if (this.codeSecons <= 0) {
          this.codeSecons = initCodeSeconds // 倒计时恢复
          window.clearInterval(this.codeTimer) // 清除定时器
          this.codeTimer = null // 存储定时器的参数也恢复
        }
      }, 1000)
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
      this.$http({
        method: 'POST',
        url: '/authorizations',
        data: this.form
      }).then(res => {
        // console.log(res.data)
        // 用户登录成功 把res.data 的数据在本地保存 用于登陆后 左上角的用户信息更新
        window.localStorage.setItem('user_info', JSON.stringify(res.data.data))
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
