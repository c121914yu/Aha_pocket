<!-- 个人项目管理 -->
<template>
	<view class="my-resources">
		萨法
	</view>
</template>

<script>
import { getSelfProject } from "@/static/request/api_project.js"
export default {
	data() {
		return {
			
		}
	},
  created() {
    getSelfProject()
    .then(res => {
      console.log(res);
    })
  }
}
</script>

<style lang="stylus" scoped>

</style>
