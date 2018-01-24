<template lang="jade">
  .navbar
    .logo
      a(href="https://www.motortrip.cn/")
        img(src="../assets/logo.png")
    .nav(v-if="!custom")
      ul(style="position: relative;")
        li(v-for="(item, index) in nav", :class="{index: item.login}")
          a.route(v-if="!item.login && !item.active", :href="item.route", :class="{active: item.active && orderActive, search: item.icon, user: item.login}") {{ !item.login ? item.name : ''}}
            img(v-if="item.icon", :src="item.icon")
          router-link.route(v-else-if="!item.login && item.active", :to="item.route", :class="{active: item.active && orderActive, search: item.icon, user: item.login}") {{ !item.login ? item.name : ''}}
            img(v-if="item.icon", :src="item.icon")
          a.route(v-else, :class="{active: item.active && orderActive, search: item.icon, user: item.login}") {{ !item.login ? item.name : ''}}
            img(v-if="item.login", :src="item.licon", class="avatar", @click.stop="selectUser")
            img(v-else-if="item.icon && !item.login", :src="item.icon")
            img(v-if="item.login", :src="item.down", class="down", @click.stop="selectUser")
        li.user-item(v-show="flag")
          ul
            li
              a.user_jump(href="https://www.motortrip.cn/users/journey") 个人中心
            li
              a.user_jump(href="https://www.motortrip.cn/users/collect") 我的收藏
            li
              router-link.user_jump(to="/order") 我的订单
            li(@click="editPwd") 修改密码
            li(@click="logout")
              a.user_jump 退出
    .nav(v-if="custom")
      ul(style="position: relative;")
        li.submit
          Button(type="warning", size="large", @click.native.stop="resetData") 重置
          Button(type="warning", size="large", @click.native.stop="save") 保存
</template>
<script>
  import $ from 'jquery'
  export default {
    props: ['orderActive', 'userInfo'],
    watch: {
      userInfo: {
        deep: true,
        handler (v) {
          if (!v) {
            this.nav.splice(6, 1, {
              name: '登陆/注册',
              route: 'https://www.motortrip.cn/landing?redirect=' + location.href,
              licon: v.user.avatar === '/images/icon/avatar.png' ? 'http://www.motortrip.cn:8080/motortrip/dist/static/avatar.png' : v.user.avatar,
              login: false,
              down: 'http://www.motortrip.cn:8080/motortrip/dist/static/down.png'
            })
            return
          }
          this.nav.splice(6, 1, {
            name: '登陆/注册',
            route: 'https://www.motortrip.cn/landing?redirect=' + location.href,
            licon: v.user.avatar === '/images/icon/avatar.png' ? 'http://www.motortrip.cn:8080/motortrip/dist/static/avatar.png' : v.user.avatar,
            login: true,
            down: 'http://www.motortrip.cn:8080/motortrip/dist/static/down.png'
          })
        }
      }
    },
    created () {
      if (this.$route.name === 'custom' || this.$route.name === 'edit') {
        this.custom = true
      }
    },
    methods: {
      resetData () {
        window.localStorage.removeItem('roadBook')
        window.localStorage.removeItem('metadata')
        this.$emit('clearLocatData')
      },
      save () {
        this.index = !this.index
        this.$emit('save', this.index)
      },
      logout () {
        this.$http(
          {
            dataType: 'json',
            crossDomain: true,
            xhrFields: {
              withCredentials: true
            },
            type: 'get',
            url: 'https://www.motortrip.cn/users/logout'
          }
        )
        this.flag = false
        this.nav.splice(6, 1, {
          name: '登陆/注册',
          route: 'https://www.motortrip.cn/landing?redirect=' + location.href,
          licon: 'http://www.motortrip.cn:8080/motortrip/dist/static/avatar.png',
          login: false,
          down: 'http://www.motortrip.cn:8080/motortrip/dist/static/down.png'
        })
      },
      editPwd () {
        this.flag = false
        this.$emit('showModal')
      },
      selectUser () {
        this.flag = true
        $(document).on('click', () => {
          this.flag = false
        })
      },
      async login (url) {
        var { data, errorCode } = await this.$http(
          {
            type: 'post',
            url: url,
            data: { url: location.href }
          }
        )
        if (errorCode === 0) {
          this.card = data.merchandiseList
          this.total = data.rowCount
        }
      }
    },
    data () {
      return {
        index: false,
        custom: false,
        flag: false,
        nav: [
          {
            name: '首页',
            route: 'https://www.motortrip.cn/test'
          },
          {
            name: '目的地',
            route: 'https://www.motortrip.cn/destinations'
          },
          {
            name: '锦囊',
            route: 'https://www.motortrip.cn/tips'
          },
          {
            name: '路书',
            route: 'https://www.motortrip.cn/journeys'
          },
          {
            name: '摩旅商城',
            active: true,
            route: '/'
          },
          {
            name: '摩旅社区',
            route: 'https://www.motortrip.cn/forum'
          },
          {
            name: '登陆/注册',
            route: 'https://www.motortrip.cn/landing?redirect=' + location.href,
            licon: 'static/avatar.png',
            login: false,
            down: '/static/down.png'
          },
          {
            name: '',
            route: 'https://120.79.33.51/search',
            icon: 'http://www.motortrip.cn:8080/motortrip/dist/static/search.png'
          }
        ]
      }
    }
  }
</script>
<style lang="scss" scoped>
  .submit {
    line-height: 80px;
    font-size: 16px;
    padding-right: 30px;
    color: #fff;
    user-select: none;
  }
  .user_jump {
    color: #fff;
    text-decoration: none;
  }
  .navbar .user.route {
    padding: 30px 22px;
  }
  .user-item {
    position: absolute;
    background: #333;
    width: 140px;
    height: auto!important;
    color: #fff;
    top: 80px;
    right: 60px;
    li {
      cursor: pointer;
      width: 100%;
      height: 56px!important;
      line-height: 56px;
      text-align: center;
      clear: both;
      &:hover {
        background: #fb8606;
      }
    }
  }
  .down {
    position: relative;
    top: -6px;
    left: 4px;
    cursor: pointer;
  }
  .avatar {
    width: 50px;
    vertical-align: middle;
    border-radius: 50%;
    display: inline-block;
    margin-top: -15px;
    cursor: pointer;
  }
  .navbar {
    background-color: #000;
    height: 80px;
    &:after {
      display: block;
      content: '';
      clear: both;
    }
    .logo {
      float: left;
      padding: 18.5px 30px;
      height: 43px;
      a {
        display: inline-block;
        height: 100%;
      }
      img {
        vertical-align: bottom;
      }
    }
    .nav {
      height: 100%;
      float: right;
      ul {
        height: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        &:after {
          display: block;
          clear: both;
          content: '';
        }
        li {
          float: left;
          height: 100%;
        }
      }
    }
    .route {
      display: inline-block;
      text-decoration: none;
      padding: 30px 20px;
      color: #999;
    }
    .active {
      transform: skew(-15deg);
      background-color: #fb8606;
      color: #fff;
    }
    .search {
      padding: 30px;
    }
  }
</style>
