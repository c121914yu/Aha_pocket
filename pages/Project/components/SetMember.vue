<!-- 设置成员信息 -->
<template>
	<view class="set-member" @click="$emit('close')">
		<view class="content" @click.stop>
			<text class="h3">成员信息</text>
			<image :src="member.avatarUrl"></image>
            <view>
				<text class="small">uid:</text>
				<text class="value">{{member.memberUserId}}</text>
			</view>
			<view>
				<text class="small">姓名:</text>
				<text class="value">{{member.nickname}}</text>
			</view>
			<!-- 是否允许编辑 -->
			<view>
				<SelfRadio
					label="允许编辑项目:"
					labelColor="var(--font-dark)"
					:radio="[
						{label:'允许',value:true},
						{label:'不允许',value:false}
					]"
					v-model="member.editable">
				</SelfRadio>
			</view>
			<!-- 负责工作 -->
			<view class="job">
				<text class="small">负责工作: </text>
				<input type="text" placeholder="该成员负责的工作" v-model="member.job">
			</view>
			<!-- 按键 -->
			<view class="btns">
				<view v-if="member.memberIndex===-1" class="close" @click="$emit('sure',{type:0})">取消</view>
				<view v-else class="delete" @click="remove">删除</view>
				<view class="sure" @click="$emit('sure',{type:2,member})">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return{
			member: {}
		}
	},
	props: {
		memberInfo: Object
	},
	methods: {
		remove()
		{
			this.gShowModal("确认删除该成员?",() => {
				this.$emit("sure",{
					type: 1,
					member: this.member
				})
			})
		}
	},
	created() {
		this.member = {...this.memberInfo}
	}
}
</script>

<style lang="stylus" scoped>
.set-member
	z-index 5
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(0,0,0,0.2)
	display flex
	align-items center
	justify-content center
	.content
		width 90%
		padding 10px
		border-radius 22px
		background-color #FFFFFF
		display flex
		flex-direction column
		align-items center
		image
			width 60px
			height 60px
			border-radius 8px
		view
			margin 2px 0
			width 90%
			.small
				margin-right 5px
			.value
				margin-left 5px
				color var(--origin2)
				font-weight 700
			&.job
				display flex
				align-items center
				input
					padding 2px 5px
					flex 1
					border 1px solid var(--gray2)
			&.btns
				margin-top 10px
				font-size 34rpx
				font-weight 700
				display flex
				justify-content space-around
				text-align center
				.sure
					color #1e9493
					border-left 2px solid var(--gray3)
				.close
					color var(--gray1)
				.delete
					color #e86452
</style>
