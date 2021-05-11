# 竞赛资源贡献平台

### 1.4.0
time: 2021/5/7

**主要内容**

1. 设置团队模式，团队的增删查改，队员的增删查改
2. 团队详细界面，申请加入
3. 审批团队加入申请
4. 加载动画背景色改成局部而不是全屏
5. 重构部分代码，规范等(self目录完成)

**修复BUG**

1. 用到sync，有$emit("update:member")，会触发updateMember事件，把updateMember改名字

### 1.3.2
time: 2021/4/30

**主要内容**

1. 统一userTags组件
2. 简单设计服务外包
3. 区分测试版，体验版，上线版
4. 设计团队模式


### 1.3.1
time: 2021/4/19

**主要内容**

1. 在项目列表中增加匿名提示
2. 项目介绍里点击头像和项目介绍可以展示对应图片
3. 优化个人主页设计（关注，轨迹，简历）
4. 增加项目公开评论
5. 优化token刷新机制，增加重发防止并发请求报错。
6. 修改人才市场接口

**修复BUG**
1. 项目排序列表重复点击会触发刷新，先判断再触发更新

## 1.3.0
time: 2021/4/15

**更新内容**
1. 竞赛分类改成社区论坛
2. 设计竞赛组队界面
3. 设计人才市场界面
4. 利用story缓存用户等级图片，比赛等级图片
5. 设计匿名资源上传模块
6. 上传项目时采用promise链式结构优化代码结构
7. 通知数量大于99时，显示99+

**修复BUG**

1. md编辑器未返回BUG

### 1.2.5
time: 2021/3/24

**主要内容**

1. 优化阅读器

**修复BUG**
1. 更新个人信息时，统计信息会被覆盖掉 - 复制一份，赋值时加进去
2. 未签署协议下首次加载错误

### 1.2.4
time: 2021/2/20

**主要内容**

**修复BUG**
1. 选择器组件输入内容数据类型问题（兼容多类型输入）
2. 兴趣选择框不能滚动
3. 文件上传命名错误

### 1.2.3
time: 2021/2/9

**主要内容**
1. 系统公告优化
2. 文件上传-使用时间戳命名，防止编码错误
3. 优化搜索输入框
4. 视频压缩

### 1.2.2
time: 2021/2/8

**主要内容**
1. 个人界面
2. 版本监测
3. 标签自定义输入
4. 等级挂件

### 1.2.1
time: 2021/2/7

**主要内容**
1. 优化上传附件
2. 奖牌
3. 兑换码
4. 账单流水

### 1.2.0
time: 2021/2/6

**主要内容**
1. 上传附件修改
2. 项目详细修改
3. 轮播图设计
4. 优化部分加载动画，使用原生动画替代，防止卡顿
5. 优化消息通知

### 1.1.19
time: 2021/2/5

**主要内容**
1. 新版消息通知
2. 新版订单系统
3. 增加我的项目状态下标
4. 我的项目UI修改
5. 修改协议

**修复BUG**
1. 简历无法保存

### 1.1.18
time: 2021/2/2

**主要内容**
1. 更新用户协议
2. 重新设计简历模块

### 1.1.17
time: 2021/1/29

**主要内容**
1. 重构输入组件
2. 重构选择器组件（单列选择+日期选择）,统一的选择器的参数（label + value）
3. 修改实名认证界面
4. 设计已购项目界面

**修复BUG**
1. 上传项目时projectId未更新
2. 项目成员添加/修改问题
3. 上传附件时，若未上传前修改信息会报错。

### 1.1.16
time: 2021/1/22

**主要内容**
1. 系统公告
2. 修改上传附件界面，编辑附件信息弹窗
3. Aha点兑换弹窗
4. 优化奖牌样式
5. 订单跳转对应文件

**修复BUG**
1. 筛选弹窗滚动

**修复BUG**
1. 蒙层穿透问题

### 1.1.15
time: 2021/1/4

**主要内容：**
1. API变动：增加附件通过标志，未通过的附件不会被展示。若需要获取全部附件，需要额外调用API
2. 修改项目界面：分未通过模式和通过模式，通过模式仅展示通过的附件。

### 1.1.14
time: 2021/1/4

**主要内容：**
1. 文档阅读器
2. 优化字体加粗导致布局抖动
3. 邀请好友界面

**修复BUG：**
1. 未读消息不更新
2. 增加我的项目统计

### 1.1.13
time: 2021/1/3

主要内容：
1. 个人主页增加私信功能
2. 优化消息通知列表，简化消息通知
3. 修改MD编辑器，单独设置界面防止因返回造成界面丢失
4. 调整好订单界面（目前数据已成功）
5. 订单反馈

修复BUG：
1. 项目编辑中：头像和证明材料上传，用正则判断地址会导致手机上临时路径判定错误。取消正则判定，改成与原地址比较。
2. 项目编辑：compId和awardLevel计算错误

### 1.1.12
time 2021/1/2

主要内容：
1. 项目附件中增加type字段，设置菜单单选框对文件类型进行选择。
2. 完成项目中附件的获取
3. 成功分页获取预览文件（阅读器待设计）

### 1.1.11
time: 2020/12/30

