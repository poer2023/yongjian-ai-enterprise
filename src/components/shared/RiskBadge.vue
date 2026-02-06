<script setup lang="ts">
defineProps<{
  level: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md' | 'lg';
}>();

const levelText = {
  high: '高风险',
  medium: '中风险',
  low: '低风险'
};
</script>

<template>
  <span
    class="risk-badge"
    :class="[`risk-${level}`, size ? `size-${size}` : '']"
  >
    {{ levelText[level] }}
  </span>
</template>

<style scoped>
.risk-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  background: #f1f5f9;
  color: #64748b;
}

.risk-badge.risk-high {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
}

.risk-badge.risk-medium {
  background: #fffbeb;
  color: #f59e0b;
  border: 1px solid #fef3c7;
}

.risk-badge.risk-low {
  background: #f0fdf4;
  color: #10b981;
  border: 1px solid #dcfce7;
}

.risk-badge.size-sm {
  font-size: 10px;
  padding: 1px 6px;
}

.risk-badge.size-lg {
  font-size: 12px;
  padding: 3px 10px;
}
</style>
