<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ChevronLeft,
  FileText,
  FileSearch,
  Database,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  Users,
  Briefcase,
  TrendingUp
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

// Get source from query params
const source = computed(() => route.query.source as string || 'subscription');

// Mock bid list data
interface BidItem {
  id: number;
  title: string;
  budget: string;
  matchScore: number;
  deadline: string;
  location: string;
  publishDate: string;
  purchaser: string;
  contact: string;
  requirements: string[];
  scope: string;
  evaluation: string;
  tags: string[];
}

const bidList = ref<BidItem[]>([
  {
    id: 1,
    title: '上海市第一人民医院信息安全等级保护测评服务采购项目',
    budget: '85万',
    matchScore: 98,
    deadline: '2026-02-10',
    location: '上海市',
    publishDate: '2026-02-01',
    purchaser: '上海市第一人民医院',
    contact: '张先生 021-88888888',
    requirements: ['具有等保测评机构资质（三级及以上）', '近3年完成类似项目金额不低于50万', '项目团队不少于5人'],
    scope: '对医院核心信息系统进行等保三级测评，出具测评报告并协助完成整改。服务期限为1年。',
    evaluation: '综合评分法，技术标占60%，商务标占40%',
    tags: ['等保测评', '医疗卫生']
  },
  {
    id: 2,
    title: '浦东新区政务云安全运维服务采购',
    budget: '156万',
    matchScore: 95,
    deadline: '2026-02-12',
    location: '上海市浦东新区',
    publishDate: '2026-02-02',
    purchaser: '浦东新区政务服务中心',
    contact: '李经理 021-66666666',
    requirements: ['具有网络安全服务相关资质', '具备政务云运维经验', '能够提供7×24小时响应'],
    scope: '为浦东新区政务云平台提供安全运维服务，包括安全监控、应急响应、漏洞修复等。',
    evaluation: '综合评分法',
    tags: ['安全运维', '政务云']
  },
  {
    id: 3,
    title: '某国有银行上海分行网络安全渗透测试服务',
    budget: '68万',
    matchScore: 92,
    deadline: '2026-02-08',
    location: '上海市',
    publishDate: '2026-02-01',
    purchaser: '某国有银行上海分行',
    contact: '王经理 021-55555555',
    requirements: ['具有CISP/CISSP认证人员', '具备金融行业渗透测试经验', '签署保密协议'],
    scope: '对银行核心系统、网银系统进行渗透测试，发现安全漏洞并提供修复建议。',
    evaluation: '最低评标价法',
    tags: ['渗透测试', '金融']
  },
  {
    id: 4,
    title: '徐汇区教育局校园网络安全防护系统建设',
    budget: '45万',
    matchScore: 88,
    deadline: '2026-02-15',
    location: '上海市徐汇区',
    publishDate: '2026-02-03',
    purchaser: '徐汇区教育局',
    contact: '陈老师 021-44444444',
    requirements: ['具有网络安全服务相关资质', '具备教育行业服务经验'],
    scope: '为区内中小学校园网络提供安全防护系统建设，包括防火墙、入侵检测等。',
    evaluation: '综合评分法',
    tags: ['网络安全', '教育']
  },
  {
    id: 5,
    title: '松江区政府数据中心安全加固项目',
    budget: '72万',
    matchScore: 85,
    deadline: '2026-02-18',
    location: '上海市松江区',
    publishDate: '2026-02-02',
    purchaser: '松江区政府办公室',
    contact: '刘主任 021-33333333',
    requirements: ['具有等保测评机构资质', '熟悉政务系统架构'],
    scope: '对区政府数据中心进行安全加固，满足等保三级要求。',
    evaluation: '综合评分法',
    tags: ['安全加固', '政务']
  },
  {
    id: 6,
    title: '嘉定区卫健委医疗信息系统等保测评',
    budget: '38万',
    matchScore: 82,
    deadline: '2026-02-20',
    location: '上海市嘉定区',
    publishDate: '2026-02-03',
    purchaser: '嘉定区卫生健康委员会',
    contact: '赵科长 021-22222222',
    requirements: ['具有等保测评机构资质', '熟悉医疗信息系统'],
    scope: '对区卫健委及下属医疗机构信息系统进行等保测评。',
    evaluation: '综合评分法',
    tags: ['等保测评', '医疗']
  }
]);

const selectedBidId = ref<number>(1);

