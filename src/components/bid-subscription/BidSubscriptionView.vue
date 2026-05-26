<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
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
type ListSortField = 'publishDate' | 'deadline' | 'budgetAmount';
type SortDirection = 'asc' | 'desc';

const LIST_PAGE_SIZE = 20;

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
  publisher: string;
  publishDate: string;
  deadline: string;
  budget: string;
  budgetAmount: number;
  region: string;
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
  mode: 'bid',
});

const router = useRouter();
const isNewsMode = computed(() => props.mode === 'news');

const activePolicyId = ref(isNewsMode.value ? 'overview' : 'security');
const showPolicyDropdown = ref(false);
const selectedDate = ref('2026-02-04');
const isFullscreen = ref(false);
const selectedItemId = ref<number | null>(null);
const activeListRegion = ref('all');
const activeListSortField = ref<ListSortField>('publishDate');
const activeListSortDirection = ref<SortDirection>('desc');
const currentListPage = ref(1);
const listJumpPage = ref('1');
const showListRegionDropdown = ref(false);

const bidListMetaById: Record<number, { publisher: string; publishDate: string; deadline: string; region: string }> = {
  301: { publisher: '某国有银行上海分行', publishDate: '2026-02-04', deadline: '2026-02-08', region: '上海市' },
  302: { publisher: '上海市浦东新区政务云管理中心', publishDate: '2026-02-04', deadline: '2026-02-12', region: '上海市浦东新区' },
  303: { publisher: '上海市徐汇区教育局', publishDate: '2026-02-04', deadline: '2026-02-09', region: '上海市徐汇区' },
  304: { publisher: '上海市青浦区公安局', publishDate: '2026-02-03', deadline: '2026-02-14', region: '上海市青浦区' },
  305: { publisher: '上海市松江区政务服务中心', publishDate: '2026-02-03', deadline: '2026-02-15', region: '上海市松江区' },
  306: { publisher: '上海市闵行区街道办事处', publishDate: '2026-02-03', deadline: '2026-02-11', region: '上海市闵行区' },
  307: { publisher: '上海市静安区商务委员会', publishDate: '2026-02-02', deadline: '2026-02-16', region: '上海市静安区' },
  308: { publisher: '上海市奉贤区工业园区管理委员会', publishDate: '2026-02-02', deadline: '2026-02-18', region: '上海市奉贤区' },
  309: { publisher: '上海城投集团有限公司', publishDate: '2026-02-01', deadline: '2026-02-20', region: '上海市' },
  310: { publisher: '上海市长宁区数据局', publishDate: '2026-02-01', deadline: '2026-02-13', region: '上海市长宁区' },
  311: { publisher: '上海市杨浦区科创园区管理中心', publishDate: '2026-01-31', deadline: '2026-02-17', region: '上海市杨浦区' },
  312: { publisher: '上海市宝山区人民医院', publishDate: '2026-01-31', deadline: '2026-02-19', region: '上海市宝山区' },
  313: { publisher: '上海市嘉定区政务服务办公室', publishDate: '2026-01-30', deadline: '2026-02-18', region: '上海市嘉定区' },
  314: { publisher: '上海市黄浦区教育信息中心', publishDate: '2026-01-30', deadline: '2026-02-10', region: '上海市黄浦区' },
  315: { publisher: '上海市崇明区卫生健康委员会', publishDate: '2026-01-29', deadline: '2026-02-21', region: '上海市崇明区' },
  316: { publisher: '上海市金山区工业互联网中心', publishDate: '2026-01-29', deadline: '2026-02-22', region: '上海市金山区' },
  317: { publisher: '上海市普陀区城市运行中心', publishDate: '2026-01-28', deadline: '2026-02-14', region: '上海市普陀区' },
  318: { publisher: '上海市虹口区文化和旅游局', publishDate: '2026-01-28', deadline: '2026-02-12', region: '上海市虹口区' },
  319: { publisher: '上海市徐汇区中心医院', publishDate: '2026-01-27', deadline: '2026-02-24', region: '上海市徐汇区' },
  320: { publisher: '上海市浦东新区教育信息中心', publishDate: '2026-01-27', deadline: '2026-02-26', region: '上海市浦东新区' },
  321: { publisher: '上海市静安区大数据中心', publishDate: '2026-01-26', deadline: '2026-02-23', region: '上海市静安区' },
  322: { publisher: '上海市闵行区卫健委信息中心', publishDate: '2026-01-26', deadline: '2026-02-25', region: '上海市闵行区' },
  323: { publisher: '上海市松江区教育局', publishDate: '2026-01-25', deadline: '2026-02-27', region: '上海市松江区' },
  324: { publisher: '上海市青浦区政务云中心', publishDate: '2026-01-25', deadline: '2026-02-28', region: '上海市青浦区' },
  325: { publisher: '上海市奉贤区应急管理局', publishDate: '2026-01-24', deadline: '2026-03-02', region: '上海市奉贤区' },
};

