import { Target, FileSearch, Zap } from 'lucide-vue-next';
import type { AnalysisStrategy, SelectedBidNotice, NarrativeSection } from './types';

// Re-export competition-related data from main mock file
export {
  industryOptions,
  configuredCompetitors,
  competitorSearchResults,
  configuredBiddingUnits,
  biddingUnitSearchResults,
  biddingUnitDetails,
  competitorDetails,
  projectRecords,
  competitionInsights,
} from '../../mocks/bidIndustryReport';

export type {
  CompetitorCompany,
  BiddingUnit,
  CompetitorSearchResult,
  BiddingUnitSearchResult,
  BiddingUnitDetail,
  CompetitorDetail,
  ProjectRecord,
} from '../../mocks/bidIndustryReport';

// Extra searchable data (not shown in recommend grid by default)
export const extraBiddingUnits = [
  { id: 'bux1', name: '杭州市数据资源管理局', type: '政府机关', region: '浙江' },
  { id: 'bux2', name: '南京大学', type: '教育机构', region: '江苏' },
  { id: 'bux3', name: '中国农业银行上海分行', type: '金融机构', region: '上海' },
  { id: 'bux4', name: '上海市交通委员会', type: '政府机关', region: '上海' },
  { id: 'bux5', name: '同济大学', type: '教育机构', region: '上海' },
  { id: 'bux6', name: '苏州工业园区管委会', type: '政府机关', region: '江苏' },
  { id: 'bux7', name: '招商银行上海分行', type: '金融机构', region: '上海' },
  { id: 'bux8', name: '浙江省公安厅', type: '政府机关', region: '浙江' },
];

export const extraCompetitors = [
  { id: 'cx1', name: '知道创宇科技', industry: '网络安全', region: '北京' },
  { id: 'cx2', name: '长亭科技有限公司', industry: '网络安全', region: '北京' },
  { id: 'cx3', name: '微步在线科技', industry: '威胁情报', region: '北京' },
  { id: 'cx4', name: '安天科技集团', industry: '网络安全', region: '黑龙江' },
  { id: 'cx5', name: '迪普科技股份', industry: '网络安全', region: '浙江' },
  { id: 'cx6', name: '亚信安全科技', industry: '网络安全', region: '北京' },
  { id: 'cx7', name: '瑞星安全科技', industry: '终端安全', region: '北京' },
  { id: 'cx8', name: '卫士通信息产业', industry: '密码安全', region: '四川' },
];

export const extraBidNotices: SelectedBidNotice[] = [
  { id: 'bnx1', name: '某省交通厅网络安全等保测评', client: '浙江省交通厅', budget: 220, bidDate: '2026-03-15', category: '等保测评' },
  { id: 'bnx2', name: '某高校校园网安全加固项目', client: '华东师范大学', budget: 85, bidDate: '2026-03-20', category: '安全加固' },
  { id: 'bnx3', name: '某银行数据中心安全评估', client: '兴业银行上海分行', budget: 160, bidDate: '2026-04-01', category: '安全评估' },
  { id: 'bnx4', name: '某市应急管理局态势感知建设', client: '上海市应急管理局', budget: 300, bidDate: '2026-04-10', category: '态势感知' },
  { id: 'bnx5', name: '某区医院信息安全运维服务', client: '长宁区中心医院', budget: 75, bidDate: '2026-03-25', category: '安全运维' },
  { id: 'bnx6', name: '某国企工控安全检测项目', client: '上海电气集团', budget: 250, bidDate: '2026-04-15', category: '工控安全' },
];

