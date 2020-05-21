<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input></el-col>
      </el-row>
      <el-table
        :data="orderList"
        style="width: 100%"
        stripe
        border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="parseInt(scope.row.pay_status)" type="success">已支付</el-tag>
            <el-tag v-else type="danger">未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" class="el-icon-edit" size="mini" @click="editAddress"></el-button>
          <el-button type="success" class="el-icon-location" size="mini" @click="queryTransport"></el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="AddressDialogVisible" width="50%" @close="AddressDialogClose">
      <el-form ref="addressFormRef" :model="addressForm" :rules="addressRules" label-width="90px">
        <el-form-item label="省市区/县" prop='address1'>
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="addressProps"
            @change="handleAddressChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop='address2'>
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流信息" :visible.sync="transportDialogVisible" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in transportPoint"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getTransport } from 'network/order.js'
import { formatDate } from 'common/utils.js'
import cityData from './citydata.js'
export default {
  name: 'Order',
  data () {
    return {
      orderList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      AddressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressProps: {
        expandTrigger: 'hover'
      },
      cityData,
      addressRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      transportDialogVisible: false,
      transportPoint: {}
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      getOrderList(this.queryInfo).then(res => {
        console.log(res)
        if (res.meta.status !== 200) return this.requestError('获取订单列表失败！')
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    pageSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    pageCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    editAddress () {
      this.AddressDialogVisible = true
    },
    // 级联选择器发生变化
    handleAddressChange () {},
    // 关闭修改地址对话框
    AddressDialogClose () {
      this.$refs.addressFormRef.resetFields()
    },
    // 打开物流信息对话框
    queryTransport () {
      this.transportDialogVisible = true
      getTransport('1106975712662').then(res => {
        console.log(res)
        this.transportPoint = res.data
      })
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
.el-cascader{
  width: 100%;
}
</style>
