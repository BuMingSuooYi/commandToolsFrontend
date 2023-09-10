<template>
	<div>
		<div v-for="(config, keyIndex) in inputConfig" :key="keyIndex" class="input-row">
			<div class="row-title">{{ config.name }}</div>
			<input class="input-cell" v-for="colIndex in config.value[0]" :key="colIndex"
				@keydown="handleKeyDown(keyIndex, colIndex, $event)" :ref="`${keyIndex}-${colIndex}`" />
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
		data() {
			return {
				inputData: {
				}
			};
		},
		created() {
			// 在组件创建时初始化 inputData 数组
			this.inputData = this.initializeInputData();
		},
		methods: {
			initializeInputData() {
			      // 根据 inputConfig 中的信息创建长度容易的数组
			      const initData = this.inputConfig.map((configItem) => {
			        const colCount = configItem.value[0];
			        return Array(colCount).fill('');
			      });
			
			      return initData;
			    },
			handleKeyDown(keyIndex, colIndex, event) {
				event.preventDefault();
				if (event.key >= '0' && event.key <= '9') {
					this.inputData[keyIndex][colIndex - 1] = event.key;
					console.log("this.inputData：", this.inputData[keyIndex][colIndex - 1])
					// 如果按下的是数字键
					const currentInput = this.$refs[`${keyIndex}-${colIndex}`][0];
					console.log("组件：", currentInput)
					currentInput.value = event.key;
					const nextColIndex = colIndex % this.inputConfig[keyIndex].value[0] + 1;
					const nextRowKey = nextColIndex === 1 ? (keyIndex + 1) % this.inputConfig.length : keyIndex;


					// 切换到下一行的第一个格子
					this.$nextTick(() => {
						const nextInput = this.$refs[`${nextRowKey}-${nextColIndex}`][0];
						if (nextInput) {
							nextInput.focus();
						}
					});

				} else if (event.key === 'Backspace' && colIndex > 1) {
					this.inputData[keyIndex][colIndex - 1] = '';
					// 如果按下的是删除键且不在第一个格子
					const previousColIndex = colIndex - 1;
					const currentInput = this.$refs[`${keyIndex}-${colIndex}`][0];
					const previousInput = this.$refs[`${keyIndex}-${previousColIndex}`][0];
					if (currentInput && previousInput) {
						currentInput.value = '';
						previousInput.focus();
					}
				} else if (event.key === 'Backspace' && colIndex == 1) {

					this.inputData[keyIndex][colIndex] = '';
					// 如果按下的是删除键且在第一个格子
					const currentInput = this.$refs[`${keyIndex}-${colIndex}`][0];
					const lastRowKey = keyIndex == 0 ? this.inputConfig.length - 1 : keyIndex - 1;
					console.log("lastRowKey:::", lastRowKey)
					const lastColIndex = this.inputConfig[lastRowKey].value[0];

					const nextInput = this.$refs[`${lastRowKey}-${lastColIndex}`][0];
					if (nextInput) {
						currentInput.value = '';
						nextInput.focus();
					}
				}
				console.log("数据：", this.inputData)
			},


			// U(key, colIndex, event) {
			// 	// 切换到上一行
			// 	const currentInput = this.$refs[`${key}-${colIndex}`][0];

			// 	const lastRowKey = key === Object.keys(this.inputConfig)[0] ?
			// 		Object.keys(this.inputConfig)[Object.keys(this.inputConfig).length - 2] :
			// 		Object.keys(this.inputConfig)[Object.keys(this.inputConfig).indexOf(key)];
			// 	if (colIndex > this.inputConfig[lastRowKey][0]) {
			// 		const lastColIndex = this.inputConfig[lastRowKey][0];
			// 	} else {
			// 		const lastColIndex = colIndex;
			// 	}
			// 	this.$nextTick(() => {
			// 		const nextInput = this.$refs[`${lastRowKey}-${lastColIndex}`][0];
			// 		if (nextInput) {
			// 			nextInput.focus();
			// 		}
			// 	});

			// },
			// D() {},
			// L() {},
			// R() {},
		}
	};
</script>

<style scoped>
	.input-row {
		height: 30px;
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

	.input-cell {
		width: 20px;
	}

	.row-title {
		width: 5em;
		/* 根据需要调整标题的宽度 */
		margin-right: 10px;
		/* 可以根据需要进行调整 */
		font-weight: bold;
		/* 样式可以根据需要进行调整 */
	}
</style>
