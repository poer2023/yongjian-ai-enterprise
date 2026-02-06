<script setup lang="ts">
import { FileText, MoreHorizontal } from 'lucide-vue-next';
import type { SourceFile } from '../types';

defineProps<{
  file: SourceFile;
}>();

const emit = defineEmits<{
  click: [file: SourceFile];
}>();
</script>

<template>
  <div
    class="file-item-realign"
    :class="{ 'is-processing': file.status === 'processing' }"
    @click="emit('click', file)"
  >
    <div class="file-col-icon">
      <div class="pdf-badge">
        <span class="pdf-text">PDF</span>
      </div>
    </div>
    <div class="file-col-name" :title="file.name">{{ file.name }}</div>
    <div class="file-col-meta">{{ file.size }}</div>
    <div class="file-col-meta">{{ file.words }}</div>
    <div class="file-col-meta">{{ file.creator }}</div>
    <div class="file-col-actions">
      <button class="file-action-btn" @click.stop title="查看详情">
        <FileText :size="16" />
      </button>
      <button class="file-action-btn" @click.stop title="更多操作">
        <MoreHorizontal :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.file-item-realign {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid transparent;
  gap: 12px;
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.file-item-realign:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.file-item-realign.is-processing {
  opacity: 0.7;
}

.file-col-icon {
  width: 28px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.pdf-badge {
  width: 24px;
  height: 24px;
  background: #ef4444;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.pdf-text {
  font-size: 8px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}

.file-col-name {
  flex: 1;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 120px;
}

.file-col-meta {
  font-size: 13px;
  color: #9ca3af;
  white-space: nowrap;
}

.file-col-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.file-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s;
}

.file-action-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
