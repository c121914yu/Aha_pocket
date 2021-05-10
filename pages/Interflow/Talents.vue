<template>
	<view class="talents">
		<view class="filters">
			<view class="sort">
				<view
					:class="activeIndex === 0 ? 'active' : ''" 
					class="item" 
					@click="activeIndex=0">
					个人
				</view>
				<view 
					:class="activeIndex === 1 ? 'active' : ''" 
					class="item" 
					@click="activeIndex=1">
					团队
				</view>
				<view 
					class="item">
					筛选<text class="iconfont icon-shaixuan"></text>
				</view>
			</view>
			<SearchInput style="margin-bottom: 5px;" placeholder="搜索用户"></SearchInput>
		</view>
		<!-- 用户卡片 -->
		<view v-if="activeIndex===0" class="cards">
			<navigator 
				class="user-card"
				:class="activeIndex === 0 ? 'first' : ''"
				v-for="(user,i) in users"
				:key="i"
				:url="'../../Self/UserHome?userId=' + user.userId">
				<Avatar :src="user.avatarUrl" size="50"></Avatar>
				<view class="right">
					<text class="name strong">{{user.nickname}}</text>
					<UserLevel
						class="level"
						:point="user.totalContribPoint"
						small
						margin="0 3px 3px 0">
					</UserLevel>
					<Tags class="tags" :tags="user.specialtyTags"></Tags>
					<view class="footer">
						<view class="experience">
							<view 
								:style="{
									transform: `translateY(-${user.projectIndex*23}px)`
								}" 
								class="item"
								v-for="(project,index) in user.projectInfo"
								:key="index">
								{{project.name}} - {{project.awardLabel}}
							</view>
							<view class="item" v-if="user.projectInfo.length === 0">无参与项目</view>
						</view>
						<view class="love">
							<text class="iconfont icon-collection"></text>
							<text>{{user.totalReceivedCollection}}</text>
						</view>
					</view>
				</view>
			</navigator>
		</view>
		<!-- 团队卡片 -->
		<view class="team">
			
		</view>
		<view style="color: var(--gray2);" class="center small">{{ is_showAll ? "已加载全部" : "" }}</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getTalents } from "@/static/request/api_forum.js"
import { getTeams } from "@/static/request/api_team.js"
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
		activeIndex: "getList"
	},
	created() {
		/* 定时滚动卡片中项目情况 */
		setInterval(() => {
			this.users.forEach((user,i) => {
				let index = user.projectIndex
				this.users[i].projectIndex = index < user.projectInfo.length-1 ? index+1 : 0
			})
		},3000)
		this.getList()
	},
	methods: {
		getList()
		{
			this.gLoading(this, true)
			let p
			if(this.activeIndex === 0){
				p = getTalents()
						
			}
			else if(this.activeIndex === 1){
				p = getTeams()
			}
			p.then(res => {
				data = res.data
				console.log(data);
				this.loadTalent(true)
			})
			.finally(() => this.gLoading(this, false))
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
					// 用户标签
					if(!item.specialtyTags){
						item.specialtyTags = [""]
					}
					else{
						item.specialtyTags = item.specialtyTags.split(",")
					}
					// 项目标签
					item.projectIndex = 0
					// 项目情况
					for(let j=0;j<item.projectInfo.length;j++){
						item.projectInfo[j].awardLabel = getApp().globalData.garr_prizeLevels.find(prize => prize.value === item.projectInfo[j].awardLevel).label
					}
					this.users.push(item)
				}
				this.page++
			}
			this.gLoading(this,false)
			// console.log(this.users);
		}
	}
}
</script>

<style lang="stylus" scoped>
.talents
	padding 10px 0 80px
	.filters
		padding 0 10px
		display flex
		align-items flex-end
		.sort
			position relative
			display flex
			align-items flex-end
			justify-content space-between
			.item
				width 60px
				padding 5px 0
				text-align center
				border-top-left-radius 16px
				border-top-right-radius 16px
				.iconfont
					font-size 22rpx
				&.active
					color var(--origin2)
					background-color #FFFFFF
	.cards
		padding 0 10px
		.user-card
			margin-bottom 10px
			background-color #FFFFFF
			padding 10px
			border-radius 8px
			display flex
			&.first:first-of-type
				border-top-left-radius 0
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
				.tags
					padding 5px 0
					display flex
					flex-wrap nowrap
					overflow-x auto
					&::-webkit-scrollbar
						display: none
				.footer
					display flex
					.experience
						flex auto
						height 18px
						overflow hidden
						display flex
						flex-direction column
						align-items flex-start
						.item
							flex-shrink 0
							margin-bottom 5px
							height 18px
							line-height 18px
							font-size 20rpx
							padding 0 10px
							border-radius 22px
							background-color var(--origin4)
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
