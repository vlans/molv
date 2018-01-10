<template>
<div>
   <div>hello world</div>
  <div>hello world</div>
</div>
 
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
            url: 'http://120.79.33.51:8080/motortrip/api/merchandise/orderPayQuery',
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
<style scoped>

</style>
