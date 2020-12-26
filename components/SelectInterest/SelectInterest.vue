<template>
    <view class="select-interest">
        <!-- 蒙层 -->
        <view class="mask"></view>
        <!-- 主体内容 -->
        <view class="content">
            <!-- 标题 -->
            <view class="h3">根据需求为你定制推荐内容</view>
            <view class="arrow-right" @click="$emit('close')">
                <text class="iconfont icon-arrow-right icon"></text>
                <text class="text small">跳过</text>
            </view>
            <!-- 标签选择 -->
            <view class="select">
                <view class="title strong">个人({{specialtyAmount}} / 4)</view>
                <view class="select-box">
                    <view 
                        class="item" 
                        v-for="(tag, index) in specialtyTags" 
                        :key="index" 
                        @click="selectTag('specialtyAmount',tag)">
                        <text class="strong">{{ tag.text }}</text>
                        <view class="circle-out">
                            <view
                                class="in"
                                :style="{
                                    'background-color': tag.select ? '#e60012' : '#f39800'
                                }"
                            ></view>
                        </view>
                    </view>
                </view>
                <view class="title strong">竞赛({{compAmount}} / 4)</view>
                <view class="select-box">
                    <view 
                        class="item compete" 
                        v-for="(tag, index) in compTags" 
                        :key="index" 
                        @click="selectTag('compAmount',tag)">
                        <view class="strong">{{ tag.text }}</view>
                        <view class="circle-out">
                            <view
                                class="in"
                                :style="{
                                    'background-color': tag.select ? '#e60012' : '#f39800'
                                }"
                            ></view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 底部按键 -->
            <view class="bottom"><button @click="sure">确认</button></view>
        </view>
    </view>
</template>

<script>
import { putMe } from '@/static/request/api_userInfo.js';
export default {
    data() {
        return {
            specialtyTags: [
                { text: '前端', select: false },
                { text: '后端', select: false },
                { text: '爬虫', select: false },
                { text: '视觉', select: false },
                { text: '图像处理', select: false },
                { text: '大数据分析', select: false },
                { text: 'PPT', select: false },
                { text: '商业模式', select: false }
            ],
            compTags: [
                { text: '互联网+', select: false },
                { text: '挑战杯', select: false },
                { text: '服务外包', select: false },
                { text: '电子商务', select: false },
                { text: '数据挖掘大赛', select: false },
                { text: '智能车竞赛', select: false },
                { text: '机器人竞赛', select: false },
                { text: '运河杯', select: false }
            ]
        };
    },
    computed: {
        specialtyAmount(){
			if(this.specialtyTags)
				return this.specialtyTags.filter(item => item.select).length
			return 0
        },
        compAmount(){
			if(this.compTags)
				return this.compTags.filter(item => item.select).length
			return 0
        }
    },
    methods: {
        /* 点击标签，切换选中状态 */
        selectTag(key,tag) {
            if (!tag.select) {
                if (this[key] < 4) 
                    tag.select = !tag.select
            } 
            else{
              tag.select = !tag.select  
            }
        },
        /* 点击确认 */
        sure() {
            const specialtyTags = this.specialtyTags.filter(item => item.select).map(item => item.text).join(',')
            const compTags = this.compTags.filter(item => item.select).map(item => item.text).join(',');
            putMe({
                specialtyTags,
                compTags
            })
            .then(res => {
                this.gPutUserInfo({
                    specialtyTags,
                    compTags
                });
                this.gToastSuccess('选择成功')
                this.$emit('close')
            })
        }
    },
    created() {
        /* 获取已经选择的标签，将其设置为true */
        let specialtyTags = getApp().globalData.gUserInfo.userInfo.specialtyTags
		specialtyTags = specialtyTags ? specialtyTags.split(',') : []
        let compTags = getApp().globalData.gUserInfo.userInfo.compTags
		compTags = compTags ? compTags.split(',') : []
        this.specialtyTags.forEach(tag => {
            if (specialtyTags.indexOf(tag.text) > -1) tag.select = true
        })
        this.compTags.forEach(tag => {
            if (compTags.indexOf(tag.text) > -1) tag.select = true
        })
    }
};
</script>

<style lang="stylus" scoped>
.select-interest
    z-index 100
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    animation show 0.6s ease
    @keyframes show
        0%
            transform translateY(100%)
        100%
            transform translateY(0)
    .mask
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background-color rgba(0, 0, 0, 0.3)
    .content
        position relative
        z-index 100
        margin-top 10vh
        height 90vh
        width 100%
        background-image linear-gradient(#fffef7, #f7d7b9)
        border-top-left-radius 22px
        border-top-right-radius 22px
        .h3
            padding 20px 20px 40px 20px
            color var(--origin1)
        .arrow-right
            position absolute
            right 20px
            top 15px
            display flex
            flex-direction column
            align-items center
            .icon
                line-height 0.8
                font-size 100rpx
                color var(--origin2)
                text-shadow var(--shadow2)
            .text
                color var(--origin2)
    .select
        width 100%
        height 100%
        overflow-y scroll
        .title
            position relative
            margin-bottom 30rpx
            display flex
            align-items center
            justify-content center
            color var(--origin2)
            &::before
                content ''
                position absolute
                margin-left -100px
                width 22%
                height 2px
                background-color var(--origin2)
                border-radius 10px
            &::after
                content ''
                position absolute
                margin-left 100px
                width 22%
                height 2px
                background-color var(--origin2)
                border-radius 10px
        .select-box
            margin-bottom 20px
            &:last-child
                margin-bottom 170px
            padding 0 20px
            display grid
            grid-template-columns 1fr 1fr
            grid-gap 15px
            .item
                height 45px
                width calc(100% - 25px)
                padding 0 10px 0 15px
                background-color var(--origin3)
                border-radius 16px
                box-shadow var(--shadow2)
                font-size 26rpx
                display flex
                align-items center
                justify-content space-between
                &.compete
                    height 70px
                    padding 10px 10px 10px 15px
                    align-items flex-start
                    .strong
                        height 100%
                        display flex
                        align-items flex-end
                .circle-out
                    width 30px
                    height 30px
                    opacity 0.6
                    border-radius 50%
                    background-color var(--bg-color1)
                    display flex
                    align-items center
                    justify-content center
                    .in
                        width 22px
                        height 22px
                        border 1px solid #999999
                        border-radius 50%
    .bottom
        position absolute
        bottom 0
        padding 5px 0
        width 100%
        background-color #FFFFFF
        border-top-left-radius 40px
        border-top-right-radius 40px
        button
            margin 10px auto
            width 70%
            font-size 32rpx
            color #FFFFFF
            background-color var(--origin2)
</style>
