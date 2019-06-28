<template>
  <el-card class="box-card">
    <div slot="header">
      <span>评论管理</span>
    </div>
    <template>
      <el-table :data="articles" style="width: 100%">
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="total_comment_count" label="评论总数"> </el-table-column>
      <el-table-column prop="fans_comment_count" label="粉丝评论数"> </el-table-column>
      <el-table-column
        label="允许评论">
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.changeLoading"
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleChangeCommentStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      </el-table>
    </template>
  </el-card>
</template>

<script>
export default {
  name: 'ArticleComment',
  data () {
    return {
      articles: []
    }
  },
  created () {
    // 加载评论列表
    this.loadArticles()
  },
  methods: {
    // 加载评论列表
    loadArticles () {
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          response_type: 'comment'
        }
      }).then(data => {
        // console.log(data)
        // 获取文章时候 都让按钮的加载状态为false
        data.results.forEach(item => {
          item.changeLoading = false
        })
        this.articles = data.results
      }).catch(err => {
        console.log(err)
        this.$message.error('加载评论列表失败')
      })
    },
    // 修改文章评论状态
    handleChangeCommentStatus (item) {
      // 没办法一个一个评论状态禁用
      // 就给每个对象添加一个属性 用来控制网络慢时的禁用状态
      item.changeLoading = true // 禁用开关的点击状态
      this.$http({
        method: 'PUT',
        url: '/comments/status',
        params: {
          article_id: item.id.toString()
        },
        data: {
          allow_comment: item.comment_status
        }
      }).then(data => {
        console.log(data)
        this.$message({
          type: 'success',
          message: `${item.comment_status ? '启用' : '关闭'}评论状态成功`
        })
        item.changeLoading = false // 启用开关的点击状态
      }).catch(err => {
        console.log(err)
        this.$message.error('评论状态修改失败')
        item.changeLoading = false // 启用开关的点击状态
        item.comment_status = !item.comment_status // 如果有错则返回原来状态
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
