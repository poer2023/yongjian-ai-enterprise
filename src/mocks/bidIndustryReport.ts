// Mock data for bid industry analysis report

export interface MarketAnalysis {
  totalMarketSize: number; // in billion CNY
  growthRate: number; // percentage
  projectCount: number;
  avgProjectValue: number; // in million CNY
  monthlyTrend: { month: string; value: number; count: number }[];
}

export interface CompetitorData {
  name: string;
  bidCount: number;
  winCount: number;
  winRate: number;
  totalAmount: number; // in million CNY
}

export interface SelfBusinessData {
  bidCount: number;
  winCount: number;
  winRate: number;
  totalBidAmount: number;
  totalWinAmount: number;
  monthlyData: { month: string; bidCount: number; winCount: number }[];
}

export interface CompetitionComparison {
  dimension: string;
  selfScore: number;
  avgScore: number;
  topScore: number;
}

export interface PriceAnalysis {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  priceDistribution: { range: string; count: number; percentage: number }[];
}

export interface RegionAnalysis {
  region: string;
  marketSize: number;
  projectCount: number;
  competitorCount: number;
  intensity: 'high' | 'medium' | 'low';
}

export interface CustomerAnalysis {
  type: string;
  count: number;
  percentage: number;
  avgBudget: number;
}

