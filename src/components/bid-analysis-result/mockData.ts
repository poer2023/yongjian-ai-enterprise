import type {
  ProjectInfo,
  Qualification,
  ScoreStandard,
  TimelineItem,
  MatchAssessment,
  PerformanceRequirement,
  TeamRequirement,
  CommitmentRequirement,
  DisqualificationItem,
  ActionPlanItem,
  DocumentSection
} from './types';

export const projectInfo: ProjectInfo = {
  name: 'XX市政府信息系统安全等级保护测评服务项目',
  purchaser: 'XX市政务服务中心',
  budget: 50,
  deadline: '2024-02-15',
  openTime: '2024-02-20 09:00',
  projectType: '服务类',
  bidMethod: '公开招标',
};

export const qualifications: Qualification[] = [
  { id: 1, requirement: '具有等级保护测评资质', status: 'match', detail: '我方已具备', targetSection: 'doc-professional-qualification', searchText: '等级保护测评机构资质证书' },
  { id: 2, requirement: 'ISO27001信息安全管理体系认证', status: 'match', detail: '有效期至2025-12', targetSection: 'doc-professional-qualification', searchText: 'ISO27001信息安全管理体系认证' },
  { id: 3, requirement: '3年以上同类项目业绩（至少3个）', status: 'match', detail: '我方具备5个', targetSection: 'doc-professional-qualification', searchText: '近三年内完成过至少3个同类项目业绩' },
  { id: 4, requirement: '注册资金500万元以上', status: 'match', detail: '我方1000万元', targetSection: 'doc-basic-qualification', searchText: '注册资金500万元人民币以上' },
  { id: 5, requirement: '项目负责人需持有CISP证书', status: 'partial', detail: '待确认人员安排', targetSection: 'doc-team-requirement', searchText: '项目负责人需持有CISP' },
];

export const scoreStandards: ScoreStandard[] = [
  { item: '技术方案', score: 40, points: '测评方案完整性、工具先进性、方法论科学性', strategy: '重点突出自研工具和方法论优势' },
  { item: '项目业绩', score: 25, points: '同类项目数量、规模、客户评价', strategy: '列举TOP5政府类等保测评业绩' },
  { item: '团队配置', score: 20, points: '人员资质、经验、稳定性', strategy: '配置高级测评师，突出团队经验' },
  { item: '报价', score: 15, points: '价格合理性、性价比', strategy: '建议报价42万（预算的84%）' },
];

export const timeline: TimelineItem[] = [
  { date: '2024-02-12', event: '答疑截止', urgent: true, targetSection: 'doc-timeline-nodes', searchText: '答疑截止时间：2024年2月12日' },
  { date: '2024-02-15', event: '报名截止', urgent: true, targetSection: 'doc-timeline-nodes', searchText: '投标文件递交截止时间：2024年2月15日' },
  { date: '2024-02-20 09:00', event: '开标时间', urgent: false, targetSection: 'doc-timeline-nodes', searchText: '开标时间：2024年2月20日09:00' },
  { date: '2024-03-01', event: '预计中标公示', urgent: false, targetSection: 'doc-timeline-nodes', searchText: '预计中标公示时间：2024年3月1日' },
];

export const matchAssessment: MatchAssessment = {
  score: 92,
  recommendation: '强烈建议投标',
  reasons: [
    '资质要求完全满足',
    '业绩经验丰富',
    '技术能力匹配',
    '预算范围合理',
  ],
};

export const suggestions: string[] = [
  '技术方案重点突出自研等保测评平台和自动化工具',
  '配置项目经理张三（高级等保测评师，10年经验）',
  '列举与政府类客户合作的成功案例',
  '建议报价区间：40-45万元',
  '注意答疑截止时间，如有疑问尽早提出',
];

