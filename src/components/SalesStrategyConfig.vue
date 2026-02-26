<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  Database,
  ShieldCheck,
  Bookmark,
  Lock,
  Globe2,
  Building2,
  Users,
  FileText,
  Search,
  Upload,
  UserPlus,
  Ban,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next';

type DataEntity = 'bidding-unit' | 'competitor' | 'bid-notice';

type DataSource = '内部沉淀' | '管理员导入' | '白名单采集' | '线索入库';
type Credibility = '高' | '中' | '低';
type RecordStatus = '有效' | '待核验' | '失效';

interface DataPoolRecord {
  id: string;
  entity: DataEntity;
  name: string;
  region: string;
  source: DataSource;
  credibility: Credibility;
  owner: string;
  updatedAt: string;
  daysAgo: number;
  status: RecordStatus;

  // 招标单位字段
  orgType?: string;
  industry?: string;
  projectCount90d?: number;
  budgetMedian?: number;
  purchaseCycle?: string;

  // 竞品字段
  advantage?: string;
  bidCount90d?: number;
  winCount90d?: number;
  winRate?: number;
  priceBand?: string;

  // 标讯字段
  category?: string;
  client?: string;
  budget?: number;
  deadline?: string;
  stage?: string;
  winProbability?: number;
}

interface LeadItem {
  id: string;
  type: DataEntity;
  name: string;
  desc: string;
  submitter: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: '高' | '中' | '低';
}

interface StrategyTemplate {
  id: string;
  name: string;
  scope: '系统模板' | '公开模板' | '个人模板';
  owner: string;
  status: '启用' | '下架';
  updatedAt: string;
  description: string;
  useCount: number;
}

