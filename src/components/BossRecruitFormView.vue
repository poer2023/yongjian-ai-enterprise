<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  UserCheck,
  FileUser,
  DollarSign,
  Search,
  HelpCircle,
  Flame
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const accountName = ref('');
const accountNameMaxLength = 50;
const selectedJdSource = ref('library');
const selectedJd = ref('');
const manualJobRequirements = ref('');
const greetingTemplate = ref('');
const greetingMaxLength = 200;
const experienceRange = ref('');
const dailyLimit = ref(50);

const recentTools = [
  { icon: UserCheck, label: 'Boss招聘' },
  { icon: FileUser, label: '简历分析' },
  { icon: DollarSign, label: '薪酬调查' },
];

const jdSourceOptions = [
  { key: 'library', icon: 'JD', label: '从JD知识库选择' },
  { key: 'manual', icon: '手', label: '手动输入要求' },
];

const jdOptions = [
  { value: 'java-dev', label: 'Java开发工程师' },
  { value: 'frontend-dev', label: '前端开发工程师' },
  { value: 'project-manager', label: '项目经理' },
  { value: 'security-engineer', label: '安全工程师' },
  { value: 'test-engineer', label: '测试工程师' },
];

const experienceOptions = [
  { key: '0-1', icon: '初', label: '0-1年' },
  { key: '1-3', icon: '1-3', label: '1-3年' },
  { key: '3-5', icon: '3-5', label: '3-5年' },
  { key: '5-10', icon: '5+', label: '5-10年' },
  { key: '10+', icon: '10+', label: '10年以上' },
];

const dailyLimitOptions = [
  { key: 30, icon: '30', label: '30次/天' },
  { key: 50, icon: '50', label: '50次/天（推荐）' },
];

const features = [
  'RPA自动化批量打招呼',
  '智能筛选条件精准匹配',
  'AI分析候选人匹配度',
  '简历自动收集整理',
  '账号风控智能监测',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

const handleSubmit = () => {
  router.push({
    name: 'boss-recruit-result',
    query: {
      account: accountName.value,
      job: selectedJd.value || '自定义岗位',
    },
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
          <UserCheck :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">Boss直聘招聘</h1>
          <p class="form-subtitle">智能RPA招聘助手，自动筛选简历打招呼</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 账号名称 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 账号名称
          </label>
          <div class="input-wrapper">
            <input
              v-model="accountName"
              type="text"
              class="form-input"
              :maxlength="accountNameMaxLength"
              placeholder="请输入Boss直聘账号名称"
            />
          </div>
        </div>

        <!-- 岗位来源 -->
        <div class="form-group">
          <label class="form-label">岗位来源</label>
          <div class="language-cards">
            <div
              v-for="opt in jdSourceOptions"
              :key="opt.key"
              class="language-card"
              :class="{ active: selectedJdSource === opt.key }"
              @click="selectedJdSource = opt.key"
            >
              <span class="lang-icon">{{ opt.icon }}</span>
              <span class="lang-label">{{ opt.label }}</span>
            </div>
          </div>
        </div>

        <!-- 选择岗位 -->
        <div v-if="selectedJdSource === 'library'" class="form-group">
          <label class="form-label">
            <span class="required">*</span> 选择岗位
          </label>
          <div class="select-wrapper">
            <select v-model="selectedJd" class="form-select">
              <option value="">请选择目标岗位</option>
              <option v-for="jd in jdOptions" :key="jd.value" :value="jd.value">
                {{ jd.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- 手动输入岗位要求 -->
        <div v-else class="form-group">
          <label class="form-label">
            <span class="required">*</span> 岗位要求
          </label>
          <div class="textarea-wrapper">
            <textarea
              v-model="manualJobRequirements"
              class="info-textarea"
              placeholder="请输入岗位的具体要求，包括技能要求、职责描述等"
            ></textarea>
          </div>
        </div>

        <!-- 打招呼话术模板 -->
        <div class="form-group">
          <label class="form-label">打招呼话术模板</label>
          <div class="textarea-wrapper">
            <textarea
              v-model="greetingTemplate"
              class="info-textarea"
              :maxlength="greetingMaxLength"
              placeholder="您好{候选人姓名}，我们正在招聘{岗位名称}，您的背景很符合，方便聊聊吗？"
            ></textarea>
            <span class="char-count">{{ greetingTemplate.length }} / {{ greetingMaxLength }}</span>
          </div>
          <div class="form-hint">支持变量：{候选人姓名}、{岗位名称}</div>
        </div>

        <!-- 工作年限要求 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 工作年限要求
          </label>
          <div class="length-cards">
            <div
              v-for="exp in experienceOptions"
              :key="exp.key"
              class="length-card"
              :class="{ active: experienceRange === exp.key }"
              @click="experienceRange = exp.key"
            >
              <span class="len-icon">{{ exp.icon }}</span>
              <span class="len-label">{{ exp.label }}</span>
            </div>
          </div>
        </div>

        <!-- 每日打招呼上限 -->
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span> 每日打招呼上限
          </label>
          <div class="language-cards">
            <div
              v-for="opt in dailyLimitOptions"
              :key="opt.key"
              class="language-card"
              :class="{ active: dailyLimit === opt.key }"
              @click="dailyLimit = opt.key"
            >
              <span class="lang-icon">{{ opt.icon }}</span>
              <span class="lang-label">{{ opt.label }}</span>
            </div>
          </div>
          <div class="form-hint warning">建议不超过50次/天，防止账号风控</div>
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
        <UserCheck :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">Boss直聘招聘</h3>
      <p class="info-desc">RPA自动化招聘助手，批量打招呼收简历</p>
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

.form-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 8px;
}

.form-hint.warning {
  color: #f59e0b;
}

/* Input wrapper */
.input-wrapper {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
}

.form-input::placeholder {
  color: #94a3b8;
}

.input-wrapper:focus-within {
  border-color: #2563eb;
}

/* Select wrapper */
.select-wrapper {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  background: transparent;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.select-wrapper:focus-within {
  border-color: #2563eb;
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
  min-height: 100px;
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

/* Language Cards (for 2-col selections) */
.language-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.language-card {
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

.language-card:hover:not(.active) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.language-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.lang-icon {
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

.language-card.active .lang-icon {
  background: #dbeafe;
  color: #2563eb;
}

.lang-label {
  font-size: 14px;
  color: #475569;
}

.language-card.active .lang-label {
  color: #2563eb;
  font-weight: 500;
}

/* Length Cards (for 3-col or 5-col selections) */
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
