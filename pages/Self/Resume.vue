<template>
	<!-- 个人简历 -->
	<view class="resume">
		<!-- 基本信息卡片 -->
		<view 
			class="card"
			:style="{
				'height': isBaseInfo ? 'auto' : '110rpx'
			}"
			>
			<view class="h3">基本信息</view>
			<!-- 姓名 -->
			<view class="item name">
				<text>姓名</text>
				<input 
					class="value" 
					style="width: 300rpx" 
					type="text" 
					maxlength="10"/>
			</view>
			<!-- 联系方式 -->
			<view class="item contact">
				<text>联系方式</text>
				<input 
					class="value" 
					style="flex: 1" 
					type="text"/>
			</view>
			<!-- 性别 -->
			<view class="item gender">
				<text>性别</text>
				<radio-group
					class="radio-group"
					@change="gender = $event.detail.value">
					<label>
						<text class="female iconfont icon-icfemale"></text>
						<radio class="radio" value="男" color="#f8b86b" checked="true"/>
					</label>
					<label>
						<text class="male iconfont icon-icmale"></text>
						<radio class="radio" value="女" color="#f8b86b"/>
					</label>
				</radio-group>
			</view>
			<!-- 出生年月 -->
			<view class="item both">
				<text>出生年份</text>
				<picker 
					class="value"
					:class="both === '' ? 'placeholderStyle' : ''"
					mode="date"
					start="1990-01"
					end="2020-12"
					fields="month"
					:value="both"
					@change="both = $event.detail.value">
					<view>{{both === "" ? "出生年月" : both}}</view>
				</picker>
			</view>
			<!-- 最高学历 -->
			<view class="item highest-degree">
				<text>最高学历</text>
				<SPicker 
					placeholder="包括在读"
					startIndex="3"
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
			<view class="item grade" v-if="identity==='学生'">
				<text>当前年级</text>
				<input 
					class="value"
					type="text"
					placeholder-class="placeholderStyle"
					placeholder="大二;研一"/>
			</view>
			<!-- 求职城市 -->
			<view class="item city">
				<text>工作城市</text>
				<input
					class="value" 
					style="flex: 1" 
					type="text"
					placeholder-class="placeholderStyle"
					placeholder="杭州,北京"
					v-model="workPlace"/>
			</view>
			<!-- 求职城市 -->
			<view class="item city">
				<text>期望职业</text>
				<input
					class="value" 
					style="flex: 1" 
					type="text"
					placeholder-class="placeholderStyle"
					placeholder="前端工程师;Java工程师"
					v-model="profession"/>
			</view>
		</view>
		<!-- 教育经历 -->
		<view 
			class="card"
			:style="{
				'height': isEduExperience ? 'auto' : '110rpx'
			}">
			<text class="h3">教育经历</text>
			<!-- 教育经历内容填写 -->
			<view 
				class="edu"
				v-for="(edu,index) in eduExperience"
				:key="index">
				<!-- 学历 -->
				<view class="item degree">
					<text>学历</text>
					<SPicker 
						placeholder="本科,硕士"
						startIndex="3"
						:range="Degress"
						v-model="edu.degree">
					</SPicker>
				</view>
				<!-- 学校选择，可选择输入框 -->
				<view class="item school">
					<text>学校</text>
					<SearchInput v-model="edu.school"></SearchInput>
				</view>
				<!-- 专业 -->
				<view class="item specialty">
					<text>专业</text>
					<input 
						class="value"
						type="text"
						value="" 
						v-model="edu.specialty"/>
				</view>
				<!-- 成绩 -->
				<view class="item degree">
					<text>成绩排名</text>
					<SPicker 
						:range="Grades"
						v-model="edu.grade">
					</SPicker>
				</view>
				<!-- 在校时间 -->
				<view class="item edu-time">
					<text>在校时间</text>
					<picker
						class="value"
						:class="edu.startTime === '' ? 'placeholderStyle' : ''"
						mode="date"
						start="2000-01"
						end="2030-12"
						fields="month"
						:value="edu.startTime"
						@change="eduExperience[index].startTime = $event.detail.value">
						<view>{{edu.startTime === "" ? "2018-9" : edu.startTime}}</view>
					</picker>
					<view>-</view>
					<picker
						class="value"
						:class="edu.endTime === '' ? 'placeholderStyle' : ''"
						mode="date"
						start="2000-01"
						end="2030-12"
						fields="month"
						:value="edu.endTime"
						@change="eduExperience[index].endTime = $event.detail.value">
						<view>{{edu.endTime === "" ? "2022-6" : edu.endTime}}</view>
					</picker>
				</view>
				<!-- 删除按键 -->
				<icon 
					class="remove" 
					type="clear" 
					size="22" 
					color="#e86452"
					@click="removeEdu(index)">
				</icon>
			</view>
			<button 
				class="add-btn"
				@click="addEdu">
				+添加教育经历
			</button>
		</view>
		<!-- 个人经历 -->
		<view 
			class="card"
			style="padding: 40rpx;">
			<text class="h3">个人经历</text>
			<view class="small">校园、实习、工作等经历</view>
			<view 
				class="self"
				v-for="(exp,index) in selfExperience"
				:key="index">
				<!-- 组织 / 公司 -->
				<view class="item specialty">
					<text class="small">组织/公司</text>
					<input 
						class="value"
						style="width: 65%;"
						type="text"
						value="" 
						v-model="exp.organization"/>
				</view>
				<!-- 职位 / 工作 -->
				<view class="item specialty">
					<text class="small">职位/工作</text>
					<input 
						class="value"
						style="width: 65%;"
						type="text"
						value="" 
						v-model="exp.post"/>
				</view>
				<!-- 经历时间 -->
				<view class="item edu-time">
					<text>经历时间</text>
					<picker
						class="value"
						:class="exp.startTime === '' ? 'placeholderStyle' : ''"
						mode="date"
						start="2000-01"
						end="2030-12"
						fields="month"
						:value="exp.startTime"
						@change="selfExperience[index].startTime = $event.detail.value">
						<view>{{exp.startTime === "" ? "2018-9" : exp.startTime}}</view>
					</picker>
					<view>-</view>
					<picker
						class="value"
						:class="exp.endTime === '' ? 'placeholderStyle' : ''"
						mode="date"
						start="2000-01"
						end="2030-12"
						fields="month"
						:value="exp.endTime"
						@change="selfExperience[index].endTime = $event.detail.value">
						<view>{{exp.endTime === "" ? "2022-6" : exp.endTime}}</view>
					</picker>
				</view>
				<!-- 经历描述 -->
				<view class="item textArea">
					<text>经历描述</text>
					<textarea style="height: 200rpx;" v-model="exp.description" />
				</view>
				<!-- 删除按键 -->
				<icon 
					class="remove" 
					type="clear" 
					size="22" 
					color="#e86452"
					@click="removeSelfExperience(index)">
				</icon>
			</view>
			<button
				class="add-btn"
				@click="addSelfExperience">
				+添加个人经历
			</button>
		</view>
		<!-- 专业技能卡片 -->
		<view class="card">
			<view class="h3">专业技能</view>
			<view class="item textArea">
				<textarea 
					style="height: 300rpx;" 
					placeholder="IT技能: 前端开发,java……不同技能换行更美观!"
					placeholder-class="placeholderStyle"
					v-model="proSkill"/>
			</view>
		</view>
		<!-- 比赛 获奖 论文 -->
		<view 
			class="card">
			<text class="h3">荣誉情况</text>
			<view class="small">证书,竞赛,论文,软著等获得经历</view>
			<view 
				class="prize"
				v-for="(prize,index) in prizeList"
				:key="index">
				<view 
					class="item"
					style="display: block">
					<text>荣誉名称</text>
					<input
						class="value" 
						style="width: 100%" 
						type="text"
						placeholder-class="placeholderStyle"
						placeholder="服务外包大赛全国一等奖 / ***论文第一作者"
						v-model="prize.name"/>
				</view>
				<!-- 获得时间 -->
				<view class="item edu-time">
					<text>获得时间</text>
					<picker
						class="value"
						:class="prize.time === '' ? 'placeholderStyle' : ''"
						style="width: 200rpx;text-align: center;"
						mode="date"
						start="2010-01"
						end="2030-12"
						fields="month"
						:value="prize.time"
						@change="prizeList[index].time = $event.detail.value">
						<view>{{prize.time === "" ? "2020-9" : prize.time}}</view>
					</picker>
				</view>
				<!-- 获奖描述 -->
				<view class="item textArea">
					<text>荣誉描述</text>
					<textarea 
						style="height: 200rpx;" 
						placeholder="简单描述下项目内容及个人负责的内容."
						placeholder-class="placeholderStyle"
						v-model="prize.description"/>
				</view>
				<!-- 删除按键 -->
				<icon 
					class="remove" 
					type="clear" 
					size="22" 
					color="#e86452"
					@click="removePrize(index)">
				</icon>
			</view>
			<button
				class="add-btn"
				@click="addPrize">
				+添加获奖情况
			</button>
		</view>
		<!-- 自我介绍 -->
		<view class="card">
			<view class="h3">自我描述</view>
			<view class="item textArea">
				<textarea 
					style="height: 300rpx;" 
					placeholder-class="placeholderStyle"
					v-model="selfIntroduction"/>
			</view>
		</view>
		<!-- 按键 -->
		<view class="btns">
			<button class="preview" @click="preview">预览</button>
			<text class="small center">自动保存中\n......</text>
			<button class="save" @click="save">保存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: "", // 姓名
			contact: "", // 联系方式
			gender: "男", // 性别
			both: "", // 出生日期
			highestDegree: "", // 最高学历
			identity: "学生", // 当前身份
			currentGrade: "", // 当前年级
			workPlace: "", // 求职地点
			profession: "", // 期望职业
			eduExperience: [], // 教育经历
			selfExperience: [], // 个人经历
			proSkill: "", // 专业技能
			prizeList: [], // 荣誉情况
			selfIntroduction: "", // 自我介绍
			// 是否展示
			isBaseInfo: true,
			isEduExperience: true,
			// 选框列表 & 选中下标
			Degress: [], // 学历数组
			Grades: [], // 成绩等级
		}
	},
	methods: {
		/* 
			name: 添加教育经历
			description: 添加一组教育经历，往数组追加一组数据
			input: null
			return: null
			change: 
						eduExperience: Array,教育经历数组
		*/
		addEdu()
		{
			this.eduExperience.push({
				degree: "",
				school: "",
				specialty: "",
				grade: "",
				startTime: "",
				endTime: ""
			})
			console.log(this.eduExperience)
		},
		/*
			name: 删除教育经历
			description: 删除一组教育教育经历
			input: 
						index: Number,经历的下标
			return: null
			change: 
						eduExperience: Array,教育经历数组
		*/
	 removeEdu(index)
	 {
		 this.gShowModal("即将删除该教育经历",() => {
			 this.eduExperience.splice(index,1)
		 })
	 },
	 /*
			name: 添加个人经历
			description: 添加一组个人经历，往数组追加一组数据
			input: null
			return: null
			change: 
						selfExperience: Array,教育经历数组
		*/
	 addSelfExperience()
	 {
			this.selfExperience.push({
				organization: "",
				post: "",
				startTime: "",
				endTime: "",
				description: ""
			})
		},
	 /*
		name: 删除个人经历
		description: 删除一组个人经历
		input: 
					index: Number,经历的下标
		return: null
		change: 
					selfExperience: Array,教育经历数组
	*/
	 removeSelfExperience(index)
	 {
		 this.gShowModal("即将删除该个人经历",() => {
			 this.selfExperience.splice(index,1)
		 })
	 },
	 /*
	 		name: 添加获奖情况
	 		description: 添加一组获奖情况，往数组追加一组数据
	 		input: null
	 		return: null
	 		change: 
	 					prizeList: Array,获奖情况数组
	 	*/
	  addPrize()
	  {
	 		this.prizeList.push({
	 			name: "",
				time: "",
				description: ""
	 		})
	 	},
	  /*
	 	name: 删除获奖情况
	 	description: 删除一组获奖情况
	 	input: 
	 				index: Number,经历的下标
	 	return: null
	 	change: 
	 				prizeList: Array,教育经历数组
	 */
	  removePrize(index)
	  {
	 	 this.gShowModal("即将删除该获奖情况",() => {
	 		 this.prizeList.splice(index,1)
	 	 })
	  },
	 setDate(e)
	 {
		 console.log(e.detail.value)
	 }
	},
	created() {
		this.Degress = getApp().globalData.Degress
		this.Grades = getApp().globalData.Grads
	}
}
</script>