interface PublishRequest {
  id: string;
  templateName: string;
  submitter: string;
  submittedAt: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const activeTab = ref<'data-center' | 'template-governance'>('data-center');
const activeEntity = ref<DataEntity>('bidding-unit');

const sourceCards = [
  { title: '内部沉淀', desc: '历史跟进/中标/丢单记录结构化抽取', level: '高可信' },
  { title: '白名单采集', desc: '固定口径数据源同步，字段统一清洗', level: '中高可信' },
  { title: '管理员导入', desc: '按模板校验后批量入库并分配负责人', level: '中可信' },
];

const records = ref<DataPoolRecord[]>([
  // 招标单位
  { id: 'bu1', entity: 'bidding-unit', name: '上海市大数据中心', region: '上海', source: '内部沉淀', credibility: '高', owner: '王小明', updatedAt: '2026-02-24', daysAgo: 1, status: '有效', orgType: '政府机关', industry: '数字政务', projectCount90d: 14, budgetMedian: 180, purchaseCycle: '季度集中采购' },
  { id: 'bu2', entity: 'bidding-unit', name: '浦东新区政务服务中心', region: '上海', source: '白名单采集', credibility: '高', owner: '李娜', updatedAt: '2026-02-22', daysAgo: 3, status: '有效', orgType: '政府机关', industry: '数字政务', projectCount90d: 11, budgetMedian: 135, purchaseCycle: '半年滚动采购' },
  { id: 'bu3', entity: 'bidding-unit', name: '浙江省交通厅', region: '浙江', source: '白名单采集', credibility: '中', owner: '陈亮', updatedAt: '2026-02-16', daysAgo: 9, status: '有效', orgType: '政府机关', industry: '交通运输', projectCount90d: 8, budgetMedian: 220, purchaseCycle: '按项目审批' },
  { id: 'bu4', entity: 'bidding-unit', name: '华东师范大学', region: '上海', source: '管理员导入', credibility: '中', owner: '赵峰', updatedAt: '2026-01-20', daysAgo: 36, status: '待核验', orgType: '教育机构', industry: '教育信息化', projectCount90d: 5, budgetMedian: 90, purchaseCycle: '学期采购' },
  { id: 'bu5', entity: 'bidding-unit', name: '中国工商银行上海分行', region: '上海', source: '内部沉淀', credibility: '高', owner: '王婷', updatedAt: '2026-02-19', daysAgo: 6, status: '有效', orgType: '金融机构', industry: '金融科技', projectCount90d: 7, budgetMedian: 260, purchaseCycle: '年度框架+专项' },
  { id: 'bu6', entity: 'bidding-unit', name: '南京市数据资源管理局', region: '江苏', source: '管理员导入', credibility: '中', owner: '孙杰', updatedAt: '2026-02-11', daysAgo: 14, status: '有效', orgType: '政府机关', industry: '数字政务', projectCount90d: 9, budgetMedian: 150, purchaseCycle: '季度集中采购' },
  { id: 'bu7', entity: 'bidding-unit', name: '苏州工业园区管委会', region: '江苏', source: '白名单采集', credibility: '中', owner: '高倩', updatedAt: '2026-01-18', daysAgo: 38, status: '待核验', orgType: '政府机关', industry: '产业园区', projectCount90d: 6, budgetMedian: 125, purchaseCycle: '按需采购' },
  { id: 'bu8', entity: 'bidding-unit', name: '上海电气集团', region: '上海', source: '内部沉淀', credibility: '高', owner: '刘畅', updatedAt: '2026-02-25', daysAgo: 0, status: '有效', orgType: '国有企业', industry: '工业制造', projectCount90d: 4, budgetMedian: 300, purchaseCycle: '年度预算制' },
  { id: 'bu9', entity: 'bidding-unit', name: '长宁区中心医院', region: '上海', source: '线索入库', credibility: '中', owner: '周敏', updatedAt: '2026-02-20', daysAgo: 5, status: '有效', orgType: '医疗机构', industry: '医疗卫生', projectCount90d: 5, budgetMedian: 78, purchaseCycle: '按项目审批' },
  { id: 'bu10', entity: 'bidding-unit', name: '浙江省公安厅', region: '浙江', source: '白名单采集', credibility: '高', owner: '王小明', updatedAt: '2026-02-09', daysAgo: 16, status: '有效', orgType: '政府机关', industry: '公共安全', projectCount90d: 10, budgetMedian: 245, purchaseCycle: '季度集中采购' },
  { id: 'bu11', entity: 'bidding-unit', name: '复旦大学信息化办公室', region: '上海', source: '管理员导入', credibility: '中', owner: '李娜', updatedAt: '2026-01-12', daysAgo: 44, status: '失效', orgType: '教育机构', industry: '教育信息化', projectCount90d: 3, budgetMedian: 70, purchaseCycle: '学期采购' },
  { id: 'bu12', entity: 'bidding-unit', name: '招商银行上海分行', region: '上海', source: '内部沉淀', credibility: '高', owner: '陈亮', updatedAt: '2026-02-18', daysAgo: 7, status: '有效', orgType: '金融机构', industry: '金融科技', projectCount90d: 6, budgetMedian: 210, purchaseCycle: '年度框架+专项' },

  // 竞品企业
  { id: 'cp1', entity: 'competitor', name: '华安信息技术有限公司', region: '北京', source: '内部沉淀', credibility: '高', owner: '王小明', updatedAt: '2026-02-24', daysAgo: 1, status: '有效', industry: '网络安全', advantage: '政务资源强', bidCount90d: 28, winCount90d: 12, winRate: 42.9, priceBand: '中高价' },
  { id: 'cp2', entity: 'competitor', name: '中科安全科技股份', region: '北京', source: '白名单采集', credibility: '高', owner: '李娜', updatedAt: '2026-02-21', daysAgo: 4, status: '有效', industry: '网络安全', advantage: '数据安全强', bidCount90d: 22, winCount90d: 8, winRate: 36.4, priceBand: '中高价' },
  { id: 'cp3', entity: 'competitor', name: '启明星辰科技', region: '北京', source: '内部沉淀', credibility: '中', owner: '陈亮', updatedAt: '2026-02-18', daysAgo: 7, status: '有效', industry: '网络安全', advantage: '品牌知名度高', bidCount90d: 19, winCount90d: 6, winRate: 31.6, priceBand: '中高价' },
  { id: 'cp4', entity: 'competitor', name: '绿盟科技集团', region: '北京', source: '白名单采集', credibility: '中', owner: '赵峰', updatedAt: '2026-01-30', daysAgo: 26, status: '有效', industry: '网络安全', advantage: '运维体系成熟', bidCount90d: 16, winCount90d: 5, winRate: 31.3, priceBand: '中价' },
  { id: 'cp5', entity: 'competitor', name: '奇安信科技集团', region: '北京', source: '白名单采集', credibility: '高', owner: '王婷', updatedAt: '2026-02-15', daysAgo: 10, status: '有效', industry: '网络安全', advantage: '大型项目经验丰富', bidCount90d: 24, winCount90d: 9, winRate: 37.5, priceBand: '高价' },
  { id: 'cp6', entity: 'competitor', name: '知道创宇科技', region: '北京', source: '管理员导入', credibility: '中', owner: '孙杰', updatedAt: '2026-02-08', daysAgo: 17, status: '待核验', industry: '网络安全', advantage: '攻防能力强', bidCount90d: 11, winCount90d: 3, winRate: 27.3, priceBand: '中价' },
  { id: 'cp7', entity: 'competitor', name: '长亭科技有限公司', region: '北京', source: '线索入库', credibility: '中', owner: '高倩', updatedAt: '2026-02-23', daysAgo: 2, status: '待核验', industry: '网络安全', advantage: '云原生安全', bidCount90d: 9, winCount90d: 2, winRate: 22.2, priceBand: '中价' },
  { id: 'cp8', entity: 'competitor', name: '深信服科技股份', region: '广东', source: '内部沉淀', credibility: '高', owner: '刘畅', updatedAt: '2026-02-22', daysAgo: 3, status: '有效', industry: '网络安全', advantage: '产品化能力强', bidCount90d: 21, winCount90d: 8, winRate: 38.1, priceBand: '中高价' },
  { id: 'cp9', entity: 'competitor', name: '安天科技集团', region: '黑龙江', source: '管理员导入', credibility: '低', owner: '周敏', updatedAt: '2026-01-16', daysAgo: 40, status: '失效', industry: '威胁情报', advantage: '情报能力强', bidCount90d: 6, winCount90d: 1, winRate: 16.7, priceBand: '中价' },
  { id: 'cp10', entity: 'competitor', name: '亚信安全科技', region: '北京', source: '白名单采集', credibility: '中', owner: '王小明', updatedAt: '2026-02-20', daysAgo: 5, status: '有效', industry: '网络安全', advantage: '行业解决方案完整', bidCount90d: 14, winCount90d: 4, winRate: 28.6, priceBand: '中高价' },

  // 关注标讯
  { id: 'bn1', entity: 'bid-notice', name: '某证券公司网络安全态势感知平台', region: '上海', source: '内部沉淀', credibility: '高', owner: '王小明', updatedAt: '2026-02-24', daysAgo: 1, status: '有效', category: '态势感知', client: '上海证券交易所', budget: 280, deadline: '2026-03-01', stage: '重点跟进', winProbability: 72 },
  { id: 'bn2', entity: 'bid-notice', name: '某省交通厅网络安全等保测评', region: '浙江', source: '白名单采集', credibility: '高', owner: '李娜', updatedAt: '2026-02-23', daysAgo: 2, status: '有效', category: '等保测评', client: '浙江省交通厅', budget: 220, deadline: '2026-03-15', stage: '资格审查', winProbability: 61 },
  { id: 'bn3', entity: 'bid-notice', name: '某高校校园网安全加固项目', region: '上海', source: '管理员导入', credibility: '中', owner: '陈亮', updatedAt: '2026-02-19', daysAgo: 6, status: '有效', category: '安全加固', client: '华东师范大学', budget: 85, deadline: '2026-03-20', stage: '待评估', winProbability: 43 },
  { id: 'bn4', entity: 'bid-notice', name: '某银行数据中心安全评估', region: '上海', source: '白名单采集', credibility: '中', owner: '赵峰', updatedAt: '2026-02-16', daysAgo: 9, status: '有效', category: '安全评估', client: '兴业银行上海分行', budget: 160, deadline: '2026-04-01', stage: '方案准备', winProbability: 55 },
  { id: 'bn5', entity: 'bid-notice', name: '某市应急管理局态势感知建设', region: '上海', source: '白名单采集', credibility: '高', owner: '王婷', updatedAt: '2026-02-21', daysAgo: 4, status: '有效', category: '态势感知', client: '上海市应急管理局', budget: 300, deadline: '2026-04-10', stage: '重点跟进', winProbability: 67 },
  { id: 'bn6', entity: 'bid-notice', name: '某区医院信息安全运维服务', region: '上海', source: '线索入库', credibility: '中', owner: '孙杰', updatedAt: '2026-02-25', daysAgo: 0, status: '待核验', category: '安全运维', client: '长宁区中心医院', budget: 75, deadline: '2026-03-25', stage: '待评估', winProbability: 38 },
  { id: 'bn7', entity: 'bid-notice', name: '某国企工控安全检测项目', region: '上海', source: '白名单采集', credibility: '中', owner: '高倩', updatedAt: '2026-02-15', daysAgo: 10, status: '有效', category: '工控安全', client: '上海电气集团', budget: 250, deadline: '2026-04-15', stage: '资格审查', winProbability: 58 },
  { id: 'bn8', entity: 'bid-notice', name: '某区政务云安全监测平台建设', region: '上海', source: '内部沉淀', credibility: '高', owner: '刘畅', updatedAt: '2026-02-12', daysAgo: 13, status: '有效', category: '安全监测', client: '静安区大数据中心', budget: 180, deadline: '2026-03-10', stage: '重点跟进', winProbability: 69 },
  { id: 'bn9', entity: 'bid-notice', name: '某省公安厅数据安全治理项目', region: '浙江', source: '管理员导入', credibility: '中', owner: '周敏', updatedAt: '2026-01-14', daysAgo: 42, status: '失效', category: '数据安全', client: '浙江省公安厅', budget: 320, deadline: '2026-02-20', stage: '已结束', winProbability: 0 },
  { id: 'bn10', entity: 'bid-notice', name: '某金融机构渗透测试服务采购', region: '上海', source: '白名单采集', credibility: '中', owner: '王小明', updatedAt: '2026-02-18', daysAgo: 7, status: '有效', category: '渗透测试', client: '交通银行上海分行', budget: 120, deadline: '2026-02-25', stage: '待开标', winProbability: 49 },
]);

const leadQueue = ref<LeadItem[]>([
  { id: 'lead1', type: 'bidding-unit', name: '杭州市数据资源管理局', desc: '政府机关 · 浙江 · 数字政务', submitter: '张宇', submittedAt: '2026-02-25 10:12', status: 'pending', priority: '高' },
  { id: 'lead2', type: 'competitor', name: '微步在线科技', desc: '威胁情报 · 北京', submitter: '刘晓', submittedAt: '2026-02-25 09:35', status: 'pending', priority: '中' },
  { id: 'lead3', type: 'bid-notice', name: '某市教育局数据安全治理项目', desc: '上海市教育局 · 150万 · 截止 2026-03-12', submitter: '周敏', submittedAt: '2026-02-24 17:40', status: 'pending', priority: '高' },
  { id: 'lead4', type: 'bid-notice', name: '某央企网络安全运维服务采购', desc: '中国石化上海分公司 · 200万 · 截止 2026-03-05', submitter: '孙杰', submittedAt: '2026-02-24 15:20', status: 'pending', priority: '中' },
]);

const templateFilter = ref<'all' | 'system' | 'public'>('all');
const templates = ref<StrategyTemplate[]>([
  { id: 'tpl1', name: '保守投标策略', scope: '系统模板', owner: '管理员', status: '启用', updatedAt: '2026-02-23', description: '优先高匹配高胜率项目，控制投标风险。', useCount: 86 },
  { id: 'tpl2', name: '高毛利优先策略', scope: '系统模板', owner: '管理员', status: '启用', updatedAt: '2026-02-20', description: '优先预算较高且竞争强度中等项目。', useCount: 64 },
  { id: 'tpl3', name: '华东区域突破策略', scope: '公开模板', owner: '陈亮', status: '启用', updatedAt: '2026-02-21', description: '聚焦华东区域政企客户，强化在地服务优势。', useCount: 39 },
  { id: 'tpl4', name: '竞品拦截策略', scope: '公开模板', owner: '周敏', status: '下架', updatedAt: '2026-02-16', description: '针对头部竞品定向制定价格与技术应对策略。', useCount: 18 },
]);

const publishQueue = ref<PublishRequest[]>([
  { id: 'pub1', templateName: '医疗行业深耕策略', submitter: '王婷', submittedAt: '2026-02-25 11:05', reason: '医疗行业项目命中率提升，希望全员复用。', status: 'pending' },
  { id: 'pub2', templateName: '老客户续标防守策略', submitter: '赵峰', submittedAt: '2026-02-24 16:40', reason: '续标季可快速筛选重点客户并缩短准备周期。', status: 'pending' },
]);

const searchKeyword = ref('');
const sourceFilter = ref<'all' | DataSource>('all');
const credibilityFilter = ref<'all' | Credibility>('all');
const statusFilter = ref<'all' | RecordStatus>('all');
const regionFilter = ref<'all' | string>('all');
const ownerFilter = ref<'all' | string>('all');
const selectedIds = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(8);

const currentEntityLabel = computed(() => {
  return {
    'bidding-unit': '招标单位',
    competitor: '竞品企业',
    'bid-notice': '关注标讯',
  }[activeEntity.value];
});

const entityRecords = computed(() => records.value.filter((item) => item.entity === activeEntity.value));

const regionOptions = computed(() => {
  return Array.from(new Set(entityRecords.value.map((item) => item.region))).sort();
});

const ownerOptions = computed(() => {
  return Array.from(new Set(entityRecords.value.map((item) => item.owner))).sort();
});

const filteredRecords = computed(() => {
  return entityRecords.value.filter((item) => {
    const keyword = searchKeyword.value.trim().toLowerCase();
    const matchKeyword =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.region.toLowerCase().includes(keyword) ||
      item.owner.toLowerCase().includes(keyword) ||
      (item.client?.toLowerCase().includes(keyword) ?? false);

    const matchSource = sourceFilter.value === 'all' || item.source === sourceFilter.value;
    const matchCredibility = credibilityFilter.value === 'all' || item.credibility === credibilityFilter.value;
    const matchStatus = statusFilter.value === 'all' || item.status === statusFilter.value;
    const matchRegion = regionFilter.value === 'all' || item.region === regionFilter.value;
    const matchOwner = ownerFilter.value === 'all' || item.owner === ownerFilter.value;

    return matchKeyword && matchSource && matchCredibility && matchStatus && matchRegion && matchOwner;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / pageSize.value)));

const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRecords.value.slice(start, start + pageSize.value);
});

