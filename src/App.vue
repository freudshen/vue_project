<template>
  <div class="app-container">
    <!-- 顶部标题栏 -->
    <header class="header">
      <h1 class="title">智学云帆-教学管理系统</h1>
      <!-- 添加用户信息和退出按钮 -->
    <div class="user-info">
      <el-dropdown @command="handleCommand">
        <span class="user-dropdown">
          <el-avatar :size="32" :src="userInfo.avatar || defaultAvatar" />
          <span class="username">{{ userInfo.name }}</span>
          <el-icon><CaretBottom /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    </header>
    
    <div class="main-container">
      <!-- 左侧菜单 -->
      <aside class="sidebar">
        <el-menu
          :default-active="route.path"
          router
          class="menu"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          
          <el-sub-menu index="/class">
            <template #title>
              <el-icon><School /></el-icon>
              <span>班级学员管理</span>
            </template>
            <el-menu-item index="/class/management">
              <el-icon><Management /></el-icon>
              <span>班级管理</span>
            </el-menu-item>
            <el-menu-item index="/class/students">
              <el-icon><UserFilled /></el-icon>
              <span>学员管理</span>
            </el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="/system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统信息管理</span>
            </template>
            <el-menu-item index="/system/department">
              <el-icon><OfficeBuilding /></el-icon>
              <span>部门管理</span>
            </el-menu-item>
            <el-menu-item index="/system/employee">
              <el-icon><User /></el-icon>
              <span>员工管理</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </aside>
      
      <!-- 右侧内容区 -->
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { 
  House, 
  User, 
  Setting, 
  School, 
  UserFilled, 
  OfficeBuilding,
  Management,
  CaretBottom 
} from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 用户信息
const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确认退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 清除本地存储的用户信息和token
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      // 跳转到登录页
      router.push('/login')
    })
  } else if (command === 'profile') {
    // 跳转到个人信息页面
    router.push('/profile')
  }
}
</script>

<style scoped>
/* 全局重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<style scoped>
.app-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
}

.title {
  font-family: KaiTi, "楷体";
  font-size: 30px;
}

.main-container {
  flex: 1;
  display: flex;
  position: relative;
}

.sidebar {
  position: relative;
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #dcdfe6;
  height: 100%;
}

.menu {
  border-right: none;
  height: 100%;
}

.content {
  flex: 1;
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #606266;
}
</style>
