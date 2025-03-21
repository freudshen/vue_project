import request from '@/utils/request'

export const employeeApi = {
  // 获取员工列表
  getEmpList(params) {
    return request.get('/emps', { params })
  },

  // 删除员工
  deleteEmp(ids) {
    return request.delete(`/emps?ids=${ids}`)
  },

  // 添加员工
  addEmp(data) {
    return request.post('/emps', data)
  },

  // 根据ID查询员工
  getEmpById(id) {
    return request.get(`/emps/${id}`)
  },

  // 修改员工
  updateEmp(data) {
    return request.put('/emps', data)
  }
}