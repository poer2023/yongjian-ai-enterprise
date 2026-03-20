import type { Component } from 'vue';
import {
  Briefcase,
  Database,
  FileText,
  MessageSquare,
} from 'lucide-vue-next';

export type BusinessModuleKey =
  | 'sales-management'
  | 'customer-service'
  | 'ai-ticket';

export type FieldType = 'text' | 'textarea' | 'single-choice' | 'multi-choice' | 'upload';

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  options?: string[];
}

export interface FormSection {
  title: string;
  description: string;
  fields: FormField[];
}

export interface DemoCard {
  title: string;
  description: string;
  meta?: string;
}

export interface DemoSection {
  title: string;
  description: string;
  bullets?: string[];
  cards?: DemoCard[];
}

export interface DemoAction {
  label: string;
  feedback: string;
}

export interface BusinessModuleDefinition {
  key: BusinessModuleKey;
  routeName: string;
  title: string;
  subtitle: string;
  icon: Component;
  infoDescription: string;
  infoFeatures: string[];
  formSections: FormSection[];
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  resultSections: DemoSection[];
  resultActions: DemoAction[];
}

export const businessModuleCatalog: Record<BusinessModuleKey, BusinessModuleDefinition> = {
  'sales-management': {
    key: 'sales-management',
    routeName: 'sales-management',
    title: '销售管理智能体',
    subtitle: '直接配置销售团队、汇报周期和复盘输出，进入业务功能演示',
    icon: Briefcase,
    infoDescription: '面向个人或团队负责人的销售管理 Demo 入口，先完成表单和流程，再逐步补齐完整结果页。',
    infoFeatures: [
      '销售团队与角色设置',
      '汇报周期与模板配置',
      'AI 复盘输出目标选择',
      '销售看板与知识问答入口',
    ],
    formSections: [
      {
        title: '基础配置',
        description: '先定义这次要演示的销售团队和汇报周期。',
        fields: [
          {
            key: 'teamName',
            label: '团队名称',
            type: 'text',
            required: true,
            placeholder: '例如：华东销售一组',
          },
          {
            key: 'period',
            label: '汇报周期',
            type: 'single-choice',
            required: true,
            helper: '选择当前 Demo 的任务周期',
            options: ['日报', '周报', '月报', '一次性任务'],
          },
        ],
      },
      {
        title: '汇报输入与关注重点',
        description: '通过模板要求和补充说明控制后续 AI 复盘方向。',
        fields: [
          {
            key: 'templateFocus',
            label: '汇报关注维度',
            type: 'multi-choice',
            options: ['客户推进', '签约金额', '回款进度', '风险阻塞', '需要支持事项'],
          },
          {
            key: 'supportingFile',
            label: '上传已有销售材料',
            type: 'upload',
            helper: '模拟上传周报、客户清单或目标表',
          },
          {
            key: 'instructions',
            label: '补充说明',
            type: 'textarea',
            placeholder: '例如：本次重点突出重点客户风险、回款预警和下周行动建议',
          },
        ],
      },
    ],
    submitLabel: '进入销售管理 Demo',
    successTitle: '销售管理 Demo 已就绪',
    successDescription: '已按当前配置生成销售汇报、复盘、看板与问答的 Mock 演示上下文。',
    resultSections: [
      {
        title: '输出预览',
        description: '提交后直接生成一组销售管理常见输出，方便开发理解后续页面结构。',
        cards: [
          {
            title: '销售汇报草稿',
            description: '自动汇总本周期重点客户推进、签约进度和回款状态。',
            meta: '适合接日报 / 周报预览页',
          },
          {
            title: '风险复盘摘要',
            description: '将风险阻塞、待支持事项和延期原因汇总成一页复盘结论。',
            meta: '适合接 AI 复盘详情页',
          },
          {
            title: '下周动作建议',
            description: '按客户优先级给出下一步跟进动作、负责人和协作建议。',
            meta: '适合接任务清单或提醒模块',
          },
        ],
      },
      {
        title: 'AI 复盘结论',
        description: '这部分用于展示销售管理智能体的核心判断。',
        bullets: [
          '高价值客户需要优先关注签约进度、回款风险和关键阻塞节点。',
          '复盘结果会把“需要上级支持”和“需要跨部门协作”单独拎出来。',
          '看板页应优先展示重点客户、风险客户和本周期目标完成率。',
        ],
      },
      {
        title: '看板关注项',
        description: '保留为后续看板或问答模块的入口说明。',
        cards: [
          {
            title: '重点客户',
            description: '展示本周期高优客户推进状态、负责人和下一步动作。',
            meta: 'Mock 重点客户数：3',
          },
          {
            title: '回款预警',
            description: '高亮超期回款、待确认回款和需要管理层介入的事项。',
            meta: 'Mock 预警项：2',
          },
          {
            title: '支持事项',
            description: '汇总需要产品、交付、管理层支持的关键问题。',
            meta: 'Mock 支持项：4',
          },
        ],
      },
    ],
    resultActions: [
      {
        label: '查看复盘稿',
        feedback: '已模拟打开销售复盘稿，下一步可接入独立复盘结果页。',
      },
      {
        label: '打开销售问答',
        feedback: '已模拟进入销售问答，后续可复用知识问答壳子继续扩展。',
      },
      {
        label: '模拟导出汇报',
        feedback: '已模拟导出销售汇报，当前仅展示前端反馈。',
      },
    ],
  },
  'customer-service': {
    key: 'customer-service',
    routeName: 'customer-service',
    title: '咨询客服智能体',
    subtitle: '直接配置 Bot、人设、知识材料和发布方式，进入客服演示流程',
    icon: MessageSquare,
    infoDescription: '面向个人演示的客服智能体入口页，强调功能配置，不展示平台级概览。',
    infoFeatures: [
      '客服 Bot 名称与服务场景',
      '知识材料上传与绑定',
      '发布方式与转人工策略',
      '测试与会话接管的后续入口',
    ],
    formSections: [
      {
        title: 'Bot 基础信息',
        description: '先定义当前客服 Bot 的名称、服务对象和语气。',
        fields: [
          {
            key: 'botName',
            label: 'Bot 名称',
            type: 'text',
            required: true,
            placeholder: '例如：售前咨询助手',
          },
          {
            key: 'serviceType',
            label: '服务场景',
            type: 'single-choice',
            options: ['售前咨询', '售后服务', '技术支持', '投诉处理'],
          },
          {
            key: 'tone',
            label: '回复风格',
            type: 'multi-choice',
            options: ['专业', '耐心', '简洁', '主动追问'],
          },
        ],
      },
      {
        title: '知识与发布方式',
        description: '通过材料和渠道定义当前 Demo 的客服能力边界。',
        fields: [
          {
            key: 'knowledgeUpload',
            label: '上传知识材料',
            type: 'upload',
            helper: '模拟上传 FAQ、产品手册、售后政策等',
          },
          {
            key: 'publishChannel',
            label: '发布渠道',
            type: 'multi-choice',
            options: ['H5 链接', '企业微信客服', '内部测试工作台'],
          },
          {
            key: 'handoffRule',
            label: '转人工策略说明',
            type: 'textarea',
            placeholder: '例如：用户投诉、连续两次无法回答、主动要求转人工时触发接管',
          },
        ],
      },
    ],
    submitLabel: '进入客服 Demo',
    successTitle: '客服智能体 Demo 已就绪',
    successDescription: '已根据当前配置生成 Mock Bot 信息、知识范围、发布方式与转人工规则。',
    resultSections: [
      {
        title: 'Bot 结果预览',
        description: '展示客服智能体创建后的核心产物，用于承接测试与发布页面。',
        cards: [
          {
            title: 'Bot 基础档案',
            description: '输出 Bot 名称、服务对象、回复风格和首轮欢迎语。',
            meta: '适合接 Bot 配置详情页',
          },
          {
            title: '知识命中范围',
            description: '展示本次绑定的 FAQ、手册、政策和知识来源说明。',
            meta: '适合接知识绑定弹层',
          },
          {
            title: '发布方式预演',
            description: '展示 H5、客服工作台或企业微信等 Mock 发布结果。',
            meta: '适合接发布确认页',
          },
        ],
      },
      {
        title: '首轮应答策略',
        description: '这部分用来体现客服智能体的应答逻辑。',
        bullets: [
          '优先命中标准问答，其次返回知识片段与追问建议。',
          '当用户意图不明确时，先追问场景、问题类型和订单信息。',
          '遇到投诉、退款、连续未命中问题时，优先触发转人工提示。',
        ],
      },
      {
        title: '转人工触发点',
        description: '为后续接测试会话页和转人工策略页预留结果结构。',
        cards: [
          {
            title: '投诉类问题',
            description: '用户出现负面情绪、投诉、升级需求时立即提示转人工。',
            meta: '高优先级',
          },
          {
            title: '连续未命中',
            description: '连续两次未找到有效答案时给出转人工选项。',
            meta: '中优先级',
          },
          {
            title: '主动要求人工',
            description: '用户明确提出人工服务时，直接进入人工接待流程。',
            meta: '立即触发',
          },
        ],
      },
    ],
    resultActions: [
      {
        label: '进入测试会话',
        feedback: '已模拟进入客服测试会话，后续可接独立聊天测试页。',
      },
      {
        label: '查看转人工策略',
        feedback: '已模拟打开转人工策略配置，当前只展示前端说明。',
      },
      {
        label: '模拟发布',
        feedback: '已模拟发布客服 Bot，后续可接发布确认和渠道预览页。',
      },
    ],
  },
  'ai-ticket': {
    key: 'ai-ticket',
    routeName: 'ai-ticket',
    title: 'AI 工单智能体',
    subtitle: '直接录入工单来源、人员配置和分配规则，进入工单分配演示',
    icon: FileText,
    infoDescription: '面向个人使用的工单分配 Demo 入口，强调表单输入和分配触发动作。',
    infoFeatures: [
      '工单来源和字段定义',
      '人员配置方式选择',
      '规则输入与优先级说明',
      '分配结果与历史任务的后续入口',
    ],
    formSections: [
      {
        title: '工单与人员来源',
        description: '先定义本次工单分配演示的输入来源。',
        fields: [
          {
            key: 'ticketSource',
            label: '工单来源',
            type: 'single-choice',
            options: ['系统对接', 'Excel / CSV 上传', '手动录入'],
          },
          {
            key: 'peopleSource',
            label: '人员配置方式',
            type: 'single-choice',
            options: ['Excel / CSV 上传', '手动配置', '复用历史配置'],
          },
          {
            key: 'ticketFile',
            label: '上传工单或人员材料',
            type: 'upload',
            helper: '模拟上传工单清单、排班表、技能矩阵等',
          },
        ],
      },
      {
        title: '分配规则',
        description: '通过自然语言描述本次工单分配逻辑。',
        fields: [
          {
            key: 'ruleFocus',
            label: '优先匹配维度',
            type: 'multi-choice',
            options: ['工作地点', '技能等级', '当前负荷', '历史经验', '客户优先级'],
          },
          {
            key: 'ruleText',
            label: '规则说明',
            type: 'textarea',
            required: true,
            placeholder: '例如：优先同城分配，同城下按技能等级从高到低，再按当前负荷从低到高排序',
          },
        ],
      },
    ],
    submitLabel: '开始工单分配 Demo',
    successTitle: 'AI 工单 Demo 已就绪',
    successDescription: '已根据当前输入生成 Mock 工单、人员、规则和分配结果上下文。',
    resultSections: [
      {
        title: '分配结果预览',
        description: '提交后直接给出一组典型工单分派结果，便于开发理解目标页面。',
        cards: [
          {
            title: 'P1 工单 -> 张工',
            description: '命中高优先级、同城、技能等级最高三项规则。',
            meta: '预计 10 分钟内响应',
          },
          {
            title: 'P2 工单 -> 李工',
            description: '命中历史经验与当前负荷最优规则，适合标准故障处理。',
            meta: '预计 30 分钟内响应',
          },
          {
            title: '跨区工单 -> 待确认',
            description: '因排班冲突进入待人工确认队列，保留二次分配入口。',
            meta: '需要补充人员配置',
          },
        ],
      },
      {
        title: '规则命中说明',
        description: '展示工单智能体的分配依据。',
        bullets: [
          '优先匹配工单等级、工作地点和可用技能等级。',
          '同等条件下，优先分配当前负荷较低且历史处理成功率较高的成员。',
          '对缺少人员、排班冲突或跨区工单，保留待确认和重跑规则的入口。',
        ],
      },
      {
        title: '待补充事项',
        description: '用于承接后续的工单详情、导出和人工调整页面。',
        cards: [
          {
            title: '技能缺口',
            description: '当前演示结果中仍有 1 类工单缺少高等级人员可接。',
            meta: '建议补充技能矩阵',
          },
          {
            title: '排班冲突',
            description: '夜班与跨区工单存在 2 条冲突，需要保留人工调整入口。',
            meta: '建议接排班冲突弹层',
          },
          {
            title: '超时预警',
            description: '部分低优先级工单若继续堆积，将触发 SLA 预警。',
            meta: '建议接预警看板',
          },
        ],
      },
    ],
    resultActions: [
      {
        label: '查看分配详情',
        feedback: '已模拟打开分配详情，后续可接工单分配结果页。',
      },
      {
        label: '导出派工表',
        feedback: '已模拟导出派工表，当前只展示前端反馈。',
      },
      {
        label: '模拟重跑规则',
        feedback: '已模拟按当前规则重新分配，后续可接重跑确认流程。',
      },
    ],
  },
};

export const businessModuleToolList = Object.values(businessModuleCatalog).map((item) => ({
  icon: item.icon,
  label: item.title,
  route: item.routeName,
}));
