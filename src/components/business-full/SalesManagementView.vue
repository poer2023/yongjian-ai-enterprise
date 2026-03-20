<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  ArrowLeft,
  Bot,
  Briefcase,
  Check,
  CheckCircle2,
  Database,
  FileText,
  Image,
  LayoutDashboard,
  Mic,
  Paperclip,
  Plus,
  Send,
  Sparkles,
} from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { FormPageLayout, InfoSidebar, TemplateSidebar } from '../shared';
import { businessModuleToolList } from './moduleCatalog';

type ReportPerspective = 'manager' | 'member';
type ReportStatus = '已提交' | '待提交' | '待补充';
type WorkspaceSection = 'report' | 'review' | 'dashboard';
type ReportPageMode = 'list' | 'detail' | 'submission';
type SubmitFieldType = 'text' | 'file' | 'image' | 'link' | 'number';
type TaskModalMode = 'create' | 'edit';
type AssistInputMode = 'paste' | 'upload' | 'voice';
type MemberAssistRunStatus = 'idle' | 'running' | 'completed';
type MemberAssistStepKind = 'thinking' | 'tool' | 'write';
type MemberAssistStepStatus = 'running' | 'done';

interface SalesTask {
  id: string;
  title: string;
  type: string;
  owner: string;
  status: string;
  progress: string;
  updatedAt: string;
}

interface SalesMetric {
  label: string;
  value: string;
  trend: string;
  description: string;
}

interface SalesBoardCard {
  title: string;
  value: string;
  detail: string;
}

interface SalesQuestionPreset {
  id: string;
  question: string;
  answer: string;
  sources: string[];
}

interface ReportSetting {
  title: string;
  cycle: string;
  deadline: string;
  focus: string[];
}

interface ReportSubmission {
  id: string;
  memberName: string;
  role: string;
  status: ReportStatus;
  submittedAt: string;
  snippet: string;
  nextActions: string;
  blocker: string;
  progressDetail?: string;
  actionDetail?: string;
  supportDetail?: string;
}

interface MemberDraft {
  progress: string;
  nextActions: string;
  supportNeed: string;
}

interface ReportItem {
  id: string;
  title: string;
  cycle: string;
  deadline: string;
  focus: string[];
  submitFields: SubmitFieldType[];
  summary: string;
  submissions: ReportSubmission[];
  memberDrafts: Record<string, MemberDraft>;
}

