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
				v-for="user in arr_users"
				:key="user.userId"
				:url="`../../Self/UserHome?userId=${user.userId}`">
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
var userLevels = getApp().globalData.garr_userLevel
export default {
	data() {
		return {
			activeIndex: 0,
			pageNum: 1,
			pageSize: 20,
			arr_users: [],
			arr_teams: [],
			is_loadAll: false
		};
	},
	watch: {
		// activeIndex: "loadList"
	},
	created() {
		/* 定时滚动卡片中项目情况 */
		setInterval(() => {
			this.arr_users.forEach((user,i) => {
				let index = user.projectIndex
				this.arr_users[i].projectIndex = index < user.projectInfo.length-1 ? index+1 : 0
			})
		},3000)
		this.loadTalent(true,true)
	},
	methods: {
		/**
		 * 触底加载
		 */
		rechBottom()
		{
			console.log("触底加载");
		},
		/**
		 * 加载用户
		 * @param {Boolean}  init 是否初始化
		 * @param {Boolean}  loading 是否加载动画
		 */
		loadTalent(init=false,loading=false)
		{
			this.gLoading(this,loading)
			if(init) {
				this.pageNum = 1
			}
			getTalents()
			.then(res => {
				if(init){
					this.arr_users = []
				}
				res.data.forEach(user => {
					// 用户标签
					if(!user.specialtyTags){
						user.specialtyTags = [""]
					}
					else{
						user.specialtyTags = user.specialtyTags.split(",")
					}
					// 项目标签
					user.projectIndex = 0
					// 项目情况
					for(let j=0;j<user.projectInfo.length;j++){
						user.projectInfo[j].awardLabel = getApp().globalData.garr_prizeLevels.find(prize => prize.value === user.projectInfo[j].awardLevel).label
					}
					this.arr_users.push(user)
				})
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 加载团队
		 */
		loadTeams(init=false,loading=false)
		{
			
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
