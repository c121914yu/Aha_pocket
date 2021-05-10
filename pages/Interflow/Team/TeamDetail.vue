<template>
	<view class="team-info">
		<view class="header">
			<view class="first">
				<view class="left">
					<Avatar :src="avatar"></Avatar>
					<button 
						v-if="applyText" 
						class="apply-status" 
						@click="onclickApply">
						{{applyText}}
					</button>
				</view>
				<view class="right">
					<view class="nickname">{{ name }}</view>
					<!-- 学校 -->
					<view class="school">{{school}}</view>
					<Tags :tags="tag | splitTags"></Tags>
					<view class="user-relation">
						<navigator class="consult" :url="'./Inform/Inform_send?id=' + userId">
							<text class="iconfont icon-xiazai"></text>
							咨询
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<!-- 导航 -->
		<TopNavs 
			:navs="navs"
			color="var(--black)"
			backgroundColor="#ffffff"
			@navChange="currentNavs=$event.value">
		</TopNavs>
		<!-- 介绍-->
		<view v-if="currentNavs===0" class="card">
			<view class="rich-text" v-html="intro"></view>
		</view>
		<!-- 成就 -->
		<view v-if="currentNavs===1" class="card">
			<TimeTracks :tracks="teamTracks"></TimeTracks>
		</view>
		<!-- 成员 -->
		<view v-if="currentNavs===2" class="card">
			<team-member 
				v-if="members.length>0" 
				:captainId="captainId" 
				:members="members"
				padding="10px"
				@click="onclickMember">
			</team-member>
		</view>
		<!-- 招募 -->
		<view v-if="currentNavs===3" class="card">
			<view v-if="recruitState===0" class="center">未发布招募内容</view>
			<view class="rich-text" v-html="recruitContent"></view>
		</view>
		<!-- 申请加入弹窗 -->
		<apply-join 
			v-if="isApplying"
			:teamId="id"
			:isApplying.sync="isApplying">
		</apply-join>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getTeam,getMyApply } from '@/static/request/api_team.js'
import TeamMember from "./components/TeamMember.vue"
import ApplyJoin from "./components/ApplyJoin.vue"
export default {
	components: {
		"team-member": TeamMember,
		"apply-join": ApplyJoin,
	},
	data() {
		return {
			navs: [
				{label: "介绍",value: 0},
				{label: "成就",value: 1},
				{label: "成员",value: 2},
				{label: "招募",value: 3},
			],
			currentNavs: 2,
			id: 0,
			avatar: 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png',
			captainId: '',
			createTime: '',
			name: '',
			school: '',
			tag: '',
			intro: '',
			members: [],
			recruitState: 0,
			recruitContent: '',
			teamTracks: [],
			myApply: null,
			isApplying: false, // 是否展示申请加入弹窗
		};
	},
	computed: {
		applyText() {
			/* 查看是否是成员 */
			for(let i=0;i<this.members.length;i++){
				const member = this.members[i]
				if(member.uid === getApp().globalData.gUserInfo.userInfo.userId){
					return ""
				}
			}
			if(this.myApply){
				return "申请加入中"
			}
			return "申请加入"
		}
	},
	onLoad(e) {
		this.gLoading(this, true);
		getTeam(Number(e.id))
		.then(res => {
			console.log(res.data);
			if (!res.data) {
				uni.navigateBack({
					delta: 1,
					complete: () => {
						this.gToastMsg('团队不存在');
					}
				});
				return;
			}
			for (const key in res.data) {
				this[key] = res.data[key];
			}
			this.createTime = this.gformatDate(this.createTime, true);
			this.teamTracks.push({
				date: this.createTime.split(" ")[0],
				trackName: "团队创建",
				result: "Welcome"
			})
		})
		.finally(() => this.gLoading(this, false));
		/* 获取申请加入状态 */
		getMyApply(Number(e.id))
		.then(res => {
			if(res.data.length > 0){
				this.myApply = res.data[0]
			}
		})
	},
	methods: {
		onclickApply()
		{
			if(this.myApply){
				return
			}
			this.isApplying = true
		},
		onclickMember(member)
		{
			uni.navigateTo({
				url: `/pages/Self/UserHome?userId=${member.uid}`
			})
		}
	}
};
</script>

<style lang="stylus" scoped>
.team-info
	min-height 100vh
	padding-bottom 10px
	background-color var(--white1)
	.header
		background-color var(--origin4)
		.first
			padding 15px 0 10px 5%
			display flex
			align-items flex-start
			.apply-status
				background-color var(--origin1)
				padding 0
				line-height 1.6
			.right
				position relative
				padding-right 10px
				margin-left 5%
				flex 1
				.nickname
					color var(--black)
					font-weight 700
					font-size 30rpx
				.school
					margin 10px 0 5px
					padding 0 10px
					border-radius 4px
					background-color var(--origin2)
					color #FFFFFF
					display inline-block
				.consult, .apply-status
					position absolute
					right 0
					top 0px
					padding 0 5px
					border-top-left-radius 22px
					border-bottom-left-radius 22px
					font-size 24rpx
					background-color var(--origin1)
					color #FFFFFF
					display flex
					align-items center
					.iconfont
						margin-right 2px
	.card
		margin 10px auto 
		width 90%
		padding 5px
		border-radius 8px
		background-color #FFFFFF
</style>
