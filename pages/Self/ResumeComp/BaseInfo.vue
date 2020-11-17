<template>
	<!-- 基本信息表 -->
	<view
		class="card"
		:style="{ height: isBaseInfo ? 'auto' : '14px' }">
		<text 
			class="fold iconfont icon-xiala"
			:style="{ 'transform': isBaseInfo ? 'rotate(0)' : 'rotate(180deg)' }"
			@click="isBaseInfo=!isBaseInfo">
		</text>
		<view class="h3">基本信息</view>
		<!-- 姓名 -->
		<view class="item name">
			<text>姓名</text>
			<input 
				class="input" 
				style="width: 300rpx" 
				type="text" 
				maxlength="10"
				hold-keyboard="true"
				v-model="name"/>
		</view>
		<!-- 手机号 -->
		<view class="item phone">
			<text>手机号</text>
			<input 
				class="input" 
				style="flex: 1" 
				type="number"
				v-model="phone"/>
		</view>
		<!-- 邮箱地址 -->
		<view class="item phone">
			<text>邮箱地址</text>
			<input 
				class="input" 
				style="flex: 1" 
				type="text"
				v-model="email"/>
		</view>
		<!-- 性别 -->
		<view class="item gender">
			<text>性别</text>
			<radio-group
				class="radio-group"
				@change="gender = $event.detail.value">
				<label>
					<text 
						class="female iconfont icon-icfemale"
						style="color: #188cc9">
					</text>
					<radio class="radio" value="男" color="#f8b86b" checked="true"/>
				</label>
				<label>
					<text 
						class="male iconfont icon-icmale"
						style="color: #ce5d91">
					</text>
					<radio class="radio" value="女" color="#f8b86b"/>
				</label>
			</radio-group>
		</view>
		<!-- 出生年月 -->
		<view class="item both">
			<text>出生年份</text>
			<DataPicker 
				placeholder="2000-4"
				endTime="2010-12"
				v-model="birth">
			</DataPicker>
		</view>
		<!-- 最高学历 -->
		<view class="item highest-degree">
			<text>最高学历</text>
			<SPicker 
				placeholder="包括在读"
				:startIndex="highestDegree ? Degress.indexOf(highestDegree) : 3"
				:range="Degress"
				v-model="highestDegree">
			</SPicker>
		</view>
		<!-- 是否在读学生 -->
		<view class="item gender">
			<text>当前身份</text>
			<radio-group
				class="radio-group"
				@change="identity = $event.detail.value">
				<label>
					<view>学生</view>
					<radio class="radio" value="学生" color="#f8b86b" checked="true"/>
				</label>
				<label>
					<view>非学生</view>
					<radio class="radio" value="非学生" color="#f8b86b"/>
				</label>
			</radio-group>
		</view>
		<!-- 当前年级 -->
		<view class="item grade" v-if="identity === '学生'">
			<text>当前年级</text>
			<input 
				class="input"
				type="text"
				placeholder-class="placeholderStyle"
				placeholder="大二;研一"
				hold-keyboard="true"
				v-model="currentGrade"/>
		</view>
		<!-- 求职城市 -->
		<view class="item city">
			<text>工作城市</text>
			<input
				class="input" 
				style="flex: 1" 
				type="text"
				placeholder-class="placeholderStyle"
				placeholder="杭州,北京"
				hold-keyboard="true"
				v-model="workPlace"/>
		</view>
		<!-- 期望职业 -->
		<view class="item profession">
			<text>期望职业</text>
			<input
				class="input" 
				style="flex: 1" 
				type="text"
				placeholder-class="placeholderStyle"
				placeholder="前端工程师;Java工程师"
				hold-keyboard="true"
				v-model="profession"/>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		/* 读取全局 */
		const story = {...getApp().globalData.gResume}
		return {
			name: story.name || "",
			phone: story.phone || "",
			email: story.email || "",
			gender: story.gender || "男",
			birth: story.birth || "",
			highestDegree: story.highestDegree || "",
			identity: story.identity || "学生",
			currentGrade: story.currentGrade || "",
			workPlace: story.workPlace || "",
			profession: story.profession || "",
			// 是否展示
			isBaseInfo: true,
			// 选框列表 & 选中下标
			Degress: [], // 学历数组
		}
	},
	created() {
		this.Degress = getApp().globalData.Degress
		/* 读取本地数据 */
	}
}
</script>

<style lang="stylus" scoped>
/* 单选框 */
.gender .radio-group
	display flex
	align-items center
	label
		margin-right 20px
		display flex
		align-items center
		.iconfont
			font-size 40rpx
			margin-right 5rpx
</style>
