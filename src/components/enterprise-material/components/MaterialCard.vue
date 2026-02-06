<script setup lang="ts">
import { Image, FileType, FileText, Pencil, Trash2 } from 'lucide-vue-next';
import type { Material } from '../types';

const props = defineProps<{
  material: Material;
}>();

const emit = defineEmits<{
  delete: [materialId: string];
  navigate: [pageRange: string];
  'update:name': [value: string];
}>();

const handleNameInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:name', target.value);
};

const handleNavigate = () => {
  if (props.material.pageRange) {
    emit('navigate', props.material.pageRange);
  }
};
</script>

<template>
  <div class="material-item" @click="handleNavigate">
    <div class="material-header">
      <span class="page-tag">{{ material.pageRange || '—' }}</span>
      <span class="type-tag" :class="material.contentType">
        <Image v-if="material.contentType === 'image'" :size="12" />
        <FileType v-else-if="material.contentType === 'text'" :size="12" />
        <FileText v-else :size="12" />
        {{ material.contentType === 'image' ? '图片' : material.contentType === 'text' ? '文本' : '混合' }}
      </span>
      <button class="delete-material-btn" @click.stop="emit('delete', material.id)" title="删除素材">
        <Trash2 :size="14" />
      </button>
    </div>
    <div class="material-title-row">
      <input
        type="text"
        class="material-title-input"
        :value="material.name"
        @input="handleNameInput"
        @click.stop
        placeholder="输入素材标题..."
      />
      <Pencil :size="14" class="title-edit-icon" />
    </div>
    <!-- Image type: show simulated thumbnail -->
    <div v-if="material.contentType === 'image'" class="material-thumbnail" @click.stop>
      <div class="thumbnail-doc">
        <div class="doc-header">{{ material.name.includes('营业执照') ? '营业执照' : material.name.includes('ISO') ? '认证证书' : material.name.includes('高新') ? '高新企业证书' : '软件著作权' }}</div>
        <div class="doc-content">
          <div class="doc-line"></div>
          <div class="doc-line short"></div>
          <div class="doc-line"></div>
          <div class="doc-line medium"></div>
        </div>
        <div class="doc-stamp">
          <span>公章</span>
        </div>
      </div>
    </div>
    <!-- Text type: show editable text -->
    <div v-else class="material-body" contenteditable="true" @click.stop>{{ material.fullText || material.summary }}</div>
  </div>
</template>

<style scoped>
.material-item {
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}

.material-item:last-child {
  border-bottom: none;
}

.material-header {
  margin-bottom: 10px;
}

.page-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
  padding: 0 8px;
  background: #3b82f6;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}

.type-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  height: 24px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  margin-left: 8px;
}

.type-tag.image {
  background: #fef3c7;
  color: #b45309;
}

.type-tag.text {
  background: #dcfce7;
  color: #15803d;
}

.type-tag.mixed {
  background: #e0e7ff;
  color: #4338ca;
}

.material-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 12px;
  padding: 10px 14px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.15s;
}

.material-title-row:hover {
  border-color: #3b82f6;
}

.material-title-row:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.material-title-input {
  flex: 1;
  padding: 0;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  background: transparent;
  outline: none;
}

.material-title-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.title-edit-icon {
  color: #9ca3af;
  flex-shrink: 0;
  transition: color 0.15s;
}

.material-title-row:hover .title-edit-icon {
  color: #3b82f6;
}

.material-thumbnail {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #f8fafc;
}

.thumbnail-doc {
  width: 80px;
  height: 110px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  flex-shrink: 0;
}

.doc-header {
  font-size: 8px;
  font-weight: 700;
  color: #dc2626;
  text-align: center;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.doc-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-line {
  height: 3px;
  background: #e5e7eb;
  border-radius: 1px;
}

.doc-line.short {
  width: 60%;
}

.doc-line.medium {
  width: 80%;
}

.doc-stamp {
  width: 24px;
  height: 24px;
  border: 2px solid #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  margin-top: 4px;
}

.doc-stamp span {
  font-size: 6px;
  color: #dc2626;
  font-weight: 600;
}

.material-body {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.9;
  white-space: pre-wrap;
  outline: none;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: #f8fafc;
  transition: all 0.15s;
  cursor: text;
}

.material-body:focus {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.delete-material-btn {
  margin-left: auto;
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

.delete-material-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}
</style>
