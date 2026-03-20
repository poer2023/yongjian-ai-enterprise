<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  ChartColumn,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquare,
  Plus,
  RefreshCw,
  Sparkles,
  Upload,
  Users,
} from 'lucide-vue-next';
import { FormPageLayout, InfoSidebar, TemplateSidebar } from '../shared';

type TicketSource = 'api' | 'upload' | 'manual';
type PersonnelMode = 'manual' | 'upload' | 'material';
type FeedbackTone = 'info' | 'success' | 'warning';
type TicketPriority = 'P1' | 'P2' | 'P3';
type SkillLevel = '初级' | '中级' | '高级' | '专家';
type MemberAvailability = '可接单' | '排班紧张' | '值班池';
type AllocationStatus = '已分配' | '待确认' | '已调整';
type WorkspaceTab = 'create' | 'current' | 'archive' | 'people';

interface SourceCard<TValue extends string> {
  id: TValue;
  title: string;
  description: string;
  badge: string;
}

interface TicketFieldConfig {
  id: string;
  label: string;
  sourceColumn: string;
  custom: boolean;
}

interface TicketRecord {
  id: string;
  title: string;
  type: string;
  priority: TicketPriority;
  skill: string;
  location: string;
  workload: string;
  sla: string;
  extraFields: Record<string, string>;
}

interface StaffMember {
  id: string;
  name: string;
  department: string;
  location: string;
  skill: string;
  skillLevel: SkillLevel;
  specialty: string;
  load: number;
  availability: MemberAvailability;
  source?: string;
}

interface AllocationResult {
  ticketId: string;
  suggestedAssigneeId: string | null;
  assigneeId: string | null;
  confidence: number;
  status: AllocationStatus;
  basis: string[];
  alternatives: string[];
  manualAdjusted: boolean;
}

interface TicketTask {
  id: string;
  name: string;
  ticketDate: string;
  createdAt: string;
  note: string;
  source: TicketSource;
  fields: TicketFieldConfig[];
  tickets: TicketRecord[];
  members: StaffMember[];
  results: AllocationResult[];
  exportedAt?: string;
}

const route = useRoute();
const router = useRouter();

const pageTitle = 'AI 工单智能体';
const pageSubtitle = '当前页面仅保留新建工单表单与进入工作台入口，工单列表、归档和人员配置统一放入全屏工作台。';
const defaultFeedbackTitle = '';
const defaultFeedbackMessage = '';
const recentTools = [
  { icon: Briefcase, label: '销售管理智能体', route: 'sales-management' },
  { icon: MessageSquare, label: '咨询客服智能体', route: 'customer-service' },
  { icon: ClipboardList, label: 'AI 工单智能体', active: true, route: 'ai-ticket' },
  { icon: ChartColumn, label: '数据顾问智能体', route: 'data-advisor' },
];
const infoSidebarFeatures = [
  '默认页用于新建工单任务，并配置录入方式与字段映射',
  '如果已有任务需要查看，可直接从这里进入全屏工作台',
  '工作台内统一查看有效工单、归档工单、人员配置与分配结果',
  '当前所有工单、人员和分配结果均为 Demo Mock 数据',
];

const priorityOptions: TicketPriority[] = ['P1', 'P2', 'P3'];
const skillLevelOptions: SkillLevel[] = ['初级', '中级', '高级', '专家'];
const availabilityOptions: MemberAvailability[] = ['可接单', '排班紧张', '值班池'];
const workspaceTabs: Array<{ key: WorkspaceTab; label: string }> = [
  { key: 'create', label: '新建工单' },
  { key: 'current', label: '有效工单' },
  { key: 'archive', label: '归档工单' },
  { key: 'people', label: '人员配置' },
];
const ticketSourceOptions: SourceCard<TicketSource>[] = [
  {
    id: 'api',
    title: '系统对接',
    description: '通过企业工单系统接入待分配工单，字段自动映射。',
    badge: '自动映射',
  },
  {
    id: 'upload',
    title: '文档上传',
    description: '上传 Excel / CSV 清单后自动解析，并支持人工修正。',
    badge: '批量导入',
  },
  {
    id: 'manual',
    title: '手动输入',
    description: '逐条录入工单内容，适合临时任务或小批量派工。',
    badge: '快速录入',
  },
];

const personnelModeOptions: SourceCard<PersonnelMode>[] = [
  {
    id: 'manual',
    title: '手动输入',
    description: '直接逐行维护人员姓名、地点、技能和当前工作负荷。',
    badge: '可编辑',
  },
  {
    id: 'upload',
    title: '批量导入',
    description: '上传人员表或技能矩阵，解析后再进入人工确认。',
    badge: '批量导入',
  },
  {
    id: 'material',
    title: '自动从企业素材提取',
    description: '从企业素材库里的团队成员、项目案例中提取可用人员。',
    badge: '智能提取',
  },
];

const createFieldConfigs = (): TicketFieldConfig[] => [
  { id: 'id', label: '工单编号', sourceColumn: 'ticket_id', custom: false },
  { id: 'title', label: '工单标题', sourceColumn: 'ticket_title', custom: false },
  { id: 'type', label: '工单类型', sourceColumn: 'ticket_type', custom: false },
  { id: 'priority', label: '优先级', sourceColumn: 'priority', custom: false },
  { id: 'skill', label: '所需技能', sourceColumn: 'required_skill', custom: false },
  { id: 'location', label: '地点', sourceColumn: 'region', custom: false },
  { id: 'workload', label: '工作量预估', sourceColumn: 'workload', custom: false },
  { id: 'sla', label: 'SLA', sourceColumn: 'sla', custom: false },
];

const createDraftTickets = (): TicketRecord[] => [
  {
    id: 'WO-240320-001',
    title: '徐汇旗舰店收银系统高峰期异常',
    type: '系统故障',
    priority: 'P1',
    skill: 'POS运维',
    location: '上海',
    workload: '4h',
    sla: '30 分钟响应',
    extraFields: {},
  },
  {
    id: 'WO-240320-002',
    title: '苏州园区门店夜间网络巡检',
    type: '例行巡检',
    priority: 'P2',
    skill: '网络巡检',
    location: '苏州',
    workload: '2h',
    sla: '当天完成',
    extraFields: {},
  },
  {
    id: 'WO-240320-003',
    title: '南京机房 AP 频繁掉线排查',
    type: '网络异常',
    priority: 'P1',
    skill: '机房网络',
    location: '南京',
    workload: '3h',
    sla: '1 小时响应',
    extraFields: {},
  },
  {
    id: 'WO-240320-004',
    title: '杭州新店开业前设备联调',
    type: '上线保障',
    priority: 'P2',
    skill: 'POS运维',
    location: '杭州',
    workload: '6h',
    sla: '今天 18:00 前',
    extraFields: {},
  },
  {
    id: 'WO-240320-005',
    title: '华东区域合同档案补录',
    type: '流程支撑',
    priority: 'P3',
    skill: '',
    location: '上海',
    workload: '1h',
    sla: '本周内',
    extraFields: {},
  },
];

const enterprisePeople: StaffMember[] = [
  {
    id: 'EMP-001',
    name: '张工',
    department: '华东运维一组',
    location: '上海',
    skill: 'POS运维',
    skillLevel: '高级',
    specialty: '门店系统、数据库恢复',
    load: 62,
    availability: '可接单',
    source: '手动维护',
  },
  {
    id: 'EMP-002',
    name: '李工',
    department: '华东网络组',
    location: '苏州',
    skill: '网络巡检',
    skillLevel: '高级',
    specialty: '夜间巡检、连锁门店网络排障',
    load: 48,
    availability: '可接单',
    source: '手动维护',
  },
  {
    id: 'EMP-003',
    name: '王工',
    department: '交付保障组',
    location: '南京',
    skill: '机房网络',
    skillLevel: '中级',
    specialty: 'AP、交换机、机房网络排障',
    load: 35,
    availability: '可接单',
    source: '手动维护',
  },
  {
    id: 'EMP-004',
    name: '赵工',
    department: '弱电保障组',
    location: '无锡',
    skill: '弱电安防',
    skillLevel: '专家',
    specialty: '监控、门禁、弱电线路',
    load: 72,
    availability: '排班紧张',
    source: '手动维护',
  },
  {
    id: 'EMP-005',
    name: '陈工',
    department: '开业支援组',
    location: '杭州',
    skill: 'POS运维',
    skillLevel: '中级',
    specialty: '新店开业联调、现场支持',
    load: 41,
    availability: '可接单',
    source: '手动维护',
  },
  {
    id: 'EMP-006',
    name: '刘敏',
    department: '值班协调池',
    location: '上海',
    skill: '综合协调',
    skillLevel: '高级',
    specialty: '跨区兜底、协调派单、补充信息确认',
    load: 28,
    availability: '值班池',
    source: '手动维护',
  },
];

