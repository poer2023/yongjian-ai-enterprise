<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, SlidersHorizontal } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';

type ArchiveSortField = 'date' | 'deadline' | 'budgetAmount';
type FilterOption = {
  value: string;
  label: string;
};

type SortDirection = 'asc' | 'desc';

type SearchResult = {
  id: string;
  title: string;
  publisher: string;
  date: string;
  deadline?: string;
  budget?: string;
  budgetAmount?: number;
  region?: string;
  matchScore?: number;
  summary?: string;
  group?: string;
};

const router = useRouter();
const route = useRoute();

const isSubscriptionResults = computed(() => route.query.source === 'subscription');

const subscriptionSearchLabel = computed(() => {
  const group = String(route.query.group ?? 'security');

  if (group === 'dengbao') {
    return '等保测评';
  }

  return '网络安全';
});

const searchQuery = ref(isSubscriptionResults.value ? subscriptionSearchLabel.value : '数据安全评估');
const activeInfoType = ref('all');
const activeRegion = ref('all');
const activeTimeRange = ref('all');
const activeSearchMode = ref('exact');
const activePublishTime = ref('all');
const activeDeadline = ref('all');
const activeBudget = ref('all');
const activeSubscriptionRegion = ref('all');
const activeSubscriptionGroup = ref(String(route.query.group ?? 'security'));
const activeMatchScore = ref('all');
const archiveKeyword = ref('');
const archiveCurrentPage = ref(1);
const archivePageSize = ref(20);
const archiveJumpPage = ref('1');
const activeArchiveSortField = ref<ArchiveSortField>('date');
const activeArchiveSortDirection = ref<SortDirection>('desc');
const showArchiveRegionDropdown = ref(false);
const isRegionCollapsed = ref(false);

const infoTypes: FilterOption[] = [
  { value: 'all', label: '全部' },
  { value: 'tender', label: '招标公告' },
  { value: 'preview', label: '招标预告' },
  { value: 'change', label: '变更公告' },
  { value: 'result', label: '中标公告' },
  { value: 'purchase', label: '采购公告' },
  { value: 'waste', label: '废标公告' },
];

const regions: FilterOption[] = [
  { value: 'all', label: '全国' },
  { value: 'beijing', label: '北京' },
  { value: 'tianjin', label: '天津' },
  { value: 'shanghai', label: '上海' },
  { value: 'chongqing', label: '重庆' },
  { value: 'hebei', label: '河北' },
  { value: 'shanxi', label: '山西' },
  { value: 'liaoning', label: '辽宁' },
  { value: 'jilin', label: '吉林' },
  { value: 'heilongjiang', label: '黑龙江' },
  { value: 'jiangsu', label: '江苏' },
  { value: 'zhejiang', label: '浙江' },
  { value: 'anhui', label: '安徽' },
  { value: 'fujian', label: '福建' },
  { value: 'jiangxi', label: '江西' },
  { value: 'shandong', label: '山东' },
  { value: 'henan', label: '河南' },
  { value: 'hubei', label: '湖北' },
  { value: 'hunan', label: '湖南' },
  { value: 'guangdong', label: '广东' },
  { value: 'hainan', label: '海南' },
  { value: 'sichuan', label: '四川' },
  { value: 'guizhou', label: '贵州' },
  { value: 'yunnan', label: '云南' },
  { value: 'shaanxi', label: '陕西' },
  { value: 'gansu', label: '甘肃' },
  { value: 'qinghai', label: '青海' },
  { value: 'guangxi', label: '广西' },
  { value: 'xizang', label: '西藏' },
  { value: 'ningxia', label: '宁夏' },
  { value: 'xinjiang', label: '新疆' },
  { value: 'inner-mongolia', label: '内蒙古' },
];

const timeRanges: FilterOption[] = [
  { value: 'all', label: '不限' },
  { value: '3d', label: '近3天' },
  { value: '1w', label: '近一周' },
  { value: '1m', label: '近一月' },
  { value: '3m', label: '近三月' },
  { value: '6m', label: '近半年' },
];

const searchModes: FilterOption[] = [
  { value: 'fuzzy', label: '模糊检索' },
  { value: 'exact', label: '精确检索' },
];

const subscriptionGroupOptions: FilterOption[] = [
  { value: 'all', label: '全部订阅组' },
  { value: 'security', label: '网络安全组' },
  { value: 'dengbao', label: '等保测评组' },
  { value: 'data', label: '数据安全组' },
];

const archivePublishTimeOptions: FilterOption[] = [
  { value: 'all', label: '全部发布时间' },
  { value: 'today', label: '今天发布' },
  { value: '7d', label: '近7天发布' },
  { value: '30d', label: '近30天发布' },
  { value: '90d', label: '近90天发布' },
];

const publishTimeOptions: FilterOption[] = [
  { value: 'all', label: '全部发布时间' },
  { value: 'today', label: '今天发布' },
  { value: '3d', label: '近3天发布' },
  { value: '7d', label: '近7天发布' },
];

const deadlineOptions: FilterOption[] = [
  { value: 'all', label: '全部截止时间' },
  { value: '7d', label: '7天内截止' },
  { value: '14d', label: '14天内截止' },
  { value: '30d', label: '30天内截止' },
];

const budgetOptions: FilterOption[] = [
  { value: 'all', label: '全部预算' },
  { value: 'lt50', label: '50万以下' },
  { value: '50-100', label: '50-100万' },
  { value: '100-200', label: '100-200万' },
  { value: 'gt200', label: '200万以上' },
];

const matchScoreOptions: FilterOption[] = [
  { value: 'all', label: '全部匹配度' },
  { value: 'gte90', label: '90%及以上' },
  { value: '80-90', label: '80%-90%' },
  { value: 'lt80', label: '80%以下' },
];

