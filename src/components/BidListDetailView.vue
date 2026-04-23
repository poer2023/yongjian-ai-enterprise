<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft, FileText } from 'lucide-vue-next';

interface MatchAnalysisItem {
  label: string;
  matched: boolean;
  description: string;
}

interface BidItem {
  id: number;
  title: string;
  budget: string;
  matchScore: number;
  location: string;
  publishDate: string;
  purchaser: string;
  noticeType: string;
  summary: string;
  recommendation: string;
  analysis: MatchAnalysisItem[];
  tags: string[];
}

const router = useRouter();
const route = useRoute();

const bidList = ref<BidItem[]>([
  {
    id: 1,
    title: '国家税务总局天津市税务局2026年5月政府采购意向公告-天津税务2026年税务专网系统等保测评服务',
    budget: '27.40万元',
    matchScore: 95,
    location: '天津市 天津市',
    publishDate: '2026-04-20',
    purchaser: '国家税务总局天津市税务局',
    noticeType: '其他',
    summary:
      '国家税务总局天津市税务局计划采购2026年税务专网系统等保测评服务，项目预算27.4万元。采购内容为对4个等保三级税务专网系统提供等级保护测评和风险评估服务，服务期限为合同签订后12个月。',
    recommendation:
      '立即关注并准备相关资质及材料，待正式采购公告发布后第一时间响应，重点突出公司在等保测评领域的专业资质和项目经验。',
    analysis: [
      {
        label: '等级保护测评',
        matched: true,
        description: '采购需求明确为“等级保护测评服务”，与企业核心产品关键词完全匹配，是企业的主营业务。'
      },
      {
        label: '软件测试',
        matched: false,
        description: '公告未提及软件测试相关内容。'
      },
      {
        label: '商用密码安全',
        matched: false,
        description: '公告未提及商用密码相关测评要求。'
      }
    ],
    tags: ['等保测评', '税务系统']
  },
  {
    id: 2,
    title: '2026年重庆市渝北区卫生信息中心网络安全等级保护测评网上询价公告',
    budget: '7.50万元',
    matchScore: 95,
    location: '重庆市 渝北区',
    publishDate: '2026-04-18',
    purchaser: '重庆市渝北区卫生信息中心',
    noticeType: '网上询价',
    summary:
      '项目围绕区域卫生信息平台开展网络安全等级保护测评，聚焦关键信息系统合规整改及测评报告交付，预算规模较小，但对实施效率和交付规范要求较高。',
    recommendation:
      '优先以轻量化实施方案切入，强调医疗行业经验和标准化交付流程，提升中小项目快速成交概率。',
    analysis: [
      {
        label: '等级保护测评',
        matched: true,
        description: '采购名称直接指向网络安全等级保护测评，与现有服务目录高度一致。'
      },
      {
        label: '医疗信息化',
        matched: true,
        description: '招标单位属于卫生信息中心，医疗行业案例将明显提升竞争力。'
      },
      {
        label: '软件测试',
        matched: false,
        description: '当前项目不包含独立的软件质量测试交付范围。'
      }
    ],
    tags: ['等保测评', '医疗信息']
  },
  {
    id: 3,
    title: '宁夏回族自治区卫生健康委员会信息中心2026年网络安全等级保护测评服务采购项目招标公告',
    budget: '100.54万元',
    matchScore: 85,
    location: '宁夏回族自治区 银川市',
    publishDate: '2026-04-16',
    purchaser: '宁夏回族自治区卫生健康委员会信息中心',
    noticeType: '公开招标',
    summary:
      '该项目面向卫健委信息中心开展年度等级保护测评服务采购，预算超过100万元，覆盖范围预计包含核心业务系统、边界安全和整改复测，属于较完整的区域医疗政务安全服务项目。',
    recommendation:
      '建议突出跨区域实施能力、医疗政务项目经验以及整改辅导服务能力，准备完整的案例证明和项目经理履历。',
    analysis: [
      {
        label: '等级保护测评',
        matched: true,
        description: '项目目标与企业主要服务能力一致，具备较高的直接命中度。'
      },
      {
        label: '区域医疗政务',
        matched: true,
        description: '卫健委场景对行业案例和合规流程要求较高，若已有同类经验则可形成优势。'
      },
      {
        label: '商用密码安全',
        matched: false,
        description: '公告标题未体现密码测评或密码应用安全评估要求。'
      }
    ],
    tags: ['等保测评', '医疗政务']
  },
  {
    id: 4,
    title: '珠海市公安局一体化指挥调度平台网络安全等级保护测评服务采购项目',
    budget: '1177.73万元',
    matchScore: 85,
    location: '广东省 珠海市',
    publishDate: '2026-04-15',
    purchaser: '珠海市公安局',
    noticeType: '公开招标',
    summary:
      '项目面向公安一体化指挥调度平台，预算规模较大，预计覆盖平台测评、风险排查、整改支撑和复测等多个阶段，属于高金额、高门槛的政务安全项目。',
    recommendation:
      '建议联合展示大型政务项目履约能力、核心专家团队和跨部门协同经验，提前准备针对公安行业的安全保密承诺与实施计划。',
    analysis: [
      {
        label: '等级保护测评',
        matched: true,
        description: '项目核心交付内容与企业主力服务吻合，但对履约能力要求明显更高。'
      },
      {
        label: '公安行业经验',
        matched: true,
        description: '若具备公安或大型政务平台案例，将显著提高中标竞争力。'
      },
      {
        label: '软件测试',
        matched: false,
        description: '当前公告以安全测评为主，不属于功能测试或性能测试项目。'
      }
    ],
    tags: ['等保测评', '公安平台']
  },
  {
    id: 5,
    title: '混合现实练习系统软件测试服务招标公告（2026-JLJYDH-FW4001001）',
    budget: '18.50万元',
    matchScore: 70,
    location: '北京市',
    publishDate: '2026-04-14',
    purchaser: '某训练系统建设单位',
    noticeType: '招标公告',
    summary:
      '项目聚焦混合现实练习系统的软件测试服务，更偏向测试验证而非网络安全测评，预算中等偏小，对测试方法论和测试交付物完整性要求更高。',
    recommendation:
      '若继续跟进，应以软件测试能力和复杂系统验证经验为主线；若企业主营为安全测评，可将其列为次优机会。',
    analysis: [
      {
        label: '软件测试',
        matched: true,
        description: '采购内容直接指向软件测试服务，与安全测评类能力的关联度有限。'
      },
      {
        label: '等级保护测评',
        matched: false,
        description: '公告未体现等级保护测评或风险评估相关需求。'
      },
      {
        label: '商用密码安全',
        matched: false,
        description: '当前项目未体现密码安全建设或测评要求。'
      }
    ],
    tags: ['软件测试', '混合现实']
  },
  {
    id: 6,
    title: '富滇银行新一代信用风险管理系统群专业软件测试服务项目招标公告',
    budget: '715万元',
    matchScore: 60,
    location: '云南省 昆明市',
    publishDate: '2026-04-12',
    purchaser: '富滇银行股份有限公司',
    noticeType: '公开招标',
    summary:
      '该项目以银行风险管理系统群的软件测试服务为核心，强调金融系统稳定性、性能验证与专业测试交付，预算较大，但与安全测评主航道存在一定偏离。',
    recommendation:
      '从企业主营匹配度看不建议优先投入，可根据测试资源储备情况决定是否参与，避免稀释核心业务精力。',
    analysis: [
      {
        label: '金融软件测试',
        matched: true,
        description: '项目重点在金融行业专业软件测试，需要成熟的测试体系和金融项目经验。'
      },
      {
        label: '等级保护测评',
        matched: false,
        description: '当前招标信息未披露等保测评服务范围。'
      },
      {
        label: '主营业务契合度',
        matched: false,
        description: '若企业主力能力集中在安全测评，则该项目的直接匹配度偏低。'
      }
    ],
    tags: ['软件测试', '银行系统']
  }
]);

