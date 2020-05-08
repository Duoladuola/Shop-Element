<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">登出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toogle" @click="toogleClick">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in asideList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index=" '/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="menuItemClick('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getHomeAside } from 'network/home.js'
export default {
  name: 'Home',
  data () {
    return {
      asideList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '/users'
    }
  },
  created () {
    // 获取侧边栏的数据
    getHomeAside().then(res => {
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.asideList = res.data
      // console.log(this.asideList)
    })
    // 将此时活跃的侧边栏菜单的path设置为缓存里的最后保存的那个
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toogleClick () {
      this.isCollapse = !this.isCollapse
    },
    menuItemClick (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  font-size: 22px;
  align-items: center;
}
.el-header img{
  vertical-align: middle;
  margin-right: 15px;
}
.el-header span{
  padding: 5px;
}
.el-aside{
  background-color: #333744;
}
.el-aside .toogle{
  background-color:#4a5064;
  color: #fff;
  font-size: 15px;
  text-align: center;
  cursor: pointer;
  line-height: 24px;
  letter-spacing: 0.2rem;
}
.el-aside .el-menu{
  border-right: none;
}
.el-main{
  background-color: #eaedf1;
}
.el-submenu .iconfont{
  margin-right: 10px;
}
</style>
