<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  FileText,
  MessageSquare,
  ScrollText,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { FormPageLayout, InfoSidebar, TemplateSidebar } from '../shared';
import FileItem from '../enterprise-material/components/FileItem.vue';
import type { SourceFile } from '../enterprise-material/types';
import { businessModuleToolList } from './moduleCatalog';

type WorkspaceSection = 'materials' | 'policy' | 'ops';
type PolicyEditMode = 'reply' | 'handoff' | 'preview';

interface KnowledgeDocument {
  id: string;
  title: string;
  type: string;
  status: string;
  size: string;
  words: string;
  creator: string;
  summary: string;
  tags: string[];
}

interface ConversationScenario {
  id: string;
  title: string;
  question: string;
  answer: string;
  sources: string[];
  resolution: string;
}

interface PerformanceCard {
  label: string;
  value: string;
  detail: string;
}

interface ConfigField {
  label: string;
  value: string;
}

interface AccessMethod {
  id: string;
  title: string;
  summary: string;
  status: string;
  description: string;
  config: ConfigField[];
}

interface HandoffMechanism {
  strategy: string[];
  config: ConfigField[];
  previewMessage: string;
  timeoutFallback: string;
}

interface CustomerServiceAgent {
  id: string;
  tenantName: string;
  agentName: string;
  category: string;
  summary: string;
  tone: string;
  syncTime: string;
  channelCount: number;
  knowledgeCount: number;
  pendingGapCount: number;
  handoffRate: string;
  serviceChannels: string[];
  coverageTags: string[];
  replyPrinciples: string[];
  handoffRules: string[];
  accessMethods: AccessMethod[];
  handoffMechanism: HandoffMechanism;
  watchPoints: string[];
  documents: KnowledgeDocument[];
  scenarios: ConversationScenario[];
  performanceCards: PerformanceCard[];
}

const route = useRoute();
const router = useRouter();

const workspaceSections = [
  { key: 'materials' as WorkspaceSection, label: '客服知识库', icon: Upload },
  { key: 'policy' as WorkspaceSection, label: '配置', icon: ShieldCheck },
  { key: 'ops' as WorkspaceSection, label: '运营观察', icon: ScrollText },
];

