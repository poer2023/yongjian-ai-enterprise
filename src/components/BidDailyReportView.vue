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
  Sparkles,
  FileText,
  ScrollText
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Active document
const activeDocId = ref('daily-report');

// Document list - daily report + today's bid items
const documentList = ref([
  {
    id: 'daily-report',
    type: 'report',
    title: '每日标讯分析报告',
    status: '已生成',
    date: '2026-02-03'
  },
  {
    id: 'bid-1',
    type: 'bid',
    title: 'XX市智慧城市网络安全体系建设项目',
    status: '高匹配',
    matchScore: 95
  },
  {
    id: 'bid-2',
    type: 'bid',
    title: 'XX银行数据中心安全评估服务采购',
    status: '高匹配',
    matchScore: 88
  },
  {
    id: 'bid-3',
    type: 'bid',
    title: 'XX省政务云平台等保测评项目',
    status: '高匹配',
    matchScore: 92
  },
  {
    id: 'bid-4',
    type: 'bid',
    title: 'XX区教育局网络安全运维服务',
    status: '中匹配',
    matchScore: 75
  },
  {
    id: 'bid-5',
    type: 'bid',
    title: 'XX医院信息系统安全加固项目',
    status: '中匹配',
    matchScore: 70
  }
]);

// Report metadata
const reportDate = ref('2026年2月3日');
const reportStats = ref({
  totalCount: 23,
  highMatchCount: 5,
  totalBudget: '2,860',
  avgBudget: '124.3'
});

// Report sections
const marketOverview = ref({
  title: '一、今日市场概览',
  content: `今日共监测到网络安全相关招标项目23个，较昨日增长15%，市场活跃度持续上升。从地区分布来看，广东省以6个项目位居首位，其次是北京（4个）和江苏（3个）。项目类型以等保测评（9个）和安全运维服务（7个）为主，渗透测试类项目有所减少。

整体预算规模约2,860万元，单项目平均预算124.3万元。值得注意的是，今日出现2个预算超过500万的大型项目，分别来自XX市政府和XX银行，建议重点关注。`
});

const keyProjects = ref([
  {
    id: 1,
    title: 'XX市智慧城市网络安全体系建设项目',
    budget: '580万',
    deadline: '2026-02-20',
    region: '广东省深圳市',
    matchScore: 95,
    highlight: '项目需求与我司等保测评、渗透测试业务高度匹配',
    suggestion: '建议组建精英团队参与投标，重点展示智慧城市安全案例'
  },
  {
    id: 2,
    title: 'XX银行数据中心安全评估服务采购',
    budget: '320万',
    deadline: '2026-02-18',
    region: '北京市',
    matchScore: 88,
    highlight: '金融行业客户，对资质要求较高，我司资质完全满足',
    suggestion: '需准备金融行业相关案例，突出合规经验'
  },
  {
    id: 3,
    title: 'XX省政务云平台等保测评项目',
    budget: '156万',
    deadline: '2026-02-25',
    region: '江苏省南京市',
    matchScore: 92,
    highlight: '等保三级测评项目，属于我司核心业务领域',
    suggestion: '项目周期较紧，需提前准备技术方案'
  }
]);

const trendAnalysis = ref({
  title: '二、行业趋势分析',
  content: `1. **等保测评需求持续增长**：本周等保测评类项目环比增长25%，主要集中在政务、医疗和教育领域。随着等保2.0全面推行，预计未来3个月需求将保持高位。

2. **云安全服务成为新热点**：随着企业上云加速，云安全评估、云等保测评需求明显增加。建议加强云安全服务能力建设，拓展相关资质认证。

3. **大型综合性项目增多**：500万以上的综合性安全项目占比从上月的8%上升至12%，客户更倾向于选择一站式安全服务供应商。

4. **供应商准入门槛提高**：近期多个项目要求投标方具备CNAS认证、等保测评机构资质等，无相关资质的竞争对手将被排除在外，这对我司是利好因素。`
});

