<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  Chrome,
  LogOut,
  Link2,
  MoreHorizontal,
  UserCheck
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const demoMode = ref<'onboarding' | 'connected'>('onboarding');

const guideSteps = [
  {
    title: '在 boss 直聘页面打开插件',
    description: '需在 BOSS 直聘网页端（官网：',
    linkLabel: 'https://www.zhipin.com/',
    linkUrl: 'https://www.zhipin.com/',
    descriptionSuffix: '）手动打开插件。点击“绑定身份”后会自动跳转至金盾-涌见 AI 智能体，确认后即可正常使用。',
    actionLabel: '',
    actionKey: '',
  },
  {
    title: '点击绑定按钮',
    description: '点击后会自动打开「金盾-涌见 AI智能体」页面，完成身份绑定。',
    actionLabel: '立即绑定身份',
    actionKey: 'bind',
  },
  {
    title: '在金盾-涌见AI智能体完成配置',
    description: '在页面中完成剩余配置，并启动自动化任务。',
    actionLabel: '',
    actionKey: '',
  },
];

const jobItems = ref([
  {
    title: 'Java开发工程师',
    meta: '上海 · 25K-35K',
  },
  {
    title: '前端开发工程师',
    meta: '上海 · 20K-30K',
  },
  {
    title: '产品经理',
    meta: '上海 · 30K-45K',
  },
]);

const autoTaskEnabled = ref(false);
const isSyncingTaskConfig = ref(false);
const showConfiguredJobs = ref(false);
const accountMenuOpen = ref(false);
const accountMenuRef = ref<HTMLElement | null>(null);
const runningStatusMessages = [
  '自动化任务已启动',
  '正在给牛人打招呼',
  '正在获取简历',
  '正在同步会话状态',
];
const runningStatusIndex = ref(0);
let runningStatusTimer: number | null = null;
const pageToastVisible = ref(false);
const pageToastText = ref('');
let pageToastTimer: number | null = null;

const startRunningStatusTicker = () => {
  if (runningStatusTimer !== null) return;
  runningStatusTimer = window.setInterval(() => {
    runningStatusIndex.value = (runningStatusIndex.value + 1) % runningStatusMessages.length;
  }, 1800);
};

const stopRunningStatusTicker = () => {
  if (runningStatusTimer !== null) {
    window.clearInterval(runningStatusTimer);
    runningStatusTimer = null;
  }
  runningStatusIndex.value = 0;
};

const showPageToast = (text: string) => {
  pageToastText.value = text;
  pageToastVisible.value = true;
  if (pageToastTimer !== null) {
    window.clearTimeout(pageToastTimer);
  }
  pageToastTimer = window.setTimeout(() => {
    pageToastVisible.value = false;
    pageToastTimer = null;
  }, 1800);
};

const toggleAutoTask = () => {
  if (!showConfiguredJobs.value) {
    showPageToast('请先同步配置');
    return;
  }
  autoTaskEnabled.value = !autoTaskEnabled.value;
};

const syncTaskConfig = () => {
  if (isSyncingTaskConfig.value) return;
  isSyncingTaskConfig.value = true;
  window.setTimeout(() => {
    isSyncingTaskConfig.value = false;
    showConfiguredJobs.value = true;
  }, 900);
};

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value;
};

const closeAccountMenu = () => {
  accountMenuOpen.value = false;
};

const logoutAccount = () => {
  autoTaskEnabled.value = false;
  showConfiguredJobs.value = false;
  accountMenuOpen.value = false;
  demoMode.value = 'onboarding';
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!accountMenuOpen.value) return;
  const target = event.target as Node | null;
  if (accountMenuRef.value && target && !accountMenuRef.value.contains(target)) {
    closeAccountMenu();
  }
};

watch(
  autoTaskEnabled,
  (enabled) => {
    if (enabled) {
      startRunningStatusTicker();
      return;
    }
    stopRunningStatusTicker();
  },
  { immediate: true }
);

const runSingleAction = (_action: string) => {
  if (!showConfiguredJobs.value) {
    showPageToast('请先同步配置');
    return;
  }
  // Demo action trigger placeholder.
};

const goBack = () => {
  router.push({ name: 'boss-recruit' });
};

const openBossSite = () => {
  window.open('https://www.zhipin.com/', '_blank', 'noopener,noreferrer');
};

const openYongjianAgentPage = () => {
  window.open(`${window.location.origin}/enterprise-search`, '_blank', 'noopener,noreferrer');
};

