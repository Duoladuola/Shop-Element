<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col><el-button type="primary" @click="addCateClick">添加分类</el-button></el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="tree-table"
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="编号"
        border
        :show-row-hover="false">
        <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: lightgreen;"></i>
          <i class="el-icon-success" v-else style="color: red;"></i>
        </template>
        <template v-slot:rank="scope">
          <el-tag :type="categoryLevel[scope.row.cat_level].type">{{categoryLevel[scope.row.cat_level].text}}</el-tag>
        </template>
        <template v-slot:action="scope">
          <el-button type="primary" class="el-icon-edit" size="mini" @click="editCate(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加商品分类 -->
    <el-dialog
      title="新增分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
       @close="addCateClose">
       <el-form :model="newCate"
                :rules="newCateRules"
                label-width="80px"
                ref="newCateFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="newCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedCate"
            :options="cateDetails"
            :props="cascaderProps"
            @change="cateChange"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
       @close="editCateClose">
       <el-form :model="editCateObj"
                :rules="editCateRules"
                label-width="80px"
                ref="editCateFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateObj.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategory,
  getCategoryDetail,
  addCategorySubmit,
  getCateById,
  editCateSubmit,
  deleteCate
} from 'network/category.js'
export default {
  name: 'Category',
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: null,
      categoryList: [],
      categoryLevel: [
        { type: null, text: '一级' },
        { type: 'success', text: '二级' },
        { type: 'warning', text: '三级' }
      ],
      addCateDialogVisible: false,
      newCate: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      newCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 0, max: 10, message: '长度小于 10 个字符', trigger: 'blur' }
        ]
      },
      cateDetails: [],
      // table-tree-grid的列的数据
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectedCate: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'rank'
        },
        {
          label: '操作',
          type: 'template',
          template: 'action'
        }
      ],
      editCateObj: {},
      editCateDialogVisible: false,
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 0, max: 10, message: '长度小于 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCategory()
  },
  methods: {
    // 再封装一下页面请求数据
    getCategory () {
      getCategory(this.queryInfo).then(res => {
        console.log(res)
        if (res.meta.status !== 200) return this.requestError('请求商品分类失败！')
        this.requestSuccess('请求商品分类成功！')
        this.categoryList = res.data.result
        this.total = res.data.total
      })
    },
    // 只要这个size改变的函数触发，就可以拿到最新的尺寸newSize
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategory()
    },
    // 同样，这要这个函数触发，就可以拿到最新的页码
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategory()
    },
    // 新增分类
    addCateClick () {
      getCategoryDetail().then(res => {
        console.log(res)
        if (res.meta.status !== 200) return this.requestError('请求分类汇总失败！')
        this.cateDetails = res.data
      })
      this.addCateDialogVisible = true
    },
    // 级联表有改变的话，数据会绑定到seleced
    cateChange () {
      console.log(this.selectedCate)
      // 如何确定新增分类的id？判断this.selectedCate的长度
      if (!this.selectedCate.length) {
        this.newCate.cat_pid = 0
        this.newCate.cat_level = 0
      } else {
        this.newCate.cat_pid = this.selectedCate[this.selectedCate.length - 1]
        this.newCate.cat_level = this.selectedCate.length
      }
    },
    // 提交新增分类
    addCateSubmit () {
      console.log(this.newCate)
      this.$refs.newCateFormRef.validate(valid => {
        if (!valid) return
        // 发送网络请求
        addCategorySubmit(this.newCate).then(res => {
          if (res.meta.status !== 201) return this.requestError('提交新品类失败！')
          this.requestSuccess('提交成功！')
          this.getCategory()
          this.addCateDialogVisible = false
        })
      })
    },
    // 新增分类对话框关闭
    addCateClose () {
      this.$refs.newCateFormRef.resetFields()
      // 清空级联表的选中内容，（应该是绑定到级联表是不会被清空）
      this.selectedCate = []
      this.newCate.cat_pid = 0
      this.newCate.cat_level = 0
    },
    // 编辑商品分类
    editCate (id) {
      getCateById(id).then(res => {
        this.editCateObj = res.data
        this.editCateDialogVisible = true
      })
    },
    // 编辑分类对话框的关闭
    editCateClose () {
      this.$refs.editCateFormRef.resetFields()
    },
    // 编辑分类的提交
    editCateSubmit () {
      editCateSubmit(this.editCateObj).then(res => {
        this.getCategory()
        this.editCateDialogVisible = false
      })
    },
    // 删除分类
    deleteCate (id) {
      this.$confirm('此操作将永久删除该品类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCate(id).then(res => {
          console.log(res)
          this.getCategory()
          this.requestSuccess('删除成功!')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 定义一下经常重复的请求提示函数
    requestSuccess (tips) {
      this.$message.success(tips)
    },
    requestError (tips) {
      this.$message.error(tips)
    }
  }
}
</script>

<style scoped>
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
