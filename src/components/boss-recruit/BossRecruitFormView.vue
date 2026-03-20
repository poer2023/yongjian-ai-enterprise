<script setup lang="ts">
import { ref } from 'vue';
import {
  UserCheck,
  Clock,
  Filter,
  Settings,
  AlertCircle,
  Plus,
  ArrowRight,
  Briefcase,
  FileUser,
  RefreshCw
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import {
  recentTools,
  features,
  defaultRpaStrategy,
  errorHandlingOptions,
  mockAccounts
} from './mockData';
import type { BossAccount, AccountInfo, RpaStrategy } from './types';
import AuthOverlay from './AuthOverlay.vue';

const router = useRouter();

// Accounts
const accounts = ref<BossAccount[]>([...mockAccounts]);

// Auth overlay
const showAuthOverlay = ref(false);
const isReauth = ref(false);
const reauthAccountId = ref<string | null>(null);

// RPA strategy
const rpaStrategy = ref<RpaStrategy>({ ...defaultRpaStrategy });

// Enter workbench for an account
const enterWorkbench = (account: BossAccount) => {
  router.push({ name: 'boss-recruit-workbench', query: { accountId: account.id } });
};

// Open auth overlay for new account
const addNewAccount = () => {
  isReauth.value = false;
  reauthAccountId.value = null;
  showAuthOverlay.value = true;
};

// Reauthorize an expired account
const reauthorize = (account: BossAccount) => {
  isReauth.value = true;
  reauthAccountId.value = account.id;
  showAuthOverlay.value = true;
};

// Handle auth success
const handleAuthSuccess = (info: AccountInfo) => {
  showAuthOverlay.value = false;
  if (isReauth.value && reauthAccountId.value) {
    // Update existing account
    const acc = accounts.value.find(a => a.id === reauthAccountId.value);
    if (acc) {
      acc.status = 'active';
      acc.expiresAt = info.expiresAt || '';
      acc.name = info.name;
      acc.company = info.company;
    }
  } else {
    // Add new account
    accounts.value.push({
      id: `acc-${Date.now()}`,
      name: info.name,
      company: info.company,
      avatar: info.avatar,
      expiresAt: info.expiresAt || '',
      status: 'active',
      followingCount: 0,
      todayResumes: 0,
    });
  }
  reauthAccountId.value = null;
};

// Toggle RPA enabled
const toggleRpaEnabled = () => {
  rpaStrategy.value.enabled = !rpaStrategy.value.enabled;
};
</script>

<template>
  <FormPageLayout :icon="UserCheck" title="Boss直聘智能招聘" subtitle="授权管理Boss账号，配置RPA自动化招聘策略">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" :active-index="0" />
    </template>

    <!-- Section 1: Account Management -->
    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="step-badge">1</span>
          账号管理
        </h3>
      </div>
      <p class="section-hint">管理已授权的Boss直聘账号，点击进入对应工作台</p>

      <div class="account-cards">
        <div
          v-for="account in accounts"
          :key="account.id"
          class="account-card"
          :class="{ expired: account.status === 'expired' }"
        >
          <div class="account-card-header">
            <div class="account-avatar">
              <UserCheck :size="20" />
            </div>
            <div class="account-info">
              <div class="account-name-row">
                <span class="account-name">{{ account.name }}</span>
                <span class="account-sep">&middot;</span>
                <span class="account-company">{{ account.company }}</span>
              </div>
              <div v-if="account.status === 'active'" class="account-session">
                <Clock :size="12" />
                会话有效至 {{ account.expiresAt }}
              </div>
              <div v-else class="account-expired-tag">
                <AlertCircle :size="12" />
                会话已过期
              </div>
            </div>
          </div>

          <div v-if="account.status === 'active'" class="account-card-stats">
            <span class="stat-item">
              <Briefcase :size="13" />
              {{ account.followingCount }} 个关注中岗位
            </span>
            <span class="stat-divider">&middot;</span>
            <span class="stat-item">
              <FileUser :size="13" />
              {{ account.todayResumes }} 条新简历
            </span>
          </div>

          <div class="account-card-actions">
            <button
              v-if="account.status === 'active'"
              class="enter-workbench-btn"
              @click="enterWorkbench(account)"
            >
              进入工作台
              <ArrowRight :size="14" />
            </button>
            <button
              v-else
              class="reauth-btn"
              @click="reauthorize(account)"
            >
              <RefreshCw :size="14" />
              重新授权
            </button>
          </div>
        </div>
      </div>

      <button class="add-account-btn" @click="addNewAccount">
        <Plus :size="16" />
        添加新账号
      </button>
    </div>

    <!-- Section 2: RPA Strategy -->
    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="step-badge">2</span>
          RPA 运行策略
        </h3>
      </div>

      <!-- RPA Toggle -->
      <div class="rpa-toggle-row">
        <span class="rpa-toggle-label">启用自动化</span>
        <div class="rpa-toggle" :class="{ active: rpaStrategy.enabled }" @click="toggleRpaEnabled">
          <div class="toggle-knob"></div>
        </div>
      </div>

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

        <!-- Hourly Limit -->
        <div class="config-row">
          <label class="config-label">
            <Clock :size="16" />
            每小时上限
          </label>
          <div class="config-content">
            <div class="limit-input-wrap">
              <input
                v-model.number="rpaStrategy.hourlyLimit"
                type="number"
                min="1"
                max="100"
                class="limit-input"
                :disabled="!rpaStrategy.enabled"
              />
              <span class="limit-unit">次/小时</span>
            </div>
            <span class="config-hint">每小时最多打招呼次数，避免短时间内频繁操作</span>
          </div>
        </div>

        <!-- Greeting Interval -->
        <div class="config-row">
          <label class="config-label">
            <Settings :size="16" />
            打招呼间隔
          </label>
          <div class="config-content">
            <div class="interval-range">
              <input
                v-model.number="rpaStrategy.minInterval"
                type="number"
                min="5"
                max="300"
                class="limit-input"
                :disabled="!rpaStrategy.enabled"
              />
              <span class="time-separator">~</span>
              <input
                v-model.number="rpaStrategy.maxInterval"
                type="number"
                min="10"
                max="600"
                class="limit-input"
                :disabled="!rpaStrategy.enabled"
              />
              <span class="limit-unit">秒</span>
            </div>
            <span class="config-hint">每次打招呼间隔时间随机在此区间内，模拟人工操作节奏</span>
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
                @click="rpaStrategy.errorHandling = opt.value as 'pause' | 'skip'"
              >
                {{ opt.label }}
              </button>
            </div>
            <span class="config-hint">遇到验证码或异常时的处理方式</span>
          </div>
        </div>
      </div>
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="UserCheck" title="Boss招聘" description="智能化Boss直聘招聘管理，自动筛选候选人并打招呼" :features="features" />
    </template>
  </FormPageLayout>

  <!-- Auth Overlay -->
  <AuthOverlay
    v-if="showAuthOverlay"
    :is-expired="isReauth"
    @auth-success="handleAuthSuccess"
    @close="showAuthOverlay = false"
  />
</template>

<style scoped>
@import './styles.css';

.step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  margin-right: 8px;
}

.form-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.section-hint {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 16px 0;
}

/* Account Cards */
.account-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.account-card {
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s;
}

.account-card:hover {
  border-color: #cbd5e1;
}

.account-card.expired {
  background: #fefce8;
  border-color: #fde68a;
}

.account-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.account-avatar {
  width: 44px;
  height: 44px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  flex-shrink: 0;
}

.account-card.expired .account-avatar {
  background: #fef3c7;
  color: #d97706;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.account-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.account-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.account-sep {
  color: #cbd5e1;
}

.account-company {
  font-size: 14px;
  color: #64748b;
}

.account-session {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.account-expired-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #d97706;
  font-weight: 500;
}

.account-card-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-left: 58px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #475569;
}

.stat-divider {
  color: #cbd5e1;
}

.account-card-actions {
  padding-left: 58px;
}

.enter-workbench-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.enter-workbench-btn:hover {
  background: #1d4ed8;
}

.reauth-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: white;
  border: 1px solid #fde68a;
  border-radius: 8px;
  color: #d97706;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reauth-btn:hover {
  background: #fffbeb;
  border-color: #fcd34d;
}

.add-account-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 14px;
  background: white;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-account-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

/* RPA Section */
.rpa-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.rpa-toggle-label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}
</style>
