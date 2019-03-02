<template>
  <transition mode="in-out">
    <div v-if="$route.name === 'userOrder'" key="userOrder" class="user-order">
      <mt-header fixed title="我的邀约">
        <router-link slot="left" to="/user-info">
          <mt-button icon="back"/>
        </router-link>
      </mt-header>
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
        </ul>
      </div>
      <div v-if="orderList.length === 0" class="no-date">
        <img src="../../assets/no-date.png">
      </div>
    </div>
    <router-view v-else key="userOrderDetail"/>
  </transition>
</template>

<script>
import { queryOrder } from '@/api/order'
import Toast from '@/components/toast'
import { getInterval } from '@/utils'

export default {
  data() {
    return {
      orderList: []
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    back() {
      this.$router.back()
    },
    goDetail(id) {
      this.$router.push('/user-info/user-order/order-detail/' + id)
    },
    fetch() {
      this.$root.$data.setLoading(true)
      queryOrder(this.$route.query).then(res => {
        this.$root.$data.setLoading(false)
        if (res.success) {
          this.orderList = res.data
        } else {
          Toast(res.msg)
        }
      }).catch(e => this.$root.$data.setLoading(false))
    },
    getInterval
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/variables.scss';
  .user-order {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0;
    right: 0;
    z-index: 50;
    background-color: #fff;
    color: #484848;
    overflow-y: auto;
    .order-list {
      padding-top: 50px;
      li {
        height: 75px;
        padding: 0 10px;
        line-height: 25px;
        border-bottom: 1px solid #e8e8e8;
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
    .no-date {
      width: 80%;
      margin: 100px auto;
      img {
        width: 100%;
      }
    }
    .to-top {
      position: fixed;
      right: 20px;
      bottom: 60px;
      i {
        color: #9a9a9a;
        background: #eee;
        font-size: 32px;
      }
    }
  }
</style>
