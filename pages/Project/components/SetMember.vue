<!-- 设置成员信息 -->
<template>
	<view class="fix-screen set-member" @click="$emit('update:memberInfo',null)" @touchmove.stop>
		<view class="content" @click.stop>
			<text class="h3 center">成员信息</text>
			<image :src="member.avatarUrl"></image>
            <view>
				<text class="small">I D:</text>
				<text class="value">{{member.memberUserId}}</text>
			</view>
			<view>
				<text class="small">姓名:</text>
				<text class="value">{{member.nickname}}</text>
			</view>
			<!-- 是否允许编辑 -->
			<view>
				<aha-radio
					label="允许编辑项目:"
					labelColor="var(--font-dark)"
					:radio="[
						{label:'允许',value:true},
						{label:'不允许',value:false}
					]"
					v-model="member.editable">
				</aha-radio>
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
	.content
		margin 0
		width 85%
		border-radius 8px
		display flex
		flex-direction column
		image
			margin auto
			width 60px
			height 60px
			border-radius 8px
			display block
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
