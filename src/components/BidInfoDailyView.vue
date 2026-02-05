<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  FileSearch,
  BrainCircuit,
  Search,
  BookmarkPlus,
  Eye,
  History
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Tab 视图切换
const activeTab = ref<'today' | 'history'>('today');

// 历史日报数据
const historyReports = ref([
  {
    date: '2024-01-28',
    weekday: '周日',
    total: 7,
    highMatch: 4,
    mediumMatch: 3,
    lowMatch: 0,
    summary: '发现4个高匹配项目，建议优先关注XX市政府安全项目'
  },
  {
    date: '2024-01-27',
    weekday: '周六',
    total: 5,
    highMatch: 2,
    mediumMatch: 3,
    lowMatch: 0,
    summary: '本周等保类项目活跃度上升，2个新增高匹配'
  },
  {
    date: '2024-01-26',
    weekday: '周五',
    total: 9,
    highMatch: 5,
    mediumMatch: 2,
    lowMatch: 2,
    summary: '金融行业标讯增多，5个高匹配项目值得关注'
  },
  {
    date: '2024-01-25',
    weekday: '周四',
    total: 6,
    highMatch: 3,
    mediumMatch: 2,
    lowMatch: 1,
    summary: '政府类项目3个高匹配，XX区教育局项目即将截止'
  },
  {
    date: '2024-01-24',
    weekday: '周三',
    total: 4,
    highMatch: 1,
    mediumMatch: 2,
    lowMatch: 1,
    summary: '标讯数量较少，1个高匹配密评项目'
  },
  {
    date: '2024-01-23',
    weekday: '周二',
    total: 8,
    highMatch: 4,
    mediumMatch: 3,
    lowMatch: 1,
    summary: '电力行业大项目发布，预算120万值得重点跟进'
  },
  {
    date: '2024-01-22',
    weekday: '周一',
    total: 6,
    highMatch: 2,
    mediumMatch: 3,
    lowMatch: 1,
    summary: '新一周开始，2个高匹配安全运维项目'
  }
]);

