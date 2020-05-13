<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意！只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
      </el-alert>
      <el-row>
        <el-col class="choose-cate">选择商品分类：
          <el-cascader
            v-model="selectedCate"
            :options="cateDetails"
            :props="cascaderProps"
            @change="cateChange"
            clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addParamsDialogVisible = true">添加参数</el-button>
          <el-table :data="manyParams" stripe border>
            <el-table-column type="expand" label="#">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteTagClick(index, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="编号"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" class="el-icon-edit" size="mini" @click="editParamsClick(scope.row)">编辑</el-button>
                <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteParamsClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addParamsDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyParams" stripe border>
            <el-table-column type="expand" label="#">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteTagClick(index, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="编号"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" class="el-icon-edit" size="mini" @click="editParamsClick(scope.row)">编辑</el-button>
                <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteParamsClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
       @close="addParamsClose">
       <el-form :model="addParams"
                :rules="addParamsRules"
                label-width="80px"
                ref="addParamsFormRef">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
       @close="editParamsClose">
       <el-form :model="editParams"
                :rules="editParamsRules"
                label-width="80px"
                ref="editParamsFormRef">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsSubmitClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategory } from 'network/category.js'
import { getActiveParams, addParamsSubmit, editParamsSubmit, deleteParams, tagSubmit } from 'network/params.js'
export default {
  name: 'Params',
  data () {
    return {
      cateDetails: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedCate: [],
      activeName: 'only',
      onlyParams: [],
      manyParams: [],
      addParamsDialogVisible: false,
      addParams: {
        attr_name: ''
      },
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入动态参数名称', trigger: 'blur' },
          { min: 0, max: 10, message: '长度小于 10 个字符', trigger: 'blur' }
        ]
      },
      editParamsDialogVisible: false,
      editParams: {},
      editParamsRules: {
        attr_name: [
          { required: true, message: '请输入动态参数名称', trigger: 'blur' },
          { min: 0, max: 10, message: '长度小于 10 个字符', trigger: 'blur' }
        ]
      }
      // 会互相干扰，无法使用
    //   inputVisible: false,
    //   inputValue: ''
    }
  },
  computed: {
    isBtnDisable () {
      return this.selectedCate.length !== 3
    },
    titleText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  created () {
    getCategory().then(res => {
      this.cateDetails = res.data
    })
  },
  methods: {
    // 级联选择框的选择发生改变时触发的函数
    cateChange () {
      this.getCateParams()
    },
    // 当活跃页签被修改时激活该函数
    tabClick () {
      this.getCateParams()
    },
    // 点击新增动态分类
    addManyClick () {
      this.manyDialogVisible = true
    },
    // 新增动态参数对话框关闭
    addParamsClose () {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 添加动态参数的提交
    addParamsSubmit () {
      this.$refs.addParamsFormRef.validate(vaild => {
        if (!vaild) return
        addParamsSubmit(this.selectedCate[2], this.addParams, this.activeName).then(res => {
          if (res.meta.status !== 201) return this.requestError('提交新参数失败！')
          this.getCateParams()
          this.addParamsDialogVisible = false
        })
      })
    },
    // 编辑参数
    editParamsClick (params) {
      this.editParamsDialogVisible = true
      this.editParams = params
    },
    // 编辑参数的提交
    editParamsSubmitClick () {
      this.$refs.editParamsFormRef.validate(vaild => {
        if (!vaild) return
        editParamsSubmit(this.selectedCate[2], this.editParams.attr_id, this.activeName, this.editParams).then(res => {
          if (res.meta.status !== 200) return this.requestError('编辑提交失败！')
          this.getCateParams()
          this.requestSuccess('编辑提交成功！')
          this.editParamsDialogVisible = false
        })
      })
    },
    // 编辑参数对话框的关闭
    editParamsClose () {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 删除分类里面的参数
    deleteParamsClick (params) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteParams(this.selectedCate[2], params.attr_id).then(res => {
          console.log(res)
          this.getCateParams()
          this.requestSuccess('删除成功!')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // tag标签的enter键或者失焦事件,失去焦点之后就要隐藏input；饿
    handleInputConfirm (params) {
      if (params.inputValue.trim().length === 0) {
        params.inputValue = ''
        params.inputVisible = false
      } else {
        // params.inputValue是在getCateParams里面加进去的哦
        params.attr_vals.push(params.inputValue.trim())
        params.inputValue = ''
        // 要把这个做一次提交
        tagSubmit(this.selectedCate[2], params.attr_id, this.activeName, params, params.attr_vals.join(',')).then(res => {
          console.log(res)
        })
      }
    },
    // 点击+new tag 的按钮时间
    showInput (params) {
      params.inputVisible = true
      // 之所以要调用nextTick函数是因为仅仅切换v-if和else，dom并没有更新，调用这个就是胞证在下一次dom更新后再让input聚焦
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag
    deleteTagClick (i, params) {
      params.attr_vals.splice(i, 1)
      // 删除标签后将结果提交给服务器
      tagSubmit(this.selectedCate[2], params.attr_id, this.activeName, params, params.attr_vals.join(',')).then(res => {
        if (res.meta.status !== 200) return this.requestError('提交tag失败！')
        this.requestSuccess('提交tag成功！')
      })
    },
    // 再封装一下请求参数的函数
    getCateParams () {
      if (this.selectedCate.length === 3) {
        getActiveParams(this.selectedCate[2], this.activeName).then(res => {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            // 这里有一个很厉害的东西因为每一行的newtag是互相干扰的，所以给处理到item里面
            item.inputVisible = false
            item.inputValue = ''
          })
          console.log(res)
          if (res.meta.status !== 200) return this.requestError('只能为三级分类设置相关参数！')
          if (this.activeName === 'only') {
            this.onlyParams = res.data
          } else {
            this.manyParams = res.data
          }
        })
      } else {
        this.requestError('只允许修改三级参数！')
        this.manyParams = []
        this.onlyParams = []
      }
    },
    requestSuccess (tips) {
      this.$message.success(tips)
    },
    requestError (tips) {
      this.$message.error(tips)
    }
  }
}
</script>

<style scope>
  .choose-cate{
    margin: 15px 2px;
  }
  .el-tag{
    margin-right: 15px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>
