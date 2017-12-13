<template lang="jade">
  .foot
    img(src="../assets/foot_logo.png")
    p 隐私保护|版权所有|©2017摩旅网沪ICP备14038740号-1
</template>
<script>
  export default {
  }
</script>
<style lang="scss" scoped>
  .foot {
    background: url('../assets/foot_bg.png') no-repeat;
    background-size: cover;
    text-align: center;
    padding-top: 20px;
    &:after {
      display: block;
      content: '';
      clear: both;
    }
    overflow: hidden;
    p {
      color: #e5e5e5;
      margin: 14px 0;
    }
  }
</style>
