<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';

defineProps<{
  isEnabled: boolean;
}>();

const emit = defineEmits<{
  edit: [action: string];
}>();

const actions = ['改写', '扩写', '缩写', '翻译'];
</script>

<template>
  <div class="tool-section">
    <div class="section-header">
      <Pencil :size="16" class="section-icon green" />
      <span class="section-title">AI文本编辑</span>
    </div>
    <p class="section-hint">选中文字后，点击对应文本编辑工具</p>
    <div class="ai-edit-grid">
      <button
        v-for="action in actions"
        :key="action"
        class="ai-edit-btn"
        :disabled="!isEnabled"
        @click="emit('edit', action)"
      >
        {{ action }}
      </button>
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

.section-icon.green { color: #10b981; }

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.section-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: -8px 0 12px 0;
  line-height: 1.4;
}

.ai-edit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ai-edit-btn {
  padding: 10px 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-edit-btn:hover:not(:disabled) {
  border-color: #4b83f0;
  color: #4b83f0;
  background: #f0f7ff;
}

.ai-edit-btn:disabled {
  background: #f8fafc;
  color: #cbd5e1;
  cursor: not-allowed;
}
</style>
