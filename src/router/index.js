import VueRouter from 'vue-router'
import Command from '../page/Command'
import SendCommand from '../page/SendCommand'

export default new VueRouter({
	routes:[
		{
		    path: '/',
		    component: SendCommand, // 这是默认路由
		  },
		{
			
			name: 'command',
			path:'/command',
			component:Command
		},
		{
			name: 'sendcommand',
			path:'/sendcommand',
			component:SendCommand
		},
	]
})