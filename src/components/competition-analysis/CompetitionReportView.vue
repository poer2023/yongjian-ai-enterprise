<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ChevronLeft,
  Download,
  Building2,
  FolderOpen,
  Target,
  X,
  BarChart3,
  Crosshair,
  Users,
  FileText,
  ChevronDown,
  MapPin,
  Calendar,
  Lightbulb,
  Trophy,
  Shield,
  Swords,
} from 'lucide-vue-next';
import {
  industryOptions,
  configuredCompetitors,
  configuredBiddingUnits,
  projectRecords,
  narrativeOverview,
  narrativeBiddingUnits,
  narrativeCompetitors,
  narrativeProjects,
  narrativeActions,
  howToWin,
  salesTips,
  overviewConclusions,
  actionRecommendations,
} from './mockData';
import type { ReportTab, ReportDimension, NarrativeSection } from './types';

const router = useRouter();
const route = useRoute();

// Parse query params
const queryIndustry = (route.query.industry as string) || 'cyber-security';
const queryTimeRange = (route.query.timeRange as string) || '本季度';
const queryHasBiddingUnits = route.query.hasBiddingUnits === '1';
const queryHasCompetitors = route.query.hasCompetitors === '1';
const queryHasProjects = route.query.hasProjects === '1';

const industryName = computed(() => {
  return industryOptions.find(i => i.id === queryIndustry)?.name || '网络安全';
});

const generatedAt = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Report tabs
const reportTabs = ref<ReportTab[]>([
  {
    id: 'tab1',
    label: `${industryName.value}-${queryTimeRange}`,
    industry: queryIndustry,
    timeRange: queryTimeRange,
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  },
]);
const activeTabId = ref('tab1');

// Active strategy items for highlighting in report
const activeCompetitorId = ref<string | null>(null);
const activeBiddingUnitId = ref<string | null>(null);

// Mock data: bidding units and competitors for display
const selectedBiddingUnits = computed(() => {
  return queryHasBiddingUnits ? configuredBiddingUnits : [];
});

const selectedCompetitors = computed(() => {
  return queryHasCompetitors ? configuredCompetitors : [];
});

const selectedProjects = computed(() => {
  if (!queryHasProjects) return [];
  return projectRecords.filter(p => p.result === 'pending').slice(0, 3);
});

// Dynamic navigation dimensions based on query params
const dimensions = computed(() => {
  const dims: { id: ReportDimension; name: string; icon: typeof BarChart3 }[] = [
    { id: 'overview', name: '总览与结论', icon: BarChart3 },
  ];
  if (queryHasBiddingUnits) {
    dims.push({ id: 'biddingUnit', name: '招标单位分析', icon: Building2 });
  }
  if (queryHasCompetitors) {
    dims.push({ id: 'competitor', name: '竞争对手分析', icon: Users });
  }
  if (queryHasProjects) {
    dims.push({ id: 'project', name: '项目分析', icon: FolderOpen });
  }
  dims.push({ id: 'action', name: '行动建议', icon: Crosshair });
  return dims;
});

// Map dimension id to narrative section data
const sectionDataMap: Record<ReportDimension, NarrativeSection> = {
  overview: narrativeOverview,
  biddingUnit: narrativeBiddingUnits,
  competitor: narrativeCompetitors,
  project: narrativeProjects,
  action: narrativeActions,
};

// Build sections list based on active dimensions
const allSections = computed(() => {
  return dimensions.value.map(dim => sectionDataMap[dim.id]);
});

// Scroll-spy: track which section is currently in view
const activeDimension = ref<ReportDimension>('overview');
let observer: IntersectionObserver | null = null;

