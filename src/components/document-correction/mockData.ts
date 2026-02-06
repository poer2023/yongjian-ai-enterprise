// Mock data for DocumentCorrectionResultView
import type { DocumentContent, Modification } from './types';

export const mockDocumentContent: DocumentContent = {
  title: '律师函',
  docNo: '京盈律函字【2024】第086号',
  createDate: '2024年12月30日',

  sender: {
    name: '北京盈科律师事务所',
    lawyer: '王志强 律师',
    phone: '010-59626688',
    address: '北京市朝阳区建国门外大街甲12号新华保险大厦15层'
  },

  recipient: {
    name: '深圳市创新科技有限公司',
    address: '深圳市南山区科技园南路88号'
  },

  clauses: [
    {
      id: 'clause-1',
      title: '一、委托事项',
      content: `本律师依法接受北京智慧云端科技有限公司（以下简称"委托人"）的委托，就贵公司拖欠委托人软件开发服务费用一事，特向贵公司发出本律师涵。`
    },
    {
      id: 'clause-2',
      title: '二、基本事实',
      content: `2023年5月10日，委托人与贵公司签署了《软件开发服务合同》(合同编号：RXKJ-2023-0510)，约定由委托人为贵公司开发"智能仓储管理系统"，合同总金额为人民币肆拾伍万元整（¥450,000.00）。

合同约定付款方式为：合同签署后支付30%预付款；系统上线验收合格后支付50%；质保期满后付15%尾款。

委托人已按合同约定完成全部开发工作，并于2024年1月15日通过贵公司组织的验收测试，贵公司出具了《验收合格确认书》。

截止本函发出之日，贵公司尚欠委托人软件开发服务费人民币贰拾玖万贰仟伍佰元整（¥292,500.00），经委托人多次催要，贵公司拒不付款。`
    },
    {
      id: 'clause-3',
      title: '三、律师意见',
      content: `贵公司的上述行为以严重违反了《中华人民共和国民法典》第五百零九条"当事人应当按照约定全面履行自己的义务"之规定，已经构成严重违约。

根据合同约定及相关法律规定，委托人有权要求贵公司：
1. 立即支付拖欠的软件开发服务费人民币贰拾玖万贰仟伍佰元整（￥292,500.00）；
2. 按照合同约定支付逾期付款违约金（按日万分之五计算）；
3. 承担委托人为追索债权而支付的律师费、诉讼费等合理费用。`
    },
    {
      id: 'clause-4',
      title: '四、正式催告',
      content: `鉴于上述事实，本律师郑重敬告贵公司：

请贵公司于收到本函后七（7）个工作日内，主动与委托人联系并付清上述全部欠款及违约金，否则，本律师将依据法律程序，代表委托人向有管辖权的人民法院提起诉讼，届时贵公司将承担更多的经济损失和法律责任。

特此函告，望贵公司慎重考虑，积极妥善处理此事。`
    }
  ]
};

export const mockModifications: Modification[] = [
  {
    id: 'mod-1',
    clauseId: 'clause-1',
    originalText: '特向贵公司发出本律师涵',
    suggestedText: '特向贵公司发出本律师函',
    reason: '【错别字】"涵"应为"函"。律师函是法律文书专有名词，应使用"函"字。',
    riskLevel: 'high',
    status: 'pending',
    expanded: true
  },
  {
    id: 'mod-2',
    clauseId: 'clause-2',
    originalText: '质保期满后付15%尾款',
    suggestedText: '质保期满后支付20%尾款',
    reason: '【数据错误】付款比例合计应为100%（30%+50%+20%=100%），原文15%与前述比例合计仅95%，存在数据不一致问题。',
    riskLevel: 'high',
    status: 'pending',
    expanded: false
  },
  {
    id: 'mod-3',
    clauseId: 'clause-3',
    originalText: '贵公司的上述行为以严重违反了',
    suggestedText: '贵公司的上述行为已严重违反了',
    reason: '【错别字】"以"应为"已"。此处表示动作完成，应使用"已经"的"已"。',
    riskLevel: 'medium',
    status: 'pending',
    expanded: false
  },
  {
    id: 'mod-4',
    clauseId: 'clause-3',
    originalText: '人民币贰拾玖万贰仟伍佰元整（￥292,500.00）',
    suggestedText: '人民币贰拾玖万贰仟伍佰元整（¥292,500.00）',
    reason: '【符号错误】人民币符号应使用"¥"（半角），原文使用了"￥"（全角），与前文表述不一致，建议统一。',
    riskLevel: 'low',
    status: 'pending',
    expanded: false
  },
  {
    id: 'mod-5',
    clauseId: 'clause-4',
    originalText: '本律师郑重敬告贵公司',
    suggestedText: '本律师郑重告知贵公司',
    reason: '【表述优化】"敬告"含有敬意，用于律师函催债场景语气过于客气，建议改为中性的"告知"，更符合律师函的严肃性。',
    riskLevel: 'low',
    status: 'pending',
    expanded: false
  }
];
