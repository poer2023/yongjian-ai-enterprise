<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import {
  ChevronLeft,
  Type,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Grid3X3,
  Code,
  Sparkles,
  MapPin,
  Lightbulb,
  Package,
  Pencil,
  RotateCcw,
  FileText,
  User,
  FolderOpen,
  Eye,
  Plus,
  Play,
  Circle,
  CheckCircle2,
  ScanSearch,
  Loader2,
  Search,
  Trash2,
  Award,
  Briefcase
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Right panel resizable state
const rightPanelWidth = ref(320);
const isResizing = ref(false);
const minPanelWidth = 280;
const maxPanelWidth = 480;

// Start resizing
const startResize = (e: MouseEvent) => {
  isResizing.value = true;
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

// Handle resize
const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return;

  const container = document.querySelector('.result-body');
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const newWidth = containerRect.right - e.clientX;

  if (newWidth >= minPanelWidth && newWidth <= maxPanelWidth) {
    rightPanelWidth.value = newWidth;
  }
};

// Stop resizing
const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// Mock generated content for each section
const mockContents: Record<string, string> = {
  'section-1-1': `兹授权我公司投标专用章在本次投标活动中代表公司公章使用，具有同等法律效力。

授权期限：自本授权书签署之日起至本项目中标结果公示之日止。

特此授权。

授权单位：金盾检测技术股份有限公司
法定代表人：张三
日期：2024年1月15日`,
  'section-1-2': `致：XX市政府采购中心

我方已仔细研究了"信息系统安全等级保护测评（等保2.0）项目"招标文件的全部内容，愿意以人民币（大写）壹佰贰拾万元整（¥1,200,000.00）的投标总价，按招标文件规定的要求提供全部服务。

一、我方承诺：
1. 遵守《中华人民共和国招标投标法》及相关法律法规；
2. 投标文件中的所有内容真实有效；
3. 如中标，将严格按照招标文件和投标文件的要求履行合同义务。

二、我方同意：
1. 本投标文件自投标截止之日起90个日历日内保持有效；
2. 按招标文件规定缴纳投标保证金。

投标人：金盾检测技术股份有限公司
法定代表人或授权代表：张三
日期：2024年1月15日`,
  'section-1-3': `| 序号 | 项目名称 | 数量 | 单位 | 投标报价（元） |
|------|----------|------|------|----------------|
| 1 | 等级保护测评服务 | 1 | 项 | 1,200,000.00 |
| | 合计 | | | 1,200,000.00 |

大写金额：人民币壹佰贰拾万元整

投标人：金盾检测技术股份有限公司
日期：2024年1月15日`,
};

// Track which sections have been generated
const generatedSections = ref<Set<string>>(new Set());

// Track which section is currently generating
const generatingSection = ref<string | null>(null);

// Store streaming content for each section
const streamingContent = ref<Record<string, string>>({});

interface OutlineItem {
  id: string;
  title: string;
  level: 1 | 2;
  children?: OutlineItem[];
}

const outlineItems = ref<OutlineItem[]>([
  { id: 'section-1', title: '投标文件基本文件', level: 1, children: [
    { id: 'section-1-1', title: '公章对投标专用章的授权函', level: 2 },
    { id: 'section-1-2', title: '投标函', level: 2 },
    { id: 'section-1-3', title: '开标一览表', level: 2 },
    { id: 'section-1-4', title: '分项报价表', level: 2 },
    { id: 'section-1-5', title: '投标保证金缴纳凭证', level: 2 },
    { id: 'section-1-6', title: '投标保证金退款账户信息', level: 2 },
    { id: 'section-1-7', title: '中标服务费承诺书', level: 2 },
  ]},
  { id: 'section-2', title: '商务响应文件', level: 1, children: [
    { id: 'section-2-8', title: '企业法人营业执照副本', level: 2 },
    { id: 'section-2-9', title: '工商变更登记文件', level: 2 },
    { id: 'section-2-10', title: '法定代表人授权书', level: 2 },
    { id: 'section-2-11', title: '廉洁承诺书', level: 2 },
    { id: 'section-2-12', title: '投标人关联关系单位披露表', level: 2 },
    { id: 'section-2-13', title: '网络安全等级测评机构服务认证证书', level: 2 },
    { id: 'section-2-14', title: '全国网络安全等级测评机构目录截图', level: 2 },
    { id: 'section-2-15', title: '从业年限证明', level: 2 },
    { id: 'section-2-16', title: '资质认证', level: 2 },
    { id: 'section-2-17', title: '技术/服务需求响应偏离表', level: 2 },
    { id: 'section-2-18', title: '合同条款响应偏离表', level: 2 },
    { id: 'section-2-19', title: '投标人情况介绍', level: 2 },
    { id: 'section-2-20', title: '财务状况及财务报告', level: 2 },
  ]},
  { id: 'section-3', title: '技术响应文件', level: 1, children: [
    { id: 'section-3-21', title: '《技术要求与服务内容》点对点应答', level: 2 },
    { id: 'section-3-22', title: '投标人所投服务符合招标文件规定的证明', level: 2 },
    { id: 'section-3-23', title: '相关承诺书', level: 2 },
    { id: 'section-3-24', title: '项目方案', level: 2 },
    { id: 'section-3-25', title: '招标人需配合的前期准备工作', level: 2 },
    { id: 'section-3-26', title: '利益冲突说明', level: 2 },
  ]},
]);

const activeOutlineId = ref('section-1-1');

// Track if user is manually scrolling (clicking outline)
const isManualScrolling = ref(false);

// Intersection Observer for scroll tracking
let observer: IntersectionObserver | null = null;

// Debounce timer for preventing jitter
let updateTimer: ReturnType<typeof setTimeout> | null = null;

// Track visible sections with their positions
const visibleSections = new Map<string, number>();

// Setup intersection observer for auto-tracking visible sections
const setupScrollTracking = () => {
  const contentPanel = document.querySelector('.content-panel');
  if (!contentPanel) return;

  // Use scroll event with throttle for more precise tracking
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;

  const handleScroll = () => {
    if (isManualScrolling.value) return;

    if (scrollTimer) return; // Throttle

    scrollTimer = setTimeout(() => {
      scrollTimer = null;

      // Get all section headings
      const headings = document.querySelectorAll('h3.subsection-heading[id]');
      const panelRect = contentPanel.getBoundingClientRect();
      const targetY = panelRect.top + 100; // Target line 100px from top of panel

      let closestSection = '';
      let closestDistance = Infinity;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const headingY = rect.top;

        // Find the heading closest to (but above) the target line
        if (headingY <= targetY) {
          const distance = targetY - headingY;
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = heading.id;
          }
        }
      });

      // If no heading above target line, pick the first visible one
      if (!closestSection) {
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          if (rect.top >= panelRect.top && rect.top <= panelRect.bottom) {
            if (!closestSection) {
              closestSection = heading.id;
            }
          }
        });
      }

      if (closestSection && closestSection !== activeOutlineId.value) {
        activeOutlineId.value = closestSection;
      }
    }, 50); // 50ms throttle
  };

  contentPanel.addEventListener('scroll', handleScroll);

  // Store cleanup function
  (window as any).__scrollCleanup = () => {
    contentPanel.removeEventListener('scroll', handleScroll);
    if (scrollTimer) clearTimeout(scrollTimer);
  };
};

// Cleanup observer
const cleanupScrollTracking = () => {
  if ((window as any).__scrollCleanup) {
    (window as any).__scrollCleanup();
    delete (window as any).__scrollCleanup;
  }
  if (updateTimer) {
    clearTimeout(updateTimer);
    updateTimer = null;
  }
  visibleSections.clear();
};

onMounted(() => {
  setupScrollTracking();
});

onUnmounted(() => {
  cleanupScrollTracking();
});

