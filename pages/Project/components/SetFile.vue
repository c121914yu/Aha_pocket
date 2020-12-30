<!-- 文件设置 -->
<template>
	<view class="set-file fix-screen">
		<div class="content">
			<view class="h3 center">文件信息设置</view>
			<form @submit="sure">
				<view class="item">
					<text class="label">文件名</text>
					<input name="name" type="text" placeholder="文件名" v-model="name">
				</view>
				<view class="item">
					<text class="label">贡献值</text>
					<input name="price" type="number" placeholder="购买所需贡献值" v-model.number="price">
				</view>
				<view class="label center">(最大值: 100,最小值: 70)</view>
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
			price: ""
		}
	},
	created() {
		if(this.fileInfo){
			this.name = this.fileInfo.name
			this.price = this.fileInfo.price
		}
	},
	methods: {
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
					price: this.price
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
				margin-right 10px
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
