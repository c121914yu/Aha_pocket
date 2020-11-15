<template>
	<view class="content">
		<div class="head">
			<view class="h3">基本信息</view>
			<view 
				v-if="!avatarUrl" 
				class="addAvatar"
				@click="chooseImg('avatarUrl')">
				<text class="add">+</text>
				<text>添加头像</text>
			</view>
			<image 
				v-else 
				:src="avatarUrl"
				@click="showMenu('avatarUrl')">
			</image>
		</div>
		<inputInfo 
			title="标题"
			contentWidth="80%"
			v-model="name">
		</inputInfo>
		<inputInfo
			title="完成程度"
			type="select"
			contentWidth="350rpx"
			:range="finishRates"
			v-model="finishRate">
		</inputInfo>
		<inputInfo
			title="资源类型"
			type="select"
			contentWidth="350rpx"
			:range="AccessoriesClassify"
			v-model="classify">
		</inputInfo>
		<inputInfo
			title="作者名称"
			contentWidth="200rpx"
			v-model="authorName">
		</inputInfo>
		<inputInfo
			title="联系方式"
			placeholder="选填"
			v-model="authorContact">
		</inputInfo>
		<!-- 标签 -->
		<inputInfo
			title="标签"
			contentWidth="80%"
			remark="(注: 不同标签用空格隔开)"
			v-model="tagText">
		</inputInfo>
		<view class="tags">
			<view 
				class="tag"
				v-for="(tag,index) in tags"
				:key="index">
				{{tag}}
			</view>
		</view>
		<!-- 获奖情况 -->
		<view class="input-info set-prize">
			<view class="h4">获奖情况: </view>
			<inputInfo
				title="比赛名称"
				contentWidth="70%"
				v-model="awardName">
			</inputInfo>
			<inputInfo
				title="比赛分类"
				type="select"
				contentWidth="400rpx"
				:range="MatchName"
				v-model="compId">
			</inputInfo>
			<inputInfo
				title="获奖等级"
				type="select"
				:range="prizeGrades"
				v-model="awardLevel">
			</inputInfo>
			<view class="date">
				<text>获奖日期: </text>
				<DataPicker
					placeholder="2020-9"
					v-model="awardTime">
				</DataPicker>
			</view>
			<view class="title">获奖证明: <text>长按可删除证明</text></view>
			<view class="prove">
				<image 
					v-if="awardUrl"
					:src="awardUrl"
					mode="widthFix"
					@click="showMenu('awardUrl')">
				</image>
				<text 
					v-else 
					class="iconfont icon-tianjia" 
					@click="chooseImg('awardUrl')">
				</text>
			</view>
		</view>
		<!-- md编辑 -->
		<view class="input-info">
			<view class="h4">自定义描述: </view>
			<button @click="editMD=true">编辑</button>
			<view v-if="editMD" class="editMD">
				<MdEdit 
					:delta="intro"
					@editOk="editOk">
				</MdEdit>
			</view>
		</view>
	</view>
</template>

<script>
import inputInfo from "./inputInfo.vue"
export default {
	data() {
		const AccessoriesClassify = getApp().globalData.AccessoriesClassify
		const Matches = getApp().globalData.Matches
		const prizeGrades = getApp().globalData.prizeGrades
		return {
			name: "", // 项目名称
			avatarUrl: "", // 团队头像
			authorName: "", // 作者名称
			authorContact: "", // 作者联系方式
			finishRate: "", // 完成度
			classify: "",
			tagText: "",
			compId: "1",
			awardName: "",
			awardLevel: "",
			awardTime: "",
      awardUrl: "",
			intro: "",
			finishRates: ["100%","80%-100%","50%-80%","0%-50%"], // 完成度数组
			AccessoriesClassify, // 资源类型
			Matches, // 比赛名称
			prizeGrades, // 获奖等级
			editMD: false
		}
	},
	computed: {
		/*
			desc: 监听输入标签内容改变，根据空格分隔
			input: 
						tagText: String,标签输入框内容
			return: 
						tagArray: Array,标签数组
			time: 2020/11/9
		*/
		tags()
		{
			return this.tagText.split(" ").filter(tag => tag !== "")
		},
	},
	methods: {
		/* 选择图片 */
		chooseImg(item)
		{
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success:  (img) => {
					this[item] = img.tempFilePaths[0]
				}
			})
		},
		/* 
			name: 进入操作菜单
			desc: 点击图片进入操作菜单，提示修改图片或者预览图片
			input: 输入一个变量的字段
			time: 2020/11/12
		*/
	  showMenu(item)
	  {
			/* 进入操作菜单 */
			uni.showActionSheet({
				itemList: ['预览图片', '修改图片','删除图片'],
				success: (res) => {
					/* 预览图片 */
					if(res.tapIndex === 0){
						uni.previewImage({
							urls: [this[item]]
						})
					}
					/* 修改图片 */
					else if(res.tapIndex === 1){
						this.chooseImg(item)
					}
					/* 删除图片 */
					else if(res.tapIndex === 2){
						this.gShowModal("确认删除该证明图片?",() => {
							this[item] = ""
						})
					}
				}
			})
	  },
		/* 
			name: 编辑描述完成
			desc: 编辑描述完成，将值赋予description,并关闭描述填写状态
			change:
						this.description: Object,资源自定义描述
		*/
		editOk(e)
		{
			this.intro = e.delta
			this.editMD = false
		}
	},
	components: {
		inputInfo
	}
}
</script>

<style lang="stylus" scoped>
.head
	margin-bottom 10px
	display flex
	justify-content space-between
	.addAvatar, image
		width 50px
		height 50px
		border-radius 5px
		border 2px solid var(--origin2)
	image
		border-color transparent
	.addAvatar
		color var(--origin2)
		font-size 20rpx
		display flex
		flex-direction column
		align-items center
		justify-content center
		.add
			font-size 50rpx
/* 标签框 */
.tags
	width 100%
	display flex
	flex-wrap wrap
	.tag
		margin 0 5px 5px 0
		padding 0 10rpx
		border 1px solid var(--origin2)
		border-radius 20rpx
/* 获奖情况 */
.set-prize
	.title
		margin-top 10px
		color var(--origin2)
		font-size 24rpx
	/* 日期 */
	.date
		display flex
		align-items center
		text
			margin-right 10px
			color var(--origin2)
			font-size 24rpx
	/* 证明材料 */
	.prove
		margin 5px auto
		width 95%
		min-height 100px
		background-color var(--origin3)
		border-radius 20px
		display flex
		align-items center
		justify-content center
		overflow hidden
		.iconfont
			color var(--origin1)
			font-size 40rpx
		image
			width 100%
	.btn
		display flex
		justify-content space-between
		button
			width 33%
			&.close
				background-color var(--gray2)
				color var(--white2)
/* markdown编辑 */
.editMD
	z-index 10
	position absolute
	top 0
	left 0
	right 0
	bottom 0
	background-color #FFFFFF
</style>
