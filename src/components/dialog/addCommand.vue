<template>
	<div>
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="命令名称">
				<el-input v-model="form.name" style="width: 205px;" placeholder="请输入名称"></el-input>
			</el-form-item>

			<el-form-item label="命令分类">
				<el-autocomplete class="inline-input" v-model="form.type" :fetch-suggestions="querySearch"
					placeholder="请输入分类" @select="handleSelect"></el-autocomplete>
			</el-form-item>

			<el-row>
				<el-col :span="12">
					<div>
						自定义参数:
						<MyInput :parStr="form.parameter" @updateValue="updateParentValue"></MyInput>
					</div>
				</el-col>
				<el-col :span="12">
					<div>
						可用系统参数:
						<div>
							<el-tooltip v-for="sys in sysList" :key="sys.id" class="item" effect="dark" :content="sys.remark" placement="top">
								<div class="my-sys" > {{sys.name}}</div>
							</el-tooltip>
							
						</div>

					</div>
				</el-col>
			</el-row>


			<div>
				制定命令:
				<editor v-model="form.jsCode" @init="editorInit_parameter" @input="jsCodeChange" lang="javascript"
					width="100%" height="200px" style="margin-top: 10px;">
				</editor>
			</div>

			<el-form-item>
				<el-button v-if="form.id==undefined" type="primary" @click="onSubmit">创建</el-button>
				<el-button v-else type="primary" @click="onSubmit">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import MyInput from './myInput.vue';
	import {
		add,
		updata,
		findAlltype
	} from '../../api/command.js'

	export default {
		components: {
			// 引入编辑器模块
			editor: require('vue2-ace-editor'),
			MyInput
		},
		props: {
			comment: {
				type: Object,
			},
			sysList: {
				type: Array,
			}
		},
		created() {
			console.log("参考：", this.comment)
			if (this.comment != undefined) {
				this.form = {
					id: this.comment.id,
					name: this.comment.name,
					type: this.comment.type,
					parameter: this.comment.parameter,
					sysParameter: this.comment.sysParameter,
					jsCode: this.comment.jsCode,
					// creatTime: this.comment.creatTime,
					// upDate: this.comment.upDate
				};
			}
		},
		data() {
			return {
				//表格数据
				form: {
					name: '',
					type: '',
					parameter: `[{"name":"long","length":3},{"name":"key","length":2}]`,
					sysParameter: ``,
					jsCode: `function editCommand() {
	let array=[];
	
	
	
	return array;
}

editCommand();`,
				},
				restaurants: [{
						value: '分组1'
					},
					{
						value: '分组2'
					}
				],
				myPar: [],
				sysPar: [],
				myCode: ``
			}
		},
		methods: {
			//提交表格
			onSubmit() {
				if (this.form.id == undefined) {
					add(this.form).then(res => {
						this.$store.commit('changeAddF', false);
						this.$emit("confirmAddorEdit");
					}).catch(err => {
						// this.$message.error('请求出错了：' + err);
					});
				} else {
					updata(this.form).then(res => {
						this.$store.commit('changeEditF', false);
						this.$emit("confirmAddorEdit");
					}).catch(err => {
						// this.$message.error('请求出错了：' + err);
					});
				}
				console.log('submit!',this.form);
				this.$emit("close");
				
			},
			//分类选择
			handleSelect(item) {
				console.log(item);
			},
			//获取分类列表
			async querySearch(queryString, cb) {
				
				await findAlltype().then(res => {
					this.restaurants = res.map((obj) => {
					  return {
					    value: obj.type,
					  };
					});
				}).catch(err => {
					this.restaurants = [];
					console.log("类型获取失败：", err)
				});
				console.log(queryString, cb, this.restaurants);
				// 调用 callback 返回建议列表的数据
				cb(this.restaurants);
			},
			//编辑器的初始化
			editorInit_parameter() {
				require('brace/ext/language_tools') //language extension prerequsite...
				require('brace/mode/javascript') //language
				require('brace/theme/chrome')
				require('brace/snippets/javascript') //snippet
				this.analysisMyPar();
				this.jsCodeChange();
			},

			//自定义变量被修改
			updateParentValue(newValue) {
				this.form.parameter = newValue;
				//解析自定义的变量
				this.analysisMyPar()
				//拼接代码
				this.jointJsCode();
			},

			//解析自定义的变量
			analysisMyPar() {
				// 将字符串解析为JavaScript对象数组
				const objectArray = JSON.parse(this.form.parameter);
				console.log(objectArray)
				// 使用map方法提取name属性
				this.myPar = objectArray.map(item => item.name);
				console.log(this.myPar)
			},

			//解析代码中的系统变量
			analysisSysPar() {
				//解析系统参数
				console.log("系统参数列表：", this.sysList)
				//系统参数的名字数组
				let namesArray = this.sysList.map((sysParam) => sysParam.name);
				const regex = new RegExp(`\\b(${namesArray.join('|')})\\b`, 'g');
				// // 创建正则表达式，匹配 namesArray 中的任何名称，但只匹配一次
				// const regex = new RegExp(`\\b(${namesArray.join('|')})\\b(?!.*\\b\\1\\b)`, 'g');
				let matches = this.myCode.match(regex) || [];

				// 使用 Set 来去重
				matches = [...new Set(matches)];
				if (matches.length == 1 && matches[0] == '') {
					this.sysPar = [];
				} else {
					this.sysPar = matches;
				}
				this.form.sysParameter=this.sysPar.join(',');
				console.log("命令的系统参数名称列表：", this.sysPar)
			},

			//拼接代码
			jointJsCode() {
				let str1 = `function editCommand(`;
				// 变量列表
				let myParStr = "";
				for (let key of this.myPar) {
					myParStr = myParStr + key + ',';
				}
				for (let key of this.sysPar) {
					myParStr = myParStr + key + ',';
				}
				// 移除最后一个逗号
				myParStr = myParStr.slice(0, -1);

				let str2 = `){`

				let myCode = this.myCode;

				let str3 = `}
				
editCommand(`
				let str4 = myParStr + ");";

				this.form.jsCode = str1 + myParStr + str2 + myCode + str3 + str4;
			},

			//js代码更改后需要格式化js代码
			jsCodeChange() {
				// 截取以 "function editCommand() {" 开头，以 "} editCommand();" 结束之间的内容
				const regex = /function\s+editCommand\([^)]*\)\s*\{([\s\S]*?)\}/;
				const match = this.form.jsCode.match(regex);

				if (match) {
					const contentBetweenBraces = match[1];
					if (contentBetweenBraces.trim() != this.myCode.trim()) {
						this.myCode = contentBetweenBraces;
						//重新解析系统参数
						this.analysisSysPar()
						
					} else {
						this.myCode = contentBetweenBraces;
						console.log("不需要修改函数头尾",contentBetweenBraces);
					}
				} else {
					console.log("未找到匹配内容");
				}
				//拼接代码
				this.jointJsCode();
			},
		},

	}
</script>

<style>
	.my-sys {
		display: inline-block;
		margin: 5px;
		padding: 5px;
		border-style: solid;
		border-color: #ccc;
		border-width: 2px;
		border-radius: 5px;
	}
</style>
