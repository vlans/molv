<template lang="jade">
  #app
    nav-bar(:orderActive="active")
    router-view(@orderActive="orderActive")
    foot
</template>

<script>
  import navBar from './common/nav'
  import foot from './common/foot'
  export default {
    name: 'app',
    data () {
      return {
        active: true
      }
    },
    methods: {
      orderActive (v) {
        this.active = false
      }
    },
    components: {
      navBar,
      foot
    }
  }
</script>

<style lang="scss">
  body {
    background: url('./assets/background.jpg');
  }
  #app {
    font-size: 14px;
    min-width: 1000px;
    
  }
</style>
