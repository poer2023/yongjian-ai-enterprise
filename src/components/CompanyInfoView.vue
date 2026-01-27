<script setup lang="ts">
import { ref } from 'vue';
import { Building2, Plus, Search, Edit, Trash2 } from 'lucide-vue-next';

interface CompanyInfo {
  id: number;
  name: string;
  creditCode: string;
  legalRepresentative: string;
  registeredCapital: string;
  establishDate: string;
  address: string;
  phone: string;
}

const searchKeyword = ref('');

const companyList = ref<CompanyInfo[]>([
  {
    id: 1,
    name: '金盾建设工程检测有限公司',
    creditCode: '91310000MA1FL5XQ2X',
    legalRepresentative: '张建国',
    registeredCapital: '5000万元',
    establishDate: '2015-06-18',
    address: '上海市浦东新区张江高科技园区碧波路888号',
    phone: '021-58765432'
  },
  {
    id: 2,
    name: '金盾工程咨询有限公司',
    creditCode: '91310000MA1FL8KP3Y',
    legalRepresentative: '李明华',
    registeredCapital: '3000万元',
    establishDate: '2018-03-25',
    address: '上海市黄浦区南京东路299号',
    phone: '021-63218765'
  }
]);

const filteredList = ref(companyList.value);

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    filteredList.value = companyList.value;
  } else {
    filteredList.value = companyList.value.filter(item =>
      item.name.includes(searchKeyword.value) ||
      item.creditCode.includes(searchKeyword.value)
    );
  }
};

const handleAdd = () => {
  console.log('新增企业信息');
};

const handleEdit = (item: CompanyInfo) => {
  console.log('编辑企业信息', item);
};

const handleDelete = (item: CompanyInfo) => {
  console.log('删除企业信息', item);
};
</script>

<template>
  <div class="company-info-view">
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <Building2 :size="24" />
          </div>
          <div class="header-text">
            <h1 class="page-title">企业信息管理</h1>
            <p class="page-subtitle">管理企业基本信息、资质和联系方式</p>
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
              placeholder="搜索企业名称或统一社会信用代码..."
              class="search-input"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>企业名称</th>
                <th>统一社会信用代码</th>
                <th>法定代表人</th>
                <th>注册资本</th>
                <th>成立日期</th>
                <th>企业地址</th>
                <th>联系电话</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredList" :key="item.id">
                <td class="name-cell">{{ item.name }}</td>
                <td class="code-cell">{{ item.creditCode }}</td>
                <td>{{ item.legalRepresentative }}</td>
                <td>{{ item.registeredCapital }}</td>
                <td>{{ item.establishDate }}</td>
                <td class="address-cell">{{ item.address }}</td>
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
.company-info-view {
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
}

.search-input-wrapper {
  position: relative;
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

.code-cell {
  font-family: monospace;
  font-size: 13px;
  color: #64748b;
}

.address-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
