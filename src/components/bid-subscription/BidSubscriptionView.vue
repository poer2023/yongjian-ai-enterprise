<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Bell,
  Sparkles,
  Star,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  MapPin,
  Building2,
  ScrollText,
  Users,
  FileSearch,
  FileText,
  X,
  Maximize2,
  Target,
  Zap
} from 'lucide-vue-next';
import { policyGroups as defaultPolicyGroups, dateOptions, dataByPolicyAndDate } from './mockData';
import type { BidDetail } from './types';
import ScoreDisplay from '../shared/ScoreDisplay.vue';

const router = useRouter();

// Policy groups
const policyGroups = ref(defaultPolicyGroups);
const activePolicyId = ref('security');
const showPolicyDropdown = ref(false);

const activePolicy = computed(() => {
  return policyGroups.value.find(g => g.id === activePolicyId.value);
});

const selectPolicy = (id: string) => {
  activePolicyId.value = id;
  showPolicyDropdown.value = false;
};

// Date picker
const selectedDate = ref('2026-02-06');
const formattedDate = computed(() => {
  const date = new Date(selectedDate.value);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日 ${weekday}`;
});

// Current data based on policy and date
const currentData = computed(() => {
  const policyData = dataByPolicyAndDate[activePolicyId.value] || dataByPolicyAndDate['security'];
  if (!policyData) return null;
  // Try to find data for selected date, fallback to first available
  return policyData[selectedDate.value] || policyData['2026-02-04'] || null;
});

// Navigation
const goToDetail = (id: number) => {
  router.push({ name: 'bid-list-detail', query: { bidId: id } });
};

const goToAnalysis = (id: number) => {
  router.push({ name: 'bid-analysis-form', query: { bidId: id } });
};

const goToDocGenerate = (id: number) => {
  router.push({ name: 'bid-doc-oneclick-form', query: { bidId: id } });
};

const goToFullReport = () => {
  router.push({ name: 'bid-daily-report' });
};

// Fullscreen mode
const isFullscreen = ref(false);
const selectedBidId = ref<number | null>(null);

const openFullscreen = () => {
  isFullscreen.value = true;
  if (currentData.value && currentData.value.allBids.length > 0 && currentData.value.allBids[0]) {
    selectedBidId.value = currentData.value.allBids[0].id;
  }
};

const closeFullscreen = () => {
  isFullscreen.value = false;
  selectedBidId.value = null;
};

const selectBid = (id: number) => {
  selectedBidId.value = id;
};

const selectedBidDetail = computed((): BidDetail | null => {
  if (!selectedBidId.value || !currentData.value) return null;
  const bid = currentData.value.allBids.find(b => b.id === selectedBidId.value);
  if (!bid) return null;
  return {
    ...bid,
    deadline: '2026-02-15',
    location: '上海市',
    publishDate: '2026-02-01',
    purchaser: 'XX采购单位',
    contact: '张先生 021-88888888',
    requirements: ['具有相关资质认证', '近3年完成类似项目经验', '项目团队不少于5人'],
    scope: '本项目包含相关服务内容，服务期限为1年。',
    evaluation: '综合评分法'
  };
});

const getMatchScoreClass = (score: number) => {
  if (score >= 90) return 'score-high';
  if (score >= 75) return 'score-medium';
  return 'score-low';
};

const goToSalesStrategy = () => {
  router.push({ name: 'competition-analysis' });
};
</script>

<template>
  <div class="bid-subscription-view">
    <div class="content-wrapper">
      <!-- Header with date switcher -->
      <div class="date-header">
        <div class="header-left">
          <div class="header-icon">
            <Bell :size="22" />
          </div>
          <div class="header-text">
            <h1 class="page-title">标讯订阅</h1>
            <p class="page-subtitle">基于您的订阅配置，智能推送匹配标讯</p>
          </div>
        </div>

        <div class="header-right">
          <!-- Policy dropdown -->
          <div class="dropdown-wrapper">
            <button class="dropdown-trigger" @click="showPolicyDropdown = !showPolicyDropdown">
              <Users :size="16" />
              <span>{{ activePolicy?.name }}</span>
              <span v-if="activePolicy?.newCount" class="trigger-badge">{{ activePolicy.newCount }}</span>
              <ChevronDown :size="14" :class="{ 'rotate': showPolicyDropdown }" />
            </button>
            <div v-if="showPolicyDropdown" class="dropdown-menu">
              <div
                v-for="group in policyGroups"
                :key="group.id"
                class="dropdown-item"
                :class="{ active: activePolicyId === group.id }"
                @click="selectPolicy(group.id)"
              >
                <span class="item-name">{{ group.name }}</span>
                <span v-if="group.newCount" class="item-badge">{{ group.newCount }}</span>
              </div>
            </div>
          </div>

          <!-- Date picker -->
          <label class="date-picker-wrapper">
            <Calendar :size="16" />
            <span class="date-display-text">{{ formattedDate }}</span>
            <ChevronDown :size="14" />
            <input
              type="date"
              v-model="selectedDate"
              class="date-input"
            />
          </label>
        </div>
      </div>

      <!-- Main grid -->
      <div class="main-grid">
        <!-- Left column: Summary + Highlights -->
        <div class="left-column">
          <section class="summary-card">
            <div class="card-header">
              <div class="header-title">
                <Sparkles :size="18" class="sparkles-icon" />
                <h2>{{ formattedDate ?? '' }}标讯总结</h2>
              </div>
              <button class="report-link" @click="goToFullReport">
                <ScrollText :size="14" />
                查看完整报告
              </button>
            </div>
            <div class="summary-content">
              <p>{{ currentData?.summary ?? '' }}</p>
            </div>
          </section>

          <section class="highlight-card">
            <div class="card-header">
              <div class="header-title">
                <Star :size="18" class="star-icon" />
                <h2>重点标讯</h2>
                <span class="count-badge">{{ currentData?.highlights?.length ?? 0 }} 条高匹配</span>
              </div>
            </div>
            <div class="highlight-list">
              <div
                v-for="bid in currentData?.highlights ?? []"
                :key="bid.id"
                class="highlight-item"
                @click="goToDetail(bid.id)"
              >
                <div class="highlight-content">
                  <div class="item-top">
                    <div class="match-score" :class="getMatchScoreClass(bid.matchScore)">
                      <TrendingUp :size="12" />
                      {{ bid.matchScore }}%
                    </div>
                    <div class="bid-tags">
                      <span v-for="tag in bid.tags" :key="tag" class="bid-tag">{{ tag }}</span>
                    </div>
                  </div>
                  <h3 class="bid-title">{{ bid.title }}</h3>
                  <div class="item-meta">
                    <span class="meta-item">
                      <Building2 :size="13" />
                      {{ bid.budget }}
                    </span>
                    <span class="meta-item">
                      <MapPin :size="13" />
                      {{ bid.location }}
                    </span>
                    <span class="meta-item">
                      <Calendar :size="13" />
                      {{ bid.deadline }}
                    </span>
                  </div>
                </div>
                <div class="item-actions">
                  <button class="action-btn secondary" @click.stop="goToAnalysis(bid.id)">
                    <FileSearch :size="14" />
                    标讯解读
                  </button>
                  <button class="action-btn primary" @click.stop="goToDocGenerate(bid.id)">
                    <FileText :size="14" />
                    生成标书
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right column: All bids -->
        <div class="right-column">
          <!-- Sales Strategy Quick Trigger -->
          <div class="strategy-trigger">
            <div class="strategy-trigger-top">
              <div class="strategy-trigger-icon">
                <Target :size="20" />
              </div>
              <div class="strategy-trigger-text">
                <span class="strategy-trigger-title">行业分析报告</span>
                <span class="strategy-trigger-desc">基于竞争数据，智能生成针对性销售策略</span>
              </div>
            </div>
            <div class="strategy-trigger-stats">
              <div class="trigger-stat">
                <span class="trigger-stat-value">{{ activePolicy?.salesStrategy?.biddingUnits ?? 0 }}</span>
                <span class="trigger-stat-label">招标单位</span>
              </div>
              <div class="trigger-stat-divider"></div>
              <div class="trigger-stat">
                <span class="trigger-stat-value">{{ activePolicy?.salesStrategy?.competitors ?? 0 }}</span>
                <span class="trigger-stat-label">竞品企业</span>
              </div>
              <div class="trigger-stat-divider"></div>
              <div class="trigger-stat">
                <span class="trigger-stat-value">{{ activePolicy?.salesStrategy?.bidNotices ?? 0 }}</span>
                <span class="trigger-stat-label">关注标讯</span>
              </div>
            </div>
            <button class="strategy-cta-btn" @click="goToSalesStrategy">
              <Zap :size="15" />
              一键生成策略报告
              <ChevronRight :size="14" class="cta-arrow" />
            </button>
          </div>

          <section class="list-card">
            <div class="card-header">
              <div class="header-title">
                <Bell :size="18" />
                <h2>全部标讯</h2>
                <span class="count-badge">{{ currentData?.allBids?.length ?? 0 }} 条</span>
              </div>
              <button class="view-all-btn" @click="openFullscreen">
                <Maximize2 :size="14" />
                查看全部
              </button>
            </div>
            <div class="bid-list">
              <div
                v-for="bid in (currentData?.allBids ?? []).slice(0, 8)"
                :key="bid.id"
                class="bid-list-item"
                @click="goToDetail(bid.id)"
              >
                <span class="match-badge" :class="getMatchScoreClass(bid.matchScore)">
                  {{ bid.matchScore }}%
                </span>
                <span class="list-title">{{ bid.title }}</span>
                <span class="list-budget">{{ bid.budget }}</span>
                <ChevronRight :size="16" class="list-arrow" />
              </div>
            </div>
            <div v-if="(currentData?.allBids?.length ?? 0) > 8" class="list-footer">
              <button class="more-btn" @click="openFullscreen">
                查看全部 {{ currentData?.allBids?.length ?? 0 }} 条标讯
                <ChevronRight :size="14" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Fullscreen modal -->
    <div v-if="isFullscreen" class="fullscreen-modal">
      <header class="fullscreen-header">
        <div class="header-left">
          <button class="back-btn" @click="closeFullscreen">
            <ChevronLeft :size="18" />
            <span>返回</span>
          </button>
          <h1 class="header-title">全部标讯列表</h1>
          <span class="header-count">共 {{ currentData?.allBids?.length ?? 0 }} 条</span>
        </div>
      </header>
      <div class="fullscreen-body">
        <aside class="file-sidebar">
          <div class="sidebar-header">
            <FileText :size="16" />
            <span>标讯列表</span>
          </div>
          <div class="file-list">
            <div
              v-for="bid in currentData?.allBids ?? []"
              :key="bid.id"
              class="file-item"
              :class="{ active: selectedBidId === bid.id }"
              @click="selectBid(bid.id)"
            >
              <div class="file-icon">
                <FileText :size="16" />
              </div>
              <div class="file-info">
                <span class="file-title">{{ bid.title }}</span>
                <span class="file-meta">
                  <span class="file-score" :class="getMatchScoreClass(bid.matchScore)">{{ bid.matchScore }}%</span>
                  <span class="file-budget">{{ bid.budget }}</span>
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div class="detail-main" v-if="selectedBidDetail">
          <div class="main-content">
            <div class="title-section">
              <span class="match-badge-large" :class="getMatchScoreClass(selectedBidDetail.matchScore)">
                匹配度 {{ selectedBidDetail.matchScore }}%
              </span>
              <h2 class="detail-title">{{ selectedBidDetail.title }}</h2>
            </div>

            <div class="info-card">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">预算金额</div>
                  <div class="info-value highlight">{{ selectedBidDetail.budget }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">截止日期</div>
                  <div class="info-value">{{ selectedBidDetail.deadline }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">发布日期</div>
                  <div class="info-value">{{ selectedBidDetail.publishDate }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">所在地区</div>
                  <div class="info-value">{{ selectedBidDetail.location }}</div>
                </div>
              </div>
            </div>

            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">采购单位</h3>
              </div>
              <div class="card-body">
                <p class="body-text">{{ selectedBidDetail.purchaser }}</p>
                <p class="body-text sub">联系方式：{{ selectedBidDetail.contact }}</p>
              </div>
            </div>

            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">资质要求</h3>
              </div>
              <div class="card-body">
                <ul class="requirements-list">
                  <li v-for="(req, index) in selectedBidDetail.requirements" :key="index">{{ req }}</li>
                </ul>
              </div>
            </div>

            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">项目范围</h3>
              </div>
              <div class="card-body">
                <p class="body-text">{{ selectedBidDetail.scope }}</p>
              </div>
            </div>

            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">评标方法</h3>
              </div>
              <div class="card-body">
                <p class="body-text">{{ selectedBidDetail.evaluation }}</p>
              </div>
            </div>
          </div>

          <div class="side-panel">
            <div class="match-analysis-card">
              <div class="card-header">
                <h3 class="card-title">匹配度分析</h3>
              </div>
              <div class="match-score-display">
                <ScoreDisplay :score="selectedBidDetail.matchScore" size="lg" />
              </div>
            </div>

            <div class="quick-actions-card">
              <button class="quick-action-btn primary" @click="goToAnalysis(selectedBidId!)">
                <FileSearch :size="18" />
                <span>AI智能解读</span>
              </button>
              <button class="quick-action-btn" @click="goToDocGenerate(selectedBidId!)">
                <FileText :size="18" />
                <span>生成标书</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles.css';
</style>
