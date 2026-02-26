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
  Factory,
  MapPin,
  FileText,
  MessageSquare,
} from 'lucide-vue-next';
import { TemplateSidebar, InfoSidebar, FormPageLayout, RegionSelector } from '../shared';
import {
  industryOptions,
  configuredCompetitors,
  competitorSearchResults,
  configuredBiddingUnits,
  biddingUnitSearchResults,
  recentTools,
  features,
  projectRecords,
  bidNoticeSearchResults,
} from './mockData';

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

const selectedBiddingUnits = computed(() => allBiddingUnits.value.filter(item => selectedBiddingUnitIds.value.includes(item.id)));
const addBiddingUnitFromInput = () => {
  const value = buSearch.value.trim();
  if (!value) return;
  const existing = allBiddingUnits.value.find(item => item.name === value);
  if (existing) {
    if (!selectedBiddingUnitIds.value.includes(existing.id)) selectedBiddingUnitIds.value.push(existing.id);
    buSearch.value = '';
    return;
  }
  const item = { id: `bu-custom-${Date.now()}`, name: value, desc: '手动添加' };
  addedBiddingUnits.value.push(item);
  selectedBiddingUnitIds.value.push(item.id);
  buSearch.value = '';
};
const removeBiddingUnit = (id: string) => {
  selectedBiddingUnitIds.value = selectedBiddingUnitIds.value.filter(item => item !== id);
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

const selectedCompetitors = computed(() => allCompetitors.value.filter(item => selectedCompetitorIds.value.includes(item.id)));
const addCompetitorFromInput = () => {
  const value = compSearch.value.trim();
  if (!value) return;
  const existing = allCompetitors.value.find(item => item.name === value);
  if (existing) {
    if (!selectedCompetitorIds.value.includes(existing.id)) selectedCompetitorIds.value.push(existing.id);
    compSearch.value = '';
    return;
  }
  const item = { id: `comp-custom-${Date.now()}`, name: value, desc: '手动添加' };
  addedCompetitors.value.push(item);
  selectedCompetitorIds.value.push(item.id);
  compSearch.value = '';
};
const removeCompetitor = (id: string) => {
  selectedCompetitorIds.value = selectedCompetitorIds.value.filter(item => item !== id);
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

const selectedBidNotices = computed(() => allBidNotices.value.filter(item => selectedBidNoticeIds.value.includes(item.id)));
const addBidNoticeFromInput = () => {
  const value = bnSearch.value.trim();
  if (!value) return;
  const existing = allBidNotices.value.find(item => item.name === value);
  if (existing) {
    if (!selectedBidNoticeIds.value.includes(existing.id)) selectedBidNoticeIds.value.push(existing.id);
    bnSearch.value = '';
    return;
  }
  const item = { id: `bn-custom-${Date.now()}`, name: value, desc: '手动添加' };
  addedBidNotices.value.push(item);
  selectedBidNoticeIds.value.push(item.id);
  bnSearch.value = '';
};
const removeBidNotice = (id: string) => {
  selectedBidNoticeIds.value = selectedBidNoticeIds.value.filter(item => item !== id);
};

// Additional info
const additionalInfo = ref('');
const maxLength = 2000;

// Computed
const currentIndustry = computed(() => {
  return industryOptions.find(i => i.id === selectedIndustry.value);
});

const canSubmit = computed(() => {
  return selectedIndustry.value && selectedTimeRange.value &&
    (selectedBiddingUnitIds.value.length > 0 || selectedCompetitorIds.value.length > 0 || selectedBidNoticeIds.value.length > 0);
});

// Industry selection
const selectIndustry = (id: string) => {
  selectedIndustry.value = id;
  showIndustryDropdown.value = false;
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
  <FormPageLayout :icon="Target" title="行业分析报告" subtitle="配置分析参数，一键生成面向销售的竞争策略报告">
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
      </div>
      <div class="card-body">
        <div class="declare-content compact">
          <div class="declare-add top">
            <input
              type="text"
              v-model="buSearch"
              placeholder="输入单位后按回车"
              @keyup.enter="addBiddingUnitFromInput"
            />
            <button @click="addBiddingUnitFromInput"><Plus :size="14" /></button>
          </div>
          <div class="declare-subtitle">已添加</div>
          <div class="declare-tag-list">
            <span v-if="selectedBiddingUnits.length === 0" class="declare-empty">暂未添加</span>
            <span v-for="item in selectedBiddingUnits" :key="item.id" class="declare-tag">
              {{ item.name }}
              <X :size="12" @click="removeBiddingUnit(item.id)" />
            </span>
          </div>
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
          <span v-if="selectedCompetitorIds.length" class="selected-count">{{ selectedCompetitorIds.length }}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="declare-content compact">
          <div class="declare-add top">
            <input
              type="text"
              v-model="compSearch"
              placeholder="输入竞品后按回车"
              @keyup.enter="addCompetitorFromInput"
            />
            <button @click="addCompetitorFromInput"><Plus :size="14" /></button>
          </div>
          <div class="declare-subtitle">已添加</div>
          <div class="declare-tag-list">
            <span v-if="selectedCompetitors.length === 0" class="declare-empty">暂未添加</span>
            <span v-for="item in selectedCompetitors" :key="item.id" class="declare-tag">
              {{ item.name }}
              <X :size="12" @click="removeCompetitor(item.id)" />
            </span>
          </div>
        </div>
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
      </div>
      <div class="card-body">
        <div class="declare-content compact">
          <div class="declare-add top">
            <input
              type="text"
              v-model="bnSearch"
              placeholder="输入标讯后按回车"
              @keyup.enter="addBidNoticeFromInput"
            />
            <button @click="addBidNoticeFromInput"><Plus :size="14" /></button>
          </div>
          <div class="declare-subtitle">已添加</div>
          <div class="declare-tag-list">
            <span v-if="selectedBidNotices.length === 0" class="declare-empty">暂未添加</span>
            <span v-for="item in selectedBidNotices" :key="item.id" class="declare-tag">
              {{ item.name }}
              <X :size="12" @click="removeBidNotice(item.id)" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5: 补充说明 -->
    <div class="section-card">
      <div class="card-header">
        <div class="header-left">
          <MessageSquare :size="18" class="header-icon" />
          <span class="header-title">补充说明</span>
          <span class="optional-tag">选填</span>
        </div>
      </div>
      <div class="card-body">
        <div class="form-group" style="margin-bottom: 0;">
          <div class="textarea-wrapper">
            <textarea
              v-model="additionalInfo"
              class="form-textarea"
              :maxlength="maxLength"
              placeholder="请输入需要重点分析的内容，如：近期重点项目、特定竞争对手的优劣势、需关注的市场动向等..."
            ></textarea>
            <span class="char-count">{{ additionalInfo.length }} / {{ maxLength }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit -->
    <div class="submit-container">
      <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">生成行业分析报告</button>
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="Target" title="行业分析报告" description="面向一线销售的智能分析工具，自动生成竞争策略报告，提供「如何赢他」的具体建议和可执行行动计划" :features="features" />
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

/* Declarative selector (same pattern as BidSubscription) */
.declare-content { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.declare-subtitle { font-size: 12px; color: #475569; font-weight: 600; }
.declare-empty { font-size: 12px; color: #94a3b8; }
.declare-tag-list { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; border: 1px solid #dbe5f2; border-radius: 10px; background: linear-gradient(180deg, #fbfdff 0%, #f8fbff 100%); min-height: 48px; }
.declare-tag-list:focus-within { border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15); }
.declare-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 999px; background: #e8f0ff; color: #1e40af; font-size: 12px; font-weight: 500; border: 1px solid #bfdbfe; }
.declare-tag svg { cursor: pointer; opacity: 0.75; }
.declare-tag svg:hover { opacity: 1; }
.declare-add { display: inline-flex; align-items: center; gap: 6px; }
.declare-add.top { width: 100%; }
.declare-add input { width: 100%; height: 34px; padding: 0 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; color: #1e293b; outline: none; background: white; }
.declare-add input:focus { border-color: #60a5fa; }
.declare-add button { width: 34px; height: 34px; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #3b82f6; color: white; cursor: pointer; flex-shrink: 0; }
.declare-add button:hover { background: #2563eb; }

/* Compact sizing for agent page */
.declare-content.compact .declare-add input { height: 32px; }
.declare-content.compact .declare-add button { width: 32px; height: 32px; }
.declare-content.compact .declare-tag-list { min-height: 44px; padding: 8px; border-radius: 8px; }
.declare-content.compact .declare-tag { font-size: 11px; padding: 4px 9px; }
</style>