const customerAgents = ref<CustomerServiceAgent[]>([
  {
    id: 'pre-sales-reception',
    tenantName: '华北医疗器械事业部',
    agentName: '售前咨询接待智能体',
    category: '线索初筛 / 产品介绍 / 资料留资',
    summary: '负责承接官网、企业微信和落地页咨询，先完成基础答疑，再判断是否需要转销售跟进。',
    tone: '专业、耐心、主动追问',
    syncTime: '今天 09:20',
    channelCount: 3,
    knowledgeCount: 12,
    pendingGapCount: 2,
    handoffRate: '18%',
    serviceChannels: ['官网咨询窗口', '企业微信客服', '活动落地页'],
    coverageTags: ['产品目录', '型号差异', '采购流程', '试用申请'],
    replyPrinciples: [
      '优先回答产品能力、适用场景和交付流程，不直接承诺价格和排期。',
      '遇到行业资质、招投标要求等问题时，需先引用资料再给结论。',
      '当用户表达采购意向时，要追问应用科室、预算范围和采购时间。',
    ],
    handoffRules: [
      '用户明确索要报价、合同模板或实施计划时，转交销售。',
      '连续两轮无法命中资料时，提示当前知识边界并建议人工接待。',
      '涉及医疗合规、注册证编号等敏感信息时，仅展示资料出处，不自行扩写。',
    ],
    accessMethods: [
      {
        id: 'h5-link',
        title: 'H5 链接',
        summary: '可嵌入微信公众号菜单或自定义页面，用户点击即可发起对话。',
        status: '已启用',
        description: '适合官网咨询入口、公众号菜单和活动落地页，重点演示“点击即聊 + 留资 + 转销售”。',
        config: [
          { label: '嵌入位置', value: '微信公众号菜单 / 活动页浮窗' },
          { label: '入口文案', value: '咨询产品方案 / 立即对话' },
          { label: '首屏动作', value: '展示欢迎语并主动追问科室与采购时间' },
          { label: '演示链接', value: 'https://demo.yongjian.ai/service/h5/pre-sales' },
        ],
      },
      {
        id: 'wechat-qrcode',
        title: '企业微信客服二维码',
        summary: '接入企业微信客服系统，用户扫码后在微信内直接聊天。',
        status: '待联调',
        description: '逻辑参考 openclaw 配置模式，当前展示客服账号、二维码承接范围与接管关系。',
        config: [
          { label: '接入账号', value: '企业微信客服-售前咨询组' },
          { label: '承接方式', value: '扫码进入微信会话，自动绑定售前 Bot' },
          { label: '二维码状态', value: '已生成演示码，待真实渠道联调' },
          { label: '接管坐席', value: '销售顾问 / 产品顾问共用接管池' },
        ],
      },
    ],
    handoffMechanism: {
      strategy: [
        '用户情绪激动、出现投诉纠纷类关键词时立即触发转人工。',
        '问题超出知识库范围且 AI 连续 2 次无法有效作答时触发转人工。',
        '用户主动要求转人工、联系客服或索要顾问联系方式时优先接管。',
        '出现大单、批量采购、招标计划等高价值意向时优先转交销售顾问。',
      ],
      config: [
        { label: '默认策略', value: '官方默认 + 企业自定义规则叠加生效' },
        { label: '通知方式', value: '企业微信通知 + 内部消息推送对话链接' },
        { label: '等待时长', value: '5 分钟未接入则进入超时兜底流程' },
        { label: '顾问联系人', value: '王宁 / 售前顾问 / 138****8899' },
        { label: '历史上下文', value: '真人接手后可查看完整历史会话与来源资料' },
      ],
      previewMessage: '正在为您转接专属顾问，请稍候...',
      timeoutFallback: '若真人客服超时未接入，则提示用户稍后联系并继续由 AI 辅助答疑或引导留联系方式。',
    },
    watchPoints: [
      '当前仍缺 2 份最新型号参数表，容易影响规格类问答。',
      '活动落地页场景下，用户更关注试用和演示安排，应增加快捷入口。',
      '需要把“留资成功后 10 分钟内跟进”作为演示流程的一部分。',
    ],
    documents: [
      {
        id: 'pre-sales-doc-1',
        title: '2026 医疗影像产品目录.pdf',
        type: '产品资料',
        status: '已入库',
        size: '9.36MB',
        words: '15.78万字',
        creator: '亚光',
        summary: '覆盖主力机型、临床场景、配置差异和标准交付范围。',
        tags: ['型号参数', '场景说明'],
      },
      {
        id: 'pre-sales-doc-2',
        title: '售前常见问题 FAQ.docx',
        type: 'FAQ',
        status: '已入库',
        size: '212.26KB',
        words: '0.13万字',
        creator: '包子-运营',
        summary: '包含试用申请、售后响应、采购流程和演示安排等标准问答。',
        tags: ['FAQ', '留资话术'],
      },
      {
        id: 'pre-sales-doc-3',
        title: '注册证与资质清单.xlsx',
        type: '资质材料',
        status: '待补充',
        size: '373.79KB',
        words: '0.43万字',
        creator: '包子-运营',
        summary: '缺少 1 个新型号注册证说明，适合作为知识缺口提示。',
        tags: ['资质证书', '知识缺口'],
      },
      {
        id: 'pre-sales-doc-4',
        title: '标准采购流程说明.pdf',
        type: '采购资料',
        status: '已入库',
        size: '641.66KB',
        words: '0.65万字',
        creator: '包子-运营',
        summary: '包含试用申请、商务审批、采购节点和项目启动前准备事项。',
        tags: ['采购流程', '试用申请'],
      },
      {
        id: 'pre-sales-doc-5',
        title: '典型医院科室适配建议.docx',
        type: '场景资料',
        status: '已入库',
        size: '152.20KB',
        words: '0.39万字',
        creator: '亚光',
        summary: '按影像科、门诊、体检中心等场景整理推荐机型与部署建议。',
        tags: ['科室场景', '选型建议'],
      },
      {
        id: 'pre-sales-doc-6',
        title: '演示申请与留资话术模板.docx',
        type: '运营话术',
        status: '已入库',
        size: '98.40KB',
        words: '0.22万字',
        creator: '增长运营',
        summary: '用于官网咨询和企业微信客服场景，规范首轮留资与转交话术。',
        tags: ['留资话术', '转交模板'],
      },
      {
        id: 'pre-sales-doc-7',
        title: '安装环境与实施前置检查表.xlsx',
        type: '实施资料',
        status: '已入库',
        size: '284.18KB',
        words: '0.18万字',
        creator: '实施支持',
        summary: '说明现场部署前所需网络、机房、电力和权限准备项。',
        tags: ['实施前置', '部署环境'],
      },
    ],
    scenarios: [
      {
        id: 'pre-sales-scene-1',
        title: '产品差异咨询',
        question: '你们基础版和旗舰版在适用场景上有什么差别？如果我们是三甲医院影像科，应该先看哪一款？',
        answer:
          '当前建议先看旗舰版。根据产品目录，旗舰版更适合三甲医院影像科的高频检查场景，支持更高并发和更完整的扩展模块；基础版更适合门诊和常规筛查。若你们近期有采购计划，我可以继续帮你整理适用机型并转交销售跟进。',
        sources: ['2026 医疗影像产品目录.pdf / 型号差异页', '售前常见问题 FAQ.docx / 适用场景问答'],
        resolution: '继续回答，并追问采购时间和科室规模。',
      },
      {
        id: 'pre-sales-scene-2',
        title: '报价与采购咨询',
        question: '如果我们下个月招标，能不能先给我一份报价区间和实施周期？',
        answer:
          '当前知识库可以先说明标准采购流程和实施准备项，但报价区间与实施周期需要结合配置范围、采购方式和交付地点确认。建议由销售顾问继续跟进，我已准备好将当前会话和所需资料一并转交。',
        sources: ['售前常见问题 FAQ.docx / 采购流程', '2026 医疗影像产品目录.pdf / 标准交付范围'],
        resolution: '建议转销售，并带出当前已收集的采购线索。',
      },
    ],
    performanceCards: [
      { label: '今日接待会话', value: '36', detail: '官网 18 / 企业微信 12 / 落地页 6' },
      { label: '资料命中率', value: '82%', detail: '产品参数类问题命中最好，资质类仍有空档' },
      { label: '留资转人工', value: '11', detail: '其中 6 条为明确采购机会' },
    ],
  },
  {
    id: 'solution-recommendation',
    tenantName: '企业服务解决方案中心',
    agentName: '方案推荐智能体',
    category: '需求澄清 / 方案匹配 / 案例推荐',
    summary: '负责把客户问题拆成场景需求、推荐对应方案包，并辅助销售输出首轮建议书框架。',
    tone: '顾问式、结构化、主动收敛',
    syncTime: '今天 08:55',
    channelCount: 2,
    knowledgeCount: 9,
    pendingGapCount: 1,
    handoffRate: '24%',
    serviceChannels: ['官网方案咨询', '内部销售工作台'],
    coverageTags: ['行业方案', '案例推荐', '实施范围', '功能组合'],
    replyPrinciples: [
      '先确认客户所属行业、团队规模和当前系统现状，再推荐方案。',
      '回复中必须把“标准能力”和“可扩展能力”分开展示，避免过度承诺。',
      '案例推荐只引用现有案例库，不用泛化语言替代具体案例。',
    ],
    handoffRules: [
      '涉及正式方案书、POC 节点或跨系统集成时，转交方案顾问。',
      '客户提出定制开发诉求时，要先记录需求点，再提示人工介入。',
      '如果现有案例无法覆盖客户行业，直接提示当前案例库边界。',
    ],
    accessMethods: [
      {
        id: 'h5-link',
        title: 'H5 链接',
        summary: '可嵌入公众号菜单或行业活动页面，用户点击后进入方案咨询。',
        status: '已启用',
        description: '适合营销活动和官网方案页，先收集行业、规模和系统现状，再进入推荐问答。',
        config: [
          { label: '嵌入位置', value: '官网方案页 / 行业专题页' },
          { label: '入口文案', value: '获取方案建议 / 立即咨询' },
          { label: '首轮追问', value: '优先确认行业、团队规模和现有系统现状' },
          { label: '演示链接', value: 'https://demo.yongjian.ai/service/h5/solution' },
        ],
      },
      {
        id: 'wechat-qrcode',
        title: '企业微信客服二维码',
        summary: '用户扫码后在微信内发起方案咨询，适合销售和方案联合承接。',
        status: '演示中',
        description: '当前用二维码接入模式模拟 openclaw 的“配置账号 -> 生成码 -> 接入客服池”流程。',
        config: [
          { label: '接入账号', value: '企业微信客服-方案咨询组' },
          { label: '承接方式', value: '扫码后进入微信内咨询会话' },
          { label: '二维码状态', value: '已生成演示码，支持渠道预演' },
          { label: '接管坐席', value: '方案顾问 / 销售联动接管' },
        ],
      },
    ],
    handoffMechanism: {
      strategy: [
        '正式方案书、POC、集成诉求等高复杂度问题直接转交方案顾问。',
        '当客户行业与案例库覆盖不匹配时，明确边界后触发人工接管。',
        '客户表达明确采购窗口或多部门联合评估需求时优先转交顾问。',
      ],
      config: [
        { label: '默认策略', value: '先 AI 需求澄清，再按复杂度进入人工接管' },
        { label: '通知方式', value: '企业微信群通知 + 内部工作台提醒' },
        { label: '等待时长', value: '3 分钟未接管则提示留联系方式' },
        { label: '顾问联系人', value: '刘珂 / 方案顾问 / 139****6601' },
        { label: '历史上下文', value: '自动附带需求摘要、推荐方案与案例引用' },
      ],
      previewMessage: '正在为您转接方案顾问，请稍候...',
      timeoutFallback: '若顾问超时未接入，则继续由 AI 记录需求摘要，并提示用户留下行业、规模和联系方式。',
    },
    watchPoints: [
      '当前零售行业案例偏少，推荐场景容易重复。',
      '案例引用应优先展示“客户规模 + 上线结果”，避免只列标题。',
      '建议在工作台补一个“已收集需求摘要”卡片，便于继续流转。',
    ],
    documents: [
      {
        id: 'solution-doc-1',
        title: '行业方案包总览.pptx',
        type: '方案资料',
        status: '已入库',
        size: '641.66KB',
        words: '0.65万字',
        creator: '方案组',
        summary: '整理医疗、制造、零售三类行业的标准方案包和差异项。',
        tags: ['行业方案', '标准能力'],
      },
      {
        id: 'solution-doc-2',
        title: '标杆案例库.docx',
        type: '案例库',
        status: '已入库',
        size: '30.31MB',
        words: '4.91万字',
        creator: '方案组',
        summary: '按行业和客户规模拆分案例，含上线结果与可引用描述。',
        tags: ['客户案例', '上线结果'],
      },
      {
        id: 'solution-doc-3',
        title: '实施边界说明.xlsx',
        type: '实施说明',
        status: '已入库',
        size: '152.20KB',
        words: '0.39万字',
        creator: 'sinder',
        summary: '约束标准交付范围、排期影响因素与跨系统集成边界。',
        tags: ['实施范围', '边界说明'],
      },
      {
        id: 'solution-doc-4',
        title: '需求澄清问卷模板.docx',
        type: '需求模板',
        status: '已入库',
        size: '284.18KB',
        words: '0.18万字',
        creator: '方案组',
        summary: '用于收集行业背景、团队规模、现有系统和上线周期等前置信息。',
        tags: ['需求澄清', '问卷模板'],
      },
      {
        id: 'solution-doc-5',
        title: '零售行业重点案例补充.pdf',
        type: '案例库',
        status: '待补充',
        size: '1.24MB',
        words: '0.52万字',
        creator: '方案组',
        summary: '当前仅补充 2 个重点案例，仍不足以覆盖全部零售子场景。',
        tags: ['零售案例', '知识缺口'],
      },
    ],
    scenarios: [
      {
        id: 'solution-scene-1',
        title: '行业方案匹配',
        question: '我们是连锁零售企业，想做总部和门店协同管理，现在哪个方案包更适合？',
        answer:
          '当前更建议先看“零售连锁协同方案包”。该方案包覆盖总部审批、门店执行和经营看板三段能力，适合先从总部到门店的流程协同切入。因为你们属于连锁零售，我还建议补充门店数量、现有系统和上线周期，这样可以继续收敛推荐范围。',
        sources: ['行业方案包总览.pptx / 零售方案页', '实施边界说明.xlsx / 标准实施范围'],
        resolution: '继续追问门店规模和系统现状。',
      },
      {
        id: 'solution-scene-2',
        title: '定制需求识别',
        question: '我们还想把你们系统和现有 ERP 做深度打通，这部分能不能一并做？',
        answer:
          '现有资料中只覆盖标准集成边界，深度对接 ERP 需要由方案顾问进一步评估接口范围、主数据同步方式和实施排期。我可以先把当前需求摘要整理好，再转交人工继续推进。',
        sources: ['实施边界说明.xlsx / 跨系统集成说明'],
        resolution: '建议转方案顾问，并附带集成诉求摘要。',
      },
    ],
    performanceCards: [
      { label: '今日方案咨询', value: '19', detail: '其中 7 条进入继续跟进状态' },
      { label: '案例引用率', value: '76%', detail: '零售行业案例相对不足' },
      { label: '方案顾问转交', value: '5', detail: '主要集中在集成和定制需求' },
    ],
  },
  {
    id: 'pricing-support',
    tenantName: '企业版商业化团队',
    agentName: '报价答疑智能体',
    category: '套餐说明 / 报价范围 / 商务澄清',
    summary: '用于解释套餐差异、商务条款和试算逻辑，帮助客户在询价阶段快速理解边界。',
    tone: '清晰、克制、边界明确',
    syncTime: '今天 10:05',
    channelCount: 2,
    knowledgeCount: 8,
    pendingGapCount: 1,
    handoffRate: '31%',
    serviceChannels: ['商务咨询表单', '销售内测工作台'],
    coverageTags: ['套餐差异', '计费方式', '折扣边界', '合同流程'],
    replyPrinciples: [
      '只解释套餐和计费规则，不直接生成正式报价单。',
      '涉及折扣、特殊条款或合同红线时，必须建议人工确认。',
      '回复中需要明确“可公开解释”和“需商务确认”的边界。',
    ],
    handoffRules: [
      '客户要求明确折扣或最终成交价时，直接转商务。',
      '当采购条款涉及付款方式、违约责任等合同内容时，提示商务和法务介入。',
      '如果客户同时问到实施资源和付款条件，优先进入人工跟进。',
    ],
    accessMethods: [
      {
        id: 'h5-link',
        title: 'H5 链接',
        summary: '嵌入商务咨询页面或报价落地页，用户可直接发起套餐与报价问答。',
        status: '已启用',
        description: '适合报价前澄清和套餐差异说明，帮助客户快速了解公开可答范围。',
        config: [
          { label: '嵌入位置', value: '商务咨询页 / 套餐对比页' },
          { label: '入口文案', value: '咨询套餐差异 / 获取报价说明' },
          { label: '首轮边界', value: '优先说明公开口径，折扣与合同条款需人工确认' },
          { label: '演示链接', value: 'https://demo.yongjian.ai/service/h5/pricing' },
        ],
      },
      {
        id: 'wechat-qrcode',
        title: '企业微信客服二维码',
        summary: '接入企业微信客服系统，用户扫码后可在微信内直接咨询套餐和商务问题。',
        status: '待联调',
        description: '当前展示二维码承接配置、商务客服池和规则预览，逻辑参考 openclaw 模式。',
        config: [
          { label: '接入账号', value: '企业微信客服-商务咨询组' },
          { label: '承接方式', value: '扫码进入微信会话，自动绑定商务 Bot' },
          { label: '二维码状态', value: '已生成预览图，待正式渠道开通' },
          { label: '接管坐席', value: '商务顾问 / 法务协同' },
        ],
      },
    ],
    handoffMechanism: {
      strategy: [
        '客户询问明确折扣、最终成交价或特殊条款时立刻转商务。',
        '涉及付款方式、合同条款和法务边界时转交商务与法务协同处理。',
        '客户同时询问实施资源、付款计划和排期时优先进入人工跟进。',
      ],
      config: [
        { label: '默认策略', value: '公开口径由 AI 回答，价格与合同边界由人工承接' },
        { label: '通知方式', value: '企业微信客服通知 + 商务待办提醒' },
        { label: '等待时长', value: '5 分钟未接入则提示用户稍后由顾问联系' },
        { label: '顾问联系人', value: '沈婷 / 商务顾问 / 137****5521' },
        { label: '历史上下文', value: '自动附带套餐差异、用户问题和已引用资料' },
      ],
      previewMessage: '正在为您转接商务顾问，请稍候...',
      timeoutFallback: '若商务顾问未及时接入，则提示用户留下联系方式，并继续由 AI 提供公开范围内的套餐说明。',
    },
    watchPoints: [
      '当前套餐对比页需要补“适合团队规模”的说明，便于快速理解。',
      '合同流程说明适合放在单独卡片，避免与价格信息混在一起。',
      '建议增加“不能回答的内容”固定提示，防止演示时越界。',
    ],
    documents: [
      {
        id: 'pricing-doc-1',
        title: '企业版套餐说明.pdf',
        type: '商务资料',
        status: '已入库',
        size: '1.79MB',
        words: '0.85万字',
        creator: '商务组',
        summary: '包含基础版、专业版、旗舰版的能力范围和计费口径。',
        tags: ['套餐说明', '计费口径'],
      },
      {
        id: 'pricing-doc-2',
        title: '商务 FAQ.docx',
        type: 'FAQ',
        status: '已入库',
        size: '7.25MB',
        words: '6.54万字',
        creator: '商务组',
        summary: '说明试用、报价流程、折扣审批与合同签约流程。',
        tags: ['报价流程', '合同流程'],
      },
      {
        id: 'pricing-doc-3',
        title: '特殊条款说明.xlsx',
        type: '风险边界',
        status: '待补充',
        size: '206.51KB',
        words: '1.69万字',
        creator: '法务协同',
        summary: '当前还缺部分海外付款条款，适合展示边界提醒。',
        tags: ['商务边界', '知识缺口'],
      },
      {
        id: 'pricing-doc-4',
        title: '报价流程与审批节点.pdf',
        type: '商务资料',
        status: '已入库',
        size: '486.20KB',
        words: '0.31万字',
        creator: '商务组',
        summary: '说明询价、报价、折扣审批和合同签约的标准演示流程。',
        tags: ['报价流程', '审批节点'],
      },
      {
        id: 'pricing-doc-5',
        title: '套餐适配团队规模说明.docx',
        type: '选型资料',
        status: '已入库',
        size: '168.42KB',
        words: '0.27万字',
        creator: '商业化运营',
        summary: '帮助解释不同套餐适合的组织规模、权限复杂度和集成需求。',
        tags: ['套餐差异', '团队规模'],
      },
    ],
    scenarios: [
      {
        id: 'pricing-scene-1',
        title: '套餐差异说明',
        question: '你们专业版和旗舰版主要差在哪？如果我们是 300 人团队，通常怎么选？',
        answer:
          '根据套餐说明，旗舰版在权限治理、扩展能力和多团队协同上更完整，专业版更适合标准业务场景。若你们是 300 人团队，一般会优先对比多团队管理、接口能力和审批复杂度，再决定是否进入旗舰版评估。',
        sources: ['企业版套餐说明.pdf / 套餐差异页', '商务 FAQ.docx / 选型建议'],
        resolution: '继续回答，并引导确认团队结构和集成需求。',
      },
      {
        id: 'pricing-scene-2',
        title: '折扣边界咨询',
        question: '如果我们一次买三年，最低能给到多少折扣？',
        answer:
          '当前知识库只说明标准报价流程和折扣审批机制，具体折扣需要结合采购周期、合同范围和审批策略由商务同事确认。我可以先整理需求并转交商务继续跟进。',
        sources: ['商务 FAQ.docx / 折扣审批流程'],
        resolution: '建议转商务，不在智能体内直接承诺折扣。',
      },
    ],
    performanceCards: [
      { label: '今日询价会话', value: '14', detail: '其中 4 条进入正式报价流程' },
      { label: '边界提醒触发', value: '6', detail: '主要涉及折扣、付款和合同条款' },
      { label: '商务接管率', value: '31%', detail: '适合展示规则驱动的转交逻辑' },
    ],
  },
]);