const subscriptionRegionOptions: FilterOption[] = [
  { value: 'all', label: '全部地区' },
  { value: '上海市', label: '上海市' },
  { value: '上海市浦东新区', label: '浦东新区' },
  { value: '上海市徐汇区', label: '徐汇区' },
  { value: '上海市青浦区', label: '青浦区' },
  { value: '上海市松江区', label: '松江区' },
  { value: '上海市闵行区', label: '闵行区' },
  { value: '上海市静安区', label: '静安区' },
  { value: '上海市奉贤区', label: '奉贤区' },
  { value: '上海市长宁区', label: '长宁区' },
  { value: '上海市杨浦区', label: '杨浦区' },
  { value: '上海市宝山区', label: '宝山区' },
  { value: '上海市嘉定区', label: '嘉定区' },
  { value: '上海市黄浦区', label: '黄浦区' },
  { value: '上海市崇明区', label: '崇明区' },
  { value: '上海市金山区', label: '金山区' },
  { value: '上海市普陀区', label: '普陀区' },
  { value: '上海市虹口区', label: '虹口区' },
];

const results: SearchResult[] = [
  {
    id: '317547638700462080',
    title: '江阴新兴数据安全评估服务项目询价公告（变更）',
    publisher: '江阴新兴特钢有限公司',
    date: '2026-05-25',
    summary: '询比采购公告（变更） 一、采购单编号：FWXJ0134826 二、采购单名称：江阴新兴数据安全评估服务项目 三、报价截止时间：2026-06-01 16:00 四、报价有效期：2026-06-19 五、组织地区：江苏省 无锡市；截止：2026-06-01',
  },
  {
    id: '317547638759182336',
    title: '资产风险发现与数据安全评估服务成交结果公告',
    publisher: '山西焦煤集团招标有限公司',
    date: '2026-05-23',
    summary: '项目编号：SJZBJM26000026F045FV55 资产风险发现与数据安全评估服务，确定成交人如下：一、成交结果 标段名称：资产风险发现与数据安全评估服务；地区：山西省 太原市',
  },
  {
    id: '317547638780153856',
    title: '关于“中国移动宁夏公司2026年信安系统及数据安全评估服务采购项目”采购计划公告、技术规范书及技术方案评分标准公示',
    publisher: '中国移动通信集团有限公司宁夏分公司',
    date: '2026-05-22',
    summary: '为确保符合采购相关要求，宁夏移动近期组织编制了“中国移动宁夏公司2026年信安系统及数据安全评估服务采购项目”的采购计划；地区：宁夏回族自治区 银川市；截止：2026-05-26',
  },
  {
    id: '317547638792736768',
    title: '辽宁招考安全运维服务2026（数据安全评估）公告',
    publisher: '联通（辽宁）产业互联网有限公司',
    date: '2026-05-22',
    summary: '辽宁招考安全运维服务2026（数据安全评估）已具备采购条件，现公开邀请供应商参加询比采购活动；地区：辽宁省 沈阳市',
  },
  {
    id: '317547638813708288',
    title: '江阴新兴数据安全评估服务项目询价公告（变更）',
    publisher: '江阴新兴特钢有限公司',
    date: '2026-05-22',
    summary: '江阴新兴数据安全评估服务项目采购公告变更，报价文件提交截止时间调整，供应商须按最新采购文件要求响应。',
  },
  {
    id: '317547638830485504',
    title: '数据安全评估项目',
    publisher: '贵州农村商业联合银行股份有限公司',
    date: '2026-05-21',
    summary: '数据安全评估项目中标结果公示，项目编号：GQQY-ZB2026040052，采购方式：招标采购；地区：贵州省 贵阳市',
  },
  {
    id: '317547638843068416',
    title: '数据安全评估项目招标采购公告',
    publisher: '贵州农村商业联合银行股份有限公司',
    date: '2026-05-21',
    summary: '数据安全评估项目招标采购公告，供应商需具备相关安全评估服务能力并按要求提交投标文件。',
  },
  {
    id: '315657131577659392',
    title: '江阴新兴数据安全评估服务项目询价公告（变更）',
    publisher: '江阴新兴特钢有限公司',
    date: '2026-05-20',
    summary: '江阴新兴数据安全评估服务项目询价公告变更，采购内容包含数据安全风险识别、合规评估及整改建议输出。',
  },
  {
    id: '315657131674128384',
    title: '2026年政务信息化运维-数据安全一本账（数据安全评估）流标公示',
    publisher: '贵州省水文水资源局',
    date: '2026-05-19',
    summary: '2026年政务信息化运维-数据安全一本账（数据安全评估）流标公示，因有效供应商不足，本项目按规定流标；地区：贵州省 贵阳市',
  },
  {
    id: '315657131703488512',
    title: '资产风险发现与数据安全评估服务成交候选人公示',
    publisher: '山西焦煤集团招标有限公司',
    date: '2026-05-18',
    summary: '项目编号：SJZBJM26000026F045FV55，公示开始时间：2026年5月18日17:00，公示结束时间：2026年5月21日17:00；地区：山西省 太原市',
  },
];