主要内容：
1. 调整对象存储接口
2. 配置https接口完成
3. 未设计界面提示

修复BUG：
1. 签名板滑动

### 1.1.10
time: 2020/12/28

主要内容：
1. 增加自动设置调试模式
2. 隐藏返回主页按键
3. 设置Aha币充值弹窗
4. 

### 1.1.9
time: 2020/12/25

主要内容：
1. 增加联系客服功能
2. 优化部分界面

### 1.1.8
time: 2020/12/24

主要内容：
1. 修改项目筛选卡片样式
2. 优化加载动画

### 1.1.7
time: 2020/12/24

主要内容：
1. 修改项目卡片样式
2. 增加购买模块
3. 项目分享页头部排序筛选文字增设padding
4. 项目筛选弹窗增加空白处点击关闭

修复BUG：
1. 获取评论 - 新增评论后重新获取评论没有清空数组
2. 删除评论 - 未加入index参数

### 1.1.6
time: 2020/12/17

主要内容
1. 完成项目评价模块
2. 账单和钱包模块

### 1.1.5
time: 2020/12/14

主要内容：
1. 账号信息页设计（手机号微信号互相绑定，协议合同身份认证情况）
2. 绑定手机号
3. 上传附件时增加修改附件名和贡献度的输入框
4. 我的外包列表
5. 外包进度条设计
6. 重构项目详细设计，增加评论

### 1.1.4
time: 2020/12/5

主要内容：
1. 完善通知界面（列表，详细，发送）
2. 设计已购项目界面
3. 我的界面增加userId显示
4. 设计贡献度账单界面
5. 设计筛选弹窗
6. 优化分页获取，统一格式。触底加载不触发加载动画。
7. 修改项目头部导航改为绝对定位

修改BUG：
1. 项目成员排序错误

### 1.1.3
time: 2020/12/3

主要内容:
1. 调整API接口
2. 增设通知界面

### 1.1.2
time: 2020/11/24

主要内容:
1. 设计项目详细界面

修复BUG：
1. 标签空格替换时只替换了第一个

### 1.1.1
time: 2020/11/23

主要内容:
1. 编辑项目基本信息时，若未输入比赛名称则不会显示获奖等级，证明，时间属性。

修复BUG：
1. 上传项目时批量修改成员错误。原因是成员中去掉了projectId属性，需要从this中获取ProjectId
2. 个人标签选择完成后未修改界面内容

## 1.1.0
time: 2020/11/22

主要内容:
1. 设计服务外包列表界面
2. 设计服务外包详情界面
3. 设计用户信息界面
4. 修改简历预览获取数据模式（加载时判断是否从预览按键过来）

### 1.0.10
time: 2020/11/21

主要内容：
1. 完成项目管理设计（UI未定）
2. 主页接口调试完成
3. 简单排布项目详细
4. 完成项目介绍编辑字段

修改BUG：
1. 签署合同

### 1.0.10
time: 2020/11/17

主要内容：
1. 完成项目创建流程。
2. 调整项目相关的API接口
3. LOGO链接改成存储空间链接
4. 设计实名验证界面
5. 修正个人简历界面

修复BUG：
1. 头像上传

### 1.0.9
time: 2020/11/15

主要内容：
1. 资源改名为项目，项目中附件称为资源。
2. 基本完成项目创建流程,项目分享分为3步骤
3. 制作拖拽排序组件

### version 1.0.8
time: 2020/11/9

主要内容:
1. 资源主页设计
2. 资源上传界面修改
3. 获奖情况更改为单个

### version 1.0.7
time: 2020/11/5

主要内容:
1. 修改资源上传界面
2. 修改css全局颜色变量

### version 1.0.6
time: 2020/11/1

主要内容:
1. 优化简历接口（已测试）
2. 资源上传接口完成。
3. 头像预览，选择，上传接口完成。
4. 昵称修改接口完成。

修复BUG:
1. 请求时结束调用uni.hideLodaing导致toast内容直接被关闭
2. 简历和预览简历部分字段错误。

### version 1.0.5
time: 2020/10/27

主要内容
1. 对接简历接口。
2. 设计资源上传界面。
3. 用户须知弹窗。
4. 合同签署，电子签名。

### version 1.0.4
time: 2020/10/22

主要内容:
1. 完成简历预览界面。
2. 优化将本地数据写入data方式

修复BUG: 
1. 预览时未保存数据。

### version 1.0.3
time: 2020/10/21

主要内容:
1. 封装个人简历各个模块。
2. 完成个人简历数据获取。
3. 完成个人简历本地存储。

### version 1.0.2
time: 2020/10/20

主要内容:
1. 个人简历界面静态界面。

### version 1.0.1
time: 2020/10/18

主要内容:  
1. 部分个人简历界面。
2. 封装带搜索的输入框。
3. 封装选择器。

修复BUG: 
1. 个人界面头部的幕布阻碍点击。当其动画结束后，将z-index设置为-1即可。

### version 1.0.0
time: 2020/10/15

主要内容: 
1. 构建登录，注册，修改密码3个界面。
2. 主页面的底部TabBar导航。 
3. 个人界面静态样式。
4. 兴趣选择

## version 1.0
