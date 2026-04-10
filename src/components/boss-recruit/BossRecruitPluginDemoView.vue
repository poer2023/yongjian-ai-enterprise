<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  Chrome,
  Link2,
  RefreshCw,
  UserCheck
} from 'lucide-vue-next';

const router = useRouter();
const demoMode = ref<'onboarding' | 'syncing' | 'connected'>('onboarding');
let syncTimer: ReturnType<typeof setTimeout> | null = null;

const guideSteps = [
  {
    title: '打开 Web 端',
    description: '先在浏览器中登录企业版，并打开 boss招聘助手页面。',
  },
  {
    title: '保持页面开启',
    description: '插件会读取当前浏览器里已登录的助手页面，无需重复登录。',
  },
  {
    title: '检测并同步',
    description: '点击“检测并同步”后，把 Web 上下文和账号信息同步到插件。',
  },
];

const jobItems = ref([
  {
    title: 'Java开发工程师',
    meta: '上海 · 25K-35K · 招聘中',
    rpaEnabled: true,
  },
  {
    title: '前端开发工程师',
    meta: '上海 · 20K-30K · 招聘中',
    rpaEnabled: false,
  },
  {
    title: '产品经理',
    meta: '上海 · 30K-45K · 已同步',
    rpaEnabled: true,
  },
]);

const pluginSettings = ref([
  {
    id: 'auto-sync',
    label: '新岗位自动同步',
    description: '检测到新岗位时自动加入工作台',
    enabled: true,
  },
]);

const toggleJobRpa = (title: string) => {
  jobItems.value = jobItems.value.map((job) =>
    job.title === title ? { ...job, rpaEnabled: !job.rpaEnabled } : job
  );
};

const togglePluginSetting = (id: string) => {
  pluginSettings.value = pluginSettings.value.map((item) =>
    item.id === id ? { ...item, enabled: !item.enabled } : item
  );
};

const goBack = () => {
  router.push({ name: 'boss-recruit' });
};

const openBossRecruit = () => {
  router.push({ name: 'boss-recruit' });
};

const openWorkbench = () => {
  router.push({ name: 'boss-recruit-workbench', query: { accountId: 'acc-001' } });
};

const syncWithWeb = () => {
  demoMode.value = 'syncing';
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    demoMode.value = 'connected';
    syncTimer = null;
  }, 2600);
};

onBeforeUnmount(() => {
  if (syncTimer) clearTimeout(syncTimer);
});
</script>

