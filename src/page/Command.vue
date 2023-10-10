<template>
	<div>
		<div class="my-search">
			<div class="my-search-item">
				名称：<el-input class="my-input" placeholder="按名称查找" prefix-icon="el-icon-search" v-model="searchName">
				</el-input>
			</div>
			<div class="my-search-item">
				分类：<el-select v-model="searchType" placeholder="请选择">
					<el-option v-for="item in searchTypeList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="my-search-item">
				<span class="demonstration">添加时间：</span>
				<el-date-picker v-model="searchDate" type="date" placeholder="选择日期">
				</el-date-picker>
			</div>
			<el-button size="medium">清空</el-button>
		</div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column label="更新日期" prop="show_upDate">
			</el-table-column>
			<el-table-column label="名称" prop="name">
			</el-table-column>
			<el-table-column label="自定义参数" prop="show_parameter">
			</el-table-column>
			<el-table-column label="系统参数" prop="sysParameter">
			</el-table-column>
			<el-table-column label="类型" prop="type">
			</el-table-column>
			<el-table-column align="right">
				<template slot="header" slot-scope="scope">
					<el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="openAddCommand">
						新增</el-button>
				</template>
				<template slot-scope="scope">
					<el-button disabled size="mini">预览</el-button>
					<el-button size="mini" @click="openEditCommand(scope.$index, scope.row)">编辑</el-button>
					<el-popover placement="top" width="160" v-model="deleteF" style="margin-left: 10px;">
						<p>确定删除吗？</p>
						<div style="text-align: right; margin: 0">
							<el-button size="mini" type="text" @click="deleteF=false">取消</el-button>
							<el-button type="primary" size="mini" @click="deleteF=false">确定</el-button>
						</div>
						<el-button disabled slot="reference" type="danger" size="mini">删除</el-button>
					</el-popover>
					
					<!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
					</el-button> -->
					<!-- <el-button type="text" @click="deleteF = true">点击打开 Dialog</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<div class="my-pageination">
			<el-pagination background layout="prev, pager, next" :total="1000">
			</el-pagination>
		</div>
		<!-- 弹出框 -->
		<el-dialog title="新增命令" :visible="addF" width="40%" center :before-close="handleClose">
			<AddCommandDialog :sysList="sysList" @close="handleClose"></AddCommandDialog>
			<!-- <span slot="footer">
				<el-button type="primary" @click="">确认添加</el-button>
			</span> -->
		</el-dialog>

		<el-dialog title="编辑命令" :visible="editF" width="40%" center :before-close="closeEdit">
			<AddCommandDialog :sysList="sysList" :comment="temporaryCommand" @close="closeEdit"></AddCommandDialog>
			<!-- <span slot="footer">
				<el-button type="primary" @click="">确认添加</el-button>
			</span> -->
		</el-dialog>
		
		<!-- <el-dialog
		  title="提示"
		  :visible.sync="deleteF"
		  width="30%"
		  :before-close="handleClose">
		  <span>这是一段信息</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="deleteF = false">取 消</el-button>
		    <el-button type="primary" @click="deleteF = false">确 定</el-button>
		  </span>
		</el-dialog> -->

	</div>
</template>

<script>
	import AddCommandDialog from "../components/dialog/addCommand.vue";
	import {
		getAll,
		getAllSysParameter,
		getPage,
		add,
		updata,
		findSendingHistory,
		search
	} from '../api/command.js'

	export default {
		name: 'Comment',
		components: {
			AddCommandDialog
		},
		created() {
			this.searchCommand();
			
			// 获取系统数据列表
			getAllSysParameter().then(res=>{
				this.sysList=res;
				console.log("syslist：",this.sysList)
			})
		},
		data() {
			return {
				//系统参数
				sysList:[],
				//搜索部分
				searchName: '',
				searchTypeList: [],
				searchType: '',
				searchDate: '',
				//添加命令标识
				addF: false,
				//编辑命令标识
				editF: false,
				temporaryCommand: {},
				//删除命令标识
				deleteF: false,
				//分页命令列表数据
				tableData: [],
			}
		},
		methods: {
			closeEdit() {
				this.editF = false;
				// this.$store.commit('changeEditF', false);
				this.temporaryCommand = {};
			},
			handleClose() {
				this.addF = false;
				// this.$store.commit('changeAddF', false);
			},
			//显示新增命令对话框
			openAddCommand() {
				this.addF = true;
				// this.$store.dispatch('initCommand');
				// this.$store.commit('changeAddF', true);
			},

			//显示编辑命令对话框
			openEditCommand(index, commant) {
				this.editF = true;
				// this.$store.commit('changeEditF', true);
				this.temporaryCommand = commant;
			},

			//确认删除
			ConfirmDelet() {
				this.deleteF = false;
				// this.$store.commit('changeDeleteF', true);
				// ////////////////////////!!!!!!!!!!!!!!!
			},
			
			// 多条件模糊搜索
			async searchCommand(){
				let condition={
					name:this.searchName,
					type:this.searchType,
					upTime:this.searchDate
				}
				console.log("条件：",condition)
				await search(condition).then(res => {
					this.formatTableData(res);
				}).catch(err => {
					// this.$message.error('请求出错了：' + err);
				});
			},
			
			// 列表数据格式化
			formatTableData(data){
				console.log("数据格式化：",data);
				// 获取命令列表，数据格式转化
				// console.log("this.$store.state.addF:", typeof(this.$store.state.addF))
				const regex = /^(\d{4}-\d{2}-\d{2}).*/; // 匹配 'yyyy-MM-dd' 格式的日期部分
				const formattedResults = data.map(item => {
					//处理日期
					const match = item.upTime.match(regex);
					let show_upDate = '';
					if (match) {
						show_upDate = match[1]; // 匹配结果中的第一个捕获组是日期部分
					}
					//处理变量
					// 解析 JSON 字符串为 JavaScript 对象
					const parameterArray = JSON.parse(item.parameter);
					// 提取 'name' 属性并连接为字符串
					const show_parameter = parameterArray.map(item => item.name).join(', ');
					return {
						...item,
						show_parameter: show_parameter,
						show_upDate: show_upDate,
					};
				});
				this.tableData = formattedResults;
				console.log("asuhv:",this.tableData);
			}

		},
	}
</script>

<style>
	.my-search {
		padding: 20px;
		margin: 10px;
		background-color: white;
	}

	.my-search-item {
		display: inline;
		margin: 20px;
	}

	.my-input {
		width: 200px;
	}

	.my-pageination {
		padding: 10px;
		margin: 0px;
		/* background-color: white; */
	}
</style>
