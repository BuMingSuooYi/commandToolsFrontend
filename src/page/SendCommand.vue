<template>
	<div class="my-send">
		<el-row>
			<el-col :span="7">
				<el-cascader-panel @change="netNodeChange" :options="netList" :props="props"></el-cascader-panel>
			</el-col>
			<el-col :span="17" v-if="selectNode" class="my-side">
				<div style="margin-top: 20px">
					选择App：
					<el-radio-group v-model="selectApp" size="medium">
						<el-radio-button v-for="num in 8" :key="num" :label="num"></el-radio-button>
					</el-radio-group>
				</div>
				<div v-if="selectApp">
					待发送的命令：
					<!-- <el-select v-model="command" filterable placeholder="选择命令">
						<el-option v-for="item in netList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select> -->
					<el-select v-model="commandId" filterable remote placeholder="请输入关键词" :remote-method="remoteMethod"
						:loading="loading">
						<el-option v-for="item in searchCommandList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>

					<el-row style="padding: 40px">
						<el-col :span="16" v-if="analysisPar.parList">
							<div class="grid-content">
								<InputGrid :inputConfig="analysisPar.parList" @resultData="resultInputData"></InputGrid>
							</div>
						</el-col>
						<el-col :span="8" v-if="analysisPar.sysList">
							<div class="grid-content">
								<div v-for="(key, value) in analysisPar.sysList" class="show-sys">
									{{ key }} ：{{ value }}
								</div>
							</div>
						</el-col>
					</el-row>

					<div v-if="analysisPar.parList">
						<el-button @click="callCommand" style="width: 300px;">预览命令</el-button>
					</div>
				</div>

			</el-col>
		</el-row>

		<div>
			<el-dialog width="80%" title="预览命令" :visible.sync="dialogTableVisible">
				<el-row>
					<el-col :span="12">
						<pre class="my_request">
		{
			"header": {
				"payloadType": "HfReadWriteRequest",
				"payloadVersion": 1,
				"subscribe": false,
				"netId": <span class="my_alterable">{{this.selectNet}}</span>      //node的netId
			},
			"payload": {
				"nodeId": <span class="my_alterable">{{this.selectNode}}</span>,   //node的nodeId
				"srcEndpoint": 8, //固定为8
				"shortAddr": <span class="my_alterable"><!-- {{this.body.payload.shortAddr}} -->xxxxxx</span>,//node的shortAddr
				"addrType": 2,    //固定值
				
				"dstEndpoint": <span class="my_alterable">{{this.selectApp}}</span>, //用户选择的endpoint，整数
				"clusterId": 17,  //固定值
				"cmd": 2,         //固定值
				"spe": 0,         //固定值
				"dir": 0,         //固定值
				"disrsp": 0,      //固定值
				"mcd": 0,         //固定值
				"seq": 0          //固定值
			},
			"extraPayload": {
				"attributeId": 4,     //固定值
				"attributeType": 67,  //固定值
				
				"attributeValue":     //一维data数组
				[
				<div class="column-container">
				    <span class="my_alterable" v-for="(item, index) in commandPar" :key="index">
				      {{item}},
				    </span>
				</div>
				]
			}
		}
								</pre>

					</el-col>
					<el-col :span="12">
						<div class="my-result">
							<ul>
								<li v-for="(value, key) in requestResult" :key="key">
									<strong>{{ key }}:</strong>
									{{ typeof value === 'object' ? formatObject(value) : value }}
								</li>
							</ul>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6" :offset="8">
						<el-button @click="sendCommand" style="width: 300px;" v-if="jsF">发送命令</el-button>
					</el-col>
				</el-row>

			</el-dialog>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import InputGrid from '../components/dialog/InputGrid.vue'
	import {
		getAllNet,
		findNodeByNet
	} from '../api/linking.js'

	import {
		findByName,
		findbyOne,
		call,
		addSendingHistory
	} from '../api/command.js'

	export default {
		name: 'SendComment',
		components: {
			InputGrid
		},
		async created() {
			await getAllNet().then(res => {
				this.netList = res;
				console.log(this.netList)
			}).catch(err => {
				console.log("出错了：", err)
			})
		},
		data() {
			return {
				// 网络列表
				netList: [],
				// 网络的节点列表
				props: {
					lazy: true,
					lazyLoad(net, resolve) {
						setTimeout(async () => {
							console.log("this.selectNet:", this.selectNet)
							let nodes = [];
							await findNodeByNet(net.value).then(res => {
								nodes = res;
							}).catch(err => {
								console.log("出错了：", err)
							})
							// 给节点添加叶子标记
							nodes = nodes.map(node => ({
								...node,
								leaf: true
							}));
							resolve(nodes);
						}, 500);
					}
				},
				// 选择的网络和节点
				selectNet: undefined,
				selectNode: undefined,
				// 选择的app
				selectApp: undefined,
				// 选择的命令
				loading: false,
				searchCommandList: [],
				commandId: undefined,
				//需要解析的参数
				analysisPar: {
					parList: undefined,
					sysList: undefined,
				},
				//解析完需要发送的参数
				sendPar: {
					parList: {},
					sysList: {}
				},
				// 发送命令时携带的
				par: {},
				// 预览命令弹窗
				dialogTableVisible: false,
				// 运行命令得到的参数
				commandPar: [],
				// js代码错误标志!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				jsF: true,
				// 发送命令之后的结果
				requestResult: {},
				//发送命令时需要的请求头
				headers: {
					"Content-Type": 'application/json',
					"x-access-token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVUaW1lIjoxNjk1NDU5NDg0MDc2LCJ1c2VybmFtZSI6IjEzMTc3ODEyODkxIiwiblVzZXJJZCI6MTd9.jfd4Ssw3tbFKYS9SLu4vrOEfbUxUtmiH6uV9LyDsJ7M' // 替换成你的访问令牌
				},
			};
		},
		watch: {
			commandId(newvalue) {
				// 重新选择命令后初始化
				const command = this.searchCommandList.find(obj => obj.id === newvalue);
				this.analysisPar.parList = JSON.parse(command.parameter)
				console.log("注意这里的command.sysParameter：", command.sysParameter)
				if (command.sysParameter == '') {
					this.analysisPar.sysList = undefined
				} else {
					this.analysisPar.sysList = command.sysParameter.split(',')
				}
				this.sendPar = {
					parList: {},
					sysList: {}
				};
				// 在此解析系统参数
				this.analysisSysPar();
				console.log("解析好的参数：", this.analysisPar, this.sendPar)
			}
		},
		methods: {
			// 网络号、节点号变化
			netNodeChange(netNode) {
				this.selectNet = netNode[0];
				this.selectNode = netNode[1];
			},
			//命令模糊搜索
			remoteMethod(query) {
				// if (query !== '') {
				this.loading = true;
				setTimeout(async () => {
					this.loading = false;
					console.log("调用", query)
					await findByName(query).then(res => {
						this.searchCommandList = res;
						console.log("this.searchCommandList:",this.searchCommandList)
					}).catch(err => {
						console.log("出错了：", err)
						this.searchCommandList = [];
					})
				}, 200);
				// } else {
				// 	this.searchCommandList = [];
				// }
			},
			// 自定义参数组件解析的监听事件
			resultInputData(data) {
				// 在父组件中监听到子组件的自定义事件后，执行的方法
				console.log('从子组件接收到的数据：', data);
				this.sendPar.parList = data; // 更新父组件的数据
			},
			// 系统参数解析的函数
			analysisSysPar() {
				if (this.analysisPar.sysList) {
					this.analysisPar.sysList.forEach((sys) => {
						let value;
						switch (sys) {
							case 'sysTime':
								value = new Date().toLocaleString();
								break;
							case 'netNum':
								value = this.selectNet;
								break;
							case 'nodeNum':
								value = this.selectNode;
								break;
							case 'appNum':
								value = this.selectApp;
								break;
						}
						this.sendPar.sysList[sys] = value;
					});
				}

			},
			//预览命令参数
			async callCommand() {
				this.jsF = true;
				this.par = {}
				this.requestResult = {};
				this.dialogTableVisible = true;

				let prm = {};

				//准备自定义参数
				for (const key in this.sendPar.parList) {
					prm[key] = this.sendPar.parList[key];
				}
				//准备系统参数
				for (const key in this.sendPar.sysList) {
					prm[key] = this.sendPar.sysList[key];
				}

				console.log("prm:", prm);

				//解析命令的参数
				let test = {
					id: this.commandId,
					prm: prm
				};
				this.par = prm;
				await call(test).then(res => {
					this.commandPar = res;
				}).catch(err => {
					this.jsF = false;
					this.commandPar = ['命令代码有误，请先debug'];
					console.log("jsF：", this.jsF);
					this.$message.error('请求出错了：' + err);
				});

				// 获取最新密钥
				const loginUrl = 'https://rest-t.huafeiiot.com/login';
				const requestData = {
					phone: '13177812891',
					password: '123qwe!@#QWE'
				};

				try {
					const response = await axios.post(loginUrl, requestData);
					this.headers = {
						'Content-Type': 'application/json',
						'x-access-token': response.data.access_token
					};
				} catch (error) {
					console.error(error);
				}
			},

			//发送命令
			//78号测试网络
			async sendCommand() {
				const url = "https://rest-t.huafeiiot.com/api/execute";
				const command = this.searchCommandList.find(obj => obj.id === this.commandId);
				let history = {
					commandId: command.id,
					commandName: command.name,
					netNum: 0,
					state: -1,
					par: ''
				}
				//发送命令
				await axios.post(url, this.body, {
						"headers": this.headers
					})
					.then((response) => {
						this.requestResult = response;
						console.log('成功:', response.data);
						history.state = response.status;
						history.par = JSON.stringify(this.par);
					})
					.catch((error) => {
						this.requestResult = error;
						//tockn过期重新请求tocken
						const options = {
							method: 'POST',
							url: 'https://rest-t.huafeiiot.com/login',
							headers: {
								'Content-Type': 'application/json',
								'content-type': 'application/json'
							},
							data: {
								phone: '13177812891',
								password: '123qwe!@#QWE'
							}
						};
						axios.request(options).then(function(response) {
							console.log(response.data);
							this.headers = {
								"Content-Type": 'application/json',
								"x-access-token": response.data.access_token
							}
						}).catch(function(error) {
							console.error(error);
						}).bind(this);
						console.error('失败:', error);
					});

				// 添加一条命令历史
				console.log("history:", history)
				history.netNum = this.selectNet;
				addSendingHistory(history).then(res => {
					console.log("添加命令历史：", res)
				}).catch(err => {
					// this.$message.error('请求出错了：' + err);
					console.log("添加历史错误：", res)
				});
			},

			formatObject(obj) {
				// 辅助方法，用于格式化嵌套对象
				return JSON.stringify(obj, null, 2);
			}
		}
	}
</script>

<style>
	.my-send {
		min-width: 1000px;
		max-height: 85vh;
		background-color: white;
		height: auto;

	}

	.my-command-list {}

	.el-cascader-panel {
		width: 100%;
		height: 85vh;
	}

	/*  */
	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}

	.bg-purple {
		background: #d3dce6;
	}

	/* .bg-purple-light {
		background: #e5e9f2;
	} */

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.show-sys {
		margin: 5px;
		padding: 5px;
		border-style: solid;
		border-color: #ccc;
		border-width: 2px;
		border-radius: 5px;
	}

	/* 显示请求数据的样式 */

	.my_request {
		white-space: pre;
		text-align: left;
	}

	.column-container {
		width: 40%;
		display: flex;
		flex-wrap: wrap;
		text-align: left;
	}

	.my_alterable {
		height: 20px;
		width: calc(10%);
		/* 每列占据1/6的宽度，-10px是为了添加间距 */
		margin: auto;
		/* 列之间的间距 */
		/* box-sizing: border-box; */

		font-weight: bold;
		color: brown;
	}

	.my-result {
		text-align: left;
	}
</style>
