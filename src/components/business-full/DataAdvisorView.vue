<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  Database,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  Plus,
  QrCode,
  RefreshCw,
  ScrollText,
  Search,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trash2,
  Unlink,
  Upload,
  X,
} from 'lucide-vue-next';
import { FormPageLayout, InfoSidebar, TemplateSidebar } from '../shared';
import { businessModuleToolList } from './moduleCatalog';

// ─── Types ──────────────────────────────────────────────────────────

type SourceId = 'local' | 'dingtalk' | 'feishu';
type WorkspaceRole = 'employee' | 'boss';
type BossSection = 'dashboard' | 'files' | 'trends';
type DashboardDimension = 'revenue' | 'customer' | 'team' | 'risk';
type FeedbackTone = 'info' | 'success' | 'warning';
type ScanPhase = 'idle' | 'scanning' | 'success';

interface SourceOption {
  id: SourceId;
  name: string;
  description: string;
  badge: string;
}

interface RemoteFile {
  id: string;
  name: string;
  type: string;
  size: string;
  path: string;
  selected: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  source: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploader: string;
  status: '已解析' | '解析中';
}

interface AdvisorCitation {
  source: string;
  snippet: string;
}

interface AdvisorMessage {
  id: string;
  role: 'user' | 'advisor';
  content: string;
  citations?: AdvisorCitation[];
  timestamp: string;
}

interface ConversationThread {
  id: string;
  title: string;
  createdAt: string;
  messages: AdvisorMessage[];
}

// ─── Constants ──────────────────────────────────────────────────────

const route = useRoute();
const router = useRouter();

const sourceOptions: SourceOption[] = [
  { id: 'local', name: '本地上传', description: '上传本地文件进行分析', badge: '上传' },
  { id: 'dingtalk', name: '钉钉', description: '扫码接入钉钉知识库', badge: '扫码' },
  { id: 'feishu', name: '飞书', description: '扫码接入飞书云文档', badge: '扫码' },
];

const recentTools = computed(() => [
  { icon: Database, label: '数据顾问智能体', route: 'data-advisor', active: true },
  ...businessModuleToolList,
]);

const infoSidebarFeatures = [
  '选择数据接入方式并上传材料即可开始',
  '支持本地文件上传、钉钉扫码、飞书扫码',
  '上传后可在工作台使用顾问问答',
  '当前所有数据和交互均为 Demo Mock',
];

const dingtalkRemoteFiles: RemoteFile[] = [
  { id: 'DT-001', name: '03月第3周销售复盘.docx', type: 'Word', size: '312 KB', path: '销售周报空间', selected: true },
  { id: 'DT-002', name: '华东区客户推进表.xlsx', type: 'Excel', size: '198 KB', path: '销售周报空间', selected: true },
  { id: 'DT-003', name: '重点客户跟进纪要.pdf', type: 'PDF', size: '145 KB', path: '钉盘 / 客户资料', selected: false },
  { id: 'DT-004', name: '项目协同纪要_华南C客户.docx', type: 'Word', size: '89 KB', path: '群文档', selected: false },
  { id: 'DT-005', name: '02月销售目标达成汇总.xlsx', type: 'Excel', size: '267 KB', path: '钉盘 / 月度汇总', selected: true },
  { id: 'DT-006', name: '客户等级评估标准_v2.pdf', type: 'PDF', size: '178 KB', path: '知识库', selected: false },
];

const feishuRemoteFiles: RemoteFile[] = [
  { id: 'FS-001', name: '涌见AI平台迭代周报_W12.md', type: 'Markdown', size: '56 KB', path: '项目空间', selected: true },
  { id: 'FS-002', name: '项目风险跟踪表.xlsx', type: 'Excel', size: '134 KB', path: '项目空间', selected: true },
  { id: 'FS-003', name: '部门执行方案_初稿.docx', type: 'Word', size: '289 KB', path: '云文档', selected: false },
  { id: 'FS-004', name: '医疗行业案例合集.pdf', type: 'PDF', size: '456 KB', path: '知识库', selected: true },
  { id: 'FS-005', name: '客户推进看板_多维表格.xlsx', type: 'Excel', size: '98 KB', path: '多维表格', selected: false },
];

const advisorPresetQuestions = [
  '汇总最近 30 天销售复盘里的重点客户风险',
  '分析项目周报中持续出现的阻塞问题',
  '对比不同行业的推广方案差异',
  '列出所有超期回款客户并给出催收建议',
  '总结本月知识库中新增的高优文档',
];

// ─── Form Page State ────────────────────────────────────────────────

const activeSourceId = ref<SourceId>('local');
const localDescription = ref('');
const localFiles = ref<string[]>([]);
const showScanOverlay = ref(false);
const scanPhase = ref<ScanPhase>('idle');
const remoteFiles = ref<RemoteFile[]>([]);
const scanSourceLabel = ref('');
const connectedAccounts = ref<Record<string, { name: string; email: string } | null>>({
  dingtalk: null,
  feishu: null,
});
const formFeedback = ref('');
const formFeedbackTone = ref<FeedbackTone>('info');

// ─── Workspace State ────────────────────────────────────────────────

const activeRole = ref<WorkspaceRole>('employee');

const initialUploadedFiles: UploadedFile[] = [
  { id: 'UF-001', name: '重点客户风险汇总.xlsx', source: '本地上传', type: 'Excel', size: '156 KB', uploadedAt: '2026-03-20 09:15', uploader: '张经理', status: '已解析' },
  { id: 'UF-002', name: '03月第3周销售复盘.docx', source: '钉钉', type: 'Word', size: '312 KB', uploadedAt: '2026-03-19 14:30', uploader: '张经理', status: '已解析' },
  { id: 'UF-003', name: '华东区客户推进表.xlsx', source: '钉钉', type: 'Excel', size: '198 KB', uploadedAt: '2026-03-19 14:30', uploader: '张经理', status: '已解析' },
  { id: 'UF-004', name: '涌见AI平台迭代周报_W12.md', source: '飞书', type: 'Markdown', size: '56 KB', uploadedAt: '2026-03-18 10:00', uploader: '李总监', status: '已解析' },
  { id: 'UF-005', name: '项目风险跟踪表.xlsx', source: '飞书', type: 'Excel', size: '134 KB', uploadedAt: '2026-03-18 10:00', uploader: '李总监', status: '已解析' },
  { id: 'UF-006', name: '医疗行业案例合集.pdf', source: '飞书', type: 'PDF', size: '456 KB', uploadedAt: '2026-03-17 16:20', uploader: '王主管', status: '已解析' },
  { id: 'UF-007', name: '企业版周报模板.docx', source: '本地上传', type: 'Word', size: '89 KB', uploadedAt: '2026-03-17 11:00', uploader: '当前账号', status: '解析中' },
];

const initialThreads: ConversationThread[] = [
  {
    id: 'THD-001', title: '重点客户风险汇总', createdAt: '2026-03-20 09:30',
    messages: [
      { id: 'MSG-001', role: 'user', content: '汇总最近 30 天销售复盘里的重点客户风险，并按客户等级给出处理建议。', timestamp: '09:30' },
      {
        id: 'MSG-002', role: 'advisor', timestamp: '09:31',
        content: '根据已上传文档分析，共识别出 3 个重点客户风险：\n\n1. **华东 A 客户**（S 级）：合同续签延期 15 天，对接人变更后沟通效率下降。建议本周内安排高管拜访，确认续签意向。\n\n2. **华北 B 客户**（A 级）：回款超期 22 天，已触发财务预警。建议销售负责人与财务协同跟进，启动催款流程。\n\n3. **华南 C 客户**（B 级）：项目验收延迟，技术团队反馈需求变更频繁。建议项目经理重新确认需求范围并锁定交付标准。',
        citations: [
          { source: '03月第3周销售复盘.docx', snippet: '华东 A 客户合同续签延期，对接人从李总变更为王总...' },
          { source: '华东区客户推进表.xlsx', snippet: 'B 客户应收账款 45 万，超期 22 天，财务已标记预警...' },
        ],
      },
    ],
  },
  {
    id: 'THD-002', title: '项目阻塞点分析', createdAt: '2026-03-19 15:10',
    messages: [
      { id: 'MSG-003', role: 'user', content: '分析最近一个月项目周报中的主要阻塞点，按影响程度排序。', timestamp: '15:10' },
      {
        id: 'MSG-004', role: 'advisor', timestamp: '15:11',
        content: '基于已上传的项目周报内容，识别出以下主要阻塞点：\n\n1. **人力资源紧缺**（高影响）：连续 3 周提及前端开发资源不足，影响 2 个项目的迭代进度。\n\n2. **第三方接口延迟**（中影响）：支付渠道接口对接比计划延迟 8 个工作日，导致上线计划整体后移。\n\n3. **需求频繁变更**（中影响）：华南 C 客户在验收前连续变更 3 次需求，项目组需要额外 2 周消化。',
        citations: [
          { source: '涌见AI平台迭代周报_W12.md', snippet: '前端开发资源持续紧张，建议协调外部支援...' },
          { source: '项目风险跟踪表.xlsx', snippet: '支付渠道接口对接延迟 8 个工作日，需评估对上线的影响...' },
        ],
      },
    ],
  },
  {
    id: 'THD-003', title: '两部门方案对比', createdAt: '2026-03-18 11:20',
    messages: [],
  },
];

