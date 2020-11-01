import request from "./request.js"

/* 
	description: 获取上传文件签名
*/
const getOssSignature = (data) => request("/resource/sign/upload/private","GET",{})
/* 
	desc: 创建资源数据，保存至数据库
*/
const postResource = (data) => request("/resource","POST",data)

export {
	getOssSignature,
	postResource
}