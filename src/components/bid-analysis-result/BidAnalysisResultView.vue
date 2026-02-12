<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import {
  ChevronLeft,
  FileSearch,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  Building2,
  DollarSign,
  Users,
  FileText,
  Award,
  Clock,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  ClipboardCheck,
  ListChecks
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';
import type { DocumentSection } from './types';
import {
  projectInfo as mockProjectInfo,
  qualifications as mockQualifications,
  scoreStandards as mockScoreStandards,
  timeline as mockTimeline,
  matchAssessment as mockMatchAssessment,
  suggestions as mockSuggestions,
  performanceRequirements as mockPerformanceRequirements,
  teamRequirements as mockTeamRequirements,
  commitmentRequirements as mockCommitmentRequirements,
  disqualificationItems as mockDisqualificationItems,
  actionPlan as mockActionPlan,
  documentSections as mockDocumentSections
} from './mockData';

const router = useRouter();
const route = useRoute();

const bidTitle = route.query.title as string || 'XX市政府信息系统安全等级保护测评服务项目';

// Use mock data
const projectInfo = ref(mockProjectInfo);
const qualifications = ref(mockQualifications);
const scoreStandards = ref(mockScoreStandards);
const timeline = ref(mockTimeline);
const matchAssessment = ref(mockMatchAssessment);
const suggestions = ref(mockSuggestions);
const performanceRequirements = ref(mockPerformanceRequirements);
const teamRequirements = ref(mockTeamRequirements);
const commitmentRequirements = ref(mockCommitmentRequirements);
const disqualificationItems = ref(mockDisqualificationItems);
const actionPlan = ref(mockActionPlan);
const documentSections = ref<DocumentSection[]>(mockDocumentSections);

// Track active section and highlight text
const activeSection = ref<string | null>(null);
const highlightText = ref<string | null>(null);

// Escape special regex characters
const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Highlight content by wrapping matched text with <mark> tag
const highlightContent = (content: string, sectionId: string) => {
  if (!highlightText.value || activeSection.value !== sectionId) {
    return content;
  }
  const escaped = escapeRegExp(highlightText.value);
  return content.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="highlight-text">$1</mark>'
  );
};

// Scroll to section and highlight matching text
const scrollToAndHighlight = (targetSection: string, searchText: string) => {
  highlightText.value = searchText;
  activeSection.value = targetSection;

  const element = document.getElementById(targetSection);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => {
    highlightText.value = null;
    activeSection.value = null;
  }, 2000);
};

const goBack = () => {
  router.push({ name: 'bid-subscription' });
};

