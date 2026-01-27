<script setup lang="ts">
import { UserCheck, FileUser, DollarSign, Bell, FileSearch, FileText } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const agents = [
  // HR决策辅助模块
  {
    id: 1,
    name: 'Boss直聘招聘',
    description: '智能RPA招聘助手，自动筛选简历打招呼',
    icon: UserCheck,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    routeName: 'boss-recruit-form'
  },
  {
    id: 2,
    name: '简历分析',
    description: '简历智能解析匹配，生成面试问题建议',
    icon: FileUser,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    routeName: 'resume-analysis-form'
  },
  {
    id: 3,
    name: '薪酬调查',
    description: '行业薪酬数据采集分析，精准定薪决策',
    icon: DollarSign,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    routeName: 'salary-survey-form'
  },
  // 投标业务模块
  {
    id: 4,
    name: '标讯订阅',
    description: '关键词智能监控，每日推送招标信息',
    icon: Bell,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-info-form'
  },
  {
    id: 5,
    name: '标讯解读',
    description: '招标文件智能解析，快速提取关键信息',
    icon: FileSearch,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-analysis-form'
  },
  {
    id: 6,
    name: '标书生成',
    description: '一键生成投标文件，智能匹配素材库',
    icon: FileText,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-doc-form'
  }
];

const handleCardClick = (agent: any) => {
  if (agent.routeName) {
    router.push({ name: agent.routeName });
  }
};
</script>

<template>
  <div class="app-grid">
    <div 
      v-for="agent in agents" 
      :key="agent.id"
      class="app-card"
      :class="{ clickable: agent.routeName }"
      @click="handleCardClick(agent)"
    >
      <div class="card-header">
        <div class="app-icon" :style="{ backgroundColor: agent.bgColor }">
          <component :is="agent.icon" :size="22" :style="{ color: agent.color }" />
        </div>
        <h3 class="app-name">{{ agent.name }}</h3>
      </div>
      <p class="app-description">{{ agent.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.app-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .app-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .app-grid {
    grid-template-columns: 1fr;
  }
}

.app-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.08); /* Blue-tinted shadow */
  border-color: #dbeafe;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.app-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.app-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.app-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
