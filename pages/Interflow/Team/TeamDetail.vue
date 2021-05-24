<!-- 
	团队详细
	author yjl
 -->
<template>
	<view class="team-info">
		<view class="header">
			<view class="first">
				<view class="left">
					<aha-avatar :src="avatar || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"></aha-avatar>
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
					<aha-tags :tags="tag | splitTags"></aha-tags>
					<view class="user-relation">
						<navigator 
							class="consult" 
							:url="`../../Self/Inform/Inform_send?id=${captainId}`">
							<text class="iconfont icon-xiazai"></text>
							咨询
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<!-- 导航 -->
		<top-navs 
			:navs="arr_navs"
			color="var(--black)"
			backgroundColor="#ffffff"
			@navChange="currentNavs=$event.value">
		</top-navs>
		<!-- 介绍-->
		<view v-if="currentNavs===0" class="card" @click="gReadRichText(intro,name)">
			<rich-text :nodes="intro || '暂无团队介绍'"></rich-text>
		</view>
		<!-- 成就 -->
		<view v-if="currentNavs===1" class="card">
			<time-tracks :tracks="teamTracks"></time-tracks>
		</view>
		<!-- 成员 -->
		<view v-if="currentNavs===2" class="card">
			<team-member 
				v-if="arr_members.length>0" 
				:captainId="captainId" 
				:arr_members="arr_members"
				padding="10px"
				@click="onclickMember">
			</team-member>
		</view>
		<!-- 招募 -->
		<view v-if="currentNavs===3" class="card">
			<view v-if="recruitState===0" class="center">未发布招募内容</view>
			<rich-text :nodes="recruitContent" @click="gReadRichText(recruitContent,name)"></rich-text>
		</view>
		<!-- 申请加入弹窗 -->
		<apply-join 
			v-if="is_applying"
			:teamId="id"
			@close="is_applying=false"
			@submitApply="submitApply">
		</apply-join>
		<!-- 加载动画 -->
		<load-animation ref="loading"></load-animation>
	</view>
</template>

<script>
import { getTeam,getMyApply } from '@/static/request/api_team.js'
import { postMessage } from "@/static/request/api_userInfo.js"
import TeamMember from "./components/TeamMember.vue"
import ApplyJoin from "./components/ApplyJoin.vue"
export default {
	components: {
		"team-member": TeamMember,
		"apply-join": ApplyJoin,
	},
	data() {
		return {
			arr_navs: [
				{label: "介绍",value: 0},
				{label: "成就",value: 1},
				{label: "成员",value: 2},
				{label: "招募",value: 3},
			],
			currentNavs: 0,
			id: 0,
			avatar: "",
			captainId: "",
			createTime: "",
			name: "",
			school: "",
			tag: "",
			intro: "",
			arr_members: [],
			recruitState: 0, // 招募状态
			recruitContent: "",
			teamTracks: [],
			myApply: null,
			is_applying: false, // 是否展示申请加入弹窗
		}
	},
	computed: {
		/**
		 * 判断是否已经在团队中
		 */
		applyText() {
			for(let i=0;i<this.arr_members.length;i++){
				const member = this.arr_members[i]
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
		this.gLoading(this, true)
		this.id = Number(e.id)
		getTeam(this.id)
		.then(res => {
			console.log(res.data)
			if(!res.data){
				this.gBackPage("团队无效")
				return
			}
			/* 赋值 */
			this.avatar = res.data.avatar
			this.captainId = res.data.captainId
			this.createTime = this.gformatDate(res.data.createTime,true)
			this.name = res.data.name
			this.school = res.data.school
			this.intro = res.data.intro
			this.tag = res.data.tag
			this.arr_members = res.data.members
			this.recruitState = res.data.recruitState
			this.recruitContent = res.data.recruitContent
			/* 添加一条默认轨迹 */
			this.teamTracks.push({
				date: this.createTime.split(" ")[0],
				trackName: "团队创建",
				result: "Welcome"
			})
		})
		.finally(() => this.gLoading(this, false))
		/* 获取申请加入状态 */
		getMyApply(this.id)
		.then(res => {
			this.myApply = res.data[0]
		})
	},
	methods: {
		/**
		 * 点击申请加入，打开弹窗
		 */
		onclickApply()
		{
			if(!this.myApply){
				this.is_applying = true
			}
		},
		/**
		 * 点击成员，跳转用户主页
		 * @param {Object} member
		 */
		onclickMember(member)
		{
			uni.navigateTo({
				url: `/pages/Self/UserHome?userId=${member.uid}`
			})
		},
		/**
		 * 提交申请加入团队,发送通知给队长，并改变myApply状态
		 * @param {String} applyIntro 申请内容 
		 */
		submitApply(applyIntro)
		{
			this.myApply = true
			this.is_applying = false
			const myname = getApp().globalData.gUserInfo.userInfo.nickname
			postMessage({
				receiverUserId: this.captainId,
				title: "加入团队申请",
				content: `<p>用户<strong>${myname}</strong>申请加入你的团队: <strong>${this.name}</strong>,请及时审批！ 申请介绍: </p><p><br></p><hr><p>${applyIntro || ''}</p>`
			})
		}
	}
}
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
