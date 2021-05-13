<!-- 
	人才市场， 个人 & 团队
 -->
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
				<!-- <view 
					class="item">
					筛选<text class="iconfont icon-shaixuan"></text>
				</view> -->
			</view>
			<view class="search">
				<search-input :placeholder="activeIndex===0 ? '搜索用户' : '搜索团队'"></search-input>
			</view>
		</view>
		<!-- 用户卡片 -->
		<view v-show="activeIndex===0" class="users">
			<navigator
				class="user-card"
				:class="activeIndex === 0 ? 'first' : ''"
				v-for="user in arr_users"
				:key="user.userId"
				:url="`../../Self/UserHome?userId=${user.userId}`">
				<aha-avatar :src="user.avatarUrl" size="50"></aha-avatar>
				<view class="right">
					<text class="name strong">{{user.nickname}}</text>
					<aha-user-level
						class="level"
						:point="user.totalContribPoint"
						small
						margin="0 3px 3px 0">
					</aha-user-level>
					<aha-tags class="tags" :tags="user.specialtyTags"></aha-tags>
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
		<view  v-show="activeIndex===1" class="teams">
			<navigator 
				v-for="team in arr_teams"
				:key="team.id"
				:url="`/pages/Interflow/Team/TeamDetail?id=${team.id}`">
				<team-card :team="team"></team-card>
			</navigator>
		</view>
		<view class="remark center small">{{ loadStatus }}</view>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getTalents } from "@/static/request/api_forum.js"
import { getTeams } from "@/static/request/api_team.js"
import TeamCard from "./Team/components/TeamCard.vue"
export default {
	components: {
		"team-card": TeamCard
	},
	data() {
		return {
			activeIndex: 0,
			obj_userLoadInfo: {
				pageNum: 1,
				pageSize: 10,
				is_loadAll: false
			},
			arr_users: [],
			obj_teamLoadInfo: {
				pageNum: 1,
				pageSize: 10,
				is_loadAll: false
			},
			arr_teams: [],
		};
	},
	computed: {
		/**
		 * 加载状态，根据activeIndex和两个is_loadAll判断
		 */
		loadStatus() {
			if(this.activeIndex === 0 && this.obj_userLoadInfo.is_loadAll) {
				return "已加载全部"
			}
			if(this.activeIndex === 1 && this.obj_teamLoadInfo.is_loadAll) {
				return "已加载全部"
			}
			return ""
		}
	},
	mounted() {
		/* 定时滚动卡片中项目情况 */
		setInterval(() => {
			this.arr_users.forEach((user,i) => {
				let index = user.projectIndex
				this.arr_users[i].projectIndex = index < user.projectInfo.length-1 ? index+1 : 0
			})
		},3000)
		this.gLoading(this,true)
		this.loadTalent()
		this.loadTeams()
	},
	methods: {
		/**
		 * 触底加载
		 */
		reachBottom()
		{
			switch(this.activeIndex) {
				case 0:
					this.loadTalent()
					break
				case 1:
					this.loadTeams()
					break
			}
		},
		/**
		 * 加载用户
		 */
		loadTalent()
		{
			if(this.obj_userLoadInfo.is_loadAll){
				return
			}
			getTalents({
				pageNum: this.obj_userLoadInfo.pageNum,
				pageSize: this.obj_userLoadInfo.pageSize
			})
			.then(res => {
				res.data.forEach(user => {
					/* 判断是否有用户标签，并进行分割 */
					if(!user.specialtyTags){
						user.specialtyTags = [""]
					}
					else{
						user.specialtyTags = user.specialtyTags.split(",")
					}
					/* 用户默认项目下标 */
					user.projectIndex = 0
					// 项目情况,获取获奖名次
					for(let j=0;j<user.projectInfo.length;j++){
						user.projectInfo[j].awardLabel = getApp().globalData.garr_prizeLevels.find(prize => prize.value === user.projectInfo[j].awardLevel).label
					}
					this.arr_users.push(user)
				})
				/* 判断是否加载全部 */
				if(res.data.length < this.obj_userLoadInfo.pageSize) {
					this.obj_userLoadInfo.is_loadAll = true
				}
				else {
					this.obj_userLoadInfo.pageNum++
				}
				console.log("个人: ",this.arr_users.length);
			})
			.finally(() => this.gLoading(this,false))
		},
		/**
		 * 加载团队
		 */
		loadTeams()
		{
			if(this.obj_teamLoadInfo.is_loadAll){
				return
			}
			getTeams({
				pageNum: this.obj_teamLoadInfo.pageNum,
				pageSize: this.obj_teamLoadInfo.pageSize
			})
			.then(res => {
				this.arr_teams = this.arr_teams.concat(res.data)
				/* 判断是否加载全部 */
				if(res.data.length < this.obj_teamLoadInfo.pageSize) {
					this.obj_teamLoadInfo.is_loadAll = true
				}
				else {
					this.obj_teamLoadInfo.pageNum++
				}
				console.log("团队: ",res.data.length);
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.talents
	margin 10px
	.filters
		padding 0 10px
		display flex
		align-items flex-end
		.sort
			position relative
			display flex
			align-items flex-end
			.item
				width 60px
				padding 5px 0
				text-align center
				border-top-left-radius 16px
				border-top-right-radius 16px
				.iconfont
					font-size 22rpx
				&.active
					font-weight 700
					color var(--origin2)
					background-color #FFFFFF
		.search
			margin-left 10px
			margin-bottom 5px
			flex 1
	.users
		padding 0 10px
		/* 用户卡片 */
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
	.teams
		padding 0 10px
		navigator
			display block
	.remark
		color var(--gray2)
</style>
