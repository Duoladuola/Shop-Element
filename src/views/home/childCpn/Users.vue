<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserLists">
            <el-button slot="append" icon="el-icon-search" @click="getUserLists"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">新增用户</el-button>
        </el-col>
      </el-row>
      <el-table
      :data="userList"
      style="width: 100%"
      stripe
      border>
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserClick(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserClick(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" :enterable="false" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="asignRoleClick(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="新增用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addNewUserClose">
      <el-form :model="addNewUser"
               :rules="addNewUserRules"
               label-width="70px"
               ref="addUserFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addNewUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addNewUser.password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addNewUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addNewUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
       @close="editUserFormClose">
      <el-form :model="editUser"
               :rules="editUserRules"
               label-width="70px"
               ref="editUserFormRef">
        <el-form-item label="用户名">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配该用户的角色"
      :visible.sync="asignRoleDialogVisible"
      width="50%"
       @close="asignRoleClose">
       <div>
         <p>当前的用户 ：{{userInfo.username}}</p>
         <p>当前的角色 ：{{userInfo.role_name}}</p>
         <p>分配新角色 ：
           <el-select v-model="selectedRole" placeholder="请选择用户角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
         </p>
       </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="asignRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="asignRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, changeUserState, addNewUser, getIdUser, editUser, deleteUser, getRoleList, submitNewRole } from 'network/users.js'
export default {
  name: 'Users',
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17][678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      addNewUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addNewUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      editUser: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      editDialogVisible: false,
      editUserRules: {
        mobile: [
          { required: true, message: '请输入用户手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      asignRoleDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectedRole: ''
    }
  },
  created () {
    getUserList(this.queryInfo).then(res => {
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('请求用户列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
    })
  },
  methods: {
    // 再封装一下用户数据请求函数
    getUserLists () {
      getUserList(this.queryInfo).then(res => {
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    // 监听每页显示多少条数据
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserLists()
    },
    // 监听当前在第几页
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserLists()
    },
    // 监听switch状态的改变
    userStateChange (userInfo) {
      // 改变了的话，要将状态值返回给后端，发送put网络请求
      changeUserState(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(res => {
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('修改用户状态失败！')
        }
        this.$message.success('更新用户状态成功！')
      })
    },
    // 新增用户的对话框关闭后则清空用户之前的输入
    addNewUserClose () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 编辑用户的对话框关闭之后也要清空用户之前的输入
    editUserFormClose () {
      this.$refs.editUserFormRef.resetFields()
    },
    // 点击确定新增用户后做一个预验证
    addUserSubmit () {
      this.$refs.addUserFormRef.validate(valid => {
        if (!valid) return
        // 预验证成功的话，将用户提交给后端，注意post的参数叫data不叫params
        addNewUser(this.addNewUser).then(res => {
          if (res.meta.status !== 201) return this.$message.error('新增用户失败！')
          this.$message.success('新增用户成功！')
          // 刷新用户列表
          this.getUserLists()
          this.dialogVisible = false
        })
      })
    },
    // 点击编辑按钮，弹出对话框
    editUserClick (id) {
      // 对话框里面要绑定点击的那个条目的id的相关数据，所以要做网络请求
      getIdUser(id).then(res => {
        this.editUser = res.data
      })
      this.editDialogVisible = true
    },
    // 编辑用户之后也要做预验证，验证完事之后就提交
    editUserSubmit () {
      this.$refs.editUserFormRef.validate(valid => {
        if (!valid) return
        // 预验证成功的话，将用户提交给后端
        editUser(this.editUser).then(res => {
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error('修改用户失败！')
          this.$message.success('修改用户成功！')
          // 刷新用户列表
          this.getUserLists()
          // 关闭对话框
          this.editDialogVisible = false
        })
      })
    },
    // 监听删除按钮的点击事件
    deleteUserClick (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(res => {
          if (res.meta.status !== 200) return this.$message.error('删除失败！')
          this.getUserLists()
          this.$message({ type: 'success', message: '删除成功!' })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击分配权限button
    asignRoleClick (userInfo) {
      // 展示用户信息
      this.userInfo = userInfo
      // 去请求所有的角色
      getRoleList().then(res => {
        if (res.meta.status !== 200) return
        this.roleList = res.data
      })
      this.asignRoleDialogVisible = true
    },
    // 分配用户角色对话框关闭
    asignRoleClose () {
      // 要将之前为别的用户分配的角色给清空
      this.userInfo = {}
      this.selectedRole = ''
    },
    // 提交为用户分配的角色
    asignRoleSubmit () {
      // 判断有没有分配角色
      if (!this.selectedRole) return this.$message.error('请为用户分配新角色！')
      submitNewRole(`users/${this.userInfo.id}/role`, this.selectedRole).then(res => {
        if (res.meta.status !== 200) return this.$message.error('分配角色提交失败！')
        this.$message.success('分配角色成功！')
        this.getUserLists()
        this.asignRoleDialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
.el-dialog div p{
  margin: 15px 5px;
  font-size: 13px;
}

</style>
