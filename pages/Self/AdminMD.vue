<!-- 管理员编写md内容 -->
<template>
	<view>
		<MdEdit :html="html" placeholder="输入编辑内容" @editOk="editOk"></MdEdit>
	</view>
</template>

<script>
export default {
	data() {
		return {
			html: ""
		}
	},
	onLoad() {
		this.html = uni.getStorageSync("adminEdit")
	},
	methods: {
		editOk(e)
		{
			uni.setStorage({
				key: "adminEdit",
				data: e
			})
			/* 复制到剪切板 */
			uni.setClipboardData({
			    data: e,
			    success: () => {
			        this.gToastSuccess("已复制到剪切板")
			    }
			})
		}
	}
}
</script>

<style lang="stylus">

</style>