// Bid notice search results for the "关注的标讯" section
export const bidNoticeSearchResults: SelectedBidNotice[] = [
  { id: 'bn1', name: '某省级医院信息系统安全评估', client: '浙江省人民医院', budget: 95, bidDate: '2026-02-15', category: '安全评估' },
  { id: 'bn2', name: '某市教育局数据安全治理项目', client: '上海市教育局', budget: 150, bidDate: '2026-02-20', category: '数据安全' },
  { id: 'bn3', name: '某央企网络安全运维服务采购', client: '中国石化上海分公司', budget: 200, bidDate: '2026-03-01', category: '安全运维' },
  { id: 'bn4', name: '某金融机构渗透测试服务采购', client: '交通银行上海分行', budget: 120, bidDate: '2026-02-25', category: '渗透测试' },
  { id: 'bn5', name: '某区政务云安全监测平台建设', client: '静安区大数据中心', budget: 180, bidDate: '2026-03-10', category: '安全监测' },
];

// TemplateSidebar recent tools
export const recentTools = [
  { icon: Target, label: '行业分析报告', active: true, route: 'competition-analysis' },
  { icon: Zap, label: 'AI标书生成（一键版）', active: false, route: 'bid-doc-oneclick-form' },
  { icon: FileSearch, label: '标讯解读', active: false, route: 'bid-analysis-form' },
];

// InfoSidebar features - sales oriented
export const features = [
  '一键生成行业分析报告，降低分析门槛',
  '智能推荐关注的招标单位和竞争对手',
  '竞争对手「如何赢他」策略建议',
  '丢单原因统计与能力提升建议',
  '可执行的行动建议和客户维护计划',
  '个人策略保存与快速加载',
];

// Region options for filtering
export const regionOptions = [
  { id: 'all', name: '全国' },
  { id: 'shanghai', name: '上海' },
  { id: 'beijing', name: '北京' },
  { id: 'guangdong', name: '广东' },
  { id: 'jiangsu', name: '江苏' },
  { id: 'zhejiang', name: '浙江' },
];

// Sales tips by dimension
export const salesTips: Record<string, string[]> = {
  bu1: [
    '该单位 Q2 集中采购，建议提前1个月联系决策人',
    '偏好等保测评+安全运维打包采购，建议组合报价',
    '与华安信息正面竞争时，强调本地化服务和响应速度',
  ],
  bu2: [
    '政务服务中心预算审批周期长，建议 Q1 就开始接触',
    '对数据分类分级服务需求增长，可作为切入点',
    '本公司在该单位中标率最高，持续维护客户关系',
  ],
};

// How to win strategies per competitor
export const howToWin: Record<string, { title: string; tips: string[] }> = {
  c1: {
    title: '如何赢华安信息',
    tips: [
      '价格策略：华安报价高于市场均价 15%，在价格敏感客户中强调性价比',
      '服务策略：华安交付周期长，强调我们的快速响应和本地化团队',
      '技术策略：在等保测评领域我们技术方案得分相当，重点突出服务差异化',
    ],
  },
  c2: {
    title: '如何赢中科安全',
    tips: [
      '区域策略：中科安全华东市场覆盖弱，利用本地优势快速响应客户需求',
      '案例策略：在数据安全领域补充成功案例，缩小与中科安全的差距',
      '关系策略：中科安全政府关系好但服务团队规模有限，用团队规模和服务质量竞争',
    ],
  },
};

// Overview conclusions for the report
export const overviewConclusions = [
  { type: 'positive' as const, label: '优势领域', content: '等保测评和安全加固类项目中标率超50%，是核心竞争力所在' },
  { type: 'negative' as const, label: '劣势领域', content: '渗透测试和数据安全类项目中标率偏低，需重点提升行业案例' },
  { type: 'warning' as const, label: '关键对手', content: '华安信息是最大竞争威胁，正面交锋胜率仅35.7%，需制定针对性策略' },
  { type: 'positive' as const, label: '优势客户', content: '浦东新区政务服务中心中标率27.8%，是最稳定的客户关系' },
];

