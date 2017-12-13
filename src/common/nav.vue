<template lang="jade">
  .navbar
    .logo
      a(href="#")
        img(src="../assets/logo.png")
    .nav
      ul
        li(v-for="(item, index) in nav") 
          a.route(:href="item.route", :class="{active: item.active && orderActive, search: item.icon}") {{item.name}}
            img(v-if="item.icon", src="../assets/search.png")
</template>
<script>
  export default {
    props: ['orderActive'],
    data () {
      return {
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
            name: '行程单',
            route: 'https://www.motortrip.cn/journeys'
          },
          {
            name: '摩旅商城',
            active: true,
            route: ''
          },
          {
            name: '摩旅社区',
            route: 'https://www.motortrip.cn/forum'
          },
          {
            name: '登陆/注册',
            route: ''
          },
          {
            name: '',
            route: 'https://www.motortrip.cn/search',
            icon: true
          }
        ]
      }
    }
  }
</script>
<style lang="scss" scoped>
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
      height: 20px;
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
