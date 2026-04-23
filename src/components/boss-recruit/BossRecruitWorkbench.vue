<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  UserCheck,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  Briefcase,
  MessageSquare,
  FileUser,
  Users,
  Plus,
  Star,
  ChevronLeft,
  Archive,
  Download,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings2,
  X
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';
import type { BossAccount, BossJD, RecruitStrategy } from './types';
import { mockJdList, mockResumes, mockAccounts, mockHistoricalResumes, defaultRecruitStrategyTemplate } from './mockData';

const router = useRouter();
const route = useRoute();

// Current account from route query
const currentAccount = ref<BossAccount | null>(null);

// JD list
const jdList = ref<BossJD[]>([...mockJdList]);
const selectedJdId = ref<number | null>(null);

// Sidebar tab: 'following' or 'archived'
const sidebarTab = ref<'following' | 'archived'>('following');

// Computed: split JD list by following status
const followingJds = computed(() => jdList.value.filter(jd => jd.isFollowing && jd.jobStatus !== 'closed'));
const unfollowedJds = computed(() => jdList.value.filter(jd => !jd.isFollowing && jd.jobStatus !== 'closed'));
const archivedJds = computed(() => jdList.value.filter(jd => jd.jobStatus === 'closed'));

// Check if current JD is archived
const isArchivedJd = computed(() => currentJd.value?.jobStatus === 'closed');

// Current selected JD
const currentJd = computed(() => {
  if (selectedJdId.value === null) return null;
  return jdList.value.find(jd => jd.id === selectedJdId.value) || null;
});

// Dashboard stats for current JD
const dashboardStats = computed(() => {
  const jd = currentJd.value;
  if (!jd) {
    return { todayGreetings: 0, todayResumes: 0, replyRate: '0', totalResumes: 0 };
  }
  if (jd.jobStatus === 'closed') {
    // Archived JD: show historical stats
    const total = jd.totalResumes || jd.resumeCount || 0;
    const views = jd.viewCount || 0;
    return {
      todayGreetings: views,
      todayResumes: total,
      replyRate: views > 0 ? ((total / views) * 100).toFixed(1) : '0',
      totalResumes: total,
    };
  }
  return {
    todayGreetings: jd.todayGreetings || 0,
    todayResumes: jd.todayResumes || 0,
    replyRate: (jd.todayGreetings || 0) > 0 ? (((jd.todayResumes || 0) / (jd.todayGreetings || 1)) * 100).toFixed(1) : '0',
    totalResumes: jd.totalResumes || 0,
  };
});

// Current resume list based on JD type
const currentResumes = computed(() => {
  if (!currentJd.value) return [];
  return currentJd.value.jobStatus === 'closed' ? mockHistoricalResumes : mockResumes;
});

const defaultStrategyTemplate = ref<RecruitStrategy>({ ...defaultRecruitStrategyTemplate });
const strategyEditorMode = ref<'job' | null>(null);
const strategyDraft = ref<RecruitStrategy>({ ...defaultRecruitStrategyTemplate });

const createStrategyCopy = (strategy: RecruitStrategy): RecruitStrategy => ({ ...strategy });
const createEditableStrategy = (strategy?: RecruitStrategy): RecruitStrategy => ({
  ...defaultRecruitStrategyTemplate,
  startTime: strategy?.startTime ?? defaultRecruitStrategyTemplate.startTime,
  endTime: strategy?.endTime ?? defaultRecruitStrategyTemplate.endTime,
  dailyLimit: strategy?.dailyLimit ?? defaultRecruitStrategyTemplate.dailyLimit,
  hourlyLimit: strategy?.hourlyLimit ?? defaultRecruitStrategyTemplate.hourlyLimit,
  minInterval: strategy?.minInterval ?? defaultRecruitStrategyTemplate.minInterval,
  maxInterval: strategy?.maxInterval ?? defaultRecruitStrategyTemplate.maxInterval,
});
const isStrategyUsingDefault = (strategy: RecruitStrategy) => (
  strategy.startTime === defaultStrategyTemplate.value.startTime
  && strategy.endTime === defaultStrategyTemplate.value.endTime
  && strategy.dailyLimit === defaultStrategyTemplate.value.dailyLimit
  && strategy.hourlyLimit === defaultStrategyTemplate.value.hourlyLimit
  && strategy.minInterval === defaultStrategyTemplate.value.minInterval
  && strategy.maxInterval === defaultStrategyTemplate.value.maxInterval
);

