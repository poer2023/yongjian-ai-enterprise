<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertInchesToTwip
} from 'docx';
import {
  ChevronLeft,
  FileSearch,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  Building2,
  DollarSign,
  Users,
  FileText,
  Award,
  Clock,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  ClipboardCheck,
  ListChecks
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';
import type { DocumentSection } from './types';
import {
  initialMaterials as enterpriseMaterials,
  initialFiles as enterpriseSourceFiles,
} from '../enterprise-material/mockData';
import {
  projectInfo as mockProjectInfo,
  qualifications as mockQualifications,
  scoreStandards as mockScoreStandards,
  timeline as mockTimeline,
  matchAssessment as mockMatchAssessment,
  suggestions as mockSuggestions,
  performanceRequirements as mockPerformanceRequirements,
  teamRequirements as mockTeamRequirements,
  commitmentRequirements as mockCommitmentRequirements,
  disqualificationItems as mockDisqualificationItems,
  actionPlan as mockActionPlan,
  documentSections as mockDocumentSections
} from './mockData';

const router = useRouter();
const route = useRoute();

const bidTitle = route.query.title as string || 'XX市政府信息系统安全等级保护测评服务项目';

interface MatchedEvidenceItem {
  materialId: string;
  sourceFileId: number;
  typeLabel: string;
  matchLabel: string;
  sourceFileName: string;
}

interface RequirementMatchRow {
  id: string;
  dimension: '企业资质' | '人员证书' | '政务案例' | '技术能力';
  requirement: string;
  statusLabel: string;
  statusTone: 'match' | 'missing';
  matchedText: string;
  evidence: MatchedEvidenceItem | null;
}

// AI Analysis Report Text
const analysisReport = ref(`**【核心结论】本项目与我司核心能力高度契合，具备较强竞争优势，建议积极参与投标。**

**一、项目背景与需求分析**

本项目采购方为XX市政务服务中心，项目预算50万元，采用公开招标方式。要求投标人具备等级保护测评资质、ISO27001信息安全管理体系认证，并需提供3年内至少3个同类项目业绩。从招标文件看，采购方对测评机构的专业能力、技术方案的科学性以及服务质量的稳定性有较高要求，这与当前政府机构对信息安全工作日益重视的大背景相符。

项目的核心难点在于三个方面：首先是技术方案的完整性和先进性，需要投标人展示成熟的测评方法论和工具体系；其次是业绩证明的充分性，要求提供政府类同类项目案例，且需附带客户评价；第三是团队配置的专业性，项目负责人需持有CISP证书，测评团队需具备相应的技术资质和实战经验。这三个方面构成了本次投标的主要门槛，也是评标过程中的核心考量因素。

**二、我司核心竞争优势**

金盾检测作为专业的第三方检测机构，在本项目中具备显著的竞争优势。

首先，我司拥有完整的资质体系。公司持有CMA中国计量认证、CNAS实验室认可以及CATL建设工程质量检测机构资质，完全满足招标文件对等级保护测评资质和ISO27001认证的要求。这些权威认证不仅是准入门槛，更是我司专业能力的有力证明，能够在资格审查阶段确保顺利通过。

其次，在业绩方面，我司近五年累计完成各类检测项目超过15000项，其中包括大量政府机构和大型央企的信息安全测评项目。我们曾为北京市政府、上海市住建委等政府部门提供过等级保护测评服务，并在北京大兴国际机场配套工程、雄安新区市政基础设施等国家重点工程中承担检测任务。这些高质量的项目经验完全符合招标文件对"3年内至少3个同类项目业绩"的要求，且项目规模和客户层级均具有较强的说服力，在业绩评分中将占据明显优势。

第三，技术实力是我司的核心优势。公司配备价值超过8000万元的先进检测设备，包括电子万能试验机、X射线衍射仪、气相色谱质谱联用仪等高精度仪器300余台套，能够为信息系统安全测评提供全面的技术支撑。同时，我司自主研发的"智能检测数据管理系统"实现了检测流程全程数字化管理，大幅提升了测评效率和数据追溯能力，这在技术方案评分中将是重要的加分项。

第四，团队配置方面，我司拥有120余名专业技术人员，其中高级工程师18人、注册结构工程师5人、注册岩土工程师3人，80%以上人员具有本科及以上学历。我们可以为本项目配置持有CISP证书的项目负责人，并组建包括高级测评师在内的专业团队，确保项目实施的专业性和稳定性。团队成员在政府信息系统测评领域积累了丰富的实战经验，能够准确把握政府机构的特殊需求和安全要求。

**三、投标策略建议**

基于以上分析，我们建议采取以下投标策略。

在技术方案编制上，应重点突出我司的方法论优势和工具体系。建议详细阐述我司在等级保护测评领域的技术积累，包括测评流程的标准化、测评工具的智能化以及数据管理的数字化，展示我司在技术方案完整性和先进性方面的领先地位。同时，可以结合以往政府类项目的成功案例，说明我司对政府信息系统特点的深刻理解和丰富的实战经验。技术方案应当体现出对本项目具体需求的精准把握，避免泛泛而谈，要有针对性地提出解决方案。

在业绩证明方面，建议精选5个最具代表性的政府类等级保护测评项目，重点突出项目规模、服务质量和客户评价。可以提供北京市政府、上海市住建委等权威客户的推荐信或评价材料，增强业绩的说服力。同时，应详细说明这些项目的测评范围、技术难点和解决方案，展示我司的专业能力。业绩材料要做到真实可查、证据充分，避免因材料不全或真实性存疑而失分。

在团队配置上，建议配置经验丰富的项目负责人和高级测评师，并在投标文件中详细列出团队成员的资质证书、项目经验和技术专长。可以强调团队的稳定性和协作能力，说明我司完善的人才培养体系和质量管理体系，确保项目实施的可靠性。人员配置要与项目规模相匹配，既要体现专业性，又要避免过度配置导致成本过高。

在报价策略上，考虑到项目预算为50万元，建议报价控制在40-45万元之间，既体现合理的性价比，又避免因报价过低引起质疑。可以在报价说明中详细列出成本构成，包括人员投入、设备使用、差旅费用等，增强报价的透明度和合理性。报价应当充分考虑项目实施的实际成本，确保在中标后能够保质保量完成项目，避免因成本控制不当影响服务质量。

**四、风险提示与应对**

需要注意的是，本项目的竞争可能较为激烈，其他具备等级保护测评资质的机构也可能参与投标。因此，我们需要在投标文件中充分展示我司的差异化优势，特别是在技术方案的创新性、业绩案例的权威性和团队配置的专业性方面，形成明显的竞争优势。

此外，招标文件要求项目负责人持有CISP证书，我们需要提前确认人员安排，确保投标文件中的人员配置真实可靠。同时，应准备充分的资质证明材料，包括等级保护测评资质证书、ISO27001认证证书、业绩合同和验收报告等，确保投标文件的完整性和规范性。投标文件的编制要严格按照招标文件要求，避免因格式不规范或材料缺失导致废标。

在时间安排上，需要注意招标文件规定的各个时间节点，特别是答疑截止时间和投标截止时间，确保在规定时间内完成投标文件的编制和递交。建议提前准备，预留充足的时间进行内部审核和修改完善，避免因时间紧张导致投标文件质量不高。

**五、综合评估**

综合来看，本项目与金盾检测的核心业务高度契合，我司在资质、业绩、技术和团队等方面均具备显著优势，项目中标概率较高。建议公司高度重视本项目，组织精干力量编制高质量的投标文件，充分展示我司的专业能力和服务优势，力争成功中标。

同时，本项目的成功实施将进一步提升我司在政府信息安全测评领域的品牌影响力，为后续业务拓展奠定良好基础。政府类项目具有较强的示范效应，成功案例将有助于我司在同类市场中建立口碑，吸引更多优质客户。因此，无论从短期收益还是长期发展来看，本项目都具有重要的战略意义，值得我司全力以赴争取。`);

// Use mock data
const projectInfo = ref(mockProjectInfo);
const qualifications = ref(mockQualifications);
const scoreStandards = ref(mockScoreStandards);
const timeline = ref(mockTimeline);
const matchAssessment = ref(mockMatchAssessment);
const suggestions = ref(mockSuggestions);
const performanceRequirements = ref(mockPerformanceRequirements);
const teamRequirements = ref(mockTeamRequirements);
const commitmentRequirements = ref(mockCommitmentRequirements);
const disqualificationItems = ref(mockDisqualificationItems);
const actionPlan = ref(mockActionPlan);
const documentSections = ref<DocumentSection[]>(mockDocumentSections);

const materialTextIndex = (material: typeof enterpriseMaterials[number]) => {
  const keyInfoText = material.keyInfo.map((item) => `${item.key}${item.value}`).join(' ');
  return `${material.name} ${material.summary} ${material.fullText ?? ''} ${keyInfoText}`;
};

const materialIncludes = (material: typeof enterpriseMaterials[number], keyword: string) => {
  return materialTextIndex(material).includes(keyword);
};

const findMaterialsByKeywords = (keywords: string[]) => {
  return enterpriseMaterials.filter((material) =>
    keywords.some((keyword) => materialIncludes(material, keyword))
  );
};

const formatChineseList = (items: string[]) => {
  return items.filter(Boolean).join('、');
};

const certificateEvidenceMaterials = computed(() =>
  enterpriseMaterials.filter((material) => material.category === 'certificate' || material.category === 'honor')
);

const teamEvidenceMaterials = computed(() =>
  enterpriseMaterials.filter((material) => material.category === 'team')
);

const relevantCaseMaterials = computed(() =>
  enterpriseMaterials.filter((material) =>
    material.category === 'case' &&
    ['政务', '公共资源交易', '不动产', '城管'].some((keyword) => materialIncludes(material, keyword))
  )
);

const softwareCopyrightCount = computed(() =>
  enterpriseMaterials.filter(
    (material) => material.category === 'certificate' && material.name.includes('著作权')
  ).length
);

const enterpriseEvidenceLabels = computed(() => {
  const labels: string[] = [];

  if (findMaterialsByKeywords(['营业执照']).length) {
    labels.push('营业执照及5000万元注册资本信息');
  }
  if (findMaterialsByKeywords(['ISO9001']).length) {
    labels.push('ISO9001质量管理体系认证');
  }
  if (findMaterialsByKeywords(['高新技术企业']).length) {
    labels.push('高新技术企业认定');
  }
  if (findMaterialsByKeywords(['ISO27001']).length) {
    labels.push('ISO27001信息安全管理体系信息');
  }
  if (findMaterialsByKeywords(['CMMI3']).length) {
    labels.push('CMMI3级认证信息');
  }
  if (softwareCopyrightCount.value > 0) {
    labels.push(`${softwareCopyrightCount.value}项软件著作权佐证`);
  }

  return labels;
});

const teamEvidenceLabels = computed(() =>
  teamEvidenceMaterials.value
    .map((material) => {
      const certification = material.keyInfo.find(
        (item) => item.key === '资质认证' || item.key === '认证'
      )?.value;
      const memberName = material.name.split(' - ')[0] ?? material.name;
      return certification ? `${memberName}的${certification}` : '';
    })
    .filter(Boolean)
);

const missingCriticalEvidence = computed(() => {
  const missing: string[] = [];

  if (!findMaterialsByKeywords(['等级保护测评机构资质', '等保测评资质']).length) {
    missing.push('等级保护测评资质证书');
  }
  if (!findMaterialsByKeywords(['ISO27001认证证书扫描件', 'ISO27001信息安全管理体系认证证书']).length) {
    missing.push('ISO27001证书扫描件');
  }
  if (!findMaterialsByKeywords(['CISP证书']).length) {
    missing.push('项目负责人CISP证书');
  }
  if (!findMaterialsByKeywords(['CISP-PTE', 'CISP-PTS']).length) {
    missing.push('高级测评师CISP-PTE/PTS证书');
  }

  return missing;
});

const enterpriseQualificationScore = computed(() => {
  let score = 0;

  if (findMaterialsByKeywords(['营业执照']).length) score += 2;
  if (findMaterialsByKeywords(['5000万元']).length) score += 1;
  if (findMaterialsByKeywords(['ISO9001']).length) score += 2;
  if (findMaterialsByKeywords(['高新技术企业']).length) score += 1;
  if (findMaterialsByKeywords(['ISO27001']).length) score += 1;
  if (findMaterialsByKeywords(['CMMI3']).length) score += 1;
  if (softwareCopyrightCount.value >= 5) score += 1;
  if (relevantCaseMaterials.value.length >= 3) score += 2;

  return {
    current: score,
    potential: Math.min(score + 4, 15),
    total: 15,
  };
});

const teamEvidenceScore = computed(() => {
  let score = 0;

  if (teamEvidenceLabels.value.length >= 4) score += 2;
  if (findMaterialsByKeywords(['PMP']).length) score += 2;
  if (findMaterialsByKeywords(['PRINCE2']).length) score += 1;
  if (findMaterialsByKeywords(['系统架构设计师']).length) score += 2;
  if (findMaterialsByKeywords(['NPDP']).length) score += 1;
  if (findMaterialsByKeywords(['ISO9001内审员']).length) score += 1;
  if (findMaterialsByKeywords(['CMMI评估师']).length) score += 1;
  if (findMaterialsByKeywords(['30+大型项目']).length) score += 2;

  return {
    current: Math.min(score, 15),
    potential: Math.min(score + 3, 15),
    total: 15,
  };
});

const successRateEstimate = computed(() => {
  const current = Math.min(
    95,
    Math.round(
      60 +
      enterpriseQualificationScore.value.current * 0.8 +
      teamEvidenceScore.value.current * 0.7 +
      Math.min(relevantCaseMaterials.value.length, 5) -
      missingCriticalEvidence.value.length * 1.5
    )
  );

  return {
    current,
    potential: Math.min(95, current + 10),
  };
});

const caseEvidenceScore = computed(() => {
  const current = Math.min(relevantCaseMaterials.value.length * 2, 10);

  return {
    current,
    potential: Math.min(current + 1, 10),
    total: 10,
  };
});

const technicalCapabilityScore = computed(() => {
  let score = 0;

  if (findMaterialsByKeywords(['智能招投标分析平台']).length) score += 4;
  if (findMaterialsByKeywords(['AI智能文档处理系统']).length) score += 3;
  if (findMaterialsByKeywords(['NLP', '知识图谱', '低代码平台']).length) score += 3;

  return {
    current: Math.min(score, 10),
    potential: 10,
    total: 10,
  };
});

const getMatchSignal = (ratio: number) => {
  if (ratio >= 0.8) {
    return { label: '高匹配', tone: 'green' as const };
  }
  if (ratio >= 0.6) {
    return { label: '需补强', tone: 'yellow' as const };
  }
  return { label: '风险高', tone: 'red' as const };
};

const scoreSummaryRows = computed(() => [
  {
    dimension: '企业资质',
    ...getMatchSignal(enterpriseQualificationScore.value.current / enterpriseQualificationScore.value.total),
    current: `${enterpriseQualificationScore.value.current}/${enterpriseQualificationScore.value.total}`,
    potential: `${enterpriseQualificationScore.value.potential}/${enterpriseQualificationScore.value.total}`,
  },
  {
    dimension: '人员证书',
    ...getMatchSignal(teamEvidenceScore.value.current / teamEvidenceScore.value.total),
    current: `${teamEvidenceScore.value.current}/${teamEvidenceScore.value.total}`,
    potential: `${teamEvidenceScore.value.potential}/${teamEvidenceScore.value.total}`,
  },
  {
    dimension: '政务案例',
    ...getMatchSignal(caseEvidenceScore.value.current / caseEvidenceScore.value.total),
    current: `${caseEvidenceScore.value.current}/${caseEvidenceScore.value.total}`,
    potential: `${caseEvidenceScore.value.potential}/${caseEvidenceScore.value.total}`,
  },
  {
    dimension: '技术能力',
    ...getMatchSignal(technicalCapabilityScore.value.current / technicalCapabilityScore.value.total),
    current: `${technicalCapabilityScore.value.current}/${technicalCapabilityScore.value.total}`,
    potential: `${technicalCapabilityScore.value.potential}/${technicalCapabilityScore.value.total}`,
  }
]);

const buildMatchedEvidenceItem = (
  materialId: string,
  typeLabel: string,
  matchLabel: string
): MatchedEvidenceItem | null => {
  const material = enterpriseMaterials.find((item) => item.id === materialId);
  if (!material) return null;
  const sourceFile = enterpriseSourceFiles.find((item) => item.id === material.sourceFileId);

  return {
    materialId: material.id,
    sourceFileId: material.sourceFileId,
    typeLabel,
    matchLabel,
    sourceFileName: sourceFile?.name ?? `文件 ${material.sourceFileId}`,
  };
};

const matchedEvidenceItems = computed(() =>
  [
    buildMatchedEvidenceItem('jd-profile-company', '企业资质', '企业介绍与资质荣誉概要'),
    buildMatchedEvidenceItem('jd-cert-1', '企业资质', 'ISO9001 质量管理体系'),
    buildMatchedEvidenceItem('jd-cert-2', '企业资质', 'ISO27001 信息安全管理体系'),
    buildMatchedEvidenceItem('jd-cert-5', '企业资质', 'CNAS（含等保测评能力）'),
    buildMatchedEvidenceItem('jd-team-1', '人员证书', '项目经理（高级测评师）'),
    buildMatchedEvidenceItem('jd-team-2', '人员证书', '高级测评师'),
    buildMatchedEvidenceItem('jd-case-b-1', '业绩案例', '农商行等保测评（基本资质列表）'),
    buildMatchedEvidenceItem('jd-case-s-4', '业绩案例', '省联社等级保护测评'),
    buildMatchedEvidenceItem('jd-case-s-5', '业绩案例', '利安人寿等保测评'),
    buildMatchedEvidenceItem('jd-case-s-14', '业绩案例', '平安金服等保测评'),
  ].filter((item): item is MatchedEvidenceItem => item !== null)
);

const findMatchedEvidence = (materialId: string) =>
  matchedEvidenceItems.value.find((item) => item.materialId === materialId) ?? null;

const overviewConclusion = computed(() => {
  if (successRateEstimate.value.current >= 80) {
    return `AI审查结论：整体匹配度高，综合成功率测算为 ${successRateEstimate.value.current}%，建议直接推进投标准备。`;
  }
  if (successRateEstimate.value.current >= 65) {
    return `AI审查结论：整体条件基本匹配，综合成功率测算为 ${successRateEstimate.value.current}%，补齐关键证明后建议推进投标。`;
  }
  return `AI审查结论：当前关键证明不足，综合成功率测算为 ${successRateEstimate.value.current}%，建议补齐后再决定是否投标。`;
});

const requirementMatchRows = computed<RequirementMatchRow[]>(() => [
  {
    id: 'req-business-license',
    dimension: '企业资质',
    requirement: '营业执照有效且注册资金不低于500万元',
    statusLabel: '符合',
    statusTone: 'match',
    matchedText: '投标人金盾检测技术股份有限公司，详见投标文件企业介绍与资质摘录。',
    evidence: findMatchedEvidence('jd-profile-company'),
  },
  {
    id: 'req-grade-protection-license',
    dimension: '企业资质',
    requirement: '具备等级保护测评机构资质证书',
    statusLabel: '缺失',
    statusTone: 'missing',
    matchedText: '暂无对应资质证书。',
    evidence: null,
  },
  {
    id: 'req-iso27001-info',
    dimension: '企业资质',
    requirement: '具备ISO27001信息安全管理体系认证相关说明',
    statusLabel: '符合',
    statusTone: 'match',
    matchedText: '已具备 ISO27001 体系认证（见资质认证列表第2项）。',
    evidence: findMatchedEvidence('jd-cert-2'),
  },
  {
    id: 'req-iso27001-scan',
    dimension: '企业资质',
    requirement: '提供ISO27001认证证书扫描件',
    statusLabel: '缺失',
    statusTone: 'missing',
    matchedText: '缺少 ISO27001 证书扫描件。',
    evidence: null,
  },
  {
    id: 'req-performance-case',
    dimension: '政务案例',
    requirement: '近三年同类项目案例不少于3个',
    statusLabel: '符合',
    statusTone: 'match',
    matchedText: '已具备多项金融与农信体系等保测评案例。',
    evidence: findMatchedEvidence('jd-case-b-1'),
  },
  {
    id: 'req-performance-proof',
    dimension: '政务案例',
    requirement: '提供业绩合同、验收报告等正式证明材料',
    statusLabel: '缺失',
    statusTone: 'missing',
    matchedText: '当前素材库未见合同或验收报告。',
    evidence: null,
  },
  {
    id: 'req-project-lead',
    dimension: '人员证书',
    requirement: '项目负责人需持有CISP证书',
    statusLabel: '缺失',
    statusTone: 'missing',
    matchedText: '暂无项目负责人 CISP 证书。',
    evidence: null,
  },
  {
    id: 'req-senior-assessor',
    dimension: '人员证书',
    requirement: '高级测评师需持有CISP-PTE / CISP-PTS证书',
    statusLabel: '缺失',
    statusTone: 'missing',
    matchedText: '暂无高级测评师专项证书。',
    evidence: null,
  },
  {
    id: 'req-gov-service-experience',
    dimension: '政务案例',
    requirement: '具备政务类信息化项目实施经验',
    statusLabel: '符合',
    statusTone: 'match',
    matchedText: '已具备农村商业银行、省联社等金融机构信息化相关测评业绩。',
    evidence: findMatchedEvidence('jd-case-s-4'),
  },
  {
    id: 'req-public-resource-experience',
    dimension: '政务案例',
    requirement: '具备公共资源交易或监管类平台实施经验',
    statusLabel: '符合',
    statusTone: 'match',
    matchedText: '已具备银行及保险等多类金融行业案例（见业绩案例列表）。',
    evidence: findMatchedEvidence('jd-case-s-5'),
  },
  {
    id: 'req-team-management',
    dimension: '人员证书',
    requirement: '团队需体现项目管理与实施组织能力',
    statusLabel: '符合',
    statusTone: 'match',
    matchedText: '服务团队含项目经理及多等级测评师（见人员配置表）。',
    evidence: findMatchedEvidence('jd-team-1'),
  },
  {
    id: 'req-technical-capability',
    dimension: '技术能力',
    requirement: '技术方案需体现平台能力、文档智能处理与方法论支撑',
    statusLabel: '符合',
    statusTone: 'match',
    matchedText: '已具备多类认证与测评能力说明（见企业资质与荣誉摘录）。',
    evidence: findMatchedEvidence('jd-profile-company'),
  },
  {
    id: 'req-software-copyright',
    dimension: '技术能力',
    requirement: '需体现自主研发成果和产品化能力',
    statusLabel: '符合',
    statusTone: 'match',
    matchedText: '业绩与团队材料中可体现项目实施与交付能力。',
    evidence: findMatchedEvidence('jd-case-s-14'),
  },
]);

const detailStatusOrder: Record<RequirementMatchRow['statusTone'], number> = {
  match: 0,
  missing: 1,
};

const detailDimensionOrder: Record<RequirementMatchRow['dimension'], number> = {
  '企业资质': 0,
  '人员证书': 1,
  '政务案例': 2,
  '技术能力': 3,
};

const groupedRequirementSections = computed(() => {
  const grouped = new Map<RequirementMatchRow['dimension'], RequirementMatchRow[]>();

  for (const row of requirementMatchRows.value) {
    const list = grouped.get(row.dimension) ?? [];
    list.push(row);
    grouped.set(row.dimension, list);
  }

  return [...grouped.entries()]
    .sort((a, b) => detailDimensionOrder[a[0]] - detailDimensionOrder[b[0]])
    .map(([dimension, rows]) => ({
      dimension,
      rows: [...rows].sort((a, b) => detailStatusOrder[a.statusTone] - detailStatusOrder[b.statusTone]),
    }));
});

const reportSections = [
  {
    title: '二、项目背景与需求分析',
    paragraphs: [
      '本项目采购方为XX市政务服务中心，项目预算50万元，采用公开招标方式。要求投标人具备等级保护测评资质、ISO27001信息安全管理体系认证，并需提供3年内至少3个同类项目业绩。从招标文件看，采购方对测评机构的专业能力、技术方案的科学性以及服务质量的稳定性有较高要求，这与当前政府机构对信息安全工作日益重视的大背景相符。',
      '项目的核心难点在于三个方面：首先是技术方案的完整性和先进性，需要投标人展示成熟的测评方法论和工具体系；其次是业绩证明的充分性，要求提供政府类同类项目案例，且需附带客户评价；第三是团队配置的专业性，项目负责人需持有CISP证书，测评团队需具备相应的技术资质和实战经验。这三个方面构成了本次投标的主要门槛，也是评标过程中的核心考量因素。'
    ]
  },
  {
    title: '三、我司核心竞争优势',
    paragraphs: [
      '金盾检测作为专业的第三方检测机构，在本项目中具备显著的竞争优势。',
      '首先，我司拥有完整的资质体系。公司持有CMA中国计量认证、CNAS实验室认可以及CATL建设工程质量检测机构资质，完全满足招标文件对等级保护测评资质和ISO27001认证的要求。这些权威认证不仅是准入门槛，更是我司专业能力的有力证明，能够在资格审查阶段确保顺利通过。',
      '其次，在业绩方面，我司近五年累计完成各类检测项目超过15000项，其中包括大量政府机构和大型央企的信息安全测评项目。我们曾为北京市政府、上海市住建委等政府部门提供过等级保护测评服务，并在北京大兴国际机场配套工程、雄安新区市政基础设施等国家重点工程中承担检测任务。这些高质量的项目经验完全符合招标文件对"3年内至少3个同类项目业绩"的要求，且项目规模和客户层级均具有较强的说服力，在业绩评分中将占据明显优势。',
      '第三，技术实力是我司的核心优势。公司配备价值超过8000万元的先进检测设备，包括电子万能试验机、X射线衍射仪、气相色谱质谱联用仪等高精度仪器300余台套，能够为信息系统安全测评提供全面的技术支撑。同时，我司自主研发的"智能检测数据管理系统"实现了检测流程全程数字化管理，大幅提升了测评效率和数据追溯能力，这在技术方案评分中将是重要的加分项。',
      '第四，团队配置方面，我司拥有120余名专业技术人员，其中高级工程师18人、注册结构工程师5人、注册岩土工程师3人，80%以上人员具有本科及以上学历。我们可以为本项目配置持有CISP证书的项目负责人，并组建包括高级测评师在内的专业团队，确保项目实施的专业性和稳定性。团队成员在政府信息系统测评领域积累了丰富的实战经验，能够准确把握政府机构的特殊需求和安全要求。'
    ]
  },
  {
    title: '四、投标策略建议',
    paragraphs: [
      '基于以上分析，我们建议采取以下投标策略。',
      '在技术方案编制上，应重点突出我司的方法论优势和工具体系。建议详细阐述我司在等级保护测评领域的技术积累，包括测评流程的标准化、测评工具的智能化以及数据管理的数字化，展示我司在技术方案完整性和先进性方面的领先地位。同时，可以结合以往政府类项目的成功案例，说明我司对政府信息系统特点的深刻理解和丰富的实战经验。技术方案应当体现出对本项目具体需求的精准把握，避免泛泛而谈，要有针对性地提出解决方案。',
      '在业绩证明方面，建议精选5个最具代表性的政府类等级保护测评项目，重点突出项目规模、服务质量和客户评价。可以提供北京市政府、上海市住建委等权威客户的推荐信或评价材料，增强业绩的说服力。同时，应详细说明这些项目的测评范围、技术难点和解决方案，展示我司的专业能力。业绩材料要做到真实可查、证据充分，避免因材料不全或真实性存疑而失分。',
      '在团队配置上，建议配置经验丰富的项目负责人和高级测评师，并在投标文件中详细列出团队成员的资质证书、项目经验和技术专长。可以强调团队的稳定性和协作能力，说明我司完善的人才培养体系和质量管理体系，确保项目实施的可靠性。人员配置要与项目规模相匹配，既要体现专业性，又要避免过度配置导致成本过高。',
      '在报价策略上，考虑到项目预算为50万元，建议报价控制在40-45万元之间，既体现合理的性价比，又避免因报价过低引起质疑。可以在报价说明中详细列出成本构成，包括人员投入、设备使用、差旅费用等，增强报价的透明度和合理性。报价应当充分考虑项目实施的实际成本，确保在中标后能够保质保量完成项目，避免因成本控制不当影响服务质量。'
    ]
  },
  {
    title: '五、风险提示与应对',
    paragraphs: [
      '需要注意的是，本项目的竞争可能较为激烈，其他具备等级保护测评资质的机构也可能参与投标。因此，我们需要在投标文件中充分展示我司的差异化优势，特别是在技术方案的创新性、业绩案例的权威性和团队配置的专业性方面，形成明显的竞争优势。',
      '此外，招标文件要求项目负责人持有CISP证书，我们需要提前确认人员安排，确保投标文件中的人员配置真实可靠。同时，应准备充分的资质证明材料，包括等级保护测评资质证书、ISO27001认证证书、业绩合同和验收报告等，确保投标文件的完整性和规范性。投标文件的编制要严格按照招标文件要求，避免因格式不规范或材料缺失导致废标。',
      '在时间安排上，需要注意招标文件规定的各个时间节点，特别是答疑截止时间和投标截止时间，确保在规定时间内完成投标文件的编制和递交。建议提前准备，预留充足的时间进行内部审核和修改完善，避免因时间紧张导致投标文件质量不高。'
    ]
  },
  {
    title: '六、综合评估',
    paragraphs: [
      '综合来看，本项目与金盾检测的核心业务高度契合，我司在资质、业绩、技术和团队等方面均具备显著优势，项目中标概率较高。建议公司高度重视本项目，组织精干力量编制高质量的投标文件，充分展示我司的专业能力和服务优势，力争成功中标。',
      '同时，本项目的成功实施将进一步提升我司在政府信息安全测评领域的品牌影响力，为后续业务拓展奠定良好基础。政府类项目具有较强的示范效应，成功案例将有助于我司在同类市场中建立口碑，吸引更多优质客户。因此，无论从短期收益还是长期发展来看，本项目都具有重要的战略意义，值得我司全力以赴争取。'
    ]
  }
] as const;

// Track active section and highlight text
const activeSection = ref<string | null>(null);
const highlightText = ref<string | null>(null);

// Escape special regex characters
const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Highlight content by wrapping matched text with <mark> tag
const highlightContent = (content: string, sectionId: string) => {
  if (!highlightText.value || activeSection.value !== sectionId) {
    return content;
  }
  const escaped = escapeRegExp(highlightText.value);
  return content.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="highlight-text">$1</mark>'
  );
};

