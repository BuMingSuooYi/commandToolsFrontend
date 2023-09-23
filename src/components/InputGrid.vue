<template>
	<div>
		<div v-for="(config, keyIndex) in inputConfig" :key="keyIndex" class="input-row">

			<div class="row-title">{{ config.name }}</div>
			<div class="input-cell">
				<input style="width: 20px;height: 20px;" v-for="colIndex in config.value[0]" :key="colIndex"
					@keydown="handleKeyDown(keyIndex, colIndex, $event)" :ref="`${keyIndex}-${colIndex}`" />
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
		watch: {
			inputConfig() {
				// 参数发生变化时执行的操作
				this.inputData = this.initializeInputData();
			},
			inputData() {
				console.log("监控到变化")
				this.sendInputData();
			},
		},
		data() {
			return {
				inputData: {},
				keyBoolean:true,
			};
		},
		// created() {
		// 	console.log("进入初始化：",)
		// 	// 在组件创建时初始化 inputData 数组
		// 	this.inputData = this.initializeInputData();
		// 	console.log("初始化数据：",this.inputData)
		// },
		methods: {
			initializeInputData() {
				// 根据 inputConfig 中的信息创建长度容易的数组
				const initData = this.inputConfig.map((configItem) => {
					const colCount = configItem.value[0];
					return Array(colCount).fill(0);
				});

				console.log("初始化创建的数组：", initData)

				// const initData = {};
				// this.inputConfig.forEach((configItem) => {
				//   const colCount = configItem.value[0];
				//   initData[configItem.name] = Array(colCount).fill(0);
				// });

				// console.log("初始化创建的对象：", initData)

				return initData;
			},
			handleKeyDown(keyIndex, colIndex, event) {
				// if(event.key=='Enter'){
				// 	event.preventDefault();
				// 	if(this.keyBoolean==false){
				// 		const currentInput = this.$refs[`${keyIndex}-${colIndex}`][0];
				// 		// console.log("组件：", currentInput)
				// 		currentInput.value = event.key;
				// 		const nextColIndex = colIndex % this.inputConfig[keyIndex].value[0] + 1;
				// 		const nextRowKey = nextColIndex === 1 ? (keyIndex + 1) % this.inputConfig.length : keyIndex;
						
						
				// 		// 切换到下一行的第一个格子
				// 		this.$nextTick(() => {
				// 			const nextInput = this.$refs[`${nextRowKey}-${nextColIndex}`][0];
				// 			if (nextInput) {
				// 				nextInput.focus();
				// 			}
				// 		});
				// 	}
				// 	this.keyBoolean=!this.keyBoolean;
				// 	console.log("按下回车,",this.keyBoolean)
				// }
				if (event.key >= '0' && event.key <= '9'&&this.keyBoolean) {
					event.preventDefault();
					// console.log("按下的是数字键")
					this.inputData[keyIndex][colIndex - 1] = Number(event.key);
					// console.log("this.inputData：", this.inputData[keyIndex][colIndex - 1])
					// 如果按下的是数字键
					const currentInput = this.$refs[`${keyIndex}-${colIndex}`][0];
					// console.log("组件：", currentInput)
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
					event.preventDefault();
					this.inputData[keyIndex][colIndex - 1] = 0;
					// 如果按下的是删除键且不在第一个格子
					const previousColIndex = colIndex - 1;
					const currentInput = this.$refs[`${keyIndex}-${colIndex}`][0];
					const previousInput = this.$refs[`${keyIndex}-${previousColIndex}`][0];
					if (currentInput && previousInput) {
						currentInput.value = '';
						previousInput.focus();
					}
					// this.keyBoolean=true;
				} else if (event.key === 'Backspace' && colIndex == 1) {
					event.preventDefault();
					this.inputData[keyIndex][colIndex - 1] = 0;
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
					// this.keyBoolean=true;
				}
				// console.log("数据：", this.inputData)
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
			sendInputData() {
				// 在子组件，传递数据
				this.$emit('inputData', this.inputData);
			},
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

	.input-cell {
		display: flex;
		flex-wrap: wrap;
		/* 允许元素在需要时换行 */
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
