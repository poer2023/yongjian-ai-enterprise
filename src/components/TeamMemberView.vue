<script setup lang="ts">
import { ref, computed } from 'vue';
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-vue-next';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  title: string;
  profession: string;
  certificateCode: string;
  phone: string;
}

const searchKeyword = ref('');

const memberList = ref<TeamMember[]>([
  {
    id: 1,
    name: '王建军',
    position: '项目经理',
    title: '高级工程师',
    profession: '建筑工程',
    certificateCode: 'JL-2020-001234',
    phone: '138****5678'
  },
  {
    id: 2,
    name: '李晓红',
    position: '技术负责人',
    title: '高级工程师',
    profession: '结构工程',
    certificateCode: 'JG-2019-005678',
    phone: '139****4321'
  },
  {
    id: 3,
    name: '张明华',
    position: '质量工程师',
    title: '工程师',
    profession: '工程质量检测',
    certificateCode: 'ZL-2021-008765',
    phone: '136****9876'
  },
  {
    id: 4,
    name: '陈伟',
    position: '安全员',
    title: '助理工程师',
    profession: '安全工程',
    certificateCode: 'AQ-2022-003456',
    phone: '137****6543'
  },
  {
    id: 5,
    name: '刘婷',
    position: '资料员',
    title: '技术员',
    profession: '工程档案管理',
    certificateCode: 'ZL-2023-007890',
    phone: '135****2109'
  }
]);

const filteredList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return memberList.value;
  }
  const keyword = searchKeyword.value.toLowerCase();
  return memberList.value.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.position.toLowerCase().includes(keyword) ||
    item.profession.toLowerCase().includes(keyword)
  );
});

const handleAdd = () => {
  console.log('新增团队成员');
};

const handleEdit = (item: TeamMember) => {
  console.log('编辑团队成员', item);
};

const handleDelete = (item: TeamMember) => {
  console.log('删除团队成员', item);
};
</script>

<template>
  <div class="team-member-view">
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <Users :size="24" />
          </div>
          <div class="header-text">
            <h1 class="page-title">项目团队管理</h1>
            <p class="page-subtitle">管理项目团队成员及资质信息</p>
          </div>
        </div>
        <button class="add-btn" @click="handleAdd">
          <Plus :size="18" />
          <span>新增</span>
        </button>
      </div>

      <!-- Main Card -->
      <div class="main-card">
        <!-- Search Bar -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <Search :size="18" class="search-icon" />
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索姓名、职务或专业..."
              class="search-input"
            />
          </div>
          <div class="stats-info">
            <span class="stats-label">团队人数:</span>
            <span class="stats-value">{{ memberList.length }} 人</span>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>职务</th>
                <th>职称</th>
                <th>专业</th>
                <th>证书编号</th>
                <th>联系电话</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredList" :key="item.id">
                <td class="name-cell">
                  <div class="member-info">
                    <div class="avatar">{{ item.name.charAt(0) }}</div>
                    <span>{{ item.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="position-badge">{{ item.position }}</span>
                </td>
                <td>{{ item.title }}</td>
                <td>{{ item.profession }}</td>
                <td class="code-cell">{{ item.certificateCode }}</td>
                <td>{{ item.phone }}</td>
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
.team-member-view {
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
  justify-content: space-between;
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

.stats-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.stats-label {
  color: #64748b;
}

.stats-value {
  color: #3b82f6;
  font-weight: 600;
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
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.position-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.code-cell {
  font-family: monospace;
  font-size: 13px;
  color: #64748b;
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
