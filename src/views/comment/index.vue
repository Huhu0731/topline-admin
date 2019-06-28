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
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949">
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
        this.articles = data.results
      }).catch(err => {
        console.log(err)
        this.$message.error('加载评论列表失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
