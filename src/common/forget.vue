<template lang="jade">
  .register(v-if="modal")
    .container
      .head
        h2 修改密码
        span.close(@click="closeModal") ×
      .body
        .content
          p
            input(v-model="original", placeholder="请输入原始密码", :type="otype")
            img(src="/static/eye.png", @click="showPwd('otype')")
          p
            input(v-model="pwd", placeholder="设置新密码,6-16位，区分大小写,不能用空格", :type="ptype", @input="pwdChange")
            img(src="/static/eye.png", @click="showPwd('ptype')")
          p
            input(v-model="rpwd", placeholder="设置重复输入密码", :type="rtype")
            img(src="/static/eye.png", @click="showPwd('rtype')")
          input.submit(type="button", value="确定", @click="changePwd")
</template>
<script>
  export default {
    props: ['show'],
    watch: {
      show () {
        this.modal = true
      }
    },
    methods: {
      pwdChange () {
        this.pwd = this.pwd.replace(/[ ]/g, '')
      },
      async changePwd () {
        if (this.pwd.length > 16 || this.rpwd.length > 16) {
          alert('密码超出了16位，请重新输入')
          return
        }
        if (this.pwd !== this.rpwd) {
          alert('密码不一致请重新输入')
          return
        }
        await this.$http(
          {
            dataType: 'json',
            crossDomain: true,
            xhrFields: {
              withCredentials: true
            },
            type: 'post',
            url: 'http://www.motortrip.cn/users/changePassword',
            data: { old_password: this.original, password: this.pwd, repeat_password: this.rpwd }
          }
        )
        this.modal = false
      },
      closeModal () {
        this.modal = false
      },
      showPwd (v) {
        if (this[v] === 'text') {
          this[v] = 'password'
        } else {
          this[v] = 'text'
        }
      }
    },
    data () {
      return {
        original: '',
        pwd: '',
        rpwd: '',
        otype: 'password',
        ptype: 'password',
        rtype: 'password',
        modal: false
      }
    }
  }
</script>
<style lang="scss" scoped>
  img {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -12px;
  }
  .submit {
    width: 100%;
    padding: 10px;
    background: #fb8606;
    color: #fff;
    border-color: #fb8606;
  }
  p {
    position: relative;
    padding-top: 1px;
    height: 60px;
    width: 100%;
    input {
      width: 93%;
      height: 40%;
      padding: 10px;
    }
  }
  .content {
    width: 350px;
    margin: 0 auto 30px;
    padding: 6px 12px;
  }
  .head {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    h2 {
      padding-left: 60px;
      margin: 0;
      font-weight: normal;
    }
  }
  .close {
    font-size: 20px;
    width: 20px;
    height: 20px;
    text-align: center;
    right: 15px;
    top: 50%;
    line-height: 20px;
    margin-top: -10px;
    position: absolute;
    cursor: pointer;
    &:hover {
      color: #d65a5a;
    }
  }
  .register {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.8);
    z-index: 9999;
    .container {
      color: #333;
      width: 500px;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
