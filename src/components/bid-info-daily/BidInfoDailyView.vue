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
  FileText
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { aiSummary, bidInfoList, defaultExpandedGroups } from './mockData';
import type { ExpandedGroups, FilterCounts } from './types';

const router = useRouter();

// Search state
const searchKeyword = ref('');
const searchScope = ref('all');
const sortBy = ref('relevance');

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const goToPage = ref('');

// Filter state
const filterMatchLevels = ref<string[]>([]);
const filterTypes = ref<string[]>([]);
const filterRegions = ref<string[]>([]);
const expandedGroups = ref<ExpandedGroups>({ ...defaultExpandedGroups });

// Batch selection
const selectedBids = ref<number[]>([]);
const selectedDate = ref(new Date().toISOString().split('T')[0]);

const toggleGroup = (group: keyof ExpandedGroups) => {
  expandedGroups.value[group] = !expandedGroups.value[group];
};

const toggleFilter = (arr: string[], value: string) => {
  const index = arr.indexOf(value);
  if (index === -1) {
    arr.push(value);
  } else {
    arr.splice(index, 1);
  }
};

// Statistics
const filterCounts = computed((): FilterCounts => {
  const counts: FilterCounts = {
    match: { high: 0, medium: 0, low: 0 },
    type: { service: 0, goods: 0, engineering: 0 },
    region: { '北京': 0, '上海': 0, '江苏': 0, '浙江': 0, '广东': 0 }
  };

  bidInfoList.forEach(bid => {
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
    query: { bidId: bid.id, title: bid.title, fileName: `${bid.title}.pdf` },
  });
};

const viewDetail = (bid: any) => {
  router.push({ name: 'bid-detail', query: { id: bid.id } });
};

const goToDocGenerate = (bid: any) => {
  router.push({
    name: 'bid-doc-oneclick-form',
    query: { bidId: bid.id, title: bid.title },
  });
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const highlightKeyword = (text: string) => {
  if (!searchKeyword.value) return text;
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

const filteredBidList = computed(() => {
  return bidInfoList.filter(bid => {
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

const paginatedBidList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredBidList.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredBidList.value.length / pageSize.value);
});

const totalCount = computed(() => filteredBidList.value.length);

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
      <!-- Search Bar -->
      <div class="search-bar">
        <select v-model="searchScope" class="search-scope">
          <option value="all">全文</option>
          <option value="title">标题</option>
          <option value="publisher">发布单位</option>
        </select>
        <div class="search-input-wrapper">
          <input type="text" v-model="searchKeyword" placeholder="输入关键词搜索" class="search-input" />
        </div>
        <button class="search-btn">
          <Search :size="16" />
        </button>
      </div>

      <div class="main-content">
        <!-- Left Filter Card -->
        <div class="filter-card">
          <div class="filter-header">
            <span>筛选</span>
            <div class="filter-actions" v-if="hasActiveFilters">
              <button class="filter-action-btn" @click="clearFilters">取 消</button>
              <button class="filter-action-btn primary">确 定</button>
            </div>
          </div>

          <div class="filter-scroll">
            <!-- Match Level -->
            <div class="filter-group">
              <div class="filter-group-header" @click="toggleGroup('match')">
                <ChevronDown v-if="expandedGroups.match" :size="14" />
                <ChevronRight v-else :size="14" />
                <span>匹配度</span>
              </div>
              <div v-show="expandedGroups.match" class="filter-group-content">
                <label class="filter-checkbox">
                  <input type="checkbox" :checked="filterMatchLevels.includes('high')" @change="toggleFilter(filterMatchLevels, 'high')" />
                  <span>高匹配</span>
                  <span class="count">({{ filterCounts.match.high }})</span>
                </label>
                <label class="filter-checkbox">
                  <input type="checkbox" :checked="filterMatchLevels.includes('medium')" @change="toggleFilter(filterMatchLevels, 'medium')" />
                  <span>中匹配</span>
                  <span class="count">({{ filterCounts.match.medium }})</span>
                </label>
                <label class="filter-checkbox">
                  <input type="checkbox" :checked="filterMatchLevels.includes('low')" @change="toggleFilter(filterMatchLevels, 'low')" />
                  <span>低匹配</span>
                  <span class="count">({{ filterCounts.match.low }})</span>
                </label>
              </div>
            </div>

            <!-- Project Type -->
            <div class="filter-group">
              <div class="filter-group-header" @click="toggleGroup('type')">
                <ChevronDown v-if="expandedGroups.type" :size="14" />
                <ChevronRight v-else :size="14" />
                <span>项目类型</span>
              </div>
              <div v-show="expandedGroups.type" class="filter-group-content">
                <label class="filter-checkbox">
                  <input type="checkbox" :checked="filterTypes.includes('service')" @change="toggleFilter(filterTypes, 'service')" />
                  <span>服务类</span>
                  <span class="count">({{ filterCounts.type.service }})</span>
                </label>
                <label class="filter-checkbox">
                  <input type="checkbox" :checked="filterTypes.includes('goods')" @change="toggleFilter(filterTypes, 'goods')" />
                  <span>货物类</span>
                  <span class="count">({{ filterCounts.type.goods }})</span>
                </label>
                <label class="filter-checkbox">
                  <input type="checkbox" :checked="filterTypes.includes('engineering')" @change="toggleFilter(filterTypes, 'engineering')" />
                  <span>工程类</span>
                  <span class="count">({{ filterCounts.type.engineering }})</span>
                </label>
              </div>
            </div>

            <!-- Region -->
            <div class="filter-group">
              <div class="filter-group-header" @click="toggleGroup('region')">
                <ChevronDown v-if="expandedGroups.region" :size="14" />
                <ChevronRight v-else :size="14" />
                <span>地区</span>
              </div>
              <div v-show="expandedGroups.region" class="filter-group-content">
                <label class="filter-checkbox" v-for="region in ['北京', '上海', '江苏', '浙江', '广东']" :key="region">
                  <input type="checkbox" :checked="filterRegions.includes(region)" @change="toggleFilter(filterRegions, region)" />
                  <span>{{ region }}</span>
                  <span class="count">({{ filterCounts.region[region] || 0 }})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Result Card -->
        <div class="result-card">
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

          <div class="result-scroll">
            <!-- AI Summary -->
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

            <!-- Bid List -->
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
                <button class="action-btn secondary" @click="viewAnalysis(bid)">
                  <FileSearch :size="14" />
                  标讯解读
                </button>
                <button class="action-btn primary" @click="goToDocGenerate(bid)">
                  <FileText :size="14" />
                  生成标书
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredBidList.length === 0" class="empty-state">
              <p>没有找到匹配的标讯</p>
              <button v-if="hasActiveFilters" class="clear-btn" @click="clearFilters">
                清除筛选条件
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <span class="page-info">第 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalCount) }} 条 / 共 {{ totalCount }} 条</span>

            <div class="page-nav">
              <button class="page-btn nav-btn" :disabled="currentPage === 1" @click="currentPage--">
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

              <button class="page-btn nav-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                <ChevronRight :size="14" />
              </button>
            </div>

            <div class="page-goto">
              <span>Go to</span>
              <input type="text" v-model="goToPage" @keyup.enter="goToPageNumber" class="goto-input" />
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
