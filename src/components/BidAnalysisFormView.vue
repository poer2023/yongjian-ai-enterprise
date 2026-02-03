<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileSearch,
  Bell,
  FileText,
  Search,
  Upload,
  Flame,
  X
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Get project info from query params if coming from bid list
const projectTitle = ref(route.query.title as string || '');
const preloadedFileName = ref(route.query.fileName as string || '');

// 只支持上传一套招标文件
const uploadedFile = ref<File | null>(null);
const additionalInfo = ref('');
const maxLength = 5000;

const templateTypes = [
  { icon: FileSearch, label: '标讯解读', active: true },
  { icon: Bell, label: '标讯订阅' },
  { icon: FileText, label: 'AI标书生成' },
];

const recentTools = [
  { icon: FileSearch, label: '标讯解读' },
  { icon: FileText, label: 'AI标书生成' },
  { icon: Bell, label: '标讯订阅' },
];

const features = [
  '招标文件智能解析',
  '九大模块结构化提取',
  '企业素材库自动匹配',
  '投标可行性评估',
  '下一步行动计划生成',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0];
    target.value = '';
  }
};

const removeFile = () => {
  uploadedFile.value = null;
};

const clearAdditionalInfo = () => {
  additionalInfo.value = '';
};

const handleSubmit = () => {
  const formData = {
    additionalInfo: additionalInfo.value,
    fileName: uploadedFile.value?.name || ''
  };
  console.log('Submitting:', formData);

  router.push({
    name: 'bid-analysis-result',
    query: {
      fileName: uploadedFile.value?.name || ''
    }
  });
};
</script>

<template>
  <div class="review-form-page">
    <!-- Left Sidebar -->
    <aside class="template-sidebar">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回应用市场</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索投标工具" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">最近使用</div>
        <div
          v-for="(item, index) in recentTools"
          :key="index"
          class="template-item"
          :class="{ active: index === 0 }"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
          <Flame v-if="index === 0" :size="14" class="hot-icon" />
        </div>
      </div>
    </aside>

    <!-- Main Form Area -->
    <main class="form-main">
      <div class="form-header">
        <div class="form-icon">
          <FileSearch :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">标讯解读</h1>
          <p class="form-subtitle">AI智能解析招标文件，快速提取关键信息</p>
        </div>
      </div>

      <div class="form-content">
        <!-- File Upload -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 上传招标文件
          </label>
          <p class="upload-tip">请上传完整的一套招标文件，AI将进行精准解读分析</p>
          <label v-if="!uploadedFile" class="upload-area">
            <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" hidden />
            <Upload :size="32" />
            <div class="upload-text">
              <span class="upload-main">点击上传招标文件</span>
              <span class="upload-hint">支持 PDF、Word 格式，仅限上传 1 份完整招标文件</span>
            </div>
          </label>
          <!-- Uploaded file display -->
          <div v-else class="uploaded-file-card">
            <div class="file-info">
              <FileText :size="24" class="file-icon" />
              <div class="file-details">
                <span class="file-name">{{ uploadedFile.name }}</span>
                <span class="file-size">{{ (uploadedFile.size / 1024 / 1024).toFixed(2) }} MB</span>
              </div>
            </div>
            <button class="remove-file-btn" @click="removeFile">
              <X :size="18" />
            </button>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="form-group">
          <label class="form-label">辅助信息</label>
          <div class="textarea-wrapper">
            <textarea
              v-model="additionalInfo"
              class="info-textarea"
              :maxlength="maxLength"
              placeholder="建议输入清晰准确的审查要求，如：企业资质情况、重点关注条款、投标预算范围、竞争对手信息等（非必填）"
            ></textarea>
            <button v-if="additionalInfo" class="clear-btn" @click="clearAdditionalInfo">清空</button>
            <span class="char-count">{{ additionalInfo.length }} / {{ maxLength }}</span>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit">
            提交
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Area -->
    <aside class="info-sidebar">
      <div class="info-icon-wrapper">
        <FileSearch :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">标讯解读</h3>
      <p class="info-desc">AI快速解析招标文件，助您精准把握投标要点</p>
      <ul class="feature-list">
        <li v-for="(feature, index) in features" :key="index">
          <span class="bullet">●</span>
          {{ feature }}
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.review-form-page {
  display: flex;
  height: 100%;
  background: #f8fafc;
}

.template-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #eff6ff;
  border: none;
  border-radius: 8px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dbeafe;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.search-icon {
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #475569;
}

.search-input::placeholder {
  color: #94a3b8;
}

.template-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 12px;
  color: #94a3b8;
  padding: 12px 0 8px 0;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  background: #f8fafc;
}

.template-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.template-item.active .item-icon {
  color: #2563eb;
}

.hot-icon {
  color: #f97316;
  margin-left: auto;
}

.form-main {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -24px -32px 32px -32px;
  padding: 20px 32px;
  background: #eff6ff;
}

.form-icon {
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  margin: 0;
}

.form-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.form-content {
  max-width: 100%;
  padding-right: 40px;
}

.form-group {
  margin-bottom: 28px;
  position: relative;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
  margin-right: 2px;
}

.upload-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-bottom: 40px;
}

.submit-btn {
  width: 280px;
  padding: 14px 48px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background: #1d4ed8;
}

.upload-tip {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

/* Upload Area */
.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  color: #64748b;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

/* Uploaded file card */
.uploaded-file-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.uploaded-file-card .file-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.uploaded-file-card .file-icon {
  color: #3b82f6;
}

.uploaded-file-card .file-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.uploaded-file-card .file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.uploaded-file-card .file-size {
  font-size: 12px;
  color: #64748b;
}

.uploaded-file-card .remove-file-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.uploaded-file-card .remove-file-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}

.upload-text {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}

.upload-main {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.upload-count {
  font-weight: 400;
  color: #64748b;
  font-size: 13px;
}

/* Uploaded files list */
.uploaded-files-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
}

.uploaded-file-item .file-name {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-file-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.textarea-wrapper {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.info-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  padding-bottom: 32px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

.info-textarea::placeholder {
  color: #94a3b8;
}

.textarea-wrapper:focus-within {
  border-color: #2563eb;
}

.clear-btn {
  position: absolute;
  right: 50px;
  bottom: 8px;
  padding: 2px 8px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #2563eb;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 13px;
  color: #94a3b8;
}

/* Right Info Sidebar */
.info-sidebar {
  width: 260px;
  padding: 40px 24px;
  background: transparent;
  border-left: 1px solid #e2e8f0;
}

.info-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.info-main-icon {
  color: white;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.info-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  padding: 6px 0;
  line-height: 1.4;
}

.bullet {
  color: #2563eb;
  font-size: 8px;
  margin-top: 5px;
}
</style>
