<template>
	<view class="forum-card">
		111
		<view class="header">
			<view class="avatar"><image :src="forum.authorInfo.avatarUrl"></image></view>
			<view class="right">
				<view class="name">{{forum.authorInfo.nickname}}</view>
				<view class="time">{{gformatDate(forum.createTime)}}</view>
			</view>
		</view>
		<view class="content">
			{{forum.title}}
		</view>
		<view class="footer">
			<!-- 阅读数 -->
			<view class="data">
				<text class="iconfont icon-shoucang"></text>{{forum.read}}
			</view>
			<!-- 收藏量 -->
			<view class="data">
				<text class="iconfont icon-shoucang"></text>{{forum.collections}}
			</view>
			<!-- 点赞数 -->
			<view class="data">
				<text class="iconfont icon-shoucang"></text>{{forum.likes}}
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
	},
	data() {
		return {
			
		}
	}
}
</script>

<style lang="stylus" scoped>
.forum-card
	border-bottom var(--border2)
</style>
