<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button
        type="success"
        @click="handlePublish(false)"
        :disabled="publishLoading"
        >{{ isEtid ? '更新': '发布' }}</el-button>
        <el-button type="primary" @click="handlePublish(true)" :disabled="publishLoading">存入草稿</el-button>
      </div>
    </div>
      <!-- <el-form v-loading="$route.name === 'publish-edit' && editLoading"> -->
      <el-form v-loading="isEtid && editLoading">
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

/**
 * 如果是更新，则在第1次更新数据之后开启监视
 * 如果是添加，则一上来就开启监视
 * 如果是从更新页面导航到发布页面，则清空表单数据
 * 如果是从发布页面导航到更新页面，则重新加载编辑页面的数据
 */

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
      editorOption: {}, // 富文本编辑器相关参数选项
      editLoading: false, // 点击编辑 form表单的加载
      publishLoading: false, // 发布更新文章按钮的禁用
      formDirty: false // 表单内容是否修改过
    }
  },
  created () {
    // 判断路由路径 是否加载文章信息
    // console.log(this.$route) // 中有路由名字
    // if (isEtid) {
    //   // 编辑文章时 加载该文章详细信息
    //   this.loadArticle()
    // }
    // isEtid 为true时 就会执行 this.loadArticle()
    this.isEtid && this.loadArticle()
    // 如果是发布文章 则一上来就开启监视
    if (this.$route.name === 'publish') {
      // 开启监视
      this.watchForm()
    }
  },
  methods: {
    // 发布文章 判断是发表还是更新
    handlePublish (draft = false) {
      this.publishLoading = true
      if (this.isEtid) {
        this.submitEdit(draft).then(() => {
          this.publishLoading = false
        })
      } else {
        this.submitAdd(draft).then(() => {
          this.publishLoading = false
        })
      }
    },
    // 点击更新按钮  更新文章
    submitEdit (draft) {
      return this.$http({
        method: 'PUT',
        url: `/articles/${this.$route.params.id}`,
        data: { // 请求体参数
          title: this.articleForm.title,
          content: this.articleForm.content,
          cover: this.articleForm.cover,
          channel_id: this.articleForm.channel_id
        },
        params: { // 查询字符串参数
          draft
        }
      }).then(data => {
        // console.log(data)
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新失败')
      })
    },
    // 点击发布按钮 发布文章
    submitAdd (draft) {
      return this.$http({
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
    },
    // 编辑文章时 加载该文章详细信息
    loadArticle () {
      this.editLoading = true
      // console.log(this.$route.params.id) // 地址栏中的参数id
      this.$http({
        method: 'GET',
        url: `articles/${this.$route.params.id}`
      }).then(data => {
        // console.log(data)
        this.articleForm = data
        this.editLoading = false
        // Vue 提供了这样的一个 API，简单理解就是延时调用
        this.$nextTick(() => {
          // 更新数据加载好以后，开启监视
          this.watchForm()
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('加载文章详情失败')
      })
    },
    // 监视表单数据是否发生变化
    watchForm () {
      const unWatch = this.$watch('articleForm', function () {
        // console.log('watchForm')
        this.formDirty = true
        // 监视到就关闭监视器
        unWatch()
      }, {
        deep: true // 深度监视
      })
    }
  },
  computed: { // 计算属性 是函数 当属性用
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    isEtid () {
      return this.$route.name === 'publish-edit'
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  },
  /**
   * 当要从当前导航到另一个路由的时候被触发
   * 我们可以在这里控制路由离开的行为
   * 例如当前页面如果有未保存的数据，我们就提示用户
   * to 要去哪里
   * from 来自哪里
   * next 就是允许通过的方法
   */
  beforeRouteLeave (to, from, next) {
    // 如果表单位被修改 则让其通过
    if (this.formDirty === false) {
      return next()
    }
    // 如果被修改 则提示用户
    const answer = window.confirm('当前有未保存的数据，确认离开吗？')
    if (answer) {
      // 正常往后进行导航
      next()
    } else {
      // 取消当前导航
      next(false)
    }
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
