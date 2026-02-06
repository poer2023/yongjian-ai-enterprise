// Mock data for BidSubscriptionView

import type { PolicyGroup, DateOption, BidHighlight, BidItem, DayData, DataByPolicy } from './types';

export const policyGroups: PolicyGroup[] = [
  { id: 'security', name: '网络安全组', color: '#10b981', newCount: 8 },
  { id: 'dengbao', name: '等保测评组', color: '#f59e0b', newCount: 4 }
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
