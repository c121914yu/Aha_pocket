<template>
	<view class="read-file">
		<video v-if="url" :src="url" autoplay></video>
		<Loading ref="loading"></Loading>
	</view>
</template>

<script>
import { getLoadSignature } from '@/static/request/api_project.js'
export default {
	data() {
		return {
			id: null,
			url: null
		}
	},
	onLoad(e) {
		this.id = Number(e.id)
		this.loadFile()
	},
	methods: {
		loadFile()
		{
			this.gLoading(this,true)
			getLoadSignature(this.id)
			.then(res => {
				this.url = res.data.url
				this.gLoading(this,false)
			})
			.catch(err => {
				this.gLoading(this,false)
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.read-file
	video
		width 100%
</style>