const pageRangeText = computed(() => {
  const total = filteredRecords.value.length;
  if (total === 0) return '0 / 0';
  const start = (currentPage.value - 1) * pageSize.value + 1;
  const end = Math.min(currentPage.value * pageSize.value, total);
  return `${start}-${end} / ${total}`;
});

const currentPageIds = computed(() => pagedRecords.value.map((item) => item.id));

const allPageSelected = computed(() => {
  if (!currentPageIds.value.length) return false;
  return currentPageIds.value.every((id) => selectedIds.value.includes(id));
});

const poolStats = computed(() => ({
  biddingUnits: records.value.filter((item) => item.entity === 'bidding-unit').length,
  competitors: records.value.filter((item) => item.entity === 'competitor').length,
  bidNotices: records.value.filter((item) => item.entity === 'bid-notice').length,
  stale: records.value.filter((item) => item.daysAgo > 30 && item.status !== '失效').length,
  owners: new Set(records.value.map((item) => item.owner)).size,
}));

const pendingLeads = computed(() => leadQueue.value.filter((item) => item.status === 'pending'));

const leadPendingByType = computed(() => ({
  biddingUnit: pendingLeads.value.filter((item) => item.type === 'bidding-unit').length,
  competitor: pendingLeads.value.filter((item) => item.type === 'competitor').length,
  bidNotice: pendingLeads.value.filter((item) => item.type === 'bid-notice').length,
}));

