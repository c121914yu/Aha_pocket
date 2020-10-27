import request from "./request.js"

/* 
	description: 获取上传文件签名
	input: 
				filename: String,文件名
*/
const getOssSignature = (name) => request("/file/"+name,"GET",{})

export {
	getOssSignature
}