const uploadedFiles = ref<UploadedFile[]>(initialUploadedFiles.map((f) => ({ ...f })));
const threads = ref<ConversationThread[]>(initialThreads.map((t) => ({ ...t, messages: t.messages.map((m) => ({ ...m, citations: m.citations?.map((c) => ({ ...c })) })) })));
const activeThreadId = ref<string>(threads.value[0]?.id ?? '');
const advisorInput = ref('');

const wsFeedbackTone = ref<FeedbackTone>('info');
const wsFeedbackMessage = ref('');

const activeBossSection = ref<BossSection>('dashboard');
const activeDimension = ref<DashboardDimension>('revenue');
const bossFileSearch = ref('');
const bossFileSourceFilter = ref<'all' | SourceId>('all');
const bossFileUploaderFilter = ref('all');

const uploaderList = computed(() => {
  const set = new Set(uploadedFiles.value.map((f) => f.uploader));
  return Array.from(set);
});

const filteredBossFiles = computed(() => {
  let list = uploadedFiles.value;
  if (bossFileSearch.value.trim()) {
    const q = bossFileSearch.value.trim().toLowerCase();
    list = list.filter((f) => f.name.toLowerCase().includes(q));
  }
  if (bossFileSourceFilter.value !== 'all') {
    const sourceMap: Record<SourceId, string> = { local: '本地上传', dingtalk: '钉钉', feishu: '飞书' };
    list = list.filter((f) => f.source === sourceMap[bossFileSourceFilter.value as SourceId]);
  }
  if (bossFileUploaderFilter.value !== 'all') {
    list = list.filter((f) => f.uploader === bossFileUploaderFilter.value);
  }
  return list;
});

const bossSectionTabs = [
  { key: 'dashboard' as BossSection, label: '数据看板', icon: LayoutDashboard },
  { key: 'files' as BossSection, label: '全部文档', icon: FolderOpen },
  { key: 'trends' as BossSection, label: '趋势洞察', icon: BarChart3 },
];

const dimensionTabs: Array<{ key: DashboardDimension; label: string }> = [
  { key: 'revenue', label: '营收概览' },
  { key: 'customer', label: '客户分析' },
  { key: 'team', label: '团队效能' },
  { key: 'risk', label: '风险预警' },
];

interface DashboardCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
  detail: string;
}

interface TrendInsight {
  id: string;
  title: string;
  summary: string;
  severity: 'positive' | 'neutral' | 'warning';
  source: string;
  date: string;
}

const dashboardData: Record<DashboardDimension, DashboardCard[]> = {
  revenue: [
    { label: '本月营收', value: '¥ 486.2 万', change: '+12.3%', trend: 'up', detail: '较上月增长 53.4 万' },
    { label: '签单金额', value: '¥ 312.8 万', change: '+8.7%', trend: 'up', detail: '新签 15 单，续签 8 单' },
    { label: '回款金额', value: '¥ 278.5 万', change: '-3.2%', trend: 'down', detail: '3 笔大额回款延期' },
    { label: '毛利率', value: '42.6%', change: '+1.8%', trend: 'up', detail: '高毛利项目占比提升' },
  ],
  customer: [
    { label: '活跃客户', value: '128 家', change: '+6', trend: 'up', detail: '本月新增 12 家，流失 6 家' },
    { label: 'S级客户', value: '23 家', change: '+2', trend: 'up', detail: '华东A客户升级为S级' },
    { label: '平均客单价', value: '¥ 18.6 万', change: '+5.2%', trend: 'up', detail: '大客户占比持续提升' },
    { label: '客户满意度', value: '4.3 / 5.0', change: '-0.1', trend: 'down', detail: '交付延期影响评分' },
  ],
  team: [
    { label: '销售人均产出', value: '¥ 24.3 万', change: '+3.1%', trend: 'up', detail: '12 名销售贡献' },
    { label: '人均拜访量', value: '18.6 次/月', change: '+2.4', trend: 'up', detail: '华东团队最活跃' },
    { label: '汇报提交率', value: '87.5%', change: '-4.2%', trend: 'down', detail: '3 人连续 2 周未提交' },
    { label: '目标完成率', value: '76.8%', change: '+5.6%', trend: 'up', detail: '预计月底可达 85%' },
  ],
  risk: [
    { label: '超期应收', value: '¥ 89.3 万', change: '+12.6 万', trend: 'down', detail: '华北B客户 45 万超期 22 天' },
    { label: '流失预警客户', value: '5 家', change: '+2', trend: 'down', detail: '2 家 60 天无互动' },
    { label: '合同到期未续', value: '3 份', change: '+1', trend: 'down', detail: '最近一份 4 月 15 日到期' },
    { label: '项目延期', value: '2 个', change: '0', trend: 'flat', detail: '华南C客户验收延迟' },
  ],
};

const trendInsights: TrendInsight[] = [
  { id: 'TI-001', title: '华东区营收连续 3 月增长', summary: '华东区域 1-3 月营收分别为 120 万、138 万、156 万，环比增速保持 10% 以上。主要受益于两个大客户续签和新开拓客户贡献。建议加大华东区域资源投入。', severity: 'positive', source: '03月第3周销售复盘.docx, 华东区客户推进表.xlsx', date: '2026-03-20' },
  { id: 'TI-002', title: '客户续签率较去年同期下降', summary: '本季度客户续签率为 72%，较去年同期 81% 下降 9 个百分点。主要原因是竞品价格战和交付延期导致客户满意度下降。需重点关注 4 月到期的 8 个合同。', severity: 'warning', source: '重点客户风险汇总.xlsx', date: '2026-03-19' },
  { id: 'TI-003', title: '飞书文档使用率提升显著', summary: '本月通过飞书接入的文档数量较上月增加 40%，团队协作效率提升。周报提交从平均 2.3 天缩短至 1.1 天，建议全面推广飞书作为标准化工具。', severity: 'positive', source: '涌见AI平台迭代周报_W12.md', date: '2026-03-18' },
  { id: 'TI-004', title: '华南区项目交付风险累积', summary: '华南C客户连续 3 次变更需求，验收节点推迟至 4 月中旬。项目组加班频率增加 60%，团队士气受到影响。建议项目经理与客户重新锁定交付范围。', severity: 'warning', source: '项目风险跟踪表.xlsx', date: '2026-03-17' },
  { id: 'TI-005', title: '医疗行业客户拓展进入快车道', summary: '医疗行业案例库已积累 12 个标杆案例，本月新增 3 个医疗行业意向客户。行业口碑效应开始显现，建议整理行业白皮书用于销售赋能。', severity: 'positive', source: '医疗行业案例合集.pdf', date: '2026-03-16' },
];

const currentDashboardCards = computed(() => dashboardData[activeDimension.value]);

interface BarDataItem { label: string; value: string; pct: number; color: string; }
interface DonutSegment { color: string; dash: string; offset: string; }
interface DonutLegendItem { label: string; value: string; color: string; }
interface LineDataPoint { x: number; y: number; }

const barDataMap: Record<DashboardDimension, BarDataItem[]> = {
  revenue: [
    { label: '10月', value: '¥310万', pct: 64, color: '#93c5fd' },
    { label: '11月', value: '¥345万', pct: 71, color: '#93c5fd' },
    { label: '12月', value: '¥398万', pct: 82, color: '#60a5fa' },
    { label: '1月', value: '¥362万', pct: 75, color: '#60a5fa' },
    { label: '2月', value: '¥432万', pct: 89, color: '#3b82f6' },
    { label: '3月', value: '¥486万', pct: 100, color: '#2563eb' },
  ],
  customer: [
    { label: '华东', value: '42家', pct: 100, color: '#2563eb' },
    { label: '华北', value: '31家', pct: 74, color: '#3b82f6' },
    { label: '华南', value: '28家', pct: 67, color: '#60a5fa' },
    { label: '西南', value: '15家', pct: 36, color: '#93c5fd' },
    { label: '华中', value: '12家', pct: 29, color: '#bfdbfe' },
  ],
  team: [
    { label: '张经理', value: '112%', pct: 100, color: '#22c55e' },
    { label: '王主管', value: '96%', pct: 86, color: '#4ade80' },
    { label: '李总监', value: '88%', pct: 79, color: '#60a5fa' },
    { label: '赵组长', value: '73%', pct: 65, color: '#fbbf24' },
    { label: '陈专员', value: '61%', pct: 54, color: '#f87171' },
  ],
  risk: [
    { label: '应收超期', value: '¥89万', pct: 100, color: '#ef4444' },
    { label: '客户流失', value: '5家', pct: 56, color: '#f97316' },
    { label: '合同到期', value: '3份', pct: 34, color: '#fbbf24' },
    { label: '项目延期', value: '2个', pct: 22, color: '#a3e635' },
  ],
};
const currentBarData = computed(() => barDataMap[activeDimension.value]);

