<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  Calendar,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Building2,
  DollarSign,
  Clock,
  MapPin,
  Download,
  Database,
  FileText,
  FileSearch
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import type { DocumentItem, BidDetail } from './types';
import {
  documentList as mockDocumentList,
  reportDate,
  reportStats,
  marketOverview,
  keyProjects,
  trendAnalysis,
  competitorInsight,
  actionPlan,
  riskWarning,
  bidDetails as mockBidDetails
} from './mockData';

const router = useRouter();

// Active document
const activeDocId = ref('daily-report');
const documentList = ref<DocumentItem[]>(mockDocumentList);
const bidDetails = ref<Record<string, BidDetail>>(mockBidDetails);

const currentDocument = computed(() => {
  return documentList.value.find(doc => doc.id === activeDocId.value);
});

const currentBidDetail = computed(() => {
  if (activeDocId.value.startsWith('bid-')) {
    return bidDetails.value[activeDocId.value];
  }
  return null;
});

const selectDocument = (docId: string) => {
  activeDocId.value = docId;
};

const goBack = () => {
  router.push({ name: 'bid-subscription' });
};

const handleDownload = () => {
  alert('报告PDF已下载');
};

const handleAddToKnowledge = () => {
  alert('已加入知识库');
};

const goToAnalysis = (id: number) => {
  router.push({ name: 'bid-analysis-form', query: { bidId: id } });
};

const goToDocGenerate = (id: number) => {
  router.push({ name: 'bid-doc-form', query: { bidId: id } });
};
</script>

