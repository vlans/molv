<template>
  <div>
    <div class="content">
      <div class="mvxq-title">
        摩旅锦囊 > <span>{{tips.title}}</span>
      </div>
      <div class="mvxq-head">
        <p>XINJIANG</p>
        <p>喀纳斯</p>
        <p class="head-right">全国摩旅旅游者为您撰写的国内旅行指南</p>
      </div>
      <div class="mvxq-comment">
        <div class="mvxq-1">
          <div class="comment-lf">
            <img v-bind:src=tips.image class="biglistimg">
          </div>
          <div class="comment-rt">
            <p class="com-rt-title">{{tips.title}}简介</p>
            <p class="com-rt-com1">
              <span class="com-rt-item">32个经典景点</span>
              <span class="com-rt-item">10条经典摩旅线路</span>
              <span class="com-rt-item">14位摩旅达人</span>
            </p>
            <p class="com-rt-com2" v-html=tips.line_des>
            </p>
            <ul class="com-rt-com3">
              <li>名称：<span>{{tips.title}}</span></li>
              <li>所属分类 ：<span>{{tips.address}}</span></li>
              <li>地区 ：<span>1.00</span></li>
              <li>更新时间 ：<span>{{tips.created_at ? format(tips.created_at) : ''}}</span></li>
              <li>文件大小 ：<span>{{tips.size/1024}}MB</span></li>
              <!-- <li>分享到:<img src="img/1.png"><img src="img/1.png"><img src="img/1.png"><img src="img/1.png"></li> -->
              <li>分享到：<span id="share-3" data-sites="weibo,qq,qzone,tencent"></span></li>
            </ul>
            <p class="com-rt-com4">
              <a v-bind:href=tips.download_url class="downpdf">免费下载PDF版本</a>
              <span class="downpeople"><span class="downpeoplenub">{{tips.download_num}}</span>人下载</span>
            </p>
          </div>
          <div class="clear"></div>
        </div>
        <div class="mvxq-2 inner horizontal-images">
          <ul>
            <li v-for="(item, index) in PDFList">
              <img class="listimg" v-bind:src=item>
            </li>
            <!-- <div class="clear"></div> -->
          </ul>
        </div>
        <div class="mvxq-3">
          <div class="comment-lf">
            <p class="content-lf-title">新疆摩旅锦囊相关推荐</p>
            <ul class="mvxq-3-ul">
              <li v-for="item in tipsList" class="xgtj">
                <div class="xiangguantuijian">
                  <img  v-bind:src=item.image>
                </div>
                <a class="downxg" v-bind:href=item.downhref><img src="js/down1.png" class="down">{{item.download_num}}多少人下载</a>
              </li>


            </ul>

            <div class="lunbotu swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in swiperlists"><img v-bind:src=item.imgsrc><a class="downnow"  v-bind:href=item.downhref><img src="js/down2.png">马上下载</a></div>
              </div>
              <div class="swiper-pagination"></div>
            </div>
          </div>
          <div class="comment-rt">
            <div class="mvxq-3-rt1">
              <p class="content-lf-title1">大美新疆摩旅路线</p>
              <div class="content-lf-p1">2018大美新需重机摩旅第一骑一越野骑士穿越罗布泊越野骑</div>
              <div class="content-lf-p1">2018大美新需重机摩旅第一骑一越野骑士穿越罗布泊越野骑</div>
              
            </div>
            <!-- <div class="mvxq-3-rt2"> -->
              <!-- <p class="content-lf-title1">大美新疆摩旅路线<a class="chakanmore" href="#">+查看全部</a></p>
            -->
          </div>
          <div class="clear"></div>
        </div>
        <div class="mvxq-4">
          <p class="discuss">
            <span class="inputlist pinglun active-c" v-on:click="inputlist">评论</span>
            <span class="inputlist jiucuo" v-on:click="inputlist">纠错</span>
          </p>
          <textarea placeholder="请输入文字" maxlength="30000" class="text-input" v-model="pingluninput" v-on:input="print"></textarea>
          <p class="discuss2">
            <span>{{number}}/{{2000-number}}字</span>
            <span class="tijiao " v-on:click="pinglun">提交</span>
          </p>
          <div class="discuss3">
            <div class="pinglunfor" v-for="(item, index) in comments">
              <div class="allpinglun" v-if="inputlistis">
                <p>
                  <span class="username">{{item.username}}</span>
                  <span class="updatetime">{{format2(item.created_at)}}</span>
                  <div class="clear"></div>
                </p>
                <p>{{item.content}}</p>
                <span class="huifu" v-bind:value=item.commentsId v-on:click="huifu(index, item)">回复</span>
                <div class="huifutextarea"  v-if="item.reply"> 
                  <textarea placeholder="请输入文字" maxlength="20000" class="text-input" v-on:change="print"></textarea>
                  <p>
                    <span class="quxiao" v-on:click="huifu(index)">取消</span>
                    <span class="tijao2" v-on:click="pinglun2(item.commentsId)">提交</span>
                    <div class="clear"></div>
                  </p>
                </div>
                
                <div class="clear"></div>

                <div class="huifulist" v-for="(item2, index2) in item.levelCommentsList">
                  <p>
                    <span class="username">{{item2.username}}</span>
                    <span class="updatetime">{{format2(item.created_at)}}</span>
                    <div class="clear"></div>
                  </p>
                  <p>{{item2.content }}</p>
                </div>
              </div>
            </div>


            <div class="allpinglun" v-if="!inputlistis">
              <p v-for="(item, index) in errors" >
                旅游的装备错了
              </p>

            </div>


          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  require('../../common/jquery.mCustomScrollbar.concat.min')
  import moment from 'moment'
  import JQuery from 'jquery'
  export default {
    data () {
      return {
        tips:[],
        comments:'',
        tipsList:'',
        inputlistis:true,
        errors:'',
        PDFList: [
        // { 0:'http://motortripfile.oss-cn-shenzhen.aliyuncs.com/0.png' },
        ],
        swiperlists:[
        ],
        pingluninput:'',
        number:0
      }
    },
    created () {
      this.getinit()
    },
    mounted () {
      this.initPoress()
      this.initSwiper()
    },
    methods: {
      initSwiper () {
        new Swiper('.swiper-container', {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
        });
      },
      initPoress () {
        (function($){
          $(window).on("load",function(){
            $(".inner.horizontal-images").mCustomScrollbar({
              axis:"x",
              advanced:{autoExpandHorizontalScroll:true}
            });
          });
        })(jQuery)
      },
      format (v) {
        var data = moment(v*1000).format('YYYY-MM-DD')
        console.log(v, data)
        return data
      },
      format2(v){
        var data = moment(v*1000).format('YYYY-MM-DD h:mm:ss')
        console.log(v, data)
        return data
      },
      getinit:function(){
        var _this =this;
        this.$http({
          type: 'POST',
          url: 'http://120.79.33.51:8080/motortrip/api/tips/tipsPcQuery',
          data: {
            tipsId:5
          },
          dataType: 'JSON',
          success: function(ret){
            //成功请求到数据
            console.log(ret);
            console.log(ret.data.tips)
            if (ret.errorCode==0) {
              _this.tips = ret.data.tips
              console.log(ret.data.tips,11111111)
              ret.data.comments.forEach(v => {
                v.reply = false
              })
              _this.comments = ret.data.comments
              _this.tipsList = ret.data.tipsList
              _this.errors = ret.data.errors
              _this.getimg(ret.data.tips.download_url)

            }else{
              alert('用户请求超时')
            }
          }
        });
      },
      getimg:function(src){
        var _this =this;
        this.$http({
          type: 'POST',
          url: 'http://120.79.33.51:8080/motortrip/api/tips/tipsPDFPcQuery',
          data: {
            pdfUrl:src
          },
          dataType: 'JSON',
          success: function(ret){
            _this.PDFList = ret.data.PDFList
            //成功请求到数据
            console.log(ret);

          }
        })
      },
      print:function(){
        this.number=this.pingluninput.length;
        if (this.pingluninput.length>=2001) {
        }
      },
      pinglun:function(){
          var _this = this;
          if (_this.pingluninput==true) {
            this.$http({
              type: 'POST',
              url: 'http://120.79.33.51:8080/motortrip/api/tips/addTipsComments',
              data: {
                userId:4,
                level:1,
                pid:0,
                content:_this.pingluninput,
                tip_id:5,
              },  
              dataType: 'JSON',
              success: function(ret){
                  //成功请求到数据
                  console.log(ret);
                  var list=[{
                    comtent:_this.pingluninput,
                    username:''
                  }]
                  _this.comments.concat(list)
                }
              })

          }else{
            this.$http({
              type: 'POST',
              url: 'http://120.79.33.51:8080/motortrip/api/tips/addTipsErrors',
              data: {
                userId:4,
                level:1,
                pid:0,
                content:_this.pingluninput,
                tip_id:5,
              },  
              dataType: 'JSON',
              success: function(ret){
                  //成功请求到数据
                  console.log(ret);

                }
              })
          }
          
        },
        inputlist:function(){
          console.log(this.inputlistis)
          if (this.inputlistis) {
            this.inputlistis =false;
          }else{
            this.inputlistis =true;
          }
        },
        huifu:function(index, v){
          v.reply = !v.reply
          console.log(this.comments)
          if (this.comments[index].list ==true) {
            this.comments[index].list =false
          }else{
            this.comments[index].list =true
          }

        },
      pinglun2:function(ret){
        this.$http({
          type: 'POST',
          url: 'http://120.79.33.51:8080/motortrip/api/tips/addTipsComments',
          data: {
            userId: "001",
            level: 2,
            pid:ret,
            content:'222222',
            tip_id:'5'
          },
          dataType: 'JSON',
          success: function(ret){
            //成功请求到数据
            console.log(ret);

          }
        })
      }
    }
  }
