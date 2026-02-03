<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileText,
  Bell,
  FileSearch,
  Search,
  Upload,
  HelpCircle,
  Flame
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const bidFile = ref<File | null>(null);
const selectedCompany = ref('company1');
const bidDocType = ref('comprehensive');
const outlineMode = ref('ai');
const focusMode = ref('auto');
const additionalInfo = ref('');
const maxLength = 2000;

const recentTools = [
  { icon: FileText, label: 'AI标书生成', active: true },
  { icon: FileSearch, label: '标讯解读', active: false },
  { icon: Bell, label: '标讯订阅', active: false },
];

const companyOptions = [
  { key: 'company1', label: 'XX科技有限公司' },
  { key: 'company2', label: 'XX安全技术有限公司' },
];

const bidDocTypes = [
  { key: 'technical', icon: '技', label: '技术标' },
  { key: 'commercial', icon: '商', label: '商务标' },
  { key: 'comprehensive', icon: '综', label: '综合标' },
];

const outlineModes = [
  { key: 'ai', label: 'AI智能' },
  { key: 'custom', label: '指定大纲' },
];

const focusModes = [
  { key: 'auto', label: 'AI智能' },
  { key: 'manual', label: '手动指定' },
];

const features = [
  '智能解析招标文件要求',
  '自动匹配企业资质与业绩',
  '响应评分点生成技术方案',
  '废标项自动检查提醒',
  '一键生成完整投标文件',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

const handleBidFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    bidFile.value = target.files[0];
  }
};

const clearAdditionalInfo = () => {
  additionalInfo.value = '';
};

const handleSubmit = () => {
  router.push({
    name: 'bid-doc-generating',
    query: {
      company: selectedCompany.value,
      type: bidDocType.value,
    },
  });
};
</script>

<template>
  <div class="form-page">
    <!-- Left Sidebar -->
    <aside class="template-sidebar">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回智能体应用市场</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索其他智能体" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">最近使用</div>
        <div
          v-for="(item, index) in recentTools"
          :key="index"
          class="template-item"
          :class="{ active: item.active }"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
          <Flame v-if="item.active" :size="14" class="hot-icon" />
        </div>
      </div>
    </aside>

    <!-- Main Form Area -->
    <main class="form-main">
      <div class="form-header">
        <div class="form-icon">
          <FileText :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">AI标书生成</h1>
          <p class="form-subtitle">智能解析招标文件，一键生成规范标书</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 招标文件上传 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 招标文件
            <HelpCircle :size="14" class="help-icon" />
          </label>
          <div class="upload-wrapper">
            <label class="upload-area">
              <input type="file" @change="handleBidFileUpload" accept=".pdf,.doc,.docx" hidden />
              <Upload :size="20" class="upload-icon" />
              <span class="upload-text">{{ bidFile ? bidFile.name : '点击上传招标文件（PDF/Word）' }}</span>
            </label>
          </div>
        </div>

        <!-- 投标主体 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 投标主体
          </label>
          <div class="select-wrapper">
            <select v-model="selectedCompany" class="form-select">
              <option v-for="company in companyOptions" :key="company.key" :value="company.key">
                {{ company.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- 标书类型 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 标书类型
            <HelpCircle :size="14" class="help-icon" />
          </label>
          <div class="icon-cards three-col">
            <div
              v-for="type in bidDocTypes"
              :key="type.key"
              class="icon-card"
              :class="{ active: bidDocType === type.key }"
              @click="bidDocType = type.key"
            >
              <span class="card-icon">{{ type.icon }}</span>
              <span class="card-label">{{ type.label }}</span>
            </div>
          </div>
        </div>

        <!-- 生成大纲 -->
        <div class="form-group">
          <label class="form-label">
            生成大纲
            <HelpCircle :size="14" class="help-icon" />
          </label>
          <div class="toggle-cards two-col">
            <div
              v-for="mode in outlineModes"
              :key="mode.key"
              class="toggle-card"
              :class="{ active: outlineMode === mode.key }"
              @click="outlineMode = mode.key"
            >
              {{ mode.label }}
            </div>
          </div>
        </div>

        <!-- 素材匹配 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 素材匹配
            <HelpCircle :size="14" class="help-icon" />
          </label>
          <div class="toggle-cards two-col">
            <div
              v-for="mode in focusModes"
              :key="mode.key"
              class="toggle-card"
              :class="{ active: focusMode === mode.key }"
              @click="focusMode = mode.key"
            >
              {{ mode.label }}
            </div>
          </div>
        </div>

        <!-- 辅助信息 -->
        <div class="form-group">
          <label class="form-label">辅助信息</label>
          <div class="textarea-wrapper">
            <textarea
              v-model="additionalInfo"
              class="form-textarea"
              :maxlength="maxLength"
              placeholder="请输入需要在标书中强调的内容，如：重点突出的技术优势、需要规避的竞争对手等（非必填）"
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

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-icon-wrapper">
        <FileText :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">AI标书生成</h3>
      <p class="info-desc">智能解析招标文件，一键生成规范标书</p>
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
.form-page {
  display: flex;
  height: 100%;
  background: #f8fafc;
}

/* Left Sidebar */
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

/* Main Form Area */
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
  /* Auto-fill content area */
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 10px;
}

.required {
  color: #ef4444;
}

.help-icon {
  color: #94a3b8;
  cursor: help;
}

/* Upload Area */
.upload-wrapper {
  width: 100%;
}

.upload-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #2563eb;
}

.upload-icon {
  color: #94a3b8;
}

.upload-text {
  font-size: 14px;
  color: #94a3b8;
}

/* Select */
.select-wrapper {
  width: 100%;
}

.form-select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  background: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.form-select:focus {
  border-color: #2563eb;
}

/* Toggle Cards */
.toggle-cards {
  display: grid;
  gap: 12px;
}

.toggle-cards.two-col {
  grid-template-columns: repeat(2, 1fr);
}

.toggle-card {
  padding: 14px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #475569;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.toggle-card.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
  font-weight: 500;
}

/* Icon Cards - 带图标的卡片 */
.icon-cards {
  display: grid;
  gap: 12px;
}

.icon-cards.three-col {
  grid-template-columns: repeat(3, 1fr);
}

.icon-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.icon-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.card-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.icon-card.active .card-icon {
  background: #dbeafe;
  color: #2563eb;
}

.card-label {
  font-size: 14px;
  color: #475569;
}

.icon-card.active .card-label {
  color: #2563eb;
  font-weight: 500;
}

/* Textarea */
.textarea-wrapper {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.textarea-wrapper:focus-within {
  border-color: #2563eb;
}

.form-textarea {
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  padding-bottom: 32px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

.form-textarea::placeholder {
  color: #94a3b8;
}

.clear-btn {
  position: absolute;
  right: 60px;
  bottom: 10px;
  padding: 2px 8px;
  border: none;
  background: transparent;
  color: #94a3b8;
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
  bottom: 10px;
  font-size: 13px;
  color: #94a3b8;
}

/* Submit */
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
