<template>
  <Row :gutter="24" type="flex" justify="center" class="custom_container">
    <Col span="5" style="height: 100%;">
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
        <DatePicker @on-change="dateChange" v-model="time" :options="dateOptions" size="large" type="date" format="yyyy-MM-dd" class="size" placeholder="请选择出发时间" :clearable="false"></DatePicker>
      </p>
      <div class="scroll">
        <div class="day" v-for="(item, k) in day" @click.stop="changeDay(k)" :key="k">
          <h3 class="day_txt">
            D{{ k + 1 }}
          </h3>
          <div class="day_address">
            <p class="day_time">
              {{ item.formatTime !== 'Invalid date' ? item.formatTime : ''}}
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
      <Button @click="createDay" long size="large" class="day_add" type="warning">添加新的一天</Button>
    </div>
    </Col>
    <Col span="6" style="height: 100%;">
    <div class="col">
      <!--<Spin fix size="large" v-if="changeDistance"></Spin>-->
      <div class="basic_scoll">
        <div class="basic">
        <span class="label">
          {{day[index].formatTime}}
        </span>
        <p class="distance">
          总共路程 <span class="light_txt">{{day[index].distance ? day[index].distance.toFixed(1) + '公里' : '0公里'}}</span>，预计骑行 <span class="light_txt">{{day[index].rideTime ? day[index].rideTime + '小时' : '0小时'}}</span>
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
        <Cascader class="address_cascader" placeholder="请选择出发地" @on-change="changeDeparture" change-on-select v-model="day[index].departure" :data="addressData" filterable></Cascader>
      </p>
      <p class="basic">
        <span class="label">
          <span class="required">*</span>
          目的地
        </span>
        <Cascader class="address_cascader" placeholder="请选择目的地" @on-change="changeDestination" change-on-select v-model="day[index].destination" :data="addressData" filterable></Cascader>
      </p>
      <div class="basic passing">
        <span class="label">
          <span class="required">*</span>
          途经地
        </span>
        <Button type="warning" size="small" class="add_passing" @click.stop="addPassing(day[index].passing)">添加途经地</Button>
        <p v-for="(item, v) in day[index].passing" style="position: relative;" @click.stop="flagPassIndex(v)">
          <Cascader placeholder="请选择途经地" change-on-select @on-change="changePass" class="address_cascader" :class="{address_pass: day[index].passing.length > 1}" v-model="item.address" :data="addressData" filterable></Cascader>
          <Icon v-if="day[index].passing.length > 1" type="trash-a" size="26" color="#ed3f14" class="delete_pass" @click.native="deletePass(day[index].passing, v, item.address)"></Icon>
        </p>
      </div>
      <div class="scenic_list">
        <Timeline>
          <TimelineItem color="green" v-for="(item, v) in day[index].startTrip" :key="item.id + Math.random()">
            <Icon type="location" slot="dot" size="28"></Icon>
            <div>
              <h4 class="scenic_title">{{item.scenicName}}
                <span class="txt">&nbsp;&nbsp;&nbsp;预计游玩时间</span>
                <span class="light_txt time">{{item.playTime ? item.playTime + '小时' : ''}}</span>
              </h4>
            </div>
            <div class="content_txt">
              <Icon type="android-bicycle" size="26" class="riding_icon"></Icon>
              <p class="riding_txt">
                <span class="light_txt">{{item.rideDistance ? item.rideDistance + '公里' : ''}}</span>
                <span class="time">，预计骑行</span>
                <span class="light_txt">{{item.rideTime ? item.rideTime + '小时' : ''}}</span>
              </p>
            </div>
            <Icon type="trash-a" size="22" color="#ed3f14" class="delete_pass delete_ll" @click.native.stop="deleteTrip(day[index].startTrip, v, item, day[index].incloudStart)"></Icon>
          </TimelineItem>
          <TimelineItem color="green" v-for="(item, v) in day[index].passTrip" :key="item.id + Math.random()">
            <Icon type="location" slot="dot" size="28"></Icon>
            <div>
              <h4 class="scenic_title">{{item.scenicName}}
                <span class="txt">&nbsp;&nbsp;&nbsp;预计游玩时间</span>
                <span class="light_txt time">{{item.playTime ? item.playTime + '小时' : ''}}</span>
              </h4>
            </div>
            <div class="content_txt">
              <Icon type="android-bicycle" size="26" class="riding_icon"></Icon>
              <p class="riding_txt">
                <span class="light_txt">{{item.rideDistance ? item.rideDistance + '公里' : ''}}</span>
                <span class="time">，预计骑行</span>
                <span class="light_txt">{{item.rideTime ? item.rideTime + '小时' : ''}}</span>
              </p>
            </div>
            <Icon type="trash-a" size="22" color="#ed3f14" class="delete_pass delete_ll" @click.native.stop="deleteTrip(day[index].passTrip, v, item, day[index].incloudPass)"></Icon>
          </TimelineItem>
          <TimelineItem color="green" v-for="(item, v) in day[index].endTrip" :key="item.id + Math.random()">
            <Icon type="location" slot="dot" size="28"></Icon>
            <div>
              <h4 class="scenic_title">{{item.scenicName}}
                <span class="txt">&nbsp;&nbsp;&nbsp;预计游玩时间</span>
                <span class="light_txt time">{{item.playTime ? item.playTime + '小时' : ''}}</span>
              </h4>
            </div>
            <div class="content_txt">
              <Icon type="android-bicycle" size="26" class="riding_icon"></Icon>
              <p class="riding_txt">
                <span class="light_txt">{{item.rideDistance ? item.rideDistance + '公里' : ''}}</span>
                <span class="time">，预计骑行</span>
                <span class="light_txt">{{item.rideTime ? item.rideTime + '小时' : ''}}</span>
              </p>
            </div>
            <Icon type="trash-a" size="22" color="#ed3f14" class="delete_pass delete_ll" @click.native.stop="deleteTrip(day[index].endTrip, v, item, day[index].incloudEnd)"></Icon>
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
        <Modal
          v-model="validatorModel"
          title="请检查地点信息"
          >
          <p>出发地、目的地、途经地需要选择区级或区级以下地点</p>
        </Modal>
        <Modal
          v-model="saveValidatorModel"
          title="请检查路书信息"
          >
          <p>路书名称、出发时间不能为空</p>
        </Modal>
        <Modal
          v-model="saveModel"
          title="系统提示"
          >
          <p>系统繁忙，保存失败，请稍后再试</p>
        </Modal>
        <Modal
          v-model="deleteScenicModel"
          title="系统提示"
          @on-ok="deleteScenicConfrim"
          >
          <p>是否要删除当前{{deleteScenicTxt.scenicName ? ' ' + deleteScenicTxt.scenicName + ' ' : ''}}景点</p>
        </Modal>
        <Modal
          v-model="saveLuModel"
          title="系统提示"
          >
          <p>保存成功</p>
        </Modal>
      </div>
        <Button @click="createScenic" long size="large" class="day_add" type="warning">{{day[index].btnTxt}}</Button>
      </div>
    </div>
    </Col>
    <Col span="12" v-show="day[index].showMap" style="height: 100%;">
      <div class="col">
        <div id="map"></div>
        <Spin fix size="large" v-if="changeMap">
        </Spin>
      </div>
    </Col>
    <Col span="12" v-show="!day[index].showMap" style="height: 100%;">
      <div class="col" style="padding: 10px;">
        <div class="clearfix">
          <Cascader v-model="day[index].serachScenic" @on-change="changeScen" :data="day[index].concatMerge" filterable style="float: left; padding-left: 5px;"></Cascader>
          <div style="float: left;width: calc(100% - 170px); padding-left: 10px;">
            <Input v-model="search" placeholder="请输入要查询的景点" style="float: left; width: 90%;" @keyup.native.enter="searchDestan"/>
            <Button icon="ios-search" type="warning" style="float: left; width: 8%; margin-left: 2%;" @click.native.stop="searchDestan"></Button>
          </div>
        </div>
        <div style="padding-left: 6px;margin-top: 10px;">
          <Checkbox v-model="scenicValue">景点</Checkbox>
          <Checkbox v-model="serviceValue">服务点</Checkbox>
        </div>
        <Row :gutter="16" style="margin-top: 10px;height: calc(100% - 63px);overflow: auto;box-sizing: content-box">
          <Col style="margin-bottom: 10px;" span="8" v-for="(item, v) in scenicList" :key="v" v-if="item.image">
            <Card>
              <p slot="title">
                {{item.title}}
              </p>
              <a slot="extra" @click.stop="addScenic(item, v)">
                <Icon type="ios-plus-empty"></Icon>
                添加
              </a>
              <ul>
                <li>
                  <img :src="item.image.split(',')[0]" alt="" width="100%" height="122px">
                </li>
              </ul>
            </Card>
          </Col>
          <Spin fix size="large" v-if="changeScenic">
          </Spin>
        </Row>
      </div>
      <div id="adpter"></div>
    </Col>
  </Row>
