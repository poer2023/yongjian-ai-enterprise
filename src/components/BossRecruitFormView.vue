<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  UserCheck,
  FileUser,
  DollarSign,
  Search,
  Flame,
  QrCode,
  CheckCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Eye,
  Play,
  RefreshCw,
  Smartphone,
  Send
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Authentication state
type AuthStatus = 'idle' | 'scanning' | 'success' | 'error';
type AuthMethod = 'phone' | 'qrcode';
const authStatus = ref<AuthStatus>('idle');
const authMethod = ref<AuthMethod>('phone');
const accountInfo = ref({
  name: '',
  company: '',
  avatar: ''
});

// Phone auth state
const phoneNumber = ref('');
const verifyCode = ref('');
const codeSent = ref(false);
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

// Send verification code
const sendCode = () => {
  if (!phoneNumber.value || phoneNumber.value.length !== 11) return;
  codeSent.value = true;
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      if (countdownTimer) clearInterval(countdownTimer);
      codeSent.value = false;
    }
  }, 1000);
};

// Phone login
const phoneLogin = () => {
  if (!phoneNumber.value || !verifyCode.value) return;
  authStatus.value = 'scanning';
  setTimeout(() => {
    authStatus.value = 'success';
    accountInfo.value = {
      name: '张招聘',
      company: 'XX科技有限公司',
      avatar: ''
    };
    jdList.value = [...mockJdList];
  }, 1000);
};

// JD list from Boss
interface BossJD {
  id: number;
  jobName: string;
  salaryRange: string;
  location: string;
  experience: string;
  education: string;
  publishDate: string;
  viewCount: number;
  resumeCount: number;
  isMonitoring: boolean;
}

const jdList = ref<BossJD[]>([]);
const selectedJdIds = ref<number[]>([]);

// Mock JD data
const mockJdList: BossJD[] = [
  { id: 1, jobName: 'Java开发工程师', salaryRange: '25K-35K', location: '上海', experience: '3-5年', education: '本科', publishDate: '2026-02-01', viewCount: 156, resumeCount: 23, isMonitoring: false },
  { id: 2, jobName: '前端开发工程师', salaryRange: '20K-30K', location: '上海', experience: '2-4年', education: '本科', publishDate: '2026-02-02', viewCount: 98, resumeCount: 15, isMonitoring: false },
  { id: 3, jobName: '产品经理', salaryRange: '30K-45K', location: '上海', experience: '5年以上', education: '本科', publishDate: '2026-01-28', viewCount: 234, resumeCount: 42, isMonitoring: true },
  { id: 4, jobName: '网络安全工程师', salaryRange: '25K-40K', location: '上海', experience: '3-5年', education: '本科', publishDate: '2026-01-25', viewCount: 87, resumeCount: 12, isMonitoring: false },
  { id: 5, jobName: 'UI设计师', salaryRange: '15K-25K', location: '上海', experience: '2-3年', education: '大专', publishDate: '2026-02-03', viewCount: 145, resumeCount: 31, isMonitoring: true },
  { id: 6, jobName: '测试工程师', salaryRange: '18K-28K', location: '上海', experience: '2-4年', education: '本科', publishDate: '2026-01-30', viewCount: 76, resumeCount: 18, isMonitoring: false },
];

const recentTools = [
  { icon: UserCheck, label: 'Boss招聘' },
  { icon: FileUser, label: '简历分析' },
  { icon: DollarSign, label: '薪酬调查' },
];

