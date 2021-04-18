import request from "./request.js"

/* 获取上传头像/证明材料签名 */
exports.getPublicSignature = (filename) => request("/project/sign/upload/public?filename="+filename,"GET",{})

/* 创建项目数据，保存至数据库 */
exports.postProject = (data) => request("/project","POST",data)
/* 获取所有项目粗略信息表
	@params pageNum:Number 第几页
	@params	pageSize:Number 每页的条数
    @params userId:Number 用户userId
    @params compId:Number 竞赛Id
    @params awardLevel:Number 获奖等级
    @params sortBy:String 排序字段
    @params orderBy:String 排序方式
*/
exports.getProjects = (params) => request("/project","GET",params)
/* 获取个人项目列表 */
exports.getMeProjects = (params) => request("/project/me","GET",params)
/* 获取项目详细信息 */
exports.getProject = (projectId) => request(`/project/${projectId}`,"GET",{})
/* 更新项目详细信息 */
exports.putProject = (projectId,data) => request(`/project/${projectId}`,"PUT",data)
/* 删除项目 */
exports.deleteProject = (projectId) => request(`/project/${projectId}`,"DELETE",{})
/* 获取评论
	@prams	pageNum: Number,页码
	@prams	pageSize: Number,分页大小
	@prams	projectId: Number,项目ID
	@prams	resourceId: Number,资源ID（可选)
*/
exports.getRemarks = (params) => request(`/project/resource/score`,"GET",params)
/* 评价 */
exports.postRemark = (projectResourceId,data) => request(`/project/resource/score/${projectResourceId}`,"POST",data)
/* 删除评价 */
exports.deleteRemark = (commentId) => request(`/project/resource/score/${commentId}`,"DELETE",{})
/* 获取公开评论 */
exports.getPublicComments = (params) => request(`/project/discuss/${params.projectId}`,"GET",params)
/* 新建公开评论 */
exports.postPublicComment = (data) => request(`/project/discuss`,"POST",data)
/* 删除公开评论 */
exports.deletePublicComment = (commentId) => request(`/project/discuss/${commentId}`,"DELETE",{})

/* 判断是否收藏 */
exports.isCollected = (projectId) => request(`/project/collection/check/${projectId}`,"GET",{})
/* 收藏项目 */
exports.collectProject = (projectId) => request(`/project/collection/${projectId}`,"POST",{})
/* 取消收藏 */
exports.cancleCollectProject = (projectId) => request(`/project/collection/${projectId}`,"DELETE",{})

/* 获取项目所有资源信息 */
exports.getResources = (params) => request(`/project/${params.projectId}/resources`,"GET",params)
/* 获取上传文件签名 */
exports.getFilesSignature = (projectId,filename) => request(`/project/${projectId}/resources/sign/upload/private?filename=${filename}`,"GET",{})
/* 创建项目的资源信息 */
exports.postResource = (projectId,data) => request(`/project/resource/${projectId}`,"POST",data)
/* 删除资源 */
exports.deleteResource = (projectResourceId) => request(`/project/resource/${projectResourceId}`,"DELETE",{})
/* 修改资源信息 */
exports.putResource = (projectResourceId,data) => request(`/project/resource/${projectResourceId}`,"PUT",data)
/* 获取下载签名 */
exports.getLoadSignature = (projectResourceId) => request(`/project/resource/${projectResourceId}/sign/download`,"GET",{})
/* 获取阅读签名 */
exports.getReadSignature = (projectResourceId) => request(`/project/resource/${projectResourceId}/sign/read`,"GET",{})

/* 创建成员 */
exports.postMember = (projectId,data) => request(`/project/member/${projectId}`,"POST",data)
/* 更新成员 */
exports.putMember = (projectId,memberUserId,data) => request(`/project/member/${projectId}/${memberUserId}`,"PUT",data)
/* 批量更新成员 */
exports.putMembers = (projectId,data) => request(`/project/members/${projectId}`,"PUT",data)
/* 删除成员 */
exports.deleteMember = (projectId,memberPhone) => request(`/project/member/${projectId}/${memberPhone}`,"DELETE",{})

/* 申请认领资源 */
exports.postApplyProject = (data) => request("/project/find","POST",data)
/* 修改申请 */
exports.putApplyProject = (data) => request(`/project/find/${data.applyingID}`,"PUT",data)
/* 判断用户是否已经提交认领 */
exports.getApplyProject = (projectId) => request(`/project/find/judge/${projectId}`,"GET",{})
