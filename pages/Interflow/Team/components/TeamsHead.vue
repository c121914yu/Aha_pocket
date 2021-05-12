<!-- 
	团队头部筛选排序信息
	author yjl
 -->
<template>
	<view class="team-head">
		<view class="item default">综合</view>
		<view style="margin-left: 10px;" class="item filter">筛选<text class="iconfont icon-shaixuan"></text></view>
		<view class="search">
			<search-input v-model="search"></search-input>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			search: ""
		};
	}
}
</script>

<style lang="stylus" scoped>
.team-head
	padding 0 5px 0 20px
	border-radius 22px
	background-color var(--origin3)
	display flex
	align-items center
	.filter .iconfont
		font-size 24rpx
	.item
		margin 3px 0
		padding 3px 15px
		border-radius 22px
		white-space nowrap
		background-color var(--origin2)
		color #FFFFFF
	.search
		margin-left 5px
		flex 1
</style>
