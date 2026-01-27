<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileSearch,
  Bell,
  FileText,
  Search,
  Upload
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const focusPoints = ref<string[]>(['资质要求']);
const uploadedFile = ref<File | null>(null);

const focusOptions = [
  { value: '资质要求', label: '资质要求' },
  { value: '评分标准', label: '评分标准' },
  { value: '时间节点', label: '时间节点' },
  { value: '技术要求', label: '技术要求' },
  { value: '商务条款', label: '商务条款' },
  { value: '投标保证金', label: '投标保证金' },
];

const templateTypes = [
  { icon: FileSearch, label: '标讯解读', active: true },
  { icon: Bell, label: '标讯订阅' },
  { icon: FileText, label: '标书生成' },
];

const features = [
  '招标文件智能解析',
  '资质要求自动提取',
  '评分标准结构化展示',
  '时间节点自动汇总',
  '我方匹配度快速分析',
];

const goBack = () => {
  router.push({ name: 'bid-center' });
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0];
  }
};

const toggleFocus = (value: string) => {
  const index = focusPoints.value.indexOf(value);
  if (index > -1) {
    focusPoints.value.splice(index, 1);
  } else {
    focusPoints.value.push(value);
  }
};

const handleSubmit = () => {
  const formData = {
    focusPoints: focusPoints.value,
    file: uploadedFile.value?.name
  };
  console.log('Submitting:', formData);

  router.push({
    name: 'bid-analysis-result',
    query: {
      file: uploadedFile.value?.name
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
        <span>返回标讯中心</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索投标工具" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">投标工具</div>
        <div
          v-for="(item, index) in templateTypes"
          :key="index"
          class="template-item"
          :class="{ active: item.active }"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
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
          <div class="template-upload-cards">
            <label class="upload-card">
              <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" hidden />
              <div class="card-icon upload-icon">
                <Upload :size="24" />
              </div>
              <div class="card-title">点击上传招标文件</div>
              <div class="card-subtitle">支持PDF、Word格式</div>
              <span v-if="uploadedFile" class="uploaded-file-name">{{ uploadedFile.name }}</span>
            </label>
          </div>
        </div>

        <!-- Focus Points -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 关注重点（可多选）
          </label>
          <div class="option-selector three-col">
            <button
              v-for="option in focusOptions"
              :key="option.value"
              class="option-btn"
              :class="{ active: focusPoints.includes(option.value) }"
              @click="toggleFocus(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit">
            开始解读
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-card">
        <div class="info-icon">📋</div>
        <h3 class="info-title">标讯解读</h3>
        <p class="info-desc">AI快速解析招标文件，助您精准把握投标要点</p>
        <ul class="feature-list">
          <li v-for="(feature, index) in features" :key="index">
            <span class="bullet">●</span>
            {{ feature }}
          </li>
        </ul>
      </div>
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #eff6ff;
  border: none;
  border-radius: 6px;
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
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.search-icon {
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  color: #475569;
}

.template-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 12px;
  color: #94a3b8;
  padding: 8px 0 4px 0;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  background: #f1f5f9;
}

.template-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
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
  margin-bottom: 32px;
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
  color: #1e293b;
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
  margin-bottom: 24px;
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
  color: #2563eb;
  margin-right: 2px;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-bottom: 40px;
}

.submit-btn {
  width: 200px;
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

.option-selector {
  display: flex;
  gap: 12px;
}

.option-selector.three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.option-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.option-btn.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.template-upload-cards {
  display: flex;
  gap: 16px;
}

.upload-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  min-height: 140px;
}

.upload-card:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.upload-icon {
  background: #eff6ff;
  color: #2563eb;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.uploaded-file-name {
  margin-top: 8px;
  font-size: 12px;
  color: #22c55e;
}

.info-sidebar {
  width: 280px;
  padding: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.info-icon {
  font-size: 48px;
  margin-bottom: 16px;
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
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  padding: 6px 0;
}

.bullet {
  color: #2563eb;
  font-size: 8px;
}
</style>