const handleGuideAction = (actionKey: string) => {
  if (actionKey === 'boss') {
    openBossSite();
    return;
  }
  if (actionKey === 'bind') {
    if (route.query.source === 'boss-recruit' && route.query.returnAction === 'confirm-bind') {
      router.push({ name: 'boss-recruit', query: { pendingBind: '1' } });
      return;
    }
    openYongjianAgentPage();
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  if (route.query.mode === 'connected') {
    demoMode.value = 'connected';
    return;
  }
  demoMode.value = 'onboarding';
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
  stopRunningStatusTicker();
  if (pageToastTimer !== null) {
    window.clearTimeout(pageToastTimer);
    pageToastTimer = null;
  }
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
          <div class="popup-status" :class="{ pending: demoMode !== 'connected' }">
            <Link2 v-if="demoMode === 'onboarding'" :size="14" />
            <CheckCircle2 v-else :size="14" />
            {{ demoMode === 'onboarding' ? '待连接' : '已绑定' }}
          </div>
        </div>

        <div class="popup-body" :class="`mode-${demoMode}`">
          <template v-if="demoMode === 'onboarding'">
            <div class="popup-panel onboarding-flow">
              <div class="section-head">
                <span>连接引导</span>
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
                    <p>
                      {{ step.description }}
                      <a
                        v-if="step.linkUrl && step.linkLabel"
                        :href="step.linkUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flow-link"
                      >
                        {{ step.linkLabel }}
                      </a>
                      {{ step.descriptionSuffix ?? '' }}
                    </p>
                    <button
                      v-if="step.actionLabel"
                      class="flow-action-btn"
                      :class="{ 'flow-action-btn-primary': step.actionKey === 'bind' }"
                      @click="handleGuideAction(step.actionKey)"
                    >
                      {{ step.actionLabel }}
                      <ArrowRight :size="13" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="flow-note">
                <span class="sync-label">同步方式</span>
                <p>完成以上三步后，即可在金盾-涌见 AI智能体中继续后续自动化招聘流程。</p>
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
                  <span class="panel-label">用户名</span>
                  <strong>ID:2033840993572360193</strong>
                </div>
                <div class="auto-task-actions account-actions-inline">
                  <button class="sync-config-btn" @click.stop="syncTaskConfig">
                    {{ isSyncingTaskConfig ? '同步中...' : '同步配置' }}
                  </button>
                  <div ref="accountMenuRef" class="account-menu">
                    <button class="account-menu-trigger" @click.stop="toggleAccountMenu">
                      <MoreHorizontal :size="16" />
                    </button>
                    <div v-if="accountMenuOpen" class="account-menu-dropdown">
                      <button class="account-menu-item danger" @click.stop="logoutAccount">
                        <LogOut :size="14" />
                        退出登录
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="popup-panel toggle-panel auto-task-panel">
              <button class="toggle-row" @click="toggleAutoTask">
                <div class="toggle-copy">
                  <strong>启动自动化任务</strong>
                  <p>开启后按照金盾-涌见AI智能体中的策略自动执行任务</p>
                </div>
                <span class="toggle-switch success" :class="{ active: autoTaskEnabled }">
                  <span class="toggle-knob"></span>
                </span>
              </button>
              <div v-if="autoTaskEnabled" class="auto-task-running">
                <span class="running-dot"></span>
                <span class="running-text">
                  <span
                    class="running-text-track"
                    :style="{ transform: `translateY(-${runningStatusIndex * 18}px)` }"
                  >
                    <span
                      v-for="message in runningStatusMessages"
                      :key="message"
                      class="running-text-item"
                    >
                      {{ message }}
                    </span>
                  </span>
                </span>
                <span class="running-orbit" aria-hidden="true">
                  <i class="orbit-core"></i>
                  <i class="orbit-ring"></i>
                </span>
              </div>
            </div>

            <div v-if="showConfiguredJobs" class="popup-panel jobs-panel">
              <div class="section-head">
                <span>已配置岗位</span>
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
                  <strong>{{ job.title }}<span class="job-meta-inline"> · {{ job.meta }}</span></strong>
                </div>
              </div>
            </div>

            <div class="popup-panel single-actions-panel">
              <div class="single-actions-title">更多操作</div>
              <div class="single-actions-grid">
                <button
                  class="single-actions-btn has-tooltip"
                  data-tooltip="对当前推荐页执行一次性的打招呼操作"
                  @click="runSingleAction('推荐页打招呼')"
                >
                  推荐页打招呼
                </button>
                <button class="single-actions-btn" @click="runSingleAction('聊天页取简历')">聊天页取简历</button>
                <button class="single-actions-btn" @click="runSingleAction('同步开放职位')">同步开放职位</button>
              </div>
            </div>

          </template>
        </div>
        <div v-if="pageToastVisible" class="page-toast">
          {{ pageToastText }}
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
  position: relative;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.popup-panel {
  flex-direction: column;
  gap: 10px;
  margin-bottom: 0;
  padding: 14px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.account-panel {
  background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
  border-color: #dbeafe;
}

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

.panel-copy,
.flow-copy,
.job-copy,
.toggle-copy {
  display: flex;
  flex-direction: column;
}

.panel-label,
.section-subhead {
  font-size: 11px;
  color: #64748b;
}

.panel-copy strong,
.flow-copy strong,
.job-copy strong,
.toggle-copy strong {
  font-size: 13px;
  color: #0f172a;
}

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

.flow-link {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
}

.section-head {
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.flow-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flow-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 10px 10px 8px;
  border-radius: 12px;
  border: 1px solid #dbeafe;
  background: #f8fbff;
}

.flow-index {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
}

.flow-copy {
  gap: 2px;
}

.flow-note {
  padding: 12px 14px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #dbeafe;
}

.flow-action-btn {
  margin-top: 8px;
  width: fit-content;
  height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #2563eb;
  background: #ffffff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.flow-action-btn:hover {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
}

.flow-action-btn-primary {
  background: #2563eb;
  color: #ffffff;
}

.flow-action-btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.sync-label {
  display: inline-flex;
  margin-bottom: 4px;
  font-size: 11px;
  color: #64748b;
}

.job-row {
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #e2e8f0;
}

.job-copy {
  flex: 1;
}

.job-copy strong {
  font-size: 12px;
  line-height: 1.4;
}

.job-meta-inline {
  color: #64748b;
  font-weight: 500;
}

.job-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.job-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
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

.single-actions-panel {
  gap: 10px;
}

.single-actions-title {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.single-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.single-actions-btn {
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f1f5f9;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.single-actions-btn:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
}

.single-actions-btn.has-tooltip {
  position: relative;
}

.single-actions-btn.has-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%) translateY(4px);
  min-width: 170px;
  max-width: 220px;
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.92);
  color: #ffffff;
  font-size: 11px;
  line-height: 1.5;
  font-weight: 500;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease;
  z-index: 30;
  white-space: normal;
}

.single-actions-btn.has-tooltip::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: calc(100% + 2px);
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid rgba(15, 23, 42, 0.92);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.18s ease, visibility 0.18s ease;
  z-index: 30;
}

