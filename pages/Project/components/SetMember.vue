<!-- 设置成员信息 -->
<template>
	<view 
		class="fix-screen set-member" 
		@click="$emit('close')" 
		@touchmove.stop>
		<view class="content" @click.stop>
			<text class="h3 center">成员信息</text>
			<image class="avatar" :src="member.avatarUrl"></image>
            <view class="item">
				<view class="small">I D</view>
				<view class="value">{{member.memberUserId}}</view>
			</view>
			<view class="item">
				<view class="small">姓名</view>
				<view class="value">{{member.nickname}}</view>
			</view>
			<!-- 负责工作 -->
			<view class="item job">
				<view class="small">负责工作</view>
				<input class="input-job" type="text" placeholder="该成员负责的工作" v-model="member.job">
			</view>
			<!-- 是否允许编辑 -->
			<view class="item">
				<aha-radio
					label="编辑项目"
					labelColor="var(--font-dark)"
					:radio="[
						{label:'允许',value:true},
						{label:'不允许',value:false}
					]"
					v-model="member.editable">
				</aha-radio>
			</view>
			<!-- 按键 -->
			<view class="item btns">
				<view class="btn delete" @click="onclickRemove">删除</view>
				<view class="btn sure" @click="$emit('update',member)">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		memberInfo: Object
	},
	data(){
		return{
			member: {}
		}
	},
	created() {
		this.member = this.memberInfo
	},
	methods: {
		/**
		 * 点击删除成员，modal提示确认
		 */
		onclickRemove()
		{
			this.gShowModal("确认删除该成员?",() => {
				this.$emit("remove",this.member.memberUserId)
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.set-member .content
	margin auto
	width 90%
	padding 10px 5%
	border-radius 8px
	.avatar
		margin auto
		width 60px
		height 60px
		border-radius 8px
		display block
	.item
		margin-bottom 10px
		display flex
		align-items center
		.small
			width 60px
		.value
			color var(--origin2)
			font-weight 700
		.input-job
			flex 1
			padding 2px 5px
			border 1px solid var(--gray2)
		&.btns
			width 100%
			justify-content space-around
			.btn
				text-align center
				width 30%
				padding 5px 0
				border-radius 8px
				border 1px solid transparent
			.sure
				color #1e9493
				border-color #1e9493
			.delete
				color #e86452
				border-color #e86452
</style>
