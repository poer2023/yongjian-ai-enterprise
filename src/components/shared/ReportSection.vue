<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  title: string;
  icon?: Component;
  iconColor?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  variant?: 'default' | 'warning';
}>();
</script>

<template>
  <section class="report-section" :class="{ warning: variant === 'warning' }">
    <h2 class="section-title">
      <component
        v-if="icon"
        :is="icon"
        :size="20"
        class="section-icon"
        :class="iconColor || 'blue'"
      />
      {{ title }}
    </h2>
    <div class="section-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.report-section {
  margin-bottom: 24px;
}

.report-section.warning {
  background: #fef2f2;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #fecaca;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.section-icon {
  flex-shrink: 0;
}

.section-icon.blue { color: #3b82f6; }
.section-icon.green { color: #16a34a; }
.section-icon.orange { color: #f59e0b; }
.section-icon.purple { color: #8b5cf6; }
.section-icon.red { color: #ef4444; }

.section-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
}

.report-section.warning .section-title {
  color: #dc2626;
}
</style>
