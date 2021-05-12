<!-- 
	自定义单选框
	author yjl
-->
<template>
	<view class="radio">
		<radio-group @change="select">
			<text 
				:style="{
					color: labelColor
				}" 
				class="small label">
				{{label}}
			</text>
			<label
				v-for="(item,index) in radio"
				:key="index">
				<radio
					style="transform:scale(0.8)" 
					:value="item.value" 
					color="#f8b86b" 
					:checked="value === item.value"/>
				<text>{{item.label}}</text>
			</label>
		</radio-group>
	</view>
</template>

<script>
export default {
	props: {
		value: String | Boolean | Number,
		label: String,
		labelColor: {
			type: String,
			default: "#f8b86b"
		},
		radio: Array,
	},
	data() {
		return {
			check: null
		}
	},
	methods: {
		/* 选择，触发emit(input) */
		select(e)
		{
			let val = e.target.value
			const type = typeof this.value
			if(type === "boolean"){
				val = val === "true"
			}
			else if(type === "number"){
				val = Number(val)
			}
			this.$emit("input",val)
		}
	}
}
</script>

<style lang="stylus" scoped>
.radio
	margin 10px 0
	font-size 22rpx
	text
		margin-right 10px
</style>
