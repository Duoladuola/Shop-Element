<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false">
      </el-alert>
      <el-steps :active="+activeTab" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 要把所有的表单放在一个Form中提交，但是tabs又不接受别人做自己的直接子标签 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeTab" :before-leave="tabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="props"
                @change="selectedChange"
                clearable>
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label=item.attr_name v-for="item in manyParams" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label=value v-for="(value, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label=item.attr_name v-for="item in onlyParams" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="end-add-button" @click="endAddGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="pictureDialogVisible"
      width="50%">
      <img :src="pictureURL" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
import { getCateParams, addGoods } from 'network/add.js'
import { getCategory } from 'network/category.js'
import { deepClone } from 'common/utils.js'
export default {
  name: 'Add',
  data () {
    return {
      activeTab: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        pics: [],
        goods_introduce: '',
        goods_cat: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, message: '长度不小于 1个字符', trigger: 'blur' }
        ],
        goods_price: [
          { type: 'number', required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { type: 'number', required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { type: 'number', required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cate: [
          { required: true, message: '请选择商品分类（直接选择第三级）', trigger: 'blur' }
        ]
      },
      cateList: [],
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyParams: [],
      onlyParams: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      pictureDialogVisible: false,
      pictureURL: ''
    }
  },
  created () {
    getCategory().then(res => {
      this.cateList = res.data
    })
  },
  methods: {
    tabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择三级分类！')
          return false
        }
      }
    },
    // 监听被点击的tab的点击事件
    tabClick () {
      // 如果被点的是商品参数，就发送网络请求（注意这里踩了第二次坑了呀那个1是个字符串）
      switch (this.activeTab) {
        case '1':
          getCateParams(this.addForm.goods_cat[2], 'many').then(res => {
            if (res.meta.status !== 200) return this.requestError('获取商品参数失败！')
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            })
            this.manyParams = res.data
          })
          break
        case '2':
          getCateParams(this.addForm.goods_cat[2], 'only').then(res => {
            console.log(res)
            if (res.meta.status !== 200) return this.requestError('获取商品参数失败！')
            this.onlyParams = res.data
          })
      }
    },
    // 图片预览事件
    handlePreview (file) {
      this.pictureDialogVisible = true
      this.pictureURL = file.response.data.url
    },
    // 删除上传图片事件
    handleRemove (file) {
      const path = file.response.data.tem_path
      const index = this.addForm.pics.findIndex(item => {
        return item.pic === path
      })
      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功事件
    handleSuccess (response) {
      const pic = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(pic)
    },
    // 提交商品
    endAddGoods () {
      this.$refs.addFormRef.validate(vaild => {
        if (!vaild) return this.requestError('请完成必填项！')
        // 发起提交商品得网络请求
        // 处理goods_cat,提交要求是字符串，拿到的是数组，而级联选择器又必须要数组，此时需要拷贝一个新的，还需要深拷贝
        const form = deepClone(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数和静态属性
        this.manyParams.forEach(item => {
          const attrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(attrInfo)
        })
        this.onlyParams.forEach(item => {
          const attrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(attrInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        addGoods(form).then(res => {
          console.log(res)
          if (res.meta.status !== 201) return this.requestError('添加商品失败！')
          this.requestSuccess('添加商品成功！')
          this.$router.push('/goods')
        })
      })
    },
    // 处理一下级联表
    selectedChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择三级分类！')
        this.addForm.goods_cat = []
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

<style scoped>
.el-steps{
  margin: 15px 0;
}
.el-form{
  font-size: 13px;
}
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.end-add-button{
  margin-top: 15px;
}
</style>
