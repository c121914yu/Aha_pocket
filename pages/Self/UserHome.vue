<!-- 用户信息主页 -->
<template>
	<view class="user-home">
		<view class="head">
			<!-- 标签 -->
			<view class="tags">
				<view
					class="tag"
					:style="{
						transform: `translate(${translate[index][0]}px,${translate[index][1]}px)`
					}"
					v-for="(tag, index) in tags"
					:key="index"
				>
					{{ tag }}
				</view>
			</view>
			<!-- 头像 & 昵称 -->
			<view class="info">
				<image :src="avatarUrl"></image>
				<view>{{ nickname }}</view>
			</view>
			<!-- 私信按键 -->
			<navigator :url="'Inform/Inform_send?id=' + userId">
				<text class="iconfont icon-sixin"></text>
			</navigator>
		</view>
		<!-- 个人介绍 -->
		<view class="intro">
			<view class="h3">个人介绍</view>
			<view class="small">{{ intro || '这个人还没填写简历...' }}</view>
		</view>
		<!-- 项目 -->
		<view
			class="list"
			:style="{
				height: showProject ? `${projects.length * 50 + 70}px` : '40px'
			}">
			<view class="title" @click="showProject = !showProject">
				<view class="name">项目参与数量</view>
				<view class="amount">10</view>
				<text
					class="iconfont icon-xiala"
					:style="{
						transform: `rotate(${showProject ? '180deg' : '0'})`
					}"
				></text>
			</view>
			<navigator 
				class="item" 
				hover-class="none" 
				v-for="(item, index) in projects" 
				:key="index" 
				:url="'../Project/Project?id=' + item.id">
				<view class="name">{{ item.name }}</view>
				<view class="collect">
					<text class="iconfont icon-collection"></text>
					{{ item.collect }}
				</view>
				<text class="go iconfont icon-arrow-right"></text>
			</navigator>
			<navigator 
				v-if="projects.length === 5" 
				class="center" 
				hover-class="none" 
				:url="'../Project/Projects?userId=' + userId">
				查看更多
			</navigator>
		</view>
		<!-- 外包 -->
		<view
			class="list"
			:style="{
				height: showEpibolies ? `${projects.length * 50 + 40}px` : '40px'
			}">
			<view class="title" @click="showEpibolies = !showEpibolies">
				<view class="name">外包需求数量</view>
				<view class="amount">10</view>
				<text
					class="iconfont icon-xiala"
					:style="{
						transform: `rotate(${showEpibolies ? '180deg' : '0'})`
					}"
				></text>
			</view>
			<navigator class="item" hover-class="none" v-for="(item, index) in epibolies" :key="index">
				<view class="name">{{ item.name }}</view>
				<text class="go iconfont icon-arrow-right"></text>
			</navigator>
		</view>
		<!-- 加载动画 -->
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getUser } from '@/static/request/api_userInfo.js';
import { getProjects } from '@/static/request/api_project.js';
export default {
	data() {
		return {
			userId: '',
			avatarUrl: '',
			nickname: '',
			tags: [],
			translate: [],

			intro: '',
			/* 项目 */
			showProject: false,
			projects: [],
			/* 外包 */
			showEpibolies: false,
			epibolies: [{ name: '***小程序', id: 0 }, { name: '***网页', id: 0 }, { name: '***算法', id: 0 }]
		};
	},
	onLoad(e) {
		if (!e.userId) {
			this.gToastError('ID为空');
		} else {
			this.gLoading(this, true);
			this.userId = e.userId;
			/* 获取用户userId，请求数据 */
			getUser(e.userId)
			.then(res => {
				this.gLoading(this, false);
				let tagArr = [];
				for (let i = 0; i < 8; i++) {
					tagArr.push('');
					this.translate.push([0, 0]);
				}
				/* 格式化比赛标签和特征标签 */
				if (res.data.compTags) {
					res.data.compTags.split(',').forEach((item, i) => {
						tagArr[i] = item;
					});
				}
				if (res.data.specialtyTags) {
					res.data.specialtyTags.split(',').forEach((item, i) => {
						tagArr[i + 4] = item;
					});
				}
				this.tags = tagArr;
				this.avatarUrl = res.data.avatarUrl;
				this.nickname = res.data.nickname;
				this.intro = res.data.intro;
				this.$nextTick(this.moveTag);
			})
			.catch(err => {
				this.gLoading(this, false);
			});
			/* 获取5条收藏量最多的项目项目 */
			getProjects({
				userId: e.userId,
				pageNum: 1,
				pageSize: 5,
				sortBy: 'collect'
			})
			.then(res => {
				this.projects = res.data.pageData
				console.log(res.data)
			})
		}
	},
	methods: {
		/* 移动标签位置 */
		moveTag() {
			for (let i = 1; i <= 8; i++) {
				let X = 0;
				let Y = 0;

				if (i >= 1 && i <= 4) X = 90;
				else X = -65;

				switch (i) {
					case 1:
					case 5:
						Y = -30;
						break;
					case 2:
					case 6:
						Y = -5;
						break;
					case 3:
					case 7:
						Y = 20;
						break;
					case 4:
					case 8:
						Y = 45;
						break;
				}
				this.translate[i - 1] = [X, Y];
			}
			setTimeout(() => {
				this.$forceUpdate();
			}, 10);
		}
	}
};
</script>

