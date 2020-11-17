<!-- 个人项目管理 -->
<template>
	<view class="my-resources">
		萨法
	</view>
</template>

<script>
import { getProjects } from "@/static/request/api_project.js"
export default {
	data() {
		return {
			projects: []
		}
	},
  created() {
    getProjects()
    .then(res => {
			this.projects = res.data
			console.log(res.data);
    })
  }
}
</script>

<style lang="stylus" scoped>

</style>
