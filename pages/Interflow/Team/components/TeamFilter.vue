<!-- 
	竞赛组队下拉筛选框，左右两栏
	author yjl
 -->
<template>
	<view class="team-filter" @touchmove.stop>
		<!-- 蒙层 -->
		<view v-show="is_showSelect" class="mask"></view>
		<!-- 筛选 & 排序文字 -->
		<view class="filter">
			<view 
				class="item"
				:class="[
					filter.active ? 'light' : '',
					selectType === i ? 'active' : ''
				]"
				v-for="(filter,i) in arr_filter"
				:key="i"
				@click="onclickFilter(i)">
				<view class="label">{{filter.label}}</view>
				<text class="iconfont icon-xiala"></text>
			</view>
			<view 
				:class="[
					obj_sortType.active ? 'light' : '',
					selectType === 3 ? 'active' : ''
				]"
				class="item"
				@click="onclickFilter(3)">
				<view class="label">{{obj_sortType.label}}</view>
				<text class="iconfont icon-sort"></text>
			</view>
		</view>
		<!-- 下拉列表 -->
		<view v-show="is_showSelect" class="container">
			<view class="content">
				<!-- 左侧数据 -->
				<scroll-view class="left" scroll-y="scroll-y">
					<view 
						class="item"
						:class="[
							selectType === 3 ? 'center' : '',
							index === acticveIndex[0] ? 'active' : ''
						]"
						v-for="(item,index) in arr_leftData"
						:key="index"
						@click="onclickLeft(index,item.key)">
						{{item.label}}
					</view>
				</scroll-view>
				<!-- 排序下拉时没有右侧数据 -->
				<scroll-view v-if="selectType!==3" class="right" scroll-y="scroll-y">
					<view
						class="item"
						:class="index === acticveIndex[1] ? 'active' : ''"
						v-for="(item,index) in arr_rightData"
						:key="index"
						@click="onclickRight(index,item.key)">
						{{item.label}}
					</view>
				</scroll-view>
			</view>
			<view class="btns">
				<button class="btn reset" @click="onclickReset">重置</button>
				<button class="btn sure" @click="onclickSure">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectType: null, // 0选择学校，1选择比赛，2选择职位，3排序
			is_showSelect: false, // 是否展示选择器
			arr_filter: [ // 顶部筛选文字
				{label: "全浙江高校",key:"school",value: "",active: false},
				{label: "全部比赛",key:"comp",value: "",active: false},
				{label: "全部职位",key:"jpb",value: "",active: false}
			],
			arr_sort: [ // 排序模式
				{label: "默认排序",value: ""},
				{label: "时间优先",value: "time"},
				{label: "等级优先",value: "level"}
			],
			obj_sortType: { //选中排序方式
				label: "默认排序",
				value: "",
				index: 0,
				active: false
			},
			arr_school: [ //高校数据
				{
					province: "浙江",
					value: "zhejiang",
					schools: ["全浙江高校","浙江工业大学"],
				}
			],
			schoolIndex: [0,0],
			arr_comp: [ // 比赛数据
				{
					type: "全部比赛",
					value: "",
					list: ["全部比赛"],
				}
			],
			compIndex: [0,0],
			arr_job: [ // 职位数据
				{
					type: "全部职位",
					value: "",
					list: ["全部职位"],
				}
			],
			jobIndex: [0,0],
		}
	},
	computed: {
		/**
		 * 左侧数据
		 */
		arr_leftData() {
			switch(this.selectType) {
				case null: return []
				case 0: return this.arr_school.map(item => ({
						label: item.province,
						value: item.value,
						key: "schoolIndex"
					}))
				case 1: return this.arr_comp.map(item => ({
						label: item.type,
						value: item.value,
						key: "compIndex"
					}))
				case 2: return this.arr_job.map(item => ({
						label: item.type,
						value: item.value,
						key: "jobIndex"
					}))
				case 3: return this.arr_sort
			}
		},
		/**
		 * 右侧数据
		 */
		arr_rightData() {
			switch(this.selectType) {
				case null: 
				case 3:
					return []
				case 0: return this.arr_school[this.schoolIndex[0]].schools.map(item => ({
					label: item,
					key: "schoolIndex"
				}))
				case 1: return this.arr_comp[this.compIndex[0]].list.map(item => ({
					label: item,
					key: "compIndex"
				}))
				case 2: return this.arr_job[this.jobIndex[0]].list.map(item => ({
					label: item,
					key: "jobIndex"
				}))
			}
		},
		/**
		 * 选中下标
		 */
		acticveIndex() {
			switch(this.selectType) {
				case null: return [-1,-1]
				case 0: return this.schoolIndex
				case 1: return this.compIndex
				case 2: return this.jobIndex
				/* 更加value */
				case 3: return [this.obj_sortType.index,-1]
			}
		}
	},
	methods: {
		/**
		 * 点击头部筛选 | 排序，根据对应下标打开对应选择器或者关闭选择器
		 * @param {Number}  i 对应下标
		 */
		onclickFilter(i)
		{
			console.log("点击下标",i);
			/* 点击已经打开的弹窗，关闭他们 */
			if(i === this.selectType) {
				this.is_showSelect = false
				this.selectType = null
			}
			/* 打开时先等DOM显示，在改变高度，展示动画。关闭时无需动画 */
			else {
				this.is_showSelect = true
				this.$nextTick(() => {
					this.selectType = i
				})
			}
			/* 如果打开select防止蒙层滚动 */
			this.$emit("canSlide",!this.is_showSelect)
		},
		/**
		 * 点击左侧
		 * @param {Number}  i 对应下标
		 * @param {String} key 变量名
		 */
		onclickLeft(i,key)
		{
			switch(this.selectType) {
				case 0: 
				case 1:
				case 2:
					this.$set(this[key],0,i)
					break
				case 3:
					this.$set(this.obj_sortType,"index",i)
					break
			}
		},
		/**
		 * 点击右侧
		 * @param {Number}  i 对应下标
		 * @param {String} key 变量名
		 */
		onclickRight(i,key)
		{
			this.$set(this[key],1,i)
		},
		/**
		 * 点击确认，确认筛选|排序内容，关闭弹窗
		 */
		onclickSure()
		{
			switch(this.selectType) {
				case 0:
				case 1:
				case 2:
					this.arr_filter[this.selectType] = {
						label: this.arr_rightData[this.acticveIndex[1]].label,
						value: this.arr_rightData[this.acticveIndex[1]].label,
						active: this.acticveIndex[1] !== 0 
					}
					break
				case 3:
					this.obj_sortType = {
						label: this.arr_sort[this.acticveIndex[0]].label,
						value: this.arr_sort[this.acticveIndex[0]].value,
						active: this.acticveIndex[0] !== 0
					}
					break
			}
			/* 关闭弹窗 */
			this.onclickFilter(this.selectType)
		},
		/**
		 * 点击重置
		 */
		onclickReset() 
		{
			/* 重置学校 */
			this.arr_filter = [
				{label: "全浙江高校",key:"school",value: "",active: false},
				{label: "全比赛",key:"comp",value: "",active: false},
				{label: "全职位",key:"jpb",value: "",active: false},
			]
			this.schoolIndex = [0,0]
			/* 重置排序 */
			this.obj_sortType = {
				label: "默认排序",
				value: "",
				active: false
			}
			/* 关闭弹窗 */
			this.onclickFilter(this.selectType)
		}
	}
}
</script>

