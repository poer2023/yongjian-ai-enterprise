<script setup lang="ts">
import { UserCheck, FileUser, DollarSign } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const tools = [
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
  }
];

const handleCardClick = (routeName: string) => {
  router.push({ name: routeName });
};
</script>

<template>
  <div class="assistant-view">
    <div class="view-header">
      <h1 class="view-title">HR助手</h1>
      <p class="view-subtitle">智能HR决策辅助工具，提升招聘效率</p>
    </div>

    <div class="tools-grid">
      <div
        v-for="tool in tools"
        :key="tool.id"
        class="tool-card"
        @click="handleCardClick(tool.routeName)"
      >
        <div class="card-icon" :style="{ backgroundColor: tool.bgColor }">
          <component :is="tool.icon" :size="28" :style="{ color: tool.color }" />
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ tool.name }}</h3>
          <p class="card-desc">{{ tool.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assistant-view {
  padding: 40px;
  background: #f8fafc;
  min-height: 100%;
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

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1000px;
}

.tool-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #e2e8f0;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.12);
  border-color: #bfdbfe;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}
</style>
