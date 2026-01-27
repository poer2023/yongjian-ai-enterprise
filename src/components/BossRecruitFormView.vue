<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  UserCheck,
  FileUser,
  DollarSign,
  Search,
  Settings,
  Play,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// 账号配置
const accountName = ref('');
const cookies = ref('');
const accountStatus = ref<'online' | 'offline' | 'risk'>('offline');

// 岗位选择
const selectedJdSource = ref<'library' | 'manual'>('library');
const selectedJd = ref('');
const manualJobRequirements = ref('');

// RPA策略配置
const autoGreeting = ref(true);
const greetingTemplate = ref('您好{候选人姓名}，我们正在招聘{岗位名称}，您的背景很符合，方便聊聊吗？');
const experienceRange = ref<string[]>([]);
const educationRequirement = ref('');
const salaryMin = ref('');
const salaryMax = ref('');
const jobStatus = ref<string[]>([]);
const dailyLimit = ref(50);

// 模拟的JD库选项
const jdOptions = [
  { value: 'java-dev', label: 'Java开发工程师' },
  { value: 'frontend-dev', label: '前端开发工程师' },
  { value: 'project-manager', label: '项目经理' },
  { value: 'security-engineer', label: '安全工程师' },
  { value: 'test-engineer', label: '测试工程师' },
];

const experienceOptions = [
  { value: '0-1', label: '0-1年' },
  { value: '1-3', label: '1-3年' },
  { value: '3-5', label: '3-5年' },
  { value: '5-10', label: '5-10年' },
  { value: '10+', label: '10年以上' },
];

const educationOptions = [
  { value: 'college', label: '大专' },
  { value: 'bachelor', label: '本科' },
  { value: 'master', label: '硕士' },
  { value: 'phd', label: '博士' },
];

const jobStatusOptions = [
  { value: 'employed', label: '在职' },
  { value: 'unemployed', label: '离职' },
  { value: 'available', label: '随时到岗' },
];

const templateTypes = [
  { icon: UserCheck, label: 'Boss招聘', active: true, routeName: 'boss-recruit-form' },
  { icon: FileUser, label: '简历分析', routeName: 'resume-analysis-form' },
  { icon: DollarSign, label: '薪酬调查', routeName: 'salary-survey-form' },
];

const features = [
  'RPA自动化批量打招呼',
  '智能筛选条件精准匹配',
  'AI分析候选人匹配度',
  '简历自动收集整理',
  '账号风控智能监测',
];

const statusConfig = computed(() => {
  switch (accountStatus.value) {
    case 'online':
      return { icon: CheckCircle, color: '#22c55e', text: '在线' };
    case 'risk':
      return { icon: AlertCircle, color: '#f59e0b', text: '风控中' };
    default:
      return { icon: XCircle, color: '#94a3b8', text: '离线' };
  }
});

const goBack = () => {
  router.push({ name: 'home' });
};

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const toggleExperience = (value: string) => {
  const index = experienceRange.value.indexOf(value);
  if (index > -1) {
    experienceRange.value.splice(index, 1);
  } else {
    experienceRange.value.push(value);
  }
};

const toggleJobStatus = (value: string) => {
  const index = jobStatus.value.indexOf(value);
  if (index > -1) {
    jobStatus.value.splice(index, 1);
  } else {
    jobStatus.value.push(value);
  }
};

const handleSaveConfig = () => {
  const config = {
    account: {
      name: accountName.value,
      cookies: cookies.value,
    },
    job: {
      source: selectedJdSource.value,
      jd: selectedJd.value,
      requirements: manualJobRequirements.value,
    },
    rpa: {
      autoGreeting: autoGreeting.value,
      template: greetingTemplate.value,
      experience: experienceRange.value,
      education: educationRequirement.value,
      salary: { min: salaryMin.value, max: salaryMax.value },
      jobStatus: jobStatus.value,
      dailyLimit: dailyLimit.value,
    },
  };
  console.log('Saving config:', config);
  alert('配置已保存');
};