// Mock scoring points for each section
const scoringPoints: Record<string, string[]> = {
  'section-1-1': ['格式规范（2分）', '授权有效性（3分）'],
  'section-1-2': ['投标报价合理（5分）', '响应招标要求（3分）', '承诺条款完整（2分）'],
  'section-1-3': ['报价明细清晰（3分）', '金额计算正确（2分）'],
  'section-1-4': ['分项报价合理（5分）', '价格构成明确（3分）'],
  'section-1-5': ['保证金缴纳及时（2分）'],
  'section-1-6': ['账户信息完整（1分）'],
  'section-1-7': ['承诺内容完整（2分）'],
  'section-2-8': ['证照有效期内（2分）', '经营范围匹配（3分）'],
  'section-2-9': ['变更信息完整（1分）'],
  'section-2-10': ['授权有效（2分）', '签章规范（1分）'],
  'section-2-11': ['承诺内容完整（2分）'],
  'section-2-12': ['披露信息真实（3分）'],
  'section-2-13': ['资质等级满足要求（5分）', '证书有效期内（2分）'],
  'section-2-14': ['目录截图清晰（1分）'],
  'section-2-15': ['从业年限证明有效（3分）'],
  'section-2-16': ['资质认证齐全（5分）', 'ISO认证（3分）', '行业资质（3分）'],
  'section-2-17': ['响应偏离说明完整（3分）'],
  'section-2-18': ['合同条款响应明确（2分）'],
  'section-2-19': ['企业规模（3分）', '行业经验（5分）', '技术实力（5分）'],
  'section-2-20': ['财务状况良好（3分）', '报告期内无重大异常（2分）'],
  'section-3-21': ['技术要求逐条响应（10分）', '响应完整度（5分）'],
  'section-3-22': ['符合性证明完整（3分）'],
  'section-3-23': ['承诺书签章规范（2分）'],
  'section-3-24': ['方案完整性（10分）', '技术方案可行性（8分）', '创新性（5分）'],
  'section-3-25': ['配合事项说明清晰（2分）'],
  'section-3-26': ['利益冲突说明真实（3分）'],
};

// Track completed scoring points: key = "sectionId-pointIndex"
const completedPoints = ref<Set<string>>(new Set());

// Toggle scoring point completion
const toggleScoringPoint = (sectionId: string, pointIndex: number) => {
  const key = `${sectionId}-${pointIndex}`;
  if (completedPoints.value.has(key)) {
    completedPoints.value.delete(key);
  } else {
    completedPoints.value.add(key);
  }
};

// Check if a scoring point is completed
const isPointCompleted = (sectionId: string, pointIndex: number) => {
  return completedPoints.value.has(`${sectionId}-${pointIndex}`);
};

// Get completion stats for current section
const completionStats = computed(() => {
  const points = scoringPoints[activeOutlineId.value] || [];
  const total = points.length;
  let completed = 0;
  points.forEach((_, index) => {
    if (isPointCompleted(activeOutlineId.value, index)) {
      completed++;
    }
  });
  return { completed, total };
});

// AI detection state
const isDetecting = ref(false);

// AI detect scoring points for current section
const detectScoringPoints = async () => {
  const sectionId = activeOutlineId.value;

  // Check if section has content
  const hasContent = generatedSections.value.has(sectionId) ||
                     streamingContent.value[sectionId] ||
                     mockContents[sectionId];

  if (!hasContent) {
    alert('请先生成本节内容，再进行评分要点检测');
    return;
  }

  isDetecting.value = true;

  const points = scoringPoints[sectionId] || [];

  // Simulate AI detection with progressive checking
  for (let i = 0; i < points.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));

    // Simulate AI decision: 70% chance to pass each point
    // In real implementation, this would analyze content against each scoring criteria
    const shouldPass = Math.random() > 0.3;

    if (shouldPass) {
      completedPoints.value.add(`${sectionId}-${i}`);
    } else {
      completedPoints.value.delete(`${sectionId}-${i}`);
    }
  }

  isDetecting.value = false;
};

// Material type definition
interface Material {
  type: 'cert' | 'case' | 'team';
  name: string;
  icon: string;
}

// Material detail for preview
interface MaterialDetail {
  name: string;
  type: string;
  description: string;
  content: string;
  meta?: Record<string, string>;
}

// Mock material details for preview
const materialDetails: Record<string, MaterialDetail> = {
  '企业法人营业执照': {
    name: '企业法人营业执照',
    type: '资质证书',
    description: '金盾检测技术股份有限公司营业执照',
    content: '统一社会信用代码：91110000MA0XXXXXX\n企业名称：金盾检测技术股份有限公司\n类型：股份有限公司\n住所：北京市海淀区中关村大街1号\n法定代表人：张三\n注册资本：5000万元\n成立日期：2010年06月18日\n营业期限：长期\n经营范围：信息安全测评服务；网络安全等级保护测评；信息系统安全集成...',
    meta: { '有效期': '长期', '发证机关': '北京市市场监督管理局' }
  },
  'ISO9001质量管理体系认证': {
    name: 'ISO9001质量管理体系认证',
    type: '资质证书',
    description: '质量管理体系认证证书',
    content: '证书编号：CN-ISO9001-2023XXXX\n\n兹证明：金盾检测技术股份有限公司\n\n已通过 GB/T 19001-2016/ISO 9001:2015 质量管理体系认证\n\n认证范围：信息安全测评服务、网络安全等级保护测评服务、信息系统安全咨询服务',
    meta: { '有效期': '2023-06-01 至 2026-05-31', '认证机构': '中国质量认证中心' }
  },
  'ISO27001信息安全管理体系': {
    name: 'ISO27001信息安全管理体系',
    type: '资质证书',
    description: '信息安全管理体系认证证书',
    content: '证书编号：CN-ISO27001-2023XXXX\n\n兹证明：金盾检测技术股份有限公司\n\n已通过 GB/T 22080-2016/ISO/IEC 27001:2013 信息安全管理体系认证\n\n认证范围：信息安全测评服务的信息安全管理',
    meta: { '有效期': '2023-08-01 至 2026-07-31', '认证机构': '中国信息安全认证中心' }
  },
  '信息系统集成三级资质': {
    name: '信息系统集成三级资质',
    type: '资质证书',
    description: '信息系统集成及服务资质证书',
    content: '资质证书编号：XZ3-2023-XXXX\n\n企业名称：金盾检测技术股份有限公司\n资质等级：三级\n\n业务范围：\n1. 信息系统集成服务\n2. 信息系统运维服务\n3. 信息安全服务',
    meta: { '有效期': '2023-01-01 至 2026-12-31', '发证单位': '中国电子信息行业联合会' }
  },
  '网络安全等级测评机构服务认证证书': {
    name: '网络安全等级测评机构服务认证证书',
    type: '资质证书',
    description: '等级保护测评机构资质',
    content: '证书编号：DJCP-2023-XXXX\n\n机构名称：金盾检测技术股份有限公司\n\n经审核，该机构符合《网络安全等级保护测评机构管理办法》规定的条件，准予从事网络安全等级保护测评活动。\n\n测评业务范围：第二级、第三级信息系统',
    meta: { '有效期': '2023-03-01 至 2026-02-28', '发证单位': '公安部网络安全保卫局' }
  },
  'CISP证书': {
    name: 'CISP证书',
    type: '人员资质',
    description: '注册信息安全专业人员证书',
    content: '持证人：王工\n证书编号：CISP-2022-XXXXX\n专业方向：注册信息安全工程师（CISE）\n\n该人员已通过中国信息安全测评中心组织的注册信息安全专业人员考试，具备信息安全专业知识和技能。',
    meta: { '有效期': '2022-06-01 至 2025-05-31', '发证单位': '中国信息安全测评中心' }
  },
  'CISSP证书': {
    name: 'CISSP证书',
    type: '人员资质',
    description: '国际注册信息系统安全专家',
    content: '持证人：李工\n证书编号：CISSP-XXXXX\n\n该人员已通过(ISC)²组织的CISSP认证考试，具备国际认可的信息安全专业能力。\n\n认证领域：安全与风险管理、资产安全、安全架构与工程、通信与网络安全、身份与访问管理、安全评估与测试、安全运营、软件开发安全',
    meta: { '有效期': '2023-01-01 至 2026-12-31', '发证单位': '(ISC)²' }
  },
  '2023年度审计报告': {
    name: '2023年度审计报告',
    type: '财务文件',
    description: '2023年度财务审计报告',
    content: '审计报告\n\n致金盾检测技术股份有限公司全体股东：\n\n一、审计意见\n我们审计了金盾检测技术股份有限公司2023年度财务报表，包括2023年12月31日的资产负债表、利润表、现金流量表及相关附注。\n\n我们认为，后附的财务报表在所有重大方面按照企业会计准则的规定编制，公允反映了公司2023年12月31日的财务状况以及2023年度的经营成果和现金流量。\n\n主要财务指标：\n- 总资产：1.2亿元\n- 净资产：8000万元\n- 营业收入：6000万元\n- 净利润：1200万元',
    meta: { '审计机构': '普华永道中天会计师事务所', '报告日期': '2024-03-15' }
  },
  '某市政务云平台安全评测项目': {
    name: '某市政务云平台安全评测项目',
    type: '业绩案例',
    description: '政务云平台等级保护测评项目',
    content: '项目名称：某市政务云平台安全等级保护测评\n\n项目背景：\n某市政务云平台承载了全市50+政务系统，涉及政务服务、数据共享等核心业务，需进行等级保护三级测评。\n\n服务内容：\n1. 等级保护定级备案咨询\n2. 安全差距分析\n3. 等级保护测评（三级）\n4. 安全整改建议\n\n项目成果：\n- 完成8个三级系统测评\n- 发现并协助整改安全问题126项\n- 顺利通过公安机关备案审核',
    meta: { '项目金额': '180万元', '项目周期': '2023.03-2023.09', '客户': '某市大数据管理局' }
  },
  '某银行核心系统等保测评项目': {
    name: '某银行核心系统等保测评项目',
    type: '业绩案例',
    description: '银行核心业务系统等级保护测评',
    content: '项目名称：某银行核心业务系统等级保护测评\n\n项目背景：\n某股份制银行核心业务系统升级后，需重新进行等级保护测评，确保符合金融行业监管要求。\n\n服务内容：\n1. 等级保护三级测评\n2. 密码应用安全性评估\n3. 渗透测试\n4. 安全加固建议\n\n项目成果：\n- 完成核心银行系统、网银系统、手机银行等5个系统测评\n- 发现高危漏洞23个，已全部整改\n- 测评结论：符合等级保护三级要求',
    meta: { '项目金额': '220万元', '项目周期': '2023.06-2023.12', '客户': '某股份制银行' }
  },
  '张工 - 项目经理': {
    name: '张工',
    type: '项目团队',
    description: '高级项目经理',
    content: '姓名：张明\n职位：高级项目经理\n工作年限：12年\n\n专业资质：\n- PMP项目管理专业人士\n- CISP注册信息安全专业人员\n- 等级保护测评师（高级）\n\n项目经验：\n- 主导完成50+等级保护测评项目\n- 服务客户涵盖政府、金融、能源、医疗等行业\n- 曾负责某省级政务云平台安全测评项目（合同额500万+）\n\n专业特长：\n项目管理、安全咨询、等级保护测评、风险评估',
    meta: { '学历': '硕士', '职称': '高级工程师' }
  },
  '李工 - 技术负责人': {
    name: '李工',
    type: '项目团队',
    description: '技术总监',
    content: '姓名：李强\n职位：技术总监\n工作年限：15年\n\n专业资质：\n- CISSP国际注册信息系统安全专家\n- CISP-PTE注册渗透测试工程师\n- 等级保护测评师（高级）\n- CISA注册信息系统审计师\n\n技术专长：\n- 网络安全架构设计\n- 渗透测试与漏洞挖掘\n- 安全运营体系建设\n- 应急响应与溯源分析\n\n代表项目：\n- 某央企集团网络安全体系建设\n- 某省公安厅网络安全攻防演练技术支撑',
    meta: { '学历': '硕士', '职称': '正高级工程师' }
  },
  '王工 - 高级测评师': {
    name: '王工',
    type: '项目团队',
    description: '高级测评工程师',
    content: '姓名：王磊\n职位：高级测评工程师\n工作年限：8年\n\n专业资质：\n- CISP注册信息安全专业人员\n- 等级保护测评师（中级）\n- CCSK云安全知识认证\n\n技术专长：\n- 等级保护测评\n- 云安全测评\n- 工控安全测评\n- 密码应用安全评估\n\n项目经验：\n- 参与完成100+等级保护测评项目\n- 擅长云平台、工控系统等新技术领域测评',
    meta: { '学历': '本科', '职称': '工程师' }
  },
};

