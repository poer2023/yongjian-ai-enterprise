<script setup lang="ts">
import { ref } from 'vue';
import type { CaseResult } from '@/mocks/legalSearch';

interface Props {
  result: CaseResult;
  searchQuery: string;
  isSelected: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-selection', id: number): void;
  (e: 'add-to-kb', id: number): void;
  (e: 'view-detail', id: number): void;
}>();

// Content tab state
const activeTab = ref('opinion');

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
      </h3>

      <!-- Document Info Row -->
      <div class="result-meta">
        <span class="meta-doc-type">{{ result.documentType }}</span>
        <span class="meta-separator">｜</span>
        <span class="meta-case-number">{{ result.caseNumber }}</span>
        <span class="meta-separator">｜</span>
        <span class="meta-court">{{ result.court }}</span>
        <span class="meta-separator">｜</span>
        <span class="meta-date">{{ result.settleDate }}</span>
      </div>

      <!-- Content Section with Tabs -->
      <div class="content-section-wrapper">
        <div class="content-tabs">
          <button
            class="content-tab"
            :class="{ active: activeTab === 'opinion' }"
            @click="activeTab = 'opinion'"
          >本院认为</button>
          <button
            class="content-tab"
            :class="{ active: activeTab === 'judgment' }"
            @click="activeTab = 'judgment'"
          >裁判结果</button>
          <button
            class="content-tab"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >历审文书</button>
        </div>
        <!-- Opinion -->
        <div class="content-body" v-if="activeTab === 'opinion' && result.content">
          <p class="content-text">
            <span class="content-label">本院认为，</span>
            <span>{{ result.content }}</span>
          </p>
        </div>
        <!-- Judgment -->
        <div class="content-body" v-else-if="activeTab === 'judgment' && result.judgmentResult">
          <p class="content-text" style="white-space: pre-line;">{{ result.judgmentResult }}</p>
        </div>
        <div class="content-body content-empty" v-else-if="activeTab === 'judgment'">
          <p class="content-text">暂无裁判结果数据</p>
        </div>
        <!-- History -->
        <div class="content-body" v-else-if="activeTab === 'history' && result.historicalDocs?.length > 0">
          <div v-for="(doc, idx) in result.historicalDocs" :key="idx" class="history-doc-item">
            <span class="history-doc-title">{{ doc.title }}</span>
            <span class="history-doc-meta">{{ doc.caseNumber }} | {{ doc.court }} | {{ doc.date }}</span>
          </div>
        </div>
        <div class="content-body content-empty" v-else-if="activeTab === 'history'">
          <p class="content-text">暂无历审文书</p>
        </div>
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

.result-meta {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
}

.meta-separator {
  margin: 0 4px;
  color: #cbd5e1;
}

/* Content Section Wrapper */
.content-section-wrapper {
  margin-top: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.content-tabs {
  display: flex;
  gap: 0;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.content-tab {
  padding: 10px 20px;
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.content-tab:hover {
  color: #2563eb;
  background: #f1f5f9;
}

.content-tab.active {
  color: #2563eb;
  font-weight: 600;
}

.content-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #2563eb;
}

.content-body {
  padding: 16px;
}

.content-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-label {
  font-weight: 600;
  color: #2563eb;
}

.content-empty {
  color: #94a3b8;
  font-style: italic;
}

.history-doc-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.history-doc-item:last-child {
  border-bottom: none;
}

.history-doc-title {
  font-size: 14px;
  color: #2563eb;
  cursor: pointer;
}

.history-doc-title:hover {
  text-decoration: underline;
}

.history-doc-meta {
  font-size: 12px;
  color: #64748b;
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
