import request from "./request.js"

/* 获取上传头像/证明材料签名 */
const getPublicSignature = () => request("/project/sign/upload/public","GET",{})

/* 创建项目数据，保存至数据库 */
const postProject = (data) => request("/project","POST",data)
/* 
	获取所有项目粗略信息表
	params:
				pageNum： 第几页
				pageSize: 每页的条数
        userId: 用户userId
        compId: 竞赛Id
        awardLevel: 获奖等级
        sortBy: 排序字段
        orderBy: 排序方式
*/
const getProjects = (params) => request("/project","GET",params)
/* 获取个人项目列表 */
const getMeProjects = (params) => request("/project/me","GET",params)
/* 获取项目详细信息 */
const getProject = (projectId) => request(`/project/${projectId}`,"GET",{})
/* 更新项目详细信息 */
const putProject = (projectId,data) => request(`/project/${projectId}`,"PUT",data)
/* 删除项目 */
const deleteProject = (projectId) => request(`/project/${projectId}`,"DELETE",{})
/* 购买项目 */
const buyProject = (projectId) => request(`/project/buy/${projectId}`,"GET",{})

/* 判断是否收藏 */
const isCollected = (projectId) => request(`/project/collection/${projectId}`,"GET",{})
/* 收藏项目 */
const collectProject = (projectId) => request(`/project/collection/${projectId}`,"POST",{})
/* 取消收藏 */
const cancleCollectProject = (projectId) => request(`/project/collection/${projectId}`,"DELETE",{})

/* 获取上传文件签名 */
const getFilesSignature = (projectId) => request(`/project/${projectId}/resources/sign/upload/private`,"GET",{})
/* 创建项目的资源信息 */
const postResource = (projectId,data) => request(`/project/resource/${projectId}`	,"POST",data)
/* 删除资源 */
const deleteResource = (projectResourceId) => request(`/project/resource/${projectResourceId}`,"DELETE",{})
/* 获取下载签名 */
const getLoadSignature = (projectResourceId) => request(`/project/resource/${projectResourceId}/sign/download`,"GET",{})

/* 创建成员 */
const postMember = (projectId,data) => request(`/project/member/${projectId}`,"POST",data)
/* 更新成员 */
const putMember = (projectId,memberUserId,data) => request(`/project/member/${projectId}/${memberUserId}`,"PUT",data)
/* 批量更新成员 */
const putMembers = (projectId,data) => request(`/project/members/${projectId}`,"PUT",data)
/* 删除成员 */
const deleteMember = (projectId,memberPhone) => request(`/project/member/${projectId}/${memberPhone}`	,"DELETE",{})

export {
	getPublicSignature,
	
	postProject,
	getProjects,
	getMeProjects,
	getProject,
	putProject,
	deleteProject,
	buyProject,
	
	isCollected,
	collectProject,
	cancleCollectProject,
	
	getFilesSignature,
	postResource,
	deleteResource,
	getLoadSignature,
  
	postMember,
	putMember,
	putMembers,
	deleteMember
}