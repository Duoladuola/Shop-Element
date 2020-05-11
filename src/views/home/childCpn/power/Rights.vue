<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
      :data="rightsList"
      style="width: 100%"
      stripe
      border>
        <el-table-column
          type="index"
          label="编码"
          >
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          >
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          >
        </el-table-column>
        <el-table-column
          label="权限等级">
          <template slot-scope="scope">
            <el-tag :type="rightsLevel[scope.row.level].type">{{rightsLevel[scope.row.level].text}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from 'network/rights.js'
export default {
  name: 'Rights',
  data () {
    return {
      rightsList: [],
      rightsLevel: [
        { type: null, text: '一级' },
        { type: 'success', text: '二级' },
        { type: 'warning', text: '三级' }
      ]
    }
  },
  created () {
    getRightsList().then(res => {
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('请求权限列表失败！')
      this.$message.success('请求权限列表成功！')
      this.rightsList = res.data
    })
  }
}
</script>

<style scoped>

</style>