const scrollToSection = (id: ReportDimension) => {
  const el = document.getElementById('section-' + id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Click a competitor in sidebar to scroll to competitor section
const focusCompetitor = (id: string) => {
  activeCompetitorId.value = activeCompetitorId.value === id ? null : id;
  scrollToSection('competitor');
};

// Click a bidding unit in sidebar to scroll to biddingUnit section
const focusBiddingUnit = (id: string) => {
  activeBiddingUnitId.value = activeBiddingUnitId.value === id ? null : id;
  scrollToSection('biddingUnit');
};

onMounted(() => {
  nextTick(() => {
    const contentPanel = document.querySelector('.content-panel');
    if (!contentPanel) return;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '') as ReportDimension;
            activeDimension.value = id;
          }
        }
      },
      {
        root: contentPanel,
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0,
      }
    );

    dimensions.value.forEach(dim => {
      const el = document.getElementById('section-' + dim.id);
      if (el) observer!.observe(el);
    });
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

// Helpers
const goBack = () => {
  router.push({ name: 'competition-analysis' });
};

const handleExport = () => {
  alert('销售策略分析报告已导出为PDF');
};

const closeTab = (tabId: string) => {
  if (reportTabs.value.length <= 1) return;
  const idx = reportTabs.value.findIndex(t => t.id === tabId);
  reportTabs.value = reportTabs.value.filter(t => t.id !== tabId);
  if (activeTabId.value === tabId) {
    activeTabId.value = reportTabs.value[Math.min(idx, reportTabs.value.length - 1)]?.id ?? reportTabs.value[0]?.id ?? 'tab1';
  }
};

// Config summary stats
const configStats = computed(() => {
  const parts: string[] = [];
  if (selectedBiddingUnits.value.length > 0) parts.push(`${selectedBiddingUnits.value.length} 个招标单位`);
  if (selectedCompetitors.value.length > 0) parts.push(`${selectedCompetitors.value.length} 家竞品`);
  if (selectedProjects.value.length > 0) parts.push(`${selectedProjects.value.length} 条标讯`);
  return parts.join(' · ');
});
</script>

<template>
  <div class="report-page">
    <!-- Header -->
    <div class="report-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回配置</span>
      </button>
      <div class="header-title-area">
        <Target :size="20" />
        <h1>销售策略分析报告</h1>
        <span class="header-subtitle">{{ industryName }} · {{ queryTimeRange }}</span>
      </div>
      <div class="header-controls">
        <!-- Report Tabs -->
        <div v-if="reportTabs.length > 1" class="report-tabs">
          <button
            v-for="tab in reportTabs"
            :key="tab.id"
            :class="['report-tab', { active: activeTabId === tab.id }]"
            @click="activeTabId = tab.id"
          >
            {{ tab.label }}
            <span class="tab-close" @click.stop="closeTab(tab.id)">
              <X :size="10" />
            </span>
          </button>
        </div>
        <button class="action-btn" @click="handleExport">
          <Download :size="16" />
          导出报告
        </button>
      </div>
    </div>

    <div class="report-content">
      <!-- Left Navigation (TOC only) -->
      <div class="nav-panel">
        <div class="nav-title">报告目录</div>
        <div class="nav-list">
          <div
            v-for="dim in dimensions"
            :key="dim.id"
            :class="['nav-item', { active: activeDimension === dim.id }]"
            @click="scrollToSection(dim.id)"
          >
            <component :is="dim.icon" :size="16" />
            <span>{{ dim.name }}</span>
          </div>
        </div>
      </div>

      <!-- Center Content: Continuous Document Flow -->
      <div class="content-panel">
        <div class="report-document">
          <!-- Report Header -->
          <div class="report-doc-header">
            <h1>销售策略分析报告</h1>
            <div class="report-doc-meta">
              {{ industryName }} · {{ queryTimeRange }} · 生成于 {{ generatedAt }}
            </div>
            <div class="report-doc-config-bar">
              <span v-if="selectedBiddingUnits.length" class="doc-config-tag">
                <Building2 :size="12" />
                {{ selectedBiddingUnits.length }} 个招标单位
              </span>
              <span v-if="selectedCompetitors.length" class="doc-config-tag">
                <Users :size="12" />
                {{ selectedCompetitors.length }} 家竞品企业
              </span>
              <span v-if="selectedProjects.length" class="doc-config-tag">
                <FileText :size="12" />
                {{ selectedProjects.length }} 条关注标讯
              </span>
            </div>
          </div>

          <!-- Sections -->
          <div
            v-for="section in allSections"
            :key="section.id"
            :id="'section-' + section.id"
            class="report-section"
          >
            <h2 class="report-section-title">{{ section.title }}</h2>
            <template v-for="(para, idx) in section.paragraphs" :key="idx">
              <p v-if="para.type === 'text'" class="report-paragraph" v-html="para.content" />
              <div v-else-if="para.type === 'highlight-box'" :class="['report-callout', para.boxType]">
                <div v-html="para.content" />
              </div>
              <template v-else-if="para.type === 'numbered-list'">
                <p v-if="para.content" class="report-paragraph" style="text-indent:0;margin-bottom:8px;font-weight:600;" v-html="para.content" />
                <ol class="report-ordered-list">
                  <li v-for="(item, i) in para.items" :key="i" v-html="item" />
                </ol>
              </template>
              <blockquote v-else-if="para.type === 'quote'" class="report-blockquote" v-html="para.content" />
            </template>

            <!-- Embedded strategy cards after competitor section -->
            <template v-if="section.id === 'competitor' && selectedCompetitors.length">
              <div class="strategy-link-section">
                <h3 class="strategy-link-title">
                  <Swords :size="16" />
                  竞争策略速查
                </h3>
                <p class="strategy-link-desc">以下是针对各竞争对手的「如何赢他」策略要点，点击展开查看详细建议：</p>
                <div class="strategy-link-cards">
                  <div
                    v-for="comp in selectedCompetitors"
                    :key="comp.id"
                    :class="['strategy-link-card', { active: activeCompetitorId === comp.id }]"
                  >
                    <div class="strategy-link-card-header" @click="activeCompetitorId = activeCompetitorId === comp.id ? null : comp.id">
                      <div class="strategy-link-card-left">
                        <Shield :size="14" />
                        <span class="strategy-link-card-name">{{ comp.name }}</span>
                        <span class="strategy-link-card-region">{{ comp.region }}</span>
                      </div>
                      <ChevronDown :size="14" :class="['strategy-expand-icon', { expanded: activeCompetitorId === comp.id }]" />
                    </div>
                    <div v-if="activeCompetitorId === comp.id && howToWin[comp.id]" class="how-to-win-card embedded">
                      <h4 class="how-to-win-title">
                        <Trophy :size="14" />
                        {{ howToWin[comp.id]!.title }}
                      </h4>
                      <ul class="how-to-win-list">
                        <li v-for="(tip, i) in howToWin[comp.id]!.tips" :key="i">{{ tip }}</li>
                      </ul>
                    </div>
                    <div v-if="activeCompetitorId === comp.id && !howToWin[comp.id]" class="no-strategy-hint">
                      暂无针对该竞品的专项策略，建议收集更多交锋数据后生成
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Embedded sales tips after biddingUnit section -->
            <template v-if="section.id === 'biddingUnit' && selectedBiddingUnits.length">
              <div class="strategy-link-section">
                <h3 class="strategy-link-title">
                  <Lightbulb :size="16" />
                  客户攻略速查
                </h3>
                <p class="strategy-link-desc">以下是针对各招标单位的销售建议，帮助销售团队快速了解客户偏好和突破策略：</p>
                <div class="strategy-link-cards">
                  <div
                    v-for="bu in selectedBiddingUnits"
                    :key="bu.id"
                    :class="['strategy-link-card', { active: activeBiddingUnitId === bu.id }]"
                  >
                    <div class="strategy-link-card-header" @click="activeBiddingUnitId = activeBiddingUnitId === bu.id ? null : bu.id">
                      <div class="strategy-link-card-left">
                        <Building2 :size="14" />
                        <span class="strategy-link-card-name">{{ bu.name }}</span>
                        <span class="strategy-link-card-region">{{ bu.type }} · {{ bu.region }}</span>
                      </div>
                      <ChevronDown :size="14" :class="['strategy-expand-icon', { expanded: activeBiddingUnitId === bu.id }]" />
                    </div>
                    <div v-if="activeBiddingUnitId === bu.id && salesTips[bu.id]" class="sales-tips-card embedded">
                      <h4 class="sales-tips-title">
                        <Lightbulb :size="14" />
                        销售建议
                      </h4>
                      <ul class="sales-tips-list">
                        <li v-for="(tip, i) in salesTips[bu.id]" :key="i">{{ tip }}</li>
                      </ul>
                    </div>
                    <div v-if="activeBiddingUnitId === bu.id && !salesTips[bu.id]" class="no-strategy-hint">
                      暂无该客户的专项销售建议，建议积累更多客户交互数据后生成
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Embedded action items after action section -->
            <template v-if="section.id === 'action'">
              <div class="strategy-link-section">
                <h3 class="strategy-link-title">
                  <Target :size="16" />
                  关键客户维护计划
                </h3>
                <div class="customer-maintenance-list">
                  <div v-for="(item, i) in actionRecommendations.customerMaintenance" :key="i" class="customer-maintenance-card">
                    <div class="cm-header">
                      <span class="cm-client">{{ item.client }}</span>
                      <span :class="['priority-badge', item.priority]">{{ item.priority === 'high' ? '高优先' : '中优先' }}</span>
                    </div>
                    <div class="cm-meta">
                      <span>上次联系：{{ item.lastContact }}</span>
                    </div>
                    <div class="cm-action">{{ item.nextAction }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Right Sidebar: Analysis Config -->
      <div class="config-panel">
        <div class="config-panel-header">
          <Target :size="14" />
          <span>分析配置</span>
        </div>

        <!-- Industry & Time -->
        <div class="config-meta-row">
          <span class="config-meta-tag">{{ industryName }}</span>
          <span class="config-meta-tag">
            <Calendar :size="10" />
            {{ queryTimeRange }}
          </span>
        </div>

        <!-- Bidding Units -->
        <div v-if="selectedBiddingUnits.length" class="config-group">
          <div class="config-group-header">
            <Building2 :size="12" />
            <span>招标单位</span>
            <span class="config-group-count">{{ selectedBiddingUnits.length }}</span>
          </div>
          <div class="config-group-list">
            <div
              v-for="bu in selectedBiddingUnits"
              :key="bu.id"
              :class="['config-item', { highlighted: activeBiddingUnitId === bu.id }]"
              @click="focusBiddingUnit(bu.id)"
            >
              <span class="config-item-name">{{ bu.name }}</span>
              <span v-if="salesTips[bu.id]" class="config-item-badge tips">
                <Lightbulb :size="9" />
              </span>
            </div>
          </div>
        </div>

        <!-- Competitors -->
        <div v-if="selectedCompetitors.length" class="config-group">
          <div class="config-group-header">
            <Users :size="12" />
            <span>竞品企业</span>
            <span class="config-group-count">{{ selectedCompetitors.length }}</span>
          </div>
          <div class="config-group-list">
            <div
              v-for="comp in selectedCompetitors"
              :key="comp.id"
              :class="['config-item', { highlighted: activeCompetitorId === comp.id }]"
              @click="focusCompetitor(comp.id)"
            >
              <span class="config-item-name">{{ comp.name }}</span>
              <span v-if="howToWin[comp.id]" class="config-item-badge strategy">
                <Swords :size="9" />
              </span>
            </div>
          </div>
        </div>

        <!-- Projects / Bid Notices -->
        <div v-if="selectedProjects.length" class="config-group">
          <div class="config-group-header">
            <FileText :size="12" />
            <span>关注标讯</span>
            <span class="config-group-count">{{ selectedProjects.length }}</span>
          </div>
          <div class="config-group-list">
            <div
              v-for="proj in selectedProjects"
              :key="proj.id"
              class="config-item"
              @click="scrollToSection('project')"
            >
              <span class="config-item-name">{{ proj.name }}</span>
              <span class="config-item-budget">{{ proj.budget }}万</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles.css';

.tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 6px;
  border-radius: 50%;
  color: #94a3b8;
  transition: all 0.15s;
}

.tab-close:hover {
  background: #e2e8f0;
  color: #ef4444;
}

/* ============ Right Config Panel ============ */
.config-panel {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 140px);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.config-panel::-webkit-scrollbar {
  display: none;
}

.config-panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.config-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.config-meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 11px;
  color: #475569;
  font-weight: 500;
}

