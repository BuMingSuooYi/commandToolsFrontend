<template>
	<div>
		<el-row :gutter="20">
			  <el-col :span="8"><div class="grid-content bg-purple">
			  <div id="typeChart" style="width: 100%; height: 300px;"></div>
			  </div></el-col>
			  <el-col :span="8"><div class="grid-content bg-purple">
			  <div id="infoKeyChart" style="width: 100%; height: 300px;"></div>
			  </div>
			  </el-col>
			  <el-col :span="8"><div class="grid-content bg-purple">
			  <div id="stackedBarChart" style="width: 100%; height: 100px;"></div>
			  <div id="barDiagramChart" style="width: 100%; height: 200px;"></div>
			  </div>
			  </el-col>
			</el-row>
		
		<template>
			<div style="margin-top: 20px">
			   <el-radio-group v-model="radio" size="medium" @input="changeType">
			     <el-radio-button label="info" ></el-radio-button>
			     <el-radio-button label="warning"></el-radio-button>
			     <el-radio-button label="error"></el-radio-button>
			   </el-radio-group>
			 </div>
		    <el-table
			 :data="tableData"
			    height="270"
			    border
		      style="width: 100%">
		      <el-table-column
		        prop="timestamp"
		        label="时间戳"
		        width="300"
				>
		      </el-table-column>
		      <el-table-column
		        prop="key"
		        label="类别"
		        width="100">
		      </el-table-column>
		      <el-table-column
		        prop="content"
		        label="信息">
		      </el-table-column>
		    </el-table>
		  </template>
		  
		  <el-pagination
		    :page-size="page.size"
			:current-page="page.current"
		    :pager-count="page.count"
		    layout="prev, pager, next"
		    :total="page.total"
			@current-change="changeType">
		  </el-pagination>
	</div>
		
			

	
	
	
</template>

