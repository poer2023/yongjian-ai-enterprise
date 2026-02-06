<script setup lang="ts">
import { Package, Plus, Eye } from 'lucide-vue-next';
import type { Material } from '@/mocks/bidDocSkeleton';

defineProps<{
  materials: Material[];
}>();

const emit = defineEmits<{
  insert: [material: Material];
  preview: [material: Material];
}>();
</script>

<template>
  <div class="tool-section">
    <div class="section-header">
      <Package :size="16" class="section-icon purple" />
      <span class="section-title">推荐素材</span>
    </div>
    <div v-if="materials.length > 0" class="materials-list">
      <div v-for="(material, index) in materials" :key="index" class="material-item">
        <div class="material-info">
          <span class="material-icon">{{ material.icon }}</span>
          <span class="material-name">{{ material.name }}</span>
        </div>
        <div class="material-actions">
          <button class="material-action-btn" @click="emit('insert', material)">
            <Plus :size="12" />
            插入
          </button>
          <button class="material-action-btn" @click="emit('preview', material)">
            <Eye :size="12" />
            预览
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-materials">
      <span class="no-materials-text">本节暂无推荐素材</span>
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

.section-icon.purple { color: #9b59b6; }

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.material-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.material-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.material-icon {
  font-size: 16px;
}

.material-name {
  font-size: 13px;
  color: #333;
  flex: 1;
}

.material-actions {
  display: flex;
  gap: 8px;
}

.material-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.material-action-btn:hover {
  border-color: #4b83f0;
  color: #4b83f0;
}

.no-materials {
  padding: 20px;
  text-align: center;
  background: #f8fafc;
  border-radius: 8px;
}

.no-materials-text {
  font-size: 13px;
  color: #94a3b8;
}
</style>