interface TeamMemberOption {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

interface CreateReportTaskDraft {
  title: string;
  summary: string;
  cycle: string;
  deadlineDate: string;
  deadlineTime: string;
  focus: string[];
  selectedMembers: string[];
  submitFields: SubmitFieldType[];
}

interface SalesTeamWorkspace {
  id: string;
  tenantName: string;
  teamName: string;
  roleLabel: string;
  defaultPerspective: ReportPerspective;
  focusLabel: string;
  memberCount: number;
  taskCount: number;
  syncTime: string;
  reportItems: ReportItem[];
  memberPerspectiveName: string;
  memberPerspectiveRole: string;
  tasks: SalesTask[];
  reviewSummary: string;
  reviewHighlights: string[];
  reviewActions: string[];
  metrics: SalesMetric[];
  boardCards: SalesBoardCard[];
  qnaPresets: SalesQuestionPreset[];
}

interface EvaluationDraftPayload {
  question: string;
  systemContext: string;
  sources: string[];
  answerText: string;
}

interface MemberAssistResult {
  summary: string;
  sourceLabel: string;
}

interface MemberAssistStep {
  id: string;
  title: string;
  detail: string;
  kind: MemberAssistStepKind;
  status: MemberAssistStepStatus;
}

const reportCycleOptions = ['日报', '周报', '月报'];
const reportFocusOptions = ['客户推进', '签约进展', '回款风险', '阻塞事项', '需要支持'];
const submitFieldOptions = [
  { key: 'text' as SubmitFieldType, label: '文本说明', description: '填写进展、风险和说明' },
  { key: 'file' as SubmitFieldType, label: '文件上传', description: '上传周报、附件或表格' },
  { key: 'image' as SubmitFieldType, label: '图片截图', description: '提交截图、拍照或凭证' },
  { key: 'link' as SubmitFieldType, label: '链接附件', description: '提交云文档或外部链接' },
  { key: 'number' as SubmitFieldType, label: '数值字段', description: '填写金额、数量和阶段值' },
];
const memberEmailMap: Record<string, string> = {
  林嘉豪: 'linjh@company.com',
  周宁: 'zhouning@company.com',
  许岚: 'xulan@company.com',
  程果: 'chengguo@company.com',
};
const workspaceSectionTabs = [
  { key: 'report' as WorkspaceSection, label: '工作汇报', icon: FileText },
  { key: 'review' as WorkspaceSection, label: 'AI 复盘分析', icon: Sparkles },
  { key: 'dashboard' as WorkspaceSection, label: '数据看板', icon: LayoutDashboard },
];

const createMemberDraft = (): MemberDraft => ({
  progress: '',
  nextActions: '',
  supportNeed: '',
});

const createReportTaskDraft = (): CreateReportTaskDraft => ({
  title: '',
  summary: '',
  cycle: '周报',
  deadlineDate: '2026-03-27',
  deadlineTime: '18:00',
  focus: ['客户推进', '需要支持'],
  selectedMembers: [],
  submitFields: ['text', 'file'],
});

const buildReportItem = (
  teamId: string,
  key: string,
  config: ReportSetting & {
    summary: string;
    submitFields?: SubmitFieldType[];
    submissions: Array<Omit<ReportSubmission, 'id'>>;
  },
): ReportItem => {
  const submissions = config.submissions.map((item, index) => ({
    ...item,
    id: `${teamId}-${key}-submission-${index + 1}`,
  }));

  return {
    id: `${teamId}-${key}`,
    title: config.title,
    cycle: config.cycle,
    deadline: config.deadline,
    focus: config.focus,
    submitFields: config.submitFields ?? ['text'],
    summary: config.summary,
    submissions,
    memberDrafts: Object.fromEntries(
      submissions.map((item) => [
        item.memberName,
        {
          progress: item.status === '待提交' ? '' : item.snippet,
          nextActions: item.status === '待提交' ? '' : item.nextActions,
          supportNeed: item.blocker === '无' ? '' : item.blocker,
        },
      ]),
    ),
  };
};

const buildTeamWorkspace = (
  id: string,
  tenantName: string,
  teamName: string,
  roleLabel: string,
  focusLabel: string,
  overrides?: Partial<SalesTeamWorkspace>,
): SalesTeamWorkspace => {
  const reportItems: ReportItem[] = [
    buildReportItem(id, 'weekly-report', {
      title: `${teamName} 销售周报`,
      cycle: '周报',
      deadline: '每周五 18:00',
      focus: ['客户推进', '回款风险', '需要支持'],
      submitFields: ['text', 'file'],
      summary: '用于周会前收齐销售推进、回款风险和管理支持事项。',
      submissions: [
        {
          memberName: '林嘉豪',
          role: '销售负责人',
          status: '已提交',
          submittedAt: '今天 09:10',
          snippet: '已更新重点客户推进节奏和本周签约预估，建议优先处理 2 个高潜客户的推进阻塞。',
          nextActions: '推进 2 个高潜客户进入方案确认，并同步报价策略。',
          blocker: '需要管理层确认 1 个关键报价策略',
          progressDetail:
            '本周重点跟进 6 个高潜客户，其中 2 个客户已完成方案演示并进入商务确认阶段，预计本月内可推进签约。\n另外 2 个客户推进节奏放缓，主要卡在预算审批和内部决策人未最终拍板，已同步销售和方案团队补充对比材料。',
          actionDetail:
            '下周优先安排 2 场方案确认会，目标是把华东医院集团和瑞成医疗推进到价格确认阶段。\n同步输出一版报价策略说明，提前和经营分析确认折扣口径，避免周会后再次往返。',
          supportDetail:
            '当前主要问题集中在 2 个高潜客户的商务推进偏慢，一是客户预算审批还未完成，二是对阶段性让利空间仍有反复确认。\n建议管理层本周内明确关键报价策略，同时请法务提前预看客户常用合同模板，避免进入商务谈判后再次拉扯。',
        },
        {
          memberName: '周宁',
          role: '经营分析',
          status: '已提交',
          submittedAt: '今天 09:35',
          snippet: '已补充周会复盘摘要、客户推进分层和高风险客户预警说明。',
          nextActions: '补齐回款节奏说明，并同步高风险客户优先级。',
          blocker: '需要补齐回款节奏说明',
          progressDetail:
            '已完成本周销售推进分层复盘，按高潜、推进放缓和高风险三类重新整理客户池。\n当前高风险客户共 3 个，其中 1 个因回款节点延后需要单独预警，另外 2 个因内部审批周期拉长，建议负责人在周会中单独点名。',
          actionDetail:
            '下周会前补齐回款节奏说明，并把高风险客户的回款时间、影响金额和负责人动作同步到周会材料。\n计划新增一张“风险客户优先级排序”页，减少会上重复解释。',
          supportDetail:
            '目前还缺 1 份最新回款确认信息，导致高风险客户的影响金额只能按昨日口径预估。\n需要回款运营在今天下班前补齐最新数据，否则周会材料中的风险金额会先按旧口径暂代。',
        },
        {
          memberName: '许岚',
          role: '客户经理',
          status: '待提交',
          submittedAt: '待提交',
          snippet: '当前仍未提交本周客户推进汇报。',
          nextActions: '',
          blocker: '等待确认客户下周排期',
        },
        {
          memberName: '程果',
          role: '回款运营',
          status: '待补充',
          submittedAt: '昨天 18:20',
          snippet: '已提交回款盘点，但仍需补充 1 个延期项目的风险说明。',
          nextActions: '补充延期原因及预计回款时间，并同步财务进展。',
          blocker: '待补充延期原因和预计回款时间',
          progressDetail:
            '已完成本周回款盘点，确认 4 个重点项目的实际回款节点，其中 3 个项目与原计划一致。\n目前“瑞成医疗二期”因客户财务审批延后 5 天，已进入黄色预警，需要补充延期原因和最新承诺时间。',
          actionDetail:
            '今晚前补齐延期项目说明，并更新客户财务反馈时间点。\n同时会把本周计划回款客户重新排序，方便销售负责人周会优先追踪。',
          supportDetail:
            '当前延期项目的风险等级还未最终确认，如果客户新的付款承诺继续后移，现有黄色预警可能需要升级。\n建议业务负责人确认是否上调预警等级，并在必要时由负责人直接介入和客户沟通。',
        },
      ],
    }),
    buildReportItem(id, 'pipeline-review', {
      title: `${teamName} 重点商机复盘`,
      cycle: '周报',
      deadline: '每周四 20:00',
      focus: ['签约进展', '阻塞事项', '需要支持'],
      submitFields: ['text', 'number', 'link'],
      summary: '聚焦重点商机赢率变化、签约进展和负责人介入节点。',
      submissions: [
        {
          memberName: '林嘉豪',
          role: '销售负责人',
          status: '已提交',
          submittedAt: '今天 08:40',
          snippet: '已梳理 5 个重点商机的阶段变化，建议负责人直接介入 2 个停滞客户。',
          nextActions: '下周安排 2 场客户现场拜访，确认商务决策人。',
          blocker: '需法务确认合同关键条款',
          progressDetail:
            '本周共复盘 5 个重点商机，其中 2 个商机赢率从 65% 提升到 80%，原因是客户已明确预算并确认上线窗口。\n另有 2 个客户推进停滞超过 7 天，主要问题集中在商务决策人未统一和合同关键条款未确认，建议负责人直接介入。',
          actionDetail:
            '下周安排 2 场客户现场拜访，分别聚焦决策人沟通和商务条款确认。\n对赢率提升的 2 个商机，会同步准备商务测算和实施排期，争取在月底前完成签约推进。',
          supportDetail:
            '需法务提前确认客户提出的付款节点和违约条款，避免现场拜访后仍卡在合同环节。\n如果法务本周无法给出意见，建议先在周会中明确可接受边界。',
        },
        {
          memberName: '周宁',
          role: '经营分析',
          status: '待补充',
          submittedAt: '今天 09:05',
          snippet: '已完成赢率分层，但仍需补齐 2 个商机的阶段判断依据。',
          nextActions: '补全阶段判断和赢率变化说明，供周会使用。',
          blocker: '待补齐 2 个商机的推进阶段说明',
          progressDetail:
            '当前已完成全部重点商机的赢率分层，并补充了商机规模、预计签约时间和当前阶段判断。\n其中 2 个商机仍缺少最近一次客户反馈纪要，导致阶段判断依据不足，暂按保守口径处理。',
          actionDetail:
            '会在周会前补全缺失的阶段说明，并将赢率变化原因写入复盘材料。\n如果销售负责人确认客户反馈已更新，也会同步修正预估签约时间。',
          supportDetail:
            '需要客户经理补充最近一轮客户反馈和内部会议纪要。\n没有这部分材料时，经营分析无法准确解释赢率变化原因。',
        },
        {
          memberName: '许岚',
          role: '客户经理',
          status: '待提交',
          submittedAt: '待提交',
          snippet: '当前尚未提交重点商机复盘。',
          nextActions: '',
          blocker: '待确认客户本周反馈',
        },
        {
          memberName: '程果',
          role: '回款运营',
          status: '已提交',
          submittedAt: '昨天 19:20',
          snippet: '已补充商机回款节点与商务付款条件，当前无新增风险。',
          nextActions: '继续跟进客户财务审批结果。',
          blocker: '无',
          progressDetail:
            '已对 3 个即将签约商机补充付款条件和回款节点说明，当前付款条款整体可控。\n其中 1 个客户提出首付款比例调整，但预计不会影响本季度回款目标，已作为观察项记录。',
          actionDetail:
            '持续跟进客户财务审批结果，并在客户确认付款条款后更新到商机复盘表。\n若出现付款比例下调，会第一时间通知负责人重新评估签约节奏。',
          supportDetail:
            '当前无必须升级的问题，但建议商务同事同步确认首付款比例的审批边界，防止后续临门一脚再出现条件变化。',
        },
      ],
    }),
    buildReportItem(id, 'risk-daily', {
      title: `${teamName} 回款风险日报`,
      cycle: '日报',
      deadline: '今天 18:00',
      focus: ['回款风险', '阻塞事项'],
      submitFields: ['text', 'number', 'image'],
      summary: '用于每日收集临近回款节点客户的风险状态和处理动作。',
      submissions: [
        {
          memberName: '林嘉豪',
          role: '销售负责人',
          status: '已提交',
          submittedAt: '今天 10:00',
          snippet: '已确认本周 2 个重点客户回款节点，暂无新增重大异常。',
          nextActions: '继续盯紧本周签约客户的审批与回款排期。',
          blocker: '无',
          progressDetail:
            '今天重点确认了 2 个临近回款节点客户的付款进展，客户口头承诺的回款时间未出现新的延后。\n其中 1 个客户已进入内部付款流程，另 1 个客户仍在走采购补充审批，但预计本周内能完成。',
          actionDetail:
            '明天继续追踪采购审批状态，并在午前同步最新回款预测给经营分析。\n如果审批未按预期推进，会在日报中直接升级为风险项。',
          supportDetail:
            '当前暂无必须升级的问题，但建议经营分析关注这 2 个客户的审批节奏，避免周末前集中暴露风险。',
        },
        {
          memberName: '周宁',
          role: '经营分析',
          status: '已提交',
          submittedAt: '今天 10:15',
          snippet: '已更新日报风险分层和回款节奏变动原因。',
          nextActions: '同步更新日报风险趋势和异常原因。',
          blocker: '无',
          progressDetail:
            '已完成今日日报的风险分层，新增 1 个中风险项目，原因是客户内部付款审批从本周三延后到本周五。\n整体回款节奏较昨日无大幅变化，但建议继续关注延期项目是否会外溢到下周。',
          actionDetail:
            '会在下午补齐异常原因说明，并把风险变化趋势同步给销售负责人和回款运营。\n如果客户再出现延后，会直接调整项目风险等级并在周会材料中体现。',
          supportDetail:
            '当前无额外支持诉求，但需要回款运营在今天 17 点前确认客户财务口径，以免日报和周报数据出现偏差。',
        },
        {
          memberName: '许岚',
          role: '客户经理',
          status: '待提交',
          submittedAt: '待提交',
          snippet: '待补充客户最新付款节点和商务反馈。',
          nextActions: '',
          blocker: '待联系客户财务确认付款计划',
        },
        {
          memberName: '程果',
          role: '回款运营',
          status: '已提交',
          submittedAt: '今天 09:20',
          snippet: '已确认 1 个延期项目进入预警，建议负责人周会优先关注。',
          nextActions: '补充延期原因并推进内部协同。',
          blocker: '需业务负责人确认内部协同方案',
          progressDetail:
            '已确认“康桥项目”回款节点从今天延后到下周一，原因是客户财务负责人临时出差，付款审批未完成。\n该项目已进入预警名单，虽然金额不大，但若再次顺延，会影响本周日报风险判断。',
          actionDetail:
            '今天会补充完整延期原因，并和客户经理确认客户新的承诺时间。\n同时推动内部同步一版应对方案，确保周会中可以直接决定是否升级负责人介入。',
          supportDetail:
            '需要业务负责人确认内部协同方案，并判断是否由负责人直接联系客户高层。\n如果今天无法确认，建议默认在周会中列为优先讨论项。',
        },
      ],
    }),
  ];

  const tasks: SalesTask[] = [
    {
      id: `${id}-task-1`,
      title: `${teamName} 本周客户推进复盘`,
      type: 'AI 复盘',
      owner: '周宁',
      status: '进行中',
      progress: '72%',
      updatedAt: '今天 10:20',
    },
    {
      id: `${id}-task-2`,
      title: `${teamName} 高风险客户跟进`,
      type: '风险盘点',
      owner: '林嘉豪',
      status: '待确认',
      progress: '待负责人确认',
      updatedAt: '今天 09:15',
    },
    {
      id: `${id}-task-3`,
      title: `${teamName} 周会行动清单`,
      type: '行动项',
      owner: '许岚',
      status: '已完成',
      progress: '100%',
      updatedAt: '昨天 18:30',
    },
  ];

  const metrics: SalesMetric[] = [
    {
      label: '本周新增线索',
      value: '26',
      trend: '+8%',
      description: '近 7 天进入销售池的新线索数量',
    },
    {
      label: '活跃商机',
      value: '14',
      trend: '+3',
      description: '当前仍在推进中的重点商机总量',
    },
    {
      label: '高风险客户',
      value: '3',
      trend: '-1',
      description: '需要负责人跟进的高风险客户数',
    },
    {
      label: '问答调用',
      value: '31',
      trend: '+21%',
      description: '近 7 天销售顾问问答调用次数',
    },
  ];

  const boardCards: SalesBoardCard[] = [
    {
      title: '本周目标达成率',
      value: '82%',
      detail: '重点看新增商机转化和回款达成两条线',
    },
    {
      title: '回款风险客户',
      value: '2 个',
      detail: '本周需要优先跟进的高风险回款客户',
    },
    {
      title: '重点商机复盘',
      value: '5 个',
      detail: '已进入本周周会复盘的高优商机数量',
    },
  ];

  const qnaPresets: SalesQuestionPreset[] = [
    {
      id: `${id}-qa-1`,
      question: '本周最需要负责人介入的客户有哪些？',
      answer:
        '当前最需要负责人介入的是推进停滞超过 7 天且仍处于高潜状态的客户，以及本周计划签约但回款节奏仍未明确的客户。建议先解除推进阻塞，再核对回款风险。',
      sources: [
        `${teamName} / 销售汇报收集 / 今日`,
        `${teamName} / AI 复盘摘要 / 最新`,
        `${teamName} / 数据看板 / 重点客户`,
      ],
    },
    {
      id: `${id}-qa-2`,
      question: '周会前我应该先看哪几个模块？',
      answer:
        '建议先看工作汇报里哪些成员已提交，再看 AI 复盘分析中的高风险客户判断，最后结合数据看板核对目标达成率和回款风险，这样能快速进入销售周会节奏。',
      sources: [
        `${teamName} / 汇报收集状态 / 本周`,
        `${teamName} / AI 复盘建议动作 / 最新`,
        `${teamName} / 数据看板 / 周视图`,
      ],
    },
    {
      id: `${id}-qa-3`,
      question: '哪些商机值得继续重点投入？',
      answer:
        '建议继续重点投入高潜、短周期且已有明确推进节点的商机，同时对回款周期偏长的项目保持谨慎。当前重点仍应优先看负责人介入空间和推进阻塞是否可解除。',
      sources: [
        `${teamName} / 活跃商机列表 / 本周`,
        `${teamName} / 周复盘结论 / 今日`,
        `${teamName} / 销售行动建议 / 最新`,
      ],
    },
  ];

  return {
    id,
    tenantName,
    teamName,
    roleLabel,
    defaultPerspective: 'manager',
    focusLabel,
    memberCount: reportItems[0]?.submissions.length ?? 0,
    taskCount: tasks.length,
    syncTime: '今天 11:20',
    reportItems,
    memberPerspectiveName: '许岚',
    memberPerspectiveRole: '客户经理',
    tasks,
    reviewSummary: `${teamName} 当前的重点是先收齐团队汇报，再把高潜客户推进、回款风险和周会行动清单串起来。以下内容全部为前端 Mock，用于演示销售管理智能体的工作面板。`,
    reviewHighlights: [
      '工作汇报里仍有 1 名成员待提交，1 名成员需要补充风险说明。',
      '高潜客户推进节奏明显快于上周，但仍有 2 个重点客户推进节点滞后。',
      '回款风险主要集中在合同已确认但排期仍未明确的客户。',
    ],
    reviewActions: [
      '优先催收待提交成员的本周销售汇报。',
      '把高风险回款客户同步到周会优先讨论清单。',
      '把 AI 复盘里需要支持的事项转成下周行动项。',
    ],
    metrics,
    boardCards,
    qnaPresets,
    ...overrides,
  };
};

const teams = ref<SalesTeamWorkspace[]>([
  buildTeamWorkspace('sales-team-1', '华东大区', '华东直营销售团队', '销售负责人', '重点客户推进', {
    defaultPerspective: 'manager',
  }),
  buildTeamWorkspace('sales-team-2', '战略客户中心', 'KA 大客户团队', '经营分析', '高价值客户经营', {
    syncTime: '今天 09:40',
    defaultPerspective: 'member',
    memberPerspectiveName: '周宁',
    memberPerspectiveRole: '经营分析',
  }),
  buildTeamWorkspace('sales-team-3', '渠道事业部', '渠道增长团队', '业务负责人', '渠道线索转化', {
    syncTime: '昨天 18:15',
    defaultPerspective: 'manager',
  }),
]);

const route = useRoute();
const router = useRouter();

const reportPerspective = ref<ReportPerspective>('manager');
const activeSection = ref<WorkspaceSection>('report');
const managerReportPage = ref<ReportPageMode>('list');
const memberReportPage = ref<ReportPageMode>('list');
const activeManagerReportId = ref('');
const activeMemberReportId = ref('');
const activeSubmissionId = ref('');
const showTaskModal = ref(false);
const taskModalMode = ref<TaskModalMode>('create');
const feedbackMessage = ref('当前页面全部为 Demo 交互，团队、汇报、复盘、看板和问答均为 Mock。');
const activeQuestionId = ref('');
const questionInput = ref('');
const customQuestion = ref('');
const customAnswer = ref('');
const customSources = ref<string[]>([]);
const customSystemContext = ref('');
const customAnswerRole = ref('');
const isGeneratingEvaluation = ref(false);
const pendingEvaluationPayload = ref<EvaluationDraftPayload | null>(null);
const memberAssistMode = ref<AssistInputMode>('paste');
const memberAssistFiles = ref<string[]>([]);
const memberAssistResult = ref<MemberAssistResult | null>(null);
const memberAssistStatus = ref<MemberAssistRunStatus>('idle');
const memberAssistSteps = ref<MemberAssistStep[]>([]);
const reportTaskDraft = ref<CreateReportTaskDraft>(createReportTaskDraft());
let evaluationGenerationId = 0;
let memberAssistGenerationId = 0;
let answerStreamTimer: ReturnType<typeof setInterval> | null = null;

const memberAssistDemoMaterials = [
  '客户拜访纪要-华东医院集团-0320.md',
  '晨会语音转写-许岚-0320.txt',
  '微信沟通截图-瑞成医疗报价确认.png',
  '下周客户排期草表.xlsx',
];

const memberAssistDemoInput =
  '今天上午先跟进了华东医院集团和瑞成医疗两个客户。华东医院集团已经确认下周二做最终方案评审，客户希望我们提前补一版实施排期和商务测算；瑞成医疗这边商务负责人已经认可报价方向，但采购负责人本周一直没有确认排期，可能会影响月底推进。下午又和运营同事核了一遍几个客户的回款节奏，当前没有新增异常，但如果瑞成医疗的排期继续延后，负责人可能需要提前介入。下周我计划先把方案评审会和报价说明材料准备好，同时请销售负责人帮忙确认折扣边界和客户优先级。';

const recentTools = computed(() => {
  return [
    {
      icon: Briefcase,
      label: '销售管理智能体',
      route: 'sales-management',
      active: true,
    },
    {
      icon: Database,
      label: '数据顾问智能体',
      route: 'data-advisor',
    },
    ...businessModuleToolList.filter((tool) => tool.route !== 'sales-management'),
  ];
});

const selectedTeamId = computed(() => {
  const teamId = route.query.team;
  return typeof teamId === 'string' ? teamId : null;
});

const currentTeam = computed(() => {
  return teams.value.find((team) => team.id === selectedTeamId.value) ?? null;
});

const isMemberAssistMode = computed(() => {
  return (
    activeSection.value === 'report'
    && reportPerspective.value === 'member'
    && memberReportPage.value === 'detail'
    && !!activeMemberReport.value
    && !!activeMemberDraft.value
  );
});

const reportItems = computed(() => currentTeam.value?.reportItems ?? []);
const teamMembers = computed<TeamMemberOption[]>(() => {
  const source = currentTeam.value?.reportItems[0]?.submissions ?? [];
  return source.map((item) => ({
    name: item.memberName,
    role: item.role,
    email: memberEmailMap[item.memberName] ?? '未填写',
    avatar: item.memberName.slice(0, 1),
  }));
});
const selectedTaskMemberCount = computed(() => reportTaskDraft.value.selectedMembers.length);

const visibleQuestionList = computed(() => currentTeam.value?.qnaPresets ?? []);

const activePreset = computed(() => {
  return visibleQuestionList.value.find((item) => item.id === activeQuestionId.value) ?? visibleQuestionList.value[0] ?? null;
});

const displaySystemContext = computed(() => {
  return (
    customSystemContext.value ||
    `已载入 ${currentTeam.value?.teamName ?? '当前团队'} 的工作汇报、AI 复盘分析和数据看板，右侧问答将基于当前团队上下文返回。`
  );
});

const inputAttachmentList = computed(() => {
  if (isMemberAssistMode.value) {
    return memberAssistFiles.value;
  }

  return pendingEvaluationPayload.value?.sources ?? [];
});

const isEvaluationDraftMode = computed(() => {
  return pendingEvaluationPayload.value !== null;
});

const rightPanelTitle = computed(() => {
  return isMemberAssistMode.value ? 'AI 填报助手' : '团队对话框';
});

const rightPanelMeta = computed(() => {
  return isMemberAssistMode.value ? '当前不是提问区，而是内容整理填报区' : '基于当前团队工作面板';
});

const memberAssistPlaceholder = computed(() => {
  if (memberAssistMode.value === 'voice') {
    return '可直接粘贴语音转写内容，发送后 AI 会自动拆成左侧待填写项';
  }

  if (memberAssistMode.value === 'upload') {
    return '可补充说明本次上传资料的背景，发送后 AI 会结合附件自动整理左侧内容';
  }

  return '可直接粘贴客户跟进记录、会议纪要、聊天摘录或拜访总结，发送后自动填入左侧字段';
});

const inputActionLabel = computed(() => {
  return isMemberAssistMode.value ? '整理并填充' : '发送';
});

const inputAttachmentLabel = computed(() => {
  return isMemberAssistMode.value ? '已带入资料' : '已带入材料';
});

const isPinnedInputMode = computed(() => {
  return isEvaluationDraftMode.value;
});

const displayQuestion = computed(() => {
  return customQuestion.value || activePreset.value?.question || '请选择右侧快捷问题或输入一个销售问题';
});

const displayAnswerRole = computed(() => {
  return customAnswerRole.value || '顾问回答';
});

const displayAnswer = computed(() => {
  if (customAnswerRole.value || isGeneratingEvaluation.value) {
    return customAnswer.value || '正在生成评估结论...';
  }

  return (
    customAnswer.value ||
    activePreset.value?.answer ||
    '当前将结合工作汇报、AI 复盘分析和数据看板返回团队问答结果。'
  );
});

const displaySourceLabel = computed(() => {
  return customAnswerRole.value === 'AI 评估' ? '已带入材料' : '引用来源';
});

const displaySources = computed(() => {
  return customQuestion.value ? customSources.value : activePreset.value?.sources ?? [];
});

const activeManagerReport = computed(() => {
  return reportItems.value.find((item) => item.id === activeManagerReportId.value) ?? reportItems.value[0] ?? null;
});

const activeMemberReport = computed(() => {
  return reportItems.value.find((item) => item.id === activeMemberReportId.value) ?? reportItems.value[0] ?? null;
});

const activeReportForStatus = computed(() => {
  return reportPerspective.value === 'member' ? activeMemberReport.value : activeManagerReport.value;
});

const getReportSubmittedCount = (reportItem: ReportItem | null) => {
  return reportItem?.submissions.filter((item) => item.status === '已提交').length ?? 0;
};

const getReportPendingCount = (reportItem: ReportItem | null) => {
  return reportItem?.submissions.filter((item) => item.status !== '已提交').length ?? 0;
};

const getReportAttentionCount = (reportItem: ReportItem | null) => {
  return reportItem?.submissions.filter((item) => item.status === '待补充').length ?? 0;
};

const reportSubmittedCount = computed(() => {
  return getReportSubmittedCount(activeReportForStatus.value);
});

const reportPendingCount = computed(() => {
  return getReportPendingCount(activeReportForStatus.value);
});

const reportStatusText = computed(() => {
  if (!activeReportForStatus.value) return '';
  return `${reportSubmittedCount.value}/${activeReportForStatus.value.submissions.length} 已收集`;
});

const activeSectionMeta = computed(() => {
  if (activeSection.value === 'report') {
    return '支持多汇报项卡片、配置字段和成员提交明细查看';
  }

  if (activeSection.value === 'review') {
    return '基于当前汇报和任务自动生成';
  }

  return '当前团队视图';
});

const activeSubmission = computed(() => {
  return activeManagerReport.value?.submissions.find((item) => item.id === activeSubmissionId.value) ?? null;
});

const getSubmissionProgressDetail = (submission: ReportSubmission) => {
  return submission.progressDetail || submission.snippet || '待提交后显示';
};

const getSubmissionActionDetail = (submission: ReportSubmission) => {
  return submission.actionDetail || submission.nextActions || '待提交后显示';
};

const getSubmissionSupportDetail = (submission: ReportSubmission) => {
  return submission.supportDetail || submission.blocker || '无';
};

const stopAnswerStreaming = () => {
  if (!answerStreamTimer) return;
  clearInterval(answerStreamTimer);
  answerStreamTimer = null;
};

const resetMemberAssistState = (options?: { preserveInput?: boolean }) => {
  memberAssistGenerationId += 1;
  memberAssistMode.value = 'paste';
  memberAssistFiles.value = [];
  memberAssistResult.value = null;
  memberAssistStatus.value = 'idle';
  memberAssistSteps.value = [];
  if (!options?.preserveInput) {
    questionInput.value = '';
  }
};

const resetCustomConversation = (options?: { preserveInput?: boolean }) => {
  evaluationGenerationId += 1;
  stopAnswerStreaming();
  customQuestion.value = '';
  customAnswer.value = '';
  customSources.value = [];
  customSystemContext.value = '';
  customAnswerRole.value = '';
  isGeneratingEvaluation.value = false;
  pendingEvaluationPayload.value = null;
  if (!options?.preserveInput) {
    questionInput.value = '';
  }
};

const buildReportEvaluationConclusion = (reportItem: ReportItem) => {
  const submittedItems = reportItem.submissions.filter((item) => item.status === '已提交');
  const pendingItems = reportItem.submissions.filter((item) => item.status === '待提交');
  const warningItems = reportItem.submissions.filter((item) => item.status === '待补充');

  const strongNames = submittedItems.map((item) => item.memberName).join('、') || '暂无';
  const warningNames = warningItems.map((item) => item.memberName).join('、') || '暂无';
  const pendingNames = pendingItems.map((item) => item.memberName).join('、') || '暂无';

  return [
    `已完成本次“${reportItem.title}”的团队提交质量评估。整体结论为：内容完整度中上，但仍有关键缺口需要补齐后才能进入下一轮复盘。`,
    '',
    `1. 完整性评估：当前已提交 ${submittedItems.length} 份、待补充 ${warningItems.length} 份、待提交 ${pendingItems.length} 份。${strongNames} 的内容结构相对完整，已经覆盖了工作进展、问题暴露和下一步动作。`,
    '',
    `2. 质量判断：已提交内容大多能围绕“${reportItem.focus.join('、')}”展开，但 ${warningNames} 仍缺少关键风险说明，${pendingNames} 尚未提供有效输入，导致团队视角下的信息闭环还不够完整。`,
    '',
    '3. 可执行性判断：当前汇报里已经能看出需要负责人介入的事项，也有明确的下周动作，但部分提交还停留在现象描述，缺少负责人、时间点和判断依据，后续会议决策仍需要二次追问。',
    '',
    `建议动作：先催收 ${pendingNames} 的正式提交，再优先要求 ${warningNames} 补齐缺失说明；待信息补齐后，可由 AI 继续输出一版团队级复盘摘要和负责人介入建议。`,
  ].join('\n');
};

const streamMockAnswer = (fullText: string) => {
  stopAnswerStreaming();
  customAnswer.value = '';

  let cursor = 0;
  const chunkSize = 28;

  answerStreamTimer = setInterval(() => {
    const nextCursor = Math.min(cursor + chunkSize, fullText.length);
    customAnswer.value = fullText.slice(0, nextCursor);
    cursor = nextCursor;

    if (cursor >= fullText.length) {
      stopAnswerStreaming();
      isGeneratingEvaluation.value = false;
    }
  }, 45);
};

const selectMemberAssistMode = (mode: AssistInputMode) => {
  memberAssistMode.value = mode;

  if (mode === 'voice') {
    feedbackMessage.value = '当前切换到语音录入演示模式，可直接粘贴语音转写文本后发送，AI 会自动整理并填充左侧。';
    return;
  }

  if (mode === 'upload') {
    feedbackMessage.value = '当前切换到资料上传演示模式，可上传会议纪要、拜访记录或聊天摘录，再让 AI 自动整理。';
    return;
  }

  feedbackMessage.value = '当前切换到粘贴发送模式，可直接录入原始内容，AI 会自动结构化填充左侧字段。';
};

const handleMemberAssistUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);

  if (files.length === 0) return;

  memberAssistMode.value = 'upload';
  memberAssistFiles.value = [...memberAssistFiles.value, ...files.map((file) => file.name)];
  memberAssistResult.value = null;
  feedbackMessage.value = `已模拟上传 ${files.length} 份资料，发送后 AI 会结合这些内容自动填充左侧待填写项。`;
  target.value = '';
};

