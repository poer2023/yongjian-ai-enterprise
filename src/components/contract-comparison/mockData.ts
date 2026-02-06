import type { Contract, DiffItem } from './types';

export const originalContract: Contract = {
  title: '软件开发服务合同',
  version: 'V1.0',
  date: '2024年10月15日',
  partyA: '北京未来科技有限公司',
  partyB: '深圳智汇软件开发有限公司',
  clauses: [
    {
      id: 'oc-1',
      title: '第一条 项目内容',
      content: `1.1 甲方委托乙方开发"企业智能管理系统"，包括：
（1）用户权限管理模块
（2）数据统计分析模块
（3）报表自动生成模块

1.2 系统需支持高并发访问，不仅限于1000 QPS。`
    },
    {
      id: 'oc-2',
      title: '第二条 合同金额',
      content: `2.1 项目总金额为人民币伍拾万元整（¥500,000.00）。

2.2 付款方式：
（1）预付款30%：¥150,000.00
（2）中期款50%：¥250,000.00
（3）尾款20%：¥100,000.00`
    },
    {
      id: 'oc-3',
      title: '第三条 开发周期',
      content: `3.1 项目开发周期为90个日历日。

3.2 乙方应在合同签订后30日内完成核心功能开发。`
    },
    {
      id: 'oc-4',
      title: '第四条 违约责任',
      content: `4.1 乙方延迟交付，每延迟一日，支付合同总额0.1%的违约金。

4.2 乙方享有30日的修复缓冲期。

4.3 违约金总额不超过合同总额的15%。`
    },
    {
      id: 'oc-5',
      title: '第五条 知识产权',
      content: `5.1 本合同项下新开发的软件知识产权归甲方所有。

5.2 乙方原有知识产权仍归乙方所有。`
    }
  ]
};

export const newContract: Contract = {
  title: '软件开发服务合同',
  version: 'V2.0',
  date: '2024年12月25日',
  partyA: '北京未来科技（集团）有限公司',
  partyB: '深圳智汇软件开发有限公司',
  clauses: [
    {
      id: 'nc-1',
      title: '第一条 项目内容',
      content: `1.1 甲方委托乙方开发"企业智能管理系统"，包括：
（1）用户权限管理模块
（2）数据统计分析模块
（3）报表自动生成模块
（4）移动端APP适配模块  【新增】

1.2 系统需支持高并发访问，至少支持5000 QPS。【提升】`
    },
    {
      id: 'nc-2',
      title: '第二条 合同金额',
      content: `2.1 项目总金额为人民币捌拾万元整（¥800,000.00）。【上调】

2.2 付款方式：
（1）预付款40%：¥320,000.00【比例上调】
（2）中期款40%：¥320,000.00
（3）尾款20%：¥160,000.00`
    },
    {
      id: 'nc-3',
      title: '第三条 开发周期',
      content: `3.1 项目开发周期为120个日历日。【延长】

3.2 乙方应在合同签订后45日内完成核心功能开发。【延长】`
    },
    {
      id: 'nc-4',
      title: '第四条 违约责任',
      content: `4.1 乙方延迟交付，每延迟一日，支付合同总额0.5%的违约金。【提升5倍】

4.2 【已删除修复缓冲期条款】

4.3 违约金总额不超过合同总额的30%。【上限提升】`
    },
    {
      id: 'nc-5',
      title: '第五条 知识产权',
      content: `5.1 本合同项下所有软件及相关知识产权均归甲方所有。【扩大范围】

5.2 【已删除乙方保留条款】`
    }
  ]
};

export const diffItems: DiffItem[] = [
  {
    id: 'd1',
    type: 'mod',
    location: '合同主体 - 甲方名称',
    originalText: '北京未来科技有限公司',
    newText: '北京未来科技（集团）有限公司',
    description: '甲方公司名称变更，需确认是否为同一主体或关联公司，核实工商登记信息。',
    riskLevel: 'medium',
    status: 'pending'
  },
  {
    id: 'd2',
    type: 'add',
    location: '第一条 - 项目范围',
    originalText: '',
    newText: '移动端APP适配模块',
    description: '新增移动端开发要求，项目范围扩大。需评估额外工作量是否与价格调整匹配。',
    riskLevel: 'medium',
    status: 'pending'
  },
  {
    id: 'd3',
    type: 'mod',
    location: '第一条 - 性能要求',
    originalText: '不仅限于1000 QPS',
    newText: '至少支持5000 QPS',
    description: '性能要求提升5倍，需评估服务器成本、架构调整等技术可行性。这是硬性指标变更。',
    riskLevel: 'high',
    status: 'pending'
  },
  {
    id: 'd4',
    type: 'mod',
    location: '第二条 - 合同金额',
    originalText: '伍拾万元整（¥500,000.00）',
    newText: '捌拾万元整（¥800,000.00）',
    description: '合同金额上调60%（+30万），需财务审批。注意与新增工作量是否对等。',
    riskLevel: 'high',
    status: 'pending'
  },
  {
    id: 'd5',
    type: 'mod',
    location: '第四条 - 违约金比例',
    originalText: '每延迟一日，支付合同总额0.1%的违约金',
    newText: '每延迟一日，支付合同总额0.5%的违约金',
    description: '违约金比例提升5倍！延迟60天即达上限。这对乙方风险显著增加。',
    riskLevel: 'high',
    status: 'pending'
  },
  {
    id: 'd6',
    type: 'del',
    location: '第四条 - 修复缓冲期',
    originalText: '乙方享有30日的修复缓冲期',
    newText: '',
    description: '删除了原有的30日修复缓冲期，乙方失去容错空间，风险增加。',
    riskLevel: 'high',
    status: 'pending'
  },
  {
    id: 'd7',
    type: 'mod',
    location: '第五条 - 知识产权归属',
    originalText: '本合同项下新开发的软件知识产权归甲方所有',
    newText: '本合同项下所有软件及相关知识产权均归甲方所有',
    description: '知识产权条款扩大化，从"新开发"变为"所有"，可能包含乙方原有技术资产。',
    riskLevel: 'high',
    status: 'pending'
  }
];
