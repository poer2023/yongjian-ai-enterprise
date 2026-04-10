<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  Chrome,
  Download,
  RefreshCw,
  UserCheck
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import { recentTools, features, mockAccounts } from './mockData';
import type { BossAccount, AccountInfo } from './types';
import AuthOverlay from './AuthOverlay.vue';

const router = useRouter();

const baseAccount = mockAccounts[0] ?? {
  id: 'acc-001',
  name: '张招聘',
  company: 'XX科技有限公司',
  avatar: '',
  expiresAt: '',
  status: 'active' as const,
  followingCount: 3,
  todayResumes: 12,
};

const currentAccount = ref<BossAccount | null>(null);
const showAuthOverlay = ref(false);
const isReauth = ref(false);

const pluginConnected = ref(false);
const isTestingConnection = ref(false);

const pluginReady = computed(() => pluginConnected.value);

const pluginCapabilities = [
  '岗位同步',
  '自动打招呼',
  '简历采集',
  '状态回传',
];

const openAuthOverlay = (reauth = false) => {
  isReauth.value = reauth;
  showAuthOverlay.value = true;
};

const handleAuthSuccess = (info: AccountInfo) => {
  currentAccount.value = {
    ...baseAccount,
    name: info.name,
    company: info.company,
    avatar: info.avatar,
    expiresAt: info.expiresAt || baseAccount.expiresAt,
    status: 'active',
  };
  pluginConnected.value = false;
  showAuthOverlay.value = false;
};

const downloadPluginPackage = () => {
  // Demo only: placeholder action for plugin package download.
};

const testPluginConnection = () => {
  if (isTestingConnection.value) return;
  isTestingConnection.value = true;
  window.setTimeout(() => {
    pluginConnected.value = true;
    isTestingConnection.value = false;
  }, 1200);
};

const resetPluginGuide = () => {
  pluginConnected.value = false;
  isTestingConnection.value = false;
};

const openPluginDemo = () => {
  router.push({ name: 'boss-recruit-plugin-demo' });
};

const enterWorkbench = () => {
  if (!currentAccount.value || !pluginReady.value) return;
  router.push({ name: 'boss-recruit-workbench', query: { accountId: currentAccount.value.id } });
};
</script>

<template>
  <FormPageLayout :icon="UserCheck" title="boss招聘助手" subtitle="账号登录 + Chrome 插件联动的招聘自动化演示">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" :active-index="0" />
    </template>

    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="step-badge">1</span>
          账号登录
        </h3>
      </div>
      <p class="section-hint">账号授权成功后，才能继续完成 Chrome 插件安装、启用和连接测试。</p>

      <div class="single-account-card" :class="{ empty: !currentAccount }">
        <div class="account-main">
          <div class="account-avatar">
            <UserCheck :size="22" />
          </div>
          <div class="account-copy">
            <template v-if="currentAccount">
              <div class="account-name-row">
                <span class="account-name">{{ currentAccount.name }}</span>
                <span class="account-sep">&middot;</span>
                <span class="account-company">{{ currentAccount.company }}</span>
              </div>
              <div class="account-stats">
                <span class="stat-chip">
                  <Briefcase :size="13" />
                  {{ currentAccount.followingCount }} 个关注中岗位
                </span>
              </div>
            </template>
            <template v-else>
              <div class="account-name-row">
                <span class="account-name">尚未授权招聘账号</span>
              </div>
              <p class="empty-account-hint">首次使用请先完成账号授权，后续所有自动化动作都将绑定到该账号。</p>
            </template>
          </div>
        </div>

        <div class="account-actions">
          <button class="primary-btn" @click="openAuthOverlay(!!currentAccount)">
            <UserCheck :size="15" />
            {{ currentAccount ? '重新授权' : '立即授权登录' }}
          </button>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="step-badge">2</span>
          插件系统
        </h3>
        <div class="section-tools">
          <button class="section-tag section-tag-button" @click="downloadPluginPackage">
            <Download :size="12" />
            下载 Chrome 插件
          </button>
          <button class="section-tag section-tag-button section-tag-button-strong" @click="openPluginDemo">
            <Chrome :size="12" />
            插件 Demo
          </button>
        </div>
      </div>
      <p class="section-hint">Demo 中仅展示安装引导、连接检测和运行状态，不接真实插件能力。</p>

      <div v-if="!pluginReady" class="plugin-shell">
        <div class="plugin-shell-header">
          <div class="plugin-shell-copy">
            <h4 class="plugin-section-title">如果本机已安装插件，可直接测试连接；首次使用再参考下方接入说明</h4>
            <p class="plugin-section-desc">页面不会强制校验下载和安装状态，只保留首次接入说明。长期使用时，通常只需要测试连接确认插件在线。</p>
          </div>
          <div class="plugin-actions-inline">
            <button class="primary-btn" @click="testPluginConnection">
              <RefreshCw v-if="isTestingConnection" :size="15" class="spin" />
              <RefreshCw v-else :size="15" />
              {{ isTestingConnection ? '连接中...' : '测试连接' }}
            </button>
          </div>
        </div>

        <div class="plugin-guide-list">
          <div class="plugin-guide-item">
            <span class="guide-index">1</span>
            <div class="guide-copy">
              <strong>首次接入时</strong>
              <p>下载插件包，并按浏览器提示完成安装。</p>
            </div>
          </div>
          <div class="plugin-guide-item">
            <span class="guide-index">2</span>
            <div class="guide-copy">
              <strong>安装完成后</strong>
              <p>在 Chrome 扩展程序中开启插件，并保持浏览器处于可连接状态。</p>
            </div>
          </div>
          <div class="plugin-guide-item guide-item-highlight">
            <span class="guide-index">3</span>
            <div class="guide-copy">
              <strong>日常使用时</strong>
              <p>直接点击“测试连接”即可，无需每次重复下载或确认开启插件。</p>
            </div>
          </div>
        </div>

        <div class="plugin-shell-footer">
          <div class="footer-tip">
            <Bot :size="16" />
            <span>演示建议：先说明首次接入逻辑，再直接点击“测试连接”切换到成功运行态。</span>
          </div>
        </div>
      </div>

      <div v-else class="plugin-shell plugin-shell-connected">
        <div class="plugin-shell-header">
          <div>
            <div class="connection-status-line">
              <CheckCircle2 :size="14" />
              连接状态：已连接
            </div>
            <p class="plugin-section-desc">Chrome 插件已准备就绪，可以进入工作台继续演示自动化招聘流程。</p>
          </div>
          <div class="plugin-actions-inline">
            <button class="secondary-btn" @click="testPluginConnection">
              <RefreshCw :size="15" />
              重新测试
            </button>
            <button class="primary-btn" @click="enterWorkbench">
              进入工作台
              <ArrowRight :size="15" />
            </button>
          </div>
        </div>

        <div class="runtime-summary-simple">
          <span class="runtime-label">运行摘要</span>
          <div class="runtime-lines">
            <p>任务执行模式：前台浏览器自动化</p>
            <p>最近一次同步：2 分钟前</p>
            <p>今日动作回传：12 次</p>
            <p>支持能力：{{ pluginCapabilities.join(' / ') }}</p>
          </div>
        </div>

        <div class="plugin-shell-footer">
          <button class="text-btn" @click="resetPluginGuide">切回安装引导态</button>
        </div>
      </div>
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="UserCheck" title="boss招聘助手" description="通过单账号授权和 Chrome 插件联动，演示招聘自动化的安装引导与运行状态。" :features="features" />
    </template>
  </FormPageLayout>

  <AuthOverlay
    v-if="showAuthOverlay"
    :is-expired="isReauth"
    @auth-success="handleAuthSuccess"
    @close="showAuthOverlay = false"
  />