// Action recommendations
export const actionRecommendations = {
  weeklyFocus: [
    {
      project: '某证券公司网络安全态势感知平台',
      budget: 280,
      deadline: '2026-02-01',
      suggestion: '重点准备技术方案，突出安全运维经验，预计主要对手为深信服和启明星辰',
      mainCompetitors: ['深信服科技股份', '启明星辰科技'],
    },
  ],
  capabilityImprovement: [
    { area: '金融行业案例', priority: 'high' as const, suggestion: '当前丢单40%因行业案例不足，建议主动拓展金融行业中小项目积累案例' },
    { area: '数据安全能力', priority: 'high' as const, suggestion: '数据安全市场快速增长，建议组建专项团队、获取数据安全相关资质' },
    { area: '渗透测试团队', priority: 'medium' as const, suggestion: '渗透测试项目竞争力不足，建议引进高级安全工程师提升技术方案得分' },
  ],
  competitorStrategies: [
    { competitor: '华安信息技术有限公司', strategy: '利用价格和服务响应速度优势，在中小项目中抢占份额' },
    { competitor: '中科安全科技股份', strategy: '加强数据安全领域能力建设，缩小技术差距，利用华东本地优势' },
    { competitor: '启明星辰科技', strategy: '关注其在政务领域的扩张动向，提前布局关键客户关系' },
  ],
  customerMaintenance: [
    { client: '上海市大数据中心', lastContact: '2026-01-15', nextAction: '跟进 Q2 等保测评项目需求，预约技术交流会', priority: 'high' as const },
    { client: '浦东新区政务服务中心', lastContact: '2025-10-15', nextAction: '回访政务外网安全加固项目，了解后续安全评估计划', priority: 'medium' as const },
    { client: '中国工商银行上海分行', lastContact: '2025-12-05', nextAction: '丢单后回访，展示金融行业新案例，争取下次合作机会', priority: 'high' as const },
  ],
};

// Analysis Strategies mock data
export const savedStrategies: AnalysisStrategy[] = [
  {
    id: 'st1',
    name: '华东区政务云竞争分析',
    description: '针对上海、江苏、浙江区域政务云项目的竞争态势分析',
    industry: 'cyber-security',
    biddingUnitIds: ['bu1', 'bu2'],
    competitorIds: ['c1', 'c3'],
    timeRange: '本年度',
    regions: ['上海', '江苏', '浙江'],
    createdAt: '2026-01-15',
  },
  {
    id: 'st2',
    name: '金融行业对标分析',
    description: '金融行业等保测评和渗透测试业务竞争分析',
    industry: 'cyber-security',
    biddingUnitIds: ['bu3'],
    competitorIds: ['c1', 'c2', 'c5'],
    timeRange: '本季度',
    regions: ['全国'],
    createdAt: '2026-01-20',
  },
  {
    id: 'st3',
    name: '教育行业市场拓展',
    description: '教育机构信息安全项目的竞争格局和市场机会',
    industry: 'cyber-security',
    biddingUnitIds: ['bu4'],
    competitorIds: ['c4'],
    timeRange: '近两年',
    regions: ['上海'],
    createdAt: '2026-02-01',
  },
];

// ============ Narrative Report Data ============