const subscriptionResults: SearchResult[] = [
  {
    id: 'sub-301',
    title: '某国有银行上海分行网络安全渗透测试服务',
    publisher: '某国有银行上海分行',
    date: '2026-02-04',
    deadline: '2026-02-08',
    budget: '68万',
    budgetAmount: 68,
    region: '上海市',
    matchScore: 96,
    summary: '预算金额：68万元；匹配度：96%。项目要求供应商具备 CISP、渗透测试和金融行业安全服务经验，服务范围包含互联网暴露面梳理、漏洞验证、复测和整改报告输出；地区：上海市。',
  },
  {
    id: 'sub-302',
    title: '浦东新区政务云安全运维服务采购',
    publisher: '上海市浦东新区政务云管理中心',
    date: '2026-02-04',
    deadline: '2026-02-12',
    budget: '156万',
    budgetAmount: 156,
    region: '上海市浦东新区',
    matchScore: 94,
    summary: '预算金额：156万元；匹配度：94%。采购内容包括云平台安全巡检、日志分析、应急响应、基线加固和月度安全运营报告，要求驻场与远程服务结合；地区：上海市浦东新区。',
  },
  {
    id: 'sub-303',
    title: '徐汇区教育局校园网络安全防护系统建设',
    publisher: '上海市徐汇区教育局',
    date: '2026-02-04',
    deadline: '2026-02-09',
    budget: '45万',
    budgetAmount: 45,
    region: '上海市徐汇区',
    matchScore: 89,
    summary: '预算金额：45万元；匹配度：89%。项目覆盖校园网边界防护、终端安全、日志留存和安全策略梳理，需提供建设方案及验收材料；地区：上海市徐汇区。',
  },
  {
    id: 'sub-304',
    title: '青浦区公安局网络安全监测平台采购',
    publisher: '上海市青浦区公安局',
    date: '2026-02-03',
    deadline: '2026-02-14',
    budget: '120万',
    budgetAmount: 120,
    region: '上海市青浦区',
    matchScore: 85,
    summary: '预算金额：120万元；匹配度：85%。采购网络安全监测、告警研判和威胁情报接入服务，要求形成常态化监测与事件闭环处置能力；地区：上海市青浦区。',
  },
  {
    id: 'sub-305',
    title: '松江区政府数据中心安全加固项目',
    publisher: '上海市松江区政务服务中心',
    date: '2026-02-03',
    deadline: '2026-02-15',
    budget: '72万',
    budgetAmount: 72,
    region: '上海市松江区',
    matchScore: 82,
    summary: '预算金额：72万元；匹配度：82%。项目包含主机加固、数据库安全检查、网络访问控制优化和整改复核，要求提交阶段性风险清单；地区：上海市松江区。',
  },
  {
    id: 'sub-306',
    title: '闵行区街道办网络安全咨询服务',
    publisher: '上海市闵行区街道办事处',
    date: '2026-02-03',
    deadline: '2026-02-11',
    budget: '28万',
    budgetAmount: 28,
    region: '上海市闵行区',
    matchScore: 78,
    summary: '预算金额：28万元；匹配度：78%。服务内容包括网络安全制度梳理、资产台账核查、日常安全咨询和应急预案修订；地区：上海市闵行区。',
  },
  {
    id: 'sub-307',
    title: '静安区商务楼宇网络安全检测服务',
    publisher: '上海市静安区商务委员会',
    date: '2026-02-02',
    deadline: '2026-02-16',
    budget: '25万',
    budgetAmount: 25,
    region: '上海市静安区',
    matchScore: 75,
    summary: '预算金额：25万元；匹配度：75%。面向重点商务楼宇开展网络连通性、弱口令、边界设备配置和基础安全风险检测；地区：上海市静安区。',
  },
  {
    id: 'sub-308',
    title: '奉贤区工业园区企业安全服务采购',
    publisher: '上海市奉贤区工业园区管理委员会',
    date: '2026-02-02',
    deadline: '2026-02-18',
    budget: '55万',
    budgetAmount: 55,
    region: '上海市奉贤区',
    matchScore: 72,
    summary: '预算金额：55万元；匹配度：72%。为园区企业提供安全巡检、风险评估、整改辅导和安全培训，形成园区级安全服务台账；地区：上海市奉贤区。',
  },
  {
    id: 'sub-309',
    title: '上海城投集团网络边界安全评估项目',
    publisher: '上海城投集团有限公司',
    date: '2026-02-01',
    deadline: '2026-02-20',
    budget: '92万',
    budgetAmount: 92,
    region: '上海市',
    matchScore: 87,
    summary: '预算金额：92万元；匹配度：87%。评估集团总部及下属单位网络边界策略、远程接入、VPN、堡垒机和互联网出口安全配置；地区：上海市。',
  },
  {
    id: 'sub-310',
    title: '长宁区智慧园区安全运营托管服务',
    publisher: '上海市长宁区科创园区管理中心',
    date: '2026-02-01',
    deadline: '2026-02-22',
    budget: '88万',
    budgetAmount: 88,
    region: '上海市长宁区',
    matchScore: 84,
    summary: '预算金额：88万元；匹配度：84%。服务包含安全运营值守、漏洞管理、设备策略巡检和季度风险汇报，适配园区多租户场景；地区：上海市长宁区。',
  },
];

const displayedResults = computed(() => (isSubscriptionResults.value ? subscriptionResults : results));
const resultCount = computed(() => (isSubscriptionResults.value ? 128 : 1063));
const SEARCH_PAGE_SIZE = 20;
const archivePageSizeOptions = [20, 50, 100];
const subscriptionReferenceDate = new Date('2026-02-04');

const formatArchiveDate = (date: Date) => date.toISOString().slice(0, 10);

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const archiveTitleTemplates = [
  '网络安全渗透测试服务',
  '政务云安全运维服务采购',
  '校园网络安全防护系统建设',
  '数据中心安全加固项目',
  '网络安全监测平台采购',
  '数据安全风险排查服务',
  '等级保护测评服务项目',
  '安全运营驻场服务',
  '网络安全应急演练服务',
  '日志审计平台采购',
  '终端安全加固项目',
  '互联网暴露面风险评估'
];

const archivePublishers = [
  '某国有银行上海分行',
  '上海市浦东新区政务云管理中心',
  '上海市徐汇区教育局',
  '上海市青浦区公安局',
  '上海市松江区政务服务中心',
  '上海市闵行区街道办事处',
  '上海市静安区商务委员会',
  '上海市奉贤区工业园区管理委员会',
  '上海城投集团有限公司',
  '上海市长宁区数据局',
  '上海市杨浦区科创园区管理中心',
  '上海市宝山区人民医院',
  '上海市嘉定区政务服务办公室',
  '上海市黄浦区教育信息中心',
  '上海市崇明区卫生健康委员会',
  '上海市金山区工业互联网中心',
  '上海市普陀区城市运行中心',
  '上海市虹口区文化和旅游局'
];

const archiveRegions = subscriptionRegionOptions
  .filter((item) => item.value !== 'all')
  .map((item) => item.value);

