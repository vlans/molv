<template lang="jade">
  .container
    .card(v-for="(item, index) in card", :class="{last: index === card.length - 1}")
      img(:src="item.picture")
      .sub
        .warp
          .head
            h2.title {{item.title}}
            h2.price ￥{{item.price}}
          .active
            a.down(:href="item.downloadUrl") 下载文件
            router-link.pay(:to="'/details/' + item.merchandiseId") 购买服务
        p.service 服务包含：{{item.route}}
        p.desc {{item.des}}
        p.date 更新时间：{{item.updateTime}}
    pagination(:total="total", @currentPage="currentPage")
</template>

<script>
  import Pagination from '../common/pagination'
  export default {
    name: 'Index',
    created () {
      this.initData()
    },
    methods: {
      async initData () {
        var { data, errorCode } = await this.$http(
          {
            type: 'post',
            url: 'http://120.79.33.51:8080/motortrip/api/merchandise/merchandiseListQuery',
            data: { number: this.current, pageNum: '20' }
          }
        )
        if (errorCode === 0) {
          this.card = data.merchandiseList
          this.total = data.rowCount
        }
      },
      currentPage (v) {
        this.current = v
        this.initData()
      }
    },
    data () {
      return {
        card: [
          {
            picture: '',
            title: '',
            price: '',
            route: '',
            des: '',
            updateTime: '',
            downloadUrl: '',
            merchandiseId: ''
          }
        ],
        total: '',
        current: 1
      }
    },
    components: {
      Pagination
    }
  }
</script>

<style scoped lang="scss">
  .container {
    width: 1000px;
    margin: 0 auto;
    overflow: hidden;
    img {
      width: 100%;
      height: 300px;
    }
    .card {
      margin-bottom: 40px;
      background: #fff;
      &:first-child {
        margin-top: 50px;
      }
    }
    .last {
      margin-bottom: 12px;
    }
    .sub {
      color: #888;
      padding: 20px;
    }
    .warp {
      &:after {
        content: '';
        clear: both;
        display: block;
      }
      .title, .price {
        color: #333;
        font-weight: normal;
        margin-top: 0;
        display: inline-block;
      }
      .price {
        margin-left: 15px;
        color: #ff0000;
      }
    }
    .head {
      float: left;
    }
    .active {
      float: right;
      height: 35px;
      line-height: 35px;
      a {
        padding: 0 30px;
        height: 100%;
        display: inline-block;
        text-decoration: none;
        background: linear-gradient(90deg,gray,#000);
        color: #fff;
      }
      .down {
        color: #999;
        margin-right: 15px;
      }
      .pay {
        background: #fb8606;
      }
    }
  }
</style>
