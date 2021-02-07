<template>
	<view class="mdeditor"> 
		<editor
			id="editor"
			ref="editot"
			class="editor"
			placeholder="开始输入..."
			:show-img-size="true"
			:show-img-toolbar="true"
			:show-img-resize="true"
			@ready="onEditorReady"
			@input="editing"
		></editor>   
		<!-- 操作工具 -->
		<view class="tools" > 
			<eIcon
				type="&#xe64a;" 
				font-size="44rpx" 
				:color="showH1 ? activeColor : '#666666'"
				title="H1标题" 
				@click="setHeader('H1')">
			</eIcon>
			<eIcon
				type="&#xe9fd;" 
				font-size="44rpx" 
				:color="showH2 ? activeColor : '#666666'"
				title="H2标题" 
				@click="setHeader('H2')">
			</eIcon>
			<eIcon
				type="&#xe601;" 
				font-size="44rpx" 
				:color="showSuper ? activeColor : '#666666'"
				title="上标" 
				@click="setScript('super')">
			</eIcon>
			<eIcon
				type="&#xe601;" 
				font-size="44rpx" 
				:color="showSub ? activeColor : '#666666'"
				title="上标" 
				@click="setScript('sub')">
			</eIcon>
			<eIcon 
				type="&#xe61f;" 
				font-size="44rpx" 
				:color="showBold ? activeColor : '#666666'"
				title="加粗" 
				@click="setBold">
			</eIcon>
			<eIcon 
				type="&#xe661;" 
				font-size="44rpx" 
				:color="showIns ? activeColor : '#666666'"
				title="下划线"
				@click="setIns">
			</eIcon>
			<eIcon 
				type="&#xe6a2;" 
				font-size="44rpx" 
				:color="showCenter ? activeColor : '#666666'"
				title="居中" 
				@click="setAlign('center')">
			</eIcon>
			<eIcon 
				type="&#xe607;" 
				font-size="44rpx" 
				:color="showRight ? activeColor : '#666666'"
				title="居右" 
				@click="setAlign('right')">
			</eIcon>
			<eIcon 
				type="&#xe604;" 
				font-size="44rpx" 
				title="分割线" 
				@click="insertDivider">
			</eIcon>
			<eIcon
				type="&#xeaf2;" 
				font-size="44rpx" 
				title="插入图片" 
				@click="insertImage">
			</eIcon>
			<eIcon 
				type="&#xe696;" 
				font-size="44rpx" 
				title="撤销" 
				@click="undo">
			</eIcon>
			<eIcon 
				type="&#xe602;" 
				font-size="44rpx" 
				title="完成" 
				@click="finish">
			</eIcon>
		</view>
	</view>
</template>

<script>
import eIcon from './icon'
import { getPublicFileSign } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
			showH1: false,
			showH2: false,
			showSub: false,
			showSuper: false,
			showBold: false,
			showIns: false,
			showCenter: false,
			showRight: false,
			activeColor: '#f8b62d'
		}
	},
	components: {
		eIcon
	},
	methods: {
		/* 加载完成 */
		onEditorReady() 
		{
			uni.createSelectorQuery()
				.in(this)
				.select('.editor')
				.fields({
					size: true,
					context: true
				},res => {
					this.editorCtx = res.context;
					this.editorCtx.setContents({
						html: getApp().globalData.gEditContent
					})
				})
				.exec()
		},
		/* 监听输入内容，实时触发input方法 */
		editing(e)
		{
			let insert = e.target.delta.ops
			insert = insert[insert.length-1]
			/* 如果为换行，则清空h1,h2样式 */
			if(!insert.attributes && (insert.insert.charAt(insert.length-2) == "\n" || insert.insert[0] == "\n")){
				this.showH1 = false
				this.showH2 = false
			}
			this.$emit("input",JSON.stringify(e.target.delta))
		},
		/* 设置标题 */
		setHeader(val) 
		{
			if(val === "H1")
			{
				this.showH1 = !this.showH1
				this.showH2 = false
				this.editorCtx.format('header', this.showH1 ? val : false)
			}
			else if(val === "H2")
			{
				this.showH2 = !this.showH2
				this.showH1 = false
				this.editorCtx.format('header', this.showH2 ? val : false)
			}
		},
		/* 设置上下标 */
		setScript(val)
		{
			if(val === "sub")
			{
				this.showSub = !this.showSub
				this.showSuper = false
				this.editorCtx.format('script', this.showSub ? val : false)
			}
			else if(val === "super")
			{
				this.showSuper = !this.showSuper
				this.showSub = false
				this.editorCtx.format('script', this.showSuper ? val : false)
			}
		},
		/* 设置粗体 */
		setBold() 
		{
			this.showBold = !this.showBold;
			this.editorCtx.format('bold');
		},
		/* 下划线 */
		setIns() 
		{
			this.showIns = !this.showIns;
			this.editorCtx.format('ins');
		},
		/* 对齐方向 */
		setAlign(val)
		{
			if(val === "center")
			{
				this.showCenter = !this.showCenter
				this.showRight = false
				this.editorCtx.format('align', this.showCenter ? val : false)
			}
			else if(val === "right")
			{
				this.showRight = !this.showRight
				this.showCenter = false
				this.editorCtx.format('align', this.showRight ? val : false)
			}
		},
		/* 插入分割线 */
		insertDivider() 
		{
			this.editorCtx.insertDivider();
		},
		/* 插入图片 */
		insertImage() 
		{
			uni.showLoading({
				title: "上传图片中...",
				mask: true
			})
			let success = 0
			uni.chooseImage({
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				success:  (imgs) => {
					imgs.tempFilePaths.forEach(url => {
						/* 获取签名 */
						getPublicFileSign(`${Date.now()}.JPG`)
						.then(signature => {
							/* 上传文件 */
							this.gUploadFile(url,signature.data)
							.then(res => {
								/* 插入图片 */
								this.editorCtx.insertImage({
									src: res.header.Location, 
									alt: "插图",
									width: "100%"
								})
								/* 判断上传进度，全部上传了则关闭等待 */
								success++
								if(success === imgs.tempFilePaths.length){
									this.gToastSuccess("上传图片成功")
									uni.hideLoading()
								}
							})
							.catch((err) => {
								this.gToastError("上传图片失败")
								success++
								if(success === imgs.tempFilePaths.length){
									uni.hideLoading()
								}
							})
						})
						.catch(() => {
							this.gToastError("上传图片失败")
							success++
							if(success === imgs.tempFilePaths.length){
								uni.hideLoading()
							}
						})
					})
				},
				fail() {
					uni.hideLoading()
				}
			})
		},
		/* 撤回 */
		undo() 
		{
			this.editorCtx.undo();
		},
		finish() 
		{
			this.editorCtx.getContents({
				success: (res) => {
					getApp().globalData.gEditContent = res.html
					uni.navigateBack({
						delta: 1
					})
				} 
			})
		},
	}
}
</script>

<style lang="stylus" scoped>
.mdeditor
	box-sizing border-box
	height 100vh
	padding 30rpx
	padding-bottom 220rpx
	.editor
		height 100%
		font-size 32rpx
		width: 100%
	.tools
		position: fixed
		bottom: 0
		left: 0
		width: 100vw
		background #eee
		display grid
		grid-template-columns repeat(6,1fr)
	img
		border-radius 8px
</style>
