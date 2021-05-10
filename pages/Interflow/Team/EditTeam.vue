<template>
	<view class="edit-team">
		<TopNavs 
			backgroundColor="var(--origin3)"
			:navs="navs"
			@navChange="currentNav=$event.value">
		</TopNavs>
		<!-- 基本信息卡片 -->
		<view v-if="currentNav===0" class="card">
			<view class="h3">团队基本信息</view>
			<view style="margin-bottom: 40px;color: var(--gray2);" class="mini time">{{createTime}}成立</view>
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
				:tags="tagsList"
				Color="var(--black)"
				bgColor="transparent"
				border="var(--border2)">
			</Tags>
			<!-- 团队介绍 -->
			<view class="title strong">团队介绍</view>
			<view class="intro" v-if="intro" v-html="intro"></view>
			<button class="intro-btn" @click="startEdit('intro')">编辑</button>
		</view>
		<!-- 成员卡片 -->
		<view v-if="currentNav===1" class="card member-info">
			<!-- 查看申请加入的成员 -->
			<button v-if="applyMembers.length>0" class="apply-list-btn" @click="isShowApplyList=true">查看申请列表</button>
			<view style="margin-bottom: 5px;" class="h3">团队成员信息</view>
			<SearchInput 
				placeholder="邀请成员ID" 
				border="1px solid var(--origin2)"
				radius=8
				textBgColor="var(--origin2)"
				v-model.number="searchId"
				@search="onclickSearchMember">
			</SearchInput>
			<view class="members">
				<team-member
					v-if="members.length>0" 
					ref="setMember"
					:captainId="captainId" 
					:members="members"
					@click="onclickMember">
				</team-member>
			</view>
		</view>
		<!-- 设置 -->
		<view v-if="currentNav===2" class="card">
			<view class="h3">团队设置</view>
			<SelfRadio
				label="是否招募队员"
				:radio="[
					{label: '招募',value: 1},
					{label: '不招募',value: 0},
				]"
				labelColor="var(--origin1)"
				v-model="recruitState">
			</SelfRadio>
			<!-- 招募文字 -->
			<view v-if="recruitState>0" style="color: var(--origin1);" class="strong">
				招募描述
				<text style="margin-left: 10px;color: var(--black);" class="small" @click="startEdit('recruitContent')">点击编辑</text>
			</view>
			<view v-if="recruitState>0" class="recruitContent" v-html="recruitContent || '无招募内容'"></view>
			<!-- 解散队伍 -->
			<view v-if="myRole===2" class="dissolve-team" @click="dissolveTeam">解散队伍</view>
		</view>
		<!-- 设置成员信息 -->
		<set-member 
			v-if="obj_setMember" 
			:member.sync="obj_setMember" 
			@putMember="putMember"
			@addMember="addMember">
		</set-member>
		<!-- 申请列表 -->
		<apply-list 
			v-if="isShowApplyList" 
			:applyMembers="applyMembers"
			@close="isShowApplyList=false">
		</apply-list>
		<BottomBtn 
			v-if="myRole > 0 && currentNav===0 || currentNav===2"
			@click="onclickSave">
			保存
		</BottomBtn>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getTeam,putTeam,deleteMember,putMemberIdentity,handoverTeam,deleteTeam,getApply } from "@/static/request/api_team.js"
