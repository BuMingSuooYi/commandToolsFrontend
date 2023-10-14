<template>
	<div style="height: 300px;scrollbar-color: transparent transparent;">
		<el-card class="box-card" v-for="commandTitle in commandTitleList" :key="commandTitle.id">
			<div slot="header" class="clearfix" @click="unfold(commandTitle.id)">
				<el-row class="my-item-title">
					<el-col :span="4">
						<div class="grid-content ">{{ showCreatTime(commandTitle.creatTime)}}</div>
					</el-col>
					<el-col :span="4">
						<div class="grid-content ">{{commandTitle.name}}</div>
					</el-col>
					<el-col :span="8">
						<div class="grid-content">{{commandTitle.par}}</div>
					</el-col>

				</el-row>
				<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
			</div>
			<div v-if="unfoldNum==commandTitle.id" style="margin-bottom: 0px;padding: 0px 50px 0px  50px;">
				<el-table ref="filterTable" :data="tableData" style="width: 100%">
					<el-table-column prop="date" label="时间" width="180"></el-table-column>
					<el-table-column prop="date" label="网络号" width="180"></el-table-column>
					<el-table-column prop="name" label="参数" width="180"></el-table-column>
					<el-table-column prop="date" label="状态" width="180"></el-table-column>
					<el-table-column prop="tag" label="标签" width="250"
						:filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]" :filter-method="filterTag"
						filter-placement="bottom-end">
						<template slot-scope="scope">
							<!-- <el-tag :type="scope.row.tag === '家' ? 'primary' : 'success'" disable-transitions>
								{{scope.row.tag}}
							</el-tag> -->
							<el-select v-model="value1" multiple placeholder="请选择">
								<el-option v-for="item in options" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>
	</div>
</template>
<script>
	import {
		getHistoryTite,
		findSendingHistory,
		getAllSysParameter
	} from '../api/command.js'

	import {
		extractDate,
		extractTime
	} from '../unit/mydate.js'

	export default {
		async created() {
			console.log("开始")
			// 数据请求
			await getHistoryTite().then(res => {
				this.commandTitleList = res;
				console.log("123", this.commandTitleList);
			}).catch(err => {
				console.log("出错了：", err)
			})

			console.log(extractDate(this.commandTitleList[0].creatTime));
			console.log(extractTime(this.commandTitleList[0].creatTime));

		},
		data() {
			return {
				// 展开题头id
				unfoldNum: 2,
				// 历史题头列表
				commandTitleList: [],
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄',
					tag: '家'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄',
					tag: '公司'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄',
					tag: '家'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄',
					tag: '公司'
				}],
				// 标签
				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
				value1: ['选项3', '选项5'],
			}
		},
		computed: {
			showCreatTime() {
				return function(time) {
					console.log(";;;", time)
					return extractDate(time);
				};
			}
		},
		methods: {
			// 展开函数
			async unfold(id) {
				this.unfoldNum = id;
			},
			// 表格函数
			clearFilter() {
				this.$refs.filterTable.clearFilter();
			},
			formatter(row, column) {
				return row.address;
			},
			filterTag(value, row) {
				return row.tag === value;
			},
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			}

		}
	}
</script>

<style>
	.my-item-title {
		font-size: 18px;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.box-card {
		width: 100%;
		margin: 10px;
	}

	.el-card__body {
		padding: 0px;
	}
</style>