</template>

<style scoped>
@import './styles.css';

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.form-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #dbeafe;
  color: #2563eb;
  font-size: 12px;
  font-weight: 500;
}

.section-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-tag-button {
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-tag-button:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.section-tag-button-strong {
  background: #eff6ff;
}

.section-hint {
  margin: 0 0 16px;
  color: #94a3b8;
  font-size: 13px;
}

.single-account-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  background: linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%);
}

.single-account-card.empty {
  border-style: dashed;
  border-color: #cbd5e1;
  background: #f8fafc;
}

.account-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.account-avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.account-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.account-name {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.account-sep {
  color: #cbd5e1;
}

.account-company {
  font-size: 14px;
  color: #64748b;
}

.account-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: #334155;
  font-size: 13px;
}

.empty-account-hint {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.account-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.primary-btn,
.secondary-btn,
.text-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 10px 18px;
}

.primary-btn:hover {
  background: #1d4ed8;
}

.secondary-btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  padding: 10px 18px;
}

.secondary-btn:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.secondary-btn:disabled,
.primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.text-btn {
  border: none;
  background: transparent;
  color: #2563eb;
  padding: 0;
}

.plugin-shell {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
}

.plugin-shell-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fbff 0%, #f8fafc 100%);
}

.plugin-shell-copy,
.plugin-shell-header > div:first-child {
  flex: 1;
}

.plugin-section-title {
  margin: 0 0 8px;
  font-size: 20px;
  line-height: 1.4;
  color: #0f172a;
}

.plugin-section-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
}

.plugin-guide-list {
  display: grid;
  gap: 12px;
  padding: 24px;
}

.plugin-guide-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.guide-item-highlight {
  border-color: #dbeafe;
  background: #eff6ff;
}

.guide-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.guide-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guide-copy strong {
  font-size: 14px;
  color: #0f172a;
}

.guide-copy p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #64748b;
}

.plugin-shell-footer {
  padding: 0 24px 24px;
}

.footer-tip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 13px;
}

.connection-status-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
}

.plugin-actions-inline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.runtime-summary-simple {
  margin: 24px;
  padding: 18px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.runtime-label {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

.runtime-lines p {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

@media (max-width: 1200px) {
  .plugin-actions-inline {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 900px) {
  .single-account-card,
  .plugin-shell-header,
  .plugin-actions-inline,
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .account-actions,
  .plugin-actions-inline {
    width: 100%;
  }

  .section-tools {
    width: 100%;
    flex-wrap: wrap;
  }

  .primary-btn,
  .secondary-btn,
  .plugin-actions-inline .secondary-btn,
  .plugin-actions-inline .primary-btn {
    width: 100%;
  }

  .plugin-shell-footer,
  .runtime-summary-simple {
    margin-left: 16px;
    margin-right: 16px;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
