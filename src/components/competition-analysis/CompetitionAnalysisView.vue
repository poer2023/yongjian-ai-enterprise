<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Target,
  ChevronDown,
  Building2,
  Users,
  Plus,
  X,
  Search,
  Upload,
  Bookmark,
  Play,
  Factory,
  Lightbulb,
  MapPin,
  FileText,
  Calendar,
  DollarSign,
} from 'lucide-vue-next';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import {
  industryOptions,
  configuredCompetitors as defaultCompetitors,
  competitorSearchResults,
  configuredBiddingUnits as defaultBiddingUnits,
  biddingUnitSearchResults,
  recentTools,
  features,
  regionOptions,
  savedStrategies as defaultStrategies,
  projectRecords,
  bidNoticeSearchResults,
} from './mockData';
import type { CompetitorCompany, BiddingUnit } from '../../mocks/bidIndustryReport';
import type { AnalysisStrategy, SelectedBidNotice } from './types';

const router = useRouter();

// Form state
const selectedIndustry = ref('cyber-security');
const showIndustryDropdown = ref(false);
const selectedTimeRange = ref('本季度');
const timeRanges = ['本月', '本季度', '本年度', '近两年'];

// Region selection
const selectedRegions = ref<string[]>(['全国']);
const toggleRegion = (name: string) => {
  if (name === '全国') {
    selectedRegions.value = ['全国'];
    return;
  }
  // Remove '全国' when selecting specific region
  selectedRegions.value = selectedRegions.value.filter(r => r !== '全国');
  const idx = selectedRegions.value.indexOf(name);
  if (idx >= 0) {
    selectedRegions.value.splice(idx, 1);
    if (selectedRegions.value.length === 0) {
      selectedRegions.value = ['全国'];
    }
  } else {
    selectedRegions.value.push(name);
  }
};

// Bidding units
const biddingUnits = ref<BiddingUnit[]>([...defaultBiddingUnits]);
const showAddBiddingUnitModal = ref(false);
const biddingUnitSearchQuery = ref('');
const selectedBUSearchResults = ref<string[]>([]);

// Recommended bidding units
const recommendedBiddingUnits = computed(() => {
  const existingIds = new Set(biddingUnits.value.map(b => b.id));
  return biddingUnitSearchResults.filter(r => !existingIds.has(r.id)).slice(0, 3);
});

const addRecommendedBU = (result: typeof biddingUnitSearchResults[0]) => {
  biddingUnits.value.push({
    id: result.id,
    name: result.name,
    type: result.type,
    region: result.region,
    addedAt: new Date().toISOString().slice(0, 10),
  });
};

// Competitors
const competitors = ref<CompetitorCompany[]>([...defaultCompetitors]);
const showAddCompetitorModal = ref(false);
const competitorSearchQuery = ref('');
const selectedSearchResults = ref<string[]>([]);

// Recommended competitors
const recommendedCompetitors = computed(() => {
  const existingIds = new Set(competitors.value.map(c => c.id));
  return competitorSearchResults
    .filter(r => !existingIds.has(r.id))
    .sort((a, b) => b.bidCount - a.bidCount)
    .slice(0, 2);
});

const addRecommendedCompetitor = (result: typeof competitorSearchResults[0]) => {
  competitors.value.push({
    id: result.id,
    name: result.name,
    industry: result.industry,
    region: result.region,
    addedAt: new Date().toISOString().slice(0, 10),
  });
};

// Bid notices (标讯/项目)
const bidNotices = ref<SelectedBidNotice[]>([]);
const showAddBidNoticeModal = ref(false);
const bidNoticeSearchQuery = ref('');
const selectedBNSearchResults = ref<string[]>([]);

// Recommended bid notices - pending projects from projectRecords
const recommendedBidNotices = computed(() => {
  const existingIds = new Set(bidNotices.value.map(b => b.id));
  return projectRecords
    .filter(p => p.result === 'pending' && !existingIds.has(p.id))
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      client: p.client,
      budget: p.budget,
      bidDate: p.bidDate,
      category: p.category,
    }));
});

const addRecommendedBidNotice = (item: SelectedBidNotice) => {
  bidNotices.value.push({ ...item });
};

const removeBidNotice = (id: string) => {
  bidNotices.value = bidNotices.value.filter(b => b.id !== id);
};