export const performanceRequirements: PerformanceRequirement[] = [
  { requirement: '近三年同类项目数量', value: '≥3个', status: 'match', detail: '我方具备5个', targetSection: 'doc-performance-requirement', searchText: '近三年内完成过至少3个同类项目业绩' },
  { requirement: '单个项目合同金额', value: '≥20万元', status: 'match', detail: '最高项目金额80万', targetSection: 'doc-performance-requirement', searchText: '单个项目合同金额不低于20万元' },
  { requirement: '业绩时间范围', value: '2021年1月后', status: 'match', detail: '均在有效期内', targetSection: 'doc-performance-requirement', searchText: '业绩时间范围：2021年1月后' },
  { requirement: '证明材料要求', value: '合同+验收报告', status: 'match', detail: '材料齐全', targetSection: 'doc-performance-requirement', searchText: '需提供合同复印件及验收报告' },
];

export const teamRequirements: TeamRequirement[] = [
  { role: '项目负责人', count: '1人', requirement: 'CISP证书、5年以上经验', status: 'partial', detail: '张三符合，需确认档期', targetSection: 'doc-team-requirement', searchText: '项目负责人1人，需持有CISP证书' },
  { role: '高级测评师', count: '≥2人', requirement: 'CISP-PTE/PTS证书', status: 'match', detail: '李四、王五可安排', targetSection: 'doc-team-requirement', searchText: '高级测评师不少于2人' },
  { role: '测评工程师', count: '≥3人', requirement: '本科以上学历', status: 'match', detail: '人员充足', targetSection: 'doc-team-requirement', searchText: '测评工程师不少于3人' },
  { role: '项目助理', count: '1人', requirement: '无特殊要求', status: 'match', detail: '可安排', targetSection: 'doc-team-requirement', searchText: '项目助理1人' },
];

export const commitmentRequirements: CommitmentRequirement[] = [
  { item: '服务期限', requirement: '合同签订后6个月内完成', canMeet: true, targetSection: 'doc-commitment', searchText: '合同签订后6个月内完成' },
  { item: '质保期', requirement: '验收后12个月免费技术支持', canMeet: true, targetSection: 'doc-commitment', searchText: '验收后12个月免费技术支持' },
  { item: '响应时间', requirement: '问题反馈24小时内响应', canMeet: true, targetSection: 'doc-commitment', searchText: '问题反馈24小时内响应' },
  { item: '驻场要求', requirement: '测评期间安排人员驻场', canMeet: true, targetSection: 'doc-commitment', searchText: '测评期间安排人员驻场' },
  { item: '保密承诺', requirement: '签署保密协议，不泄露客户信息', canMeet: true, targetSection: 'doc-commitment', searchText: '签署保密协议' },
];

export const disqualificationItems: DisqualificationItem[] = [
  { item: '未按要求密封投标文件', risk: 'high', note: '需检查密封袋规格', targetSection: 'doc-disqualification', searchText: '未按招标文件要求密封投标文件' },
  { item: '投标保证金未按时到账', risk: 'high', note: '截止2月15日14:00前', targetSection: 'doc-disqualification', searchText: '投标保证金未按时足额到账' },
  { item: '缺少等保测评资质证书', risk: 'high', note: '我方已具备', targetSection: 'doc-disqualification', searchText: '等级保护测评机构资质证书' },
  { item: '报价超过预算最高限价', risk: 'medium', note: '预算50万，建议报价42万', targetSection: 'doc-disqualification', searchText: '投标报价超过预算最高限价' },
  { item: '投标文件未加盖公章', risk: 'high', note: '需逐页盖章', targetSection: 'doc-disqualification', searchText: '投标文件未加盖投标人公章' },
  { item: '法定代表人授权书缺失', risk: 'medium', note: '需提前准备', targetSection: 'doc-disqualification', searchText: '法定代表人授权书' },
];

export const actionPlan: ActionPlanItem[] = [
  { action: '确认项目负责人张三档期', responsible: '人力资源部', deadline: '2024-02-08' },
  { action: '准备业绩证明材料（合同+验收报告）', responsible: '商务部', deadline: '2024-02-10' },
  { action: '编制技术方案初稿', responsible: '技术部', deadline: '2024-02-12' },
  { action: '提交投标保证金', responsible: '财务部', deadline: '2024-02-14' },
  { action: '投标文件盖章、密封', responsible: '商务部', deadline: '2024-02-15上午' },
];