const injectVoiceTranscript = () => {
  memberAssistMode.value = 'voice';
  memberAssistResult.value = null;

  if (!questionInput.value.trim()) {
    questionInput.value =
      '今天上午跟进了华东医院集团和瑞成医疗两个客户。华东医院集团已经确认下周做最终方案评审，瑞成医疗这边还在等采购负责人确认排期。下周计划先把方案确认会定下来，同时需要销售负责人帮忙确认报价策略。';
  }

  feedbackMessage.value = '已模拟插入一段语音转写内容，发送后会自动拆成左侧“本周推进 / 下周动作 / 需要支持”。';
};

const buildMemberAssistStructuredDraft = (rawText: string, materialCount = memberAssistFiles.value.length) => {
  const compact = rawText.replace(/\s+/g, ' ').trim();
  const excerpt = compact ? `原始输入已覆盖“${compact.slice(0, 26)}${compact.length > 26 ? '...' : ''}”等关键信息。` : '当前主要依据已带入资料进行整理。';
  const fileNote = materialCount > 0 ? `并结合 ${materialCount} 份补充资料完成整理。` : '';
  const currentTitle = activeMemberReport.value?.title ?? '当前汇报项';

  return {
    progress:
      `本周围绕重点客户推进补充了客户沟通、方案确认和商务节奏信息。${excerpt}${fileNote}\n已整理出当前最关键的推进节点：1 个客户进入下周方案评审，1 个客户仍等待采购负责人确认排期，整体推进仍需继续跟进签约前置动作。`,
    nextActions:
      `下周优先完成 2 个动作：第一，尽快和客户确认方案评审或拜访排期，避免关键客户继续停留在待确认状态；第二，提前同步商务和报价准备，确保 ${currentTitle} 进入下一轮沟通时可以直接推进决策。`,
    supportNeed:
      '当前需要销售负责人协助确认报价策略和客户优先级；如果下周仍无法确认采购排期，建议负责人直接介入推动。\n如需补充证据材料，可继续上传会议纪要、聊天记录或语音转写，AI 会再次整理并覆盖左侧内容。',
    summary:
      `已按“${currentTitle}”的提交要求完成结构化整理，并自动填充左侧 3 个待填写项。你现在可以直接检查、微调后提交。`,
  };
};

const waitForMemberAssist = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const pushMemberAssistStep = (step: MemberAssistStep) => {
  memberAssistSteps.value = [...memberAssistSteps.value, step];
};

const patchMemberAssistStep = (id: string, patch: Partial<MemberAssistStep>) => {
  memberAssistSteps.value = memberAssistSteps.value.map((step) => {
    if (step.id !== id) return step;
    return {
      ...step,
      ...patch,
    };
  });
};

const streamMemberDraftField = async (
  field: keyof MemberDraft,
  value: string,
  generationId: number,
) => {
  if (!activeMemberDraft.value) return false;

  activeMemberDraft.value[field] = '';
  let cursor = 0;
  const chunkSize = field === 'progress' ? 18 : 14;

  while (cursor < value.length) {
    if (generationId !== memberAssistGenerationId || !activeMemberDraft.value) {
      return false;
    }

    const nextCursor = Math.min(cursor + chunkSize, value.length);
    activeMemberDraft.value[field] = value.slice(0, nextCursor);
    cursor = nextCursor;
    await waitForMemberAssist(24);
  }

  return true;
};

