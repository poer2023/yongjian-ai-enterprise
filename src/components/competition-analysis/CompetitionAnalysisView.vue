<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Target,
  ChevronDown,
  Building2,
  Users,
  Plus,
  Bookmark,
  Play,
  Factory,
  MapPin,
  FileText,
  Search,
} from 'lucide-vue-next';
import { TemplateSidebar, InfoSidebar, FormPageLayout, RegionSelector, ChecklistSelector } from '../shared';
import {
  industryOptions,
  configuredCompetitors,
  competitorSearchResults,
  configuredBiddingUnits,
  biddingUnitSearchResults,
  recentTools,
  features,
  savedStrategies as defaultStrategies,
  projectRecords,
  bidNoticeSearchResults,
  extraBiddingUnits,
  extraCompetitors,
  extraBidNotices,
} from './mockData';
import type { AnalysisStrategy } from './types';

const router = useRouter();

// Form state
const selectedIndustry = ref('cyber-security');
const showIndustryDropdown = ref(false);
const selectedTimeRange = ref('本季度');
const timeRanges = ['本月', '本季度', '本年度', '近两年'];

// Region selection
const selectedRegions = ref<string[]>(['全国']);

// Search queries
const buSearch = ref('');
const compSearch = ref('');
const bnSearch = ref('');

// Dynamic items added from search
const addedBiddingUnits = ref<{ id: string; name: string; desc: string }[]>([]);
const addedCompetitors = ref<{ id: string; name: string; desc: string }[]>([]);
const addedBidNotices = ref<{ id: string; name: string; desc: string }[]>([]);

// Bidding units - base recommend list
const baseBiddingUnits = computed(() => {
  const ids = new Set<string>();
  const items: { id: string; name: string; desc: string }[] = [];
  for (const bu of configuredBiddingUnits) {
    ids.add(bu.id);
    items.push({ id: bu.id, name: bu.name, desc: `${bu.type} · ${bu.region}` });
  }
  for (const bu of biddingUnitSearchResults) {
    if (!ids.has(bu.id)) {
      items.push({ id: bu.id, name: bu.name, desc: `${bu.type} · ${bu.region}` });
    }
  }
  return items;
});
const allBiddingUnits = computed(() => {
  const baseIds = new Set(baseBiddingUnits.value.map(i => i.id));
  const extra = addedBiddingUnits.value.filter(i => !baseIds.has(i.id));
  return [...baseBiddingUnits.value, ...extra];
});
const selectedBiddingUnitIds = ref<string[]>(configuredBiddingUnits.map(b => b.id));

// Search results for bidding units
const buSearchResults = computed(() => {
  if (!buSearch.value.trim()) return [];
  const q = buSearch.value.toLowerCase();
  const existingIds = new Set(allBiddingUnits.value.map(i => i.id));
  return extraBiddingUnits
    .filter(bu => !existingIds.has(bu.id) && (bu.name.toLowerCase().includes(q) || bu.type.toLowerCase().includes(q) || bu.region.toLowerCase().includes(q)))
    .map(bu => ({ id: bu.id, name: bu.name, desc: `${bu.type} · ${bu.region}` }));
});
const addBuFromSearch = (item: { id: string; name: string; desc: string }) => {
  addedBiddingUnits.value.push(item);
  selectedBiddingUnitIds.value.push(item.id);
  buSearch.value = '';
};

// Competitors - base recommend list
const baseCompetitors = computed(() => {
  const ids = new Set<string>();
  const items: { id: string; name: string; desc: string }[] = [];
  for (const c of configuredCompetitors) {
    ids.add(c.id);
    items.push({ id: c.id, name: c.name, desc: `${c.industry} · ${c.region}` });
  }
  for (const c of competitorSearchResults) {
    if (!ids.has(c.id)) {
      items.push({ id: c.id, name: c.name, desc: `${c.industry} · ${c.region}` });
    }
  }
  return items;
});
const allCompetitors = computed(() => {
  const baseIds = new Set(baseCompetitors.value.map(i => i.id));
  const extra = addedCompetitors.value.filter(i => !baseIds.has(i.id));
  return [...baseCompetitors.value, ...extra];
});
const selectedCompetitorIds = ref<string[]>(configuredCompetitors.map(c => c.id));