const buildArchiveResult = (index: number, group: string): SearchResult => {
  const publisher = archivePublishers[index % archivePublishers.length] ?? '采购单位';
  const titleTemplate = archiveTitleTemplates[index % archiveTitleTemplates.length] ?? '网络安全服务采购';
  const publishDate = addDays(subscriptionReferenceDate, -Math.floor(index / 5));
  const deadline = addDays(publishDate, 7 + (index % 24));
  const budgetAmount = 24 + ((index * 17) % 216);
  const matchScore = Math.max(62, 96 - (index % 35));
  const region = archiveRegions[index % archiveRegions.length] ?? '上海市';
  const groupLabel = subscriptionGroupOptions.find((item) => item.value === group)?.label ?? '订阅组';

  return {
    id: String(301 + index),
    title: `${publisher}${titleTemplate}`,
    publisher,
    date: formatArchiveDate(publishDate),
    deadline: formatArchiveDate(deadline),
    budget: `${budgetAmount}万`,
    budgetAmount,
    region,
    matchScore,
    group,
    summary: `${groupLabel}历史推送标讯。预算金额：${budgetAmount}万元；匹配度：${matchScore}%。项目围绕${titleTemplate}展开，要求供应商提供方案、实施、报告与复核材料；地区：${region}。`,
  };
};

const generatedSecurityResults = Array.from({ length: 128 }, (_, index) => {
  const base = subscriptionResults[index];

  if (base) {
    return { ...base, id: String(301 + index), group: 'security' };
  }

  return buildArchiveResult(index, 'security');
});

const generatedDengbaoResults = Array.from({ length: 36 }, (_, index) => ({
  ...buildArchiveResult(128 + index, index % 2 === 0 ? 'dengbao' : 'data'),
  id: String(501 + index),
}));

const subscriptionArchiveResults = [...generatedSecurityResults, ...generatedDengbaoResults];

const dayDiff = (fromDate: Date, toDate: Date) =>
  Math.floor((toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000));

const matchesPublishTime = (item: SearchResult) => {
  if (activePublishTime.value === 'all') return true;
  const diff = dayDiff(new Date(item.date), subscriptionReferenceDate);

  if (activePublishTime.value === 'today') return diff === 0;
  if (activePublishTime.value === '3d') return diff >= 0 && diff <= 3;
  if (activePublishTime.value === '7d') return diff >= 0 && diff <= 7;
  if (activePublishTime.value === '30d') return diff >= 0 && diff <= 30;
  if (activePublishTime.value === '90d') return diff >= 0 && diff <= 90;

  return true;
};

const matchesDeadline = (item: SearchResult) => {
  if (activeDeadline.value === 'all' || !item.deadline) return true;
  const diff = dayDiff(subscriptionReferenceDate, new Date(item.deadline));

  if (activeDeadline.value === '7d') return diff >= 0 && diff <= 7;
  if (activeDeadline.value === '14d') return diff >= 0 && diff <= 14;
  if (activeDeadline.value === '30d') return diff >= 0 && diff <= 30;

  return true;
};

const matchesBudget = (item: SearchResult) => {
  if (activeBudget.value === 'all' || item.budgetAmount === undefined) return true;

  if (activeBudget.value === 'lt50') return item.budgetAmount < 50;
  if (activeBudget.value === '50-100') return item.budgetAmount >= 50 && item.budgetAmount <= 100;
  if (activeBudget.value === '100-200') return item.budgetAmount > 100 && item.budgetAmount <= 200;
  if (activeBudget.value === 'gt200') return item.budgetAmount > 200;

  return true;
};

const matchesScore = (item: SearchResult) => {
  const score = item.matchScore ?? 0;

  if (activeMatchScore.value === 'all') return true;
  if (activeMatchScore.value === 'gte90') return score >= 90;
  if (activeMatchScore.value === '80-90') return score >= 80 && score < 90;
  if (activeMatchScore.value === 'lt80') return score < 80;

  return true;
};

const matchesArchiveKeyword = (item: SearchResult) => {
  const keyword = archiveKeyword.value.trim().toLowerCase();
  if (!keyword) return true;

  return [item.title, item.publisher, item.summary ?? '']
    .some((value) => value.toLowerCase().includes(keyword));
};

const getArchiveSortValue = (item: SearchResult) => {
  if (activeArchiveSortField.value === 'budgetAmount') return item.budgetAmount ?? 0;
  if (activeArchiveSortField.value === 'deadline') return new Date(item.deadline ?? item.date).getTime();
  return new Date(item.date).getTime();
};

const subscriptionFilteredResults = computed(() =>
  subscriptionArchiveResults
    .filter((item) => (
      (activeSubscriptionGroup.value === 'all' || item.group === activeSubscriptionGroup.value) &&
      matchesPublishTime(item) &&
      matchesDeadline(item) &&
      matchesBudget(item) &&
      matchesScore(item) &&
      matchesArchiveKeyword(item) &&
      (activeSubscriptionRegion.value === 'all' || item.region === activeSubscriptionRegion.value)
    ))
    .sort((a, b) => {
      const result = getArchiveSortValue(a) - getArchiveSortValue(b);
      return activeArchiveSortDirection.value === 'asc' ? result : -result;
    })
);

const activeArchiveRegionLabel = computed(() =>
  subscriptionRegionOptions.find((item) => item.value === activeSubscriptionRegion.value)?.label ?? '全部地区'
);

const archiveTotalPages = computed(() =>
  Math.max(1, Math.ceil(subscriptionFilteredResults.value.length / archivePageSize.value))
);

const pagedSubscriptionResults = computed(() => {
  const start = (archiveCurrentPage.value - 1) * archivePageSize.value;
  return subscriptionFilteredResults.value.slice(start, start + archivePageSize.value);
});

const archivePageStart = computed(() => {
  if (subscriptionFilteredResults.value.length === 0) return 0;
  return (archiveCurrentPage.value - 1) * archivePageSize.value + 1;
});

const archivePageEnd = computed(() =>
  Math.min(archiveCurrentPage.value * archivePageSize.value, subscriptionFilteredResults.value.length)
);

const archivePageNumbers = computed(() =>
  Array.from({ length: archiveTotalPages.value }, (_, index) => index + 1)
);

