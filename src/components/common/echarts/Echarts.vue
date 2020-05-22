<template>
  <div id="echarts"></div>
</template>

<script>
// 1.引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入legend
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
// 引入图表标题
require('echarts/lib/component/title')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入折线图
require('echarts/lib/chart/line')
export default {
  name: 'Echarts',
  data () {
    return {
      myChart: null
    }
  },
  mounted () {
    // 2.基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('echarts'))
    // 3.使用刚指定的配置项和数据显示图表。
    // this.myChart.setOption(this.option)
  },
  methods: {
    loadOption (data) {
      this.myChart.setOption(data)
    }
  }
}
</script>

<style scoped>
#echarts{
  width: 800px;
  height: 500px;
}
</style>