const supplementalBidListItems = [
  { id: 309, title: '上海城投集团网络边界安全评估项目', budget: '92万', matchScore: 87 },
  { id: 310, title: '长宁区数据局政务数据安全风险排查服务', budget: '64万', matchScore: 84 },
  { id: 311, title: '杨浦区科创园区企业网络安全服务采购', budget: '42万', matchScore: 82 },
  { id: 312, title: '宝山区人民医院信息系统安全评估服务', budget: '38万', matchScore: 81 },
  { id: 313, title: '嘉定区政务服务平台等级保护测评项目', budget: '58万', matchScore: 80 },
  { id: 314, title: '黄浦区教育城域网安全防护升级咨询', budget: '35万', matchScore: 79 },
  { id: 315, title: '崇明区卫健委医疗专网安全检测服务', budget: '49万', matchScore: 77 },
  { id: 316, title: '金山区工业互联网安全监测服务项目', budget: '88万', matchScore: 76 },
  { id: 317, title: '普陀区城市运行中心安全加固服务', budget: '66万', matchScore: 74 },
  { id: 318, title: '虹口区文化场馆网络安全巡检服务', budget: '24万', matchScore: 73 },
  { id: 319, title: '徐汇区中心医院数据安全评估项目', budget: '71万', matchScore: 86 },
  { id: 320, title: '浦东新区教育信息中心终端安全加固项目', budget: '53万', matchScore: 83 },
  { id: 321, title: '静安区大数据中心安全运维驻场服务', budget: '115万', matchScore: 78 },
  { id: 322, title: '闵行区卫健委网络安全应急演练服务', budget: '32万', matchScore: 72 },
  { id: 323, title: '松江区教育局校园安全监测平台维护', budget: '46万', matchScore: 71 },
  { id: 324, title: '青浦区政务云日志审计平台采购', budget: '97万', matchScore: 70 },
  { id: 325, title: '奉贤区应急管理局网络安全咨询服务', budget: '29万', matchScore: 69 },
];

const parseBudgetAmount = (value: string) => {
  const amount = Number(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
};

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
      title: '标讯订阅',
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
    title: '标讯订阅',
    subtitle: '基于您的订阅配置，智能推送匹配标讯',
    summaryTitle: '标讯总结',
    highlightTitle: '重点标讯',
    listTitle: '当日标讯',
    listUnit: '标讯',
    summaryActionLabel: '查看完整报告',
    topCardTitle: '招投标市场分析',
    topCardDesc: '沿用当前订阅关键词，进入市场分析页继续查看和配置',
    topCardActionLabel: '进入市场分析',
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
      publisher: item.source,
      publishDate: selectedDate.value,
      deadline: '-',
      budget: '-',
      budgetAmount: 0,
      region: '资讯',
    }));
  }

  const baseItems = currentBidData.value?.allBids ?? [];
  const listItems =
    activePolicyId.value === 'security' && selectedDate.value === '2026-02-04'
      ? [...baseItems, ...supplementalBidListItems]
      : baseItems;

  return listItems.map((item) => ({
    ...item,
    extra: item.budget,
    budget: item.budget,
    budgetAmount: parseBudgetAmount(item.budget),
    publisher: bidListMetaById[item.id]?.publisher ?? '采购单位',
    publishDate: bidListMetaById[item.id]?.publishDate ?? selectedDate.value,
    deadline: bidListMetaById[item.id]?.deadline ?? '2026-02-15',
    region: bidListMetaById[item.id]?.region ?? '上海市',
  }));
});

const listRegionOptions = computed(() => {
  const regions = Array.from(new Set(displayListItems.value.map((item) => item.region))).filter(Boolean);
  return [
    { value: 'all', label: '全部地区' },
    ...regions.map((region) => ({ value: region, label: region.replace('上海市', '') || region })),
  ];
});

const activeListRegionLabel = computed(() => {
  return listRegionOptions.value.find((item) => item.value === activeListRegion.value)?.label ?? '全部地区';
});

const getListSortValue = (item: DisplayListItem) => {
  if (activeListSortField.value === 'budgetAmount') return item.budgetAmount;
  if (activeListSortField.value === 'deadline') return new Date(item.deadline).getTime();
  return new Date(item.publishDate).getTime();
};

