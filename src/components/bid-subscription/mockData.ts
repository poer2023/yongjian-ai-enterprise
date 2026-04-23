// Mock data for BidSubscriptionView

import type {
  PolicyGroup,
  DateOption,
  BidHighlight,
  BidItem,
  DayData,
  DataByPolicy,
  IndustryTag,
  CompetitorCompany,
  NewsPolicyGroup,
  NewsDataByPolicy,
  NewsDetail,
} from './types';

export const policyGroups: PolicyGroup[] = [
  { id: 'security', name: '网络安全组', color: '#10b981', newCount: 8 },
  { id: 'dengbao', name: '等保测评组', color: '#f59e0b', newCount: 4 }
];

export const newsPolicyGroups: NewsPolicyGroup[] = [
  {
    id: 'overview',
    name: '综合资讯组',
    color: '#2563eb',
    newCount: 16,
    categoryStats: { bidding: 5, industry: 7, product: 4 }
  },
  {
    id: 'ai-agent',
    name: 'AI Agent 组',
    color: '#7c3aed',
    newCount: 9,
    categoryStats: { bidding: 1, industry: 4, product: 4 }
  },
  {
    id: 'bidding-watch',
    name: '标讯关注组',
    color: '#0f766e',
    newCount: 6,
    categoryStats: { bidding: 6, industry: 0, product: 0 }
  }
];

export const dateOptions: DateOption[] = [
  { label: '今天', date: '2026-02-04', offset: 0 },
  { label: '昨天', date: '2026-02-03', offset: -1 },
  { label: '前天', date: '2026-02-02', offset: -2 }
];

