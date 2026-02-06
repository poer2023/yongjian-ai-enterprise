<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  title: string;
  description: string;
  features: string[];
}>();
</script>

<template>
  <aside class="info-sidebar">
    <div class="info-icon-wrapper">
      <component :is="icon" :size="28" class="info-main-icon" />
    </div>
    <h3 class="info-title">{{ title }}</h3>
    <p class="info-desc">{{ description }}</p>
    <ul class="feature-list">
      <li v-for="(feature, index) in features" :key="index">
        <span class="bullet">●</span>
        {{ feature }}
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.info-sidebar {
  width: 260px;
  padding: 40px 24px;
  background: transparent;
  border-left: 1px solid #e2e8f0;
}

.info-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.info-main-icon {
  color: white;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.info-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  padding: 6px 0;
  line-height: 1.4;
}

.bullet {
  color: #2563eb;
  font-size: 8px;
  margin-top: 5px;
}
</style>
