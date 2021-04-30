<template>
	<view 
		class="ellipsis-text"
		:style="{
			'font-size': `${fontSize}rpx`
		}">
		<text 
			class="content"
			:style="{
				'display': showAll ? 'inline' : '-webkit-box',
				'-webkit-line-clamp': line,
				'overflow': showAll ? 'visible' : 'hidden'
			}">
			{{text}}
		</text>
		<text class="show-status" @click="showAll = !showAll">
			{{showAll ? "收起" : "全部"}}
		</text>
	</view>
</template>

<script>
export default {
	name:"ellipsis-text",
	props: {
		text: {
			type: String,
			default: ""
		},
		line: {
			type: Number,
			default: 3
		},
		fontSize: {
			type: Number,
			default: 24
		}
	},
	data() {
		return {
			showAll: false
		};
	}
}
</script>

<style lang="stylus" scoped>
.ellipsis-text
	position relative
	.content
		-webkit-box-orient vertical
	.show-status
		color var(--origin2)
		text-decoration underline
		white-space nowrap
</style>
