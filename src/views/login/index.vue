<template>
  <div class="new-order">
    <header>
      <span>用 户 登 录</span>
      <i class="iconfont icon-shouye" @click="back"/>
    </header>
    <div class="user-form">
      <p class="input"><input v-model="login" type="text" placeholder="账号" ></p>

      <!-- 注册 -->
      <template v-if="type === 'register'">
        <p class="input"><input v-model="password" type="password" placeholder="密码（不少于6位）"></p>
        <p class="input"><input v-model="pwdRepeat" type="password" placeholder="再次输入密码"></p>
        <p class="input verification-code">
          <input v-model="pin" type="text" placeholder="验证码">
          <button @click="getPinCode">发送验证码</button>
        </p>
        <button class="submit-btn" @click="register">注 册</button>
      </template>
      <!-- 忘记密码 -->
      <template v-else-if="this.type === 'forgetPwd'">
        <p class="input"><input v-model="password" type="password" placeholder="新密码（不少于6位）"></p>
        <p class="input"><input v-model="pwdRepeat" type="password" placeholder="再次输入密码"></p>
        <!-- <p class="input verification-code">
          <input type="text" placeholder="验证码" v-model="pin">
          <button @click="getPinCode">发送验证码</button>
        </p> -->
        <button class="submit-btn" @click="resetPassword">重 置</button>
      </template>
      <!-- 登录 -->
      <template v-else>
        <p class="input"><input v-model="password" type="password" placeholder="密码"></p>
        <button class="submit-btn" @click="denglu">登 录</button>
      </template>
    </div>
    <div class="tips">
      <span v-if="this.type === 'login'" @click="type = 'forgetPwd'">忘记密码？</span>
      <span @click="type = type === 'login' ? 'register' : 'login'">
        {{ this.type === 'login' ? '创建账户' : '已有账户' }}
      </span>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
// import { register, resetUserPwd, sendPinCode } from 'api/user'
import { studentLogin, updataPwd } from '@/api/login'
import { commonRegex } from '@/utils'
import { Toast } from 'mint-ui'
export default {
  data() {
    return {
      type: '',
      password: '',
      login: '',
      pwdRepeat: '',
      pin: ''
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    denglu() {
      if (!this._isValid()) return
      let params = {
        login: this.login,
        pwd: this.password
      }
      params = qs.stringify(params)
      studentLogin(params)

        .then(res => {
          if (res.data.length !== 0) {
            sessionStorage.localLogin = JSON.stringify(res.data)
            this.$router.push('/homepage')
          } else {
            Toast({
              message: '登录失败',
              iconClass: 'iconfont icon-zhuyi',
              className: 'form-invalid'
            })
          }
        }).catch(err => {
          console.log('登录页面>发送请求-login()出错：', err)
        })
    },
    register() {
      if (!this._isValid()) return
      register({ login: this.login, password: this.password, pin: this.pin }).then(res => {
        if (res.success) {
          Toast(res.msg)
          this.$router.push('/homepage')
        } else {
          Toast(res.msg)
        }
      }).catch(err => {
        console.log('登录页面>发送请求-register()出错：', err)
      })
    },
    resetPassword() {
      if (!this._isValid()) return
      this.$root.$data.setLoading(true)
      // resetUserPwd({ login: this.login, password: this.password, pin: this.pin }).then(res => {
      let params = {
        login: this.login,
        pwd: this.password
      }
      params = qs.stringify(params)
      updataPwd(params)
        .then(res => {
          this.$root.$data.setLoading(false)
          if (res.success) {
            Toast(res.msg)
            this.type = 'login'
          } else {
            Toast(res.msg)
          }
        }).catch(err => {
          this.$root.$data.setLoading(false)
          console.log('登录页面>重置密码-resetPassword()出错：', err)
        })
    },
    getPinCode() {
      if (!this.login) {
        Toast('请输入邮箱')
        return
      }
      this.$root.$data.setLoading(true)
      sendPinCode({ login: this.login, isReset: this.type === 'forgetPwd' }).then(res => {
        this.$root.$data.setLoading(false)
        if (res.success) {
          Toast('发送验证码成功，请到邮箱查看')
        } else {
          Toast(res.msg)
        }
      }).catch(err => {
        this.$root.$data.setLoading(false)
        console.log('登录页面>发送验证码-getPinCode()出错：', err)
      })
    },
    _isValid() {
      const login = this.login
      const password = this.password
      const pwdRepeat = this.pwdRepeat
      // const pin = this.pin
      // 所有情况都需要校验
      if (!login) {
        Toast({
          message: '请输入账号',
          iconClass: 'iconfont icon-zhuyi',
          className: 'form-invalid'
        })
        return false
      }
      // if (login && !commonRegex.login.test(login)) {
      //   Toast({
      //     message: '请输入合法的邮箱地址',
      //     iconClass: 'iconfont icon-zhuyi',
      //     className: 'form-invalid'
      //   })
      //   return
      // }
      if (!password) {
        Toast({
          message: '请输入密码',
          iconClass: 'iconfont icon-zhuyi',
          className: 'form-invalid'
        })
        return
      }
      // 注册时 或 忘记密码时 需要校验
      if (this.type === 'register' || this.type === 'forgetPwd') {
        if (password.length < 6) {
          Toast({
            message: '密码至少6个字符',
            iconClass: 'iconfont icon-zhuyi',
            className: 'form-invalid'
          })
          return false
        }
        if (password !== pwdRepeat) {
          Toast({
            message: '两次输入密码不一致',
            iconClass: 'iconfont icon-zhuyi',
            className: 'form-invalid'
          })
          return false
        }
        // if (!pin) {
        //   Toast({
        //     message: '请输入验证码',
        //     iconClass: 'iconfont icon-zhuyi',
        //     className: 'form-invalid'
        //   })
        //   return false
        // }
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/variables.scss';
  .new-order {
    margin-bottom: 0px;
    background-color: #fff;
    z-index: 100;
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    header {
      height: 50px;
      padding: 0 20px;
      background-color: $backColor;
      color: #000;
      line-height: 50px;
      font-size: 16px;
      font-weight: 900;text-align: center;
    }
    .user-form {
      text-align: center;
      margin-top: 50px;
      .input {
        margin: 15px auto;
        min-width: 150px;
        width: 70%;
        height: 30px;
        input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          border-bottom: 2px #e4e4e4 solid;
          font-size: 14px;
          &:focus {
            outline: none;
            border-bottom: 2px $themeColor solid;
          }
        }
      }
      .verification-code {
        display: flex;
         input {
           width: 60%;
         }
         button {
           width: 40%;
           background: #e4e4e4;
         }
      }
      .input-error {
        font-size: 12px;
        color: #ff0000;
        text-align: left;
        text-indent: 15%;
      }
      .submit-btn {
        color: #fff;
        width: 70%;
        background-color: #000;
        height: 30px;
        border: none;
        margin: 15px 0;
        &:focus {
          outline: none;
        }
        &:active {
          background-color: #313131;
        }
      }
    }
    .tips {
      width: 70%;
      text-align: right;
      font-size: 12px;
      color: #888;
      margin: 0 auto;
    }
  }
</style>