// Search results for competitors
const compSearchResults = computed(() => {
  if (!compSearch.value.trim()) return [];
  const q = compSearch.value.toLowerCase();
  const existingIds = new Set(allCompetitors.value.map(i => i.id));
  return extraCompetitors
    .filter(c => !existingIds.has(c.id) && (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)))
    .map(c => ({ id: c.id, name: c.name, desc: `${c.industry} · ${c.region}` }));
});
const addCompFromSearch = (item: { id: string; name: string; desc: string }) => {
  addedCompetitors.value.push(item);
  selectedCompetitorIds.value.push(item.id);
  compSearch.value = '';
};

// Bid notices - base recommend list
const baseBidNotices = computed(() => {
  const ids = new Set<string>();
  const items: { id: string; name: string; desc: string }[] = [];
  for (const p of projectRecords) {
    ids.add(p.id);
    items.push({ id: p.id, name: p.name, desc: `${p.client} · ${p.budget}万 · ${p.bidDate}` });
  }
  for (const b of bidNoticeSearchResults) {
    if (!ids.has(b.id)) {
      items.push({ id: b.id, name: b.name, desc: `${b.client} · ${b.budget}万 · ${b.bidDate}` });
    }
  }
  return items;
});
const allBidNotices = computed(() => {
  const baseIds = new Set(baseBidNotices.value.map(i => i.id));
  const extra = addedBidNotices.value.filter(i => !baseIds.has(i.id));
  return [...baseBidNotices.value, ...extra];
});
const selectedBidNoticeIds = ref<string[]>(
  projectRecords.filter(p => p.result === 'pending').map(p => p.id)
);

// Search results for bid notices
const bnSearchResults = computed(() => {
  if (!bnSearch.value.trim()) return [];
  const q = bnSearch.value.toLowerCase();
  const existingIds = new Set(allBidNotices.value.map(i => i.id));
  return extraBidNotices
    .filter(b => !existingIds.has(b.id) && (b.name.toLowerCase().includes(q) || b.client.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)))
    .map(b => ({ id: b.id, name: b.name, desc: `${b.client} · ${b.budget}万 · ${b.bidDate}` }));
});
const addBnFromSearch = (item: { id: string; name: string; desc: string }) => {
  addedBidNotices.value.push(item);
  selectedBidNoticeIds.value.push(item.id);
  bnSearch.value = '';
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
    (selectedBiddingUnitIds.value.length > 0 || selectedCompetitorIds.value.length > 0 || selectedBidNoticeIds.value.length > 0);
});

const configSummary = computed(() => {
  const buCount = selectedBiddingUnitIds.value.length;
  const compCount = selectedCompetitorIds.value.length;
  const bnCount = selectedBidNoticeIds.value.length;
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
    biddingUnitIds: [...selectedBiddingUnitIds.value],
    competitorIds: [...selectedCompetitorIds.value],
    timeRange: selectedTimeRange.value,
    regions: [...selectedRegions.value],
    createdAt: new Date().toISOString().slice(0, 10),
  };
  strategies.value.push(newStrategy);
  activeStrategyId.value = newStrategy.id;
};

