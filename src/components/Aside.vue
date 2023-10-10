<template>
	<el-menu default-active="2" class="el-menu-vertical-demo" @select="select" background-color="#545c64"
		text-color="#fff" active-text-color="#ffd04b">
		<el-menu-item index="1">
			<i class="el-icon-menu"></i>
			<span slot="title">定制命令</span>
		</el-menu-item>
		<el-menu-item index="2">
			<i class="el-icon-menu"></i>
			<span slot="title">发送命令</span>
		</el-menu-item>
		<el-menu-item index="3">
			<i class="el-icon-setting"></i>
			<span slot="title">待定</span>
		</el-menu-item>
	</el-menu>
</template>

<script>
	export default {
		methods: {
			select(index) {
				console.log("点击菜单：", index)
				let path;
				switch (index) {
					case '1':
						path = '/command'
						break;
					case '2':
						path = '/sendcommand';
						break;
				}
				console.log(this.$router.currentRoute.fullPath,path,this.$router.currentRoute.fullPath != path)
				if (this.$router.currentRoute.fullPath != path) {
					this.$router.push(path);
				}
			}
		}
	}
</script>

<style>
	.el-menu {
		height: 100%;
	}
</style>