// All searchable bid notices (projectRecords + extra from bidNoticeSearchResults)
const allSearchableBidNotices = computed(() => {
  const fromProjects: SelectedBidNotice[] = projectRecords.map(p => ({
    id: p.id,
    name: p.name,
    client: p.client,
    budget: p.budget,
    bidDate: p.bidDate,
    category: p.category,
  }));
  // Merge, avoiding duplicates by id
  const ids = new Set(fromProjects.map(p => p.id));
  const extras = bidNoticeSearchResults.filter(b => !ids.has(b.id));
  return [...fromProjects, ...extras];
});

const filteredBNSearchResults = computed(() => {
  const existingIds = new Set(bidNotices.value.map(b => b.id));
  let results = allSearchableBidNotices.value.filter(r => !existingIds.has(r.id));
  if (bidNoticeSearchQuery.value) {
    const query = bidNoticeSearchQuery.value.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.client.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
    );
  }
  return results;
});

const toggleBNSearchResult = (id: string) => {
  const idx = selectedBNSearchResults.value.indexOf(id);
  if (idx >= 0) {
    selectedBNSearchResults.value.splice(idx, 1);
  } else {
    selectedBNSearchResults.value.push(id);
  }
};

const confirmAddBidNotices = () => {
  const newNotices = allSearchableBidNotices.value
    .filter(r => selectedBNSearchResults.value.includes(r.id));
  bidNotices.value.push(...newNotices);
  selectedBNSearchResults.value = [];
  bidNoticeSearchQuery.value = '';
  showAddBidNoticeModal.value = false;
};

const openAddBidNoticeModal = () => {
  selectedBNSearchResults.value = [];
  bidNoticeSearchQuery.value = '';
  showAddBidNoticeModal.value = true;
};

// Strategies - collapsible
const strategies = ref<AnalysisStrategy[]>([...defaultStrategies]);
const activeStrategyId = ref('');
const isStrategyCollapsed = ref(true);

// Computed
const currentIndustry = computed(() => {
  return industryOptions.find(i => i.id === selectedIndustry.value);
});

const canSubmit = computed(() => {
  return selectedIndustry.value && selectedTimeRange.value &&
    (biddingUnits.value.length > 0 || competitors.value.length > 0 || bidNotices.value.length > 0);
});

const configSummary = computed(() => {
  const buCount = biddingUnits.value.length;
  const compCount = competitors.value.length;
  const bnCount = bidNotices.value.length;
  const parts: string[] = [];
  if (buCount > 0) parts.push(`${buCount} 个招标单位`);
  if (compCount > 0) parts.push(`${compCount} 家竞品企业`);
  if (bnCount > 0) parts.push(`${bnCount} 条标讯`);
  if (parts.length === 0) return '请至少添加一个分析维度的内容';
  return `将分析 ${parts.join('、')} 的竞争态势`;
});

// Industry selection
const selectIndustry = (id: string) => {
  selectedIndustry.value = id;
  showIndustryDropdown.value = false;
};

// Bidding Unit management
const removeBiddingUnit = (id: string) => {
  biddingUnits.value = biddingUnits.value.filter(b => b.id !== id);
};

const filteredBUSearchResults = computed(() => {
  const existingIds = new Set(biddingUnits.value.map(b => b.id));
  let results = biddingUnitSearchResults.filter(r => !existingIds.has(r.id));
  if (biddingUnitSearchQuery.value) {
    const query = biddingUnitSearchQuery.value.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.type.toLowerCase().includes(query) ||
      r.region.toLowerCase().includes(query)
    );
  }
  return results;
});

const toggleBUSearchResult = (id: string) => {
  const idx = selectedBUSearchResults.value.indexOf(id);
  if (idx >= 0) {
    selectedBUSearchResults.value.splice(idx, 1);
  } else {
    selectedBUSearchResults.value.push(id);
  }
};

const confirmAddBiddingUnits = () => {
  const newUnits = biddingUnitSearchResults
    .filter(r => selectedBUSearchResults.value.includes(r.id))
    .map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      region: r.region,
      addedAt: new Date().toISOString().slice(0, 10),
    }));
  biddingUnits.value.push(...newUnits);
  selectedBUSearchResults.value = [];
  biddingUnitSearchQuery.value = '';
  showAddBiddingUnitModal.value = false;
};

const openAddBiddingUnitModal = () => {
  selectedBUSearchResults.value = [];
  biddingUnitSearchQuery.value = '';
  showAddBiddingUnitModal.value = true;
};