export interface TrendPrediction {
  quarter: string;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

// Market Analysis Data
export const marketAnalysis: MarketAnalysis = {
  totalMarketSize: 128.5,
  growthRate: 15.3,
  projectCount: 2847,
  avgProjectValue: 45.2,
  monthlyTrend: [
    { month: '2024-07', value: 8.2, count: 198 },
    { month: '2024-08', value: 9.1, count: 223 },
    { month: '2024-09', value: 10.5, count: 256 },
    { month: '2024-10', value: 11.8, count: 289 },
    { month: '2024-11', value: 12.4, count: 312 },
    { month: '2024-12', value: 13.2, count: 345 },
  ],
};

// Competitor Analysis Data
export const competitorData: CompetitorData[] = [
  { name: '华安信息技术有限公司', bidCount: 156, winCount: 78, winRate: 50.0, totalAmount: 3520 },
  { name: '中科安全科技股份', bidCount: 142, winCount: 62, winRate: 43.7, totalAmount: 2890 },
  { name: '启明星辰科技', bidCount: 128, winCount: 58, winRate: 45.3, totalAmount: 2650 },
  { name: '深信服科技股份', bidCount: 118, winCount: 52, winRate: 44.1, totalAmount: 2380 },
  { name: '奇安信科技集团', bidCount: 108, winCount: 48, winRate: 44.4, totalAmount: 2120 },
  { name: '天融信科技集团', bidCount: 95, winCount: 38, winRate: 40.0, totalAmount: 1680 },
  { name: '本公司', bidCount: 86, winCount: 42, winRate: 48.8, totalAmount: 1850 },
  { name: '绿盟科技集团', bidCount: 82, winCount: 32, winRate: 39.0, totalAmount: 1420 },
];

// Self Business Analysis
export const selfBusinessData: SelfBusinessData = {
  bidCount: 86,
  winCount: 42,
  winRate: 48.8,
  totalBidAmount: 3860,
  totalWinAmount: 1850,
  monthlyData: [
    { month: '2024-07', bidCount: 12, winCount: 5 },
    { month: '2024-08', bidCount: 14, winCount: 7 },
    { month: '2024-09', bidCount: 15, winCount: 8 },
    { month: '2024-10', bidCount: 16, winCount: 8 },
    { month: '2024-11', bidCount: 14, winCount: 7 },
    { month: '2024-12', bidCount: 15, winCount: 7 },
  ],
};

// Competition Comparison
export const competitionComparison: CompetitionComparison[] = [
  { dimension: '技术能力', selfScore: 85, avgScore: 72, topScore: 92 },
  { dimension: '价格竞争力', selfScore: 78, avgScore: 75, topScore: 88 },
  { dimension: '服务响应', selfScore: 90, avgScore: 70, topScore: 95 },
  { dimension: '资质认证', selfScore: 82, avgScore: 68, topScore: 90 },
  { dimension: '行业经验', selfScore: 75, avgScore: 65, topScore: 88 },
  { dimension: '团队配置', selfScore: 80, avgScore: 70, topScore: 92 },
];

// Price Analysis
export const priceAnalysis: PriceAnalysis = {
  avgPrice: 45.2,
  minPrice: 8.5,
  maxPrice: 280,
  priceDistribution: [
    { range: '10万以下', count: 423, percentage: 14.9 },
    { range: '10-30万', count: 856, percentage: 30.1 },
    { range: '30-50万', count: 612, percentage: 21.5 },
    { range: '50-100万', count: 534, percentage: 18.8 },
    { range: '100-200万', count: 298, percentage: 10.5 },
    { range: '200万以上', count: 124, percentage: 4.4 },
  ],
};

// Region Analysis
export const regionAnalysis: RegionAnalysis[] = [
  { region: '北京', marketSize: 18.5, projectCount: 423, competitorCount: 85, intensity: 'high' },
  { region: '上海', marketSize: 15.2, projectCount: 356, competitorCount: 72, intensity: 'high' },
  { region: '广东', marketSize: 14.8, projectCount: 342, competitorCount: 68, intensity: 'high' },
  { region: '江苏', marketSize: 12.3, projectCount: 289, competitorCount: 54, intensity: 'medium' },
  { region: '浙江', marketSize: 10.5, projectCount: 245, competitorCount: 48, intensity: 'medium' },
  { region: '山东', marketSize: 9.2, projectCount: 215, competitorCount: 42, intensity: 'medium' },
  { region: '四川', marketSize: 7.8, projectCount: 182, competitorCount: 35, intensity: 'low' },
  { region: '湖北', marketSize: 6.5, projectCount: 152, competitorCount: 28, intensity: 'low' },
];

// Customer Analysis
export const customerAnalysis: CustomerAnalysis[] = [
  { type: '政府机关', count: 856, percentage: 30.1, avgBudget: 52.3 },
  { type: '国有企业', count: 612, percentage: 21.5, avgBudget: 68.5 },
  { type: '事业单位', count: 534, percentage: 18.8, avgBudget: 38.2 },
  { type: '金融机构', count: 423, percentage: 14.9, avgBudget: 85.6 },
  { type: '医疗机构', count: 256, percentage: 9.0, avgBudget: 32.8 },
  { type: '教育机构', count: 166, percentage: 5.8, avgBudget: 25.4 },
];

// Trend Prediction
export const trendPrediction: TrendPrediction[] = [
  { quarter: '2025 Q1', predictedValue: 35.2, confidence: 85, trend: 'up' },
  { quarter: '2025 Q2', predictedValue: 38.5, confidence: 78, trend: 'up' },
  { quarter: '2025 Q3', predictedValue: 32.8, confidence: 72, trend: 'down' },
  { quarter: '2025 Q4', predictedValue: 42.1, confidence: 68, trend: 'up' },
];

// Key insights for each dimension
export const dimensionInsights: Record<string, string[]> = {
  market: [
    '网络安全行业市场规模持续增长，年增长率达15.3%',
    '等保测评和渗透测试服务需求旺盛，占比超过40%',
    '政府和金融行业是主要采购方，预算充足',
  ],
  competitor: [
    '头部企业市场份额集中度较高，前5家占比超60%',
    '本公司中标率48.8%，高于行业平均水平',
    '价格竞争激烈，需要差异化竞争策略',
  ],
  self: [
    '本季度投标86次，中标42次，中标率48.8%',
    '累计中标金额1850万元，同比增长23%',
    '在等保测评领域具有明显优势',
  ],
  comparison: [
    '技术能力和服务响应是核心竞争优势',
    '价格竞争力有待提升，建议优化成本结构',
    '行业经验积累需要加强，多参与大型项目',
  ],
  price: [
    '行业均价45.2万元，中位数32万元',
    '30-50万区间项目最多，占比21.5%',
    '建议重点关注30-100万区间的优质项目',
  ],
  region: [
    '北上广是竞争最激烈的区域，需差异化策略',
    '中西部地区竞争相对较弱，可重点拓展',
    '建议加强江苏、浙江区域的市场开拓',
  ],
  customer: [
    '政府机关是最大采购方，占比30.1%',
    '金融机构项目均价最高，达85.6万元',
    '建议重点维护政府和金融行业客户关系',
  ],
  trend: [
    '预计2025年市场将继续保持两位数增长',
    'Q2是招标高峰期，需提前准备',
    '新基建政策将带来新的市场机会',
  ],
};

// ============ PRD 新增维度 ============

// Industry Overview - 行业概览
export interface IndustryOverview {
  definition: string;
  developmentStages: { year: string; event: string; impact: string }[];
  keyMetrics: { label: string; value: string; change: string; trend: 'up' | 'down' | 'stable' }[];
}

export const industryOverview: IndustryOverview = {
  definition: '网络安全等级保护测评是指对信息系统进行安全等级测评，验证其安全保护能力是否符合国家标准要求的专业服务。根据《网络安全法》和等保2.0标准，关键信息基础设施运营者需定期开展测评工作。',
  developmentStages: [
    { year: '2007', event: '等保1.0发布', impact: '确立分级保护制度' },
    { year: '2017', event: '《网络安全法》实施', impact: '法律强制要求' },
    { year: '2019', event: '等保2.0发布', impact: '云计算、大数据纳入' },
    { year: '2023', event: '数据安全法落地', impact: '数据分类分级' },
    { year: '2025', event: 'AI安全标准', impact: '智能系统测评需求增长' },
  ],
  keyMetrics: [
    { label: '市场规模', value: '128.5亿', change: '+15.3%', trend: 'up' },
    { label: '从业机构', value: '486家', change: '+12.8%', trend: 'up' },
    { label: '年度项目数', value: '28,470', change: '+18.2%', trend: 'up' },
    { label: '行业均价', value: '45.2万', change: '-3.5%', trend: 'down' },
  ],
};

// Policy and Regulations - 政策法规
export interface PolicyItem {
  id: string;
  name: string;
  issueDate: string;
  issuer: string;
  type: 'law' | 'regulation' | 'standard' | 'guideline';
  impact: 'high' | 'medium' | 'low';
  summary: string;
  implications: string[];
}

export const policyData: PolicyItem[] = [
  {
    id: 'p1',
    name: '《网络安全法》',
    issueDate: '2017-06-01',
    issuer: '全国人大常委会',
    type: 'law',
    impact: 'high',
    summary: '网络安全领域的基本法，明确等级保护制度的法律地位',
    implications: ['关键信息基础设施必须进行等级保护测评', '未落实等保要求面临处罚', '测评机构需获得资质认证'],
  },
  {
    id: 'p2',
    name: '《数据安全法》',
    issueDate: '2021-09-01',
    issuer: '全国人大常委会',
    type: 'law',
    impact: 'high',
    summary: '规范数据处理活动，保障数据安全',
    implications: ['数据分类分级保护成为强制要求', '重要数据处理需安全评估', '跨境数据流动管理趋严'],
  },
  {
    id: 'p3',
    name: 'GB/T 22239-2019 等保2.0',
    issueDate: '2019-12-01',
    issuer: '国家市场监督管理总局',
    type: 'standard',
    impact: 'high',
    summary: '网络安全等级保护基本要求，扩展云计算、物联网等新技术',
    implications: ['测评范围扩大', '技术要求更严格', '需持续监测与整改'],
  },
  {
    id: 'p4',
    name: '金融行业网络安全等级保护指引',
    issueDate: '2024-03-01',
    issuer: '中国人民银行',
    type: 'guideline',
    impact: 'medium',
    summary: '金融行业等保测评的专项要求',
    implications: ['金融机构测评周期缩短', '增加业务连续性要求', '第三方测评机构准入门槛提高'],
  },
  {
    id: 'p5',
    name: '《关键信息基础设施安全保护条例》',
    issueDate: '2021-09-01',
    issuer: '国务院',
    type: 'regulation',
    impact: 'high',
    summary: '明确关键信息基础设施保护的具体要求',
    implications: ['关基运营者责任加重', '测评周期固定为每年一次', '监管检查力度加大'],
  },
];

// Risks and Challenges - 风险与挑战
export interface RiskItem {
  id: string;
  category: 'policy' | 'market' | 'technology' | 'operation';
  title: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
}

export const riskData: RiskItem[] = [
  {
    id: 'r1',
    category: 'policy',
    title: '政策标准频繁更新',
    level: 'medium',
    description: '等保标准、行业规范持续更新，测评要求变化快，企业需要持续跟进和适应',
    mitigation: '建立政策跟踪机制，定期培训更新知识体系',
  },
  {
    id: 'r2',
    category: 'market',
    title: '价格竞争加剧',
    level: 'high',
    description: '测评机构数量增加，市场竞争激烈，部分机构低价竞标影响行业利润',
    mitigation: '提升服务质量，走差异化路线，拓展增值服务',
  },
  {
    id: 'r3',
    category: 'market',
    title: '头部企业垄断趋势',
    level: 'medium',
    description: '大型测评机构凭借品牌和资源优势，市场份额持续扩大',
    mitigation: '专注细分领域，建立区域优势，强化客户关系',
  },
  {
    id: 'r4',
    category: 'technology',
    title: '新技术测评能力不足',
    level: 'medium',
    description: 'AI、区块链、量子计算等新技术的安全测评缺乏成熟方法论',
    mitigation: '加大研发投入，参与标准制定，储备技术人才',
  },
  {
    id: 'r5',
    category: 'operation',
    title: '人才短缺',
    level: 'high',
    description: '具备资质的测评师供不应求，人力成本持续上升',
    mitigation: '建立人才培养体系，优化激励机制，拓展校企合作',
  },
  {
    id: 'r6',
    category: 'operation',
    title: '项目交付压力',
    level: 'medium',
    description: '测评周期要求紧，多项目并行时资源调配困难',
    mitigation: '优化项目管理流程，建立资源池，引入自动化工具',
  },
];

// Opportunities - 发展机遇
export interface OpportunityItem {
  id: string;
  category: 'policy' | 'market' | 'technology';
  title: string;
  potential: 'high' | 'medium' | 'low';
  description: string;
  actionSuggestion: string;
  expectedGrowth: string;
}

export const opportunityData: OpportunityItem[] = [
  {
    id: 'o1',
    category: 'policy',
    title: '数据安全法落地带来新需求',
    potential: 'high',
    description: '数据分类分级、安全评估成为强制要求，测评服务需求大增',
    actionSuggestion: '快速建立数据安全测评能力，抢占市场先机',
    expectedGrowth: '预计带来30%增量市场',
  },
  {
    id: 'o2',
    category: 'market',
    title: '金融行业合规需求旺盛',
    potential: 'high',
    description: '银保监会监管趋严，金融机构等保测评预算充足，复购率高',
    actionSuggestion: '深耕金融行业，建立专业服务团队',
    expectedGrowth: '金融行业年增长25%+',
  },
  {
    id: 'o3',
    category: 'market',
    title: '中西部市场拓展空间大',
    potential: 'medium',
    description: '中西部地区竞争强度低，政策支持力度大，市场潜力可期',
    actionSuggestion: '布局区域分支机构，建立本地化服务能力',
    expectedGrowth: '中西部市场年增长20%',
  },
  {
    id: 'o4',
    category: 'technology',
    title: '云安全测评需求爆发',
    potential: 'high',
    description: '企业上云加速，云等保测评成为刚需，且技术门槛较高',
    actionSuggestion: '加强云安全测评能力建设，获取主流云平台认证',
    expectedGrowth: '云安全市场年增长35%',
  },
  {
    id: 'o5',
    category: 'technology',
    title: 'AI安全测评新赛道',
    potential: 'medium',
    description: 'AI系统安全标准即将出台，将形成新的测评服务领域',
    actionSuggestion: '提前储备AI安全测评人才和方法论',
    expectedGrowth: '潜在市场规模50亿+',
  },
  {
    id: 'o6',
    category: 'market',
    title: '增值服务利润空间',
    potential: 'medium',
    description: '整改咨询、安全运维、应急响应等增值服务毛利率高',
    actionSuggestion: '从单一测评向安全服务综合供应商转型',
    expectedGrowth: '增值服务毛利率40%+',
  },
];

// Technology Trends - 技术趋势
export interface TechTrendItem {
  id: string;
  name: string;
  maturity: 'emerging' | 'growing' | 'mature';
  impactLevel: 'high' | 'medium' | 'low';
  description: string;
  opportunities: string[];
  timeline: string;
}

export const techTrendData: TechTrendItem[] = [
  {
    id: 't1',
    name: 'AI辅助自动化测评',
    maturity: 'growing',
    impactLevel: 'high',
    description: '利用AI技术自动化漏洞扫描、配置核查、报告生成，提升测评效率',
    opportunities: ['降低人力成本30%', '测评周期缩短50%', '标准化程度提升'],
    timeline: '2025-2027年普及',
  },
  {
    id: 't2',
    name: '云原生安全测评',
    maturity: 'growing',
    impactLevel: 'high',
    description: '针对容器、微服务、Serverless等云原生架构的专项测评方法',
    opportunities: ['云上系统测评需求大增', '技术壁垒较高', '先发优势明显'],
    timeline: '已进入快速增长期',
  },
  {
    id: 't3',
    name: '零信任架构评估',
    maturity: 'emerging',
    impactLevel: 'medium',
    description: '评估企业零信任安全架构的落地效果和合规性',
    opportunities: ['新型服务品类', '与等保融合', '差异化竞争'],
    timeline: '2026年后逐步兴起',
  },
  {
    id: 't4',
    name: '数据安全测评',
    maturity: 'growing',
    impactLevel: 'high',
    description: '数据分类分级、数据流转监控、隐私合规评估',
    opportunities: ['政策驱动刚需', '与等保形成套餐', '复购率高'],
    timeline: '2025年需求爆发',
  },
  {
    id: 't5',
    name: '物联网安全测评',
    maturity: 'growing',
    impactLevel: 'medium',
    description: '工业互联网、车联网、智能家居等IoT设备和系统的安全测评',
    opportunities: ['细分市场增长快', '专业门槛高', '政策支持'],
    timeline: '持续增长中',
  },
  {
    id: 't6',
    name: '量子安全评估',
    maturity: 'emerging',
    impactLevel: 'low',
    description: '评估现有密码体系对量子计算威胁的抵抗能力',
    opportunities: ['前沿布局', '金融、政府有需求', '标准制定参与'],
    timeline: '2028年后逐步落地',
  },
];

// Top Winning Companies - 中标企业排行榜
export interface WinningCompany {
  rank: number;
  name: string;
  winCount: number;
  winAmount: number; // in million CNY
  winRate: number;
  mainRegions: string[];
  mainIndustries: string[];
  trend: 'up' | 'down' | 'stable';
  trendChange: number; // rank change
}

export const winningCompanyRanking: WinningCompany[] = [
  { rank: 1, name: '华安信息技术有限公司', winCount: 78, winAmount: 3520, winRate: 50.0, mainRegions: ['北京', '上海', '广东'], mainIndustries: ['金融', '政府'], trend: 'stable', trendChange: 0 },
  { rank: 2, name: '中科安全科技股份', winCount: 62, winAmount: 2890, winRate: 43.7, mainRegions: ['北京', '江苏', '浙江'], mainIndustries: ['政府', '能源'], trend: 'up', trendChange: 2 },
  { rank: 3, name: '启明星辰科技', winCount: 58, winAmount: 2650, winRate: 45.3, mainRegions: ['北京', '广东', '四川'], mainIndustries: ['金融', '运营商'], trend: 'down', trendChange: -1 },
  { rank: 4, name: '深信服科技股份', winCount: 52, winAmount: 2380, winRate: 44.1, mainRegions: ['广东', '上海', '浙江'], mainIndustries: ['政府', '教育'], trend: 'stable', trendChange: 0 },
  { rank: 5, name: '奇安信科技集团', winCount: 48, winAmount: 2120, winRate: 44.4, mainRegions: ['北京', '上海', '山东'], mainIndustries: ['政府', '金融'], trend: 'up', trendChange: 1 },
  { rank: 6, name: '金盾检测技术股份', winCount: 42, winAmount: 1850, winRate: 48.8, mainRegions: ['江苏', '上海', '浙江'], mainIndustries: ['金融', '医疗'], trend: 'up', trendChange: 3 },
  { rank: 7, name: '天融信科技集团', winCount: 38, winAmount: 1680, winRate: 40.0, mainRegions: ['北京', '广东', '湖北'], mainIndustries: ['政府', '能源'], trend: 'down', trendChange: -2 },
  { rank: 8, name: '绿盟科技集团', winCount: 32, winAmount: 1420, winRate: 39.0, mainRegions: ['北京', '上海', '四川'], mainIndustries: ['运营商', '金融'], trend: 'stable', trendChange: 0 },
  { rank: 9, name: '安恒信息技术', winCount: 28, winAmount: 1280, winRate: 38.5, mainRegions: ['浙江', '江苏', '广东'], mainIndustries: ['政府', '教育'], trend: 'up', trendChange: 1 },
  { rank: 10, name: '蓝盾信息安全', winCount: 25, winAmount: 1150, winRate: 36.2, mainRegions: ['广东', '湖南', '福建'], mainIndustries: ['政府', '医疗'], trend: 'down', trendChange: -1 },
];

// Business Opportunities - 商机推荐
export interface BusinessOpportunity {
  id: string;
  title: string;
  region: string;
  budget: number; // in million CNY
  deadline: string;
  matchScore: number;
  matchReasons: string[];
  competitors: string[];
  winProbability: 'high' | 'medium' | 'low';
  tags: string[];
}

export const businessOpportunities: BusinessOpportunity[] = [
  {
    id: 'bo1',
    title: '上海市第一人民医院信息系统等保测评服务',
    region: '上海',
    budget: 85,
    deadline: '2026-02-20',
    matchScore: 98,
    matchReasons: ['医疗行业经验丰富', '上海本地团队', '资质完全匹配'],
    competitors: ['华安信息', '中科安全'],
    winProbability: 'high',
    tags: ['等保测评', '医疗卫生', '三级'],
  },
  {
    id: 'bo2',
    title: '浦东新区政务云安全运维服务采购',
    region: '上海',
    budget: 156,
    deadline: '2026-02-25',
    matchScore: 95,
    matchReasons: ['政务云经验', '安全运维能力强', '价格竞争力'],
    competitors: ['启明星辰', '深信服'],
    winProbability: 'high',
    tags: ['安全运维', '政务云', '长期服务'],
  },
  {
    id: 'bo3',
    title: '某国有银行上海分行渗透测试服务',
    region: '上海',
    budget: 68,
    deadline: '2026-02-18',
    matchScore: 92,
    matchReasons: ['金融行业资质', '渗透测试团队', '历史合作关系'],
    competitors: ['奇安信', '天融信'],
    winProbability: 'medium',
    tags: ['渗透测试', '金融', '银行'],
  },
  {
    id: 'bo4',
    title: '江苏省某市智慧城市安全评估项目',
    region: '江苏',
    budget: 120,
    deadline: '2026-03-01',
    matchScore: 88,
    matchReasons: ['智慧城市经验', '江苏本地优势', '综合评估能力'],
    competitors: ['绿盟科技', '安恒信息'],
    winProbability: 'medium',
    tags: ['安全评估', '智慧城市', '政府'],
  },
  {
    id: 'bo5',
    title: '某证券公司数据安全评估服务',
    region: '北京',
    budget: 95,
    deadline: '2026-02-28',
    matchScore: 85,
    matchReasons: ['数据安全能力', '金融行业经验'],
    competitors: ['华安信息', '中科安全', '启明星辰'],
    winProbability: 'low',
    tags: ['数据安全', '金融', '证券'],
  },
];

// ============ Industry & Competitor Configuration ============

export interface IndustryOption {
  id: string;
  name: string;
  description: string;
}

export interface CompetitorCompany {
  id: string;
  name: string;
  industry: string;
  region: string;
  addedAt: string;
}

export interface CompetitorSearchResult {
  id: string;
  name: string;
  industry: string;
  region: string;
  bidCount: number;
}

export const industryOptions: IndustryOption[] = [
  { id: 'cyber-security', name: '网络安全', description: '等保测评、渗透测试、安全运维等' },
  { id: 'software-dev', name: '软件开发', description: '定制软件、平台开发、系统集成等' },
  { id: 'system-integration', name: '系统集成', description: 'IT基础设施、数据中心、网络建设等' },
  { id: 'cloud-service', name: '云计算服务', description: '云平台、云迁移、SaaS服务等' },
  { id: 'data-service', name: '数据服务', description: '大数据分析、数据治理、BI服务等' },
  { id: 'ai-service', name: '人工智能', description: 'AI应用、机器学习、智能决策等' },
  { id: 'iot', name: '物联网', description: '智能硬件、工业互联网、车联网等' },
];

export const configuredCompetitors: CompetitorCompany[] = [
  { id: 'c1', name: '华安信息技术有限公司', industry: '网络安全', region: '北京', addedAt: '2025-12-01' },
  { id: 'c2', name: '中科安全科技股份', industry: '网络安全', region: '北京', addedAt: '2025-12-01' },
  { id: 'c3', name: '启明星辰科技', industry: '网络安全', region: '北京', addedAt: '2025-12-15' },
  { id: 'c4', name: '深信服科技股份', industry: '网络安全', region: '广东', addedAt: '2026-01-05' },
  { id: 'c5', name: '奇安信科技集团', industry: '网络安全', region: '北京', addedAt: '2026-01-05' },
];

export const competitorSearchResults: CompetitorSearchResult[] = [
  { id: 's1', name: '天融信科技集团', industry: '网络安全', region: '北京', bidCount: 95 },
  { id: 's2', name: '绿盟科技集团', industry: '网络安全', region: '北京', bidCount: 82 },
  { id: 's3', name: '安恒信息技术', industry: '网络安全', region: '浙江', bidCount: 75 },
  { id: 's4', name: '蓝盾信息安全', industry: '网络安全', region: '广东', bidCount: 68 },
  { id: 's5', name: '山石网科技术', industry: '网络安全', region: '北京', bidCount: 56 },
  { id: 's6', name: '新华三技术有限公司', industry: '系统集成', region: '浙江', bidCount: 120 },
  { id: 's7', name: '紫光股份有限公司', industry: '系统集成', region: '北京', bidCount: 98 },
  { id: 's8', name: '东软集团股份', industry: '软件开发', region: '辽宁', bidCount: 88 },
];
