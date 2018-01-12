<template>
  <Row :gutter="24" type="flex" justify="center" class="custom_container">
    <Col span="5">
    <div class="col">
      <p class="basic">
        <span class="label">
          <span class="required">*</span>
          路书名称
        </span>
        <Input v-model="name" size="large" placeholder="请输入路书名称" class="size"></Input>
      </p>
      <p class="basic">
        <span class="label">
          <span class="required">&nbsp;</span>
          出发时间
        </span>
        <DatePicker @on-change="dateChange" v-model="time" :options="dateOptions" size="large" type="date" format="yyyy-MM-dd" class="size" placeholder="请选择出发时间"></DatePicker>
      </p>
      <div class="scroll">
        <div class="day" v-for="(item, k) in day" @click.stop="changeDay(k)">
          <h3 class="day_txt">
            D{{ k + 1 }}
          </h3>
          <div class="day_address">
            <p class="day_time">
              {{ item.formatTime }}
            </p>
            <div class="day_hi day_departure">
              <span>出发地</span>
              <p>
                <Tag type="border" v-if="item.departure.length">{{item.departure.join('')}}</Tag>
              </p>
            </div>
            <div class="day_hi day_via">
              <span>途经地</span>
              <p>
                <Tag type="border" v-if="value.address.length" v-for="(value, v) in item.passing" :key="v">{{value.address.join('')}}</Tag>
              </p>
            </div>
            <div class="day_hi day_intent">
              <span>目的地</span>
              <p>
                <Tag type="border" v-if="item.destination.length">{{item.destination.join('')}}</Tag>
              </p>
            </div>
          </div>
          <Icon v-if="day.length > 1" @click.native.stop="deleteDay(k)" type="trash-a" class="delete_icon" size="26" color="#ed3f14"></Icon>
        </div>
      </div>
      <Button @click="createDay" long size="large" class="day_add">添加新的一天</Button>
    </div>
    </Col>
    <Col span="6">
    <div class="col">
      <div class="basic_scoll">
        <div class="basic">
        <span class="label">
          {{day[index].formatTime}}
        </span>
        <p class="distance">
          总共路程 <span class="light_txt">{{day[index].distance ? day[index].distance + '公里' : '0公里'}}</span>，预计骑行 <span class="light_txt">{{day[index].rideTime ? day[index].rideTime + '小时' : '0小时'}}</span>
        </p>
        <p class="distance_time">
          总共游玩 <span class="light_txt">{{day[index].sceniCount ? day[index].sceniCount + '个' : '0个'}}</span>景点，预计游玩 <span class="light_txt">{{day[index].playTime ? day[index].playTime + '小时' : '0小时'}}</span>
        </p>
      </div>
      <p class="basic">
        <span class="label">
          <span class="required">*</span>
          出发地
        </span>
        <Cascader class="address_cascader" @on-change="changeDeparture" change-on-select v-model="day[index].departure" :data="addressData" filterable></Cascader>
      </p>
      <p class="basic">
        <span class="label">
          <span class="required">*</span>
          目的地
        </span>
        <Cascader class="address_cascader" @on-change="changeDestination" change-on-select v-model="day[index].destination" :data="addressData" filterable></Cascader>
      </p>
      <div class="basic passing">
        <span class="label">
          <span class="required">*</span>
          途经地
        </span>
        <Button type="warning" size="small" class="add_passing" @click="addPassing(day[index].passing)">添加途经地</Button>
        <p v-for="(item, v) in day[index].passing" style="position: relative;">
          <Cascader change-on-select @on-change="changePass" class="address_cascader" :class="{address_pass: day[index].passing.length > 1}" v-model="item.address" :data="addressData" filterable></Cascader>
          <Icon v-if="day[index].passing.length > 1" type="trash-a" size="26" color="#ed3f14" class="delete_pass" @click.native="deletePass(day[index].passing, v, item.address)"></Icon>
        </p>
      </div>
      <div class="scenic_list">
        <Spin fix size="large" v-if="changeDistance"></Spin>
        <div class="none_bc" v-if="false">
          本日还未安排路程
        </div>
        <Timeline v-else>
          <TimelineItem color="green" v-for="(item, v) in day[index].trip" :key="v">
            <Icon type="location" slot="dot" size="28"></Icon>
            <div style="margin-top: -6px;">
              <h2 class="scenic_title">{{item.scenicName}}
                <span class="txt">&nbsp;&nbsp;&nbsp;预计游玩时间</span>
                <span class="light_txt time">{{item.playTime ? item.playTime + '小时' : ''}}</span>
              </h2>
            </div>
            <div class="content_txt">
              <Icon type="android-bicycle" size="30" class="riding_icon"></Icon>
              <p class="riding_txt">
                <span class="light_txt">{{item.rideDistance ? item.rideDistance + '公里' : ''}}</span>
                <span>，预计骑行</span>
                <span class="light_txt">{{item.rideTime ? item.rideTime + '小时' : ''}}</span>
              </p>

            </div>
          </TimelineItem>
        </Timeline>
      </div>
      <div>
        <Modal
          v-model="deleteModel"
          title="删除当前途经地"
          @on-ok="deletePassConfrim">
          <p>确定要删除当前{{deletePassTxt ? ' ' + deletePassTxt + ' ' : ''}}途经地?</p>
        </Modal>
      </div>
      </div>
    </div>
    </Col>
    <Col span="12">
      <div class="col">
        <div id="map"></div>
        <div class="scenicList"></div>
        <Spin fix size="large" v-if="changeMap">
        </Spin>
      </div>
    </Col>
  </Row>