</template>

<script>
  const R = require('ramda')
  import moment from 'moment'
  import areaJSON from '../common/area'
  export default {
    name: 'custom',
    props: ['useFlag', 'clearFlag'],
    watch: {
      day: {
        deep: true,
        handler (v) {
          if (v) {
            window.localStorage.setItem('metadata', JSON.stringify(v))
          }
        }
      },
      name (v) {
        if (v) {
          window.localStorage.setItem('roadBook', v)
        }
      },
      useFlag (v) {
        var flag = this.saveValidator()
        if (flag) {
          return
        }
        this.saveJson()
      },
      serviceValue () {
        this.scenicLists()
      },
      scenicValue () {
        this.scenicLists()
      },
      clearFlag () {
        Object.assign(this.$data, this.$options.data())
        this.format()
        this.initMap()
      }
    },
    methods: {
      async computedScenic () {
        this.changeDistance = true
        var _this = this
        await this.$nextTick()
        var day = this.day[this.index]
        var index = 0
        var trip = ''
        var map = new window.BMap.Map('adpter')
        day.distance = Number(this.initDistance)
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 12)
        var driving = new window.BMap.DrivingRoute(map, {
          renderOptions: {map: map, autoViewport: true},
          async onSearchComplete (ret) {
            await _this.$nextTick()
            if (ret && ret.taxiFare) {
              trip[index].rideDistance = (ret.taxiFare.distance / 1000).toFixed(1)
              trip[index].rideTime = Math.ceil((ret.taxiFare.distance / 1000).toFixed(1) / 60)
              day.distance += Math.floor(Number((ret.taxiFare.distance / 1000).toFixed(1)))
            }
          }
        })
        await this.$nextTick()
        if (day.startTrip.length) {
          trip = day.startTrip
          trip.forEach((n, i) => {
            index = i
            if (i === 0) {
              if (n.rideDistance) {
                day.distance += Number(n.rideDistance)
              } else {
                driving.search(day.startDeparture, n.scenicName)
              }
            } else {
              if (n.rideDistance) {
                day.distance += Number(n.rideDistance)
              } else {
                driving.search(trip[i - 1].scenicName, trip[i].scenicName)
              }
            }
          })
        }
        if (day.passTrip.length) {
          trip = day.passTrip
          if (day.startTrip.length) {
            trip.forEach((n, i) => {
              index = i
              if (i === 0) {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(day.startTrip[day.startTrip.length - 1].scenicName, n.scenicName)
                }
              } else {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(trip[i - 1].scenicName, trip[i].scenicName)
                }
              }
            })
          } else {
            trip.forEach((n, i) => {
              index = i
              if (i === 0) {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(this.day[this.index].startDeparture, n.scenicName)
                }
              } else {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(trip[i - 1].scenicName, trip[i].scenicName)
                }
              }
            })
          }
        }
        if (day.endTrip.length) {
          trip = day.endTrip
          if (day.startTrip.length && day.passTrip.length) {
            trip.forEach((n, i) => {
              index = i
              if (i === 0) {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(day.passTrip[day.passTrip.length - 1].scenicName, n.scenicName)
                }
              } else {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(trip[i - 1].scenicName, trip[i].scenicName)
                }
              }
            })
          }
          if (!day.startTrip.length && day.passTrip.length) {
            trip.forEach((n, i) => {
              index = i
              if (i === 0) {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(day.passTrip[day.passTrip.length - 1].scenicName, n.scenicName)
                }
              } else {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(trip[i - 1].scenicName, trip[i].scenicName)
                }
              }
            })
          }
          if (day.startTrip.length && !day.passTrip.length) {
            trip.forEach((n, i) => {
              index = i
              if (i === 0) {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(day.startTrip[day.startTrip.length - 1].scenicName, n.scenicName)
                }
              } else {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(trip[i - 1].scenicName, trip[i].scenicName)
                }
              }
            })
          }
          if (!day.startTrip.length && !day.passTrip.length) {
            trip.forEach((n, i) => {
              index = i
              if (i === 0) {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(this.day[this.index].startDeparture, n.scenicName)
                }
              } else {
                if (n.rideDistance) {
                  day.distance += Number(n.rideDistance)
                } else {
                  driving.search(trip[i - 1].scenicName, trip[i].scenicName)
                }
              }
            })
          }
        }
        this.changeDistance = false
        map = null
        driving = null
      },
      async deleteTrip (arr, i, v, incloud) {
        this.scenicDelArr = arr
        this.scenicIndex = i
        this.deleteScenicTxt = v
        this.incloud = incloud
        this.deleteScenicModel = true
      },
      deleteScenicConfrim () {
        var day = this.day[this.index]
        this.scenicDelArr.splice(this.scenicIndex, 1)
        this.incloud.splice(this.scenicIndex, 1)
        day.distance -= Number(this.deleteScenicTxt.rideDistance)
        day.playTime -= Number(this.deleteScenicTxt.playTime)
        day.distance = day.distance.toFixed(1)
        day.playTime = day.playTime.toFixed(1)
        day.sceniCount = day.startTrip.concat(day.passTrip).concat(day.endTrip).length
        this.deleteScenicModel = false
        this.changeScenic = true
        this.scenicLists()
      },
      searchDestan () {
        this.changeScenic = true
        this.scenicLists()
      },
      async addScenic (v, i) {
        await this.$nextTick()
        var day = this.day[this.index]
        day.playTime = Number(day.playTime)
        if (day.serachScenic.join('') === day.departure.join('')) {
          day.startTrip.push(
            {
              scenicName: v.title,
              id: v.introduceId,
              playTime: v.spend_time,
              rideTime: '',
              rideDistance: ''
            }
          )
          day.playTime += Number(v.spend_time)
          day.incloudStart.push(v.introduceId)
        } else if (day.serachScenic.join('') === day.destination.join('')) {
          day.endTrip.push(
            {
              scenicName: v.title,
              id: v.introduceId,
              playTime: v.spend_time,
              rideTime: '',
              rideDistance: ''
            }
          )
          day.playTime += Number(v.spend_time)
          day.incloudEnd.push(v.introduceId)
        } else {
          day.passTrip.push(
            {
              scenicName: v.title,
              id: v.introduceId,
              playTime: v.spend_time,
              rideTime: '',
              rideDistance: ''
            }
          )
          day.playTime += Number(v.spend_time)
          day.incloudPass.push(v.introduceId)
        }
        day.sceniCount = day.startTrip.concat(day.passTrip).concat(day.endTrip).length
        this.computedScenic()
        this.scenicList.splice(i, 1)
      },
      changeScen (v, s) {
        if (s) {
          if (v.length > 1) {
            this.changeScenic = true
            this.day[this.index].provinceId = s[0].id
            this.day[this.index].startId = s[1].id
            this.scenicLists()
          }
        }
      },
      async scenicLists () {
        var day = this.day[this.index]
        var incloud = day.incloudStart.concat(day.incloudPass).concat(day.incloudEnd).join(',')
        var type = "0"
        if (this.serviceValue) {
          type = "1"
        }
        if (this.serviceValue && this.scenicValue) {
          type = "99"
        }
        var sdata = {
          cityId: this.day[this.index].startId,
          title: this.search,
          type: type,
          provinceId: this.day[this.index].provinceId,
          destinationId: incloud
        }
        var { data, errorCode } = await this.$http(
          {
            url: 'http://www.motortrip.cn:8080/motortrip/api/destinations/destinationsPcListQuery',
            type: 'post',
            data: sdata
          }
        )
        this.changeScenic = false
        if (errorCode !== 0) {
          return
        }
        if (data) {
          this.scenicList = data.destinations
        }
      },
      async saveJson () {
        var str = "&pathStyles=0x000fff,5,.5&markerStyles=l&paths="
        var sdata = {
          userId: this.userId,
          title: this.name,
          line: "",
          image: "https://api.map.baidu.com/staticimage/v2?ak=GbG0CvbD7CeeSM71l3AkCy7l&width=1024&height=600&markers=",
          miles: "",
          day: this.day.length,
          start_at: moment(this.time).format('X'),
          journeysId: this.$route.query.id,
          journeys_details: [],
          journeys_cities: []
        }
        var index = 0
        var line = ''
        var miles = 0
        var start = this.departurePoint.lng + ',' + this.departurePoint.lat + '|'
        var end = '|' + this.destinationPoint.lng + ',' + this.destinationPoint.lat
        var pass = []
        this.day[this.index].passingDes.forEach(v => {
          pass.push(
            v.lng + ',' + v.lat
          )
        })
        var passing = pass.join('|')
        var markerStart = start + passing + end
        console.log(markerStart)
        var pstart = this.departurePoint.lng + ',' + this.departurePoint.lat + ';'
        var pend = ';' + this.destinationPoint.lng + ',' + this.destinationPoint.lat
        var spassing = pass.join(';')
        var markerEnd = pstart + spassing + pend
        console.log(markerEnd)
        sdata.image = markerStart + str + markerEnd
        this.day.forEach((v, k) => {
          var trip = []
          miles += Number(v.distance)
          trip = v.startTrip.concat(v.passTrip).concat(v.endTrip)
          trip.forEach((n, i) => {
            index = i
            if (i === 0) {
              sdata.journeys_details[index] = {
                day: String(k + 1),
                hour: n.spend_time,
                sort: "1",
                destination_id: n.id,
                miles: n.rideDistance
              }
              // driving.search(this.day[k].startDeparture, n.scenicName)
            } else {
              sdata.journeys_details[index] = {
                day: String(k + 1),
                hour: n.spend_time,
                sort: String(i + 1),
                destination_id: n.id,
                miles: n.rideDistance
              }
              // driving.search(trip[i - 1].scenicName, trip[i].scenicName)
            }
            line += '>' + n.scenicName
          })
          sdata.journeys_cities.push(
            {
              day: String(k + 1),
              address_id: v.startId,
              type: "1"
            },
            {
              day: String(k + 1),
              address_id: v.endId,
              type: "3"
            }
          )
          v.passId.forEach((n, i) => {
            sdata.journeys_cities.push(
              {
                day: String(k + 1),
                address_id: n,
                type: "2"
              }
            )
          })
        })
        var journeys_cities = JSON.stringify(sdata.journeys_cities)
        var journeys_details = JSON.stringify(sdata.journeys_details)
        var json = JSON.stringify(this.day)
        sdata.journeys_cities = journeys_cities
        sdata.journeys_details = journeys_details
        sdata.miles = Number(miles).toFixed(2)
        sdata.json = json
        sdata.line = line.substring(1)
        await this.$nextTick()
        var { data, errorCode } = await this.$http(
          {
            dataType: 'json',
            type: 'post',
            url: 'http://www.motortrip.cn:8080/motortrip/api/journeys/addJourneysPc',
            data: sdata
          }
        )
        if (errorCode !== 0) {
          this.saveModel = true
          return true
        }
        this.saveLuModel = true
        window.localStorage.removeItem('roadBook')
        window.localStorage.removeItem('metadata')
        // window.location.href = "https://www.motortrip.cn/journeys/" + data.journeysId
      },
      saveValidator () {
        var flag = false
        if (!this.name) {
          console.log(1, this.name)
          flag = true
        } else {
          if (!flag) {
            flag = false
          }
        }
        if (!this.time && !this.time.length) {
          console.log(2, this.time)
          flag = true
        } else {
          if (!flag) {
            flag = false
          }
        }
        if (flag) {
          this.saveValidatorModel = true
          return true
        }
        this.validator()
      },
      validator () {
        var flag = false
        var day = this.day[this.index]
        if (day.departure.length < 2) {
          flag = true
        } else {
          if (!flag) {
            flag = false
          }
        }
        if (day.destination.length < 2) {
          flag = true
        } else {
          if (!flag) {
            flag = false
          }
        }
        if (day.passing.length > 1 && day.passing[0].address.length > 1) {
          day.passing.forEach(v => {
            if (v.address.length < 2) {
              flag = true
            } else {
              if (!flag) {
                flag = false
              }
            }
          })
        }
        return flag
      },
      createScenic (v) {
        var flag = this.validator()
        if (flag) {
          this.validatorModel = true
          return
        }
        if (this.day[this.index].btnTxt === '添加景点') {
          this.day[this.index].serachScenic = this.day[this.index].departure.slice(0, 2)
          this.scenicLists()
          this.changeScenic = true
          this.day[this.index].btnTxt = '返回地图'
        } else {
          this.day[this.index].btnTxt = '添加景点'
          this.day[this.index].showMap = true
          this.initMap()
          return
        }
        this.day[this.index].showMap = false
        var day = this.day[this.index]
        this.concatScenic()
      },
      filterScenic () {
        var day = this.day[this.index]
        var drop = new Set(day.startScenic.concat(day.passScenic).concat(day.endScenic))
        return drop
      },
      async concatScenic () {
        await this.$nextTick()
        var day = this.day[this.index]
        day.concatMerge = []
        var concatMerge = []
        var difference = R.difference(day.concatStart, day.concatEnd)
        if (difference.length) {
          var concat = R.concat(day.concatStart, day.concatEnd)
          var flatten = R.flatten(day.concatPass)
          if (flatten && flatten.length) {
            var passDifference = R.difference(flatten, concat)
            concatMerge = R.concat(concat, passDifference)
          } else {
            concatMerge = concat
          }
        } else {
          var flatten = R.flatten(day.concatPass)
          if (flatten && flatten.length) {
            var passDifference = R.difference(flatten, day.concatStart)
            concatMerge = R.concat(day.concatStart, passDifference)
          } else {
            concatMerge = day.concatStart
          }
        }
        var concatScenic = this.filterScenic()
        var scenicArr = []
        var index = 0
        for (let i of concatScenic) {
          var children = []
          concatMerge.forEach((n, k) => {
            if (i === n.label) {
              scenicArr[index] = {
                label: n.label,
                value: n.value,
                id: n.id
              }
              children.push(n.children)
            }
          })
          scenicArr[index].children = R.flatten(children)
          index++
        }
        day.concatMerge = scenicArr
        day.serachScenic = day.departure.slice(0, 2)
      },
      async initMetadata () {
        var id = this.$route.query.id
        var { data, errorCode } = await this.$http(
          {
            url: 'http://www.motortrip.cn:8080/motortrip/api/journeys/journeysPcQuery',
            type: 'post',
            data: {
              journeysId: id
            }
          }
        )
        if (errorCode !== 0) {
          return
        }
        if (data) {
          try {
            this.name = data.journeys.title
            this.day = JSON.parse(data.journeys.json)
            this.day[this.index].showMap = true
            this.day[this.index].btnTxt = '添加景点'
            this.day[this.index].serachScenic = this.day[this.index].departure.slice(0, 2)
            this.initMap()
            this.changePass()
          } catch (e) {}
        }
      },
      async initMap () {
        var _this = this
        await this.$nextTick()
        var map = new window.BMap.Map('map')
        map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11)
        map.enableScrollWheelZoom(true)
        this.driving = new window.BMap.DrivingRoute(map, {
          renderOptions: {map: map, autoViewport: true},
          onSearchComplete (ret) {
            _this.changeMap = false
            if (ret && ret.taxiFare) {
              _this.initDistance = Number((ret.taxiFare.distance / 1000).toFixed(1))
              _this.day[_this.index].distance = Number((ret.taxiFare.distance / 1000).toFixed(1))
              _this.day[_this.index].rideTime = Math.ceil((ret.taxiFare.distance / 1000).toFixed(1) / 60)
              _this.computedScenic()
            }
          },
          onPolylinesSet (ret) {
            ret.forEach((v, i) => {
              v.getPolyline().setStrokeColor('#3f9b1d')
              v.getPolyline().setStrokeOpacity(0.7)
            })
          }
        })
        this.day[this.index].startDeparture = ''
        this.departurePoint = ''
        this.destinationPoint = ''
        this.day[this.index].departure.length > 1 && this.myGeo.getPoint(this.day[this.index].departure.join(''), (point) => {
          if (point) {
            console.log(point)
            this.departurePoint = new BMap.Point(point.lng, point.lat)
            this.day[this.index].startDeparture = new BMap.Point(point.lng, point.lat)
            this.departurePoint && this.destinationPoint && (this.changeMap = true) && this.driving.search(this.departurePoint, this.destinationPoint, {waypoints: this.day[this.index].passingDes})
          }
        })
        this.day[this.index].destination.length > 1 && this.myGeo.getPoint(this.day[this.index].destination.join(''), (point) => {
          if (point) {
            this.destinationPoint = new BMap.Point(point.lng, point.lat)
            this.departurePoint && this.destinationPoint && (this.changeMap = true) && this.driving.search(this.departurePoint, this.destinationPoint, {waypoints: this.day[this.index].passingDes})
          }
        })
        map = null
      },
      async changeDeparture (v, s) {
        await this.$nextTick()
        if (s) {
          var start = s[0]
          if (v.length > 1) {
            start.children = [s[1]]
            this.day[this.index].concatStart = [start]
            this.day[this.index].startId = s[1].id
            this.day[this.index].provinceId = s[0].id
          }
          this.day[this.index].startScenic = [v[0]]
          if (this.day[this.index].showMap) {
            v.length > 1 && this.day[this.index].destination.length > 1 && this.initMap()
          } else {
            this.day[this.index].showMap = true
            this.day[this.index].btnTxt = '添加景点'
            this.initMap()
          }
        }
        this.computedScenic()
      },
      async changeDestination (v, s) {
        if (this.index + 1 < this.day.length) {
          this.day[this.index + 1].departure = v
        }
        await this.$nextTick()
        if (s) {
          var end = s[0]
          if (v.length > 1) {
            end.children = [s[1]]
            this.day[this.index].concatEnd = [end]
            this.day[this.index].endId = s[1].id
          }
          this.day[this.index].endScenic = [v[0]]
          if (this.day[this.index].showMap) {
            v.length > 1 && this.day[this.index].departure.length > 1 && this.initMap()
          } else {
            this.day[this.index].showMap = true
            this.day[this.index].btnTxt = '添加景点'
            this.initMap()
          }
        }
        this.computedScenic()
      },
      flagPassIndex (v) {
        this.passIndex = v
      },
      async changePass (v, s) {
        await this.$nextTick()
        this.passing = []
        this.day[this.index].passingDes = []
        this.day[this.index].passScenic = []
        var list = []
        if (s && s.length > 1) {
          this.day[this.index].passId[this.passIndex] = s[1].id
        }
        this.day[this.index].passing.forEach((n, i) => {
          if (n.address.length > 1) {
            if (s) {
              if (n.pass) {
                if (!n.pass.children[0]) {
                  n.pass.children = [s[1]]
                }
                list.push([n.pass])
              } else {
                n.pass = s[0]
                n.pass.children = [s[1]]
                list.push([n.pass])
              }
            } else {
              if (n.pass) {
                list.push([n.pass])
              }
            }
            this.myGeo.getPoint(n.address.join(''), (point) => {
              if (point) {
                this.day[this.index].passingDes.push(new BMap.Point(point.lng, point.lat))
              }
            })
            this.day[this.index].passScenic.push(n.address[0])
          }
        })
        this.day[this.index].concatPass = list
        if (this.day[this.index].showMap) {
          this.day[this.index].departure.length > 1 && this.day[this.index].destination.length > 1 && this.initMap()
        } else {
          this.day[this.index].showMap = true
          this.day[this.index].btnTxt = '添加景点'
          this.initMap()
        }
        this.computedScenic()
        list = null
      },
      changeDay (k) {
        this.index = k
        this.initMap()
      },
      deletePassConfrim () {
        this.passArray.splice(this.i, 1)
        this.day[this.index].passId.splice(this.i, 1)
        // this.day[this.index].passing.splice(this.i, 1)
        this.changePass()
        this.concatScenic()
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
            passingDes: '',
            departurePoint: '',
            destinationPoint: '',
            incloudStart: [],
            incloudEnd: [],
            incloudPass: [],
            addScenicFlag: '',
            provinceId: '',
            startId: '',
            endId: '',
            passId: [],
            startDeparture: [],
            serachScenic: [],
            btnTxt: '添加景点',
            showMap: true,
            concatStart: [],
            concatEnd: [],
            concatPass: [],
            concatMerge: [],
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
            startScenic: [],
            endScenic: [],
            passScenic: [],
            playTime: '',
            startTrip: [],
            endTrip: [],
            passTrip: []
          }
        )
        this.index = this.day.length - 1
        this.initMap()
      },
      deleteDay (index) {
        if (index !== 0) {
          this.index = index - 1
        } else {
          this.index = index
        }
        this.day.splice(index, 1)
        // this.day[index].departure = this.day[index - 1].destination
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
      },
      async initCheckAuth () {
        var { data } = await this.$http(
          {
            dataType: 'json',
            crossDomain: true,
            xhrFields: {
              withCredentials: true
            },
            type: 'get',
            url: 'https://www.motortrip.cn/users/checkAuth'
          }
        )
        if (data.auth === false) {
          location.href = 'https://www.motortrip.cn/journeys'
          return
        }
        this.userId = data.uid
      }
    },
    mounted () {
      this.initCheckAuth()
      this.initMetadata()
      this.format()
    },
    data () {
      return {
        saveLuModel: false,
        userId: '',
        initFlag: true,
        initDistance: '',
        incloud: [],
        scenicIndex: 0,
        scenicDelArr: [],
        deleteScenicTxt: '',
        deleteScenicModel: false,
        serviceValue: false,
        scenicValue: true,
        saveModel: false,
        saveValidatorModel: false,
        changeScenic: false,
        validatorModel: false,
        serachScenic: [],
        index: 0,
        passIndex: 0,
        scenicSelect: '',
        search: '',
        scenicList: [1, 2, 3, 4, 5],
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
        name: window.localStorage.getItem('roadBook') || '',
        time: new Date(),
        departure: '',
        destination: '',
        day: [
          {
            passingDes: '',
            departurePoint: '',
            destinationPoint: '',
            incloudStart: [],
            incloudEnd: [],
            incloudPass: [],
            addScenicFlag: '',
            provinceId: '',
            startId: '',
            endId: '',
            passId: [],
            startDeparture: [],
            serachScenic: [],
            btnTxt: '添加景点',
            showMap: true,
            concatStart: [],
            concatEnd: [],
            concatPass: [],
            concatMerge: [],
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
            startScenic: [],
            endScenic: [],
            passScenic: [],
            startTrip: [],
            endTrip: [],
            passTrip: []
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
  .delete_ll {
    top: 0!important;
    right: 0!important;
  }
  .clearfix:after {
    clear: both;
    display: block;
    content: '';
  }
  .ivu-card-body {
    padding: 8px!important;
  }
  .basic_scoll {
    height: 100%;
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
    font-size: 10px;
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
    font-size: 10px;
  }
  .scenic_list {
    position: relative;
    padding: 15px 10px;
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
    height: calc(100% - 220px);
    overflow: auto;
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