const donutDataMap: Record<DashboardDimension, { segments: Array<{ pct: number; color: string }>; center: { value: string; label: string }; legend: DonutLegendItem[] }> = {
  revenue: {
    segments: [{ pct: 45, color: '#2563eb' }, { pct: 30, color: '#60a5fa' }, { pct: 15, color: '#93c5fd' }, { pct: 10, color: '#bfdbfe' }],
    center: { value: '¥486万', label: '本月营收' },
    legend: [{ label: '新签合同', value: '45%', color: '#2563eb' }, { label: '续签合同', value: '30%', color: '#60a5fa' }, { label: '增购', value: '15%', color: '#93c5fd' }, { label: '服务费', value: '10%', color: '#bfdbfe' }],
  },
  customer: {
    segments: [{ pct: 18, color: '#ef4444' }, { pct: 25, color: '#f97316' }, { pct: 35, color: '#3b82f6' }, { pct: 22, color: '#94a3b8' }],
    center: { value: '128家', label: '活跃客户' },
    legend: [{ label: 'S级', value: '18%', color: '#ef4444' }, { label: 'A级', value: '25%', color: '#f97316' }, { label: 'B级', value: '35%', color: '#3b82f6' }, { label: 'C级', value: '22%', color: '#94a3b8' }],
  },
  team: {
    segments: [{ pct: 62, color: '#22c55e' }, { pct: 23, color: '#fbbf24' }, { pct: 15, color: '#ef4444' }],
    center: { value: '76.8%', label: '完成率' },
    legend: [{ label: '已完成', value: '62%', color: '#22c55e' }, { label: '进行中', value: '23%', color: '#fbbf24' }, { label: '未开始', value: '15%', color: '#ef4444' }],
  },
  risk: {
    segments: [{ pct: 40, color: '#ef4444' }, { pct: 35, color: '#f97316' }, { pct: 25, color: '#fbbf24' }],
    center: { value: '10项', label: '风险总数' },
    legend: [{ label: '高风险', value: '40%', color: '#ef4444' }, { label: '中风险', value: '35%', color: '#f97316' }, { label: '低风险', value: '25%', color: '#fbbf24' }],
  },
};

const circumference = 2 * Math.PI * 48;
const currentDonutData = computed<DonutSegment[]>(() => {
  const data = donutDataMap[activeDimension.value];
  let accumulated = 0;
  return data.segments.map((seg) => {
    const dash = `${(seg.pct / 100) * circumference} ${circumference}`;
    const offset = String(-accumulated * circumference / 100 + circumference * 0.25);
    accumulated += seg.pct;
    return { color: seg.color, dash, offset };
  });
});
const currentDonutCenter = computed(() => donutDataMap[activeDimension.value].center);
const currentDonutLegend = computed(() => donutDataMap[activeDimension.value].legend);

const lineDataMap: Record<DashboardDimension, { values: number[]; labels: string[] }> = {
  revenue: { values: [180, 220, 195, 260, 245, 278], labels: ['10月', '11月', '12月', '1月', '2月', '3月'] },
  customer: { values: [6, 9, 7, 11, 8, 12], labels: ['10月', '11月', '12月', '1月', '2月', '3月'] },
  team: { values: [14, 15, 16, 17, 16, 19], labels: ['10月', '11月', '12月', '1月', '2月', '3月'] },
  risk: { values: [45, 52, 60, 72, 78, 89], labels: ['10月', '11月', '12月', '1月', '2月', '3月'] },
};

const currentLineDataPoints = computed<LineDataPoint[]>(() => {
  const d = lineDataMap[activeDimension.value];
  const maxV = Math.max(...d.values);
  const minV = Math.min(...d.values);
  const range = maxV - minV || 1;
  return d.values.map((v, i) => ({
    x: 20 + (i / (d.values.length - 1)) * 240,
    y: 85 - ((v - minV) / range) * 70,
  }));
});
const currentLinePoints = computed(() => {
  const pts = currentLineDataPoints.value;
  const line = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const last = pts[pts.length - 1] ?? { x: 0, y: 95 };
  const first = pts[0] ?? { x: 0, y: 95 };
  return `${line} ${last.x},95 ${first.x},95`;
});
const currentLineLabels = computed(() => lineDataMap[activeDimension.value].labels);

let fileSequence = 8;
let threadSequence = 4;
let msgSequence = 5;

// ─── Computed ───────────────────────────────────────────────────────

const isWorkspaceMode = computed(() => route.query.workspace === '1');

const activeThread = computed(() => threads.value.find((t) => t.id === activeThreadId.value) ?? threads.value[0] ?? null);
const selectedRemoteCount = computed(() => remoteFiles.value.filter((f) => f.selected).length);

const fileStats = computed(() => {
  const total = uploadedFiles.value.length;
  const uploaders = new Set(uploadedFiles.value.map((f) => f.uploader)).size;
  const sources = new Set(uploadedFiles.value.map((f) => f.source)).size;
  const latest = uploadedFiles.value.length > 0 ? (uploadedFiles.value[0]?.uploadedAt ?? '-') : '-';
  return { total, uploaders, sources, latest };
});

// ─── Form Page Methods ──────────────────────────────────────────────

const switchSource = (id: SourceId) => {
  activeSourceId.value = id;
  formFeedback.value = '';
};

const handleLocalUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;
  for (let i = 0; i < files.length; i++) {
    const name = files[i]?.name;
    if (name && !localFiles.value.includes(name)) {
      localFiles.value.push(name);
    }
  }
  target.value = '';
};

const removeLocalFile = (name: string) => {
  localFiles.value = localFiles.value.filter((f) => f !== name);
};

const saveAsFileAndUpload = () => {
  const text = localDescription.value.trim();
  if (!text) return;
  const now = new Date();
  const fileName = `文本录入_${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.txt`;
  if (!localFiles.value.includes(fileName)) {
    localFiles.value.push(fileName);
  }
  localDescription.value = '';
  formFeedback.value = `已将文本内容存为"${fileName}"并加入上传列表。`;
  formFeedbackTone.value = 'success';
};

const submitLocalUpload = () => {
  if (localFiles.value.length === 0) {
    formFeedback.value = '请先选择要上传的文件';
    formFeedbackTone.value = 'warning';
    return;
  }
  formFeedback.value = `已模拟上传 ${localFiles.value.length} 份文件，可进入工作台查看。`;
  formFeedbackTone.value = 'success';
};

const openScanOverlay = () => {
  scanPhase.value = 'idle';
  scanSourceLabel.value = activeSourceId.value === 'dingtalk' ? '钉钉' : '飞书';
  showScanOverlay.value = true;
};

const closeScanOverlay = () => {
  showScanOverlay.value = false;
  scanPhase.value = 'idle';
};

const simulateScanSuccess = () => {
  scanPhase.value = 'scanning';
  setTimeout(() => {
    scanPhase.value = 'success';
    const source = scanSourceLabel.value;
    const sourceId = activeSourceId.value;
    connectedAccounts.value[sourceId] = sourceId === 'dingtalk'
      ? { name: '张经理', email: 'zhangmgr@company.com' }
      : { name: '李总监', email: 'lizj@company.com' };
    remoteFiles.value = (sourceId === 'dingtalk' ? dingtalkRemoteFiles : feishuRemoteFiles).map((f) => ({ ...f }));
    showScanOverlay.value = false;
    scanPhase.value = 'idle';
    formFeedback.value = `${source}授权成功，请勾选要导入的文件。`;
    formFeedbackTone.value = 'success';
  }, 1200);
};

const toggleRemoteFile = (fileId: string) => {
  const file = remoteFiles.value.find((f) => f.id === fileId);
  if (file) file.selected = !file.selected;
};

const toggleAllRemoteFiles = () => {
  const allSelected = remoteFiles.value.every((f) => f.selected);
  remoteFiles.value.forEach((f) => { f.selected = !allSelected; });
};

