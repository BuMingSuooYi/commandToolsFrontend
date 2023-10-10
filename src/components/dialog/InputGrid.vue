<template>
	<div>
		<!-- keyIndex从0开始 -->
		<div v-for="(config, keyIndex) in inputConfig" :key="keyIndex" class="input-row">

			<div class="row-title">{{ config.name }}</div>
			<div class="input-cell">
				<!-- colIndex从1开始 -->
				<input class="my-input" v-for="colIndex in config.length" :key="colIndex"
					v-model="inputData[keyIndex][colIndex - 1]" @keydown="handleKeyDown(keyIndex, colIndex, $event)"
					@input="handleChange(keyIndex, colIndex)" :ref="`${keyIndex}-${colIndex}`" />
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			inputConfig: {
				type: Array,
				required: true,
			},
		},
		created() {
			this.initializeInputData();
			this.sendInputData();
		},
		watch: {
			inputConfig() {
				this.initializeInputData();
				this.sendInputData();
			},
			inputData() {
				console.log("变化了")
				this.sendInputData();
			},
		},
		data() {
			return {
				inputData: {},
				resultData: {},
			};
		},
		methods: {
			initializeInputData() {
				// 根据 inputConfig 中的信息初始化填写数组
				this.inputData = this.inputConfig.map((configItem) => {
					const colCount = configItem.length;
					return Array(colCount).fill('');
				});

				// 根据 inputConfig 中的信息初始化结果数组
				for (const data of this.inputConfig) {
					const colCount = data.length;
					this.resultData[data.name] = Array(colCount).fill(0);
				}

			},
			// 每次按键触发
			handleKeyDown(keyIndex, colIndex, event) {
				// 回车换行
				if (event.key == 'Enter') {
					event.preventDefault();
					const currentInput = this.$refs[`${keyIndex}-${colIndex}`][0];
					const nextColIndex = colIndex % this.inputConfig[keyIndex].length + 1;
					const nextRowKey = nextColIndex === 1 ? (keyIndex + 1) % this.inputConfig.length : keyIndex;
					// 切换到下一行的第一个格子
					this.$nextTick(() => {
						const nextInput = this.$refs[`${nextRowKey}-${nextColIndex}`][0];
						if (nextInput) {
							nextInput.focus();
						}
					});
				}
				// 删除或跳到上一格
				if (event.key === 'Backspace') {
					// console.log("按下删除键时：", this.inputData[keyIndex][colIndex - 1], keyIndex, colIndex - 1)
					// 按删除时为空，跳转到上一个输入框
					if (this.inputData[keyIndex][colIndex - 1] == '') {
						let lastColIndex;
						let lastRowKey;
						if (keyIndex == 0 && colIndex == 1) {
							lastRowKey = this.inputData.length - 1;
							lastColIndex = this.inputData[lastRowKey].length;
						} else if (keyIndex != 0 && colIndex == 1) {
							lastRowKey = keyIndex - 1;
							lastColIndex = this.inputData[lastRowKey].length;
						} else {
							lastRowKey = keyIndex;
							lastColIndex = colIndex - 1;
						}
						// 切换到上一个格子
						this.$nextTick(() => {
							const nextInput = this.$refs[`${lastRowKey}-${lastColIndex}`][0];
							if (nextInput) {
								nextInput.focus();
							}
						});
					}
				}
			},
			// 向父组件传递数据
			sendInputData() {
				// 做数据检查转化，传递数据
				this.$emit('resultData', this.resultData);
				console.log("resultData：", this.resultData)
			},
			// 数据检查和转化
			handleChange(keyIndex, colIndex) {
				let value = this.inputData[keyIndex][colIndex - 1];
				// 进制转化
				if (value.startsWith('0x')) {
					// 如果以'0x'开头，将其解析为十六进制数并转为十进制
					value = parseInt(value, 16);
				} else if (value.startsWith('0b')) {
					// 如果以'0b'开头，将其解析为二进制数并转为十进制
					value = parseInt(value.slice(2), 2);
				} else {
					// 如果不满足上述条件，将其转为整数
					value = Number(value)
				}
				const currentInput = this.$refs[`${keyIndex}-${colIndex}`][0];
				// 数值检查，不符合变为0
				if (value >= 0 && value <= 255) {
					// 移除一个类，不确定是否存在
					currentInput.classList.remove('error-border');
				} else {
					// 添加一个类
					currentInput.classList.add('error-border');
					value = 0;
				}
				let key = this.inputConfig[keyIndex].name
				this.resultData[key][colIndex - 1] = value;
			}
		}
	};
</script>

<style scoped>
	.input-row {
		/* height: 30px; */
		display: flex;
		/* 使用 flexbox 布局 */
		flex-wrap: nowrap;
		/* 防止子元素换行 */
		overflow-x: auto;
		/* 允许横向滚动 */
		width: 100%;
		/* 可根据需要设置容器的宽度 */
		display: flex;
		margin-bottom: 10px;
	}

	.my-input {
		border: 1px solid #ccc;
		/* 浅色边框 */
		border-radius: 4px;
		/* 圆角 */
		padding: 5px;
		/* 内边距 */
		width: 40px;
		height: 20px;
		margin: 2px;
	}

	.error-border {
		/* 红色边框样式 */
		border: 1px solid red;
	}

	.my-input:focus {
		border-color: #007bff;
		/* 聚焦时的边框颜色 */
		outline: none;
		/* 去掉默认的聚焦边框（在某些浏览器上会有默认的蓝色边框） */
	}

	.row-title {
		width: 5em;
		/* 根据需要调整标题的宽度 */
		margin-right: 4px;
		/* 可以根据需要进行调整 */
		font-weight: bold;
		/* 样式可以根据需要进行调整 */
	}
</style>