watch(
  [
    activeSubscriptionGroup,
    activePublishTime,
    activeDeadline,
    activeBudget,
    activeSubscriptionRegion,
    activeMatchScore,
    archiveKeyword,
    archivePageSize,
    activeArchiveSortField,
    activeArchiveSortDirection,
  ],
  () => {
    archiveCurrentPage.value = 1;
  }
);

watch(archiveCurrentPage, (page) => {
  archiveJumpPage.value = String(page);
});

watch(archiveTotalPages, (pageCount) => {
  if (archiveCurrentPage.value > pageCount) {
    archiveCurrentPage.value = pageCount;
  }
});

const visibleRegions = computed(() => (isRegionCollapsed.value ? regions.slice(0, 20) : regions));

const isSelected = (currentValue: string, optionValue: string) => currentValue === optionValue;

const toggleRegionCollapse = () => {
  isRegionCollapsed.value = !isRegionCollapsed.value;
};

const resetFilters = () => {
  activeInfoType.value = 'all';
  activeRegion.value = 'all';
  activeTimeRange.value = 'all';
  activeSearchMode.value = 'exact';
  isRegionCollapsed.value = false;
};

const resetSubscriptionFilters = () => {
  activeSubscriptionGroup.value = String(route.query.group ?? 'security');
  activePublishTime.value = 'all';
  activeDeadline.value = 'all';
  activeBudget.value = 'all';
  activeSubscriptionRegion.value = 'all';
  activeMatchScore.value = 'all';
  archiveKeyword.value = '';
  archiveCurrentPage.value = 1;
  archivePageSize.value = 20;
  activeArchiveSortField.value = 'date';
  activeArchiveSortDirection.value = 'desc';
  showArchiveRegionDropdown.value = false;
};

const toggleArchiveSort = (field: ArchiveSortField) => {
  if (activeArchiveSortField.value === field) {
    activeArchiveSortDirection.value = activeArchiveSortDirection.value === 'asc' ? 'desc' : 'asc';
    return;
  }

  activeArchiveSortField.value = field;
  activeArchiveSortDirection.value = 'desc';
};

const selectArchiveRegion = (region: string) => {
  activeSubscriptionRegion.value = region;
  showArchiveRegionDropdown.value = false;
};

const handleArchiveRegionBlur = (event: FocusEvent) => {
  const currentTarget = event.currentTarget;
  const nextTarget = event.relatedTarget;

  if (!(currentTarget instanceof HTMLElement)) return;
  if (nextTarget instanceof Node && currentTarget.contains(nextTarget)) return;

  showArchiveRegionDropdown.value = false;
};

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchQuery.value = isSubscriptionResults.value ? subscriptionSearchLabel.value : '数据安全评估';
  }
};

const goToDetail = (item: SearchResult) => {
  router.push({ name: 'bid-detail', query: { id: item.id, title: item.title } });
};

const goToSubscriptionDetail = (item: SearchResult) => {
  router.push({
    name: 'bid-list-detail',
    query: {
      bidId: item.id,
      source: 'subscription',
      title: item.title,
      publisher: item.publisher,
      date: item.date,
      deadline: item.deadline,
      budget: item.budget,
      region: item.region,
    },
  });
};

const goToArchivePage = (page: number) => {
  archiveCurrentPage.value = Math.min(Math.max(page, 1), archiveTotalPages.value);
};

