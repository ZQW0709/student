<template>
  <div class="order-view">
    <template v-if="!childView">
      <mt-header fixed title="邀约列表"/>
      <div class="search">
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
      </div>
      <div class="order-list">
        <ul>
          <li v-for="(item, index) in orderList" :key="index" @click="goDetail(item.id)">
            <div class="order-title">
              <span>{{ item.title }}</span>
            </div>
            <div class="order-secondary">
              <span class="creator">{{ item.creatorName }}</span>
              <span class="time">{{ getInterval(item.createTime) }}</span>
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
    </template>
    <transition>
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { queryCurrentOrders } from '@/api/order'
import Toast from '@/components/toast'
import AppFooter from 'components/app-footer.vue'
import { getInterval, smoothScrollTo } from '@/utils'
import { province, city } from '@/utils/cityData'

export default {
  components: {
    AppFooter
  },
  data() {
    return {
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
    if (this.$route.name !== 'orderList') this.childView = true
    this.fetch()
    window.addEventListener('scroll', this.onScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
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
    goDetail(id) {
      this.$router.push(`/order-list/order-detail/${id}`)
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
</style>