export const dataByPolicyAndDate: DataByPolicy = {
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

export const newsDataByPolicyAndDate: NewsDataByPolicy = {
  overview: {
    '2026-02-04': {
      summary: `今日共汇总资讯 26 条，其中高相关内容 8 条。AI Agent、企业协同和政企采购三个方向最活跃；其中“标讯”作为资讯分类之一，今日新增 5 条重点机会。`,
      highlights: [
        { id: 9001, title: '飞书发布新一代企业 Agent 协同能力，开放多角色工作流编排', source: '飞书开放平台', publishedAt: '今天 08:30', category: '产品动态', matchScore: 97, tags: ['AI Agent', '飞书', '企业服务'] },
        { id: 9002, title: '企业知识库接入与权限治理成为本周 SaaS 热点话题', source: '虎嗅 Pro', publishedAt: '今天 10:00', category: '行业资讯', matchScore: 92, tags: ['知识库', '权限治理', 'SaaS'] },
        { id: 9003, title: '某市政务云智能助手建设项目启动采购，预算 180 万元', source: '政采公告网', publishedAt: '今天 11:20', category: '标讯', matchScore: 95, tags: ['标讯', '政务云', '智能助手'] }
      ],
      allItems: [
        { id: 9001, title: '飞书发布新一代企业 Agent 协同能力，开放多角色工作流编排', source: '飞书开放平台', matchScore: 97 },
        { id: 9002, title: '企业知识库接入与权限治理成为本周 SaaS 热点话题', source: '虎嗅 Pro', matchScore: 92 },
        { id: 9003, title: '某市政务云智能助手建设项目启动采购，预算 180 万元', source: '政采公告网', matchScore: 95 },
        { id: 9004, title: '钉钉生态新增多项 AI 插件能力，强调组织级权限管理', source: '钉钉开放平台', matchScore: 90 },
        { id: 9005, title: '企业微信服务市场加速接入垂直行业智能体方案', source: '36Kr', matchScore: 88 },
        { id: 9006, title: '某大型集团启动数据顾问与知识助手项目招标', source: '招标网', matchScore: 89 }
      ]
    },
    '2026-02-03': {
      summary: `昨日共汇总资讯 21 条，行业资讯与标讯信息保持平稳。AI 办公、知识助手和政企数字化是出现频率最高的主题。`,
      highlights: [
        { id: 9011, title: '多家企业开始将知识库问答与工单系统打通，提升客服处理效率', source: 'InfoQ', publishedAt: '昨天 14:10', category: '行业资讯', matchScore: 91, tags: ['知识库', '客服', '工单'] },
        { id: 9012, title: '某省级平台发布企业知识助手采购公告，聚焦权限审计能力', source: '政府采购网', publishedAt: '昨天 09:45', category: '标讯', matchScore: 94, tags: ['标讯', '知识助手', '审计'] }
      ],
      allItems: [
        { id: 9011, title: '多家企业开始将知识库问答与工单系统打通，提升客服处理效率', source: 'InfoQ', matchScore: 91 },
        { id: 9012, title: '某省级平台发布企业知识助手采购公告，聚焦权限审计能力', source: '政府采购网', matchScore: 94 },
        { id: 9013, title: '企业级 AI 助手产品竞争加剧，厂商开始主打权限分层与接入能力', source: '极客公园', matchScore: 87 }
      ]
    },
    '2026-02-02': {
      summary: `前日共汇总资讯 18 条，企业服务与招投标方向热度上升。标讯类资讯占比约 30%，适合单独关注。`,
      highlights: [
        { id: 9021, title: '某医疗集团发布 AI 智能客服建设招标公告', source: '招标网', publishedAt: '前天 15:20', category: '标讯', matchScore: 93, tags: ['标讯', '智能客服', '医疗'] },
        { id: 9022, title: '多家 SaaS 厂商推出“工作流 + 智能体”新方案，聚焦中后台提效', source: '36Kr', publishedAt: '前天 11:00', category: '行业资讯', matchScore: 89, tags: ['智能体', '工作流', 'SaaS'] }
      ],
      allItems: [
        { id: 9021, title: '某医疗集团发布 AI 智能客服建设招标公告', source: '招标网', matchScore: 93 },
        { id: 9022, title: '多家 SaaS 厂商推出“工作流 + 智能体”新方案，聚焦中后台提效', source: '36Kr', matchScore: 89 },
        { id: 9023, title: '知识中台与数据接入平台在大型企业中成为重点建设方向', source: '雷峰网', matchScore: 85 }
      ]
    }
  },
  'ai-agent': {
    '2026-02-04': {
      summary: `【AI Agent 组】今日共汇总相关资讯 12 条，其中产品动态与开放生态消息最值得关注。`,
      highlights: [
        { id: 9101, title: '飞书开放平台升级 Agent 编排能力，支持知识库与审批流联动', source: '飞书开放平台', publishedAt: '今天 08:30', category: '产品动态', matchScore: 97, tags: ['飞书', 'Agent', '流程编排'] },
        { id: 9102, title: '钉钉公布企业智能体接入新方案，强调组织权限与数据边界', source: '钉钉开放平台', publishedAt: '今天 09:20', category: '产品动态', matchScore: 95, tags: ['钉钉', '权限', '智能体'] }
      ],
      allItems: [
        { id: 9101, title: '飞书开放平台升级 Agent 编排能力，支持知识库与审批流联动', source: '飞书开放平台', matchScore: 97 },
        { id: 9102, title: '钉钉公布企业智能体接入新方案，强调组织权限与数据边界', source: '钉钉开放平台', matchScore: 95 },
        { id: 9103, title: '企业级 Agent 产品开始从单点问答转向多角色协同', source: '虎嗅 Pro', matchScore: 90 }
      ]
    }
  },
  'bidding-watch': {
    '2026-02-04': {
      summary: `【标讯关注组】今日共汇总标讯类资讯 9 条，其中 3 条与企业版智能体方向高度相关。`,
      highlights: [
        { id: 9201, title: '某市政务云智能助手建设项目启动采购，预算 180 万元', source: '政采公告网', publishedAt: '今天 11:20', category: '标讯', matchScore: 95, tags: ['标讯', '政务云', '智能助手'] },
        { id: 9202, title: '某大型集团启动数据顾问与知识助手项目招标', source: '招标网', publishedAt: '今天 13:10', category: '标讯', matchScore: 92, tags: ['标讯', '数据顾问', '知识助手'] }
      ],
      allItems: [
        { id: 9201, title: '某市政务云智能助手建设项目启动采购，预算 180 万元', source: '政采公告网', matchScore: 95 },
        { id: 9202, title: '某大型集团启动数据顾问与知识助手项目招标', source: '招标网', matchScore: 92 },
        { id: 9203, title: '某医院客服与工单一体化平台采购启动', source: '政府采购网', matchScore: 88 }
      ]
    }
  }
};

export const newsDetails: Record<number, NewsDetail> = {
  9001: {
    id: 9001,
    title: '飞书发布新一代企业 Agent 协同能力，开放多角色工作流编排',
    source: '飞书开放平台',
    matchScore: 97,
    publishedAt: '今天 08:30',
    category: '产品动态',
    author: '产品资讯编译',
    summary: '飞书此次更新重点强化了多角色协同、知识库联动和审批流编排能力，适合关注企业智能体落地路径的团队持续跟进。',
    keyPoints: [
      '支持知识库、审批流和任务编排联动。',
      '强调组织级权限、角色分工和审计可追踪。',
      '适合与企业内部知识助手场景联动观察。',
    ],
    recommendations: [
      '加入知识库，作为企业 Agent 产品能力样本。',
      '交给数据顾问，提炼与现有需求的重合点。',
    ],
  },
  9002: {
    id: 9002,
    title: '企业知识库接入与权限治理成为本周 SaaS 热点话题',
    source: '虎嗅 Pro',
    matchScore: 92,
    publishedAt: '今天 10:00',
    category: '行业资讯',
    author: '行业编辑部',
    summary: '本篇内容集中讨论企业知识库建设中的接入能力、权限边界和问答可信度问题，与当前数据顾问和知识助手需求高度相关。',
    keyPoints: [
      '接入多源文档与权限治理成为企业落地关键。',
      '问答场景开始强调来源引用和审计记录。',
      '知识平台正从内容沉淀转向可执行的业务支持。',
    ],
    recommendations: [
      '加入知识库并打上“权限治理”标签。',
      '作为数据顾问与客服智能体的参考资料。',
    ],
  },
  9003: {
    id: 9003,
    title: '某市政务云智能助手建设项目启动采购，预算 180 万元',
    source: '政采公告网',
    matchScore: 95,
    publishedAt: '今天 11:20',
    category: '标讯',
    author: '招采监测引擎',
    summary: '该项目聚焦政务云场景下的智能助手建设，适合纳入标讯订阅重点跟踪，作为行业机会同步观察。',
    keyPoints: [
      '需求包含知识问答、权限控制和审计能力。',
      '预算规模适中，适合列为高优先级跟踪项目。',
      '可结合数据顾问能力评估可复用模块。',
    ],
    recommendations: [
      '同步加入标讯解读流程进一步分析。',
      '转给销售管理智能体，补充后续跟进动作。',
    ],
  },
  9201: {
    id: 9201,
    title: '某市政务云智能助手建设项目启动采购，预算 180 万元',
    source: '政采公告网',
    matchScore: 95,
    publishedAt: '今天 11:20',
    category: '标讯',
    author: '招采监测引擎',
    summary: '该标讯已纳入标讯订阅重点监测，适合演示统一订阅入口下的跟踪方式。',
    keyPoints: [
      '可从标讯订阅直接进入相关跟踪流程。',
      '筛选维度与当前标讯订阅逻辑保持一致。',
    ],
    recommendations: [
      '进入标讯解读查看原文结构。',
      '进入数据顾问补充机会分析。',
    ],
  },
  9202: {
    id: 9202,
    title: '某大型集团启动数据顾问与知识助手项目招标',
    source: '招标网',
    matchScore: 92,
    publishedAt: '今天 13:10',
    category: '标讯',
    author: '招采监测引擎',
    summary: '该项目与当前 business-full 的补充需求高度贴近，适合作为重点跟踪内容放入“标讯”分类。',
    keyPoints: [
      '需求覆盖数据顾问、知识助手和权限控制。',
      '适合与现有 demo 模块做能力映射。',
    ],
    recommendations: [
      '加入知识库做需求映射。',
      '交给销售管理智能体生成跟进建议。',
    ],
  },
};
