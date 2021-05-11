<!-- 
	创建团队
	author yjl
 -->
<template>
	<view class="create-team">
		<view class="card">
			<view style="margin-bottom: 50px" class="h3">团队基本信息</view>
			<!-- 头像 -->
			<view class="avatar">
				<view v-if="avatar" @click="onclickAvatar">
					<Avatar :src="avatar" size="50"></Avatar>
				</view>
				<view v-else class="addAvatar" @click="chooseImg">
					<text class="add">+</text>
					<text>添加头像</text>
				</view>
			</view>
			<!-- 队伍名称 -->
			<SelfInput label="团队名称" placeholder="取一个响亮的名称" v-model="name.val"></SelfInput>
			<!-- 归属学校 -->
			<SelfInput
				label="归属学校" 
				search
				:arr_search="arr_school"
				v-model="school">
			</SelfInput>
			<!-- 标签 -->
			<SelfInput 
				label="团队标签"
				placeholder="让其他人更好的了解你的团队" 
				v-model="tag">
			</SelfInput>
			<Tags 
				:tags="tag | splitTags"
				Color="var(--black)"
				bgColor="transparent"
				border="var(--border2)">
			</Tags>
			<!-- 团队介绍 -->
			<view style="margin: 5px 0" class="title strong">团队介绍</view>
			<view class="intro" v-if="intro" v-html="intro"></view>
			<button class="intro-btn" @click="startEdit">编辑</button>
		</view>
		<BottomBtn @click="onclickCreate">创建团队</BottomBtn>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { postTeam } from "@/static/request/api_team.js"
import { getPublicSignature } from '@/static/request/api_system.js'
export default {
	data() {
		return {
			avatar: "",
			name: {
				val: "",
				errMsg: "队伍名不能为空"
			},
			school: "",
			tag: "",
			intro: "",
			arr_school: ["浙江大学","浙江工业大学","杭州电子科技大学","浙江理工大学","浙江农林大学","浙江科技学院","浙江外国语学院","中国计量大学","浙江财经大学"]
		}
	},
	onShow() {
		/* 获取md内容 */
		this.intro = getApp().globalData.gEditContent
		getApp().globalData.gEditContent = ""
	},
	methods: {
		/**
		 * 选择头像
		 */
		chooseImg() 
		{
			this.gChooseImage()
			.then(url => {
				this.avatar = url[0]
			})
		},
		/**
		 * 点击头像，menu弹窗提示查看头像/修改头像
		 */
		onclickAvatar()
		{
			this.gMenuPicker(["查看头像","修改头像"])
			.then(res => {
				if(res === "查看头像"){
					this.gReadImage([this.avatar])
				}
				else if(res === "修改头像"){
					this.chooseImg()
				}
			})
		},
		/**
		 * 开始富文本编辑
		 */
		startEdit()
		{
			getApp().globalData.gEditContent = this.intro
			uni.navigateTo({
				url: "../../EditMd/EditMd"
			})
		},
		/**
		 * 点击创建团队
		 */
		async onclickCreate()
		{
			if(!this.gIsNull([this.name])){
				this.gLoading(this,true)
				if(this.avatar){
					try{
						/* 获取上传签名 */
						const sign = await getPublicSignature(`${Date.now()}.JPG`)
						/* 上传图片 */
						const url = await this.gUploadFile(this.avatar, sign.data)
						this.avatar = url.header.Location
					} catch(err) {
						this.gLoading(this,false)
					}
				}
				/* 创建团队API */
				const data = {
					avatar : this.avatar || "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
					name: this.name.val,
					school: this.school,
					tag: this.tag,
					intro: this.intro,
					recruitState: 0
				}
				postTeam(data)
				.then(res => {
					uni.redirectTo({
						url: `./EditTeam?id=${res.data}`,
						success: () => {
							this.gToastSuccess("创建成功")
						}
					})
				})
				.finally(() => this.gLoading(this,false))
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.create-team
	min-height 100vh
	padding 10px 10px 60px 10px
	background-color var(--origin4)
	.card
		position relative
		padding 10px 20px
		border-radius 8px
		background-color #FFFFFF
		.h3
			color var(--origin1)
		.avatar
			position absolute
			right 20px
			top 10px
			.addAvatar
				width 60px
				height 60px
				line-height 1.2
				color var(--origin2)
				font-size 20rpx
				border 2px solid var(--origin1)
				border-radius 8px
				display flex
				flex-direction column
				align-items center
				justify-content center
				.add
					font-size 50rpx
		.info-input
			margin 10px 0
		.intro
			*
				white-space pre-wrap
				word-wrap break-word
			padding 2px
			border 2px solid var(--origin2)
			border-radius 8px
		.intro-btn
			margin-top 10px
			padding 0
</style>