// Preview modal state
const showPreviewModal = ref(false);
const previewingMaterial = ref<MaterialDetail | null>(null);

// Inserted materials tracking (for showing inserted status)
const insertedMaterials = ref<Set<string>>(new Set());

// Mock recommended materials for each section
const recommendedMaterials: Record<string, Material[]> = {
  'section-1-1': [],
  'section-1-2': [],
  'section-1-3': [],
  'section-2-8': [
    { type: 'cert', name: '企业法人营业执照', icon: '📄' },
  ],
  'section-2-13': [
    { type: 'cert', name: '网络安全等级测评机构服务认证证书', icon: '📄' },
  ],
  'section-2-16': [
    { type: 'cert', name: 'ISO9001质量管理体系认证', icon: '📄' },
    { type: 'cert', name: 'ISO27001信息安全管理体系', icon: '📄' },
    { type: 'cert', name: '信息系统集成三级资质', icon: '📄' },
  ],
  'section-2-19': [
    { type: 'case', name: '某市政务云平台安全评测项目', icon: '📁' },
    { type: 'case', name: '某银行核心系统等保测评项目', icon: '📁' },
    { type: 'team', name: '张工 - 项目经理', icon: '👤' },
    { type: 'team', name: '李工 - 技术负责人', icon: '👤' },
  ],
  'section-2-20': [
    { type: 'cert', name: '2023年度审计报告', icon: '📄' },
  ],
  'section-3-21': [
    { type: 'cert', name: 'CISP证书', icon: '📄' },
    { type: 'cert', name: 'CISSP证书', icon: '📄' },
  ],
  'section-3-24': [
    { type: 'case', name: '某市政务云平台安全评测项目', icon: '📁' },
    { type: 'case', name: '某银行核心系统等保测评项目', icon: '📁' },
    { type: 'team', name: '张工 - 项目经理', icon: '👤' },
    { type: 'team', name: '李工 - 技术负责人', icon: '👤' },
    { type: 'team', name: '王工 - 高级测评师', icon: '👤' },
  ],
};

// Get current section info
const currentSection = computed(() => {
  const findSection = (id: string): { id: string; title: string } | null => {
    for (const section of outlineItems.value) {
      if (section.id === id) return { id: section.id, title: section.title };
      if (section.children) {
        const child = section.children.find(c => c.id === id);
        if (child) return { id: child.id, title: child.title };
      }
    }
    return null;
  };
  return findSection(activeOutlineId.value);
});

// Get scoring points for current section
const currentScoringPoints = computed(() => {
  return scoringPoints[activeOutlineId.value] || ['暂无评分要点'];
});

// Get recommended materials for current section
const currentMaterials = computed(() => {
  return recommendedMaterials[activeOutlineId.value] || [];
});

// Check if current section content is generated
const isCurrentSectionGenerated = computed(() => {
  return generatedSections.value.has(activeOutlineId.value);
});

// Check if any section is currently generating
const isAnyGenerating = computed(() => {
  return generatingSection.value !== null;
});

// AI edit actions
const handleAIEdit = (action: string) => {
  alert(`AI ${action}功能：将对「${currentSection.value?.title}」的内容进行${action}`);
};

// Insert material into current section
const insertMaterial = (material: Material) => {
  const detail = materialDetails[material.name];
  if (!detail) {
    alert('素材详情未找到');
    return;
  }

  // Generate insert content based on material type
  let insertContent = '';
  if (material.type === 'cert') {
    insertContent = `\n\n【${detail.name}】\n${detail.content}`;
  } else if (material.type === 'case') {
    insertContent = `\n\n【业绩案例：${detail.name}】\n${detail.content}`;
  } else if (material.type === 'team') {
    insertContent = `\n\n【项目成员：${detail.name}】\n${detail.content}`;
  }

  // Append to section content
  const sectionId = activeOutlineId.value;
  if (streamingContent.value[sectionId]) {
    streamingContent.value[sectionId] += insertContent;
  } else if (mockContents[sectionId]) {
    mockContents[sectionId] += insertContent;
  } else {
    // If section not generated, create initial content
    streamingContent.value[sectionId] = insertContent.trim();
    generatedSections.value.add(sectionId);
  }

  // Mark as inserted
  insertedMaterials.value.add(`${sectionId}-${material.name}`);
};

