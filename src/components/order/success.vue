<template lang="jade">
  .pay_success
    .content
      .payment
        img.qrcode(:src="goods.url", v-if="!success")
      .success_icon(v-if="success")
        img(src="../../assets/success.jpg")
        .sub
          h2 购买服务成功
          p 可在
            router-link(to="/order") 我的订单
            | 查看
      h2.title 订单内容
      .explain
        .th
          h4.goods 商品
          h4.price 价格
        .tb
          .goods-explain
            h3 {{goods.title}}
            h5 {{goods.route}}
          .price-explain
            h3 ￥{{goods.price}}
</template>
<script>
  export default {
    data () {
      return {
        success: false,
        goods: {},
        payStatus: 1,
        timer: ''
      }
    },
    created () {
      try {
        this.goods = JSON.parse(window.sessionStorage.getItem('goods'))
      } catch (e) { return }
      this.timer = setInterval(() => {
        this.soketInterval()
      }, 1000)
    },
    methods: {
      async soketInterval () {
        var id = this.$route.params.id
        var uid = localStorage.getItem('uid')
        var { data, errorCode } = await this.$http(
          {
            type: 'post',
            url: 'http://www.motortrip.cn:8080/motortrip/api/merchandise/orderPayQuery',
            data: {orderNumber: id, userId: uid}
          }
        )
        if (errorCode === 0 && data) {
          if (data.payStatus === '2') {
            clearInterval(this.timer)
            this.success = true
            window.sessionStorage.setItem('paySuccess', true)
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pay_success {
    width: 1000px;
    margin: 50px auto 100px;
    background: #fff;
    .content {
      padding: 40px 50px;
    }
    .success_icon, .payment {
      text-align: center;
    }
    .qrcode {
      width: 149px;
      height: 149px;
      border: 1px solid #ddd;
    }
    .sub {
      h2 {
        font-weight: normal;
      }
      a {
        text-decoration: none;
        color: #57B2BC;
        padding: 0 2px;
      }
    }
    .explain {
      border: 2px solid #ddd;
      .th {
        border-bottom: 1px solid #ddd;
        h4 {
          display: inline-block;
          padding-left: 30px;
          font-weight: normal;
        }
        .goods {
          width: 80%;
        }
      }
      .tb {
        div {
          padding-left: 30px;
        }
        h3 {
          font-weight: normal;
        }
        h5 {
          font-weight: normal;
          color: #999;
        }
        .goods-explain {
          display: inline-block;
          width: 80%;
        }
        .price-explain {
          display: inline-block;
          h3 {
            float: left;
            color: #ff0000;
          }
        }
      }
    }
    .title {
      font-weight: normal;
      margin-top: 50px;
    }
  }
</style>
