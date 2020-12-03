import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'

// 字体图标
import "./static/icon/iconfont.css"

/* 注册全局方法 */
import globalFun from "./static/js/globalFun.js"
Vue.prototype.gToastError = globalFun.gToastError
Vue.prototype.gToastSuccess = globalFun.gToastSuccess
Vue.prototype.gShowModal = globalFun.gShowModal
Vue.prototype.gUploadFile = globalFun.gUploadFile
Vue.prototype.gPutUserInfo = globalFun.gPutUserInfo
Vue.prototype.gLoading = globalFun.gLoading

const app = new Vue({
	...App
})
app.$mount()
