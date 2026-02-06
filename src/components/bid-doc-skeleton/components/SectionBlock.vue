<script setup lang="ts">
import { computed } from 'vue';
import { Sparkles, FileText, Award, Briefcase, User } from 'lucide-vue-next';
import type { SectionContent, InsertedMaterial } from '@/mocks/bidDocSkeleton';

interface Props {
  sectionId: string;
  title: string;
  content: string;
  sectionData?: SectionContent;
  isActive: boolean;
  isGenerating: boolean;
  hasContent: boolean;
}

interface Emits {
  (e: 'generate', sectionId: string): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

// Determine content type from sectionData
const contentType = computed(() => props.sectionData?.type || 'text');
const materials = computed(() => props.sectionData?.materials || []);

// Get icon component based on material type
const getMaterialIcon = (type: string) => {
  switch (type) {
    case 'cert': return Award;
    case 'case': return Briefcase;
    case 'team': return User;
    default: return FileText;
  }
};

const getMaterialTypeLabel = (type: string) => {
  switch (type) {
    case 'cert': return '资质证书';
    case 'case': return '业绩案例';
    case 'team': return '团队成员';
    default: return '文档';
  }
};
</script>

<template>
  <div class="section-block" :class="{ 'is-active': isActive }">
    <h3 :id="sectionId" class="subsection-heading">{{ title }}</h3>

    <!-- Image type content - render material cards -->
    <template v-if="contentType === 'image' && hasContent">
      <p class="section-label">{{ sectionData?.content || title }}</p>
      <div class="materials-grid">
        <div v-for="(mat, idx) in materials" :key="idx" class="material-card" :class="mat.type">
          <div class="material-icon">
            <component :is="getMaterialIcon(mat.type)" :size="20" />
          </div>
          <div class="material-info">
            <div class="material-name">{{ mat.name }}</div>
            <div class="material-desc">{{ mat.description }}</div>
            <div v-if="mat.meta" class="material-meta">
              <span v-for="(value, key) in mat.meta" :key="key" class="meta-tag">
                {{ key }}：{{ value }}
              </span>
            </div>
          </div>
          <div class="material-type-badge">{{ getMaterialTypeLabel(mat.type) }}</div>
        </div>
      </div>
    </template>

    <!-- Mixed type content (text + materials) -->
    <template v-else-if="contentType === 'mixed' && hasContent">
      <p class="section-content" :data-section-id="sectionId">{{ content || '' }}</p>
      <div v-if="materials.length > 0" class="materials-grid">
        <div v-for="(mat, idx) in materials" :key="idx" class="material-card" :class="mat.type">
          <div class="material-icon">
            <component :is="getMaterialIcon(mat.type)" :size="20" />
          </div>
          <div class="material-info">
            <div class="material-name">{{ mat.name }}</div>
            <div class="material-desc">{{ mat.description }}</div>
            <div v-if="mat.meta" class="material-meta">
              <span v-for="(value, key) in mat.meta" :key="key" class="meta-tag">
                {{ key }}：{{ value }}
              </span>
            </div>
          </div>
          <div class="material-type-badge">{{ getMaterialTypeLabel(mat.type) }}</div>
        </div>
      </div>
    </template>

    <!-- Text/Table type content -->
    <template v-else>
      <p class="section-content" :data-section-id="sectionId">{{ content || '' }}</p>
    </template>

    <!-- AI button inside section block -->
    <button
      v-if="isActive && !hasContent && !isGenerating"
      class="section-ai-btn"
      contenteditable="false"
      @click.prevent.stop="$emit('generate', sectionId)"
    >
      <Sparkles :size="14" />
      AI生成
    </button>
  </div>
</template>

<style scoped>
.section-block {
  position: relative;
}

.subsection-heading {
  font-size: 15px;
  font-weight: 600;
  margin: 24px 0 8px 0;
  color: #1a1a1a;
}

.section-label {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.section-content {
  font-size: 14px;
  color: #333;
  margin: 0 0 20px 0;
  min-height: 1.5em;
  white-space: pre-wrap;
}

.section-content:empty::before {
  content: '在此输入内容...';
  color: #c4c9cf;
}

/* Material cards grid */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin: 12px 0 24px 0;
}

.material-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s;
  position: relative;
}

.material-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Card type colors */
.material-card.cert {
  background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%);
  border-color: #fcd34d;
}

.material-card.cert .material-icon {
  background: #fbbf24;
  color: white;
}

.material-card.case {
  background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
  border-color: #93c5fd;
}

.material-card.case .material-icon {
  background: #3b82f6;
  color: white;
}

.material-card.team {
  background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%);
  border-color: #86efac;
}

.material-card.team .material-icon {
  background: #22c55e;
  color: white;
}

.material-card.doc {
  background: linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%);
  border-color: #cbd5e1;
}

.material-card.doc .material-icon {
  background: #64748b;
  color: white;
}

.material-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.material-info {
  flex: 1;
  min-width: 0;
}

.material-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1.3;
}

.material-desc {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
  line-height: 1.4;
}

.material-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.meta-tag {
  font-size: 10px;
  color: #475569;
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
}

.material-type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  color: #64748b;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
}

/* AI button inside section */
.section-ai-btn {
  position: absolute;
  bottom: 24px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #4b83f0 0%, #7c3aed 100%);
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(75, 131, 240, 0.3);
}

.section-ai-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(75, 131, 240, 0.4);
}
</style>
