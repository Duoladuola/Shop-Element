<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
      </el-row>
      <el-table
        :data="rolesList"
        style="width: 100%"
        stripe
        border>
          <el-table-column
            label="占用"
            type="expand"
            width="50px">
            <template slot-scope="scope">
              <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bottomborder', i1 === 0? 'topborder' : '', 'vcenter']">
                <el-col :span="5">
                  <el-tag closable @close="deleteTagClick(scope.row, item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2===0? '':'topborder', 'vcenter']">
                    <el-col :span="6">
                      <el-tag type="warning" closable @close="deleteTagClick(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="success" :span="18" v-for="(item3) in item2.children" :key="item3.id" closable @close="deleteTagClick(scope.row, item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="编码"
            >
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            >
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述"
            >
          </el-table-column>
          <el-table-column
            label="操作"
            width="300px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleClick(scope.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deteleRoleClick(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="asignRightsClick(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <el-dialog
      title="新增角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addNewRoleClose">
      <el-form :model="addNewRole"
               :rules="addNewRoleRules"
               label-width="80px"
               ref="addRoleFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addNewRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addNewRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleClose">
      <el-form :model="editRole"
               :rules="editRoleRules"
               label-width="80px"
               ref="editRoleFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRole.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色权限"
      :visible.sync="asignRightsDialogVisible"
      width="50%"
      @close="asignRightsClose">
      <el-tree :data="rightsTree" :props="rightsProps" show-checkbox node-key="id" default-expand-all
      :default-checked-keys="defaultLef" ref="rightsTreeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="asignRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="asignRightsSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, addRole, getIdRole, editRoleSubmit, deleteRole, deleteTag, getRights, asignRightsSubmit } from 'network/roles.js'
export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      addRoleDialogVisible: false,
      addNewRole: {
        roleName: '',
        roleDesc: ''
      },
      addNewRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, message: '长度不少于4个字符', trigger: 'blur' }
        ]
      },
      editRoleDialogVisible: false,
      editRole: {},
      editRoleRules: {
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, message: '长度不少于4个字符', trigger: 'blur' }
        ]
      },
      asignRightsDialogVisible: false,
      rightsProps: {
        label: 'authName',
        children: 'children'
      },
      rightsTree: [],
      defaultLef: [],
      roleId: null
    }
  },
  async created () {
    const res = await getRoles()
    if (res.meta.status !== 200) return this.$message.error('请求角色失败！')
    this.$message.success('请求角色成功！')
    this.rolesList = res.data
  },
  methods: {
    // 新增角色的dialog关闭事件，清空用户之前的输入
    addNewRoleClose () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 点击确定提交按钮：先进行预验证，验证成功发起新增角色的网络请求
    addNewRoleSubmit () {
      this.$refs.addRoleFormRef.validate(async vaild => {
        if (!vaild) return
        const res = await addRole(this.addNewRole)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('新建角色失败！')
        this.$message.success('新建角色成功！')
        const newRoleLists = await getRoles()
        this.rolesList = newRoleLists.data
        this.addRoleDialogVisible = false
      })
    },
    // 点击编辑按钮，请求对应的数据到editRole
    async editRoleClick (id) {
      this.editRoleDialogVisible = true
      const res = await getIdRole(id)
      if (res.meta.status !== 200) return this.$message.error('请求该用户数据失败！')
      this.editRole = res.data
    },
    // 监听编辑角色对话框的关闭
    editRoleClose () {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 编辑之后进行提交
    editRoleSubmit () {
      this.$refs.editRoleFormRef.validate(async vaild => {
        if (!vaild) return
        const res = await editRoleSubmit(this.editRole)
        if (res.meta.status !== 200) return this.$message.error('编辑用户失败！')
        this.$message.success('编辑用户成功！')
        this.editRole = res.data
        const { data: newRoleList } = await getRoles()
        this.rolesList = newRoleList
        this.editRoleDialogVisible = false
      })
    },
    // 监听删除按钮
    deteleRoleClick (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发起删除角色的请求
        const res = await deleteRole(id)
        if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const { data: newRoleList } = await getRoles()
        this.rolesList = newRoleList
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除角色的tag
    deleteTagClick (role, tagId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发起删除tag的请求
        const res = await deleteTag(`roles/${role.id}/rights/${tagId}`)
        if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
        role.children = res.data
        this.$message({
          type: 'success',
          message: '删除权限成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配角色的权限
    async asignRightsClick (node) {
      this.roleId = node.id
      // 请求权限列表（树形结构）
      const res = await getRights()
      if (res.meta.status !== 200) return this.$message.error('请求权限树失败！')
      this.$message.success('请求权限树成功！')
      this.rightsTree = res.data
      // 如何获取这个当前角色的权限节点（必须获取所有的三级节点，一级和二级不行）
      this.getNodes(node, this.defaultLef)
      this.asignRightsDialogVisible = true
    },
    // 分配角色对话框关闭
    asignRightsClose () {
      this.defaultLef = []
    },
    // 提交角色的新权限
    async asignRightsSubmit () {
      // 获取当前所有的全选或者半选的id
      const allId = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      console.log(allId)
      const idStr = allId.join(',')
      console.log(idStr)
      const res = await asignRightsSubmit(`roles/${this.roleId}/rights`, idStr)
      if (res.meta.status !== 200) return this.$message.error('配置权限失败！')
      console.log(res)
      this.$message.success('配置权限成功！')
      getRoles().then(res => {
        this.rolesList = res.data
      })
      this.asignRightsDialogVisible = false
    },
    // 写一个递归，递归出所有的三级节点
    getNodes (node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getNodes(item, arr)
      })
    }
  }
}
</script>

<style scoped>
.bottomborder{
  border-bottom: 1px solid #eee;
}
.topborder{
  border-top: 1px solid #eee;
}
.el-tag{
  margin: 7px;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
