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
  BookPlus,
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

const handleAddToKnowledgeBase = () => {
  alert('已加入知识库');
};

const goToAnalysis = (id: number) => {
  router.push({ name: 'bid-analysis-form', query: { bidId: id } });
};

const goToDocGenerate = (id: number) => {
  router.push({ name: 'bid-doc-oneclick-form', query: { bidId: id } });
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
        <button class="action-btn primary" @click="handleAddToKnowledgeBase">
          <BookPlus :size="16" />
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
                <div class="text-content">
                  <div v-for="(project, idx) in keyProjects" :key="project.id" class="text-block">
                    <p class="text-paragraph"><strong>{{ idx + 1 }}. {{ project.title }}</strong></p>
                    <p class="text-paragraph text-secondary">预算 {{ project.budget }}，截止 {{ project.deadline }}，{{ project.region }}，匹配度 {{ project.matchScore }}%</p>
                    <p class="text-paragraph text-highlight">{{ project.highlight }}</p>
                    <p class="text-paragraph text-suggestion">{{ project.suggestion }}</p>
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
                <div class="text-content">
                  <div v-for="(item, index) in actionPlan.items" :key="index" class="text-block">
                    <p class="text-paragraph">
                      <strong>{{ index + 1 }}. {{ item.action }}</strong>
                      <span class="text-priority" :class="item.priority">{{ item.priority === 'high' ? '[高优先]' : item.priority === 'medium' ? '[中优先]' : '[低优先]' }}</span>
                    </p>
                    <p class="text-paragraph text-secondary">{{ item.reason }}</p>
                    <p class="text-paragraph text-secondary">建议完成时间：{{ item.deadline }}</p>
                  </div>
                </div>
              </section>

              <!-- Risk Warning -->
              <section class="report-section">
                <h2 class="section-title">
                  <AlertCircle :size="20" class="section-icon red" />
                  {{ riskWarning.title }}
                </h2>
                <div class="text-content">
                  <p v-for="(item, index) in riskWarning.items" :key="index" class="text-paragraph">
                    {{ index + 1 }}. {{ item }}
                  </p>
                </div>
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
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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

/* ===== Text Content (pure text style) ===== */
.text-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.text-block {
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.text-block:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.text-paragraph {
  font-size: 15px;
  color: #334155;
  line-height: 1.8;
  margin: 0 0 4px 0;
}

.text-paragraph strong {
  color: #1e293b;
}

.text-paragraph.text-secondary {
  font-size: 14px;
  color: #64748b;
}

.text-paragraph.text-highlight {
  color: #d97706;
  font-size: 14px;
}

.text-paragraph.text-suggestion {
  color: #16a34a;
  font-size: 14px;
}

.text-priority {
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
}

.text-priority.high { color: #dc2626; }
.text-priority.medium { color: #d97706; }
.text-priority.low { color: #6b7280; }

.text-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.text-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.text-action-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #2563eb;
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