const currentEffectiveStrategy = computed(() => {
  const jd = currentJd.value;
  if (!jd || jd.strategyMode !== 'custom' || !jd.strategyOverride) {
    return defaultStrategyTemplate.value;
  }
  return jd.strategyOverride;
});

const currentStrategySummaryText = computed(() => {
  const strategy = currentEffectiveStrategy.value;
  return `${strategy.startTime}-${strategy.endTime} · ${strategy.dailyLimit}次/天 / ${strategy.hourlyLimit}次/小时 · ${strategy.minInterval}-${strategy.maxInterval}秒间隔`;
});

const canEditCurrentJobStrategy = computed(() => !!currentJd.value && !isArchivedJd.value);
const canResetCurrentJobStrategy = computed(() => !!currentJd.value && currentJd.value.strategyMode === 'custom' && !isArchivedJd.value);

const openCurrentJobStrategyEditor = () => {
  if (!currentJd.value || isArchivedJd.value) return;
  strategyEditorMode.value = 'job';
  strategyDraft.value = createEditableStrategy(
    currentJd.value.strategyOverride ?? currentEffectiveStrategy.value
  );
};

const closeStrategyEditor = () => {
  strategyEditorMode.value = null;
};

const saveStrategyEditor = () => {
  if (strategyEditorMode.value === 'job' && currentJd.value) {
    const nextStrategy = createEditableStrategy(strategyDraft.value);
    if (isStrategyUsingDefault(nextStrategy)) {
      currentJd.value.strategyMode = 'inherit';
      currentJd.value.strategyOverride = null;
    } else {
      currentJd.value.strategyMode = 'custom';
      currentJd.value.strategyOverride = createStrategyCopy(nextStrategy);
    }
  }
  closeStrategyEditor();
};

const resetCurrentJobStrategyToDefault = () => {
  if (!currentJd.value) return;
  currentJd.value.strategyMode = 'inherit';
  currentJd.value.strategyOverride = null;
  strategyDraft.value = createEditableStrategy(defaultStrategyTemplate.value);
  closeStrategyEditor();
};

// Load account on mount
onMounted(() => {
  const accountId = route.query.accountId as string;
  if (accountId) {
    const account = mockAccounts.find(a => a.id === accountId);
    if (account && account.status === 'active') {
      currentAccount.value = account;
      // Auto-select first following JD
      if (followingJds.value.length > 0) {
        selectedJdId.value = followingJds.value[0]!.id;
      }
      return;
    }
  }
  // No valid account, redirect back to form page
  router.replace({ name: 'boss-recruit' });
});

// Go back to form page
const goBack = () => {
  router.push({ name: 'boss-recruit' });
};

// Select JD
const selectJd = (id: number) => {
  selectedJdId.value = id;
};

// Follow a JD
const followJd = (jd: BossJD) => {
  jd.isFollowing = true;
  jd.followStatus = 'running';
  jd.todayGreetings = 0;
  jd.todayResumes = 0;
  jd.totalResumes = 0;
  jd.strategyMode = 'inherit';
  jd.strategyOverride = null;
  selectedJdId.value = jd.id;
};

// Unfollow a JD
const unfollowJd = (jd: BossJD) => {
  jd.isFollowing = false;
  jd.followStatus = undefined;
  jd.todayGreetings = undefined;
  jd.todayResumes = undefined;
  jd.totalResumes = undefined;
  if (selectedJdId.value === jd.id) {
    selectedJdId.value = followingJds.value.length > 0 ? followingJds.value[0]!.id : null;
  }
};

// Toggle JD running/paused
const toggleJdStatus = (jd: BossJD) => {
  jd.followStatus = jd.followStatus === 'running' ? 'paused' : 'running';
};

