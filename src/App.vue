<template>
  <div class="app-container">
    <!-- 顶部标题栏 -->
    <header class="header">
      <h1 class="title">智学云帆-教学管理系统</h1>
      <div class="user-info">
        <el-link type="primary" @click="handleLogout">退出登录【张三】</el-link>
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
  Management 
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const handleLogout = () => {
  // 处理退出登录逻辑
  console.log('退出登录')
}
</script>

<style>
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
</style>
