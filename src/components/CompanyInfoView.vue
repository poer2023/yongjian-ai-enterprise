<script setup lang="ts">
import { ref, computed } from 'vue';
import { Building2, Plus, Search, Edit, Trash2, Star, MapPin, Phone, Calendar, CreditCard, User } from 'lucide-vue-next';

interface CompanyInfo {
  id: number;
  name: string;
  shortName: string;
  creditCode: string;
  legalRepresentative: string;
  registeredCapital: string;
  establishDate: string;
  address: string;
  phone: string;
  isDefault: boolean;
  certificateCount: number;
  caseCount: number;
}

const searchKeyword = ref('');

const companyList = ref<CompanyInfo[]>([
  {
    id: 1,
    name: '北京涌见科技有限公司',
    shortName: '涌见科技',
    creditCode: '91110000MA1FL5XQ2X',
    legalRepresentative: '张建国',
    registeredCapital: '5000万元',
    establishDate: '2018-06-18',
    address: '北京市海淀区中关村软件园二期',
    phone: '010-58765432',
    isDefault: true,
    certificateCount: 5,
    caseCount: 12
  },
  {
    id: 2,
    name: '上海涌见信息技术有限公司',
    shortName: '涌见信息',
    creditCode: '91310000MA1FL8KP3Y',
    legalRepresentative: '李明华',
    registeredCapital: '3000万元',
    establishDate: '2020-03-25',
    address: '上海市浦东新区张江高科技园区',
    phone: '021-63218765',
    isDefault: false,
    certificateCount: 3,
    caseCount: 8
  },
  {
    id: 3,
    name: '深圳涌见安全科技有限公司',
    shortName: '涌见安全',
    creditCode: '91440300MA5FL2KR1Z',
    legalRepresentative: '王伟',
    registeredCapital: '2000万元',
    establishDate: '2021-08-10',
    address: '深圳市南山区科技园南区',
    phone: '0755-86543210',
    isDefault: false,
    certificateCount: 2,
    caseCount: 5
  }
]);

const filteredList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return companyList.value;
  }
  const keyword = searchKeyword.value.toLowerCase();
  return companyList.value.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.creditCode.toLowerCase().includes(keyword)
  );
});

const handleAdd = () => {
  console.log('新增企业主体');
};

const handleEdit = (item: CompanyInfo) => {
  console.log('编辑企业信息', item);
};

const handleDelete = (item: CompanyInfo) => {
  console.log('删除企业信息', item);
};

const handleSetDefault = (item: CompanyInfo) => {
  companyList.value.forEach(c => c.isDefault = false);
  item.isDefault = true;
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
            <h1 class="page-title">企业主体管理</h1>
            <p class="page-subtitle">管理多个投标主体，支持集团多公司场景</p>
          </div>
        </div>
        <button class="add-btn" @click="handleAdd">
          <Plus :size="18" />
          <span>添加主体</span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-input-wrapper">
          <Search :size="18" class="search-icon" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索企业名称或统一社会信用代码..."
            class="search-input"
          />
        </div>
        <div class="result-count">
          共 <strong>{{ filteredList.length }}</strong> 个企业主体
        </div>
      </div>

      <!-- Company Cards Grid -->
      <div class="cards-grid">
        <div
          v-for="item in filteredList"
          :key="item.id"
          class="company-card"
          :class="{ 'is-default': item.isDefault }"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="company-avatar">
              <Building2 :size="24" />
            </div>
            <div class="company-title">
              <h3 class="company-name">{{ item.name }}</h3>
              <span class="company-short">{{ item.shortName }}</span>
            </div>
            <span v-if="item.isDefault" class="default-badge">
              <Star :size="12" />
              默认主体
            </span>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <div class="info-row">
              <CreditCard :size="14" class="info-icon" />
              <span class="info-label">信用代码</span>
              <span class="info-value code">{{ item.creditCode }}</span>
            </div>
            <div class="info-row">
              <User :size="14" class="info-icon" />
              <span class="info-label">法定代表人</span>
              <span class="info-value">{{ item.legalRepresentative }}</span>
            </div>
            <div class="info-row">
              <Calendar :size="14" class="info-icon" />
              <span class="info-label">成立日期</span>
              <span class="info-value">{{ item.establishDate }}</span>
            </div>
            <div class="info-row">
              <MapPin :size="14" class="info-icon" />
              <span class="info-label">企业地址</span>
              <span class="info-value address">{{ item.address }}</span>
            </div>
            <div class="info-row">
              <Phone :size="14" class="info-icon" />
              <span class="info-label">联系电话</span>
              <span class="info-value">{{ item.phone }}</span>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-value">{{ item.registeredCapital }}</span>
              <span class="stat-label">注册资本</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ item.certificateCount }}</span>
              <span class="stat-label">资质证书</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ item.caseCount }}</span>
              <span class="stat-label">业绩案例</span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <button
              v-if="!item.isDefault"
              class="action-btn default-btn"
              @click="handleSetDefault(item)"
            >
              <Star :size="14" />
              设为默认
            </button>
            <button class="action-btn edit-btn" @click="handleEdit(item)">
              <Edit :size="14" />
              编辑
            </button>
            <button
              v-if="!item.isDefault"
              class="action-btn delete-btn"
              @click="handleDelete(item)"
            >
              <Trash2 :size="14" />
              删除
            </button>
          </div>
        </div>

        <!-- Add Card Placeholder -->
        <div class="company-card add-card" @click="handleAdd">
          <div class="add-card-content">
            <div class="add-icon">
              <Plus :size="32" />
            </div>
            <span class="add-text">添加企业主体</span>
            <span class="add-hint">支持集团多公司、联合体投标场景</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredList.length === 0 && searchKeyword" class="empty-state">
        <p>未找到匹配的企业主体</p>
        <button class="clear-btn" @click="searchKeyword = ''">清除搜索</button>
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

/* Search Section */
.search-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.search-input-wrapper {
  position: relative;
  width: 400px;
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
  padding: 12px 14px 12px 42px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: white;
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

.result-count {
  font-size: 14px;
  color: #64748b;
}

.result-count strong {
  color: #3b82f6;
  font-weight: 600;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.company-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s ease;
}

.company-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.company-card.is-default {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.company-card.is-default .card-header {
  background: #eff6ff;
}

.company-avatar {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.company-title {
  flex: 1;
  min-width: 0;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.company-short {
  font-size: 13px;
  color: #64748b;
}

.default-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #3b82f6;
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
}

/* Card Body */
.card-body {
  padding: 16px 20px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 13px;
}

.info-icon {
  color: #94a3b8;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-label {
  color: #64748b;
  width: 70px;
  flex-shrink: 0;
}

.info-value {
  color: #1e293b;
  flex: 1;
}

.info-value.code {
  font-family: monospace;
  font-size: 12px;
  color: #64748b;
}

.info-value.address {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #e2e8f0;
}

/* Card Footer */
.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.default-btn {
  background: #fef3c7;
  color: #d97706;
}

.default-btn:hover {
  background: #fde68a;
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

/* Add Card */
.add-card {
  border: 2px dashed #e2e8f0;
  background: transparent;
  cursor: pointer;
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-card:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.add-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.add-icon {
  width: 64px;
  height: 64px;
  background: #eff6ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.add-text {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

.add-hint {
  font-size: 13px;
  color: #94a3b8;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.clear-btn {
  margin-top: 16px;
  padding: 8px 20px;
  background: #eff6ff;
  border: none;
  border-radius: 6px;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
}

.clear-btn:hover {
  background: #dbeafe;
}

/* Responsive */
@media (max-width: 840px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