const selectedBidId = ref<number>(bidList.value[0]?.id ?? 0);

const selectedBid = computed(() => {
  return bidList.value.find((bid) => bid.id === selectedBidId.value) ?? null;
});

const source = computed(() => {
  const rawSource = route.query.source;
  return Array.isArray(rawSource) ? rawSource[0] ?? 'subscription' : rawSource ?? 'subscription';
});

const detailHeading = computed(() => {
  return selectedBid.value ? `${selectedBid.value.title} 详情情况` : '';
});

const syncSelectedBid = (rawBidId: string | null | (string | null)[] | undefined) => {
  const bidId = Array.isArray(rawBidId) ? rawBidId[0] : rawBidId;
  const fallbackId = bidList.value[0]?.id ?? 0;

  if (!bidId) {
    selectedBidId.value = fallbackId;
    return;
  }

  const parsedId = Number.parseInt(bidId, 10);
  const targetBid = bidList.value.find((bid) => bid.id === parsedId);
  selectedBidId.value = targetBid?.id ?? fallbackId;
};

watch(
  () => route.query.bidId as string | null | (string | null)[] | undefined,
  (bidId) => {
    syncSelectedBid(bidId);
  },
  { immediate: true }
);

const selectBid = (id: number) => {
  selectedBidId.value = id;
  router.replace({
    name: 'bid-list-detail',
    query: {
      ...route.query,
      bidId: String(id)
    }
  });
};

