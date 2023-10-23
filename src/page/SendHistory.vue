<template>
	<div style="height: 300px;scrollbar-color: transparent transparent;">
		<el-card class="box-card" v-for="commandTitle in commandTitleList" :key="commandTitle.commandId">
			<div slot="header" class="clearfix" @click="unfold(commandTitle.commandId)">
				<el-row class="my-item-title">
					<el-col :span="4">
						<div class="grid-content ">{{ showDate(commandTitle.creatTime)}}</div>
					</el-col>
					<el-col :span="4">
						<div class="grid-content ">{{commandTitle.name}}-{{commandTitle.commandId}}</div>
					</el-col>
					<el-col :span="8">
						<div class="grid-content">{{commandTitle.par}}</div>
					</el-col>

				</el-row>
				<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
			</div>
			<div v-if="unfoldNum==commandTitle.commandId" style="margin-bottom: 0px;padding: 0px 50px 0px  50px;">
				<el-table ref="filterTable" :data="commandData" style="width: 100%">
					<el-table-column prop="showTime" label="时间" width="180"></el-table-column>
					<el-table-column prop="netNum" label="网络号" width="180"></el-table-column>
					<el-table-column prop="par" label="参数" width="180"></el-table-column>
					<el-table-column prop="state" label="状态" width="100" :filters="stateList"
						:filter-method="filterstate" filter-placement="bottom-end">
						<template slot-scope="scope">
							<el-tag :type="'success'" disable-transitions>{{scope.row.state}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="tagValues" label="标签" width="250" :filters="tagList"
						:filter-method="filterTag" filter-placement="bottom-end">
						<template slot-scope="scope">
							<!-- <el-tag :type="scope.row.tag === '家' ? 'primary' : 'success'" disable-transitions>
								{{scope.row.tag}}
							</el-tag> -->
							<!-- <el-select v-model="commandData[scope.$index].tagValues" multiple placeholder="请选择" @change="tagChange(scope.$index)">-->
							<el-select v-model="scope.row.tagValues" multiple placeholder="请选择"
								@change="tagChange(scope.row.id,scope.row.tagValues)" >
								<el-option v-for="item in tagList" :key="item.value" :label="item.text"
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
		getAllState,
		getAllTag,
		getHistoryTite,
		findSendingHistory,
		getAllSysParameter,
		getHistoryNearlyNByCommand,
		updataSendingHistoryTag
	} from '../api/command.js'

	import {
		extractDate,
		extractDateOrTime,
		extractTime,
	} from '../unit/mydate.js'

	export default {
		async created() {
			// 数据请求-命令题头
			await getHistoryTite().then(res => {
				this.commandTitleList = res;
				console.log("命令题头：", this.commandTitleList);
			}).catch(err => {
				console.log("出错了：", err)
			})
			// 数据请求-命令状态列表
			getAllState().then(res => {
				this.stateList = res;
				console.log("状态列表：", this.stateList);
			}).catch(err => {
				console.log("出错了：", err)
			})
			// 数据请求-命令历史状态列表
			getAllTag().then(res => {
				this.tagList = res;
				console.log("标签列表：", this.tagList);
			}).catch(err => {
				console.log("出错了：", err)
			})
		},
		data() {
			return {
				// 展开题头id
				unfoldNum: -1,
				// 历史题头列表
				commandTitleList: [],
				// 状态列表
				stateList: [],
				// 展开的命令历史
				commandData: [],
				// 标签
				tagList: [],
				value1: [1, 3],
			}
		},
		computed: {
			showDate() {
				return function(time) {
					return extractDate(time);
				};
			},
		},
		methods: {
			// 展开函数
			async unfold(commandId) {
				if(commandId==this.unfoldNum){
					this.unfoldNum = -1;
					return;
				}
				this.unfoldNum = commandId;
				await getHistoryNearlyNByCommand(commandId).then(res => {
					this.commandData = res;
					this.commandData.forEach(obj => {
						obj["showTime"] = extractDateOrTime(obj.creatTime);
					});
					console.log("完整：", this.commandData);
				}).catch(err => {
					console.log("出错了：", err);
				})

			},
			// 表格函数
			clearFilter() {
				this.$refs.filterTable.clearFilter();
			},
			formatter(row, column) {
				return row.address;
			},
			filterstate(value, row) {
				console.log("filterstate:", value, row)
				return row.state === value;
			},
			filterTag(value, row) {
				console.log(row.id, value, row.tagValues, row.tagValues.includes(value));
				return row.tagValues.includes(value)
			},
			 tagChange(id,tagValues) {
				let params={
					historyid:id,
					newtagValues:tagValues
				}
				updataSendingHistoryTag(params).then(res => {
					console.log("标签发送变化,",res);
				}).catch(err => {
					console.log("出错了：", err);
				})

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
