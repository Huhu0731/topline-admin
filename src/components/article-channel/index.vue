<template>
  <!--
    el-select 组件
      value 属性，用来绑定同步的数据
      change 事件，当选中项发生改变被触发，回调参数就是选项项的 value
  -->
  <el-select clearable :value="value" @change="handleChange">
    <!-- :label="item.name" 是下拉菜单显示的
    :value="item.id" 是表单提交的值-->
    <el-option
    v-for="item in channels"
    :key="item.id"
    :label="item.name"
    :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ArticleChannel',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },

  data () {
    return {
      channels: []
    }
  },

  created () {
    this.loadChannels()
  },

  methods: {
    handleChange (val) {
      console.log(val)
      this.$emit('input', val)
    },
    // 获取频道
    loadChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        // console.log(data)
        this.channels = data.channels
      }).catch(err => {
        console.log(err)
        this.$message.error('获取频道列表失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
