<template>
	<div>
		<el-container>
			<el-aside width="200px">
				<p>网络</p>
				<div class="list">
					<div v-for="net in netList" @click="" @mouseenter="highlightNet(net.id, true)"
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
					<div v-for="node in nodeList" @click="" @mouseenter="highlightNode(node.id, true)"
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
						<el-radio-button label="1"></el-radio-button>
						<el-radio-button label="2"></el-radio-button>
						<el-radio-button label="3"></el-radio-button>
						<el-radio-button label="4"></el-radio-button>
						<el-radio-button label="5"></el-radio-button>
						<el-radio-button label="6"></el-radio-button>
						<el-radio-button label="7"></el-radio-button>
						<el-radio-button label="8"></el-radio-button>
					</el-radio-group>
				</div>
				<div>
					选择命令
					<el-select v-model="value" placeholder="请选择">
						<el-option-group v-for="group in options" :key="group.label" :label="group.label">
							<el-option v-for="item in group.options" :key="item.value" :label="item.label"
								:value="item.value">
							</el-option>
						</el-option-group>
					</el-select>
				</div>

				<div>
					<el-row>
						<el-col :span="8">
							<div class="grid-content bg-purple">
								<div class="scrollable-list-container my_sys">
									<ul class="scrollable-list">
										<li v-for="item in sysList" :key="item.id">{{ item }}</li>
									</ul>
								</div>
							</div>
						</el-col>
						<el-col :span="2">
							<div class="grid-content"></div>
						</el-col>
						<el-col :span="8">
							<div class="grid-content bg-purple">
								<div class="scrollable-list-container my_input">
									<div class="scrollable-list">
										<InputGrid :inputConfig="configArray" />
									</div>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>

				<div>
					<el-button @click="dialogTableVisible = true" style="width: 300px;">预览命令</el-button>

					<el-dialog title="预览命令" :visible.sync="dialogTableVisible">

					</el-dialog>
				</div>

			</el-aside>
		</el-container>
	</div>
</template>

<script>
	import InputGrid from './InputGrid.vue';
	export default {
		components: {
			InputGrid,
		},
		data() {
			return {
				count: 50,
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
				options: [{
					label: '基础命令',
					options: [{
						value: '开灯',
						label: '开灯'
					}, {
						value: '关灯',
						label: '关灯'
					}]
				}, {
					label: '定制命令',
					options: [{
						value: '睡眠模式',
						label: '睡眠模式'
					}, {
						value: '回家模式',
						label: '回家模式'
					}, {
						value: '播放音乐',
						label: '播放音乐'
					}]
				}],
				value: '',

				sysList: [
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
					"系统参数1：123456",
				],
				inputConfig: {
					long: [4, '长度'],
					key: [2, '命令类型'],
					a: [4, '长度'],
					b: [2, '命令类型'],
					c: [4, '长度'],
					d: [2, '命令类型'],
					e: [4, '长度'],
					f: [2, '命令类型'],
					g: [4, '长度'],
					h: [2, '命令类型'],
					i: [4, '长度'],
					g: [2, '命令类型'],
					k: [4, '长度'],
					l: [2, '命令类型'],
					m: [4, '长度'],
				},

				dialogTableVisible: false,

			}
		},
		computed: {
			configArray() {

				let a = Object.keys(this.inputConfig).map((key) => ({
					name: key,
					value: this.inputConfig[key],
				}));
				console.log("转换数组：", a)
				// 将inputConfig对象转换为数组
				return a
			},
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
			//鼠标移动时指向节点高亮
			highlightNode(id, shouldHighlight) {
				// 根据 shouldHighlight 的值来添加或移除 'highlighted' 类
				if (shouldHighlight) {
					this.pointToNodeId = id;
				} else {
					this.pointToNodeId = null;
				}
			},
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
