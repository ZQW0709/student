<template>
  <div class="user-info">
    <template>
  <div>
    <v-chart ref="demo" :data="studentData" >
      <v-scale x field="examinfoname" />
      <v-scale y field="percent" :min="0" :max="0.5" :formatter="formatter" />
      <v-bar series-field="calculation" adjust="stack" />
      <v-tooltip show-value-in-legend />
    </v-chart>

    <x-button type="primary" plain @click.native="$refs.demo.rerender()">rerender</x-button>
  </div>
  <div style="padding:0 15px;">
      <x-table >
        <thead>
          <tr>
            <th>题目类型</th>
            <th>时间</th>
            <th>正确率</th>
          </tr>
        </thead>
         <tr v-for="(item, index) in tableData6" :key="index">
                    <th>{{item.examinfoname}}</th>
                    <th>{{item.createtime}}</th>
                    <th>{{item.grade}}%</th>
                    </tr>
        <tbody id="tbody">
		 </tbody>
      </x-table>
      <div class="block">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size="limit"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
    </div>

</template>
    <template v-if="!childView">
      <mt-header fixed title="选择题目">
      </mt-header>
      <template>
        <divider>请选择题目类型开始答题</divider>
  <span><el-select v-model="value" filterable placeholder="请选择" @change="changeLocationValue">
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
    <toast v-model="showPositionValue" type="warn" :time="800" is-show-mask text="请选择题目类型" position="middle"></toast>
  </div>
</template>

<script>
import { deleteCookie, formatDate } from '@/utils'
// import { logout, getUser, modifyAvatar } from '@/api/user'

import { getAllexamtype, selectStudentsanswer } from '@/api/problem'
import qs from 'qs'

// import Toast from '@/components/toast'
import AppFooter from 'components/app-footer.vue'
import { gender } from '@/constant'
import loading from '@/assets/loading.gif'
import { Toast, VChart, VLine, VArea, VTooltip, VLegend, VBar, XButton, VScale, Divider, XTable } from 'vux'

export default {
  name: 'userInfo',
  data() {
    return {
      currentPage1: 1,
      total: 0,
      imgUrl: loading,
      childView: false,
      stuInfo: {},
      options: [],
      sel: this,
        value: '',
        showPositionValue: false,
        formatter: function(val) {
          // console.log(val)
        return (val * 100).toFixed(0) + '%'
      },
      studentData: [
        { calculation: '正确率', examinfoname: '1750',  percent: 0.24511278195488723 }
      ],
      examinfoname: '',
      tableData6: [],
      page: 1,
      limit: 8,
      studentid: 1
    }
  },
  components: {
    XTable,
    AppFooter,
    XButton,
    Divider,
    Toast,
    VChart,
    VLine,
    VArea,
    VTooltip,
    VLegend,
    VBar,
    XButton,
    VScale
  },
  mounted() {
     getAllexamtype()
    .then(res => {
        this.options = []
        const obj = res.data
        for (let i = 0; i < obj.length; i++) {
        let tempList = {}
        tempList.value = obj[i].id
        tempList.label = obj[i].name
        if (obj[i].status === 1) {
        this.options.push(tempList)
        }
      }
    })
    this.getStudentAnswer()
  },
  methods: {
    changeLocationValue(val) {
            let obj = {}
            obj = this.options.find((item) => {
                return item.value === val
            })
            this.examinfoname = obj.label
        },
      handleCurrentChange(val) {
        this.page = val
        this.getStudentAnswer()
      },
    getStudentAnswer() {
      let params = {
        page: this.page,
        limit: this.limit,
        studentid: this.studentid
      }
      params = qs.stringify(params)
      selectStudentsanswer(params)
      .then(res => {
        const obj = res.data.data
        this.total = res.data.count
        this.studentData = []
        for (let i = 0; i < obj.length; i++) {
          let tempData = {}
          tempData.calculation = '正确率',
          tempData.examinfoname =  i + 1
          tempData.percent = obj[i].grade / 100
          this.studentData.push(tempData)
          tempData = {}
          tempData.calculation = '错误率',
          tempData.examinfoname =  i + 1
          tempData.percent = 1 - obj[i].grade / 100
          this.studentData.push(tempData)
        }

        this.tableData6 = []
        for (let i = 0; i < obj.length; i++) {
          let tempData = {}
          tempData.examinfoname = obj[i].examinfoname
          var time = obj[i].createtime
          var d = new Date(time)
          tempData.createtime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
          tempData.grade = obj[i].grade
          this.tableData6.push(tempData)
        }

        // this.$refs.demo.rerender()
      })
    },
    response() {
      if (this.value.length == 0) {
        this.showPositionValue = true
        return
      }
      let params = {
        examtypeid: this.value,
        studentid: this.studentid,
        examinfoname: this.examinfoname
      }
      this.$router.push({
        name: 'response',
        params: params
      })
    },
    fetch() {
      this.stuInfo = JSON.parse(sessionStorage.localLogin)

      console.log(this.stuInfo)
    },
    getGender(code) { // 性别
      if (code === '1') return '男'
      if (code === '0') return '女'
      return '未知'
    },
    logout() {  // 退出
      var storage = window.sessionStorage
      storage.clear()
      this.$router.push('/login')
    },
    modifyInfo(userId) {
      this.$router.push('/user-info/modify-info/' + this.stuInfo.id)
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
