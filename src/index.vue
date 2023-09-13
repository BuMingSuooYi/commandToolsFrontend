<template>
	<div>
		<el-tabs v-model="activeName" @tab-click="handleClick" id="mytabs">
			<el-tab-pane label="制定命令" name="first" class="mytabpane">
				<CustomCommands :commandList="commandList" :selectedCommandId="selectedCommandId" :sysList="sysParameterList"
					@addCommand="addCommand"></CustomCommands>
			</el-tab-pane>
			<el-tab-pane label="发送命令" name="second">
			 <SendinCommands :commandList="commandList"></SendinCommands>
			</el-tab-pane>

		</el-tabs>
	</div>


</template>

<script>
	import CustomCommands from './components/CustomCommands.vue'
	import SendinCommands from './components/SendinCommands.vue'
	import {
		getAll,
		getAllSysParameter,
		getPage,
		add
	} from './api/command.js'
	export default {
		components: {
			CustomCommands,
			SendinCommands
		},
		data() {
			return {
				//命令列表
				commandList: [],
				//系统参数列表
				sysParameterList:[],
				selectedCommandId: null,
				//初始标签页
				activeName: 'first'
			};
		},
		//钩子函数，加载数据
		created() {
			//获取全部命令
			getAll().then(res => {
				this.commandList = res;
				if (this.commandList.length > 0)
					this.selectedCommandId=this.commandList[0].id;
			}).catch(err => {
				this.$message.error('请求出错了：' + err);
			});
			//获取全部系统参数
			getAllSysParameter().then(res => {
				this.sysParameterList = res;
				console.log("this.sysParameterList:",this.sysParameterList)
			}).catch(err => {
				this.$message.error('请求出错了：' + err);
			});

		},
		methods: {
			//添加命令
			addCommand(command) {
				//向后端发送请求添加命令
				add(command).then(res => {
					this.commandList.push(res)
					this.selectedCommandId=res.id
					console.log(res)
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});
			},

			//删除命令

			//修改命令

			//标签页切换
			handleClick(tab, event) {
				console.log(tab, event);
			}
		}
	};
</script>

<style>
	#mytabs {}
</style>
