<template>
  <view class="content">
    <view class="h3">添加成员</view>
    <view class="search">
      <input type="text" placeholder="添加队友" v-model="searchText"/>
      <text class="iconfont icon-sousuo" @click="search"></text>
    </view>
    <drawList ref="drawList" :list="members" @confirm="members=$event"></drawList>
  </view>
</template>

<script>
import drawList from "../components/drawList.vue"
export default {
  data() {
    return {
      searchText: "",
      members: []
    }
  },
  props: {
    projectId: String
  },
  methods: {
    /* 
      name: 搜索队友
      desc: 将输入内容传送给后台查询相关队员
      input:
            this.searchText: String,搜索文字
      change:
            this.members: Array,队友列表
      time: 2020/11/15
    */
    search()
    {
      const data = {
        name: this.members.length,
        avatarUrl: getApp().globalData.gUserInfo.userInfo.avatarUrl,
        phone: this.searchText,
      }
      this.members.push(data)
      this.$refs.drawList.tempList.push(data)
    }
  },
  components: {
    drawList
  }
}
</script>

<style lang="stylus" scoped>
.search
  position relative
  border 1px solid var(--origin2)
  border-radius 10px
  display flex
  align-items center
  input
    flex 1
    padding-right 40px
  .iconfont
    position absolute
    right 10px
    font-size 40rpx
    color var(--origin2)
</style>