// Check if material is already inserted in current section
const isMaterialInserted = (material: Material) => {
  return insertedMaterials.value.has(`${activeOutlineId.value}-${material.name}`);
};

// Preview material - open modal
const previewMaterial = (material: Material) => {
  const detail = materialDetails[material.name];
  if (detail) {
    previewingMaterial.value = detail;
    showPreviewModal.value = true;
  } else {
    alert('素材详情未找到');
  }
};

// Close preview modal
const closePreviewModal = () => {
  showPreviewModal.value = false;
  previewingMaterial.value = null;
};

// Right panel tab state
const activeRightTab = ref<'node' | 'materials'>('node');

// Material search
const materialSearchQuery = ref('');

// Enterprise materials (AI recommended before generation)
interface EnterpriseMaterial {
  id: string;
  name: string;
  type: 'cert' | 'case' | 'team';
  description: string;
  content: string;
  meta?: Record<string, string>;
  inserted: boolean;
  insertedSectionId?: string;
}

const enterpriseMaterials = ref<EnterpriseMaterial[]>([
  {
    id: 'em1',
    name: '网络安全等级测评机构服务认证证书',
    type: 'cert',
    description: '等级保护测评机构资质',
    content: '证书编号：DJCP-2023-XXXX\n\n机构名称：金盾检测技术股份有限公司\n\n经审核，该机构符合《网络安全等级保护测评机构管理办法》规定的条件，准予从事网络安全等级保护测评活动。\n\n测评业务范围：第二级、第三级信息系统',
    meta: { '有效期': '2023-03-01 至 2026-02-28', '发证单位': '公安部网络安全保卫局' },
    inserted: true,
    insertedSectionId: 'section-2-13'
  },
  {
    id: 'em2',
    name: 'ISO9001质量管理体系认证',
    type: 'cert',
    description: '质量管理体系认证证书',
    content: '证书编号：CN-ISO9001-2023XXXX\n\n兹证明：金盾检测技术股份有限公司\n\n已通过 GB/T 19001-2016/ISO 9001:2015 质量管理体系认证\n\n认证范围：信息安全测评服务、网络安全等级保护测评服务、信息系统安全咨询服务',
    meta: { '有效期': '2023-06-01 至 2026-05-31', '认证机构': '中国质量认证中心' },
    inserted: true,
    insertedSectionId: 'section-2-16'
  },
  {
    id: 'em3',
    name: 'ISO27001信息安全管理体系',
    type: 'cert',
    description: '信息安全管理体系认证证书',
    content: '证书编号：CN-ISO27001-2023XXXX\n\n兹证明：金盾检测技术股份有限公司\n\n已通过 GB/T 22080-2016/ISO/IEC 27001:2013 信息安全管理体系认证\n\n认证范围：信息安全测评服务的信息安全管理',
    meta: { '有效期': '2023-08-01 至 2026-07-31', '认证机构': '中国信息安全认证中心' },
    inserted: false
  },
  {
    id: 'em4',
    name: '信息系统集成三级资质',
    type: 'cert',
    description: '信息系统集成及服务资质证书',
    content: '资质证书编号：XZ3-2023-XXXX\n\n企业名称：金盾检测技术股份有限公司\n资质等级：三级\n\n业务范围：\n1. 信息系统集成服务\n2. 信息系统运维服务\n3. 信息安全服务',
    meta: { '有效期': '2023-01-01 至 2026-12-31', '发证单位': '中国电子信息行业联合会' },
    inserted: false
  },
  {
    id: 'em5',
    name: '某市政务云平台安全评测项目',
    type: 'case',
    description: '政务云平台等级保护测评项目',
    content: '项目名称：某市政务云平台安全等级保护测评\n\n项目背景：\n某市政务云平台承载了全市50+政务系统，涉及政务服务、数据共享等核心业务，需进行等级保护三级测评。\n\n服务内容：\n1. 等级保护定级备案咨询\n2. 安全差距分析\n3. 等级保护测评（三级）\n4. 安全整改建议\n\n项目成果：\n- 完成8个三级系统测评\n- 发现并协助整改安全问题126项\n- 顺利通过公安机关备案审核',
    meta: { '项目金额': '180万元', '项目周期': '2023.03-2023.09', '客户': '某市大数据管理局' },
    inserted: true,
    insertedSectionId: 'section-2-19'
  },
  {
    id: 'em6',
    name: '某银行核心系统等保测评项目',
    type: 'case',
    description: '银行核心业务系统等级保护测评',
    content: '项目名称：某银行核心业务系统等级保护测评\n\n项目背景：\n某股份制银行核心业务系统升级后，需重新进行等级保护测评，确保符合金融行业监管要求。\n\n服务内容：\n1. 等级保护三级测评\n2. 密码应用安全性评估\n3. 渗透测试\n4. 安全加固建议\n\n项目成果：\n- 完成核心银行系统、网银系统、手机银行等5个系统测评\n- 发现高危漏洞23个，已全部整改\n- 测评结论：符合等级保护三级要求',
    meta: { '项目金额': '220万元', '项目周期': '2023.06-2023.12', '客户': '某股份制银行' },
    inserted: false
  },
  {
    id: 'em7',
    name: '张工 - 项目经理',
    type: 'team',
    description: '高级项目经理，PMP认证',
    content: '姓名：张明\n职位：高级项目经理\n工作年限：12年\n\n专业资质：\n- PMP项目管理专业人士\n- CISP注册信息安全专业人员\n- 等级保护测评师（高级）\n\n项目经验：\n- 主导完成50+等级保护测评项目\n- 服务客户涵盖政府、金融、能源、医疗等行业\n- 曾负责某省级政务云平台安全测评项目（合同额500万+）',
    meta: { '学历': '硕士', '职称': '高级工程师' },
    inserted: true,
    insertedSectionId: 'section-3-24'
  },
  {
    id: 'em8',
    name: '李工 - 技术负责人',
    type: 'team',
    description: '技术总监，CISSP认证',
    content: '姓名：李强\n职位：技术总监\n工作年限：15年\n\n专业资质：\n- CISSP国际注册信息系统安全专家\n- CISP-PTE注册渗透测试工程师\n- 等级保护测评师（高级）\n- CISA注册信息系统审计师\n\n技术专长：\n- 网络安全架构设计\n- 渗透测试与漏洞挖掘\n- 安全运营体系建设\n- 应急响应与溯源分析',
    meta: { '学历': '硕士', '职称': '正高级工程师' },
    inserted: true,
    insertedSectionId: 'section-2-19'
  },
  {
    id: 'em9',
    name: '王工 - 高级测评师',
    type: 'team',
    description: '高级测评工程师，CISP认证',
    content: '姓名：王磊\n职位：高级测评工程师\n工作年限：8年\n\n专业资质：\n- CISP注册信息安全专业人员\n- 等级保护测评师（中级）\n- CCSK云安全知识认证\n\n技术专长：\n- 等级保护测评\n- 云安全测评\n- 工控安全测评\n- 密码应用安全评估',
    meta: { '学历': '本科', '职称': '工程师' },
    inserted: false
  },
]);

// Manual uploads (user pasted/typed content in document)
interface ManualUpload {
  id: string;
  name: string;
  preview: string;
  sectionId: string;
  sectionTitle: string;
}

const manualUploads = ref<ManualUpload[]>([
  {
    id: 'mu1',
    name: '项目实施进度计划表',
    preview: '第一阶段：需求调研（15天）\n第二阶段：方案设计（20天）...',
    sectionId: 'section-3-24',
    sectionTitle: '项目方案'
  },
  {
    id: 'mu2',
    name: '应急响应流程说明',
    preview: '当发生安全事件时，按以下流程处理：\n1. 事件发现与上报...',
    sectionId: 'section-3-24',
    sectionTitle: '项目方案'
  },
]);

// Filtered materials based on search
const filteredEnterpriseMaterials = computed(() => {
  if (!materialSearchQuery.value) return enterpriseMaterials.value;
  const query = materialSearchQuery.value.toLowerCase();
  return enterpriseMaterials.value.filter(m =>
    m.name.toLowerCase().includes(query) ||
    m.description.toLowerCase().includes(query)
  );
});

