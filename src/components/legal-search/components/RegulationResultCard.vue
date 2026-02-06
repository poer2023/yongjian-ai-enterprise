<script setup lang="ts">
import type { RegulationResult } from '@/mocks/legalSearch';

interface Props {
  result: RegulationResult;
  searchQuery: string;
  isSelected: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-selection', id: number): void;
  (e: 'add-to-kb', id: number): void;
  (e: 'view-detail', id: number): void;
}>();

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};
</script>

<template>
  <article class="result-item" :class="{ selected: isSelected }">
    <!-- Checkbox -->
    <div class="result-checkbox">
      <input
        type="checkbox"
        :checked="isSelected"
        @change="emit('toggle-selection', result.id)"
      />
    </div>

    <div class="result-body">
      <h3 class="result-title" @click="emit('view-detail', result.id)">
        <span v-html="highlightText(result.title, searchQuery)"></span>
        <span
          class="status-badge"
          :class="result.statusClass"
        >{{ result.status }}</span>
      </h3>

      <!-- Regulation Info Row -->
      <div class="result-meta">
        <span class="meta-category">{{ result.category }}</span>
        <span class="meta-separator">｜</span>
        <span class="meta-authority">{{ result.authority }}</span>
        <span class="meta-separator">｜</span>
        <span class="meta-date">{{ result.publishDate }}</span>
        <span class="meta-separator">｜</span>
        <span class="meta-effective">{{ result.effectiveDate }}</span>
      </div>
    </div>

    <!-- Add to Knowledge Base Button -->
    <div class="result-actions">
      <button class="add-to-kb-btn" @click="emit('add-to-kb', result.id)">
        <span class="btn-icon">⚡</span>
        添加到知识库
      </button>
    </div>
  </article>
</template>

<style scoped>
.result-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item.selected {
  background: #f8fafc;
  margin: -8px;
  padding: 8px;
  padding-bottom: 24px;
  border-radius: 8px;
}

.result-checkbox {
  flex-shrink: 0;
  padding-top: 4px;
}

.result-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2563eb;
}

.result-body {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 10px 0;
  line-height: 1.5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.result-title:hover {
  color: #2563eb;
  text-decoration: underline;
}

.status-badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none !important;
}

.status-badge.valid {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.invalid {
  background: #fee2e2;
  color: #991b1b;
}

.result-meta {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
}

.meta-separator {
  margin: 0 4px;
  color: #cbd5e1;
}

/* Result Actions */
.result-actions {
  flex-shrink: 0;
  padding-top: 4px;
}

.add-to-kb-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-to-kb-btn:hover {
  background: #f8fafc;
  border-color: #2563eb;
  color: #2563eb;
}

.add-to-kb-btn .btn-icon {
  color: #f59e0b;
}

/* Highlight style for search terms */
:deep(.highlight) {
  color: #dc2626;
  font-weight: normal;
}
</style>
