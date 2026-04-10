<script setup lang="ts">
import {
  AlertTriangle,
  CalendarClock,
  ChevronRight,
  Clock
} from 'lucide-vue-next';
import type { ExpiryAlertItem } from './types';

defineProps<{
  alerts: ExpiryAlertItem[];
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  selectAlert: [item: ExpiryAlertItem];
  goToPage: [page: number];
}>();
</script>

<template>
  <div class="expiry-section">
    <div class="expiry-list">
      <div
        v-for="item in alerts"
        :key="item.material.id"
        class="expiry-row"
        :class="`expiry-row-${item.level}`"
        @click="emit('selectAlert', item)"
      >
        <div class="expiry-row-main">
          <div class="expiry-row-top">
            <div class="row-title-wrap">
              <span class="expiry-level-dot" :class="`dot-${item.level}`"></span>
              <span class="row-title">{{ item.material.name }}</span>
            </div>
            <span class="expiry-alert-tag" :class="`tag-${item.level}`">
              <AlertTriangle v-if="item.level === 'expired' || item.level === 'week'" :size="12" />
              <Clock v-else-if="item.level === 'month'" :size="12" />
              <CalendarClock v-else :size="12" />
              {{ item.label }}
            </span>
          </div>

          <div class="row-meta">
            <span>{{ item.sourceFile?.name || '—' }}</span>
            <span>{{ item.material.pageRange || '未标注页码' }}</span>
          </div>
        </div>

        <ChevronRight :size="16" class="expiry-arrow" />
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="emit('goToPage', currentPage - 1)"
      >
        上一页
      </button>

      <div class="pagination-pages">
        <button
          v-for="page in totalPages"
          :key="page"
          class="pagination-page"
          :class="{ active: page === currentPage }"
          @click="emit('goToPage', page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="emit('goToPage', currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
.expiry-section {
  margin: 0;
}

.expiry-list {
  display: flex;
  flex-direction: column;
}

.expiry-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s ease;
}

.expiry-row:last-child {
  border-bottom: none;
}

.expiry-row:hover {
  background: #f8fafc;
}

.expiry-row-main {
  flex: 1;
  min-width: 0;
}

.expiry-row-top,
.row-title-wrap,
.row-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.expiry-row-top {
  justify-content: space-between;
  gap: 12px;
}

.row-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.row-meta {
  margin-top: 10px;
  font-size: 12px;
  color: #64748b;
}

.expiry-level-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-expired {
  background: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.14);
}

.dot-week {
  background: #ea580c;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.14);
}

.dot-month {
  background: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.14);
}

.dot-quarter {
  background: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.expiry-alert-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.tag-expired {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.tag-week {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.tag-month {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.tag-quarter {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.expiry-arrow {
  color: #cbd5e1;
  transition: color 0.15s ease;
}

.expiry-row:hover .expiry-arrow {
  color: #64748b;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn,
.pagination-page {
  height: 34px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pagination-btn:hover:not(:disabled),
.pagination-page:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.pagination-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 6px;
}

.pagination-page {
  min-width: 34px;
  padding: 0 10px;
}

.pagination-page.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

@media (max-width: 1180px) {
  .expiry-row-top {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 960px) {
  .pagination {
    flex-wrap: wrap;
  }

  .pagination-pages {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}
</style>
