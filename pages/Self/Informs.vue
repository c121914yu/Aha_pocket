<!-- 通知 -->
<template>
	<view class="inform">
		<!-- 清除未读 -->
		<view class="head small">
			<text>有<text class="strong">5</text>条消息未读取</text>
			<text class="iconfont icon-clear"></text>
			<text class="strong">清除未读</text>
		</view>
		<!-- 通知列表 -->
		<view class="informs">
			<navigator 
				class="item"
				hover-class="none"
				v-for="(item,index) in informs"
				:key="index"
				:url="'Inform?id='+index">
					<image 
						:class="item.read ? '' : 'unread'"
						src="https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png">
					</image>
					<view class="right small">
						<view class="title">
							<text class="name">{{item.name}}</text>
							<text class="time">{{item.time}}</text>
						</view>
						<view class="content">{{item.content}}</view>
					</view>
			</navigator>
		</view>
        <view class="remark small center">{{loadText}}</view>
        <!-- 加载动画 -->
        <Loading ref="loading"></Loading>
    </view>
</template>

<script>
import { getMessages } from "@/static/request/api_userInfo.js"
export default {
	data() {
		return {
            pageNum: 1,
            pageSize: 20,
            loadStatus: 0,
			informs: [
				{name: "项目审核通知",content: "撒搭嘎搭嘎多少个sad广撒点阿搭嘎搭嘎大使馆的撒都是搞当",time: "12:28"},
				{name: "项目审核通知",content: "撒搭嘎搭嘎多少个sad广撒点",time: "2020-11-16"},
				{name: "项目审核通知",content: "撒搭嘎搭嘎多少个sad广撒点",time: "2020-11-16"},
				{name: "项目审核通知",content: "撒搭嘎搭嘎多少个sad广撒点少时诵诗书少时诵诗书是是是宿舍所所所所所所",time: "2020-11-15"},
				{name: "项目审核通知",content: "撒搭嘎搭嘎多少个sad广撒点",time: "2020-11-14"},
			]
		}
	},
    computed: {
    	loadText(){
    		switch(this.loadStatus){
    			case 0: return ""
    			case 1: return "加载中..."
                case 2: return "已加载全部"
    		}
    	}
    },
    methods: {
        /* 获取消息列表 */
        getMsg()
        {
           this.gLoading(this,true)
           if(this.loadStatus === 0){
               getMessages({
                   pageNum: this.pageNum,
                   pageSize: this.pageSize
               }) 
               .then(res => {
                    if(res.data.pageSize < this.pageSize)
                       this.loadStatus = 2
                    else{
                        this.pageNum++
                        this.loadStatus = 0
                    }
                    this.gLoading(this,false)
                    console.log(res)
               })
               .catch(err => {
                   this.gLoading(this,false)
               })
           }
        }
    },
    onLoad(){
        this.getMsg()
    }
}
</script>

<style lang="stylus" scoped>
.inform
	background-color #f9f9f9
	min-height 100vh
	.head
		padding 10px
		color var(--gray1)
		.iconfont
			margin 0 2px 0 10px
    /* 通知列表*/
	.informs
		box-shadow var(--shadow2)
		.item
			padding 10px
			background-color #FFFFFF
			display flex
			image
				position relative
				width 50px
				height 50px
				border-radius 4px
				&.unread::after
					z-index 10
					content ""
					position absolute
					top 0
					right 0
					width 8px
					height 8px
					border-radius 50%
					background-color #F56C6C
			.right
				flex 1
				margin-left 5px
				padding-bottom 5px
				border-bottom 1px solid var(--gray2)
				.title
					display flex
					justify-content space-between
					.time
						font-size 24rpx
						color var(--gray2)
				.content
					margin-top 4px
					width calc(100vw - 75px)
					color var(--gray1)
					text-overflow:ellipsis;
					white-space nowrap
					overflow hidden
					text-overflow ellipsis
    .remark{
        margin-top: 10px;
        color: var(--gray1);
    }                
</style>
