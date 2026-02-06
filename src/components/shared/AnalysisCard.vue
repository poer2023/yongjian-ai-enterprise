<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  title: string;
  icon?: Component;
  iconColor?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}>();

const collapsed = defineModel<boolean>('collapsed', { default: false });

const toggleCollapse = () => {
  if (collapsed.value !== undefined) {
    collapsed.value = !collapsed.value;
  }
};
</script>

<template>
  <div class="analysis-card">
    <div
      class="card-header"
      :class="{ collapsible }"
      @click="collapsible && toggleCollapse()"
    >
      <div class="header-left">
        <component
          v-if="icon"
          :is="icon"
          :size="18"
          class="header-icon"
          :class="iconColor || 'blue'"
        />
        <h3 class="header-title">{{ title }}</h3>
      </div>
      <div class="header-right">
        <slot name="header-actions" />
        <svg
          v-if="collapsible"
          class="collapse-icon"
          :class="{ collapsed }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div v-show="!collapsed" class="card-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.analysis-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.card-header.collapsible {
  cursor: pointer;
  transition: background 0.2s;
}

.card-header.collapsible:hover {
  background: #f8fafc;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  flex-shrink: 0;
}

.header-icon.blue { color: #3b82f6; }
.header-icon.green { color: #16a34a; }
.header-icon.orange { color: #f59e0b; }
.header-icon.purple { color: #8b5cf6; }
.header-icon.red { color: #ef4444; }

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.collapse-icon {
  color: #94a3b8;
  transition: transform 0.2s;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

.card-body {
  padding: 16px 20px;
}
</style>