const competitorInsight = ref({
  title: '三、竞争态势分析',
  content: `本周活跃的主要竞争对手包括A公司、B公司和C公司。其中：

- **A公司**：近期中标率较高，主要优势在价格竞争力，但技术方案创新性不足
- **B公司**：在金融行业有较强影响力，需在银行类项目中重点防范
- **C公司**：新进入本地市场，价格策略激进，但服务口碑一般

建议策略：保持技术方案的专业性和创新性，强调服务质量和成功案例，避免单纯的价格竞争。`
});

const actionPlan = ref({
  title: '四、本周投标建议',
  items: [
    {
      priority: 'high',
      action: '重点跟进XX市智慧城市项目',
      reason: '预算充足、匹配度高，中标概率大',
      deadline: '2月10日前完成技术方案'
    },
    {
      priority: 'high',
      action: '准备XX银行项目投标材料',
      reason: '金融客户价值高，有助于拓展银行业务',
      deadline: '2月12日前完成商务标'
    },
    {
      priority: 'medium',
      action: '关注XX省政务云项目进展',
      reason: '等保测评核心业务，可作为标杆案例',
      deadline: '持续跟踪，2月15日前确定是否参与'
    },
    {
      priority: 'low',
      action: '评估其他中小型项目',
      reason: '根据团队产能情况选择性参与',
      deadline: '每日评估'
    }
  ]
});

const riskWarning = ref({
  title: '五、风险提示',
  items: [
    '本周有3个项目截止日期集中在2月18-20日，需合理分配投标资源',
    'XX市项目存在潜在围标嫌疑，建议关注后续公告',
    '近期部分地区疫情反复，可能影响现场踏勘和答疑安排'
  ]
});

// Bid detail data
const bidDetails = ref<Record<string, any>>({
  'bid-1': {
    title: 'XX市智慧城市网络安全体系建设项目',
    budget: '580万',
    deadline: '2026-02-20',
    region: '广东省深圳市',
    publishDate: '2026-02-01',
    purchaser: 'XX市政务服务数据管理局',
    contact: '张先生 0755-88888888',
    requirements: [
      '具有等保测评机构资质（三级及以上）',
      '近3年完成类似项目金额不低于300万',
      '项目团队不少于10人，项目经理需具备PMP认证',
      '具备智慧城市安全建设相关案例'
    ],
    scope: '本项目包含网络安全体系规划设计、等保测评、渗透测试、安全运维等服务内容。服务期限为2年。',
    evaluation: '综合评分法，技术标占60%，商务标占40%'
  },
  'bid-2': {
    title: 'XX银行数据中心安全评估服务采购',
    budget: '320万',
    deadline: '2026-02-18',
    region: '北京市',
    publishDate: '2026-02-02',
    purchaser: 'XX银行股份有限公司',
    contact: '李经理 010-66666666',
    requirements: [
      '具有银监会认可的信息安全评估资质',
      '具备金融行业安全评估项目经验',
      '项目团队需持有CISP、CISSP等认证',
      '承诺现场驻场服务'
    ],
    scope: '对银行核心系统、数据中心进行全面安全评估，包括漏洞扫描、渗透测试、配置核查、安全审计等。',
    evaluation: '最低评标价法'
  },
  'bid-3': {
    title: 'XX省政务云平台等保测评项目',
    budget: '156万',
    deadline: '2026-02-25',
    region: '江苏省南京市',
    publishDate: '2026-02-03',
    purchaser: 'XX省大数据管理中心',
    contact: '王主任 025-77777777',
    requirements: [
      '具有等保测评机构资质',
      '熟悉云计算等保测评要求',
      '具备政务云测评经验优先'
    ],
    scope: '对省级政务云平台进行等保三级测评，出具测评报告并协助完成整改。',
    evaluation: '综合评分法'
  },
  'bid-4': {
    title: 'XX区教育局网络安全运维服务',
    budget: '86万',
    deadline: '2026-02-22',
    region: '上海市浦东新区',
    publishDate: '2026-02-03',
    purchaser: 'XX区教育局',
    contact: '陈老师 021-55555555',
    requirements: [
      '具有网络安全服务相关资质',
      '具备教育行业服务经验',
      '能够提供7×24小时响应'
    ],
    scope: '为区内100所学校提供网络安全运维服务，包括安全监控、应急响应、安全培训等。',
    evaluation: '综合评分法'
  },
  'bid-5': {
    title: 'XX医院信息系统安全加固项目',
    budget: '68万',
    deadline: '2026-02-28',
    region: '浙江省杭州市',
    publishDate: '2026-02-03',
    purchaser: 'XX市第一人民医院',
    contact: '刘工 0571-88888888',
    requirements: [
      '具有医疗行业信息安全服务经验',
      '熟悉医院信息系统架构',
      '具备等保测评经验'
    ],
    scope: '对医院HIS、PACS、LIS等核心系统进行安全加固，满足等保三级要求。',
    evaluation: '综合评分法'
  }
});

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
  router.push({ name: 'enterprise-search' });
};

