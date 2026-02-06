<script setup lang="ts">
import { Lightbulb, Circle, ScanSearch, Loader2 } from 'lucide-vue-next';

defineProps<{
  points: string[];
  completionStats: { completed: number; total: number };
  isDetecting: boolean;
}>();

const emit = defineEmits<{
  togglePoint: [index: number];
  detect: [];
}>();
</script>

<template>
  <div class="tool-section">
    <div class="section-header">
      <Lightbulb :size="16" class="section-icon yellow" />
      <span class="section-title">评分要点</span>
      <span class="completion-badge" v-if="completionStats.total > 0">
        {{ completionStats.completed }}/{{ completionStats.total }}
      </span>
      <button
        class="ai-detect-btn"
        :disabled="isDetecting"
        @click="emit('detect')"
      >
        <Loader2 v-if="isDetecting" :size="14" class="spinning" />
        <ScanSearch v-else :size="14" />
        {{ isDetecting ? '检测中...' : 'AI检测' }}
      </button>
    </div>
    <div class="scoring-points-list">
      <div
        v-for="(point, index) in points"
        :key="index"
        class="scoring-point-item"
        @click="emit('togglePoint', index)"
      >
        <Circle :size="16" class="point-icon" />
        <span class="point-text">{{ point }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-icon.yellow { color: #f59e0b; }

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.completion-badge {
  padding: 2px 8px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.ai-detect-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 4px 10px;
  background: linear-gradient(135deg, #4b83f0 0%, #7c3aed 100%);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-detect-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.ai-detect-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.scoring-points-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scoring-point-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.scoring-point-item:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.point-icon {
  flex-shrink: 0;
  color: #cbd5e1;
}

.point-text {
  flex: 1;
  line-height: 1.4;
}
</style>