const filteredManualUploads = computed(() => {
  if (!materialSearchQuery.value) return manualUploads.value;
  const query = materialSearchQuery.value.toLowerCase();
  return manualUploads.value.filter(m => m.name.toLowerCase().includes(query));
});

// Get enterprise material stats
const enterpriseMaterialStats = computed(() => {
  const total = enterpriseMaterials.value.length;
  const inserted = enterpriseMaterials.value.filter(m => m.inserted).length;
  return { total, inserted };
});

// Preview enterprise material
const previewingEnterpriseMaterial = ref<EnterpriseMaterial | null>(null);

const previewEnterpriseMaterial = (material: EnterpriseMaterial) => {
  previewingEnterpriseMaterial.value = material;
  showPreviewModal.value = true;
};

// Insert enterprise material
const insertEnterpriseMaterial = (material: EnterpriseMaterial) => {
  const sectionId = activeOutlineId.value;
  const insertContent = material.type === 'team'
    ? `\n\n【项目成员：${material.name}】\n${material.content}`
    : material.type === 'case'
    ? `\n\n【业绩案例：${material.name}】\n${material.content}`
    : `\n\n【${material.name}】\n${material.content}`;

  if (streamingContent.value[sectionId]) {
    streamingContent.value[sectionId] += insertContent;
  } else if (mockContents[sectionId]) {
    mockContents[sectionId] += insertContent;
  } else {
    streamingContent.value[sectionId] = insertContent.trim();
    generatedSections.value.add(sectionId);
  }

  // Mark as inserted
  material.inserted = true;
  material.insertedSectionId = sectionId;
};

// Jump to section from manual upload
const jumpToSection = (sectionId: string) => {
  selectOutline(sectionId);
  activeRightTab.value = 'node';
};

// Get material type icon
const getMaterialTypeIcon = (type: string) => {
  return {
    'cert': '📄',
    'case': '📁',
    'team': '👤',
  }[type] || '📄';
};

// Get section title by id
const getSectionTitleById = (sectionId: string) => {
  for (const section of outlineItems.value) {
    if (section.id === sectionId) return section.title;
    if (section.children) {
      const child = section.children.find(c => c.id === sectionId);
      if (child) return child.title;
    }
  }
  return '';
};

// View all materials
const viewAllMaterials = () => {
  router.push({ name: 'enterprise-material' });
};

// Generate all remaining sections
const generateAllRemaining = async () => {
  const allSections = flattenSections();
  const level2Sections = allSections.filter(s => s.level === 2);
  const remainingSections = level2Sections.filter(s => !generatedSections.value.has(s.id));

  for (const section of remainingSections) {
    await generateSection(section.id);
  }
};

// Regenerate current section
const regenerateCurrentSection = async () => {
  if (activeOutlineId.value && !activeOutlineId.value.startsWith('section-') || activeOutlineId.value.split('-').length === 2) {
    return;
  }
  generatedSections.value.delete(activeOutlineId.value);
  await generateSection(activeOutlineId.value);
};

const goBack = () => {
  router.push({ name: 'bid-doc-form' });
};

const selectOutline = (id: string) => {
  // Mark as manual scrolling to prevent observer from overriding
  isManualScrolling.value = true;
  activeOutlineId.value = id;

  const heading = document.getElementById(id);
  if (heading) {
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Reset manual scrolling flag after animation completes
  setTimeout(() => {
    isManualScrolling.value = false;
  }, 500);
};

// Count remaining sections
const remainingSectionsCount = computed(() => {
  const allSections = flattenSections();
  const level2Sections = allSections.filter(s => s.level === 2);
  return level2Sections.filter(s => !generatedSections.value.has(s.id)).length;
});

const exportWord = () => {
  alert('Word文档已导出');
};

// Flatten sections for content display
const flattenSections = () => {
  const result: OutlineItem[] = [];
  outlineItems.value.forEach(section => {
    result.push(section);
    if (section.children) {
      section.children.forEach(child => result.push(child));
    }
  });
  return result;
};

const allSections = flattenSections();

// Generate content for a section with streaming effect
const generateSection = async (sectionId: string) => {
  generatingSection.value = sectionId;
  streamingContent.value[sectionId] = '';

  const fullContent = getSectionContent(sectionId);
  const chars = fullContent.split('');

  // Simulate streaming output character by character
  for (let i = 0; i < chars.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 15));
    streamingContent.value[sectionId] += chars[i];
  }

  // Sync to user editable content after generation
  userEditedContent.value[sectionId] = streamingContent.value[sectionId];
  generatedSections.value.add(sectionId);
  generatingSection.value = null;
};

// Get content for a section
const getSectionContent = (sectionId: string) => {
  return mockContents[sectionId] || `本节内容已生成完成。

根据招标文件要求，我方对本节内容作出如下响应：

1. 我方完全理解并接受招标文件中的相关要求；
2. 我方具备履行本节要求的能力和资质；
3. 我方承诺按照招标文件规定的标准和要求执行。

投标人：金盾检测技术股份有限公司
日期：2024年1月15日`;
};

// User edited content storage
const userEditedContent = ref<Record<string, string>>({});

// Get editable content for a section
const getEditableContent = (sectionId: string) => {
  // Priority: user edited > streaming > mock
  if (userEditedContent.value[sectionId] !== undefined) {
    return userEditedContent.value[sectionId];
  }
  if (streamingContent.value[sectionId]) {
    return streamingContent.value[sectionId];
  }
  if (generatedSections.value.has(sectionId)) {
    return getSectionContent(sectionId);
  }
  return '';
};

// Update section content from user input
const updateSectionContent = (sectionId: string, content: string) => {
  userEditedContent.value[sectionId] = content;
  // Mark as having content if not empty
  if (content.trim()) {
    generatedSections.value.add(sectionId);
  } else {
    generatedSections.value.delete(sectionId);
  }
};

// Check if section has content
const hasContent = (sectionId: string) => {
  return !!(
    userEditedContent.value[sectionId]?.trim() ||
    streamingContent.value[sectionId]?.trim() ||
    generatedSections.value.has(sectionId)
  );
};

// Track which section is focused
const focusedSection = ref<string | null>(null);

// Handle editor focus - update active outline
const handleEditorFocus = (sectionId: string) => {
  isManualScrolling.value = true;
  activeOutlineId.value = sectionId;
  focusedSection.value = sectionId;
  setTimeout(() => {
    isManualScrolling.value = false;
  }, 100);
};

// Handle editor blur
const handleEditorBlur = () => {
  focusedSection.value = null;
};

// Handle entire document input - sync titles and content with outline
const handleDocumentInput = (event: Event) => {
  const target = event.target as HTMLElement;

  // Sync all h2 titles (level 1)
  const h2Elements = target.querySelectorAll('h2.section-heading');
  h2Elements.forEach((h2) => {
    const id = h2.id;
    const newTitle = h2.textContent?.trim() || '';
    for (const section of outlineItems.value) {
      if (section.id === id) {
        section.title = newTitle;
        break;
      }
    }
  });

  // Sync all h3 titles (level 2)
  const h3Elements = target.querySelectorAll('h3.subsection-heading');
  h3Elements.forEach((h3) => {
    const id = h3.id;
    const newTitle = h3.textContent?.trim() || '';
    for (const section of outlineItems.value) {
      if (section.children) {
        const child = section.children.find(c => c.id === id);
        if (child) {
          child.title = newTitle;
          break;
        }
      }
    }
  });

  // Sync content
  const contentElements = target.querySelectorAll('p.section-content');
  contentElements.forEach((p) => {
    const sectionId = (p as HTMLElement).dataset.sectionId;
    if (sectionId) {
      const content = p.textContent?.trim() || '';
      userEditedContent.value[sectionId] = content;
      if (content) {
        generatedSections.value.add(sectionId);
      } else {
        generatedSections.value.delete(sectionId);
      }
    }
  });
};

// Handle document focus - detect which section is focused
const handleDocumentFocus = () => {
  // Will be enhanced with selection tracking if needed
};
</script>

