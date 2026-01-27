<script setup lang="ts">
import { ref, computed } from 'vue';
import { Briefcase, Plus, Search, Edit, Trash2, Filter } from 'lucide-vue-next';

interface ProjectCase {
  id: number;
  name: string;
  type: string;
  amount: string;
  owner: string;
  completeDate: string;
  status: 'completed' | 'ongoing' | 'pending';
}

const searchKeyword = ref('');
const statusFilter = ref('all');

const projectList = ref<ProjectCase[]>([
  {
    id: 1,
    name: '上海中心大厦结构检测项目',
    type: '结构检测',
    amount: '580万元',
    owner: '上海建工集团',
    completeDate: '2024-06-30',
    status: 'completed'
  },
  {
    id: 2,
    name: '浦东国际机场T3航站楼质量检测',
    type: '综合检测',
    amount: '1200万元',
    owner: '上海机场集团',
    completeDate: '2024-12-31',
    status: 'ongoing'
  },
  {
    id: 3,
    name: '虹桥商务区地下综合管廊工程',
    type: '基础检测',
    amount: '350万元',
    owner: '虹桥商务区管委会',
    completeDate: '2023-09-15',
    status: 'completed'
  },
  {
    id: 4,
    name: '张江科学城产业园区建设项目',
    type: '环境检测',
    amount: '420万元',
    owner: '张江高科技园区开发公司',
    completeDate: '2025-03-30',
    status: 'pending'
  },
  {
    id: 5,
    name: '黄浦江沿岸景观带改造工程',
    type: '材料检测',
    amount: '280万元',
    owner: '上海市绿化和市容管理局',
    completeDate: '2024-08-20',
    status: 'completed'
  }
]);

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    ongoing: '进行中',
    pending: '待启动'
  };
  return map[status] || status;
};

const getStatusClass = (status: string) => {
  return `status-${status}`;
};

const filteredList = computed(() => {
  let result = projectList.value;

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.owner.toLowerCase().includes(keyword) ||
      item.type.toLowerCase().includes(keyword)
    );
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(item => item.status === statusFilter.value);
  }

  return result;
});

const handleAdd = () => {
  console.log('新增业绩案例');
};

const handleEdit = (item: ProjectCase) => {
  console.log('编辑业绩案例', item);
};

const handleDelete = (item: ProjectCase) => {
  console.log('删除业绩案例', item);
};
</script>

<template>
  <div class="project-case-view">
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <Briefcase :size="24" />
          </div>
          <div class="header-text">
            <h1 class="page-title">业绩案例管理</h1>
            <p class="page-subtitle">管理企业项目业绩及典型案例</p>
          </div>
        </div>
        <button class="add-btn" @click="handleAdd">
          <Plus :size="18" />
          <span>新增</span>
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-value">{{ projectList.length }}</div>
          <div class="stat-label">总项目数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ projectList.filter(p => p.status === 'completed').length }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ projectList.filter(p => p.status === 'ongoing').length }}</div>
          <div class="stat-label">进行中</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ projectList.filter(p => p.status === 'pending').length }}</div>
          <div class="stat-label">待启动</div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="main-card">
        <!-- Search & Filter Bar -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <Search :size="18" class="search-icon" />
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索项目名称、类型或业主单位..."
              class="search-input"
            />
          </div>
          <div class="filter-wrapper">
            <Filter :size="16" class="filter-icon" />
            <select v-model="statusFilter" class="filter-select">
              <option value="all">全部状态</option>
              <option value="completed">已完成</option>
              <option value="ongoing">进行中</option>
              <option value="pending">待启动</option>
            </select>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>项目名称</th>
                <th>项目类型</th>
                <th>合同金额</th>
                <th>业主单位</th>
                <th>完成时间</th>
                <th>项目状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredList" :key="item.id">
                <td class="name-cell">{{ item.name }}</td>
                <td>
                  <span class="type-badge">{{ item.type }}</span>
                </td>
                <td class="amount-cell">{{ item.amount }}</td>
                <td>{{ item.owner }}</td>
                <td>{{ item.completeDate }}</td>
                <td>
                  <span class="status-badge" :class="getStatusClass(item.status)">
                    {{ getStatusLabel(item.status) }}
                  </span>
                </td>
                <td class="action-cell">
                  <button class="action-btn edit-btn" @click="handleEdit(item)">
                    <Edit :size="14" />
                    <span>编辑</span>
                  </button>
                  <button class="action-btn delete-btn" @click="handleDelete(item)">
                    <Trash2 :size="14" />
                    <span>删除</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredList.length === 0" class="empty-state">
          <p>暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-case-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 24px 32px;
  background: #f8fafc;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #3b82f6;
  border-radius: 12px;
  padding: 24px 32px;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 0.3px;
}

.page-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  color: #3b82f6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.main-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.search-bar {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 42px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.filter-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-icon {
  color: #64748b;
}

.filter-select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8fafc;
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.data-table td {
  padding: 16px;
  font-size: 14px;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.data-table tbody tr {
  transition: background 0.2s ease;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.name-cell {
  font-weight: 600;
  color: #1e293b;
  max-width: 280px;
}

.type-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.amount-cell {
  font-weight: 600;
  color: #059669;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-completed {
  background: #dcfce7;
  color: #16a34a;
}

.status-ongoing {
  background: #dbeafe;
  color: #2563eb;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.action-cell {
  white-space: nowrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 8px;
}

.edit-btn {
  background: #eff6ff;
  color: #3b82f6;
}

.edit-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  background: #fef2f2;
  color: #ef4444;
}

.delete-btn:hover {
  background: #fee2e2;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #94a3b8;
}
</style>
