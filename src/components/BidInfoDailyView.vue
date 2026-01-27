<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  Calendar,
  Bell,
  ExternalLink,
  FileSearch,
  Star,
  Check,
  TrendingUp,
  Eye
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// 日期选择
const selectedDate = ref(new Date().toISOString().split('T')[0]);

// 今日统计
const todayStats = ref({
  total: 28,
  highMatch: 8,
  followed: 3,
});

// 标讯列表
const bidInfoList = ref([
  {
    id: 1,
    title: 'XX市政府信息系统安全等级保护测评服务项目',
    publisher: 'XX市政务服务中心',
    budget: 50,
    deadline: '2024-02-15',
    openDate: '2024-02-20 09:00',
    matchLevel: 'high',
    matchScore: 92,
    matchReason: '关键词匹配：等保测评、信息系统安全；地区匹配：北京',
    status: 'new',
  },
  {
    id: 2,
    title: 'XX银行网络安全渗透测试服务采购项目',
    publisher: 'XX银行股份有限公司',
    budget: 80,
    deadline: '2024-02-18',
    openDate: '2024-02-22 14:00',
    matchLevel: 'high',
    matchScore: 88,
    matchReason: '关键词匹配：渗透测试、网络安全；预算范围匹配',
    status: 'new',
  },
  {
    id: 3,
    title: 'XX区教育局网络安全服务项目',
    publisher: 'XX区教育局',
    budget: 35,
    deadline: '2024-02-12',
    openDate: '2024-02-16 10:00',
    matchLevel: 'medium',
    matchScore: 75,
    matchReason: '关键词匹配：网络安全；预算略低于筛选范围',
    status: 'followed',
  },
  {
    id: 4,
    title: 'XX医院信息安全等级保护咨询服务',
    publisher: 'XX市第一人民医院',
    budget: 28,
    deadline: '2024-02-14',
    openDate: '2024-02-19 09:30',
    matchLevel: 'medium',
    matchScore: 70,
    matchReason: '关键词匹配：等级保护；类型：咨询服务',
    status: 'new',
  },
  {
    id: 5,
    title: 'XX集团密码应用安全性评估项目',
    publisher: 'XX集团有限公司',
    budget: 45,
    deadline: '2024-02-20',
    openDate: '2024-02-25 14:00',
    matchLevel: 'high',
    matchScore: 85,
    matchReason: '关键词匹配：密评；资质要求匹配',
    status: 'processed',
  },
]);

const goBack = () => {
  router.push({ name: 'bid-center' });
};

const getMatchClass = (level: string) => {
  switch (level) {
    case 'high': return 'match-high';
    case 'medium': return 'match-medium';
    case 'low': return 'match-low';
    default: return '';
  }
};

const getMatchText = (level: string) => {
  switch (level) {
    case 'high': return '高匹配';
    case 'medium': return '中匹配';
    case 'low': return '低匹配';
    default: return '';
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'new': return 'status-new';
    case 'followed': return 'status-followed';
    case 'processed': return 'status-processed';
    default: return '';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'new': return '新标讯';
    case 'followed': return '已关注';
    case 'processed': return '已处理';
    default: return '';
  }
};

const viewOriginal = (bid: any) => {
  console.log('查看原文:', bid.title);
  window.open('https://www.ccgp.gov.cn', '_blank');
};

const viewAnalysis = (bid: any) => {
  router.push({
    name: 'bid-analysis-form',
    query: { bidId: bid.id, title: bid.title },
  });
};

const toggleFollow = (bid: any) => {
  bid.status = bid.status === 'followed' ? 'new' : 'followed';
};

const markProcessed = (bid: any) => {
  bid.status = 'processed';
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};
</script>