const activeSection = ref<WorkspaceSection>('materials');
const feedbackMessage = ref('当前页面全部为 Demo 交互，智能体、资料、会话和转人工规则均为 Mock。');
const activeScenarioId = ref('');
const selectedDocumentId = ref('');
const showUploadModal = ref(false);
const showPolicyEditModal = ref(false);
const isDragOver = ref(false);
const questionInput = ref('');
const customQuestion = ref('');
const customAnswer = ref('');
const customSources = ref<string[]>([]);
const policyEditMode = ref<PolicyEditMode>('reply');
const policyEditInput = ref('');
const uploadedFilesByAgent = ref<Record<string, string[]>>({});

const recentTools = computed(() => {
  return [
    {
      icon: MessageSquare,
      label: '咨询客服智能体',
      route: 'customer-service',
      active: true,
    },
    ...businessModuleToolList.filter((tool) => tool.route !== 'customer-service'),
  ];
});

const selectedAgentId = computed(() => {
  const agentId = route.query.agent;
  return typeof agentId === 'string' ? agentId : null;
});

const currentAgent = computed(() => {
  return customerAgents.value.find((item) => item.id === selectedAgentId.value) ?? null;
});

const currentHandoffMechanism = computed<HandoffMechanism>(() => {
  return (
    currentAgent.value?.handoffMechanism ?? {
      strategy: [],
      config: [],
      previewMessage: '',
      timeoutFallback: '',
    }
  );
});

