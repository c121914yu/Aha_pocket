/* 项目相关 */
import request from "./request.js"

/**
 * 获取公共文件上传签名
 * @param {String}  filename
 */
exports.getPublicSignature = (filename) => request(`/project/sign/upload/public?filename=${filename}`,"GET")

/**
 * 创建项目
 * @param {String}  name
 * @param {String}  avatarUrl
 * @param {Number}  compId 比赛外键
 * @param {String}  compName 比赛名
 * @param {Number}  awardLevel 获奖等级
 * @param {String}  tags
 * @param {Date}  awardTime 获奖时间
 * @param {String}  awardProveUrl
 * @param {String}  intro
 * @param {Boolean}  isAnonymous 是否为匿名资源
 */
exports.postProject = (data) => request("/project","POST",data)

/**
 * 获取所有项目粗略信息表
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {Number}  userId 根据用户ID筛选
 * @param {Number}  compId 根据比赛ID筛选
 * @param {Number}  awardLevel 根据获奖等级筛选
 * @param {String}  sortBy 排序字段
 * @param {String}  orderBy 排序方式
 */
exports.getProjects = (params) => request("/project","GET",params)

/**
 * 获取个人项目列表
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {Number}  compId 根据比赛ID筛选
 * @param {Number}  awardLevel 根据获奖等级筛选
 * @param {String}  sortBy 排序字段
 * @param {String}  orderBy 排序方式
 */
exports.getMeProjects = (params) => request("/project/me","GET",params)

/**
 * 获取项目详细信息
 * @param {Number}  projectId
 */
exports.getProject = (projectId) => request(`/project/${projectId}`,"GET",{})

/**
 * 更新项目详细信息
 * @param {Number}  projectId
 * @param {String}  name
 * @param {String}  avatarUrl
 * @param {Number}  compId 比赛外键
 * @param {String}  compName 比赛名
 * @param {Number}  awardLevel 获奖等级
 * @param {String}  tags
 * @param {Date}  awardTime 获奖时间
 * @param {String}  awardProveUrl
 * @param {String}  intro
 */
exports.putProject = (projectId,data) => request(`/project/${projectId}`,"PUT",data)

/**
 * 删除项目
 * @param {Number}  projectId
 */
exports.deleteProject = (projectId) => request(`/project/${projectId}`,"DELETE",{})

/**
 * 获取个人项目列表
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {Number}  projectId
 */
exports.getRemarks = (params) => request(`/project/resource/score`,"GET",params)

/**
 * 发布评论
 * @param {Number}  resourceId 附件ID
 * @param {Number} score 评分
 * @param {String}  comment 内容
 */
exports.postRemark = (resourceId,data) => request(`/project/resource/score/${resourceId}`,"POST",data)

/**
 * 删除评价
 * @param {Number}  commentId
 */
exports.deleteRemark = (commentId) => request(`/project/resource/score/${commentId}`,"DELETE")

/**
 * 获取公开评论
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {Number}  projectId
 */
exports.getPublicComments = (params) => request(`/project/discuss/${params.projectId}`,"GET",params)

/**
 * 新建公开评论
 * @param {Number}  projectId 项目ID
 * @param {String}  comment 内容
 */
exports.postPublicComment = (data) => request(`/project/discuss`,"POST",data)

/**
 * 删除公开评论
 * @param {Number}  commentId
 */
exports.deletePublicComment = (commentId) => request(`/project/discuss/${commentId}`,"DELETE")

/**
 * 判断是否收藏
 * @param {Number}  projectId
 */
exports.isCollected = (projectId) => request(`/project/collection/check/${projectId}`,"GET")

/**
 * 收藏项目
 * @param {Number}  projectId
 */
exports.collectProject = (projectId) => request(`/project/collection/${projectId}`,"POST")

/**
 * 取消收藏项目
 * @param {Number}  projectId
 */
exports.cancleCollectProject = (projectId) => request(`/project/collection/${projectId}`,"DELETE")

/**
 * 获取项目所有资源信息
 * @param {Number}  projectId
 * @param {Boolean}  edit 是否处于编辑模式（项目管理员专属)
 */
exports.getResources = ({projectId,edit}) => request(`/project/${projectId}/resources?edit=${edit}`,"GET")

/**
 * 获取上传文件签名
 * @param {Number}  projectId
 * @param {String}  filename
 */
exports.getFilesSignature = (projectId,filename) => request(`/project/${projectId}/resources/sign/upload/private?filename=${filename}`,"GET")

/**
 * 创建项目的资源信息
 * @param {Number}  projectId
 * @param {String}  name
 * @param {Number}  fileType 参考garr_fileClassify
 * @param {String}  filename 保存在oss里的资源文件名(包括前缀)
 * @param {Number}  price
 */
exports.postResource = (projectId,data) => request(`/project/resource/${projectId}`,"POST",data)

/**
 * 删除资源
 * @param {Number}  resourceId
 */
exports.deleteResource = (resourceId) => request(`/project/resource/${resourceId}`,"DELETE",{})

/**
 * 修改资源信息
 * @param {Number}  resourceId
 * @param {String}  name
 * @param {Number}  fileType 参考garr_fileClassify
 * @param {String}  filename 保存在oss里的资源文件名(包括前缀)
 * @param {Number}  price
 */
exports.putResource = (resourceId,data) => request(`/project/resource/${resourceId}`,"PUT",data)

/**
 * 获取下载签名
 * @param {Number}  resourceId
 */
exports.getLoadSignature = (resourceId) => request(`/project/resource/${resourceId}/sign/download`,"GET",{})

/**
 * 获取阅读签名
 * @param {Number}  resourceId
 */
exports.getReadSignature = (resourceId) => request(`/project/resource/${resourceId}/sign/read`,"GET",{})

/*  */
/**
 * 创建项目成员
 * @param {Number}  projectId
 * @param {Number}  memberUserId 成员ID
 * @param {Number}  rank 排名
 * @param {String}  job 职务
 * @param {Boolean}  editable 是否可编辑项目信息
 */
exports.postMember = (projectId,data) => request(`/project/member/${projectId}`,"POST",data)

/**
 * 更新项目单个成员信息
 * @param {Number}  projectId
 * @param {Number}  memberUserId 成员ID
 * @param {Number}  rank 排名
 * @param {String}  job 职务
 * @param {Boolean}  editable 是否可编辑项目信息
 */
exports.putMember = (projectId,memberUserId,data) => request(`/project/member/${projectId}/${memberUserId}`,"PUT",data)

/**
 * 批量更新项目成员
 * @param {Number}  projectId
 * @param {Array}  body 内容同上
 */
exports.putMembers = (projectId,data) => request(`/project/members/${projectId}`,"PUT",data)

/**
 * 删除成员
 * @param {Number}  projectId
 * @param {Number}  memberUserId 成员ID
 */
exports.deleteMember = (projectId,memberUserId) => request(`/project/member/${projectId}/${memberUserId}`,"DELETE")

/**
 * 申请认领资源
 * @param {Number}  projectId
 * @param {String}  intro
 * @param {String}  awardProveUrl
 * @param {Number}  state 状态 0-正在审核 1-通过 2-不通过
 */
exports.postApplyProject = (data) => request("/project/find","POST",data)

/**
 * 修改认领资源信息
 * @param {Number}  projectFindId 申请表ID
 */
exports.putApplyProject = ({applyingID,...data}) => request(`/project/find/${applyingID}`,"PUT",data)

/**
 * 判断用户是否已经提交认领
 * @param {Number}  projectId
 */
exports.getApplyProject = (projectId) => request(`/project/find/judge/${projectId}`,"GET")