const filteredTemplates = computed(() => {
  if (templateFilter.value === 'all') return templates.value;
  if (templateFilter.value === 'system') return templates.value.filter((item) => item.scope === '系统模板');
  return templates.value.filter((item) => item.scope === '公开模板');
});

const pendingPublish = computed(() => publishQueue.value.filter((item) => item.status === 'pending'));

watch(
  [activeEntity, searchKeyword, sourceFilter, credibilityFilter, statusFilter, regionFilter, ownerFilter, pageSize],
  () => {
    currentPage.value = 1;
    selectedIds.value = [];
  }
);

watch(totalPages, (value) => {
  if (currentPage.value > value) currentPage.value = value;
});

const getSourceClass = (source: DataSource) => {
  return {
    '内部沉淀': 'source-internal',
    '白名单采集': 'source-whitelist',
    '管理员导入': 'source-admin',
    '线索入库': 'source-lead',
  }[source];
};

const getCredibilityClass = (level: Credibility) => {
  return {
    高: 'cred-high',
    中: 'cred-medium',
    低: 'cred-low',
  }[level];
};

const getStatusClass = (status: RecordStatus) => {
  return {
    有效: 'status-valid',
    待核验: 'status-pending',
    失效: 'status-invalid',
  }[status];
};

const getTypeLabel = (type: DataEntity) => {
  return {
    'bidding-unit': '招标单位',
    competitor: '竞品企业',
    'bid-notice': '关注标讯',
  }[type];
};

