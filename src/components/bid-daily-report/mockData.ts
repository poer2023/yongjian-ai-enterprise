import type {
  DocumentItem,
  ReportStats,
  MarketOverview,
  KeyProject,
  TrendAnalysis,
  CompetitorInsight,
  ActionPlan,
  RiskWarning,
  BidDetail
} from './types';

export const documentList: DocumentItem[] = [
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
];

export const reportDate = '2026年2月3日';

export const reportStats: ReportStats = {
  totalCount: 23,
  highMatchCount: 5,
  totalBudget: '2,860',
  avgBudget: '124.3'
};

export const marketOverview: MarketOverview = {
  title: '一、今日市场概览',
  content: `今日共监测到网络安全相关招标项目23个，较昨日增长15%，市场活跃度持续上升。从地区分布来看，广东省以6个项目位居首位，其次是北京（4个）和江苏（3个）。项目类型以等保测评（9个）和安全运维服务（7个）为主，渗透测试类项目有所减少。

整体预算规模约2,860万元，单项目平均预算124.3万元。值得注意的是，今日出现2个预算超过500万的大型项目，分别来自XX市政府和XX银行，建议重点关注。`
};

export const keyProjects: KeyProject[] = [
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
];

export const trendAnalysis: TrendAnalysis = {
  title: '二、行业趋势分析',
  content: `1. **等保测评需求持续增长**：本周等保测评类项目环比增长25%，主要集中在政务、医疗和教育领域。随着等保2.0全面推行，预计未来3个月需求将保持高位。

2. **云安全服务成为新热点**：随着企业上云加速，云安全评估、云等保测评需求明显增加。建议加强云安全服务能力建设，拓展相关资质认证。

3. **大型综合性项目增多**：500万以上的综合性安全项目占比从上月的8%上升至12%，客户更倾向于选择一站式安全服务供应商。

4. **供应商准入门槛提高**：近期多个项目要求投标方具备CNAS认证、等保测评机构资质等，无相关资质的竞争对手将被排除在外，这对我司是利好因素。`
};

export const competitorInsight: CompetitorInsight = {
  title: '三、竞争态势分析',
  content: `本周活跃的主要竞争对手包括A公司、B公司和C公司。其中：

- **A公司**：近期中标率较高，主要优势在价格竞争力，但技术方案创新性不足
- **B公司**：在金融行业有较强影响力，需在银行类项目中重点防范
- **C公司**：新进入本地市场，价格策略激进，但服务口碑一般

建议策略：保持技术方案的专业性和创新性，强调服务质量和成功案例，避免单纯的价格竞争。`
};

export const actionPlan: ActionPlan = {
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
};

export const riskWarning: RiskWarning = {
  title: '五、风险提示',
  items: [
    '本周有3个项目截止日期集中在2月18-20日，需合理分配投标资源',
    'XX市项目存在潜在围标嫌疑，建议关注后续公告',
    '近期部分地区疫情反复，可能影响现场踏勘和答疑安排'
  ]
};

export const bidDetails: Record<string, BidDetail> = {
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
};
