import request from '@/utils/request'

export const departmentApi = {
  // 获取部门列表
  getDeptList() {
    return request.get('/depts')
  },

  // 删除部门
  deleteDept(id) {
    return request.delete(`/depts/${id}`)
  },

  // 添加部门
  addDept(data) {
    return request.post('/depts', data)
  },

  // 根据ID查询部门
  getDeptById(id) {
    return request.get(`/depts/${id}`)
  },

  // 修改部门
  updateDept(data) {
    return request.put('/depts', data)
  }
}