<template>
  <div class="result-page-fullscreen">
    <!-- Header -->
    <header class="result-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
        </button>
        <div class="header-tag">AI标书生成</div>
        <div class="header-title">信息系统安全等级保护测评（等保2.0）项目投标文件</div>
        <div class="header-status">生成中</div>
      </div>

      <div class="header-right">
        <div class="format-toolbar">
          <button class="toolbar-btn"><Type :size="16" /></button>
          <button class="toolbar-btn"><Undo2 :size="16" /></button>
          <button class="toolbar-btn"><Redo2 :size="16" /></button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn text-btn">H1</button>
          <button class="toolbar-btn text-btn">H2</button>
          <button class="toolbar-btn text-btn">H3</button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn"><Bold :size="16" /></button>
          <button class="toolbar-btn"><Italic :size="16" /></button>
          <button class="toolbar-btn"><Underline :size="16" /></button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn"><Grid3X3 :size="16" /></button>
          <button class="toolbar-btn"><Code :size="16" /></button>
        </div>
        <button class="export-btn" @click="exportWord">
          导出Word
        </button>
      </div>
    </header>

    <div class="result-body">
      <!-- Left Outline Panel -->
      <aside class="outline-panel">
        <h3 class="outline-title">大纲</h3>
        <div class="outline-list">
          <template v-for="item in outlineItems" :key="item.id">
            <div
              class="outline-item level-1"
              :class="{ active: activeOutlineId === item.id }"
              @click="selectOutline(item.id)"
            >
              {{ item.title }}
            </div>
            <template v-if="item.children">
              <div
                v-for="sub in item.children"
                :key="sub.id"
                class="outline-item level-2"
                :class="{ active: activeOutlineId === sub.id }"
                @click="selectOutline(sub.id)"
              >
                {{ sub.title }}
              </div>
            </template>
          </template>
        </div>
      </aside>

      <!-- Center Content Panel -->
      <main class="content-panel">
        <div class="document-container">
          <div class="document-wrapper">
            <div
              class="skeleton-content"
              contenteditable="true"
              @input="handleDocumentInput"
              @focus="handleDocumentFocus"
            >
              <!-- Sections rendered as HTML structure -->
              <template v-for="section in allSections" :key="section.id">
                <!-- Level 1 Section -->
                <h2 v-if="section.level === 1" :id="section.id" class="section-heading">{{ section.title }}</h2>

                <!-- Level 2 Section -->
                <template v-else>
                  <div class="section-block" :class="{ 'is-active': activeOutlineId === section.id }">
                    <h3 :id="section.id" class="subsection-heading">{{ section.title }}</h3>
                    <p class="section-content" :data-section-id="section.id">{{ getEditableContent(section.id) || '' }}</p>
                    <!-- AI button inside section block -->
                    <button
                      v-if="activeOutlineId === section.id && !hasContent(section.id) && !generatingSection"
                      class="section-ai-btn"
                      contenteditable="false"
                      @click.prevent.stop="generateSection(section.id)"
                    >
                      <Sparkles :size="14" />
                      AI生成
                    </button>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </main>

      <!-- Right AI Tools Panel - Resizable -->
      <div class="resize-handle" @mousedown="startResize"></div>
      <aside class="ai-tools-panel" :style="{ width: rightPanelWidth + 'px' }">
        <!-- Tab Header -->
        <div class="panel-tabs">
          <button
            class="panel-tab"
            :class="{ active: activeRightTab === 'node' }"
            @click="activeRightTab = 'node'"
          >
            <MapPin :size="14" />
            当前节点
          </button>
          <button
            class="panel-tab"
            :class="{ active: activeRightTab === 'materials' }"
            @click="activeRightTab = 'materials'"
          >
            <Package :size="14" />
            素材管理
          </button>
        </div>

        <!-- Tab Content: 当前节点 -->
        <div v-if="activeRightTab === 'node'" class="tab-content">
          <!-- Current Node -->
          <div class="tool-section current-node-section">
            <div class="current-node-name">{{ currentSection?.title || '请选择节点' }}</div>
          </div>

          <!-- Scoring Points -->
          <div class="tool-section">
            <div class="section-header">
              <Lightbulb :size="16" class="section-icon yellow" />
              <span class="section-title">评分要点</span>
              <span class="completion-badge" v-if="completionStats.total > 0">
                {{ completionStats.completed }}/{{ completionStats.total }}
              </span>
              <button
                class="ai-detect-btn"
                :disabled="isDetecting"
                @click="detectScoringPoints"
              >
                <Loader2 v-if="isDetecting" :size="14" class="spinning" />
                <ScanSearch v-else :size="14" />
                {{ isDetecting ? '检测中...' : 'AI检测' }}
              </button>
            </div>
            <div class="scoring-points-list">
              <div
                v-for="(point, index) in currentScoringPoints"
                :key="index"
                class="scoring-point-item"
                :class="{ completed: isPointCompleted(activeOutlineId, index) }"
                @click="toggleScoringPoint(activeOutlineId, index)"
              >
                <CheckCircle2
                  v-if="isPointCompleted(activeOutlineId, index)"
                  :size="16"
                  class="point-icon completed"
                />
                <Circle v-else :size="16" class="point-icon" />
                <span class="point-text">{{ point }}</span>
              </div>
            </div>
          </div>

          <!-- Recommended Materials -->
          <div class="tool-section">
            <div class="section-header">
              <Package :size="16" class="section-icon purple" />
              <span class="section-title">推荐素材</span>
            </div>
            <div v-if="currentMaterials.length > 0" class="materials-list">
              <div v-for="(material, index) in currentMaterials" :key="index" class="material-item">
                <div class="material-info">
                  <span class="material-icon">{{ material.icon }}</span>
                  <span class="material-name">{{ material.name }}</span>
                </div>
                <div class="material-actions">
                  <button
                    class="material-action-btn"
                    :class="{ inserted: isMaterialInserted(material) }"
                    :disabled="isMaterialInserted(material)"
                    @click="insertMaterial(material)"
                  >
                    <Plus :size="12" />
                    {{ isMaterialInserted(material) ? '已插入' : '插入' }}
                  </button>
                  <button class="material-action-btn" @click="previewMaterial(material)">
                    <Eye :size="12" />
                    预览
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="no-materials">
              <span class="no-materials-text">本节暂无推荐素材</span>
            </div>
          </div>

          <!-- AI Edit Actions -->
          <div class="tool-section">
            <div class="section-header">
              <Pencil :size="16" class="section-icon green" />
              <span class="section-title">AI编辑</span>
              <span v-if="!isCurrentSectionGenerated" class="disabled-hint">（生成后可用）</span>
            </div>
            <div class="ai-edit-grid">
              <button
                class="ai-edit-btn"
                :disabled="!isCurrentSectionGenerated"
                @click="handleAIEdit('改写')"
              >
                改写
              </button>
              <button
                class="ai-edit-btn"
                :disabled="!isCurrentSectionGenerated"
                @click="handleAIEdit('扩写')"
              >
                扩写
              </button>
              <button
                class="ai-edit-btn"
                :disabled="!isCurrentSectionGenerated"
                @click="handleAIEdit('缩写')"
              >
                缩写
              </button>
              <button
                class="ai-edit-btn"
                :disabled="!isCurrentSectionGenerated"
                @click="handleAIEdit('翻译')"
              >
                翻译
              </button>
            </div>
          </div>

          <!-- Batch Operations -->
          <div class="tool-section">
            <div class="section-header">
              <RotateCcw :size="16" class="section-icon orange" />
              <span class="section-title">批量操作</span>
            </div>
            <div class="batch-actions">
              <button
                class="batch-btn primary"
                :disabled="isAnyGenerating || remainingSectionsCount === 0"
                @click="generateAllRemaining"
              >
                <Play :size="14" />
                生成剩余全部
                <span v-if="remainingSectionsCount > 0" class="remaining-count">（{{ remainingSectionsCount }}节）</span>
              </button>
              <button
                class="batch-btn secondary"
                :disabled="isAnyGenerating || !isCurrentSectionGenerated"
                @click="regenerateCurrentSection"
              >
                <RotateCcw :size="14" />
                重新生成本节
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content: 素材管理 -->
        <div v-else class="tab-content">
          <!-- Search -->
          <div class="material-search-box">
            <Search :size="14" class="search-icon" />
            <input
              v-model="materialSearchQuery"
              type="text"
              placeholder="搜索素材..."
              class="search-input"
            />
          </div>

          <!-- 企业素材库 (AI推荐) -->
          <div class="tool-section">
            <div class="section-header">
              <Award :size="16" class="section-icon blue" />
              <span class="section-title">企业素材库</span>
              <span class="material-count">{{ enterpriseMaterialStats.inserted }}/{{ enterpriseMaterialStats.total }} 已插入</span>
            </div>
            <p class="section-hint">AI 根据招标要求自动推荐的企业素材</p>
            <div v-if="filteredEnterpriseMaterials.length > 0" class="enterprise-materials-list">
              <div
                v-for="em in filteredEnterpriseMaterials"
                :key="em.id"
                class="enterprise-material-item"
                :class="{ inserted: em.inserted }"
              >
                <div class="em-icon">{{ getMaterialTypeIcon(em.type) }}</div>
                <div class="em-content">
                  <div class="em-name">{{ em.name }}</div>
                  <div class="em-desc">{{ em.description }}</div>
                  <div v-if="em.inserted" class="em-location">
                    已插入至：<span class="location-link" @click="jumpToSection(em.insertedSectionId || '')">{{ getSectionTitleById(em.insertedSectionId || '') }}</span>
                  </div>
                </div>
                <div class="em-actions">
                  <button
                    v-if="!em.inserted"
                    class="em-action-btn insert"
                    @click="insertEnterpriseMaterial(em)"
                  >
                    <Plus :size="12" />
                    插入
                  </button>
                  <span v-else class="em-inserted-badge">
                    <CheckCircle2 :size="12" />
                    已插入
                  </span>
                  <button class="em-action-btn preview" @click="previewEnterpriseMaterial(em)">
                    <Eye :size="12" />
                    预览
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="no-materials">
              <span class="no-materials-text">未找到匹配的素材</span>
            </div>
          </div>

          <!-- 手动上传 (用户添加到文档的内容) -->
          <div class="tool-section">
            <div class="section-header">
              <FileText :size="16" class="section-icon green" />
              <span class="section-title">手动上传</span>
              <span class="material-count">{{ filteredManualUploads.length }}</span>
            </div>
            <p class="section-hint">您在文档中手动添加的内容片段</p>
            <div v-if="filteredManualUploads.length > 0" class="manual-uploads-list">
              <div
                v-for="mu in filteredManualUploads"
                :key="mu.id"
                class="manual-upload-item"
              >
                <div class="mu-icon">
                  <Pencil :size="14" />
                </div>
                <div class="mu-content">
                  <div class="mu-name">{{ mu.name }}</div>
                  <div class="mu-preview">{{ mu.preview }}</div>
                  <div class="mu-location">
                    位于：<span class="location-link" @click="jumpToSection(mu.sectionId)">{{ mu.sectionTitle }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-materials">
              <span class="no-materials-text">暂无手动上传的内容</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Material Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click.self="closePreviewModal">
      <div class="preview-modal">
        <div class="modal-header">
          <div class="modal-title-row">
            <span class="modal-type-tag">{{ previewingMaterial?.type }}</span>
            <h3 class="modal-title">{{ previewingMaterial?.name }}</h3>
          </div>
          <button class="modal-close-btn" @click="closePreviewModal">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">{{ previewingMaterial?.description }}</p>
          <div class="modal-content">
            <pre>{{ previewingMaterial?.content }}</pre>
          </div>
          <div v-if="previewingMaterial?.meta" class="modal-meta">
            <div v-for="(value, key) in previewingMaterial.meta" :key="key" class="meta-item">
              <span class="meta-label">{{ key }}：</span>
              <span class="meta-value">{{ value }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn secondary" @click="closePreviewModal">关闭</button>
          <button
            class="modal-btn primary"
            :disabled="isMaterialInserted({ type: 'cert', name: previewingMaterial?.name || '', icon: '' })"
            @click="insertMaterial({ type: 'cert', name: previewingMaterial?.name || '', icon: '' }); closePreviewModal()"
          >
            插入到当前节点
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  z-index: 100;
}

/* Header */
.result-header {
  display: flex;
  height: 54px;
  background: white;
  border-bottom: 1px solid #e8ecf1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: #eef4ff;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 10px 20px;
  background: #eef4ff;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #eef4ff;
  border: none;
  border-radius: 10px;
  color: #4b83f0;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dde9ff;
}

.header-tag {
  padding: 6px 14px;
  background: white;
  color: #4b83f0;
  border: 1px solid #4b83f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.header-title {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 400;
}

.header-status {
  color: #999;
  font-size: 13px;
}

.format-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn.text-btn {
  font-size: 13px;
  font-weight: 600;
  width: auto;
  padding: 0 8px;
}

.toolbar-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.toolbar-divider {
  width: 1px;
  height: 16px;
  background: #e0e0e0;
  margin: 0 6px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #4b83f0;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 16px;
}

.export-btn:hover {
  background: #3a6fd8;
}

/* Body Layout */
.result-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Outline Panel */
.outline-panel {
  width: 340px;
  background: white;
  border-right: 1px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.outline-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 20px 24px 16px;
  margin: 0;
}

.outline-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 20px;
}