const activeScenario = computed(() => {
  return currentAgent.value?.scenarios.find((item) => item.id === activeScenarioId.value) ?? currentAgent.value?.scenarios[0] ?? null;
});

const displayQuestion = computed(() => {
  return customQuestion.value || activeScenario.value?.question || '请选择一个测试场景，或在下方输入一个咨询问题';
});

const displayAnswer = computed(() => {
  return (
    customAnswer.value ||
    activeScenario.value?.answer ||
    '当前将根据左侧客服知识库、配置规则和知识边界返回 Mock 结果。'
  );
});

const displaySources = computed(() => {
  return customQuestion.value ? customSources.value : activeScenario.value?.sources ?? [];
});

const visibleDocuments = computed<KnowledgeDocument[]>(() => {
  if (!currentAgent.value) return [];

  const uploadedFiles = uploadedFilesByAgent.value[currentAgent.value.id] ?? [];
  const uploadedDocs = uploadedFiles.map((fileName, index) => ({
    id: `${currentAgent.value!.id}-upload-${index + 1}`,
    title: fileName,
    type: '临时上传',
    status: '已上传',
    size: '--',
    words: '待解析',
    creator: '当前账号',
    summary: '当前为演示上传材料，仅用于展示资料补充后如何进入客服知识范围。',
    tags: ['临时资料', '待解析'],
  }));

  return [...uploadedDocs, ...currentAgent.value.documents];
});

const toSourceFile = (doc: KnowledgeDocument, index: number): SourceFile => ({
  id: index + 1,
  name: doc.title,
  size: doc.size,
  words: doc.words,
  creator: doc.creator,
  status: doc.status === '已入库' ? 'completed' : 'processing',
  materialCount: 0,
});

const activeDocument = computed(() => {
  return visibleDocuments.value.find((doc) => doc.id === selectedDocumentId.value) ?? visibleDocuments.value[0] ?? null;
});

const workspaceMeta = computed(() => {
  if (!currentAgent.value) return '';

  if (activeSection.value === 'materials') {
    return '维护专属客服知识库，上传文档后再到右侧验证知识命中效果';
  }

  if (activeSection.value === 'policy') {
    return '展示渠道接入、最终回答策略和转人工规则';
  }

  return '用运营指标和知识缺口说明这个智能体为什么需要独立工作台';
});

const selectWorkspaceSection = (section: WorkspaceSection) => {
  activeSection.value = section;
};

const openAgentWorkspace = (agentId: string) => {
  router.replace({
    name: 'customer-service',
    query: {
      workspace: '1',
      agent: agentId,
    },
  });
};

const backToAgentList = () => {
  router.replace({ name: 'customer-service' });
};

const handleCreatePlaceholder = () => {
  feedbackMessage.value = '“新建客服智能体”当前先用虚位卡片展示，下一步再补创建流程和渠道绑定配置。';
};

const policyEditTitle = computed(() => {
  if (policyEditMode.value === 'reply') return '编辑回答策略';
  if (policyEditMode.value === 'handoff') return '编辑转人工机制';
  return '编辑转接提示';
});

const policyEditPlaceholder = computed(() => {
  if (policyEditMode.value === 'reply') {
    return '例如：遇到价格、交付周期和招投标资质问题时，先引用资料说明，再提醒由销售顾问继续跟进。';
  }

  if (policyEditMode.value === 'handoff') {
    return '例如：当用户明确索要报价、联系方式、实施周期或出现投诉情绪时，优先触发转人工。';
  }

  return '例如：请先展示转接提示，再补一段顾问超时未接入时的兜底文案。';
});

const openPolicyEditModal = (mode: PolicyEditMode) => {
  policyEditMode.value = mode;
  policyEditInput.value = '';
  showPolicyEditModal.value = true;
};

const closePolicyEditModal = () => {
  showPolicyEditModal.value = false;
  policyEditInput.value = '';
};

