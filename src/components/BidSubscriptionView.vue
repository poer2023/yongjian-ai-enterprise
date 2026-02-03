<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Bell,
  Sparkles,
  Star,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Building2,
  ScrollText,
  Users
} from 'lucide-vue-next';

const router = useRouter();

// 策略组数据
const policyGroups = ref([
  { id: 'all', name: '全部', color: '#3b82f6' },
  { id: 'security', name: '网络安全组', color: '#10b981', newCount: 8 },
  { id: 'dengbao', name: '等保测评组', color: '#f59e0b', newCount: 4 }
]);
const activePolicyId = ref('all');

// 日期相关
const today = new Date();
const dateOptions = [
  { label: '今天', date: '2026-02-04', offset: 0 },
  { label: '昨天', date: '2026-02-03', offset: -1 },
  { label: '前天', date: '2026-02-02', offset: -2 }
];
const currentDateIndex = ref(0);
const currentDate = computed(() => dateOptions[currentDateIndex.value]);

const prevDate = () => {
  if (currentDateIndex.value < dateOptions.length - 1) {
    currentDateIndex.value++;
  }
};

const nextDate = () => {
  if (currentDateIndex.value > 0) {
    currentDateIndex.value--;
  }
};

// 按日期的 mock 数据
const dataByDate: Record<string, {
  summary: string;
  highlights: Array<{
    id: number;
    title: string;
    budget: string;
    deadline: string;
    location: string;
    matchScore: number;
    tags: string[];
  }>;
  allBids: Array<{
    id: number;
    title: string;
    budget: string;
    matchScore: number;
  }>;
}> = {
  '2026-02-04': {
    summary: `今日共监测到标讯信息 47 条，其中与您订阅关键词高度匹配的标讯 12 条。网络安全领域整体活跃度较昨日上升约 30%，等保测评类项目表现尤为突出。

重点关注：上海市某三甲医院信息安全等级保护测评项目已发布招标公告，预算金额 85 万元，资质要求与贵司高度匹配，建议优先跟进。此外，浦东新区政务云安全运维服务采购项目预算达 156 万元，竞争程度预计中等。

本周趋势分析显示，医疗卫生行业的安全需求持续走高，政府机关的等保合规项目进入集中采购期。建议关注医疗和政务领域的安全服务机会，同时密切跟踪已收藏项目的开标时间节点。`,
    highlights: [
      { id: 1, title: '上海市第一人民医院信息安全等级保护测评服务采购项目', budget: '85万', deadline: '2026-02-10', location: '上海市', matchScore: 98, tags: ['等保测评', '医疗卫生'] },
      { id: 2, title: '浦东新区政务云安全运维服务采购', budget: '156万', deadline: '2026-02-12', location: '上海市浦东新区', matchScore: 95, tags: ['安全运维', '政务云'] },
      { id: 3, title: '某国有银行上海分行网络安全渗透测试服务', budget: '68万', deadline: '2026-02-08', location: '上海市', matchScore: 92, tags: ['渗透测试', '金融'] }
    ],
    allBids: [
      { id: 1, title: '上海市第一人民医院信息安全等级保护测评服务采购项目', budget: '85万', matchScore: 98 },
      { id: 2, title: '浦东新区政务云安全运维服务采购', budget: '156万', matchScore: 95 },
      { id: 3, title: '某国有银行上海分行网络安全渗透测试服务', budget: '68万', matchScore: 92 },
      { id: 4, title: '徐汇区教育局校园网络安全防护系统建设', budget: '45万', matchScore: 88 },
      { id: 5, title: '松江区政府数据中心安全加固项目', budget: '72万', matchScore: 85 },
      { id: 6, title: '嘉定区卫健委医疗信息系统等保测评', budget: '38万', matchScore: 82 },
      { id: 7, title: '青浦区公安局网络安全监测平台采购', budget: '120万', matchScore: 78 },
      { id: 8, title: '奉贤区工业园区企业安全服务采购', budget: '55万', matchScore: 75 },
      { id: 9, title: '闵行区街道办网络安全咨询服务', budget: '28万', matchScore: 72 },
      { id: 10, title: '普陀区社区卫生服务中心信息安全建设', budget: '32万', matchScore: 68 },
      { id: 11, title: '静安区商务楼宇网络安全检测服务', budget: '25万', matchScore: 65 },
      { id: 12, title: '虹口区文化场馆信息系统安全评估', budget: '18万', matchScore: 62 }
    ]
  },
  '2026-02-03': {
    summary: `昨日共监测到标讯信息 38 条，其中与您订阅关键词高度匹配的标讯 9 条。整体市场活跃度保持平稳，金融行业安全需求有所上升。

重点项目：某股份制银行总行数据安全治理项目发布资格预审公告，预算规模达 280 万元，项目周期 12 个月，对供应商资质要求较高。另有长宁区智慧城市安全运营中心建设项目，预算 95 万元，技术要求侧重态势感知能力。

市场动态显示，银行业数据安全合规需求持续增长，智慧城市安全运营类项目逐步增多。建议提前准备相关案例材料，关注金融和智慧城市领域的项目机会。`,
    highlights: [
      { id: 101, title: '某股份制银行总行数据安全治理项目', budget: '280万', deadline: '2026-02-15', location: '上海市', matchScore: 96, tags: ['数据安全', '金融'] },
      { id: 102, title: '长宁区智慧城市安全运营中心建设项目', budget: '95万', deadline: '2026-02-11', location: '上海市长宁区', matchScore: 91, tags: ['安全运营', '智慧城市'] }
    ],
    allBids: [
      { id: 101, title: '某股份制银行总行数据安全治理项目', budget: '280万', matchScore: 96 },
      { id: 102, title: '长宁区智慧城市安全运营中心建设项目', budget: '95万', matchScore: 91 },
      { id: 103, title: '杨浦区科创园区网络安全服务采购', budget: '42万', matchScore: 86 },
      { id: 104, title: '宝山区医院信息系统安全评估', budget: '35万', matchScore: 80 },
      { id: 105, title: '崇明区政务系统等保测评服务', budget: '28万', matchScore: 76 },
      { id: 106, title: '金山区工业控制系统安全检测', budget: '52万', matchScore: 73 },
      { id: 107, title: '黄浦区商业中心网络安全咨询', budget: '22万', matchScore: 68 },
      { id: 108, title: '浦东新区学校网络安全建设', budget: '38万', matchScore: 65 },
      { id: 109, title: '徐汇区社区服务中心安全加固', budget: '18万', matchScore: 60 }
    ]
  },
  '2026-02-02': {
    summary: `前日共监测到标讯信息 42 条，其中与您订阅关键词高度匹配的标讯 11 条。政府采购类项目集中发布，教育和医疗行业需求明显。

亮点项目：上海市教育委员会教育城域网安全防护体系升级项目正式发布招标公告，预算金额 320 万元，项目涵盖全市多个区县，对供应商的服务能力和团队规模有较高要求。同时，某三级医院医疗数据安全平台建设项目预算 128 万元，强调数据加密和访问控制能力。

趋势判断：教育行业网络安全建设进入加速期，医疗数据安全合规需求持续释放。建议重点关注教育和医疗领域的大型项目，提前组建项目团队做好投标准备。`,
    highlights: [
      { id: 201, title: '上海市教育委员会教育城域网安全防护体系升级项目', budget: '320万', deadline: '2026-02-18', location: '上海市', matchScore: 97, tags: ['网络安全', '教育'] },
      { id: 202, title: '某三级医院医疗数据安全平台建设项目', budget: '128万', deadline: '2026-02-14', location: '上海市', matchScore: 93, tags: ['数据安全', '医疗'] },
      { id: 203, title: '闵行区政务数据中心安全运维服务', budget: '86万', deadline: '2026-02-09', location: '上海市闵行区', matchScore: 89, tags: ['安全运维', '政务'] }
    ],
    allBids: [
      { id: 201, title: '上海市教育委员会教育城域网安全防护体系升级项目', budget: '320万', matchScore: 97 },
      { id: 202, title: '某三级医院医疗数据安全平台建设项目', budget: '128万', matchScore: 93 },
      { id: 203, title: '闵行区政务数据中心安全运维服务', budget: '86万', matchScore: 89 },
      { id: 204, title: '嘉定区高新区企业安全服务', budget: '48万', matchScore: 84 },
      { id: 205, title: '松江区教育局校园安全建设', budget: '56万', matchScore: 81 },
      { id: 206, title: '青浦区卫健委信息安全评估', budget: '32万', matchScore: 77 },
      { id: 207, title: '奉贤区公安局安全监测服务', budget: '68万', matchScore: 74 },
      { id: 208, title: '金山区政务云安全加固', budget: '45万', matchScore: 70 },
      { id: 209, title: '崇明区医院网络安全改造', budget: '28万', matchScore: 66 },
      { id: 210, title: '宝山区社区中心安全咨询', budget: '15万', matchScore: 62 },
      { id: 211, title: '杨浦区学校信息安全服务', budget: '22万', matchScore: 58 }
    ]
  }
};

