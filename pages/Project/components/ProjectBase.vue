<template>
	<view class="content">
		<view class="head">
			<view class="h3">基本信息</view>
			<view v-if="avatarUrl" class="avatar">
				<image :src="avatarUrl" mode="widthFix" @click="showMenu('avatarUrl')"></image>
			</view>
			<view v-else class="addAvatar" @click="chooseImg('avatarUrl')">
				<text class="add">+</text>
				<text>添加头像</text>
			</view>
		</view>
		<!-- 是否为所有者 -->
		<!-- <view class="is_owner">
			<SelfRadio
				label="是否为项目所有者"
				:radio="[
					{text:'是',value:true},
					{text:'否',value:false}
				]"
				v-model="is_owner">
			</SelfRadio>
		</view> -->
		<SelfInput 
			label="题目" 
			circle 
			v-model="name">
		</SelfInput>
		<!-- 标签 -->
		<SelfInput label="标签" circle remark="(注: 不同标签用空格隔开)" v-model="tags"></SelfInput>
		<view class="tags">
			<view class="tag" v-for="(tag, index) in tagList" :key="index">{{ tag }}</view>
		</view>
		<!-- 获奖情况 -->
		<view class="set-prize">
			<view class="title">获奖情况:</view>
			<SelfInput 
				label="比赛名称" 
				circle 
				search
				:arr_search="Matches" 
				v-model="compName"
				@input="awardLevel=''">
			</SelfInput>
			<SelfPicker
				v-if="compName" 
				label="获奖等级" 
				contentWidth="300rpx" 
				circle
				:arr_range="prizeLevels"
				v-model="awardLevel">
			</SelfPicker>
			<SelfPicker
				v-if="compName" 
				label="获奖日期" 
				contentWidth="300rpx" 
				placeholder="2020-8"
				circle
				date
				v-model="awardTime">
			</SelfPicker>
			<view v-if="compName">
				<view class="title">
					获奖证明:
				</view>
				<view class="prove">
					<image v-if="awardProveUrl" :src="awardProveUrl" mode="widthFix" @click="showMenu('awardProveUrl')"></image>
					<text v-else class="iconfont icon-tianjia" @click="chooseImg('awardProveUrl')"></text>
				</view>
			</view>
		</view>
		<!-- md编辑 -->
		<view class="description">
			<view class="title">自定义描述</view>
			<view class="intro" v-if="intro" v-html="intro"></view>
			<button @click="startEdit">编辑</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		const Matches = getApp().globalData.Competitions.map(item => item.name)
		return {
			is_owner: true,
			name: '', // 项目名称
			avatarUrl: '', // 团队头像
			tags: '', // 标签
			compName: '', // 比赛名称
			awardLevel: '', // 获奖等级
			awardTime: '', // 获奖时间
			awardProveUrl: '', // 获奖证明
			intro: '', // 描述
			Matches, // 比赛名称
			is_edit: false
		};
	},
	computed: {
		/*
			监听输入标签内容改变，根据空格分隔
			@parms tags: String,标签输入框内容
			@return tagArray: Array,标签数组
			time: 2020/11/9
		*/
		tagList() {
			return this.tags.split(' ').filter(tag => tag !== '');
		},
		/* 根据比赛名称计算获奖等级 */
		prizeLevels() {
			let Levels = getApp().globalData.prizeLevels
			const match = getApp().globalData.Competitions.find(item => item.name === this.compName)
			// console.log(getApp().globalData.Competitions);
			if(match){
				Levels = Levels.filter(item => {
					if(String(item.value).indexOf(String(match.level)) === 0){
						return true
					}
				})
			}
			return Levels
		}
	},
	methods: {
		/* 选择图片 */
		chooseImg(item) 
		{
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: img => {
					this[item] = img.tempFilePaths[0];
				}
			});
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
				itemList: ['预览图片', '修改图片', '删除图片'],
				success: res => {
					/* 预览图片 */
					if (res.tapIndex === 0) {
						uni.previewImage({
							urls: [this[item]]
						});
					} else if (res.tapIndex === 1) {
					/* 修改图片 */
						this.chooseImg(item);
					} else if (res.tapIndex === 2) {
					/* 删除图片 */
						this.gShowModal('确认删除该证明图片?', () => {
							this[item] = '';
						});
					}
				}
			});
		},
		/* 
			开始编辑内容，设置is_edit为true，并清空全局内容
			@set this.editMD: Boolean
			@set getApp().globalData.gEditContent: String
		*/
		startEdit() 
		{
			this.editMD = true
			getApp().globalData.gEditContent = this.intro
			uni.navigateTo({
				url: "../EditMd/EditMd"
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.head
	display flex
	justify-content space-between
	.avatar,.addAvatar
		position relative
		width 60px
		height 60px
		border-radius 8px
		overflow hidden
		display flex
		flex-direction column
		align-items center
		justify-content center
	.avatar
		background-color var(--origin4)
		image
			width 100%
	.addAvatar
		line-height 1.2
		color var(--origin2)
		font-size 20rpx
		border 2px solid var(--origin1)
		.add
			font-size 50rpx
/* 标签框 */
.title
	margin 5px 0
	font-size 26rpx
	font-weight 700
.tags
	margin-top 15px
	width 100%
	display flex
	flex-wrap wrap
	.tag
		margin 5px 5px 5px 0
		padding 0 10rpx
		border 1px solid var(--origin2)
		border-radius 8px
		font-size 22rpx
/* 获奖情况 */
.set-prize
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
		border-radius 8px
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
.description
	button
		margin-top 10px
		padding 0
	.intro
		*
			white-space pre-wrap
			word-wrap break-word
		padding 2px
		border 2px solid var(--origin2)
		border-radius 8px
</style>
