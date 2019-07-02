<template>
  <div class="box-wrap">
    <p>点击选择图片</p>
    <i
      style="margin-top: 20px;
      font-size: 90px; color: #eee;"
      class="iconfont icon-image_upload"
    ></i>
    <img width="120" src="http://toutiao.meiduo.site/Fg9peJmNoh_i3J-niHL_XBJ4juRy">
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.box-wrap {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
