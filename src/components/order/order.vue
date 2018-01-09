<template lang="jade">
  .order
    .user
      span.avator(:style="{background: 'url(' + avatar + ') no-repeat'}")
      h2 {{userName}}
    .manage
      .container
        .left_nav
          ul
            li 
              a.route(href="http://120.79.33.51/users/journey") 我的行程单
            li.active
              a.route(href="javascript:void(0);") 我的订单
            li 
              a.route(href="http://120.79.33.51/users/collect") 我的收藏
            li 
              a.route(href="http://120.79.33.51/users/center") 个人中心
        .content
          .title 
            span 我的订单
          .list
            .th
              span.time 交易时间
              span.goods 商品
              span.price 价格
              span.status 交易状态
            .tb(v-for="(item, index) in order")
              .time {{item.creationTime}}
              .goods
                h3 {{item.title}}
                h5 包含：{{item.route}}
              .price
                h3 ￥{{item.price}}
              .status {{item.type === '1' ? '未支付' : item.type === '2' ? '交易成功' : '已退款'}}
          Pagination(:total="total", @currentPage="currentPage")
</template>
<script>
  import Pagination from '../../common/pagination'
  export default {
    name: 'order',
    data () {
      return {
        order: [],
        total: 0,
        current: 1,
        userName: '',
        avatar: ''
      }
    },
    created () {
      this.initUser()
      this.initData()
      this.$emit('orderActive', false)
    },
    methods: {
      initUser () {
        try {
          this.userName = JSON.parse(localStorage.getItem('user')).user.username
          this.avatar = JSON.parse(localStorage.getItem('user')).user.avatar === '/images/icon/avatar.png' ? 'http://120.79.33.51:8080/motortrip/dist/static/avatar.png' : JSON.parse(localStorage.getItem('user')).user.avatar
        } catch (e) {}
      },
      async initData () {
        var id = localStorage.getItem('uid')
        var { data, errorCode } = await this.$http(
          {
            type: 'post',
            url: 'http://120.79.33.51:8080/motortrip/api/user/userOrderListQuery',
            data: {userId: id, number: this.current, pageNum: '10'}
          }
        )
        if (errorCode === 0) {
          this.order = data.orderList
          this.total = data.rowCount
        }
      },
      currentPage (v) {
        this.current = v
        this.initData()
      }
    },
    components: {
      Pagination
    }
  }
</script>
<style lang="scss" scoped>
  .user {
    height: 300px;
    background: url('http://120.79.33.51:8080/motortrip/dist/static/bg_user_banner.jpg') no-repeat;
    background-size: cover;
    text-align: center;
    line-height: 300px;
    color: #fff;
    h2 {
      position: relative;
      height: 30px;
      line-height: 30px;
      font-weight: 600;
      font-size: 18px;
      top: -49%;
    }
    .avator {
      display: inline-block;
      width: 100px;
      height: 100px;
      background-size: cover!important;
      border-radius: 100%;
    }
  }
  .manage {
    width: 1200px;
    margin: 60px auto 40px;
    background: #fff;
    .container {
      padding: 60px;
      &:after {
        content: '';
        display: block;
        clear: both;
      }
      .left_nav {
        box-sizing: border-box;
        width: 25%;
        padding: 0 20px;
        float: left;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        background: #eee;
        border: 1px solid #e5e5e5;
        box-sizing: border-box;
        li {
          padding: 15px 10px;
          font-size: 18px;
          &:hover a {
            color: #fb8606;
          }
        }
      }
    }
  }
  .route {
    text-decoration: none;
    color: #333;
  }
  .active {
    background: #fff;
    a {
      color: #fb8606;
    }
  }
  .content {
    float: left;
    width: 75%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .title {
    height: 60px;
    span {
      padding-top: 6px;
      font-size: 18px;
      display: inline-block;
    }
  }
  .list {
    border: 1px solid #e5e5e5;
    &:after {
      display: block;
      clear: both;
      content: '';
    }
    .th {
      padding: 15px;
      background: #F5F5F5;
      span {
        display: inline-block;
        font-size: 16px;
        color: #333;
      }
      .time {
        width: 22%;
      }
      .status {
        width: 10%;
      }
      .goods {
        width: 53%;
      }
      .price {
        width: 15%;
      }
    }
    .tb {
      &:after {
        display: block;
        clear: both;
        content: '';
      }
      &:not(:first-child) {
        border-top: 1px solid #ddd;
      }
      padding: 15px;
      div {
        float: left;
      }
      .time {
        width: 22%;
        margin: 16.38px 0;
      }
      .status {
        width: 10%;
        margin: 16.38px 0;
        color: #73B19F;
      }
      .goods {
        width: 53%;
      }
      .price {
        width: 15%;
        color: #ff0000;
      }
      h3, h5 {
        font-weight: normal;
      }
      h5 {
        color: #999;
      }
    }
  }
</style>