import { getUser } from "@/static/request/api_userInfo.js"
import { getPublicSignature } from '@/static/request/api_system.js';
import TeamMember from "./components/TeamMember.vue"
import SetMember from "./components/SetMember.vue"
import ApplyList from "./components/ApplyList.vue"
export default {
	components: {
		"team-member": TeamMember,
		"set-member": SetMember,
		"apply-list": ApplyList
	},
	data() {
		return {
			navs: [
				{label: "基本信息",value: 0},
				{label: "成员信息",value: 1},
				{label: "团队设置",value: 2},
			],
			currentNav: 0,
			arr_school: ["浙江大学","浙江工业大学","杭州电子科技大学","浙江理工大学","浙江农林大学","浙江科技学院","浙江外国语学院","中国计量大学","浙江财经大学"],
			myRole: 0,// 2队长，1管理员，0队员
			id: "",
			createTime: "",
			avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
			is_uploadAvatar: false,
			captainId: "",
			name: "",
			school: "",
			tag: "",
			intro: "",
			/* 成员 */
			searchId: "",
			members: [],
			obj_setMember: null,
			/* 团队设置 */
			recruitState: 0,
			recruitContent: "",
			/* 申请加入列表 */
			applyMembers: [],
			isShowApplyList: false,
		};
	},
	computed: {
		tagsList() {
			return this.tag.split(' ').filter(tag => tag !== '');
		}
	},
	filters: {
		memberIdentify(member,captainId){
			if(member.uid === captainId){
				return "队长"
			}
			if(member.isAdmin){
				return "管理员"
			}
			if(member.role){
				return member.role
			}
			return "队员"
		}
	},
	onLoad(e) {
		this.gLoading(this,true)
		getTeam(Number(e.id))
		.then(res => {
			console.log(res.data);
			if(!res.data){
				uni.navigateBack({
					delta: 1,
					complete: () => {
						this.gToastMsg("团队不存在")
					}
				})
			}
			for(const key in res.data){
				this[key] = res.data[key]
			}
			this.createTime = this.gformatDate(this.createTime,true)
			this.name = {
				val: this.name,
				errMsg: "队伍名不能为空"
			}
			/* 获取我的身份 */
			const myID = getApp().globalData.gUserInfo.userInfo.userId
			if(myID === this.captainId){
				this.myRole = 2
			}
			else{
				const member = this.members.find(item => item.uid === myID)
				if(member.isAdmin){
					this.myRole = 1
				}
			}
		})
		.finally(() => {
			this.gLoading(this,false)
		})
		this.getMemberApply(Number(e.id))
	},
	onShow() {
		if(this.currentNav === 0){
			this.intro = getApp().globalData.gEditContent
		}
		else if(this.currentNav === 2){
			this.recruitContent = getApp().globalData.gEditContent
		}
		getApp().globalData.gEditContent = ""
	},
	methods: {
		/* 获取申请列表 */
		getMemberApply(id)
		{
			getApply(id)
			.then(res => {
				this.applyMembers = res.data.filter(item => item.state===0)
				console.log(res.data);
			})
		},
		/* 选择图片 */
		chooseImg() 
		{
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: img => {
					this.avatar = img.tempFilePaths[0];
					this.is_uploadAvatar = true
				}
			})
		},
		/* 点击头像，menu弹窗提示查看头像/修改头像 */
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
		/* 开始编辑富文本 */
		startEdit(key)
		{
			getApp().globalData.gEditContent = this[key]
			uni.navigateTo({
				url: "../../EditMd/EditMd"
			})
		},
		/* 搜索成员 */
		onclickSearchMember()
		{
			if(this.searchId){
				/* 判断ID是否已存在队伍中 */
				const teamMember = this.members.find(item => item.uid === Number(this.searchId))
				if(teamMember){
					this.gToastMsg("成员已存在!")
					return
				}
				this.gLoading(this,true)
				getUser(this.searchId)
				.then(res => {
					if(res.data){
						this.obj_setMember = {
							isAdmin: false,
							isNewMember: true,
							uid: res.data.userId,
							memberRoughInfo: {
								nickname: res.data.nickname,
								avatarUrl: res.data.avatarUrl,
							},
							tid: this.id
						}
					}
					else{
						this.gToastError("用户不存在")
					}
				})
				.finally(() => this.gLoading(this,false))
			}
		},
		/* 添加成员 */
		addMember(member)
		{
			this.members.push(member)
			/* 触发组件添加事件 */
			this.$refs["setMember"].updateMember(this.members)
			this.obj_setMember = null
			this.gToastMsg("添加成功")
		},
		/* 点击单个成员，根据不同身份执行不同操作
			队长可以设置管理员，编辑成员信息，踢人
			管理员可以编辑成员信息，踢人
			成员仅能查看
		*/
		onclickMember(member)
		{
			let ctrList = ["查看成员主页"]
			/* 点击自己 */
			if(getApp().globalData.gUserInfo.userInfo.userId === member.uid){
				ctrList.push("编辑成员信息")
			}
			/* 管理员 */
			else if(this.myRole > 0){
				ctrList.push("编辑成员信息")
				/* 队长且不是点击自己头像 */
				if(this.myRole === 2 && getApp().globalData.gUserInfo.userInfo.userId !== member.uid){
					if(member.isAdmin){
						ctrList.push("取消管理员")
					}
					else{
						ctrList.push("设置管理员")
					}
					ctrList.push("移交队长权限","踢出成员")
				}
			}
			/* 非管理员且不是点击自己 */
			else{
				uni.navigateTo({
					url: `../../Self/UserHome?userId=${member.uid}`
				})
				return
			}
			this.gMenuPicker(ctrList)
			.then(res => {
				if(res === "查看成员主页"){
					uni.navigateTo({
						url: `../../Self/UserHome?userId=${member.uid}`
					})
				}
				else if(res === "编辑成员信息"){
					this.obj_setMember = {
						...member,
						isNewMember: false
					}
				}
				else if(res === "设置管理员"){
					this.gShowModal("确认设置其为管理员?",() => {
						putMemberIdentity({
							teamId: member.tid,
							userId: member.uid,
							isAdmin: true
						})
						const index = this.members.findIndex(item => item.uid === member.uid)
						this.members[index].isAdmin = true
						this.$refs["setMember"].updateMember(this.members)
						this.gToastMsg("设置管理员成功")
					})
				}
				else if(res === "取消管理员"){
					this.gShowModal("确认取消管理员身份?",() => {
						putMemberIdentity({
							teamId: member.tid,
							userId: member.uid,
							isAdmin: false
						})
						const index = this.members.findIndex(item => item.uid === member.uid)
						this.members[index].isAdmin = false
						this.$refs["setMember"].updateMember(this.members)
						this.gToastMsg("取消管理员成功")
					})
				}
				else if(res === "移交队长权限"){
					this.gShowModal("确认移交队长权限?该操作不可逆,请谨慎!",() => {
						handoverTeam(member.tid,member.uid)
						this.captainId = member.uid
						this.myRole = 1
						this.$refs["setMember"].updateMember(this.members)
						this.gToastMsg("已移交")
					})
				}
				else if(res === "踢出成员"){
					this.gShowModal("确认删除该成员?",() => {
						deleteMember(member.tid,member.uid)
						const index = this.members.findIndex(item => item.uid === member.uid)
						this.members.splice(index,1)
						this.$refs["setMember"].updateMember(this.members)
						this.gToastMsg("删除成功")
					})
				}
			})
		},
		/* 成功修改成员信息 */
		putMember(member)
		{
			const index = this.members.findIndex(item => item.uid === member.uid)
			this.members[index].role = member.role
			this.members[index].memberIntro = member.memberIntro
			/* 触发组件更新事件 */
			this.$refs["setMember"].updateMember(this.members)
			this.obj_setMember = null
			this.gToastMsg("修改成功")
		},
		/* 点击保存，修改队伍信息 */
		async onclickSave()
		{
			if(!this.gIsNull([this.name])){
				/* 上传头像 */
				this.gLoading(this,true)
				if(this.avatar && this.is_uploadAvatar){
					/* 获取上传签名 */
					try{
						const sign = await getPublicSignature(`${Date.now()}.JPG`)
						const url = await this.gUploadFile(this.avatar, sign.data)
						this.avatar = url.header.Location
						this.is_uploadAvatar = true
					} catch(err) {
						this.gLoading(this,false)
					}
				}
				const data = {
					avatar : this.avatar || "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
					name: this.name.val,
					school: this.school,
					tag: this.tag,
					intro: this.intro,
					recruitState: this.recruitState,
					recruitContent: this.recruitContent
				}
				putTeam(this.id,data)
				.then(res => {
					this.gToastSuccess("保存成功")
				})
				.finally(() => this.gLoading(this,false))
			}
		},
		/* 解散队伍 */
		dissolveTeam()
		{
			this.gShowModal("确认解散队伍?",() => {
				deleteTeam(this.id)
				.then(res => {
					uni.navigateBack({
						delta: 1,
						success: () => {
							this.gToastMsg("已解散队伍")
						}
					})
				})
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.edit-team
	min-height 100vh
	padding-bottom 60px
	background-color var(--white1)
	.card
		position relative
		margin 10px auto
		width 95%
		padding 10px 20px
		border-radius 8px
		background-color #FFFFFF
		box-shadow var(--shadow2)
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
		.recruitContent
			padding 5px
			border 1px solid var(--origin2)
			border-radius 4px
			font-size 24rpx
		.dissolve-team
			margin-top 10px
			text-align end
			color #e86452
			font-size 24rpx
	/* 成员信息 */
	.member-info
		position relative
		.h3
			margin-bottom 5px
		.apply-list-btn
			position absolute
			right 5px
			top 5px
			font-size 22rpx
			padding 0 10px
			border-radius 22px
			background-color var(--origin1)
			animation btnScale .4s ease-in-out infinite alternate
		.members
			margin-top 10px
@keyframes btnScale
	from
		transform scale(1)
	to
		transform scale(1.05)	
</style>
