// Mock data for BidInfoDailyView

import type { HistoryReport, BidInfo, AiSummary, ExpandedGroups } from './types';

export const historyReports: HistoryReport[] = [
  {
    date: '2024-01-28',
    weekday: '周日',
    total: 7,
    highMatch: 4,
    mediumMatch: 3,
    lowMatch: 0,
    summary: '发现4个高匹配项目，建议优先关注XX市政府安全项目'
  },
  {
    date: '2024-01-27',
    weekday: '周六',
    total: 5,
    highMatch: 2,
    mediumMatch: 3,
    lowMatch: 0,
    summary: '本周等保类项目活跃度上升，2个新增高匹配'
  },
  {
    date: '2024-01-26',
    weekday: '周五',
    total: 9,
    highMatch: 5,
    mediumMatch: 2,
    lowMatch: 2,
    summary: '金融行业标讯增多，5个高匹配项目值得关注'
  },
  {
    date: '2024-01-25',
    weekday: '周四',
    total: 6,
    highMatch: 3,
    mediumMatch: 2,
    lowMatch: 1,
    summary: '政府类项目3个高匹配，XX区教育局项目即将截止'
  },
  {
    date: '2024-01-24',
    weekday: '周三',
    total: 4,
    highMatch: 1,
    mediumMatch: 2,
    lowMatch: 1,
    summary: '标讯数量较少，1个高匹配密评项目'
  },
  {
    date: '2024-01-23',
    weekday: '周二',
    total: 8,
    highMatch: 4,
    mediumMatch: 3,
    lowMatch: 1,
    summary: '电力行业大项目发布，预算120万值得重点跟进'
  },
  {
    date: '2024-01-22',
    weekday: '周一',
    total: 6,
    highMatch: 2,
    mediumMatch: 3,
    lowMatch: 1,
    summary: '新一周开始，2个高匹配安全运维项目'
  }
];

export const aiSummary: AiSummary = {
  keyFocus: '发现3个高匹配度项目，建议优先跟进XX市政府信息系统安全等级保护测评服务项目，预算50万元，与公司等保业务高度匹配。',
  bidSuggestion: '本周截止项目2个（XX区教育局、XX医院），资质匹配度高，建议安排投标。',
  riskAlert: 'XX医院项目预算偏低（28万），需评估成本是否可覆盖。'
};

