<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileUser,
  UserCheck,
  DollarSign,
  Search,
  Upload
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedPosition = ref('');
const positionRequirements = ref('');
const uploadedResume = ref<File | null>(null);

const positionOptions = [
  '项目经理',
  '技术负责人',
  '质量工程师',
  '安全工程师',
  '造价工程师',
  '资料员',
  '其他'
];

const templateTypes = [
  { icon: FileUser, label: '简历分析', active: true },
  { icon: DollarSign, label: '薪酬调查' },
  { icon: UserCheck, label: 'Boss招聘' },
];

const features = [
  '智能解析简历关键信息',
  '岗位匹配度精准评估',
  '自动生成面试问题建议',
  '候选人优劣势深度分析',
  '多维度人才画像呈现',
];

const goBack = () => {
  router.push({ name: 'home' });
};

const handleResumeUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedResume.value = target.files[0];
  }
};

const handleSubmit = () => {
  const formData = {
    position: selectedPosition.value,
    requirements: positionRequirements.value,
    resume: uploadedResume.value?.name
  };
  console.log('Submitting:', formData);

  router.push({
    name: 'resume-analysis-result',
    query: {
      position: selectedPosition.value,
      file: uploadedResume.value?.name
    }
  });
};
</script>

<template>
  <div class="review-form-page">
    <!-- Left Sidebar: Template Types -->
    <aside class="template-sidebar">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回首页</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索HR工具" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">HR工具</div>
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
          <FileUser :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">简历分析</h1>
          <p class="form-subtitle">AI智能解析简历，精准匹配岗位需求</p>
        </div>
      </div>

      <div class="form-content">
        <!-- Resume Upload -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 上传简历
          </label>
          <div class="template-upload-cards">
            <label class="upload-card">
              <input type="file" @change="handleResumeUpload" accept=".pdf,.doc,.docx" hidden />
              <div class="card-icon upload-icon">
                <Upload :size="24" />
              </div>
              <div class="card-title">点击上传候选人简历</div>
              <div class="card-subtitle">支持PDF、Word格式</div>
              <span v-if="uploadedResume" class="uploaded-file-name">{{ uploadedResume.name }}</span>
            </label>
          </div>
        </div>

        <!-- Target Position -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 目标岗位
          </label>
          <div class="option-selector four-col">
            <button
              v-for="position in positionOptions.slice(0, 4)"
              :key="position"
              class="option-btn"
              :class="{ active: selectedPosition === position }"
              @click="selectedPosition = position"
            >
              {{ position }}
            </button>
          </div>
          <div class="option-selector three-col" style="margin-top: 12px;">
            <button
              v-for="position in positionOptions.slice(4)"
              :key="position"
              class="option-btn"
              :class="{ active: selectedPosition === position }"
              @click="selectedPosition = position"
            >
              {{ position }}
            </button>
          </div>
        </div>

        <!-- Position Requirements -->
        <div class="form-group">
          <label class="form-label">岗位要求描述</label>
          <textarea
            v-model="positionRequirements"
            class="form-textarea"
            placeholder="请输入该岗位的具体要求，如：学历要求、工作经验、专业技能、证书要求等"
            maxlength="1000"
            rows="6"
          ></textarea>
          <span class="char-count textarea-count">{{ positionRequirements.length }} / 1000</span>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit">
            开始分析
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-card">
        <div class="info-icon">📄</div>
        <h3 class="info-title">简历分析</h3>
        <p class="info-desc">AI智能解析简历，快速评估候选人与岗位的匹配度</p>
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

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
  transition: all 0.2s;
}

.form-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 12px;
  color: #94a3b8;
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
  background: #1e40af;
}

.option-selector {
  display: flex;
  gap: 12px;
}

.option-selector.three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.option-selector.four-col {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
