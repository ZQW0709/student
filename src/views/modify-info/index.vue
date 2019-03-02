<template>
  <transition>
    <div class="modify-info">
      <mt-header fixed title="修改个人信息">
        <router-link slot="left" to="/user-info">
          <mt-button icon="back"/>
        </router-link>
      </mt-header>
      <div class="modify-info-form">
        <mt-field v-model="stuInfo.stuname" label="昵称"/>
        <mt-field v-model="stuInfo.login" label="账号"/>
        <mt-cell title="性别" class="form-ceil">
          <span v-if="stuInfo.sex === '1'">男</span>
          <span v-if="stuInfo.sex === '0'">女</span>
          <!-- <span v-else>未知</span> -->

          <i class="iconfont icon-jiantouyou" @click="genderActionVisible = true"/>
        </mt-cell>
        <mt-actionsheet
          :actions="[
            { name: '男', method: setValue.bind(null, 'gender', 'male') },
            { name: '女', method: setValue.bind(null, 'gender', 'female') }
          ]"
          v-model="genderActionVisible"/>
        <mt-cell title="地址" class="form-ceil">
          <span>{{ stuInfo.address }}</span>
          <i class="iconfont icon-jiantouyou" @click="cityPopupVisible = true"/>
        </mt-cell>
        <!-- <mt-field label="年龄" v-model="stuInfo.age" type="number"></mt-field> -->

        <mt-popup
          v-model="cityPopupVisible"
          class="mint-popup"
          position="bottom">
          <mt-picker :slots="slots" @change="onValuesChange"/>
          <mt-button size="small" class="submit-btn" @click="selectCity">确 定</mt-button>
        </mt-popup>
        <!--<mt-field label="邮箱" v-model="stuInfo.email" type="email"></mt-field>-->
        <mt-field v-model="stuInfo.phone" label="手机号" type="tel"/>
        <!-- <mt-field label="微信号" v-model="stuInfo.wechat"></mt-field> -->
        <mt-field v-model="stuInfo.qq" label="QQ号" type="number"/>
        <mt-field v-model="stuInfo.profession" label="专业" />
        <mt-field v-model="stuInfo.campusid" label="学校名称" />
        <mt-field v-model="stuInfo.classinfoid" label="班级名称" />

        <!-- <mt-field label="旧密码" v-model="stuInfo.password" type="password"></mt-field>
        <mt-field label="新密码" v-model="stuInfo.newPassword" type="password"></mt-field>
        <mt-field label="再次输入密码" v-model="newPasswordRepeat" type="password"></mt-field> -->
        <!-- <mt-field label="备注" type="textarea" rows="3" v-model="stuInfo.remark"></mt-field> -->
        <mt-button class="submit-btn" type="primary" @click="submit">确 定</mt-button>
      </div>
    </div>
  </transition>
</template>

<script>
// import { modify, getUser } from '@/api/user'
import qs from 'qs'
import { updateStudent } from '@/api/login'
import MyToast from '@/components/toast'
import { Toast } from 'mint-ui'
import { gender } from '@/constant'
import { province, city } from '@/utils/cityData'
import { commonRegex } from '@/utils/index'