const submitRemoteImport = () => {
  const selected = remoteFiles.value.filter((f) => f.selected);
  if (selected.length === 0) return;
  const label = activeSourceId.value === 'dingtalk' ? '钉钉' : '飞书';
  formFeedback.value = `已模拟从${label}导入 ${selected.length} 份文件，可进入工作台查看。`;
  formFeedbackTone.value = 'success';
};

const disconnectAccount = () => {
  const sourceId = activeSourceId.value;
  const label = sourceId === 'dingtalk' ? '钉钉' : '飞书';
  connectedAccounts.value[sourceId] = null;
  remoteFiles.value = [];
  formFeedback.value = `已断开${label}账号连接。`;
  formFeedbackTone.value = 'warning';
};

// ─── Workspace Methods ──────────────────────────────────────────────

const openWorkspace = () => {
  router.replace({ name: 'data-advisor', query: { workspace: '1' } });
};

const backToFormPage = () => {
  router.replace({ name: 'data-advisor' });
};

const switchRole = (role: WorkspaceRole) => {
  activeRole.value = role;
  wsFeedbackMessage.value = '';
};

const deleteUploadedFile = (fileId: string) => {
  uploadedFiles.value = uploadedFiles.value.filter((f) => f.id !== fileId);
  wsFeedbackMessage.value = '已删除文件。';
  wsFeedbackTone.value = 'success';
};

const wsHandleLocalUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const typeMap: Record<string, string> = { pdf: 'PDF', doc: 'Word', docx: 'Word', xls: 'Excel', xlsx: 'Excel', ppt: 'PPT', pptx: 'PPT', txt: 'Text', md: 'Markdown' };
    const nextId = `UF-${String(fileSequence).padStart(3, '0')}`;
    fileSequence += 1;
    uploadedFiles.value = [{ id: nextId, name: file.name, source: '本地上传', type: typeMap[ext] ?? ext, size: `${Math.round(file.size / 1024)} KB`, uploadedAt: timeStr, uploader: '当前账号', status: '解析中' }, ...uploadedFiles.value];
  }
  target.value = '';
  wsFeedbackMessage.value = `已上传 ${files.length} 份文件。`;
  wsFeedbackTone.value = 'success';
};

const chatContainerRef = ref<HTMLDivElement | null>(null);
const scrollToBottom = () => { nextTick(() => { if (chatContainerRef.value) chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight; }); };
watch(activeThreadId, () => { scrollToBottom(); });

const selectThread = (threadId: string) => { activeThreadId.value = threadId; };

const sendAdvisorMessage = () => {
  const text = advisorInput.value.trim();
  if (!text || !activeThread.value) return;
  const userMsgId = `MSG-${String(msgSequence).padStart(3, '0')}`;
  msgSequence += 1;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  activeThread.value.messages.push({ id: userMsgId, role: 'user', content: text, timestamp: timeStr });
  advisorInput.value = '';
  scrollToBottom();
  setTimeout(() => {
    if (!activeThread.value) return;
    const advisorMsgId = `MSG-${String(msgSequence).padStart(3, '0')}`;
    msgSequence += 1;
    const replyNow = new Date();
    const replyTimeStr = `${String(replyNow.getHours()).padStart(2, '0')}:${String(replyNow.getMinutes()).padStart(2, '0')}`;
    activeThread.value.messages.push({
      id: advisorMsgId, role: 'advisor', timestamp: replyTimeStr,
      content: `基于已上传的 ${uploadedFiles.value.length} 份文档，针对您的问题进行了分析：\n\n当前为 Demo 环境，以下内容为 Mock 结果。实际系统中，数据顾问会根据员工上传的数据进行智能分析。\n\n• 已检索 ${Math.floor(Math.random() * 20) + 5} 篇相关文档\n• 命中 ${Math.floor(Math.random() * 8) + 3} 个关键片段\n• 分析置信度 ${Math.floor(Math.random() * 15) + 80}%`,
      citations: [
        { source: uploadedFiles.value[0]?.name ?? '相关文档 A', snippet: '匹配到的引用内容片段 1...' },
        { source: uploadedFiles.value[1]?.name ?? '相关文档 B', snippet: '匹配到的引用内容片段 2...' },
      ],
    });
    scrollToBottom();
  }, 600);
};

const usePresetQuestion = (question: string) => { advisorInput.value = question; };

const createNewThread = () => {
  const nextId = `THD-${String(threadSequence).padStart(3, '0')}`;
  threadSequence += 1;
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  threads.value = [{ id: nextId, title: '新对话', createdAt: timeStr, messages: [] }, ...threads.value];
  activeThreadId.value = nextId;
};
</script>

