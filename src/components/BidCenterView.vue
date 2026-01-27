<script setup lang="ts">
import { ref } from 'vue';
import {
  TrendingUp,
  Star,
  Clock,
  Bell,
  Newspaper,
  FileSearch,
  FileText,
  ChevronRight,
  Settings
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// 今日统计数据
const todayStats = ref({
  newCount: 28,
  highMatch: 12,
  followed: 5,
  pending: 8
});

// 最新标讯列表
const latestBids = ref([
  {
    id: 1,
    title: 'XX市政府网络安全等级保护测评项目',
    budget: 50,
    deadline: '2024-02-15',
    matchLevel: 'high'
  },
  {
    id: 2,
    title: 'XX银行渗透测试服务采购',
    budget: 80,
    deadline: '2024-02-18',
    matchLevel: 'high'
  },
  {
    id: 3,
    title: 'XX区教育局信息安全服务',
    budget: 35,
    deadline: '2024-02-12',
    matchLevel: 'medium'
  },
  {
    id: 4,
    title: 'XX医院等保咨询服务项目',
    budget: 28,
    deadline: '2024-02-14',
    matchLevel: 'high'
  },
  {
    id: 5,
    title: 'XX集团密码应用安全评估',
    budget: 45,
    deadline: '2024-02-20',
    matchLevel: 'high'
  }
]);

// 订阅配置摘要
const subscriptionConfig = ref({
  keywords: ['网络安全', '等保测评', '渗透测试'],
  regions: '全国',
  types: '服务类',
  pushTime: '每日 09:00'
});

// 智能体卡片
const agentCards = [
  {
    icon: Bell,
    title: '标讯订阅',
    description: '配置关键词和地区，自动监控招标信息',
    routeName: 'bid-info-form',
    color: '#3b82f6'
  },
  {
    icon: Newspaper,
    title: '标讯日报',
    description: '查看每日推送的高匹配度标讯',
    routeName: 'bid-info-daily',
    color: '#10b981'
  },
  {
    icon: FileSearch,
    title: '标讯解读',
    description: 'AI智能分析招标文件关键信息',
    routeName: 'bid-analysis-form',
    color: '#8b5cf6'
  },
  {
    icon: FileText,
    title: '标书生成',
    description: '一键生成规范投标文件',
    routeName: 'bid-doc-form',
    color: '#f59e0b'
  }
];

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const getMatchClass = (level: string) => {
  switch (level) {
    case 'high': return 'match-high';
    case 'medium': return 'match-medium';
    default: return '';
  }
};

const getMatchText = (level: string) => {
  switch (level) {
    case 'high': return '高匹配';
    case 'medium': return '中匹配';
    default: return '';
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};
</script>

<template>
  <div class="bid-center-page">
    <div class="page-header">
      <h1 class="page-title">标讯中心</h1>
      <p class="page-subtitle">智能监控招标信息，一站式投标服务</p>
    </div>

    <div class="page-content">
      <!-- 今日统计卡片 -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon new">
              <TrendingUp :size="20" />
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ todayStats.newCount }}</span>
              <span class="stat-label">今日新增</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon high">
              <Star :size="20" />
            </div>
            <div class="stat-info">
              <span class="stat-value highlight">{{ todayStats.highMatch }}</span>
              <span class="stat-label">高匹配</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon followed">
              <Bell :size="20" />
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ todayStats.followed }}</span>
              <span class="stat-label">已关注</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon pending">
              <Clock :size="20" />
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ todayStats.pending }}</span>
              <span class="stat-label">待处理</span>
            </div>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="left-column">
          <!-- 最新标讯列表 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-title">
                <Newspaper :size="18" />
                <span>最新标讯</span>
              </div>
              <button class="view-all-btn" @click="navigateTo('bid-info-daily')">
                查看全部
                <ChevronRight :size="14" />
              </button>
            </div>
            <div class="bid-list">
              <div
                v-for="bid in latestBids"
                :key="bid.id"
                class="bid-item"
                @click="navigateTo('bid-info-daily')"
              >
                <div class="bid-title">{{ bid.title }}</div>
                <div class="bid-meta">
                  <span class="bid-budget">{{ bid.budget }}万</span>
                  <span class="bid-deadline">截止{{ formatDate(bid.deadline) }}</span>
                  <span class="match-badge" :class="getMatchClass(bid.matchLevel)">
                    {{ getMatchText(bid.matchLevel) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 订阅配置摘要 -->
          <div class="section-card config-card">
            <div class="section-header">
              <div class="section-title">
                <Settings :size="18" />
                <span>订阅配置</span>
              </div>
              <button class="edit-btn" @click="navigateTo('bid-info-form')">
                修改配置
              </button>
            </div>
            <div class="config-content">
              <div class="config-item">
                <span class="config-label">关键词</span>
                <div class="config-tags">
                  <span v-for="keyword in subscriptionConfig.keywords" :key="keyword" class="config-tag">
                    {{ keyword }}
                  </span>
                </div>
              </div>
              <div class="config-row">
                <div class="config-item">
                  <span class="config-label">地区</span>
                  <span class="config-value">{{ subscriptionConfig.regions }}</span>
                </div>
                <div class="config-item">
                  <span class="config-label">类型</span>
                  <span class="config-value">{{ subscriptionConfig.types }}</span>
                </div>
                <div class="config-item">
                  <span class="config-label">推送</span>
                  <span class="config-value">{{ subscriptionConfig.pushTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-column">
          <!-- 投标智能体 -->
          <div class="section-card agents-card">
            <div class="section-header">
              <div class="section-title">
                <span>投标智能体</span>
              </div>
            </div>
            <div class="agents-grid">
              <div
                v-for="agent in agentCards"
                :key="agent.routeName"
                class="agent-card"
                @click="navigateTo(agent.routeName)"
              >
                <div class="agent-icon" :style="{ background: agent.color + '15', color: agent.color }">
                  <component :is="agent.icon" :size="24" />
                </div>
                <div class="agent-info">
                  <h3 class="agent-title">{{ agent.title }}</h3>
                  <p class="agent-desc">{{ agent.description }}</p>
                </div>
                <ChevronRight :size="16" class="agent-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bid-center-page {
  height: 100%;
  background: #f8fafc;
  padding: 24px 32px;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.new {
  background: #eff6ff;
  color: #3b82f6;
}

.stat-icon.high {
  background: #ecfdf5;
  color: #10b981;
}

.stat-icon.followed {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-icon.pending {
  background: #fce7f3;
  color: #ec4899;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-value.highlight {
  color: #10b981;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.main-content {
  display: flex;
  gap: 24px;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  width: 380px;
}

.section-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.section-title svg {
  color: #3b82f6;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #eff6ff;
  border: none;
  border-radius: 6px;
  color: #3b82f6;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background: #dbeafe;
}

.edit-btn {
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.bid-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bid-item {
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.bid-item:hover {
  background: #eff6ff;
}

.bid-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.4;
}

.bid-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.bid-budget {
  color: #10b981;
  font-weight: 600;
}

.bid-deadline {
  color: #64748b;
}

.match-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.match-high {
  background: #dcfce7;
  color: #16a34a;
}

.match-medium {
  background: #fef9c3;
  color: #ca8a04;
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-row {
  display: flex;
  gap: 32px;
}

.config-label {
  font-size: 13px;
  color: #94a3b8;
  min-width: 48px;
}

.config-value {
  font-size: 14px;
  color: #334155;
}

.config-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.config-tag {
  padding: 4px 12px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 16px;
  font-size: 13px;
}

.agents-card {
  height: fit-content;
}

.agents-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.agent-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.agent-card:hover {
  background: #eff6ff;
  transform: translateX(4px);
}

.agent-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-info {
  flex: 1;
}

.agent-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.agent-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.agent-arrow {
  color: #94a3b8;
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    flex-direction: column;
  }

  .right-column {
    width: 100%;
  }

  .agents-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