const normalizePolicyLines = (text: string) => {
  return text
    .split(/\n|。|；|;/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const mockConnectChannel = (channel: string) => {
  if (!currentAgent.value) return;
  feedbackMessage.value = `已模拟将“${currentAgent.value.agentName}”接入 ${channel}。`;
};

const insertPolicyText = () => {
  if (!currentAgent.value) return;

  const content = policyEditInput.value.trim();
  if (!content) {
    feedbackMessage.value = '请先输入自然语言内容，再执行插入。';
    return;
  }

  if (policyEditMode.value === 'reply') {
    currentAgent.value.replyPrinciples.push(content);
    feedbackMessage.value = '已插入 1 条回答策略。';
  } else if (policyEditMode.value === 'handoff') {
    currentAgent.value.handoffMechanism.strategy.push(content);
    feedbackMessage.value = '已插入 1 条转人工机制。';
  } else {
    currentAgent.value.handoffMechanism.previewMessage = content;
    feedbackMessage.value = '已更新转接提示。';
  }

  closePolicyEditModal();
};

const insertPolicyTextWithAi = () => {
  if (!currentAgent.value) return;

  const content = policyEditInput.value.trim();
  if (!content) {
    feedbackMessage.value = '请先输入自然语言内容，再执行 AI 整理插入。';
    return;
  }

  const lines = normalizePolicyLines(content);
  if (policyEditMode.value === 'reply') {
    currentAgent.value.replyPrinciples.push(...lines);
    feedbackMessage.value = `已整理并插入 ${lines.length} 条回答策略。`;
  } else if (policyEditMode.value === 'handoff') {
    currentAgent.value.handoffMechanism.strategy.push(...lines);
    feedbackMessage.value = `已整理并插入 ${lines.length} 条转人工机制。`;
  } else {
    currentAgent.value.handoffMechanism.previewMessage =
      lines[0] ?? '正在为您转接专属顾问，请稍候...';
    currentAgent.value.handoffMechanism.timeoutFallback =
      lines.slice(1).join('；') || '若顾问暂未接入，将提醒用户稍后联系并继续保留当前会话。';
    feedbackMessage.value = '已整理并更新转接提示文案。';
  }

  closePolicyEditModal();
};

const selectDocument = (documentId: string) => {
  selectedDocumentId.value = documentId;
};

const openUploadModal = () => {
  showUploadModal.value = true;
  isDragOver.value = false;
};

const closeUploadModal = () => {
  showUploadModal.value = false;
  isDragOver.value = false;
};

const selectScenario = (scenarioId: string) => {
  activeScenarioId.value = scenarioId;
  customQuestion.value = '';
  customAnswer.value = '';
  customSources.value = [];

  const scenario = currentAgent.value?.scenarios.find((item) => item.id === scenarioId);
  if (scenario) {
    feedbackMessage.value = `已切换到“${scenario.title}”测试场景，右侧会按当前知识范围返回 Mock 会话。`;
  }
};

const handleFilesSelected = (files: FileList | File[]) => {
  if (!currentAgent.value) return;
  const nextFiles = Array.from(files);
  if (nextFiles.length === 0) return;

  const nextUploadedFiles = [
    ...(uploadedFilesByAgent.value[currentAgent.value.id] ?? []),
    ...nextFiles.map((file) => file.name),
  ];
  uploadedFilesByAgent.value = {
    ...uploadedFilesByAgent.value,
    [currentAgent.value.id]: nextUploadedFiles,
  };
  selectedDocumentId.value = `${currentAgent.value.id}-upload-${nextUploadedFiles.length - nextFiles.length + 1}`;
  feedbackMessage.value = `已模拟上传 ${nextFiles.map((file) => file.name).join('、')}，当前会自动进入“${currentAgent.value.agentName}”的临时知识范围。`;
  closeUploadModal();
};

const handleUploadInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  handleFilesSelected(target.files);
  target.value = '';
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  const target = event.currentTarget as HTMLElement | null;
  const related = event.relatedTarget as Node | null;
  if (target && related && target.contains(related)) return;
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  if (!event.dataTransfer?.files?.length) return;
  handleFilesSelected(event.dataTransfer.files);
};

const submitQuestion = () => {
  if (!currentAgent.value) return;

  const content = questionInput.value.trim();
  if (!content) {
    feedbackMessage.value = '请先输入一个测试问题，再生成当前客服智能体的 Mock 会话。';
    return;
  }

  const sourceTitles = visibleDocuments.value.slice(0, 2).map((item) => `${item.title} / ${item.type}`);
  const activeSampleAnswer = activeScenario.value?.answer ?? '当前会先按知识库给出基础回复，再根据边界决定是否转人工。';

  customQuestion.value = content;
  customAnswer.value =
    `${activeSampleAnswer}\n\n如果继续深入到报价、排期或资质边界，当前示例会按已配置规则转交人工顾问继续跟进。`;
  customSources.value = sourceTitles.length > 0 ? sourceTitles : ['当前未上传额外资料，使用默认 Mock 知识范围'];
  feedbackMessage.value = '已生成一轮 Mock 示例问答。';
  questionInput.value = '';
};

watch(
  currentAgent,
  (agent) => {
    if (!agent) {
      activeSection.value = 'materials';
      activeScenarioId.value = '';
      questionInput.value = '';
      customQuestion.value = '';
      customAnswer.value = '';
      customSources.value = [];
      return;
    }

    activeSection.value = 'materials';
    activeScenarioId.value = agent.scenarios[0]?.id ?? '';
    selectedDocumentId.value = visibleDocuments.value[0]?.id ?? '';
    questionInput.value = '';
    customQuestion.value = '';
    customAnswer.value = '';
    customSources.value = [];
    closePolicyEditModal();
    feedbackMessage.value = `已进入“${agent.agentName}”工作台，左侧管理客服知识库与配置，右侧验证会话效果。`;
  },
  { immediate: true },
);

watch(
  visibleDocuments,
  (documents) => {
    if (documents.length === 0) {
      selectedDocumentId.value = '';
      return;
    }

    if (!documents.some((doc) => doc.id === selectedDocumentId.value)) {
      selectedDocumentId.value = documents[0]?.id ?? '';
    }
  },
  { deep: true },
);
</script>

<template>
  <div v-if="currentAgent" class="workspace-fullscreen-page">
    <div class="workspace-topbar">
      <div class="workspace-title-wrap">
        <button class="back-chip" @click="backToAgentList">
          <ArrowLeft :size="14" />
          <span>返回智能体列表</span>
        </button>

        <div class="workspace-headline">
          <div class="entry-badge">{{ currentAgent.tenantName }}</div>
          <h1 class="workspace-title">{{ currentAgent.agentName }}</h1>
          <p class="workspace-subtitle">
            {{ currentAgent.category }} · {{ currentAgent.tone }}
          </p>
        </div>
      </div>

      <div class="workspace-meta">
        <span class="meta-chip">渠道 {{ currentAgent.channelCount }}</span>
        <span class="meta-chip">知识 {{ currentAgent.knowledgeCount }}</span>
        <span class="meta-chip">待补 {{ currentAgent.pendingGapCount }}</span>
        <span class="meta-chip">转人工 {{ currentAgent.handoffRate }}</span>
        <span class="meta-chip">最近同步：{{ currentAgent.syncTime }}</span>
      </div>
    </div>

    <div class="workspace-shell">
      <div class="workspace-left">
        <section class="content-card workspace-panel-card">
          <div class="panel-tab-header">
            <div class="panel-tab-row">
              <button
                v-for="section in workspaceSections"
                :key="section.key"
                type="button"
                class="panel-tab-btn"
                :class="{ active: activeSection === section.key }"
                @click="selectWorkspaceSection(section.key)"
              >
                <component :is="section.icon" :size="15" />
                <span>{{ section.label }}</span>
              </button>
            </div>
            <span class="card-meta">{{ workspaceMeta }}</span>
          </div>

          <div v-if="activeSection === 'materials'" class="panel-section-body">
            <div class="file-list-card">
              <div class="file-list-header">
                <div>
                  <div class="block-title">客服知识库</div>
                  <p class="block-desc">复用知识库文件行列表样式，当前仅展示资料列表和上传动作，不再展开额外配置面板。</p>
                </div>
                <div class="file-list-actions">
                  <button type="button" class="upload-btn compact" @click="openUploadModal">
                    <Upload :size="16" />
                    <span>上传演示材料</span>
                  </button>
                </div>
              </div>

              <div class="knowledge-file-list">
                <div
                  v-for="(doc, index) in visibleDocuments"
                  :key="doc.id"
                  class="file-item-wrap"
                  :class="{ active: activeDocument?.id === doc.id }"
                >
                  <FileItem :file="toSourceFile(doc, index)" @click="selectDocument(doc.id)" />
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeSection === 'policy'" class="panel-section-body">
            <div class="config-stack">
              <section class="config-section">
                <div class="config-section-header">
                  <div class="sub-title no-margin">接入方式</div>
                  <span class="config-section-tip">只保留渠道入口展示</span>
                </div>

                <div class="channel-access-list">
                  <article v-for="channel in currentAgent.serviceChannels" :key="channel" class="channel-access-item">
                    <span class="channel-access-name">{{ channel }}</span>
                    <button type="button" class="section-action-btn primary" @click="mockConnectChannel(channel)">
                      接入
                    </button>
                  </article>
                </div>
              </section>

              <section class="config-section">
                <div class="config-section-header with-action">
                  <div class="sub-title no-margin">回答策略</div>
                  <div class="config-section-actions">
                    <span class="config-section-tip">展示当前最终回复策略</span>
                    <button type="button" class="section-action-btn" @click="openPolicyEditModal('reply')">编辑</button>
                  </div>
                </div>

                <div class="config-line-list">
                  <div v-for="item in currentAgent.replyPrinciples" :key="item" class="config-line-row">
                    <CheckCircle2 :size="14" />
                    <span>{{ item }}</span>
                  </div>
                </div>
              </section>

              <section class="config-section">
                <div class="config-section-header with-action">
                  <div class="sub-title no-margin">转人工机制</div>
                  <div class="config-section-actions">
                    <span class="config-section-tip">展示当前最终转人工策略</span>
                    <button type="button" class="section-action-btn" @click="openPolicyEditModal('handoff')">编辑</button>
                  </div>
                </div>

                <div class="config-line-list warning">
                  <div v-for="item in currentHandoffMechanism.strategy" :key="item" class="config-line-row warning">
                    <ShieldCheck :size="14" />
                    <span>{{ item }}</span>
                  </div>
                </div>
              </section>

              <section class="config-section">
                <div class="config-section-header with-action">
                  <div class="sub-title no-margin">转接提示</div>
                  <div class="config-section-actions">
                    <span class="config-section-tip">展示给用户的最终提示文案</span>
                    <button type="button" class="section-action-btn" @click="openPolicyEditModal('preview')">编辑</button>
                  </div>
                </div>

                <div class="config-preview-strip">
                  <span class="config-setting-label">转接提示</span>
                  <div class="config-preview-content">
                    <strong>{{ currentHandoffMechanism.previewMessage }}</strong>
                    <p>{{ currentHandoffMechanism.timeoutFallback }}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div v-else class="panel-section-body">
            <div class="metric-grid">
              <div v-for="card in currentAgent.performanceCards" :key="card.label" class="metric-card">
                <div class="metric-label">{{ card.label }}</div>
                <div class="metric-value">{{ card.value }}</div>
                <p class="metric-detail">{{ card.detail }}</p>
              </div>
            </div>

            <div class="sub-block">
              <div class="sub-title">当前风险提示</div>
              <div class="bullet-list">
                <div v-for="item in currentAgent.watchPoints" :key="item" class="bullet-item subtle">
                  <Sparkles :size="14" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>

            <div class="sub-block">
              <div class="sub-title">为什么这里不做成纯聊天页</div>
              <div class="bullet-list">
                <div class="bullet-item">
                  <CheckCircle2 :size="14" />
                  <span>客服智能体的演示重点不只是“能聊”，而是“聊的时候依据了哪些资料和规则”。</span>
                </div>
                <div class="bullet-item">
                  <CheckCircle2 :size="14" />
                  <span>左侧把客服知识库、接入配置和边界显式展示，开发更容易理解后续真实系统要接哪些能力。</span>
                </div>
                <div class="bullet-item">
                  <CheckCircle2 :size="14" />
                  <span>右侧会话测试台保留问答感，但本质上是一个可控的客服验证工作台，而不是通用聊天工具。</span>
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
              <h3>示例问答</h3>
            </div>
            <span class="card-meta">Mock 示例</span>
          </div>

          <div class="chat-chip-list">
            <button
              v-for="scenario in currentAgent.scenarios"
              :key="scenario.id"
              type="button"
              class="question-chip"
              :class="{ active: !customQuestion && activeScenarioId === scenario.id }"
              @click="selectScenario(scenario.id)"
            >
              {{ scenario.title }}
            </button>
          </div>

          <div class="chat-thread">
            <div class="message-card user-message">
              <div class="message-role">示例问题</div>
              <p class="message-text strong">{{ displayQuestion }}</p>
            </div>

            <div class="message-card ai-message">
              <div class="message-role">Mock 回复</div>
              <p class="message-text">{{ displayAnswer }}</p>

              <div class="source-label">引用来源</div>
              <div class="source-list">
                <div v-for="source in displaySources" :key="source" class="source-item">
                  <FileText :size="14" />
                  <span>{{ source }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="ask-box">
            <div class="ask-input-shell">
              <textarea
                v-model="questionInput"
                class="question-input"
                placeholder="例如：客户问到报价折扣、实施周期或资质编号时，当前智能体会怎么处理？"
              ></textarea>
              <button class="inline-send-btn" @click="submitQuestion">
                <Send :size="14" />
                <span>发送</span>
              </button>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <div v-if="showUploadModal" class="upload-modal-overlay" @click.self="closeUploadModal">
      <div class="upload-modal">
        <div class="upload-modal-header">
          <div>
            <div class="modal-eyebrow">资料上传</div>
            <h4 class="modal-title">上传演示材料</h4>
            <p class="modal-desc">支持拖拽文件到弹窗区域，或再次点击触发本地文件管理选择上传。</p>
          </div>
          <button class="upload-modal-close" @click="closeUploadModal">
            <X :size="18" />
          </button>
        </div>

        <label
          class="upload-dropzone"
          :class="{ 'is-drag-over': isDragOver }"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          <input type="file" class="hidden-input" multiple @change="handleUploadInputChange" />
          <div class="dropzone-icon">
            <Upload :size="28" />
          </div>
          <div class="dropzone-title">拖拽文件到这里上传</div>
          <div class="dropzone-text">或点击当前区域，从本地文件管理中选择资料</div>
          <div class="dropzone-hint">支持 PDF、Word、Excel、图片等格式，当前仅用于 Demo 展示</div>
        </label>
      </div>
    </div>

    <div v-if="showPolicyEditModal" class="upload-modal-overlay" @click.self="closePolicyEditModal">
      <div class="upload-modal policy-edit-modal">
        <div class="upload-modal-header">
          <div>
            <div class="modal-eyebrow">自然语言编辑</div>
            <h4 class="modal-title">{{ policyEditTitle }}</h4>
            <p class="modal-desc">输入一段自然语言，点击“插入”直接追加，或点击“AI 整理插入”自动拆成最终策略。</p>
          </div>
          <button class="upload-modal-close" @click="closePolicyEditModal">
            <X :size="18" />
          </button>
        </div>

        <div class="policy-edit-body">
          <textarea
            v-model="policyEditInput"
            class="policy-edit-textarea"
            :placeholder="policyEditPlaceholder"
          ></textarea>
        </div>

        <div class="policy-edit-footer">
          <button type="button" class="section-action-btn" @click="closePolicyEditModal">取消</button>
          <button type="button" class="section-action-btn" @click="insertPolicyText">插入</button>
          <button type="button" class="upload-btn compact" @click="insertPolicyTextWithAi">AI 整理插入</button>
        </div>
      </div>
    </div>
  </div>

  <FormPageLayout
    v-else
    :icon="MessageSquare"
    title="咨询客服智能体"
    subtitle="先选择一个客服智能体，再进入独立工作台维护客服知识库、配置接入方式并测试会话效果"
  >
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" />
    </template>

    <div class="customer-service-page">
      <div class="entry-copy">
        <div class="entry-badge">智能体入口</div>
        <h2 class="entry-title">选择一个客服智能体进入工作台</h2>
        <p class="entry-subtitle">参考销售管理的团队入口做法，这里改成多个客服智能体卡片，每个卡片代表一类独立客服角色。</p>
      </div>

      <div class="agent-entry-grid">
        <button
          v-for="agent in customerAgents"
          :key="agent.id"
          type="button"
          class="agent-entry-card"
          @click="openAgentWorkspace(agent.id)"
        >
          <div class="card-top">
            <span class="joined-badge">已配置</span>
            <span class="role-chip">{{ agent.category }}</span>
          </div>

          <div class="tenant-name">{{ agent.tenantName }}</div>
          <h3 class="agent-name">{{ agent.agentName }}</h3>
          <p class="agent-summary">{{ agent.summary }}</p>

          <div class="agent-stat-row">
            <div class="team-stat-chip">
              <span class="chip-label">知识</span>
              <strong>{{ agent.knowledgeCount }}</strong>
            </div>
            <div class="team-stat-chip">
              <span class="chip-label">渠道</span>
              <strong>{{ agent.channelCount }}</strong>
            </div>
            <div class="team-stat-chip">
              <span class="chip-label">转人工</span>
              <strong>{{ agent.handoffRate }}</strong>
            </div>
          </div>

          <div class="tag-row compact">
            <span v-for="tag in agent.coverageTags.slice(0, 3)" :key="tag" class="tag-chip">
              {{ tag }}
            </span>
          </div>

          <div class="enter-link">进入客服工作台</div>
        </button>

        <button type="button" class="agent-entry-card placeholder-card" @click="handleCreatePlaceholder">
          <div class="placeholder-icon">
            <MessageSquare :size="22" />
          </div>
          <div class="placeholder-title">新建客服智能体</div>
          <p class="placeholder-desc">后续可扩成“选择渠道、绑定知识、配置转人工规则”的创建流程。</p>
        </button>
      </div>

      <div class="feedback-banner">
        <CheckCircle2 :size="16" />
        <span>{{ feedbackMessage }}</span>
      </div>
    </div>

    <template #info-sidebar>
      <InfoSidebar
        :icon="MessageSquare"
        title="咨询客服智能体"
        description="这一版不做统一平台概览，而是直接展示多个客服角色入口。点击卡片进入全屏工作台，左侧维护客服知识库与配置，右侧验证会话与转人工。"
        :features="[
          '入口页展示多个客服智能体卡片，每个卡片代表一类独立业务角色',
          '进入后采用全屏工作台，左侧是客服知识库与配置，右侧是会话测试台',
          '对话保留，但定位为测试和验证，不是开放式通用聊天',
          '所有资料、会话、命中来源和转人工规则均为 Mock 数据',
        ]"
      />
    </template>
  </FormPageLayout>
</template>

<style scoped>
.customer-service-page {
  padding-bottom: 36px;
}

.workspace-fullscreen-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  padding: 20px;
  overflow: hidden;
}