const filteredDisplayListItems = computed(() => {
  if (isNewsMode.value) return displayListItems.value;

  return displayListItems.value
    .filter((item) => activeListRegion.value === 'all' || item.region === activeListRegion.value)
    .sort((a, b) => {
      const result = getListSortValue(a) - getListSortValue(b);
      return activeListSortDirection.value === 'asc' ? result : -result;
    });
});

const totalListPages = computed(() => {
  return Math.max(1, Math.ceil(filteredDisplayListItems.value.length / LIST_PAGE_SIZE));
});

const pagedDisplayListItems = computed(() => {
  const start = (currentListPage.value - 1) * LIST_PAGE_SIZE;
  return filteredDisplayListItems.value.slice(start, start + LIST_PAGE_SIZE);
});

const listPageStart = computed(() => {
  if (filteredDisplayListItems.value.length === 0) return 0;
  return (currentListPage.value - 1) * LIST_PAGE_SIZE + 1;
});

const listPageEnd = computed(() => {
  return Math.min(currentListPage.value * LIST_PAGE_SIZE, filteredDisplayListItems.value.length);
});

watch(
  [activePolicyId, selectedDate, activeListRegion, activeListSortField, activeListSortDirection],
  () => {
    currentListPage.value = 1;
  }
);

watch(currentListPage, (page) => {
  listJumpPage.value = String(page);
});

watch(totalListPages, (pageCount) => {
  if (currentListPage.value > pageCount) {
    currentListPage.value = pageCount;
  }
});

const resetListFilters = () => {
  activeListSortField.value = 'publishDate';
  activeListSortDirection.value = 'desc';
  activeListRegion.value = 'all';
  currentListPage.value = 1;
  showListRegionDropdown.value = false;
};

const selectListRegion = (region: string) => {
  activeListRegion.value = region;
  showListRegionDropdown.value = false;
};

const handleListRegionBlur = (event: FocusEvent) => {
  const currentTarget = event.currentTarget;
  const nextTarget = event.relatedTarget;

  if (!(currentTarget instanceof HTMLElement)) return;
  if (nextTarget instanceof Node && currentTarget.contains(nextTarget)) return;

  showListRegionDropdown.value = false;
};

const toggleListSort = (field: ListSortField) => {
  if (activeListSortField.value === field) {
    activeListSortDirection.value = activeListSortDirection.value === 'asc' ? 'desc' : 'asc';
    return;
  }

  activeListSortField.value = field;
  activeListSortDirection.value = 'desc';
};

const goToListPage = (page: number) => {
  const nextPage = Math.min(Math.max(page, 1), totalListPages.value);
  currentListPage.value = nextPage;
};

const goToListJumpPage = () => {
  const targetPage = Number.parseInt(listJumpPage.value, 10);

  if (!Number.isFinite(targetPage)) {
    listJumpPage.value = String(currentListPage.value);
    return;
  }

  goToListPage(targetPage);
};

const getListSortLabel = (field: ListSortField) => {
  if (activeListSortField.value !== field) return '排序';
  return activeListSortDirection.value === 'asc' ? '正序' : '倒序';
};

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
      '当前内容来自标讯订阅聚合结果。',
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

  return [];
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

const goToAllResults = () => {
  if (isNewsMode.value) {
    isFullscreen.value = true;
    selectedItemId.value = displayListItems.value[0]?.id ?? null;
    return;
  }

  router.push({
    name: 'bid-info-daily',
    query: {
      source: 'subscription',
      group: activePolicyId.value,
      date: selectedDate.value,
    },
  });
};