const formatCategory = (item: DataPoolRecord) => {
  if (item.entity === 'bidding-unit') {
    return `${item.orgType ?? '-'} · ${item.industry ?? '-'}`;
  }
  if (item.entity === 'competitor') {
    return `${item.industry ?? '-'} · ${item.advantage ?? '-'}`;
  }
  return `${item.category ?? '-'} · ${item.client ?? '-'}`;
};

const formatCoreMetric = (item: DataPoolRecord) => {
  if (item.entity === 'bidding-unit') {
    return `近90天项目 ${item.projectCount90d ?? 0} / 预算中位 ${item.budgetMedian ?? 0}万 / ${item.purchaseCycle ?? '-'}`;
  }
  if (item.entity === 'competitor') {
    return `投标 ${item.bidCount90d ?? 0} 次 / 中标 ${item.winCount90d ?? 0} 次 / 中标率 ${item.winRate ?? 0}% / ${item.priceBand ?? '-'}`;
  }
  return `预算 ${item.budget ?? 0}万 / 截止 ${item.deadline ?? '-'} / 赢单概率 ${item.winProbability ?? 0}% / ${item.stage ?? '-'}`;
};

const togglePageSelection = () => {
  if (allPageSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !currentPageIds.value.includes(id));
    return;
  }
  const merged = new Set([...selectedIds.value, ...currentPageIds.value]);
  selectedIds.value = Array.from(merged);
};

const toggleRowSelection = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((item) => item !== id);
    return;
  }
  selectedIds.value.push(id);
};

const batchAssignOwner = () => {
  if (!selectedIds.value.length) {
    alert('请先选择至少一条记录');
    return;
  }
  const owner = prompt('请输入要指派的负责人：');
  if (!owner) return;
  records.value = records.value.map((item) => {
    if (!selectedIds.value.includes(item.id)) return item;
    return { ...item, owner, updatedAt: '2026-02-25', daysAgo: 0 };
  });
  selectedIds.value = [];
};

const batchMarkInvalid = () => {
  if (!selectedIds.value.length) {
    alert('请先选择至少一条记录');
    return;
  }
  records.value = records.value.map((item) => {
    if (!selectedIds.value.includes(item.id)) return item;
    return { ...item, status: '失效', updatedAt: '2026-02-25', daysAgo: 0 };
  });
  selectedIds.value = [];
};

const toggleRecordStatus = (item: DataPoolRecord) => {
  item.status = item.status === '有效' ? '待核验' : item.status === '待核验' ? '失效' : '有效';
  item.updatedAt = '2026-02-25';
  item.daysAgo = 0;
};

const approveLead = (lead: LeadItem) => {
  if (lead.status !== 'pending') return;
  lead.status = 'approved';

  const baseRecord: DataPoolRecord = {
    id: `${lead.type}-${Date.now()}`,
    entity: lead.type,
    name: lead.name,
    region: '待补充',
    source: '线索入库',
    credibility: '中',
    owner: '待分配',
    updatedAt: '2026-02-25',
    daysAgo: 0,
    status: '待核验',
  };

  if (lead.type === 'bidding-unit') {
    records.value.unshift({
      ...baseRecord,
      orgType: '待补充',
      industry: '待补充',
      projectCount90d: 0,
      budgetMedian: 0,
      purchaseCycle: '待补充',
    });
    return;
  }

  if (lead.type === 'competitor') {
    records.value.unshift({
      ...baseRecord,
      industry: '待补充',
      advantage: '待补充',
      bidCount90d: 0,
      winCount90d: 0,
      winRate: 0,
      priceBand: '待补充',
    });
    return;
  }

  records.value.unshift({
    ...baseRecord,
    category: '待补充',
    client: '待补充',
    budget: 0,
    deadline: '待补充',
    stage: '待评估',
    winProbability: 0,
  });
};

const rejectLead = (lead: LeadItem) => {
  if (lead.status !== 'pending') return;
  lead.status = 'rejected';
};

const toggleTemplateStatus = (item: StrategyTemplate) => {
  item.status = item.status === '启用' ? '下架' : '启用';
  item.updatedAt = '2026-02-25';
};

