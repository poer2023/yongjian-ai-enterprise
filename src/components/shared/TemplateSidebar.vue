<script setup lang="ts">
import { ChevronLeft, Search, Flame } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import type { Component } from 'vue';

interface RecentTool {
  icon: Component;
  label: string;
  active?: boolean;
}

defineProps<{
  recentTools: RecentTool[];
  activeIndex?: number;
}>();

const router = useRouter();

const goBack = () => {
  router.push({ name: 'agents' });
};
</script>

<template>
  <aside class="template-sidebar">
    <button class="back-btn" @click="goBack">
      <ChevronLeft :size="16" />
      <span>返回智能体应用市场</span>
    </button>

    <div class="search-box">
      <Search :size="14" class="search-icon" />
      <input type="text" placeholder="搜索其他智能体" class="search-input" />
    </div>

    <div class="template-section">
      <div class="section-title">最近使用</div>
      <div
        v-for="(item, index) in recentTools"
        :key="index"
        class="template-item"
        :class="{ active: item.active || index === activeIndex }"
      >
        <component :is="item.icon" :size="16" class="item-icon" />
        <span>{{ item.label }}</span>
        <Flame v-if="item.active || index === activeIndex" :size="14" class="hot-icon" />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.template-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #eff6ff;
  border: none;
  border-radius: 8px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dbeafe;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.search-icon {
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #475569;
}

.search-input::placeholder {
  color: #94a3b8;
}

.template-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 12px;
  color: #94a3b8;
  padding: 12px 0 8px 0;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  background: #f8fafc;
}

.template-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.template-item.active .item-icon {
  color: #2563eb;
}

.hot-icon {
  color: #f97316;
  margin-left: auto;
}
</style>
