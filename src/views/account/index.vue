<template>
  <el-card>
    <div slot="header">
      <span>账户设置</span>
    </div>
    <el-row>
      <el-col :span="8">
        <el-form>
          <el-form-item label="媒体名称">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体简介">
            <el-input v-model="userInfo.intro"></el-input>
          </el-form-item>
          <el-form-item label="头条号ID">
            <el-input disabled :value="userInfo.id && userInfo.id.toString()"></el-input>
          </el-form-item>
          <el-form-item label="绑定手机">
            <el-input disabled :value="userInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdate">保存更新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="4">
        <!--
          el-upload 上传组件，它会自动将用户选择的图片去请求上传，我们要做的就是配置一下
           action 请求地址
           由于它用的自己内部的请求，不是使用的 axios 去发请求
              完整路径
              它的请求也不会经过 axios 拦截器，所以需要手动配置 token
           可惜的是它不支持自定义请求方法，前功尽弃
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :headers="{ Authorization: token }"
          name="photo"
         -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="handleUpload">
          <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'AccountSetting',
  data () {
    return {
      userInfo: {}
      // token: `Bearer ${JSON.parse(window.localStorage.getItem('user_info')).token}`
    }
  },
  created () {
    // 获取账户信息
    this.loadUserInfo()
  },
  methods: {
    // 获取账户信息
    loadUserInfo () {
      this.$http({
        method: 'GET',
        url: '/user/profile'
      }).then(data => {
        // console.log(data)
        this.userInfo = data
      })
    },
    // 更新用户信息
    handleUpdate () {
      const { name, intro, email } = this.userInfo
      this.$http({
        method: 'PATCH',
        url: '/user/profile',
        data: {
          name,
          intro,
          email
        }
      }).then((data) => {
        // console.log(data)
        // 将更新后的账户信息存放到vuex容器中
        this.$store.commit('changeUser', data)
        this.$message({
          type: 'success',
          message: '更新用户信息成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新用户信息失败')
      })
    },
    handleAvatarSuccess () {},
    beforeAvatarUpload () {},
    // 用户上传头像
    handleUpload (uploadConfig) {
      // axios 上传文件
      // 1. 构建一个 FormData 表单对象
      //    将文件对象添加到 FormData 中
      // 2. 将 FormData 配置到请求体 data 选项中
      // console.log(uploadConfig)
      const fd = new FormData()
      fd.append('photo', uploadConfig.file)
      this.$http({
        method: 'PATCH',
        url: '/user/photo',
        data: fd
      }).then(data => {
        this.userInfo.photo = data.photo
        // 上传成功的用户头像存入vuex的容器中
        this.$store.commit('changeUser', data)
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('上传失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