const runMemberAssistDemo = async (rawText: string) => {
  if (!activeMemberDraft.value || !activeMemberReport.value) return;

  memberAssistGenerationId += 1;
  const generationId = memberAssistGenerationId;
  const originalFiles = [...memberAssistFiles.value];
  const mergedMaterials = Array.from(new Set([...originalFiles, ...memberAssistDemoMaterials]));
  const normalizedInput = rawText.trim() || memberAssistDemoInput;
  const structuredDraft = buildMemberAssistStructuredDraft(normalizedInput, mergedMaterials.length);

  memberAssistStatus.value = 'running';
  memberAssistSteps.value = [];
  memberAssistResult.value = null;
  memberAssistFiles.value = [];
  questionInput.value = '';
  activeMemberDraft.value.progress = '';
  activeMemberDraft.value.nextActions = '';
  activeMemberDraft.value.supportNeed = '';

  pushMemberAssistStep({
    id: 'collect',
    title: '接收输入并生成本次填报任务',
    detail: rawText.trim()
      ? '已收到当前输入内容，正在判断客户名称、推进阶段和支持诉求。'
      : '未检测到手动输入，已自动带入一组演示资料与默认跟进内容。',
    kind: 'thinking',
    status: 'running',
  });
  await waitForMemberAssist(180);
  if (generationId !== memberAssistGenerationId) return;

  patchMemberAssistStep('collect', {
    status: 'done',
    detail: '已识别出 2 个重点客户、1 个待确认排期节点和 1 个需要负责人介入的商务诉求。',
  });

  pushMemberAssistStep({
    id: 'materials',
    title: '调用资料归并工具',
    detail: '正在挂载客户拜访纪要、语音转写、截图和排期表，补齐本次演示的辅助资料。',
    kind: 'tool',
    status: 'running',
  });

  for (const item of mergedMaterials) {
    if (generationId !== memberAssistGenerationId) return;
    memberAssistFiles.value = [...memberAssistFiles.value, item];
    await waitForMemberAssist(110);
  }

  if (generationId !== memberAssistGenerationId) return;
  patchMemberAssistStep('materials', {
    status: 'done',
    detail: `已带入 ${mergedMaterials.length} 份辅助资料，包含语音转写、纪要、截图与排期表。`,
  });

  pushMemberAssistStep({
    id: 'progress',
    title: '提取本周推进并写入左侧',
    detail: '正在调用结构化抽取工具，生成客户推进摘要和关键变化。',
    kind: 'write',
    status: 'running',
  });

  const progressFinished = await streamMemberDraftField('progress', structuredDraft.progress, generationId);
  if (!progressFinished) return;
  patchMemberAssistStep('progress', {
    status: 'done',
    detail: '“本周推进”已完成填充，已写入客户推进进展、签约预估和当前阻塞点。',
  });

  pushMemberAssistStep({
    id: 'actions',
    title: '生成下周动作计划',
    detail: '正在拆解后续动作、时间点和需要优先推进的节点。',
    kind: 'write',
    status: 'running',
  });

  const actionFinished = await streamMemberDraftField('nextActions', structuredDraft.nextActions, generationId);
  if (!actionFinished) return;
  patchMemberAssistStep('actions', {
    status: 'done',
    detail: '“下周动作”已完成填充，已生成后续计划、推进节点和下一轮目标。',
  });

  pushMemberAssistStep({
    id: 'support',
    title: '归纳需要支持事项',
    detail: '正在识别需要负责人确认或跨团队协同处理的问题。',
    kind: 'tool',
    status: 'running',
  });

  const supportFinished = await streamMemberDraftField('supportNeed', structuredDraft.supportNeed, generationId);
  if (!supportFinished) return;
  patchMemberAssistStep('support', {
    status: 'done',
    detail: '“需要支持”已完成填充，已写入负责人介入诉求和补充材料建议。',
  });

  if (generationId !== memberAssistGenerationId) return;

  memberAssistStatus.value = 'completed';
  memberAssistResult.value = {
    summary: structuredDraft.summary,
    sourceLabel: '已完成',
  };
  feedbackMessage.value = '已完成成员填报助手 Demo 演示，左侧 3 个字段已按流程自动填充。';
};

const activeMemberSubmission = computed(() => {
  if (!currentTeam.value || !activeMemberReport.value) return null;
  return (
    activeMemberReport.value.submissions.find((item) => item.memberName === currentTeam.value?.memberPerspectiveName) ?? null
  );
});

const activeMemberDraft = computed(() => {
  if (!currentTeam.value || !activeMemberReport.value) return null;
  return activeMemberReport.value.memberDrafts[currentTeam.value.memberPerspectiveName] ?? null;
});

const taskModalTitle = computed(() => (taskModalMode.value === 'create' ? '新建汇报任务' : '配置汇报任务'));
const taskModalSubmitLabel = computed(() => (taskModalMode.value === 'create' ? '创建任务' : '保存配置'));

const openTeamWorkspace = (teamId: string) => {
  router.replace({
    name: 'sales-management',
    query: {
      workspace: '1',
      team: teamId,
    },
  });
};

const backToTeamList = () => {
  router.replace({ name: 'sales-management' });
};

const handleCreatePlaceholder = () => {
  feedbackMessage.value = '“新建团队”当前先用虚位卡片展示，后续再补团队创建流程。';
};

const switchReportPerspective = (mode: ReportPerspective) => {
  reportPerspective.value = mode;
  feedbackMessage.value =
    mode === 'manager'
      ? '当前切换到管理者视角，可设置收集汇报并查看提交情况。'
      : '当前切换到成员视角，可填写并提交个人销售汇报。';
};

const switchWorkspaceSection = (section: WorkspaceSection) => {
  activeSection.value = section;
};

const selectManagerReport = (reportId: string) => {
  const target = reportItems.value.find((item) => item.id === reportId);
  activeManagerReportId.value = reportId;
  activeSubmissionId.value = target?.submissions[0]?.id ?? '';
  managerReportPage.value = 'detail';
  if (target) {
    feedbackMessage.value = `已切换到“${target.title}”，当前可查看配置字段和成员提交状态。`;
  }
};

const selectMemberReport = (reportId: string) => {
  const target = reportItems.value.find((item) => item.id === reportId);
  activeMemberReportId.value = reportId;
  memberReportPage.value = 'detail';
  resetMemberAssistState();
  if (target) {
    feedbackMessage.value = `已切换到“${target.title}”，当前可填写该汇报项的提交内容。`;
  }
};

const backToReportList = () => {
  if (reportPerspective.value === 'manager') {
    if (managerReportPage.value === 'submission') {
      managerReportPage.value = 'detail';
      feedbackMessage.value = '已返回提交状态列表，可继续查看其他成员内容。';
      return;
    }

    managerReportPage.value = 'list';
    feedbackMessage.value = '已返回汇报项列表，可继续选择其他汇报项或新增。';
    return;
  }

  resetMemberAssistState();
  memberReportPage.value = 'list';
  feedbackMessage.value = '已返回成员汇报项列表，可继续选择需要提交的汇报。';
};

const selectSubmission = (submissionId: string) => {
  const target = activeManagerReport.value?.submissions.find((item) => item.id === submissionId) ?? null;
  activeSubmissionId.value = submissionId;
  managerReportPage.value = 'submission';
  if (target) {
    feedbackMessage.value = `已进入 ${target.memberName} 的提交详情页，当前展示完整提交内容。`;
  }
};

const resetReportTaskDraft = () => {
  const nextDraft = createReportTaskDraft();
  nextDraft.title = `${currentTeam.value?.teamName ?? '当前团队'} 新建汇报任务`;
  nextDraft.summary = '用于新增一个面向团队成员的收集任务，可配置成员、提交项和截止时间。';
  nextDraft.selectedMembers = teamMembers.value.map((item) => item.name);
  reportTaskDraft.value = nextDraft;
};

const openCreateTaskModal = () => {
  taskModalMode.value = 'create';
  resetReportTaskDraft();
  showTaskModal.value = true;
};

const openEditTaskModal = (reportItem: ReportItem) => {
  const [deadlineDatePart, deadlineTimePart] = reportItem.deadline.split(' ');
  taskModalMode.value = 'edit';
  activeManagerReportId.value = reportItem.id;
  reportTaskDraft.value = {
    title: reportItem.title,
    summary: reportItem.summary,
    cycle: reportItem.cycle,
    deadlineDate: deadlineDatePart || reportItem.deadline,
    deadlineTime: deadlineTimePart || '18:00',
    focus: [...reportItem.focus],
    selectedMembers: reportItem.submissions.map((item) => item.memberName),
    submitFields: [...reportItem.submitFields],
  };
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
};

const addReportItem = () => {
  if (!currentTeam.value) return;
  openCreateTaskModal();
  feedbackMessage.value = '已打开新建任务弹窗，可选择成员、配置提交项和截止时间。';
};

const toggleTaskMember = (memberName: string) => {
  const selectedMembers = reportTaskDraft.value.selectedMembers;
  if (selectedMembers.includes(memberName)) {
    reportTaskDraft.value.selectedMembers = selectedMembers.filter((item) => item !== memberName);
    return;
  }

  reportTaskDraft.value.selectedMembers = [...selectedMembers, memberName];
};

const toggleTaskSubmitField = (field: SubmitFieldType) => {
  const submitFields = reportTaskDraft.value.submitFields;
  if (submitFields.includes(field)) {
    reportTaskDraft.value.submitFields = submitFields.filter((item) => item !== field);
    return;
  }

  reportTaskDraft.value.submitFields = [...submitFields, field];
};

const createReportTask = () => {
  if (!currentTeam.value) return;

  if (!reportTaskDraft.value.title.trim()) {
    feedbackMessage.value = '请先填写任务名称，再创建任务。';
    return;
  }

  if (reportTaskDraft.value.selectedMembers.length === 0) {
    feedbackMessage.value = '请至少勾选 1 位团队成员。';
    return;
  }

  if (reportTaskDraft.value.submitFields.length === 0) {
    feedbackMessage.value = '请至少配置 1 个提交项。';
    return;
  }

  const nextIndex = currentTeam.value.reportItems.length + 1;
  const memberMap = new Map(teamMembers.value.map((item) => [item.name, item.role]));
  const newReportItem = buildReportItem(currentTeam.value.id, `custom-${nextIndex}`, {
    title: reportTaskDraft.value.title.trim(),
    cycle: reportTaskDraft.value.cycle,
    deadline: `${reportTaskDraft.value.deadlineDate} ${reportTaskDraft.value.deadlineTime}`,
    focus: reportTaskDraft.value.focus,
    summary:
      reportTaskDraft.value.summary.trim() ||
      `需提交 ${reportTaskDraft.value.submitFields.length} 类内容，当前为新建任务 Demo 演示。`,
    submissions: reportTaskDraft.value.selectedMembers.map((memberName) => ({
      memberName,
      role: memberMap.get(memberName) ?? '团队成员',
      status: '待提交',
      submittedAt: '待提交',
      snippet: '当前尚未提交该任务内容。',
      nextActions: '',
      blocker: '待提交',
      progressDetail: '',
      actionDetail: '',
      supportDetail: '待提交',
    })),
  });

  currentTeam.value.reportItems = [...currentTeam.value.reportItems, newReportItem];
  activeManagerReportId.value = newReportItem.id;
  activeSubmissionId.value = newReportItem.submissions[0]?.id ?? '';
  closeTaskModal();
  managerReportPage.value = 'detail';
  feedbackMessage.value = `已创建“${newReportItem.title}”，当前进入任务详情页查看成员提交状态。`;
};

const saveReportSetting = () => {
  if (!currentTeam.value || !activeManagerReport.value) return;

  if (!reportTaskDraft.value.title.trim()) {
    feedbackMessage.value = '请先填写任务名称，再保存配置。';
    return;
  }

  if (reportTaskDraft.value.selectedMembers.length === 0) {
    feedbackMessage.value = '请至少勾选 1 位团队成员。';
    return;
  }

  if (reportTaskDraft.value.submitFields.length === 0) {
    feedbackMessage.value = '请至少配置 1 个提交项。';
    return;
  }

  const memberMap = new Map(teamMembers.value.map((item) => [item.name, item.role]));
  const existingSubmissionMap = new Map(
    activeManagerReport.value.submissions.map((item) => [item.memberName, item]),
  );

  activeManagerReport.value.title = reportTaskDraft.value.title.trim();
  activeManagerReport.value.summary = reportTaskDraft.value.summary.trim() || activeManagerReport.value.summary;
  activeManagerReport.value.cycle = reportTaskDraft.value.cycle;
  activeManagerReport.value.deadline = `${reportTaskDraft.value.deadlineDate} ${reportTaskDraft.value.deadlineTime}`;
  activeManagerReport.value.focus = [...reportTaskDraft.value.focus];
  activeManagerReport.value.submitFields = [...reportTaskDraft.value.submitFields];
  activeManagerReport.value.submissions = reportTaskDraft.value.selectedMembers.map((memberName, index) => {
    const existing = existingSubmissionMap.get(memberName);
    if (existing) {
      return existing;
    }

    return {
      id: `${activeManagerReport.value?.id}-submission-new-${index + 1}`,
      memberName,
      role: memberMap.get(memberName) ?? '团队成员',
      status: '待提交',
      submittedAt: '待提交',
      snippet: '当前尚未提交该任务内容。',
      nextActions: '',
      blocker: '待提交',
      progressDetail: '',
      actionDetail: '',
      supportDetail: '待提交',
    };
  });
  activeSubmissionId.value = activeManagerReport.value.submissions[0]?.id ?? '';
  closeTaskModal();
  feedbackMessage.value = `已更新“${activeManagerReport.value.title}”的任务配置，当前为前端 Mock。`;
};

const submitTaskModal = () => {
  if (taskModalMode.value === 'create') {
    createReportTask();
    return;
  }

  saveReportSetting();
};

const setReportCycle = (cycle: string) => {
  if (showTaskModal.value) {
    reportTaskDraft.value.cycle = cycle;
    return;
  }

  if (!activeManagerReport.value) return;
  activeManagerReport.value.cycle = cycle;
};