export const bidInfoList: BidInfo[] = [
  {
    id: 1,
    title: 'XX市政府信息系统安全等级保护测评服务项目',
    publisher: 'XX市政务服务中心',
    budget: 50,
    deadline: '2024-02-15',
    matchLevel: 'high',
    matchScore: 92,
    matchReason: '关键词匹配：等保测评、信息系统安全；地区匹配：北京。本项目要求投标单位具备等保测评资质，与公司资质高度匹配。',
    type: 'service',
    region: '北京'
  },
  {
    id: 2,
    title: 'XX银行网络安全渗透测试服务采购项目',
    publisher: 'XX银行股份有限公司',
    budget: 80,
    deadline: '2024-02-18',
    matchLevel: 'high',
    matchScore: 88,
    matchReason: '关键词匹配：渗透测试、网络安全；预算范围匹配。银行类客户，项目含金量较高。',
    type: 'service',
    region: '上海'
  },
  {
    id: 3,
    title: 'XX区教育局网络安全服务项目',
    publisher: 'XX区教育局',
    budget: 35,
    deadline: '2024-02-12',
    matchLevel: 'medium',
    matchScore: 75,
    matchReason: '关键词匹配：网络安全；预算略低于筛选范围，但属于政府类稳定客户。',
    status: 'new',
    type: 'service',
    region: '江苏'
  },
  {
    id: 4,
    title: 'XX医院信息安全等级保护咨询服务',
    publisher: 'XX市第一人民医院',
    budget: 28,
    deadline: '2024-02-14',
    matchLevel: 'medium',
    matchScore: 70,
    matchReason: '关键词匹配：等级保护；类型：咨询服务。医疗行业客户，后续可能有持续合作机会。',
    type: 'service',
    region: '北京'
  },
  {
    id: 5,
    title: 'XX集团密码应用安全性评估项目',
    publisher: 'XX集团有限公司',
    budget: 45,
    deadline: '2024-02-20',
    matchLevel: 'high',
    matchScore: 85,
    matchReason: '关键词匹配：密评；资质要求匹配。大型国企客户，项目质量有保障。',
    type: 'service',
    region: '广东'
  },
  {
    id: 6,
    title: 'XX省电力公司网络安全评估服务',
    publisher: 'XX省电力有限公司',
    budget: 120,
    deadline: '2024-02-25',
    matchLevel: 'high',
    matchScore: 90,
    matchReason: '关键词匹配：网络安全评估；预算充足，电力行业大客户。',
    type: 'service',
    region: '浙江'
  },
  {
    id: 7,
    title: 'XX市公安局安全运维服务采购',
    publisher: 'XX市公安局',
    budget: 65,
    deadline: '2024-02-22',
    matchLevel: 'medium',
    matchScore: 72,
    matchReason: '关键词匹配：安全运维；政府类客户，长期合作潜力大。',
    type: 'service',
    region: '北京'
  },
  {
    id: 8,
    title: 'XX证券公司信息安全风险评估项目',
    publisher: 'XX证券股份有限公司',
    budget: 95,
    deadline: '2024-02-28',
    matchLevel: 'high',
    matchScore: 91,
    matchReason: '关键词匹配：风险评估、信息安全；金融行业大客户，预算充足，资质匹配度高。',
    type: 'service',
    region: '上海'
  },
  {
    id: 9,
    title: 'XX大学校园网安全加固项目',
    publisher: 'XX大学',
    budget: 42,
    deadline: '2024-02-26',
    matchLevel: 'medium',
    matchScore: 68,
    matchReason: '关键词匹配：安全加固；教育行业客户，项目规模适中，可作为标杆案例。',
    type: 'service',
    region: '江苏'
  },
  {
    id: 10,
    title: 'XX保险集团数据安全评估服务',
    publisher: 'XX保险集团有限公司',
    budget: 88,
    deadline: '2024-03-01',
    matchLevel: 'high',
    matchScore: 87,
    matchReason: '关键词匹配：数据安全评估；保险行业头部客户，项目含金量高，后续合作潜力大。',
    type: 'service',
    region: '广东'
  },
  {
    id: 11,
    title: 'XX区卫生健康委员会等保测评项目',
    publisher: 'XX区卫生健康委员会',
    budget: 38,
    deadline: '2024-02-27',
    matchLevel: 'high',
    matchScore: 84,
    matchReason: '关键词匹配：等保测评；政府医疗系统客户，资质要求明确，匹配度高。',
    type: 'service',
    region: '北京'
  },
  {
    id: 12,
    title: 'XX市交通运输局网络安全监测服务',
    publisher: 'XX市交通运输局',
    budget: 55,
    deadline: '2024-03-05',
    matchLevel: 'medium',
    matchScore: 73,
    matchReason: '关键词匹配：网络安全监测；交通行业政府客户，项目周期长，稳定性好。',
    type: 'service',
    region: '浙江'
  },
  {
    id: 13,
    title: 'XX科技园区信息安全服务外包项目',
    publisher: 'XX科技园区管理委员会',
    budget: 72,
    deadline: '2024-03-08',
    matchLevel: 'medium',
    matchScore: 71,
    matchReason: '关键词匹配：信息安全服务；园区类客户，涵盖多个企业，业务拓展机会多。',
    type: 'service',
    region: '江苏'
  },
  {
    id: 14,
    title: 'XX银行分行安全设备采购项目',
    publisher: 'XX银行XX分行',
    budget: 156,
    deadline: '2024-03-10',
    matchLevel: 'low',
    matchScore: 45,
    matchReason: '类型匹配：安全设备采购；但以硬件为主，与公司主营业务匹配度较低。',
    type: 'goods',
    region: '上海'
  },
  {
    id: 15,
    title: 'XX市水务集团工控安全评估项目',
    publisher: 'XX市水务集团有限公司',
    budget: 68,
    deadline: '2024-03-12',
    matchLevel: 'medium',
    matchScore: 69,
    matchReason: '关键词匹配：工控安全评估；关键基础设施客户，专业性要求高。',
    type: 'service',
    region: '广东'
  },
];

export const defaultExpandedGroups: ExpandedGroups = {
  match: true,
  type: true,
  region: false
};
