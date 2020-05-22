<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <echarts ref="echarts1"/>
    </el-card>
  </div>
</template>

<script>
import Echarts from 'components/common/echarts/Echarts'
import { getTimerLine } from 'network/reports.js'
export default {
  name: 'Report',
  components: {
    Echarts
  },
  data () {
    return {
      option: {}
    }
  },
  created () {
    this.getTimerLine()
  },
  methods: {
    getTimerLine () {
      getTimerLine().then(res => {
        if (res.meta.status !== 200) return this.$root.requestError('请求图表数据失败！')
        this.option = res.data
        this.option.tooltip = {
          trigger: 'axis',
          triggerOn: 'mousemove'
        }
        this.option.title = {
          text: '用户来源'
        }
        console.log(this.option)
        this.$refs.echarts1.loadOption(this.option)
      })
    }
  }
}
</script>

<style scoped>

</style>