export const documentSections: DocumentSection[] = [
  {
    id: 'sec-overview',
    title: '一、项目概况',
    subsections: [
      {
        id: 'doc-project-info',
        title: '1.1 项目基本信息',
        content: `项目名称：XX市政府信息系统安全等级保护测评服务项目。采购人：XX市政务服务中心。项目类型：服务类。采购方式：公开招标。项目预算：人民币50万元整（￥500,000.00），本预算为最高限价，投标报价不得超过此金额。`
      }
    ]
  },
  {
    id: 'sec-qualification',
    title: '二、投标人资格要求',
    subsections: [
      {
        id: 'doc-basic-qualification',
        title: '2.1 基本资格要求',
        content: `（1）具有独立法人资格，持有有效的营业执照；（2）注册资金500万元人民币以上；（3）具有良好的商业信誉和健全的财务会计制度；（4）具有履行合同所必需的设备和专业技术能力；（5）近三年内在经营活动中没有重大违法记录。`
      },
      {
        id: 'doc-professional-qualification',
        title: '2.2 专业资质要求',
        content: `（1）具有中国网络安全审查技术与认证中心颁发的等级保护测评机构资质证书（必须）；（2）具有ISO27001信息安全管理体系认证证书；（3）近三年内完成过至少3个同类项目业绩，且单个项目合同金额不低于20万元。`
      },
      {
        id: 'doc-team-requirement',
        title: '2.3 项目团队要求',
        content: `（1）项目负责人1人，需持有CISP证书，具有5年以上等级保护测评项目管理经验；（2）高级测评师不少于2人，需持有CISP-PTE或CISP-PTS证书；（3）测评工程师不少于3人，本科以上学历，熟悉网络安全相关技术；（4）项目助理1人，负责项目协调与文档整理工作。`
      },
      {
        id: 'doc-performance-requirement',
        title: '2.4 业绩证明要求',
        content: `投标人须提供近三年内完成过至少3个同类项目业绩证明材料。单个项目合同金额不低于20万元。业绩时间范围：2021年1月后签订并完成验收的项目。需提供合同复印件及验收报告作为证明材料，加盖投标人公章。`
      }
    ]
  },
  {
    id: 'sec-timeline',
    title: '四、招标时间安排',
    subsections: [
      {
        id: 'doc-timeline-nodes',
        title: '4.1 关键时间节点',
        content: `招标公告发布时间：2024年2月1日。招标文件获取时间：2024年2月1日至2024年2月15日，每日09:00-17:00（节假日除外）。答疑截止时间：2024年2月12日17:00前，逾期不再受理。投标文件递交截止时间：2024年2月15日14:00，届时不再接收投标文件。开标时间：2024年2月20日09:00。开标地点：XX市公共资源交易中心三楼开标室。预计中标公示时间：2024年3月1日。`
      },
      {
        id: 'doc-disqualification',
        title: '4.3 废标条款',
        content: `有下列情形之一的，投标无效：（1）未按招标文件要求密封投标文件；（2）投标保证金未按时足额到账；（3）投标文件未加盖投标人公章；（4）缺少法定代表人授权书或授权书无效；（5）未提供有效的等级保护测评机构资质证书；（6）投标报价超过预算最高限价；（7）投标文件存在重大偏离或保留。`
      }
    ]
  },
  {
    id: 'sec-service',
    title: '六、服务要求',
    subsections: [
      {
        id: 'doc-commitment',
        title: '6.4 服务承诺要求',
        content: `（1）服务期限：合同签订后6个月内完成全部测评工作并提交测评报告；（2）质保期：验收后12个月免费技术支持，包括测评问题咨询、整改建议等；（3）响应时间：问题反馈24小时内响应，紧急问题4小时内响应；（4）驻场要求：测评期间安排人员驻场，配合采购人完成相关工作；（5）保密承诺：签署保密协议，严格保护采购人信息资产安全，不得泄露客户信息。`
      }
    ]
  }
];
