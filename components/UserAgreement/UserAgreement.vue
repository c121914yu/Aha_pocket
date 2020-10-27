<!-- 用户须知 -->
<template>
	<view class="user-agreement">
		<view class="content">
			<view class="title center">用户须知</view>
			<!-- 协议内容 -->
			<view class="agreement">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum exercitationem incidunt reprehenderit blanditiis voluptas ea deleniti porro aperiam iste vero vitae facilis quibusdam culpa necessitatibus iusto beatae minima recusandae labore fuga natus soluta praesentium quisquam et amet excepturi aut rerum placeat facere quia qui libero eligendi dicta quas eveniet repellat rem perspiciatis! Sit animi laudantium in sunt perspiciatis nihil aliquam repellat laboriosam autem cupiditate molestias incidunt sapiente expedita dignissimos ducimus obcaecati ipsa quidem unde deserunt ea voluptatem libero officiis vitae quis veniam? Atque quidem optio ut perspiciatis numquam dolorem est fugiat veniam itaque mollitia quos impedit molestiae et rem officia.
			</view>
			<!-- 须知勾选 -->
			<view class="sign" @click="isReaded=!isReaded">
				<view 
					class="square"
					:class="isReaded ? 'active' : ''">
					{{isReaded ? "&#10003;" : ''}}
				</view>
				<view>我已阅读<text class="strong">Aha口袋</text>用户协议</view>
			</view>
			<!-- 完成按键 -->
			<button 
				class="readed-btn"
				:class="isReaded ? 'already' : 'noReady'"
				@click="readed">
				我已阅读
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isReaded: false
			}
		},
		methods: {
			/* 
				name: 我已阅读
				desc: 点击我已阅读,判断是否勾选了用户协议，未勾选则跳过，勾选则触发请求
			*/
			readed()
			{
				if(!this.isReaded)
				{
					return
				}
				/* 触发请求 */
				this.$emit("readed")
			}
		}
	}
</script>

<style lang="stylus" scoped>
.user-agreement
	z-index 15
	position fixed
	top 0
	left 0
	height 100vh
	width 100vw
	background-color rgba(144,140,139,0.65)
	.content
		position absolute
		top 45%
		left 50%
		transform translate(-50%,-50%)
		width 80vw
		height 60vh
		padding 10px
		background-color #FFFFFF
		color #333333
		border-radius 10px
		box-shadow var(--shadow1)
		display flex
		flex-direction column
		.title
			font-size 40rpx
			font-weight 600
		/* 协议内容 */
		.agreement
			margin 5px 0
			flex 1
			padding 5px
			font-size 30rpx
			overflow-y scroll
			text-indent 60rpx
		/* 勾选协议 */
		.sign
			padding 10px 0
			display flex
			align-items center
			justify-content center
			.square
				margin 5px
				width 32rpx
				height 32rpx
				border 1px solid #333333
				display flex
				align-items center
				justify-content center
				&.active
					border-color var(--origin4)
					color var(--origin4)
					font-weight 600
			.strong
				color var(--origin4)
		/* 已阅读按键 */
		.readed-btn
			margin-top 10px
			width 100%
			background-color rgba(144,140,139,0.65)
			color #333333
			&.noReady:active
				transform none
			&.already
				background-color var(--button-bg)
				color #FFFFFF
</style>
