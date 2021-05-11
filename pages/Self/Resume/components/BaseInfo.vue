<!-- 
	基本信息
	author yjl
 -->
<template>
	<view v-if="is_loaded" class="fixed base-info">
		<image class="avatar" :src="avatarUrl"></image>
		<!-- <view class="set-avatar center small">点击编辑头像</view> -->
		<resume-input
			label="姓名"
			placeholder="你的姓名"
			v-model="name">
		</resume-input>
		<resume-data-picker
			label="生日"
			placeholder="出生日期"
			endTime="2010-12"
			v-model="birth">
		</resume-data-picker>
		<resume-menu-picker
			label="性别"
			:arr_range="['男','女']"
			placeholder="你的性别"
			v-model="gender">
		</resume-menu-picker>
		<resume-menu-picker
			label="当前最高学历"
			:arr_range="['博士后','博士','硕士','本科','专科','高中']"
			placeholder="学位情况"
			v-model="highestDegree">
		</resume-menu-picker>
		<resume-menu-picker
			label="当前身份"
			:arr_range="['学生','非学生']"
			placeholder="你当前的身份"
			v-model="identity">
		</resume-menu-picker>
		<resume-input
			v-if="identity==='学生'"
			label="当前年级"
			placeholder="你当前的年级"
			v-model="currentGrade">
		</resume-input>
		<view class="border"></view>
		<resume-input
			label="手机号"
			placeholder="你的手机号"
			type="number"
			v-model="phone">
		</resume-input>
		<resume-input
			label="邮箱地址"
			placeholder="你的邮箱地址"
			v-model="email">
		</resume-input>
		<view class="border"></view>
		<resume-city-picker
			label="期望工作地点"
			placeholder="期望工作地点"
			v-model="workPlace">
		</resume-city-picker>
		<resume-input
			label="期望职业"
			placeholder="期望职业"
			v-model="profession">
		</resume-input>
		<view class="save">
			<button @click="gBackPage('')">保存</button>
		</view>
	</view>
</template>

<script>
import { putResume } from '@/static/request/api_userInfo.js'
import resumeInput from "./Resume_input.vue"
import resumeDataPicker from "./Resume_datePicker"
import resumeMenuPicker from "./Resume_menuPicker.vue"
import resumePickerCity from "./Resume_pickerCity.vue"
export default {
	components: {
		"resume-input": resumeInput,
		"resume-data-picker": resumeDataPicker,
		"resume-menu-picker": resumeMenuPicker,
		"resume-city-picker": resumePickerCity
	},
	data() {
		return {
			is_loaded: false, // 是否加载完毕
			avatarUrl: getApp().globalData.gUserInfo.userInfo.avatarUrl,
			name: '',
			phone: '',
			email: '',
			gender: '',
			birth: '',
			highestDegree: '',
			identity: '学生',
			currentGrade: '',
			workPlace: '',
			profession: '',
		}
	},
	onLoad() {
		const resume = getApp().globalData.gResume
		for(let key in resume){
			this[key] = resume[key]
		}
		this.is_loaded = true
	},
	beforeDestroy() {
		const data = {
			name: this.name,
			phone: this.phone,
			email: this.email,
			gender: this.gender,
			birth: this.birth,
			highestDegree: this.highestDegree,
			identity: this.identity,
			currentGrade: this.currentGrade,
			workPlace: this.workPlace,
			profession: this.profession,
		}
		/* 更新全局简历信息 */
		for(let key in data){
			getApp().globalData.gResume[key] = data[key]
		}
		/* 调用接口更新数据库 */
		putResume(getApp().globalData.gResume)
	}
}
</script>

<style lang="stylus" scoped>
.base-info
	padding 20px 5% 55px
	.avatar
		margin auto
		width 50px
		height 50px
		border-radius 50%
		display block
	.set-avatar
		margin-top 10px
		color var(--gray1)
	.border
		margin 5px 0
		width 100%
		height 1px
		background-color var(--white1)
	/* 保存按键 */
	.save
		z-index 5
		position fixed
		bottom 0
		left 0
		right 0
		background-color var(--origin2)
		padding 10px
		border-top-left-radius 22px
		border-top-right-radius 22px
		button
			margin 0 15%
			padding 3px
			background-color #FFFFFF
			color var(--origin2)
</style>