.workspace-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
}

.workspace-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.back-chip,
.panel-tab-btn,
.question-chip,
.agent-entry-card,
.inline-send-btn {
  cursor: pointer;
}

.back-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #dbe4f0;
  background: #ffffff;
  border-radius: 999px;
  color: #3b4b64;
  padding: 8px 14px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.back-chip:hover,
.panel-tab-btn:hover,
.question-chip:hover,
.agent-entry-card:hover,
.inline-send-btn:hover,
.upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.workspace-headline {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.entry-badge,
.joined-badge,
.role-chip,
.meta-chip,
.status-pill,
.focus-chip,
.tag-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 12px;
}

.entry-badge {
  width: fit-content;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 8px;
  font-weight: 600;
  flex-shrink: 0;
}

.workspace-title {
  margin: 0;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.2;
  white-space: nowrap;
}

.workspace-subtitle {
  margin: 0;
  color: #5b6b82;
  font-size: 12px;
  white-space: nowrap;
}

.workspace-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
}

.meta-chip {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 6px 10px;
}

.meta-chip.subtle {
  background: #ffffff;
  color: #64748b;
}

.workspace-shell {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.workspace-left,
.workspace-right {
  min-height: 0;
}

.content-card,
.chat-panel,
.agent-entry-card,
.feedback-banner {
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 24px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
}

.workspace-panel-card,
.chat-panel {
  height: 100%;
  padding: 22px;
}

.panel-tab-header,
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-tab-row,
.tag-row,
.chat-chip-list,
.agent-stat-row,
.workspace-meta,
.chat-summary-strip {
  display: flex;
  flex-wrap: wrap;
}

.panel-tab-row {
  gap: 10px;
}

.panel-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #dbe4f0;
  background: #f8fafc;
  color: #475569;
  padding: 9px 14px;
  border-radius: 999px;
  transition: all 0.2s ease;
}