const goToArchiveJumpPage = () => {
  const targetPage = Number.parseInt(archiveJumpPage.value, 10);

  if (!Number.isFinite(targetPage)) {
    archiveJumpPage.value = String(archiveCurrentPage.value);
    return;
  }

  goToArchivePage(targetPage);
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const highlightedTitle = (title: string) => {
  const keyword = searchQuery.value.trim();
  const safeTitle = escapeHtml(title);

  if (!keyword) {
    return safeTitle;
  }

  return safeTitle.replace(
    new RegExp(escapeRegExp(escapeHtml(keyword)), 'g'),
    '<span class="keyword-highlight">$&</span>'
  );
};
</script>

<template>
  <div class="enterprise-results-page">
    <div class="enterprise-results-shell">
      <template v-if="isSubscriptionResults">
        <section class="archive-overview-card" aria-label="历史标讯筛选">
          <div class="archive-hero-card">
            <h1>历史标讯</h1>
            <div class="archive-hero-actions">
              <button type="button" class="archive-reset-btn" @click="resetSubscriptionFilters">重置筛选</button>
            </div>
          </div>

          <div class="archive-filter-panel">
            <div class="archive-filter-grid">
              <label class="archive-filter-item">
                <span>订阅组</span>
                <select v-model="activeSubscriptionGroup">
                  <option v-for="item in subscriptionGroupOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
              </label>
              <label class="archive-filter-item">
                <span>发布时间</span>
                <select v-model="activePublishTime">
                  <option v-for="item in archivePublishTimeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
              </label>
              <label class="archive-filter-item">
                <span>截止时间</span>
                <select v-model="activeDeadline">
                  <option v-for="item in deadlineOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
              </label>
              <label class="archive-filter-item">
                <span>预算金额</span>
                <select v-model="activeBudget">
                  <option v-for="item in budgetOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
              </label>
              <label class="archive-filter-item">
                <span>地区</span>
                <select v-model="activeSubscriptionRegion">
                  <option v-for="item in subscriptionRegionOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
              </label>
              <label class="archive-filter-item">
                <span>匹配度</span>
                <select v-model="activeMatchScore">
                  <option v-for="item in matchScoreOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
              </label>
              <label class="archive-filter-item archive-keyword-field">
                <span>关键词</span>
                <input v-model="archiveKeyword" type="text" placeholder="标讯名称 / 发布单位" />
              </label>
            </div>
          </div>
        </section>

        <section class="subscription-list-panel" aria-label="历史标讯列表">
          <div class="subscription-table">
            <div class="subscription-table-row table-head archive-filter-head">
              <span>匹配度</span>
              <span>标讯名称</span>
              <span>发布单位</span>
              <button
                type="button"
                :class="['archive-head-sort-button', { active: activeArchiveSortField === 'date' }]"
                @click="toggleArchiveSort('date')"
              >
                <span>发布时间</span>
                <ArrowUp v-if="activeArchiveSortField === 'date' && activeArchiveSortDirection === 'asc'" :size="13" />
                <ArrowDown v-else-if="activeArchiveSortField === 'date'" :size="13" />
                <ArrowUpDown v-else :size="13" />
              </button>
              <button
                type="button"
                :class="['archive-head-sort-button', { active: activeArchiveSortField === 'deadline' }]"
                @click="toggleArchiveSort('deadline')"
              >
                <span>截止时间</span>
                <ArrowUp v-if="activeArchiveSortField === 'deadline' && activeArchiveSortDirection === 'asc'" :size="13" />
                <ArrowDown v-else-if="activeArchiveSortField === 'deadline'" :size="13" />
                <ArrowUpDown v-else :size="13" />
              </button>
              <button
                type="button"
                :class="['archive-head-sort-button', { active: activeArchiveSortField === 'budgetAmount' }]"
                @click="toggleArchiveSort('budgetAmount')"
              >
                <span>预算金额</span>
                <ArrowUp v-if="activeArchiveSortField === 'budgetAmount' && activeArchiveSortDirection === 'asc'" :size="13" />
                <ArrowDown v-else-if="activeArchiveSortField === 'budgetAmount'" :size="13" />
                <ArrowUpDown v-else :size="13" />
              </button>
              <div
                :class="['archive-head-region-filter', { active: activeSubscriptionRegion !== 'all', open: showArchiveRegionDropdown }]"
                @focusout="handleArchiveRegionBlur"
              >
                <button
                  type="button"
                  class="archive-head-region-trigger"
                  aria-haspopup="listbox"
                  :aria-expanded="showArchiveRegionDropdown"
                  @click.stop="showArchiveRegionDropdown = !showArchiveRegionDropdown"
                >
                  <span>地区</span>
                  <strong>{{ activeArchiveRegionLabel }}</strong>
                  <ChevronDown :size="13" />
                </button>
                <div v-if="showArchiveRegionDropdown" class="archive-head-region-menu" role="listbox">
                  <button
                    v-for="item in subscriptionRegionOptions"
                    :key="item.value"
                    type="button"
                    role="option"
                    :aria-selected="activeSubscriptionRegion === item.value"
                    :class="['archive-head-region-option', { active: activeSubscriptionRegion === item.value }]"
                    @click="selectArchiveRegion(item.value)"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
            <button
              v-for="item in pagedSubscriptionResults"
              :key="item.id"
              type="button"
              class="subscription-table-row table-item"
              @click="goToSubscriptionDetail(item)"
            >
              <span class="score-pill">{{ item.matchScore }}%</span>
              <span class="table-title">{{ item.title }}</span>
              <span>{{ item.publisher }}</span>
              <span>{{ item.date }}</span>
              <span>{{ item.deadline }}</span>
              <span class="budget-value">{{ item.budget }}</span>
              <span>{{ item.region }}</span>
            </button>
            <div v-if="pagedSubscriptionResults.length === 0" class="empty-list">
              暂无符合当前筛选条件的历史标讯
            </div>
          </div>

          <div class="pagination-row archive-pagination">
            <span>第 {{ archivePageStart }}-{{ archivePageEnd }} 条 / 共 {{ subscriptionFilteredResults.length }} 条</span>
            <button
              type="button"
              class="page-nav-btn"
              :disabled="archiveCurrentPage === 1"
              @click="goToArchivePage(archiveCurrentPage - 1)"
            >
              上一页
            </button>
            <button
              v-for="page in archivePageNumbers"
              :key="page"
              type="button"
              :class="['archive-page-btn', { active: archiveCurrentPage === page }]"
              @click="goToArchivePage(page)"
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="page-nav-btn"
              :disabled="archiveCurrentPage === archiveTotalPages"
              @click="goToArchivePage(archiveCurrentPage + 1)"
            >
              下一页
            </button>
            <label class="archive-jump-control">
              <span>跳至</span>
              <input
                v-model="archiveJumpPage"
                type="number"
                min="1"
                :max="archiveTotalPages"
                @blur="goToArchiveJumpPage"
                @keyup.enter="goToArchiveJumpPage"
              />
              <span>页</span>
            </label>
            <label class="archive-page-size-control">
              <select v-model.number="archivePageSize">
                <option v-for="size in archivePageSizeOptions" :key="size" :value="size">
                  {{ size }} 条/页
                </option>
              </select>
            </label>
          </div>
        </section>
      </template>

      <template v-else>
        <section class="search-card" aria-label="标讯搜索">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="输入关键词搜索"
            @keyup.enter="handleSearch"
          />
          <button type="button" class="search-button" @click="handleSearch">
            <span>搜索</span>
          </button>
        </section>

        <section class="filter-panel" aria-label="筛选条件">
          <div class="filter-heading">
            <SlidersHorizontal :size="14" />
            <span>筛选</span>
          </div>

          <div class="filter-row">
            <span class="filter-label">类型</span>
            <div class="filter-options">
              <button
                v-for="item in infoTypes"
                :key="item.value"
                type="button"
                :class="['filter-chip', { active: isSelected(activeInfoType, item.value) }]"
                @click="activeInfoType = item.value"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="filter-row region-row">
            <span class="filter-label">地区</span>
            <div class="region-options">
              <div class="filter-options filter-options-region">
                <button
                  v-for="item in visibleRegions"
                  :key="item.value"
                  type="button"
                  :class="['filter-chip', { active: isSelected(activeRegion, item.value) }]"
                  @click="activeRegion = item.value"
                >
                  {{ item.label }}
                </button>
              </div>
              <button type="button" class="region-toggle" @click="toggleRegionCollapse">
                {{ isRegionCollapsed ? '展开 ▼' : '收起 ▲' }}
              </button>
            </div>
          </div>

          <div class="filter-row">
            <span class="filter-label">时间</span>
            <div class="filter-options">
              <button
                v-for="item in timeRanges"
                :key="item.value"
                type="button"
                :class="['filter-chip', { active: isSelected(activeTimeRange, item.value) }]"
                @click="activeTimeRange = item.value"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="filter-row">
            <span class="filter-label">搜索模式</span>
            <div class="filter-options">
              <button
                v-for="item in searchModes"
                :key="item.value"
                type="button"
                :class="['filter-chip', 'mode-chip', { active: isSelected(activeSearchMode, item.value) }]"
                @click="activeSearchMode = item.value"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="filter-actions-row">
            <button type="button" class="secondary-action" @click="resetFilters">重置</button>
            <button type="button" class="secondary-action muted-action">高级搜索</button>
          </div>
        </section>

        <section class="result-panel" aria-label="搜索结果">
          <p class="result-count">
            为您找到相关结果共 <strong>{{ resultCount }}</strong> 篇
          </p>

          <article v-for="item in displayedResults" :key="item.id" class="result-item">
            <button
              type="button"
              class="result-title"
              @click="goToDetail(item)"
              v-html="highlightedTitle(item.title)"
            ></button>
            <div class="result-meta">
              <span>{{ item.publisher }}</span>
              <span>{{ item.date }}</span>
            </div>
            <p v-if="item.summary" class="result-summary-text">
              {{ item.summary }}
            </p>
          </article>

          <div class="pagination-row">
            <button type="button" class="page-arrow" aria-label="上一页">‹</button>
            <span>第 1-{{ SEARCH_PAGE_SIZE }} 条 / 共 {{ resultCount }} 条</span>
            <button type="button" class="page-arrow" aria-label="下一页">›</button>
            <button type="button" class="page-size">20 条/页</button>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.enterprise-results-page {
  min-height: 100%;
  padding: 14px 24px 24px;
  overflow-y: auto;
  background: #eef3ff;
  color: #26364d;
}

.enterprise-results-shell {
  width: min(1020px, 100%);
  margin: 0 auto;
}

.search-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 58px;
  padding: 10px 18px;
  background: #ffffff;
  border: 1px solid #d8e3f8;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(50, 91, 168, 0.05);
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: 7px 0;
  background: transparent;
  color: #26364d;
  font-size: 14px;
  font-weight: 600;
}

