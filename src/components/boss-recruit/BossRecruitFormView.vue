<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  ArrowRight,
  Briefcase,
  Chrome,
  Clock,
  Download,
  UserCheck,
} from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import { recentTools, features, mockAccounts, defaultRecruitStrategyTemplate } from './mockData';
import type { BossAccount, RecruitStrategy } from './types';

const router = useRouter();
const route = useRoute();

const pluginDownloaded = ref(false);
const handleDownloadPlugin = () => { pluginDownloaded.value = true; };
const bindSuccessToastVisible = ref(false);
let bindSuccessToastTimer: number | null = null;

const showBindSuccessToast = () => {
  bindSuccessToastVisible.value = true;
  if (bindSuccessToastTimer !== null) {
    window.clearTimeout(bindSuccessToastTimer);
  }
  bindSuccessToastTimer = window.setTimeout(() => {
    bindSuccessToastVisible.value = false;
    bindSuccessToastTimer = null;
  }, 2200);
};

const baseAccount = mockAccounts[0] ?? { id: 'acc-001', name: '张招聘', company: 'XX科技有限公司', avatar: '', expiresAt: '', status: 'active' as const, followingCount: 3, todayResumes: 12 };
const currentAccount = ref<BossAccount | null>(null);
const hasAuthedAccount = computed(() => currentAccount.value !== null);
const confirmBindDialogVisible = ref(false);

const clearPendingBindQuery = () => {
  if (!route.query.pendingBind) return;
  const nextQuery = { ...route.query };
  delete nextQuery.pendingBind;
  router.replace({ name: 'boss-recruit', query: nextQuery });
};

const openBossRecruit = () => {
  router.push({
    name: 'boss-recruit-plugin-demo',
    query: { source: 'boss-recruit', mode: 'onboarding', returnAction: 'confirm-bind' },
  });
};

const closeConfirmBindDialog = () => {
  confirmBindDialogVisible.value = false;
  clearPendingBindQuery();
};

const confirmBindAccount = () => {
  if (!currentAccount.value) {
    currentAccount.value = { ...baseAccount };
  }
  showBindSuccessToast();
  confirmBindDialogVisible.value = false;
  clearPendingBindQuery();
};

const strategy = ref<RecruitStrategy>({ ...defaultRecruitStrategyTemplate });
strategy.value.dailyLimit = 60;
const strategyTab = ref<'general' | 'job'>('general');
const jobInfoConfig = ref({
  jobTitle: 'Java开发工程师',
  city: '上海',
  salaryRange: '20K-35K',
  requirement: '3年以上相关经验，熟悉主流后端技术栈',
});

interface TimeWindow {
  id: string;
  start: string;
  end: string;
}

let timeWindowSeed = 0;
const createTimeWindow = (start: string, end: string): TimeWindow => ({
  id: `window-${++timeWindowSeed}`,
  start,
  end,
});

const greetingTimeWindows = ref<TimeWindow[]>([
  createTimeWindow('09:00', '12:00'),
  createTimeWindow('14:00', '18:00'),
]);

const resumeTimeWindows = ref<TimeWindow[]>([
  createTimeWindow('12:00', '14:00'),
  createTimeWindow('18:00', '20:00'),
]);

const addGreetingTimeWindow = () => {
  greetingTimeWindows.value.push(createTimeWindow('09:00', '12:00'));
};

const removeGreetingTimeWindow = (id: string) => {
  greetingTimeWindows.value = greetingTimeWindows.value.filter((item) => item.id !== id);
};

const addResumeTimeWindow = () => {
  resumeTimeWindows.value.push(createTimeWindow('12:00', '14:00'));
};

const removeResumeTimeWindow = (id: string) => {
  resumeTimeWindows.value = resumeTimeWindows.value.filter((item) => item.id !== id);
};
const canEnterWorkbench = computed(() => hasAuthedAccount.value);
const isSavingStrategy = ref(false);
const saveStrategyConfig = () => {
  if (isSavingStrategy.value) return;
  isSavingStrategy.value = true;
  window.setTimeout(() => {
    isSavingStrategy.value = false;
  }, 700);
};
const enterWorkbench = () => {
  if (!canEnterWorkbench.value) return;
  router.push({ name: 'boss-recruit-workbench', query: { accountId: currentAccount.value!.id } });
};
const openPluginDemo = () => { router.push({ name: 'boss-recruit-plugin-demo' }); };

