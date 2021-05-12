<!-- 
	城市选择
	author yjl
 -->
<template>
	<view class="select-city">
		<view class="letters">
			<view 
				class="letter"
				v-for="(city,index) in citys"
				:key="index"
				@click="scroll(city.letter)">
				{{city.letter}}
			</view>
		</view>
		<view class="item localtion">
			<view class="label">当前城市</view>
			<view class="citys" v-if="value">
				<view class="city active" @click="check(value)">
					{{value}}
				</view>
			</view>
		</view>
		<view class="item hot-city">
			<view class="label">热门城市</view>
			<view class="citys">
				<view 
					class="city"
					:class="city === value ? 'active' : ''"
					v-for="(city,index) in hotCity"
					:key="index"
					@click="check(city)">
					{{city}}
				</view>
			</view>
		</view>
		<view id="allCity">
			<view
				:id="citys.letter"
				class="item all"
				v-for="(citys,index) in citys"
				:key="index">
				<view class="label">{{citys.letter}}</view>
				<view class="citys">
					<view 
						class="city"
						:class="city === value ? 'active' : ''"
						v-for="(city,index2) in citys.list"
						:key="index2"
						@click="check(city)">
						{{city}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import citys from "./citys.js"
export default {
	props: {
		value: String,
	},
	data(){
		return {
			hotCity: ["杭州","上海","广州","深圳","北京","成都"],
			citys
		}
	},
	created() {
		uni.pageScrollTo({
			duration: 0,
			scrollTop: 0
		})
		uni.getLocation({
			type: 'wgs84',
			geocode:true,//设置该参数为true可直接获取经纬度及城市信息
			success: (res) => {
				console.log(res)
			},
			fail: () => {
				uni.showToast({
					title: '获取地址失败，将导致部分功能不可用',
					icon:'none'
				});
			}
		})
	},
	methods: {
		/* 选择城市，更新value并关闭弹窗 */
		check(city)
		{
			this.$emit('input',city)
			this.$emit('select',city)
		},
		scroll(id)
		{
			uni.createSelectorQuery().select("#"+id).boundingClientRect(data=>{//目标节点
			　　uni.createSelectorQuery().select("#select-city").boundingClientRect((res)=>{//最外层盒子节点
					console.log(res);
					console.log(data);
					// uni.pageScrollTo({
					// 	duration:0,
					// 	scrollTop: data.top - res.top,//滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
					// })
			　　}).exec()
			}).exec()
		}
	}
}
</script>

<style lang="stylus" scoped>
.select-city
	z-index 10
	position absolute
	top 0
	left 0
	right 0
	overflow-y auto
	background-color #FFFFFF
	padding 10px 40px 10px 10px
	.letters
		position fixed
		right 5px
		.letter
			margin-bottom 5px
			width 18px
			height 18px
			border-radius 50%
			line-height 18px
			text-align center
			font-size 22rpx
			color var(--gray2)
			&.active
				background-color var(--origin3)
				color var(--black)
	.item
		margin-bottom 15px
		.label
			margin-bottom 5px
			font-weight 700
			font-size 26rpx
		.citys
			display grid
			grid-template-columns repeat(3,1fr)
			grid-gap 10px 20px
			.city
				text-align center
				line-height 2
				background-color #FFFFFF
				border var(--border2)
				border-radius 4px
				font-size 26rpx
				display inline-block
				&.active
					background-color rgba(248,184,107,0.2)
					border-color var(--origin2)
					color var(--origin2)
		&.all
			.label
				width 20px
				height 20px
				text-align center
				line-height 20px
				background-color var(--origin2)
				color #FFFFFF
				border-radius 50%
				font-weight 500
</style>
