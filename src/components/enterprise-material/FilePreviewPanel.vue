<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowLeft,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-vue-next';
import type { FilePreview, SourceFile, SourcePreviewEvidence } from './types';

const props = defineProps<{
  selectedFile: SourceFile;
  filePreview: FilePreview | null;
  focusedPreview: SourcePreviewEvidence | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const currentPage = ref(1);
const zoomLevel = ref(100);
const fallbackPreview = computed(() => (!props.filePreview ? props.focusedPreview : null));

const totalPages = computed(() => {
  if (props.filePreview?.totalPages) return props.filePreview.totalPages;
  if (props.filePreview?.pages) {
    const pageNumbers = Object.keys(props.filePreview.pages).map((value) => Number(value));
    if (pageNumbers.length > 0) return Math.max(...pageNumbers);
  }
  return 1;
});

const currentPageContent = computed(() => {
  if (!props.filePreview) return [];
  return props.filePreview.pages?.[currentPage.value] ?? props.filePreview.content;
});

// Expose currentPage for parent component
defineExpose({
  setCurrentPage: (page: number) => {
    currentPage.value = page;
  }
});
</script>

<template>
  <div class="file-preview-panel">
    <!-- White header bar -->
    <div class="file-preview-header">
      <button class="back-btn" @click="emit('close')">
        <ArrowLeft :size="18" />
      </button>
      <div class="preview-file-info">
        <span class="preview-file-name">{{ selectedFile.name }}</span>
      </div>
    </div>

    <!-- File content preview -->
    <div class="file-preview-content">
      <div v-if="filePreview" class="preview-document">
        <div class="document-page">
          <div
            v-for="(line, index) in currentPageContent"
            :key="index"
            class="document-line"
            :class="{
              'empty-line': line === '',
              'title-line': index === 0 && selectedFile.id <= 3,
              'red-title': line.includes('委员会') || line.includes('证书') || line.includes('执照') || line.includes('汇编') || line.includes('简介') || line.includes('案例集') || line.includes('手册'),
              'doc-number': line.includes('编号') || line.includes('登记号')
            }"
          >{{ line || '\u00A0' }}</div>
        </div>
      </div>
      <div v-else-if="fallbackPreview" class="preview-document">
        <div class="document-page">
          <div class="evidence-header">
            <div class="evidence-title">{{ fallbackPreview.title }}</div>
            <div v-if="fallbackPreview.subtitle || fallbackPreview.pageLabel" class="evidence-meta">
              {{ [fallbackPreview.subtitle, fallbackPreview.pageLabel].filter(Boolean).join(' · ') }}
            </div>
          </div>

          <div v-if="fallbackPreview.imageDataUrl" class="evidence-image-wrap">
            <img class="evidence-image" :src="fallbackPreview.imageDataUrl" :alt="fallbackPreview.title">
          </div>

          <template v-else-if="fallbackPreview.content?.length">
            <div
              v-for="(line, index) in fallbackPreview.content"
              :key="`${fallbackPreview.title}-${index}`"
              class="document-line"
              :class="{
                'empty-line': line === '',
                'evidence-heading-line': index === 0
              }"
            >{{ line || '\u00A0' }}</div>
          </template>
        </div>
      </div>
      <div v-else class="preview-placeholder">
        <FileText :size="48" stroke-width="1" />
        <p>文件原文预览区域</p>
        <span class="preview-hint">此处展示 PDF/Word 文件内容</span>
      </div>
    </div>

    <!-- Pagination - fixed at bottom -->
    <div class="preview-pagination" v-if="filePreview">
      <button class="page-nav-btn" :disabled="currentPage <= 1" @click="currentPage--">
        <ChevronLeft :size="16" />
      </button>
      <div class="page-input-group">
        <input type="text" class="page-input" :value="currentPage" readonly />
        <span class="page-separator">/</span>
        <span class="total-pages">{{ totalPages }}</span>
      </div>
      <button class="page-nav-btn" @click="currentPage++">
        <ChevronRight :size="16" />
      </button>
      <div class="zoom-controls">
        <button class="zoom-btn" @click="zoomLevel = Math.max(50, zoomLevel - 10)">
          <ZoomOut :size="16" />
        </button>
        <span class="zoom-level">{{ zoomLevel }}%</span>
        <button class="zoom-btn" @click="zoomLevel = Math.min(200, zoomLevel + 10)">
          <ZoomIn :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.file-preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.back-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.back-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.preview-file-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-file-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.file-preview-content {
  flex: 1;
  background: #f5f5f5;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 24px;
}

.preview-document {
  width: 100%;
  max-width: 800px;
}

.document-page {
  background: #fff;
  border: none;
  border-radius: 0;
  padding: 60px 80px;
  min-height: 600px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  font-family: "SimSun", "宋体", serif;
}

.evidence-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.evidence-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.5;
  color: #0f172a;
}

.evidence-meta {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
}

.evidence-image-wrap {
  display: flex;
  justify-content: center;
}

.evidence-image {
  max-width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.document-line {
  font-size: 14px;
  line-height: 2;
  color: #1f2937;
  white-space: pre-wrap;
}

.document-line.evidence-heading-line {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.document-line.empty-line {
  height: 28px;
}

.document-line.title-line {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}

.document-line.red-title {
  color: #dc2626;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
}

.document-line.doc-number {
  font-family: "Times New Roman", serif;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
}

.preview-placeholder p {
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
}

.preview-hint {
  font-size: 13px;
}

.preview-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.page-nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.page-nav-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-input {
  width: 40px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
  color: #374151;
  background: white;
}

.page-separator {
  color: #9ca3af;
  font-size: 13px;
}

.total-pages {
  font-size: 13px;
  color: #374151;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #e5e7eb;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.zoom-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.zoom-level {
  font-size: 13px;
  color: #374151;
  min-width: 40px;
  text-align: center;
}
</style>