export const narrativeOverview: NarrativeSection = {
  id: 'overview',
  title: '一、总览与结论',
  paragraphs: [
    {
      type: 'text',
      content: '本报告基于网络安全行业<strong>本季度</strong>的公开招投标数据，覆盖<strong>5家</strong>重点招标单位和<strong>5家</strong>主要竞争对手，对共计<strong>8个</strong>跟踪项目进行了深度分析。报告旨在帮助销售团队全面了解当前竞争态势，制定有针对性的销售策略。',
    },
    {
      type: 'text',
      content: '从整体数据来看，本公司在网络安全行业的中标率约为<strong>37.5%</strong>，略高于行业平均水平。在等保测评和安全加固两个细分领域表现突出，中标率超过<strong>50%</strong>，是本公司的核心竞争力所在。然而，在渗透测试和数据安全领域的中标率明显偏低，分别仅为<strong>20%</strong>和<strong>15%</strong>，成为制约业务增长的主要瓶颈。',
    },
    {
      type: 'highlight-box',
      boxType: 'positive',
      content: '<strong>优势领域：</strong>等保测评和安全加固类项目中标率超50%，技术方案评分长期处于前列，是本公司最具竞争力的业务方向。建议在这两个领域加大资源投入，巩固领先优势。',
    },
    {
      type: 'highlight-box',
      boxType: 'negative',
      content: '<strong>劣势领域：</strong>渗透测试和数据安全类项目中标率偏低，主要原因在于行业案例积累不足、专项团队人员紧缺。需要在未来两个季度内重点补强。',
    },
    {
      type: 'highlight-box',
      boxType: 'warning',
      content: '<strong>关键对手：</strong>华安信息是最大竞争威胁，与本公司正面交锋<strong>14次</strong>，本公司胜出率仅为<strong>35.7%</strong>。该对手在品牌知名度和政府资源方面具有较大优势，需要制定专项应对策略。',
    },
    {
      type: 'numbered-list',
      content: '本季度核心发现摘要：',
      items: [
        '等保测评领域中标率<strong>52%</strong>，持续保持行业第一梯队，是销售主攻方向',
        '华安信息在政务领域快速扩张，已在<strong>3个</strong>新客户中标，需密切关注',
        '浦东新区政务服务中心是最稳定的客户关系，历史中标率<strong>27.8%</strong>，Q2有新采购计划',
        '丢单原因中"行业案例不足"占比<strong>40%</strong>，是当前最需要解决的短板',
      ],
    },
  ],
};

export const narrativeBiddingUnits: NarrativeSection = {
  id: 'biddingUnit',
  title: '二、招标单位分析',
  paragraphs: [
    {
      type: 'text',
      content: '本季度重点跟踪的招标单位共<strong>5家</strong>，涵盖政务、金融、教育等行业领域。通过对各招标单位历史采购数据的分析，我们识别出了各单位的采购偏好、预算趋势和竞争格局，为精准营销提供数据支撑。',
    },
    {
      type: 'text',
      content: '<strong>上海市大数据中心</strong>是本季度最重要的招标单位之一，历史项目数达到<strong>18个</strong>，累计采购金额<strong>2850万</strong>，平均项目预算约<strong>158万</strong>。该单位偏好等保测评和安全运维打包采购，通常在Q2集中发标。从中标企业分布来看，华安信息以<strong>5次</strong>中标位居第一，本公司以<strong>4次</strong>紧随其后，与中科安全并列第二。',
    },
    {
      type: 'text',
      content: '<strong>浦东新区政务服务中心</strong>是本公司中标率最高的客户，历史项目数<strong>12个</strong>，本公司中标<strong>4次</strong>，中标率达到<strong>33.3%</strong>。该单位近年来对数据分类分级服务需求明显增长，可作为新的业务切入点。需要注意的是，政务服务中心的预算审批周期较长，建议提前至少<strong>2个月</strong>开始商务接触。',
    },
    {
      type: 'text',
      content: '<strong>中国工商银行上海分行</strong>是金融行业的代表性客户，累计采购金额<strong>1200万</strong>，单项目预算较高。但本公司在该客户的中标率仅为<strong>16.7%</strong>，主要受制于金融行业案例不足。近期竞争对手中科安全在该客户连续中标<strong>2次</strong>，形势不容乐观。',
    },
    {
      type: 'highlight-box',
      boxType: 'positive',
      content: '<strong>销售建议：</strong>针对上海市大数据中心，建议在Q1末即开始接触决策人，准备等保测评+安全运维的组合方案；针对浦东新区政务服务中心，重点推进数据分类分级服务的试点合作，以新业务巩固老客户关系。',
    },
    {
      type: 'highlight-box',
      boxType: 'warning',
      content: '<strong>风险提示：</strong>中国工商银行上海分行的下一轮网络安全评估预计在Q2启动，预算约<strong>180万</strong>。本公司上次投标因行业案例不足丢单，需要在投标前完成至少<strong>1-2个</strong>金融行业案例的积累，否则再次参标的胜率很低。',
    },
  ],
};

