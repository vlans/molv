<template lang="jade">
  #app
    nav-bar(:orderActive="active", :userInfo="userInfo")
    router-view(@orderActive="orderActive")
    foot
</template>

<script>
  import navBar from './common/nav'
  import foot from './common/foot'
  export default {
    name: 'app',
    mounted () {
      var local = ''
      if (this.$route.query.uid) {
        local = this.$route.query.uid
        console.log(1111)
      } else if (location.href.split('=')[1]) {
        local = location.href.split('=')[1].split('#')[0]
        console.log(2222)
      } else {
        console.log(3333)
        localStorage.removeItem('uid')
        localStorage.removeItem('user')
      }
      console.log(local, localStorage.getItem('uid'), 4444)
      var uid = local || localStorage.getItem('uid')
      var href = location.href
      if (uid) {
        localStorage.setItem('uid', uid)
        location.href = href.split('?')[0]
        this.validatorLogin(uid)
      }
    },
    data () {
      return {
        active: true,
        login: true,
        userInfo: ''
      }
    },
    methods: {
      orderActive (v) {
        this.active = false
      },
      async validatorLogin (id) {
        console.log(333333, id, 44444)
        var { data, errorCode } = await this.$http(
          {
            type: 'post',
            url: 'http://120.79.33.51:8080/motortrip/api/user/userQuery',
            data: { userId: id }
          }
        )
        if (errorCode === 0) {
          this.userInfo = data
          localStorage.setItem('user', JSON.stringify(data))
        }
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
    background: url('http://120.79.33.51:8080/motortrip/dist/static/background.jpg');
  }
  #app {
    font-size: 14px;
    min-width: 1000px;
    
  }
</style>
