<!-- 项目筛选 -->
<template>
	<view class="project-head">
		<view 
			class="sort-filter"
			:class="topRadius ? 'top-radius' : ''">
			<text
				:class="index === sortActive ? 'active' : ''" 
				v-for="(sort, index) in sortList" 
				:key="sort" 
				@click="checkSort(sort,index)">
				{{ sort.text }}
			</text>
			<text 
				:style="{
					color: is_filterActive ? 'var(--origin2)' : ''
				}"
				class="filter" 
				@click="is_showFileter = true">
				筛选
				<text class="iconfont icon-shaixuan"></text>
			</text>
		</view>
		<view v-if="is_showFileter" class="filter-card fix-screen">
			<view class="blank" @click="is_showFileter=false"></view>
			<view class="container">
				<view class="head center">
					<view class="h3">项目筛选</view>
					<view class="small">{{filterMsg}}</view>
				</view>
				<view class="filter">
					<!-- 搜索框 -->
					<SearchInput v-model="searchText" @input="searchChange" placeholder="根据项目题目搜索"></SearchInput>
					<!-- 赛事 | 获奖 -->
					<view class="filter-nav">
						<view 
							class="item"
							:class="index === filterNav ? 'active' : ''"
							v-for="(item,index) in filterType"
							:key="index"
							@click="filterNav = filterNav===index ? null : index">
							{{item}}
						</view>
					</view>
					<!-- 赛事 -->
					<view v-if="filterNav===0">
						<view class="value competion-type">
							<view
								class="item"
								:class="index === compType ? 'active' : ''"
								v-for="(item,index) in arr_compType"
								:key="index"
								@click="compId=null;compType=index">
								{{item.label}}
							</view>
						</view>	
						<view class="value competition">
							<view
								class="item"
								:class="index === compId ? 'active' : ''"
								v-for="(item,index) in arr_competition"
								:key="index"
								@click="compId = compId===index ? null : index">
								{{item.name}}
							</view>
						</view>	
					</view>
					<!-- 获奖 -->
					<view v-if="filterNav===1" class="value level">
						<view
							class="item"
							:class="index === level ? 'active' : ''"
							v-for="(item,index) in arr_level"
							:key="index"
							@click="level = index">
							{{item.label}}
						</view>
					</view>
				</view>
				<!-- 按键组 -->
				<view class="btns">
					<button @click="sureFilter(false)">筛选项目</button>
					<button @click="sureFilter(true)">所有项目</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		topRadius: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			sortList: [
				{ text: '综合', val: 'read' }, 
				{ text: '收藏量', val: 'collect' }, 
				{ text: '最新', val: 'time' }, 
				{ text: '获奖等级', val: 'awardLevel' },
			],
			sortActive: 0,
			
			is_showFileter: false,
			is_filterActive: false,
			searchText: "",
			filterType: ["参与赛事","获奖等级"],
			filterNav: null,
			arr_compType: getApp().globalData.compType,
			compType: 0,
			arr_level: getApp().globalData.prizeLevels,
			level: 0,
			compId: null
		}
	},
	watch: {
		filterNav: "filterNavChange"
	},
	computed: {
		/* 筛选结果提示 */
		filterMsg(){
			let res = ""
			if(this.searchText){
				return `标题包含: ${this.searchText}`
			}
			else if(this.filterNav === 0){
				if(this.compId === null){
					return `属于 ${this.arr_compType[this.compType].label}`
				}
				else{
					return `参与了 ${this.arr_competition[this.compId].name}`
				}
			}
			else if(this.filterNav === 1){
				return `获得 ${this.arr_level[this.level].label} 以上`
			}
			return "全部"
		},
		/* 筛选当前选中分类的比赛 */
		arr_competition(){
			const typeId = this.arr_compType[this.compType].value
			return getApp().globalData.Competitions.filter(item => item.competitionType.id === typeId)
		}
	},
	methods: {
		/* 筛选内容大类改变，清空输入 */
		filterNavChange(e)
		{
			this.searchText = ""
		},
		/* 输入搜索内容,初始筛选条件 */
		searchChange()
		{
			this.filterNav = null
			this.compType = 0
			this.level = 0
			this.compId = null
		},
		/* 
			name: 确定排序模式
			time: 2020/12/26
		*/
		checkSort(sort,index)
		{
			this.sortActive = index
			this.$emit("sortChange",sort)
		},
		/* 
			name: 确认筛选模式
			desc: 获取筛选模式，退出弹窗。
			time: 2020/12/26
		*/
		sureFilter(All=false)
		{
			this.is_filterActive = true
			/* 点击所有项目 */
			if(All){
				this.$emit("filterChange",null)
				this.is_filterActive = false
				this.filterNav = null
				this.compType = 0
				this.level = 0
				this.compId = null
			}
			/* 包含搜索内容 */
			else if(this.searchText){
				this.$emit("filterChange",["search",this.searchText])
			}
			/* 选择比赛类型 */
			else if(this.filterNav === 0){
				/* 未选择比赛 */
				if(this.compId === null){
					this.$emit("filterChange",["compType",this.arr_compType[this.compType].value])
				}
				/* 选择了比赛 */
				else{
					this.$emit("filterChange",["compId",this.arr_competition[this.compId].id])
				}
			}
			/* 选择获奖等级 */
			else if(this.filterNav === 1){
				this.$emit("filterChange",["awardLevel",this.arr_level[this.level].value])
			}
			/* 没有任何选择 */
			else{
				this.is_filterActive = false
				this.$emit("filterChange",null)
			}
			this.is_showFileter = false
		}
	}
}
</script>

