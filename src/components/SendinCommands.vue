<template>
	<div>
		<el-container>
			<el-aside width="200px">
				<p>网络</p>
				<div class="list">
					<div v-for="net in netList" @click="openNet(net.netId)" @mouseenter="highlightNet(net.netId, true)"
						@mouseleave="highlightNet(net.netId, false)"
						:class="{ 'selectlighted': net.netId == selectedNetId ,'pointTolighted':net.netId ==pointToNetId }">
						<el-row>
							<el-col :span=" 24">
								<div class="grid-content bg-purple">网络：{{ net.netId }}</div>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-aside>
			<el-aside width="200px">
				<p>节点</p>
				<div class="list">
					<div v-for="node in nodeList" @click="openNode(node)" @mouseenter="highlightNode(node.nodeId, true)"
						@mouseleave="highlightNode(node.nodeId, false)"
						:class="{ 'selectlighted': node.nodeId == selectedNodeId ,'pointTolighted':node.nodeId ==pointToNodeId }">
						<el-row>
							<el-col :span="24">
								<div class="grid-content bg-purple">节点：{{ node.nodeId }}</div>
							</el-col>
						</el-row>
					</div>

				</div>

			</el-aside>
			<el-aside width="90%">
				<div style="margin-top: 20px">
					<el-radio-group v-model="appRadio" size="medium">
						<el-radio-button v-for="app in 8" :label="app"></el-radio-button>
					</el-radio-group>
				</div>
				<div>
					选择命令
					<!-- <el-select v-model="value" placeholder="请选择">
						<el-option-group v-for="group in options" :key="group.label" :label="group.label">
							<el-option v-for="item in group.options" :key="item.value" :label="item.label"
								:value="item.value">
							</el-option>
						</el-option-group>
					</el-select> -->
					<el-select v-model="selectedCommand" @change="selectCommandChange(selectedCommand)"
						placeholder="请选择命令">
						<el-option v-for="command in commandList" :key="command.id" :label="command.name"
							:value="command.id">
						</el-option>
					</el-select>
				</div>

				<div>
					<!-- 输入自定义变量 -->
					<el-row>
						<el-col :span="8">
							<div class="grid-content bg-purple">
								<div class="scrollable-list-container my_input">
									<div class="scrollable-list">
										<InputGrid :inputConfig="commandData.parameterList"
											@inputData="calculatinputData" />
									</div>
								</div>
							</div>
						</el-col>
						<el-col :span="2">
							<div class="grid-content"></div>
						</el-col>
						<!-- 展示系统变量 -->
						<el-col :span="8">
							<div class="grid-content bg-purple">
								<div class="scrollable-list-container my_sys">
									<ul class="scrollable-list">
										<li v-for="item in commandData.sysParameters" :key="item.id">
											{{item.name}}（{{item.remark}}）：{{item.value}}
										</li>
									</ul>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>

				<div>
					<el-button @click="callCommand" style="width: 300px;">预览命令</el-button>
				</div>

			</el-aside>
		</el-container>

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
		"netId": <span class="my_alterable">{{this.selectedNetId}}</span>      //node的netId
	},
	"payload": {
		"nodeId": <span class="my_alterable">{{this.selectedNodeId}}</span>,   //node的nodeId
		"srcEndpoint": 8, //固定为8
		"shortAddr": <span class="my_alterable">{{this.body.payload.shortAddr}}</span>,//node的shortAddr
		"addrType": 2,    //固定值
		
		"dstEndpoint": <span class="my_alterable">{{this.appRadio}}</span>, //用户选择的endpoint，整数
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
		    <div class="my_alterable" v-for="(item, index) in commandResult" :key="index">
		      {{item}},
		    </div>
		</div>
		]
	}
}
						</pre>

					</el-col>
					<el-col :span="12">
						<div>
							<ul>
								<li v-for="(value, key) in this.requestCommandResult" :key="key">
									<strong>{{ key }}:</strong>
									{{ typeof value === 'object' ? formatObject(value) : value }}
								</li>
							</ul>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6" :offset="8">
						<el-button @click="sendCommand" style="width: 300px;">发送命令</el-button>
					</el-col>
				</el-row>

			</el-dialog>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';

	import InputGrid from './InputGrid.vue';
	import {
		findbyOne,
		call,
		addSendingHistory
	} from '../api/command.js';
	import {
		getAllNet,
		findNodeByNet
	} from '../api/linking.js';
	import {
		forEach
	} from 'core-js/es6/array';


	export default {
		components: {
			InputGrid,
		},
		props: {
			commandList: {
				type: Array,
				required: true,
			}
		},

		data() {
			return {
				netList: [],
				selectedNetId: null,
				pointToNetId: null,
				nodeList: [],
				selectedNodeId: null,
				pointToNodeId: null,
				appRadio: 0,
				selectedCommand: null,
				//选中命令解析的数据,通过API获取和本地计算得到
				commandData: {
					sysParameters: [],
					parameterList: [],
				},
				//输入的自变量数据
				inputData: {

				},
				//命令预览弹窗
				dialogTableVisible: false,
				commandResult: "",
				requestCommandResult: {

				},
				headers: {
					"Content-Type": 'application/json',
					"x-access-token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVUaW1lIjoxNjk1NDU5NDg0MDc2LCJ1c2VybmFtZSI6IjEzMTc3ODEyODkxIiwiblVzZXJJZCI6MTd9.jfd4Ssw3tbFKYS9SLu4vrOEfbUxUtmiH6uV9LyDsJ7M' // 替换成你的访问令牌
				},
				body: {
					header: {
						payloadType: "HfReadWriteRequest",
						payloadVersion: 1,
						subscribe: false,
						netId: null
					},
					payload: {
						nodeId: null,
						srcEndpoint: 8,
						shortAddr: null,
						addrType: 2,
						dstEndpoint: null,
						clusterId: 17,
						cmd: 2,
						spe: 0,
						dir: 0,
						disrsp: 0,
						mcd: 0,
						seq: 0
					},
					extraPayload: {
						attributeId: 4,
						attributeType: 67,
						attributeValue: null
					}
				},

			}
		},
		//钩子函数，加载数据
		async created() {
			 // 获取网络号
			  try {
			    const netList = await getAllNet();
			    this.netList = netList;
			  } catch (err) {
			    this.$message.error('请求出错了：' + err);
			  }
			
			  // 开始时获取最新密钥
			  const loginUrl = 'https://rest-t.huafeiiot.com/login';
			  const requestData = {
			    phone: '13177812891',
			    password: '123qwe!@#QWE'
			  };
			
			  try {
			    const response = await axios.post(loginUrl, requestData);
			    console.log(response.data);
			    console.log('this：', this);
			    this.headers = {
			      'Content-Type': 'application/json',
			      'x-access-token': response.data.access_token
			    };
			  } catch (error) {
			    console.error(error);
			  }


		},
		//计算属性
		computed: {
			// sysList() {


			// 	// 将inputConfig对象转换为数组
			// 	return a
			// },
		},
		methods: {
			//鼠标移动时指向网络高亮
			highlightNet(id, shouldHighlight) {
				// 根据 shouldHighlight 的值来添加或移除 'highlighted' 类
				if (shouldHighlight) {
					this.pointToNetId = id;
				} else {
					this.pointToNetId = null;
				}
			},
			//点击选择网络
			openNet(id) {
				this.selectedNetId = id;
				findNodeByNet(id).then(res => {
					this.nodeList = res;
					console.log("得到的nodeList：", res)
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});

			},
			//鼠标移动时指向节点高亮
			highlightNode(id, shouldHighlight) {
				// 根据 shouldHighlight 的值来添加或移除 'highlighted' 类
				if (shouldHighlight) {
					this.pointToNodeId = id;
				} else {
					this.pointToNodeId = null;
				}
			},
			//点击选择节点
			openNode(node) {
				this.selectedNodeId = node.nodeId;
				this.body.payload.shortAddr = node.shortAddr;
			},
			//选择命令，获取命令数据
			selectCommandChange(id) {
				console.log(typeof(id))
				//获取命令
				findbyOne(id).then(res => {
					this.commandData = res;
					console.log("this.commandData:", this.commandData)
					this.commandData.sysParameters.forEach((sys) => {
						switch (sys.name) {
							case 'sysTime':
								sys.value = new Date().toLocaleString();
								break;
							case 'nedNum':
								sys.value = this.selectedNetId;
								break;
							case 'nodeNum':
								sys.value = this.selectedNodeId;
								break;
							case 'appNum':
								sys.value = this.appRadio;
								break;
						}
					});
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});
			},
			calculatinputData(data) {
				// 在父组件中监听到子组件的自定义事件后，执行的方法
				console.log('从子组件接收到的数据：', data);
				this.inputData = data; // 更新父组件的数据
			},
			//解析命令
			callCommand() {
				this.requestCommandResult = {};
				this.dialogTableVisible = true;

				let prm = {};

				//准备系统参数
				for (let one of this.commandData.sysParameters) {
					prm[one.name] = one.value;
				}
				//准备自定义参数
				let i = 0;
				for (let one of this.commandData.parameterList) {
					prm[one.name] = this.inputData[i];
					i++
				}
				this.body.header.netId = this.selectedNetId;
				this.body.payload.nodeId = this.selectedNodeId;
				this.body.payload.dstEndpoint = this.appRadio;
				this.body.extraPayload.attributeValue = prm;

				//解析命令的参数
				let test = {
					id: this.selectedCommand,
					prm: prm
				};
				call(test).then(res => {
					this.commandResult = res;
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});
			},
			//更新令牌

			//发送命令
			//78号测试网络
			async sendCommand() {
				const url = "https://rest-t.huafeiiot.com/api/execute";
				const command = this.commandList.find(obj => obj.id === this.selectedCommand);
				let history = {
					name: command.name,
					state: -1,
					message: ""
				}
				//发送命令
				await axios.post(url, this.body, {
						"headers": this.headers
					})
					.then((response) => {
						this.requestCommandResult = response;
						console.log('成功:', response.data);
						history.state = response.status;
						history.message = response.message;
					})
					.catch((error) => {
						this.requestCommandResult = error;
						history.state = 401;
						history.message = error;
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

				//添加一条命令历史
				console.log("history:",history)
				if (history.message==undefined){
					history.message="";
				}
				addSendingHistory(history).then(res => {
					console.log("添加命令历史：", res)
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});
			},
			formatObject(obj) {
				// 辅助方法，用于格式化嵌套对象
				return JSON.stringify(obj, null, 2);
			}
		},
	}
</script>

<style>
	.el-aside {
		height: 650px;
		background-color: #E9EEF3;
		color: #333;
		text-align: center;
		/* line-height: 200px; */
		margin: 10px;
		border-radius: 4px
	}

	/* 鼠标指向命令样式 */
	.pointTolighted {
		background-color: #909399;
	}

	/* 选择命令样式 */
	.selectlighted {
		background-color: #606266;
	}

	.el-main {
		min-width: 300px;
		background-color: #E9EEF3;
		color: #333;
		text-align: center;
		line-height: 160px;
		margin: 10px;
		border-radius: 4px
	}



	.el-row {
		margin-bottom: 20px;
		margin: 8px;

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

	.bg-purple-light {
		background: #e5e9f2;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}

	.my_sys {
		width: 100%;
		border: 2px solid #007bbf;
		/* 外边框的样式，可以根据需要自定义颜色和宽度 */
		padding: 5px;
		margin-top: 20px;

	}

	.my_input {
		width: 100%;
		border: 2px solid #007bbf;
		/* 外边框的样式，可以根据需要自定义颜色和宽度 */
		padding: 5px;
		margin-top: 20px;
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
	}

	.my_alterable {
		height: 20px;
		width: calc(5%);
		/* 每列占据1/6的宽度，-10px是为了添加间距 */
		margin: 2px;
		/* 列之间的间距 */
		/* box-sizing: border-box; */

		font-weight: bold;
		color: brown;
	}
</style>
