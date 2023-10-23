<template>
	<div>
		<el-table :data="tagList" style="width: 100%">
			<el-table-column label="日期" width="180">
				<template slot-scope="scope">
					<i class="el-icon-time"></i>
					<span style="margin-left: 10px">{{ scope.row.showUpTime }}</span>
				</template>
			</el-table-column>
			<el-table-column label="标签" width="180">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag size="medium">{{ scope.row.name }}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="备注" width="180">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<span>{{ scope.row.mark }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot="header" slot-scope="scope">
					<el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="openAdd">
						新增</el-button>
				</template>
				<template slot-scope="scope">
					<el-button size="mini" @click="openEdit(scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="openDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 弹出框 -->
		<el-dialog title="新增标签" :visible="addF" width="40%" center :before-close="closeAdd">
			<el-form ref="form" :model="tagObj">
				<el-form-item label="标签名称">
					<el-input v-model="tagObj.name"></el-input>
				</el-form-item>
				<el-form-item label="标签备注">
					<el-input v-model="tagObj.mark"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="ConfirmAdd()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog title="编辑标签" :visible="editF" width="40%" center :before-close="closeEdit">
			<el-form ref="form" :model="tagObj">
				<el-form-item label="标签名称">
					<el-input v-model="tagObj.name"></el-input>
				</el-form-item>
				<el-form-item label="标签备注">
					<el-input v-model="tagObj.mark"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="ConfirmEdit()">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog title="删除标签" :visible.sync="deleteF" width="30%" :before-close="closeDelete">
			<span>{{tagObj.name}}</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDelete">取 消</el-button>
				<el-button type="primary" @click="ConfirmDelet">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		findAllTag,
		createTag,
		updateTag,
		deleteTag
	} from '../api/command.js'

	import {
		extractDate,
	} from '../unit/mydate.js'

	export default {
		created() {
			findAllTag().then(res => {
				const newArray = res.map(item => ({
					...item,
					showUpTime: extractDate(item.upTime)
				}));
				this.tagList = newArray;
				console.log(this.tagList)
			}).catch(err => {
				console.log("出错了：", err)
			})
		},
		data() {
			return {
				tagList: [],
				// 新增弹窗标识
				addF: false,
				// 编辑弹窗标识
				editF: false,
				// 删除弹窗标识
				deleteF: false,
				// 操作对象
				tagObj: {}
			}
		},
		methods: {
			openAdd() {
				this.addF = true;
			},
			openEdit(row) {
				this.tagObj = {
					id:row.id,
					name:row.name,
					mark:row.mark,
				};
				this.editF = true;
			},
			openDelete(row) {
				this.tagObj = row;
				console.log('this.tagObj:', this.tagObj)
				this.deleteF = true;
			},
			// 确认新增
			ConfirmAdd() {
				if (this.tagObj.name != '') {
					createTag(this.tagObj).then(res => {
						this.$message({
							message: '新增成功',
							type: 'success'
						});
					}).catch(err => {
						this.$message({
							message: '出错了',
							type: 'warning'
						});
					})
					this.closeAdd();
				} else {
					this.$message({
						message: '标签不能空白',
						type: 'warning'
					});
				}
			},
			// 确认编辑
			ConfirmEdit() {
				if (this.tagObj.name != '') {
					updateTag(this.tagObj).then(res => {
						this.$message({
							message: '保存成功',
							type: 'success'
						});
					}).catch(err => {
						this.$message({
							message: '出错了',
							type: 'warning'
						});
					})
					this.closeAdd();
				} else {
					this.$message({
						message: '标签不能空白',
						type: 'warning'
					});
				}
				this.closeEdit();
			},
			// 确认删除
			ConfirmDelet() {
				deleteTag(this.tagObj.id).then(res => {
					this.$message({
						message: '删除成功',
						type: 'success'
					});
				}).catch(err => {
					this.$message({
						message: '出错了',
						type: 'warning'
					});
				})
				this.closeDelete();
			},
			closeAdd() {
				this.tagObj = {};
				this.addF = false;
			},
			closeEdit() {
				this.tagObj = {};
				this.editF = false;
			},
			closeDelete() {
				this.tagObj = {};
				this.deleteF = false;
			},
		}
	}
</script>

<style>
</style>
