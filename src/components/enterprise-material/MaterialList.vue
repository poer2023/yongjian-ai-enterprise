<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import MaterialCard from './components/MaterialCard.vue';
import type { Material } from './types';

defineProps<{
  materials: Material[];
}>();

const emit = defineEmits<{
  addMaterial: [];
  deleteMaterial: [materialId: string];
  navigateToPage: [pageRange: string];
  'update:materialName': [materialId: string, name: string];
}>();

const handleUpdateName = (material: Material) => (name: string) => {
  emit('update:materialName', material.id, name);
};
</script>

<template>
  <div class="material-list">
    <div class="materials-header">
      <div class="materials-header-top">
        <h2 class="materials-title">
          AI 拆分素材
          <span class="materials-count">{{ materials.length }} 个</span>
        </h2>
        <button class="add-material-btn" @click="emit('addMaterial')">
          <Plus :size="16" />
          手动添加
        </button>
      </div>
      <p class="materials-subtitle">以下素材已从文件中自动识别并提取，可在标书生成时调用</p>
    </div>

    <!-- Materials List -->
    <div class="materials-list">
      <MaterialCard
        v-for="material in materials"
        :key="material.id"
        :material="material"
        @delete="emit('deleteMaterial', $event)"
        @navigate="emit('navigateToPage', $event)"
        @update:name="handleUpdateName(material)"
      />
    </div>
  </div>
</template>

<style scoped>
.material-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.materials-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.materials-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.materials-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.materials-count {
  font-size: 13px;
  font-weight: 500;
  padding: 3px 10px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
}

.materials-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.materials-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}

.add-material-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: white;
  color: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.add-material-btn:hover {
  background: #2563eb;
  color: white;
}
</style>
