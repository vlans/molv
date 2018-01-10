<template lang="jade">
  .pagination
    .container
      ul
        li.prev(@click="prev") «
        li(v-for="(item, index) in paginationData",:index="index", :class="{active: item === active}", @click="selectPage(item, index)") {{item}}
        li.next(@click="next") »
</template>
<script>
  export default {
    props: ['total'],
    data () {
      return {
        data: [],
        active: 1,
        initData: [],
        startData: [],
        endData: [],
        contentData: [],
        pagination: [],
        start: 0,
        end: 5
      }
    },
    watch: {
      total (v) {
        this.initTotal()
      }
    },
    computed: {
      paginationData () {
        if (this.data.length > 10) {
          return this.pagination.concat(this.startData).concat(this.contentData.slice(this.start, this.end)).concat(this.endData)
        } else {
          return this.pagination.concat(this.data)
        }
      }
    },
    methods: {
      initTotal () {
        this.data = []
        for (var i = 0; i < this.total / 20; i++) {
          this.data.push(i + 1)
        }
        if (this.data.length > 10) {
          this.startData = this.data.slice(0, 3)
          this.contentData = this.data.slice(3, this.data.length - 3)
          this.endData = this.data.slice(this.data.length - 3, this.data.length)
          this.endData[0] = '...'
          this.initData = [].concat(this.data)
        }
      },
      selectPage (item) {
        if (item === '...') {
          return
        }
        this.active = item
        this.pageFactory(item)
      },
      pageFactory (item) {
        if (item > 6 && this.data.length > 10) {
          if (item >= this.contentData.length) {
            this.endData.splice(0, 1, this.endData[1] - 1)
            this.start = this.contentData.length - 7
            this.end = this.contentData.length
          } else {
            this.start = item - 7
            this.end = item
            this.endData.splice(0, 1, '...')
          }
          this.startData.splice(2, 1, '...')
        } else {
          this.start = 0
          this.end = 5
          this.startData.splice(2, 1, 3)
          this.endData.splice(0, 1, '...')
        }
        this.$emit('currentPage', item)
      },
      prev () {
        if (this.active === 1) {
          return
        }
        this.active--
        this.selectPage(this.active)
      },
      next () {
        if (this.active === this.data.length) {
          return
        }
        this.active++
        this.selectPage(this.active)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pagination {
    // width: 1000px;
    margin: 10px auto;
    overflow: hidden;
    &:after {
      display: block;
      clear: both;
      content: '';
    }
  }
  .container {
    ul {
      padding: 0;
      margin: 10px 0;
      list-style: none;
      float: right;
      background: #000;
      color: #fff;
      user-select: none;
      border-radius: 3px;
      overflow: hidden;
    }
    li {
      display: inline-block;
      padding: 10px 12px;
      border-top:1px solid #000;
      border-bottom:1px solid #000;
      border-left:1px solid #000;
      line-height: 10px;
      cursor: pointer;
      &::last-child {
        border-right:1px solid #000;
      }
    }
    .active {
      background: #fb8606;
    }
  }
</style>