onMounted(() => {
  const bidId = route.query.bidId;
  if (bidId) {
    selectedBidId.value = parseInt(bidId as string);
  } else if (bidList.value.length > 0 && bidList.value[0]) {
    selectedBidId.value = bidList.value[0].id;
  }
});

const selectedBid = computed(() => {
  return bidList.value.find(b => b.id === selectedBidId.value) || null;
});

const selectBid = (id: number) => {
  selectedBidId.value = id;
};

const getMatchScoreClass = (score: number) => {
  if (score >= 90) return 'score-high';
  if (score >= 75) return 'score-medium';
  return 'score-low';
};

const goBack = () => {
  router.push({ name: 'bid-subscription' });
};

const goToAnalysis = () => {
  if (selectedBidId.value) {
    router.push({ name: 'bid-analysis-form', query: { bidId: selectedBidId.value } });
  }
};

const goToDocGenerate = () => {
  if (selectedBidId.value) {
    router.push({ name: 'bid-doc-form', query: { bidId: selectedBidId.value } });
  }
};

const handleAddToKnowledge = () => {
  alert('已加入知识库');
};
</script>

<template>
  <div class="bid-list-detail-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
          <span>返回</span>
        </button>
        <h1 class="header-title">标讯列表</h1>
        <span class="header-count">共 {{ bidList.length }} 条</span>
      </div>
      <div class="header-right">
        <button class="header-action-btn" @click="goToAnalysis">
          <FileSearch :size="16" />
          AI智能解读
        </button>
        <button class="header-action-btn primary" @click="goToDocGenerate">
          <FileText :size="16" />
          生成标书
        </button>
        <button class="header-action-btn" @click="handleAddToKnowledge">
          <Database :size="16" />
          加入知识库
        </button>
      </div>
    </header>

    <!-- Body -->
    <div class="page-body">
      <!-- Left Sidebar - File List -->
      <aside class="file-sidebar">
        <div class="sidebar-header">
          <FileText :size="16" />
          <span>标讯列表</span>
        </div>
        <div class="file-list">
          <div
            v-for="bid in bidList"
            :key="bid.id"
            class="file-item"
            :class="{ active: selectedBidId === bid.id }"
            @click="selectBid(bid.id)"
          >
            <div class="file-icon">
              <FileText :size="16" />
            </div>
            <div class="file-info">
              <span class="file-title">{{ bid.title }}</span>
              <span class="file-meta">
                <span class="file-score" :class="getMatchScoreClass(bid.matchScore)">{{ bid.matchScore }}%</span>
                <span class="file-budget">{{ bid.budget }}</span>
              </span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="detail-main" v-if="selectedBid">
        <!-- Left: Detail Content -->
        <div class="main-content">
          <!-- Document Container - Word style -->
          <div class="document-container">
            <!-- Title Section -->
            <div class="title-section">
            <div class="title-tags">
              <span v-for="tag in selectedBid.tags" :key="tag" class="bid-tag">{{ tag }}</span>
            </div>
            <h2 class="detail-title">{{ selectedBid.title }}</h2>
          </div>

          <!-- Info Card -->
          <div class="info-card">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">预算金额</div>
                <div class="info-value highlight">{{ selectedBid.budget }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">截止日期</div>
                <div class="info-value">{{ selectedBid.deadline }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">发布日期</div>
                <div class="info-value">{{ selectedBid.publishDate }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">所在地区</div>
                <div class="info-value">{{ selectedBid.location }}</div>
              </div>
            </div>
          </div>

          <!-- Purchaser -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">采购单位</h3>
            </div>
            <div class="card-body">
              <p class="body-text">{{ selectedBid.purchaser }}</p>
              <p class="body-text sub">联系方式：{{ selectedBid.contact }}</p>
            </div>
          </div>

          <!-- Requirements -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">资质要求</h3>
            </div>
            <div class="card-body">
              <ul class="requirements-list">
                <li v-for="(req, index) in selectedBid.requirements" :key="index">{{ req }}</li>
              </ul>
            </div>
          </div>

          <!-- Scope -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">项目范围</h3>
            </div>
            <div class="card-body">
              <p class="body-text">{{ selectedBid.scope }}</p>
            </div>
          </div>

          <!-- Evaluation -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">评标方法</h3>
            </div>
            <div class="card-body">
              <p class="body-text">{{ selectedBid.evaluation }}</p>
            </div>
          </div>
          </div><!-- End of document-container -->
        </div>

        <!-- Right: Score Panel -->
        <div class="side-panel">
          <!-- Match Analysis Card -->
          <div class="match-analysis-card">
            <div class="card-header">
              <h3 class="card-title">匹配度分析</h3>
            </div>
            <div class="match-score-display">
              <div class="score-circle" :class="getMatchScoreClass(selectedBid.matchScore)">
                <span class="score-value">{{ selectedBid.matchScore }}</span>
                <span class="score-label">分</span>
              </div>
            </div>
            <div class="match-details">
              <div class="match-item">
                <span class="match-label">资质匹配</span>
                <div class="match-bar">
                  <div class="match-fill high" style="width: 95%"></div>
                </div>
                <span class="match-percent">95%</span>
              </div>
              <div class="match-item">
                <span class="match-label">业绩匹配</span>
                <div class="match-bar">
                  <div class="match-fill high" style="width: 88%"></div>
                </div>
                <span class="match-percent">88%</span>
              </div>
              <div class="match-item">
                <span class="match-label">团队匹配</span>
                <div class="match-bar">
                  <div class="match-fill medium" style="width: 75%"></div>
                </div>
                <span class="match-percent">75%</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions-card">
            <button class="quick-action-btn primary" @click="goToAnalysis">
              <FileSearch :size="18" />
              <span>AI智能解读</span>
            </button>
            <button class="quick-action-btn" @click="goToDocGenerate">
              <FileText :size="18" />
              <span>生成标书</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.bid-list-detail-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  color: #3b82f6;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-count {
  padding: 4px 10px;
  background: #dbeafe;
  border-radius: 12px;
  font-size: 12px;
  color: #3b82f6;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.header-action-btn:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.header-action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: white;
}

.header-action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Body */
.page-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* File Sidebar */
.file-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
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

.file-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.file-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.file-item:hover {
  background: #f8fafc;
}

.file-item.active {
  background: #eff6ff;
}

.file-icon {
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

.file-item.active .file-icon {
  background: #3b82f6;
  color: white;
}

.file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-title {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.file-score {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.file-score.score-high {
  background: #dcfce7;
  color: #16a34a;
}

.file-score.score-medium {
  background: #fef3c7;
  color: #d97706;
}

.file-score.score-low {
  background: #f1f5f9;
  color: #64748b;
}

.file-budget {
  color: #16a34a;
  font-weight: 500;
}

/* Main Content */
.detail-main {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;
  background: #f1f5f9;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

/* Document Container - Word style with left border */
.document-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 40px 48px;
  min-height: fit-content;
  border-left: 4px solid #3b82f6;
}

.side-panel {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Title Section */
.title-section {
  margin-bottom: 20px;
}

.title-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.bid-tag {
  padding: 4px 10px;
  background: #eff6ff;
  border-radius: 4px;
  font-size: 12px;
  color: #3b82f6;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

/* Info Card */
.info-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.info-value.highlight {
  color: #3b82f6;
  font-size: 18px;
}

/* Content Card */
.content-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.content-card .card-header {
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.content-card .card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.content-card .card-body {
  padding: 16px 20px;
}

.body-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.body-text.sub {
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

/* Match Analysis Card */
.match-analysis-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.match-analysis-card .card-header {
  padding: 0;
  border: none;
  margin-bottom: 16px;
}

.match-analysis-card .card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.match-score-display {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.score-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0fdf4;
  border: 4px solid #22c55e;
}

.score-circle.score-high {
  background: #f0fdf4;
  border-color: #22c55e;
}

.score-circle.score-medium {
  background: #fffbeb;
  border-color: #f59e0b;
}

.score-circle.score-low {
  background: #f8fafc;
  border-color: #94a3b8;
}

.score-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.score-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

/* Match Details */
.match-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.match-label {
  width: 60px;
  font-size: 12px;
  color: #64748b;
  flex-shrink: 0;
}

.match-bar {
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.match-fill {
  height: 100%;
  border-radius: 3px;
}

.match-fill.high {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.match-fill.medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.match-percent {
  width: 36px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-align: right;
}

/* Quick Actions Card */
.quick-actions-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.quick-action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: white;
}

.quick-action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Scrollbar */
.file-list::-webkit-scrollbar {
  width: 6px;
}

.file-list::-webkit-scrollbar-track {
  background: transparent;
}

.file-list::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.file-list::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Responsive */
@media (max-width: 1200px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .detail-main {
    flex-direction: column;
  }

  .side-panel {
    width: 100%;
    flex-direction: row;
    gap: 16px;
  }

  .match-analysis-card,
  .quick-actions-card {
    flex: 1;
  }
}
</style>
