import request from "./request.js"

/**
 * 获取团队列表
 */
exports.getTeams = (params) => request("/team/","GET",params)

/**
 * 获取单个团队详细
 * @param {Number}  teamId
 */
exports.getTeam = (teamId) => request(`/team/${teamId}`,"GET")

/**
 * 创建团队
 * @param {String}  name
 * @param {String}  school
 * @param {String}  tag
 * @param {String}  avatar
 * @param {String}  团队介绍
 * @param {Number}  recruitState 招募状态0-不招募 1-招募中 2-急招
 * @param {String}  recruitContent 招募内容
 */
exports.postTeam = (data) => request("/team","POST",data)

/**
 * 更新团队信息
 * @param {Number}  teamId
 * @param {String}  name
 * @param {String}  school
 * @param {String}  tag
 * @param {String}  avatar
 * @param {String}  团队介绍
 * @param {Number}  recruitState 招募状态0-不招募 1-招募中 2-急招
 * @param {String}  recruitContent 招募内容
 */
exports.putTeam = (teamId,data) => request(`/team/${teamId}`,"PUT",data)

/**
 * 解散团队
 * @param {Number}  teamId
 */
exports.deleteTeam = (teamId) => request("/team/" + teamId,"DELETE",{})

/**
 * 邀请成员
 * @param {Number}  teamId
 * @param {Number}  memberId
 * @param {Boolean}  isAdmin 是否设置为管理员
 */
exports.inviteMember = (teamId,memberId) => request(`/team/invite/${teamId}/${memberId}`,"POST",{}) 

/**
 * 修改队员身份
 * @param {Number}  teamId
 * @param {Number}  userId
 * @param {Boolean}  isAdmin 是否设置为管理员
 */
exports.putMemberIdentity = ({teamId,userId,isAdmin}) => request(`/team/assign/${teamId}/${userId}?isAdmin=${isAdmin}`,"POST",{}) 

/**
 * 修改队员信息
 * @param {Number}  teamId
 * @param {String}  role 队员身份
 * @param {String}  memberIntro 队员介绍
 */
exports.putMemberInfo = ({teamId,...data}) => request(`/team/member/${teamId}`,"PUT",data) 

/**
 * 删除队员
 * @param {Number}  teamId
 * @param {Number}  memberId
 */
exports.deleteMember = (teamId,memberId) => request(`/team/member/${teamId}/${memberId}`,"DELETE") 

/**
 * 移交队长
 * @param {Number}  teamId
 * @param {Number}  memberId
 */
exports.handoverTeam = (teamId,memberId) => request(`/team/handover/${teamId}/${memberId}`,"POST")

/**
 * 申请加入队伍
 * @param {Number}  teamId
 * @param {String}  intro
 */
exports.applyJoinTeam = ({teamId,intro}) => request(`/team/apply/${teamId}`,"POST",{intro})

/**
 * 查看我的申请加入队伍状态、
 * @param {Number}  teamId
 */
exports.getMyApply = (teamId) => request(`/team/apply/me/${teamId}`,"GET")

/**
 * 撤销申请
 * @param {Number}  teamId
 */
exports.withdrowApply = (teamId) => request(`/team/apply/${teamId}`,"DELETE")

/**
 * 查询申请加入队伍的人员列表
 * @param {Number}  teamId
 */
exports.getApply = (teamId) => request(`/team/apply/${teamId}`,"GET")

/**
 * 审核申请表
 * @param {Number}  teamId
 * @param {Number}  memberId
 * @param {Boolean}  state 状态
 */
exports.checkApply = ({teamId,memberId,state}) => request(`/team/apply/check/${teamId}/${memberId}?state=${state}`,"POST")