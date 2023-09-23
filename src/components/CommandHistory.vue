<template>
	<div>
		<el-drawer title="发送历史" :visible.sync="my_drawer" :direction="direction">
			<el-row v-for="sh in sendHistoryList" :key="sh.id">
				<el-col :span="4">
					<el-tag type="success" style="width: 90%;">{{sh.name}}</el-tag>
				</el-col>
				<el-col :span="12">
					<el-tag type="info" style="width: 95%;overflow: hidden;text-overflow: ellipsis; ">{{sh.message}}</el-tag>
				</el-col>
				<el-col :span="8">
					<el-tag type="info">{{sh.creatDate}}</el-tag>
				</el-col>
			</el-row>	

		</el-drawer>
	</div>

</template>

<script>
	export default {
		props: {
			//抽屉是否打开
			drawer: {
				type: Boolean,
			},
			sendHistoryList: {
				type: Array,
			},
		},
		data() {
			return {
				//抽屉的打开方向，rtl为从右打开
				direction: 'rtl',
				my_drawer:false,
			};
		},
		//监控属性
		watch: {
			drawer(newValue) {
				this.my_drawer=newValue;
			},
		},
		methods: {

		}
	};
</script>

<style>
	
</style>
