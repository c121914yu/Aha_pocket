<!-- 
	讨论卡片
	author yjl
 -->
<template>
	<view class="forum-card" @click="$emit('click',forum)">
		<aha-avatar
			:src="forum.authorInfo.avatarUrl"
			radius="radius"
			size="40">
		</aha-avatar>
		<view class="right">
			<view class="head">
				<view class="name">{{forum.authorInfo.nickname}}</view>
				<view class="time">{{gformatDate(forum.createTime)}}</view>
			</view>
			<view class="content">
				{{forum.title}}
			</view>
			<view class="footer">
				<view class="blank"></view>
				<!-- 阅读数 -->
				<view class="data">
					<text class="iconfont icon-readed"></text>{{forum.read}}
				</view>
				<!-- 收藏量 -->
				<view class="data">
					<text class="iconfont icon-shoucang"></text>{{forum.collections}}
				</view>
				<!-- 点赞数 -->
				<view class="data">
					<text class="iconfont icon-zan"></text>{{forum.likes}}
				</view>
				<!-- 评论数 -->
				<view class="data">
					<text class="iconfont icon-pinglun"></text>{{forum.commentNum}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		forum: {
			type: Object,
			default: () => {}
		}
	}
}
</script>

<style lang="stylus" scoped>
.forum-card
	padding 10px
	display flex
	.right
		flex 1
		margin-left 10px
		.head
			display flex
			justify-content space-between
			.name
				color var(--black)
			.time
				font-size 20rpx
				color var(--gray2)
		.content
			padding 5px 0
			color var(--black)
			font-weight 700
	.footer
		font-size 24rpx
		display flex
		.data
			margin-left 10px
		.iconfont
			margin-right 2px
			font-size 24rpx
</style>