// Sync JD list
const syncJdList = () => {
  const currentStateById = new Map(jdList.value.map((jd) => [jd.id, jd]));
  jdList.value = mockJdList.map((jd) => {
    const current = currentStateById.get(jd.id);
    if (!current) return { ...jd };
    return {
      ...jd,
      isFollowing: current.isFollowing,
      followStatus: current.followStatus,
      todayGreetings: current.todayGreetings,
      todayResumes: current.todayResumes,
      totalResumes: current.totalResumes,
      strategyMode: current.strategyMode,
      strategyOverride: current.strategyOverride ? { ...current.strategyOverride } : null,
    };
  });
};

// Switch sidebar tab
const switchSidebarTab = (tab: 'following' | 'archived') => {
  sidebarTab.value = tab;
};

// Match score style
const getScoreClass = (score: number) => {
  if (score >= 85) return 'score-high';
  if (score >= 70) return 'score-medium';
  return 'score-low';
};

// Date filter
const dateStart = ref('');
const dateEnd = ref('');

// Sort state: field + direction
const sortField = ref<string | null>(null);
const sortDirection = ref<'asc' | 'desc'>('desc');

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'desc';
  }
};

const getSortIcon = (field: string) => {
  if (sortField.value !== field) return ArrowUpDown;
  return sortDirection.value === 'asc' ? ArrowUp : ArrowDown;
};

</script>

