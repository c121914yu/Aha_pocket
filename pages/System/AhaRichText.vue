<template>
	<view class="rich-text">
		<rich-text 
			:nodes="content" 
			:data-nodes="content"
			selectable="selectable"
			@click="gReadImage(arr_imgs)">
		</rich-text>
	</view>
</template>

<script>
import Htmlparse from "@/static/js/Htmlparse.js"
export default {
	data() {
		return {
			content: "",
			arr_imgs: []
		}
	},
	onLoad() {
		const obj_richtext = getApp().globalData.gobj_RichText
		const reg = /\<img /g
		this.content = Htmlparse(obj_richtext.content)
		uni.setNavigationBarTitle({
			title: obj_richtext.name
		})
		/* 解析img标签，获取src内容 */
		const imgDOM = (dom) => {
			
		}
		this.content.forEach(item => {
			if(item.name === "img") {
				this.arr_imgs.push(item.attrs.src)
			}
			/* 变量子集 */
			if(item.children) {
				item.children.forEach(child => {
					if(child.name === "img") {
						this.arr_imgs.push(child.attrs.src)
					}
				})
			}
		})
		console.log(this.content);
		console.log(this.arr_imgs);
	},
	methods: {
		onclickContent(e)
		{
			console.log(e.target);
			console.log(e.target.dataset.nodes);
		}
	}
}
</script>

<style lang="stylus" scoped>
.rich-text
	padding 10px
</style>
