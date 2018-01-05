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
        <DatePicker @on-change="dateChange" v-model="time" :options="dateOptions" size="large" type="datetime" format="yyyy-MM-dd HH:mm" class="size" placeholder="请选择出发时间"></DatePicker>
      </p>
      <div class="scroll">
        <div class="day" v-for="(item, index) in day">
          <h3 class="day_txt">
            D{{ index + 1 }}
          </h3>
          <div class="day_address">
            <p class="day_time">
              {{ formatTime }}
            </p>
            <div class="day_hi day_departure">
              <span>出发地</span>
              <p>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
              </p>
            </div>
            <div class="day_hi day_via">
              <span>途经地</span>
              <p>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
              </p>
            </div>
            <div class="day_hi day_intent">
              <span>目的地</span>
              <p>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
                <Tag type="border">北京市朝阳区</Tag>
              </p>
            </div>
          </div>
          <Icon v-if="day.length > 1" @click.native="deleteDay(index)" type="trash-a" class="delete_icon" size="26" color="#ed3f14"></Icon>
        </div>
      </div>
      <Button @click="createDay" long size="large" class="day_add">添加新的一天</Button>
    </div>
    </Col>
    <Col span="6">
    <div class="col">地区</div>
    </Col>
    <Col span="12">
    <div class="col">地图和景点</div>
    </Col>
  </Row>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'custom',
    methods: {
      createDay () {
        this.day.push(3)
      },
      deleteDay (index) {
        this.day.splice(index, 1)
        console.log('删除成功')
      },
      format () {
        this.formatTime = moment(this.time).format('YYYY-MM-DD HH:mm')
      },
      dateChange (v) {
        this.formatTime = v
        console.log(this.formatTime)
      }
    },
    created () {
      this.format()
    },
    data () {
      return {
        name: '',
        time: new Date(),
        day: [1, 2],
        formatTime: '',
        dateOptions: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        }
      }
    }
  }
</script>

<style scoped>
  .scroll {
    height: calc(100% - 134px);
    overflow: auto;
    padding-bottom: 55px;
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
    position: relative;
    background-color: #f4f4f4;
    min-height: 80px;
    border-bottom: 1px solid #ddd;
    padding: 18px;
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
    width: 245px;
  }
  .custom_container {
    padding: 20px 0;
    height: calc(100% - 80px);
  }
  .col {
    height: 100%;
    position: relative;
    background-color: #fff;
    border: 1px solid #aaa;
  }
</style>