<template>
  <div class="report-page">
    <!-- Header -->
    <header class="report-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
        </button>
        <h1 class="header-title">{{ currentDocument?.title || '每日标讯分析报告' }}</h1>
      </div>
      <div class="header-right">
        <button class="action-btn" @click="handleDownload">
          <Download :size="16" />
          导出
        </button>
        <button class="action-btn primary" @click="handleAddToKnowledge">
          <Database :size="16" />
          加入知识库
        </button>
      </div>
    </header>

    <div class="report-body">
      <!-- Main Content -->
      <main class="report-content">
        <!-- Daily Report View -->
        <template v-if="activeDocId === 'daily-report'">
          <div class="report-container">
            <!-- Report Body -->
            <article class="report-article">
              <!-- Market Overview -->
              <section class="report-section">
                <h2 class="section-title">
                  <TrendingUp :size="20" class="section-icon blue" />
                  {{ marketOverview.title }}
                </h2>
                <div class="section-content" v-html="marketOverview.content.replace(/\n/g, '<br/>')"></div>
              </section>

              <!-- Key Projects -->
              <section class="report-section">
                <h2 class="section-title">
                  <Target :size="20" class="section-icon green" />
                  重点关注项目
                </h2>
                <div class="projects-list">
                  <div v-for="project in keyProjects" :key="project.id" class="project-card">
                    <div class="project-content">
                      <div class="project-header">
                        <h3 class="project-title">{{ project.title }}</h3>
                        <span class="match-badge" :class="{ high: project.matchScore >= 90 }">
                          匹配度 {{ project.matchScore }}%
                        </span>
                      </div>
                      <div class="project-meta">
                        <span class="meta-item">
                          <DollarSign :size="14" />
                          {{ project.budget }}
                        </span>
                        <span class="meta-item">
                          <Clock :size="14" />
                          截止 {{ project.deadline }}
                        </span>
                        <span class="meta-item">
                          <MapPin :size="14" />
                          {{ project.region }}
                        </span>
                      </div>
                      <div class="project-insight">
                        <div class="insight-row highlight">
                          <Lightbulb :size="14" />
                          <span>{{ project.highlight }}</span>
                        </div>
                        <div class="insight-row suggestion">
                          <CheckCircle2 :size="14" />
                          <span>{{ project.suggestion }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="project-actions">
                      <button class="project-action-btn secondary" @click="goToAnalysis(project.id)">
                        <FileSearch :size="14" />
                        标讯解读
                      </button>
                      <button class="project-action-btn primary" @click="goToDocGenerate(project.id)">
                        <FileText :size="14" />
                        生成标书
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Trend Analysis -->
              <section class="report-section">
                <h2 class="section-title">
                  <TrendingUp :size="20" class="section-icon orange" />
                  {{ trendAnalysis.title }}
                </h2>
                <div class="section-content markdown" v-html="trendAnalysis.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')"></div>
              </section>

              <!-- Competitor Insight -->
              <section class="report-section">
                <h2 class="section-title">
                  <Building2 :size="20" class="section-icon purple" />
                  {{ competitorInsight.title }}
                </h2>
                <div class="section-content markdown" v-html="competitorInsight.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')"></div>
              </section>

              <!-- Action Plan -->
              <section class="report-section">
                <h2 class="section-title">
                  <CheckCircle2 :size="20" class="section-icon green" />
                  {{ actionPlan.title }}
                </h2>
                <div class="action-list">
                  <div
                    v-for="(item, index) in actionPlan.items"
                    :key="index"
                    class="action-item"
                    :class="item.priority"
                  >
                    <div class="action-priority">
                      <span class="priority-tag" :class="item.priority">
                        {{ item.priority === 'high' ? '高优先' : item.priority === 'medium' ? '中优先' : '低优先' }}
                      </span>
                    </div>
                    <div class="action-content">
                      <h4 class="action-title">{{ item.action }}</h4>
                      <p class="action-reason">{{ item.reason }}</p>
                      <p class="action-deadline">
                        <Clock :size="12" />
                        {{ item.deadline }}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Risk Warning -->
              <section class="report-section warning">
                <h2 class="section-title">
                  <AlertCircle :size="20" class="section-icon red" />
                  {{ riskWarning.title }}
                </h2>
                <ul class="warning-list">
                  <li v-for="(item, index) in riskWarning.items" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </section>
            </article>

            <!-- Footer -->
            <footer class="report-footer">
              <p>本报告由AI智能分析生成，仅供参考。具体投标决策请结合实际情况综合判断。</p>
              <p class="generate-time">生成时间：{{ reportDate }} 09:00</p>
            </footer>
          </div>
        </template>

        <!-- Bid Detail View -->
        <template v-else-if="currentBidDetail">
          <div class="bid-detail-container">
            <div class="bid-detail-card">
              <div class="bid-header">
                <h2 class="bid-title">{{ currentBidDetail.title }}</h2>
                <span class="match-badge high">
                  匹配度 {{ documentList.find(d => d.id === activeDocId)?.matchScore }}%
                </span>
              </div>

              <div class="bid-meta-grid">
                <div class="meta-block">
                  <span class="meta-label">预算金额</span>
                  <span class="meta-value highlight">{{ currentBidDetail.budget }}</span>
                </div>
                <div class="meta-block">
                  <span class="meta-label">截止日期</span>
                  <span class="meta-value">{{ currentBidDetail.deadline }}</span>
                </div>
                <div class="meta-block">
                  <span class="meta-label">发布日期</span>
                  <span class="meta-value">{{ currentBidDetail.publishDate }}</span>
                </div>
                <div class="meta-block">
                  <span class="meta-label">所在地区</span>
                  <span class="meta-value">{{ currentBidDetail.region }}</span>
                </div>
              </div>

              <div class="bid-section">
                <h3 class="bid-section-title">采购单位</h3>
                <p class="bid-section-content">{{ currentBidDetail.purchaser }}</p>
                <p class="bid-section-content sub">联系方式：{{ currentBidDetail.contact }}</p>
              </div>

              <div class="bid-section">
                <h3 class="bid-section-title">资质要求</h3>
                <ul class="requirements-list">
                  <li v-for="(req, index) in currentBidDetail.requirements" :key="index">
                    {{ req }}
                  </li>
                </ul>
              </div>

              <div class="bid-section">
                <h3 class="bid-section-title">项目范围</h3>
                <p class="bid-section-content">{{ currentBidDetail.scope }}</p>
              </div>

              <div class="bid-section">
                <h3 class="bid-section-title">评标方法</h3>
                <p class="bid-section-content">{{ currentBidDetail.evaluation }}</p>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #2563eb;
}