const approvePublish = (request: PublishRequest) => {
  if (request.status !== 'pending') return;
  request.status = 'approved';
  templates.value.unshift({
    id: `tpl-${Date.now()}`,
    name: request.templateName,
    scope: '公开模板',
    owner: request.submitter,
    status: '启用',
    updatedAt: '2026-02-25',
    description: request.reason,
    useCount: 0,
  });
};

const rejectPublish = (request: PublishRequest) => {
  if (request.status !== 'pending') return;
  request.status = 'rejected';
};

const handleSave = () => {
  alert('治理配置已保存（Demo）');
};
</script>

<template>
  <div class="strategy-governance-page">
    <div class="content-header">
      <div class="header-icon">
        <Database :size="22" />
      </div>
      <div>
        <h1 class="page-title">销售策略治理</h1>
        <p class="page-subtitle">面向百人团队的策略数据池管理：统一数据口径、批量治理、可追溯审核</p>
      </div>
    </div>

    <div class="tabs">
      <button :class="['tab-btn', { active: activeTab === 'data-center' }]" @click="activeTab = 'data-center'">
        <ShieldCheck :size="14" />
        数据入库中心
      </button>
      <button :class="['tab-btn', { active: activeTab === 'template-governance' }]" @click="activeTab = 'template-governance'">
        <Bookmark :size="14" />
        策略模板治理
      </button>
    </div>

    <div v-if="activeTab === 'data-center'" class="content-card">
      <div class="rule-banner">
        <Lock :size="15" />
        仅允许团队数据池检索，不开放公网实时搜索。新增数据统一进入审核队列，审核后入库。
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">招标单位库</div>
          <div class="stat-value">{{ poolStats.biddingUnits }}</div>
          <div class="stat-desc">覆盖重点甲方与采购单位</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">竞品企业库</div>
          <div class="stat-value">{{ poolStats.competitors }}</div>
          <div class="stat-desc">沉淀核心竞品画像</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">关注标讯库</div>
          <div class="stat-value">{{ poolStats.bidNotices }}</div>
          <div class="stat-desc">跟踪项目与阶段信息</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">30天未更新</div>
          <div class="stat-value">{{ poolStats.stale }}</div>
          <div class="stat-desc">建议优先复核</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">数据负责人</div>
          <div class="stat-value">{{ poolStats.owners }}</div>
          <div class="stat-desc">当前维护成员数量</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">待审核线索</div>
          <div class="stat-value">{{ pendingLeads.length }}</div>
          <div class="stat-desc">新线索待入库处理</div>
        </div>
      </div>

      <div class="source-grid">
        <div v-for="item in sourceCards" :key="item.title" class="source-card">
          <div class="source-card-title">{{ item.title }}</div>
          <div class="source-card-desc">{{ item.desc }}</div>
          <div class="source-card-level">{{ item.level }}</div>
        </div>
      </div>

      <div class="toolbar-card">
        <div class="entity-switch">
          <button :class="['entity-btn', { active: activeEntity === 'bidding-unit' }]" @click="activeEntity = 'bidding-unit'">招标单位</button>
          <button :class="['entity-btn', { active: activeEntity === 'competitor' }]" @click="activeEntity = 'competitor'">竞品企业</button>
          <button :class="['entity-btn', { active: activeEntity === 'bid-notice' }]" @click="activeEntity = 'bid-notice'">关注标讯</button>
        </div>

        <div class="search-box">
          <Search :size="14" />
          <input v-model="searchKeyword" type="text" :placeholder="`搜索${currentEntityLabel}名称、区域、负责人...`" />
        </div>

        <div class="filter-row">
          <select v-model="sourceFilter">
            <option value="all">全部来源</option>
            <option value="内部沉淀">内部沉淀</option>
            <option value="白名单采集">白名单采集</option>
            <option value="管理员导入">管理员导入</option>
            <option value="线索入库">线索入库</option>
          </select>
          <select v-model="credibilityFilter">
            <option value="all">全部可信度</option>
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
          <select v-model="statusFilter">
            <option value="all">全部状态</option>
            <option value="有效">有效</option>
            <option value="待核验">待核验</option>
            <option value="失效">失效</option>
          </select>
          <select v-model="regionFilter">
            <option value="all">全部区域</option>
            <option v-for="region in regionOptions" :key="region" :value="region">{{ region }}</option>
          </select>
          <select v-model="ownerFilter">
            <option value="all">全部负责人</option>
            <option v-for="owner in ownerOptions" :key="owner" :value="owner">{{ owner }}</option>
          </select>
        </div>

        <div class="action-row">
          <button class="tool-btn">
            <Upload :size="13" />
            批量导入
          </button>
          <button class="tool-btn" @click="batchAssignOwner">
            <UserPlus :size="13" />
            批量指派负责人
          </button>
          <button class="tool-btn danger" @click="batchMarkInvalid">
            <Ban :size="13" />
            批量标记失效
          </button>
        </div>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th class="th-checkbox">
                <input type="checkbox" :checked="allPageSelected" @change="togglePageSelection" />
              </th>
              <th>名称</th>
              <th>分类/画像</th>
              <th>区域</th>
              <th>核心指标</th>
              <th>来源/可信度</th>
              <th>负责人</th>
              <th>更新时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pagedRecords" :key="item.id">
              <td>
                <input type="checkbox" :checked="selectedIds.includes(item.id)" @change="toggleRowSelection(item.id)" />
              </td>
              <td>
                <div class="name-cell">{{ item.name }}</div>
              </td>
              <td>{{ formatCategory(item) }}</td>
              <td>{{ item.region }}</td>
              <td>{{ formatCoreMetric(item) }}</td>
              <td>
                <div class="meta-stack">
                  <span :class="['source-tag', getSourceClass(item.source)]">{{ item.source }}</span>
                  <span :class="['cred-tag', getCredibilityClass(item.credibility)]">可信度 {{ item.credibility }}</span>
                </div>
              </td>
              <td>{{ item.owner }}</td>
              <td>
                <div class="meta-stack">
                  <span>{{ item.updatedAt }}</span>
                  <span class="days-ago">{{ item.daysAgo }}天前</span>
                </div>
              </td>
              <td>
                <span :class="['status-tag', getStatusClass(item.status)]">{{ item.status }}</span>
              </td>
              <td>
                <button class="mini-btn" @click="toggleRecordStatus(item)">切换状态</button>
              </td>
            </tr>
            <tr v-if="!pagedRecords.length">
              <td colspan="10" class="empty-cell">当前筛选条件下无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-row">
        <div class="left">已选择 {{ selectedIds.length }} 条</div>
        <div class="right">
          <select v-model.number="pageSize">
            <option :value="8">8 / 页</option>
            <option :value="12">12 / 页</option>
            <option :value="20">20 / 页</option>
          </select>
          <span>{{ pageRangeText }}</span>
          <button :disabled="currentPage <= 1" @click="currentPage -= 1"><ChevronLeft :size="14" /></button>
          <button :disabled="currentPage >= totalPages" @click="currentPage += 1"><ChevronRight :size="14" /></button>
        </div>
      </div>

      <section class="review-section">
        <div class="review-header">
          <h3>线索审核队列</h3>
          <div class="queue-badges">
            <span>招标单位 {{ leadPendingByType.biddingUnit }}</span>
            <span>竞品企业 {{ leadPendingByType.competitor }}</span>
            <span>关注标讯 {{ leadPendingByType.bidNotice }}</span>
          </div>
        </div>

        <div class="review-list">
          <div v-for="lead in leadQueue" :key="lead.id" class="review-item">
            <div class="review-main">
              <div class="review-title-row">
                <span class="review-type">{{ getTypeLabel(lead.type) }}</span>
                <span class="review-name">{{ lead.name }}</span>
                <span class="priority">优先级 {{ lead.priority }}</span>
              </div>
              <div class="review-desc">{{ lead.desc }}</div>
              <div class="review-meta">提交人：{{ lead.submitter }} · {{ lead.submittedAt }}</div>
            </div>
            <div class="review-actions">
              <button v-if="lead.status === 'pending'" class="action-btn approve" @click="approveLead(lead)">
                <CheckCircle2 :size="14" />
                入库
              </button>
              <button v-if="lead.status === 'pending'" class="action-btn reject" @click="rejectLead(lead)">
                <XCircle :size="14" />
                驳回
              </button>
              <span v-if="lead.status === 'approved'" class="result approved">已入库</span>
              <span v-if="lead.status === 'rejected'" class="result rejected">已驳回</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="content-card">
      <div class="rule-banner">
        <Globe2 :size="15" />
        模板共享采用“可见可复制，不可直接改原版”，避免多人并发编辑冲突。
      </div>

      <div class="template-toolbar">
        <div class="filter-group">
          <button :class="['filter-btn', { active: templateFilter === 'all' }]" @click="templateFilter = 'all'">全部</button>
          <button :class="['filter-btn', { active: templateFilter === 'system' }]" @click="templateFilter = 'system'">系统模板</button>
          <button :class="['filter-btn', { active: templateFilter === 'public' }]" @click="templateFilter = 'public'">公开模板</button>
        </div>
        <button class="save-btn" @click="handleSave">保存治理规则</button>
      </div>

      <div class="template-list">
        <div v-for="item in filteredTemplates" :key="item.id" class="template-item">
          <div class="template-main">
            <div class="template-title-row">
              <span class="template-name">{{ item.name }}</span>
              <span class="scope-tag">{{ item.scope }}</span>
              <span :class="['status-tag', item.status === '启用' ? 'status-valid' : 'status-invalid']">{{ item.status }}</span>
            </div>
            <div class="template-desc">{{ item.description }}</div>
            <div class="template-meta">维护人：{{ item.owner }} · 更新时间：{{ item.updatedAt }} · 使用次数：{{ item.useCount }}</div>
          </div>
          <button class="mini-btn" @click="toggleTemplateStatus(item)">{{ item.status === '启用' ? '下架' : '启用' }}</button>
        </div>
      </div>

      <section class="review-section">
        <div class="review-header">
          <h3>公开模板审核队列</h3>
          <span>待审核 {{ pendingPublish.length }} 条</span>
        </div>
        <div class="review-list">
          <div v-for="item in publishQueue" :key="item.id" class="review-item">
            <div class="review-main">
              <div class="review-title-row">
                <span class="review-type">公开申请</span>
                <span class="review-name">{{ item.templateName }}</span>
              </div>
              <div class="review-desc">{{ item.reason }}</div>
              <div class="review-meta">申请人：{{ item.submitter }} · {{ item.submittedAt }}</div>
            </div>
            <div class="review-actions">
              <button v-if="item.status === 'pending'" class="action-btn approve" @click="approvePublish(item)">
                <CheckCircle2 :size="14" />
                通过
              </button>
              <button v-if="item.status === 'pending'" class="action-btn reject" @click="rejectPublish(item)">
                <XCircle :size="14" />
                拒绝
              </button>
              <span v-if="item.status === 'approved'" class="result approved">已通过</span>
              <span v-if="item.status === 'rejected'" class="result rejected">已拒绝</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="footer-actions">
      <button class="save-btn" @click="handleSave">保存当前设置</button>
    </div>
  </div>
