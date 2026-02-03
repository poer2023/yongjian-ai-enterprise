<script setup lang="ts">
import { ref } from 'vue';
import { FolderOpen, Plus, ExternalLink } from 'lucide-vue-next';

interface ProjectCase {
  id: number;
  name: string;
  client: string;
  amount: string;
  date: string;
  category: string;
}

const cases = ref<ProjectCase[]>([
  { id: 1, name: '上海中心大厦结构检测项目', client: '上海中心大厦建设发展有限公司', amount: '580万', date: '2023-06', category: '结构检测' },
  { id: 2, name: '虹桥商务区地基检测', client: '虹桥国际开发有限公司', amount: '320万', date: '2023-03', category: '地基检测' },
  { id: 3, name: '浦东新区学校建设质量检测', client: '浦东新区教育局', amount: '156万', date: '2022-11', category: '综合检测' },
]);
</script>

<template>
  <div class="asset-project-cases">
    <div class="section-header">
      <span class="count">共 {{ cases.length }} 个案例</span>
      <button class="add-btn"><Plus :size="16" /> 添加案例</button>
    </div>

    <div class="case-list">
      <div v-for="item in cases" :key="item.id" class="case-card">
        <div class="case-icon"><FolderOpen :size="24" /></div>
        <div class="case-info">
          <h4>{{ item.name }}</h4>
          <p class="case-client">{{ item.client }}</p>
          <div class="case-meta">
            <span class="category">{{ item.category }}</span>
            <span class="amount">{{ item.amount }}</span>
            <span class="date">{{ item.date }}</span>
          </div>
        </div>
        <button class="view-btn"><ExternalLink :size="16" /></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-project-cases { width: 100%; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.count { font-size: 14px; color: #64748b; }

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.case-list { display: flex; flex-direction: column; gap: 12px; }

.case-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.case-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef3c7;
  border-radius: 10px;
  color: #d97706;
}

.case-info { flex: 1; }
.case-info h4 { margin: 0 0 4px 0; font-size: 15px; color: #1e293b; }
.case-client { margin: 0 0 8px 0; font-size: 13px; color: #64748b; }

.case-meta { display: flex; gap: 12px; font-size: 12px; color: #94a3b8; }
.category {
  padding: 2px 8px;
  background: #eff6ff;
  border-radius: 4px;
  color: #3b82f6;
}
.amount { color: #16a34a; font-weight: 500; }

.view-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
}
.view-btn:hover { background: #eff6ff; color: #3b82f6; }
</style>