// Format history date for display
const formatHistoryDate = (dateStr: string, weekday: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日 ${weekday}`;
};

// View history report detail
const viewHistoryReport = (report: typeof historyReports.value[0]) => {
  activeTab.value = 'today';
  selectedDate.value = report.date;
};

// 日期选择
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const dateRangeMode = ref(false);
const startDate = ref(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

// 搜索状态
const searchKeyword = ref('');
const searchScope = ref('all');
const searchInResults = ref(false);
const sortBy = ref('relevance');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const goToPage = ref('');

// 筛选状态 - 使用数组支持多选
const filterMatchLevels = ref<string[]>([]);
const filterTypes = ref<string[]>([]);
const filterRegions = ref<string[]>([]);

// 筛选分组展开状态
const expandedGroups = ref({
  match: true,
  type: true,
  region: false
});

// 批量选择
const selectedBids = ref<number[]>([]);

// 切换筛选分组展开状态
const toggleGroup = (group: keyof typeof expandedGroups.value) => {
  expandedGroups.value[group] = !expandedGroups.value[group];
};

// 切换筛选项
const toggleFilter = (arr: string[], value: string) => {
  const index = arr.indexOf(value);
  if (index === -1) {
    arr.push(value);
  } else {
    arr.splice(index, 1);
  }
};

// AI分析汇总数据
const aiSummary = ref({
  keyFocus: '发现3个高匹配度项目，建议优先跟进XX市政府信息系统安全等级保护测评服务项目，预算50万元，与公司等保业务高度匹配。',
  bidSuggestion: '本周截止项目2个（XX区教育局、XX医院），资质匹配度高，建议安排投标。',
  riskAlert: 'XX医院项目预算偏低（28万），需评估成本是否可覆盖。'
});

// 标讯列表（模拟更多数据）
const bidInfoList = ref([
  {
    id: 1,
    title: 'XX市政府信息系统安全等级保护测评服务项目',
    publisher: 'XX市政务服务中心',
    budget: 50,
    deadline: '2024-02-15',
    matchLevel: 'high',
    matchScore: 92,
    matchReason: '关键词匹配：等保测评、信息系统安全；地区匹配：北京。本项目要求投标单位具备等保测评资质，与公司资质高度匹配。',
    type: 'service',
    region: '北京'
  },
  {
    id: 2,
    title: 'XX银行网络安全渗透测试服务采购项目',
    publisher: 'XX银行股份有限公司',
    budget: 80,
    deadline: '2024-02-18',
    matchLevel: 'high',
    matchScore: 88,
    matchReason: '关键词匹配：渗透测试、网络安全；预算范围匹配。银行类客户，项目含金量较高。',
    type: 'service',
    region: '上海'
  },
  {
    id: 3,
    title: 'XX区教育局网络安全服务项目',
    publisher: 'XX区教育局',
    budget: 35,
    deadline: '2024-02-12',
    matchLevel: 'medium',
    matchScore: 75,
    matchReason: '关键词匹配：网络安全；预算略低于筛选范围，但属于政府类稳定客户。',
    status: 'new',
    type: 'service',
    region: '江苏'
  },
  {
    id: 4,
    title: 'XX医院信息安全等级保护咨询服务',
    publisher: 'XX市第一人民医院',
    budget: 28,
    deadline: '2024-02-14',
    matchLevel: 'medium',
    matchScore: 70,
    matchReason: '关键词匹配：等级保护；类型：咨询服务。医疗行业客户，后续可能有持续合作机会。',
    type: 'service',
    region: '北京'
  },
  {
    id: 5,
    title: 'XX集团密码应用安全性评估项目',
    publisher: 'XX集团有限公司',
    budget: 45,
    deadline: '2024-02-20',
    matchLevel: 'high',
    matchScore: 85,
    matchReason: '关键词匹配：密评；资质要求匹配。大型国企客户，项目质量有保障。',
    type: 'service',
    region: '广东'
  },
  {
    id: 6,
    title: 'XX省电力公司网络安全评估服务',
    publisher: 'XX省电力有限公司',
    budget: 120,
    deadline: '2024-02-25',
    matchLevel: 'high',
    matchScore: 90,
    matchReason: '关键词匹配：网络安全评估；预算充足，电力行业大客户。',
    type: 'service',
    region: '浙江'
  },
  {
    id: 7,
    title: 'XX市公安局安全运维服务采购',
    publisher: 'XX市公安局',
    budget: 65,
    deadline: '2024-02-22',
    matchLevel: 'medium',
    matchScore: 72,
    matchReason: '关键词匹配：安全运维；政府类客户，长期合作潜力大。',
    type: 'service',
    region: '北京'
  },
  {
    id: 8,
    title: 'XX证券公司信息安全风险评估项目',
    publisher: 'XX证券股份有限公司',
    budget: 95,
    deadline: '2024-02-28',
    matchLevel: 'high',
    matchScore: 91,
    matchReason: '关键词匹配：风险评估、信息安全；金融行业大客户，预算充足，资质匹配度高。',
    type: 'service',
    region: '上海'
  },
  {
    id: 9,
    title: 'XX大学校园网安全加固项目',
    publisher: 'XX大学',
    budget: 42,
    deadline: '2024-02-26',
    matchLevel: 'medium',
    matchScore: 68,
    matchReason: '关键词匹配：安全加固；教育行业客户，项目规模适中，可作为标杆案例。',
    type: 'service',
    region: '江苏'
  },
  {
    id: 10,
    title: 'XX保险集团数据安全评估服务',
    publisher: 'XX保险集团有限公司',
    budget: 88,
    deadline: '2024-03-01',
    matchLevel: 'high',
    matchScore: 87,
    matchReason: '关键词匹配：数据安全评估；保险行业头部客户，项目含金量高，后续合作潜力大。',
    type: 'service',
    region: '广东'
  },
  {
    id: 11,
    title: 'XX区卫生健康委员会等保测评项目',
    publisher: 'XX区卫生健康委员会',
    budget: 38,
    deadline: '2024-02-27',
    matchLevel: 'high',
    matchScore: 84,
    matchReason: '关键词匹配：等保测评；政府医疗系统客户，资质要求明确，匹配度高。',
    type: 'service',
    region: '北京'
  },
  {
    id: 12,
    title: 'XX市交通运输局网络安全监测服务',
    publisher: 'XX市交通运输局',
    budget: 55,
    deadline: '2024-03-05',
    matchLevel: 'medium',
    matchScore: 73,
    matchReason: '关键词匹配：网络安全监测；交通行业政府客户，项目周期长，稳定性好。',
    type: 'service',
    region: '浙江'
  },
  {
    id: 13,
    title: 'XX科技园区信息安全服务外包项目',
    publisher: 'XX科技园区管理委员会',
    budget: 72,
    deadline: '2024-03-08',
    matchLevel: 'medium',
    matchScore: 71,
    matchReason: '关键词匹配：信息安全服务；园区类客户，涵盖多个企业，业务拓展机会多。',
    type: 'service',
    region: '江苏'
  },
  {
    id: 14,
    title: 'XX银行分行安全设备采购项目',
    publisher: 'XX银行XX分行',
    budget: 156,
    deadline: '2024-03-10',
    matchLevel: 'low',
    matchScore: 45,
    matchReason: '类型匹配：安全设备采购；但以硬件为主，与公司主营业务匹配度较低。',
    type: 'goods',
    region: '上海'
  },
  {
    id: 15,
    title: 'XX市水务集团工控安全评估项目',
    publisher: 'XX市水务集团有限公司',
    budget: 68,
    deadline: '2024-03-12',
    matchLevel: 'medium',
    matchScore: 69,
    matchReason: '关键词匹配：工控安全评估；关键基础设施客户，专业性要求高。',
    type: 'service',
    region: '广东'
  },
]);

// 统计数据
const filterCounts = computed(() => {
  const counts = {
    match: { high: 0, medium: 0, low: 0 },
    type: { service: 0, goods: 0, engineering: 0 },
    region: { '北京': 0, '上海': 0, '江苏': 0, '浙江': 0, '广东': 0 } as Record<string, number>
  };

  bidInfoList.value.forEach(bid => {
    if (bid.matchLevel === 'high') counts.match.high++;
    else if (bid.matchLevel === 'medium') counts.match.medium++;
    else counts.match.low++;

    if (bid.type === 'service') counts.type.service++;
    else if (bid.type === 'goods') counts.type.goods++;
    else counts.type.engineering++;

    if (counts.region[bid.region] !== undefined) {
      counts.region[bid.region] = (counts.region[bid.region] ?? 0) + 1;
    }
  });

  return counts;
});

const getMatchClass = (level: string) => {
  switch (level) {
    case 'high': return 'match-high';
    case 'medium': return 'match-medium';
    case 'low': return 'match-low';
    default: return '';
  }
};

const getMatchText = (level: string) => {
  switch (level) {
    case 'high': return '高匹配';
    case 'medium': return '中匹配';
    case 'low': return '低匹配';
    default: return '';
  }
};

const viewAnalysis = (bid: any) => {
  router.push({
    name: 'bid-analysis-form',
    query: {
      bidId: bid.id,
      title: bid.title,
      fileName: `${bid.title}.pdf`
    },
  });
};

const viewDetail = (bid: any) => {
  router.push({
    name: 'bid-detail',
    query: { id: bid.id },
  });
};

const addToKnowledge = (bid: any) => {
  console.log('添加到知识库:', bid.title);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 高亮关键词
const highlightKeyword = (text: string) => {
  if (!searchKeyword.value) return text;
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

// 筛选后的标讯列表
const filteredBidList = computed(() => {
  return bidInfoList.value.filter(bid => {
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      if (searchScope.value === 'all') {
        if (!bid.title.toLowerCase().includes(keyword) &&
            !bid.publisher.toLowerCase().includes(keyword) &&
            !bid.matchReason.toLowerCase().includes(keyword)) {
          return false;
        }
      } else if (searchScope.value === 'title') {
        if (!bid.title.toLowerCase().includes(keyword)) return false;
      } else if (searchScope.value === 'publisher') {
        if (!bid.publisher.toLowerCase().includes(keyword)) return false;
      }
    }

    if (filterMatchLevels.value.length > 0 && !filterMatchLevels.value.includes(bid.matchLevel)) {
      return false;
    }

    if (filterTypes.value.length > 0 && !filterTypes.value.includes(bid.type)) {
      return false;
    }

    if (filterRegions.value.length > 0 && !filterRegions.value.includes(bid.region)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy.value === 'relevance') {
      return b.matchScore - a.matchScore;
    } else if (sortBy.value === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (sortBy.value === 'budget') {
      return b.budget - a.budget;
    }
    return 0;
  });
});

// 分页后的列表
const paginatedBidList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredBidList.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredBidList.value.length / pageSize.value);
});

// 总条数
const totalCount = computed(() => filteredBidList.value.length);

// 显示的页码范围
const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (current >= total - 3) {
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    }
  }

  return pages;
});

const goToPageNumber = () => {
  const page = parseInt(goToPage.value);
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    goToPage.value = '';
  }
};

const clearFilters = () => {
  filterMatchLevels.value = [];
  filterTypes.value = [];
  filterRegions.value = [];
};

const hasActiveFilters = computed(() => {
  return filterMatchLevels.value.length > 0 ||
         filterTypes.value.length > 0 ||
         filterRegions.value.length > 0;
});
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <select v-model="searchScope" class="search-scope">
          <option value="all">全文</option>
          <option value="title">标题</option>
          <option value="publisher">发布单位</option>
        </select>
        <div class="search-input-wrapper">
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="输入关键词搜索"
            class="search-input"
          />
        </div>
        <button class="search-btn">
          <Search :size="16" />
        </button>
      </div>

      <div class="main-content">
        <!-- 左侧筛选卡片 -->
        <div class="filter-card">
          <div class="filter-header">
            <span>筛选</span>
            <div class="filter-actions" v-if="hasActiveFilters">
              <button class="filter-action-btn" @click="clearFilters">取 消</button>
              <button class="filter-action-btn primary">确 定</button>
            </div>
          </div>

          <div class="filter-scroll">
            <!-- 匹配度 -->
            <div class="filter-group">
              <div class="filter-group-header" @click="toggleGroup('match')">
                <ChevronDown v-if="expandedGroups.match" :size="14" />
                <ChevronRight v-else :size="14" />
                <span>匹配度</span>
              </div>
              <div v-show="expandedGroups.match" class="filter-group-content">
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    :checked="filterMatchLevels.includes('high')"
                    @change="toggleFilter(filterMatchLevels, 'high')"
                  />
                  <span>高匹配</span>
                  <span class="count">({{ filterCounts.match.high }})</span>
                </label>
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    :checked="filterMatchLevels.includes('medium')"
                    @change="toggleFilter(filterMatchLevels, 'medium')"
                  />
                  <span>中匹配</span>
                  <span class="count">({{ filterCounts.match.medium }})</span>
                </label>
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    :checked="filterMatchLevels.includes('low')"
                    @change="toggleFilter(filterMatchLevels, 'low')"
                  />
                  <span>低匹配</span>
                  <span class="count">({{ filterCounts.match.low }})</span>
                </label>
              </div>
            </div>

            <!-- 项目类型 -->
            <div class="filter-group">
              <div class="filter-group-header" @click="toggleGroup('type')">
                <ChevronDown v-if="expandedGroups.type" :size="14" />
                <ChevronRight v-else :size="14" />
                <span>项目类型</span>
              </div>
              <div v-show="expandedGroups.type" class="filter-group-content">
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    :checked="filterTypes.includes('service')"
                    @change="toggleFilter(filterTypes, 'service')"
                  />
                  <span>服务类</span>
                  <span class="count">({{ filterCounts.type.service }})</span>
                </label>
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    :checked="filterTypes.includes('goods')"
                    @change="toggleFilter(filterTypes, 'goods')"
                  />
                  <span>货物类</span>
                  <span class="count">({{ filterCounts.type.goods }})</span>
                </label>
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    :checked="filterTypes.includes('engineering')"
                    @change="toggleFilter(filterTypes, 'engineering')"
                  />
                  <span>工程类</span>
                  <span class="count">({{ filterCounts.type.engineering }})</span>
                </label>
              </div>
            </div>

            <!-- 地区 -->
            <div class="filter-group">
              <div class="filter-group-header" @click="toggleGroup('region')">
                <ChevronDown v-if="expandedGroups.region" :size="14" />
                <ChevronRight v-else :size="14" />
                <span>地区</span>
              </div>
              <div v-show="expandedGroups.region" class="filter-group-content">
                <label class="filter-checkbox" v-for="region in ['北京', '上海', '江苏', '浙江', '广东']" :key="region">
                  <input
                    type="checkbox"
                    :checked="filterRegions.includes(region)"
                    @change="toggleFilter(filterRegions, region)"
                  />
                  <span>{{ region }}</span>
                  <span class="count">({{ filterCounts.region[region] || 0 }})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧结果卡片 -->
        <div class="result-card">
          <!-- 结果统计 + 排序 -->
          <div class="result-header">
            <div class="result-stats">
              为您找到相关结果共 <strong>{{ totalCount }}</strong> 篇
            </div>
            <div class="header-right-actions">
              <div class="date-section">
                <Calendar :size="14" />
                <input type="date" v-model="selectedDate" class="date-input" />
              </div>
              <select v-model="sortBy" class="sort-select">
                <option value="relevance">相关度</option>
                <option value="deadline">截止时间</option>
                <option value="budget">预算金额</option>
              </select>
            </div>
          </div>

          <!-- 结果列表滚动区 -->
          <div class="result-scroll">
            <!-- AI分析汇总卡片 - 作为第一条 -->
            <div class="ai-summary-item">
              <div class="ai-summary-header">
                <div class="ai-header-left">
                  <BrainCircuit :size="18" />
                  <span class="ai-title">今日AI分析汇总</span>
                </div>
                <span class="ai-date">
                  <Calendar :size="14" />
                  {{ selectedDate }}
                </span>
              </div>
              <div class="ai-summary-content">
                <div class="ai-row">
                  <span class="ai-label focus">重点关注</span>
                  <span class="ai-text">{{ aiSummary.keyFocus }}</span>
                </div>
                <div class="ai-row">
                  <span class="ai-label suggest">投标建议</span>
                  <span class="ai-text">{{ aiSummary.bidSuggestion }}</span>
                </div>
                <div class="ai-row">
                  <span class="ai-label warning">风险提示</span>
                  <span class="ai-text">{{ aiSummary.riskAlert }}</span>
                </div>
              </div>
            </div>

            <!-- 标讯列表 -->
            <div v-for="bid in paginatedBidList" :key="bid.id" class="result-item">
              <div class="item-checkbox">
                <input type="checkbox" v-model="selectedBids" :value="bid.id" />
              </div>
              <div class="item-content">
                <div class="item-title" v-html="highlightKeyword(bid.title)" @click="viewDetail(bid)"></div>
                <div class="item-meta">
                  <span class="meta-badge" :class="getMatchClass(bid.matchLevel)">
                    {{ getMatchText(bid.matchLevel) }}
                  </span>
                  <span class="meta-text">{{ bid.publisher }}</span>
                  <span class="meta-divider">|</span>
                  <span class="meta-text">{{ formatDate(bid.deadline) }}</span>
                </div>
                <div class="item-summary">{{ bid.matchReason }}</div>
              </div>
              <div class="item-actions">
                <button class="action-btn primary" @click="viewAnalysis(bid)">
                  <FileSearch :size="14" />
                  AI解读
                </button>
                <button class="action-btn" @click="addToKnowledge(bid)">
                  <BookmarkPlus :size="14" />
                  添加到知识库
                </button>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredBidList.length === 0" class="empty-state">
              <p>没有找到匹配的标讯</p>
              <button v-if="hasActiveFilters" class="clear-btn" @click="clearFilters">
                清除筛选条件
              </button>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination" v-if="totalPages > 1">
            <span class="page-info">第 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalCount) }} 条 / 共 {{ totalCount }} 条</span>

            <div class="page-nav">
              <button
                class="page-btn nav-btn"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <ChevronLeft :size="14" />
              </button>

              <template v-if="visiblePages && visiblePages[0] && visiblePages[0] > 1">
                <button class="page-btn" @click="currentPage = 1">1</button>
                <span class="page-ellipsis" v-if="visiblePages[0] > 2">...</span>
              </template>

              <button
                v-for="page in visiblePages"
                :key="page"
                class="page-btn"
                :class="{ active: page === currentPage }"
                @click="currentPage = page"
              >
                {{ page }}
              </button>

              <template v-if="visiblePages && visiblePages.length > 0 && visiblePages[visiblePages.length - 1] && visiblePages[visiblePages.length - 1]! < totalPages">
                <span class="page-ellipsis" v-if="visiblePages[visiblePages.length - 1]! < totalPages - 1">...</span>
                <button class="page-btn" @click="currentPage = totalPages">{{ totalPages }}</button>
              </template>

              <button
                class="page-btn nav-btn"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <ChevronRight :size="14" />
              </button>
            </div>

            <div class="page-goto">
              <span>Go to</span>
              <input
                type="text"
                v-model="goToPage"
                @keyup.enter="goToPageNumber"
                class="goto-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  height: 100%;
  background: #f5f6fa;
  overflow: hidden;
}

.content-wrapper {
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
}

/* Tab 切换 */
.tab-bar {
  display: flex;
  gap: 0;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #3b82f6;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
  flex-shrink: 0;
}

.search-scope {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  color: #333;
  background: #fafafa;
  outline: none;
  cursor: pointer;
}

.search-input-wrapper {
  flex: 1;
  max-width: 420px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-right: none;
  font-size: 14px;
  color: #333;
  outline: none;
}

.search-input:focus {
  border-color: #3b82f6;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  padding: 8px 16px;
  background: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 0 4px 4px 0;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #2563eb;
}

/* 日期范围选择 */
.date-range-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid #e0e0e0;
}

.date-mode-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
}

.date-mode-toggle input {
  accent-color: #3b82f6;
}

.single-date,
.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.date-input {
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
  background: white;
}

.date-input:focus {
  border-color: #3b82f6;
}

.date-separator {
  font-size: 13px;
  color: #999;
}

.search-option {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
}

.search-option input {
  accent-color: #3b82f6;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

/* 左侧筛选卡片 */
.filter-card {
  width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  flex-shrink: 0;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.filter-action-btn {
  padding: 4px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.filter-action-btn.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.filter-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px 16px;
}

.filter-group {
  margin-bottom: 4px;
}

.filter-group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  user-select: none;
}

.filter-group-header:hover {
  color: #3b82f6;
}

.filter-group-content {
  padding-left: 20px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
  color: #555;
  cursor: pointer;
}

.filter-checkbox input {
  accent-color: #3b82f6;
}

.filter-checkbox .count {
  color: #999;
  font-size: 12px;
}

/* 右侧结果卡片 */
.result-card {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
}

.result-stats strong {
  color: #3b82f6;
  font-weight: 600;
}

.sort-select {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  background: white;
  outline: none;
  cursor: pointer;
}

/* 结果列表滚动区 */
.result-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

/* AI分析汇总 */
.ai-summary-item {
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #93c5fd;
  border-radius: 8px;
  margin-bottom: 16px;
}

.ai-summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.ai-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
}

.ai-title {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
}

.ai-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
}

.ai-summary-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.6;
}

.ai-label {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.ai-label.focus {
  background: #3b82f6;
  color: white;
}

.ai-label.suggest {
  background: #3b82f6;
  color: white;
}

.ai-label.warning {
  background: #ef4444;
  color: white;
}

.ai-text {
  color: #555;
}

/* 标讯条目 */
.result-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}

.result-item:last-child {
  border-bottom: none;
}

.item-checkbox {
  padding-top: 3px;
  flex-shrink: 0;
}

.item-checkbox input {
  accent-color: #3b82f6;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: #222;
  line-height: 1.5;
  margin-bottom: 8px;
  cursor: pointer;
}

.item-title:hover {
  color: #3b82f6;
}

.item-title :deep(.highlight) {
  color: #3b82f6;
  font-weight: 600;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #888;
}

.meta-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.match-high {
  background: #dcfce7;
  color: #16a34a;
}

.match-medium {
  background: #fef3c7;
  color: #d97706;
}

.match-low {
  background: #fee2e2;
  color: #dc2626;
}

.meta-divider {
  color: #ddd;
}

.meta-text {
  color: #666;
}

.item-summary {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-actions {
  flex-shrink: 0;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.action-btn.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.page-info {
  font-size: 13px;
  color: #666;
}

.page-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn {
  min-width: 32px;
}

.page-ellipsis {
  padding: 0 4px;
  color: #999;
}

.page-goto {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.goto-input {
  width: 50px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  text-align: center;
  outline: none;
}

.goto-input:focus {
  border-color: #3b82f6;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

.clear-btn {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: #3b82f6;
  cursor: pointer;
}

.clear-btn:hover {
  background: #eff6ff;
}

/* 历史日报视图 */
.history-container {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.history-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.history-desc {
  font-size: 13px;
  color: #999;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.history-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-date {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.history-total {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.history-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  min-width: 60px;
}

.stat-badge.high {
  background: #dcfce7;
}

.stat-badge.medium {
  background: #fef3c7;
}

.stat-badge.low {
  background: #fee2e2;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-badge.high .stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #16a34a;
}

.stat-badge.medium .stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #d97706;
}

.stat-badge.low .stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #dc2626;
}

.history-summary {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.history-summary svg {
  flex-shrink: 0;
  color: #3b82f6;
  margin-top: 2px;
}
</style>