.outline-item {
  padding: 12px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.6;
  margin-bottom: 2px;
}

.outline-item:hover {
  background: #f8f9fb;
}

.outline-item.active {
  background: #eef4ff;
  color: #4b83f0;
}

.outline-item.level-1 {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 14px;
}

.outline-item.level-2 {
  padding-left: 28px;
  font-size: 13px;
  color: #666;
}

/* Content Panel */
.content-panel {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
  background: #f5f7fa;
}

.document-container {
  max-width: 820px;
  margin: 0 auto;
}

.document-wrapper {
  position: relative;
}

.skeleton-content {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 48px 56px;
  min-height: 800px;
  outline: none;
  line-height: 1.8;
}

/* Section Headings */
.section-heading {
  font-size: 18px;
  font-weight: 700;
  margin: 40px 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #4b83f0;
  color: #1a1a1a;
}

.section-heading:first-child {
  margin-top: 0;
}

.subsection-heading {
  font-size: 15px;
  font-weight: 600;
  margin: 24px 0 8px 0;
  color: #1a1a1a;
}

.section-block {
  position: relative;
}

.section-content {
  font-size: 14px;
  color: #333;
  margin: 0 0 20px 0;
  min-height: 1.5em;
  white-space: pre-wrap;
}

.section-content:empty::before {
  content: '在此输入内容...';
  color: #c4c9cf;
}

/* AI button inside section */
.section-ai-btn {
  position: absolute;
  bottom: 24px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #4b83f0 0%, #7c3aed 100%);
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(75, 131, 240, 0.3);
}

.section-ai-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(75, 131, 240, 0.4);
}

/* Document wrapper for floating button */
.document-wrapper {
  position: relative;
}

.section-content.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-content.generating {
  min-height: auto;
  padding: 0;
  background: none;
  border: none;
}

.streaming-text {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #4b83f0;
  margin-left: 2px;
  animation: blink 0.8s infinite;
  vertical-align: text-bottom;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.section-content.generated {
  min-height: auto;
  padding: 0;
}

.generated-text {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}

/* Word-like Editable Content Area */
.section-content-wrapper {
  position: relative;
  min-height: 120px;
}

.content-area {
  min-height: 100px;
  padding: 16px 0;
  padding-bottom: 20px;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  outline: none;
  white-space: pre-wrap;
  word-break: break-word;
  border: none;
  background: transparent;
}

.content-area:empty::before,
.content-area:not(.has-content)::before {
  content: attr(data-placeholder);
  color: #c4c9cf;
  pointer-events: none;
}

.content-area.has-content::before {
  content: none;
}

.content-area.generating {
  background: transparent;
}

.floating-ai-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #4b83f0 0%, #7c3aed 100%);
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.9;
  box-shadow: 0 2px 8px rgba(75, 131, 240, 0.3);
}

.floating-ai-btn:hover:not(:disabled) {
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(75, 131, 240, 0.4);
}

.floating-ai-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.doc-edit-btn {
  position: absolute;
  top: 48px;
  right: -40px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
}

