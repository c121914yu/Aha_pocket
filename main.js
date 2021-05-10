import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'

// 字体图标
import "./static/icon/iconfont.css"

const app = new Vue( {
	...App
} )
app.$mount()

/* 注册全局方法 */
require( "./static/js/globalFun.js" )
/* 注册全局filter */
/* 分割tag标签 */
Vue.filter("splitTags", (tag) => {
	if(tag){
		return tag.split(" ")
	}
	return []
})