const toggleReportFocus = (focus: string) => {
  if (showTaskModal.value) {
    const focusList = reportTaskDraft.value.focus;
    if (focusList.includes(focus)) {
      reportTaskDraft.value.focus = focusList.filter((item) => item !== focus);
      return;
    }

    reportTaskDraft.value.focus = [...focusList, focus];
    return;
  }

  if (!activeManagerReport.value) return;

  const focusList = activeManagerReport.value.focus;
  if (focusList.includes(focus)) {
    activeManagerReport.value.focus = focusList.filter((item) => item !== focus);
    return;
  }

  activeManagerReport.value.focus = [...focusList, focus];
};

const saveMemberDraftPreview = () => {
  if (!activeMemberReport.value || !activeMemberDraft.value) return;
  feedbackMessage.value = `已暂存“${activeMemberReport.value.title}”的演示草稿，当前为前端 Mock。`;
};

const submitMemberReport = () => {
  if (!currentTeam.value || !activeMemberReport.value || !activeMemberDraft.value || !activeMemberSubmission.value) return;

  const { progress, nextActions, supportNeed } = activeMemberDraft.value;

  if (!progress.trim() || !nextActions.trim()) {
    feedbackMessage.value = '请先补充“本周推进”和“下周动作”，再提交汇报。';
    return;
  }

  activeMemberSubmission.value.status = '已提交';
  activeMemberSubmission.value.submittedAt = '刚刚提交';
  activeMemberSubmission.value.snippet = progress.trim();
  activeMemberSubmission.value.nextActions = nextActions.trim();
  activeMemberSubmission.value.blocker = supportNeed.trim() || '无';
  activeMemberSubmission.value.progressDetail = progress.trim();
  activeMemberSubmission.value.actionDetail = nextActions.trim();
  activeMemberSubmission.value.supportDetail = supportNeed.trim() || '无';

  if (activeManagerReportId.value === activeMemberReport.value.id) {
    activeSubmissionId.value = activeMemberSubmission.value.id;
  }

  feedbackMessage.value = `已模拟提交 ${currentTeam.value.memberPerspectiveName} 在“${activeMemberReport.value.title}”中的汇报，管理者视角可查看最新结果。`;
};

const getSubmissionStatusClass = (status: ReportStatus) => {
  if (status === '已提交') return 'is-success';
  if (status === '待补充') return 'is-warning';
  return 'is-pending';
};

const getReportCardStatusLabel = (reportItem: ReportItem) => {
  if (getReportPendingCount(reportItem) === 0) return '已收齐';
  if (getReportAttentionCount(reportItem) > 0) return '待补充';
  return '待提交';
};

const getReportCardStatusClass = (reportItem: ReportItem) => {
  if (getReportPendingCount(reportItem) === 0) return 'is-success';
  if (getReportAttentionCount(reportItem) > 0) return 'is-warning';
  return 'is-pending';
};

const getMemberSubmissionForReport = (reportItem: ReportItem, memberName: string) => {
  return reportItem.submissions.find((item) => item.memberName === memberName) ?? null;
};

const selectPresetQuestion = (presetId: string) => {
  activeQuestionId.value = presetId;
  resetCustomConversation();
};

const submitQuestion = () => {
  if (!currentTeam.value) return;

  if (isMemberAssistMode.value) {
    if (!activeMemberReport.value || !activeMemberDraft.value) return;

    if (memberAssistStatus.value === 'running') {
      feedbackMessage.value = '填报助手正在处理当前资料，请等待本轮演示完成。';
      return;
    }

    void runMemberAssistDemo(questionInput.value);
    feedbackMessage.value = '已启动成员填报助手 Demo，右侧将展示节点过程，左侧字段会逐步自动填充。';
    return;
  }

  if (!questionInput.value.trim()) {
    feedbackMessage.value = '请先输入一个销售问题，再生成团队问答。';
    return;
  }

  const evaluationPayload = pendingEvaluationPayload.value;

  if (evaluationPayload) {
    evaluationGenerationId += 1;
    const currentGenerationId = evaluationGenerationId;
    stopAnswerStreaming();
    isGeneratingEvaluation.value = true;
    customSystemContext.value = evaluationPayload.systemContext;
    customQuestion.value = evaluationPayload.question;
    customAnswerRole.value = 'AI 评估';
    customSources.value = evaluationPayload.sources;
    customAnswer.value = '';
    pendingEvaluationPayload.value = null;
    questionInput.value = '';
    feedbackMessage.value = '已发送本次 AI 评估请求，右侧正在按流式方式输出团队提交质量结论。';

    setTimeout(() => {
      if (currentGenerationId !== evaluationGenerationId) return;
      streamMockAnswer(evaluationPayload.answerText);
    }, 120);
    return;
  }

  evaluationGenerationId += 1;
  stopAnswerStreaming();
  isGeneratingEvaluation.value = false;
  customQuestion.value = questionInput.value.trim();
  customAnswerRole.value = '';
  customSystemContext.value = '';
  customAnswer.value = `基于“${currentTeam.value.teamName}”当前的工作汇报、AI 复盘分析和数据看板，系统判断本次问题的重点仍然是高潜客户推进、负责人介入时点和回款风险节奏。当前回答为前端 Mock，用于展示销售管理智能体的团队对话能力。`;
  customSources.value = [
    `${currentTeam.value.teamName} / 工作汇报收集 / 最新`,
    `${currentTeam.value.teamName} / AI 复盘分析 / 今日`,
    `${currentTeam.value.teamName} / 数据看板 / 当前团队视图`,
  ];
  feedbackMessage.value = `已按“${currentTeam.value.teamName}”的团队上下文生成问答结果，当前为前端 Mock。`;
};

const runAiEvaluation = () => {
  if (!currentTeam.value || !activeManagerReport.value) return;

  const reportItem = activeManagerReport.value;
  const submittedItems = reportItem.submissions.filter((item) => item.status !== '待提交');
  const pendingItems = reportItem.submissions.filter((item) => item.status === '待提交');

  const question = `请基于“${reportItem.title}”的收集要求和所有成员已提交内容，输出一份团队提交质量评估结论。`;
  const systemContext = `已载入“${reportItem.title}”的收集要求、成员已提交内容和待补充情况，以下材料将以附件形式带入评估。`;

  activeQuestionId.value = '';
  resetCustomConversation({ preserveInput: true });
  pendingEvaluationPayload.value = {
    question,
    systemContext,
    sources: [
      `${reportItem.title}-收集要求.txt`,
      ...submittedItems.map((item) => `${item.memberName}-提交内容.md`),
      ...(pendingItems.length > 0 ? [`待补充与未提交名单-${pendingItems.length}人.md`] : []),
    ],
    answerText: buildReportEvaluationConclusion(reportItem),
  };
  questionInput.value = question;
  feedbackMessage.value = `已将“${reportItem.title}”的评估问题填入右侧输入框，相关材料以附件形式带入，点击发送即可演示流式输出。`;
};

