<template lang="jade">
  .details
    .content
      h2 商品详情
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
      .info
        h2 请填写联系方式
        .put
          .phone(:class="{phone_warning: phoneWarning}")
            span 手机号：
            input(@blur="validatePhone", v-model="phone", type="text", placeholder="请输入手机号")
          .qq(:class="{qq_warning: qqWarning}")
            span QQ号：
            input(@blur="validateQQ", v-model="qq", type="text", placeholder="请输入QQ号")
      .payment
        h2 请选择支付方式
        .choice
          .zhifubao(@click="choicePayment(1)", :class="{bao_active: baoActive}")
            icon.bao-check(name="check", color="#fb8606", v-show="baoIcon")
          // .wechat(@click="choicePayment(2)", :class="{wechat_active: wechatActive}")
          //   icon.wechat-check(name="check", color="#fb8606", v-show="wechatIcon")
      .submit(@click="submit") 确认
</template>
<script>
  export default {
    data () {
      return {
        wechatIcon: false,
        baoIcon: false,
        baoActive: false,
        wechatActive: false,
        phone: '',
        qq: '',
        phoneWarning: false,
        qqWarning: false,
        goods: {},
        type: 1
      }
    },
    watch: {
      async phone (v) {
        await this.$nextTick()
        this.phone = v.replace(/[^\d]/g, '')
        this.phone = v.substring(0, 11)
      },
      async qq (v) {
        await this.$nextTick()
        this.qq = v.replace(/[^\d]/g, '')
        this.qq = v.substring(0, 13)
      }
    },
    created () {
      this.initData()
    },
    methods: {
      async initData () {
        var id = this.$route.params.id
        var { data, errorCode } = await this.$http(
          {
            type: 'post',
            url: 'http://120.79.33.51:8080/motortrip/api/merchandise/merchandiseConfirmQuery',
            data: {merchandiseId: id}
          }
        )
        if (errorCode === 0) {
          this.goods = data.merchandise
        }
      },
      choicePayment (index) {
        if (index === 1) {
          this.resetSiblings('wechatIcon', 'wechatActive')
          this.baoIcon = true
          this.baoActive = true
          this.type = 1
        } else {
          this.resetSiblings('baoIcon', 'baoActive')
          this.wechatIcon = true
          this.wechatActive = true
          this.type = 2
        }
      },
      resetSiblings (icon, active) {
        this[icon] = false
        this[active] = false
      },
      validatePhone () {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
        if (this.phone) {
          !myreg.test(this.phone) ? this.phoneWarning = true : this.phoneWarning = false
        } else {
          this.phoneWarning = false
        }
      },
      validateQQ () {
        this.qq ? this.qqWarning = false : this.qqWarning = true
        if (!this.qq) this.qqWarning = false
      },
      async submit () {
        var check = this.validator()
        if (check) return
        var id = this.$route.params.id
        var uid = localStorage.getItem('uid')
        var { data, errorCode } = await this.$http(
          {
            type: 'post',
            url: 'http://120.79.33.51:8080/motortrip/api/merchandise/addOrder',
            data: {userId: uid, merchandiseId: id, phone: this.phone, QQ: this.qq, type: this.type}
          }
        )
        if (errorCode === 0) {
          this.goods.url = data.url
          try {
            window.sessionStorage.setItem('goods', JSON.stringify(this.goods))
          } catch (e) { return }
          this.$router.push('/payment/' + data.orderNumber)
        }
      },
      validator () {
        var check = false
        if (!this.phone) {
          check = true
          this.phoneWarning = true
        } else {
          check = false
          this.phoneWarning = false
        }
        if (!this.qq) {
          check = true
          this.qqWarning = true
        } else {
          if (!check) {
            check = false
            this.qqWarning = false
          }
        }
        if (this.baoActive || this.wechatActive) {
          if (!check) {
            check = false
          }
        } else {
          check = true
        }
        return check
      }
    }
  }
</script>
<style lang="scss" scoped>
  .details {
    width: 1000px;
    background: #fff;
    margin: 50px auto 100px;
    .content {
      padding: 40px 50px;
    }
    h2 {
      margin-top: 0;
      font-weight: normal;
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
    .info, .payment {
      margin-top: 40px;
    }
    .phone {
      margin-right: 20px;
    }
    .phone, .qq {
      display: inline-block;
      border: 1px solid #ddd;
      padding: 6px 10px 6px 20px;
      width: 25%;
      input {
        border: none;
        padding: 10px;
        outline: none;
        width: 65%;
      }
    }
    .zhifubao, .wechat {
      display: inline-block;
      width: 25%;
      height: 50px;
      border: 1px solid #ddd;
      padding: 0 15px;
      cursor: pointer;
      position: relative;
      vertical-align: bottom;
      img {
        width: 100%;
      }
    }
    .bao-check, .wechat-check {
      position: absolute;
      right: 20px;
      top: 50%;
      margin-top: -8px;
    }
    .zhifubao {
      background: url('http://120.79.33.51:8080/motortrip/dist/static/zhifubao.jpg') no-repeat -24px -37px;
      background-size: 72%;
      margin-right: 20px;
    }
    .wechat {
      background: url('http://120.79.33.51:8080/motortrip/dist/static/wechat.jpg') no-repeat 10px -19px;
      background-size: 60%;
    }
    .submit {
      width: 160px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      background: #fb8606;
      border-radius: 2px;
      color: #fff;
      margin-top: 40px;
      cursor: pointer;
      user-select: none;
    }
    .bao_active, .wechat_active {
      border: 1px solid #fb8606;
    }
    .phone_warning, .qq_warning {
      border: 1px solid #ff0000;
    }
  }
</style>
