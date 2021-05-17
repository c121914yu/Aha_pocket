<!-- 
	创建 & 编辑论坛内容
	author yjl
-->
<template>
	<view class="edit-forum">
		<view class="card">
			<view class="h3">创建讨论</view>
			<!-- 标题 -->
			<aha-input 
				label="标题" 
				placeholder="请输入标题" 
				v-model="title.val">
			</aha-input>
			<!-- 所属标签 -->
			<aha-input 
				label="标签" 
				placeholder="请输入讨论归属标签" 
				search="search"
				:arr_search="arr_forumTags.map(item => item.name)"
				v-model="tag.val">
			</aha-input>
			<!-- 内容 -->
			<view class="label strong">
				讨论内容
				<text class="start-edit" @click="startEdit">点击编辑...</text>
			</view>
			<view  v-if="content" class="rich-text" v-html="content"></view>
			<view  v-else class="rich-text"><text class="remark" @click="startEdit">点击编辑讨论内容...</text></view>
		</view>
		<btn-bottom @click="onclickFinish">
			{{id === null ? "发布讨论" : "修改讨论"}}
		</btn-bottom>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getDiscussion,postDiscussion,putDiscussion } from "@/static/request/api_forum.js"
export default {
	data() {
		return {
			arr_forumTags: getApp().globalData.garr_forumTags,
			id: null,
			title: {
				val: "",
				errMsg: "讨论标题不能为空"
			},
			tag: {
				val: "",
				errMsg: "讨论标题不能为空"
			},
			content: ""
		};
	},
	onLoad(e) {
		console.log(e);
		if(e.id) {
			uni.setNavigationBarTitle({
				title: "编辑讨论"
			})
			getDiscussion(e.id)
			.then(res => {
				console.log(res.data);
			})
		}
		else {
			uni.setNavigationBarTitle({
				title: "创建讨论"
			})
		}
		console.log(this.arr_forumTags);
	},
	onShow() {
		/* 获取md内容 */
		this.content = getApp().globalData.gEditContent
		getApp().globalData.gEditContent = ""
	},
	methods: {
		/**
		 * 开始富文本编辑
		 */
		startEdit()
		{
			getApp().globalData.gEditContent = this.content
			uni.navigateTo({
				url: "../../EditMd/EditMd"
			})
		},
		/**
		 * 点击完成，判断是发布还是修改，执行不同API
		 */
		onclickFinish()
		{
			if(!this.gIsNull([this.title,this.tag])) {
				this.gLoading(this,true)
				const tagId = this.arr_forumTags.find(item => item.name === this.tag.val)
				const data = {
					title: this.title.val,
					tagId: tagId.id,
					content: this.content,
				}
				if(this.id === null) {
					postDiscussion(data)
					.then(res => {
						this.gBackPage("发布成功")
					})
					.finally(() => this.gLoading(this,false))
				}
				else {
					putDiscussion({
						postId: this.id,
						...data
					})
					.then(res => {
						console.log(res);
						this.gToastSuccess("修改成功")
					})
					.finally(() => this.gLoading(this,false))
				}
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.edit-forum
	min-height 100vh
	padding 10px 10px 60px 10px
	background-color var(--origin4)
	.card
		position relative
		padding 10px 20px
		border-radius 8px
		background-color #FFFFFF
		.h3, .start-edit
			color var(--origin1)
		.start-edit
			margin-left 5px
		.rich-text
			margin 5px 0
			padding 5px
			border 2px solid var(--origin2)
			border-radius 8px
			font-size 24rpx
			.remark
				color var(--gray2)
</style>
