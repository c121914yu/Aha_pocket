<template>
	<view class="create-team">
		<view class="card">
			<view style="margin-bottom: 50px;" class="h3">团队基本信息</view>
			<!-- 头像 -->
			<view class="avatar">
				<view v-if="avatarUrl">
					<Avatar :src="avatarUrl" size="50"></Avatar>
				</view>
				<view v-else class="addAvatar" @click="chooseImg">
					<text class="add">+</text>
					<text>添加头像</text>
				</view>
			</view>
			<!-- 队伍名称 -->
			<SelfInput label="团队名称" placeholder="取一个响亮的名称" v-model="name"></SelfInput>
			<!-- 归属学校 -->
			<SelfInput
				label="归属学校" 
				search
				:arr_search="arr_school" 
				v-model="school">
			</SelfInput>
			<!-- 标签 -->
			<SelfInput 
				label="团队标签"
				placeholder="让其他人更好的了解你的团队" 
				v-model="tags">
			</SelfInput>
			<UserTags 
				:tags="tagsList"
				Color="var(--black)"
				bgColor="transparent"
				border="var(--border2)">
			</UserTags>
			<!-- 团队介绍 -->
			
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			avatarUrl: "",
			name: "",
			school: "",
			tags: "",
			arr_school: ["浙江大学","浙江工业大学","杭州电子科技大学","浙江理工大学","浙江农林大学","浙江科技学院","浙江外国语学院","中国计量大学","浙江财经大学"]
		};
	},
	computed: {
		tagsList() {
			return this.tags.split(' ').filter(tag => tag !== '');
		}
	}
}
</script>

<style lang="stylus" scoped>
.create-team
	min-height 100vh
	padding 10px
	background-color var(--origin4)
	.card
		position relative
		padding 10px 20px
		border-radius 8px
		background-color #FFFFFF
		.h3
			color var(--origin1)
		.avatar
			position absolute
			right 20px
			top 10px
			.addAvatar
				width 60px
				height 60px
				line-height 1.2
				color var(--origin2)
				font-size 20rpx
				border 2px solid var(--origin1)
				border-radius 8px
				display flex
				flex-direction column
				align-items center
				justify-content center
				.add
					font-size 50rpx
		.info-input
			margin 10px 0
</style>