<style lang="stylus" scoped>
.resume
	width 100%
	min-height 100vh
	padding 30rpx 30rpx 100rpx 
	background-color var(--origin2)
	/* 不同种类卡片 */
	.card
		position relative
		margin-bottom 15px
		width 100%
		padding 40rpx 60rpx
		background-color #FFFFFF
		filter brightness(99%)
		border-radius 22px
		overflow hidden
		// 大标题
		.h3
			color #F39800
		// 添加按键
		.add-btn
			margin-top 30rpx
			border 1px solid var(--origin4)
			background-color transparent
			color var(--origin4)
			font-size 28rpx
			padding 5rpx
		// 小字提示
		.small
			color var(--gray-font)
		// 子元素
		.item
			position relative
			margin 20rpx 0
			display flex
			align-items center
			// 开头提示文字
			text
				margin-right 20rpx
				color var(--origin4)
				white-space nowrap
			// 输入框
			.value
				padding 5rpx 15rpx
				background-color var(--origin2)
				border-radius 20px
			/* 下拉框 */
			picker
				height 53rpx
				line-height 53rpx
				padding 0 30rpx
		/* 删除图标 */
		.remove
			position absolute
			right -20rpx
			top 0
		/* textarea输入 */
		.textArea
			display block
			textarea
				width 100%
				padding 5rpx 15rpx
				background-color var(--origin2)
				border-radius 15px
		/* 经历 */
		.edu, .self, .prize
			position relative
			margin-bottom 0 30px
			border-bottom 2px dotted var(--origin4)
			/* 最后一项不加边框 */
			&:last-of-type
				border none
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
				// 男生图标
				.female
					color #188cc9
				// 女生图标
				.male
					color #ce5d91
	/* 功能按键 */
	.btns
		position fixed
		bottom 0
		left 0
		right 0
		height 100rpx
		width 100%
		padding 0 5%
		background-color var(--origin4)
		border-top-left-radius 20px
		border-top-right-radius 20px
		display flex
		align-items center
		justify-content space-around
		.small
			flex 1
		button
			height 80rpx
			width 30%
			line-height 80rpx
			font-size 30rpx
			&.preview
				background-color transparent
				color #FFFFFF
				border 1px dotted #FFFFFF
</style>
