/* 讨论区 */
import request from "./request.js"

exports.postTag = (tagName) => request(`/post/tags?tagName=${tagName}`,"POST")

/**
 * 获取平台所有讨论标签
 */
exports.getDiscussionTags = () => request("/post/tags/all","GET")

/**
 * 发布讨论
 * @param {String}  title
 * @param {String}  content
 * @param {Number}  tagId
 */
exports.postDiscussion = (data) => request("/post","POST",data)

/**
 * 删除讨论
 * @param {String}  postId
 */
exports.deleteDiscussion = (postId) => request(`/post/${postId}`,"DELETE")

/**
 * 修改讨论
 * @param {String}  postId
 * @param {String}  title
 * @param {String}  content
 * @param {Number}  tagId
 */
exports.putDiscussion = ({postId,...data}) => request(`/post/${postId}`,"PUT",data)

/**
 * 获取特定标签下的讨论
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {String}  strategy 策略 hottest-最热, latest-最新（默认)
 * @param {Number}  tagId 标签ID
 */
exports.getDiscussions = ({tagId,...params}) => request(`/post/tag/${tagId}`,"GET",params)

/**
 * 获取讨论详细
 * @param {String}  postId
 */
exports.getDiscussion = (postId) => request(`/post/detail/${postId}`,"GET")

/**
 * 获取我收藏/点赞的讨论
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {Boolean}  isLike true-点赞的（默认),false-收藏的
 */
exports.getMylikeDiscussion = (params) => request("/post/myLike","GET",params)

/**
 * 点赞 / 取消点赞讨论帖子
 * @param {Boolean}  isLike true-点赞false-取消点赞
 */
exports.likeDiscussion = (postId,isLike) => request(`/post/like/${postId}?isLike=${isLike}`,"POST")

/**
 * 收藏 / 取消收藏讨论帖子
 * @param {Boolean}  isCollect true-收藏 false-取消收藏
 */
exports.collectDiscussion = (postId,isCollect) => request(`/post/collection/${postId}?isCollect=${isCollect}`,"POST")

/**
 * 分页获取讨论评论内容
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {Number} replayNum 每条评论的回复数量
 * @param {String} loadBy 策略 hottest-最热（默认), latest-最新
 */
exports.getDiscComments = ({postId,...params}) => request(`/post/${postId}/comments`,"GET",params)

/**
 * 点赞 / 取消点赞评论内容
 * @param {Boolean}  isLike true-点赞false-取消点赞
 */
exports.likeDiscComment = (commentId) => request(`/post/comment/like/${commentId}`,"POST")

/**
 * 发布评论
 * @param {String}  postId 讨论帖子ID
 * @param {String}  content
 */
exports.postDiscComment = (data) => request(`/post/${data.postId}/comment`,"POST",data)

/**
 * 删除评论
 * @param {String}  commentId
 */
exports.deleteDiscComment = (commentId) => request(`/post/comment/${commentId}`,"DELETE")

/**
 * 分页获取讨论的评论的回复内容
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {String} loadBy 策略 hottest-最热（默认), latest-最新
 */
exports.getDiscCommentsReply = ({commentId,...params}) => request(`/post/comment/${commentId}/replies`,"GET",params)

/**
 * 点赞 / 取消点赞回复内容
 * @param {Boolean}  isLike true-点赞false-取消点赞
 */
exports.likeDiscCommentReply = (replyId) => request(`/post/comment/reply/like/${replyId}`,"POST")

/**
 * 发布回复
 * @param {Number}  toId 被回复对象的用户Id
 * @param {String}  commentId 评论ID
 * @param {String}  content
 */
exports.postDiscCommentReply = (data) => request("/post/comment/reply","POST",data)

/**
 * 删除回复
 * @param {String}  replyId
 */
exports.deleteDiscCommentReply = (replyId) => request(`/post/comment/reply/${replyId}`,"DELETE")
