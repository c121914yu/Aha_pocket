<!-- 
	编辑项目的基本信息
	author yjl
 -->
<template>
	<view class="project-base content">
		<view class="head">
			<view class="left">
				<view class="h3">基本信息</view>
				<!-- 匿名资源选项 -->
				<view v-if="is_created" class="anonymity-switch">
					是否为匿名资源
					<switch 
					  class="switch"
					  :checked="isAnonymous" 
					  color="#f8b86b" 
					  @change="isAnonymous=$event.target.value"/>
				</view>
				<!-- 匿名资源提醒 -->
				<view v-else class="anonymity-switch">
					该项目为匿名项目
				</view>
			</view>
			<!-- 项目头像选择 -->
			<view v-if="avatarUrl.val" class="avatar">
				<image 
					class="img"
					:src="avatarUrl.val" 
					mode="aspectFit"
					@click="imgMenu('avatarUrl')">
				</image>
			</view>
			<view v-else class="addAvatar" @click="chooseImg('avatarUrl')">
				<text class="add">+</text>
				<text>添加头像</text>
			</view>
		</view>		
		<aha-input 
			label="标题" 
			circle 
			v-model="name.val">
		</aha-input>
		<!-- 标签 -->
		<aha-input 
			label="标签" 
			circle 
			remark="(注: 不同标签用空格隔开)" 
			v-model="tags">
		</aha-input>
		<view class="tags">
			<aha-tags
				bgColor="transparent"
				Color="var(--font-dark)"
				border="var(--border2)"
				:tags="tagList">
			</aha-tags>
		</view>
		<!-- 获奖情况 -->
		<view class="set-prize">
			<view class="h3">获奖情况:</view>
			<aha-input 
				label="比赛名称" 
				circle 
				search
				:arr_search="arr_matches" 
				v-model="compName.val">
			</aha-input>
			<aha-picker-label
				v-if="compName.val" 
				label="获奖等级" 
				contentWidth="300rpx" 
				circle
				:arr_range="prizeLevels"
				v-model="awardLevel.val">
			</aha-picker-label>
			<aha-picker-label
				v-if="compName.val" 
				label="获奖日期" 
				contentWidth="300rpx" 
				placeholder="获奖日期"
				:endTime="gGetToday()"
				circle
				date
				v-model="awardTime.val">
			</aha-picker-label>
			<view v-if="compName.val && !isAnonymous">
				<view class="title">
					获奖证明:
				</view>
				<view class="prove">
					<image 
						v-if="awardProveUrl.val" 
						class="img"
						:src="awardProveUrl.val" 
						mode="aspectFit"
						@click="imgMenu('awardProveUrl')">
					</image>
					<text 
						v-else 
						class="iconfont icon-tianjia" 
						@click="chooseImg('awardProveUrl')">
					</text>
				</view>
			</view>
		</view>
		<!-- md编辑 -->
		<view class="intro">
			<view class="title">
				项目介绍:
				<text class="edit-intro" @click="onclickEditIntro">编辑</text>
			</view>
			<view class="rich-text">
				<rich-text v-if="intro" :nodes="intro"></rich-text>
				<text v-else @click="onclickEditIntro">点击编辑项目介绍</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		// 是否属于创建阶段
		is_created: {
			type: Boolean,
			default: false
		}
	},
	data() {
		const arr_matches = getApp().globalData.garr_competitions.map(item => item.name)
		return {
			isAnonymous: false,
			arr_matches, // 比赛名称
			name: { // 项目名称
				val: "",
				errMsg: "请输入项目名"
			}, 
			avatarUrl: { // 团队头像
				val: ""
			},
			tags: "", // 标签
			compName: { // 比赛名称
				val: "",
				errMsg: "请输入比赛名"
			}, 
			awardLevel: { // 获奖等级
				val: null,
				errMsg: "请选择获奖等级"
			},
			awardTime: { // 获奖时间
				val: "",
				errMsg: "请选择获奖时间"
			},
			awardProveUrl: { // 获奖证明
				val: "",
				errMsg: "请选择获奖证明",
			},
			intro: '', // 描述
		}
	},
	computed: {
	   /**
		* 监听输入标签内容改变，根据空格分隔
		*/
		tagList() {
			return this.tags.split(' ').filter(tag => tag);
		},
		/**
		 * 根据比赛名称计算获奖等级
		 */
		prizeLevels() {
			const match = getApp().globalData.garr_competitions.find(item => item.name === this.compName.val)
			if(match){
				const start = (5-match.level)*3
				return getApp().globalData.garr_prizeLevels.slice(start,start+3)
			}
			return getApp().globalData.garr_prizeLevels
		}
	},
	methods: {
		/**
		 * 初始化数据
		 */
		initData(project)
		{
			/* 获取获奖等级名称 */
			this.isAnonymous = project.isAnonymous
			this.name.val = project.name
			this.avatarUrl.val = project.avatarUrl
			this.tags = project.tags
			this.compName.val = project.compName
			this.awardLevel.val = getApp().globalData.garr_prizeLevels.find(item => item.value === project.awardLevel)
			this.awardTime.val = project.awardTime
			this.awardProveUrl.val = project.awardProveUrl
			this.intro = project.intro
		},
		/**
		 * 选择图片
		 * @param { String } key 对应选择哪个图片
		 */
		chooseImg(key) 
		{
			this.gChooseImage(1,true)
			.then(res => {
				this[key].val = res[0]
			})
		},
	    /**
		 * 图片操作菜单,提示预览，修改，删除图片
		 * @param { String } key 对应选择哪个图片
		 */
		imgMenu(key) 
		{
			this.gMenuPicker(["预览图片", "修改图片", "删除图片"])
			.then(res => {
				switch(res) {
					case "预览图片":
						this.gReadImage([this[key].val])
						break
					case "修改图片":
						this.chooseImg(key)
						break
					case "删除图片":
						this.gShowModal("确认删除该证明图片?", () => {
							this[key].val = ""
						})
						break
				}
			})
		},
	   /**
		* 点击编辑项目介绍，进入编辑页
		*/
		onclickEditIntro() 
		{
			getApp().globalData.gEditContent = this.intro
			uni.navigateTo({
				url: "../EditMd/EditMd"
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.project-base
	.h3
		color var(--origin1)
	.head
		display flex
		justify-content space-between
		.anonymity-switch
			padding 10px 0
			color var(--origin1)
			.switch
				transform scale(0.75)
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
			.img
				width 100%
		.addAvatar
			line-height 1.2
			color var(--origin2)
			font-size 20rpx
			border 2px solid var(--origin1)
			.add
				font-size 50rpx
	/* 标签框 */
	.tags
		margin 20px 0 5px
	/* 获奖情况 */
	.set-prize
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
				font-size 50rpx
			.img
				width 100%
	/* markdown编辑 */
	.intro
		.edit-intro
			margin-left 5px
			font-weight 30rpx
			font-weight 700
			color var(--origin1)
		.rich-text
			margin-top 5px
			padding 2px
			border 2px solid var(--origin2)
			border-radius 8px
</style>
