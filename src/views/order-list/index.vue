<template>
  <div class="order-view">
    <template v-if="!childView">
      <mt-header fixed title="在线答题"/>
      <!-- <div class="search">
        <i class="iconfont icon-dangdi" @click="cityPopupVisible = true"/>
        <span class="city" @click="cityPopupVisible = true">{{ city }}</span>
        <mt-popup
          v-model="cityPopupVisible"
          position="right">
          <mt-header fixed title="请选择邀约城市"/>
          <mt-picker :slots="slots" @change="onValuesChange"/>
          <mt-button type="primary" size="small" class="submit-btn" @click="selectCity">确 定</mt-button>
        </mt-popup>
        <input v-model="search" type="text" placeholder="请输入查询内容" @keyup.enter="fetch">
        <i class="iconfont icon-sousuo" @click="fetch"/>
      </div> -->
      <div class="order-list">
        <ul>
          <li v-for="(item, index) in orderList" :key="index" @click="goDetail(item)">
            <div class="order-title">
              <span>{{ item.examtypename }}</span>
            </div>
            <div class="order-secondary">
              <span class="creator">{{ item.nickName }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </li>
          <li v-if="loading && !allLoaded" class="loading">加载中...</li>
        </ul>
      </div>
      <div v-show="showToTop" class="to-top">
        <i class="iconfont icon-xiangshangjiantou" @click="toTop"/>
      </div>
      <div class="refresh">
        <i class="iconfont icon-shuaxin" @click="fetch"/>
      </div>
      <app-footer class="main-footer"/>
       <div>
      <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
      <div class="content">
        <div class="order-title">
          <h1 class="title">{{ order.name }}</h1>
          <div class="base-info">
            <span class="city">{{ order.examtypename }}</span>
            <span class="time">{{ order.time }}</span>
          </div>
        </div>
        <div class="info-item">
          <label>A:</label>
          <span class="username">{{ order.a }}</span>
        </div>

        <div class="info-item">
          <label>B:</label>
          <span class="username">{{ order.b }}</span>
        </div>

        <div class="info-item">
          <label>C:</label>
          <span class="username">{{ order.c }}</span>
        </div>

        <div class="info-item">
          <label>D:</label>
          <span class="username">{{ order.d }}</span>
        </div>
        <div>
          <checker v-model="demo21" type="checkbox" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
        <checker-item :value="item" v-for="(item, index) in items1" :key="index">{{item.value}}</checker-item>
      </checker>
    <x-button type="primary">提交答案</x-button>
  </div>

        <div class="opt">
      
      </div>
        
        

       
      </div>
        <div @click="showHideOnBlur=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
    </template>
    <!-- <transition>
      <router-view/>

    </transition> -->
  </div>
</template>

<script>
import { queryCurrentOrders } from '@/api/order'
import Toast from '@/components/toast'
import AppFooter from 'components/app-footer.vue'
import { getInterval, smoothScrollTo } from '@/utils'
import { province, city } from '@/utils/cityData'
import { XDialog,XButton,Checker, CheckerItem } from 'vux'

export default {
  components: {
    XDialog,
    AppFooter,
    XButton,
    Checker,
    CheckerItem
  },
  data() {
    return {
        stuInfo: {},
        nickName:'',
        showHideOnBlur:false,
        order:{},
         items1: [{
        key: '1',
        value: 'A'
      }, {
        key: '2',
        value: 'B'
      }, {
        key: '3',
        value: 'C'
      },
      {
        key: '4',
        value: 'D'
      }],
      demo21: null,
        checkboxGroup1: [],
        cities:['A', 'B', 'C', 'D'],
      demo21: null,
      orderList: [],
      search: '',
      page: 1,
      loading: false,
      allLoaded: false,
      childView: false,
      city: (this.$root.$data.user && this.$root.$data.user.city) || '全部',
      cityPopupVisible: false,
      cityValues: ['北京市', '北京市'],
      slots: [
        {
          flex: 1,
          values: ['全部'].concat(province),
          className: 'slot1',
          textAlign: 'right'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'left'
        }
      ],
      showToTop: false
    }
  },
  watch: {
    '$route': function(to, from) {
      // 如果是从父页面跳转到子页面
      if (from.name === 'orderList') {
        setTimeout(() => {
          this.childView = true
        }, 300)
      } else {
        this.childView = false
      }
    }
  },
  created() {
      this.stuInfo = JSON.parse(sessionStorage.localLogin)   //* 获取学生信息
   if (process.browser) {
      if ('WebSocket' in window) {
        this.webSocket = new WebSocket('ws://localhost:9527/websocket')
        this.initWebSocket()
        console.log('Support webSocket')
      } else {
        console.log('Not support webSocket')
      }
      console.log(',', navigator.userAgent)
      if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        this.useBy = 'phone'
      } else {
        this.useBy = 'pc'
      }
    }
    // this.sendMessage()
  },
  // mounted() {
  //   this.sendMessage()
  // },
  destroyed() {
    this.webSocket.close()
  },
  methods: {
      initWebSocket() { //* 初始化websocket连接
      this.webSocket.onopen = this.webSocketOpen
      this.webSocket.onmessage = this.webSocketMessage
      this.webSocket.onclose = this.webSocketClose
      this.webSocket.onerror = this.webSocketError
    },
    webSocketOpen() { // 打开
      console.log('WebSocket连接成功')
    },
    webSocketMessage(e) { // 数据接收
      const vm = this
      const message = JSON.parse(e.data) // 返回的数据
      console.log(message)
      if (message.type === 'setResult') {
        if (message.msg === -1) {
          this.nickName = ''
          vm.$message('昵称设置失败')
        } else {
          this.nickName = message.nickName
          vm.nickName = message.nickName
          vm.$message('昵称设置成功')
        }
      } else if (message.type === 'newUser') {
        vm.userList = message.nickName
        vm.$message({
          message: message.msg,
          type: 'success'
        })
      } else if (message.type === 'loseUser') {
        vm.userList = message.nickName
        vm.$message({
          message: message.msg,
          type: 'error'
        })
      } else if (message.type === 'showUser') {
        vm.userList = message.nickName 
      } else {
        vm.orderList.push(message)
      }
    },
    webSocketClose() { // 关闭
      console.log('WebSocket关闭')
    },
    webSocketError() { // 失败
      console.log('WebSocket连接失败')
    },
    sendMessage() { //* 设置发送信息
      const vm = this
      if (vm.nickName.length <= 0) {
        const body = {}
        body.msg = ''
        body.sendType = 'setNick'
        body.nickName = this.stuInfo.stuname
        this.finalSend(JSON.stringify(body))
      }
      // const message = row
      // message.sendType = 'sendMsg'
      // message.nickName = stuInfo.stuname
      // this.finalSend(JSON.stringify(message))
    
    },
    finalSend(message) { //* 使用websocket发送
      this.webSocket.send(message)
    },



    //TODO 别人的代码 先放着
    onValuesChange(picker, values) {
      if (values[0] === '全部') {
        picker.setSlotValues(1, [])
      } else {
        picker.setSlotValues(1, city[values[0]])
      }
      this.cityValues = values
    },
    selectCity() {
      if (!this.cityValues[1]) {
        this.city = this.cityValues[0]
      } else {
        this.city = this.cityValues.join()
      }
      this.cityPopupVisible = false
      this.fetch()
    },
    toTop() {
      smoothScrollTo()
    },
    goDetail(item) {
      console.log(item)
      console.log("???")
      this.order = item
      this.showHideOnBlur = true
      // this.$router.push(`/order-list/order-detail/`)
      // this.$router.push({
      //   name: 'userOrderDetail',
      //   params: item
      // })
      this.sendMessage()
    },
    fetch() {
      this.$root.$data.setLoading(true)
      const city = this.city === '全部' ? '' : this.city
      queryCurrentOrders({ search: this.search, city, start: 0, size: 10 }).then(res => {
        this.$root.$data.setLoading(false)
        if (res.success) {
          this.orderList = res.data
          this.page = 1
          this.allLoaded = false
          window.scrollTo(0, 0)
        } else {
          Toast(res.msg)
        }
      }).catch(e => {
        this.$root.$data.setLoading(false)
      })
    },
    getNextPage() {
      this.loading = true
      setTimeout(() => {
        queryCurrentOrders({ search: this.search, start: this.orderList.length, size: 10 }).then(res => {
          if (res.success) {
            if (res.data.length === 0) this.allLoaded = true
            this.orderList = this.orderList.concat(res.data)
            this.loading = false
            this.page++
          } else {
            Toast(res.msg)
          }
        })
      }, 1000)
    },
    onScroll() {
      const top = document.documentElement.scrollTop || document.body.scrollTop // 滚动条在Y轴上的滚动距离
      const vh = document.compatMode === 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight // 浏览器视口的高度
      const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) // 文档的总高度
      if (top >= 50) {
        this.showToTop = true
      } else {
        this.showToTop = false
      }
      if (this.loading || this.allLoaded) return
      if (top + vh >= height) { // 滚动到底部
        this.getNextPage() // 如果已经滚到底了 获取数据
      }
    },
    getInterval
  }
}
</script>

