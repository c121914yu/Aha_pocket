<template>
	<view class="set-member">
		<view class="conetent">
			<view class="h3 center">添加队友<text class="small">(按先后顺序)</text></view>
			<view class="input">
				<input type="text" placeholder-class="placeholderStyle" placeholder="队友手机号/昵称"/>
				<text class="iconfont icon-sousuo" @click="search"></text>
			</view>
			<view class="small warn">{{errMsg}}</view>
			<!-- 添加结果 -->
			<view class="small remind">长按可删除用户</view>
			<view class="members">
				<view 
					class="member"
					v-for="(member,index) in members"
					:key='index'
					@longpress="removeMember(index)">
					<image :src="member.avatarUrl"></image>
					<text>{{member.name}}</text>
				</view>
			</view>
			<button>确认</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			inputVal: "",
			members: [
				{name: "余金隆",avatarUrl: "https://aha-public.oss-cn-hangzhou.aliyuncs.com/resource/15677751219/1604799789468/avatar.JPG"},
				{name: "萨法",avatarUrl: "https://aha-public.oss-cn-hangzhou.aliyuncs.com/resource/15677751219/1604799789468/avatar.JPG"},
				{name: "尴尬啊",avatarUrl: "https://aha-public.oss-cn-hangzhou.aliyuncs.com/resource/15677751219/1604799789468/avatar.JPG"},
				{name: "的撒发射",avatarUrl: "https://aha-public.oss-cn-hangzhou.aliyuncs.com/resource/15677751219/1604799789468/avatar.JPG"},
			],
			errMsg: "*该用户不存在"
		};
	},
	methods: {
		/* 
			name: 搜索用户
			desc: 将输入内容发送至后台查询用户，若查询到则添加到下方结果栏
			input:
						this.inputVal:String,输入内容
			change:
						members: Array,队友
			time: 2020/11/9
		*/
		search()
		{
			console.log(11);
		},
		/*
			name: 删除队友
			desc: 调用modal提示框，确认后删除该队友
			input:
						index: Number,下标
			change:
						members: Array,队友
			time: 2020/11/9
		*/
	  removeMember(index)
		{
			this.gShowModal(`确认删除${this.members[index].name}?`,() => {
				this.members.splice(index,1)
			})
		}
	}
}
</script>

<style lang="stylus">
.set-member
	z-index 5
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(0,0,0,0.2)
	.conetent
		position absolute
		top 50%
		left 2.5%
		transform translateY(-50%)
		width 90%
		padding 10px
		background-color #FFFFFF
		border-radius 12px
		.h3
			color var(--origin1)
		.input
			position relative
			display flex
			align-items center
			input
				flex 1
				padding-right 20px
				border 1px solid var(--gray2)
				border-radius 5px
			.iconfont
				z-index 2
				position absolute
				right 10px
				color var(--origin2)
				font-size 40rpx
		.warn
			color red
			text-align end
		.remind
			color var(--origin1)
		.members
			margin-bottom 10px
			min-height 100px
			display grid
			grid-template-columns repeat(3,1fr)
			grid-gap 10px
			.member
				display flex
				flex-direction column
				align-items center
				.mask
					position absolute
					width 28vw
					height 28vw
					background-color rgba(0,0,0,0.4)
					display flex
					align-items center
					justify-content center
					.iconfont
						color #FFFFFF
						font-size 40rpx
				image
					width 28vw
					height 28vw
					border-radius 5px
		button
			color #FFFFFF
			background-color var(--origin2)
</style>
