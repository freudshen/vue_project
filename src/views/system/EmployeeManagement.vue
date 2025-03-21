<template>
  <div class="employee-management">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" class="form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="searchForm.gender" placeholder="请选择性别" clearable style="width: 120px">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="到"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button type="primary" @click="handleAdd">+ 新增员工</el-button>
          <el-button type="danger" @click="handleBatchDelete" :disabled="!selectedRows.length">
            批量删除
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <el-table 
      :data="empList" 
      style="width: 100%" 
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="头像" width="70">
        <template #default="scope">
          <el-avatar 
            :size="40" 
            :src="scope.row.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性别">
        <template #default="scope">
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位">
        <template #default="scope">
          {{ scope.row.position === 1 ? '班主任' : '讲师' }}
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" />
      <el-table-column prop="salary" label="薪资" />
      <el-table-column prop="hireDate" label="入职日期" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        :prev-text="'上一页'"
        :next-text="'下一页'"
        :popper-class="'custom-pagination'"
        :sizes-text="'条/页'"
        :total-text="'共 {total} 条'"
        :jumper-text="'前往第 {input} 页'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="50%"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-select v-model="formData.position" placeholder="请选择职位">
                <el-option label="班主任" :value="1" />
                <el-option label="讲师" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资" prop="salary">
              <el-input-number v-model="formData.salary" :min="0" :step="1000" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <el-select v-model="formData.deptId" placeholder="请选择部门">
                <el-option
                  v-for="dept in deptList"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="hireDate">
              <el-date-picker
                v-model="formData.hireDate"
                type="date"
                placeholder="请选择入职日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
          <div class="avatar-content">
              <img 
                v-if="formData.avatar" 
                :src="formData.avatar" 
                class="avatar" 
              />
              <div v-else class="avatar-placeholder">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <span>点击上传头像</span>
              </div>
              <div class="avatar-mask" v-if="formData.avatar">
                <el-icon class="upload-hover-icon"><Edit /></el-icon>
                <span>更换头像</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="工作经历">
          <div v-for="(expr, index) in formData.exprList" :key="index" class="expr-item">
            <div class="expr-header">
              <span>工作经历 #{{ index + 1 }}</span>
              <el-button type="danger" link @click="removeExpr(index)">删除</el-button>
            </div>
            <el-form-item :prop="`exprList.${index}.company`" label="公司名称">
              <el-input v-model="expr.company" placeholder="请输入公司名称" />
            </el-form-item>
            <el-form-item :prop="`exprList.${index}.position`" label="职位名称">
              <el-input v-model="expr.position" placeholder="请输入职位名称" />
            </el-form-item>
            <el-form-item :prop="`exprList.${index}.dateRange`" label="任职时间">
              <el-date-picker
                v-model="expr.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
                @change="handleExprDateChange($event, index)"
              />
            </el-form-item>
          </div>
          <div class="add-expr">
            <el-button type="primary" plain @click="addExpr">
              <el-icon><Plus /></el-icon>
              添加工作经历
            </el-button>
          </div>
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
import { employeeApi } from '@/api/employee'
import { departmentApi } from '@/api/department'
import { Plus, Edit } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = ref({
  name: '',
  gender: null,
  begin: '',
  end: ''
})

// 日期范围
const dateRange = ref([])

// 分页相关
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 数据列表
const empList = ref([])
const loading = ref(false)
const deptList = ref([])

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const formData = ref({
  id: null,
  username: '',
  name: '',
  gender: 1,
  phone: '',
  position: null,
  deptId: null,
  salary: 0,
  hireDate: '',
  exprList: []
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  position: [{ required: true, message: '请选择职位', trigger: 'change' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  salary: [{ required: true, message: '请输入薪资', trigger: 'change' }],
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }]
}

// 获取员工列表
const getEmpList = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm.value,
      page: page.value,
      pageSize: pageSize.value
    }
    const res = await employeeApi.getEmpList(params)
    if (res.data.code === 1) {
      empList.value = res.data.data.rows
      total.value = res.data.data.total
    }
  } catch (error) {
    console.error('获取员工列表错误:', error)
  } finally {
    loading.value = false
  }
}