onMounted(() => {
  if (route.query.pendingBind === '1') {
    confirmBindDialogVisible.value = true;
  }
});
</script>

<template>
  <FormPageLayout :icon="UserCheck" title="boss招聘助手" subtitle="账号登录 + Chrome 插件联动的招聘自动化演示">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" :active-index="0" />
    </template>

    <template v-if="!hasAuthedAccount">
      <div class="form-section">
        <div class="install-cards">
          <div class="install-card">
            <div class="install-card-main">
              <div class="install-card-icon"><Monitor :size="24" /></div>
              <div class="install-card-body">
                <h4>Chrome 浏览器插件</h4>
                <p>支持 Chrome 90+ / Edge 90+ 浏览器</p>
              </div>
            </div>
            <div class="install-card-actions">
              <button class="install-btn install-btn-inline install-btn-light" @click="openPluginDemo"><Chrome :size="14" />插件 Demo</button>
              <button class="install-btn install-btn-inline" @click="handleDownloadPlugin"><Download :size="14" />下载插件安装包</button>
            </div>
          </div>
        </div>

        <div class="plugin-guide-list">
          <div class="plugin-guide-item">
            <span class="guide-index">1</span>
            <div class="guide-copy"><strong>下载安装包</strong><p>点击上方按钮下载 .crx 插件安装包</p></div>
          </div>
          <div class="plugin-guide-item">
            <span class="guide-index">2</span>
            <div class="guide-copy"><strong>安装到浏览器</strong><p>打开 Chrome 扩展程序页面，开启开发者模式，拖入安装包完成安装</p></div>
          </div>
          <div class="plugin-guide-item plugin-guide-item-action">
            <span class="guide-index">3</span>
            <div class="guide-copy guide-copy-main">
              <strong>绑定 boss 直聘账号</strong>
              <p>安装完成后，点击右侧按钮进入绑定流程。</p>
            </div>
            <button class="guide-action-btn" @click="openBossRecruit"><UserCheck :size="14" />绑定 boss 直聘账号</button>
          </div>
        </div>

        <div v-if="pluginDownloaded" class="step-success-hint"><Download :size="16" /><span>安装包已开始下载，请完成安装后进行账号绑定。</span></div>
      </div>
    </template>

    <template v-else>
      <div class="form-section">
        <div class="single-account-card" :class="{ empty: !currentAccount }">
          <div class="account-main">
            <div class="account-avatar"><UserCheck :size="22" /></div>
            <div class="account-copy">
              <template v-if="currentAccount">
                <div class="account-name-row">
                  <span class="account-name">{{ currentAccount.name }}</span>
                  <span class="account-sep">&middot;</span>
                  <span class="account-company">{{ currentAccount.company }}</span>
                </div>
                <div class="account-stats">
                  <span class="stat-chip"><Briefcase :size="13" />{{ currentAccount.followingCount }} 个关注中岗位</span>
                  <span class="stat-chip"><Clock :size="13" />会话有效至 {{ currentAccount.expiresAt }}</span>
                </div>
              </template>
              <template v-else>
                <div class="account-name-row"><span class="account-name">尚未授权招聘账号</span></div>
                <p class="empty-account-hint">请先完成 Boss 直聘账号绑定，再继续策略配置。</p>
              </template>
            </div>
          </div>
        </div>

        <div class="config-card">
          <div class="config-card-head">
            <div class="config-card-title"><Clock :size="16" />策略配置</div>
            <div class="config-tabs">
              <button
                type="button"
                class="config-tab-btn"
                :class="{ active: strategyTab === 'general' }"
                @click="strategyTab = 'general'"
              >
                通用设置
              </button>
              <button
                type="button"
                class="config-tab-btn"
                :class="{ active: strategyTab === 'job' }"
                @click="strategyTab = 'job'"
              >
                岗位信息
              </button>
            </div>
          </div>

          <div v-if="strategyTab === 'general'" class="schedule-layout">
            <div class="schedule-row">
              <div class="schedule-label-block">
                <label>每日打招呼配额</label>
                <p>每天最多打招呼的总次数</p>
              </div>
              <div class="schedule-quota-input">
                <input type="number" v-model.number="strategy.dailyLimit" class="config-input quota-input" min="1" max="500" />
                <span>次/天</span>
              </div>
            </div>

            <div class="schedule-row">
              <div class="schedule-label-block">
                <label>搜索打招呼时间窗</label>
                <p>可添加多个时间段</p>
              </div>
              <div class="schedule-window-list">
                <div v-for="item in greetingTimeWindows" :key="item.id" class="schedule-window-item">
                  <input v-model="item.start" type="time" class="config-input time-input" />
                  <span class="window-sep">→</span>
                  <input v-model="item.end" type="time" class="config-input time-input" />
                  <button type="button" class="window-remove-btn" @click="removeGreetingTimeWindow(item.id)">×</button>
                </div>
                <button type="button" class="window-add-btn" @click="addGreetingTimeWindow">+ 添加时间段</button>
              </div>
            </div>

            <div class="schedule-row">
              <div class="schedule-label-block">
                <label>取简历时间窗</label>
                <p>可添加多个时间段</p>
              </div>
              <div class="schedule-window-list">
                <div v-for="item in resumeTimeWindows" :key="item.id" class="schedule-window-item">
                  <input v-model="item.start" type="time" class="config-input time-input" />
                  <span class="window-sep">→</span>
                  <input v-model="item.end" type="time" class="config-input time-input" />
                  <button type="button" class="window-remove-btn" @click="removeResumeTimeWindow(item.id)">×</button>
                </div>
                <button type="button" class="window-add-btn" @click="addResumeTimeWindow">+ 添加时间段</button>
              </div>
            </div>
          </div>

          <div v-else class="job-info-layout">
            <div class="config-field">
              <label>岗位名称</label>
              <input v-model="jobInfoConfig.jobTitle" class="config-input" />
            </div>
            <div class="config-field">
              <label>工作城市</label>
              <input v-model="jobInfoConfig.city" class="config-input" />
            </div>
            <div class="config-field">
              <label>薪资范围</label>
              <input v-model="jobInfoConfig.salaryRange" class="config-input" />
            </div>
            <div class="config-field full-width">
              <label>岗位要求</label>
              <input v-model="jobInfoConfig.requirement" class="config-input" />
            </div>
          </div>
        </div>

      </div>
      <div class="step-actions step-actions-end">
        <div class="step-actions-right">
          <button class="step-btn secondary" :disabled="isSavingStrategy" @click="saveStrategyConfig">
            {{ isSavingStrategy ? '保存中...' : '保存配置' }}
          </button>
          <button class="step-btn primary" :disabled="!canEnterWorkbench" @click="enterWorkbench">进入工作台<ArrowRight :size="16" /></button>
        </div>
      </div>
    </template>

    <div v-if="bindSuccessToastVisible" class="bind-success-toast">
      Boss 账号绑定成功，可继续配置策略。
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="UserCheck" title="boss招聘助手" description="通过单账号授权和 Chrome 插件联动，演示招聘自动化的安装引导与运行状态。" :features="features" />
    </template>
  </FormPageLayout>

  <div v-if="confirmBindDialogVisible" class="confirm-bind-mask" @click.self="closeConfirmBindDialog">
    <div class="confirm-bind-dialog">
      <div class="confirm-bind-header">
        <h3>确认绑定 boss 直聘账号</h3>
        <button type="button" class="confirm-bind-close" @click="closeConfirmBindDialog">×</button>
      </div>
      <div class="confirm-bind-body">
        <p>确认后将完成账号绑定，并进入 boss 用户身份与策略配置。</p>
      </div>
      <div class="confirm-bind-footer">
        <button class="step-btn secondary" @click="closeConfirmBindDialog">取消</button>
        <button class="step-btn primary" @click="confirmBindAccount">确认绑定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles.css';

