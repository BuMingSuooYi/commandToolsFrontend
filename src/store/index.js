import Vuex from 'vuex'
import Vue from 'vue'

// 用于响应请求
const actions = {
	// // 初始化空命令数据
	// initCommand(){
	// 	console.log("相应，开始调用函数");
	// 	context.commit('InitCommand');
	// }
	//
}
// 用于执行操作
const mutations = {
	changeAddF(f){
		state.addF=f;
	},
	changeEditF(f){
		state.editF=f;
	},
	changeDeleteF(f){
		state.deleteF=f;
	}
}
// 用于储存数据
const state = {
	//添加命令标识
	addF: false,
	//编辑命令标识
	editF: false,
	//删除命令标识
	deleteF: false,

}

Vue.use(Vuex)

export default new Vuex.Store({
	actions,
	mutations,
	state
})