</template>

<script>
  import moment from 'moment'
  import areaJSON from '../common/area'
  export default {
    name: 'custom',
    mounted () {
      this.initMap()
    },
    watch: {
      day: {
        deep: true,
        handler (v) {
          if (v) {
            window.localStorage.setItem('metadata', JSON.stringify(v))
          }
        }
      }
    },
    methods: {
      initMetadata () {
        var data = window.localStorage.getItem('metadata')
        try {
          data = JSON.parse(data)
        } catch (e) {
          return
        }
        if (data === null) {
          return
        }
        this.day = data
        this.changePass()
      },
      async initMap () {
        var _this = this
        this.initMetadata()
        await this.$nextTick()
        var map = new window.BMap.Map('map')
        map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11)
        map.enableScrollWheelZoom(true)
        // var p1 = new window.BMap.Point(116.301934, 39.977552)
        // var p2 = new window.BMap.Point(116.508328, 39.919141)
        this.driving = new window.BMap.DrivingRoute(map, {
          renderOptions: {map: map, autoViewport: true},
          onSearchComplete (ret) {
            _this.changeMap = false
            console.log('search进来了，不好意思', ret)
            if (ret && ret.taxiFare) {
              _this.day[_this.index].distance = (ret.taxiFare.distance / 1000).toFixed(1)
              _this.day[_this.index].rideTime = Math.ceil((ret.taxiFare.distance / 1000).toFixed(1) / 60)
            }
          },
          onPolylinesSet (ret) {
            ret.forEach((v, i) => {
              v.getPolyline().setStrokeColor('#3f9b1d')
              v.getPolyline().setStrokeOpacity(0.7)
            })
          }
        })
        var departure = ''
        var destination = ''
        this.day[this.index].departure.length > 1 && this.myGeo.getPoint(this.day[this.index].departure.join(''), (point) => {
          if (point) {
            departure = new BMap.Point(point.lng, point.lat)
            departure && destination && (this.changeMap = true) && this.driving.search(departure, destination, {waypoints: this.passing})
          }
        })
        this.day[this.index].destination.length > 1 && this.myGeo.getPoint(this.day[this.index].destination.join(''), (point) => {
          if (point) {
            destination = new BMap.Point(point.lng, point.lat)
            departure && destination && (this.changeMap = true) && this.driving.search(departure, destination, {waypoints: this.passing})
          }
        })
      },
      async changeDeparture (v, s) {
        await this.$nextTick()
        v.length > 1 && this.day[this.index].destination.length > 1 && this.initMap()
      },
      async changeDestination (v, s) {
        if (this.index + 1 < this.day.length) {
          this.day[this.index + 1].departure = v
        }
        await this.$nextTick()
        v.length > 1 && this.day[this.index].departure.length > 1 && this.initMap()
      },
      async changePass (v, s) {
        await this.$nextTick()
        this.passing = []
        this.day[this.index].passing.forEach((n, i) => {
          if (n.address.length > 1) {
            this.myGeo.getPoint(n.address.join(''), (point) => {
              if (point) {
                this.passing.push(new BMap.Point(point.lng, point.lat))
              }
            })
          }
        })
        this.day[this.index].departure.length > 1 && this.day[this.index].destination.length > 1 && this.initMap()
      },
      changeDay (k) {
        this.index = k
        this.initMap()
      },
      deletePassConfrim () {
        this.passArray.splice(this.i, 1)
        this.changePass()
      },
      deletePass (passArray, i, passValue) {
        if (passValue.length) {
          this.deletePassTxt = passValue.join('')
        } else {
          this.deletePassTxt = ''
        }
        this.i = i
        this.passArray = passArray
        this.deleteModel = true
      },
      addPassing (pass) {
        pass.push(
          {
            address: []
          }
        )
      },
      createDay () {
        var formatTime = moment(this.day[this.day.length - 1].formatTime).add(1, 'd').format('YYYY-MM-DD')
        this.day.push(
          {
            formatTime: formatTime,
            date: '',
            departure: this.day[this.day.length - 1].destination,
            destination: [],
            passing: [
              {
                address: []
              }
            ],
            distance: '',
            rideTime: '',
            sceniCount: '',
            playTime: '',
            trip: [
              {
                scenicName: '',
                playTime: '',
                rideTime: '',
                rideDistance: ''
              }
            ]
          }
        )
      },
      deleteDay (index) {
        if (index !== 0) {
          this.index = index - 1
        }
        this.day.splice(index, 1)
        this.day[index].departure = this.day[index - 1].destination
        this.initMap()
        this.resetTime('delete')
      },
      format () {
        this.day[this.index].formatTime = moment(this.time).format('YYYY-MM-DD')
      },
      dateChange (v) {
        this.day[0].formatTime = v
        this.resetTime('change')
      },
      resetTime (flag) {
        this.day.forEach((v, i) => {
          if (flag === 'change') {
            if (i !== 0) {
              v.formatTime = moment(this.day[0].formatTime).add(i, 'd').format('YYYY-MM-DD')
            }
          } else {
            v.formatTime = moment(this.time).add(i, 'd').format('YYYY-MM-DD')
          }
        })
      }
    },
    created () {
      this.format()
    },
    data () {
      return {
        myGeo: new window.BMap.Geocoder(),
        changeMap: false,
        changeDistance: false,
        passing: [],
        driving: '',
        i: 0,
        passArray: [],
        deletePassTxt: '',
        deleteModel: false,
        addressData: areaJSON,
        name: '',
        time: new Date(),
        index: 0,
        day: [
          {
            formatTime: '',
            date: '',
            departure: [],
            destination: [],
            passing: [
              {
                address: []
              }
            ],
            distance: '',
            rideTime: '',
            sceniCount: '',
            playTime: '',
            trip: [
              {
                scenicName: '潘家园',
                playTime: '10',
                rideTime: '30',
                rideDistance: '123'
              },
              {
                scenicName: '角门西',
                playTime: '20',
                rideTime: '40',
                rideDistance: '11'
              }
            ]
          }
        ],
        dateOptions: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        }
      }
    }
  }
