<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
      <el-form :model="filterParams" label-width="100px">
        <el-form-item label="状态">
          <!-- :label 是表单提交时上传的数据 -->
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio
            v-for="(item,index) in statuTypes"
            :key="item.label"
            :label="index + ''"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="begin_end_pubdate"
            value-format="yyyy-MM-dd"
            @change="handleChangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- /筛选区域 -->

    <!-- 文章列表 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到 <strong>{{ totalCount }}</strong> 条符合条件的内容</span>
      </div>
      <template>
        <!-- 表格列默认只能输出文本，如果需要自定义里面的内容，则需要 -->
        <!--
          slot-scope 是插槽作用域，现在先听个名词，你要知道的是值 scope 是起的一个名字
          scope 中有个成员叫 row
          也就是说 scope.row 就是当前的遍历项对象
          自定义列模板，el-table-column 的 prop 就没有意义了
        -->
        <el-table
          :data="articles"
          style="width: 100%"
          v-loading="articleLoading">
          <el-table-column
            prop="cover.images[0]"
            label="封面"
            width="60">
            <template slot-scope="scope">
              <img width="30" :src="scope.row.cover.images[0]">
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="230">
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="180">
            <template slot-scope="scope">
              <el-tag :type="statuTypes[scope.row.status].type">{{ statuTypes[scope.row.status].label }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作 ">
            <template slot-scope="scope">
              <el-button type="success" size="small" plain @click="$router.push(`/publish/${scope.row.id}`)">编辑</el-button>
              <el-button type="danger" size="small" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 页码
        total  总记录数
        current-page 当前页码，也就是高亮的那个页码-->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :current-page="page"
        @current-change="handleCurrentChange"
        :disabled="articleLoading">
      </el-pagination>
      <!-- /页码 -->
    </el-card>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'

export default {
  name: 'ArticleList',
  components: {
    ArticleChannel
  },
  data () {
    return {
      articles: [], // 文章列表
      totalCount: 0, // 数据总条数
      articleLoading: false, // 文章或者按钮禁用状态
      statuTypes: [ // 文章状态
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      channels: [], // 频道列表
      filterParams: { // 文章查询条件参数
        status: '', // 文章状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      begin_end_pubdate: [], // 时间下拉框存入的时间
      page: 1 // 用来记录分页器的当前页码
    }
  },

  // 获取文章列表
  // 在Authorization 请求头中携带的token，格式为"Bearer "拼接上token，注意Bearer后有一个空格
  created () {
    // 加载文章
    this.loadArticles()

    // 加载频道
    this.loadChannels()
  },

  methods: {
    // 加载所有文章  参数默认获取第一页
    loadArticles (page = 1) {
      this.articleLoading = true
      // 对filterParams 中的参数进行帅选 若条件为全部 则没有这个参数
      const filterData = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      // console.log(filterData)

      this.$http({
        method: 'GET',
        url: '/articles',
        // headers: { // 自定义发送请求头  才能获取到数据
        //   Authorization: `Bearer ${userInfo.token}`
        // }
        // 每次发送axios请求 都要设置请求头所以使用asiox请求拦截器
        params: {
          page, // 请求数据的页码，不传默认为 1
          per_page: 10, // 请求数据的每页大小，不传默认为 10
          ...filterData
        }
      }).then(data => {
        // console.log(data) // data.results是数组结果
        this.articles = data.results
        this.totalCount = data.total_count // 记录数据总条数
        this.articleLoading = false
      })
    },

    // 页码改变 获取当前页的10条数据
    handleCurrentChange (page) {
      // console.log(page) // 点击页码几就输出几
      this.page = page
      this.loadArticles(page)
    },

    // 加载频道
    loadChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        // console.log(data)
        this.channels = data.channels
      })
    },

    // 动态改变文章查询条件参数 开始结束时间的值
    handleChangeDate () {
      this.filterParams.begin_pubdate = this.begin_end_pubdate[0]
      this.filterParams.end_pubdate = this.begin_end_pubdate[1]
    },

    // 点击查询 根据查询条件查询文章
    onSubmit () {
      // 要根据查询参数做些判断  增加在loadArticles()方法中
      this.page = 1 // 让分页器页码在1
      this.loadArticles() // 加载第一页的数据 不传默认为1
    },

    // 点击删除按钮 实现删除功能
    handleDelete (article) {
      // console.log(article)
      this.$confirm('确定删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认执行
        // 发送删除请求
        this.$http({
          method: 'DELETE',
          url: `/articles/${article.id}`
        }).then(data => {
          // 提示删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // console.log(data)
          // 重新加载文章列表
          this.loadArticles(this.page)
        })
      }).catch(() => { // 取消执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
.list-table {
  margin-bottom: 30px;
}

// 分页居中
.el-pagination {
  text-align: center;
}
</style>