.single-actions-btn.has-tooltip:hover::after,
.single-actions-btn.has-tooltip:hover::before {
  opacity: 1;
  visibility: visible;
}

.single-actions-btn.has-tooltip:hover::after {
  transform: translateX(-50%) translateY(0);
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

.toggle-switch.success.active {
  background: #16a34a;
}

.toggle-knob {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #ffffff;
}

.auto-task-panel .toggle-row {
  padding-top: 4px;
  padding-bottom: 4px;
}

.auto-task-running {
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px dashed #bfdbfe;
  display: flex;
  align-items: center;
  gap: 8px;
}

.running-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #16a34a;
  box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.55);
  animation: runningDotPulse 1.6s ease-out infinite;
}

.running-text {
  height: 18px;
  overflow: hidden;
  display: inline-flex;
  align-items: flex-start;
  font-size: 12px;
  font-weight: 600;
  color: #15803d;
  letter-spacing: 0.2px;
}

.running-text-track {
  display: flex;
  flex-direction: column;
  transition: transform 0.38s ease;
}

.running-text-item {
  height: 18px;
  line-height: 18px;
  white-space: nowrap;
}

.running-orbit {
  margin-left: auto;
  width: 22px;
  height: 22px;
  position: relative;
  flex-shrink: 0;
}

.orbit-core {
  position: absolute;
  inset: 5px;
  border-radius: 999px;
  background: #16a34a;
  box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.5);
  animation: orbitCoreBreath 1.2s ease-in-out infinite;
}

.orbit-ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 2px solid rgba(34, 197, 94, 0.18);
  border-top-color: rgba(34, 197, 94, 0.95);
  border-right-color: rgba(34, 197, 94, 0.75);
  animation: orbitRingSpin 1s linear infinite;
  filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.35));
}

.running-orbit::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-top: -2px;
  margin-left: -2px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.7);
  transform-origin: 0 0;
  animation: orbitParticleSpin 1s linear infinite;
}

@keyframes runningDotPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.55);
    opacity: 1;
  }
  70% {
    box-shadow: 0 0 0 8px rgba(22, 163, 74, 0);
    opacity: 0.85;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
    opacity: 1;
  }
}

@keyframes orbitCoreBreath {
  0%,
  100% {
    transform: scale(0.8);
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.55);
  }
  50% {
    transform: scale(1.12);
    box-shadow: 0 0 0 6px rgba(22, 163, 74, 0);
  }
}

@keyframes orbitRingSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes orbitParticleSpin {
  from {
    transform: rotate(0deg) translateX(10px);
    opacity: 1;
  }
  to {
    transform: rotate(360deg) translateX(10px);
    opacity: 1;
  }
}

.auto-task-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.sync-config-btn {
  height: 26px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sync-config-btn:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

.account-actions-inline {
  margin-bottom: 0;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.account-menu {
  position: relative;
}

.account-menu-trigger {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #dbe2ec;
  background: #ffffff;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.account-menu-trigger:hover {
  border-color: #bfdbfe;
  color: #2563eb;
  background: #eff6ff;
}

.account-menu-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 124px;
  padding: 6px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
  z-index: 20;
}

.account-menu-item {
  width: 100%;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.account-menu-item:hover {
  background: #f8fafc;
}

.account-menu-item.danger {
  color: #dc2626;
}

.account-menu-item.danger:hover {
  background: #fef2f2;
}

.action-panel {
  flex-direction: row;
  gap: 10px;
  margin-top: auto;
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

.page-toast {
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  z-index: 30;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.88);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.24);
  pointer-events: none;
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

  .action-panel {
    flex-direction: column;
  }

  .single-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