</script>

<style>
  .basic_scoll {
    height: calc(100% - 303px);
    overflow: auto;
  }
  .ivu-spin-dot {
    background-color: #f90!important;
    width: 40px!important;
    height: 40px!important;
  }
  #map {
    height: 100%;
  }
  .none_bc {
    padding-top: 80px;
    text-align: center;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAABQCAYAAACahGxMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5YmY0YWI5YS03YzcwLTQ5MzItYTMxNS0wOTA0ZTU0YTc4NDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzUwM0IyNjRGMTJDMTFFNEE4MUY5RUU1QjRBOURCODYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzUwM0IyNjNGMTJDMTFFNEE4MUY5RUU1QjRBOURCODYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RjIxQTkyOEYxMjgxMUU0QTgxRjlFRTVCNEE5REI4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RjM1MTkwNEYxMjgxMUU0QTgxRjlFRTVCNEE5REI4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtNyejQAAAEYSURBVHja7NU/a8JwEMbx+/lnaN5AIGvBvABfkB1aOvoSfBUObu0LcjbWztnMlJCCQ7wTXYpIKYSc5ntwcJwZPuR8SMiybCEir9pD8VPrIPIy0uFNeyC+aqo9HziEXWrmFWY19owT17iRpkImaeoO9rXdCmf991l/L/I87wyTJMlt3LWHLui293d1VnD9SOutxLa9/xOOtBII0kpaSSs40kpa+c+B619aryWpy7MemqZxdc6z52C4rCgK8QI0R7Hf27ixs05+6lq+dzsXwBCCRFFk47PhPnTxHsfx6QcPb66qKhs/Dbcsy7LRnun85OCytcG0V8FbGPhCgAMHDhw4cODAgQMHDhw4cODAgQMHDhw4cA+DOwowAAvXsbqD8qM8AAAAAElFTkSuQmCC") no-repeat center 20px;
  }
  .delete_pass {
    position: absolute;
    right: 20px;
    top: 2px;
    cursor: pointer;
  }
  .address_pass {
    width: 85%;
  }
  .riding_txt {
    font-size: 14px;
    margin-left: 12px;
  }
  .content_txt:after {
    clear: both;
    content: '';
    display: block;
  }
  .riding_icon {
    margin: 2.5px 0;
  }
  .riding_icon, .riding_txt {
    float: left;
  }
  .content_txt {
    padding-left: 12px;
    margin-top: 18px;
    background: #f5f5f5;
    height: 35px;
    line-height: 35px;
  }
  .txt {
    color: gray;
  }
  .txt, .time {
    font-size: 14px;
  }
  .scenic_list {
    padding: 15px;
    position: relative;
  }
  .distance {
    margin: 6px 0;
  }
  .light_txt {
    color: rgb(251, 134, 6);
  }
  .address_cascader {
    margin-top: 10px;
  }
  .passing {
    position: relative;
  }
  .add_passing {
    position: absolute;
    right: 16px;
    top: 15px;
  }
  #app {
    min-width: 1400px;
  }
  .scroll {
    height: calc(100% - 134px);
    overflow: auto;
    padding-bottom: 40px;
  }
  .day_add {
    border-radius: 0!important;
    position: absolute;
    bottom: 0;
  }
  .delete_icon {
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
  }
  .day_hi p{
    padding-left: 20px;
    padding-top: 5px;
  }
  .day_hi:after {
    clear: both;
    content: '';
    display: block;
  }
  .day_address {
    width: calc(100% - 70px);
    padding-left: 30px;
    float: left;
  }
  .day_address p, .day_address div {
    padding-bottom: 5px;
  }
  .day_txt {
    width: 48px;
    height: 48px;
    background-color: #fb8606;
    border: 1px solid #fb8606;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 46px;
    margin-left: 15px;
    float: left;
  }
  .day {
    background-color: #f4f4f4;
    position: relative;
    min-height: 80px;
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding-top: 18px;
    cursor: pointer;
    user-select: none;
  }
  .day:after {
    clear: both;
    display: block;
    content: '';
  }
  .label {
    font-size: 16px;
    padding-right: 15px;
  }
  .required {
    color: #ff0000;
  }
  .basic {
    padding: 15px;
    border-bottom: 1px solid #ddd;
  }
  .size {
    width: 230px;
  }
  .custom_container {
    padding: 20px 0;
    height: calc(100% - 80px);
    margin-left: 0!important;
    margin-right: 0!important;
  }
  .col {
    height: 100%;
    position: relative;
    background-color: #fff;
    border: 1px solid #aaa;
    overflow: hidden;
  }
</style>
