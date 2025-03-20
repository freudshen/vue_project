import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/class/management',
      name: 'classManagement',
      component: () => import('../views/class/ClassManagement.vue')
    },
    {
      path: '/class/students',
      name: 'studentManagement',
      component: () => import('../views/class/StudentManagement.vue')
    },
    {
      path: '/system/department',
      name: 'departmentManagement',
      component: () => import('../views/system/DepartmentManagement.vue')
    },
    {
      path: '/system/employee',
      name: 'employeeManagement',
      component: () => import('../views/system/EmployeeManagement.vue')
    }
  ]
})

export default router