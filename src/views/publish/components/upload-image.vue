<template>
  <div>
    <div class="box-wrap"  @click="handleShowMediaBox">
      <p>点击选择图片</p>
      <!-- value是props中的value -->
      <i
      v-if="!value"
      style="margin-top: 50px;
      font-size: 30px"
      class="el-icon-plus"
      ></i>
      <img v-else width="120" :src="value">
    </div>
    <!-- 对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%">
      <el-tabs value="first">
        <el-tab-pane label="图片上传" name="first">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
            name="image"
            :on-success="handleUplaodSuccess"
            :show-file-list="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="媒体库" name="second">媒体库</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  // 这里的value就是父组件中articleForm.cover.images[item-1]的值
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      imageUrl: null
    }
  },
  methods: {
    // 点击上传图片 弹出弹框
    handleShowMediaBox () {
      // 1. 显示弹框
      this.dialogVisible = true
      // 2. 在弹框中展示图片素材
      // 3. 用户可以点击切换图片的选中状态
      // 4. 用户点击确定，我们拿到所选的图片链接，将数据给谁？
    },
    // 图片上传成功
    handleUplaodSuccess (res) {
      this.imageUrl = res.data.url
    },
    // 点击确认发生的事
    handleOk () {
      // 关闭弹框
      this.dialogVisible = false
      // 将图片的地址同步到父组件的articleForm.cover.images数组中去
      this.$emit('input', this.imageUrl)
    }
  }
}
</script>

<style lang="less" scoped>
.box-wrap {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
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
