<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-date-picker
            v-model="form.value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
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
              <el-button type="success" size="small" plain>修改</el-button>
              <el-button type="danger" size="small" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 页码 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="handleCurrentChange"
        :disabled="articleLoading">
      </el-pagination>
      <!-- /页码 -->
    </el-card>
    <!-- /文章列表 -->
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value1: ''
      },
      articles: [],
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
      ]
    }
  },
  // 获取文章列表
  // 在Authorization 请求头中携带的token，格式为"Bearer "拼接上token，注意Bearer后有一个空格
  created () {
    this.loadArticles()
  },
  methods: {
    // 加载所有文章  参数默认获取第一页
    loadArticles (page = 1) {
      this.articleLoading = true
      this.$http({
        method: 'GET',
        url: '/articles',
        // headers: { // 自定义发送请求头  才能获取到数据
        //   Authorization: `Bearer ${userInfo.token}`
        // }
        // 每次发送axios请求 都要设置请求头所以使用asiox请求拦截器
        params: {
          page, // 请求数据的页码，不传默认为 1
          per_page: 10// 请求数据的每页大小，不传默认为 10
        }
      }).then(data => {
        console.log(data) // data.results是数组结果
        this.articles = data.results
        this.totalCount = data.total_count // 记录数据总条数
        this.articleLoading = false
      })
    },

    // 页码改变 获取当前页的10条数据
    handleCurrentChange (page) {
      // console.log(page) // 点击页码几就输出几
      this.loadArticles(page)
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
