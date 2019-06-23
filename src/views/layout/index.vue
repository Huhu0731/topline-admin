<template>
    <div>
        <p>layout component</p>
        <AppHeader/>
        <AppAside/>
    </div>
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
</style>
