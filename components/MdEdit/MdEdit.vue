<template>
	<view class="mdeditor" :style="{paddingBottom: showMoreTool ? '220rpx' : '120rpx'}"> 
		<editor
			id="editor"
			ref="editot"
			class="editor"
			:placeholder="placeholder"
			:show-img-size="true"
			:show-img-toolbar="true"
			:show-img-resize="true"
			@ready="onEditorReady"
			@statuschange="statuschange"
			@input="editing"
		></editor>   
		<!-- 操作工具 -->
		<view class="tools" > 
			<eIcon
				type="&#xe6e3;" 
				font-size="44rpx" 
				:color="showH1 ? activeColor : '#666666'"
				title="H1标题" 
				@click="setHeader('H1')">
			</eIcon>
			<eIcon
				type="&#xe6e3;" 
				font-size="44rpx" 
				:color="showH2 ? activeColor : '#666666'"
				title="H2标题" 
				@click="setHeader('H2')">
			</eIcon>
			<eIcon 
				type="&#xe6e7;" 
				font-size="44rpx" 
				:color="showBold ? activeColor : '#666666'"
				title="加粗" 
				@click="setBold">
			</eIcon>
			<eIcon 
				type="&#xe6fe;" 
				font-size="44rpx" 
				:color="showItalic ? activeColor : '#666666'"
				title="斜体" 
				@click="setItalic">
			</eIcon>
			<eIcon 
				type="&#xe6f8;" 
				font-size="44rpx" 
				:color="showIns ? activeColor : '#666666'"
				title="分割线"
				@click="setIns">
			</eIcon>
			<eIcon 
				type="&#xe6f1;" 
				font-size="44rpx" 
				:color="showCenter ? activeColor : '#666666'"
				title="居中" 
				@click="setCenter">
			</eIcon>
			<eIcon 
					type="&#xe6ed;" 
					font-size="44rpx" 
					:color="showRight ? activeColor : '#666666'"
					title="居右" 
					@click="setRight">
				</eIcon>
			<eIcon
				type="&#xe6f3;" 
				font-size="44rpx" 
				title="插入图片" 
				@click="insertImage">
			</eIcon>
			<eIcon 
				type="&#xe6eb;" 
				font-size="44rpx" 
				title="分割线" 
				@click="insertDivider">
			</eIcon>
			<eIcon 
				type="&#xe6e8;" 
				font-size="44rpx" 
				title="撤销" 
				@click="undo">
			</eIcon>
			<eIcon 
				type="&#xe705;" 
				font-size="44rpx" 
				title="重做" 
				@click="redo">
			</eIcon>
			<eIcon 
				type="&#xeb8a;" 
				font-size="44rpx" 
				title="设置" 
				@click="finish">
			</eIcon>
		</view>
	</view>
</template>

<script>
import eIcon from './icon';
export default {
	props: {
		// 占位符
		placeholder: {
			type: String,
			default: '开始输入...'
		},
		// 初始化html
		html: {
			type: String,
			default: ""
		},
		delta: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			showH1: false,
			showH2: false,
			showBold: false,
			showItalic: false,
			showIns: false,
			showCenter: false,
			showRight: false,
			showSettingLayer: false,
			activeColor: '#f8b62d'
		};
	},
	components: {
		eIcon
	},
	methods: {
		/* 加载完成 */
		onEditorReady() 
		{
			const delta = this.delta ? JSON.parse(this.delta) : ''
			uni.createSelectorQuery()
				.in(this)
				.select('.editor')
				.fields({
					size: true,
					context: true
				},res => {
					this.editorCtx = res.context;
					this.editorCtx.setContents({
						delta
					})
				})
				.exec()
		},
		/* 监听输入内容，实时触发input方法 */
		editing(e)
		{
			this.$emit("input",JSON.stringify(e.target.delta))
		},
		/* 下一步 */
		undo() 
		{
			this.editorCtx.undo();
		},
		/* 撤回 */
		redo() 
		{
			this.editorCtx.redo();
		},
		/* 插入图片 */
		insertImage() 
		{
			this.editorCtx.insertImage({
				src: "http://blogs.jinlongyuchitang.cn/background.jpg",  // 此处需要将图片地址切换成服务器返回的真实图片地址
				alt: '图片',
				success: function(e) {}
			})
		},
		/* 设置标题 */
		setHeader(val) {
			if(val === "H1")
			{
				this.showH1 = !this.showH1
				this.editorCtx.format('header', this.showH1 ? val : false)
			}
			else if(val === "H2")
			{
				this.showH2 = !this.showH2
				this.editorCtx.format('header', this.showH2 ? val : false)
			}
		},
		insertDivider() {
			this.editorCtx.insertDivider();
		},
		showMore() {
			this.showMoreTool = !this.showMoreTool;
			this.editorCtx.setContents()
		},
		setBold() {
			this.showBold = !this.showBold;
			this.editorCtx.format('bold');
		},
		setItalic() {
			this.showItalic = !this.showItalic;
			this.editorCtx.format('italic');
		},
		checkStatus(name, detail, obj) {
			if (detail.hasOwnProperty(name)) {
				this[obj] = true;
			} else {
				this[obj] = false;
			}
		},
		statuschange(e) {
			var detail = e.detail;
			this.checkStatus('bold', detail, 'showBold');
			this.checkStatus('italic', detail, 'showItalic');
			this.checkStatus('ins', detail, 'showIns');
			this.checkStatus('header', detail, 'showHeader');
			if (detail.hasOwnProperty('align')) {
				if (detail.align == 'center') {
					this.showCenter = true;
					this.showRight = false;
				} else if (detail.align == 'right') {
					this.showCenter = false;
					this.showRight = true;
				} else {
					this.showCenter = false;
					this.showRight = false;
				}
			} else {
				this.showCenter = false;
				this.showRight = false;
			}
		},
		setIns() {
			this.showIns = !this.showIns;
			this.editorCtx.format('ins');
		},
		setCenter() {
			this.showCenter = !this.showCenter;
			this.editorCtx.format('align', this.showCenter ? 'center' : false);
		},
		setRight() {
			this.showRight = !this.showRight;
			this.editorCtx.format('align', this.showRight ? 'right' : false);
		},
		finish() {
			this.showSettingLayer = false;
			this.editorCtx.getContents({
				success: res => {
					console.log(res);
					this.$emit('editOk', res.html);
				} 
			})
		},
	}
}
</script>

<style lang="stylus">
.mdeditor
	box-sizing border-box
	height 100vh
	padding 30rpx
	padding-bottom 120rpx
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
</style>