// Competitor management
const removeCompetitor = (id: string) => {
  competitors.value = competitors.value.filter(c => c.id !== id);
};

const filteredSearchResults = computed(() => {
  const existingIds = new Set(competitors.value.map(c => c.id));
  let results = competitorSearchResults.filter(r => !existingIds.has(r.id));
  if (competitorSearchQuery.value) {
    const query = competitorSearchQuery.value.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.industry.toLowerCase().includes(query) ||
      r.region.toLowerCase().includes(query)
    );
  }
  return results;
});

const toggleSearchResult = (id: string) => {
  const idx = selectedSearchResults.value.indexOf(id);
  if (idx >= 0) {
    selectedSearchResults.value.splice(idx, 1);
  } else {
    selectedSearchResults.value.push(id);
  }
};

const confirmAddCompetitors = () => {
  const newCompetitors = competitorSearchResults
    .filter(r => selectedSearchResults.value.includes(r.id))
    .map(r => ({
      id: r.id,
      name: r.name,
      industry: r.industry,
      region: r.region,
      addedAt: new Date().toISOString().slice(0, 10),
    }));
  competitors.value.push(...newCompetitors);
  selectedSearchResults.value = [];
  competitorSearchQuery.value = '';
  showAddCompetitorModal.value = false;
};

const openAddCompetitorModal = () => {
  selectedSearchResults.value = [];
  competitorSearchQuery.value = '';
  showAddCompetitorModal.value = true;
};

// Strategy management
const loadStrategy = (strategy: AnalysisStrategy) => {
  activeStrategyId.value = strategy.id;
  selectedIndustry.value = strategy.industry;
  selectedTimeRange.value = strategy.timeRange;
  selectedRegions.value = [...strategy.regions];
};

const saveCurrentStrategy = () => {
  const name = prompt('请输入策略名称：');
  if (!name) return;
  const newStrategy: AnalysisStrategy = {
    id: `st${Date.now()}`,
    name,
    description: `${currentIndustry.value?.name || ''} - ${selectedTimeRange.value}`,
    industry: selectedIndustry.value,
    biddingUnitIds: biddingUnits.value.map(b => b.id),
    competitorIds: competitors.value.map(c => c.id),
    timeRange: selectedTimeRange.value,
    regions: [...selectedRegions.value],
    createdAt: new Date().toISOString().slice(0, 10),
  };
  strategies.value.push(newStrategy);
  activeStrategyId.value = newStrategy.id;
};

// Batch import
const handleBatchImport = () => {
  alert('批量导入功能：支持导入Excel/CSV格式的企业名单');
};

// Submit
const handleSubmit = () => {
  router.push({
    name: 'competition-report',
    query: {
      industry: selectedIndustry.value,
      timeRange: selectedTimeRange.value,
      hasBiddingUnits: biddingUnits.value.length > 0 ? '1' : '',
      hasCompetitors: competitors.value.length > 0 ? '1' : '',
      hasProjects: bidNotices.value.length > 0 ? '1' : '',
    },
  });
};
</script>