</template>

<style scoped>
.strategy-governance-page {
  width: 100%;
  max-width: 1220px;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  flex-shrink: 0;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.page-subtitle {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.tab-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
}

.content-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
}

.rule-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  font-size: 12px;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.stat-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  background: #f8fafc;
}

.stat-card.warning {
  background: #fff7ed;
  border-color: #fdba74;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.stat-value {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.stat-desc {
  margin-top: 2px;
  font-size: 11px;
  color: #94a3b8;
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.source-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  background: #f8fafc;
}

.source-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.source-card-desc {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.source-card-level {
  margin-top: 6px;
  font-size: 11px;
  color: #2563eb;
}

.toolbar-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  background: #fcfdff;
  margin-bottom: 10px;
}

.entity-switch {
  display: inline-flex;
  gap: 6px;
  margin-bottom: 10px;
}

.entity-btn {
  border: 1px solid #dbe1ea;
  background: #fff;
  color: #475569;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.entity-btn.active {
  border-color: #3b82f6;
  color: #1d4ed8;
  background: #eff6ff;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 10px;
  background: #fff;
}

.search-box input {
  border: none;
  outline: none;
  font-size: 12px;
  color: #1e293b;
  width: 100%;
}

.filter-row,
.action-row {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-row select,
.pagination-row select {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  color: #334155;
  background: #fff;
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.tool-btn.danger {
  border-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.table-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow-x: auto;
  background: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1240px;
}

thead th {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
  font-size: 12px;
  text-align: left;
  padding: 10px 8px;
  white-space: nowrap;
}

tbody td {
  border-bottom: 1px solid #f1f5f9;
  padding: 9px 8px;
  color: #334155;
  font-size: 12px;
  vertical-align: top;
}

.name-cell {
  font-weight: 600;
  color: #0f172a;
}

.meta-stack {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.days-ago {
  color: #94a3b8;
  font-size: 11px;
}

.source-tag,
.cred-tag,
.status-tag,
.scope-tag,
.review-type,
.priority {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  width: fit-content;
}

.source-internal {
  background: #dcfce7;
  color: #166534;
}

.source-whitelist {
  background: #e0f2fe;
  color: #0c4a6e;
}

.source-admin {
  background: #fef3c7;
  color: #92400e;
}

.source-lead {
  background: #f3e8ff;
  color: #6b21a8;
}

.cred-high {
  background: #dcfce7;
  color: #166534;
}

.cred-medium {
  background: #fef3c7;
  color: #92400e;
}

.cred-low {
  background: #fee2e2;
  color: #991b1b;
}

.status-valid {
  background: #dcfce7;
  color: #166534;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-invalid {
  background: #fee2e2;
  color: #991b1b;
}

.mini-btn,
.save-btn,
.action-btn {
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 6px;
  padding: 5px 9px;
  font-size: 12px;
  cursor: pointer;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.action-btn.approve {
  border-color: #bbf7d0;
  background: #dcfce7;
  color: #166534;
}

.action-btn.reject {
  border-color: #fecaca;
  background: #fee2e2;
  color: #991b1b;
}

.empty-cell {
  text-align: center;
  color: #94a3b8;
  padding: 18px 8px;
}

.pagination-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.pagination-row .right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-row button {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #334155;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pagination-row button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.review-section {
  margin-top: 14px;
  border-top: 1px solid #f1f5f9;
  padding-top: 14px;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.review-header h3 {
  margin: 0;
  font-size: 14px;
  color: #1e293b;
}

.queue-badges {
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
}

.queue-badges span {
  font-size: 11px;
  color: #475569;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 3px 8px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.review-main {
  min-width: 0;
}

.review-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.review-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.review-desc {
  margin-top: 3px;
  font-size: 12px;
  color: #64748b;
}

.review-meta,
.template-meta {
  margin-top: 4px;
  font-size: 11px;
  color: #94a3b8;
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.result {
  font-size: 12px;
  font-weight: 600;
}

.result.approved {
  color: #166534;
}

.result.rejected {
  color: #991b1b;
}

.template-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.filter-group {
  display: inline-flex;
  gap: 6px;
}

.filter-btn {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.filter-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.template-main {
  min-width: 0;
}

.template-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.template-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.template-desc {
  margin-top: 3px;
  font-size: 12px;
  color: #64748b;
}

.footer-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .stats-grid,
  .source-grid {
    grid-template-columns: 1fr;
  }

  .review-item,
  .template-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .review-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