const features = [
  'Boss直聘账号一键授权',
  '自动同步已发布岗位信息',
  '批量开启智能招聘监控',
  'AI自动筛选候选人打招呼',
  '简历自动收集整理分析',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

// Start authentication
const startAuth = () => {
  authStatus.value = 'scanning';
  // Simulate QR code scanning
  setTimeout(() => {
    authStatus.value = 'success';
    accountInfo.value = {
      name: '张招聘',
      company: 'XX科技有限公司',
      avatar: ''
    };
    // Load JD list after auth
    jdList.value = [...mockJdList];
  }, 2000);
};

// Refresh JD list
const refreshJdList = () => {
  jdList.value = [...mockJdList];
};

// Toggle JD selection
const toggleJdSelection = (id: number) => {
  const index = selectedJdIds.value.indexOf(id);
  if (index > -1) {
    selectedJdIds.value.splice(index, 1);
  } else {
    selectedJdIds.value.push(id);
  }
};

// Select all
const selectAll = () => {
  if (selectedJdIds.value.length === jdList.value.length) {
    selectedJdIds.value = [];
  } else {
    selectedJdIds.value = jdList.value.map(jd => jd.id);
  }
};

const isAllSelected = computed(() => {
  return jdList.value.length > 0 && selectedJdIds.value.length === jdList.value.length;
});

// Submit and start monitoring
const handleSubmit = () => {
  router.push({
    name: 'boss-recruit-result',
    query: {
      jdIds: selectedJdIds.value.join(','),
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
          <p class="form-subtitle">授权账号后自动获取岗位，开启智能招聘监控</p>
        </div>
      </div>

      <div class="form-content">
        <!-- Step 1: Authentication -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">
              <span class="step-number">1</span>
              账号授权
            </h3>
            <span v-if="authStatus === 'success'" class="auth-status success">
              <CheckCircle :size="14" />
              已授权
            </span>
          </div>

          <!-- Not authenticated -->
          <div v-if="authStatus === 'idle'" class="auth-area">
            <!-- Auth method tabs -->
            <div class="auth-method-tabs">
              <button
                class="auth-tab"
                :class="{ active: authMethod === 'phone' }"
                @click="authMethod = 'phone'"
              >
                <Smartphone :size="16" />
                手机验证码登录
              </button>
              <button
                class="auth-tab"
                :class="{ active: authMethod === 'qrcode' }"
                @click="authMethod = 'qrcode'"
              >
                <QrCode :size="16" />
                扫码登录
              </button>
            </div>

            <!-- Phone login form -->
            <div v-if="authMethod === 'phone'" class="phone-login-form">
              <div class="phone-input-group">
                <input
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="请输入手机号"
                  maxlength="11"
                  class="phone-input"
                />
              </div>
              <div class="code-input-group">
                <input
                  v-model="verifyCode"
                  type="text"
                  placeholder="请输入验证码"
                  maxlength="6"
                  class="code-input"
                />
                <button
                  class="send-code-btn"
                  :disabled="!phoneNumber || phoneNumber.length !== 11 || codeSent"
                  @click="sendCode"
                >
                  {{ codeSent ? `${countdown}s后重发` : '获取验证码' }}
                </button>
              </div>
              <button
                class="phone-login-btn"
                :disabled="!phoneNumber || !verifyCode"
                @click="phoneLogin"
              >
                登录授权
              </button>
            </div>

            <!-- QR code login -->
            <div v-else class="qrcode-login">
              <div class="qr-placeholder">
                <QrCode :size="48" />
              </div>
              <div class="auth-text">
                <p class="auth-main">使用Boss直聘APP扫码授权</p>
                <p class="auth-hint">授权后将自动获取您发布的岗位信息</p>
              </div>
              <button class="auth-btn" @click="startAuth">
                开始授权
              </button>
            </div>
          </div>

          <!-- Scanning / Loading -->
          <div v-else-if="authStatus === 'scanning'" class="auth-area loading">
            <div class="loading-box">
              <Loader2 :size="40" class="spin loading-icon" />
              <p class="loading-text">正在授权中...</p>
              <p class="loading-hint">请稍候，正在获取账号信息</p>
            </div>
          </div>

          <!-- Authenticated -->
          <div v-else-if="authStatus === 'success'" class="auth-area authenticated">
            <div class="account-info">
              <div class="account-avatar">
                <UserCheck :size="24" />
              </div>
              <div class="account-details">
                <span class="account-name">{{ accountInfo.name }}</span>
                <span class="account-company">{{ accountInfo.company }}</span>
              </div>
            </div>
            <button class="change-account-btn" @click="authStatus = 'idle'">
              切换账号
            </button>
          </div>
        </div>

        <!-- Step 2: JD List -->
        <div v-if="authStatus === 'success'" class="form-section">
          <div class="section-header">
            <h3 class="section-title">
              <span class="step-number">2</span>
              选择监控岗位
            </h3>
            <div class="section-actions">
              <button class="refresh-btn" @click="refreshJdList">
                <RefreshCw :size="14" />
                刷新列表
              </button>
            </div>
          </div>
          <p class="section-hint">选择需要开启智能招聘监控的岗位，系统将自动筛选候选人并打招呼</p>

          <div class="jd-table">
            <div class="jd-table-header">
              <span class="col-select">
                <div class="checkbox" :class="{ checked: isAllSelected }" @click="selectAll">
                  <CheckCircle v-if="isAllSelected" :size="12" />
                </div>
              </span>
              <span class="col-name">岗位名称</span>
              <span class="col-salary">薪资</span>
              <span class="col-location">地点</span>
              <span class="col-exp">经验</span>
              <span class="col-stats">浏览/简历</span>
              <span class="col-status">状态</span>
            </div>
            <div class="jd-table-body">
              <div
                v-for="jd in jdList"
                :key="jd.id"
                class="jd-table-row"
                :class="{ selected: selectedJdIds.includes(jd.id) }"
                @click="toggleJdSelection(jd.id)"
              >
                <span class="col-select">
                  <div class="checkbox" :class="{ checked: selectedJdIds.includes(jd.id) }">
                    <CheckCircle v-if="selectedJdIds.includes(jd.id)" :size="12" />
                  </div>
                </span>
                <span class="col-name">
                  <Briefcase :size="14" class="name-icon" />
                  {{ jd.jobName }}
                </span>
                <span class="col-salary">{{ jd.salaryRange }}</span>
                <span class="col-location">{{ jd.location }}</span>
                <span class="col-exp">{{ jd.experience }}</span>
                <span class="col-stats">
                  <Eye :size="12" /> {{ jd.viewCount }}
                  <span class="stats-divider">/</span>
                  <FileUser :size="12" /> {{ jd.resumeCount }}
                </span>
                <span class="col-status">
                  <span v-if="jd.isMonitoring" class="monitoring-badge">
                    <Play :size="10" />
                    监控中
                  </span>
                  <span v-else class="idle-badge">未监控</span>
                </span>
              </div>
            </div>
          </div>

          <div class="selection-summary">
            已选择 <strong>{{ selectedJdIds.length }}</strong> 个岗位
          </div>
        </div>

        <!-- Submit Button -->
        <div v-if="authStatus === 'success'" class="submit-container">
          <button
            class="submit-btn"
            :disabled="selectedJdIds.length === 0"
            @click="handleSubmit"
          >
            开启智能招聘监控
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
      <p class="info-desc">智能RPA招聘助手，自动筛选简历打招呼</p>
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

.template-section .section-title {
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
}

/* Form Sections */
.form-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.section-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.auth-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 12px;
}

.auth-status.success {
  background: #dcfce7;
  color: #16a34a;
}

/* Auth Area */
.auth-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 10px;
}

.auth-method-tabs {
  display: flex;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.auth-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-tab:hover {
  border-color: #cbd5e1;
}

.auth-tab.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.phone-login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 400px;
}

.phone-input-group,
.code-input-group {
  display: flex;
  gap: 10px;
}

.phone-input {
  flex: 1;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.phone-input:focus {
  border-color: #2563eb;
}

.code-input {
  flex: 1;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.code-input:focus {
  border-color: #2563eb;
}

.send-code-btn {
  padding: 12px 20px;
  background: white;
  border: 1px solid #2563eb;
  border-radius: 8px;
  color: #2563eb;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.send-code-btn:hover:not(:disabled) {
  background: #eff6ff;
}

.send-code-btn:disabled {
  border-color: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
}

.phone-login-btn {
  padding: 12px 24px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.phone-login-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.phone-login-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.qrcode-login {
  display: flex;
  align-items: center;
  gap: 24px;
}

.auth-area.loading {
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.auth-area.authenticated {
  flex-direction: row;
  justify-content: space-between;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-icon {
  color: #2563eb;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.loading-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.qr-placeholder {
  width: 80px;
  height: 80px;
  background: #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auth-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.auth-main {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.auth-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.auth-btn {
  padding: 10px 24px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
}

.auth-btn:hover {
  background: #1d4ed8;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.account-avatar {
  width: 48px;
  height: 48px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.account-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.account-company {
  font-size: 13px;
  color: #64748b;
}

.change-account-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.change-account-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Section Actions */
.section-actions {
  display: flex;
  gap: 8px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* JD Table */
.jd-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.jd-table-header {
  display: grid;
  grid-template-columns: 40px 1.5fr 0.8fr 0.6fr 0.7fr 0.9fr 0.7fr;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.jd-table-body {
  max-height: 320px;
  overflow-y: auto;
}

.jd-table-row {
  display: grid;
  grid-template-columns: 40px 1.5fr 0.8fr 0.6fr 0.7fr 0.9fr 0.7fr;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  transition: background 0.15s;
}

.jd-table-row:last-child {
  border-bottom: none;
}

.jd-table-row:hover {
  background: #f8fafc;
}

.jd-table-row.selected {
  background: #eff6ff;
}

.col-select {
  display: flex;
  justify-content: center;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
}

.checkbox.checked {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #1e293b;
}

.name-icon {
  color: #3b82f6;
  flex-shrink: 0;
}

.col-salary {
  font-weight: 600;
  color: #16a34a;
}

.col-location,
.col-exp {
  color: #64748b;
}

.col-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.stats-divider {
  margin: 0 4px;
  color: #cbd5e1;
}

.col-status {
  display: flex;
}

.monitoring-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.idle-badge {
  padding: 3px 8px;
  background: #f1f5f9;
  color: #94a3b8;
  border-radius: 10px;
  font-size: 11px;
}

.selection-summary {
  margin-top: 12px;
  font-size: 13px;
  color: #64748b;
  text-align: right;
}

.selection-summary strong {
  color: #2563eb;
}

/* Submit */
.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
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

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* Scrollbar */
.jd-table-body::-webkit-scrollbar {
  width: 6px;
}

.jd-table-body::-webkit-scrollbar-track {
  background: transparent;
}

.jd-table-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.jd-table-body::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
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