watch(
  () => currentTeam.value?.id ?? null,
  (teamId, previousTeamId) => {
    if (!teamId) {
      feedbackMessage.value = '当前页面全部为 Demo 交互，团队、汇报、复盘、看板和问答均为 Mock。';
      return;
    }

    if (teamId === previousTeamId) {
      return;
    }

    const team = currentTeam.value;
    activeSection.value = 'report';
    reportPerspective.value = team?.defaultPerspective ?? 'manager';
    managerReportPage.value = 'list';
    memberReportPage.value = 'list';
    activeManagerReportId.value = team?.reportItems[0]?.id ?? '';
    activeMemberReportId.value = team?.reportItems[0]?.id ?? '';
    activeSubmissionId.value = team?.reportItems[0]?.submissions[0]?.id ?? '';
    resetReportTaskDraft();
    activeQuestionId.value = team?.qnaPresets[0]?.id ?? '';
    resetCustomConversation();
    resetMemberAssistState();
    feedbackMessage.value = `已进入“${team?.teamName ?? '当前团队'}”工作面板，当前内容均为前端 Mock 演示。`;
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="currentTeam" class="workspace-fullscreen-page">
    <div class="workspace-topbar">
      <div class="workspace-title-wrap">
        <button class="back-chip" @click="backToTeamList">
          <ArrowLeft :size="14" />
          <span>返回团队列表</span>
        </button>

        <div class="workspace-headline">
          <div class="entry-badge">{{ currentTeam.tenantName }}</div>
          <h1 class="workspace-title">{{ currentTeam.teamName }}</h1>
          <p class="workspace-subtitle">
            {{ currentTeam.roleLabel }} · {{ currentTeam.focusLabel }}
          </p>
        </div>
      </div>

      <div class="workspace-toolbar">
        <div class="toolbar-demo-switch">
          <span class="toolbar-note">Demo 视角</span>
          <div class="topbar-switch-group">
            <div class="report-perspective-switch topbar-switch">
              <button
                type="button"
                class="switch-chip"
                :class="{ active: reportPerspective === 'manager' }"
                @click="switchReportPerspective('manager')"
              >
                管理者
              </button>
              <button
                type="button"
                class="switch-chip"
                :class="{ active: reportPerspective === 'member' }"
                @click="switchReportPerspective('member')"
              >
                成员
              </button>
            </div>
          </div>
        </div>

        <div class="workspace-meta">
        <span class="meta-chip">成员 {{ currentTeam.memberCount }}</span>
        <span class="meta-chip">任务 {{ currentTeam.taskCount }}</span>
        <span class="meta-chip">{{ reportStatusText }}</span>
        <span class="meta-chip">最近同步：{{ currentTeam.syncTime }}</span>
        </div>
      </div>
    </div>

    <div class="workspace-shell">
      <div class="workspace-left">
        <section class="content-card workspace-panel-card">
          <div class="panel-tab-header">
            <div class="panel-tab-row">
              <button
                v-for="tab in workspaceSectionTabs"
                :key="tab.key"
                type="button"
                class="panel-tab-btn"
                :class="{ active: activeSection === tab.key }"
                @click="switchWorkspaceSection(tab.key)"
              >
                <component :is="tab.icon" :size="15" />
                <span>{{ tab.label }}</span>
              </button>
            </div>
            <span class="card-meta">{{ activeSectionMeta }}</span>
          </div>

          <div v-if="activeSection === 'report'" class="panel-section-body">
            <div v-if="reportPerspective === 'manager'" class="report-manager-view">
              <div v-if="managerReportPage === 'list'" class="report-list-page">
                <div class="report-list-toolbar">
                  <div>
                    <div class="detail-eyebrow">汇报项列表</div>
                    <p class="detail-desc">当前共 {{ reportItems.length }} 个汇报项，可继续查看明细或新增一个新的汇报任务。</p>
                  </div>

                  <button type="button" class="primary-btn list-create-btn" @click="addReportItem">
                    <Plus :size="16" />
                    <span>新增汇报</span>
                  </button>
                </div>

                <div class="report-strip-list">
                  <button
                    v-for="report in reportItems"
                    :key="report.id"
                    type="button"
                    class="report-strip-card"
                    @click="selectManagerReport(report.id)"
                  >
                    <div class="report-strip-main">
                      <div class="report-item-cycle">{{ report.cycle }}</div>
                      <div class="report-item-title">{{ report.title }}</div>
                      <p class="report-item-summary">{{ report.summary }}</p>
                    </div>
                    <div class="report-strip-metrics">
                      <div class="report-strip-metric">
                        <span class="summary-label">已提交</span>
                        <strong>{{ getReportSubmittedCount(report) }}</strong>
                      </div>
                      <div class="report-strip-metric">
                        <span class="summary-label">待提交</span>
                        <strong>{{ getReportPendingCount(report) }}</strong>
                      </div>
                      <div class="report-strip-metric">
                        <span class="summary-label">截止时间</span>
                        <strong>{{ report.deadline }}</strong>
                      </div>
                      <div class="report-strip-metric align-end">
                        <span class="status-pill" :class="getReportCardStatusClass(report)">
                          {{ getReportCardStatusLabel(report) }}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div v-else-if="managerReportPage === 'detail' && activeManagerReport" class="report-detail-page">
                <div class="report-detail-topbar">
                  <button class="detail-back-btn" @click="backToReportList">
                    <ArrowLeft :size="14" />
                    <span>返回汇报项列表</span>
                  </button>
                  <div class="report-topbar-actions">
                    <span class="card-meta">当前为汇报项详情页</span>
                    <button class="primary-btn topbar-config-btn" @click="openEditTaskModal(activeManagerReport)">修改任务</button>
                  </div>
                </div>

                <div class="report-detail-shell">
                  <div class="report-detail-head">
                    <div>
                      <div class="detail-eyebrow">当前汇报项</div>
                      <h4 class="detail-title">{{ activeManagerReport.title }}</h4>
                      <p class="detail-desc">{{ activeManagerReport.summary }}</p>
                    </div>

                    <div class="report-summary-strip compact">
                      <div class="summary-chip">
                        <span class="summary-label">周期</span>
                        <strong>{{ activeManagerReport.cycle }}</strong>
                      </div>
                      <div class="summary-chip">
                        <span class="summary-label">已提交</span>
                        <strong>{{ getReportSubmittedCount(activeManagerReport) }}</strong>
                      </div>
                      <div class="summary-chip">
                        <span class="summary-label">待处理</span>
                        <strong>{{ getReportPendingCount(activeManagerReport) }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="config-overview-card">
                    <div class="overview-grid">
                      <div class="overview-item">
                        <span class="summary-label">截止时间</span>
                        <strong>{{ activeManagerReport.deadline }}</strong>
                      </div>
                      <div class="overview-item">
                        <span class="summary-label">收集重点</span>
                        <div class="inline-tag-row">
                          <span v-for="focus in activeManagerReport.focus" :key="focus" class="focus-chip">{{ focus }}</span>
                        </div>
                      </div>
                      <div class="overview-item">
                        <span class="summary-label">提交项</span>
                        <div class="inline-tag-row">
                          <span
                            v-for="fieldKey in activeManagerReport.submitFields"
                            :key="fieldKey"
                            class="focus-chip subdued"
                          >
                            {{ submitFieldOptions.find((item) => item.key === fieldKey)?.label ?? fieldKey }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="submission-layout">
                    <div class="section-header-row">
                      <div>
                        <div class="sub-title large">团队提交情况</div>
                        <div class="section-hint">点击任一成员卡片查看完整提交内容，也可以直接触发 AI 汇总评估。</div>
                      </div>
                      <button class="ghost-btn ai-evaluate-btn" :disabled="isGeneratingEvaluation" @click="runAiEvaluation">
                        <Sparkles :size="14" />
                        <span>{{ isGeneratingEvaluation ? '评估中...' : 'AI 评估' }}</span>
                      </button>
                    </div>

                    <div class="submission-status-grid">
                      <button
                        v-for="item in activeManagerReport.submissions"
                        :key="item.id"
                        type="button"
                        class="submission-status-card"
                        :class="{ active: activeSubmission?.id === item.id }"
                        @click="selectSubmission(item.id)"
                      >
                        <div class="submission-head">
                          <span class="submission-name">{{ item.memberName }}</span>
                          <span class="role-chip small">{{ item.role }}</span>
                          <span class="status-pill" :class="getSubmissionStatusClass(item.status)">{{ item.status }}</span>
                        </div>
                        <div class="submission-time">{{ item.submittedAt }}</div>
                        <p class="submission-snippet">{{ item.snippet }}</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else-if="managerReportPage === 'submission' && activeManagerReport && activeSubmission"
                class="report-detail-page"
              >
                <div class="report-detail-topbar">
                  <button class="detail-back-btn" @click="backToReportList">
                    <ArrowLeft :size="14" />
                    <span>返回提交状态</span>
                  </button>
                  <span class="card-meta">当前为成员提交详情页</span>
                </div>

                <div class="report-detail-shell">
                  <div class="report-detail-head">
                    <div>
                      <div class="detail-eyebrow">成员提交详情</div>
                      <h4 class="detail-title">{{ activeSubmission.memberName }} 的汇报内容</h4>
                      <p class="detail-desc">
                        所属汇报项：{{ activeManagerReport.title }}。以下为成员实际提交的工作汇报正文，按正常阅读顺序纵向展示。
                      </p>
                    </div>

                    <div class="report-summary-strip compact">
                      <div class="summary-chip">
                        <span class="summary-label">提交状态</span>
                        <strong>{{ activeSubmission.status }}</strong>
                      </div>
                      <div class="summary-chip">
                        <span class="summary-label">提交时间</span>
                        <strong>{{ activeSubmission.submittedAt }}</strong>
                      </div>
                      <div class="summary-chip">
                        <span class="summary-label">提交身份</span>
                        <strong>{{ activeSubmission.role }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="submission-report-body">
                    <section class="submission-report-section">
                      <h5 class="submission-report-title">一、本周工作进展</h5>
                      <p class="submission-report-text">{{ getSubmissionProgressDetail(activeSubmission) }}</p>
                    </section>

                    <section class="submission-report-section">
                      <h5 class="submission-report-title">二、存在问题与需要协调</h5>
                      <p class="submission-report-text">{{ getSubmissionSupportDetail(activeSubmission) }}</p>
                    </section>

                    <section class="submission-report-section">
                      <h5 class="submission-report-title">三、下周计划</h5>
                      <p class="submission-report-text">{{ getSubmissionActionDetail(activeSubmission) }}</p>
                    </section>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="report-member-view">
              <div v-if="memberReportPage === 'list'" class="report-strip-list">
                <button
                  v-for="report in reportItems"
                  :key="report.id"
                  type="button"
                  class="report-strip-card member-report-strip"
                  @click="selectMemberReport(report.id)"
                >
                  <div class="report-strip-main">
                    <div class="report-item-cycle">{{ report.cycle }}</div>
                    <div class="report-item-title">{{ report.title }}</div>
                    <p class="report-item-summary">{{ report.summary }}</p>
                  </div>
                  <div class="report-strip-metrics member-strip-metrics">
                    <div class="report-strip-metric">
                      <span class="summary-label">截止时间</span>
                      <strong>{{ report.deadline }}</strong>
                    </div>
                    <div class="report-strip-metric align-end">
                      <span
                        class="status-pill"
                        :class="getSubmissionStatusClass(getMemberSubmissionForReport(report, currentTeam.memberPerspectiveName)?.status ?? '待提交')"
                      >
                        {{ getMemberSubmissionForReport(report, currentTeam.memberPerspectiveName)?.status ?? '待提交' }}
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              <div v-else-if="activeMemberReport && activeMemberSubmission && activeMemberDraft" class="report-detail-page">
                <div class="report-detail-topbar">
                  <button class="detail-back-btn" @click="backToReportList">
                    <ArrowLeft :size="14" />
                    <span>返回汇报项列表</span>
                  </button>
                  <span class="card-meta">当前为成员提交页</span>
                </div>

                <div class="member-report-shell">
                  <div class="member-entry-card">
                    <div class="member-entry-title">当前提交身份</div>
                    <div class="member-entry-name">
                      {{ currentTeam.memberPerspectiveName }} / {{ currentTeam.memberPerspectiveRole }}
                    </div>
                    <p class="member-entry-desc">
                      当前正在填写：{{ activeMemberReport.title }}，截止时间：{{ activeMemberReport.deadline }}
                    </p>
                    <div class="member-focus-row">
                      <span v-for="focus in activeMemberReport.focus" :key="focus" class="focus-chip">
                        {{ focus }}
                      </span>
                    </div>

                    <div class="report-summary-strip compact">
                      <div class="summary-chip">
                        <span class="summary-label">当前状态</span>
                        <strong>{{ activeMemberSubmission.status }}</strong>
                      </div>
                      <div class="summary-chip">
                        <span class="summary-label">最近提交</span>
                        <strong>{{ activeMemberSubmission.submittedAt }}</strong>
                      </div>
                      <div class="summary-chip">
                        <span class="summary-label">汇报周期</span>
                        <strong>{{ activeMemberReport.cycle }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="member-form-grid">
                    <label class="field-block field-span-2">
                      <span class="field-label">本周推进</span>
                      <textarea
                        v-model="activeMemberDraft.progress"
                        class="text-area"
                        placeholder="填写本周重点客户推进、签约进展或线索转化情况"
                      ></textarea>
                    </label>

                    <label class="field-block">
                      <span class="field-label">下周动作</span>
                      <textarea
                        v-model="activeMemberDraft.nextActions"
                        class="text-area small-area"
                        placeholder="填写下周计划动作和目标"
                      ></textarea>
                    </label>

                    <label class="field-block">
                      <span class="field-label">需要支持</span>
                      <textarea
                        v-model="activeMemberDraft.supportNeed"
                        class="text-area small-area"
                        placeholder="填写需要管理者或跨团队支持的事项"
                      ></textarea>
                    </label>
                  </div>

                  <div class="report-action-row">
                    <button class="ghost-btn" @click="saveMemberDraftPreview">暂存演示草稿</button>
                    <button class="primary-btn" @click="submitMemberReport">提交当前汇报</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeSection === 'review'" class="panel-section-body">
            <div class="review-summary-card">
              {{ currentTeam.reviewSummary }}
            </div>

            <div class="sub-block">
              <div class="sub-title">核心判断</div>
              <div class="bullet-list">
                <div v-for="item in currentTeam.reviewHighlights" :key="item" class="bullet-item">
                  <CheckCircle2 :size="14" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>

            <div class="sub-block">
              <div class="sub-title">建议动作</div>
              <div class="bullet-list">
                <div v-for="item in currentTeam.reviewActions" :key="item" class="bullet-item">
                  <Sparkles :size="14" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>

            <div class="sub-block">
              <div class="sub-title">关联任务</div>
              <div class="task-list">
                <div v-for="task in currentTeam.tasks" :key="task.id" class="task-item">
                  <div class="task-main">
                    <div class="task-title">{{ task.title }}</div>
                    <div class="task-meta">{{ task.type }} · {{ task.owner }} · {{ task.updatedAt }}</div>
                  </div>
                  <div class="task-side">
                    <span class="status-pill">{{ task.status }}</span>
                    <span class="task-progress">{{ task.progress }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="panel-section-body">
            <div class="metric-grid">
              <div v-for="metric in currentTeam.metrics" :key="metric.label" class="metric-card">
                <div class="metric-label">{{ metric.label }}</div>
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-trend">{{ metric.trend }}</div>
                <p class="metric-desc">{{ metric.description }}</p>
              </div>
            </div>

            <div class="board-grid">
              <div v-for="card in currentTeam.boardCards" :key="card.title" class="board-card">
                <div class="board-title">{{ card.title }}</div>
                <div class="board-value">{{ card.value }}</div>
                <p class="board-detail">{{ card.detail }}</p>
              </div>
            </div>

            <div class="sub-block">
              <div class="sub-title">重点关注</div>
              <div class="board-focus-list">
                <div class="focus-item">
                  <LayoutDashboard :size="14" />
                  <span>优先查看目标达成率、高风险客户和重点商机复盘结果。</span>
                </div>
                <div class="focus-item">
                  <LayoutDashboard :size="14" />
                  <span>本版仅做前端展示，后续可继续接明细钻取、筛选和导出。</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="workspace-right">
        <section class="chat-panel">
          <div class="card-header chat-header">
            <div class="card-title-wrap">
              <Bot :size="18" />
              <h3>{{ rightPanelTitle }}</h3>
            </div>
            <span class="card-meta">{{ rightPanelMeta }}</span>
          </div>

          <div v-if="isMemberAssistMode" class="member-assist-panel">
            <div class="assist-intro-card">
              <div class="assist-kicker">当前为 AI 内容整理填报区</div>
              <div class="assist-intro-title">把原始资料交给 AI，自动填充左侧汇报内容</div>
              <p class="assist-intro-desc">
                这里不是提问功能。你可以直接把客户跟进记录粘贴到下方输入框，或通过上传文件、语音输入补充原始资料，发送后 AI 会自动结构化拆分并填入左侧“本周推进 / 下周动作 / 需要支持”。
              </p>
              <div class="assist-inline-points">
                <div class="assist-inline-item">
                  <strong>支持内容</strong>
                  <span>会议纪要、客户聊天摘录、拜访记录、表格截图、语音转写</span>
                </div>
                <div class="assist-inline-item">
                  <strong>自动填入</strong>
                  <span>本周推进 / 下周动作 / 需要支持</span>
                </div>
              </div>
            </div>

            <div
              v-if="memberAssistSteps.length > 0 || memberAssistResult"
              class="assist-result-card"
              :class="{ 'is-running': memberAssistStatus === 'running' }"
            >
              <div class="assist-result-head">
                <span class="assist-result-badge">填报助手执行过程</span>
                <span
                  class="assist-status-pill"
                  :class="memberAssistStatus === 'completed' ? 'is-completed' : 'is-running'"
                >
                  {{ memberAssistStatus === 'completed' ? '已完成' : '处理中' }}
                </span>
              </div>

              <div class="assist-step-list">
                <div
                  v-for="step in memberAssistSteps"
                  :key="step.id"
                  class="assist-step-item"
                  :class="{ 'is-running': step.status === 'running' }"
                >
                  <div class="assist-step-icon" :class="`is-${step.kind}`">
                    <Sparkles v-if="step.kind === 'thinking'" :size="16" />
                    <Database v-else-if="step.kind === 'tool'" :size="16" />
                    <CheckCircle2 v-else :size="16" />
                  </div>

                  <div class="assist-step-main">
                    <div class="assist-step-title-row">
                      <strong class="assist-step-title">{{ step.title }}</strong>
                      <span class="assist-step-state">
                        {{ step.status === 'done' ? '已完成' : '执行中' }}
                      </span>
                    </div>
                    <p class="assist-step-desc">{{ step.detail }}</p>
                  </div>
                </div>
              </div>

              <p v-if="memberAssistResult" class="assist-result-summary">{{ memberAssistResult.summary }}</p>
            </div>
          </div>

          <template v-else>
            <div v-if="!isEvaluationDraftMode" class="chat-chip-list">
              <button
                v-for="preset in visibleQuestionList"
                :key="preset.id"
                type="button"
                class="question-chip"
                :class="{ active: !customQuestion && activeQuestionId === preset.id }"
                @click="selectPresetQuestion(preset.id)"
              >
                {{ preset.question }}
              </button>
            </div>

            <div v-if="!isEvaluationDraftMode" class="chat-thread">
              <div class="message-card intro-message">
                <div class="message-role">系统上下文</div>
                <p class="message-text">
                  {{ displaySystemContext }}
                </p>
              </div>

              <div class="message-card user-message">
                <div class="message-role">当前问题</div>
                <p class="message-text strong">{{ displayQuestion }}</p>
              </div>

              <div class="message-card ai-message">
                <div class="message-role">{{ displayAnswerRole }}</div>
                <p class="message-text">{{ displayAnswer }}</p>

                <div class="source-label">{{ displaySourceLabel }}</div>
                <div class="source-list">
                  <div v-for="source in displaySources" :key="source" class="source-item">
                    <Database :size="14" />
                    <span>{{ source }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div class="ask-box" :class="{ 'is-pinned': isPinnedInputMode }">
            <div v-if="inputAttachmentList.length > 0" class="attachment-strip">
              <div class="attachment-strip-label">{{ inputAttachmentLabel }}</div>
              <div class="attachment-chip-list">
                <div v-for="item in inputAttachmentList" :key="item" class="attachment-chip">
                  <FileText :size="14" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>

            <div v-if="isPinnedInputMode" class="chat-bottom-spacer"></div>

            <div class="ask-input-shell" :class="{ 'is-member-assist-shell': isMemberAssistMode }">
              <div v-if="isMemberAssistMode" class="member-input-toolbar">
                <div class="member-input-tools">
                  <button
                    type="button"
                    class="member-icon-btn"
                    :class="{ active: memberAssistMode === 'voice' }"
                    :disabled="memberAssistStatus === 'running'"
                    @click="injectVoiceTranscript"
                  >
                    <Mic :size="22" />
                  </button>

                  <label class="member-icon-btn" :class="{ active: memberAssistMode === 'upload' }">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      class="hidden-file-input"
                      :disabled="memberAssistStatus === 'running'"
                      @change="handleMemberAssistUpload"
                    />
                    <Image :size="22" />
                  </label>

                  <label class="member-icon-btn" :class="{ active: memberAssistMode === 'upload' }">
                    <input
                      type="file"
                      multiple
                      class="hidden-file-input"
                      :disabled="memberAssistStatus === 'running'"
                      @change="handleMemberAssistUpload"
                    />
                    <Paperclip :size="22" />
                  </label>
                </div>

                <button class="member-send-btn" :disabled="memberAssistStatus === 'running'" @click="submitQuestion">
                  <Send :size="20" />
                </button>
              </div>

              <textarea
                v-model="questionInput"
                class="question-input"
                :class="{ 'member-question-input': isMemberAssistMode }"
                :disabled="isMemberAssistMode && memberAssistStatus === 'running'"
                :placeholder="isMemberAssistMode ? memberAssistPlaceholder : '例如：请告诉我本周最需要负责人介入的客户和原因'"
              ></textarea>

              <button v-if="!isMemberAssistMode" class="inline-send-btn" @click="submitQuestion">
                <Send :size="14" />
                <span>{{ inputActionLabel }}</span>
              </button>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <div v-if="showTaskModal" class="task-modal-overlay" @click.self="closeTaskModal">
      <div class="task-config-modal">
        <div class="task-modal-header">
          <div>
            <div class="detail-eyebrow">{{ taskModalTitle }}</div>
            <h4 class="detail-title">{{ taskModalMode === 'create' ? '创建团队汇报任务' : '调整任务配置' }}</h4>
            <p class="detail-desc">使用同一套弹窗完成新增和配置，减少主页面占用空间。</p>
          </div>
          <button class="task-modal-close" @click="closeTaskModal">×</button>
        </div>

        <div class="task-modal-body">
          <div class="report-setup-grid">
            <label class="field-block field-span-2">
              <span class="field-label">任务名称</span>
              <input
                v-model="reportTaskDraft.title"
                type="text"
                class="text-input"
                placeholder="例如：华东直营销售团队 客户推进周报"
              />
            </label>

            <label class="field-block field-span-2">
              <span class="field-label">任务说明</span>
              <textarea
                v-model="reportTaskDraft.summary"
                class="text-area"
                placeholder="说明本次收集任务的目标、适用场景和成员提交要求"
              ></textarea>
            </label>

            <div class="field-block">
              <span class="field-label">提交周期</span>
              <div class="pill-row">
                <button
                  v-for="cycle in reportCycleOptions"
                  :key="cycle"
                  type="button"
                  class="pill-btn"
                  :class="{ active: reportTaskDraft.cycle === cycle }"
                  @click="setReportCycle(cycle)"
                >
                  {{ cycle }}
                </button>
              </div>
            </div>

            <label class="field-block">
              <span class="field-label">截止日期</span>
              <input
                v-model="reportTaskDraft.deadlineDate"
                type="text"
                class="text-input"
                placeholder="例如：2026-03-27 / 每周五 / 今天"
              />
            </label>

            <label class="field-block">
              <span class="field-label">截止时间</span>
              <input
                v-model="reportTaskDraft.deadlineTime"
                type="time"
                class="text-input"
              />
            </label>

            <div class="field-block field-span-2">
              <span class="field-label">收集重点</span>
              <div class="pill-row wrap">
                <button
                  v-for="focus in reportFocusOptions"
                  :key="focus"
                  type="button"
                  class="pill-btn"
                  :class="{ active: reportTaskDraft.focus.includes(focus) }"
                  @click="toggleReportFocus(focus)"
                >
                  {{ focus }}
                </button>
              </div>
            </div>
          </div>

          <div class="members-section modal-members-section">
            <div class="members-header">
              <span>任务成员</span>
              <span class="hint">至少选择1人</span>
            </div>
            <div class="members-table">
              <div class="table-header">
                <span class="col-name">成员姓名</span>
                <span class="col-email">邮箱</span>
                <span class="col-check">选择</span>
              </div>
              <div
                v-for="member in teamMembers"
                :key="member.name"
                class="member-row"
                @click="toggleTaskMember(member.name)"
              >
                <div class="col-name">
                  <div class="avatar">{{ member.avatar }}</div>
                  <span>{{ member.name }}</span>
                </div>
                <span class="col-email">{{ member.email || '未填写' }}</span>
                <div class="col-check">
                  <div class="checkbox" :class="{ checked: reportTaskDraft.selectedMembers.includes(member.name) }">
                    <Check v-if="reportTaskDraft.selectedMembers.includes(member.name)" :size="12" />
                  </div>
                </div>
              </div>
            </div>
            <div class="members-footer">
              <span>已选 {{ selectedTaskMemberCount }} 人</span>
            </div>
          </div>

          <div class="sub-block">
            <div class="sub-title">提交项配置</div>
            <div class="submit-field-grid">
              <button
                v-for="field in submitFieldOptions"
                :key="field.key"
                type="button"
                class="submit-field-card"
                :class="{ active: reportTaskDraft.submitFields.includes(field.key) }"
                @click="toggleTaskSubmitField(field.key)"
              >
                <div class="submit-field-title">{{ field.label }}</div>
                <div class="submit-field-desc">{{ field.description }}</div>
              </button>
            </div>
          </div>
        </div>

        <div class="task-modal-footer">
          <button class="ghost-btn" @click="closeTaskModal">取消</button>
          <button class="primary-btn" @click="submitTaskModal">{{ taskModalSubmitLabel }}</button>
        </div>
      </div>
    </div>
  </div>

  <FormPageLayout
    v-else
    :icon="Briefcase"
    title="销售管理智能体"
    subtitle="先选择已加入的团队，再进入团队工作面板查看汇报、AI 复盘、数据看板和智能问答"
  >
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

    <div class="sales-management-page">
      <div class="team-entry-view">
        <div class="entry-copy">
          <div class="entry-badge">团队入口</div>
          <h2 class="entry-title">选择团队进入销售工作面板</h2>
          <p class="entry-subtitle">当前仅展示 3 个已加入团队和 1 个新建团队占位卡片。</p>
        </div>

        <div class="team-entry-grid">
          <button
            v-for="team in teams"
            :key="team.id"
            type="button"
            class="team-entry-card"
            @click="openTeamWorkspace(team.id)"
          >
            <div class="card-top">
              <span class="joined-badge">已加入</span>
              <span class="role-chip">{{ team.roleLabel }}</span>
            </div>

            <div class="tenant-name">{{ team.tenantName }}</div>
            <h3 class="team-name">{{ team.teamName }}</h3>
            <p class="team-focus">{{ team.focusLabel }}</p>

            <div class="team-stat-row">
              <div class="team-stat-chip">
                <span class="chip-label">成员</span>
                <strong>{{ team.memberCount }}</strong>
              </div>
              <div class="team-stat-chip">
                <span class="chip-label">任务</span>
                <strong>{{ team.taskCount }}</strong>
              </div>
              <div class="team-stat-chip">
                <span class="chip-label">同步</span>
                <strong>{{ team.syncTime }}</strong>
              </div>
            </div>

            <div class="enter-link">进入团队工作面板</div>
          </button>

          <button type="button" class="team-entry-card placeholder-card" @click="handleCreatePlaceholder">
            <div class="placeholder-icon">
              <Plus :size="22" />
            </div>
            <div class="placeholder-title">新建团队</div>
            <p class="placeholder-desc">当前先用虚位卡片展示，下一步再补创建流程和团队初始化配置。</p>
          </button>
        </div>

        <div class="feedback-banner">
          <CheckCircle2 :size="16" />
          <span>{{ feedbackMessage }}</span>
        </div>
      </div>
    </div>

    <template #info-sidebar>
      <InfoSidebar
        :icon="Briefcase"
        title="销售管理智能体"
        description="当前先演示团队入口和团队工作面板：点击团队后进入全屏工作台，左侧聚焦工作内容，右侧展示团队对话框。"
        :features="[
          '点击团队后进入全屏工作面板，不再显示二级工具栏和右侧说明',
          '工作汇报区分管理者设置收集与成员提交两种视角',
          '工作内容区和对话区按 1:1 结构平分展示',
          '所有数据和交互均为 Mock，不接后端和真实权限系统',
        ]"
      />
    </template>
  </FormPageLayout>
</template>

<style scoped>
.sales-management-page {
  padding-bottom: 36px;
}

.workspace-fullscreen-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  padding: 20px;
  overflow: hidden;
}

.entry-copy {
  margin-bottom: 18px;
}

.entry-badge,
.joined-badge,
.role-chip,
.meta-chip,
.status-pill,
.focus-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.entry-badge {
  padding: 6px 10px;
  background: #eff6ff;
  color: #2563eb;
}

.entry-title,
.workspace-title {
  margin: 10px 0 6px;
  font-size: 26px;
  color: #0f172a;
}

.entry-subtitle,
.workspace-subtitle,
.submission-snippet,
.board-detail,
.message-text,
.review-summary-card,
.metric-desc,
.task-meta {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.7;
}

.team-entry-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.team-entry-card,
.content-card,
.metric-card,
.chat-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
}

.team-entry-card {
  padding: 22px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.team-entry-card:hover {
  transform: translateY(-2px);
  border-color: #bfdbfe;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.08);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.joined-badge {
  padding: 6px 10px;
  background: #eff6ff;
  color: #2563eb;
}

.role-chip,
.meta-chip,
.status-pill,
.focus-chip {
  padding: 5px 10px;
  background: #f8fafc;
  color: #475569;
}

.role-chip.small {
  padding: 4px 8px;
  font-size: 11px;
}

.tenant-name {
  margin-top: 18px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

.team-name {
  margin: 8px 0 0;
  font-size: 28px;
  line-height: 1.2;
  color: #0f172a;
}

.team-focus {
  margin: 10px 0 0;
  font-size: 13px;
  color: #64748b;
}

.team-stat-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.team-stat-chip {
  padding: 12px 14px;
  border-radius: 14px;
  background: #f8fafc;
}

.chip-label,
.summary-label,
.message-role,
.submission-time,
.side-label,
.field-label,
.source-label {
  display: block;
  font-size: 12px;
  color: #94a3b8;
}

.team-stat-chip strong,
.summary-chip strong {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #0f172a;
}

.enter-link {
  margin-top: 18px;
  font-size: 13px;
  font-weight: 600;
  color: #2563eb;
}

.placeholder-card {
  border-style: dashed;
  border-color: #cbd5e1;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.placeholder-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-title {
  margin-top: 18px;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.placeholder-desc {
  margin: 12px 0 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.7;
}

.workspace-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 16px;
  background: white;
  border: 1px solid #e2e8f0;
}

.workspace-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.workspace-headline {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.workspace-topbar .entry-badge {
  padding: 4px 8px;
  font-size: 11px;
  flex-shrink: 0;
}

.workspace-topbar .workspace-title {
  margin: 0;
  font-size: 15px;
  white-space: nowrap;
}

.workspace-topbar .workspace-subtitle {
  font-size: 12px;
  white-space: nowrap;
}

.workspace-toolbar,
.workspace-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.workspace-toolbar {
  justify-content: flex-end;
  min-width: 0;
  gap: 12px;
}

.toolbar-demo-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px 5px 10px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  min-height: 40px;
}

.toolbar-note {
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
  line-height: 1;
}

.topbar-switch-group {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: 999px;
  background: white;
  border: 1px solid #e2e8f0;
}

.back-chip,
.primary-btn,
.ghost-btn,
.switch-chip,
.question-chip,
.pill-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-chip,
.ghost-btn,
.switch-chip,
.question-chip,
.pill-btn {
  padding: 11px 16px;
  border: 1px solid #d7e0ea;
  background: white;
  color: #475569;
}

.back-chip,
.topbar-switch .switch-chip {
  padding: 7px 12px;
  font-size: 11px;
  border-radius: 9px;
}

.back-chip:hover,
.ghost-btn:hover,
.switch-chip:hover,
.question-chip:hover,
.pill-btn:hover {
  background: #f8fafc;
}

.primary-btn {
  padding: 11px 16px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: white;
}

.primary-btn:hover {
  background: #1d4ed8;
}

.ghost-btn:disabled,
.primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.switch-chip.active,
.pill-btn.active,
.question-chip.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.workspace-shell {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  min-height: 0;
  margin-top: 12px;
}

.workspace-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.workspace-right {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding-left: 4px;
  display: flex;
}

.content-card,
.chat-panel {
  padding: 20px;
}

.workspace-panel-card {
  display: flex;
  flex-direction: column;
}

.chat-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.card-title-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
}

.card-title-wrap h3 {
  margin: 0;
  font-size: 18px;
}

.card-meta {
  font-size: 12px;
  color: #94a3b8;
}

.panel-tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eef2f7;
}

.panel-tab-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.panel-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid #d7e0ea;
  border-radius: 12px;
  background: white;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.panel-tab-btn:hover {
  background: #f8fafc;
}

.panel-tab-btn.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.panel-section-body {
  padding-top: 16px;
}

.report-perspective-switch,
.report-action-row,
.pill-row,
.member-focus-row,
.chat-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.report-perspective-switch {
  margin-bottom: 12px;
}

.topbar-switch {
  margin-bottom: 0;
  gap: 4px;
}

.topbar-switch .switch-chip {
  border: none;
  background: transparent;
  color: #64748b;
  box-shadow: none;
}

.topbar-switch .switch-chip:hover {
  background: #f8fafc;
}

.topbar-switch .switch-chip.active {
  border: none;
  background: #eff6ff;
  color: #2563eb;
  box-shadow: inset 0 0 0 1px #bfdbfe;
}

.report-setup-grid,
.member-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-span-2 {
  grid-column: span 2;
}

.text-input,
.text-area,
.question-input {
  width: 100%;
  border: 1px solid #d7e0ea;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.text-input:focus,
.text-area:focus,
.question-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.14);
}

.text-area {
  min-height: 120px;
  resize: vertical;
  line-height: 1.7;
}

.small-area {
  min-height: 110px;
}

.report-action-row {
  margin-top: 16px;
}

.report-list-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.report-topbar-actions,
.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.report-topbar-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.list-create-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.topbar-config-btn,
.ai-evaluate-btn {
  white-space: nowrap;
}

.report-strip-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-strip-card {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(420px, 0.9fr);
  gap: 18px;
  width: 100%;
  padding: 18px 20px;
  border: 1px solid #dbe4ee;
  border-radius: 16px;
  background: #f8fafc;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.report-strip-card:hover {
  border-color: #bfdbfe;
  background: #fdfefe;
}

.report-strip-main {
  min-width: 0;
}

.report-strip-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: center;
}

.member-strip-metrics {
  grid-template-columns: minmax(0, 1fr) 132px;
}

.report-strip-metric {
  padding: 10px 12px;
  border-radius: 12px;
  background: white;
}

.report-strip-metric strong {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: #0f172a;
}

.report-strip-metric.align-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: transparent;
  padding: 0;
}

.report-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-detail-shell,
.member-report-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-detail-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.config-overview-card {
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
}

.overview-grid {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
}

.overview-item {
  padding: 12px;
  border-radius: 12px;
  background: white;
}

.overview-item strong {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: #0f172a;
}

.inline-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.detail-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #d7e0ea;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.detail-back-btn:hover {
  background: #f8fafc;
}

.task-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.36);
  backdrop-filter: blur(4px);
}

