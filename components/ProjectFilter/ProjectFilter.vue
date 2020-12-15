<!-- 项目筛选 -->
<template>
	<view class="project-filter">
		<view class="content">
			<view class="head">
				<text class="h3">条件筛选</text>
				<button @click="sureFilter">确认</button>
			</view>
			<view class="main">
				<view class="left">
					<view 
						class="item"
						:class="index === currentNav ? 'active' : ''"
						v-for="(item,index) in leftNav"
						:key="index"
						@click="currentNav=index">
						{{item}}
					</view>
				</view>
				<view class="right">
					<!-- 参与赛事 -->
					<view v-if="currentNav===1" class="part competition">
						<picker-view
							class="picker"
							:value="comePicker"
							@change="comePicker=$event.target.value">
							<picker-view-column>
								<view 
									class="item" 
									v-for="(item,index) in competitions" 
									:key="index">
									{{item.name}}
								</view>
							</picker-view-column>
							<picker-view-column>
								<view 
									class="item" 
									v-for="(item,index) in competitions" 
									:key="index">
									{{item.name}}
								</view>
							</picker-view-column>
						</picker-view>
					</view>
					<!-- 获奖等级 -->
					<view v-else-if="currentNav===2" class="part level">
						<picker-view
							class="picker"
							:value="levelPicker"
							@change="levelPicker=$event.target.value">
							<picker-view-column>
								<view 
									class="item" 
									v-for="(item,index) in levels" 
									:key="index">
									{{item.label}}
								</view>
							</picker-view-column>
						</picker-view>
					</view>
					<!-- 精确搜索 -->
					<view v-else-if="currentNav===3" class="part search">
						<input type="text" placeholder="搜索" v-model="searchFilter"/>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			leftNav: ["全部","参与赛事","获奖等级","精确搜索"],
			currentNav: 0,
			levels: getApp().globalData.prizeLevels,
			levelPicker: [0],
			competitions: getApp().globalData.Matches,
			comePicker: [0,0],
			searchFilter: "",
			filterRes: null
		}
	},
	methods: {
		/* 
			name: sure filter
			desc: 确认筛选模式，退出弹窗。
			time: 2020/11/30
		*/
		sureFilter()
		{
			const pickerComp = () => {
				const index = this.comePicker[this.comePicker.length-1]
				return this.competitions[index].compTagId
			}
			const pickerLevel = () => {
				return this.levels[this.levelPicker[0]].value
			}
			let type = "all"
			switch(this.currentNav){
				case 0: type="all";this.filterRes=null;break;
				case 1: type="compId";this.filterRes=pickerComp();break;
				case 2: type="awardLevel";this.filterRes=pickerLevel();break;
			}
			this.$emit("sureFilter",{
				type,
				value: this.filterRes
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.project-filter
	z-index 20
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(0,0,0,0.1)
	.content
		position absolute
		bottom 0
		width 100%
		background-color #FFFFFF
		border-top-left-radius 22px
		border-top-right-radius 22px
		animation showContent .5s
		/* 提示文字 & 确认按键 */
		.head
			padding 10px
			display flex
			align-items center
			justify-content space-between
			.h3
				color var(--origin1)
			button
				margin 0 10px
				padding 0 20px
				background-color #5d7092
				border-radius 4px
		/* 主体内容 */
		.main
			display flex
			.left
				background-color var(--origin4)
				color var(--origin2)
				text-align center
				.item
					padding 20px 10px
					&.active
						background-color var(--origin2)
						color #FFFFFF
						border-top-right-radius 22px
						border-bottom-right-radius 22px
			.right
				position relative
				flex 1
				.part
					height 100%
					padding 0 10px
					.picker
						height 100%
						text-align center
						picker-view-column
							margin 0 10px
				.competition .item
					font-size 22rpx
				.level .item
					line-height 2
@keyframes showContent
	from
		transform translateY(50vh)
	to
		transform translateY(0)
</style>
