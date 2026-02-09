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
} from 'lucide-vue-next';
import {
  industryOptions,
  narrativeOverview,
  narrativeBiddingUnits,
  narrativeCompetitors,
  narrativeProjects,
  narrativeActions,
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
      <!-- Left Navigation -->
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

      <!-- Right Content: Continuous Document Flow -->
      <div class="content-panel">
        <div class="report-document">
          <!-- Report Header -->
          <div class="report-doc-header">
            <h1>销售策略分析报告</h1>
            <div class="report-doc-meta">
              {{ industryName }} · {{ queryTimeRange }} · 生成于 {{ generatedAt }}
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
</style>
