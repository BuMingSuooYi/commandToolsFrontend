<template>
	<div>
		<el-container>
			<el-aside width="200px">
				<p>网络</p>
				<div class="list">
					<div v-for="net in netList" @click="openNet(net.id)" @mouseenter="highlightNet(net.id, true)"
						@mouseleave="highlightNet(net.id, false)"
						:class="{ 'selectlighted': net.id == selectedNetId ,'pointTolighted':net.id ==pointToNetId }">
						<el-row>
							<el-col :span=" 24">
								<div class="grid-content bg-purple">{{ net.name }}</div>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-aside>
			<el-aside width="200px">
				<p>节点</p>
				<div class="list">
					<div v-for="node in nodeList" @click="openNode(node.id)" @mouseenter="highlightNode(node.id, true)"
						@mouseleave="highlightNode(node.id, false)"
						:class="{ 'selectlighted': node.id == selectedNodeId ,'pointTolighted':node.id ==pointToNodeId }">
						<el-row>
							<el-col :span="24">
								<div class="grid-content bg-purple">{{ node.name }}</div>
							</el-col>
						</el-row>
					</div>

				</div>

			</el-aside>
			<el-aside width="90%">
				<div style="margin-top: 20px">
					<el-radio-group v-model="appRadio" size="medium">
						<el-radio-button label=1></el-radio-button>
						<el-radio-button label=2></el-radio-button>
						<el-radio-button label=3></el-radio-button>
						<el-radio-button label=4></el-radio-button>
						<el-radio-button label=5></el-radio-button>
						<el-radio-button label=6></el-radio-button>
						<el-radio-button label=7></el-radio-button>
						<el-radio-button label=8></el-radio-button>
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
										<InputGrid :inputConfig="commandData.parameterList" />
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

					<el-dialog title="预览命令" :visible.sync="dialogTableVisible">
					{{this.commandResult}}
					</el-dialog>
				</div>

			</el-aside>
		</el-container>
	</div>
</template>

<script>
	import InputGrid from './InputGrid.vue';
	import {
		findbyOne,
		call
	} from '../api/command.js';
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
				netList: [{
						id: 1,
						name: "网络1",
						value: 1
					},
					{
						id: 2,
						name: "网络2",
						value: 2
					},
					{
						id: 3,
						name: "网络3",
						value: 3
					},
				],
				selectedNetId: null,
				pointToNetId: null,
				nodeList: [{
						id: 1,
						name: "节点1",
						value: 1
					},
					{
						id: 2,
						name: "节点2",
						value: 2
					},
					{
						id: 3,
						name: "节点3",
						value: 3
					},
				],
				selectedNodeId: null,
				pointToNodeId: null,
				appRadio: 0,
				selectedCommand: null,
				//选中的命令数据
				commandData: {
					sysParameters: [],
					parameterList: [],
				},
				//命令预览弹窗
				dialogTableVisible: false,
				commandResult:"",

			}
		},
		//钩子函数，加载数据
		created() {
			console.log(this.commandList)

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
			openNode(id) {
				this.selectedNodeId = id;
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
			callCommand() {
				console.log("进入测试")
				this.dialogTableVisible=true;
				let array=[];
				//请在**之间编写你的命令规则
				let one=['h','e','l','l','o'];
				let two=['w','o','r','l','d'];
				array.push(one);
				array.push(two);
				array.push(3);
				console.log("array:",array);
				
				let test = {
					id: this.selectedCommand,
					prm: {
						long: 10,
						key: 20,
						message: 'Hello, World!',
						sysTime: new Date().toLocaleString(),
						nedNum: this.selectedNetId,
						nodeNum: this.selectedNodeId,
						appNum: Number(this.appRadio) ,
					},
				};
				call(test).then(res => {
					console.log("测试命令123：", res);
					this.commandResult=res;
				}).catch(err => {
					this.$message.error('请求出错了：' + err);
				});
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
</style>