// 计算当前日期的数据
const currentData = computed(() => {
  return dataByDate[currentDate.value.date] || dataByDate['2026-02-04'];
});

const goToDetail = (id: number) => {
  router.push({ name: 'bid-detail', query: { id } });
};

const goToFullReport = () => {
  router.push({ name: 'bid-daily-report' });
};

const getMatchScoreClass = (score: number) => {
  if (score >= 90) return 'score-high';
  if (score >= 75) return 'score-medium';
  return 'score-low';
};
</script>

<template>
  <div class="bid-subscription-view">
    <div class="content-wrapper">
      <!-- 顶部日期切换栏 -->
      <div class="date-header">
        <div class="header-left">
          <div class="header-icon">
            <Bell :size="22" />
          </div>
          <div class="header-text">
            <h1 class="page-title">标讯订阅</h1>
            <p class="page-subtitle">基于您的订阅配置，智能推送匹配标讯</p>
          </div>
        </div>
        <div class="date-switcher">
          <button class="date-arrow" :disabled="currentDateIndex >= dateOptions.length - 1" @click="prevDate">
            <ChevronLeft :size="18" />
          </button>
          <div class="date-display">
            <Calendar :size="16" />
            <span class="date-label">{{ currentDate.label }}</span>
            <span class="date-value">{{ currentDate.date }}</span>
          </div>
          <button class="date-arrow" :disabled="currentDateIndex <= 0" @click="nextDate">
            <ChevronRight :size="18" />
          </button>
        </div>
      </div>

      <!-- 策略组切换 -->
      <div class="policy-group-bar">
        <div class="policy-tabs">
          <button
            v-for="group in policyGroups"
            :key="group.id"
            class="policy-tab"
            :class="{ active: activePolicyId === group.id }"
            @click="activePolicyId = group.id"
          >
            <Users :size="14" />
            <span>{{ group.name }}</span>
            <span v-if="group.newCount" class="tab-badge">{{ group.newCount }}</span>
          </button>
        </div>
        <div class="policy-hint">
          <span class="hint-text">当前策略组：</span>
          <span class="hint-value">{{ policyGroups.find(g => g.id === activePolicyId)?.name }}</span>
        </div>
      </div>

      <!-- 双栏布局 -->
      <div class="main-grid">
        <!-- 左栏：总结 + 重点标讯 -->
        <div class="left-column">
          <!-- 今日标讯总结 -->
          <section class="summary-card">
            <div class="card-header">
              <div class="header-title">
                <Sparkles :size="18" class="sparkles-icon" />
                <h2>{{ currentDate.label }}标讯总结</h2>
              </div>
              <button class="report-link" @click="goToFullReport">
                <ScrollText :size="14" />
                查看完整报告
              </button>
            </div>
            <div class="summary-content">
              <p>{{ currentData.summary }}</p>
            </div>
          </section>

          <!-- 重点标讯 -->
          <section class="highlight-card">
            <div class="card-header">
              <div class="header-title">
                <Star :size="18" class="star-icon" />
                <h2>重点标讯</h2>
                <span class="count-badge">{{ currentData.highlights.length }} 条高匹配</span>
              </div>
            </div>
            <div class="highlight-list">
              <div
                v-for="bid in currentData.highlights"
                :key="bid.id"
                class="highlight-item"
                @click="goToDetail(bid.id)"
              >
                <div class="item-top">
                  <div class="match-score" :class="getMatchScoreClass(bid.matchScore)">
                    <TrendingUp :size="12" />
                    {{ bid.matchScore }}%
                  </div>
                  <div class="bid-tags">
                    <span v-for="tag in bid.tags" :key="tag" class="bid-tag">{{ tag }}</span>
                  </div>
                </div>
                <h3 class="bid-title">{{ bid.title }}</h3>
                <div class="item-meta">
                  <span class="meta-item">
                    <Building2 :size="13" />
                    {{ bid.budget }}
                  </span>
                  <span class="meta-item">
                    <MapPin :size="13" />
                    {{ bid.location }}
                  </span>
                  <span class="meta-item">
                    <Calendar :size="13" />
                    {{ bid.deadline }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- 右栏：全部标讯列表 -->
        <div class="right-column">
          <section class="list-card">
            <div class="card-header">
              <div class="header-title">
                <Bell :size="18" />
                <h2>全部标讯</h2>
                <span class="count-badge">{{ currentData.allBids.length }} 条</span>
              </div>
            </div>
            <div class="bid-list">
              <div
                v-for="bid in currentData.allBids"
                :key="bid.id"
                class="bid-list-item"
                @click="goToDetail(bid.id)"
              >
                <span class="match-badge" :class="getMatchScoreClass(bid.matchScore)">
                  {{ bid.matchScore }}%
                </span>
                <span class="list-title">{{ bid.title }}</span>
                <span class="list-budget">{{ bid.budget }}</span>
                <ChevronRight :size="16" class="list-arrow" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bid-subscription-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 24px 32px;
  background: #f8fafc;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* 顶部日期切换栏 */
.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 16px;
  padding: 20px 28px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.page-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.date-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 6px;
}