.panel-tab-btn.active,
.question-chip.active {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.card-meta {
  color: #64748b;
  font-size: 12px;
}

.panel-section-body {
  height: calc(100% - 56px);
  margin-top: 18px;
  overflow: auto;
  padding-right: 4px;
}

.file-list-card,
.sub-block,
.message-card {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 20px;
}

.block-title,
.sub-title,
.doc-title,
.message-role,
.agent-name,
.placeholder-title {
  color: #0f172a;
  font-weight: 600;
}

.block-title,
.sub-title {
  margin-bottom: 8px;
  font-size: 15px;
}

.block-desc,
.doc-summary,
.message-text,
.entry-subtitle,
.agent-summary,
.placeholder-desc,
.metric-detail {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: #0f172a;
  color: #ffffff;
  border-radius: 999px;
  padding: 11px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn.compact {
  padding: 10px 14px;
}

.hidden-input {
  display: none;
}

.triple-grid,
.metric-grid,
.agent-entry-grid {
  display: grid;
  gap: 16px;
}

.triple-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.sub-block {
  padding: 18px;
}

.config-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-section + .config-section {
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
}

.config-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.config-section-header.with-action,
.config-section-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sub-title.no-margin {
  margin-bottom: 0;
}

.config-section-tip {
  color: #94a3b8;
  font-size: 12px;
}

.config-strip-list,
.config-line-list,
.config-setting-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.channel-access-list,
.config-preview-content {
  display: flex;
  flex-direction: column;
}

.channel-access-list {
  gap: 10px;
}

.channel-access-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fbfdff;
}

.channel-access-name {
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.config-strip-side-note {
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
}

.config-item-summary {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: #334155;
}

.config-item-desc {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.config-item-desc.compact {
  margin-top: 0;
}

.config-inline-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 18px;
}

.config-inline-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 10px;
  align-items: flex-start;
}

.config-inline-label,
.config-setting-label {
  display: block;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.6;
}

.config-inline-row strong,
.config-setting-row strong,
.config-preview-content strong {
  color: #0f172a;
  font-size: 14px;
  line-height: 1.65;
}

.config-line-row,
.config-setting-row,
.config-preview-strip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
}

