<script setup lang="ts">
import { ref, computed } from 'vue';
import { Award, Plus, Search, Edit, Trash2, Filter } from 'lucide-vue-next';

interface Certificate {
  id: number;
  name: string;
  code: string;
  issuer: string;
  startDate: string;
  endDate: string;
  status: 'valid' | 'expiring' | 'expired';
}

const searchKeyword = ref('');
const statusFilter = ref('all');

const certificateList = ref<Certificate[]>([
  {
    id: 1,
    name: '建设工程质量检测机构资质证书',
    code: 'ZJZS-2023-001234',
    issuer: '上海市住房和城乡建设管理委员会',
    startDate: '2023-01-15',
    endDate: '2028-01-14',
    status: 'valid'
  },
  {
    id: 2,
    name: '检验检测机构资质认定证书(CMA)',
    code: 'CMA-2022-567890',
    issuer: '上海市市场监督管理局',
    startDate: '2022-06-01',
    endDate: '2025-05-31',
    status: 'expiring'
  },
  {
    id: 3,
    name: '建筑工程施工许可证',
    code: 'JZGC-2021-098765',
    issuer: '上海市建设工程安全质量监督总站',
    startDate: '2021-03-20',
    endDate: '2024-03-19',
    status: 'expired'
  },
  {
    id: 4,
    name: '安全生产许可证',
    code: 'AQSC-2023-112233',
    issuer: '上海市应急管理局',
    startDate: '2023-08-01',
    endDate: '2026-07-31',
    status: 'valid'
  }
]);

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    valid: '有效',
    expiring: '即将到期',
    expired: '已过期'
  };
  return map[status] || status;
};

const getStatusClass = (status: string) => {
  return `status-${status}`;
};

const filteredList = computed(() => {
  let result = certificateList.value;

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword)
    );
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(item => item.status === statusFilter.value);
  }

  return result;
});

const handleAdd = () => {
  console.log('新增资质证书');
};

const handleEdit = (item: Certificate) => {
  console.log('编辑资质证书', item);
};

const handleDelete = (item: Certificate) => {
  console.log('删除资质证书', item);
};
</script>

<template>
  <div class="certificate-manage-view">
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <Award :size="24" />
          </div>
          <div class="header-text">
            <h1 class="page-title">资质证书管理</h1>
            <p class="page-subtitle">管理企业各类资质证书及有效期</p>
          </div>
        </div>
        <button class="add-btn" @click="handleAdd">
          <Plus :size="18" />
          <span>新增</span>
        </button>
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
              placeholder="搜索证书名称或编号..."
              class="search-input"
            />
          </div>
          <div class="filter-wrapper">
            <Filter :size="16" class="filter-icon" />
            <select v-model="statusFilter" class="filter-select">
              <option value="all">全部状态</option>
              <option value="valid">有效</option>
              <option value="expiring">即将到期</option>
              <option value="expired">已过期</option>
            </select>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>证书名称</th>
                <th>证书编号</th>
                <th>发证机构</th>
                <th>有效期起</th>
                <th>有效期止</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredList" :key="item.id">
                <td class="name-cell">{{ item.name }}</td>
                <td class="code-cell">{{ item.code }}</td>
                <td>{{ item.issuer }}</td>
                <td>{{ item.startDate }}</td>
                <td>{{ item.endDate }}</td>
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
.certificate-manage-view {
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
  max-width: 250px;
}

.code-cell {
  font-family: monospace;
  font-size: 13px;
  color: #64748b;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-valid {
  background: #dcfce7;
  color: #16a34a;
}

.status-expiring {
  background: #fef3c7;
  color: #d97706;
}

.status-expired {
  background: #fee2e2;
  color: #dc2626;
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