export default {
  data() {
    return {
      stuInfo: {},
      newPasswordRepeat: '',
      genderActionVisible: false,
      gender,
      cityPopupVisible: false,
      cityValues: ['北京市', '北京市'],
      slots: [
        {
          flex: 1,
          values: province,
          className: 'slot1',
          textAlign: 'right'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: city[province[0]],
          className: 'slot3',
          textAlign: 'left'
        }
      ]
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
    selectCity() {
      this.stuInfo.address = this.cityValues.join()
      this.cityPopupVisible = false
    },
    onValuesChange(picker, values) {
      picker.setSlotValues(1, city[values[0]])
      this.cityValues = values
    },
    setValue(field, val) {
      this.stuInfo[field] = val
    },
    back() {
      this.$router.back()
    },
    isValid() {
      const { stuname, login, phone, remark, password, newPassword } = this.stuInfo
      if (!stuname) {
        Toast({
          message: '用户名不能为空',
          iconClass: 'iconfont icon-zhuyi',
          className: 'form-invalid'
        })
        return false
      }
      if (stuname.length < 3 && stuname.length > 20) {
        Toast({
          message: '用户名应该在3-20个字符之间',
          iconClass: 'iconfont icon-zhuyi',
          className: 'form-invalid'
        })
        return false
      }
      // if (!age) {
      //   Toast({
      //     message: '年龄不能为空',
      //     iconClass: 'iconfont icon-zhuyi',
      //     className: 'form-invalid'
      //   })
      //   return false
      // }
      // if (age < 3 || age > 100) {
      //   Toast({
      //     message: '年龄应在3-100之间',
      //     iconClass: 'iconfont icon-zhuyi',
      //     className: 'form-invalid'
      //   })
      //   return false
      // }
      // if (!email) {
      //   Toast({
      //     message: '邮箱不能为空',
      //     iconClass: 'iconfont icon-zhuyi',
      //     className: 'form-invalid'
      //   })
      //   return false
      // }
      // if (email && !commonRegex.email.test(email)) {
      //   Toast({
      //     message: '请输入正确邮箱地址',
      //     iconClass: 'iconfont icon-zhuyi',
      //     className: 'form-invalid'
      //   })
      //   return false
      // }
      if (phone && !commonRegex.tel.test(phone)) {
        Toast({
          message: '请输入合法的手机号',
          iconClass: 'iconfont icon-zhuyi',
          className: 'form-invalid'
        })
        return false
      }
      // if (remark && remark.length > 100) {
      //   Toast({
      //     message: '备注不能超过200个字符',
      //     iconClass: 'iconfont icon-zhuyi',
      //     className: 'form-invalid'
      //   })
      //   return false
      // }
      // if (newPassword) {
      //   if (!password) {
      //     Toast({
      //       message: '请输入原始密码',
      //       iconClass: 'iconfont icon-zhuyi',
      //       className: 'form-invalid'
      //     })
      //     return false
      //   }
      //   if (newPassword.length < 6) {
      //     Toast({
      //       message: '密码至少6个字符',
      //       iconClass: 'iconfont icon-zhuyi',
      //       className: 'form-invalid'
      //     })
      //     return false
      //   }
      //   if (newPassword !== this.newPasswordRepeat) {
      //     Toast({
      //       message: '两次输入密码不一致',
      //       iconClass: 'iconfont icon-zhuyi',
      //       className: 'form-invalid'
      //     })
      //     return false
      //   }
      // }
      return true
    },
    submit(e) {
      if (!this.isValid()) return
      let params = {
        id: this.stuInfo.id,
        campusid: this.stuInfo.campusid,
        stuname: this.stuInfo.stuname,
        phone: this.stuInfo.phone,
        profession: this.stuInfo.profession,
        qq: this.stuInfo.qq,
        address: this.stuInfo.address,
        sex: this.stuInfo.sex,
        login: this.stuInfo.login
      }
      params = qs.stringify(params)
      // console.log(params)
      updateStudent(params)
        .then(res => {
          MyToast(res.data)
          sessionStorage.localLogin = JSON.stringify(this.stuInfo)
        })
      // modify(this.stuInfo).then(res => {
      //   MyToast(res.msg)
      // })
    }
  }
  // created() {
  //   getUser().then(res => {
  //     if (res.success) {
  //       this.stuInfo = res.data
  //     } else {
  //       MyToast(res.msg)
  //     }
  //   })
  // }
}
</script>

<style lang="scss">
  @import '../../styles/variables.scss';
  .modify-info {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0;
    right: 0;
    z-index: 50;
    background-color: #fff;
    color: #484848;
    overflow-y: auto;
    padding: 50px 10px 0;
    .modify-info-form {
      .mint-cell-value {
        input, textarea {
          color: #888;
          font-size: 14px;
        }
      }
      .form-ceil {
        .mint-cell-title {
          flex-grow: initial;
          flex-basis: 105px;
        }
        .mint-cell-value {
          flex-grow: 1;
          span {
            flex-grow: 1;
            font-size: 12px;
          }
          button {
            border: none;
            padding: 0;
          }
        }
      }
      .submit-btn {
        margin-top: 10px;
        width: 100%;
      }
    }
    .mint-popup {
      width: 100%;
      text-align: center;
      padding: 10px;
    }
  }
</style>