<template>
  <div class="workbench-page">
    <!-- Top Bar -->
    <header class="top-bar">
      <div class="top-bar-inner">
        <div class="top-left">
          <button class="back-btn" @click="goBack">
            <ChevronLeft :size="18" />
            返回账号管理
          </button>
          <div class="top-divider"></div>
          <div v-if="currentAccount" class="account-badge">
            <div class="account-avatar-sm">
              <UserCheck :size="16" />
            </div>
            <span class="account-name-sm">{{ currentAccount.name }}</span>
            <span class="account-sep">&middot;</span>
            <span class="account-company-sm">{{ currentAccount.company }}</span>
          </div>
        </div>
        <div class="top-right"></div>
      </div>
    </header>

    <!-- Body: Sidebar + Content -->
    <div class="body-layout">
      <!-- Left Sidebar -->
      <aside class="jd-sidebar">
        <button class="sync-btn" @click="syncJdList">
          <RefreshCw :size="14" />
          同步岗位
        </button>
        <!-- Sidebar Tabs -->
        <div class="sidebar-tabs">
          <button
            class="sidebar-tab"
            :class="{ active: sidebarTab === 'following' }"
            @click="switchSidebarTab('following')"
          >
            <Briefcase :size="13" />
            关注中 ({{ followingJds.length }})
          </button>
          <button
            class="sidebar-tab"
            :class="{ active: sidebarTab === 'archived' }"
            @click="switchSidebarTab('archived')"
          >
            <Archive :size="13" />
            历史岗位 ({{ archivedJds.length }})
          </button>
        </div>

        <!-- Following list -->
        <div v-if="sidebarTab === 'following'" class="sidebar-group">
          <div class="jd-list">
            <div
              v-for="jd in followingJds"
              :key="jd.id"
              class="jd-item"
              :class="{ active: selectedJdId === jd.id }"
              @click="selectJd(jd.id)"
            >
              <div class="jd-item-header">
                <Briefcase :size="14" class="jd-icon" />
                <span class="jd-name">{{ jd.jobName }}</span>
              </div>
              <div class="jd-item-meta">
                <span class="jd-salary">{{ jd.salaryRange }}</span>
                <span class="jd-status-badge" :class="jd.followStatus">
                  <span class="status-dot"></span>
                  {{ jd.followStatus === 'running' ? '运行中' : '已暂停' }}
                </span>
              </div>
              <div class="jd-item-stats">
                <span><MessageSquare :size="11" /> {{ jd.todayGreetings || 0 }}</span>
                <span><FileUser :size="11" /> {{ jd.todayResumes || 0 }}</span>
                <span><Users :size="11" /> {{ jd.totalResumes || 0 }}</span>
              </div>
              <button
                class="jd-toggle-btn"
                :class="{ paused: jd.followStatus === 'paused' }"
                @click.stop="toggleJdStatus(jd)"
              >
                <component :is="jd.followStatus === 'running' ? Pause : Play" :size="12" />
                {{ jd.followStatus === 'running' ? '暂停' : '启动' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Archived list -->
        <div v-if="sidebarTab === 'archived'" class="sidebar-group">
          <div class="jd-list">
            <div
              v-for="jd in archivedJds"
              :key="jd.id"
              class="jd-item archived"
              :class="{ active: selectedJdId === jd.id }"
              @click="selectJd(jd.id)"
            >
              <div class="jd-item-header">
                <Archive :size="14" class="archived-icon" />
                <span class="jd-name">{{ jd.jobName }}</span>
              </div>
              <div class="jd-item-meta">
                <span class="jd-salary">{{ jd.salaryRange }}</span>
                <span class="jd-status-badge closed">
                  已关闭
                </span>
              </div>
              <div class="jd-item-stats">
                <span><Users :size="11" /> {{ jd.totalResumes || jd.resumeCount }}</span>
                <span class="archived-date">{{ jd.closedDate }}</span>
              </div>
            </div>
          </div>
        </div>

      </aside>

      <!-- Right Content -->
      <main class="main-content">
        <div class="content-inner">
          <!-- JD selected (following or archived): show stats + resume table -->
          <template v-if="currentJd && (currentJd.isFollowing || isArchivedJd)">
            <div class="strategy-strip" :class="{ readonly: isArchivedJd }">
              <div class="strategy-strip-main">
                <span class="strategy-strip-label">运行策略</span>
                <p class="strategy-strip-text">{{ currentStrategySummaryText }}</p>
              </div>
              <button
                class="strategy-strip-btn"
                :disabled="!canEditCurrentJobStrategy"
                @click="openCurrentJobStrategyEditor"
              >
                <Settings2 :size="14" />
                {{ isArchivedJd ? '只读查看' : '编辑策略' }}
              </button>
            </div>

            <!-- Dashboard Stats -->
            <div class="dashboard">
              <div class="stats-row">
                <div class="stat-card primary">
                  <div class="stat-icon"><MessageSquare :size="20" /></div>
                  <div class="stat-info">
                    <div class="stat-value">{{ dashboardStats.todayGreetings }}</div>
                    <div class="stat-label">{{ isArchivedJd ? '累计浏览' : '今日打招呼' }}</div>
                  </div>
                </div>
                <div class="stat-card success">
                  <div class="stat-icon"><FileUser :size="20" /></div>
                  <div class="stat-info">
                    <div class="stat-value">{{ dashboardStats.todayResumes }}</div>
                    <div class="stat-label">{{ isArchivedJd ? '累计简历' : '今日收简历' }}</div>
                  </div>
                </div>
                <div class="stat-card warning">
                  <div class="stat-icon"><TrendingUp :size="20" /></div>
                  <div class="stat-info">
                    <div class="stat-value">{{ dashboardStats.replyRate }}%</div>
                    <div class="stat-label">{{ isArchivedJd ? '投递转化率' : '回复率' }}</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><Users :size="20" /></div>
                  <div class="stat-info">
                    <div class="stat-value">{{ dashboardStats.totalResumes }}</div>
                    <div class="stat-label">累计简历</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resume Table -->
            <div class="resume-section">
              <div class="resume-section-header">
                <h2>简历列表</h2>
                <div class="resume-actions">
                  <div class="date-filter">
                    <Calendar :size="14" class="date-icon" />
                    <input type="date" v-model="dateStart" class="date-input" />
                    <span class="date-sep">~</span>
                    <input type="date" v-model="dateEnd" class="date-input" />
                  </div>
                  <button class="batch-btn">
                    <Download :size="14" />
                    一键下载
                  </button>
                  <button class="batch-btn primary">
                    <FileUser :size="14" />
                    一键分析
                  </button>
                </div>
              </div>
              <div class="resume-table">
                <div class="table-header">
                  <span class="col-name">候选人</span>
                  <span class="col-exp sortable" @click="toggleSort('exp')">
                    工作年限
                    <component :is="getSortIcon('exp')" :size="12" class="sort-icon" :class="{ active: sortField === 'exp' }" />
                  </span>
                  <span class="col-edu sortable" @click="toggleSort('edu')">
                    学历
                    <component :is="getSortIcon('edu')" :size="12" class="sort-icon" :class="{ active: sortField === 'edu' }" />
                  </span>
                  <span class="col-salary sortable" @click="toggleSort('salary')">
                    期望薪资
                    <component :is="getSortIcon('salary')" :size="12" class="sort-icon" :class="{ active: sortField === 'salary' }" />
                  </span>
                  <span class="col-score sortable" @click="toggleSort('score')">
                    匹配度
                    <component :is="getSortIcon('score')" :size="12" class="sort-icon" :class="{ active: sortField === 'score' }" />
                  </span>
                  <span class="col-action">操作</span>
                </div>
                <div class="table-body">
                  <div v-for="resume in currentResumes" :key="resume.id" class="table-row">
                    <span class="col-name">
                      <div class="candidate-info">
                        <span class="candidate-name">{{ resume.name }}</span>
                        <span class="candidate-company">{{ resume.company }}</span>
                      </div>
                    </span>
                    <span class="col-exp">{{ resume.experience }}</span>
                    <span class="col-edu">{{ resume.education }}</span>
                    <span class="col-salary">{{ resume.salary }}</span>
                    <span class="col-score">
                      <div class="match-score" :class="getScoreClass(resume.matchScore)">
                        {{ resume.matchScore }}%
                      </div>
                    </span>
                    <span class="col-action">
                      <button class="download-btn">
                        <Download :size="14" />
                        下载简历
                      </button>
                      <button class="analyze-btn">
                        <FileUser :size="14" />
                        简历分析
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Unfollowed JD selected: show info + follow button -->
          <template v-else-if="currentJd && !currentJd.isFollowing && !isArchivedJd">
            <div class="unfollowed-detail">
              <div class="unfollowed-card">
                <Briefcase :size="40" class="unfollowed-detail-icon" />
                <h2>{{ currentJd.jobName }}</h2>
                <div class="unfollowed-meta">
                  <span class="meta-item">{{ currentJd.salaryRange }}</span>
                  <span class="meta-sep">&middot;</span>
                  <span class="meta-item">{{ currentJd.location }}</span>
                  <span class="meta-sep">&middot;</span>
                  <span class="meta-item">{{ currentJd.experience }}</span>
                  <span class="meta-sep">&middot;</span>
                  <span class="meta-item">{{ currentJd.education }}</span>
                </div>
                <div class="unfollowed-stats">
                  <span>浏览 {{ currentJd.viewCount }}</span>
                  <span>简历 {{ currentJd.resumeCount }}</span>
                  <span>发布于 {{ currentJd.publishDate }}</span>
                </div>
                <button class="start-follow-btn" @click="followJd(currentJd)">
                  <Star :size="16" />
                  开始关注
                </button>
                <p class="follow-hint">开始关注后，可在工作台中单独调整运行策略</p>
              </div>
            </div>
          </template>

          <!-- No JD selected -->
          <template v-else>
            <div class="empty-state">
              <Briefcase :size="48" class="empty-icon" />
              <h3>选择一个岗位查看详情</h3>
              <p>从左侧选择已关注的岗位查看招聘数据，或关注新岗位开始智能招聘</p>
            </div>
          </template>

        </div>
      </main>
    </div>
  </div>

  <div v-if="strategyEditorMode" class="strategy-modal-mask" @click.self="closeStrategyEditor">
    <div class="strategy-modal">
      <div class="strategy-modal-header">
        <div>
          <h3>编辑运行策略</h3>
        </div>
        <button class="strategy-close-btn" @click="closeStrategyEditor">
          <X :size="16" />
        </button>
      </div>

      <div class="strategy-modal-body">
        <div class="strategy-form-grid">
          <label class="form-field full">
            <span>运行时段</span>
            <div class="inline-inputs">
              <input v-model="strategyDraft.startTime" type="time" class="strategy-input" />
              <span class="inline-sep">-</span>
              <input v-model="strategyDraft.endTime" type="time" class="strategy-input" />
            </div>
          </label>

          <label class="form-field">
            <span>每日上限</span>
            <input v-model.number="strategyDraft.dailyLimit" type="number" min="1" class="strategy-input" />
          </label>

          <label class="form-field">
            <span>每小时上限</span>
            <input v-model.number="strategyDraft.hourlyLimit" type="number" min="1" class="strategy-input" />
          </label>

          <label class="form-field">
            <span>最小间隔</span>
            <input v-model.number="strategyDraft.minInterval" type="number" min="1" class="strategy-input" />
          </label>

          <label class="form-field">
            <span>最大间隔</span>
            <input v-model.number="strategyDraft.maxInterval" type="number" min="1" class="strategy-input" />
          </label>
        </div>
      </div>

      <div class="strategy-modal-footer">
        <button v-if="canResetCurrentJobStrategy" class="footer-btn subtle" @click="resetCurrentJobStrategyToDefault">清除单独设置</button>
        <button class="footer-btn" @click="closeStrategyEditor">取消</button>
        <button class="footer-btn primary" @click="saveStrategyEditor">保存策略</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workbench-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
  z-index: 100;
}

/* ===== Top Bar ===== */
.top-bar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.top-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 32px;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #2563eb;
}