const getMatchScoreClass = (score: number) => {
  if (score >= 90) return 'score-high';
  if (score >= 75) return 'score-medium';
  return 'score-low';
};

const goBack = () => {
  if (source.value === 'daily') {
    router.push({ name: 'bid-daily-report' });
    return;
  }

  router.push({ name: 'bid-subscription' });
};
</script>

<template>
  <div class="bid-list-detail-page">
    <aside class="list-sidebar">
      <div class="sidebar-header">
        <button type="button" class="back-btn sidebar-back-btn" @click="goBack">
          <ChevronLeft :size="16" />
          <span>返回</span>
        </button>
        <div class="sidebar-title">标讯列表</div>
      </div>
      <div class="sidebar-list">
        <button
          v-for="bid in bidList"
          :key="bid.id"
          type="button"
          class="sidebar-item"
          :class="{ active: selectedBidId === bid.id }"
          @click="selectBid(bid.id)"
        >
          <div class="sidebar-item-icon">
            <FileText :size="16" />
          </div>
          <div class="sidebar-item-content">
            <div class="sidebar-item-title">{{ bid.title }}</div>
            <div class="sidebar-item-meta">
              <span class="match-chip" :class="getMatchScoreClass(bid.matchScore)">{{ bid.matchScore }}%</span>
              <span class="sidebar-item-budget">{{ bid.budget }}</span>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <main class="detail-panel" v-if="selectedBid">
      <div class="detail-shell">
        <section class="hero-card">
          <div class="hero-badge">匹配度 {{ selectedBid.matchScore }}%</div>
          <h1 class="hero-title">{{ detailHeading }}</h1>
        </section>

        <section class="detail-card">
          <h2 class="section-title">基本信息</h2>
          <div class="basic-grid">
            <div class="basic-item">
              <span class="basic-label">招标单位</span>
              <span class="basic-value">{{ selectedBid.purchaser }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-label">所在地区</span>
              <span class="basic-value">{{ selectedBid.location }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-label">预算金额</span>
              <span class="basic-value basic-value-highlight">{{ selectedBid.budget }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-label">发布时间</span>
              <span class="basic-value">{{ selectedBid.publishDate }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-label">公告类型</span>
              <span class="basic-value">{{ selectedBid.noticeType }}</span>
            </div>
          </div>
        </section>

        <section class="detail-card">
          <h2 class="section-title">匹配分析</h2>
          <div class="analysis-list">
            <div
              v-for="item in selectedBid.analysis"
              :key="item.label"
              class="analysis-item"
              :class="{ matched: item.matched }"
            >
              <span class="analysis-icon" :class="{ checked: item.matched }">{{ item.matched ? '✓' : '' }}</span>
              <p class="analysis-text">
                <strong>{{ item.label }}</strong>
                {{ item.description }}
              </p>
            </div>
          </div>
        </section>

        <section class="detail-card">
          <h2 class="section-title">智能建议</h2>
          <div class="advice-box">{{ selectedBid.recommendation }}</div>
        </section>

        <section class="detail-card">
          <h2 class="section-title">项目摘要</h2>
          <p class="summary-text">{{ selectedBid.summary }}</p>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.bid-list-detail-page {
  display: flex;
  height: 100%;
  background: #eef3ff;
  color: #1f2a44;
  overflow: hidden;
}

.list-sidebar {
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #e6ebf5;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 18px 16px;
  border-bottom: 1px solid #eef2f8;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: #18243d;
  min-width: 0;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px 18px;
}

.sidebar-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.sidebar-item + .sidebar-item {
  margin-top: 10px;
}

.sidebar-item:hover {
  background: #f7f9ff;
  border-color: #dfe7fa;
}

.sidebar-item.active {
  background: #edf3ff;
  border-color: #d7e3ff;
  box-shadow: 0 10px 28px rgba(103, 126, 181, 0.12);
}

.sidebar-item-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f3f6fb;
  color: #98a3b6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-item-content {
  min-width: 0;
  flex: 1;
}

.sidebar-item-title {
  font-size: 13px;
  line-height: 1.55;
  font-weight: 700;
  color: #1f2a44;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.sidebar-item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.match-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  padding: 3px 7px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
}

.match-chip.score-high {
  background: #dcf7e5;
  color: #149655;
}

.match-chip.score-medium {
  background: #ffedc9;
  color: #c47a0b;
}

.match-chip.score-low {
  background: #e9eef7;
  color: #6f7b90;
}

.sidebar-item-budget {
  font-size: 12px;
  font-weight: 700;
  color: #15a05c;
}

.detail-panel {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 26px 34px 32px;
}

.detail-shell {
  max-width: 1024px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #7c8698;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.sidebar-back-btn {
  flex-shrink: 0;
}

.back-btn:hover {
  background: #edf3ff;
  color: #456bb5;
}

.hero-card,
.detail-card {
  background: #ffffff;
  border: 1px solid rgba(225, 231, 242, 0.9);
  border-radius: 18px;
  box-shadow: 0 14px 36px rgba(109, 127, 171, 0.08);
}

.hero-card {
  padding: 22px 26px 24px;
  margin-bottom: 16px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  background: #e9f7ec;
  color: #1d9d5c;
  font-size: 13px;
  font-weight: 700;
}

.hero-title {
  margin: 16px 0 0;
  font-size: 20px;
  line-height: 1.45;
  font-weight: 800;
  color: #1a2238;
}

.detail-card {
  padding: 22px 24px;
}

.detail-card + .detail-card {
  margin-top: 16px;
}

.section-title {
  margin: 0 0 18px;
  font-size: 16px;
  font-weight: 800;
  color: #1d2a44;
}

.basic-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 36px;
}

.basic-item {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  align-items: start;
  column-gap: 12px;
}

.basic-label {
  font-size: 14px;
  color: #98a2b3;
}

.basic-value {
  font-size: 14px;
  line-height: 1.7;
  color: #344054;
}

.basic-value-highlight {
  color: #4a91ff;
  font-weight: 700;
}

.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analysis-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 12px;
  background: #f7f9fc;
}

.analysis-item.matched {
  background: #edf8ef;
}

.analysis-icon {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: #dfe5ec;
  color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
}

.analysis-icon.checked {
  background: #12b351;
  color: #ffffff;
}

.analysis-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #556070;
}

.analysis-text strong {
  margin-right: 8px;
  color: #2e4d3f;
}

.advice-box {
  padding: 13px 16px;
  border-radius: 12px;
  background: #fff5df;
  color: #cb7a12;
  font-size: 14px;
  line-height: 1.8;
}

.summary-text {
  margin: 0;
  color: #4b5565;
  font-size: 14px;
  line-height: 1.9;
}

@media (max-width: 1080px) {
  .basic-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 900px) {
  .bid-list-detail-page {
    flex-direction: column;
    height: auto;
    min-height: 100%;
  }

  .list-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e6ebf5;
  }

  .sidebar-list {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 16px;
  }

  .sidebar-item,
  .sidebar-item + .sidebar-item {
    min-width: 268px;
    margin-top: 0;
  }

  .detail-panel {
    padding: 20px 16px 28px;
  }
}
</style>
