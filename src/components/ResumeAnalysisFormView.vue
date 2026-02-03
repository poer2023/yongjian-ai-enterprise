<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileUser,
  UserCheck,
  DollarSign,
  Search,
  Upload,
  Flame,
  X
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data - support multiple resumes (max 50)
const uploadedResumes = ref<File[]>([]);
const maxResumes = 50;
const selectedPosition = ref('');
const positionRequirements = ref('');
const requirementsMaxLength = 1000;

const recentTools = [
  { icon: UserCheck, label: 'Boss招聘' },
  { icon: FileUser, label: '简历分析' },
  { icon: DollarSign, label: '薪酬调查' },
];

const features = [
  '智能解析简历关键信息',
  '岗位匹配度精准评估',
  '自动生成面试问题建议',
  '候选人优劣势深度分析',
  '多维度人才画像呈现',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

const handleResumeUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const newFiles = Array.from(target.files);
    const remainingSlots = maxResumes - uploadedResumes.value.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);
    uploadedResumes.value = [...uploadedResumes.value, ...filesToAdd];
    target.value = ''; // Reset input for re-upload
  }
};

const removeResume = (index: number) => {
  uploadedResumes.value.splice(index, 1);
};

const handleSubmit = () => {
  router.push({
    name: 'resume-analysis-result',
    query: {
      position: selectedPosition.value,
      fileCount: uploadedResumes.value.length
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
          :class="{ active: index === 1 }"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
          <Flame v-if="index === 1" :size="14" class="hot-icon" />
        </div>
      </div>
    </aside>

    <!-- Main Form Area -->
    <main class="form-main">
      <div class="form-header">
        <div class="form-icon">
          <FileUser :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">简历分析</h1>
          <p class="form-subtitle">AI智能解析简历，精准匹配岗位需求</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 上传简历 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 上传简历
            <span class="upload-count">（{{ uploadedResumes.length }}/{{ maxResumes }}）</span>
          </label>
          <label class="upload-area" :class="{ 'has-files': uploadedResumes.length > 0 }">
            <input type="file" @change="handleResumeUpload" accept=".pdf,.doc,.docx" hidden multiple />
            <Upload :size="32" />
            <div class="upload-text">
              <span class="upload-main">点击上传候选人简历</span>
              <span class="upload-hint">支持 PDF、Word 格式，最多上传 {{ maxResumes }} 份</span>
            </div>
          </label>
          <!-- Uploaded files list -->
          <div v-if="uploadedResumes.length > 0" class="uploaded-files-list">
            <div v-for="(file, index) in uploadedResumes" :key="index" class="uploaded-file-item">
              <FileUser :size="14" />
              <span class="file-name">{{ file.name }}</span>
              <button class="remove-file-btn" @click="removeResume(index)">
                <X :size="14" />
              </button>
            </div>
          </div>
        </div>

        <!-- 目标岗位 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 目标岗位
          </label>
          <input
            v-model="selectedPosition"
            type="text"
            class="position-input"
            placeholder="请输入目标岗位名称，如：项目经理、安全工程师等"
          />
        </div>

        <!-- 岗位要求描述 -->
        <div class="form-group">
          <label class="form-label">岗位要求描述</label>
          <div class="textarea-wrapper">
            <textarea
              v-model="positionRequirements"
              class="info-textarea"
              :maxlength="requirementsMaxLength"
              placeholder="请输入该岗位的具体要求，如：学历要求、工作经验、专业技能、证书要求等"
            ></textarea>
            <span class="char-count">{{ positionRequirements.length }} / {{ requirementsMaxLength }}</span>
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
        <FileUser :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">简历分析</h3>
      <p class="info-desc">AI智能解析简历，快速评估候选人与岗位的匹配度</p>
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
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
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

.upload-file {
  margin-top: 12px;
  padding: 6px 12px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 13px;
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

/* Position Input */
.position-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: border-color 0.2s;
}

.position-input:focus {
  border-color: #2563eb;
}

.position-input::placeholder {
  color: #94a3b8;
}

/* Textarea */
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

.char-count {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 13px;
  color: #94a3b8;
}

/* Length Cards (for position selections) */
.length-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.length-card {
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

.length-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.length-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.len-icon {
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

.length-card.active .len-icon {
  background: #dbeafe;
  color: #2563eb;
}

.len-label {
  font-size: 14px;
  color: #475569;
}

.length-card.active .len-label {
  color: #2563eb;
  font-weight: 500;
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
