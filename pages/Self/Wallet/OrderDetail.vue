<template>
	<view class="order-info">
		<view class="content">
			<image :src="user.avatarUrl"></image>
			<view class="item project-name">
				{{project.name}}
			</view>
			<view class="item total-cost">
				{{status === 0 ? totalCost : `-${totalCost}`}}
			</view>
			<view 
				class="item status"
				:style="{
					color: status === 0 ? 'var(--gray1)' : 'var(--origin2)'
				}">
				{{status === 0 ? "已取消" : "已支付"}}
			</view>
			<view class="card">
				<view class="item explain">
					<text class="label">商品说明</text>
					<view class="val">
						<view 
							v-for="(file,index) in orderResources"
							:key="index">
							{{file.resource.name}}
						</view>
					</view>
				</view>
				<view v-if="status == 1" class="item">
					<text class="label">付款详细</text>
					<view class="val">
						<view v-if="chargedAhaCredit">-{{chargedAhaCredit}} Aha币</view>
						<view v-if="chargedAhaPoint">-{{chargedAhaPoint}} Aha点</view>
					</view>
				</view>
				<view class="item">
					<text class="label">账单分类</text>
					<text class="val">附件购买</text>
				</view>
				<view class="item">
					<text class="label">创建时间</text>
					<text class="val">{{createTime}}</text>
				</view>
				<view v-if="status == 1" class="item">
					<text class="label">支付时间</text>
					<text class="val">{{payTime}}</text>
				</view>
			</view>
			<!-- 反馈订单 -->
			<view class="feedback">
				<view class="center" @click="is_showFeedback=!is_showFeedback">对订单有疑问？点击反馈</view>
				<!-- 反馈内容 -->
				<view 
					class="feedback-coontent"
					:style="{
						width: is_showFeedback ? '100%' : '0'
					}">
					<textarea 
						:placeholder="is_showFeedback ? '输入反馈内容...' : ''" 
						v-model="feedbackContent"/>
					<button @click="feedback">提交反馈</button>
				</view>
			</view>
		</view>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getOrder } from "@/static/request/api_order.js"
import { feedbackProblem } from "@/static/request/api_system.js"
export default {
	data() {
		return {
			id: 0,
			chargedAhaCredit: 0,
			chargedAhaPoint: 0,
			createTime: "",
			orderResources: [],
			payTime: "", 
			totalCost: 0,
			project: null,
			status: 0,
			user: null,
			feedbackContent: "",
			loaded: false,
			is_showFeedback: false
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		getOrder(Number(e.id))
		.then(res => {
			res.data.createTime = this.gformatDate(res.data.createTime,true)
			if(res.data.payTime) {
				res.data.payTime = this.gformatDate(res.data.payTime,true)
			}
			
			for(let key in res.data){
				this[key] = res.data[key]
			}
			
			this.loaded = true
			this.gLoading(this,false)
			console.log(res.data);
		})
		.catch(err => {
			console.error(err)
			this.gLoading(this,false)
			uni.navigateBack({
				delta: 1,
				success: () => {
					this.gToastMsg("出现了错误")
				}
			})
		})
	},
	methods: {
		/* 检查空值，调用API，清除内容 */
		feedback()
		{
			if(this.feedbackContent === ""){
				return
			}
			this.gShowModal("您确认提交反馈？",() => {
				feedbackProblem({
					type: 3,
					content: `订单号: ${this.id}. ${this.feedbackContent}`
				})
				.then(res => {
					this.gToastSuccess("反馈成功")
					this.is_showFeedback = false
					this.feedbackContent = ""
				})
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.order-info .content
	min-height 100vh
	background-color var(--white1)
	padding 5% 10px
	display flex
	flex-direction column
	align-items center
	image
		margin-bottom 5px
		width 60px
		height 60px
		border-radius 50%
	.total-cost
		font-size 50rpx
		font-weight 700
		color var(--origin1)
	.project-name, status
		font-size 26rpx
	.card
		margin-top 10px
		width 100%
		background-color #FFFFFF
		border-radius 8px
		.item
			padding 10px
			border-bottom 1px solid var(--white1)
			font-size 26rpx
			display flex
			justify-content space-between
			align-items center
			.label
				margin-right 5px
				white-space nowrap
				color var(--gray1)
			.val
				color var(--origin1)
				text-align end
	.feedback
		margin-top 10px
		width 100%
		font-size 26rpx
		.center
			color var(--origin1)
		.feedback-coontent
			margin-top 10px
			margin-left 50%
			transform translateX(-50%)
			overflow hidden
			transition var(--speed-hover)
			textarea
				width 100%
				height 120px
				background-color #FFFFFF
			button
				margin-top 10px
				line-height 1.1
				width 80px
				border-radius 8px
</style>
