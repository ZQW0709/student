<template>
  <div class="examination-wrap bg-white">
    <div class="examination-content">
      <h4 class="examination-title">考试标题</h4>
      <p class="examination-info">
        <span>题量{{problemNum}}</span>
        <span>总分：100</span>
        <span>合格：60</span>
        <span>答题时间：{{ duration }}</span>
      </p>
      <ul class="examination-question-list">
        <li
          v-for="(items,num) in testList"
          :id="'anchor-'+num"
          :key="num"
        >
          <h5>{{ num +1 }}．{{ items.title }}
            <span v-if="items.type === 0">［判断题］</span>
            <span v-if="items.type === 1">［单选题］</span>
            <span v-if="items.type === 2">［多选题］</span>
          </h5>
          <div v-if="items.type == 0">
            <div class="answer-list">
              <p>A. 正确</p>
              <p>B. 错误</p>
            </div>
            <div class="check-content">
              <span
                :class="{active: isSelected(items, 0)}"
                @click="selectOption(items,num,0)"
              ><i class="iconfont icon-gouxuan"/>A</span>
              <span
                :class="{active: isSelected(items, 1)}"
                @click="selectOption(items,num,1)"
              ><i class="iconfont icon-gouxuan"/>B</span>
            </div>
          </div>
          <div v-else>
            <div class="answer-list">
              <p
                v-for="(item, index) in items.options"
                :key="index"
              >{{ item }}</p>
            </div>
            <div class="check-content">
              <span
                v-for="(item, index) in items.options"
                :key="index"
                :class="{active: isSelected(items, index)}"
                @click="selectOption(items,num,index)"
              ><i class="iconfont icon-gouxuan"/>{{ numberToLetter(index) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="cutdown-submit-wrap bg-white">
      <div class="examination-num">
        <a
          v-for="(item,index) in testList"
          :class="{selected: isDone(item), current: index === currentIndex}"
          :key="index"
          href="javascript:;"
          class="num-item"
          @click="selectIndex(index)"
        >{{ index + 1 }}</a>
      </div>
      <div class="cutdown-content">
        <span class="cutdown-text">剩余时间：<span class="red">{{ rest }}</span></span>
        <x-button
          mini
          class="examination-submit-btn"
          @click.native="submitAnswer"
        >提交试卷</x-button>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show"
      title="操作提示"
      @on-cancel="back"
      @on-confirm="back">
        <p style="text-align:center;">请返回重新选择哦</p>
      </confirm>
    </div>
    <!-- 提示弹窗  start-->
    <div v-transfer-dom>
      <confirm
        v-model="confirmShow"
        :cancel-text="readWrongText"
        :title="confirmTitle"
        @on-cancel="confirmShow =false"
        @on-confirm="putAnswer"
      >
        <p style="text-align:center;">{{ confirmText }}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <alert
        v-model="alertShow"
        :title="alertTitle"
        @on-hide="onHide"
      > {{ alertText }}</alert>
    </div>
    <!-- 提示弹窗  end-->
  </div>
</template>

<script>
// 多选题数组选项处理
import {
  XButton,
  Confirm,
  Alert,
  TransferDomDirective as TransferDom
} from 'vux'
import { getExaminfoByTypeId, addExamResult } from '@/api/problem'
import qs from 'qs'
Array.prototype.contains = function(obj) {
  var i = this.length
  while (i--) {
    if (this[i] === obj) {
      return true
    }
  }
  return false
}

export default {
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Confirm,
    Alert
  },
  data() {
    return {
      problemNum: 0,
      examtypeid: '', // 题目类型ID
      studentid: '',  // 学生Id
      examinfoname: '', // 题目类型名
      alertShow: false,
      show: false,
      confirmNoProblem: false,
      alertTitle: '提示',
      alertText: '',
      alertType: 0,
      confirmShow: false,
      confirmTitle: '提示',
      confirmText: '',
      confirmType: 0,
      readWrongText: '取消',
      currentIndex: 0,
      time: '1800',
      endTime: null,
      testList: [
        {
          type: 0,
          title: 'title',
          userAnswer: null
        },
        {
          type: 1,
          title: 'title',
          options: ['A. 选项', 'B. 选项', 'C. 选项', 'D. 选项'],
          userAnswer: null
        },
        {
          type: 2,
          title: 'title',
          options: ['A. 选项', 'B. 选项', 'C. 选项', 'D. 选项'],
          userAnswer: null
        }
      ]
    }
  },
  computed: {
    duration() {
      return this.fomart(this.time)
    },
    rest() {
      return this.fomart(this.endTime)
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.updateTime()
    })
    // let params = this.$route.params
    this.examtypeid = this.$route.params.examtypeid
    this.studentid = this.$route.params.studentid
    this.examinfoname = this.$route.params.examinfoname
    let params = {
      examtypeid: this.examtypeid
    }

    params = qs.stringify(params)
    getExaminfoByTypeId(params)    /// /根据题目类别 到题库中随机抽取20道题进行考试
      .then(res => {
        this.problemNum = res.data.length
        const obj = res.data
        this.testList = []
        if (res.data.length <= 0) {
          this.show = true
          this.readWrongText = '当前类型下，没有题目'
          this.confirmTitle = '提示'
          return
        }
        for (let i = 0; i < obj.length; i++) {
          const temp = {}
          temp.type = 2
          temp.title = obj[i].name
          temp.examid = obj[i].id
          temp.examtypeid = obj[i].examtypeid
          temp.correctanswer = obj[i].correctanswer

          temp.options = []
          temp.options.push('A' + '\xa0\xa0\xa0' + obj[i].a)
          temp.options.push('B' + '\xa0\xa0\xa0' + obj[i].b)
          temp.options.push('C' + '\xa0\xa0\xa0' + obj[i].c)
          temp.options.push('D' + '\xa0\xa0\xa0' + obj[i].d)
          this.testList.push(temp)
        }
      })

    // console.log(this.$router)
    // this.examtypeid = this.$router
  },
  methods: {
    putAnswer() {
      let examid = this.testList[0].examid
      let a = '0', b = '0', c = '0', d = '0'
      for (let i = 0; i < this.testList[0].userAnswer.length; i++) {
        if (this.testList[0].userAnswer[i] == 0) {
          a = '1'
        } else if (this.testList[0].userAnswer[i] == 1) {
          b = '1'
        } else if (this.testList[0].userAnswer[i] == 2) {
          c = '1'
        } else {
          d = '1'
        }
      }
      let correctanswer = this.testList[0].correctanswer
      let studentanswer = this.getStuAnswer(this.testList[0].userAnswer)
      for (let i = 1; i < this.testList.length; i++) {
        examid += ',' + this.testList[i].examid
        correctanswer += ',' + this.testList[i].correctanswer
        studentanswer += ',' + this.getStuAnswer(this.testList[i].userAnswer)
        for (let j = 0; j < this.testList[i].userAnswer.length; j++) {
        if (this.testList[i].userAnswer[j] == 0) {
          a += ',1'
        } else {
          a += ',0'
        }
        if (this.testList[i].userAnswer[j] == 1) {
          b += ',1'
        } else {
          b += ',0'
        }
        if (this.testList[i].userAnswer[j] == 2) {
          c += ',1'
        } else {
          c += ',0'
        }
        if (this.testList[i].userAnswer[j] == 3) {
          d += ',1'
        } else {
          d += ',0'
        }
      }
      }

      let params = {
        examid: examid,
        a: a,
        b: b,
        c: c,
        d: d,
        correctanswer: correctanswer,
        examtypeid: this.examtypeid,
        studentid: this.studentid,
        examinfoname: this.examinfoname,
        studentanswer: studentanswer
      }
      params = qs.stringify(params)
      addExamResult(params)
      .then(res => {
        console.log(res.data)
      })
    },
    getStuAnswer(data) {
      let temp = ''
      if (data.contains(0)) {
        temp = 'A'
      } else {
       temp = '0'
      }
      if (data.contains(1)) {
        temp += 'B'
      } else {
        temp += '0'
      }
      if (data.contains(2)) {
        temp += 'C'
      } else {
        temp += '0'
      }
      if (data.contains(3)) {
        temp += 'C'
      } else {
        temp += '0'
      }
      return temp
    },
    back() {
      this.$router.back()
    },
    isSelected(item, index) {
      if (item.type === 2) {
        if (!item.userAnswer) {
          return false
        }
        for (var answer of item.userAnswer) {
          if (answer === index) {
            return true
          }
        }
        return false
      } else {
        return item.userAnswer === index
      }
      return false
    },
    isDone(item) {
      if (item.type === 0) {
        return item.userAnswer === 0 || item.userAnswer === 1
      }
      if (item.type === 1) {
        return item.userAnswer || item.userAnswer === 0
      }
      if (item.type === 2) {
        return item.userAnswer && item.userAnswer.length
      }
      return false
    },
    selectOption(item, num, index) {
      this.currentIndex = num
      if (item.type === 2) {
        var userAnswer = this.testList[this.currentIndex].userAnswer
        if (!userAnswer) {
          userAnswer = []
        }
        if (userAnswer.contains(index)) {
          for (var i = 0; i < userAnswer.length; i++) {
            if (userAnswer[i] === index) {
              userAnswer.splice(i, 1)
              return
            }
          }
        }
        userAnswer.push(index)

        userAnswer = userAnswer.sort()
        this.testList[this.currentIndex].userAnswer = userAnswer
      } else {
        this.testList[this.currentIndex].userAnswer = index
      }
    },
    selectIndex(index) {
      this.currentIndex = index
    },
    // 锚点选中和定位
    selectIndex(index) {
      this.currentIndex = index
      var anchor = this.$el.querySelector('#anchor-' + index)
      document.querySelector('.content-scroll').scrollTop = anchor.offsetTop // 这里的 document.querySelector('.content-scroll') 是一个div容器，如果想让window滚动定位，换成window就好了
    },
    submitAnswer() {
      var that = this,
        answerArr = [],
        answerLen
        // Debug
        // this.Debug
        // Debug
        // debugger
      this.testList.forEach(function(item, index) {
        if (item.userAnswer || item.userAnswer === 0) {
          if (item.type === 1 || item.type === 0) {
            answerArr.push(that.numberToLetter(item.userAnswer))
          } else if (item.type === 2) {
            var arr = []
            item.userAnswer.forEach(function(answer, index) {
              arr.push(that.numberToLetter(answer))
            })
            answerArr.push(arr)
          }
        }
      })
      answerLen = this.testList.length - answerArr.length
      if (answerLen == 0) {
        this.confirmShow = !this.confirmShow
        this.confirmText = '您确认提交吗!'
      } else {
        this.alertShow = !this.alertShow
        this.alertText = '您还有' + answerLen + '题未做!'
      }
    },
    updateTime() {
      var that = this,
        time = this.time
      this.timer = setInterval(function() {
        time = time - 1
        that.endTime = time
        if (time === 0) {
          clearInterval(that.timer)
          that.alertShow = !this.alertShow
          that.alertType = 1
          that.alertText = '考试时间结束！'
        }
      }, 1000)
    },
    fomart(time) {
      var h, m, s
      h = Math.floor(time / 3600)
      m = Math.floor((time / 60) % 60)
      s = Math.floor(time % 60)
      h < 10 ? (h = '0' + h) : (h = h)
      m < 10 ? (m = '0' + m) : (m = m)
      s < 10 ? (s = '0' + s) : (s = s)
      return h + ':' + m + ':' + s
    },
    numberToLetter(number) {
      var arr = 'ABCD'
      return arr[number]
    },
    onConfirm() {
      var that = this
      if (this.confirmType === 1) {
        this.$router.push({ path: '/' })
      } else {
        clearInterval(this.timer)
        setTimeout(function() {
          that.viewScore()
        }, 500)
      }
    },
    viewScore() {
      this.confirmShow = !this.confirmShow
      this.confirmType = 1
      this.confirmTitle = '成绩'
      this.confirmText = '您的得分：70'
      this.readWrongText = '查看错题'
    },
    onCancel() {
      if (this.confirmType === 1) {
        alert('进入错题中...')
      }
    },
    onHide() {
      if (this.alertType === 1) {
        this.$router.push({ path: '/' })
      }
    }
  }
}
</script>