<style lang="stylus" scoped>
.user-home
	min-height 100vh
	background-color var(--white1)
	.head
		position relative
		height 120px
		background-color var(--origin3)
		display flex
		align-items center
		justify-content center
		.info
			z-index 5
			height 100%
			display flex
			flex-direction column
			align-items center
			justify-content center
			view
				color var(--origin1)
			image
				width 80px
				height 80px
				border-radius 50%
		.tag
			position absolute
			top 40px
			padding 0 5px
			border-radius 10px
			background-color var(--origin1)
			color #FFFFFF
			font-size 22rpx
			white-space nowrap
			display inline-block
			transition 0.5s
			transform-origin right center
			&:nth-child(1)
				transition-delay 0.3s
			&:nth-child(2)
				transition-delay 0.45s
			&:nth-child(3)
				transition-delay 0.6s
			&:nth-child(4)
				transition-delay 0.75s
			&:nth-child(5)
				transition-delay 1.35s
			&:nth-child(6)
				transition-delay 1.2s
			&:nth-child(7)
				transition-delay 1.05s
			&:nth-child(8)
				transition-delay 0.9s
		.icon-sixin
			position absolute
			right 10px
			bottom 10px
			font-size 34rpx
			color var(--origin1)
	/* 个人介绍 */
	.intro
		margin-top 10px
		padding 10px
		background-color #FFFFFF
	/* 统计数据 */
	.list
		margin 10px 5px 0 5px
		height 40px
		overflow hidden
		transition height 0.5s
		.title
			position relative
			height 40px
			padding 0 10px
			background-color var(--origin3)
			border-radius 12px
			display flex
			align-items center
			.name
				flex 1
			.amount
				margin-right 30px
				height 30px
				width 30px
				line-height 30px
				text-align center
				border-radius 50%
				background-color #FFFFFF
			.iconfont
				position absolute
				right 10px
				color var(--origin1)
				font-size 32rpx
				transition 0.5s
		.item
			width 85%
			margin 10px auto
			height 40px
			padding 0 10px
			background-color #FFFFFF
			border-radius 8px
			font-size 24rpx
			display flex
			align-items center
			.name
				flex 1
				font-size 26rpx
			.collect
				margin 0 10px
				color var(--origin2)
			.go
				font-size 40rpx
				color var(--origin1)
		.center
			color var(--origin1)
			text-decoration underline
			display block
</style>