export const narrativeCompetitors: NarrativeSection = {
  id: 'competitor',
  title: '三、竞争对手分析',
  paragraphs: [
    {
      type: 'text',
      content: '本季度跟踪的<strong>5家</strong>主要竞争对手中，华安信息和中科安全构成最大竞争威胁。以下从投标频次、中标率、业务领域等维度进行逐一分析，并给出针对性的竞争策略。',
    },
    {
      type: 'text',
      content: '<strong>华安信息技术有限公司</strong>是网络安全行业头部企业，本季度投标<strong>28次</strong>，中标<strong>12次</strong>，中标率<strong>42.9%</strong>，中标金额合计<strong>1560万</strong>。与本公司正面交锋<strong>14次</strong>，本公司胜出率仅<strong>35.7%</strong>。华安信息的优势在于品牌知名度高、政府资源丰富、团队规模大；劣势在于报价高于市场均价约<strong>15%</strong>、交付周期偏长、对中小客户服务响应慢。',
    },
    {
      type: 'highlight-box',
      boxType: 'warning',
      content: '<strong>如何赢华安信息：</strong>在价格敏感客户中强调性价比优势（华安报价高15%）；在交付要求紧急的项目中突出本公司的快速响应能力和本地化团队配置；在等保测评领域，技术方案得分与华安相当，重点打服务差异化。',
    },
    {
      type: 'text',
      content: '<strong>中科安全科技股份</strong>在数据安全领域具有明显优势，本季度投标<strong>22次</strong>，中标<strong>8次</strong>，中标率<strong>36.4%</strong>。与本公司正面交锋<strong>10次</strong>，本公司胜出率<strong>40%</strong>。中科安全在华东市场的覆盖相对较弱，但其政府关系网络正在快速扩展。近期在金融领域连续中标<strong>2次</strong>，值得警惕。',
    },
    {
      type: 'highlight-box',
      boxType: 'warning',
      content: '<strong>如何赢中科安全：</strong>利用华东市场本地优势快速响应客户需求；在数据安全领域加强案例积累以缩小技术差距；中科安全服务团队规模有限，可用本公司团队规模和服务质量形成竞争壁垒。',
    },
    {
      type: 'text',
      content: '其余三家竞争对手——<strong>启明星辰</strong>、<strong>绿盟科技</strong>和<strong>深信服</strong>的威胁程度相对较低，但需持续关注其在各自优势领域的动向。启明星辰正在积极布局政务安全领域，绿盟科技在安全运维方面积累深厚，深信服则在态势感知平台类项目中具备一定技术优势。',
    },
    {
      type: 'numbered-list',
      content: '竞争突破要点：',
      items: [
        '对华安信息：主打性价比和服务响应速度，重点抢占<strong>中小项目</strong>',
        '对中科安全：补强数据安全案例，利用<strong>本地化优势</strong>在华东市场竞争',
        '对启明星辰：提前布局其正在拓展的<strong>政务安全</strong>客户关系',
        '对深信服：在态势感知类项目中强调<strong>定制化能力</strong>和行业理解',
      ],
    },
  ],
};