<template>
  <!-- ═══ Scan Code Overlay ═══ -->
  <Teleport to="body">
    <div v-if="showScanOverlay" class="scan-overlay" @click.self="closeScanOverlay">
      <div class="scan-card">
        <button class="scan-close-btn" @click="closeScanOverlay"><X :size="20" /></button>
        <div class="scan-header">
          <h2>{{ scanSourceLabel }}扫码授权</h2>
          <p>授权后将获取{{ scanSourceLabel }}中的知识库和文档资料</p>
        </div>
        <template v-if="scanPhase === 'idle'">
          <div class="qr-area">
            <div class="qr-placeholder"><QrCode :size="56" /></div>
            <p class="qr-hint">使用{{ scanSourceLabel }}APP 扫描二维码</p>
          </div>
          <button type="button" class="scan-test-btn" @click="simulateScanSuccess">模拟扫码成功（Test）</button>
        </template>
        <template v-else-if="scanPhase === 'scanning'">
          <div class="scan-loading"><Loader2 :size="40" class="spin" /><p>正在授权中...</p></div>
        </template>
      </div>
    </div>
  </Teleport>

  <!-- ═══ Workspace Mode ═══ -->
  <div v-if="isWorkspaceMode" class="da-workspace-page">
    <!-- Compact single-line topbar -->
    <header class="ws-topbar">
      <div class="ws-topbar-left">
        <button type="button" class="ghost-btn compact" @click="backToFormPage"><ArrowLeft :size="14" /><span>返回</span></button>
        <h1 class="ws-title">数据顾问工作台</h1>
      </div>
      <div class="role-switcher">
        <button type="button" class="role-pill" :class="{ active: activeRole === 'employee' }" @click="switchRole('employee')">
          <Upload :size="14" /><span>员工视角</span>
        </button>
        <button type="button" class="role-pill" :class="{ active: activeRole === 'boss' }" @click="switchRole('boss')">
          <Sparkles :size="14" /><span>管理者视角</span>
        </button>
      </div>
    </header>

    <!-- Feedback -->
    <div v-if="wsFeedbackMessage" class="feedback-banner" :class="wsFeedbackTone">
      <div class="feedback-title">
        <CheckCircle2 v-if="wsFeedbackTone === 'success'" :size="16" /><AlertTriangle v-else :size="16" />
        <span>{{ wsFeedbackMessage }}</span>
      </div>
    </div>

    <!-- ═══ Employee View ═══ -->
    <template v-if="activeRole === 'employee'">
      <section class="content-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">已上传文件</h2>
            <p class="section-desc">共 {{ uploadedFiles.length }} 份文件</p>
          </div>
          <label class="primary-btn upload-trigger">
            <input type="file" hidden multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md" @change="wsHandleLocalUpload" />
            <Upload :size="14" /><span>上传文件</span>
          </label>
        </div>
        <div class="table-shell">
          <table class="data-table">
            <thead>
              <tr><th>文件名</th><th>来源</th><th>类型</th><th>大小</th><th>上传时间</th><th>状态</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="file in uploadedFiles" :key="file.id">
                <td class="cell-bold"><FileText :size="14" class="inline-icon" />{{ file.name }}</td>
                <td><span class="source-chip" :class="file.source === '本地上传' ? 'local' : file.source === '钉钉' ? 'dingtalk' : 'feishu'">{{ file.source }}</span></td>
                <td class="cell-muted">{{ file.type }}</td>
                <td class="cell-muted">{{ file.size }}</td>
                <td class="cell-nowrap cell-muted">{{ file.uploadedAt }}</td>
                <td><span class="status-pill" :class="file.status === '已解析' ? 'green' : 'orange'">{{ file.status }}</span></td>
                <td class="action-cell">
                  <button type="button" class="row-action warn" @click="deleteUploadedFile(file.id)"><Trash2 :size="12" /><span>删除</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <!-- ═══ Boss View ═══ -->
    <template v-else>
      <div class="workspace-shell">
        <!-- Left: Multi-function panel -->
        <div class="workspace-left">
          <section class="content-card workspace-panel-card">
            <div class="panel-tab-header">
              <div class="panel-tab-row">
                <button v-for="tab in bossSectionTabs" :key="tab.key" type="button" class="panel-tab-btn" :class="{ active: activeBossSection === tab.key }" @click="activeBossSection = tab.key">
                  <component :is="tab.icon" :size="15" /><span>{{ tab.label }}</span>
                </button>
              </div>
              <span class="card-meta">共 {{ fileStats.total }} 份文档 · {{ fileStats.uploaders }} 位员工</span>
            </div>

            <!-- Dashboard tab -->
            <div v-if="activeBossSection === 'dashboard'" class="panel-section-body">
              <div class="dimension-tabs">
                <button v-for="dim in dimensionTabs" :key="dim.key" type="button" class="dimension-tab" :class="{ active: activeDimension === dim.key }" @click="activeDimension = dim.key">
                  {{ dim.label }}
                </button>
              </div>

              <!-- KPI summary row -->
              <div class="kpi-row">
                <div v-for="card in currentDashboardCards" :key="card.label" class="kpi-card">
                  <span class="kpi-label">{{ card.label }}</span>
                  <strong class="kpi-value">{{ card.value }}</strong>
                  <span class="dashboard-change" :class="card.trend">
                    <TrendingUp v-if="card.trend === 'up'" :size="11" />
                    <TrendingDown v-else-if="card.trend === 'down'" :size="11" />
                    {{ card.change }}
                  </span>
                </div>
              </div>

              <!-- Charts area -->
              <div class="charts-area">
                <!-- Bar chart -->
                <div class="chart-card">
                  <h4 class="chart-title">{{ activeDimension === 'revenue' ? '近 6 月营收趋势' : activeDimension === 'customer' ? '各区域客户分布' : activeDimension === 'team' ? '团队目标完成率' : '风险类型分布' }}</h4>
                  <div class="bar-chart">
                    <div v-for="bar in currentBarData" :key="bar.label" class="bar-item">
                      <span class="bar-label">{{ bar.label }}</span>
                      <div class="bar-track">
                        <div class="bar-fill" :style="{ width: bar.pct + '%', background: bar.color }"></div>
                      </div>
                      <span class="bar-value">{{ bar.value }}</span>
                    </div>
                  </div>
                </div>

                <div class="chart-row-2">
                  <!-- Donut chart -->
                  <div class="chart-card chart-half">
                    <h4 class="chart-title">{{ activeDimension === 'revenue' ? '收入结构' : activeDimension === 'customer' ? '客户等级占比' : activeDimension === 'team' ? '任务完成状态' : '风险等级分布' }}</h4>
                    <div class="donut-wrap">
                      <svg class="donut-svg" viewBox="0 0 120 120">
                        <circle v-for="(seg, i) in currentDonutData" :key="i" cx="60" cy="60" r="48" fill="none" :stroke="seg.color" stroke-width="16" :stroke-dasharray="seg.dash" :stroke-dashoffset="seg.offset" stroke-linecap="round" />
                      </svg>
                      <div class="donut-center">
                        <strong>{{ currentDonutCenter.value }}</strong>
                        <span>{{ currentDonutCenter.label }}</span>
                      </div>
                    </div>
                    <div class="donut-legend">
                      <div v-for="seg in currentDonutLegend" :key="seg.label" class="legend-item">
                        <span class="legend-dot" :style="{ background: seg.color }"></span>
                        <span class="legend-label">{{ seg.label }}</span>
                        <span class="legend-value">{{ seg.value }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Mini line chart -->
                  <div class="chart-card chart-half">
                    <h4 class="chart-title">{{ activeDimension === 'revenue' ? '月度回款走势' : activeDimension === 'customer' ? '月度新增客户' : activeDimension === 'team' ? '人均拜访量走势' : '超期应收走势' }}</h4>
                    <div class="line-chart-wrap">
                      <svg class="line-svg" viewBox="0 0 280 100" preserveAspectRatio="none">
                        <polyline :points="currentLinePoints" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        <polyline :points="currentLinePoints" fill="url(#lineGrad)" stroke="none" />
                        <defs>
                          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#2563eb" stop-opacity="0.18" />
                            <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
                          </linearGradient>
                        </defs>
                        <circle v-for="(pt, i) in currentLineDataPoints" :key="i" :cx="pt.x" :cy="pt.y" r="3.5" fill="#2563eb" />
                      </svg>
                      <div class="line-x-labels">
                        <span v-for="lbl in currentLineLabels" :key="lbl">{{ lbl }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Files tab -->
            <div v-else-if="activeBossSection === 'files'" class="panel-section-body">
              <div class="files-toolbar">
                <div class="search-box">
                  <Search :size="15" class="search-icon" />
                  <input v-model="bossFileSearch" type="text" class="search-input" placeholder="搜索文件名..." />
                </div>
                <div class="filter-group">
                  <select v-model="bossFileSourceFilter" class="filter-select">
                    <option value="all">全部来源</option>
                    <option value="local">本地上传</option>
                    <option value="dingtalk">钉钉</option>
                    <option value="feishu">飞书</option>
                  </select>
                  <select v-model="bossFileUploaderFilter" class="filter-select">
                    <option value="all">全部上传人</option>
                    <option v-for="name in uploaderList" :key="name" :value="name">{{ name }}</option>
                  </select>
                </div>
              </div>
              <div class="boss-file-count">
                <span>筛选结果：<strong>{{ filteredBossFiles.length }}</strong> 份文件</span>
              </div>
              <div class="boss-table-shell">
                <table class="data-table">
                  <thead><tr><th>文件名</th><th>上传人</th><th>来源</th><th>时间</th><th>状态</th></tr></thead>
                  <tbody>
                    <tr v-if="filteredBossFiles.length === 0">
                      <td colspan="5" class="empty-cell">没有符合条件的文件</td>
                    </tr>
                    <tr v-for="file in filteredBossFiles" :key="file.id">
                      <td class="cell-bold"><FileText :size="14" class="inline-icon" />{{ file.name }}</td>
                      <td>{{ file.uploader }}</td>
                      <td><span class="source-chip" :class="file.source === '本地上传' ? 'local' : file.source === '钉钉' ? 'dingtalk' : 'feishu'">{{ file.source }}</span></td>
                      <td class="cell-nowrap cell-muted">{{ file.uploadedAt }}</td>
                      <td><span class="status-pill" :class="file.status === '已解析' ? 'green' : 'orange'">{{ file.status }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Trends tab -->
            <div v-else class="panel-section-body">
              <div class="trend-list">
                <div v-for="insight in trendInsights" :key="insight.id" class="trend-card" :class="insight.severity">
                  <div class="trend-head">
                    <span class="trend-severity-dot"></span>
                    <h4 class="trend-title">{{ insight.title }}</h4>
                    <span class="trend-date">{{ insight.date }}</span>
                  </div>
                  <p class="trend-summary">{{ insight.summary }}</p>
                  <div class="trend-source"><ScrollText :size="12" /><span>{{ insight.source }}</span></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right: AI Chat -->
        <aside class="workspace-right">
          <section class="chat-panel">
            <div class="card-header chat-header">
              <div class="card-title-wrap"><Bot :size="18" /><h3>数据顾问</h3></div>
              <span class="card-meta">基于 {{ fileStats.total }} 份文档</span>
            </div>

            <div class="chat-chip-list">
              <button v-for="q in advisorPresetQuestions" :key="q" type="button" class="question-chip" :class="{ active: advisorInput === q }" @click="usePresetQuestion(q)">{{ q }}</button>
            </div>

            <div ref="chatContainerRef" class="chat-thread">
              <template v-if="activeThread && activeThread.messages.length > 0">
                <div v-for="msg in activeThread.messages" :key="msg.id" class="message-card" :class="msg.role === 'user' ? 'user-message' : 'ai-message'">
                  <div class="message-role">{{ msg.role === 'user' ? '你' : '数据顾问' }}</div>
                  <p class="message-text" :class="{ strong: msg.role === 'user' }">{{ msg.content }}</p>
                  <template v-if="msg.citations?.length">
                    <div class="source-label">引用来源</div>
                    <div class="source-list">
                      <div v-for="cite in msg.citations" :key="cite.source" class="source-item">
                        <span class="source-name"><ScrollText :size="12" />{{ cite.source }}</span>
                        <span class="source-snippet">{{ cite.snippet }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else class="chat-empty-state">
                <Database :size="28" />
                <p>选择预设问题或自由提问，AI 将基于员工上传的数据进行分析。</p>
              </div>
            </div>

            <div class="ask-box">
              <div class="chat-thread-tabs">
                <button v-for="thread in threads" :key="thread.id" type="button" class="thread-tab" :class="{ active: activeThreadId === thread.id }" @click="selectThread(thread.id)">
                  {{ thread.title }}
                </button>
                <button type="button" class="thread-tab add-thread" @click="createNewThread"><Plus :size="12" /></button>
              </div>
              <div class="ask-input-shell">
                <textarea v-model="advisorInput" class="question-input" rows="2" placeholder="输入问题，AI 将基于员工上传的数据进行分析..." @keydown.enter.exact.prevent="sendAdvisorMessage"></textarea>
                <button type="button" class="inline-send-btn" :disabled="!advisorInput.trim()" @click="sendAdvisorMessage"><Send :size="16" /></button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </template>
  </div>

  <!-- ═══ Form Entry Page ═══ -->
  <FormPageLayout
    v-else
    :icon="Database"
    title="数据顾问智能体"
    subtitle="接入数据后，在工作台中查看和分析数据"
  >
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

    <div class="da-form-page">
      <section class="content-card ws-entry-card">
        <div>
          <h2 class="section-title">进入工作台</h2>
          <p class="section-desc">员工上传数据、管理者查看分析和 AI 问答。</p>
        </div>
        <button type="button" class="primary-btn ws-entry-btn" @click="openWorkspace()">
          <Sparkles :size="14" /><span>进入工作台</span>
        </button>
      </section>

      <section class="content-card">
        <h2 class="section-title">数据录入</h2>
        <p class="section-desc" style="margin-top: 4px">选择接入方式，上传或导入文件后即可在工作台中使用。</p>

        <div class="source-tabs">
          <button v-for="source in sourceOptions" :key="source.id" type="button" class="source-tab" :class="{ active: activeSourceId === source.id }" @click="switchSource(source.id)">
            <Upload v-if="source.id === 'local'" :size="14" /><QrCode v-else :size="14" />
            <span>{{ source.name }}</span>
          </button>
        </div>

        <!-- Local upload mode -->
        <div v-if="activeSourceId === 'local'" class="local-upload-area">
          <div class="text-area-wrapper">
            <textarea v-model="localDescription" class="text-area" rows="6" placeholder="直接粘贴或输入文本内容，例如：销售周报、会议纪要、客户跟进记录..."></textarea>
            <button type="button" class="save-as-file-btn" :disabled="!localDescription.trim()" @click="saveAsFileAndUpload">
              <FileText :size="14" /><span>存为文件并上传</span>
            </button>
          </div>
          <label class="upload-dropzone">
            <input type="file" hidden multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md" @change="handleLocalUpload" />
            <Upload :size="24" />
            <span class="dropzone-text">点击选择文件，或拖拽到此处</span>
            <span class="dropzone-hint">支持 PDF、Word、Excel、PPT、TXT、Markdown</span>
          </label>
          <div v-if="localFiles.length" class="file-list">
            <div v-for="name in localFiles" :key="name" class="file-tag">
              <FileText :size="14" /><span>{{ name }}</span>
              <button type="button" class="file-remove" @click="removeLocalFile(name)"><X :size="12" /></button>
            </div>
          </div>
          <button type="button" class="primary-btn submit-upload-btn" :disabled="localFiles.length === 0" @click="submitLocalUpload">
            <Upload :size="14" /><span>上传 {{ localFiles.length }} 份文件</span>
          </button>
        </div>

        <!-- DingTalk / Feishu scan mode -->
        <div v-else class="scan-mode-area">
          <div v-if="connectedAccounts[activeSourceId]" class="connected-account-card">
            <div class="connected-account-left">
              <div class="connected-avatar"><CheckCircle2 :size="18" /></div>
              <div class="connected-info">
                <p class="connected-name">{{ connectedAccounts[activeSourceId]!.name }}</p>
                <p class="connected-email">{{ connectedAccounts[activeSourceId]!.email }}</p>
              </div>
              <span class="connected-badge">已连接</span>
            </div>
            <div class="connected-actions">
              <button type="button" class="ghost-btn compact" @click="disconnectAccount"><Unlink :size="14" /><span>断开连接</span></button>
              <button type="button" class="ghost-btn compact" @click="openScanOverlay"><RefreshCw :size="14" /><span>重新授权</span></button>
            </div>
          </div>
          <div v-else class="scan-entry-area">
            <div class="scan-entry-info">
              <QrCode :size="32" class="scan-entry-icon" />
              <div>
                <p class="scan-entry-title">{{ activeSourceId === 'dingtalk' ? '钉钉' : '飞书' }}扫码接入</p>
                <p class="scan-entry-desc">扫码授权后选择要导入的文件</p>
              </div>
            </div>
            <button type="button" class="primary-btn" @click="openScanOverlay"><QrCode :size="14" /><span>扫码授权</span></button>
          </div>
          <div v-if="connectedAccounts[activeSourceId] && remoteFiles.length" class="remote-file-section">
            <div class="remote-file-header">
              <label class="remote-check-all" @click="toggleAllRemoteFiles">
                <input type="checkbox" :checked="remoteFiles.every((f) => f.selected)" />
                <span>全选 ({{ selectedRemoteCount }} / {{ remoteFiles.length }})</span>
              </label>
            </div>
            <div class="remote-file-list">
              <label v-for="file in remoteFiles" :key="file.id" class="remote-file-row" :class="{ selected: file.selected }">
                <input type="checkbox" :checked="file.selected" @change="toggleRemoteFile(file.id)" />
                <FileText :size="16" class="file-icon" />
                <div class="remote-file-info">
                  <span class="remote-file-name">{{ file.name }}</span>
                  <span class="remote-file-meta">{{ file.path }} · {{ file.type }} · {{ file.size }}</span>
                </div>
              </label>
            </div>
            <button type="button" class="primary-btn submit-upload-btn" :disabled="selectedRemoteCount === 0" @click="submitRemoteImport">
              <Upload :size="14" /><span>上传 {{ selectedRemoteCount }} 份文件</span>
            </button>
          </div>
        </div>
      </section>

      <div v-if="formFeedback" class="feedback-banner" :class="formFeedbackTone">
        <div class="feedback-title">
          <CheckCircle2 v-if="formFeedbackTone === 'success'" :size="16" /><AlertTriangle v-else :size="16" />
          <span>{{ formFeedback }}</span>
        </div>
      </div>
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="Database" title="数据顾问智能体" description="选择接入方式上传文件，然后进入工作台使用顾问问答。" :features="infoSidebarFeatures" />
    </template>
  </FormPageLayout>
</template>

<style scoped>
/* ─── Form Page ──────────────────────────────────────────────────── */

.da-form-page { display: flex; flex-direction: column; gap: 18px; padding-bottom: 40px; }

.source-tabs { display: flex; gap: 8px; margin-top: 18px; padding: 4px; background: #f1f5f9; border-radius: 14px; }
.source-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; border: none; border-radius: 11px; background: transparent; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.source-tab.active { background: #ffffff; color: #0f172a; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
.source-tab:not(.active):hover { color: #334155; }

.local-upload-area { display: flex; flex-direction: column; gap: 14px; margin-top: 18px; }

.text-area-wrapper { position: relative; }
.text-area { width: 100%; border: 1px solid #d7e0ea; border-radius: 12px; padding: 14px 16px 42px 16px; font-size: 14px; line-height: 1.7; color: #1e293b; background: #fff; outline: none; resize: vertical; font-family: inherit; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.text-area:focus { border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.14); }
.save-as-file-btn { position: absolute; right: 10px; bottom: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 13px; font-weight: 600; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; }
.save-as-file-btn:hover { background: #dbeafe; border-color: #93c5fd; }
.save-as-file-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.upload-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 36px 20px; border: 2px dashed #cbd5e1; border-radius: 16px; background: #f8fafc; cursor: pointer; transition: all 0.2s ease; color: #94a3b8; }
.upload-dropzone:hover { border-color: #93c5fd; background: #eff6ff; color: #2563eb; }
.dropzone-text { font-size: 14px; font-weight: 600; color: #475569; }
.dropzone-hint { font-size: 12px; color: #94a3b8; }

.file-list { display: flex; flex-wrap: wrap; gap: 8px; }
.file-tag { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; font-size: 13px; color: #334155; }
.file-remove { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border: none; border-radius: 6px; background: transparent; color: #94a3b8; cursor: pointer; transition: all 0.15s ease; }
.file-remove:hover { background: #fee2e2; color: #dc2626; }
.submit-upload-btn { align-self: flex-end; }

.scan-mode-area { display: flex; flex-direction: column; gap: 18px; }
.scan-entry-area { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #f8fafc; }
.scan-entry-info { display: flex; align-items: center; gap: 16px; }
.scan-entry-icon { color: #2563eb; }
.scan-entry-title { margin: 0; font-size: 15px; font-weight: 600; color: #0f172a; }
.scan-entry-desc { margin: 4px 0 0; font-size: 13px; color: #64748b; }

.connected-account-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 20px; border: 1px solid #bbf7d0; border-radius: 14px; background: #f0fdf4; }
.connected-account-left { display: flex; align-items: center; gap: 12px; }
.connected-avatar { width: 36px; height: 36px; border-radius: 10px; background: #dcfce7; display: flex; align-items: center; justify-content: center; color: #16a34a; flex-shrink: 0; }
.connected-info { display: flex; flex-direction: column; gap: 1px; }
.connected-name { margin: 0; font-size: 14px; font-weight: 600; color: #0f172a; }
.connected-email { margin: 0; font-size: 12px; color: #64748b; }
.connected-badge { font-size: 12px; font-weight: 600; color: #16a34a; background: #dcfce7; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
.connected-actions { display: flex; gap: 8px; flex-shrink: 0; }
.remote-file-section { display: flex; flex-direction: column; gap: 12px; }

/* ─── Scan Overlay ───────────────────────────────────────────────── */

.scan-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(4px); }
.scan-card { background: white; border-radius: 20px; padding: 32px; width: 520px; max-width: 90vw; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); position: relative; }
.scan-close-btn { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: none; border: none; border-radius: 8px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.scan-close-btn:hover { background: #f1f5f9; color: #475569; }
.scan-header { margin-bottom: 24px; }
.scan-header h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
.scan-header p { font-size: 14px; color: #64748b; margin: 0; }
.qr-area { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 32px 20px; }
.qr-placeholder { width: 120px; height: 120px; border: 2px dashed #cbd5e1; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #94a3b8; background: #f8fafc; }
.qr-hint { font-size: 14px; color: #64748b; margin: 0; }
.scan-test-btn { width: 100%; padding: 14px; border: 2px dashed #93c5fd; border-radius: 12px; background: #eff6ff; color: #2563eb; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.scan-test-btn:hover { background: #dbeafe; border-color: #60a5fa; }
.scan-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 48px 20px; color: #2563eb; }
.scan-loading p { font-size: 14px; color: #64748b; margin: 0; }
.spin { animation: spin-anim 1s linear infinite; }
@keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.remote-file-header { margin-bottom: 0; }
.remote-check-all { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; }
.remote-check-all input { width: 16px; height: 16px; accent-color: #2563eb; }
.remote-file-list { display: flex; flex-direction: column; gap: 6px; max-height: 320px; overflow-y: auto; }
.remote-file-row { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.15s ease; }
.remote-file-row:hover { background: #f8fafc; }
.remote-file-row.selected { border-color: #93c5fd; background: #eff6ff; }
.remote-file-row input { width: 16px; height: 16px; accent-color: #2563eb; flex-shrink: 0; }
.file-icon { color: #64748b; flex-shrink: 0; }
.remote-file-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.remote-file-name { font-size: 13px; font-weight: 600; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.remote-file-meta { font-size: 11px; color: #94a3b8; }

/* ─── Workspace ──────────────────────────────────────────────────── */

.da-workspace-page { min-height: 100vh; background: #f8fafc; padding: 20px 28px 36px; display: flex; flex-direction: column; gap: 18px; }

.ws-topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 12px 18px; }
.ws-topbar-left { display: flex; align-items: center; gap: 12px; }
.ws-title { margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; }

.role-switcher { display: flex; gap: 4px; padding: 4px; background: #f1f5f9; border-radius: 12px; }
.role-pill { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; border-radius: 9px; background: transparent; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.role-pill.active { background: #ffffff; color: #0f172a; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
.role-pill:not(.active):hover { color: #334155; }

/* ─── Shared Components ──────────────────────────────────────────── */

.ghost-btn, .primary-btn, .row-action { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 12px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s ease; }
.ghost-btn, .row-action { border: 1px solid #dbe4ee; background: #ffffff; color: #334155; padding: 10px 14px; }
.ghost-btn:hover, .row-action:hover { border-color: #93c5fd; background: #eff6ff; color: #2563eb; }
.ghost-btn.compact { padding: 8px 12px; font-size: 12px; }
.row-action { padding: 6px 10px; font-size: 12px; border-radius: 8px; }
.row-action.warn:hover { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
.row-actions { display: flex; gap: 6px; }

.primary-btn { border: none; background: #2563eb; color: #ffffff; padding: 12px 18px; }
.primary-btn:hover { background: #1d4ed8; }
.primary-btn:disabled { background: #94a3b8; cursor: not-allowed; }

.content-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px 22px; }
.ws-entry-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.ws-entry-btn { min-width: 148px; }
.section-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.section-title, .minor-title { margin: 0; color: #0f172a; }
.section-title { font-size: 16px; font-weight: 700; }
.minor-title { font-size: 14px; font-weight: 700; }
.section-desc { font-size: 13px; line-height: 1.7; color: #64748b; margin: 0; }
.field-label { display: inline-flex; font-size: 12px; font-weight: 700; color: #64748b; letter-spacing: 0.02em; }

/* ─── Feedback ───────────────────────────────────────────────────── */

.feedback-banner { padding: 14px 18px; border-radius: 14px; border: 1px solid transparent; }
.feedback-banner.info { background: #eff6ff; border-color: #bfdbfe; }
.feedback-banner.success { background: #f0fdf4; border-color: #bbf7d0; }
.feedback-banner.warning { background: #fff7ed; border-color: #fed7aa; }
.feedback-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }
.feedback-banner.info .feedback-title { color: #1d4ed8; }
.feedback-banner.success .feedback-title { color: #15803d; }
.feedback-banner.warning .feedback-title { color: #c2410c; }

.chip { display: inline-flex; align-items: center; justify-content: center; padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; background: #e2e8f0; color: #475569; }

/* ─── Tables ─────────────────────────────────────────────────────── */

.table-shell { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 16px; }
.section-header + .table-shell { margin-top: 16px; }
.data-table { width: 100%; min-width: 780px; border-collapse: collapse; background: #ffffff; }
.data-table th, .data-table td { padding: 12px 14px; border-bottom: 1px solid #edf2f7; text-align: left; vertical-align: middle; font-size: 13px; }
.data-table th { background: #f8fafc; color: #64748b; font-weight: 700; }
.cell-bold { font-weight: 600; color: #0f172a; display: flex; align-items: center; gap: 8px; }
.cell-nowrap { white-space: nowrap; }
.action-cell { width: 80px; }
.inline-icon { color: #94a3b8; flex-shrink: 0; }
.status-pill { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.status-pill.green { background: #dcfce7; color: #15803d; }
.status-pill.orange { background: #ffedd5; color: #c2410c; }

.upload-trigger { cursor: pointer; }
.upload-trigger input[type="file"] { display: none; }

/* ─── Employee Summary Strip ─────────────────────────────────────── */

.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-title { margin: 0; font-size: 16px; font-weight: 700; color: #0f172a; }
.section-desc { margin: 4px 0 0; font-size: 12px; color: #94a3b8; }

/* ─── Source Chips ───────────────────────────────────────────────── */

.source-chip { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.source-chip.local { background: #eff6ff; color: #2563eb; }
.source-chip.dingtalk { background: #ecfdf5; color: #059669; }
.source-chip.feishu { background: #f5f3ff; color: #7c3aed; }
.cell-muted { color: #94a3b8; }
.data-table tbody tr { transition: background 0.15s ease; }
.data-table tbody tr:hover { background: #f8fafc; }

/* ─── Workspace Shell ────────────────────────────────────────────── */

.workspace-shell { flex: 1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; min-height: 0; }
.workspace-left { display: flex; flex-direction: column; gap: 16px; min-height: 0; overflow-y: auto; padding-right: 4px; }
.workspace-right { min-width: 0; min-height: 0; overflow: hidden; padding-left: 4px; display: flex; }
.workspace-panel-card { display: flex; flex-direction: column; }

.panel-tab-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid #eef2f7; }
.panel-tab-row { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.panel-tab-btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid #d7e0ea; border-radius: 12px; background: white; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.panel-tab-btn:hover { background: #f8fafc; }
.panel-tab-btn.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
.panel-section-body { padding-top: 16px; flex: 1; overflow-y: auto; }

.card-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.card-title-wrap { display: inline-flex; align-items: center; gap: 10px; color: #0f172a; }
.card-title-wrap h3 { margin: 0; font-size: 18px; }
.card-meta { font-size: 12px; color: #94a3b8; }

/* ─── Dashboard ──────────────────────────────────────────────────── */

.dimension-tabs { display: flex; gap: 6px; margin-bottom: 16px; }
.dimension-tab { padding: 7px 14px; border: 1px solid #d7e0ea; border-radius: 999px; background: #fff; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.dimension-tab.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
.dimension-tab:not(.active):hover { background: #f8fafc; }

.dashboard-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.dashboard-card { border: 1px solid #e2e8f0; border-radius: 14px; background: #f8fafc; padding: 16px; transition: border-color 0.2s ease; }
.dashboard-card:hover { border-color: #cbd5e1; }
.dashboard-label { font-size: 12px; font-weight: 600; color: #64748b; }
.dashboard-value-row { display: flex; align-items: baseline; gap: 10px; margin-top: 8px; }
.dashboard-value { font-size: 22px; font-weight: 800; color: #0f172a; }
.dashboard-change { display: inline-flex; align-items: center; gap: 3px; font-size: 12px; font-weight: 700; border-radius: 6px; padding: 2px 6px; }
.dashboard-change.up { color: #15803d; background: #dcfce7; }
.dashboard-change.down { color: #dc2626; background: #fee2e2; }
.dashboard-change.flat { color: #64748b; background: #f1f5f9; }
.dashboard-detail { margin: 8px 0 0; font-size: 12px; color: #94a3b8; line-height: 1.6; }

/* ─── KPI Row ────────────────────────────────────────────────────── */

.kpi-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 16px; }
.kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
.kpi-label { font-size: 11px; font-weight: 600; color: #94a3b8; }
.kpi-value { font-size: 18px; font-weight: 800; color: #0f172a; }

/* ─── Charts ─────────────────────────────────────────────────────── */

.charts-area { display: flex; flex-direction: column; gap: 14px; }
.chart-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; }
.chart-title { margin: 0 0 14px; font-size: 13px; font-weight: 700; color: #334155; }
.chart-row-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.chart-half { min-height: 0; }

/* Bar chart */
.bar-chart { display: flex; flex-direction: column; gap: 10px; }
.bar-item { display: grid; grid-template-columns: 48px 1fr 56px; align-items: center; gap: 10px; }
.bar-label { font-size: 12px; font-weight: 600; color: #475569; text-align: right; }
.bar-track { height: 20px; background: #e2e8f0; border-radius: 6px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6px; transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.bar-value { font-size: 12px; font-weight: 700; color: #0f172a; }

/* Donut chart */
.donut-wrap { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 12px; }
.donut-svg { width: 120px; height: 120px; transform: rotate(-90deg); }
.donut-center { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.donut-center strong { font-size: 16px; font-weight: 800; color: #0f172a; }
.donut-center span { font-size: 11px; color: #94a3b8; }
.donut-legend { display: flex; flex-wrap: wrap; gap: 6px 12px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.legend-label { color: #64748b; }
.legend-value { font-weight: 700; color: #0f172a; }

/* Line chart */
.line-chart-wrap { position: relative; }
.line-svg { width: 100%; height: 100px; }
.line-x-labels { display: flex; justify-content: space-between; padding: 6px 20px 0; }
.line-x-labels span { font-size: 11px; color: #94a3b8; }

/* ─── Boss Files Table ───────────────────────────────────────────── */

.files-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.search-box { position: relative; flex: 1; min-width: 180px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
.search-input { width: 100%; border: 1px solid #d7e0ea; border-radius: 10px; padding: 9px 12px 9px 36px; font-size: 13px; color: #1e293b; background: #fff; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.search-input:focus { border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.14); }
.filter-group { display: flex; gap: 8px; }
.filter-select { border: 1px solid #d7e0ea; border-radius: 10px; padding: 9px 12px; font-size: 13px; color: #475569; background: #fff; outline: none; cursor: pointer; transition: border-color 0.2s ease; appearance: auto; }
.filter-select:focus { border-color: #60a5fa; }
.boss-file-count { font-size: 12px; color: #94a3b8; margin-bottom: 8px; }
.boss-file-count strong { color: #0f172a; }
.empty-cell { text-align: center; color: #94a3b8; padding: 32px 16px !important; font-size: 13px; }
.boss-table-shell { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 14px; }

/* ─── Trend Insights ─────────────────────────────────────────────── */

.trend-list { display: flex; flex-direction: column; gap: 12px; }
.trend-card { border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; transition: border-color 0.2s ease; }
.trend-card:hover { border-color: #cbd5e1; }
.trend-card.positive { border-left: 3px solid #22c55e; }
.trend-card.warning { border-left: 3px solid #f59e0b; }
.trend-card.neutral { border-left: 3px solid #94a3b8; }
.trend-head { display: flex; align-items: center; gap: 8px; }
.trend-severity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.trend-card.positive .trend-severity-dot { background: #22c55e; }
.trend-card.warning .trend-severity-dot { background: #f59e0b; }
.trend-card.neutral .trend-severity-dot { background: #94a3b8; }
.trend-title { flex: 1; margin: 0; font-size: 14px; font-weight: 700; color: #0f172a; }
.trend-date { font-size: 12px; color: #94a3b8; white-space: nowrap; }
.trend-summary { margin: 10px 0 0; font-size: 13px; line-height: 1.8; color: #475569; }
.trend-source { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 12px; color: #2563eb; font-weight: 600; }

/* ─── Chat Panel ─────────────────────────────────────────────────── */

.chat-panel { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px; }

.chat-chip-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.question-chip { padding: 7px 12px; border: 1px solid #dbe4ee; border-radius: 999px; background: #f8fafc; color: #475569; font-size: 12px; cursor: pointer; transition: all 0.2s ease; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.question-chip:hover { border-color: #93c5fd; background: #eff6ff; color: #2563eb; }
.question-chip.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }

.chat-thread { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding: 4px 0; }
.message-card { padding: 14px 16px; border-radius: 14px; }
.user-message { background: #eff6ff; border: 1px solid #dbeafe; }
.ai-message { background: #f8fafc; border: 1px solid #e2e8f0; }
.message-role { font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px; }
.message-text { margin: 0; font-size: 13px; line-height: 1.8; color: #334155; white-space: pre-line; }
.message-text.strong { font-weight: 600; color: #0f172a; }
.source-label { font-size: 12px; font-weight: 700; color: #64748b; margin-top: 12px; margin-bottom: 6px; }
.source-list { display: flex; flex-direction: column; gap: 6px; }
.source-item { padding: 8px 10px; background: #ffffff; border: 1px solid #edf2f7; border-radius: 10px; }
.source-name { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #2563eb; }
.source-snippet { display: block; margin-top: 4px; font-size: 12px; color: #94a3b8; line-height: 1.5; }

.chat-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 12px; color: #cbd5e1; text-align: center; padding: 40px 16px; }
.chat-empty-state p { font-size: 13px; color: #94a3b8; margin: 0; max-width: 260px; }

.ask-box { border-top: 1px solid #edf2f7; padding-top: 12px; margin-top: auto; }
.chat-thread-tabs { display: flex; gap: 6px; margin-bottom: 10px; overflow-x: auto; }
.thread-tab { padding: 5px 12px; border: 1px solid #e2e8f0; border-radius: 999px; background: #f8fafc; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
.thread-tab.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
.thread-tab:not(.active):hover { background: #f1f5f9; }
.thread-tab.add-thread { padding: 5px 8px; color: #94a3b8; }
.thread-tab.add-thread:hover { color: #2563eb; background: #eff6ff; border-color: #93c5fd; }
.ask-input-shell { position: relative; }
.question-input { width: 100%; border: 1px solid #d7e0ea; border-radius: 14px; padding: 12px 52px 12px 16px; font-size: 14px; color: #1e293b; background: #fff; outline: none; resize: none; font-family: inherit; line-height: 1.6; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.question-input:focus { border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.14); }
.inline-send-btn { position: absolute; right: 8px; bottom: 8px; width: 36px; height: 36px; border-radius: 10px; border: none; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s ease; }
.inline-send-btn:hover { background: #1d4ed8; }
.inline-send-btn:disabled { background: #cbd5e1; cursor: not-allowed; }

/* ─── Responsive ─────────────────────────────────────────────────── */

@media (max-width: 1180px) { .workspace-shell { grid-template-columns: 1fr; } .workspace-left, .workspace-right { padding: 0; } .workspace-right { min-height: 500px; } }
@media (max-width: 900px) { .da-workspace-page { padding: 16px; } .ws-topbar { flex-direction: column; align-items: stretch; } .ws-topbar-left { flex-direction: column; } .kpi-row { grid-template-columns: repeat(2, minmax(0, 1fr)); } .chart-row-2 { grid-template-columns: 1fr; } }
</style>
