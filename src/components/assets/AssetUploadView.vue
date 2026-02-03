<script setup lang="ts">
import { ref } from 'vue';
import { Upload, FileText, Image, X } from 'lucide-vue-next';

interface UploadFile {
  id: number;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'done' | 'error';
}

const fileList = ref<UploadFile[]>([]);

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  console.log('文件拖放上传', e.dataTransfer?.files);
};

const handleFileSelect = () => {
  console.log('选择文件');
};

const removeFile = (id: number) => {
  fileList.value = fileList.value.filter(f => f.id !== id);
};
</script>

<template>
  <div class="asset-upload-view">
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <Upload :size="24" />
          </div>
          <div class="header-text">
            <h1 class="page-title">添加素材</h1>
            <p class="page-subtitle">上传企业资质、证书、项目案例等素材文件</p>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="main-card">
        <!-- Upload Area -->
        <div
          class="upload-area"
          @drop="handleDrop"
          @dragover.prevent
          @click="handleFileSelect"
        >
          <div class="upload-icon">
            <Upload :size="48" />
          </div>
          <p class="upload-title">拖放文件到此处，或点击选择文件</p>
          <p class="upload-hint">支持 PDF、Word、图片等格式，单个文件不超过 50MB</p>
        </div>

        <!-- File List -->
        <div v-if="fileList.length > 0" class="file-list">
          <div v-for="file in fileList" :key="file.id" class="file-item">
            <div class="file-icon">
              <FileText v-if="file.type === 'document'" :size="20" />
              <Image v-else :size="20" />
            </div>
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
            </div>
            <button class="remove-btn" @click="removeFile(file.id)">
              <X :size="16" />
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>暂无已上传的文件</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-upload-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 24px 32px;
  background: #f8fafc;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #3b82f6;
  border-radius: 12px;
  padding: 24px 32px;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 0.3px;
}

.page-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.main-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  padding: 24px;
}

.upload-area {
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.upload-icon {
  color: #94a3b8;
  margin-bottom: 16px;
}

.upload-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.upload-hint {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.file-list {
  margin-top: 24px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;
}

.file-icon {
  color: #3b82f6;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.file-size {
  font-size: 12px;
  color: #94a3b8;
}

.remove-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
}
</style>
