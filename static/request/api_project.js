import request from "./request.js"

/* description: 获取上传文件签名 */
const getFilesSignature = (projectId) => request(`/project/${projectId}/resource/sign/upload/private`,"GET",{})
/* desc: 创建项目数据，保存至数据库 */
const postProject = (data) => request("/project","POST",data)
/* 创建项目的资源信息 */
const postResource = (projectId,data) => request(`/project/resource/${projectId}`	,"POST",data)

/* 获取个人项目信息 */
const getSelfProject = () => request("/project","GET",{})
/* 获取全部项目信息 */

export {
	getFilesSignature,
	postProject,
	postResource,
  
  getSelfProject
}