.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Step actions */
.step-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
.step-actions-single { justify-content: flex-end; }
.step-actions-end { justify-content: flex-end; }
.step-actions-right { display: inline-flex; align-items: center; gap: 10px; }
.step-btn { height: 42px; padding: 0 20px; border-radius: 10px; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.15s ease; }
.step-btn.primary { border: none; background: #2563eb; color: white; }
.step-btn.primary:hover:not(:disabled) { background: #1d4ed8; }
.step-btn.primary:disabled { background: #93c5fd; cursor: not-allowed; }
.step-btn.secondary { border: 1px solid #cbd5e1; background: #ffffff; color: #334155; }
.step-btn.secondary:hover:not(:disabled) { border-color: #94a3b8; background: #f8fafc; }
.step-btn.secondary:disabled { opacity: 0.7; cursor: not-allowed; }

/* Sections */
.form-section { margin-bottom: 8px; }
.section-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
.section-title { display: flex; align-items: center; margin: 0; font-size: 16px; font-weight: 600; color: #1e293b; }
.step-badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; margin-right: 8px; border-radius: 999px; background: #2563eb; color: #fff; font-size: 13px; font-weight: 600; }
.section-tools { display: flex; align-items: center; gap: 8px; }
.section-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; background: #f8fafc; border: 1px solid #dbeafe; color: #2563eb; font-size: 12px; font-weight: 500; }
.section-tag-button { cursor: pointer; transition: all 0.2s ease; }
.section-tag-button:hover { background: #eff6ff; border-color: #bfdbfe; }
.section-tag-button-strong { background: #eff6ff; }
.section-hint { margin: 0 0 16px; color: #94a3b8; font-size: 13px; }
.step-success-hint { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; color: #16a34a; font-size: 13px; font-weight: 500; margin-top: 16px; }

/* Install */
.install-cards { display: flex; gap: 16px; margin-bottom: 20px; }
.install-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px; background: white; border: 1px solid #e2e8f0; border-radius: 16px; flex: 1; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.install-card-main { display: flex; align-items: flex-start; gap: 16px; flex: 1; min-width: 0; }
.install-card-actions { display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0; }
.install-card:hover { border-color: #93c5fd; box-shadow: 0 4px 16px rgba(37, 99, 235, 0.06); }
.install-card-icon { width: 48px; height: 48px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.install-card-body h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #0f172a; }
.install-card-body p { margin: 0; font-size: 12px; color: #64748b; line-height: 1.5; }
.install-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; border-radius: 8px; background: #2563eb; color: white; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s ease; }
.install-btn-inline { flex-shrink: 0; white-space: nowrap; }
.install-btn:hover { background: #1d4ed8; }
.install-btn-light { border: 1px solid #bfdbfe; background: #eff6ff; color: #1d4ed8; }
.install-btn-light:hover { background: #dbeafe; }

/* Guide */
.plugin-guide-list { display: grid; gap: 10px; margin-bottom: 20px; }
.plugin-guide-item { display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px; border-radius: 14px; border: 1px solid #e2e8f0; background: #f8fafc; }
.guide-item-highlight { border-color: #dbeafe; background: #eff6ff; }
.guide-index { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 999px; background: #2563eb; color: #fff; font-size: 12px; font-weight: 600; flex-shrink: 0; }
.guide-copy { display: flex; flex-direction: column; gap: 2px; }
.guide-copy-main { flex: 1; min-width: 0; }
.guide-copy strong { font-size: 13px; color: #0f172a; }
.guide-copy p { margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; }
.plugin-guide-item-action { align-items: center; }
.guide-action-btn { margin-top: 8px; width: fit-content; height: 34px; padding: 0 14px; border-radius: 8px; border: none; background: #2563eb; color: #ffffff; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: background 0.15s ease; }
.plugin-guide-item-action .guide-action-btn { margin-top: 0; flex-shrink: 0; }
.guide-action-btn:hover { background: #1d4ed8; }

/* Connection bar */
.connection-test-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; }
.connection-test-status { display: flex; align-items: center; gap: 8px; }
.status-icon { color: #94a3b8; }
.status-icon.connected { color: #16a34a; }
.status-text { font-size: 13px; color: #64748b; font-weight: 500; }
.status-text.connected { color: #16a34a; font-weight: 600; }

/* Account card */
.single-account-card { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px; border: 1px solid #dbeafe; border-radius: 18px; background: linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%); }
.single-account-card { margin-bottom: 16px; }
.single-account-card.empty { border-style: dashed; border-color: #cbd5e1; background: #f8fafc; }
.account-main { display: flex; align-items: flex-start; gap: 16px; flex: 1; }
.account-avatar { width: 52px; height: 52px; border-radius: 16px; background: #dbeafe; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.account-copy { display: flex; flex-direction: column; gap: 8px; }
.account-name-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.account-name { font-size: 17px; font-weight: 600; color: #0f172a; }
.account-sep { color: #cbd5e1; }
.account-company { font-size: 14px; color: #64748b; }
.account-stats { display: flex; flex-wrap: wrap; gap: 10px; }
.stat-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,0.8); color: #334155; font-size: 13px; }
.empty-account-hint { margin: 0; font-size: 13px; color: #64748b; line-height: 1.6; }
.account-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.bind-success-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 120;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #166534;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

/* Buttons */
.primary-btn, .secondary-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; padding: 10px 18px; }
.primary-btn { border: none; background: #2563eb; color: #fff; }
.primary-btn:hover { background: #1d4ed8; }
.primary-btn:disabled { cursor: not-allowed; opacity: 0.55; }
.secondary-btn { border: 1px solid #cbd5e1; background: #fff; color: #334155; }
.secondary-btn:hover { border-color: #94a3b8; background: #f8fafc; }
.secondary-btn:disabled { cursor: not-allowed; opacity: 0.55; }

/* Config cards (step 3) */
.config-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px 24px; margin-bottom: 16px; }
.config-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.config-card-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #1e293b; }
.config-card-title svg { color: #2563eb; }
.config-tabs { display: inline-flex; align-items: center; gap: 6px; padding: 3px; border-radius: 999px; background: #f1f5f9; border: 1px solid #e2e8f0; }
.config-tab-btn { height: 28px; padding: 0 12px; border: none; border-radius: 999px; background: transparent; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
.config-tab-btn.active { background: #2563eb; color: #ffffff; }
.config-tab-btn:hover:not(.active) { color: #334155; background: #ffffff; }
.config-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 20px; }
.config-field { display: flex; flex-direction: column; gap: 6px; }
.config-field.full-width { grid-column: 1 / -1; }
.config-field label { font-size: 12px; font-weight: 600; color: #64748b; }
.config-input { height: 38px; padding: 0 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1e293b; outline: none; background: white; width: 100%; transition: border-color 0.15s ease; }
.config-input:focus { border-color: #60a5fa; }
.config-input-unit { display: flex; align-items: center; gap: 6px; }
.config-input-unit .config-input { flex: 1; }
.config-input-unit span { font-size: 12px; color: #94a3b8; white-space: nowrap; }

/* Schedule layout (运行时间与频率) */
.schedule-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.schedule-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px;
  align-items: start;
}

.schedule-label-block label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 3px;
}

.schedule-label-block p {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

.schedule-quota-input {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.quota-input {
  width: 92px;
}

.schedule-quota-input span {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.schedule-window-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-window-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.time-input {
  width: 118px;
}

.window-sep {
  color: #94a3b8;
  font-size: 13px;
}

.window-remove-btn {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
}

.window-remove-btn:hover {
  color: #64748b;
}

.window-add-btn {
  width: fit-content;
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.window-add-btn:hover {
  color: #1d4ed8;
}

.confirm-bind-mask {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.45);
}

.confirm-bind-dialog {
  width: min(460px, 100%);
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.24);
  overflow: hidden;
}

.confirm-bind-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid #e2e8f0;
}

.confirm-bind-header h3 {
  margin: 0;
  font-size: 16px;
  color: #0f172a;
}

.confirm-bind-close {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.confirm-bind-close:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.confirm-bind-body {
  padding: 18px;
}

.confirm-bind-body p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: #475569;
}

.confirm-bind-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 18px 18px;
}

.job-info-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 20px;
}

/* Option buttons */
.option-btns { display: flex; flex-wrap: wrap; gap: 8px; }
.option-btns button { padding: 8px 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #475569; font-size: 13px; cursor: pointer; transition: all 0.15s ease; }
.option-btns button.active { border-color: #2563eb; background: #2563eb; color: white; }
.option-btns button:hover:not(.active) { border-color: #93c5fd; background: #f8fbff; }

@media (max-width: 640px) {
  .install-cards { flex-direction: column; }
  .install-card { flex-direction: column; align-items: stretch; }
  .install-card-actions { width: 100%; }
  .install-btn-inline { width: 100%; justify-content: center; }
  .config-card-head { flex-direction: column; align-items: flex-start; }
  .config-tabs { width: 100%; }
  .config-tab-btn { flex: 1; justify-content: center; }
  .config-grid { grid-template-columns: 1fr; }
  .job-info-layout { grid-template-columns: 1fr; }
  .schedule-row { grid-template-columns: 1fr; }
  .schedule-window-item { flex-wrap: wrap; }
  .single-account-card, .section-header, .connection-test-bar { flex-direction: column; align-items: flex-start; }
  .plugin-guide-item-action { align-items: flex-start; flex-wrap: wrap; }
  .plugin-guide-item-action .guide-action-btn { margin-top: 8px; width: 100%; justify-content: center; }
  .account-actions, .step-actions, .confirm-bind-dialog { width: 100%; }
  .step-actions { flex-direction: column; gap: 10px; }
  .step-actions-right { width: 100%; }
  .step-actions .step-btn { width: 100%; justify-content: center; }
  .step-actions-right .step-btn { flex: 1; }
}
</style>
