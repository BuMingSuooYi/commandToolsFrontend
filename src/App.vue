<template>
	<el-container>
		<el-header>
			<Header></Header>
		</el-header>
		<el-container>
			<el-aside width="200px">
				<Aside></Aside>
			</el-aside>
			<el-main>
				<Main></Main>
			</el-main>
		</el-container>
	</el-container>


</template>

<script>
	import Header from './components/Header.vue';
	import Aside from './components/Aside.vue';
	import Main from './components/Main.vue';

	export default {
		name: 'app',
		components: {
			Header,
			Aside,
			Main
		},
		// mounted(){
		// 	this.$router.push('/sendcommand');
		// }
		
	}
</script>

<style>
	.el-header {
		background-color: #3e4248;
		/* background-color: #545c64; */
		color: #333;
		text-align: center;
		line-height: 60px;
	}

	.el-aside {
		background-color: #D3DCE6;
		color: #333;
		text-align: center;
		line-height: 200px;
	}

	.el-main {
		background-color: #E9EEF3;
		color: #333;
		text-align: center;
	}

	body>.el-container {
		width: 100vw;
		/* 100%视口宽度 */
		height: 100vh;
		/* 100%视口高度 */
		position: absolute;
		/* 使用绝对定位 */
		top: 0;
		/* 距离顶部为0 */
		left: 0;
		/* 距离左侧为0 */
	}
</style>
