<template>
  <div class="user-info">
    <template v-if="!childView">
      <mt-header fixed title="个人信息"/>
      <ul class="info-list">
        <!-- <label for="upload" class="avatar">
          <input
            id="upload"
            ref="upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            @change="uploadAvatar">
          <img :src="imgUrl">
        </label> -->
        <li>
          <label>昵称</label>
          <span class="data">{{ stuInfo.stuname }}</span>
        </li>
        <li>
          <label>账号</label>
          <span class="data">{{ stuInfo.login }}</span>
        </li>
        <li>
          <label>性别</label>
          <span class="data">{{ getGender(stuInfo.sex) }}</span>
        </li>
        <!-- <li>
          <label>年龄</label>
          <span class="data">{{ stuInfo.age }}</span>
        </li> -->
        <li>
          <label>地址</label>
          <span class="data">{{ stuInfo.address }}</span>
        </li>
        <!-- <li>
          <label>邮箱</label>
          <span class="data">{{ stuInfo.email }}</span>
        </li> -->
        <li>
          <label>电话</label>
          <span class="data">{{ stuInfo.phone }}</span>
        </li>
        <!-- <li>
          <label>微信号</label>
          <span class="data">{{ stuInfo.wechat }}</span>
        </li> -->
        <li>
          <label>QQ号</label>
          <span class="data">{{ stuInfo.qq }}</span>
        </li>
        <li>
          <label>专业</label>
          <span class="data">{{ stuInfo.profession }}</span>
        </li>
        <li>
          <label>学校名称</label>
          <span class="data">{{ stuInfo.campusid }}</span>
        </li>
        <li>
          <label>班级名称</label>
          <span class="data">{{ stuInfo.classinfoid }}</span>
        </li>
        <!-- <li>
          <label>备注</label>
          <span class="data">{{ stuInfo.remark }}</span>
        </li> -->
      </ul>
      <!-- <ul class="history-list">
        <li>
          <label>我发布的</label>
          <span class="data" @click="userCreated()"><i class="iconfont icon-jiantouyou"></i></span>
        </li>
        <li>
          <label>我接受的</label>
          <span class="data" @click="userReceived()"><i class="iconfont icon-jiantouyou"></i></span>
        </li>
      </ul> -->
      <button @click="modifyInfo">修改个人信息</button>
      <!-- <button @click="logout" class="logout">退出登录</button> -->
      <button class="logout" @click="logout">退出登录</button>
      <app-footer class="main-footer"/>
    </template>
    <router-view/>
  </div>
</template>

<script>
import { deleteCookie } from '@/utils'
// import { logout, getUser, modifyAvatar } from '@/api/user'

import Toast from '@/components/toast'
import AppFooter from 'components/app-footer.vue'
import { gender } from '@/constant'
import loading from '@/assets/loading.gif'

export default {
  name: 'UserInfo',
  components: {
    AppFooter
  },
  data() {
    return {
      // userInfo: {},
      imgUrl: loading,
      childView: false,
      stuInfo: {}
    }
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
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.stuInfo = JSON.parse(sessionStorage.localLogin)

      console.log(this.stuInfo)
    },
    getGender(code) { // 性别
      if (code === '1') return '男'
      if (code === '0') return '女'
      return '未知'
    },
    logout() { // 退出
      var storage = window.sessionStorage
      storage.clear()
      this.$router.push('/login')
    },
    modifyInfo(userId) {
      this.$router.push('/user-info/modify-info/' + this.stuInfo.id)
    }
    // userCreated() {
    //   let id = this.userInfo.id
    //   this.$router.push({
    //     path: `/user-info/user-order`,
    //     query: { creatorId: id }
    //   })
    // },
    // userReceived() {
    //   let id = this.userInfo.id
    //   this.$router.push({
    //     path: `/user-info/user-order`,
    //     query: { receiverId: id }
    //   })
    // },

    // fetch() {
    //   getUser().then(res => {
    //     if (res.success) {
    //       this.userInfo = res.data
    //       this.imgUrl = process.env.BASE_API + '/avatar/avatar_' + this.userInfo.id + '?time=' + Date.now()
    //     } else {
    //       Toast(res.msg)
    //     }
    //   })
    // },

    // uploadAvatar(e) {
    //   let file = e.target.files[0]
    //   if (file.size > 1000 * 1000 * 2) { // 文件大小应该小于2M
    //     e.target.value = ''
    //     Toast('上传头像大小应小于2M')
    //     return
    //   }
    //   modifyAvatar(file, this.userInfo.id).then(res => {
    //     if (res.success) {
    //       this.imgUrl = this.imgUrl + '?time=' + Date.now()
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/variables.scss';
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
    button {
      width: 100%;
      height: 36px;
      background-color: #41b0ff;
      color: #fff;
      margin-top: 18px;
      font-size: 15px;
      &.logout {
        background-color: #ff7263
      }
    }
  }
</style>