<style lang="less">
.examination-content {
  padding-bottom: 60px;
  h4 {
    font-size: 0.8rem;
    font-weight: 400;
    text-align: center;
    padding: 5px 0;
  }
  .examination-info {
    font-size: 0.6rem;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 5px 10px;
    span {
      margin-right: 4%;
    }
  }
  .examination-question-list {
    padding: 0 10px 20px;
    font-size: 0.7rem;
    h5 {
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 20px;
      margin-top: 15px;
    }
    .answer-list {
      padding: 8px 0 0 6px;
      line-height: normal;
      p {
        margin-bottom: 8px;
      }
    }
    .check-content {
      padding: 5px 0 8px;
      border-bottom: 1px solid #eee;
      span {
        padding: 5px 10px;
        &.active .iconfont:before {
          content: "\e60f";
          color: #09bb07;
        }
      }
      .iconfont {
        font-size: 1rem;
        margin-right: 2px;
        vertical-align: middle;
        &:before {
          color: #c9c9c9;
        }
      }
    }
  }
}
.cutdown-submit-wrap {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  padding: 5px 10px;
  border-top: 1px solid #eee;
  .examination-num {
    overflow: hidden;
    .num-item {
      float: left;
      display: inline-block;
      font-size: 0.6rem;
      padding: 1px 8px;
      margin-right: 4px;
      margin-bottom: 6px;
      border: 1px solid #ccc;
      &.selected {
        color: #fff;
        border-color: #09bb07;
        background-color: #09bb07;
      }
    }
  }
  .cutdown-content {
    margin-top: 5px;
    .cutdown-text {
      font-size: 0.6rem;
      .red {
        font-size: 0.8rem;
      }
    }
    .examination-submit-btn {
      float: right;
      color: #fff;
      background-color: #f00;
      &:after {
        border: none;
      }
    }
  }
}
</style>
