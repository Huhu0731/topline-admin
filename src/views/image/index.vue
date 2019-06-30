<template>
  <el-card class="image-card">
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active" size="medium">
        <el-radio-button label="全部" ></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
      <el-button type="primary" size="medium">上传图片</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="4" v-for="item in images" :key="item.id">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="width:100%">
          <div style="padding: 10px; display: flex; justify-content: center;">
            <el-button type="primary" icon="el-icon-delete" circle plain></el-button>
            <el-button type="primary" icon="el-icon-star-off" circle plain></el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="yema">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total_count">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ImageList',
  data () {
    return {
      active: '全部',
      images: [],
      page: 1,
      total_count: 0
    }
  },
  created () {
    // 加载图片素材
    this.loadImages()
  },
  methods: {
    // 加载图片素材
    loadImages (page = 1) {
      this.$http({
        method: 'GET',
        url: '/user/images',
        params: {
          page,
          per_page: 12
        }
      }).then(data => {
        console.log(data)
        this.total_count = data.total_count
        this.images = data.results
      }).catch(err => {
        console.log(err)
        this.$message.error('获取图片素材失败')
      })
    },
    // 点击页面输出当前页
    handleCurrentChange (page) {
      // console.log(page)
      this.page = page
      this.loadImages(page)
    }
  }
}
</script>

<style lang="less" scoped>
.image-card {
  .action {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .yema {
    margin-top: 20px;
    .el-pagination{
      text-align: center;
    }
  }
}
</style>