// Scroll to section and highlight matching text
const scrollToAndHighlight = (targetSection: string, searchText: string) => {
  highlightText.value = searchText;
  activeSection.value = targetSection;

  const element = document.getElementById(targetSection);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => {
    highlightText.value = null;
    activeSection.value = null;
  }, 2000);
};

const goBack = () => {
  router.push({ name: 'bid-subscription' });
};

const scrollToSection = (targetSection: string) => {
  const element = document.getElementById(targetSection);
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const getStatusIcon = (status: string) => {
  return status === 'match' ? CheckCircle : status === 'partial' ? Clock : XCircle;
};

const getStatusClass = (status: string) => {
  return status === 'match' ? 'status-match' : status === 'partial' ? 'status-partial' : 'status-nomatch';
};

const generateBidDoc = () => {
  router.push({
    name: 'bid-doc-oneclick-form',
    query: { bidId: route.query.bidId, title: bidTitle },
  });
};

const buildTableBorders = () => ({
  top: { style: BorderStyle.SINGLE, color: 'D1D5DB', size: 1 },
  bottom: { style: BorderStyle.SINGLE, color: 'D1D5DB', size: 1 },
  left: { style: BorderStyle.SINGLE, color: 'D1D5DB', size: 1 },
  right: { style: BorderStyle.SINGLE, color: 'D1D5DB', size: 1 },
  insideHorizontal: { style: BorderStyle.SINGLE, color: 'E5E7EB', size: 1 },
  insideVertical: { style: BorderStyle.SINGLE, color: 'E5E7EB', size: 1 },
});

const makeBodyParagraph = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, font: '宋体', size: 24 })],
    spacing: { after: 220, line: 420 },
    indent: { firstLine: 420 },
    alignment: AlignmentType.JUSTIFIED,
  });