const openFullscreen = () => {
  goToAllResults();
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
        <div class="right-column">
          <section class="list-card">
            <div class="card-header">
              <div class="header-title">
                <component :is="pageConfig.icon" :size="18" />
                <h2>{{ pageConfig.listTitle }}</h2>
                <span class="count-badge">{{ filteredDisplayListItems.length }}条</span>
              </div>
              <div class="card-actions">
                <button v-if="!isNewsMode" type="button" class="card-reset-btn" @click="resetListFilters">
                  重置筛选
                </button>
                <button class="view-all-btn" @click="openFullscreen">
                  <Maximize2 :size="14" />
                  查看全部
                </button>
              </div>
            </div>

            <div class="bid-list">
              <div v-if="!isNewsMode" class="bid-list-head">
                <span>匹配度</span>
                <span>标讯名称</span>
                <span>发布单位</span>
                <button
                  type="button"
                  :class="['head-sort-button', { active: activeListSortField === 'publishDate' }]"
                  @click="toggleListSort('publishDate')"
                >
                  <span>发布时间</span>
                  <ArrowUp v-if="activeListSortField === 'publishDate' && activeListSortDirection === 'asc'" :size="13" />
                  <ArrowDown v-else-if="activeListSortField === 'publishDate'" :size="13" />
                  <ArrowUpDown v-else :size="13" />
                </button>
                <button
                  type="button"
                  :class="['head-sort-button', { active: activeListSortField === 'deadline' }]"
                  @click="toggleListSort('deadline')"
                >
                  <span>截止时间</span>
                  <ArrowUp v-if="activeListSortField === 'deadline' && activeListSortDirection === 'asc'" :size="13" />
                  <ArrowDown v-else-if="activeListSortField === 'deadline'" :size="13" />
                  <ArrowUpDown v-else :size="13" />
                </button>
                <button
                  type="button"
                  :class="['head-sort-button', { active: activeListSortField === 'budgetAmount' }]"
                  @click="toggleListSort('budgetAmount')"
                >
                  <span>预算金额</span>
                  <ArrowUp v-if="activeListSortField === 'budgetAmount' && activeListSortDirection === 'asc'" :size="13" />
                  <ArrowDown v-else-if="activeListSortField === 'budgetAmount'" :size="13" />
                  <ArrowUpDown v-else :size="13" />
                </button>
                <div
                  :class="['head-region-filter', { active: activeListRegion !== 'all', open: showListRegionDropdown }]"
                  @focusout="handleListRegionBlur"
                >
                  <button
                    type="button"
                    class="head-region-trigger"
                    aria-haspopup="listbox"
                    :aria-expanded="showListRegionDropdown"
                    @click.stop="showListRegionDropdown = !showListRegionDropdown"
                  >
                    <span>地区</span>
                    <strong>{{ activeListRegionLabel }}</strong>
                    <ChevronDown :size="13" />
                  </button>
                  <div v-if="showListRegionDropdown" class="head-region-menu" role="listbox">
                    <button
                      v-for="item in listRegionOptions"
                      :key="item.value"
                      type="button"
                      role="option"
                      :aria-selected="activeListRegion === item.value"
                      :class="['head-region-option', { active: activeListRegion === item.value }]"
                      @click="selectListRegion(item.value)"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-for="item in pagedDisplayListItems"
                :key="item.id"
                :class="['bid-list-item', { 'bid-list-item--fields': !isNewsMode }]"
                @click="handleItemClick(item.id)"
              >
                <span class="match-badge" :class="getMatchScoreClass(item.matchScore)">
                  {{ item.matchScore }}%
                </span>
                <span class="list-title">{{ item.title }}</span>
                <template v-if="!isNewsMode">
                  <span class="list-publisher">{{ item.publisher }}</span>
                  <span class="list-date">{{ item.publishDate }}</span>
                  <span class="list-date">{{ item.deadline }}</span>
                  <span class="list-budget">{{ item.budget }}</span>
                  <span class="list-region">{{ item.region }}</span>
                </template>
                <span v-else class="list-budget">{{ item.extra }}</span>
                <ChevronRight :size="16" class="list-arrow" />
              </div>
              <div v-if="filteredDisplayListItems.length === 0" class="bid-list-empty">
                暂无符合当前筛选条件的标讯
              </div>
            </div>
            <div v-if="filteredDisplayListItems.length > 0" class="list-pagination">
              <span class="pagination-summary">
                第 {{ listPageStart }}-{{ listPageEnd }} 条 / 共 {{ filteredDisplayListItems.length }} 条
              </span>
              <div class="pagination-actions">
                <button
                  type="button"
                  class="pagination-btn"
                  :disabled="currentListPage === 1"
                  @click="goToListPage(currentListPage - 1)"
                >
                  上一页
                </button>
                <button
                  v-for="page in totalListPages"
                  :key="page"
                  type="button"
                  :class="['pagination-page', { active: currentListPage === page }]"
                  @click="goToListPage(page)"
                >
                  {{ page }}
                </button>
                <button
                  type="button"
                  class="pagination-btn"
                  :disabled="currentListPage === totalListPages"
                  @click="goToListPage(currentListPage + 1)"
                >
                  下一页
                </button>
                <label class="pagination-jump-control">
                  <span>跳至</span>
                  <input
                    v-model="listJumpPage"
                    type="number"
                    min="1"
                    :max="totalListPages"
                    @blur="goToListJumpPage"
                    @keyup.enter="goToListJumpPage"
                  />
                  <span>页</span>
                </label>
              </div>
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
