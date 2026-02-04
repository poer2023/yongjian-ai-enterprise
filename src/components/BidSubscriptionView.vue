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
  Users,
  FileSearch,
  FileText,
  X,
  Maximize2
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

// 按日期和策略组的 mock 数据
interface BidHighlight {
  id: number;
  title: string;
  budget: string;
  deadline: string;
  location: string;
  matchScore: number;
  tags: string[];
}

interface BidItem {
  id: number;
  title: string;
  budget: string;
  matchScore: number;
}

interface DayData {
  summary: string;
  highlights: BidHighlight[];
  allBids: BidItem[];
}

type PolicyData = Record<string, DayData>;
type DataByPolicy = Record<string, PolicyData>;

const dataByPolicyAndDate: DataByPolicy = {
  'all': {
    '2026-02-04': {
      summary: `今日共监测到标讯信息 47 条，其中与您订阅关键词高度匹配的标讯 12 条。网络安全领域整体活跃度较昨日上升约 30%，等保测评类项目表现尤为突出。

重点关注：上海市某三甲医院信息安全等级保护测评项目已发布招标公告，预算金额 85 万元，资质要求与贵司高度匹配，建议优先跟进。此外，浦东新区政务云安全运维服务采购项目预算达 156 万元，竞争程度预计中等。`,
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
        { id: 6, title: '嘉定区卫健委医疗信息系统等保测评', budget: '38万', matchScore: 82 }
      ]
    },
    '2026-02-03': {
      summary: `昨日共监测到标讯信息 38 条，其中与您订阅关键词高度匹配的标讯 9 条。整体市场活跃度保持平稳，金融行业安全需求有所上升。

重点项目：某股份制银行总行数据安全治理项目发布资格预审公告，预算规模达 280 万元，项目周期 12 个月，对供应商资质要求较高。`,
      highlights: [
        { id: 101, title: '某股份制银行总行数据安全治理项目', budget: '280万', deadline: '2026-02-15', location: '上海市', matchScore: 96, tags: ['数据安全', '金融'] },
        { id: 102, title: '长宁区智慧城市安全运营中心建设项目', budget: '95万', deadline: '2026-02-11', location: '上海市长宁区', matchScore: 91, tags: ['安全运营', '智慧城市'] }
      ],
      allBids: [
        { id: 101, title: '某股份制银行总行数据安全治理项目', budget: '280万', matchScore: 96 },
        { id: 102, title: '长宁区智慧城市安全运营中心建设项目', budget: '95万', matchScore: 91 },
        { id: 103, title: '杨浦区科创园区网络安全服务采购', budget: '42万', matchScore: 86 },
        { id: 104, title: '宝山区医院信息系统安全评估', budget: '35万', matchScore: 80 }
      ]
    },
    '2026-02-02': {
      summary: `前日共监测到标讯信息 42 条，其中与您订阅关键词高度匹配的标讯 11 条。政府采购类项目集中发布，教育和医疗行业需求明显。

亮点项目：上海市教育委员会教育城域网安全防护体系升级项目正式发布招标公告，预算金额 320 万元。`,
      highlights: [
        { id: 201, title: '上海市教育委员会教育城域网安全防护体系升级项目', budget: '320万', deadline: '2026-02-18', location: '上海市', matchScore: 97, tags: ['网络安全', '教育'] },
        { id: 202, title: '某三级医院医疗数据安全平台建设项目', budget: '128万', deadline: '2026-02-14', location: '上海市', matchScore: 93, tags: ['数据安全', '医疗'] }
      ],
      allBids: [
        { id: 201, title: '上海市教育委员会教育城域网安全防护体系升级项目', budget: '320万', matchScore: 97 },
        { id: 202, title: '某三级医院医疗数据安全平台建设项目', budget: '128万', matchScore: 93 },
        { id: 203, title: '闵行区政务数据中心安全运维服务', budget: '86万', matchScore: 89 }
      ]
    }
  },
  'security': {
    '2026-02-04': {
      summary: `【网络安全组】今日监测到网络安全相关标讯 23 条，其中高匹配度标讯 8 条。渗透测试和安全运维类项目活跃，金融、政务领域需求旺盛。

重点推荐：某国有银行上海分行网络安全渗透测试服务项目预算 68 万元，要求 CISP 资质，与贵司资质高度匹配。建议重点跟进金融领域安全项目。`,
      highlights: [
        { id: 301, title: '某国有银行上海分行网络安全渗透测试服务', budget: '68万', deadline: '2026-02-08', location: '上海市', matchScore: 96, tags: ['渗透测试', '金融'] },
        { id: 302, title: '浦东新区政务云安全运维服务采购', budget: '156万', deadline: '2026-02-12', location: '上海市浦东新区', matchScore: 94, tags: ['安全运维', '政务云'] },
        { id: 303, title: '徐汇区教育局校园网络安全防护系统建设', budget: '45万', deadline: '2026-02-09', location: '上海市徐汇区', matchScore: 89, tags: ['网络安全', '教育'] }
      ],
      allBids: [
        { id: 301, title: '某国有银行上海分行网络安全渗透测试服务', budget: '68万', matchScore: 96 },
        { id: 302, title: '浦东新区政务云安全运维服务采购', budget: '156万', matchScore: 94 },
        { id: 303, title: '徐汇区教育局校园网络安全防护系统建设', budget: '45万', matchScore: 89 },
        { id: 304, title: '青浦区公安局网络安全监测平台采购', budget: '120万', matchScore: 85 },
        { id: 305, title: '松江区政府数据中心安全加固项目', budget: '72万', matchScore: 82 },
        { id: 306, title: '闵行区街道办网络安全咨询服务', budget: '28万', matchScore: 78 },
        { id: 307, title: '静安区商务楼宇网络安全检测服务', budget: '25万', matchScore: 75 },
        { id: 308, title: '奉贤区工业园区企业安全服务采购', budget: '55万', matchScore: 72 }
      ]
    },
    '2026-02-03': {
      summary: `【网络安全组】昨日监测到网络安全相关标讯 18 条，其中高匹配度标讯 6 条。安全态势感知类项目增多，智慧城市安全建设需求上升。

重点项目：长宁区智慧城市安全运营中心建设项目预算 95 万元，侧重态势感知和安全运营能力，建议关注。`,
      highlights: [
        { id: 311, title: '长宁区智慧城市安全运营中心建设项目', budget: '95万', deadline: '2026-02-11', location: '上海市长宁区', matchScore: 93, tags: ['安全运营', '智慧城市'] },
        { id: 312, title: '杨浦区科创园区网络安全服务采购', budget: '42万', deadline: '2026-02-10', location: '上海市杨浦区', matchScore: 88, tags: ['网络安全', '科创园区'] }
      ],
      allBids: [
        { id: 311, title: '长宁区智慧城市安全运营中心建设项目', budget: '95万', matchScore: 93 },
        { id: 312, title: '杨浦区科创园区网络安全服务采购', budget: '42万', matchScore: 88 },
        { id: 313, title: '金山区工业控制系统安全检测', budget: '52万', matchScore: 82 },
        { id: 314, title: '黄浦区商业中心网络安全咨询', budget: '22万', matchScore: 76 },
        { id: 315, title: '浦东新区学校网络安全建设', budget: '38万', matchScore: 71 },
        { id: 316, title: '徐汇区社区服务中心安全加固', budget: '18万', matchScore: 65 }
      ]
    },
    '2026-02-02': {
      summary: `【网络安全组】前日监测到网络安全相关标讯 21 条，其中高匹配度标讯 7 条。教育城域网安全升级成为热点，大型项目机会增多。

亮点项目：上海市教育委员会教育城域网安全防护体系升级项目预算 320 万元，项目规模大、周期长，建议提前组建团队。`,
      highlights: [
        { id: 321, title: '上海市教育委员会教育城域网安全防护体系升级项目', budget: '320万', deadline: '2026-02-18', location: '上海市', matchScore: 97, tags: ['网络安全', '教育'] },
        { id: 322, title: '闵行区政务数据中心安全运维服务', budget: '86万', deadline: '2026-02-09', location: '上海市闵行区', matchScore: 90, tags: ['安全运维', '政务'] }
      ],
      allBids: [
        { id: 321, title: '上海市教育委员会教育城域网安全防护体系升级项目', budget: '320万', matchScore: 97 },
        { id: 322, title: '闵行区政务数据中心安全运维服务', budget: '86万', matchScore: 90 },
        { id: 323, title: '奉贤区公安局安全监测服务', budget: '68万', matchScore: 84 },
        { id: 324, title: '金山区政务云安全加固', budget: '45万', matchScore: 78 },
        { id: 325, title: '宝山区社区中心安全咨询', budget: '15万', matchScore: 72 },
        { id: 326, title: '杨浦区学校信息安全服务', budget: '22万', matchScore: 66 },
        { id: 327, title: '普陀区街道网络安全检测', budget: '18万', matchScore: 60 }
      ]
    }
  },
  'dengbao': {
    '2026-02-04': {
      summary: `【等保测评组】今日监测到等保测评相关标讯 15 条，其中高匹配度标讯 4 条。医疗卫生行业等保合规需求集中释放，三级医院项目增多。

重点推荐：上海市第一人民医院信息安全等级保护测评服务采购项目预算 85 万元，三级等保测评，与贵司等保资质高度匹配，建议优先投标。`,
      highlights: [
        { id: 401, title: '上海市第一人民医院信息安全等级保护测评服务采购项目', budget: '85万', deadline: '2026-02-10', location: '上海市', matchScore: 98, tags: ['等保测评', '医疗卫生'] },
        { id: 402, title: '嘉定区卫健委医疗信息系统等保测评', budget: '38万', deadline: '2026-02-11', location: '上海市嘉定区', matchScore: 91, tags: ['等保测评', '医疗'] }
      ],
      allBids: [
        { id: 401, title: '上海市第一人民医院信息安全等级保护测评服务采购项目', budget: '85万', matchScore: 98 },
        { id: 402, title: '嘉定区卫健委医疗信息系统等保测评', budget: '38万', matchScore: 91 },
        { id: 403, title: '普陀区社区卫生服务中心信息安全建设', budget: '32万', matchScore: 84 },
        { id: 404, title: '虹口区文化场馆信息系统安全评估', budget: '18万', matchScore: 76 }
      ]
    },
    '2026-02-03': {
      summary: `【等保测评组】昨日监测到等保测评相关标讯 11 条，其中高匹配度标讯 3 条。政务系统等保合规进入集中采购期，区县级项目活跃。

重点项目：崇明区政务系统等保测评服务预算 28 万元，二级等保测评，竞争程度适中。`,
      highlights: [
        { id: 411, title: '宝山区医院信息系统安全评估', budget: '35万', deadline: '2026-02-12', location: '上海市宝山区', matchScore: 89, tags: ['等保测评', '医疗'] },
        { id: 412, title: '崇明区政务系统等保测评服务', budget: '28万', deadline: '2026-02-13', location: '上海市崇明区', matchScore: 85, tags: ['等保测评', '政务'] }
      ],
      allBids: [
        { id: 411, title: '宝山区医院信息系统安全评估', budget: '35万', matchScore: 89 },
        { id: 412, title: '崇明区政务系统等保测评服务', budget: '28万', matchScore: 85 },
        { id: 413, title: '奉贤区卫健委信息安全评估', budget: '22万', matchScore: 78 }
      ]
    },
    '2026-02-02': {
      summary: `【等保测评组】前日监测到等保测评相关标讯 13 条，其中高匹配度标讯 4 条。医疗数据安全合规成为重点，大型医院等保需求持续释放。

亮点项目：某三级医院医疗数据安全平台建设项目预算 128 万元，含等保测评和数据安全建设，综合性项目值得重点关注。`,
      highlights: [
        { id: 421, title: '某三级医院医疗数据安全平台建设项目', budget: '128万', deadline: '2026-02-14', location: '上海市', matchScore: 95, tags: ['等保测评', '数据安全', '医疗'] },
        { id: 422, title: '青浦区卫健委信息安全评估', budget: '32万', deadline: '2026-02-10', location: '上海市青浦区', matchScore: 88, tags: ['等保测评', '医疗'] },
        { id: 423, title: '崇明区医院网络安全改造', budget: '28万', deadline: '2026-02-11', location: '上海市崇明区', matchScore: 82, tags: ['等保测评', '医疗'] }
      ],
      allBids: [
        { id: 421, title: '某三级医院医疗数据安全平台建设项目', budget: '128万', matchScore: 95 },
        { id: 422, title: '青浦区卫健委信息安全评估', budget: '32万', matchScore: 88 },
        { id: 423, title: '崇明区医院网络安全改造', budget: '28万', matchScore: 82 },
        { id: 424, title: '松江区教育局等保测评服务', budget: '25万', matchScore: 76 }
      ]
    }
  }
};