<template>
  <div class="daily-page">
    <!-- Header -->
    <div class="daily-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回标讯中心</span>
      </button>
      <div class="header-title">
        <Bell :size="20" />
        <h1>标讯日报</h1>
      </div>
      <div class="date-picker">
        <Calendar :size="16" />
        <input type="date" v-model="selectedDate" class="date-input" />
      </div>
    </div>

    <div class="daily-content">
      <!-- 左侧：标讯列表 -->
      <div class="bid-list-panel">
        <!-- 统计面板 -->
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-value">{{ todayStats.total }}</span>
            <span class="stat-label">今日新增</span>
          </div>
          <div class="stat-item highlight">
            <TrendingUp :size="14" />
            <span class="stat-value">{{ todayStats.highMatch }}</span>
            <span class="stat-label">高匹配</span>
          </div>
          <div class="stat-item">
            <Star :size="14" />
            <span class="stat-value">{{ todayStats.followed }}</span>
            <span class="stat-label">已关注</span>
          </div>
        </div>

        <!-- 标讯卡片列表 -->
        <div class="bid-cards">
          <div v-for="bid in bidInfoList" :key="bid.id" class="bid-card">
            <div class="card-header">
              <span class="match-badge" :class="getMatchClass(bid.matchLevel)">
                {{ getMatchText(bid.matchLevel) }} {{ bid.matchScore }}%
              </span>
              <span class="status-badge" :class="getStatusClass(bid.status)">
                {{ getStatusText(bid.status) }}
              </span>
            </div>

            <h3 class="bid-title">{{ bid.title }}</h3>

            <div class="bid-meta">
              <div class="meta-item">
                <span class="meta-label">发布单位</span>
                <span class="meta-value">{{ bid.publisher }}</span>
              </div>
              <div class="meta-row">
                <div class="meta-item">
                  <span class="meta-label">预算金额</span>
                  <span class="meta-value budget">{{ bid.budget }}万元</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">报名截止</span>
                  <span class="meta-value">{{ formatDate(bid.deadline) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">开标时间</span>
                  <span class="meta-value">{{ bid.openDate }}</span>
                </div>
              </div>
            </div>

            <div class="match-reason">
              <span class="reason-label">匹配原因：</span>
              {{ bid.matchReason }}
            </div>

            <div class="card-actions">
              <button class="action-btn" @click="viewOriginal(bid)">
                <ExternalLink :size="14" />
                查看原文
              </button>
              <button class="action-btn primary" @click="viewAnalysis(bid)">
                <FileSearch :size="14" />
                AI深度解读
              </button>
              <button
                class="action-btn icon-only"
                :class="{ active: bid.status === 'followed' }"
                @click="toggleFollow(bid)"
                title="关注"
              >
                <Star :size="14" />
              </button>
              <button
                class="action-btn icon-only"
                @click="markProcessed(bid)"
                title="标记已处理"
              >
                <Check :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：快捷操作面板 -->
      <div class="quick-panel">
        <div class="panel-section">
          <h3>今日概览</h3>
          <div class="overview-chart">
            <div class="chart-bar">
              <div class="bar-segment high" :style="{ width: (todayStats.highMatch / todayStats.total * 100) + '%' }"></div>
              <div class="bar-segment medium" :style="{ width: '40%' }"></div>
              <div class="bar-segment low" :style="{ width: '20%' }"></div>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="dot high"></span>高匹配</span>
              <span class="legend-item"><span class="dot medium"></span>中匹配</span>
              <span class="legend-item"><span class="dot low"></span>低匹配</span>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3>快捷筛选</h3>
          <div class="filter-tags">
            <button class="filter-tag active">全部</button>
            <button class="filter-tag">高匹配</button>
            <button class="filter-tag">未处理</button>
            <button class="filter-tag">已关注</button>
          </div>
        </div>

        <div class="panel-section">
          <h3>推荐关注</h3>
          <div class="recommend-list">
            <div v-for="bid in bidInfoList.filter(b => b.matchLevel === 'high').slice(0, 3)" :key="bid.id" class="recommend-item">
              <div class="recommend-title">{{ bid.title.substring(0, 20) }}...</div>
              <div class="recommend-budget">{{ bid.budget }}万</div>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3>截止提醒</h3>
          <div class="deadline-list">
            <div v-for="bid in bidInfoList.filter(b => new Date(b.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)).slice(0, 3)" :key="bid.id" class="deadline-item">
              <div class="deadline-title">{{ bid.title.substring(0, 15) }}...</div>
              <div class="deadline-date urgent">{{ formatDate(bid.deadline) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.daily-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.daily-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #ecfdf5;
  border: none;
  border-radius: 6px;
  color: #10b981;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #d1fae5;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #10b981;
}

.header-title h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.date-picker {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
}

.date-input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #334155;
  outline: none;
}

.daily-content {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 24px;
  overflow: hidden;
}

.bid-list-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.stats-bar {
  display: flex;
  gap: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item svg {
  color: #64748b;
}

.stat-item.highlight svg {
  color: #10b981;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.stat-item.highlight .stat-value {
  color: #10b981;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.bid-cards {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bid-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  transition: all 0.2s;
}

.bid-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.match-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.match-high {
  background: #dcfce7;
  color: #16a34a;
}

.match-medium {
  background: #fef9c3;
  color: #ca8a04;
}

.match-low {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.status-new {
  background: #eff6ff;
  color: #2563eb;
}

.status-followed {
  background: #fef3c7;
  color: #d97706;
}

.status-processed {
  background: #f1f5f9;
  color: #64748b;
}

.bid-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.bid-meta {
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}

.meta-row {
  display: flex;
  gap: 24px;
}

.meta-row .meta-item {
  margin-bottom: 0;
}

.meta-label {
  font-size: 13px;
  color: #94a3b8;
}

.meta-value {
  font-size: 13px;
  color: #334155;
}

.meta-value.budget {
  font-weight: 600;
  color: #10b981;
}

.match-reason {
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
}

.reason-label {
  color: #94a3b8;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.action-btn.primary {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.action-btn.primary:hover {
  background: #059669;
}

.action-btn.icon-only {
  padding: 8px;
}

.action-btn.icon-only.active {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #f59e0b;
}

.quick-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.panel-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
}

.panel-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.overview-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-bar {
  height: 24px;
  display: flex;
  border-radius: 6px;
  overflow: hidden;
}

.bar-segment {
  height: 100%;
}

.bar-segment.high {
  background: #22c55e;
}

.bar-segment.medium {
  background: #eab308;
}

.bar-segment.low {
  background: #ef4444;
}

.chart-legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #64748b;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.high {
  background: #22c55e;
}

.dot.medium {
  background: #eab308;
}

.dot.low {
  background: #ef4444;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tag:hover {
  background: #f8fafc;
}

.filter-tag.active {
  background: #ecfdf5;
  border-color: #10b981;
  color: #10b981;
}

.recommend-list,
.deadline-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recommend-item,
.deadline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.recommend-title,
.deadline-title {
  font-size: 13px;
  color: #475569;
}

.recommend-budget {
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
}

.deadline-date {
  font-size: 12px;
  color: #64748b;
}

.deadline-date.urgent {
  color: #dc2626;
  font-weight: 500;
}
</style>
