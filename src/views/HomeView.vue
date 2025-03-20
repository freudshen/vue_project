<template>
  <div class="dashboard">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <el-icon><User /></el-icon>
              <span>总学员数</span>
            </div>
          </template>
          <div class="card-value">2,356</div>
          <div class="card-footer">
            <span>较上月</span>
            <span class="up">↑ 12%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <el-icon><School /></el-icon>
              <span>在读班级</span>
            </div>
          </template>
          <div class="card-value">48</div>
          <div class="card-footer">
            <span>较上月</span>
            <span class="up">↑ 3%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <el-icon><OfficeBuilding /></el-icon>
              <span>部门数量</span>
            </div>
          </template>
          <div class="card-value">12</div>
          <div class="card-footer">
            <span>较上月</span>
            <span class="stable">→ 0%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <el-icon><UserFilled /></el-icon>
              <span>教职工数</span>
            </div>
          </template>
          <div class="card-value">156</div>
          <div class="card-footer">
            <span>较上月</span>
            <span class="up">↑ 5%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中部图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>近6个月学员增长趋势</span>
            </div>
          </template>
          <div class="chart" ref="lineChart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>学员分布</span>
            </div>
          </template>
          <div class="chart" ref="pieChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部通知区域 -->
    <el-row :gutter="20" class="notice-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新通知</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(notice, index) in notices"
              :key="index"
              :timestamp="notice.time"
              :type="notice.type"
            >
              {{ notice.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
            </div>
          </template>
          <el-table :data="todos" style="width: 100%">
            <el-table-column prop="title" label="事项" />
            <el-table-column prop="deadline" label="截止时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '待处理' ? 'warning' : 'success'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, School, OfficeBuilding, UserFilled } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 模拟数据
const notices = ref([
  { content: '2024年春季招生工作即将开始', time: '2024-01-15', type: 'primary' },
  { content: '教师培训计划已发布', time: '2024-01-14', type: 'success' },
  { content: '系统维护通知', time: '2024-01-13', type: 'warning' },
])

const todos = ref([
  { title: '完成教学计划制定', deadline: '2024-01-20', status: '待处理' },
  { title: '教师考核材料提交', deadline: '2024-01-25', status: '进行中' },
  { title: '学期总结报告', deadline: '2024-01-30', status: '待处理' },
])

// 图表初始化
onMounted(() => {
  const lineChart = echarts.init(document.querySelector('.chart'))
  lineChart.setOption({
    xAxis: {
      type: 'category',
      data: ['8月', '9月', '10月', '11月', '12月', '1月']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [1820, 1932, 2010, 2150, 2290, 2356],
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  })

  const pieChart = echarts.init(document.querySelectorAll('.chart')[1])
  pieChart.setOption({
    series: [{
      type: 'pie',
      radius: '70%',
      data: [
        { value: 1200, name: '初级班' },
        { value: 800, name: '中级班' },
        { value: 356, name: '高级班' }
      ]
    }]
  })
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.data-card {
  height: 180px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #606266;
}

.card-value {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0;
}

.card-footer {
  color: #909399;
  font-size: 14px;
}

.up {
  color: #67c23a;
  margin-left: 8px;
}

.down {
  color: #f56c6c;
  margin-left: 8px;
}

.stable {
  color: #909399;
  margin-left: 8px;
}

.chart-row {
  margin-top: 20px;
}

.chart {
  height: 300px;
}

.notice-row {
  margin-top: 20px;
}

:deep(.el-timeline-item__content) {
  color: #606266;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}
</style>