.action-btn.primary {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.action-btn.primary:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.report-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.report-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8fafc;
}

.report-container {
  max-width: 900px;
  margin: 0 auto;
}

.report-article {
  background: white;
  border-radius: 16px;
  padding: 40px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.report-section {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f1f5f9;
}

.report-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.section-icon {
  flex-shrink: 0;
}

.section-icon.blue { color: #3b82f6; }
.section-icon.green { color: #22c55e; }
.section-icon.orange { color: #ea580c; }
.section-icon.purple { color: #9333ea; }
.section-icon.red { color: #ef4444; }

.section-content {
  font-size: 15px;
  color: #475569;
  line-height: 1.8;
}

.section-content.markdown strong {
  color: #1e293b;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card {
  display: flex;
  align-items: stretch;
  gap: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.project-content {
  flex: 1;
  min-width: 0;
}

.project-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  justify-content: center;
}

.project-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.project-action-btn.secondary {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.project-action-btn.secondary:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.project-action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: white;
}

.project-action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.project-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.match-badge {
  flex-shrink: 0;
  padding: 4px 10px;
  background: #dbeafe;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}

.match-badge.high {
  background: #dcfce7;
  color: #16a34a;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.project-insight {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.insight-row.highlight {
  color: #d97706;
}

.insight-row.suggestion {
  color: #16a34a;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 4px solid #e2e8f0;
}

.action-item.high {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.action-item.medium {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.action-item.low {
  border-left-color: #6b7280;
}

.priority-tag {
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.priority-tag.high {
  background: #fecaca;
  color: #dc2626;
}

.priority-tag.medium {
  background: #fde68a;
  color: #d97706;
}

.priority-tag.low {
  background: #e5e7eb;
  color: #6b7280;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.action-reason {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 8px 0;
}

.action-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.report-section.warning {
  background: #fef2f2;
  border-radius: 12px;
  padding: 24px;
  margin-left: -24px;
  margin-right: -24px;
  border-bottom: none;
}

.warning-list {
  margin: 0;
  padding-left: 20px;
}

.warning-list li {
  font-size: 14px;
  color: #991b1b;
  line-height: 1.8;
  margin-bottom: 8px;
}

.warning-list li:last-child {
  margin-bottom: 0;
}

.report-footer {
  margin-top: 24px;
  padding: 20px;
  background: #f1f5f9;
  border-radius: 12px;
  text-align: center;
}

.report-footer p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.report-footer .generate-time {
  margin-top: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.bid-detail-container {
  max-width: 900px;
  margin: 0 auto;
}

.bid-detail-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
}

.bid-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.bid-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.bid-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.meta-block {
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
  text-align: center;
}

.meta-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.meta-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.meta-value.highlight {
  color: #3b82f6;
  font-size: 18px;
}

.bid-section {
  margin-bottom: 24px;
}

.bid-section:last-child {
  margin-bottom: 0;
}

.bid-section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.bid-section-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.bid-section-content.sub {
  margin-top: 8px;
  color: #64748b;
}

.requirements-list {
  margin: 0;
  padding-left: 20px;
}

.requirements-list li {
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 6px;
}

.requirements-list li:last-child {
  margin-bottom: 0;
}

@media (max-width: 1024px) {
  .bid-meta-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .report-body {
    flex-direction: column;
  }

  .report-content {
    padding: 16px;
  }

  .report-article {
    padding: 24px;
  }
}
</style>