// 获取部门列表
const getDeptList = async () => {
  try {
    const res = await departmentApi.getDeptList()
    if (res.data.code === 1) {
      deptList.value = res.data.data
    }
  } catch (error) {
    console.error('获取部门列表错误:', error)
  }
}

// 搜索
const handleSearch = () => {
  if (dateRange.value) {
    searchForm.value.begin = dateRange.value[0]
    searchForm.value.end = dateRange.value[1]
  }
  page.value = 1
  getEmpList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    name: '',
    gender: null,
    begin: '',
    end: ''
  }
  dateRange.value = []
  page.value = 1
  getEmpList()
}

// 新增员工
const handleAdd = () => {
  dialogTitle.value = '新增员工'
  formData.value = {
    id: null,
    username: '',
    name: '',
    gender: 1,
    phone: '',
    position: null,
    deptId: null,
    salary: 0,
    hireDate: '',
    exprList: []
  }
  dialogVisible.value = true
}

// 编辑员工
const handleEdit = async (row) => {
  dialogTitle.value = '编辑员工'
  const res = await employeeApi.getEmpById(row.id)
  if (res.data.code === 1) {
    const data = res.data.data
    // 处理工作经历日期
    if (data.exprList) {
      data.exprList.forEach(expr => {
        expr.dateRange = [expr.startDate, expr.endDate]
      })
    }
    formData.value = data
    dialogVisible.value = true
  }
}

// 删除员工
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该员工吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await employeeApi.deleteEmp(row.id)
    if (res.data.code === 1) {
      ElMessage.success('删除成功')
      getEmpList()
    }
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 处理工作经历数据
      const submitData = { ...formData.value }
      if (submitData.exprList) {
        submitData.exprList = submitData.exprList.map(expr => ({
          ...expr,
          startDate: expr.dateRange[0],
          endDate: expr.dateRange[1]
        }))
      }

      // 提交数据
      const api = submitData.id ? employeeApi.updateEmp : employeeApi.addEmp
      const res = await api(submitData)
      if (res.data.code === 1) {
        ElMessage.success(submitData.id ? '修改成功' : '添加成功')
        dialogVisible.value = false
        getEmpList()
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

// 分页相关方法
const handleSizeChange = (val) => {
  pageSize.value = val
  getEmpList()
}

const handleCurrentChange = (val) => {
  page.value = val
  getEmpList()
}

// 工作经历相关方法
const addExpr = () => {
  formData.value.exprList.push({
    company: '',
    position: '',
    dateRange: []
  })
}

const removeExpr = (index) => {
  formData.value.exprList.splice(index, 1)
}

const handleExprDateChange = (dates, index) => {
  if (dates) {
    formData.value.exprList[index].startDate = dates[0]
    formData.value.exprList[index].endDate = dates[1]
  }
}

// 页面加载时获取数据
onMounted(() => {
  getEmpList()
  getDeptList()
})
// 在 script setup 中添加头像上传相关方法
const handleAvatarSuccess = (res) => {
  if (res.code === 1) {
    formData.value.avatar = res.data
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(res.msg || '头像上传失败')
  }
}

const beforeAvatarUpload = (file) => {
  const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 选中的行数据
const selectedRows = ref([])

// 表格选择改变
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 批量删除
const handleBatchDelete = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请选择要删除的员工')
    return
  }
  
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 名员工吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = selectedRows.value.map(row => row.id).join(',')
    const res = await employeeApi.deleteEmp(ids)
    if (res.data.code === 1) {
      ElMessage.success('删除成功')
      getEmpList()
    }
  }).catch(() => {})
}
</script>

<style scoped>
.employee-management {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.expr-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.expr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e0e0e0;
}

.expr-header span {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.add-expr {
  margin-top: 10px;
  text-align: center;
}

.expr-item:last-child {
  margin-bottom: 0;
}


.expr-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.expr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e0e0e0;
}

.expr-header span {
  font-size: 15px;
  font-weight: 500;
  color: #606266;
}

.expr-item :deep(.el-form-item) {
  margin-bottom: 18px;
}

.expr-item :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.avatar-uploader {
  width: 178px;
  height: 178px;
}

.avatar-content {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.avatar-content:hover .avatar-mask {
  opacity: 1;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c939d;
}

.avatar-placeholder .upload-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.avatar {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.avatar-mask .upload-hover-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.avatar-content:hover {
  border-color: #409eff;
}
</style>