<script>
	import * as echarts from 'echarts';
	import {
		countByType,
		searchInfoDocuments,
		searchWarningDocuments,
		searchErrorDocuments,
	} from '../api/elasticsearch.js'
	export default {
		created(){
			searchInfoDocuments(this.page.current,this.page.size).then(res => {
				this.tableData=res;
			}).catch(err => {
				
			});
		},
		data () {
		  return {
		    radio: 'info',
			tableData: [],
				page:{
					current:1,
					size:100,
					count:10,
					total:1000
				},
			        }
		},
		
	methods:{
		changeType(){
			console.log("变化了"+this.radio);
			console.log("变化了"+this.page.current);
			switch(this.radio){
				case 'info':
					searchInfoDocuments(this.page.current,this.page.size).then(res => {
						this.tableData=res;
						this.page.total=832;
					}).catch(err => {
						
					});
					break;
				case 'warning':
				console.log("123")
					searchWarningDocuments(this.page.current,this.page.size).then(res => {
						this.tableData=res;
						this.page.total=158;
					}).catch(err => {
						
					});
					break;
				case 'error':
				console.log("456")
					searchErrorDocuments(this.page.current,this.page.size).then(res => {
						this.tableData=res;
						this.page.total=56;
					}).catch(err => {
						
					});
					break;
			}
			}
			
	},
	  mounted() {
		  
	 //    // 基于准备好的dom，初始化echarts实例
	    var typeChart = echarts.init(document.getElementById('typeChart'));
		
	    // 配置项
	    var typeOption={
	      title: {
	        text: '类型比重',
	        left: 150
	      },
	      tooltip: {
	        trigger: 'item',
	        formatter: '{b}: {c} ({d}%)'
	      },
	      legend: {
	        orient: 'vertical',
	        left: 10,
	        data: ['info', 'warning', 'error']
	      },
	      series: [
	        {
	          name: '',
	          type: 'pie',
	          radius: '50%',
	          center: ['40%', '50%'],
	          data: [
	    		{ value: 832, name: 'info' },
	    		{ value: 158, name: 'warning' },
	    		{ value: 56, name: 'error' },
	    	],
	    	  // 设置饼图颜色
	    	  color: ['#17b415', '#ddd721', '#c7394e',],
	          emphasis: {
	            itemStyle: {
	              shadowBlur: 10,
	              shadowOffsetX: 0,
	              shadowColor: 'rgba(0, 0, 0, 0.5)'
	            }
	          }
	        }
	      ]
	    };
		typeChart.setOption(typeOption);
		 
		
		
		var infoKeyChart = echarts.init(document.getElementById('infoKeyChart'));
		// 配置项
		var infoKeyOption = {
		  title: {
		    text: '收发比重',
		    left: 150
		  },
		  tooltip: {
		    trigger: 'item',
		    formatter: '{b}: {c} ({d}%)'
		  },
		  legend: {
		    orient: 'vertical',
		    left: 10,
		    data: ['R', 'S']
		  },
		  series: [
		    {
		      name: '',
		      type: 'pie',
		      radius: '50%',
		      center: ['40%', '50%'],
		      data: [
		        { value: 412, name: 'R' },
		        { value: 420, name: 'S' },
		      ],
			  // 设置饼图颜色
			  color: ['#37b435', '#176498',],
		      emphasis: {
		        itemStyle: {
		          shadowBlur: 10,
		          shadowOffsetX: 0,
		          shadowColor: 'rgba(0, 0, 0, 0.5)'
		        }
		      }
		    }
		  ]
		};
	    // 使用刚指定的配置项和数据显示图表
		infoKeyChart.setOption(infoKeyOption);
		
		var stackedBarChart = echarts.init(document.getElementById('stackedBarChart'));
		
		// 配置项
		var stackedBaroption = {
			title: {
			  text: '命令结构',
			  left: 'center'
			},
		  tooltip: {
		     trigger: 'none' // 设置触发方式为 'none'，表示不显示提示框
		  },
		  legend: [],
		  grid: {
		    left: '3%',
		    right: '3%',
		    bottom: '2%',
		    containLabel: true
		  },
		  xAxis: {
		      show: false // 不显示 x 轴
		    },
		  yAxis: {
		    type: 'category',
		    data: ['命令结构']
		  },
		  series: [
		    {
		      name: 'SOF 1',
		      type: 'bar',
		      stack: 'total',
		      label: {
		        show: true,
		        position: 'inside' ,// 在柱体内部右侧显示标签
				formatter: '{a}' // 使用数据的名称作为标签内容
		      },
		      emphasis: {
		        focus: 'series'
		      },
		      data: [1]
		    },
		    {
		      name: 'LEN 1',
		      type: 'bar',
		      stack: 'total',
		      label: {
		        show: true,
		        position: 'inside' ,// 在柱体内部右侧显示标签
				formatter: '{a}' // 使用数据的名称作为标签内容
		      },
		      emphasis: {
		        focus: 'series'
		      },
		      data: [1]
		    },
		    {
		      name: 'CMD 2',
		      type: 'bar',
		      stack: 'total',
		      label: {
		        show: true,
				position: 'inside' ,// 在柱体内部右侧显示标签
				formatter: '{a}' // 使用数据的名称作为标签内容
				      },
				      emphasis: {
				        focus: 'series'
				      },
				      data: [2]
				    },
				    {
				      name: 'DATA 0~250',
				      type: 'bar',
				      stack: 'total',
				      label: {
				        show: true,
				        position: 'inside' ,// 在柱体内部右侧显示标签
						formatter: '{a}' // 使用数据的名称作为标签内容
				      },
				      emphasis: {
				        focus: 'series'
				      },
				      data: [5] // 数据长度范围，可根据实际情况调整
				    },
				    {
				      name: 'FCS 1',
				      type: 'bar',
				      stack: 'total',
				      label: {
				        show: true,
				        position: 'inside' ,// 在柱体内部右侧显示标签
						formatter: '{a}' // 使用数据的名称作为标签内容
				      },
				      emphasis: {
				        focus: 'series'
				      },
				      data: [1]
				    }
				  ]
				};
				
				// 使用配置项显示图表
				stackedBarChart.setOption(stackedBaroption);
				
				// 初始化 ECharts 实例
				var barDiagramChart = echarts.init(document.getElementById('barDiagramChart'));
				
				// 配置项
				var barDiagramoption = {
				  title: {
				    text: 'Data平均数据量',
					left: 'center'
					
				  },
				  tooltip: {
				    trigger: 'axis',
				    axisPointer: {
				      type: 'shadow'
				    }
				  },
				  legend: [],
				  grid: {
				    left: '3%',
				    right: '4%',
				    bottom: '3%',
				    containLabel: true
				  },
				  xAxis: {
				    type: 'value',
				    boundaryGap: [0, 0.01]
				  },
				  yAxis: {
				    type: 'category',
				    data: ['数据量']
				  },
				  series: [
				    {
				      name: 'R-data',
				      type: 'bar',
					  label: {
					    show: true,
					    position: 'inside' ,// 在柱体内部右侧显示标签
					  						formatter: '{a}' // 使用数据的名称作为标签内容
					  },
				      data: [172]
				    },
				    {
				      name: 'S-data',
				      type: 'bar',
					  label: {
					    show: true,
					    position: 'inside' ,// 在柱体内部右侧显示标签
					  						formatter: '{a}' // 使用数据的名称作为标签内容
					  },
				      data: [155]
				    }
				  ]
				};
				
				// 使用配置项显示图表
				barDiagramChart.setOption(barDiagramoption);

	  }
	}

</script>

<style>
	
	/* 左中右三布局 */
	 .el-row {
	    margin-bottom: 20px;
	    &:last-child {
	      margin-bottom: 0;
	    }
	  }
	  .el-col {
	    border-radius: 4px;
	  }
	  .bg-purple-dark {
	    background: #99a9bf;
	  }
	  .bg-purple {
	    background: #d3dce6;
	  }
	  .bg-purple-light {
	    background: #e5e9f2;
	  }
	  .grid-content {
	    border-radius: 4px;
	    min-height: 36px;
	  }
	  .row-bg {
	    padding: 10px 0;
	    background-color: #f9fafc;
	  }
</style>