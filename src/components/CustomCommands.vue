<template>
	<div>
		<el-container>
			<!-- 命令区域 -->
			<el-aside width="20%" id="commandList">
				<el-button type="primary" @click="addCommandInit">编写新命令</el-button>

				<el-input id="my_input" placeholder="命令名称查询" v-model="input" clearable>
				</el-input>

				<div v-for="command in commandList" :key="command.id" @click="openCommand(command.id)"
					@mouseenter="highlightItem(command.id, true)" @mouseleave="highlightItem(command.id, false)"
					:class="{ 'selectlighted': command.id == internalSelectedCommandId ,'pointTolighted':command.id ==pointToCommandId } ">
					<el-row>
						<el-col :span=" 24">
							<div class="grid-content bg-purple">{{command.name}}</div>
						</el-col>
					</el-row>
				</div>


				<!-- <el-pagination small background layout="prev, pager, next" :total="commandList.length"> -->
				</el-pagination>

			</el-aside>

			<!-- 命令编辑区域 -->
			<el-aside width="40%" id="commandEditingRegion">
				<div>
					<el-card class="box-card">
						<el-form ref="form" label-width="80px">
							<el-form-item label="命令名称">
								<el-input v-model="commandData.name"></el-input>
							</el-form-item>
						</el-form>
						<!-- 创建时间:xx-xx-xx
						修改时间:xx-xx-xx -->
					</el-card>
				</div>
				<div class="my_editor">
					<editor v-model="commandData.parameter" @init="editorInit_parameter" @input="parameterChange"
						lang="json" width="100%" height="200px">
					</editor>
				</div>

				<div class="my_editor">
					<editor v-model="commandData.jsCode" @init="editorInit_command" @input="saveMyCommand"
						lang="javascript" width="100%" height="200px">
					</editor>
				</div>
				<el-button v-if="commandData.id" @click="saveCommand">保存修改</el-button>
				<el-button v-else type="primary" @click="addCommand">添加新命令</el-button>

			</el-aside>

			<!-- 系统参数显示区域 -->
			<el-aside width="36%" id="parameterRegion">
				<div class="scrollable-list-container">
					<ul class="scrollable-list">
						<li v-for="sysParameter in sysList" :key="sysParameter.id">{{sysParameter.name}}（{{ sysParameter.remark}}）</li>
					</ul>
				</div>




			</el-aside>
		</el-container>
	</div>


</template>

