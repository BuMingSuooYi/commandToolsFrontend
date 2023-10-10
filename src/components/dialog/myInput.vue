<template>
	<div class="my-parameter">
		<!-- 自定义参数列表 -->
		<div class="my-parameter-item" :key="par.name" v-for="(par, index) of parameterList">
			<input class="my-left-input" v-model="par.name" placeholder="属性名"></input>
			<input class="my-right-input" v-model.number="par.length" placeholder="长度"></input>
			<el-button style="padding: 0px; margin: 6px; width: 20px; height: 20px;" icon="el-icon-circle-close"
				size="mini" circle @click="deleteParameter(index)"></el-button>
		</div>
		<div class="my-parameter-item">
			<div class="my-add-button" v-if="state==false" @click="showAdd">
				添加参数
			</div>
			<div v-else>
				<input class="my-left-input" ref="showAddInput" @keydown.enter="focusAddInput" v-model="parameter.name"
					placeholder="属性名"></input>
				<input class="my-right-input" ref="nextAddInput" @blur="AddBlur" v-model.number="parameter.length"
					placeholder="长度"></input>
			</div>

		</div>
	</div>
</template>



<script>
	export default {
		props: {
			parStr: {
				type: String,
				required: true,
			},
		},
		created() {
			if (this.parStr !== JSON.stringify(this.parameterList)) {
				this.parameterList = JSON.parse(this.parStr);
			}
		},
		data() {
			return {
				// 动态标签数据数组
				parameterList: [],
				//添加时的状态
				state: false,
				//添加数据
				parameter: {
					name: '',
					length: null
				}


			};
		},
		watch: {
			'parameterList': {
				handler(newArray, oldArray) {
					const newStr= JSON.stringify(newArray)
					if (newStr!==this.parStr) {
						console.log("自定义变量发生变化：",newStr)
						this.$emit("updateValue", newStr);
					}
				},
				deep: true // 监视数组内部变化
			}
		},
		methods: {
			//显示添加参数的框
			showAdd() {
				this.state = true
				console.log(this)
				// 使用 $nextTick 确保组件渲染完成后再访问 $refs
				this.$nextTick(() => {
					// 使用 $refs 来访问引用的输入框，并调用 focus() 方法
					this.$refs.showAddInput.focus();
				});
			},
			//第一个输入框回车聚焦下一个输入框
			focusAddInput(event) {
				if (event.key == 'Enter') {
					this.$nextTick(() => {
						// 使用 $refs 来访问引用的输入框，并调用 focus() 方法
						this.$refs.nextAddInput.focus();
					});
				}
			},
			//删除参数
			deleteParameter(index) {
				// 通过参数的索引从数组中删除相应的对象
				this.parameterList.splice(index, 1);
			},
			// 新增自定义变量的处理
			AddBlur(event) {
				// 使用 find() 方法检查是否存在相同的 name 属性的对象
				const foundObject = this.parameterList.find(item => item.name === this.parameter.name);

				if (!foundObject && this.parameter.name != '') {
					// 如果未找到匹配的对象，则将对象添加到数组
					this.parameterList.push(this.parameter);
					this.state = false;
					this.parameter = {
						name: '',
						length: null
					}
					console.log('对象已添加到数组中');
				} else {
					// 如果已经存在匹配的对象，则不进行添加
					console.log('对象已存在于数组中');
					this.state = false;
				}
			},
		}
	}
</script>

<style>
	.my-parameter {
		max-height: 200px;
		overflow-y: auto;
		/* 添加垂直滚动条 */
		padding: 0px;
		margin: 10px;
	}

	/* 隐藏滚动条 */
	.my-parameter::-webkit-scrollbar {
		width: 5px;
		/* 隐藏滚动条 */
	}

	/* 显示浅色滚动条 */
	.my-parameter::-webkit-scrollbar-thumb {
		background-color: #ccc;
		/* 浅色滚动条的背景颜色 */
	}

	/* 隐藏或使其它轨道透明 */
	.my-parameter::-webkit-scrollbar-track {
		background-color: transparent;
		/* 使轨道透明 */
	}

	.my-parameter-item {
		display: flex;
		/* 使用Flexbox布局 */
		margin: 6px;

	}

	.my-add-button {
		width: 150px;
		/* 控制输入框的宽度 */
		height: 20px;
		/* 控制输入框的高度 */
		margin: 1px;
		border: 1px solid #ccc;
		/* 外框样式 */
		border-radius: 5px;
		padding: 5px;
		text-align: center;
		/* 文本水平居中对齐 */
	}

	.my-add-button:hover {
		background-color: #E5F6FC;
		/* 鼠标悬停时的背景颜色 */
		color: #89D7F7;
		/* 鼠标悬停时的文本颜色 */
	}

	.my-left-input {
		border-style: solid dashed solid solid;
		border-radius: 5px 0px 0px 5px;
		border-color: #ccc;
		border-width: 1px;
		width: 100px;
		/* 控制输入框的宽度 */
		height: 30px;
		/* 控制输入框的高度 */

	}

	.my-right-input {
		border-style: solid solid solid dashed;
		border-radius: 0px 5px 5px 0px;
		border-color: #ccc;
		border-width: 1px;
		width: 50px;
		/* 控制输入框的宽度 */
		height: 30px;
		/* 控制输入框的高度 */

	}
</style>
