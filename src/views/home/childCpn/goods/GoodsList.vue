<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryGoods.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="add-button" @click="toAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="goodsList"
        style="width: 100%"
        border
        stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="95px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column prop="upd_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.upd_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" class="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteGoodsClick(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryGoods.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryGoods.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from 'common/utils.js'
import { getGoodsList, deleteGoods } from 'network/goodslist.js'
export default {
  name: 'GoodsList',
  data () {
    return {
      queryGoods: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: null,
      goodsList: []
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      getGoodsList(this.queryGoods).then(res => {
        console.log(res)
        if (res.meta.status !== 200) return this.requestError('获取商品列表失败！')
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    // 分页器的页面大小发生改变
    handleSizeChange (newSize) {
      this.queryGoods.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页码
    handleCurrentChange (newPage) {
      this.queryGoods.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    deleteGoodsClick (goods) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(goods.goods_id).then(res => {
          console.log(res)
          if (res.meta.status !== 200) return this.requestError('删除失败！')
        })
        this.requestSuccess('删除成功！')
        this.getGoodsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击添加商品按钮，跳转到新的页面
    toAddPage () {
      this.$router.push('/goods/add')
    },
    requestSuccess (tips) {
      this.$message.success(tips)
    },
    requestError (tips) {
      this.$message.error(tips)
    }
  },
  filters: {
    showDate (value) {
      const date = new Date(value * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style scoped>
.add-button{
  margin-left: 15px;
}
.el-table{
  font-size: 12px;
}
</style>
