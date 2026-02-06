<script setup lang="ts">
import { Sparkles, Image, BarChart3, Table2, PenTool } from 'lucide-vue-next';

const emit = defineEmits<{
  generate: [type: string];
}>();

const tools = [
  { type: '示意图', icon: PenTool, color: 'blue' },
  { type: '图表', icon: BarChart3, color: 'purple' },
  { type: '图片', icon: Image, color: 'green' },
  { type: '表格', icon: Table2, color: 'orange' },
  { type: '公式', icon: 'sigma', color: 'yellow' }
];
</script>

<template>
  <div class="tool-section">
    <div class="section-header">
      <Sparkles :size="16" class="section-icon purple" />
      <span class="section-title">多模态AI生成</span>
    </div>
    <p class="section-hint">选中文字后，点击对应多模态生成工具</p>
    <div class="multimodal-grid">
      <button
        v-for="tool in tools"
        :key="tool.type"
        class="multimodal-btn"
        :class="tool.color"
        @click="emit('generate', tool.type)"
      >
        <component v-if="tool.icon !== 'sigma'" :is="tool.icon" :size="24" />
        <span v-else class="sigma-icon">∑</span>
        <span>{{ tool.type }}</span>
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

.tool-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-icon.purple { color: #9b59b6; }

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

.multimodal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.multimodal-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.sigma-icon {
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
}

.multimodal-btn.blue {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.multimodal-btn.blue:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

.multimodal-btn.purple {
  background: #f5f3ff;
  border-color: #ddd6fe;
  color: #7c3aed;
}

.multimodal-btn.purple:hover {
  background: #ede9fe;
  border-color: #c4b5fd;
}

.multimodal-btn.green {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.multimodal-btn.green:hover {
  background: #dcfce7;
  border-color: #86efac;
}

.multimodal-btn.orange {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #ea580c;
}

.multimodal-btn.orange:hover {
  background: #ffedd5;
  border-color: #fdba74;
}

.multimodal-btn.yellow {
  background: #fffbeb;
  border-color: #fde68a;
  color: #d97706;
}

.multimodal-btn.yellow:hover {
  background: #fef3c7;
  border-color: #fcd34d;
}
</style>