.search-input::placeholder {
  color: #9aa9bf;
  font-weight: 500;
}

.search-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 34px;
  border-radius: 7px;
  background: #2f63d7;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(47, 99, 215, 0.18);
}

.archive-overview-card {
  background: #ffffff;
  border: 1px solid #d8e3f8;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(50, 91, 168, 0.05);
}

.archive-hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 72px;
  padding: 18px 22px;
}

.archive-hero-card h1 {
  margin: 0;
  color: #203149;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 900;
}

.archive-hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.archive-filter-panel {
  border-top: 1px solid #eef2f8;
}

.archive-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 14px 18px 16px;
}

.archive-filter-item {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.archive-keyword-field {
  grid-column: span 2;
}

.archive-filter-item span {
  color: #61738d;
  font-size: 12px;
  font-weight: 800;
}

.archive-filter-item select,
.archive-filter-item input {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #dfe8f7;
  border-radius: 7px;
  background: #f8fbff;
  color: #2f4058;
  font-size: 13px;
  font-weight: 700;
  outline: none;
}

.archive-filter-item select {
  padding-right: 28px;
}

.archive-filter-item input::placeholder {
  color: #9aa9bf;
}

.archive-filter-item select:focus,
.archive-filter-item input:focus {
  border-color: #7ca6ff;
  box-shadow: 0 0 0 3px rgba(63, 112, 246, 0.08);
}

.archive-reset-btn {
  height: 32px;
  padding: 0 10px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.archive-reset-btn:hover {
  color: #2563eb;
}

.filter-panel {
  margin-top: 10px;
  background: #ffffff;
  border: 1px solid #dfe8f7;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(50, 91, 168, 0.04);
}

.filter-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 18px;
  color: #65768f;
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid #eef2f8;
}

.filter-row {
  display: flex;
  gap: 18px;
  min-height: 34px;
  padding: 7px 18px;
  border-bottom: 1px solid #eef2f8;
}

.filter-label {
  width: 54px;
  flex-shrink: 0;
  padding-top: 3px;
  color: #546782;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
}

.filter-options {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px 17px;
  min-width: 0;
}

.region-row {
  min-height: 68px;
}

.region-options {
  display: flex;
  flex: 1;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.filter-options-region {
  row-gap: 6px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 21px;
  padding: 0;
  border-radius: 6px;
  color: #6d7f99;
  font-size: 12px;
  font-weight: 600;
  line-height: 21px;
  white-space: nowrap;
}

.filter-chip:hover {
  color: #2f63d7;
}

.filter-chip.active {
  padding: 0 8px;
  background: #dcebff;
  color: #3f70f6;
}

.mode-chip {
  min-width: 58px;
}

.region-toggle {
  flex-shrink: 0;
  height: 22px;
  padding: 0 4px;
  color: #3f70f6;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.filter-actions-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 42px;
  padding: 7px 14px;
}

.secondary-action {
  min-width: 48px;
  height: 24px;
  padding: 0 13px;
  border: 1px solid #e4eaf3;
  border-radius: 7px;
  background: #ffffff;
  color: #6b7a8f;
  font-size: 12px;
  font-weight: 700;
}

.muted-action {
  background: #f5f7fb;
  color: #a2adbd;
}

.field-filter-panel {
  margin-top: 10px;
  background: #ffffff;
  border: 1px solid #dfe8f7;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(50, 91, 168, 0.04);
}

.field-filter-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 42px;
  padding: 8px 14px 8px 18px;
  border-bottom: 1px solid #eef2f8;
}

.field-filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #546782;
  font-size: 12px;
  font-weight: 800;
}

.field-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 14px 18px 16px;
}