.config-line-row {
  color: #334155;
  line-height: 1.7;
}

.config-line-row.warning {
  color: #9a3412;
  background: #fffaf6;
  border-color: #fed7aa;
}

.config-setting-label {
  width: 84px;
  flex-shrink: 0;
}

.config-preview-strip {
  background: #f8fafc;
  border-style: dashed;
}

.config-preview-content {
  min-width: 0;
  gap: 10px;
}

.config-preview-content p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;
}

.section-action-btn {
  border: 1px solid #dbe4f0;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-action-btn {
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
}

.section-action-btn:hover {
  background: #f8fafc;
}

.section-action-btn.primary {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.tag-row {
  gap: 10px;
}

.focus-chip,
.tag-chip,
.joined-badge,
.role-chip,
.status-pill {
  padding: 6px 10px;
}

.file-list-card {
  padding: 18px;
}

.file-list-card {
  margin-top: 0;
  min-height: 100%;
}

.file-list-header,
.file-list-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.file-list-header {
  margin-bottom: 16px;
}

.file-list-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.knowledge-file-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item-wrap {
  border-radius: 12px;
}

.file-item-wrap.active :deep(.file-item-realign) {
  border-color: #93c5fd;
  background: #eff6ff;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.08);
}

.doc-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.doc-type,
.tenant-name,
.message-role,
.metric-label,
.chip-label,
.source-label {
  color: #64748b;
  font-size: 12px;
}

.doc-title,
.agent-name {
  margin: 4px 0 0;
  font-size: 17px;
  line-height: 1.35;
}

.status-pill {
  background: #ecfdf3;
  color: #047857;
}

.status-pill.warning {
  background: #fff7ed;
  color: #c2410c;
}

.bullet-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bullet-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #334155;
  line-height: 1.6;
}

.bullet-item.warning {
  color: #9a3412;
}

.bullet-item.subtle {
  color: #475569;
}

.metric-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 16px;
}

.metric-card {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.metric-value {
  margin: 8px 0;
  color: #0f172a;
  font-size: 28px;
  font-weight: 700;
}

.chat-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chat-header {
  padding-bottom: 2px;
}

.card-title-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
}

.chat-chip-list {
  gap: 10px;
}

.question-chip {
  border: 1px solid #dbe4f0;
  background: #ffffff;
  color: #475569;
  border-radius: 999px;
  padding: 8px 14px;
  transition: all 0.2s ease;
}

.chat-thread {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.message-card {
  padding: 16px;
}

.user-message {
  background: #eff6ff;
  border-color: #dbeafe;
}

.ai-message {
  background: #f8fafc;
}

.message-text.strong {
  color: #0f172a;
  font-weight: 600;
}

.source-label {
  margin-top: 14px;
  margin-bottom: 8px;
}

.source-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.source-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
}

.ask-box {
  border-top: 1px solid #e2e8f0;
  padding-top: 14px;
}

.upload-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(4px);
}

.upload-modal {
  width: min(640px, 100%);
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.policy-edit-modal {
  width: min(560px, 100%);
}

.upload-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-eyebrow {
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
}

.modal-title {
  margin: 8px 0 6px;
  font-size: 20px;
  color: #0f172a;
}

.modal-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.upload-modal-close {
  width: 34px;
  height: 34px;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  background: #ffffff;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-dropzone {
  margin: 20px 22px 22px;
  border: 2px dashed #bfdbfe;
  border-radius: 20px;
  padding: 36px 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-dropzone.is-drag-over {
  border-color: #2563eb;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
}

.dropzone-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ffffff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.12);
  margin-bottom: 18px;
}

.dropzone-title {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.dropzone-text {
  margin-top: 8px;
  font-size: 14px;
  color: #475569;
}

.dropzone-hint {
  margin-top: 12px;
  font-size: 12px;
  color: #94a3b8;
}

.policy-edit-body {
  padding: 20px 22px 0;
}

.policy-edit-textarea {
  width: 100%;
  min-height: 180px;
  border: 1px solid #dbe4f0;
  border-radius: 18px;
  background: #f8fafc;
  color: #0f172a;
  resize: vertical;
  padding: 14px 16px;
  font: inherit;
  line-height: 1.7;
}

.policy-edit-textarea:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.policy-edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 18px 22px 22px;
}

.ask-input-shell {
  position: relative;
}

.question-input {
  width: 100%;
  min-height: 110px;
  border: 1px solid #dbe4f0;
  border-radius: 18px;
  background: #f8fafc;
  color: #0f172a;
  resize: none;
  padding: 14px 16px 60px;
  font: inherit;
}

.question-input:focus,
.panel-tab-btn:focus,
.question-chip:focus,
.back-chip:focus,
.inline-send-btn:focus,
.upload-btn:focus,
.section-action-btn:focus {
  outline: 2px solid rgba(37, 99, 235, 0.18);
  outline-offset: 2px;
}

.inline-send-btn {
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 14px;
  padding: 10px 14px;
  transition: all 0.2s ease;
}

.entry-copy {
  margin-bottom: 18px;
}

.entry-title {
  margin: 12px 0 8px;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.2;
}

.agent-entry-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.agent-entry-card {
  border: 1px solid #dbe4f0;
  text-align: left;
  padding: 22px;
  transition: all 0.2s ease;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.joined-badge {
  background: #ecfdf3;
  color: #047857;
}

.role-chip {
  background: #eff6ff;
  color: #1d4ed8;
}

.agent-summary {
  margin-top: 10px;
}

.agent-stat-row {
  gap: 10px;
  margin: 18px 0 14px;
}

.team-stat-chip {
  min-width: 0;
  flex: 1;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 18px;
  padding: 12px 14px;
}

.chip-label {
  display: block;
  margin-bottom: 6px;
}

.tag-row.compact {
  margin-bottom: 18px;
}

.enter-link {
  color: #2563eb;
  font-weight: 600;
}

.placeholder-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
  border-style: dashed;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #eff6ff;
  color: #1d4ed8;
}

.feedback-banner {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e3a8a;
  padding: 16px 18px;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
}

@media (max-width: 1180px) {
  .workspace-shell,
  .triple-grid,
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .workspace-fullscreen-page {
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }

  .workspace-panel-card,
  .chat-panel {
    height: auto;
    min-height: 0;
  }

  .panel-section-body,
  .chat-thread {
    height: auto;
    max-height: none;
  }
}

@media (max-width: 900px) {
  .agent-entry-grid {
    grid-template-columns: 1fr;
  }

  .workspace-topbar,
  .file-list-header,
  .config-section-header,
  .config-section-actions,
  .channel-access-item,
  .policy-edit-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .workspace-meta {
    justify-content: flex-start;
  }

  .workspace-headline {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .file-list-actions {
    justify-content: flex-start;
  }

  .config-preview-strip {
    display: grid;
    grid-template-columns: 1fr;
  }

  .config-setting-label {
    width: auto;
  }
}
</style>