// 计算当前日期和策略组的数据
const currentData = computed(() => {
  const policyData = dataByPolicyAndDate[activePolicyId.value] || dataByPolicyAndDate['all'];
  return policyData[currentDate.value.date] || policyData['2026-02-04'];
});

const goToDetail = (id: number) => {
  router.push({ name: 'bid-list-detail', query: { bidId: id } });
};

const goToAnalysis = (id: number) => {
  router.push({ name: 'bid-analysis-form', query: { bidId: id } });
};

const goToDocGenerate = (id: number) => {
  router.push({ name: 'bid-doc-form', query: { bidId: id } });
};

// Fullscreen mode for all bids
const isFullscreen = ref(false);
const selectedBidId = ref<number | null>(null);

const openFullscreen = () => {
  isFullscreen.value = true;
  if (currentData.value.allBids.length > 0) {
    selectedBidId.value = currentData.value.allBids[0].id;
  }
};

const closeFullscreen = () => {
  isFullscreen.value = false;
  selectedBidId.value = null;
};

const selectBid = (id: number) => {
  selectedBidId.value = id;
};

const selectedBidDetail = computed(() => {
  if (!selectedBidId.value) return null;
  const bid = currentData.value.allBids.find(b => b.id === selectedBidId.value);
  if (!bid) return null;
  // Return detailed mock data
  return {
    ...bid,
    deadline: '2026-02-15',
    location: '上海市',
    publishDate: '2026-02-01',
    purchaser: 'XX采购单位',
    contact: '张先生 021-88888888',
    requirements: [
      '具有相关资质认证',
      '近3年完成类似项目经验',
      '项目团队不少于5人'
    ],
    scope: '本项目包含相关服务内容，服务期限为1年。',
    evaluation: '综合评分法'
  };
});

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
                <div class="highlight-content">
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
                <div class="item-actions">
                  <button class="action-btn secondary" @click.stop="goToAnalysis(bid.id)">
                    <FileSearch :size="14" />
                    标讯解读
                  </button>
                  <button class="action-btn primary" @click.stop="goToDocGenerate(bid.id)">
                    <FileText :size="14" />
                    生成标书
                  </button>
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
              <button class="view-all-btn" @click="openFullscreen">
                <Maximize2 :size="14" />
                查看全部
              </button>
            </div>
            <div class="bid-list">
              <div
                v-for="bid in currentData.allBids.slice(0, 8)"
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
            <div v-if="currentData.allBids.length > 8" class="list-footer">
              <button class="more-btn" @click="openFullscreen">
                查看全部 {{ currentData.allBids.length }} 条标讯
                <ChevronRight :size="14" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- 全屏模式 -->
    <div v-if="isFullscreen" class="fullscreen-modal">
      <header class="fullscreen-header">
        <div class="header-left">
          <button class="back-btn" @click="closeFullscreen">
            <ChevronLeft :size="18" />
            <span>返回</span>
          </button>
          <h1 class="header-title">全部标讯列表</h1>
          <span class="header-count">共 {{ currentData.allBids.length }} 条</span>
        </div>
      </header>
      <div class="fullscreen-body">
        <!-- 左侧文件列表 -->
        <aside class="file-sidebar">
          <div class="sidebar-header">
            <FileText :size="16" />
            <span>标讯列表</span>
          </div>
          <div class="file-list">
            <div
              v-for="bid in currentData.allBids"
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

        <!-- 右侧内容区 - 与 BidDetailView 结构一致 -->
        <div class="detail-main" v-if="selectedBidDetail">
          <!-- 主内容 -->
          <div class="main-content">
            <!-- 标题区域 -->
            <div class="title-section">
              <span class="match-badge-large" :class="getMatchScoreClass(selectedBidDetail.matchScore)">
                匹配度 {{ selectedBidDetail.matchScore }}%
              </span>
              <h2 class="detail-title">{{ selectedBidDetail.title }}</h2>
            </div>

            <!-- 基本信息卡片 -->
            <div class="info-card">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">预算金额</div>
                  <div class="info-value highlight">{{ selectedBidDetail.budget }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">截止日期</div>
                  <div class="info-value">{{ selectedBidDetail.deadline }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">发布日期</div>
                  <div class="info-value">{{ selectedBidDetail.publishDate }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">所在地区</div>
                  <div class="info-value">{{ selectedBidDetail.location }}</div>
                </div>
              </div>
            </div>

            <!-- 采购单位 -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">采购单位</h3>
              </div>
              <div class="card-body">
                <p class="body-text">{{ selectedBidDetail.purchaser }}</p>
                <p class="body-text sub">联系方式：{{ selectedBidDetail.contact }}</p>
              </div>
            </div>

            <!-- 资质要求 -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">资质要求</h3>
              </div>
              <div class="card-body">
                <ul class="requirements-list">
                  <li v-for="(req, index) in selectedBidDetail.requirements" :key="index">{{ req }}</li>
                </ul>
              </div>
            </div>

            <!-- 项目范围 -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">项目范围</h3>
              </div>
              <div class="card-body">
                <p class="body-text">{{ selectedBidDetail.scope }}</p>
              </div>
            </div>

            <!-- 评标方法 -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">评标方法</h3>
              </div>
              <div class="card-body">
                <p class="body-text">{{ selectedBidDetail.evaluation }}</p>
              </div>
            </div>
          </div>

          <!-- 右侧面板 -->
          <div class="side-panel">
            <!-- 匹配度分析 -->
            <div class="match-analysis-card">
              <div class="card-header">
                <h3 class="card-title">匹配度分析</h3>
              </div>
              <div class="match-score-display">
                <div class="score-circle" :class="getMatchScoreClass(selectedBidDetail.matchScore)">
                  <span class="score-value">{{ selectedBidDetail.matchScore }}</span>
                  <span class="score-label">分</span>
                </div>
              </div>
            </div>

            <!-- 快速操作 -->
            <div class="quick-actions-card">
              <button class="quick-action-btn primary" @click="goToAnalysis(selectedBidId!)">
                <FileSearch :size="18" />
                <span>AI智能解读</span>
              </button>
              <button class="quick-action-btn" @click="goToDocGenerate(selectedBidId!)">
                <FileText :size="18" />
                <span>生成标书</span>
              </button>
            </div>
          </div>
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
  display: flex;
  align-items: stretch;
  gap: 16px;
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

.highlight-content {
  flex: 1;
  min-width: 0;
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

/* 操作按钮 - 放在右侧 */
.item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.secondary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.action-btn.secondary:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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

/* 查看全部按钮 */
.view-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  color: #3b82f6;
}

.list-footer {
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
}

.more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.more-btn:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

/* 全屏模式 */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.fullscreen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.fullscreen-header .header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fullscreen-header .header-title {
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

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.fullscreen-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 文件侧边栏 */
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

.file-budget {
  color: #16a34a;
  font-weight: 500;
}

/* 详情内容 */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.match-badge-large {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.detail-meta-grid {
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

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section .section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.section-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.section-content.sub {
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

/* 操作侧边栏 */
.action-sidebar {
  width: 280px;
  background: white;
  border-left: 1px solid #e2e8f0;
  padding: 24px;
}

.action-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
}

.action-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.sidebar-action-btn span {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.sidebar-action-btn .action-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.sidebar-action-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.sidebar-action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: white;
}

.sidebar-action-btn.primary span {
  color: white;
}

.sidebar-action-btn.primary .action-desc {
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
}

/* 详情主区域 - 双栏布局 */
.detail-main {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.side-panel {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 标题区域 */
.title-section {
  margin-bottom: 20px;
}

.title-section .match-badge-large {
  display: inline-block;
  padding: 6px 14px;
  background: #dcfce7;
  color: #16a34a;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  margin-bottom: 12px;
}

.title-section .detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

/* 信息卡片 */
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

.info-item .info-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.info-item .info-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.info-item .info-value.highlight {
  color: #3b82f6;
  font-size: 18px;
}

/* 内容卡片 */
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

/* 匹配度分析卡片 */
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

/* 快捷操作卡片 */
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