<style lang="stylus" scoped>
.team-filter
	.filter
		position relative
		border-bottom var(--border2)
		background-color #FFFFFF
		display flex
		align-items center
		justify-content space-around
		.item
			width 25%
			padding 12px 2px
			border-bottom 2px solid transparent
			color var(--gray1)
			display flex
			align-items center
			justify-content center
			.label
				text-overflow ellipsis
				overflow hidden
				font-size 22rpx
				white-space nowrap
			.iconfont
				margin-left 2px
				font-size 22rpx
			&.light
				color var(--origin2)
			&.active
				border-bottom-color var(--origin2)
				color var(--origin2)
				.iconfont
					transform rotate(180deg)
	.container
		z-index 10
		position absolute
		width 100%
		height 65vh
		border-bottom-left-radius 22px
		border-bottom-right-radius 22px
		background-color #FFFFFF
		overflow hidden
		.content
			margin-bottom 45px
			height 100%
			display flex
			.left, .right
				padding 10px
				overflow-y auto
				.item
					padding 10px 0
					&.active
						color var(--origin2)
			.left
				flex 2
			.right
				flex 3
				border-left var(--border2)
		.btns
			position absolute
			bottom 0
			width 100%
			display flex
			.btn
				flex 1
				border-radius 0
				&:active
					transform none
				&.reset
					background-color var(--gray2)
	.mask
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background-color rgba(0, 0, 0, 0.2)
</style>
