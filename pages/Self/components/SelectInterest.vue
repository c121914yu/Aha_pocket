<!-- 
	兴趣选择
	author yjl
 -->
<template>
	<view class="select-interest">
		<!-- 蒙层 -->
		<view 
			class="mask" 
			@click.self="$emit('close')" 
			@touchmove.stop.prevent>
		</view>
		<!-- 主体内容 -->
		<view class="content">
			<!-- 标题 -->
			<view class="h3">根据需求为你定制推荐内容</view>
			<view class="arrow-right" @click="$emit('close')">
				<text class="iconfont icon-arrow-right icon"></text>
				<text class="text small">跳过</text>
			</view>
			<!-- 标签选择 -->
			<view class="select">
				<view class="title strong">个人({{ specialtyAmount }} / 4)</view>
				<view class="select-box">
					<view class="item" 
						v-for="(tag, index) in arr_specialtyTags" 
						:key="index" 
						@click="onclickTag('specialtyAmount', tag)">
						<text class="strong">{{ tag.text }}</text>
						<view class="circle-out">
							<view
								class="in"
								:style="{
									'background-color': tag.select ? '#e60012' : '#f39800'
								}"
							></view>
						</view>
					</view>
					<view v-if="specialtyAmount < 4" class="item">
						<input
							type="text" 
							placeholder="自定义标签" 
							maxlength="6" 
							@blur="onblurAddTag('arr_specialtyTags')" 
							v-model="selfTag"/>
					</view>
				</view>
				<view class="title strong">竞赛({{ compAmount }} / 4)</view>
				<view class="select-box">
					<view 
						class="item compete" 
						v-for="(tag, index) in arr_compTags" 
						:key="index" 
						@click="onclickTag('compAmount', tag)">
						<view class="strong">{{ tag.text }}</view>
						<view class="circle-out">
							<view
								class="in"
								:style="{
									'background-color': tag.select ? '#e60012' : '#f39800'
								}"></view>
						</view>
					</view>
					<view v-if="compAmount < 4" class="item compete">
						<input
							class="input-interest"
							type="text" 
							placeholder="自定义标签" 
							maxlength="6" 
							@blur="onblurAddTag('arr_compTags')" 
							v-model="selfTag"/>
					</view>
				</view>
			</view>
			<!-- 底部按键 -->
			<btn-bottom
				text="确认"
				@click="onclickSure">
			</btn-bottom>
		</view>
	</view>
</template>