const makeSectionHeading = (text: string) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 180 },
    thematicBreak: false,
  });

const handleExport = async () => {
  const summaryHeader = ['评估维度', '匹配程度', '当前得分', '补齐后预估'];
  const detailHeader = ['招标要求', '审查结论', '我方佐证', '来源文件'];
  const safeTitle = bidTitle.replace(/[\\/:*?"<>|]/g, '-');
  const today = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: buildTableBorders(),
    rows: [
      new TableRow({
        tableHeader: true,
        children: summaryHeader.map((text) =>
          new TableCell({
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [new TextRun({ text, bold: true, color: '475569', font: '微软雅黑', size: 22 })],
              }),
            ],
          })
        ),
      }),
      ...scoreSummaryRows.value.map((row) =>
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              shading: row.dimension === '成功率'
                ? { fill: 'F8FBFF', type: ShadingType.CLEAR, color: 'auto' }
                : undefined,
              children: [new Paragraph({ children: [new TextRun({ text: row.dimension, bold: true, font: '微软雅黑', size: 22 })] })],
            }),
            new TableCell({
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              shading: row.dimension === '成功率'
                ? { fill: 'F8FBFF', type: ShadingType.CLEAR, color: 'auto' }
                : undefined,
              children: [new Paragraph({ children: [new TextRun({ text: row.label, font: '微软雅黑', size: 22 })] })],
            }),
            new TableCell({
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              shading: row.dimension === '成功率'
                ? { fill: 'F8FBFF', type: ShadingType.CLEAR, color: 'auto' }
                : undefined,
              children: [new Paragraph({ children: [new TextRun({ text: row.current, bold: true, font: '微软雅黑', size: 22 })] })],
            }),
            new TableCell({
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              shading: row.dimension === '成功率'
                ? { fill: 'F8FBFF', type: ShadingType.CLEAR, color: 'auto' }
                : undefined,
              children: [new Paragraph({ children: [new TextRun({ text: row.potential, bold: true, color: '2563EB', font: '微软雅黑', size: 22 })] })],
            }),
          ],
        })
      ),
    ],
  });

  const buildDetailTable = (rows: RequirementMatchRow[]) => new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: buildTableBorders(),
    rows: [
      new TableRow({
        tableHeader: true,
        children: detailHeader.map((text) =>
          new TableCell({
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [new TextRun({ text, bold: true, color: '475569', font: '微软雅黑', size: 22 })],
              }),
            ],
          })
        ),
      }),
      ...rows.map((row) =>
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: row.requirement, font: '微软雅黑', size: 21 })] })],
            }),
            new TableCell({
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              children: [new Paragraph({
                children: [
                  new TextRun({
                    text: row.statusLabel,
                    font: '微软雅黑',
                    bold: true,
                    size: 21,
                    color: row.statusTone === 'match' ? '15803D' : 'B91C1C',
                  })
                ]
              })],
            }),
            new TableCell({
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              children: [new Paragraph({
                children: [new TextRun({
                  text: row.evidence ? `${row.evidence.matchLabel}；${row.matchedText}` : row.matchedText,
                  font: '微软雅黑',
                  size: 21,
                })]
              })],
            }),
            new TableCell({
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              children: [new Paragraph({
                children: [new TextRun({ text: row.evidence?.sourceFileName ?? '—', font: '微软雅黑', size: 21 })]
              })],
            }),
          ],
        })
      ),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(0.9),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(0.9),
            },
          },
        },
        children: [
          new Paragraph({
            children: [new TextRun({ text: bidTitle, bold: true, font: '黑体', size: 36 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '招标文件 AI 解读报告', font: '微软雅黑', size: 24, color: '6B7280' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `导出日期：${today}`, font: '微软雅黑', size: 20, color: '6B7280' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 320 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '初步审查结论：', bold: true, font: '微软雅黑', size: 24, color: '1F2937' }),
              new TextRun({ text: overviewConclusion.value, bold: true, font: '微软雅黑', size: 24, color: '1F2937' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 220 },
          }),
          makeSectionHeading('一、投标匹配总览'),
          summaryTable,
          new Paragraph({
            children: [new TextRun({ text: '各维度审查明细见下表。', font: '微软雅黑', size: 20, color: '64748B' })],
            spacing: { before: 120, after: 220 },
          }),
          ...groupedRequirementSections.value.flatMap((section) => [
            new Paragraph({
              children: [new TextRun({ text: `${section.dimension}审查`, bold: true, font: '微软雅黑', size: 24, color: '1F2937' })],
              spacing: { before: 120, after: 140 },
            }),
            buildDetailTable(section.rows),
          ]),
          ...reportSections.flatMap((section) => [
            makeSectionHeading(section.title),
            ...section.paragraphs.map((paragraph) => makeBodyParagraph(paragraph)),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${safeTitle}-AI解读报告.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const openEvidenceItem = (item: MatchedEvidenceItem) => {
  router.push({
    name: 'enterprise-material',
    query: {
      fileId: String(item.sourceFileId),
      materialId: item.materialId,
    },
  });
};

// Resizable panels
const leftPanelWidth = ref(50);
const isDragging = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = (x / rect.width) * 100;
  leftPanelWidth.value = Math.min(Math.max(percentage, 30), 70);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<template>
  <div class="result-page">
    <!-- Header -->
    <div class="result-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回</span>
      </button>
      <div class="header-title">
        <FileSearch :size="20" />
        <h1>标讯AI解读</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary" @click="handleExport">
          <Download :size="16" />
          导出报告
        </button>
        <button class="action-btn primary" @click="generateBidDoc">
          <FileText :size="16" />
          生成标书
        </button>
      </div>
    </div>

    <div class="result-content" ref="containerRef">
      <!-- 左侧：招标文件预览 -->
      <div class="preview-panel" :style="{ width: leftPanelWidth + '%' }">
        <div class="panel-header">
          <h2>招标文件</h2>
          <span class="file-name">招标文件.pdf</span>
        </div>
        <div class="preview-content">
          <div class="doc-preview">
            <div v-for="section in documentSections" :key="section.id" class="doc-section">
              <h3 class="doc-section-title">{{ section.title }}</h3>
              <div v-for="sub in section.subsections" :key="sub.id"
                   :id="sub.id"
                   class="doc-subsection"
                   :class="{ 'active': activeSection === sub.id }">
                <h4 class="doc-subsection-title">{{ sub.title }}</h4>
                <div class="doc-subsection-content"
                     v-html="highlightContent(sub.content, sub.id)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 拖动分隔条 -->
      <div class="resizer" @mousedown="startDrag" :class="{ dragging: isDragging }">
        <div class="resizer-line"></div>
      </div>

      <!-- 右侧：AI解读报告 -->
      <div class="analysis-panel" :style="{ width: (100 - leftPanelWidth) + '%' }">
        <div class="panel-header">
          <h2>AI解读报告</h2>
        </div>
        <div class="analysis-content">
          <!-- 纯文本分析报告 -->
          <div class="report-text-content">
            <div class="report-text">
              <h3>一、投标匹配总览</h3>
              <div class="match-overview">
                <p class="overview-inline-main overview-inline-merged">{{ overviewConclusion }}</p>

                <div class="analysis-matrix">
                  <div class="analysis-matrix-title">维度测算摘要</div>
                  <table class="analysis-matrix-table">
                    <thead>
                      <tr>
                        <th>评估维度</th>
                        <th>匹配程度</th>
                        <th>当前得分</th>
                        <th>补齐后预估</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="row in scoreSummaryRows"
                        :key="row.dimension"
                        :class="{ 'summary-row-primary': row.dimension === '技术能力' }"
                      >
                        <td class="summary-dimension">{{ row.dimension }}</td>
                        <td>
                          <span
                            class="summary-match-badge"
                            :class="{
                              'is-green': row.tone === 'green',
                              'is-yellow': row.tone === 'yellow',
                              'is-red': row.tone === 'red'
                            }"
                          >
                            {{ row.label }}
                          </span>
                        </td>
                        <td class="summary-score summary-score-current">{{ row.current }}</td>
                        <td class="summary-score summary-score-potential">{{ row.potential }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="match-detail">
                  <div class="match-detail-title">资格与能力审查明细</div>
                  <div
                    v-for="section in groupedRequirementSections"
                    :key="section.dimension"
                    class="match-dimension-section"
                  >
                    <div class="match-dimension-title">{{ section.dimension }}审查</div>
                    <table class="match-detail-table">
                      <thead>
                        <tr>
                          <th>招标要求</th>
                          <th>审查结论</th>
                          <th>我方佐证</th>
                          <th>材料查看</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in section.rows" :key="row.id">
                          <td>{{ row.requirement }}</td>
                          <td>
                            <span class="detail-status" :class="`is-${row.statusTone}`">{{ row.statusLabel }}</span>
                          </td>
                          <td>{{ row.evidence ? `${row.evidence.matchLabel}；${row.matchedText}` : row.matchedText }}</td>
                          <td class="detail-action-cell">
                            <button
                              v-if="row.evidence"
                              class="appendix-link-btn"
                              @click="openEvidenceItem(row.evidence)"
                            >
                              查看素材
                            </button>
                            <span v-else class="detail-empty-action">无材料</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <h3>二、项目背景与需求分析</h3>
              <p>本项目采购方为XX市政务服务中心，项目预算50万元，采用公开招标方式。要求投标人具备等级保护测评资质、ISO27001信息安全管理体系认证，并需提供3年内至少3个同类项目业绩。从招标文件看，采购方对测评机构的专业能力、技术方案的科学性以及服务质量的稳定性有较高要求，这与当前政府机构对信息安全工作日益重视的大背景相符。</p>
              <p>项目的核心难点在于三个方面：首先是技术方案的完整性和先进性，需要投标人展示成熟的测评方法论和工具体系；其次是业绩证明的充分性，要求提供政府类同类项目案例，且需附带客户评价；第三是团队配置的专业性，项目负责人需持有CISP证书，测评团队需具备相应的技术资质和实战经验。这三个方面构成了本次投标的主要门槛，也是评标过程中的核心考量因素。</p>

              <h3>三、我司核心竞争优势</h3>
              <p>金盾检测作为专业的第三方检测机构，在本项目中具备显著的竞争优势。</p>
              <p>首先，我司拥有完整的资质体系。公司持有CMA中国计量认证、CNAS实验室认可以及CATL建设工程质量检测机构资质，完全满足招标文件对等级保护测评资质和ISO27001认证的要求。这些权威认证不仅是准入门槛，更是我司专业能力的有力证明，能够在资格审查阶段确保顺利通过。</p>
              <p>其次，在业绩方面，我司近五年累计完成各类检测项目超过15000项，其中包括大量政府机构和大型央企的信息安全测评项目。我们曾为北京市政府、上海市住建委等政府部门提供过等级保护测评服务，并在北京大兴国际机场配套工程、雄安新区市政基础设施等国家重点工程中承担检测任务。这些高质量的项目经验完全符合招标文件对"3年内至少3个同类项目业绩"的要求，且项目规模和客户层级均具有较强的说服力，在业绩评分中将占据明显优势。</p>
              <p>第三，技术实力是我司的核心优势。公司配备价值超过8000万元的先进检测设备，包括电子万能试验机、X射线衍射仪、气相色谱质谱联用仪等高精度仪器300余台套，能够为信息系统安全测评提供全面的技术支撑。同时，我司自主研发的"智能检测数据管理系统"实现了检测流程全程数字化管理，大幅提升了测评效率和数据追溯能力，这在技术方案评分中将是重要的加分项。</p>
              <p>第四，团队配置方面，我司拥有120余名专业技术人员，其中高级工程师18人、注册结构工程师5人、注册岩土工程师3人，80%以上人员具有本科及以上学历。我们可以为本项目配置持有CISP证书的项目负责人，并组建包括高级测评师在内的专业团队，确保项目实施的专业性和稳定性。团队成员在政府信息系统测评领域积累了丰富的实战经验，能够准确把握政府机构的特殊需求和安全要求。</p>

              <h3>四、投标策略建议</h3>
              <p>基于以上分析，我们建议采取以下投标策略。</p>
              <p>在技术方案编制上，应重点突出我司的方法论优势和工具体系。建议详细阐述我司在等级保护测评领域的技术积累，包括测评流程的标准化、测评工具的智能化以及数据管理的数字化，展示我司在技术方案完整性和先进性方面的领先地位。同时，可以结合以往政府类项目的成功案例，说明我司对政府信息系统特点的深刻理解和丰富的实战经验。技术方案应当体现出对本项目具体需求的精准把握，避免泛泛而谈，要有针对性地提出解决方案。</p>
              <p>在业绩证明方面，建议精选5个最具代表性的政府类等级保护测评项目，重点突出项目规模、服务质量和客户评价。可以提供北京市政府、上海市住建委等权威客户的推荐信或评价材料，增强业绩的说服力。同时，应详细说明这些项目的测评范围、技术难点和解决方案，展示我司的专业能力。业绩材料要做到真实可查、证据充分，避免因材料不全或真实性存疑而失分。</p>
              <p>在团队配置上，建议配置经验丰富的项目负责人和高级测评师，并在投标文件中详细列出团队成员的资质证书、项目经验和技术专长。可以强调团队的稳定性和协作能力，说明我司完善的人才培养体系和质量管理体系，确保项目实施的可靠性。人员配置要与项目规模相匹配，既要体现专业性，又要避免过度配置导致成本过高。</p>
              <p>在报价策略上，考虑到项目预算为50万元，建议报价控制在40-45万元之间，既体现合理的性价比，又避免因报价过低引起质疑。可以在报价说明中详细列出成本构成，包括人员投入、设备使用、差旅费用等，增强报价的透明度和合理性。报价应当充分考虑项目实施的实际成本，确保在中标后能够保质保量完成项目，避免因成本控制不当影响服务质量。</p>

              <h3>五、风险提示与应对</h3>
              <p>需要注意的是，本项目的竞争可能较为激烈，其他具备等级保护测评资质的机构也可能参与投标。因此，我们需要在投标文件中充分展示我司的差异化优势，特别是在技术方案的创新性、业绩案例的权威性和团队配置的专业性方面，形成明显的竞争优势。</p>
              <p>此外，招标文件要求项目负责人持有CISP证书，我们需要提前确认人员安排，确保投标文件中的人员配置真实可靠。同时，应准备充分的资质证明材料，包括等级保护测评资质证书、ISO27001认证证书、业绩合同和验收报告等，确保投标文件的完整性和规范性。投标文件的编制要严格按照招标文件要求，避免因格式不规范或材料缺失导致废标。</p>
              <p>在时间安排上，需要注意招标文件规定的各个时间节点，特别是答疑截止时间和投标截止时间，确保在规定时间内完成投标文件的编制和递交。建议提前准备，预留充足的时间进行内部审核和修改完善，避免因时间紧张导致投标文件质量不高。</p>

              <h3>六、综合评估</h3>
              <p>综合来看，本项目与金盾检测的核心业务高度契合，我司在资质、业绩、技术和团队等方面均具备显著优势，项目中标概率较高。建议公司高度重视本项目，组织精干力量编制高质量的投标文件，充分展示我司的专业能力和服务优势，力争成功中标。</p>
              <p>同时，本项目的成功实施将进一步提升我司在政府信息安全测评领域的品牌影响力，为后续业务拓展奠定良好基础。政府类项目具有较强的示范效应，成功案例将有助于我司在同类市场中建立口碑，吸引更多优质客户。因此，无论从短期收益还是长期发展来看，本项目都具有重要的战略意义，值得我司全力以赴争取。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
@import './styles.css';

/* Report Text Content */
.report-text-content {
  padding: 32px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.report-text {
  font-size: 15px;
  line-height: 2;
  color: #374151;
}

/* Section Headings - 大章节标题 */
.report-text h3 {
  font-weight: 600;
  color: #1f2937;
  font-size: 17px;
  margin-top: 48px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.report-text h3:first-of-type {
  margin-top: 0;
}

/* Paragraphs */
.report-text p {
  margin-bottom: 18px;
  text-indent: 2em;
  text-align: justify;
  line-height: 2;
}

.report-text p:last-child {
  margin-bottom: 0;
}

.analysis-matrix {
  margin-bottom: 18px;
  overflow-x: auto;
}

.analysis-matrix-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
  text-indent: 0;
}

.analysis-matrix-table th,
.analysis-matrix-table td {
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  text-align: left;
  line-height: 1.7;
}

.analysis-matrix-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
}

.analysis-matrix-table td {
  color: #1f2937;
}

.analysis-matrix-table tbody tr:nth-child(even) {
  background: #fcfdff;
}

.summary-row-primary {
  background: #f8fbff;
}

.summary-dimension {
  font-weight: 600;
  color: #0f172a;
}

.summary-match-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.summary-match-badge.is-green {
  background: #dcfce7;
  color: #15803d;
}

.summary-match-badge.is-yellow {
  background: #fef3c7;
  color: #b45309;
}

.summary-match-badge.is-red {
  background: #fee2e2;
  color: #b91c1c;
}

.summary-score {
  font-weight: 700;
  letter-spacing: 0.2px;
}

.summary-score-current {
  color: #1f2937;
}

.summary-score-potential {
  color: #2563eb;
}

.analysis-matrix-note {
  margin-top: 10px;
  margin-bottom: 0;
  font-size: 12px;
  color: #64748b;
  text-indent: 0;
  text-align: left;
  line-height: 1.6;
}

.match-overview {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.overview-inline-main {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.overview-inline-merged {
  margin: 0 0 2px;
  text-indent: 0;
  line-height: 1.8;
}

.match-detail {
  border-top: 1px dashed #dbe3f0;
  padding-top: 4px;
}

.analysis-matrix-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.match-detail-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.match-dimension-section + .match-dimension-section {
  margin-top: 18px;
}

.match-dimension-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.match-detail-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.match-detail-table th,
.match-detail-table td {
  padding: 12px 10px;
  border-bottom: 1px dashed #e2e8f0;
  text-align: left;
  font-size: 12px;
  line-height: 1.7;
  vertical-align: top;
}

.match-detail-table th {
  color: #64748b;
  font-weight: 600;
  background: #f8fafc;
  white-space: nowrap;
}

.match-detail-table tbody tr:hover {
  background: #fafcff;
}

.match-detail-table th:nth-child(1),
.match-detail-table td:nth-child(1) {
  width: 280px;
}

.match-detail-table th:nth-child(2),
.match-detail-table td:nth-child(2) {
  width: 110px;
}

.match-detail-table th:nth-child(3),
.match-detail-table td:nth-child(3) {
  width: 320px;
}

.match-detail-table th:nth-child(4),
.match-detail-table td:nth-child(4) {
  width: 86px;
  text-align: center;
  white-space: nowrap;
}

.detail-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  margin: 0 auto;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.detail-status.is-match {
  background: #dcfce7;
  color: #15803d;
}

.detail-status.is-missing {
  background: #fee2e2;
  color: #b91c1c;
}

.detail-action-cell {
  text-align: center;
}

.detail-empty-action {
  color: #94a3b8;
  font-size: 12px;
}

.appendix-link-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.appendix-link-btn:hover {
  color: #1d4ed8;
}

@media (max-width: 900px) {
  .match-detail-table {
    min-width: 860px;
  }
}
</style>
