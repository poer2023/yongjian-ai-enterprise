<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import CaseResultCard from './components/CaseResultCard.vue';
import RegulationResultCard from './components/RegulationResultCard.vue';
import type { CaseResult, RegulationResult } from '@/mocks/legalSearch';

interface Props {
  activeTab: 'cases' | 'regulations';
  caseResults: CaseResult[];
  regulationResults: RegulationResult[];
  searchQuery: string;
  selectedResults: number[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-selection', id: number): void;
  (e: 'add-to-kb', id: number): void;
  (e: 'add-selected-to-kb'): void;
  (e: 'view-detail', id: number): void;
  (e: 'go-to-page', page: number): void;
}>();

// Sort options
const sortBy = ref('相关度');
const sortOptions = ['相关度', '时间降序', '时间升序'];
const showSortDropdown = ref(false);

const selectSortBy = (sort: string) => {
  sortBy.value = sort;
  showSortDropdown.value = false;
};

const isResultSelected = (id: number) => {
  return props.selectedResults.includes(id);
};

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= props.totalPages; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<template>
  <main class="results-scroll-container">
    <!-- Results Header -->
    <div class="results-header">
      <div class="results-count">
        为您找到相关结果共 <span class="count-number">{{ totalResults }}+</span> 篇
      </div>
      <div class="sort-wrapper" @click="showSortDropdown = !showSortDropdown">
        <span class="sort-label">{{ sortBy }}</span>
        <ChevronDown :size="14" class="dropdown-icon" />
        <div v-if="showSortDropdown" class="sort-dropdown">
          <div
            v-for="option in sortOptions"
            :key="option"
            class="sort-option"
            :class="{ active: sortBy === option }"
            @click.stop="selectSortBy(option)"
          >
            {{ option }}
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Actions Bar -->
    <div class="batch-actions-bar" v-if="selectedResults.length > 0">
      <span class="selected-count">已选择 {{ selectedResults.length }} 项</span>
      <button class="batch-add-btn" @click="emit('add-selected-to-kb')">
        <span class="btn-icon">⚡</span>
        批量添加到知识库
      </button>
    </div>

    <div class="results-list">
      <!-- Case Results -->
      <template v-if="activeTab === 'cases'">
        <CaseResultCard
          v-for="result in caseResults"
          :key="result.id"
          :result="result"
          :search-query="searchQuery"
          :is-selected="isResultSelected(result.id)"
          @toggle-selection="emit('toggle-selection', $event)"
          @add-to-kb="emit('add-to-kb', $event)"
          @view-detail="emit('view-detail', $event)"
        />
      </template>

      <!-- Regulation Results -->
      <template v-else>
        <RegulationResultCard
          v-for="result in regulationResults"
          :key="result.id"
          :result="result"
          :search-query="searchQuery"
          :is-selected="isResultSelected(result.id)"
          @toggle-selection="emit('toggle-selection', $event)"
          @add-to-kb="emit('add-to-kb', $event)"
          @view-detail="emit('view-detail', $event)"
        />
      </template>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <span class="pagination-text" @click="emit('go-to-page', currentPage - 1)">上一页</span>
      <div class="page-numbers">
        <button
          v-for="page in pageNumbers"
          :key="page"
          class="page-number"
          :class="{ active: currentPage === page }"
          @click="emit('go-to-page', page)"
        >
          {{ page }}
        </button>
      </div>
      <span class="pagination-text" @click="emit('go-to-page', currentPage + 1)">下一页</span>
    </div>
  </main>
</template>

<style scoped>
.results-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  min-width: 0;
}

/* Results Header */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-count {
  font-size: 14px;
  color: #64748b;
}

.count-number {
  color: #2563eb;
  font-weight: 600;
}

.sort-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}

.sort-label {
  font-size: 13px;
  color: #475569;
}

.dropdown-icon {
  color: #94a3b8;
}

.sort-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  min-width: 100px;
}

.sort-option {
  padding: 10px 16px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sort-option:first-child {
  border-radius: 8px 8px 0 0;
}

.sort-option:last-child {
  border-radius: 0 0 8px 8px;
}

.sort-option:hover {
  background: #f1f5f9;
}

.sort-option.active {
  color: #2563eb;
  background: #eff6ff;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Batch Actions Bar */
.batch-actions-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  margin-bottom: 20px;
}

.selected-count {
  font-size: 14px;
  color: #1e40af;
  font-weight: 500;
}

.batch-add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #2563eb;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.batch-add-btn:hover {
  background: #1d4ed8;
}

.batch-add-btn .btn-icon {
  font-size: 14px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 24px;
}

.pagination-text {
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
}

.pagination-text:hover {
  color: #2563eb;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
}

.page-number.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.page-number:hover:not(.active) {
  background: #f1f5f9;
}

/* Scrollbar styling */
.results-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.results-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.results-scroll-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.results-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
