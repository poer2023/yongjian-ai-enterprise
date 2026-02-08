<script setup lang="ts">
import { UserCheck, FileUser, DollarSign, FileSearch, FileText } from 'lucide-vue-next';
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
    name: '标讯解读',
    description: '招标文件智能解析，快速提取关键信息',
    icon: FileSearch,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-analysis-form'
  },
  {
    id: 6,
    name: 'AI标书生成',
    description: '一键生成专业标书，智能匹配素材库',
    icon: FileText,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-doc-smart-form'
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
      <div class="app-icon" :style="{ backgroundColor: agent.bgColor }">
        <component :is="agent.icon" :size="28" :style="{ color: agent.color }" />
      </div>
      <span class="app-name">{{ agent.name }}</span>
    </div>
    <!-- 更多应用 -->
    <div class="app-card more-card" @click="$router.push({ name: 'agents' })">
      <div class="more-icon">
        <span class="more-count">6+</span>
      </div>
      <span class="app-name">更多应用</span>
    </div>
  </div>
</template>

<style scoped>
.app-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .app-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 900px) {
  .app-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 640px) {
  .app-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.app-card {
  background: white;
  border-radius: 12px;
  padding: 20px 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #dbeafe;
}

.app-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.app-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.3;
}

.more-card {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
}

.more-card:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

.more-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.more-count {
  color: white;
  font-size: 16px;
  font-weight: 700;
}
</style>
