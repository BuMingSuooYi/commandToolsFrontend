import VueRouter from 'vue-router'
import Command from '../page/Command'
import SendCommand from '../page/SendCommand'
import SendHistory from '../page/SendHistory'
import HistoryTag from '../page/HistoryTag'

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
		{
			name: 'sendhistory',
			path:'/sendhistory',
			component:SendHistory
		},
		{
			name: 'historytag',
			path:'/historytag',
			component:HistoryTag
		},
	]
})