const handleDownload = () => {
  alert('报告PDF已下载');
};

const handleAddToKnowledge = () => {
  alert('已加入知识库');
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
      <!-- Left Sidebar - Document List -->
      <aside class="document-sidebar">
        <div class="sidebar-header">
          <FileText :size="16" />
          <span>文件列表</span>
        </div>
        <div class="document-list">
          <div
            v-for="doc in documentList"
            :key="doc.id"
            class="document-item"
            :class="{ active: activeDocId === doc.id }"
            @click="selectDocument(doc.id)"
          >
            <div class="doc-icon" :class="doc.type">
              <ScrollText v-if="doc.type === 'report'" :size="16" />
              <FileText v-else :size="16" />
            </div>
            <div class="doc-info">
              <span class="doc-title">{{ doc.title }}</span>
              <span class="doc-status" :class="{ high: doc.matchScore && doc.matchScore >= 85 }">
                <template v-if="doc.type === 'report'">
                  <span class="status-dot"></span>
                  {{ doc.status }}
                </template>
                <template v-else>
                  匹配度 {{ doc.matchScore }}%
                </template>
              </span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="report-content">
        <!-- Daily Report View -->
        <template v-if="activeDocId === 'daily-report'">
          <div class="report-container">
            <!-- Stats Summary -->
            <section class="stats-section">
              <div class="stat-card">
                <div class="stat-icon blue">
                  <Target :size="20" />
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ reportStats.totalCount }}</span>
                  <span class="stat-label">今日标讯总数</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon green">
                  <CheckCircle2 :size="20" />
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ reportStats.highMatchCount }}</span>
                  <span class="stat-label">高匹配项目</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon orange">
                  <DollarSign :size="20" />
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ reportStats.totalBudget }}<small>万</small></span>
                  <span class="stat-label">总预算规模</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon purple">
                  <TrendingUp :size="20" />
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ reportStats.avgBudget }}<small>万</small></span>
                  <span class="stat-label">平均预算</span>
                </div>
              </div>
            </section>

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

/* Header */
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

/* Body Layout */
.report-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Document Sidebar */
.document-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
}

.document-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.document-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.document-item:hover {
  background: #f8fafc;
}

.document-item.active {
  background: #eff6ff;
}

.doc-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f1f5f9;
  color: #64748b;
}

.doc-icon.report {
  background: #dbeafe;
  color: #3b82f6;
}

.document-item.active .doc-icon {
  background: #3b82f6;
  color: white;
}

.doc-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-title {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.doc-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.doc-status.high {
  color: #16a34a;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

/* Content */
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

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-icon.green {
  background: #dcfce7;
  color: #22c55e;
}

.stat-icon.orange {
  background: #fed7aa;
  color: #ea580c;
}

.stat-icon.purple {
  background: #e9d5ff;
  color: #9333ea;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-value small {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

/* Report Article */
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

/* Projects List */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
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

/* Action List */
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

/* Warning Section */
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

/* Footer */
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

/* Bid Detail View */
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

/* Responsive */
@media (max-width: 1024px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .bid-meta-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .report-body {
    flex-direction: column;
  }

  .document-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .document-list {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 8px;
    padding: 12px;
  }

  .document-item {
    flex-shrink: 0;
    width: 200px;
    margin-bottom: 0;
  }

  .report-content {
    padding: 16px;
  }

  .report-article {
    padding: 24px;
  }
}
</style>
