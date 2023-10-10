import Vue from 'vue'
import App from './App.vue'
// element-ui部分引入
import {
	//布局
	Container,
	Header,
	Aside,
	Main,
	//导航栏
	Menu,
	MenuItem,
	MenuItemGroup,
	//表格
	Table,
	TableColumn,
	//搜索表单
	Button,
	Input,
	Select,
	Option,
	DatePicker,
	//分页
	Pagination,
	//级联面板
	CascaderPanel,
	//布局
	Row,
	Col,
	//单选
	RadioGroup,
	RadioButton,
	//对话框
	Dialog,
	//新建、编辑表单
	Form,
	FormItem,
	Autocomplete,
	// 标签
	Tag,
	//弹出框
	Popover,
	//提示信息
	Tooltip
	
} from 'element-ui';

// element启用
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Pagination);
Vue.use(CascaderPanel);
Vue.use(Row);
Vue.use(Col);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Autocomplete);
Vue.use(Tag);
Vue.use(Popover);
Vue.use(Tooltip);



Vue.config.productionTip = true;

//路由插件引入
import VueRouter from 'vue-router'
//路由启用
Vue.use(VueRouter)
//路由配置引入
import router from './router/index.js'


import store from './store/index.js'

new Vue({
	render: h => h(App),
	router,
	store
}).$mount('#app')
