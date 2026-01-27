<script setup lang="ts">
import { Bell, FileSearch, FileText } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const tools = [
  {
    id: 1,
    name: '标讯订阅',
    description: '关键词智能监控，每日推送招标信息',
    icon: Bell,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-info-form'
  },
  {
    id: 2,
    name: '标讯解读',
    description: '招标文件智能解析，快速提取关键信息',
    icon: FileSearch,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-analysis-form'
  },
  {
    id: 3,
    name: '标书生成',
    description: '一键生成投标文件，智能匹配素材库',
    icon: FileText,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-doc-form'
  }
];

const handleCardClick = (routeName: string) => {
  router.push({ name: routeName });
};
</script>

<template>
  <div class="assistant-view">
    <div class="view-header">
      <h1 class="view-title">投标助手</h1>
      <p class="view-subtitle">智能投标全流程工具，提升中标率</p>
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
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.12);
  border-color: #a7f3d0;
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