const scrollToSection = (targetSection: string) => {
  const element = document.getElementById(targetSection);
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const getStatusIcon = (status: string) => {
  return status === 'match' ? CheckCircle : status === 'partial' ? Clock : XCircle;
};

const getStatusClass = (status: string) => {
  return status === 'match' ? 'status-match' : status === 'partial' ? 'status-partial' : 'status-nomatch';
};

const generateBidDoc = () => {
  router.push({
    name: 'bid-doc-oneclick-form',
    query: { bidId: route.query.bidId, title: bidTitle },
  });
};

const handleExport = () => {
  alert('解读报告已导出为PDF');
};

// Resizable panels
const leftPanelWidth = ref(50);
const isDragging = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = (x / rect.width) * 100;
  leftPanelWidth.value = Math.min(Math.max(percentage, 30), 70);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<template>
  <div class="result-page">
    <!-- Header -->
    <div class="result-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回</span>
      </button>
      <div class="header-title">
        <FileSearch :size="20" />
        <h1>标讯AI解读</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary" @click="handleExport">
          <Download :size="16" />
          导出报告
        </button>
        <button class="action-btn primary" @click="generateBidDoc">
          <FileText :size="16" />
          生成标书
        </button>
      </div>
    </div>

    <div class="result-content" ref="containerRef">
      <!-- 左侧：招标文件预览 -->
      <div class="preview-panel" :style="{ width: leftPanelWidth + '%' }">
        <div class="panel-header">
          <h2>招标文件</h2>
          <span class="file-name">招标文件.pdf</span>
        </div>
        <div class="preview-content">
          <div class="doc-preview">
            <div v-for="section in documentSections" :key="section.id" class="doc-section">
              <h3 class="doc-section-title">{{ section.title }}</h3>
              <div v-for="sub in section.subsections" :key="sub.id"
                   :id="sub.id"
                   class="doc-subsection"
                   :class="{ 'active': activeSection === sub.id }">
                <h4 class="doc-subsection-title">{{ sub.title }}</h4>
                <div class="doc-subsection-content"
                     v-html="highlightContent(sub.content, sub.id)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 拖动分隔条 -->
      <div class="resizer" @mousedown="startDrag" :class="{ dragging: isDragging }">
        <div class="resizer-line"></div>
      </div>

      <!-- 右侧：AI解读报告 -->
      <div class="analysis-panel" :style="{ width: (100 - leftPanelWidth) + '%' }">
        <div class="panel-header">
          <h2>AI解读报告</h2>
        </div>
        <div class="analysis-content">
          <!-- 匹配度总评 -->
          <div class="report-section match-section clickable" @click="scrollToSection('doc-project-info')">
            <div class="match-header">
              <div class="match-score">
                <span class="score-value">{{ matchAssessment.score }}</span>
                <span class="score-unit">%</span>
              </div>
              <div class="match-info">
                <span class="match-label">综合匹配度</span>
                <span class="match-rec">{{ matchAssessment.recommendation }}</span>
              </div>
            </div>
            <div class="match-reasons">
              <span v-for="(reason, index) in matchAssessment.reasons" :key="index" class="reason-tag">
                <CheckCircle :size="12" />
                {{ reason }}
              </span>
            </div>
          </div>

          <!-- 投标建议 -->
          <div class="report-section clickable" @click="scrollToSection('doc-scoring-overview')">
            <h3 class="section-title">
              <FileText :size="16" />
              投标建议
            </h3>
            <ol class="suggestion-list">
              <li v-for="(suggestion, index) in suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ol>
          </div>

          <!-- 项目概况 -->
          <div class="report-section clickable" @click="scrollToSection('doc-project-info')">
            <h3 class="section-title">
              <Building2 :size="16" />
              项目概况
            </h3>
            <div class="info-table">
              <div class="info-row">
                <span class="info-label">项目名称</span>
                <span class="info-value">{{ projectInfo.name }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">采购人</span>
                <span class="info-value">{{ projectInfo.purchaser }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">预算金额</span>
                <span class="info-value highlight">{{ projectInfo.budget }}万元</span>
              </div>
              <div class="info-row">
                <span class="info-label">报名截止</span>
                <span class="info-value">{{ projectInfo.deadline }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">开标时间</span>
                <span class="info-value">{{ projectInfo.openTime }}</span>
              </div>
            </div>
          </div>

          <!-- 资质要求 -->
          <div class="report-section">
            <h3 class="section-title">
              <Award :size="16" />
              资质要求清单
            </h3>
            <div class="qualification-list">
              <div v-for="qual in qualifications" :key="qual.id" class="qual-item clickable-item" :class="getStatusClass(qual.status)" @click="scrollToAndHighlight(qual.targetSection, qual.searchText)">
                <component :is="getStatusIcon(qual.status)" :size="16" class="qual-icon" />
                <div class="qual-content">
                  <span class="qual-requirement">{{ qual.requirement }}</span>
                  <span class="qual-detail">{{ qual.detail }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 业绩证明要求 -->
          <div class="report-section">
            <h3 class="section-title">
              <Briefcase :size="16" />
              业绩证明要求
            </h3>
            <div class="qualification-list">
              <div v-for="(item, index) in performanceRequirements" :key="index" class="qual-item clickable-item" :class="getStatusClass(item.status)" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <component :is="getStatusIcon(item.status)" :size="16" class="qual-icon" />
                <div class="qual-content">
                  <span class="qual-requirement">{{ item.requirement }}：{{ item.value }}</span>
                  <span class="qual-detail">{{ item.detail }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 项目团队配置要求 -->
          <div class="report-section">
            <h3 class="section-title">
              <Users :size="16" />
              项目团队配置要求
            </h3>
            <div class="team-table">
              <div class="team-header">
                <span>岗位</span>
                <span>人数</span>
                <span>要求</span>
                <span>匹配情况</span>
              </div>
              <div v-for="(item, index) in teamRequirements" :key="index" class="team-row clickable-item" :class="getStatusClass(item.status)" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <span class="team-role">{{ item.role }}</span>
                <span class="team-count">{{ item.count }}</span>
                <span class="team-req">{{ item.requirement }}</span>
                <span class="team-status">
                  <component :is="getStatusIcon(item.status)" :size="14" />
                  {{ item.detail }}
                </span>
              </div>
            </div>
          </div>

          <!-- 承诺/响应要求 -->
          <div class="report-section">
            <h3 class="section-title">
              <ClipboardCheck :size="16" />
              承诺/响应要求
            </h3>
            <div class="commitment-list">
              <div v-for="(item, index) in commitmentRequirements" :key="index" class="commitment-item clickable-item" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <CheckCircle v-if="item.canMeet" :size="16" class="commitment-icon can-meet" />
                <XCircle v-else :size="16" class="commitment-icon cannot-meet" />
                <div class="commitment-content">
                  <span class="commitment-label">{{ item.item }}</span>
                  <span class="commitment-detail">{{ item.requirement }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 废标项/否决条款 -->
          <div class="report-section">
            <h3 class="section-title warning">
              <AlertTriangle :size="16" />
              废标项/否决条款
            </h3>
            <div class="risk-list">
              <div v-for="(item, index) in disqualificationItems" :key="index" class="risk-item clickable-item" :class="'risk-' + item.risk" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <AlertTriangle :size="16" class="risk-icon" />
                <div class="risk-content">
                  <span class="risk-label">{{ item.item }}</span>
                  <span class="risk-note">{{ item.note }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 下一步行动计划 -->
          <div class="report-section clickable" @click="scrollToSection('doc-timeline-nodes')">
            <h3 class="section-title">
              <ListChecks :size="16" />
              下一步行动计划
            </h3>
            <div class="action-table">
              <div class="action-header">
                <span>行动事项</span>
                <span>责任部门</span>
                <span>截止时间</span>
              </div>
              <div v-for="(item, index) in actionPlan" :key="index" class="action-row">
                <span class="action-item">{{ item.action }}</span>
                <span class="action-responsible">{{ item.responsible }}</span>
                <span class="action-deadline">{{ item.deadline }}</span>
              </div>
            </div>
          </div>

          <!-- 评分标准分析 -->
          <div class="report-section clickable" @click="scrollToSection('doc-scoring-overview')">
            <h3 class="section-title">
              <TrendingUp :size="16" />
              评分标准分析
            </h3>
            <div class="score-table">
              <div class="score-header">
                <span>评分项</span>
                <span>分值</span>
                <span>评分要点</span>
                <span>建议策略</span>
              </div>
              <div v-for="item in scoreStandards" :key="item.item" class="score-row">
                <span class="score-item">{{ item.item }}</span>
                <span class="score-value">{{ item.score }}分</span>
                <span class="score-points">{{ item.points }}</span>
                <span class="score-strategy">{{ item.strategy }}</span>
              </div>
            </div>
          </div>

          <!-- 时间节点 -->
          <div class="report-section">
            <h3 class="section-title">
              <Calendar :size="16" />
              时间节点
            </h3>
            <div class="timeline">
              <div v-for="(item, index) in timeline" :key="index" class="timeline-item clickable-item" :class="{ urgent: item.urgent }" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <span class="timeline-icon">📅</span>
                <span class="timeline-event">{{ item.event }}</span>
                <span class="timeline-date">{{ item.date }}</span>
              </div>
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