const handleStartRecruit = () => {
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
          @click="navigateTo(item.routeName)"
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
          <UserCheck :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">Boss直聘招聘</h1>
          <p class="form-subtitle">智能RPA招聘助手，自动筛选简历打招呼</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 账号配置区 -->
        <div class="form-section">
          <div class="section-header">
            <Settings :size="16" />
            <span>账号配置</span>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">
                <span class="required">*</span> 账号名称
              </label>
              <input
                v-model="accountName"
                type="text"
                class="form-input"
                placeholder="请输入Boss直聘账号名称"
              />
            </div>
            <div class="form-group half">
              <label class="form-label">账号状态</label>
              <div class="status-indicator" :style="{ color: statusConfig.color }">
                <component :is="statusConfig.icon" :size="16" />
                <span>{{ statusConfig.text }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="required">*</span> Cookies
            </label>
            <textarea
              v-model="cookies"
              class="form-textarea"
              placeholder="请输入Boss直聘登录Cookies，用于RPA自动化操作"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- 招聘岗位选择 -->
        <div class="form-section">
          <div class="section-header">
            <FileUser :size="16" />
            <span>招聘岗位</span>
          </div>

          <div class="form-group">
            <label class="form-label">岗位来源</label>
            <div class="option-selector two-col">
              <button
                class="option-btn"
                :class="{ active: selectedJdSource === 'library' }"
                @click="selectedJdSource = 'library'"
              >
                从JD知识库选择
              </button>
              <button
                class="option-btn"
                :class="{ active: selectedJdSource === 'manual' }"
                @click="selectedJdSource = 'manual'"
              >
                手动输入要求
              </button>
            </div>
          </div>

          <div v-if="selectedJdSource === 'library'" class="form-group">
            <label class="form-label">
              <span class="required">*</span> 选择岗位
            </label>
            <select v-model="selectedJd" class="form-select">
              <option value="">请选择目标岗位</option>
              <option v-for="jd in jdOptions" :key="jd.value" :value="jd.value">
                {{ jd.label }}
              </option>
            </select>
          </div>

          <div v-else class="form-group">
            <label class="form-label">
              <span class="required">*</span> 岗位要求
            </label>
            <textarea
              v-model="manualJobRequirements"
              class="form-textarea"
              placeholder="请输入岗位的具体要求，包括技能要求、职责描述等"
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- RPA策略配置 -->
        <div class="form-section">
          <div class="section-header">
            <Play :size="16" />
            <span>RPA策略配置</span>
          </div>

          <div class="form-group">
            <label class="form-label">自动打招呼</label>
            <div class="toggle-switch" @click="autoGreeting = !autoGreeting">
              <div class="toggle-track" :class="{ active: autoGreeting }">
                <div class="toggle-thumb"></div>
              </div>
              <span class="toggle-label">{{ autoGreeting ? '已开启' : '已关闭' }}</span>
            </div>
          </div>

          <div v-if="autoGreeting" class="form-group">
            <label class="form-label">打招呼话术模板</label>
            <textarea
              v-model="greetingTemplate"
              class="form-textarea"
              placeholder="支持变量：{候选人姓名}、{岗位名称}"
              rows="3"
            ></textarea>
            <div class="form-hint">支持变量：{候选人姓名}、{岗位名称}</div>
          </div>

          <div class="form-group">
            <label class="form-label">工作年限要求（可多选）</label>
            <div class="option-selector five-col">
              <button
                v-for="exp in experienceOptions"
                :key="exp.value"
                class="option-btn"
                :class="{ active: experienceRange.includes(exp.value) }"
                @click="toggleExperience(exp.value)"
              >
                {{ exp.label }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">学历要求</label>
            <div class="option-selector four-col">
              <button
                v-for="edu in educationOptions"
                :key="edu.value"
                class="option-btn"
                :class="{ active: educationRequirement === edu.value }"
                @click="educationRequirement = edu.value"
              >
                {{ edu.label }}
              </button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label class="form-label">期望薪资范围</label>
              <div class="salary-range">
                <input
                  v-model="salaryMin"
                  type="text"
                  class="form-input salary-input"
                  placeholder="最低"
                />
                <span class="salary-separator">-</span>
                <input
                  v-model="salaryMax"
                  type="text"
                  class="form-input salary-input"
                  placeholder="最高"
                />
                <span class="salary-unit">K</span>
              </div>
            </div>
            <div class="form-group half">
              <label class="form-label">每日打招呼上限</label>
              <div class="limit-input">
                <input
                  v-model.number="dailyLimit"
                  type="number"
                  class="form-input"
                  min="1"
                  max="100"
                />
                <span class="limit-hint">次/天（建议不超过50次，防止账号风控）</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">在职状态（可多选）</label>
            <div class="option-selector three-col">
              <button
                v-for="status in jobStatusOptions"
                :key="status.value"
                class="option-btn"
                :class="{ active: jobStatus.includes(status.value) }"
                @click="toggleJobStatus(status.value)"
              >
                {{ status.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="submit-container">
          <button class="submit-btn secondary" @click="handleSaveConfig">
            <Save :size="16" />
            保存配置
          </button>
          <button class="submit-btn primary" @click="handleStartRecruit">
            <Play :size="16" />
            开始招聘
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-card">
        <div class="info-icon">🤖</div>
        <h3 class="info-title">Boss直聘招聘</h3>
        <p class="info-desc">RPA自动化招聘助手，批量打招呼收简历</p>
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

.form-section {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.section-header svg {
  color: #2563eb;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group.half {
  flex: 1;
}

.form-group:last-child {
  margin-bottom: 0;
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

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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

.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-track {
  width: 44px;
  height: 24px;
  background: #cbd5e1;
  border-radius: 12px;
  position: relative;
  transition: all 0.2s;
}

.toggle-track.active {
  background: #2563eb;
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-track.active .toggle-thumb {
  left: 22px;
}

.toggle-label {
  font-size: 14px;
  color: #475569;
}

.option-selector {
  display: flex;
  gap: 12px;
}

.option-selector.two-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.option-selector.three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.option-selector.four-col {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.option-selector.five-col {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.option-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
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

.salary-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.salary-input {
  width: 80px;
  text-align: center;
}

.salary-separator {
  color: #94a3b8;
}

.salary-unit {
  color: #64748b;
  font-size: 14px;
}

.limit-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.limit-input .form-input {
  width: 80px;
  text-align: center;
}

.limit-hint {
  font-size: 12px;
  color: #94a3b8;
}

.submit-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-bottom: 40px;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn.primary {
  background: #2563eb;
  color: white;
}

.submit-btn.primary:hover {
  background: #1e40af;
}

.submit-btn.secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.submit-btn.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
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
