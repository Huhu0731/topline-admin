<template>
  <el-container>
    <el-aside width="200px">
      <AppAside/>
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader/>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppAside from './components/AppAside'

export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #fff;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  .el-main {
    background-color: #eee;
    color: #333;
  }
}

</style>