.field-filter-item {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.field-filter-item span {
  color: #61738d;
  font-size: 12px;
  font-weight: 800;
}

.field-filter-item select {
  width: 100%;
  height: 34px;
  padding: 0 28px 0 10px;
  border: 1px solid #dfe8f7;
  border-radius: 7px;
  background: #f8fbff;
  color: #2f4058;
  font-size: 13px;
  font-weight: 700;
  outline: none;
}

.field-filter-item select:focus {
  border-color: #7ca6ff;
  box-shadow: 0 0 0 3px rgba(63, 112, 246, 0.08);
}

.result-panel {
  margin-top: 9px;
  background: #ffffff;
  border: 1px solid #e5ebf5;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(50, 91, 168, 0.04);
}

.result-count {
  margin: 0;
  padding: 15px 18px 8px;
  color: #667892;
  font-size: 13px;
  font-weight: 700;
}

.result-count strong {
  color: #2f63d7;
  font-weight: 800;
}

.result-item {
  padding: 14px 18px 15px;
  border-bottom: 1px solid #edf1f7;
}

.result-title {
  display: block;
  width: 100%;
  padding: 0;
  color: #29384d;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.55;
  text-align: left;
}

.result-title:hover {
  color: #2f63d7;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 6px;
  color: #7d8898;
  font-size: 12px;
  font-weight: 700;
}

.result-summary-text {
  margin: 8px 0 0;
  color: #8a96a7;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.75;
}

.subscription-list-panel {
  margin-top: 9px;
  background: #ffffff;
  border: 1px solid #e5ebf5;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(50, 91, 168, 0.04);
}

.subscription-table {
  overflow-x: auto;
}

.subscription-table-row {
  display: grid;
  grid-template-columns: 72px minmax(250px, 1.8fr) minmax(150px, 1fr) 92px 92px 82px 116px;
  gap: 12px;
  align-items: center;
  min-width: 970px;
  padding: 0 18px;
}

.table-head {
  min-height: 38px;
  background: #f8fbff;
  color: #667892;
  font-size: 12px;
  font-weight: 800;
  border-bottom: 1px solid #edf1f7;
}

.archive-filter-head {
  min-height: 50px;
}

.archive-head-sort-button {
  display: inline-grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: start;
  gap: 4px;
  min-width: 0;
  height: 30px;
  padding: 0;
  border: none;
  background: transparent;
  color: #667892;
  font-size: 12px;
  font-weight: 800;
  text-align: left;
}

.archive-head-sort-button:hover,
.archive-head-sort-button.active {
  color: #2563eb;
}

.archive-head-sort-button span {
  white-space: nowrap;
}

.archive-head-sort-button svg {
  flex-shrink: 0;
}

.archive-head-region-filter {
  position: relative;
  min-width: 0;
  height: 30px;
  color: #667892;
}

.archive-head-region-trigger {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 5px;
  width: 100%;
  height: 30px;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 12px;
  font-weight: 800;
  text-align: left;
}

.archive-head-region-trigger span,
.archive-head-region-trigger strong {
  color: inherit;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.archive-head-region-trigger strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.archive-head-region-filter:hover,
.archive-head-region-filter.active,
.archive-head-region-filter.open {
  color: #2563eb;
}

.archive-head-region-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 30;
  width: 168px;
  max-height: 260px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid #dbe5f2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.14);
}

.archive-head-region-option {
  width: 100%;
  height: 30px;
  padding: 0 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.archive-head-region-option:hover {
  background: #eff6ff;
  color: #2563eb;
}

.archive-head-region-option.active {
  color: #2563eb;
}

.table-item {
  width: 100%;
  min-height: 58px;
  color: #44536a;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  border-bottom: 1px solid #edf1f7;
}

.table-item:hover {
  background: #f8fbff;
}

.score-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 24px;
  border-radius: 6px;
  background: #dcfce7;
  color: #16a34a;
  font-weight: 800;
}

.table-title {
  color: #25384f;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.45;
}

.budget-value {
  color: #16a34a;
  font-weight: 900;
}

.empty-list {
  padding: 32px 18px;
  color: #7a8799;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  height: 42px;
  padding: 0 14px;
  color: #7d8a9d;
  font-size: 12px;
  font-weight: 600;
}

.page-arrow,
.page-size,
.page-nav-btn,
.archive-page-btn {
  height: 24px;
  padding: 0 10px;
  border: 1px solid #e4eaf3;
  border-radius: 6px;
  background: #ffffff;
  color: #75839a;
  font-size: 12px;
  font-weight: 700;
}

.page-nav-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
  background: #f8fafc;
}

.archive-page-btn {
  min-width: 26px;
  padding: 0 8px;
}

.archive-page-btn.active {
  border-color: #2f63d7;
  background: #eef5ff;
  color: #2f63d7;
}

.archive-pagination {
  gap: 8px;
  flex-wrap: wrap;
}

.archive-jump-control,
.archive-page-size-control {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #75839a;
  font-size: 12px;
  font-weight: 700;
}

.archive-jump-control input,
.archive-page-size-control select {
  height: 24px;
  border: 1px solid #e4eaf3;
  border-radius: 6px;
  background: #ffffff;
  color: #2f4058;
  font-size: 12px;
  font-weight: 700;
  outline: none;
}

.archive-jump-control input {
  width: 46px;
  padding: 0 6px;
  text-align: center;
}

.archive-page-size-control select {
  min-width: 86px;
  padding: 0 8px;
}

.archive-jump-control input:focus,
.archive-page-size-control select:focus {
  border-color: #7ca6ff;
  box-shadow: 0 0 0 3px rgba(63, 112, 246, 0.08);
}

.page-arrow {
  width: 26px;
  padding: 0;
  font-size: 18px;
  line-height: 18px;
}

:deep(.keyword-highlight) {
  color: #ff3b30;
  font-weight: 800;
}

@media (max-width: 960px) {
  .enterprise-results-page {
    padding: 12px;
  }

  .filter-row,
  .region-options {
    flex-direction: column;
    gap: 8px;
  }

  .filter-label {
    width: auto;
  }

  .filter-actions-row,
  .pagination-row {
    justify-content: flex-start;
    flex-wrap: wrap;
    height: auto;
    min-height: 42px;
  }

  .field-filter-grid {
    grid-template-columns: 1fr;
  }

  .archive-hero-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .archive-filter-grid {
    grid-template-columns: 1fr;
  }

  .archive-keyword-field {
    grid-column: auto;
  }

}
</style>