.top-divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
}

.account-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-avatar-sm {
  width: 32px;
  height: 32px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.account-name-sm {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.account-sep {
  color: #cbd5e1;
}

.account-company-sm {
  font-size: 13px;
  color: #64748b;
}

.session-expiry {
  font-size: 12px;
  color: #64748b;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 10px;
}

.top-right {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* ===== Body Layout ===== */
.body-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ===== Left Sidebar ===== */
.jd-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.sidebar-group .jd-list {
  flex: 1;
  overflow-y: auto;
}

.sidebar-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.sidebar-title h3 {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.jd-list {
  padding: 8px;
}

.jd-item {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.jd-item:hover {
  background: #f8fafc;
}

.jd-item.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.jd-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.jd-icon {
  color: #3b82f6;
}

.unfollowed-icon {
  color: #94a3b8;
}

.jd-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.jd-item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.jd-salary {
  font-size: 12px;
  font-weight: 500;
  color: #16a34a;
}

.jd-status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.jd-status-badge.running {
  background: #dcfce7;
  color: #16a34a;
}

.jd-status-badge.paused {
  background: #fef3c7;
  color: #d97706;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.jd-status-badge.running .status-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.jd-item-stats {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 8px;
}

.jd-item-stats span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.jd-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 5px;
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.jd-toggle-btn:hover {
  background: #e2e8f0;
}

.jd-toggle-btn.paused {
  background: #dcfce7;
  color: #16a34a;
}

.follow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 12px;
  color: #2563eb;
  cursor: pointer;
  transition: all 0.2s;
}

.follow-btn:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

.sync-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 12px 16px;
  padding: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.sync-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px 40px;
}

.content-inner {
  max-width: 1100px;
  margin: 0 auto;
}

/* ===== Dashboard ===== */
.dashboard {
  margin-bottom: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-card.primary .stat-icon {
  background: #dbeafe;
  color: #2563eb;
}

.stat-card.success .stat-icon {
  background: #dcfce7;
  color: #16a34a;
}

.stat-card.warning .stat-icon {
  background: #fef3c7;
  color: #d97706;
}

.stat-icon {
  width: 44px;
  height: 44px;
  background: #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

/* ===== Resume Section ===== */
.resume-section {
  display: flex;
  flex-direction: column;
}

.resume-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.resume-section-header h2 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.resume-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.date-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.date-input {
  border: none;
  outline: none;
  font-size: 13px;
  color: #334155;
  background: transparent;
  width: 120px;
  padding: 2px 0;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

.date-sep {
  color: #cbd5e1;
  font-size: 13px;
}

.batch-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.batch-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.batch-btn.primary {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.batch-btn.primary:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

.resume-table {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 0.7fr 0.6fr 0.8fr 0.7fr 1.3fr;
  gap: 12px;
  padding: 14px 20px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.sortable {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  transition: color 0.15s;
}

.sortable:hover {
  color: #334155;
}

.sort-icon {
  color: #cbd5e1;
  transition: color 0.15s;
}

.sort-icon.active {
  color: #2563eb;
}

.table-body {
  max-height: calc(100vh - 340px);
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 0.7fr 0.6fr 0.8fr 0.7fr 1.3fr;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 13px;
  color: #334155;
  transition: background 0.15s;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

.candidate-info {
  display: flex;
  flex-direction: column;
}

.candidate-name {
  font-weight: 500;
  color: #1e293b;
}

.candidate-company {
  font-size: 12px;
  color: #94a3b8;
}

.match-score {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.score-high { background: #dcfce7; color: #16a34a; }
.score-medium { background: #fef9c3; color: #ca8a04; }
.score-low { background: #fee2e2; color: #dc2626; }

.col-action {
  display: flex;
  gap: 6px;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #334155;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.download-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.analyze-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.analyze-btn:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

/* ===== Unfollowed Detail ===== */
.unfollowed-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.unfollowed-card {
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  max-width: 480px;
  width: 100%;
}

.unfollowed-detail-icon {
  color: #94a3b8;
  margin-bottom: 16px;
}

.unfollowed-card h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.unfollowed-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-item {
  font-size: 14px;
  color: #475569;
}

.meta-sep {
  color: #cbd5e1;
}

.unfollowed-stats {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 13px;
  color: #64748b;
}

.start-follow-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: #2563eb;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.start-follow-btn:hover {
  background: #1d4ed8;
}

.follow-hint {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.strategy-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.strategy-strip.readonly {
  background: #f8fafc;
}

.strategy-strip-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.strategy-strip-label {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

.strategy-strip-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #475569;
}

.strategy-strip-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.strategy-strip-btn:hover:not(:disabled) {
  background: #dbeafe;
}

.strategy-strip-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.strategy-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 120;
  backdrop-filter: blur(6px);
}

.strategy-modal {
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
}

.strategy-modal-header,
.strategy-modal-footer {
  padding: 18px 22px;
}

.strategy-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.strategy-modal-header h3 {
  margin: 0 0 6px;
  font-size: 18px;
  color: #0f172a;
}

.strategy-modal-header p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.strategy-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
}

.strategy-close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.strategy-modal-body {
  padding: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.footer-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.strategy-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.full {
  grid-column: 1 / -1;
}

.form-field > span {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.strategy-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dbe2ec;
  border-radius: 10px;
  background: white;
  font-size: 13px;
  color: #334155;
}

.inline-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inline-sep {
  color: #94a3b8;
}

.strategy-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e2e8f0;
}

.footer-btn.subtle {
  margin-right: auto;
}

.footer-btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.footer-btn.primary:hover {
  background: #1d4ed8;
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 16px;
  font-weight: 500;
  color: #475569;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
  max-width: 320px;
}

/* ===== Scrollbar ===== */
.jd-list::-webkit-scrollbar,
.table-body::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
  width: 6px;
}

.jd-list::-webkit-scrollbar-track,
.table-body::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.jd-list::-webkit-scrollbar-thumb,
.table-body::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.jd-list::-webkit-scrollbar-thumb:hover,
.table-body::-webkit-scrollbar-thumb:hover,
.main-content::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* ===== Sidebar Tabs ===== */
.sidebar-tabs {
  display: flex;
  margin: 0 12px 8px;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 3px;
  flex-shrink: 0;
}

.sidebar-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 6px;
  background: none;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.sidebar-tab:hover {
  color: #475569;
}

.sidebar-tab.active {
  background: white;
  color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.jd-item.archived .jd-name {
  color: #64748b;
}

.jd-item.archived .jd-salary {
  color: #94a3b8;
}

.archived-icon {
  color: #94a3b8;
}

.jd-status-badge.closed {
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.archived-date {
  font-size: 11px;
  color: #94a3b8;
}

@media (max-width: 1024px) {
  .stats-row,
  .strategy-form-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 900px) {
  .strategy-strip {
    flex-direction: column;
    align-items: flex-start;
  }

  .strategy-strip-btn {
    width: 100%;
    justify-content: center;
  }
}

</style>