/* 策略组切换栏 */
.policy-group-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.policy-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.policy-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.policy-tab:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.policy-tab.active {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-color: transparent;
  color: white;
}

.policy-tab.active .tab-badge {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #3b82f6;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
}

.policy-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.hint-text {
  color: #94a3b8;
}

.hint-value {
  color: #3b82f6;
  font-weight: 600;
}

.date-arrow {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.date-arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.date-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: white;
  border-radius: 6px;
  color: #1e293b;
}

.date-label {
  font-weight: 600;
  font-size: 14px;
}

.date-value {
  font-size: 13px;
  color: #64748b;
}

/* 双栏布局 */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  display: flex;
  flex-direction: column;
}

/* 通用卡片样式 */
.summary-card,
.highlight-card,
.list-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h2 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.sparkles-icon {
  color: #3b82f6;
}

.star-icon {
  color: #f59e0b;
}

.count-badge {
  padding: 3px 10px;
  background: #dbeafe;
  border-radius: 12px;
  font-size: 12px;
  color: #3b82f6;
  font-weight: 500;
}

.report-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.report-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 总结区域 */
.summary-content {
  padding: 20px;
}

.summary-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.9;
  color: #334155;
  white-space: pre-line;
}

/* 重点标讯 */
.highlight-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.highlight-item {
  padding: 16px;
  background: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.highlight-item:hover {
  border-color: #93c5fd;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.item-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.match-score {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
}

.score-high { background: #dcfce7; color: #16a34a; }
.score-medium { background: #fef3c7; color: #d97706; }
.score-low { background: #f1f5f9; color: #64748b; }

.bid-tags {
  display: flex;
  gap: 6px;
}

.bid-tag {
  padding: 2px 8px;
  background: #eff6ff;
  border-radius: 4px;
  font-size: 11px;
  color: #3b82f6;
}

.bid-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

/* 全部标讯列表 */
.list-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bid-list {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
}

.bid-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s;
}

.bid-list-item:last-child {
  border-bottom: none;
}

.bid-list-item:hover {
  background: #f8fafc;
}

.match-badge {
  flex-shrink: 0;
  width: 42px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
}

.list-title {
  flex: 1;
  font-size: 13px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-budget {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: #16a34a;
}

.list-arrow {
  flex-shrink: 0;
  color: #94a3b8;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .right-column {
    order: -1;
  }

  .bid-list {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .bid-subscription-view {
    padding: 16px;
  }

  .date-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-left {
    flex-direction: column;
  }

  .item-meta {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