.doc-edit-btn:hover {
  color: #4b83f0;
  border-color: #4b83f0;
}

/* AI Tools Panel - Redesigned */
.ai-tools-panel {
  width: 320px;
  min-width: 280px;
  max-width: 480px;
  background: white;
  border-left: 1px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

/* Resize Handle */
.resize-handle {
  width: 4px;
  cursor: col-resize;
  background: transparent;
  transition: background 0.2s;
  flex-shrink: 0;
  position: relative;
}

.resize-handle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 40px;
  background: #e2e8f0;
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.resize-handle:hover {
  background: #e2e8f0;
}

.resize-handle:hover::after {
  opacity: 1;
}

/* Panel Tabs */
.panel-tabs {
  display: flex;
  border-bottom: 1px solid #e8ecf1;
  background: #f8fafc;
  flex-shrink: 0;
}

.panel-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 12px;
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.panel-tab:hover {
  color: #4b83f0;
  background: #f0f7ff;
}

.panel-tab.active {
  color: #4b83f0;
  background: white;
  border-bottom-color: #4b83f0;
}

/* Tab Content */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Current Node Section - simplified */
.current-node-section {
  background: #f8fafc;
  margin: -20px -20px 20px -20px;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf1;
}

.current-node-name {
  font-size: 15px;
  font-weight: 500;
  color: #4b83f0;
  padding: 10px 14px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* Material Search */
.material-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 20px;
}

.material-search-box .search-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.material-search-box .search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #334155;
}

.material-search-box .search-input::placeholder {
  color: #94a3b8;
}

/* Material Count Badge */
.material-count {
  margin-left: auto;
  padding: 2px 8px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

/* Document Materials List */
.document-materials-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.document-material-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.dm-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.dm-content {
  flex: 1;
  min-width: 0;
}

.dm-name {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dm-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.dm-source-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.dm-source-tag.ai {
  background: #eef4ff;
  color: #4b83f0;
}

.dm-source-tag.manual {
  background: #f0fdf4;
  color: #16a34a;
}

.dm-location {
  font-size: 11px;
  color: #64748b;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dashed;
}

.dm-location:hover {
  color: #4b83f0;
}

.dm-remove-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.dm-remove-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #ef4444;
}

/* Section Hint */
.section-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: -8px 0 12px 0;
  line-height: 1.4;
}

/* Enterprise Materials List */
.enterprise-materials-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.enterprise-material-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.enterprise-material-item:hover {
  border-color: #cbd5e1;
}

.enterprise-material-item.inserted {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.em-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.em-content {
  flex: 1;
  min-width: 0;
}

.em-name {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 4px;
}

.em-desc {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
  line-height: 1.4;
}

.em-location {
  font-size: 11px;
  color: #16a34a;
}

.em-location .location-link {
  text-decoration: underline;
  text-decoration-style: dashed;
  cursor: pointer;
}

.em-location .location-link:hover {
  color: #15803d;
}

.em-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.em-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 11px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.em-action-btn.insert:hover {
  border-color: #4b83f0;
  color: #4b83f0;
  background: #f0f7ff;
}

.em-action-btn.preview:hover {
  border-color: #64748b;
  background: #f8fafc;
}

.em-inserted-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #dcfce7;
  border-radius: 4px;
  font-size: 11px;
  color: #16a34a;
}

/* Manual Uploads List */
.manual-uploads-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.manual-upload-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.mu-icon {
  width: 28px;
  height: 28px;
  background: #f0fdf4;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  flex-shrink: 0;
}

.mu-content {
  flex: 1;
  min-width: 0;
}

.mu-name {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 4px;
}

.mu-preview {
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mu-location {
  font-size: 11px;
  color: #64748b;
}

.mu-location .location-link {
  color: #4b83f0;
  text-decoration: underline;
  text-decoration-style: dashed;
  cursor: pointer;
}

.mu-location .location-link:hover {
  color: #2563eb;
}

/* Fragment List */
.fragment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.fragment-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.fragment-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.fragment-content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fragment-name {
  font-size: 13px;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fragment-type-tag {
  padding: 2px 6px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 4px;
  font-size: 10px;
  flex-shrink: 0;
}

.fragment-insert-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.fragment-insert-btn:hover {
  border-color: #4b83f0;
  color: #4b83f0;
  background: #f0f7ff;
}

.add-fragment-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.add-fragment-btn:hover {
  border-color: #4b83f0;
  color: #4b83f0;
  background: #f0f7ff;
}

.tool-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.tool-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-icon {
  flex-shrink: 0;
}

.section-icon.blue { color: #4b83f0; }
.section-icon.purple { color: #9b59b6; }
.section-icon.yellow { color: #f59e0b; }
.section-icon.green { color: #10b981; }
.section-icon.orange { color: #f97316; }

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.disabled-hint {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
}

/* Current Node */
.current-node-section {
  background: #f8fafc;
  margin: -20px -20px 20px -20px;
  padding: 20px;
  border-bottom: 1px solid #e8ecf1;
}

.current-node-name {
  font-size: 15px;
  font-weight: 500;
  color: #4b83f0;
  padding: 10px 14px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* Scoring Points */
.scoring-points-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scoring-point-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.scoring-point-item:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.scoring-point-item.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.scoring-point-item.completed .point-text {
  color: #16a34a;
}

.point-icon {
  flex-shrink: 0;
  color: #cbd5e1;
}

.point-icon.completed {
  color: #16a34a;
}

.point-text {
  flex: 1;
  line-height: 1.4;
}

.completion-badge {
  padding: 2px 8px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

/* AI Detect Button */
.ai-detect-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 4px 10px;
  background: linear-gradient(135deg, #4b83f0 0%, #7c3aed 100%);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-detect-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.ai-detect-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.point-text {
  flex: 1;
}

/* Materials */
.materials-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.material-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.material-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.material-icon {
  font-size: 16px;
}

.material-name {
  font-size: 13px;
  color: #333;
  flex: 1;
}

.material-actions {
  display: flex;
  gap: 8px;
}

.material-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.material-action-btn:hover {
  border-color: #4b83f0;
  color: #4b83f0;
}

.no-materials {
  padding: 20px;
  text-align: center;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 12px;
}

.no-materials-text {
  font-size: 13px;
  color: #94a3b8;
}

.view-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  border-color: #4b83f0;
  color: #4b83f0;
}

/* AI Edit */
.ai-edit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ai-edit-btn {
  padding: 10px 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-edit-btn:hover:not(:disabled) {
  border-color: #4b83f0;
  color: #4b83f0;
  background: #f0f7ff;
}

.ai-edit-btn:disabled {
  background: #f8fafc;
  color: #cbd5e1;
  cursor: not-allowed;
}

/* Batch Actions */
.batch-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.batch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.batch-btn.primary {
  background: #4b83f0;
  border: none;
  color: white;
}

.batch-btn.primary:hover:not(:disabled) {
  background: #3b6fd8;
}

.batch-btn.primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.batch-btn.secondary {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.batch-btn.secondary:hover:not(:disabled) {
  border-color: #4b83f0;
  color: #4b83f0;
}

.batch-btn.secondary:disabled {
  background: #f8fafc;
  color: #cbd5e1;
  cursor: not-allowed;
}

.remaining-count {
  font-weight: 400;
  opacity: 0.9;
}

/* Inserted state for material button */
.material-action-btn.inserted {
  background: #f0fdf4;
  border-color: #10b981;
  color: #10b981;
  cursor: default;
}

.material-action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-modal {
  background: white;
  border-radius: 12px;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e8ecf1;
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-type-tag {
  padding: 4px 10px;
  background: #eef4ff;
  color: #4b83f0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
}

.modal-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
}

.modal-content {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.modal-content pre {
  margin: 0;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px 16px;
  background: #fffbeb;
  border-radius: 8px;
}

.meta-item {
  font-size: 13px;
}

.meta-label {
  color: #92400e;
  font-weight: 500;
}

.meta-value {
  color: #78350f;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e8ecf1;
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.secondary {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.modal-btn.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.modal-btn.primary {
  background: #4b83f0;
  border: none;
  color: white;
}

.modal-btn.primary:hover:not(:disabled) {
  background: #3b6fd8;
}

.modal-btn.primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>
