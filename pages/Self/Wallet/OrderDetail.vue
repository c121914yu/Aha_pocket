<!-- 
	订单详细
	author yjl
 -->
<template>
	<view class="order-info">
		<view v-if="id>0" class="content">
			<image :src="obj_project.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
			<view class="item project-name">
				{{obj_project.name}}
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
						<navigator 
							v-for="(file,index) in arr_orderResources"
							:key="index"
							:url="`../../Project/Project?id=${file.resource.projectId}`">
							{{file.resource.name}}
						</navigator>
					</view>
				</view>
				<view v-if="status===1" class="item">
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
					<text class="val">{{gformatDate(createTime,true)}}</text>
				</view>
				<view v-if="payTime" class="item">
					<text class="label">支付时间</text>
					<text class="val">{{gformatDate(payTime,true)}}</text>
				</view>
			</view>
			<!-- 反馈订单 -->
			<view class="feedback">
				<view class="center" @click="is_showFeedback=!is_showFeedback">对订单有疑问？点击反馈</view>
				<!-- 反馈内容 -->
				<view 
					v-if="is_showFeedback"
					class="feedback-coontent">
					<textarea 
						:placeholder="is_showFeedback ? '输入反馈内容...' : ''" 
						v-model="feedbackContent.val"/>
					<button @click="submitFeedback">提交反馈</button>
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
			status: 0,
			totalCost: 0,
			chargedAhaCredit: 0, // 消费的aha币
			chargedAhaPoint: 0, // 消费的aha点
			createTime: "", // 订单创建时间
			payTime: "", // 支付时间
			obj_project: null,
			arr_orderResources: [], // 购买的附件
			obj_user: null,
			feedbackContent: {// 订单反馈信息
				val: "",
				errMsg: "反馈内容不能为空"
			}, 
			is_showFeedback: false
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		getOrder(Number(e.id))
		.then(res => {
			console.log(res.data);
			this.status = res.data.status
			this.chargedAhaCredit = res.data.chargedAhaCredit
			this.chargedAhaPoint = res.data.chargedAhaPoint
			this.totalCost = res.data.totalCost
			this.createTime = res.data.createTime
			this.payTime = res.data.payTime
			/* 附件信息 */
			this.obj_project = res.data.project
			/* 购买的附件 */
			this.arr_orderResources = res.data.orderResources
			for(let key in res.data){
				this[key] = res.data[key]
			}
			/* 用户信息 */
			this.obj_user = res.data.user
			this.id = res.data.id
		})
		.catch(err => {
			console.error(err)
			uni.navigateBack({
				delta: 1,
				success: () => {
					this.gToastMsg("请求订单出现错误")
				}
			})
		})
		.finally(() => this.gLoading(this,false))
	},
	methods: {
		/**
		 * 提交反馈，检测空值
		 */
		submitFeedback()
		{
			if(!this.gIsNull([this.feedbackContent])){
				this.gShowModal("您确认提交反馈？",() => {
					feedbackProblem({
						type: 3,
						content: `订单号: ${this.id}. ${this.feedbackContent.val}`
					})
					.then(res => {
						this.gToastSuccess("反馈成功")
						this.feedbackContent.val = ""
						this.is_showFeedback = false
					})
				})
			}
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
			width 100%
			transform translateX(-50%)
			overflow hidden
			textarea
				width 100%
				height 120px
				background-color #FFFFFF
			button
				margin-top 10px
				padding 0
				width 100px
				border-radius 8px
</style>