.task-config-modal {
  width: min(840px, 100%);
  max-height: min(84vh, 860px);
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  background: white;
  border: 1px solid #dbe4ee;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

.task-modal-header,
.task-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
}

.task-modal-header {
  border-bottom: 1px solid #eef2f7;
}

.task-modal-body {
  padding: 18px 20px 20px;
  overflow-y: auto;
}

.task-modal-close {
  width: 32px;
  height: 32px;
  border: 1px solid #d7e0ea;
  border-radius: 10px;
  background: white;
  color: #64748b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.task-modal-close:hover {
  background: #f8fafc;
}

.task-modal-footer {
  border-top: 1px solid #eef2f7;
}

.modal-members-section {
  margin-top: 20px;
}

.members-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.members-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.members-header .hint {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
}

.members-table {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.members-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  font-size: 12px;
  color: #64748b;
}

.table-header {
  display: flex;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.member-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}

.member-row:last-child {
  border-bottom: none;
}

.member-row:hover {
  background: #f8fafc;
}

.col-name {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.col-email {
  flex: 1;
  font-size: 13px;
  color: #64748b;
}

.col-check {
  width: 60px;
  display: flex;
  justify-content: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #dbeafe;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.avatar.large {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  font-size: 14px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d7e0ea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.checkbox.checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.submission-status-card:hover {
  border-color: #bfdbfe;
  background: #fdfefe;
}

.submission-status-card.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.report-detail-head,
.submission-detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.report-item-cycle,
.detail-eyebrow {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

.report-item-title,
.detail-title {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
}

.report-item-summary,
.detail-desc {
  margin: 10px 0 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.7;
}

.report-detail-head {
  margin-bottom: 16px;
}

.report-summary-strip.compact {
  margin-top: 0;
  min-width: 320px;
}

.report-summary-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.summary-chip {
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
}

.submission-layout {
  margin-top: 16px;
}

.section-header-row {
  margin-bottom: 14px;
}

.submission-status-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.submission-status-card,
.submission-detail-card,
.message-card,
.review-summary-card,
.board-card,
.metric-card,
.task-item,
.member-entry-card {
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
}

.submission-status-card,
.submission-detail-card {
  border: 1px solid transparent;
}

.submission-status-card {
  text-align: left;
  cursor: pointer;
}

.submission-report-body {
  margin-top: 18px;
}

.submission-report-section {
  padding: 18px 0;
  border-top: 1px solid #e7edf5;
}

.submission-report-section:first-child {
  padding-top: 0;
  border-top: none;
}

.submission-report-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.submission-report-text {
  margin: 10px 0 0;
  font-size: 14px;
  color: #334155;
  line-height: 1.9;
  white-space: pre-line;
}

.submit-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.submit-field-card {
  padding: 14px;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #f8fafc;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.submit-field-card:hover {
  border-color: #bfdbfe;
  background: #fdfefe;
}

.submit-field-card.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.submit-field-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.submit-field-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.7;
}

.submission-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.submission-name,
.member-entry-name,
.metric-value,
.board-value,
.task-title,
.message-text.strong {
  color: #0f172a;
  font-weight: 700;
}

.submission-name,
.member-entry-name,
.task-title {
  font-size: 15px;
}

.submission-time {
  margin-top: 8px;
}

.submission-snippet {
  margin-top: 8px;
}

.submission-detail-head .submission-time {
  margin-top: 0;
}

.side-value {
  font-size: 13px;
  color: #334155;
  line-height: 1.7;
}

.status-pill.is-success {
  background: #dcfce7;
  color: #15803d;
}

.status-pill.is-warning {
  background: #fef3c7;
  color: #b45309;
}

.status-pill.is-pending {
  background: #fee2e2;
  color: #dc2626;
}

.member-entry-title {
  font-size: 12px;
  color: #94a3b8;
}

.member-entry-desc {
  margin: 8px 0 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.7;
}

.focus-chip {
  background: #eff6ff;
  color: #2563eb;
}

.focus-chip.subdued {
  background: #f8fafc;
  color: #475569;
}

.sub-block + .sub-block {
  margin-top: 18px;
}

.sub-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
}

