<script setup lang="ts">
import { ref } from 'vue';
import {
  Search,
  Building2,
  Plus,
  ChevronDown,
  FolderPlus,
  Upload,
  Link,
  ClipboardPaste
} from 'lucide-vue-next';
import FileItem from './components/FileItem.vue';
import type { SourceFile, Folder } from './types';

defineProps<{
  folders: Folder[];
  files: SourceFile[];
}>();

const emit = defineEmits<{
  fileClick: [file: SourceFile];
}>();

const searchQuery = ref('');
const showAddMenu = ref(false);

const handleSearch = () => {
  console.log('Searching:', searchQuery.value);
};
</script>

<template>
  <div class="source-file-list">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon-circle">
          <Building2 :size="24" color="#3b82f6" />
        </div>
        <h1 class="page-title">企业素材库</h1>
      </div>
      <div class="add-file-wrapper">
        <button class="add-file-btn" @click="showAddMenu = !showAddMenu">
          <Plus :size="18" stroke-width="2.5" />
          <span>添加文件</span>
          <ChevronDown :size="16" stroke-width="2.5" />
        </button>
        <div v-if="showAddMenu" class="add-menu">
          <div class="menu-item">
            <FolderPlus :size="16" />
            <span>新建文件夹</span>
          </div>
          <div class="menu-item">
            <Upload :size="16" />
            <span>本地上传</span>
          </div>
          <div class="menu-item">
            <Link :size="16" />
            <span>网址导入</span>
          </div>
          <div class="menu-item">
            <Search :size="16" />
            <span>搜索添加</span>
          </div>
          <div class="menu-item">
            <ClipboardPaste :size="16" />
            <span>文本粘贴</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <Search :size="18" class="search-icon" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索文件名、文件夹名称"
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </div>

    <!-- Folders -->
    <div class="folders-grid">
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="folder-item"
      >
        <div class="folder-icon-wrapper">
          <svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 0C1.11929 0 0 1.11929 0 2.5V45.5C0 46.8807 1.11929 48 2.5 48H57.5C58.8807 48 60 46.8807 60 45.5V10.5C60 9.11929 58.8807 8 57.5 8H31L23 0H2.5Z" fill="#F59E0B"/>
            <path d="M60 45.5C60 46.8807 58.8807 48 57.5 48H2.5C1.11929 48 0 46.8807 0 45.5V14.5C0 13.1193 1.11929 12 2.5 12H57.5C58.8807 12 60 13.1193 60 14.5V45.5Z" fill="#FCD34D"/>
          </svg>
        </div>
        <span class="folder-name">{{ folder.name }}</span>
      </div>
    </div>

    <!-- Files List -->
    <div class="files-list">
      <FileItem
        v-for="file in files"
        :key="file.id"
        :file="file"
        @click="emit('fileClick', file)"
      />
    </div>
  </div>
</template>

<style scoped>
.source-file-list {
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.3px;
}

.add-file-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  transition: background 0.2s;
}

.add-file-btn:hover {
  background: #1d4ed8;
}

.add-file-wrapper {
  position: relative;
}

.add-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  min-width: 160px;
  z-index: 10;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item svg {
  color: #6b7280;
}

.search-bar {
  display: flex;
  align-items: center;
  height: 48px;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 0 4px 0 16px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.search-icon {
  color: #3b82f6;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 15px;
  color: #374151;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  height: 40px;
  padding: 0 24px;
  background: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 32px 16px;
  margin-bottom: 40px;
}

.folder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.15s;
}

.folder-item:hover {
  transform: translateY(-2px);
}

.folder-name {
  font-size: 13px;
  color: #4b5563;
  text-align: center;
  width: 100%;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  width: 100%;
}
</style>