export const narrativeProjects: NarrativeSection = {
  id: 'project',
  title: '四、项目分析',
  paragraphs: [
    {
      type: 'text',
      content: '本季度共跟踪<strong>8个</strong>重点项目，其中已中标<strong>3个</strong>、未中标<strong>3个</strong>、待开标<strong>2个</strong>。已中标项目合同总金额约<strong>425万</strong>，整体中标率<strong>37.5%</strong>（不含待开标项目则为<strong>50%</strong>）。',
    },
    {
      type: 'text',
      content: '从项目类型分布来看，等保测评和安全加固类项目表现最好，<strong>3个</strong>投标项目中标<strong>2个</strong>。渗透测试类项目是最大的短板，<strong>2个</strong>投标项目均未中标。数据安全类项目仅中标<strong>1个</strong>，且为中小规模项目，在大型数据安全项目中仍缺乏竞争力。',
    },
    {
      type: 'highlight-box',
      boxType: 'negative',
      content: '<strong>丢单原因分析：</strong>在3个未中标项目中，<strong>行业案例不足</strong>是最主要的丢单原因（占比40%），其次是<strong>价格竞争力不足</strong>（占比33%）和<strong>技术方案评分偏低</strong>（占比27%）。行业案例不足的问题在金融和教育行业尤为突出。',
    },
    {
      type: 'text',
      content: '重点关注项目：<strong>某证券公司网络安全态势感知平台</strong>（预算280万，待开标），这是本季度金额最大的跟踪项目。预计主要竞争对手为深信服和启明星辰，本公司需要在技术方案中重点突出安全运维经验。建议提前与客户技术团队进行交流，了解其对态势感知平台的具体需求和评标权重。',
    },
    {
      type: 'text',
      content: '另一个值得关注的项目是<strong>某区政务云安全监测平台建设</strong>（预算180万，待开标），该项目发标单位是本公司的优势客户区域，胜率较高。但需注意启明星辰近期在政务安全领域的积极布局，可能会成为新的竞争变量。',
    },
    {
      type: 'highlight-box',
      boxType: 'positive',
      content: '<strong>中标经验总结：</strong>已中标的3个项目有一个共同特征——本公司在投标前均与客户进行了至少<strong>2次</strong>技术交流，且报价控制在预算的<strong>85%-90%</strong>区间内。这一经验值得在后续投标中推广。',
    },
  ],
};

export const narrativeActions: NarrativeSection = {
  id: 'action',
  title: '五、行动建议',
  paragraphs: [
    {
      type: 'text',
      content: '基于以上分析，我们从<strong>本周重点</strong>、<strong>能力提升</strong>和<strong>客户维护</strong>三个维度提出以下行动建议，建议销售团队根据优先级有序推进。',
    },
    {
      type: 'highlight-box',
      boxType: 'warning',
      content: '<strong>本周重点：</strong>某证券公司网络安全态势感知平台项目（预算280万）即将进入投标阶段，需要本周内完成技术方案初稿，重点突出本公司在安全运维领域的成功案例。预计主要对手为深信服和启明星辰，建议报价控制在预算的85%左右。',
    },
    {
      type: 'numbered-list',
      content: '能力提升行动项（按优先级排序）：',
      items: [
        '<strong>[高优先]</strong> 金融行业案例积累：当前丢单40%因行业案例不足，建议主动拓展金融行业中小项目（50万以下），以低门槛项目快速积累行业案例',
        '<strong>[高优先]</strong> 数据安全能力建设：数据安全市场年增速超30%，建议本季度内组建3人专项团队，Q2前获取数据安全相关资质认证',
        '<strong>[中优先]</strong> 渗透测试团队扩充：渗透测试项目竞争力不足，建议引进1-2名高级安全工程师，重点提升技术方案得分',
      ],
    },
    {
      type: 'highlight-box',
      boxType: 'positive',
      content: '<strong>客户维护计划：</strong>上海市大数据中心（上次联系：2026-01-15）——跟进Q2等保测评项目需求，预约技术交流会；浦东新区政务服务中心（上次联系：2025-10-15）——回访政务外网安全加固项目，了解后续安全评估计划；中国工商银行上海分行（上次联系：2025-12-05）——丢单后回访，展示金融行业新案例，争取下次合作机会。',
    },
    {
      type: 'numbered-list',
      content: '竞争策略执行清单：',
      items: [
        '针对华安信息：在本月内梳理<strong>3个</strong>价格敏感型客户清单，准备差异化报价方案',
        '针对中科安全：加速数据安全领域案例积累，缩小与中科安全的差距',
        '针对启明星辰：关注其在政务领域的最新中标动态，提前布局<strong>2个</strong>关键客户关系',
      ],
    },
    {
      type: 'quote',
      content: '销售策略的核心在于"知己知彼"。本季度的重点是巩固等保测评领域的优势地位，同时有计划地补强金融行业案例和数据安全能力，为下半年的业务增长奠定基础。',
    },
  ],
};