const materialExtractCandidates: StaffMember[] = [
  {
    id: 'MAT-001',
    name: '周工',
    department: '企业素材库 / 团队成员',
    location: '上海',
    skill: 'POS运维',
    skillLevel: '高级',
    specialty: '从团队成员库提取，最近参与 3 个门店上线项目',
    load: 54,
    availability: '可接单',
    source: '自动提取',
  },
  {
    id: 'MAT-002',
    name: '许工',
    department: '企业素材库 / 项目案例',
    location: '杭州',
    skill: '网络巡检',
    skillLevel: '高级',
    specialty: '根据项目案例和排班记录提取，擅长跨城巡检',
    load: 39,
    availability: '可接单',
    source: '自动提取',
  },
  {
    id: 'MAT-003',
    name: '冯工',
    department: '企业素材库 / 项目案例',
    location: '无锡',
    skill: '弱电安防',
    skillLevel: '中级',
    specialty: '根据历史案例提取，适合弱电与监控类工单',
    load: 46,
    availability: '可接单',
    source: '自动提取',
  },
];

const cloneFields = (items: TicketFieldConfig[]) => items.map((item) => ({ ...item }));
const cloneTickets = (items: TicketRecord[]) => items.map((item) => ({
  ...item,
  extraFields: { ...item.extraFields },
}));
const cloneMembers = (items: StaffMember[]) => items.map((item) => ({ ...item }));

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateTime = (date: Date) => {
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${formatDateInput(date)} ${hours}:${minutes}`;
};

const addDays = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDateInput(date);
};

const compareDateOnly = (left: string, right: string) => {
  const leftTime = new Date(`${left}T00:00:00`).getTime();
  const rightTime = new Date(`${right}T00:00:00`).getTime();
  return leftTime - rightTime;
};

const parseWorkloadHours = (value: string) => {
  const match = value.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 2;
};

const priorityRank: Record<TicketPriority, number> = {
  P1: 3,
  P2: 2,
  P3: 1,
};

const skillLevelRank: Record<SkillLevel, number> = {
  初级: 1,
  中级: 2,
  高级: 3,
  专家: 4,
};

const buildAllocationPlan = (ticketList: TicketRecord[], memberList: StaffMember[]) => {
  const tempLoads = new Map(memberList.map((member) => [member.id, member.load]));
  const sortedTickets = [...ticketList].sort((left, right) => {
    const priorityGap = priorityRank[right.priority] - priorityRank[left.priority];
    if (priorityGap !== 0) return priorityGap;
    return left.id.localeCompare(right.id);
  });

  return sortedTickets.map<AllocationResult>((ticket) => {
    const candidates = memberList.map((member) => {
      const currentLoad = tempLoads.get(member.id) ?? member.load;
      const reasons: string[] = [];
      let score = 0;

      if (ticket.location === member.location) {
        score += 42;
        reasons.push('同城可达');
      } else {
        score += 12;
        reasons.push('支持跨区派工');
      }

      if (!ticket.skill.trim()) {
        score -= 18;
        reasons.push('工单技能待补充');
      } else if (member.skill.includes(ticket.skill)) {
        score += 50;
        reasons.push('技能标签命中');
      } else if (member.availability === '值班池') {
        score += 20;
        reasons.push('进入值班池兜底');
      } else {
        score -= 26;
        reasons.push('技能需人工确认');
      }

      score += skillLevelRank[member.skillLevel] * 8;
      reasons.push(`${member.skillLevel}技能等级`);

      if (currentLoad <= 45) {
        score += 18;
        reasons.push('当前负荷较低');
      } else if (currentLoad <= 70) {
        score += 10;
        reasons.push('当前负荷可接受');
      } else {
        score -= 10;
        reasons.push('当前负荷偏高');
      }

      if (ticket.priority === 'P1') {
        score += member.availability === '可接单' ? 10 : 2;
      }

      if (member.availability === '排班紧张') {
        score -= 8;
      }

      return {
        member,
        score,
        reasons,
      };
    }).sort((left, right) => right.score - left.score);

    const bestCandidate = candidates[0];
    if (!bestCandidate) {
      return {
        ticketId: ticket.id,
        suggestedAssigneeId: null,
        assigneeId: null,
        confidence: 40,
        status: '待确认',
        basis: ['当前没有可用成员', '请先补充人员配置'],
        alternatives: [],
        manualAdjusted: false,
      };
    }

    const nextLoad = (tempLoads.get(bestCandidate.member.id) ?? bestCandidate.member.load)
      + parseWorkloadHours(ticket.workload) * 4;
    tempLoads.set(bestCandidate.member.id, nextLoad);

    const needsConfirm = bestCandidate.score < 52 || !ticket.skill.trim();

    return {
      ticketId: ticket.id,
      suggestedAssigneeId: bestCandidate.member.id,
      assigneeId: bestCandidate.member.id,
      confidence: Math.max(56, Math.min(98, Math.round(52 + bestCandidate.score / 2))),
      status: needsConfirm ? '待确认' : '已分配',
      basis: bestCandidate.reasons.slice(0, 4),
      alternatives: candidates.slice(1, 3).map((item) => item.member.id),
      manualAdjusted: false,
    };
  });
};

const buildTask = (
  id: string,
  name: string,
  ticketDate: string,
  source: TicketSource,
  note: string,
  tickets: TicketRecord[],
  members: StaffMember[],
  createdAt: string,
) => ({
  id,
  name,
  ticketDate,
  createdAt,
  note,
  source,
  fields: cloneFields(createFieldConfigs()),
  tickets: cloneTickets(tickets),
  members: cloneMembers(members),
  results: buildAllocationPlan(tickets, members),
}) satisfies TicketTask;

const initialTasks: TicketTask[] = [
  buildTask(
    'TASK-001',
    '华东区域当日门店保障',
    addDays(1),
    'upload',
    '优先处理当天高优故障和开业保障类工单。',
    createDraftTickets().slice(0, 4),
    cloneMembers(enterprisePeople),
    formatDateTime(new Date()),
  ),
  buildTask(
    'TASK-002',
    '夜间巡检与监控恢复',
    addDays(0),
    'api',
    '系统自动同步夜间巡检和弱电维护工单。',
    createDraftTickets().slice(1, 5),
    cloneMembers(enterprisePeople),
    formatDateTime(new Date(Date.now() - 1000 * 60 * 60 * 5)),
  ),
  buildTask(
    'TASK-003',
    '上周门店巡检归档',
    addDays(-2),
    'manual',
    '上周已完成工单归档，仍保留结果页可追溯。',
    createDraftTickets().slice(0, 3),
    cloneMembers(enterprisePeople),
    formatDateTime(new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)),
  ),
  buildTask(
    'TASK-004',
    '月初网络异常历史单',
    addDays(-7),
    'upload',
    '月初异常处理记录，已过期但仍可查看历史分配结果。',
    createDraftTickets().slice(1, 4),
    cloneMembers(enterprisePeople),
    formatDateTime(new Date(Date.now() - 1000 * 60 * 60 * 24 * 8)),
  ),
];

const peopleProfiles = ref<StaffMember[]>(cloneMembers(enterprisePeople));
const peopleUploadName = ref('运维工程师技能矩阵_0320.xlsx');
const personnelMode = ref<PersonnelMode>('manual');
const draftTaskName = ref('华东区域 3 月第 3 周工单分配');
const draftTicketDate = ref(formatDateInput(new Date()));
const draftTaskNote = ref('优先保障高优故障、开业保障和当天必须闭环的门店任务。');
const draftTicketSource = ref<TicketSource>('upload');
const draftTicketUploadName = ref('待分配工单_0320.xlsx');
const draftFieldConfigs = ref<TicketFieldConfig[]>(cloneFields(createFieldConfigs()));
const draftTickets = ref<TicketRecord[]>(cloneTickets(createDraftTickets()));
const tasks = ref<TicketTask[]>([...initialTasks]);
const selectedResultTicketId = ref<string | null>(null);
const customFieldLabel = ref('');
const customFieldColumn = ref('');
const feedbackTone = ref<FeedbackTone>('info');
const feedbackTitle = ref(defaultFeedbackTitle);
const feedbackMessage = ref(defaultFeedbackMessage);

let ticketSequence = 6;
let memberSequence = 7;
let customFieldSequence = 1;
let taskSequence = 5;

const isWorkspaceMode = computed(() => route.query.workspace === '1');
const todayLabel = computed(() => formatDateInput(new Date()));

const currentWorkspaceTab = computed<WorkspaceTab>(() => {
  const tab = String(route.query.tab ?? 'current');
  if (tab === 'create' || tab === 'archive' || tab === 'people') {
    return tab;
  }
  return 'current';
});

const isTaskExpired = (ticketDate: string) => compareDateOnly(todayLabel.value, ticketDate) > 0;

const sortedTasks = computed(() => {
  return [...tasks.value].sort((left, right) => compareDateOnly(right.ticketDate, left.ticketDate));
});

const unexpiredTasks = computed(() => sortedTasks.value.filter((task) => !isTaskExpired(task.ticketDate)));
const expiredTasks = computed(() => sortedTasks.value.filter((task) => isTaskExpired(task.ticketDate)));

const workspaceTaskList = computed(() => {
  if (currentWorkspaceTab.value === 'archive') {
    return expiredTasks.value;
  }

  if (currentWorkspaceTab.value === 'current') {
    return unexpiredTasks.value;
  }

  return [];
});

const selectedTask = computed(() => {
  const taskId = typeof route.query.task === 'string' ? route.query.task : '';

  if (currentWorkspaceTab.value === 'current' || currentWorkspaceTab.value === 'archive') {
    return workspaceTaskList.value.find((task) => task.id === taskId) ?? workspaceTaskList.value[0] ?? null;
  }

  return tasks.value.find((task) => task.id === taskId) ?? null;
});

watch(
  () => selectedTask.value?.id,
  () => {
    selectedResultTicketId.value = selectedTask.value?.results[0]?.ticketId ?? null;
  },
  { immediate: true },
);

const selectedTaskAssignedCount = computed(() => {
  if (!selectedTask.value) return 0;
  return selectedTask.value.results.filter((item) => item.status !== '待确认').length;
});

const selectedTaskPendingCount = computed(() => {
  if (!selectedTask.value) return 0;
  return selectedTask.value.results.filter((item) => item.status === '待确认').length;
});

const selectedTaskAverageConfidence = computed(() => {
  if (!selectedTask.value || selectedTask.value.results.length === 0) return 0;
  return Math.round(
    selectedTask.value.results.reduce((total, item) => total + item.confidence, 0) / selectedTask.value.results.length,
  );
});

const selectedResult = computed(() => {
  if (!selectedTask.value) return null;
  return selectedTask.value.results.find((item) => item.ticketId === selectedResultTicketId.value)
    ?? selectedTask.value.results[0]
    ?? null;
});

const selectedResultTicket = computed(() => {
  if (!selectedTask.value || !selectedResult.value) return null;
  return selectedTask.value.tickets.find((ticket) => ticket.id === selectedResult.value?.ticketId) ?? null;
});

const selectedResultAssignee = computed(() => {
  if (!selectedTask.value || !selectedResult.value?.assigneeId) return null;
  return selectedTask.value.members.find((member) => member.id === selectedResult.value?.assigneeId) ?? null;
});

const selectedResultAlternatives = computed(() => {
  if (!selectedTask.value || !selectedResult.value) return [];
  return selectedResult.value.alternatives
    .map((memberId) => selectedTask.value?.members.find((member) => member.id === memberId))
    .filter((member): member is StaffMember => Boolean(member));
});

const customFieldConfigs = computed(() => draftFieldConfigs.value.filter((field) => field.custom));
const workspaceTabCounts = computed(() => ({
  create: '表单',
  current: `${unexpiredTasks.value.length}`,
  archive: `${expiredTasks.value.length}`,
  people: `${peopleProfiles.value.length}`,
}));

const showFeedbackBanner = computed(() => Boolean(feedbackTitle.value || feedbackMessage.value));

const setFeedback = (tone: FeedbackTone, title: string, message: string) => {
  feedbackTone.value = tone;
  feedbackTitle.value = title;
  feedbackMessage.value = message;
};

const openWorkspace = (tab: WorkspaceTab = 'current', taskId?: string) => {
  router.replace({
    name: 'ai-ticket',
    query: {
      workspace: '1',
      tab,
      ...(taskId ? { task: taskId } : {}),
    },
  });
};

const backToFormPage = () => {
  router.replace({ name: 'ai-ticket' });
};

const switchWorkspaceTab = (tab: WorkspaceTab) => {
  if (tab === 'current') {
    openWorkspace('current', unexpiredTasks.value[0]?.id);
    return;
  }

  if (tab === 'archive') {
    openWorkspace('archive', expiredTasks.value[0]?.id);
    return;
  }

  openWorkspace(tab);
};

const selectTaskInWorkspace = (taskId: string) => {
  openWorkspace(currentWorkspaceTab.value, taskId);
};

const fieldLabel = (fieldId: string) => {
  return draftFieldConfigs.value.find((field) => field.id === fieldId)?.label ?? fieldId;
};

const ensureCustomFields = (ticketsToSync: TicketRecord[]) => {
  const customFields = customFieldConfigs.value.map((field) => field.id);
  return ticketsToSync.map((ticket) => {
    const nextExtraFields: Record<string, string> = {};

    customFields.forEach((fieldId) => {
      nextExtraFields[fieldId] = ticket.extraFields[fieldId] ?? '';
    });

    return {
      ...ticket,
      extraFields: nextExtraFields,
    };
  });
};

const resetDraftState = () => {
  draftTaskName.value = '华东区域 3 月第 3 周工单分配';
  draftTicketDate.value = formatDateInput(new Date());
  draftTaskNote.value = '优先保障高优故障、开业保障和当天必须闭环的门店任务。';
  draftTicketSource.value = 'upload';
  draftTicketUploadName.value = '待分配工单_0320.xlsx';
  draftFieldConfigs.value = cloneFields(createFieldConfigs());
  draftTickets.value = cloneTickets(createDraftTickets());
  customFieldLabel.value = '';
  customFieldColumn.value = '';
};

const syncFieldConfigSource = (source: TicketSource) => {
  const autoMapping: Record<string, string> = {
    id: 'ticket_id',
    title: 'ticket_title',
    type: 'ticket_type',
    priority: 'priority',
    skill: 'required_skill',
    location: 'region',
    workload: 'workload',
    sla: 'sla',
  };

  draftFieldConfigs.value = draftFieldConfigs.value.map((field) => ({
    ...field,
    sourceColumn: source === 'api'
      ? autoMapping[field.id] ?? field.sourceColumn
      : field.sourceColumn || field.label,
  }));
};

const switchDraftSource = (source: TicketSource) => {
  draftTicketSource.value = source;
  syncFieldConfigSource(source);

  if (source === 'api') {
    setFeedback('info', '工单录入方式已切换', '系统对接模式下，基础字段会自动映射到企业工单系统字段。');
    return;
  }

  if (source === 'upload') {
    setFeedback('info', '工单录入方式已切换', '文档上传模式下，可修改字段名和来源列名，再确认工单列表。');
    return;
  }

  setFeedback('info', '工单录入方式已切换', '手动输入模式下，可直接录入工单并修改字段列名。');
};

const handleTicketUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  draftTicketUploadName.value = file.name;
  draftTicketSource.value = 'upload';
  draftTickets.value = cloneTickets(createDraftTickets());
  setFeedback('success', '工单清单已导入', `已模拟解析 ${file.name}，导入后的工单列表可继续人工检查与编辑修正。`);
  target.value = '';
};

const addCustomField = () => {
  const label = customFieldLabel.value.trim();
  if (!label) {
    setFeedback('warning', '请先填写字段名称', '新增自定义字段前，请先输入展示名称。');
    return;
  }

  const nextId = `custom-${customFieldSequence}`;
  customFieldSequence += 1;

  draftFieldConfigs.value = [
    ...draftFieldConfigs.value,
    {
      id: nextId,
      label,
      sourceColumn: customFieldColumn.value.trim() || label,
      custom: true,
    },
  ];
  draftTickets.value = ensureCustomFields(draftTickets.value);
  customFieldLabel.value = '';
  customFieldColumn.value = '';
};

const removeCustomField = (fieldId: string) => {
  draftFieldConfigs.value = draftFieldConfigs.value.filter((field) => field.id !== fieldId);
  draftTickets.value = draftTickets.value.map((ticket) => {
    const nextExtraFields = { ...ticket.extraFields };
    delete nextExtraFields[fieldId];
    return {
      ...ticket,
      extraFields: nextExtraFields,
    };
  });
};

const addDraftTicket = () => {
  const nextId = `WO-240320-${`${ticketSequence}`.padStart(3, '0')}`;
  ticketSequence += 1;
  const nextExtraFields = Object.fromEntries(customFieldConfigs.value.map((field) => [field.id, '']));

  draftTickets.value = [
    ...draftTickets.value,
    {
      id: nextId,
      title: '新增工单',
      type: '临时任务',
      priority: 'P2',
      skill: '',
      location: '上海',
      workload: '2h',
      sla: '当天完成',
      extraFields: nextExtraFields,
    },
  ];
};

const removeDraftTicket = (ticketId: string) => {
  draftTickets.value = draftTickets.value.filter((ticket) => ticket.id !== ticketId);
};

const handlePeopleUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  peopleUploadName.value = file.name;
  personnelMode.value = 'upload';
  peopleProfiles.value = cloneMembers(enterprisePeople).map((member) => ({
    ...member,
    source: '批量导入',
  }));
  setFeedback('success', '人员表已导入', `已模拟解析 ${file.name}，当前人员表可继续人工补充和修正。`);
  target.value = '';
};

const switchPersonnelMode = (mode: PersonnelMode) => {
  personnelMode.value = mode;

  if (mode === 'manual') {
    setFeedback('info', '人员模式已切换', '当前为手动输入模式，可逐行维护人员信息。');
    return;
  }

  if (mode === 'upload') {
    setFeedback('info', '人员模式已切换', '当前为批量导入模式，可上传人员表和技能矩阵。');
    return;
  }

  setFeedback('info', '人员模式已切换', '当前为企业素材提取模式，可从团队成员和项目案例中提取候选人。');
};

const applyMaterialExtraction = () => {
  peopleProfiles.value = cloneMembers(materialExtractCandidates);
  personnelMode.value = 'material';
  setFeedback('success', '已应用素材提取结果', '当前人员库已替换为从企业素材库自动提取的成员，可继续人工调整。');
};

const savePeopleConfig = () => {
  setFeedback('success', '人员配置已保存', '后续新建工单会默认使用这套人员库；历史工单不会被回写。');
};

const addPerson = () => {
  const nextId = `EMP-${`${memberSequence}`.padStart(3, '0')}`;
  memberSequence += 1;

  peopleProfiles.value = [
    ...peopleProfiles.value,
    {
      id: nextId,
      name: '新成员',
      department: '临时支援组',
      location: '上海',
      skill: '综合协调',
      skillLevel: '中级',
      specialty: '待补充',
      load: 40,
      availability: '可接单',
      source: personnelMode.value === 'material' ? '自动提取' : personnelMode.value === 'upload' ? '批量导入' : '手动维护',
    },
  ];
};

const removePerson = (memberId: string) => {
  peopleProfiles.value = peopleProfiles.value.filter((member) => member.id !== memberId);
};

const ticketResultMeta = (ticketId: string) => {
  const ticket = selectedTask.value?.tickets.find((item) => item.id === ticketId);
  return ticket ? `${ticket.type} / ${ticket.priority} / ${ticket.location}` : '待补充';
};

const updateTaskById = (taskId: string, updater: (task: TicketTask) => TicketTask) => {
  tasks.value = tasks.value.map((task) => (task.id === taskId ? updater(task) : task));
};

const saveAndAllocate = () => {
  if (!draftTaskName.value.trim()) {
    setFeedback('warning', '请先填写任务名称', '保存并分配前，需要先填写任务名称。');
    return;
  }

  if (peopleProfiles.value.length === 0) {
    setFeedback('warning', '暂无可用人员', '请先进入工作台补齐人员配置。');
    return;
  }

  if (draftTickets.value.length === 0) {
    setFeedback('warning', '暂无待分配工单', '请先补充至少 1 条工单，再执行保存并分配。');
    return;
  }

  const normalizedTickets = ensureCustomFields(cloneTickets(draftTickets.value));
  const taskId = `TASK-${`${taskSequence}`.padStart(3, '0')}`;
  taskSequence += 1;
  const nextTask: TicketTask = {
    id: taskId,
    name: draftTaskName.value.trim(),
    ticketDate: draftTicketDate.value,
    createdAt: formatDateTime(new Date()),
    note: draftTaskNote.value.trim() || '未填写任务备注',
    source: draftTicketSource.value,
    fields: cloneFields(draftFieldConfigs.value),
    tickets: normalizedTickets,
    members: cloneMembers(peopleProfiles.value),
    results: buildAllocationPlan(normalizedTickets, peopleProfiles.value),
  };

  tasks.value = [nextTask, ...tasks.value];
  resetDraftState();

  const pendingCount = nextTask.results.filter((item) => item.status === '待确认').length;
  setFeedback(
    pendingCount > 0 ? 'warning' : 'success',
    pendingCount > 0 ? '已保存并进入工作台' : '已保存并完成分配',
    pendingCount > 0
      ? `当前已生成 mock 分配结果，其中 ${pendingCount} 条工单需要人工确认。`
      : '当前已生成完整 mock 分配结果，可继续在工作台查看。',
  );

  openWorkspace('current', nextTask.id);
};

const enterWorkspace = () => {
  openWorkspace('current', unexpiredTasks.value[0]?.id);
};

const rerunSelectedTask = () => {
  if (!selectedTask.value) {
    setFeedback('warning', '当前没有选中的任务', '请先从“有效工单”或“归档工单”列表中选择一个任务。');
    return;
  }

  const nextResults = buildAllocationPlan(selectedTask.value.tickets, selectedTask.value.members);
  updateTaskById(selectedTask.value.id, (task) => ({
    ...task,
    results: nextResults,
  }));
  selectedResultTicketId.value = nextResults[0]?.ticketId ?? null;
  setFeedback('success', '已重新分配', '当前结果已按内置规则重新生成 mock 分配结果。');
};

const updateSelectedTaskAssignee = (ticketId: string, assigneeId: string) => {
  if (!selectedTask.value) return;

  const targetMember = selectedTask.value.members.find((member) => member.id === assigneeId) ?? null;
  const nextResults: AllocationResult[] = selectedTask.value.results.map((result) => {
    if (result.ticketId !== ticketId) return result;

    if (!assigneeId) {
      return {
        ...result,
        assigneeId: null,
        status: '待确认',
        manualAdjusted: true,
        basis: ['人工移出当前派工结果', '等待补充人员或进一步确认'],
      };
    }

    return {
      ...result,
      assigneeId,
      status: '已调整',
      manualAdjusted: true,
      basis: targetMember
        ? ['人工改派', `改派至 ${targetMember.name}`, `地点：${targetMember.location}`, `技能：${targetMember.skill}`]
        : ['人工改派'],
    };
  });

  updateTaskById(selectedTask.value.id, (task) => ({
    ...task,
    results: nextResults,
  }));
  selectedResultTicketId.value = ticketId;
  setFeedback('success', '分配结果已更新', '当前任务中的工单已完成人工改派，工作台结果区会同步刷新。');
};
</script>

<template>
  <div v-if="isWorkspaceMode" class="ticket-workspace-page">
    <header class="workspace-topbar">
      <div class="workspace-topbar-left">
        <button type="button" class="ghost-btn" @click="backToFormPage">
          <ArrowLeft :size="14" />
          <span>返回新建工单</span>
        </button>
        <div class="workspace-title-block">
          <span class="eyebrow">AI 工单工作台</span>
          <h1 class="workspace-title">全屏工作台</h1>
        </div>
      </div>
    </header>

    <div class="workspace-shell">
      <aside class="workspace-sidebar">
        <div class="workspace-sidebar-block">
          <div class="workspace-sidebar-title">工作区</div>
          <div class="workspace-nav-list">
            <button
              v-for="tab in workspaceTabs"
              :key="tab.key"
              type="button"
              class="workspace-nav-item"
              :class="{ active: currentWorkspaceTab === tab.key }"
              @click="switchWorkspaceTab(tab.key)"
            >
              <span>{{ tab.label }}</span>
              <span class="workspace-nav-badge">{{ workspaceTabCounts[tab.key] }}</span>
            </button>
          </div>
        </div>

        <div
          v-if="currentWorkspaceTab === 'current' || currentWorkspaceTab === 'archive'"
          class="workspace-sidebar-block"
        >
          <div class="workspace-sidebar-title">
            {{ currentWorkspaceTab === 'current' ? '有效工单' : '归档工单' }}
          </div>
          <div v-if="workspaceTaskList.length" class="workspace-subnav-list">
            <button
              v-for="task in workspaceTaskList"
              :key="task.id"
              type="button"
              class="workspace-subnav-item"
              :class="{ active: selectedTask?.id === task.id }"
              @click="selectTaskInWorkspace(task.id)"
            >
              <div class="workspace-subnav-name">{{ task.name }}</div>
              <div class="workspace-subnav-meta">{{ task.ticketDate }} · {{ task.tickets.length }} 条工单</div>
              <div class="workspace-subnav-stats">
                <span>已落位 {{ task.results.filter((item) => item.status !== '待确认').length }}</span>
                <span>待确认 {{ task.results.filter((item) => item.status === '待确认').length }}</span>
              </div>
            </button>
          </div>
          <div v-else class="subnav-empty">当前没有可展示的工单任务。</div>
        </div>
      </aside>

      <div class="workspace-main">
        <div v-if="showFeedbackBanner" class="feedback-banner" :class="feedbackTone">
          <div class="feedback-title">
            <CheckCircle2 v-if="feedbackTone !== 'warning'" :size="16" />
            <AlertTriangle v-else :size="16" />
            <span>{{ feedbackTitle }}</span>
          </div>
          <p class="feedback-desc">{{ feedbackMessage }}</p>
        </div>

        <div class="workspace-content">
          <template v-if="currentWorkspaceTab === 'create'">
        <section class="content-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">新建工单</h2>
            </div>
            <button type="button" class="primary-btn" @click="saveAndAllocate">
              <Sparkles :size="14" />
              <span>保存并分配</span>
            </button>
          </div>

          <div class="form-grid">
            <label class="field-block">
              <span class="field-label">任务名称</span>
              <input v-model.trim="draftTaskName" class="text-input" type="text" placeholder="例如：华东区域 3 月第 3 周工单分配" />
            </label>
            <label class="field-block">
              <span class="field-label">工单日期</span>
              <input v-model="draftTicketDate" class="text-input" type="date" />
            </label>
            <label class="field-block full-span">
              <span class="field-label">任务备注</span>
              <input v-model.trim="draftTaskNote" class="text-input" type="text" placeholder="例如：优先保障高优故障和开业门店工单" />
            </label>
          </div>

          <div class="mode-card-grid">
            <button
              v-for="source in ticketSourceOptions"
              :key="source.id"
              type="button"
              class="mode-card"
              :class="{ active: draftTicketSource === source.id }"
              @click="switchDraftSource(source.id)"
            >
              <Sparkles v-if="source.id === 'api'" :size="18" />
              <Upload v-else-if="source.id === 'upload'" :size="18" />
              <ClipboardList v-else :size="18" />
              <div class="mode-card-title">{{ source.title }}</div>
              <p class="mode-card-desc">{{ source.description }}</p>
              <span class="mode-card-badge">{{ source.badge }}</span>
            </button>
          </div>

          <div v-if="draftTicketSource === 'upload'" class="action-strip">
            <label class="upload-box">
              <input type="file" hidden @change="handleTicketUpload" />
              <Upload :size="16" />
              <span>{{ draftTicketUploadName ? '重新上传工单清单' : '上传工单清单' }}</span>
            </label>
            <div class="action-note">{{ draftTicketUploadName || '尚未上传文件' }}</div>
          </div>

          <div v-else-if="draftTicketSource === 'api'" class="system-connect-card">
            <span class="field-label">系统对接</span>
            <strong>ServiceNow - 华东门店工单池</strong>
            <span>基础字段已自动映射，可直接确认工单列表。</span>
          </div>
        </section>

        <section class="content-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">字段配置</h2>
            </div>
          </div>

          <div class="field-config-grid">
            <label class="field-block">
              <span class="field-label">新增字段名称</span>
              <input v-model.trim="customFieldLabel" class="text-input" type="text" placeholder="例如：客户等级" />
            </label>
            <label class="field-block">
              <span class="field-label">来源列名</span>
              <input v-model.trim="customFieldColumn" class="text-input" type="text" placeholder="例如：customer_level" />
            </label>
            <button type="button" class="ghost-btn field-add-btn" @click="addCustomField">
              <Plus :size="14" />
              <span>新增自定义字段</span>
            </button>
          </div>

          <div class="table-shell">
            <table class="data-table">
              <thead>
                <tr>
                  <th>字段标识</th>
                  <th>展示名称</th>
                  <th>来源列名</th>
                  <th>映射方式</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in draftFieldConfigs" :key="field.id">
                  <td>{{ field.id }}</td>
                  <td><input v-model.trim="field.label" class="table-input" type="text" /></td>
                  <td>
                    <input
                      v-model.trim="field.sourceColumn"
                      class="table-input"
                      type="text"
                      :disabled="draftTicketSource === 'api' && !field.custom"
                    />
                  </td>
                  <td>{{ draftTicketSource === 'api' && !field.custom ? '自动映射' : '可编辑' }}</td>
                  <td class="action-cell">
                    <button v-if="field.custom" type="button" class="row-action" @click="removeCustomField(field.id)">移除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="content-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">待分配工单列表</h2>
            </div>
            <button type="button" class="ghost-btn" @click="addDraftTicket">
              <Plus :size="14" />
              <span>新增工单</span>
            </button>
          </div>

          <div class="table-shell">
            <table class="data-table wide-table">
              <thead>
                <tr>
                  <th>{{ fieldLabel('id') }}</th>
                  <th>{{ fieldLabel('title') }}</th>
                  <th>{{ fieldLabel('type') }}</th>
                  <th>{{ fieldLabel('priority') }}</th>
                  <th>{{ fieldLabel('skill') }}</th>
                  <th>{{ fieldLabel('location') }}</th>
                  <th>{{ fieldLabel('workload') }}</th>
                  <th>{{ fieldLabel('sla') }}</th>
                  <th v-for="field in customFieldConfigs" :key="field.id">{{ field.label }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in draftTickets" :key="ticket.id">
                  <td><input v-model.trim="ticket.id" class="table-input" type="text" /></td>
                  <td><input v-model.trim="ticket.title" class="table-input" type="text" /></td>
                  <td><input v-model.trim="ticket.type" class="table-input" type="text" /></td>
                  <td>
                    <select v-model="ticket.priority" class="table-select">
                      <option v-for="priority in priorityOptions" :key="priority" :value="priority">{{ priority }}</option>
                    </select>
                  </td>
                  <td><input v-model.trim="ticket.skill" class="table-input" type="text" placeholder="如：POS运维" /></td>
                  <td><input v-model.trim="ticket.location" class="table-input" type="text" /></td>
                  <td><input v-model.trim="ticket.workload" class="table-input" type="text" /></td>
                  <td><input v-model.trim="ticket.sla" class="table-input" type="text" /></td>
                  <td v-for="field in customFieldConfigs" :key="field.id">
                    <input v-model.trim="ticket.extraFields[field.id]" class="table-input" type="text" />
                  </td>
                  <td class="action-cell">
                    <button type="button" class="row-action" @click="removeDraftTicket(ticket.id)">移除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

          </template>

          <template v-else-if="currentWorkspaceTab === 'people'">
        <section class="content-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">人员配置</h2>
            </div>
            <button type="button" class="primary-btn" @click="savePeopleConfig">保存人员配置</button>
          </div>

          <div class="mode-card-grid">
            <button
              v-for="mode in personnelModeOptions"
              :key="mode.id"
              type="button"
              class="mode-card"
              :class="{ active: personnelMode === mode.id }"
              @click="switchPersonnelMode(mode.id)"
            >
              <Users v-if="mode.id === 'manual'" :size="18" />
              <Upload v-else-if="mode.id === 'upload'" :size="18" />
              <Sparkles v-else :size="18" />
              <div class="mode-card-title">{{ mode.title }}</div>
              <p class="mode-card-desc">{{ mode.description }}</p>
              <span class="mode-card-badge">{{ mode.badge }}</span>
            </button>
          </div>

          <div v-if="personnelMode === 'upload'" class="action-strip">
            <label class="upload-box">
              <input type="file" hidden @change="handlePeopleUpload" />
              <Upload :size="16" />
              <span>{{ peopleUploadName ? '重新上传人员表' : '上传人员表' }}</span>
            </label>
            <div class="action-note">{{ peopleUploadName || '尚未上传文件' }}</div>
          </div>

          <div v-if="personnelMode === 'material'" class="material-panel">
            <div>
              <h3 class="minor-title">企业素材提取</h3>
            </div>
            <button type="button" class="ghost-btn" @click="applyMaterialExtraction">应用提取结果</button>
          </div>

          <div v-if="personnelMode === 'material'" class="material-grid">
            <div v-for="member in materialExtractCandidates" :key="member.id" class="material-card">
              <div class="material-title">{{ member.name }}</div>
              <div class="material-meta">{{ member.department }} · {{ member.location }}</div>
              <p class="material-desc">{{ member.specialty }}</p>
              <div class="chip-row">
                <span class="chip">{{ member.skill }}</span>
                <span class="chip">{{ member.skillLevel }}</span>
                <span class="chip">{{ member.source }}</span>
              </div>
            </div>
          </div>

          <div class="table-shell">
            <table class="data-table">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>部门</th>
                  <th>地点</th>
                  <th>技能</th>
                  <th>技能等级</th>
                  <th>特点介绍</th>
                  <th>负荷</th>
                  <th>状态</th>
                  <th>来源</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in peopleProfiles" :key="member.id">
                  <td><input v-model.trim="member.name" class="table-input" type="text" /></td>
                  <td><input v-model.trim="member.department" class="table-input" type="text" /></td>
                  <td><input v-model.trim="member.location" class="table-input" type="text" /></td>
                  <td><input v-model.trim="member.skill" class="table-input" type="text" /></td>
                  <td>
                    <select v-model="member.skillLevel" class="table-select">
                      <option v-for="level in skillLevelOptions" :key="level" :value="level">{{ level }}</option>
                    </select>
                  </td>
                  <td><input v-model.trim="member.specialty" class="table-input" type="text" /></td>
                  <td><input v-model.number="member.load" class="table-input" type="number" min="0" max="100" /></td>
                  <td>
                    <select v-model="member.availability" class="table-select">
                      <option v-for="status in availabilityOptions" :key="status" :value="status">{{ status }}</option>
                    </select>
                  </td>
                  <td><input v-model.trim="member.source" class="table-input" type="text" /></td>
                  <td class="action-cell">
                    <button type="button" class="row-action" @click="removePerson(member.id)">移除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="footer-actions">
            <button type="button" class="ghost-btn" @click="addPerson">
              <Plus :size="14" />
              <span>新增人员</span>
            </button>
          </div>
        </section>
          </template>

          <template v-else>
        <section v-if="selectedTask" class="content-card">
          <div class="section-header">
            <div>
              <h2 class="section-title">{{ selectedTask.name }}</h2>
              <p class="section-desc">
                工单日期：{{ selectedTask.ticketDate }} · 创建时间：{{ selectedTask.createdAt }} ·
                当前为 {{
                  selectedTask.source === 'api' ? '系统对接'
                    : selectedTask.source === 'upload' ? '文档上传' : '手动输入'
                }} 任务
              </p>
            </div>
            <div v-if="currentWorkspaceTab === 'current'" class="header-actions">
              <button type="button" class="ghost-btn" @click="rerunSelectedTask">
                <RefreshCw :size="14" />
                <span>重新分配</span>
              </button>
            </div>
          </div>

          <div class="result-workspace">
            <aside class="result-ticket-list">
              <div class="result-list-title">工单编号</div>
              <div class="result-ticket-items">
                <button
                  v-for="result in selectedTask.results"
                  :key="result.ticketId"
                  type="button"
                  class="result-ticket-item"
                  :class="{ active: selectedResultTicketId === result.ticketId }"
                  @click="selectedResultTicketId = result.ticketId"
                >
                  <div class="result-ticket-id">{{ result.ticketId }}</div>
                  <div class="result-ticket-meta">{{ ticketResultMeta(result.ticketId) }}</div>
                  <div class="result-ticket-status">
                    <span class="status-pill" :class="result.status">{{ result.status }}</span>
                    <span>{{ result.confidence }}%</span>
                  </div>
                </button>
              </div>
            </aside>

            <div v-if="selectedResult && selectedResultTicket" class="result-detail-shell">
              <div class="metric-grid result-metric-grid">
                <div class="metric-card">
                  <span class="field-label">工单总数</span>
                  <strong>{{ selectedTask.tickets.length }}</strong>
                  <span>本次任务所有待分配工单</span>
                </div>
                <div class="metric-card">
                  <span class="field-label">已落位</span>
                  <strong>{{ selectedTaskAssignedCount }}</strong>
                  <span>包含自动分配与人工改派</span>
                </div>
                <div class="metric-card">
                  <span class="field-label">待确认</span>
                  <strong>{{ selectedTaskPendingCount }}</strong>
                  <span>建议继续人工确认</span>
                </div>
                <div class="metric-card">
                  <span class="field-label">平均匹配度</span>
                  <strong>{{ selectedTaskAverageConfidence }}%</strong>
                  <span>按当前 mock 规则计算</span>
                </div>
              </div>

              <div class="result-detail-grid">
                <div class="detail-panel">
                  <span class="field-label">工单信息</span>
                  <strong>{{ selectedResultTicket.title }}</strong>
                  <span>{{ selectedResult.ticketId }} / {{ selectedResultTicket.type }} / {{ selectedResultTicket.priority }} / {{ selectedResultTicket.location }}</span>
                </div>
                <div class="detail-panel">
                  <span class="field-label">分配人员</span>
                  <select
                    class="table-select detail-select"
                    :value="selectedResult.assigneeId || ''"
                    @change="updateSelectedTaskAssignee(selectedResult.ticketId, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="">待确认</option>
                    <option v-for="member in selectedTask.members" :key="member.id" :value="member.id">{{ member.name }}</option>
                  </select>
                  <span>{{ selectedResultAssignee ? `${selectedResultAssignee.department} · ${selectedResultAssignee.skill}` : '当前还未指定成员' }}</span>
                </div>
                <div class="detail-panel">
                  <span class="field-label">匹配状态</span>
                  <div class="chip-row">
                    <span class="chip">{{ selectedResult.confidence }}%</span>
                    <span class="status-pill" :class="selectedResult.status">{{ selectedResult.status }}</span>
                  </div>
                </div>
                <div class="detail-panel">
                  <span class="field-label">备选人员</span>
                  <div v-if="selectedResultAlternatives.length" class="detail-bullets">
                    <div v-for="member in selectedResultAlternatives" :key="member.id" class="detail-bullet">
                      <Check :size="14" />
                      <span>{{ member.name }} · {{ member.location }} · {{ member.skill }}</span>
                    </div>
                  </div>
                  <span v-else>当前没有备选人员。</span>
                </div>
              </div>

              <div class="detail-panel full-width-panel">
                <span class="field-label">匹配依据</span>
                <div class="detail-bullets">
                  <div v-for="basis in selectedResult.basis" :key="basis" class="detail-bullet">
                    <Check :size="14" />
                    <span>{{ basis }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">请选择一条工单查看分配结果。</div>
          </div>
        </section>
        <section v-else class="content-card">
          <div class="empty-state">当前没有可展示的工单任务。</div>
        </section>
          </template>
        </div>
      </div>
    </div>
  </div>

  <FormPageLayout
    v-else
    :icon="FileText"
    :title="pageTitle"
    :subtitle="pageSubtitle"
  >
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

    <div class="ticket-form-page">
      <section class="content-card workspace-entry-card">
        <div>
          <h2 class="section-title">进入工作台</h2>
          <p class="section-desc">如果你是来查看有效工单、归档结果或人员配置，可以直接进入全屏工作台，不必先新建工单。</p>
        </div>
        <button type="button" class="ghost-btn workspace-entry-btn" @click="enterWorkspace">
          <Sparkles :size="14" />
          <span>进入工作台</span>
        </button>
      </section>

      <div v-if="showFeedbackBanner" class="feedback-banner" :class="feedbackTone">
        <div class="feedback-title">
          <CheckCircle2 v-if="feedbackTone !== 'warning'" :size="16" />
          <AlertTriangle v-else :size="16" />
          <span>{{ feedbackTitle }}</span>
        </div>
        <p class="feedback-desc">{{ feedbackMessage }}</p>
      </div>

      <section class="content-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">新建工单</h2>
            <p class="section-desc">当前页面只保留新建工单表单。有效工单、归档工单和人员配置请进入工作台查看。</p>
          </div>
        </div>

        <div class="form-grid">
          <label class="field-block">
            <span class="field-label">任务名称</span>
            <input v-model.trim="draftTaskName" class="text-input" type="text" placeholder="例如：华东区域 3 月第 3 周工单分配" />
          </label>
          <label class="field-block">
            <span class="field-label">工单日期</span>
            <input v-model="draftTicketDate" class="text-input" type="date" />
          </label>
          <label class="field-block full-span">
            <span class="field-label">任务备注</span>
            <input v-model.trim="draftTaskNote" class="text-input" type="text" placeholder="例如：优先保障高优故障和开业门店工单" />
          </label>
        </div>

        <div class="mode-card-grid">
          <button
            v-for="source in ticketSourceOptions"
            :key="source.id"
            type="button"
            class="mode-card"
            :class="{ active: draftTicketSource === source.id }"
            @click="switchDraftSource(source.id)"
          >
            <Sparkles v-if="source.id === 'api'" :size="18" />
            <Upload v-else-if="source.id === 'upload'" :size="18" />
            <ClipboardList v-else :size="18" />
            <div class="mode-card-title">{{ source.title }}</div>
            <p class="mode-card-desc">{{ source.description }}</p>
            <span class="mode-card-badge">{{ source.badge }}</span>
          </button>
        </div>

        <div v-if="draftTicketSource === 'upload'" class="action-strip">
          <label class="upload-box">
            <input type="file" hidden @change="handleTicketUpload" />
            <Upload :size="16" />
            <span>{{ draftTicketUploadName ? '重新上传工单清单' : '上传工单清单' }}</span>
          </label>
          <div class="action-note">{{ draftTicketUploadName || '尚未上传文件' }}</div>
        </div>

        <div v-else-if="draftTicketSource === 'api'" class="system-connect-card">
          <span class="field-label">系统对接</span>
          <strong>ServiceNow - 华东门店工单池</strong>
          <span>基础字段已自动映射，可直接确认工单列表。</span>
        </div>

        <div class="source-summary">
          当前 mock 已准备 {{ draftTickets.length }} 条待分配工单，保存后可在工作台继续查看分配结果。
        </div>
      </section>

      <section class="content-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">字段配置</h2>
            <p class="section-desc">系统对接时自动映射；文档上传和手动输入时可自定义字段名称与来源列名。</p>
          </div>
        </div>

        <div class="field-config-grid">
          <label class="field-block">
            <span class="field-label">新增字段名称</span>
            <input v-model.trim="customFieldLabel" class="text-input" type="text" placeholder="例如：客户等级" />
          </label>
          <label class="field-block">
            <span class="field-label">来源列名</span>
            <input v-model.trim="customFieldColumn" class="text-input" type="text" placeholder="例如：customer_level" />
          </label>
          <button type="button" class="ghost-btn field-add-btn" @click="addCustomField">
            <Plus :size="14" />
            <span>新增自定义字段</span>
          </button>
        </div>

        <div class="table-shell">
          <table class="data-table">
            <thead>
              <tr>
                <th>字段标识</th>
                <th>展示名称</th>
                <th>来源列名</th>
                <th>映射方式</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field in draftFieldConfigs" :key="field.id">
                <td>{{ field.id }}</td>
                <td><input v-model.trim="field.label" class="table-input" type="text" /></td>
                <td>
                  <input
                    v-model.trim="field.sourceColumn"
                    class="table-input"
                    type="text"
                    :disabled="draftTicketSource === 'api' && !field.custom"
                  />
                </td>
                <td>{{ draftTicketSource === 'api' && !field.custom ? '自动映射' : '可编辑' }}</td>
                <td class="action-cell">
                  <button v-if="field.custom" type="button" class="row-action" @click="removeCustomField(field.id)">移除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="form-submit">
        <button type="button" class="primary-btn form-submit-btn" @click="saveAndAllocate">
          <Sparkles :size="14" />
          <span>保存并分配</span>
        </button>
      </div>
    </div>

    <template #info-sidebar>
      <InfoSidebar
        :icon="FileText"
        title="AI 工单智能体"
        description="右侧保留通用说明区：默认先新建工单，也支持直接进入工作台查看已有任务和人员配置。"
        :features="infoSidebarFeatures"
      />
    </template>
  </FormPageLayout>
</template>

<style scoped>
.ticket-form-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 40px;
}

.ticket-workspace-page {
  height: 100vh;
  background: #f8fafc;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.workspace-topbar,
.workspace-tabs,
.page-actions,
.section-header,
.header-actions,
.action-strip,
.material-panel,
.workspace-topbar-left,
.workspace-topbar-right,
.field-config-grid,
.feedback-title,
.task-card-top,
.footer-actions,
.summary-line {
  display: flex;
  gap: 12px;
}

.workspace-topbar,
.workspace-tabs,
.page-actions,
.section-header,
.header-actions,
.action-strip,
.material-panel {
  align-items: center;
  justify-content: space-between;
}

.workspace-topbar {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 10px 14px;
}

.workspace-topbar-left {
  align-items: center;
}

.workspace-title-block {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.eyebrow,
.field-label {
  display: inline-flex;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.02em;
}

.workspace-title,
.section-title,
.minor-title {
  margin: 0;
  color: #0f172a;
}

.workspace-title {
  font-size: 18px;
  font-weight: 800;
}

.workspace-subtitle,
.section-desc,
.feedback-desc,
.action-note,
.material-desc,
.task-card-desc,
.task-card-meta,
.metric-card span:last-child,
.detail-panel span:last-child {
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.workspace-tabs {
  flex-wrap: wrap;
  justify-content: flex-start;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 12px;
}

.workspace-tab,
.mode-card,
.task-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.workspace-tab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #dbe4ee;
  background: #f8fafc;
  border-radius: 14px;
  padding: 11px 15px;
  font-size: 14px;
  font-weight: 700;
  color: #475569;
}

.workspace-tab.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.tab-badge,
.mode-card-badge,
.chip,
.task-status-badge,
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.tab-badge,
.mode-card-badge,
.chip {
  background: #e2e8f0;
  color: #475569;
}

.ghost-btn,
.primary-btn,
.row-action,
.upload-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.ghost-btn,
.row-action {
  border: 1px solid #dbe4ee;
  background: #ffffff;
  color: #334155;
  padding: 10px 14px;
}

.ghost-btn:hover,
.row-action:hover {
  border-color: #93c5fd;
  background: #eff6ff;
  color: #2563eb;
}

.primary-btn {
  border: none;
  background: #2563eb;
  color: #ffffff;
  padding: 12px 18px;
}

.primary-btn:hover {
  background: #1d4ed8;
}

.content-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px 22px;
}

.workspace-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.workspace-shell {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 12px;
}

.workspace-sidebar {
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow-y: auto;
}

.workspace-sidebar-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.workspace-sidebar-title {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.04em;
}

.workspace-nav-list,
.workspace-subnav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.workspace-nav-item,
.workspace-subnav-item {
  width: 100%;
  border: 1px solid #dbe4ee;
  background: #f8fafc;
  color: #334155;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.workspace-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 700;
}

.workspace-nav-item.active,
.workspace-subnav-item.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.workspace-nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
}

.workspace-nav-item.active .workspace-nav-badge {
  background: #dbeafe;
  color: #2563eb;
}

.workspace-subnav-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 12px;
  text-align: left;
}

.workspace-subnav-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.workspace-subnav-meta,
.workspace-subnav-stats,
.subnav-empty {
  font-size: 12px;
  color: #64748b;
  line-height: 1.6;
}

.workspace-subnav-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subnav-empty {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
}

.workspace-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-workspace {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 16px;
  margin-top: 18px;
}

.result-ticket-list {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-list-title {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.04em;
}

.result-ticket-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-ticket-item {
  width: 100%;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  background: #ffffff;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-ticket-item.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.result-ticket-id {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.result-ticket-meta,
.result-ticket-status {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

.result-ticket-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.result-detail-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-metric-grid {
  margin-top: 0;
}

.result-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail-select {
  margin-top: 10px;
}

.full-width-panel {
  margin-top: 0;
}

.workspace-entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.workspace-entry-btn,
.form-submit-btn {
  min-width: 148px;
}

.source-summary {
  margin-top: 16px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.form-submit {
  display: flex;
  justify-content: flex-end;
}

.form-grid,
.metric-grid,
.detail-grid,
.field-config-grid,
.mode-card-grid,
.material-grid,
.task-grid {
  display: grid;
  gap: 12px;
}

.form-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18px;
}

.field-config-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr)) auto;
  align-items: end;
  margin-top: 16px;
}

.mode-card-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 18px;
}

.task-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 16px;
}

.material-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 16px;
}

.metric-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 18px;
}

.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18px;
}

.full-span {
  grid-column: 1 / -1;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-input,
.table-input,
.table-select {
  width: 100%;
  border: 1px solid #d7e0ea;
  border-radius: 12px;
  background: #ffffff;
  color: #0f172a;
  padding: 11px 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.text-input:focus,
.table-input:focus,
.table-select:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
}

.mode-card {
  border: 1px solid #dbe4ee;
  background: #f8fafc;
  border-radius: 18px;
  padding: 18px;
  text-align: left;
}

.mode-card.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.mode-card-title,
.task-card-title,
.material-title {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.mode-card-desc {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #64748b;
}

.mode-card-badge {
  margin-top: 14px;
}

.upload-box {
  border: 1px dashed #93c5fd;
  background: #f8fbff;
  color: #2563eb;
  padding: 12px 14px;
}

.system-connect-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
}

.table-shell {
  margin-top: 16px;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.data-table {
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  background: #ffffff;
}

.wide-table {
  min-width: 1120px;
}

.data-table th,
.data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #edf2f7;
  text-align: left;
  vertical-align: top;
  font-size: 13px;
}

.data-table th {
  background: #f8fafc;
  color: #64748b;
  font-weight: 700;
}

.action-cell {
  width: 74px;
}

.feedback-banner {
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid transparent;
}

.feedback-banner.info {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.feedback-banner.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.feedback-banner.warning {
  background: #fff7ed;
  border-color: #fed7aa;
}

.feedback-title {
  font-size: 14px;
  font-weight: 700;
  align-items: center;
}

.feedback-banner.info .feedback-title {
  color: #1d4ed8;
}

.feedback-banner.success .feedback-title {
  color: #15803d;
}

.feedback-banner.warning .feedback-title {
  color: #c2410c;
}

.tips-card {
  border-style: dashed;
}

.insight-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.insight-list.inline {
  margin-top: 14px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
}

.insight-item.info {
  background: #eff6ff;
  color: #1d4ed8;
}

.insight-item.success {
  background: #f0fdf4;
  color: #15803d;
}

.insight-item.warning {
  background: #fff7ed;
  color: #c2410c;
}

.material-panel {
  margin-top: 16px;
}

.material-card,
.task-card,
.metric-card,
.detail-panel {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  padding: 16px;
}

.material-meta,
.task-card-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.task-card.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.task-card-top {
  align-items: flex-start;
  justify-content: space-between;
}

.task-status-badge.active,
.status-pill.已分配 {
  background: #dcfce7;
  color: #15803d;
}

.task-status-badge.expired,
.status-pill.待确认 {
  background: #ffedd5;
  color: #c2410c;
}

.status-pill.已调整 {
  background: #dbeafe;
  color: #1d4ed8;
}

.task-card-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.task-metric,
.metric-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 12px 14px;
}

.task-metric span,
.metric-card span:first-child,
.metric-card strong {
  display: block;
}

.task-metric span,
.metric-card span:first-child {
  font-size: 12px;
  color: #64748b;
}

.task-metric strong,
.metric-card strong,
.detail-panel strong {
  margin-top: 8px;
  font-size: 22px;
  color: #0f172a;
}

.detail-bullets {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-bullet {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #334155;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-row {
  cursor: pointer;
  transition: background 0.2s ease;
}

.result-row.active {
  background: #f8fbff;
}

.empty-state {
  padding: 32px 16px;
  text-align: center;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 1440px) {
  .mode-card-grid,
  .material-grid,
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1100px) {
  .workspace-topbar,
  .section-header,
  .action-strip,
  .material-panel,
  .page-actions,
  .workspace-entry-card {
    flex-direction: column;
    align-items: stretch;
  }

  .workspace-topbar-left {
    flex-direction: column;
    align-items: stretch;
  }

  .workspace-shell {
    flex-direction: column;
  }

  .workspace-sidebar {
    width: 100%;
    overflow: visible;
  }

  .result-workspace,
  .result-detail-grid {
    grid-template-columns: 1fr;
  }

  .form-grid,
  .detail-grid,
  .field-config-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .ticket-workspace-page {
    padding: 16px;
  }

  .mode-card-grid,
  .material-grid,
  .metric-grid,
  .task-card-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