// Submit
const handleSubmit = () => {
  router.push({
    name: 'competition-report',
    query: {
      industry: selectedIndustry.value,
      timeRange: selectedTimeRange.value,
      hasBiddingUnits: selectedBiddingUnitIds.value.length > 0 ? '1' : '',
      hasCompetitors: selectedCompetitorIds.value.length > 0 ? '1' : '',
      hasProjects: selectedBidNoticeIds.value.length > 0 ? '1' : '',
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
          <RegionSelector
            v-model="selectedRegions"
            national-label="全国范围"
            national-desc="关注全国各地区招投标动态"
            regional-label="指定地区"
            regional-desc="选择特定省市进行重点分析"
            selector-label="选择关注地区"
          />
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
          <span v-if="selectedBiddingUnitIds.length" class="selected-count">{{ selectedBiddingUnitIds.length }}</span>
        </div>
        <div class="header-search">
          <Search :size="12" />
          <input type="text" v-model="buSearch" placeholder="搜索招标单位..." class="header-search-input" />
        </div>
      </div>
      <div class="card-body">
        <!-- Search results grid -->
        <div v-if="buSearch.trim()" class="search-section">
          <div class="search-section-label">搜索结果</div>
          <div v-if="buSearchResults.length" class="search-grid">
            <button
              v-for="item in buSearchResults"
              :key="item.id"
              class="search-grid-item"
              @click="addBuFromSearch(item)"
            >
              <Plus :size="11" class="search-grid-add" />
              <span class="search-grid-name">{{ item.name }}</span>
              <span class="search-grid-desc">{{ item.desc }}</span>
            </button>
          </div>
          <div v-else class="search-empty">暂无匹配结果</div>
        </div>
        <ChecklistSelector
          :items="allBiddingUnits"
          v-model="selectedBiddingUnitIds"
        />
      </div>
    </div>

    <!-- Section 3: Competitors -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <Users :size="18" class="header-icon" />
          <span class="header-title">竞品企业</span>
          <span class="optional-tag">选填</span>
          <span v-if="selectedCompetitorIds.length" class="selected-count">{{ selectedCompetitorIds.length }}</span>
        </div>
        <div class="header-search">
          <Search :size="12" />
          <input type="text" v-model="compSearch" placeholder="搜索竞品企业..." class="header-search-input" />
        </div>
      </div>
      <div class="card-body">
        <div v-if="compSearch.trim()" class="search-section">
          <div class="search-section-label">搜索结果</div>
          <div v-if="compSearchResults.length" class="search-grid">
            <button
              v-for="item in compSearchResults"
              :key="item.id"
              class="search-grid-item"
              @click="addCompFromSearch(item)"
            >
              <Plus :size="11" class="search-grid-add" />
              <span class="search-grid-name">{{ item.name }}</span>
              <span class="search-grid-desc">{{ item.desc }}</span>
            </button>
          </div>
          <div v-else class="search-empty">暂无匹配结果</div>
        </div>
        <ChecklistSelector
          :items="allCompetitors"
          v-model="selectedCompetitorIds"
        />
      </div>
    </div>

    <!-- Section 4: Bid Notices -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <FileText :size="18" class="header-icon" />
          <span class="header-title">关注的标讯</span>
          <span class="optional-tag">选填</span>
          <span v-if="selectedBidNoticeIds.length" class="selected-count">{{ selectedBidNoticeIds.length }}</span>
        </div>
        <div class="header-search">
          <Search :size="12" />
          <input type="text" v-model="bnSearch" placeholder="搜索标讯..." class="header-search-input" />
        </div>
      </div>
      <div class="card-body">
        <div v-if="bnSearch.trim()" class="search-section">
          <div class="search-section-label">搜索结果</div>
          <div v-if="bnSearchResults.length" class="search-grid">
            <button
              v-for="item in bnSearchResults"
              :key="item.id"
              class="search-grid-item"
              @click="addBnFromSearch(item)"
            >
              <Plus :size="11" class="search-grid-add" />
              <span class="search-grid-name">{{ item.name }}</span>
              <span class="search-grid-desc">{{ item.desc }}</span>
            </button>
          </div>
          <div v-else class="search-empty">暂无匹配结果</div>
        </div>
        <ChecklistSelector
          :items="allBidNotices"
          v-model="selectedBidNoticeIds"
        />
      </div>
    </div>

    <!-- Submit -->
    <div class="submit-container">
      <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">生成销售策略分析报告</button>
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="Target" title="销售策略分析" description="面向一线销售的智能分析工具，自动生成竞争策略报告，提供「如何赢他」的具体建议和可执行行动计划" :features="features" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
@import './styles.css';

/* Selected count badge next to title */
.selected-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #2563eb;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
  margin-left: 2px;
}

/* Header search */
.header-search {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.2s;
  min-width: 180px;
}

.header-search:focus-within {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.header-search svg {
  color: #94a3b8;
  flex-shrink: 0;
}

.header-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 12px;
  color: #1e293b;
  outline: none;
  min-width: 0;
}

.header-search-input::placeholder {
  color: #c0c9d4;
}

/* Search section inside card body */
.search-section {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e2e8f0;
}

.search-section-label {
  font-size: 11px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 6px;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.search-grid-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding: 8px 10px;
  padding-right: 28px;
  background: #ffffff;
  border: 1px dashed #93c5fd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  position: relative;
}

.search-grid-item:hover {
  background: #dbeafe;
  border-color: #3b82f6;
  border-style: solid;
}

.search-grid-add {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  color: #3b82f6;
}

.search-grid-name {
  font-size: 12px;
  font-weight: 500;
  color: #1e40af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 16px;
}

.search-grid-desc {
  font-size: 10px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-empty {
  text-align: center;
  padding: 10px;
  color: #94a3b8;
  font-size: 12px;
}
</style>

<!-- Unscoped styles to override child component ChecklistSelector -->
<style>
.section-card .card-body .checklist-item {
  border-color: #3b82f6;
  background: #eff6ff;
}

.section-card .card-body .checklist-remove {
  opacity: 1;
  color: #3b82f6;
}

.section-card .card-body .checklist-remove:hover {
  background: #fee2e2;
  color: #ef4444;
}
</style>