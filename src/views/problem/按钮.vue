<template>
  <div class="user-info">
    <!-- <divider>default</divider> -->
    <!-- <box gap="10px 10px"> -->
    <el-select v-model="value" filterable placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <x-button mini type="primary">答题</x-button>
    <!-- </box> -->
  </div>
</template>

<script>
import { XButton, Box, GroupTitle, Group, Flexbox, FlexboxItem, Divider } from 'vux'
import { getAllexamtype } from '@/api/problem'

export default {
  components: {
    XButton
    // Box,
    // GroupTitle,
    // Group,
    // Flexbox,
    // FlexboxItem,
    // Divider
  },
  data() {
    return {
      submit001: 'click me',
      disable001: false,
      options: [],
      value: ''
    }
  },
  created() {
    getAllexamtype()
      .then(res => {
        // console.log(res.data)
        this.options = []
        const obj = res.data
        for (let i = 0; i < obj.length; i++) {
          const tempList = {}
          tempList.value = obj[i].id
          tempList.label = obj[i].name
          this.options.push(tempList)
        }
      })
  },
  methods: {
    change(value) {
      console.log('change:', value)
    },
    processButton001() {
      this.submit001 = 'processing'
      this.disable001 = true
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