<script>
import { putMe } from '@/static/request/api_userInfo.js';
export default {
	data() {
		return {
			selfTag: "",
			arr_specialtyTags: [
				{ text: '视觉', select: false },
				{ text: '文书', select: false },
				{ text: '前端', select: false },
				{ text: '后端', select: false },
				{ text: '小程序', select: false },
				{ text: '大数据', select: false },
				{ text: '商业模式', select: false }
			],
			arr_compTags: [
				{ text: '互联网+', select: false },
				{ text: '挑战杯', select: false },
				{ text: '服务外包', select: false },
				{ text: '电子商务', select: false },
				{ text: '数学建模', select: false },
				{ text: 'ACM', select: false },
				{ text: '机械设计', select: false }
			]
		};
	},
	computed: {
		/* 计算选中的长度 */
		specialtyAmount() {
			return this.arr_specialtyTags.filter(item => item.select).length
		},
		compAmount() {
			return this.arr_compTags.filter(item => item.select).length
		}
	},
	created() {
		/* 获取已经选择的标签，将其设置为true */
		let arr_specialtyTags = getApp().globalData.gUserInfo.userInfo.specialtyTags
		arr_specialtyTags = arr_specialtyTags ? arr_specialtyTags.split(',') : [],
		/* 判断是否在已存标签 */
		arr_specialtyTags.forEach(tag => {
			/* 判断该标签是否在预设中，若在直接修改select，不在则末尾追加 */
			const index = this.arr_specialtyTags.findIndex(item => item.text === tag)
			if(index >= 0){
				this.arr_specialtyTags[index].select = true
			}
			else{
				this.arr_specialtyTags.push({
					text: tag,
					select: true
				})
			}
		})
		let arr_compTags = getApp().globalData.gUserInfo.userInfo.compTags
		arr_compTags = arr_compTags ? arr_compTags.split(',') : []
		arr_compTags.forEach(tag => {
			/* 判断该标签是否在预设中，若在直接修改select，不在则末尾追加 */
			const index = this.arr_compTags.findIndex(item => item.text === tag)
			if(index >= 0){
				this.arr_compTags[index].select = true
			}
			else{
				this.arr_compTags.push({
					text: tag,
					select: true
				})
			}
		})
	},
	methods: {
		/**
		 * @param {String} key 对应的对象名
		 */
		onblurAddTag(key)
		{
			if(this.selfTag){
				this[key].push({
					text: this.selfTag,
					select: true
				})
				this.selfTag = ""
			}
		},
		/**
		 * 点击标签，切换选中状态
		 * @param {String} key 对应的对象名
		 * @param {Object} tag 标签对象
		 */
		onclickTag(key, tag) 
		{
			/* 未选中 */
			if (!tag.select) {
				/* 如果小于4个，则选中 */
				if (this[key] < 4) {
					tag.select = true
				}
			} 
			/* 如果未选中直接变true */
			else {
				tag.select = false
			}
		},
		/**
		 * 点击确认,更新全局用户属性，并调用api更新数据库
		 */
		onclickSure() 
		{
			const specialtyTags = this.arr_specialtyTags
				.filter(item => item.select)
				.map(item => item.text)
				.join(',')
			const compTags = this.arr_compTags
				.filter(item => item.select)
				.map(item => item.text)
				.join(',')
			/* 更新 */
			putMe({
				specialtyTags,
				compTags
			})
			getApp().globalData.gUserInfo.userInfo.specialtyTags = specialtyTags
			getApp().globalData.gUserInfo.userInfo.compTags = compTags
			this.gToastMsg('选择成功')
			this.$emit('close')
		}
	}
}
</script>

<style lang="stylus" scoped>
.select-interest
	z-index 100
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	animation show 0.6s ease
	@keyframes show
		0%
			transform translateY(100%)
		100%
			transform translateY(0)
	.mask
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		background-color rgba(0, 0, 0, 0.3)
	.content
		position relative
		z-index 100
		margin-top 10vh
		height 90vh
		width 100%
		background-image linear-gradient(#fffef7, #f7d7b9)
		border-top-left-radius 22px
		border-top-right-radius 22px
		.h3
			padding 20px 20px 40px 20px
			color var(--origin1)
		.arrow-right
			position absolute
			right 20px
			top 15px
			display flex
			flex-direction column
			align-items center
			.icon
				line-height 0.8
				font-size 80rpx
				color var(--origin2)
				text-shadow var(--shadow2)
			.text
				color var(--origin2)
	.select
		width 100%
		height 100%
		overflow-y scroll
		.title
			position relative
			margin-bottom 30rpx
			display flex
			align-items center
			justify-content center
			color var(--origin2)
			&::before
				content ''
				position absolute
				margin-left -45%
				width 22%
				height 2px
				background-color var(--origin2)
				border-radius 10px
			&::after
				content ''
				position absolute
				margin-left 45%
				width 22%
				height 2px
				background-color var(--origin2)
				border-radius 10px
		.select-box
			margin-bottom 20px
			padding 0 20px
			display grid
			grid-template-columns 1fr 1fr
			grid-gap 15px
			&:last-child
				margin-bottom 170px
			.item
				height 45px
				width calc(100% - 25px)
				padding 0 10px 0 15px
				background-color var(--origin3)
				border-radius 16px
				box-shadow var(--shadow2)
				font-size 26rpx
				display flex
				align-items center
				justify-content space-between
				.input-interest
					font-size 26rpx
					font-weight 700
				&.compete
					height 70px
					padding 10px 10px 10px 15px
					align-items flex-start
					.strong
						height 100%
						display flex
						align-items flex-end
				.circle-out
					width 30px
					height 30px
					opacity 0.6
					border-radius 50%
					background-color var(--bg-color1)
					display flex
					align-items center
					justify-content center
					.in
						width 22px
						height 22px
						border 1px solid #999999
						border-radius 50%
</style>
