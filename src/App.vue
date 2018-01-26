<template lang="jade">
  #app
    nav-bar(:orderActive="active", :userInfo="userInfo", @showModal="showModal", @save="save", @clearLocatData="clearLocatData")
    router-view(@orderActive="orderActive", @getUser="getUser", :useFlag="flag", :clearFlag="clear")
    foot
    forget(:show="show")
</template>

<script>
  import navBar from './common/nav'
  import foot from './common/foot'
  import forget from './common/forget'
  export default {
    name: 'app',
    data () {
      return {
        flag: false,
        active: true,
        userInfo: '',
        indexs: false,
        show: false,
        clear: false
      }
    },
    created () {
      this.checkUid()
    },
    methods: {
      clearLocatData () {
        this.clear = !this.clear
      },
      save (v) {
        this.flag = v
      },
      getUser (v) {
        this.userInfo = v
      },
      showModal () {
        this.show = !this.show
      },
      async checkUid () {
        var { data } = await this.$http(
          {
            dataType: 'json',
            crossDomain: true,
            xhrFields: {
              withCredentials: true
            },
            type: 'get',
            url: 'https://120.79.33.51/users/checkAuth'
          }
        )
        if (data.auth === false) {
          localStorage.removeItem('uid')
          localStorage.removeItem('user')
          return
        }
        localStorage.setItem('uid', data.uid)
        this.validatorLogin(data.uid)
      },
      orderActive (v) {
        this.active = false
      },
      async validatorLogin (id) {
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
      foot,
      forget
    }
  }
</script>

<style lang="scss">
  html, body, #app {
    height: 100%;
  }
  body {
    background: url('http://120.79.33.51:8080/motortrip/dist/static/background.jpg');
  }
  #app {
    font-size: 14px;
    min-width: 1000px;

  }
</style>
