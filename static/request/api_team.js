import request from "./request.js"

/* 获取团队列表 */
exports.getTeams = (teamId) => request("/team/","GET",{})
/* 获取单个团队详细 */
exports.getTeam = (teamId) => request("/team/" + teamId,"GET",{})
/* 创建团队 */
exports.postTeam = (data) => request("/team","POST",data)
/* 更新团队信息 */
exports.putTeam = (data) => request(`/team/${data.id}`,"PUT",data)
/* 解散团队 */
exports.deleteTeam = (teamId) => request("/team/" + teamId,"DELETE",{})
/* 邀请成员 */
exports.inviteMember = (teamId,memberId) => request(`/team/invite/${teamId}/${memberId}`,"POST",{}) 
/* 修改队员身份 */
exports.putMemberIdentity = ({teamId,userId,isAdmin}) => request(`/team/assign/${teamId}/${userId}?isAdmin=${isAdmin}`,"POST",{}) 
/* 修改队员信息 */
exports.putMemberInfo = ({teamId,role,memberIntro}) => request(`/team/member/${teamId}`,"PUT",{role,memberIntro}) 
/* 删除队员 */
exports.deleteMember = (teamId,memberId) => request(`/team/member/${teamId}/${memberId}`,"DELETE",{}) 
/* 移交队长 */
exports.handoverTeam = (teamId,memberId) => request(`/team/handover/${teamId}/${memberId}`,"POST",{})
/* 申请加入队伍 */
exports.applyJoinTeam = ({teamId,intro}) => request(`/team/apply/${teamId}`,"POST",{intro})
/* 查看我的申请 */
exports.getMyApply = (teamId) => request(`/team/apply/me/${teamId}`,"GET",{})
/* 查询队伍的申请 */
exports.getApply = (teamId) => request(`/team/apply/${teamId}`,"GET",{})
/* 撤销申请 */
exports.withdrowApply = (teamId) => request(`/team/apply/${teamId}`,"DELETE",{})
/* 审核申请表 */
exports.checkApply = ({teamId,memberId,state}) => request(`/team/apply/check/${teamId}/${memberId}`,"POST",{state})