<template>
  <FormPageLayout :icon="Target" title="销售策略分析" subtitle="配置分析参数，一键生成面向销售的竞争策略报告">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

    <!-- Section 1: Analysis Config -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <Factory :size="18" class="header-icon" />
          <span class="header-title">分析范围</span>
          <span class="required-tag">必填</span>
        </div>
      </div>
      <div class="card-body">
        <!-- Industry Selection -->
        <div class="form-group">
          <label class="form-label"><span class="required">*</span> 关注行业</label>
          <div class="industry-dropdown-wrapper">
            <button class="industry-dropdown-trigger" @click="showIndustryDropdown = !showIndustryDropdown">
              <span class="industry-name">{{ currentIndustry?.name }}</span>
              <ChevronDown :size="14" :class="{ 'rotate': showIndustryDropdown }" />
            </button>
            <div v-if="showIndustryDropdown" class="industry-dropdown-menu">
              <div
                v-for="opt in industryOptions"
                :key="opt.id"
                :class="['industry-dropdown-item', { active: selectedIndustry === opt.id }]"
                @click="selectIndustry(opt.id)"
              >
                <span class="ind-name">{{ opt.name }}</span>
                <span class="ind-desc">{{ opt.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Range -->
        <div class="form-group">
          <label class="form-label"><span class="required">*</span> 分析时间范围</label>
          <div class="icon-cards">
            <div
              v-for="range in timeRanges"
              :key="range"
              class="icon-card"
              :class="{ active: selectedTimeRange === range }"
              @click="selectedTimeRange = range"
            >
              <span class="card-label">{{ range }}</span>
            </div>
          </div>
        </div>

        <!-- Region Selection -->
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label"><MapPin :size="13" style="display:inline;vertical-align:-2px;" /> 关注地区</label>
          <div class="region-pills">
            <button
              v-for="region in regionOptions"
              :key="region.id"
              :class="['region-pill', { active: selectedRegions.includes(region.name) }]"
              @click="toggleRegion(region.name)"
            >
              {{ region.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Bidding Units -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <Building2 :size="18" class="header-icon" />
          <span class="header-title">关注的招标单位</span>
          <span class="optional-tag">选填</span>
        </div>
        <span v-if="biddingUnits.length" class="competitor-count">{{ biddingUnits.length }}</span>
      </div>
      <div class="card-body">
        <div v-if="biddingUnits.length" class="competitor-list">
          <div v-for="unit in biddingUnits" :key="unit.id" class="competitor-item">
            <div class="comp-info">
              <span class="comp-name">{{ unit.name }}</span>
              <span class="comp-region">{{ unit.type }} · {{ unit.region }}</span>
            </div>
            <button class="comp-remove-btn" @click="removeBiddingUnit(unit.id)" title="移除">
              <X :size="12" />
            </button>
          </div>
        </div>

        <!-- Recommended bidding units -->
        <div v-if="recommendedBiddingUnits.length" class="recommend-section">
          <div class="tip-banner">
            <Lightbulb :size="14" />
            <span>不知道关注谁？系统已根据行业和地区推荐了热门招标单位</span>
          </div>
          <div class="recommend-header">推荐关注</div>
          <div v-for="item in recommendedBiddingUnits" :key="item.id" class="recommend-item">
            <div>
              <div class="recommend-name">{{ item.name }}</div>
              <div class="recommend-meta">{{ item.type }} · {{ item.region }} · {{ item.projectCount }} 个项目</div>
            </div>
            <button class="recommend-add-btn" @click="addRecommendedBU(item)" title="添加">
              <Plus :size="12" />
            </button>
          </div>
        </div>

        <div class="btn-row" style="margin-top: 8px;">
          <button class="add-competitor-btn" @click="openAddBiddingUnitModal">
            <Plus :size="14" />
            添加招标单位
          </button>
          <button class="batch-import-btn" @click="handleBatchImport">
            <Upload :size="14" />
            批量导入
          </button>
        </div>
      </div>
    </div>

    <!-- Section 3: Competitors -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <Users :size="18" class="header-icon" />
          <span class="header-title">竞品企业</span>
          <span class="optional-tag">选填</span>
        </div>
        <span v-if="competitors.length" class="competitor-count">{{ competitors.length }}</span>
      </div>
      <div class="card-body">
        <div v-if="competitors.length" class="competitor-list">
          <div v-for="comp in competitors" :key="comp.id" class="competitor-item">
            <div class="comp-info">
              <span class="comp-name">{{ comp.name }}</span>
              <span class="comp-region">{{ comp.region }}</span>
            </div>
            <button class="comp-remove-btn" @click="removeCompetitor(comp.id)" title="移除">
              <X :size="12" />
            </button>
          </div>
        </div>

        <!-- Recommended competitors -->
        <div v-if="recommendedCompetitors.length" class="recommend-section">
          <div class="recommend-header">经常交锋的对手</div>
          <div v-for="item in recommendedCompetitors" :key="item.id" class="recommend-item">
            <div>
              <div class="recommend-name">{{ item.name }}</div>
              <div class="recommend-meta">{{ item.region }} · 投标 {{ item.bidCount }} 次</div>
            </div>
            <button class="recommend-add-btn" @click="addRecommendedCompetitor(item)" title="添加">
              <Plus :size="12" />
            </button>
          </div>
        </div>

        <button class="add-competitor-btn" style="margin-top: 8px;" @click="openAddCompetitorModal">
          <Plus :size="14" />
          添加竞品企业
        </button>
      </div>
    </div>

    <!-- Section 4: Bid Notices (关注的标讯) -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <FileText :size="18" class="header-icon" />
          <span class="header-title">关注的标讯</span>
          <span class="optional-tag">选填</span>
        </div>
        <span v-if="bidNotices.length" class="competitor-count">{{ bidNotices.length }}</span>
      </div>
      <div class="card-body">
        <div v-if="bidNotices.length" class="competitor-list">
          <div v-for="notice in bidNotices" :key="notice.id" class="bid-notice-item">
            <div class="bid-notice-info">
              <span class="bid-notice-name">{{ notice.name }}</span>
              <div class="bid-notice-meta">
                <span>{{ notice.client }}</span>
                <span class="budget-tag">{{ notice.budget }}万</span>
                <span>{{ notice.bidDate }}</span>
              </div>
            </div>
            <button class="comp-remove-btn" @click="removeBidNotice(notice.id)" title="移除">
              <X :size="12" />
            </button>
          </div>
        </div>

        <!-- Recommended bid notices -->
        <div v-if="recommendedBidNotices.length" class="recommend-section">
          <div class="tip-banner">
            <Lightbulb :size="14" />
            <span>以下是您关注行业中即将开标的项目，可一键添加分析</span>
          </div>
          <div class="recommend-header">待开标项目推荐</div>
          <div v-for="item in recommendedBidNotices" :key="item.id" class="recommend-item">
            <div>
              <div class="recommend-name">{{ item.name }}</div>
              <div class="recommend-meta">{{ item.client }} · {{ item.budget }}万 · {{ item.bidDate }}</div>
            </div>
            <button class="recommend-add-btn" @click="addRecommendedBidNotice(item)" title="添加">
              <Plus :size="12" />
            </button>
          </div>
        </div>

        <button class="add-competitor-btn" style="margin-top: 8px;" @click="openAddBidNoticeModal">
          <Plus :size="14" />
          添加标讯
        </button>
      </div>
    </div>

    <!-- Section 5: Saved Strategies (Collapsible) -->
    <div class="section-card section-collapsible">
      <div class="card-header" @click="isStrategyCollapsed = !isStrategyCollapsed">
        <div class="header-left">
          <Bookmark :size="18" class="header-icon" />
          <span class="header-title">我的策略</span>
          <span class="optional-tag">选填</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span v-if="strategies.length" class="competitor-count">{{ strategies.length }}</span>
          <ChevronDown :size="14" :class="['collapse-icon', { expanded: !isStrategyCollapsed }]" />
        </div>
      </div>
      <div v-if="!isStrategyCollapsed" class="card-body">
        <div v-if="strategies.length" class="strategy-list">
          <div
            v-for="st in strategies"
            :key="st.id"
            :class="['strategy-item', { active: activeStrategyId === st.id }]"
            @click="loadStrategy(st)"
          >
            <div class="strategy-info">
              <span class="strategy-name">{{ st.name }}</span>
              <span class="strategy-meta-line">
                <span>{{ industryOptions.find(i => i.id === st.industry)?.name }}</span>
                <span>·</span>
                <span>{{ st.timeRange }}</span>
                <span>·</span>
                <span>{{ st.createdAt }}</span>
              </span>
            </div>
            <button class="strategy-load-btn" title="加载策略">
              <Play :size="10" />
            </button>
          </div>
        </div>
        <button class="save-strategy-btn" @click="saveCurrentStrategy">
          <Plus :size="14" />
          保存当前配置为策略
        </button>
      </div>
    </div>

    <!-- Submit -->
    <div class="submit-container">
      <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">生成销售策略分析报告</button>
      <div class="config-summary">{{ configSummary }}</div>
    </div>

    <!-- Add Bidding Unit Modal -->
    <div v-if="showAddBiddingUnitModal" class="modal-overlay" @click.self="showAddBiddingUnitModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            <Plus :size="18" />
            添加关注的招标单位
          </h3>
          <button class="modal-close" @click="showAddBiddingUnitModal = false">
            <X :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <div class="search-bar">
            <Search :size="16" />
            <input type="text" v-model="biddingUnitSearchQuery" placeholder="搜索招标单位名称、类型、地区..." class="search-input" />
          </div>
          <div class="search-results">
            <div class="results-header">
              <span>搜索结果</span>
              <span class="results-count">{{ filteredBUSearchResults.length }} 个单位</span>
            </div>
            <div class="results-list">
              <div
                v-for="result in filteredBUSearchResults"
                :key="result.id"
                :class="['result-item', { selected: selectedBUSearchResults.includes(result.id) }]"
                @click="toggleBUSearchResult(result.id)"
              >
                <div class="result-checkbox">
                  <div :class="['checkbox', { checked: selectedBUSearchResults.includes(result.id) }]"></div>
                </div>
                <div class="result-info">
                  <span class="result-name">{{ result.name }}</span>
                  <div class="result-meta">
                    <span class="result-industry">{{ result.type }}</span>
                    <span class="result-region">{{ result.region }}</span>
                    <span class="result-bids">{{ result.projectCount }} 个项目</span>
                  </div>
                </div>
              </div>
              <div v-if="filteredBUSearchResults.length === 0" class="no-results">暂无匹配的招标单位</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="showAddBiddingUnitModal = false">取消</button>
          <button class="modal-btn confirm" :disabled="selectedBUSearchResults.length === 0" @click="confirmAddBiddingUnits">
            添加已选 ({{ selectedBUSearchResults.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Add Competitor Modal -->
    <div v-if="showAddCompetitorModal" class="modal-overlay" @click.self="showAddCompetitorModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            <Plus :size="18" />
            添加竞品企业
          </h3>
          <button class="modal-close" @click="showAddCompetitorModal = false">
            <X :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <div class="search-bar">
            <Search :size="16" />
            <input type="text" v-model="competitorSearchQuery" placeholder="搜索企业名称、行业、地区..." class="search-input" />
          </div>
          <div class="search-results">
            <div class="results-header">
              <span>搜索结果</span>
              <span class="results-count">{{ filteredSearchResults.length }} 家企业</span>
            </div>
            <div class="results-list">
              <div
                v-for="result in filteredSearchResults"
                :key="result.id"
                :class="['result-item', { selected: selectedSearchResults.includes(result.id) }]"
                @click="toggleSearchResult(result.id)"
              >
                <div class="result-checkbox">
                  <div :class="['checkbox', { checked: selectedSearchResults.includes(result.id) }]"></div>
                </div>
                <div class="result-info">
                  <span class="result-name">{{ result.name }}</span>
                  <div class="result-meta">
                    <span class="result-industry">{{ result.industry }}</span>
                    <span class="result-region">{{ result.region }}</span>
                    <span class="result-bids">投标 {{ result.bidCount }} 次</span>
                  </div>
                </div>
              </div>
              <div v-if="filteredSearchResults.length === 0" class="no-results">暂无匹配的企业</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="showAddCompetitorModal = false">取消</button>
          <button class="modal-btn confirm" :disabled="selectedSearchResults.length === 0" @click="confirmAddCompetitors">
            添加已选 ({{ selectedSearchResults.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Add Bid Notice Modal -->
    <div v-if="showAddBidNoticeModal" class="modal-overlay" @click.self="showAddBidNoticeModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            <Plus :size="18" />
            添加关注的标讯
          </h3>
          <button class="modal-close" @click="showAddBidNoticeModal = false">
            <X :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <div class="search-bar">
            <Search :size="16" />
            <input type="text" v-model="bidNoticeSearchQuery" placeholder="搜索标讯名称、客户、类别..." class="search-input" />
          </div>
          <div class="search-results">
            <div class="results-header">
              <span>搜索结果</span>
              <span class="results-count">{{ filteredBNSearchResults.length }} 条标讯</span>
            </div>
            <div class="results-list">
              <div
                v-for="result in filteredBNSearchResults"
                :key="result.id"
                :class="['result-item', { selected: selectedBNSearchResults.includes(result.id) }]"
                @click="toggleBNSearchResult(result.id)"
              >
                <div class="result-checkbox">
                  <div :class="['checkbox', { checked: selectedBNSearchResults.includes(result.id) }]"></div>
                </div>
                <div class="result-info">
                  <span class="result-name">{{ result.name }}</span>
                  <div class="result-meta">
                    <span class="result-industry">{{ result.category }}</span>
                    <span class="result-region">{{ result.client }}</span>
                    <span class="result-bids">{{ result.budget }}万 · {{ result.bidDate }}</span>
                  </div>
                </div>
              </div>
              <div v-if="filteredBNSearchResults.length === 0" class="no-results">暂无匹配的标讯</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="showAddBidNoticeModal = false">取消</button>
          <button class="modal-btn confirm" :disabled="selectedBNSearchResults.length === 0" @click="confirmAddBidNotices">
            添加已选 ({{ selectedBNSearchResults.length }})
          </button>
        </div>
      </div>
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="Target" title="销售策略分析" description="面向一线销售的智能分析工具，自动生成竞争策略报告，提供「如何赢他」的具体建议和可执行行动计划" :features="features" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
@import './styles.css';
</style>
