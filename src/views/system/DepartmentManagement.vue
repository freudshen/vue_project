<template>
  <div class="department-management">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-button type="primary" @click="handleAdd">+ 新增部门</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="deptList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="序号" width="80" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="createTime" label="最后操作时间" width="180" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="30%"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { departmentApi } from '@/api/department'

// 数据列表
const deptList = ref([])
const loading = ref(false)

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const formData = ref({
  id: null,
  name: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 获取部门列表
const getDeptList = async () => {
  loading.value = true
  try {
    const res = await departmentApi.getDeptList()
    if (res.data.code === 1) {
      deptList.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || '获取部门列表失败')
    }
  } catch (error) {
    console.error('获取部门列表错误:', error)
    // 错误处理已经在请求拦截器中统一处理
  } finally {
    loading.value = false
  }
}

// 新增部门
const handleAdd = () => {
  dialogTitle.value = '新增部门'
  formData.value = { id: null, name: '' }
  dialogVisible.value = true
}

// 编辑部门
const handleEdit = async (row) => {
  dialogTitle.value = '编辑部门'
  const res = await departmentApi.getDeptById(row.id)
  if (res.data.code === 1) {
    formData.value = res.data.data
    dialogVisible.value = true
  }
}

// 删除部门
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该部门吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await departmentApi.deleteDept(row.id)
    if (res.data.code === 1) {
      ElMessage.success('删除成功')
      getDeptList()
    }
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const api = formData.value.id ? departmentApi.updateDept : departmentApi.addDept
      const res = await api(formData.value)
      if (res.data.code === 1) {
        ElMessage.success(formData.value.id ? '修改成功' : '添加成功')
        dialogVisible.value = false
        getDeptList()
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 页面加载时获取数据
onMounted(() => {
  getDeptList()
})
</script>

<style scoped>
.department-management {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>