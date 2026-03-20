<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
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
  Maximize2,
  Target,
  Zap,
  Newspaper,
  Globe,
  Tag,
  Clock,
  Database,
  BookOpen,
} from 'lucide-vue-next';
import {
  policyGroups as defaultPolicyGroups,
  dataByPolicyAndDate,
  newsPolicyGroups,
  newsDataByPolicyAndDate,
  newsDetails,
} from './mockData';
import type { BidDetail, NewsDetail } from './types';
import ScoreDisplay from '../shared/ScoreDisplay.vue';

type SubscriptionMode = 'bid' | 'news';

interface DisplayMeta {
  text: string;
  icon: Component;
}

interface DisplayHighlight {
  id: number;
  title: string;
  matchScore: number;
  tags: string[];
  metas: DisplayMeta[];
}

interface DisplayListItem {
  id: number;
  title: string;
  extra: string;
  matchScore: number;
}

interface DisplayDetailField {
  label: string;
  value: string;
  highlight?: boolean;
}

interface DisplayDetailSection {
  title: string;
  type: 'text' | 'list';
  content: string | string[];
}

interface DisplayDetail {
  id: number;
  title: string;
  matchScore: number;
  fields: DisplayDetailField[];
  sections: DisplayDetailSection[];
}

const props = withDefaults(defineProps<{
  mode?: SubscriptionMode;
}>(), {
  mode: 'news',
});

const router = useRouter();
const isNewsMode = computed(() => props.mode === 'news');

const activePolicyId = ref(isNewsMode.value ? 'overview' : 'security');
const showPolicyDropdown = ref(false);
const selectedDate = ref('2026-02-04');
const isFullscreen = ref(false);
const selectedItemId = ref<number | null>(null);

