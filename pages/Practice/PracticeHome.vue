<!-- 外包 -->
<template>
	<view class="epibolies">
		<!-- 类型选择 -->
		<view class="navs">
			<view 
				class="nav"
				:class="currentNav===nav.value ? 'active' : ''"
				v-for="nav in navs"
				:key="nav.value"
				@click="currentNav=nav.value">
				{{nav.label}}
			</view>
		</view>
		<!-- 搜索框 -->
		<view class="search-input">
			<search-input
				placeholder="搜索相关内容" 
				v-model="searchText">
			</search-input>
		</view>
		<!-- 一些分类 -->
		<view 
			id="classify"
			class="classify" 
			:style="{
				transform: `translateX(${classifyTranslateX}px)`
			}"
			@touchstart="typeTouchstart"
			@touchmove="typeTouchmove"
			@touchend="typeTouchend">
			<view 
				class="item"
				v-for="(item,index) in classify"
				:key="index"
				@click="onclickType(item)">
				<view class="iconfont icon-user"></view>
				<view class="center mini">{{item}}</view>
			</view>
		</view>
		<!-- 自定义滚动标识 -->
		<view class="scroll-sign">
			<view 
				:style="{
					transform: `translateX(${-0.1*classifyTranslateX}px)`
				}"
				class="sign">
			</view>
		</view>
		<!-- 外包卡片 -->
		<view class="card" v-if="currentNav===0">
			<server-card 
				v-for="(server,index) in list"
				:key="index"
				:server="server">
			</server-card>
		</view>
		<view class="card" v-else>
			<navigator
				hover-class="none"
				v-for="(need,index) in list"
				:key="index"
				url="/pages/Epiboly/NeedDetail">
				<need-card :need="need"></need-card>
			</navigator>
		</view>
	</view>
</template>

<script>
import ServerCard from "./components/ServerCard.vue"
import NeedCard from "./components/NeedCard.vue"
var DOM_classifyWidth,touchX,scrolling = false
export default {
	data() {
		return {
			navs: [
				{label: "服务",value: 0},
				{label: "需求",value: 1},
			],
			currentNav: 0,
			searchText: "", //搜索内容
			classify: ["课程辅导","测试","前端","课程辅导","测试","前端","课程辅导","测试","前端","课程辅导","测试","前端","课程辅导","测试","前端","课程辅导","测试","前端","课程辅导","测试"],
			classifyTranslateX: 0,
			list: [
				{
					name: "企业LOGO设计搭嘎撒帝国时代5dag5sda5g521sd",
					tags: ["第三个沙发的高度是否","srdgsd0","浮点数高繁琐"],
					payway: "人工服务",
					guaranteeTime: 20,
					paytime: "立刻",
					price: 150,
					avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
					time: "2020/8/2"
				},
				{
					name: "企业LOGO设计搭嘎撒帝国时代5dag5sda5g521sd",
					tags: ["第三个沙发的高度是否","srdgsd0","浮点数高繁琐","浮点数高繁琐"],
					avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
					payway: "人工服务",
					guaranteeTime: 20,
					paytime: "立刻",
					price: 150,
					time: "2020/8/2"
				},
				{
					name: "企业LOGO设计搭嘎撒帝国时代5dag5sda5g521sd",
					tags: ["第三个沙发的高度是否","srdgsd0","浮点数高繁琐","浮点数高繁琐"],
					avatar: "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
					payway: "人工服务",
					guaranteeTime: 20,
					paytime: "立刻",
					price: 150,
					time: "2020/8/2"
				}
			]
		}
	},
	components: {
		"server-card": ServerCard,
		"need-card": NeedCard
	},
	mounted() {
		const query = uni.createSelectorQuery().in(this);
		query.select('#classify').boundingClientRect(data => {
			DOM_classifyWidth = -(data.width / 2)
		}).exec();
	},
	methods: {
		/* 类型滚动，触摸开始 */
		typeTouchstart(e)
		{
			touchX = e.changedTouches[0].pageX
		},
		/* 类型滚动，触摸开始 */
		typeTouchmove(e)
		{
			if(!scrolling){
				scrolling = true
				const newX = e.changedTouches[0].pageX
				this.classifyTranslateX += 1.2*(newX - touchX)
				if(this.classifyTranslateX > 0){
					this.classifyTranslateX = 0
				}
				else if(this.classifyTranslateX < DOM_classifyWidth){
					this.classifyTranslateX = DOM_classifyWidth
				}
				touchX = newX
				// 计算偏移百分比，转化成
				this.$nextTick(function(){
					scrolling = false
				})
			}
			
		},
		/* 类型滚动，触摸开始 */
		typeTouchend(e)
		{
			touchX = null
			scrolling = false
		},
		/* 点击类型，触发搜索 */
		onclickType(type)
		{
			this.searchText = type
			console.log(type);
		}
	}
}
</script>

<style lang="stylus" scoped>
.epibolies
	padding-bottom 80px
	min-height 100vh
	background-color var(--white1)
	.navs
		padding 5px 0
		background-color #FFFFFF
		display flex
		.nav
			flex 1
			padding 7px
			text-align center
			background-color var(--origin4)
			color var(--origin1)
			&:first-of-type
				margin-right 5px
			&.active
				background-color var(--origin2)
				color #FFFFFF
	/* 搜索框 */
	.search-input
		margin 5px 5%
	/* 一些预设分类 */
	.classify
		width 200%
		overflow-x hidden
		display grid
		grid-template-columns repeat(10,1fr)
		.item
			width 20vw
			padding 8px 0
			text-align center
			background-color var(--origin4)
			.mini
				color var(--gray1)
	.scroll-sign
		margin 5px 0 10px 50%
		transform translateX(-50%)
		height 5px
		width 20vw
		border 1px solid var(--origin2)
		border-radius 22px
		overflow hidden
		.sign
			width 50%
			height 5px
			background-color var(--nav-color)
	.card
		margin auto
		width 95%
</style>