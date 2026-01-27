<script setup lang="ts">
import { ref } from 'vue';
import { Search, Building2, Award, Users, Briefcase } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const categories = [
  {
    id: 1,
    name: '企业信息',
    description: '企业基础信息管理，统一数据源',
    icon: Building2,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    routeName: 'company-info',
    count: 2
  },
  {
    id: 2,
    name: '资质证书',
    description: '资质证书档案管理，到期自动提醒',
    icon: Award,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    routeName: 'certificate-manage',
    count: 4
  },
  {
    id: 3,
    name: '项目团队',
    description: '团队成员资料库，快速组建项目班底',
    icon: Users,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    routeName: 'team-member',
    count: 5
  },
  {
    id: 4,
    name: '业绩案例',
    description: '历史项目案例库，投标业绩一键引用',
    icon: Briefcase,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    routeName: 'project-case',
    count: 5
  }
];

const handleCategoryClick = (routeName: string) => {
  router.push({ name: routeName });
};

const handleSearch = () => {
  console.log('Searching:', searchQuery.value);
};
</script>

<template>
  <div class="enterprise-search-view">
    <div class="view-header">
      <h1 class="view-title">企业搜索</h1>
      <p class="view-subtitle">企业素材库智能检索，快速定位所需资料</p>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-box">
        <Search :size="20" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索企业信息、资质证书、团队成员、业绩案例..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 分类卡片 -->
    <div class="categories-section">
      <h2 class="section-title">素材分类</h2>
      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          @click="handleCategoryClick(category.routeName)"
        >
          <div class="card-icon" :style="{ backgroundColor: category.bgColor }">
            <component :is="category.icon" :size="28" :style="{ color: category.color }" />
          </div>
          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">{{ category.name }}</h3>
              <span class="card-count">{{ category.count }} 条</span>
            </div>
            <p class="card-desc">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.enterprise-search-view {
  padding: 32px 40px;
  background: #f8fafc;
  min-height: 100%;
  overflow-y: auto;
}

.view-header {
  margin-bottom: 32px;
}

.view-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.view-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.search-section {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 16px;
  max-width: 700px;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 15px;
  color: #334155;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  padding: 10px 24px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover {
  background: #7c3aed;
}

.categories-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 3px solid #8b5cf6;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 800px;
}

.category-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #f1f5f9;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.1);
  border-color: #ddd6fe;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-count {
  font-size: 13px;
  color: #8b5cf6;
  background: #f5f3ff;
  padding: 4px 10px;
  border-radius: 12px;
}

.card-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}
</style>
