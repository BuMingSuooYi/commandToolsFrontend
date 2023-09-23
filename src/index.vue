<template>
	<div @dblclick="handleDoubleClick" @click="handleClick">
		<el-tabs v-model="activeName" @tab-click="handleClick" id="mytabs">
			<el-tab-pane label="制定命令" name="first" class="mytabpane">
				<CustomCommands :commandList="commandList" :selectedCommandId="selectedCommandId"
					:sysList="sysParameterList" @addCommand="addCommand" @updataCommand="updataCommand">
				</CustomCommands>
			</el-tab-pane>
			<el-tab-pane label="发送命令" name="second">
				<SendinCommands :commandList="commandList"></SendinCommands>
			</el-tab-pane>
		</el-tabs>
		<CommandHistory :drawer="drawer" :sendHistoryList="sendHistoryList" />
	</div>


</template>

<script>
	import CustomCommands from './components/CustomCommands.vue'
	import SendinCommands from './components/SendinCommands.vue'
	import CommandHistory from './components/CommandHistory.vue'
	import {
		getAll,
		getAllSysParameter,
		getPage,
		add,
		updata,
		findSendingHistory
	} from './api/command.js'
	export default {
		components: {
			CustomCommands,
			SendinCommands,
			CommandHistory
		},
		data() {
			return {
				//命令列表
				commandList: [],
				//系统参数列表
				sysParameterList: [],
				//初始打开的命令
				selectedCommandId: null,
				//初始标签页
				activeName: 'first',
				//抽屉是否展开
				drawer: false,
				//抽屉历史命令列表
				sendHistoryList:[]
			};
		},
		//钩子函数，加载数据
		async created() {
			//获取全部命令
			await getAll().then(res => {
				this.commandList = res;
				if (this.commandList.length > 0)
					this.selectedCommandId = this.commandList[0].id;
			}).catch(err => {
				this.$message.error('请求出错了：' + err);
			});
			//获取全部系统参数
			await getAllSysParameter().then(res => {
				this.sysParameterList = res;
				console.log("this.sysParameterList:", this.sysParameterList)
			}).catch(err => {
				this.$message.error('请求出错了：' + err);
			});

		},
		methods: {
			//添加命令
			async addCommand(command) {
				//向后端发送请求添加命令
				await add(command).then(res => {
					//方案一
					this.commandList.push(res)
					this.selectedCommandId = res.id
					console.log(res)
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});
				//方案二
				// await getAll().then(res => {
				// 	this.commandList = res
				// 	this.selectedCommandId = res.id
				// }).catch(err => {
				// 	this.$message.error('请求出错了：' + err);
				// });
			},

			//删除命令

			//修改命令
			updataCommand(command) {
				let f = true; //标识修改的command是否存在
				updata(command).then(res => {
					// // 使用 map 方法遍历数组，并替换具有特定 id 值的对象
					// let newcommandList = this.commandList.map(obj => {
					// 	if (obj.id === this.commandList.id) {
					// 		return replacementObject;
					// 	}
					f = false
					// 	return obj;
					// });
					// this.commandList=newcommandList;
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});


				if (f == false) {
					console.log("三")
					getAll().then(res => {
						this.commandList = res
						this.selectedCommandId = res.id
					}).catch(err => {
						this.$message.error('请求出错了：' + err);
					});
				}

				this.selectedCommandId = command.id

				console.log("四")
			},

			//标签页切换
			handleClick(tab, event) {
				console.log(tab, event);
			},

			//双击事件
			handleDoubleClick() {
				this.drawer = true;
				console.log("你双击了页面")
				findSendingHistory().then(res => {
					console.log("1369::",res);
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});
			},
			//点击事件
			handleClick() {
				if (this.drawer == true)
					this.drawer = false;
			}
		}
	};
</script>

<style>
	#mytabs {}
</style>
