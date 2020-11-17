<template>
	<view class="resource">
		<baseInfo 
			ref="baseInfo" 
			v-if="pageIndex === 0">
		</baseInfo>
		<fileInfo 
			ref="fileInfo" 
			v-if="pageIndex === 1" 
			:projectId="project.id">
		</fileInfo>
		<MemberInfo 
			ref="memberInfo" 
			v-if="pageIndex === 2" 
			:projectId="project.id">
		</MemberInfo>
		<!-- 导航 -->
		<view class="navs">
			
		</view>
	</view>
</template>

<script>
import { getProject } from "@/static/request/api_project.js"
import baseInfo from "./components/ProjectBase.vue"
import fileInfo from "./components/ProjectFile.vue"
import MemberInfo from "./components/ProjectMember.vue"
export default {
	data() {
		return {
			project: null,
			pageIndex: 0
		}
	},
	methods: {
		/* 
			name: 初始化页面信息
			desc: 将project的信息更新对应的组件页面中
		*/
		initPageInfo()
		{
			console.log(this.project);
		}
	},
	onLoad(e) {
		getProject(e.id)
		.then(res => {
			this.project = res.data
			this.initPageInfo()
		})
	},
	components: {
		baseInfo,
		fileInfo,
		MemberInfo,
	}
}
</script>

<style lang="stylus" scoped>

</style>