<style lang="stylus" scoped>
.project-head
	position static
	// 开头标题
	.sort-filter
		background-color var(--white2)
		font-size 24rpx
		display flex
		align-items center
		justify-content space-around
		text-align center
		&.top-radius
			border-top-left-radius 22px
			border-top-right-radius 22px
		text
			flex 1
			padding 20rpx 0
		.active
			color var(--origin2)
			font-weight 700
		.filter
			display flex
			align-items center
			justify-content center
			.iconfont
				font-size 30rpx
	.filter-card
		display flex
		flex-direction column
		.blank
			width 100%
		.container
			width 100%
			background-color var(--origin2)
			border-top-left-radius 22px
			border-top-right-radius 22px
			animation showContent .5s
			overflow hidden
			.head
				padding 10px
				color #FFFFFF
				background-color var(--origin2)
			.filter
				min-height 200px
				padding 10px 10px 90px
				background-color var(--white1)
				border-top-left-radius 22px
				border-top-right-radius 22px
				font-size 12px
				.filter-nav
					margin 10px
					padding 10px
					background-color #FFFFFF
					border-radius 22px
					display grid
					grid-template-columns 1fr 1fr
					text-align center
					.item
						border-radius 22px
						padding 5px
						color var(--gray2)
					.active
						background-color var(--origin2)
						color var(--black)
				.value
					margin 10px
					padding 10px
					background-color #FFFFFF
					border-radius 22px
					display grid
					grid-gap 10px
					text-align center
					.item
						padding 5px
						&.active
							border-radius 22px
							background-color var(--origin4)
							color var(--origin1)
				.level
					grid-template-columns repeat(4,1fr)
				.competion-type
					padding 10px 20px
					grid-template-columns repeat(3,1fr)
				.competition
					display flex
					flex-wrap wrap
					.item
						margin 0 5px 5px 0
			.btns
				position absolute
				bottom 0
				left 0
				right 0
				padding 10px 0 5px
				background-color var(--origin2)
				border-top-left-radius 22px
				border-top-right-radius 22px
				display flex
				button
					width 30%
					background-color #FFFFFF
					color var(--origin2)
					font-weight 700
					font-size 14px
@keyframes showContent
	from
		transform translateY(50vh)
	to
		transform translateY(0)
</style>
