<template>
  <div class="user-info">
    <template v-if="!childView">
      <mt-header fixed title="选择题目">
      </mt-header>
      <template>
        <divider>请选择题目类型开始答题</divider>
  <span><el-select v-model="value" filterable placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </span><x-button mini type="primary" style="margin-left:10px" @click.native="response()">答题</x-button>
</template>
      <app-footer class="main-footer"></app-footer>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import { deleteCookie } from '@/utils'
import { XButton,Divider } from 'vux'
// import { logout, getUser, modifyAvatar } from '@/api/user'

import { getAllexamtype } from '@/api/problem'

import Toast from '@/components/toast'
import AppFooter from 'components/app-footer.vue'
import { gender } from '@/constant'
import loading from '@/assets/loading.gif'

export default {
  name: 'userInfo',
  data() {
    return {
      imgUrl: loading,
      childView: false,
      stuInfo:{},
      options: [],
        value: ''
    }
  },
  components: {
    AppFooter,
    XButton,
    Divider
  },
  created(){
     getAllexamtype()
    .then(res => {
        // console.log(res.data)
        this.options = []
        const obj = res.data;
        for (let i = 0; i < obj.length; i++) {
        let tempList = {};
        tempList.value = obj[i].id;
        tempList.label = obj[i].name;
        this.options.push(tempList);
      }

    })
  },
  methods: {
    response() {
      // console.log("????")
      this.$router.push('/response')

    },
    fetch() {
      this.stuInfo = JSON.parse(sessionStorage.localLogin);

      console.log(this.stuInfo)
    },
    getGender(code) { //性别
      if (code === '1') return '男'
      if (code === '0') return '女'
      return '未知'
    },
    logout() {  //退出
      var storage=window.sessionStorage;
      storage.clear();
      this.$router.push('/login')
    },
    modifyInfo(userId) {
      this.$router.push('/user-info/modify-info/' + this.stuInfo.id)
    },
  },
  // created() {
  //   if (this.$route.name !== 'userInfo') this.childView = true
  //   this.fetch()
  // },
  watch: {
    '$route': function(to, from) {
      // 如果是从父页面跳转到子页面
      if (from.name === 'stuInfo' && (to.name === 'userOrder' || to.name === 'modifyInfo')) {
        setTimeout(() => {
          this.childView = true
        }, 300)
      } else if (to.name === 'stuInfo' && (from.name === 'userOrder' || from.name === 'modifyInfo')) {
        // 跳转回父页面
        this.childView = false
      }
      // 如果是从修改个人信息页跳过来的 就刷新页面
      if (from.name === 'modifyInfo') {
        this.fetch()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/variables.scss';
  .custom-primary-red {
  border-radius: 99px!important;
  border-color: #CE3C39!important;
  color: #CE3C39!important;
  &:active {
    border-color: rgba(206, 60, 57, 0.6)!important;
    color: rgba(206, 60, 57, 0.6)!important;
    background-color: transparent;
  }
}
  .user-info {
    padding: 50px 0 50px;
    min-height: calc(100vh - 40px);
    background-color: $backColor;
    .info-list, .history-list {
      background-color: #fff;
      padding: 0 10px;
      li {
        font-size: 15px;
        color: #131313;
        line-height: 41px;
        height: 40px;
        display: flex;
        &:not(:last-child) {
          border-bottom: 1px solid #e4e4e4;
        }
        label {
          flex-grow: 1;
          min-width: 60px;
        }
        .data {
          color: #969696;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .info-list {
      .avatar {
        text-align: center;
        display: block;
        padding: 5px 0;
        border-bottom: 1px solid #e4e4e4;
        input {
          visibility: hidden;
          width: 0;
          height: 0;
        }
        img {
          width: 60px;
          height: 60px;
          border: solid 1px #bfbfbf;
          border-radius: 30px;
        }
      }
    }
    .history-list {
      margin-top: 18px;
    }
    // button {
    //   width: 100%;
    //   height: 36px;
    //   background-color: #41b0ff;
    //   color: #fff;
    //   margin-top: 18px;
    //   font-size: 15px;
    //   &.logout {
    //     background-color: #ff7263
    //   }
    // }
  }
</style>
