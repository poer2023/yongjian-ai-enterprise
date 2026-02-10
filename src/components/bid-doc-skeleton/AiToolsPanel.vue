<script setup lang="ts">
import { computed } from 'vue';
import { MapPin, Package, Search, Plus, Eye, CheckCircle2 } from 'lucide-vue-next';
import type { Material, EnterpriseMaterial } from '@/mocks/bidDocSkeleton';

// Import sub-components
import ScoringPointsSection from './components/ScoringPointsSection.vue';
import RecommendedMaterials from './components/RecommendedMaterials.vue';
import AiEditSection from './components/AiEditSection.vue';
import MultimodalSection from './components/MultimodalSection.vue';

interface Props {
  rightPanelWidth: number;
  activeRightTab: 'node' | 'materials';
  currentSectionTitle: string;
  currentScoringPoints: string[];
  currentMaterials: Material[];
  isCurrentSectionGenerated: boolean;
  completionStats: { completed: number; total: number };
  isDetecting: boolean;
  enterpriseMaterials: EnterpriseMaterial[];
  materialSearchQuery: string;
}

interface Emits {
  (e: 'update:activeRightTab', tab: 'node' | 'materials'): void;
  (e: 'update:materialSearchQuery', query: string): void;
  (e: 'start-resize', event: MouseEvent): void;
  (e: 'toggle-scoring-point', index: number): void;
  (e: 'detect-scoring-points'): void;
  (e: 'insert-material', material: Material): void;
  (e: 'preview-material', material: Material): void;
  (e: 'ai-edit', action: string): void;
  (e: 'insert-enterprise-material', material: EnterpriseMaterial): void;
  (e: 'preview-enterprise-material', material: EnterpriseMaterial): void;
  (e: 'jump-to-section', sectionId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const getMaterialTypeIcon = (type: string): string => {
  return { 'cert': '📄', 'case': '📁', 'team': '👤' }[type] || '📄';
};

const isExpired = (dateStr: string) => {
  return new Date(dateStr) < new Date();
};

const filteredEnterpriseMaterials = computed(() => {
  if (!props.materialSearchQuery) return props.enterpriseMaterials;
  const query = props.materialSearchQuery.toLowerCase();
  return props.enterpriseMaterials.filter(m =>
    m.name.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)
  );
});
</script>

<template>
  <!-- Resize Handle -->
  <div class="resize-handle" @mousedown="$emit('start-resize', $event)"></div>

  <aside class="ai-tools-panel" :style="{ width: rightPanelWidth + 'px' }">
    <!-- Tab Header -->
    <div class="panel-tabs">
      <button
        class="panel-tab"
        :class="{ active: activeRightTab === 'node' }"
        @click="$emit('update:activeRightTab', 'node')"
      >
        <MapPin :size="14" />
        当前节点
      </button>
      <button
        class="panel-tab"
        :class="{ active: activeRightTab === 'materials' }"
        @click="$emit('update:activeRightTab', 'materials')"
      >
        <Package :size="14" />
        企业素材库
      </button>
    </div>

    <!-- Tab Content: 当前节点 -->
    <div v-if="activeRightTab === 'node'" class="tab-content">
      <!-- Current Node -->
      <div class="current-node-section">
        <div class="current-node-name">{{ currentSectionTitle || '请选择节点' }}</div>
      </div>

      <ScoringPointsSection
        :points="currentScoringPoints"
        :completion-stats="completionStats"
        :is-detecting="isDetecting"
        @toggle-point="emit('toggle-scoring-point', $event)"
        @detect="emit('detect-scoring-points')"
      />

      <RecommendedMaterials
        :materials="currentMaterials"
        @insert="emit('insert-material', $event)"
        @preview="emit('preview-material', $event)"
      />

      <AiEditSection
        :is-enabled="isCurrentSectionGenerated"
        @edit="emit('ai-edit', $event)"
      />

      <MultimodalSection @generate="emit('ai-edit', $event)" />
    </div>

    <!-- Tab Content: 企业素材库 -->
    <div v-else class="tab-content">
      <div class="material-search-box">
        <Search :size="14" class="search-icon" />
        <input
          :value="materialSearchQuery"
          type="text"
          placeholder="搜索素材..."
          class="search-input"
          @input="$emit('update:materialSearchQuery', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div v-if="filteredEnterpriseMaterials.length > 0" class="enterprise-materials-list">
        <div
          v-for="em in filteredEnterpriseMaterials"
          :key="em.id"
          class="enterprise-material-item"
          :class="{ inserted: em.inserted }"
        >
          <div class="em-icon">{{ getMaterialTypeIcon(em.type) }}</div>
          <div class="em-content">
            <div class="em-name-row">
              <span class="em-name">{{ em.name }}</span>
              <span v-if="em.expiryDate && isExpired(em.expiryDate)" class="expiry-tag expired">已过期</span>
              <span v-else-if="em.expiringSoon" class="expiry-tag expiring">即将到期</span>
            </div>
            <div class="em-desc">{{ em.description }}</div>
            <div v-if="em.expiryDate" class="em-expiry">有效期至 {{ em.expiryDate }}</div>
            <div v-if="em.inserted" class="em-location">
              已插入至：<span class="location-link" @click="$emit('jump-to-section', em.insertedSectionId || '')">{{ em.insertedSectionId }}</span>
            </div>
          </div>
          <div class="em-actions">
            <button v-if="!em.inserted" class="em-action-btn insert" @click="$emit('insert-enterprise-material', em)">
              <Plus :size="12" />
              插入
            </button>
            <span v-else class="em-inserted-badge">
              <CheckCircle2 :size="12" />
              已插入
            </span>
            <button class="em-action-btn preview" @click="$emit('preview-enterprise-material', em)">
              <Eye :size="12" />
              预览
            </button>
          </div>
        </div>
      </div>
      <div v-else class="no-materials">
        <span class="no-materials-text">未找到匹配的素材</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.resize-handle {
  width: 4px;
  cursor: col-resize;
  background: transparent;
  transition: background 0.2s;
  flex-shrink: 0;
}

.resize-handle:hover {
  background: #e2e8f0;
}

.ai-tools-panel {
  width: 320px;
  min-width: 280px;
  max-width: 480px;
  background: white;
  border-left: 1px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #e8ecf1;
  background: #f8fafc;
  flex-shrink: 0;
}

.panel-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 12px;
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.panel-tab:hover {
  color: #4b83f0;
  background: #f0f7ff;
}

.panel-tab.active {
  color: #4b83f0;
  background: white;
  border-bottom-color: #4b83f0;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.current-node-section {
  background: #f8fafc;
  margin: -20px -20px 20px -20px;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf1;
}

.current-node-name {
  font-size: 15px;
  font-weight: 500;
  color: #4b83f0;
  padding: 10px 14px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* Material Search */
.material-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 20px;
}

.material-search-box .search-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.material-search-box .search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #334155;
}

.material-search-box .search-input::placeholder {
  color: #94a3b8;
}

/* Enterprise Materials List */
.enterprise-materials-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
}

.em-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.expiry-tag {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
}

.expiry-tag.expired {
  background: #fee2e2;
  color: #dc2626;
}

.expiry-tag.expiring {
  background: #fff7ed;
  color: #ea580c;
}

.em-expiry {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.em-desc {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
  line-height: 1.4;
}

.em-location {
  font-size: 11px;
  color: #16a34a;
}

.em-location .location-link {
  text-decoration: underline;
  text-decoration-style: dashed;
  cursor: pointer;
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