</script>
<style>
    .content{
      width: 1120px;
      margin: 0 auto;
      background: #fff;
    }
    .mvxq-head{
      width: 1070px;
      background-color: #e5e5e5;
      color: #333;
      padding-top: 26px;
      padding-bottom: 15px;
      padding-left: 25px;
      padding-right: 25px;
      font-size: 15px;
      font-weight: bold;
    }
    p{
      -webkit-margin-before: 0em;
      -webkit-margin-after: 0em;
    }
    .head-right{
      text-align: right;
    }
    body{
      margin: 0px;
      padding: 0px;
    }
    .mvxq-title{
      line-height: 76px;
    }
    .mvxq-comment{
      margin-top: 30px;
    }
    .comment-lf{
      width: 580px;
      /*max-height: 760px;*/
      float: left;
    }
    .comment-lf img{
      width: 100%;
      height: 100%;
    }
    .comment-rt{
      float: left;
      width: 510px;
      padding-left: 30px;
    }
    .clear{
      clear: both;
    }
    .com-rt-title{
      font-size: 30px;
      font-weight: bold;
    }
    .com-rt-item{
      padding: 4px 14px;
      background-color: #fb8505;
      color: #fff;
      border-radius: 3px;
    }
    .com-rt-com1{
      margin: 10px 0px;
    }
    .com-rt-com2{
      font-size: 15px;
      color: #999;
    }
    .com-rt-com3{
      padding: 0px;
      margin: 0px;
      margin-top: 120px;

    }
    .com-rt-com3 li{
      border-top: 1px solid #eee;
      line-height: 50px;
      height: 50px;
      overflow: hidden;
      font-size: 15px;
    }
    .com-rt-com3 li span{
      color: #999;
    }
    .com-rt-com3 li img{
      width: 20px;
      height: 20px;
      line-height: 50px;
      margin-right: 10px;
    }
    .downpdf{
      padding: 8px 20px;
      border-radius: 3px;
      text-align: center;
      color: #fff;
      background-color: #fb8505;
      font-size: 17px;
      font-weight: bold;
      display: inline-block;
      text-decoration: none;
    }
    .downpeople{
      font-size: 12px;
    }
    .downpeoplenub{
      font-size: 16px;
      font-weight: bold;
    }
    .com-rt-com4{
      margin-top: 30px;
    }
    ul{
      margin: 0px;
      padding: 0px;
      margin-top: 50px;
      overflow: hidden;
    }
    .mvxq-2 li{
      width: 161.66666px;
      margin-right: 30px;
      float: left;list-style-type: none;
      padding: 0px;
    }
    .mvxq-2 li img{
      width: 100%;
      height: 100%;
    }
    .mvxq-2 li:last-child{
      margin-right: 0px;
    }
    .mvxq-3{
      margin-top: 30px;
    }
    .xgtj{
      width: 167px;
      margin-right: 26px;
      float: left;
      list-style-type: none;
    }
    .xgtj:last-child{
      margin-right: 0px;
    }
    .xiangguantuijian{
      width: 136px;
      padding: 20px;
      height: 222px;
      border: 1px solid #eee;
      cursor: pointer;
    }
    .xq-active{
      border: 1px solid #fb8505;
    }
    .xiangguantuijian:last-child{
      margin-right: 0px;
    }
    .downxg{
      display: block;
      line-height: 30px;
      width: 100%;
      border-radius: 15px;
      background-color: #e5e5e5;
      text-align: center;
      font-size: 14px;
      margin-top: 15px;
      position: relative;
      color: #333;
      text-decoration: none;
    }
    .mvxq-3-ul{
      margin-top: 18px;
    }
    .content-lf-title{
      font-size: 16px;
      font-weight: bold;
      overflow: hidden;
    }

    .lunbotu{
      width: 100%;
      height: 226px;
      overflow: hidden;
      margin-top: 30px;
    }
    .content-lf-title1{
      font-size: 16px;
      font-weight: bold;
      overflow: hidden;
      margin-bottom: 15px;
    }
    .content-lf-p1{
      line-height: 30px;
      color: #fb8505;
      font-size: 15px;
      cursor: pointer;
      /*height: 30px;
      overflow: hidden;*/
    }
    .mvxq-3-rt2{
      margin-top: 30px;
    }
    .content-lf-p2{
      line-height: 30px;
      height: 60px;color: #fb8505;
      border-bottom: 1px solid #eee;
      position: relative;
      cursor: pointer;
    }
    .answer{
      position: absolute;
      bottom: 5px;
      right: 5px;
      font-size: 14px;
    }
    .mvxq-4{
      width: 1080px;
      margin: 50px auto;
    }
    .pinglun{
      margin-right: 15px;
      border-right: 1px solid #eee;
      padding-right: 15px;
    }
    .jiucuo{

    }
    .active-c{
      color: #fb8505;
    }

    .text-input{
      height: 180px;
      width: 100%;
      background-color: #eee;
      margin-top: 20px;
    }
    .discuss2{
      margin-top: 20px;
      padding-bottom: 50px;
      border-bottom: 1px solid #eee;
    }
    .tijiao{
      float: right;
      padding: 5px 35px;
      background-color: #fb8505;
      color: #fff;
      border-radius: 20px;
      cursor: pointer;
    }
    .inputlist{
      cursor: pointer;
    }
    .allpinglun{
      padding: 10px;
      font-size: 14px;
    }
    .updatetime,.huifu{
      float: right;
    }
    .huifu{
      color:#fb8505;
      cursor: pointer;
    }
    .down{
      position: absolute;
      top:0px;
      left: 0px;
      width: 30px !important;
      height: 30px !important;

    }
    .downnow{
      position: absolute;
      bottom: 26px;
      height: 40px;
      width: 160px;
      text-align: center;
      color: #fff;
      background-color: #fb8505;
      line-height: 40px;
      left: 50px;
      border-radius: 7px;
      padding-left: 8px;
      cursor: pointer;
      text-decoration: none;
    }    
    .downnow img{
      width: 25px;
      height: 25px;
      position: absolute;
      top: 6px;
      left: 29px;
    }
    .huifulist{
      padding-left: 40px;
    }
    .huifutextarea{
      padding-left: 40px;
    }
    .quxiao{
      display: block;
      float: right;
      padding: 5px 35px;
      background-color: #fb8505;
      color: #fff;
      border-radius: 20px;
      cursor: pointer;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .tijao2{
      display: block;
      float: right;
      padding: 5px 35px;
      background-color: #fb8505;
      color: #fff;
      border-radius: 20px;
      cursor: pointer;
      margin-right: 30px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .hide{
      display: none;
    }
  </style>
