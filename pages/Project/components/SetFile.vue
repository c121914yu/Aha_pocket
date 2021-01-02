<!-- 文件设置 -->
<template>
	<view class="set-file fix-screen">
		<div class="content">
			<view class="h3 center">文件信息设置</view>
			<form @submit="sure">
				<view class="item">
					<text class="label">文件名</text>
					<input type="text" placeholder="文件名" v-model="name">
				</view>
				<view class="item">
					<text class="label">文件类型</text>
					<input type="text" placeholder="文件类型" :value="type.label" disabled @click="setFileType">
				</view>
				<view class="item">
					<text class="label">AHa点</text>
					<input type="number" placeholder="购买所需贡献值" v-model.number="price">
				</view>
				<view class="remark center">(最大值: 100,最小值: 70)</view>
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
		fileInfo: Object
	},
	data() {
		return {
			name: "",
			price: "",
			type: null
		}
	},
	created() {
		if(this.fileInfo){
			this.name = this.fileInfo.name
			this.price = this.fileInfo.price
			this.type = this.fileInfo.type
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
			this.gMenuPicker(getApp().globalData.arr_fileTypes)
			.then(res => {
				this.type = res
			})
		},
		/* 确认修改 */
		sure(e)
		{
			if(this.name === ""){
				this.gToastError("文件名为空")
			}
			else if(this.price === ""){
				this.gToastError("贡献度为空")
			}
			else{
				const data = {
					name: this.name,
					price: this.price,
					type: this.type
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
		width 80%
		border-radius 8px
		padding 10px
		.item
			position relative
			margin-top 10px
			display flex
			align-items center
			.label
				width 58px
				font-size 22rpx
			.remark
				margin 5px
			input
				flex 1
				border var(--border2)
		.btns
			margin-top 10px
			display flex
			button
				width 35%
				padding 0 10px
			.cancel
				background-color var(--gray2)
</style>