<template>
  <div class="plugin-demo-page">
    <div class="demo-toolbar">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        返回 boss招聘助手
      </button>

      <div class="mode-switch">
        <button
          class="mode-btn"
          :class="{ active: demoMode === 'onboarding' }"
          @click="demoMode = 'onboarding'"
        >
          初始引导页
        </button>
        <button
          class="mode-btn"
          :class="{ active: demoMode === 'syncing' }"
          @click="demoMode = 'syncing'"
        >
          同步中
        </button>
        <button
          class="mode-btn"
          :class="{ active: demoMode === 'connected' }"
          @click="demoMode = 'connected'"
        >
          已连接页
        </button>
      </div>
    </div>

    <main class="demo-stage">
      <aside class="plugin-popup">
        <div class="popup-header">
          <div class="popup-brand">
            <div class="brand-icon">
              <Chrome :size="18" />
            </div>
            <div class="brand-copy">
              <strong>boss 招聘助手</strong>
              <span class="brand-kicker">招聘自动化插件</span>
            </div>
          </div>
          <div class="popup-status" :class="{ pending: demoMode !== 'connected', syncing: demoMode === 'syncing' }">
            <Link2 v-if="demoMode === 'onboarding'" :size="14" />
            <RefreshCw v-else-if="demoMode === 'syncing'" :size="14" class="spin" />
            <CheckCircle2 v-else :size="14" />
            {{
              demoMode === 'onboarding'
                ? '待连接'
                : demoMode === 'syncing'
                  ? '同步中'
                  : '已连接'
            }}
          </div>
        </div>

        <div class="popup-body" :class="`mode-${demoMode}`">
          <template v-if="demoMode === 'onboarding'">
            <div class="popup-panel onboarding-hero">
              <div class="onboarding-hero-top">
                <span class="hero-chip">首次安装</span>
                <span class="hero-chip hero-chip-link">
                  <Link2 :size="12" />
                  等待同步
                </span>
              </div>
              <div class="onboarding-hero-main">
                <div class="hero-icon">
                  <Link2 :size="18" />
                </div>
                <div class="hero-copy">
                  <strong>把插件和 Web 工作台连起来</strong>
                  <p>插件不会单独登录账号，它会读取当前浏览器里已打开并登录的 boss招聘助手页面。</p>
                </div>
              </div>
            </div>

            <div class="popup-panel onboarding-flow">
              <div class="section-head">
                <span>连接引导</span>
                <span class="section-subhead">2 分钟完成</span>
              </div>
              <div class="flow-list">
                <div
                  v-for="(step, index) in guideSteps"
                  :key="step.title"
                  class="flow-step"
                >
                  <span class="flow-index">{{ index + 1 }}</span>
                  <div class="flow-copy">
                    <strong>{{ step.title }}</strong>
                    <p>{{ step.description }}</p>
                  </div>
                </div>
              </div>
              <div class="flow-note">
                <span class="sync-label">同步方式</span>
                <p>保持 Web 端已登录并打开 boss招聘助手页面，然后点击“检测并同步”。</p>
              </div>
            </div>

            <div class="onboarding-actions-bar">
              <button class="mini-btn mini-btn-light" @click="openBossRecruit">
                打开 Web 工作台
              </button>
              <button class="mini-btn mini-btn-primary" @click="syncWithWeb">
                检测并同步
                <ArrowRight :size="14" />
              </button>
            </div>
        </template>

        <template v-else-if="demoMode === 'syncing'">
          <div class="syncing-screen">
            <div class="syncing-spinner">
              <RefreshCw :size="22" class="spin" />
            </div>
            <div class="syncing-copy">
              <span class="panel-label">正在同步</span>
              <strong>同步中，请勿关闭插件和网页</strong>
              <p>正在读取当前浏览器中的 boss招聘助手 Web 上下文，请稍候 2-3 秒。</p>
            </div>
          </div>
        </template>

          <template v-else>
            <div class="popup-panel account-panel">
              <div class="panel-row">
                <div class="panel-icon">
                  <UserCheck :size="16" />
                </div>
                <div class="panel-copy">
                  <span class="panel-label">当前账号</span>
                  <strong>张招聘 · XX科技有限公司</strong>
                  <p>插件已与 Web 工作台同步连接，可以执行岗位同步与 RPA 操作。</p>
                </div>
              </div>
            </div>

            <div class="popup-panel jobs-panel">
              <div class="section-head">
                <span>已添加岗位</span>
                <span class="section-subhead">{{ jobItems.length }} 个岗位</span>
              </div>
              <div
                v-for="job in jobItems"
                :key="job.title"
                class="job-row"
              >
                <div class="job-icon">
                  <Briefcase :size="14" />
                </div>
                <div class="job-copy">
                  <strong>{{ job.title }}</strong>
                  <p>{{ job.meta }}</p>
                </div>
                <button class="job-toggle-wrap" @click="toggleJobRpa(job.title)">
                  <span class="job-toggle-label">RPA</span>
                  <span class="toggle-switch" :class="{ active: job.rpaEnabled }">
                    <span class="toggle-knob"></span>
                  </span>
                </button>
              </div>
            </div>

            <div class="popup-panel toggle-panel">
              <div class="section-head">
                <span>插件设置</span>
                <span class="section-subhead">插件级</span>
              </div>
              <button
                v-for="item in pluginSettings"
                :key="item.id"
                class="toggle-row"
                @click="togglePluginSetting(item.id)"
              >
                <div class="toggle-copy">
                  <strong>{{ item.label }}</strong>
                  <p>{{ item.description }}</p>
                </div>
                <span class="toggle-switch" :class="{ active: item.enabled }">
                  <span class="toggle-knob"></span>
                </span>
              </button>
            </div>

            <div class="popup-panel action-panel">
              <button class="mini-btn mini-btn-light">
                <RefreshCw :size="14" />
                测试连接
              </button>
              <button class="mini-btn mini-btn-primary" @click="openWorkbench">
                进入工作台
                <ArrowRight :size="14" />
              </button>
            </div>
          </template>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.plugin-demo-page {
  min-height: 100vh;
  padding: 24px 28px 32px;
  background:
    radial-gradient(circle at 20% 15%, rgba(59, 130, 246, 0.16), transparent 22%),
    radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.08), transparent 18%),
    linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%);
  color: #0f172a;
}

.demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn,
.mini-btn,
.toggle-row,
.job-toggle-wrap,
.mode-btn {
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid #dbe2ec;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #334155;
  font-size: 13px;
  font-weight: 500;
}

.back-btn:hover {
  background: #ffffff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.mode-switch {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid #dbe2ec;
}

.mode-btn {
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.mode-btn.active {
  background: #2563eb;
  color: #ffffff;
}

.demo-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 96px);
}

.plugin-popup {
  width: 392px;
  max-width: calc(100vw - 32px);
  padding: 14px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 28px 70px rgba(15, 23, 42, 0.16),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset;
  backdrop-filter: blur(14px);
}

.popup-body {
  min-height: 548px;
  display: flex;
  flex-direction: column;
}

.popup-body.mode-syncing {
  justify-content: center;
}

.popup-header,
.popup-panel,
.section-head,
.toggle-row,
.panel-row,
.job-row,
.flow-step {
  display: flex;
}

.popup-header {
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2f7;
}

.popup-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-copy strong {
  font-size: 15px;
  color: #0f172a;
}

.brand-kicker {
  font-size: 11px;
  color: #64748b;
}

.popup-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-weight: 600;
}

.popup-status.pending {
  background: #eff6ff;
  color: #2563eb;
}

.popup-status.syncing {
  background: #eff6ff;
  color: #2563eb;
}

.popup-panel {
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  padding: 14px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.onboarding-hero,
.account-panel {
  background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
  border-color: #dbeafe;
}

.onboarding-hero {
  gap: 14px;
}

.syncing-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  padding: 24px 20px;
}

.syncing-spinner {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #ffffff;
  color: #2563eb;
  box-shadow: inset 0 0 0 1px #dbeafe;
}

.onboarding-hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
}

.hero-chip-link {
  background: rgba(219, 234, 254, 0.9);
}

.onboarding-hero-main {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.hero-icon,
.panel-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #ffffff;
  color: #2563eb;
  flex-shrink: 0;
}

.hero-copy,
.panel-copy,
.flow-copy,
.job-copy,
.toggle-copy {
  display: flex;
  flex-direction: column;
}

.syncing-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 260px;
}

.panel-label,
.section-subhead {
  font-size: 11px;
  color: #64748b;
}

.hero-copy strong,
.panel-copy strong,
.flow-copy strong,
.job-copy strong,
.toggle-copy strong {
  font-size: 13px;
  color: #0f172a;
}

.syncing-copy strong {
  font-size: 14px;
  line-height: 1.5;
  color: #0f172a;
}

.hero-copy p,
.panel-copy p,
.flow-copy p,
.job-copy p,
.toggle-copy p,
.flow-note p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: #64748b;
}

.syncing-copy p {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #64748b;
}

.section-head {
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.flow-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.flow-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.flow-index {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.flow-note {
  padding: 12px 14px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #dbeafe;
}

.sync-label {
  display: inline-flex;
  margin-bottom: 4px;
  font-size: 11px;
  color: #64748b;
}

.job-row {
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
}

.job-copy {
  flex: 1;
}

.job-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.job-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #ffffff;
  color: #2563eb;
  flex-shrink: 0;
}

.toggle-row {
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border: none;
  background: transparent;
  text-align: left;
}

.toggle-row + .toggle-row {
  border-top: 1px solid #e2e8f0;
}

.job-toggle-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  padding: 0;
}

.job-toggle-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.toggle-switch {
  width: 42px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: 999px;
  background: #cbd5e1;
  flex-shrink: 0;
}

.toggle-switch.active {
  justify-content: flex-end;
  background: #2563eb;
}

.toggle-knob {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #ffffff;
}

.action-panel {
  flex-direction: row;
  gap: 10px;
  margin-top: auto;
}

.onboarding-actions-bar {
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 6px;
}

.onboarding-actions-bar .mini-btn-primary {
  flex: 1.15;
}

.mini-btn {
  flex: 1;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
  border: 1px solid #dbe2ec;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.mini-btn-light {
  color: #334155;
}

.mini-btn-light:hover {
  background: #f8fafc;
}

.mini-btn-primary {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.mini-btn-primary:hover {
  background: #1d4ed8;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .plugin-demo-page {
    padding: 20px 16px 24px;
  }

  .demo-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .demo-stage {
    min-height: calc(100vh - 84px);
  }

  .popup-body {
    min-height: 520px;
  }

  .onboarding-actions-bar,
  .action-panel {
    flex-direction: column;
  }
}
</style>
