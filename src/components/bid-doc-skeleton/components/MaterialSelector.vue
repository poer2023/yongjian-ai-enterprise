<script setup lang="ts">
import { Plus, Eye, CheckCircle2 } from 'lucide-vue-next';
import type { Material, EnterpriseMaterial } from '@/mocks/bidDocSkeleton';

interface Props {
  materials: Material[];
  enterpriseMaterials?: EnterpriseMaterial[];
  insertedMaterials?: Set<string>;
  showInsertedState?: boolean;
}

interface Emits {
  (e: 'insert', material: Material): void;
  (e: 'preview', material: Material): void;
  (e: 'insert-enterprise', material: EnterpriseMaterial): void;
  (e: 'preview-enterprise', material: EnterpriseMaterial): void;
}

const props = withDefaults(defineProps<Props>(), {
  showInsertedState: true,
});
defineEmits<Emits>();

// Check if material is already inserted
const isMaterialInserted = (material: Material): boolean => {
  if (!props.insertedMaterials) return false;
  return props.insertedMaterials.has(material.name);
};

// Get material type icon
const getMaterialTypeIcon = (type: string): string => {
  return {
    'cert': '📄',
    'case': '📁',
    'team': '👤',
  }[type] || '📄';
};
</script>

<template>
  <!-- Simple materials list -->
  <div v-if="materials.length > 0" class="materials-list">
    <div v-for="(material, index) in materials" :key="index" class="material-item">
      <div class="material-info">
        <span class="material-icon">{{ material.icon }}</span>
        <span class="material-name">{{ material.name }}</span>
      </div>
      <div class="material-actions">
        <button
          class="material-action-btn"
          :class="{ inserted: showInsertedState && isMaterialInserted(material) }"
          :disabled="showInsertedState && isMaterialInserted(material)"
          @click="$emit('insert', material)"
        >
          <Plus :size="12" />
          {{ showInsertedState && isMaterialInserted(material) ? '已插入' : '插入' }}
        </button>
        <button class="material-action-btn" @click="$emit('preview', material)">
          <Eye :size="12" />
          预览
        </button>
      </div>
    </div>
  </div>
  <div v-else class="no-materials">
    <span class="no-materials-text">本节暂无推荐素材</span>
  </div>

  <!-- Enterprise materials list (if provided) -->
  <div v-if="enterpriseMaterials && enterpriseMaterials.length > 0" class="enterprise-materials-list">
    <div
      v-for="em in enterpriseMaterials"
      :key="em.id"
      class="enterprise-material-item"
      :class="{ inserted: em.inserted }"
    >
      <div class="em-icon">{{ getMaterialTypeIcon(em.type) }}</div>
      <div class="em-content">
        <div class="em-name">{{ em.name }}</div>
        <div class="em-desc">{{ em.description }}</div>
      </div>
      <div class="em-actions">
        <button
          v-if="!em.inserted"
          class="em-action-btn insert"
          @click="$emit('insert-enterprise', em)"
        >
          <Plus :size="12" />
          插入
        </button>
        <span v-else class="em-inserted-badge">
          <CheckCircle2 :size="12" />
          已插入
        </span>
        <button class="em-action-btn preview" @click="$emit('preview-enterprise', em)">
          <Eye :size="12" />
          预览
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.material-action-btn:hover:not(:disabled) {
  border-color: #4b83f0;
  color: #4b83f0;
}

.material-action-btn.inserted {
  background: #f0fdf4;
  border-color: #10b981;
  color: #10b981;
  cursor: default;
}

.material-action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

/* Enterprise Materials */
.enterprise-materials-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.enterprise-material-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.enterprise-material-item:hover {
  border-color: #cbd5e1;
}

.enterprise-material-item.inserted {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.em-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.em-content {
  flex: 1;
  min-width: 0;
}

.em-name {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 4px;
}

.em-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

.em-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.em-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 11px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.em-action-btn.insert:hover {
  border-color: #4b83f0;
  color: #4b83f0;
  background: #f0f7ff;
}

.em-action-btn.preview:hover {
  border-color: #64748b;
  background: #f8fafc;
}

.em-inserted-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #dcfce7;
  border-radius: 4px;
  font-size: 11px;
  color: #16a34a;
}
</style>
