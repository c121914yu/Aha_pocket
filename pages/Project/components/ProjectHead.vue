<!-- 项目筛选 -->
<template>
	<view class="project-head">
		<view class="sort-filter" :class="topRadius ? 'top-radius' : ''">
			<text 
				:class="index === sortActive ? 'active' : ''" 
				v-for="(sort, index) in sortList" 
				:key="sort" 
				@click="checkSort(sort, index)">
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
		<ProjectFilter 
			v-if="is_showFileter"
			@close="is_showFileter=false"
			@filterChange="filterChange">
		</ProjectFilter>
	</view>
</template>

<script>
import ProjectFilter from "./ProjectFilter.vue"
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
			is_filterActive: false
		}
	},
	components: {
		ProjectFilter
	},
	methods: {
		/* 
			name: 确定排序模式
			time: 2020/12/26
		*/
		checkSort(sort, index) 
		{
			this.sortActive = index;
			this.$emit('sortChange', sort)
		},
		filterChange(e)
		{
			this.is_filterActive = e ? true : false
			this.$emit('filterChange',e)
			this.is_showFileter = false
		}
	}
};
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
</style>
