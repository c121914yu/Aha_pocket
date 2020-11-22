import request from "./request.js"

/* 获取上传文件签名 */
const getFilesSignature = (projectId) => request(`/project/${projectId}/resources/sign/upload/private`,"GET",{})
/* 获取上传头像/证明材料签名 */
const getPublicSignature = () => request("/project/sign/upload/public","GET",{})

/* 创建项目数据，保存至数据库 */
const postProject = (data) => request("/project","POST",data)
/* 
	获取所有项目粗略信息表
	params:
				pageNum： 第几页
				pageSize: 每页的条数
				获取范围（某个用户或全部)
				排序模式
				筛选模式
*/
const getProjects = ({phone,pageNum,pageSize}) => request(`/project?phone=${phone}&pageNum=${pageNum}&pageSize=${pageSize}`,"GET",{})
/* 获取项目详细信息 */
const getProject = (projectId) => request(`/project/${projectId}`,"GET",{})
/* 更新项目详细信息 */
const putProject = (projectId,data) => request(`/project/${projectId}`,"PUT",data)
/* 删除项目 */
const deleteProject = (projectId) => request(`/project/${projectId}`,"DELETE",{})
/* 收藏项目 */
const collectProject = (projectId) => request(`/project/collection/{projectId} `,"POST",{})
/* 取消项目 */
const cancleCollectProject = (projectId) => request(`/project/collection/{projectId} `,"DELECT",{})

/* 创建项目的资源信息 */
const postResource = (projectId,data) => request(`/project/resource/${projectId}`	,"POST",data)
/* 删除资源 */
const deleteResource = (projectResourceId) => request(`/project/resource/${projectResourceId}`,"DELETE",{})

/* 创建成员 */
const postMember = (projectId,data) => request(`/project/member/${projectId}`	,"POST",data)
/* 更新成员 */
const putMember = (projectId,memberPhone,data) => request(`/project/member/${projectId}/${memberPhone}`,"PUT",data)
/* 批量更新成员 */
const putMembers = (projectId,data) => request(`/project/members/${projectId}`,"PUT",data)
/* 删除成员 */
const deleteMember = (projectId,memberPhone) => request(`/project/member/${projectId}/${memberPhone}`	,"DELETE",{})

export {
	getFilesSignature,
  getPublicSignature,
	
	postProject,
	getProjects,
	getProject,
	putProject,
	deleteProject,
	collectProject,
	cancleCollectProject,
	
	postResource,
	deleteResource,
  
	postMember,
	putMember,
	putMembers,
	deleteMember
}