const formattedDate = computed(() => {
  const date = new Date(selectedDate.value);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日 ${weekday}`;
});

const activeBidPolicy = computed(() => {
  return defaultPolicyGroups.find((group) => group.id === activePolicyId.value) ?? defaultPolicyGroups[0];
});

const activeNewsPolicy = computed(() => {
  return newsPolicyGroups.find((group) => group.id === activePolicyId.value) ?? newsPolicyGroups[0];
});

const currentBidData = computed(() => {
  const policyData = dataByPolicyAndDate[activePolicyId.value] || dataByPolicyAndDate.security;
  return policyData?.[selectedDate.value] || policyData?.['2026-02-04'] || null;
});

const currentNewsData = computed(() => {
  const policyData = newsDataByPolicyAndDate[activePolicyId.value] || newsDataByPolicyAndDate.overview;
  return policyData?.[selectedDate.value] || policyData?.['2026-02-04'] || null;
});

const pageConfig = computed(() => {
  if (isNewsMode.value) {
    return {
      icon: Newspaper,
      title: '资讯订阅',
      subtitle: '在原有订阅结果页基础上，聚合多类资讯内容，其中包含“标讯”分类',
      summaryTitle: '今日资讯总结',
      highlightTitle: '重点资讯',
      listTitle: '全部资讯',
      listUnit: '资讯',
      summaryActionLabel: '打开知识库',
      topCardTitle: '资讯分类概览',
      topCardDesc: '将标讯纳入资讯分类统一管理，便于个人统一追踪',
      topCardActionLabel: '交给数据顾问',
      detailListTitle: '资讯列表',
      fullscreenTitle: '全部资讯列表',
      primaryActionLabel: '加入知识库',
      secondaryActionLabel: '交给数据顾问',
    };
  }

  return {
    icon: Bell,
    title: '资讯订阅',
    subtitle: '基于您的订阅配置，统一聚合资讯结果，其中包含标讯分类',
    summaryTitle: '标讯总结',
    highlightTitle: '重点标讯',
    listTitle: '全部标讯',
    listUnit: '标讯',
    summaryActionLabel: '查看完整报告',
    topCardTitle: '行业分析报告',
    topCardDesc: '基于竞争数据，智能生成针对性销售策略',
    topCardActionLabel: '一键生成策略报告',
    detailListTitle: '标讯列表',
    fullscreenTitle: '全部标讯列表',
    primaryActionLabel: 'AI智能解读',
    secondaryActionLabel: '生成标书',
  };
});

const policyOptions = computed(() => {
  return isNewsMode.value ? newsPolicyGroups : defaultPolicyGroups;
});

const activePolicyName = computed(() => {
  return isNewsMode.value ? activeNewsPolicy.value?.name : activeBidPolicy.value?.name;
});

const currentSummary = computed(() => {
  return isNewsMode.value ? currentNewsData.value?.summary ?? '' : currentBidData.value?.summary ?? '';
});

const displayHighlights = computed<DisplayHighlight[]>(() => {
  if (isNewsMode.value) {
    return (currentNewsData.value?.highlights ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      matchScore: item.matchScore,
      tags: item.tags,
      metas: [
        { icon: Globe, text: item.source },
        { icon: Tag, text: item.category },
        { icon: Clock, text: item.publishedAt },
      ],
    }));
  }

  return (currentBidData.value?.highlights ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    matchScore: item.matchScore,
    tags: item.tags,
    metas: [
      { icon: Building2, text: item.budget },
      { icon: MapPin, text: item.location },
      { icon: Calendar, text: item.deadline },
    ],
  }));
});

const displayListItems = computed<DisplayListItem[]>(() => {
  if (isNewsMode.value) {
    return (currentNewsData.value?.allItems ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      extra: item.source,
      matchScore: item.matchScore,
    }));
  }

  return (currentBidData.value?.allBids ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    extra: item.budget,
    matchScore: item.matchScore,
  }));
});

const selectedBidDetail = computed<BidDetail | null>(() => {
  if (!selectedItemId.value || !currentBidData.value) return null;
  const bid = currentBidData.value.allBids.find((item) => item.id === selectedItemId.value);
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
    evaluation: '综合评分法',
  };
});

const buildFallbackNewsDetail = (id: number): NewsDetail | null => {
  const currentItem =
    currentNewsData.value?.highlights.find((item) => item.id === id) ||
    currentNewsData.value?.allItems.find((item) => item.id === id);

  if (!currentItem) return null;

  const category =
    'category' in currentItem && typeof currentItem.category === 'string'
      ? currentItem.category
      : '行业资讯';
  const publishedAt =
    'publishedAt' in currentItem && typeof currentItem.publishedAt === 'string'
      ? currentItem.publishedAt
      : '今日';

  return {
    id: currentItem.id,
    title: currentItem.title,
    source: currentItem.source,
    matchScore: currentItem.matchScore,
    publishedAt,
    category,
    author: '资讯聚合引擎',
    summary: '该资讯已进入当前订阅结果，可进一步加入知识库或交给数据顾问进行整理。',
    keyPoints: [
      '当前内容来自资讯订阅聚合结果。',
      '分类和来源均可回溯查看。',
    ],
    recommendations: [
      '加入知识库沉淀为可复用资料。',
      '交给数据顾问提炼重点信息。',
    ],
  };
};

const selectedNewsDetail = computed<NewsDetail | null>(() => {
  if (!selectedItemId.value) return null;
  return newsDetails[selectedItemId.value] ?? buildFallbackNewsDetail(selectedItemId.value);
});

const selectedDisplayDetail = computed<DisplayDetail | null>(() => {
  if (isNewsMode.value) {
    if (!selectedNewsDetail.value) return null;

    return {
      id: selectedNewsDetail.value.id,
      title: selectedNewsDetail.value.title,
      matchScore: selectedNewsDetail.value.matchScore,
      fields: [
        { label: '来源渠道', value: selectedNewsDetail.value.source, highlight: true },
        { label: '发布时间', value: selectedNewsDetail.value.publishedAt },
        { label: '资讯分类', value: selectedNewsDetail.value.category },
        { label: '整理人', value: selectedNewsDetail.value.author },
      ],
      sections: [
        { title: '内容摘要', type: 'text', content: selectedNewsDetail.value.summary },
        { title: '核心要点', type: 'list', content: selectedNewsDetail.value.keyPoints },
        { title: '建议动作', type: 'list', content: selectedNewsDetail.value.recommendations },
      ],
    };
  }

  if (!selectedBidDetail.value) return null;

  return {
    id: selectedBidDetail.value.id,
    title: selectedBidDetail.value.title,
    matchScore: selectedBidDetail.value.matchScore,
    fields: [
      { label: '预算金额', value: selectedBidDetail.value.budget, highlight: true },
      { label: '截止日期', value: selectedBidDetail.value.deadline },
      { label: '发布日期', value: selectedBidDetail.value.publishDate },
      { label: '所在地区', value: selectedBidDetail.value.location },
    ],
    sections: [
      {
        title: '采购单位',
        type: 'text',
        content: `${selectedBidDetail.value.purchaser}\n联系方式：${selectedBidDetail.value.contact}`,
      },
      { title: '资质要求', type: 'list', content: selectedBidDetail.value.requirements },
      { title: '项目范围', type: 'text', content: selectedBidDetail.value.scope },
      { title: '评标方法', type: 'text', content: selectedBidDetail.value.evaluation },
    ],
  };
});

const topCardStats = computed(() => {
  if (isNewsMode.value) {
    const stats = activeNewsPolicy.value?.categoryStats ?? { bidding: 0, industry: 0, product: 0 };
    return [
      { label: '标讯', value: stats.bidding },
      { label: '行业', value: stats.industry },
      { label: '产品', value: stats.product },
    ];
  }

  const stats = activeBidPolicy.value?.salesStrategy ?? { biddingUnits: 0, competitors: 0, bidNotices: 0 };
  return [
    { label: '招标单位', value: stats.biddingUnits },
    { label: '竞品企业', value: stats.competitors },
    { label: '关注标讯', value: stats.bidNotices },
  ];
});

const getMatchScoreClass = (score: number) => {
  if (score >= 90) return 'score-high';
  if (score >= 75) return 'score-medium';
  return 'score-low';
};

const selectPolicy = (id: string) => {
  activePolicyId.value = id;
  showPolicyDropdown.value = false;
};

const openFullscreen = () => {
  isFullscreen.value = true;
  selectedItemId.value = displayListItems.value[0]?.id ?? null;
};

const openFullscreenWithItem = (id: number) => {
  isFullscreen.value = true;
  selectedItemId.value = id;
};

const closeFullscreen = () => {
  isFullscreen.value = false;
  selectedItemId.value = null;
};

const selectItem = (id: number) => {
  selectedItemId.value = id;
};

const handleItemClick = (id: number) => {
  if (isNewsMode.value) {
    openFullscreenWithItem(id);
    return;
  }

  router.push({ name: 'bid-list-detail', query: { bidId: id } });
};

const handlePrimaryAction = (id: number) => {
  if (isNewsMode.value) {
    router.push({ name: 'knowledge' });
    return;
  }

  router.push({ name: 'bid-analysis-form', query: { bidId: id } });
};

const handleSecondaryAction = (id: number) => {
  if (isNewsMode.value) {
    router.push({ name: 'data-advisor' });
    return;
  }

  router.push({ name: 'bid-doc-oneclick-form', query: { bidId: id } });
};

const goToSummaryAction = () => {
  if (isNewsMode.value) {
    router.push({ name: 'knowledge' });
    return;
  }

  router.push({ name: 'bid-daily-report' });
};

const goToTopCardAction = () => {
  if (isNewsMode.value) {
    router.push({ name: 'data-advisor' });
    return;
  }

  router.push({ name: 'competition-analysis' });
};

const getSectionList = (section: DisplayDetailSection) => {
  return Array.isArray(section.content) ? section.content : [];
};
</script>

<template>
  <div class="bid-subscription-view">
    <div class="content-wrapper">
      <div class="date-header">
        <div class="header-left">
          <div class="header-icon">
            <component :is="pageConfig.icon" :size="22" />
          </div>
          <div class="header-text">
            <h1 class="page-title">{{ pageConfig.title }}</h1>
            <p class="page-subtitle">{{ pageConfig.subtitle }}</p>
          </div>
        </div>

        <div class="header-right">
          <div class="dropdown-wrapper">
            <button class="dropdown-trigger" @click="showPolicyDropdown = !showPolicyDropdown">
              <Users :size="16" />
              <span>{{ activePolicyName }}</span>
              <span
                v-if="(isNewsMode ? activeNewsPolicy?.newCount : activeBidPolicy?.newCount)"
                class="trigger-badge"
              >
                {{ isNewsMode ? activeNewsPolicy?.newCount : activeBidPolicy?.newCount }}
              </span>
              <ChevronDown :size="14" :class="{ rotate: showPolicyDropdown }" />
            </button>
            <div v-if="showPolicyDropdown" class="dropdown-menu">
              <div
                v-for="group in policyOptions"
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

          <label class="date-picker-wrapper">
            <Calendar :size="16" />
            <span class="date-display-text">{{ formattedDate }}</span>
            <ChevronDown :size="14" />
            <input
              v-model="selectedDate"
              type="date"
              class="date-input"
            />
          </label>
        </div>
      </div>

      <div class="main-grid">
        <div class="left-column">
          <section class="summary-card">
            <div class="card-header">
              <div class="header-title">
                <Sparkles :size="18" class="sparkles-icon" />
                <h2>{{ formattedDate }}{{ pageConfig.summaryTitle }}</h2>
              </div>
              <button class="report-link" @click="goToSummaryAction">
                <ScrollText :size="14" />
                {{ pageConfig.summaryActionLabel }}
              </button>
            </div>
            <div class="summary-content">
              <p>{{ currentSummary }}</p>
            </div>
          </section>

          <section class="highlight-card">
            <div class="card-header">
              <div class="header-title">
                <Star :size="18" class="star-icon" />
                <h2>{{ pageConfig.highlightTitle }}</h2>
                <span class="count-badge">{{ displayHighlights.length }} 条高匹配</span>
              </div>
            </div>
            <div class="highlight-list">
              <div
                v-for="item in displayHighlights"
                :key="item.id"
                class="highlight-item"
                @click="handleItemClick(item.id)"
              >
                <div class="highlight-content">
                  <div class="item-top">
                    <div class="match-score" :class="getMatchScoreClass(item.matchScore)">
                      <TrendingUp :size="12" />
                      {{ item.matchScore }}%
                    </div>
                    <div class="bid-tags">
                      <span v-for="tag in item.tags" :key="tag" class="bid-tag">{{ tag }}</span>
                    </div>
                  </div>
                  <h3 class="bid-title">{{ item.title }}</h3>
                  <div class="item-meta">
                    <span v-for="meta in item.metas" :key="`${item.id}-${meta.text}`" class="meta-item">
                      <component :is="meta.icon" :size="13" />
                      {{ meta.text }}
                    </span>
                  </div>
                </div>
                <div class="item-actions">
                  <button class="action-btn secondary" @click.stop="handlePrimaryAction(item.id)">
                    <component :is="isNewsMode ? BookOpen : FileSearch" :size="14" />
                    {{ pageConfig.primaryActionLabel }}
                  </button>
                  <button class="action-btn primary" @click.stop="handleSecondaryAction(item.id)">
                    <component :is="isNewsMode ? Database : FileText" :size="14" />
                    {{ pageConfig.secondaryActionLabel }}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="right-column">
          <div class="strategy-trigger">
            <div class="strategy-trigger-top">
              <div class="strategy-trigger-icon">
                <component :is="isNewsMode ? Newspaper : Target" :size="20" />
              </div>
              <div class="strategy-trigger-text">
                <span class="strategy-trigger-title">{{ pageConfig.topCardTitle }}</span>
                <span class="strategy-trigger-desc">{{ pageConfig.topCardDesc }}</span>
              </div>
            </div>
            <div class="strategy-trigger-stats">
              <template v-for="(stat, index) in topCardStats" :key="stat.label">
                <div class="trigger-stat">
                  <span class="trigger-stat-value">{{ stat.value }}</span>
                  <span class="trigger-stat-label">{{ stat.label }}</span>
                </div>
                <div v-if="index < topCardStats.length - 1" class="trigger-stat-divider"></div>
              </template>
            </div>
            <button class="strategy-cta-btn" @click="goToTopCardAction">
              <component :is="isNewsMode ? Database : Zap" :size="15" />
              {{ pageConfig.topCardActionLabel }}
              <ChevronRight :size="14" class="cta-arrow" />
            </button>
          </div>

          <section class="list-card">
            <div class="card-header">
              <div class="header-title">
                <component :is="pageConfig.icon" :size="18" />
                <h2>{{ pageConfig.listTitle }}</h2>
                <span class="count-badge">{{ displayListItems.length }} 条</span>
              </div>
              <button class="view-all-btn" @click="openFullscreen">
                <Maximize2 :size="14" />
                查看全部
              </button>
            </div>
            <div class="bid-list">
              <div
                v-for="item in displayListItems.slice(0, 8)"
                :key="item.id"
                class="bid-list-item"
                @click="handleItemClick(item.id)"
              >
                <span class="match-badge" :class="getMatchScoreClass(item.matchScore)">
                  {{ item.matchScore }}%
                </span>
                <span class="list-title">{{ item.title }}</span>
                <span class="list-budget">{{ item.extra }}</span>
                <ChevronRight :size="16" class="list-arrow" />
              </div>
            </div>
            <div v-if="displayListItems.length > 8" class="list-footer">
              <button class="more-btn" @click="openFullscreen">
                查看全部 {{ displayListItems.length }} 条{{ pageConfig.listUnit }}
                <ChevronRight :size="14" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div v-if="isFullscreen" class="fullscreen-modal">
      <header class="fullscreen-header">
        <div class="header-left">
          <button class="back-btn" @click="closeFullscreen">
            <ChevronLeft :size="18" />
            <span>返回</span>
          </button>
          <h1 class="header-title">{{ pageConfig.fullscreenTitle }}</h1>
          <span class="header-count">共 {{ displayListItems.length }} 条</span>
        </div>
      </header>
      <div class="fullscreen-body">
        <aside class="file-sidebar">
          <div class="sidebar-header">
            <component :is="isNewsMode ? Newspaper : FileText" :size="16" />
            <span>{{ pageConfig.detailListTitle }}</span>
          </div>
          <div class="file-list">
            <div
              v-for="item in displayListItems"
              :key="item.id"
              class="file-item"
              :class="{ active: selectedItemId === item.id }"
              @click="selectItem(item.id)"
            >
              <div class="file-icon">
                <component :is="isNewsMode ? ScrollText : FileText" :size="16" />
              </div>
              <div class="file-info">
                <span class="file-title">{{ item.title }}</span>
                <span class="file-meta">
                  <span class="file-score" :class="getMatchScoreClass(item.matchScore)">{{ item.matchScore }}%</span>
                  <span class="file-budget">{{ item.extra }}</span>
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div v-if="selectedDisplayDetail" class="detail-main">
          <div class="main-content">
            <div class="title-section">
              <span class="match-badge-large" :class="getMatchScoreClass(selectedDisplayDetail.matchScore)">
                匹配度 {{ selectedDisplayDetail.matchScore }}%
              </span>
              <h2 class="detail-title">{{ selectedDisplayDetail.title }}</h2>
            </div>

            <div class="info-card">
              <div class="info-grid">
                <div v-for="field in selectedDisplayDetail.fields" :key="field.label" class="info-item">
                  <div class="info-label">{{ field.label }}</div>
                  <div class="info-value" :class="{ highlight: field.highlight }">{{ field.value }}</div>
                </div>
              </div>
            </div>

            <div v-for="section in selectedDisplayDetail.sections" :key="section.title" class="content-card">
              <div class="card-header">
                <h3 class="card-title">{{ section.title }}</h3>
              </div>
              <div class="card-body">
                <p v-if="section.type === 'text'" class="body-text">{{ section.content }}</p>
                <ul v-else class="requirements-list">
                  <li v-for="(item, index) in getSectionList(section)" :key="index">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="side-panel">
            <div class="match-analysis-card">
              <div class="card-header">
                <h3 class="card-title">匹配度分析</h3>
              </div>
              <div class="match-score-display">
                <ScoreDisplay :score="selectedDisplayDetail.matchScore" size="lg" />
              </div>
            </div>

            <div class="quick-actions-card">
              <button class="quick-action-btn primary" @click="handlePrimaryAction(selectedDisplayDetail.id)">
                <component :is="isNewsMode ? BookOpen : FileSearch" :size="18" />
                <span>{{ pageConfig.primaryActionLabel }}</span>
              </button>
              <button class="quick-action-btn" @click="handleSecondaryAction(selectedDisplayDetail.id)">
                <component :is="isNewsMode ? Database : FileText" :size="18" />
                <span>{{ pageConfig.secondaryActionLabel }}</span>
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
