<template>
	<view class="talents">
		<view class="filters">
			<view class="sort">
				<view 
					class="mark"
					:style="{
						transform: `translateX(${activeIndex*65}px)`
					}">
				</view>
				<view
					:class="activeIndex === 0 ? 'active' : ''" 
					class="item" 
					@click="activeIndex=0">
					综合
				</view>
				<view 
					:class="activeIndex === 1 ? 'active' : ''" 
					class="item" 
					@click="activeIndex=1">
					等级
				</view>
				<view 
					:class="activeIndex === 2 ? 'active' : ''" 
					class="item" 
					@click="activeIndex=2">
					筛选<text class="iconfont icon-shaixuan"></text>
				</view>
			</view>
			<view class="search">
				<text class="iconfont icon-sousuo"></text>
				<input type="text" placeholder="搜索用户" />
			</view>
		</view>
		<!-- 用户卡片 -->
		<view class="user-cards">
			<navigator 
				class="card"
				v-for="(user,i) in users"
				:key="i"
				:url="'../../Self/UserHome?userId=' + user.userId">
				<image class="left" :src="user.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></image>
				<view class="right">
					<text class="name strong">{{user.nickname}}</text>
					<view class="level">
						<image
							class="level-img"
							:src="user.levelSrc" 
							mode="widthFix">
						</image>
						<text class="label">{{user.levelLabel}}</text>
					</view>
					<view class="tags">
						<view 
							class="tag"
							v-for="(tag,index) in user.specialtyTags"
							:key="index">
							{{tag}}
						</view>
					</view>
					<view class="footer">
						<view class="experience">
							<view 
								:style="{
									transform: `translateY(-${user.projectIndex*20}px)`
								}" 
								class="item"
								v-for="(project,index) in user.projectNames"
								:key="index">
								{{project}}
							</view>
							<view class="item" v-if="user.projectNames.length === 0">无参与项目</view>
						</view>
						<view class="love">
							<text class="iconfont icon-collection"></text>
							<text>{{user.totalReceivedCollection}}</text>
						</view>
					</view>
				</view>
			</navigator>
		</view>
		<view style="color: var(--gray2);" class="center small">{{ is_showAll ? "已加载全部" : "" }}</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getTalents } from "@/static/request/api_forum.js"
var userLevels = getApp().globalData.arr_userLevel
var data = []
export default {
	data() {
		return {
			activeIndex: 0,
			users: [],
			is_showAll: false,
			page: 0,
			pageSize: 10
		};
	},
	watch: {
		activeIndex: function(val){
			this.getTalentsList()
		}
	},
	created() {
		// console.log(getApp().globalData);
		/* 定时滚动卡片中项目情况 */
		setInterval(() => {
			this.users.forEach((user,i) => {
				let index = user.projectIndex
				this.users[i].projectIndex = index < user.projectNames.length-1 ? index+1 : 0
			})
		},3000)
		this.getTalentsList()
	},
	methods: {
		getTalentsList()
		{
			// this.gLoading(this, true)
			getTalents()
			.then(res => {
				data = res.data
				this.loadTalent(true)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		},
		loadTalent(init=false)
		{
			if(init){
				this.users = []
				this.page = 0
			}
			if(!this.is_showAll){
				for(let i=this.page*this.pageSize;i<this.page*this.pageSize+10;i++){
					if(!data[i]){
						this.is_showAll = true
						return
					}
					const item = {...data[i]}
					item.levelSrc = userLevels[0].src
					item.levelLabel = userLevels[0].label
					// 判断用户等级
					for(let i=userLevels.length-1;i>=0;i--){
						if(item.totalContribPoint > userLevels[i].totalContribPoint){
							item.levelSrc = userLevels[i].src
							item.levelLabel = userLevels[i].label
							break
						}
					}
					// 用户标签
					if(!item.specialtyTags){
						item.specialtyTags = [""]
					}
					else{
						item.specialtyTags = item.specialtyTags.split(",")
					}
					// 项目标签
					item.projectIndex = 0
					this.users.push(item)
				}
				this.page++
				this.gLoading(this,false)
			}
			// console.log(this.users);
		}
	}
}
</script>

<style lang="stylus" scoped>
.talents
	padding 10px 0 80px
	.filters
		padding 5px 10px
		display flex
		align-items flex-end
		.sort
			position relative
			display flex
			align-items flex-end
			justify-content space-between
			.mark
				position absolute
				height 100%
				width 33%
				background-color rgba(255,188,110,0.3)
				border-radius 8px
				transition .3s
			.item
				width 65px
				padding 5px 0
				text-align center
				border 2px solid transparent
				.iconfont
					font-size 22rpx
				&.active
					color var(--black)
		.search
			flex 1
			margin-left 5px
			position relative
			display flex
			align-items center
			.iconfont
				position absolute
				margin-left 5px
				color var(--origin2)
			input
				width 120px
				border-radius 22px
				padding-left 30px
				background-color #FFFFFF
	.user-cards
		padding 5px 10px
		.card
			margin 10px 0
			background-color #FFFFFF
			padding 10px
			border-radius 8px
			display flex
			.left
				flex-shrink 0
				width 50px
				height 50px
				border-radius 8px
			.right
				flex auto
				position relative
				margin-left 10px
				.name
					color var(--black)
				.level
					position absolute
					right 0
					top 0
					color var(--origin1)
					background-color var(--origin4)
					border-radius 22px
					padding 0 5px 0 20px
					display flex
					align-items center
					.level-img
						position absolute
						top 0
						left 0
						width 16px
						height 22px
					text
						font-size 22rpx
				.tags
					padding 15px 0
					display flex
					align-items center
					overflow-x auto
					.tag
						flex-shrink 0
						margin-right 5px
						padding 0 8px
						border-radius 22px
						background-color var(--origin1)
						color #FFFFFF
						font-size 18rpx
					&::-webkit-scrollbar
						display: none
				.footer
					display flex
					.experience
						flex auto
						height 20px
						background-color var(--origin3)
						border-radius 22px
						padding 0 5px
						overflow hidden
						.item
							height 20px
							font-size 22rpx
							line-height 20px
							text-overflow ellipsis
							overflow hidden
							transition .5s ease-in-out
					.love
						margin-left 5px
						display flex
						align-items center
						color #e86452
						font-size 20rpx
						.iconfont
							margin-right 2px
							font-size 22rpx
</style>