.config-group {
  margin-bottom: 10px;
}

.config-group-header {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  padding-left: 4px;
}

.config-group-count {
  margin-left: auto;
  background: #fef2f2;
  color: #ef4444;
  font-size: 10px;
  padding: 0 5px;
  border-radius: 8px;
}

.config-group-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.config-item:hover {
  background: #f8fafc;
}

.config-item.highlighted {
  background: #fef2f2;
  border-color: #fecaca;
}

.config-item-name {
  font-size: 11px;
  color: #334155;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.config-item-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.config-item-badge.tips {
  background: #f0fdf4;
  color: #16a34a;
}

.config-item-badge.strategy {
  background: #fef3c7;
  color: #d97706;
}

.config-item-budget {
  font-size: 10px;
  color: #ef4444;
  font-weight: 500;
  flex-shrink: 0;
}

/* ============ Report Doc Config Bar ============ */
.report-doc-config-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.doc-config-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

/* ============ Strategy Link Section (embedded in report) ============ */
.strategy-link-section {
  margin-top: 28px;
  padding: 24px;
  background: #fafbfd;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.strategy-link-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.strategy-link-title svg {
  color: #ef4444;
}

.strategy-link-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.strategy-link-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strategy-link-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s;
}

.strategy-link-card:hover {
  border-color: #cbd5e1;
}

.strategy-link-card.active {
  border-color: #fecaca;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);
}

.strategy-link-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
}

.strategy-link-card-header:hover {
  background: #f8fafc;
}

.strategy-link-card-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.strategy-link-card-left svg {
  flex-shrink: 0;
  color: #64748b;
}

.strategy-link-card-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.strategy-link-card-region {
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 0;
}

.strategy-expand-icon {
  color: #94a3b8;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.strategy-expand-icon.expanded {
  transform: rotate(180deg);
}

/* Embedded how-to-win and sales-tips cards */
.how-to-win-card.embedded,
.sales-tips-card.embedded {
  margin: 0;
  border-radius: 0;
  border-top: 1px solid #e2e8f0;
}

.no-strategy-hint {
  padding: 14px 16px;
  border-top: 1px solid #f1f5f9;
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  font-style: italic;
}

/* ============ Customer Maintenance Cards ============ */
.customer-maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.customer-maintenance-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  transition: all 0.2s;
}

.customer-maintenance-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.cm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.cm-client {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.cm-meta {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.cm-action {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #ef4444;
}
</style>
