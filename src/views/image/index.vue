<template>
  <el-card class="image-card">
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active" size="medium">
        <el-radio-button label="全部" @click.native="loadImages(1, false)"></el-radio-button>
        <el-radio-button label="收藏" @click.native="loadImages(1, true)"></el-radio-button>
      </el-radio-group>
      <el-upload
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
        name="image"
        :on-success="handleUplaodSuccess"
        :show-file-list="false">
        <el-button size="small" type="primary">上传图片</el-button>
      </el-upload>
    </div>
    <el-row :gutter="20">
      <el-col :span="4" v-for="item in images" :key="item.id">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="width:100%">
          <div style="padding: 10px; display: flex; justify-content: center;">
            <el-button
            type="primary"
            icon="el-icon-delete"
            circle plain
            @click=handleDelect(item)></el-button>
            <el-button
            type="primary"
            :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle plain
            @click="handleCollected(item)"></el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="yema">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total_count"
        :page-size="per_page">
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
      total_count: 0, // 总页数
      per_page: 6 // 每页数据
    }
  },
  created () {
    // 加载图片素材
    this.loadImages()
  },
  methods: {
    // 加载图片素材
    loadImages (page = 1, collect = false) {
      this.$http({
        method: 'GET',
        url: '/user/images',
        params: {
          collect,
          page,
          per_page: this.per_page
        }
      }).then(data => {
        // console.log(data)
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
    },
    // 图片是否收藏
    async handleCollected (item) {
      // console.log(item)
      try {
        const collect = !item.is_collected

        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect
          }
        })
        // console.log(data)
        // 请求成功返回的数据
        item.is_collected = data.collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error(`$ { collect ? '' : '取消'}收藏失败`)
      }
    },
    // 删除图片
    handleDelect (item) {
      console.log(item)
      this.$http({
        method: 'DELETE',
        url: `/user/images/${item.id}`
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        // 删除之后，刷新数据列表
        this.loadImages(this.page)
      }).catch(err => {
        console.log(err)
        this.$message.error('删除失败')
      })
    },
    // 图片上传成功后
    handleUplaodSuccess () {
      this.loadImages()
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