<script>
	export default {
		components: {
			// 引入编辑器模块
			editor: require('vue2-ace-editor'),
		},
		props: {
			commandList: {
				type: Array,
				required: true,
			},
			selectedCommandId: {
				type: Number,
				value: null,
			},
			sysList:{
				type: Array,
				value: [],
			}
		},
		data() {
			return {
				input: '',
				internalSelectedCommandId: this.selectedCommandId,
				//鼠标移动时指向的命令id
				pointToCommandId: null,
				//当前的命令数据
				commandData: {
					name: "新命令",
					jsCode: "",
					parameter: `{
	"long":[4,"长度"],
	"key":[2,"命令类型"]
}`,
				},
				//由上面parameter得到的参数列表
				variableList: [],
				variableF: true,
				//保存自定义编写的命令
				myCommand: `
					
//请在**之间编写你的命令规则
let one=['h','e','l','l','o'];
let two=['w','o','r','l','d'];
array.push(one);
array.push(two);

`,

			};
		},
		//钩子函数，加载数据
		created() {
			if (this.selectedCommandId != null) {
				this.openCommand(this.selectedCommandId);
			}
		},
		//监控属性
		watch: {
			selectedCommandId(newValue, oldValue) {
				internalSelectedCommandId: newValue;
				if (newValue != null) {
					this.openCommand(newValue);
				}
			}
		},
		methods: {
			//参数编辑器初始化配置
			editorInit_parameter: function() {
				require('brace/ext/language_tools') //language extension prerequsite...
				require('brace/mode/json') //language
				require('brace/theme/chrome')
				require('brace/snippets/javascript') //snippet
			},
			//命令编辑器初始化配置
			editorInit_command: function() {
				require('brace/ext/language_tools') //language extension prerequsite...
				require('brace/mode/javascript') //language
				require('brace/theme/chrome')
				require('brace/snippets/javascript') //snippet
				this.parameterChange();
			},
			//参数变化时调用的函数
			parameterChange: function() {
				//解析参数,整理返回得到参数列表
				this.analysisParameter();
				//参数发送改变时，将命令中的参数替换
				this.analysisCommand();
			},

			//解析参数,整理返回得到参数列表
			analysisParameter: function() {
				// 解析变量
				try {
					this.variableList = JSON.parse(this.commandData.parameter);
					this.variableF = true;
					console.log(this.variableList);
				} catch (error) {
					this.variableF = false;
					console.log('变量，JSON格式错误：');
				}
			},

			//命令发生变化时保存自定义部分的命令
			saveMyCommand: function() {
				const regex = /function editCommand\(.*?\) {\nlet array=\[];([\s\S]*?)return array;/;
				const matches = this.commandData.jsCode.match(regex);

				if (matches) {
					this.myCommand = matches[1];
					console.log("matches[1]：",matches[1]);
					console.log("命令：",this.myCommand);
				} else {
// 					this.myCommand = `
					
// //从这里开始编写你的命令规则
// let one=['h','e','l','l','o'];
// let two=['w','o','r','l','d'];
// array.push(one);
// array.push(two);

// `;
				}
			},
			//参数发送改变时，将命令中的参数替换
			analysisCommand: function() {
				let str1 = `function editCommand(`;
				// 变量列表
				let variableStr = "";
				for (var key in this.variableList) {
					variableStr = variableStr + key + ',';
				}
				// 移除最后一个逗号
				variableStr = variableStr.slice(0, -1);

				let str2 = `) {
let array=[];`

				let myCommand = this.myCommand;

				let str3 = `return array;
}`

				this.commandData.jsCode = str1 + variableStr + str2 + myCommand + str3;
			},
			//添加命令初始化
			addCommandInit() {
				this.internalSelectedCommandId = null;
				this.commandData = {
					name: "新命令",
					jsCode: "",
					parameter: `{
	"long":[4,"长度"],
	"key":[2,"命令类型"]
}`,
				};
				this.analysisCommand();

			},
			//打开命令
			openCommand(id) {
				const command = this.commandList.find(item => item.id === id);
				this.commandData = {
					id: command.id,
					name: command.name,
					jsCode: command.jsCode,
					parameter: command.parameter,
				};
				this.internalSelectedCommandId = id;
			},
			//鼠标移动时指向命令高亮
			highlightItem(id, shouldHighlight) {
				// 根据 shouldHighlight 的值来添加或移除 'highlighted' 类
				if (shouldHighlight) {
					this.pointToCommandId = id;
				} else {
					this.pointToCommandId = null;
				}
			},
			//传递给父组件的添加命令
			addCommand() {
				console.log("点击添加")
				if (this.variableF) {
					let a = this.$emit('addCommand', this.commandData);
					console.log("aaaaa:", a)
				} else {
					this.$message({
						message: '变量格式错误，请采用json格式',
						type: 'warning'
					});
				}


			},
			//传递给父组件的保存命令
			saveCommand() {

			}

		}

	}
</script>

<style>
	/* 命令列表区域 */
	#commandList {
		background-color: #E9EEF3;
		color: #333;
		text-align: center;
		/* line-height: 200px; */
		margin: 10px;
		border-radius: 4px
	}

	.el-button {
		width: 100%;
		margin-top: 10px;
	}

	#my_input {
		margin-top: 10px;
		margin-bottom: 10px;
	}

	/* 鼠标指向命令样式 */
	.pointTolighted {
		background-color: #909399;
	}

	/* 选择命令样式 */
	.selectlighted {
		background-color: #606266;
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

	/* 变量编辑和命令编辑部分 */

	.box-card {
		width: 100%;
		height: 100px;
		display: flex;
		text-align: center;
		/* 水平居中文本 */
		align-items: center;
		padding: 0px;
		margin: 0px;
	}

	#parameterRegion {
		min-width: 300px;
		background-color: #E9EEF3;
		color: #333;
		/* text-align: center; */
		margin: 10px;
		border-radius: 4px
	}

	#commandEditingRegion {
		min-width: 300px;
		background-color: E9EEF3;
		color: #333;
		/* text-align: center; */
		margin: 10px;
		padding: 10px;
		border-radius: 4px
	}

	/*系统参数部分 */
	.scrollable-list-container {
		height: 300px;
		/* 设置容器的宽度 */
		overflow-y: auto;
		/* 允许横向滚动 */
	}

	.scrollable-list {
		list-style: none;
		padding: 0;
		margin: 0;
		white-space: nowrap;
		/* 防止文本换行 */
	}

	.scrollable-list li {
		margin: 10px;
		/* 列表项之间的间距 */
	}


	.my_editor {
		border: 2px solid #007bbf;
		/* 外边框的样式，可以根据需要自定义颜色和宽度 */
		padding: 0px;
		margin-top: 20px;
	}
</style>