.bullet-list,
.board-focus-list,
.source-list,
.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bullet-item,
.focus-item,
.source-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8fafc;
  font-size: 13px;
  color: #334155;
  line-height: 1.7;
}

.task-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.task-main {
  min-width: 0;
}

.task-meta {
  margin-top: 6px;
}

.task-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  white-space: nowrap;
}

.task-progress {
  font-size: 12px;
  color: #475569;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.metric-label,
.board-title {
  font-size: 13px;
  color: #64748b;
}

.metric-value {
  margin-top: 10px;
  font-size: 24px;
}

.metric-trend {
  margin-top: 6px;
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

.metric-desc {
  margin-top: 8px;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.board-value {
  display: block;
  margin-top: 8px;
  font-size: 22px;
}

.chat-header {
  margin-bottom: 14px;
}

.chat-chip-list {
  margin-bottom: 16px;
}

.question-chip {
  padding: 10px 12px;
  text-align: left;
  line-height: 1.6;
}

.chat-thread {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 4px;
}

.member-assist-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.assist-intro-card,
.assist-result-card {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

.assist-result-card.is-running {
  border-color: #bfdbfe;
  background: #f8fbff;
}

.assist-kicker,
.assist-result-badge {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

.assist-intro-title {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.assist-intro-desc,
.assist-result-summary {
  margin: 8px 0 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.8;
}

.assist-inline-points {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.assist-inline-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e7edf5;
  font-size: 13px;
  color: #64748b;
  line-height: 1.7;
}

.assist-inline-item strong,
.assist-result-source {
  color: #0f172a;
  font-weight: 700;
}

.assist-result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.assist-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.assist-status-pill.is-running {
  background: #eff6ff;
  color: #2563eb;
}

.assist-status-pill.is-completed {
  background: #dcfce7;
  color: #15803d;
}

.assist-step-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.assist-step-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e7edf5;
  background: white;
}

.assist-step-item.is-running {
  border-color: #bfdbfe;
  background: #f8fbff;
}

.assist-step-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
}

.assist-step-icon.is-thinking {
  background: #eff6ff;
  color: #2563eb;
}

.assist-step-icon.is-tool {
  background: #eef2ff;
  color: #4f46e5;
}

.assist-step-icon.is-write {
  background: #ecfdf5;
  color: #15803d;
}

.assist-step-main {
  min-width: 0;
  flex: 1;
}

.assist-step-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.assist-step-title {
  font-size: 13px;
  color: #0f172a;
}

.assist-step-state {
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
}

.assist-step-desc {
  margin: 6px 0 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.7;
  white-space: pre-line;
}

.hidden-file-input {
  display: none;
}

.intro-message {
  background: linear-gradient(135deg, #eff6ff, #f8fafc);
}

.user-message {
  border: 1px solid #dbeafe;
  background: #eff6ff;
}

.ai-message {
  border: 1px solid #e2e8f0;
  background: white;
}

.message-text {
  margin-top: 8px;
  white-space: pre-line;
}

.source-label {
  margin-top: 14px;
}

.source-list {
  margin-top: 8px;
}

.ask-box {
  margin-top: 16px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.ask-box.is-pinned {
  flex: 1;
}

.attachment-strip {
  margin-bottom: 12px;
  flex-shrink: 0;
}

.attachment-strip-label {
  margin-bottom: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.attachment-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  background: #f8fafc;
  font-size: 12px;
  color: #475569;
}

.chat-bottom-spacer {
  flex: 1;
  min-height: 0;
}

.ask-input-shell {
  position: relative;
  flex-shrink: 0;
}

.ask-input-shell.is-member-assist-shell {
  display: flex;
  flex-direction: column;
}

.member-input-toolbar {
  position: absolute;
  left: 18px;
  right: 14px;
  bottom: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  z-index: 2;
}

.member-input-tools {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.member-icon-btn {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.member-icon-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

.member-icon-btn.active {
  color: #2563eb;
  background: #eff6ff;
}

.member-icon-btn:disabled,
.member-send-btn:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.member-send-btn {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 16px;
  background: #c7cedb;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24);
}

.member-send-btn:hover {
  background: #b7bfce;
}

.member-send-btn:active {
  transform: translateY(1px);
}

.question-input {
  min-height: 120px;
  resize: vertical;
  line-height: 1.7;
  padding-bottom: 60px;
}

.member-question-input {
  min-height: 160px;
  padding-bottom: 88px;
}

.inline-send-btn {
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: 1px solid #2563eb;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.inline-send-btn:hover {
  background: #1d4ed8;
}

.inline-send-btn:active {
  transform: translateY(1px);
}

.feedback-banner {
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  font-size: 13px;
  font-weight: 600;
}

.section-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.sub-title.large {
  margin-bottom: 0;
  font-size: 14px;
}

@media (max-width: 1180px) {
  .workspace-fullscreen-page {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .workspace-topbar {
    flex-direction: column;
  }

  .workspace-shell {
    grid-template-columns: 1fr;
  }

  .workspace-left,
  .workspace-right {
    overflow: visible;
    padding: 0;
  }

  .workspace-right {
    display: block;
  }

  .chat-panel {
    min-height: auto;
    overflow: visible;
  }

  .chat-thread {
    overflow: visible;
    padding-right: 0;
  }

  .member-assist-panel {
    overflow: visible;
    padding-right: 0;
  }
}

@media (max-width: 1200px) {
  .team-entry-grid,
  .report-setup-grid,
  .member-form-grid,
  .board-grid,
  .metric-grid,
  .team-stat-row,
  .report-summary-strip,
  .submission-status-grid,
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .field-span-2 {
    grid-column: span 1;
  }

  .report-strip-card,
  .report-strip-metrics,
  .member-strip-metrics,
  .submit-field-grid {
    grid-template-columns: 1fr;
  }

  .report-strip-metric.align-end {
    justify-content: flex-start;
  }

  .report-list-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .report-topbar-actions,
  .section-header-row {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

}

@media (max-width: 900px) {
  .team-entry-grid {
    grid-template-columns: 1fr;
  }
}
</style>
