<!-- 文件设置 -->
<template>
	<view class="set-file fix-screen" @click="$emit('close')" @touchmove.stop.prevent>
		<div class="content" @click.stop>
			<view class="title">文件信息设置</view>
			<form @submit="sure">
				<view class="item">
					<text class="label">文件名</text>
					<input type="text" placeholder="文件名" maxlength="30" v-model="name">
				</view>
				<view class="item">
					<text class="label">文件类型</text>
					<input type="text" placeholder="文件类型" :value="type.label" disabled @click="setFileType">
				</view>
				<view class="item">
					<text class="label">Aha点</text>
					<input 
						type="number" 
						placeholder="购买所需Aha点" 
						v-model.number="price"
					>
				</view>
				<view class="mini max-min">(最大值: {{priceRange[0]}},最小值: {{priceRange[1]}})</view>
				<view class="btns">
					<button form-type="submit">确认</button>
					<button class="cancel" @click="$emit('close')">取消</button>
				</view>
			</form>
		</div>
	</view>
</template>

<script>
export default {
	props: {
		fileInfo: Object,
		level: Number
	},
	data() {
		return {
			name: "",
			price: 1000,
			type: null,
			max: 1000,
			min: 0
		}
	},
	computed: {
		priceRange() {
			const award = getApp().globalData.garr_prizeLevels.find(item => item.value === this.level)
			if(!this.type){
				return [0,0]
			}
			return [
				award.max * this.type.rate,
				award.min * this.type.rate,
			]
		}
	},
	created() {
		if(this.fileInfo){
			this.name = this.fileInfo.name
			this.price = this.fileInfo.price
			this.type = getApp().globalData.arr_fileClassify.find(item => item.value === this.fileInfo.typeId)
		}
	},
	methods: {
		/* 
			设置文件类型，调用gMenuPicker弹窗进行选择
			@set type: Object,文件类型
			time: 2020/12/31
		*/
	    setFileType()
		{
			this.gMenuPicker(getApp().globalData.arr_fileClassify)
			.then(res => {
				this.type = res
				this.price = (this.priceRange[0] + this.priceRange[1]) / 2
			})
		},
		/* 确认修改 */
		sure(e)
		{
			if(this.name === ""){
				this.gToastError("文件名为空")
			}
			else if(this.price === ""){
				this.gToastError("定价为空")
			}
			else if(this.price < this.priceRange[1] || this.price > this.priceRange[0]){
				this.gToastError("定价范围错误")
			}
			else{
				const data = {
					name: this.name,
					price: this.price,
					typeId: this.type.value
				}
				/* 调用修改附件信息API */
				this.$emit("success",data)
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.set-file
	.content
		margin 0
		width 85%
		border-radius 8px
		.title
			margin 5px 0
			text-align center
			color var(--gray1)
			font-weight 700
		.item
			position relative
			margin-top 10px
			background-color var(--origin4)
			padding 2px 2px 2px 5px
			border-radius 8px
			display flex
			align-items center
			.label
				width 58px
				color var(--origin1)
				font-weight 700
				font-size 22rpx
				text-align center
			input
				flex 1
				background-color #FFFFFF
				padding-left 10px
		.max-min
			color var(--origin2)
			margin 3px 0 3px 65px
		.btns
			margin-top 10px
			display flex
			button
				width 35%
				padding 0 10px
				border-radius 22px
			.cancel
				background-color var(--gray2)
</style>
