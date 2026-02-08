<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  UserCheck,
  FileUser,
  QrCode,
  CheckCircle,
  Loader2,
  Briefcase,
  Eye,
  Play,
  RefreshCw,
  Smartphone,
  Filter,
  Settings,
  Clock,
  AlertCircle
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import type { AuthStatus, AuthMethod, AccountInfo, BossJD, RpaStrategy } from './types';
import {
  mockJdList,
  recentTools,
  features,
  errorHandlingOptions,
  defaultRpaStrategy
} from './mockData';

const router = useRouter();

// Authentication state
const authStatus = ref<AuthStatus>('idle');
const authMethod = ref<AuthMethod>('phone');
const accountInfo = ref<AccountInfo>({
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
const jdList = ref<BossJD[]>([]);
const selectedJdIds = ref<number[]>([]);

// Start authentication
const startAuth = () => {
  authStatus.value = 'scanning';
  setTimeout(() => {
    authStatus.value = 'success';
    accountInfo.value = {
      name: '张招聘',
      company: 'XX科技有限公司',
      avatar: ''
    };
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

// RPA strategy state
const rpaStrategy = ref<RpaStrategy>({ ...defaultRpaStrategy });

// Toggle RPA enabled
const toggleRpaEnabled = () => {
  rpaStrategy.value.enabled = !rpaStrategy.value.enabled;
};

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
  <FormPageLayout :icon="UserCheck" title="Boss直聘招聘" subtitle="授权账号后自动获取岗位，开启智能招聘监控">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" :active-index="0" />
    </template>

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

    <!-- Step 3: RPA Strategy -->
    <div v-if="authStatus === 'success' && selectedJdIds.length > 0" class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="step-number">3</span>
          自动化运行策略
        </h3>
        <div class="rpa-toggle" :class="{ active: rpaStrategy.enabled }" @click="toggleRpaEnabled">
          <div class="toggle-knob"></div>
        </div>
      </div>
      <p class="section-hint">配置RPA自动打招呼的运行规则</p>

      <div class="rpa-config" :class="{ disabled: !rpaStrategy.enabled }">
        <!-- Time Range -->
        <div class="config-row">
          <label class="config-label">
            <Clock :size="16" />
            运行时段
          </label>
          <div class="config-content">
            <div class="time-range">
              <input
                v-model="rpaStrategy.startTime"
                type="time"
                class="time-input"
                :disabled="!rpaStrategy.enabled"
              />
              <span class="time-separator">至</span>
              <input
                v-model="rpaStrategy.endTime"
                type="time"
                class="time-input"
                :disabled="!rpaStrategy.enabled"
              />
            </div>
            <span class="config-hint">仅在此时段内自动运行</span>
          </div>
        </div>

        <!-- Daily Limit -->
        <div class="config-row">
          <label class="config-label">
            <Filter :size="16" />
            每日频率上限
          </label>
          <div class="config-content">
            <div class="limit-input-wrap">
              <input
                v-model.number="rpaStrategy.dailyLimit"
                type="number"
                min="1"
                max="500"
                class="limit-input"
                :disabled="!rpaStrategy.enabled"
              />
              <span class="limit-unit">次/天</span>
            </div>
            <span class="config-hint">每日最多自动打招呼次数</span>
          </div>
        </div>

        <!-- Error Handling -->
        <div class="config-row">
          <label class="config-label">
            <AlertCircle :size="16" />
            异常处理策略
          </label>
          <div class="config-content">
            <div class="option-buttons">
              <button
                v-for="opt in errorHandlingOptions"
                :key="opt.value"
                class="option-btn"
                :class="{ active: rpaStrategy.errorHandling === opt.value }"
                :disabled="!rpaStrategy.enabled"
                @click="rpaStrategy.errorHandling = opt.value as 'pause' | 'skip' | 'notify'"
              >
                {{ opt.label }}
              </button>
            </div>
            <span class="config-hint">遇到验证码或异常时的处理方式</span>
          </div>
        </div>
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

    <template #info-sidebar>
      <InfoSidebar :icon="UserCheck" title="Boss直聘招聘" description="智能RPA招聘助手，自动筛选简历打招呼" :features="features" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
@import './styles.css';
</style>