<style lang="scss">
  @import '../../styles/variables.scss';
.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 15px;
}
.demo1-item-selected {
  border: 1px solid green;
}
.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
  .order-view {
    padding-bottom: 50px;
    padding-top: 50px;
    .mint-header {
      background: #000;
      height: 50px;
    }
    .search {
      height: 50px;
      display: flex;
      border-bottom: 1px solid #e8e8e8;
      box-shadow: 0px 1px 1px 0px #f9f9f9;
      padding: 10px 0 10px 10px;
      background: #e6e6e6;
      line-height: 30px;
      input {
        height: 100%;
        flex-grow: 1;
        border-right: 1px solid #f9f9f9;
        padding: 10px;
      }
      i {
        font-size: 20px;
        margin: 0 5px;
      }
      .city {
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        overflow: hidden;
        font-size: 12px;
        width: 100px;
      }
      .mint-popup-right {
        height: 100%;
        width: 80%;
        padding: 100px 10px;
        .mint-header {
          background: #16a0ff;
          border-radius: 0 0 10px 10px;
        }
        button {
          width: 100%;
        }
      }
    }
    .order-list {
      li {
        height: 75px;
        padding: 0 10px;
        line-height: 25px;
        border-bottom: 1px solid #e8e8e8;
        &.loading {
          height: 25px;
          line-height: 25px;
          text-align: center;
          color: #c7c7c7;
          border-bottom: none;
        }
        .order-title {
          height: 50px;
          overflow: hidden;
        }
        .order-secondary {
          height: 25px;
          display: flex;
          font-size: 12px;
          .creator {
            flex-grow: 1;
            color: #888;
          }
          .time {
            font-family: Helvetica, Tahoma, Arial;
            color: #adadad;
          }
        }
      }
    }
    .to-top, .refresh {
      position: fixed;
      right: 20px;
      bottom: 60px;
      i {
        color: rgba(1, 1, 1, 0.3);
        font-size: 32px;
        font-weight: 900;
      }
    }
    .refresh {
      bottom: 100px;
    }
  }
   .order-detail {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: $backColor;
    color: #484848;
    overflow: scroll;
    .content {
      padding: 50px 20px;
      .order-title {
        margin: 20px 0;
        .title {
          margin: 20px 0 10px;
          line-height: 1.5;
        }
        .base-info {
          font-size: 12px;
          color: #888;
          text-align: right;
        }
      }
      .info-item {
        // line-height: 30px;
        // padding-left: 70px;
        font-size: 14px;
        .username {
          cursor: pointer;
          color: #0ca2ff;
        }
        label {
          width: 60px;
          display: inline-block;
          text-align: right;
          margin: 0 10px 0 -75px;
        }
      }
    }
    .opt {
      width: 150px;
      margin: 20px auto;
      button {
        height: 30px;
        width: 100%;
        background-color: #b19dff;
        color: #fff;
        box-shadow: 1px 1px 1px 0px #00000050;
        &.disabled {
          background-color: #b5b5b5;
        }
      }
      .remove-order {
        margin-top: 10px;
        background-color: #ff5d47;
      }
    }
    .user-info-dialog {
      h1 {
        padding: 5px 20px;
        .user-avatar {
          height: 30px;
          width: 30px;
          border-radius: 15px;
          line-height: 40px;
          display: block;
          margin: 0px auto;
        }
        p {
          text-align: center;
          border-bottom: 1px solid #dedede;
        }
      }
      p {
        line-height: 20px;
        font-size: 13px;
      }
      button {
        padding: 3px 15px;
        border-radius: 3px;
        background-color: #77baff;
      }
      .tips {
        color: #a5a5a5;
        font-size: 12px;
        text-align: right;
        margin-top: 15px;
      }
    }
    .delete-order-dialog {
      .text {
        padding: 5px;
        font-size: 14px;
        line-height: 1.5;
      }
      .btn-group {
        padding: 20px 0;
        button {
          height: 30px;
          width: 60px;
          border-radius: 5px;
          &.ok {
            background-color: #238fff;
            color: #fff;
            margin-right: 10px;
          }
          &.cancel {
            background-color: #a2a2a2;
            color: #fff;
          }
        }
      }
    }
  }
</style>
