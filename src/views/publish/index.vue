<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button type="success" @click="handlePublish(false)">发布</el-button>
        <el-button type="primary" @click="handlePublish(true)">存入草稿</el-button>
      </div>
    </div>
    <el-form>
      <el-form-item>
        <el-input type="text" v-model="articleForm.title"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- bidirectional data binding（双向数据绑定） -->
        <quill-editor
          v-model="articleForm.content"
          ref="myQuillEditor"
          :options="editorOption"
          >
        </quill-editor>
      </el-form-item>
      <el-form-item label="封面">
      </el-form-item>
      <el-form-item label="频道">
        <article-channel v-model="articleForm.channel_id"></article-channel>
        <!-- <article-channel
        :value="articleForm.channel_id"
        @input="articleForm.channel_id = $event">
        </article-channel> -->
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// 频道组件
import ArticleChannel from '@/components/article-channel'

// 富文本编辑器 require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'AppPublish',
  components: {
    ArticleChannel, // 频道组件
    quillEditor // 富文本编辑器
  },
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        cover: { // 封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 图片链接
        },
        channel_id: '' // 频道
      },
      editorOption: {} // 富文本编辑器相关参数选项
    }
  },
  methods: {
    // 发布文章
    handlePublish (draft = false) {
      this.$http({
        method: 'POST',
        url: '/articles',
        data: this.articleForm,
        params: {
          draft
        }
      }).then(data => {
        console.log(data)
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('发布失败')
      })
    }
  },
  computed: { // 计算属性 是函数 当属性用
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  }
}
</script>

<style lang="less" scoped>
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
