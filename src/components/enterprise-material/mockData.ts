// Mock data extracted from user-provided bid document:
// 信息系统安全等级保护测评（等保2.0）项目+金盾检测技术股份有限公司.docx
import type {
  Folder,
  SourceFile,
  Material,
  FilePreview,
  PersonnelSourceItem,
  Person,
  PersonQualification,
  QualificationRecord,
  PerformanceCaseEvidence,
  SourcePreviewEvidence
} from './types';
import jindunTeamRows from './jindunTeamRows.json';

type JindunTeamRow = [number, string, string, string, string, string];

const teamRows = jindunTeamRows as JindunTeamRow[];

// Shared helper: generate a coloured SVG placeholder for demo certificate previews
function makeCertPreview(label: string, name: string, accent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480" viewBox="0 0 720 480">
      <rect width="720" height="480" fill="#ffffff"/>
      <rect x="20" y="20" width="680" height="440" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
      <rect x="20" y="20" width="680" height="72" rx="12" fill="${accent}" opacity="0.1"/>
      <text x="44" y="68" font-family="-apple-system,BlinkMacSystemFont,Helvetica,Arial" font-size="20" fill="${accent}" font-weight="700">${label}</text>
      <text x="44" y="114" font-family="-apple-system,BlinkMacSystemFont,Helvetica,Arial" font-size="14" fill="#64748b">持证人：${name}</text>
      <text x="44" y="160" font-family="-apple-system,BlinkMacSystemFont,Helvetica,Arial" font-size="13" fill="#94a3b8">此处展示证书扫描件（Demo 占位图）</text>
      <rect x="44" y="190" width="632" height="240" rx="8" fill="#f1f5f9"/>
      <text x="360" y="322" font-family="-apple-system,BlinkMacSystemFont,Helvetica,Arial" font-size="13" fill="#cbd5e1" text-anchor="middle">证书图片区域</text>
    </svg>`
  )}`;
}

function makeTextPreview(
  title: string,
  content: string[],
  options: {
    subtitle?: string;
    pageLabel?: string;
    targetPage?: number;
  } = {}
): SourcePreviewEvidence {
  return {
    title,
    content,
    subtitle: options.subtitle,
    pageLabel: options.pageLabel,
    targetPage: options.targetPage
  };
}

export const folders: Folder[] = [
  { id: 1, name: '投标文件' },
  { id: 2, name: '商务技术册' },
  { id: 3, name: '资质认证' },
  { id: 4, name: '业绩与团队' }
];

const BID_FILE_NAME =
  '信息系统安全等级保护测评（等保2.0）项目+金盾检测技术股份有限公司.docx';

const bidSourceFileBase = {
  id: 1,
  name: BID_FILE_NAME,
  size: '约 6.8MB',
  words: '约 17.9 万字符（抽取统计）',
  creator: '金盾检测技术股份有限公司',
  status: 'completed' as const
};

/** 业绩案例行（与标书表格字段一致） */
interface JindunCaseRow {
  id: string;
  listKey: string;
  section: '基本资质要求' | '评标办法';
  name: string;
  signedAt: string;
  client: string;
  service: string;
  amount: string;
  pageHint: string;
  projectType?: Material['projectType'];
}

const jindunCaseRows: JindunCaseRow[] = [
  {
    id: 'jd-case-b-1',
    listKey: '1-1',
    section: '基本资质要求',
    name: '江苏江南农村商业银行股份有限公司2023年等保测评项目咨询服务',
    signedAt: '2023年4月23日',
    client: '江苏江南农村商业银行股份有限公司',
    service: '等级保护测评',
    amount: '77万元',
    pageHint: '第91页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-b-2',
    listKey: '1-2',
    section: '基本资质要求',
    name: '广州农村商业银行2023年度网络安全等级保护测评',
    signedAt: '2023年6月29日',
    client: '广州农村商业银行股份有限公司',
    service: '信息安全等级保护测评',
    amount: '36万元',
    pageHint: '第91页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-1',
    listKey: '1-1',
    section: '评标办法',
    name: '江苏昆山农村商业银行股份有限公司昆山农商银行2023年重要系统信息安全等级保护测评',
    signedAt: '2023年6月20日',
    client: '江苏昆山农村商业银行股份有限公司',
    service: '信息安全等级保护测评',
    amount: '31万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-2',
    listKey: '1-2',
    section: '评标办法',
    name: '南京银行2024年度信息安全等级保护测评项目',
    signedAt: '2024年9月5日',
    client: '南京银行股份有限公司',
    service: '信息安全等级保护测评',
    amount: '25.6万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-3',
    listKey: '1-3',
    section: '评标办法',
    name: '兴业南京分行2024年度信息系统等级保护测评服务项目',
    signedAt: '2024年06月13日',
    client: '中信银行股份有限公司南京分行',
    service: '信息系统等级保护测评服务',
    amount: '12.264151万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-4',
    listKey: '1-4',
    section: '评标办法',
    name: '江苏省农村信用社联合社2023年等级保护测评服务',
    signedAt: '2023年12月26日',
    client: '江苏省农村信用社联合社',
    service: '等级保护测评',
    amount: '42万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-5',
    listKey: '1-5',
    section: '评标办法',
    name: '利安人寿保险股份有限公司2023年系统等级保护测评项目',
    signedAt: '2023年11月',
    client: '利安人寿保险股份有限公司',
    service: '等级保护测评',
    amount: '36万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-6',
    listKey: '1-6',
    section: '评标办法',
    name: '恒泰保险经纪有限公司2023年恒泰互联网保险平台网络安全等级保护测评服务',
    signedAt: '2023年7月',
    client: '恒泰保险经纪有限公司',
    service: '网络安全等级保护测评服务',
    amount: '6.5万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-7',
    listKey: '1-7',
    section: '评标办法',
    name: '恒泰保险经纪有限公司2025 年官网平台网络安全等级保护测评服务',
    signedAt: '2025年9月',
    client: '恒泰保险经纪有限公司',
    service: '网络安全等级保护测评服务',
    amount: '3.5万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-8',
    listKey: '1-8',
    section: '评标办法',
    name: '江苏长江商业银行股份有限公司 2024年网络安全等级保护测评服务',
    signedAt: '2024年10月8日',
    client: '江苏长江商业银行股份有限公司',
    service: '网络安全等级保护测评服务',
    amount: '26万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-9',
    listKey: '1-9',
    section: '评标办法',
    name: '中国银行股份有限公司江苏省分行2023年信息系统等级保护测评项目',
    signedAt: '2024年1月16日',
    client: '中国银行股份有限公司江苏省分行',
    service: '网络安全等级保护测评服务',
    amount: '15.4万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-10',
    listKey: '1-10',
    section: '评标办法',
    name: '南京证券股份有限公司南京证券2024年等级保护测评项目',
    signedAt: '2024年12月4日',
    client: '南京证券股份有限公司',
    service: '等级保护测评',
    amount: '42.78万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-11',
    listKey: '1-11',
    section: '评标办法',
    name: '华泰证券股份有限公司2024年等级保护测评项目',
    signedAt: '2024年4月19日',
    client: '华泰证券股份有限公司',
    service: '等级保护测评',
    amount: '68万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-12',
    listKey: '1-12',
    section: '评标办法',
    name: '华能贵诚信托有限公司华能贵诚2024年信息系统等级保护测评项目',
    signedAt: '2024年12月6日',
    client: '华能贵诚信托有限公司',
    service: '信息系统等级保护测评',
    amount: '16.5万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-13',
    listKey: '1-13',
    section: '评标办法',
    name: '2023年南银法巴消费金融有限公司网络安全等级保护服务项目',
    signedAt: '2023年4月',
    client: '南银法巴消费金融有限公司',
    service: '网络安全等级保护服务',
    amount: '47万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-14',
    listKey: '1-14',
    section: '评标办法',
    name: '2024年深圳平安综合金融服务有限公司【信息安全等级保护测评】项目',
    signedAt: '2024年8月29日',
    client: '深圳平安综合金融服务有限公司',
    service: '信息安全等级保护测评',
    amount: '504万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-15',
    listKey: '1-15',
    section: '评标办法',
    name:
      '2024年高频采购安全软件产品和服务开展入围（安全评估服务）包件一：网络安全等级保护测评服务框架合同',
    signedAt: '2024年10月15日',
    client: '上海农村商业银行股份有限公司',
    service: '网络安全等级保护测评服务',
    amount: '/',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-16',
    listKey: '1-16',
    section: '评标办法',
    name: '凯本财产保险(中国)有限公司2023年系统等级保护测评项目',
    signedAt: '2023年10月31日',
    client: '凯本财产保险(中国)有限公司',
    service: '网络安全等级保护测评服务',
    amount: '6万元',
    pageHint: '第125页起',
    projectType: '等保测评'
  },
  {
    id: 'jd-case-s-17',
    listKey: '1-17',
    section: '评标办法',
    name: '凯本财产保险网络安全等级保护测评服务',
    signedAt: '2024年12月',
    client: '凯本财产保险(中国)有限公司',
    service: '网络安全等级保护测评服务',
    amount: '/',
    pageHint: '第125页起',
    projectType: '等保测评'
  }
];

const inferIndustryFromClient = (client: string) => {
  if (/(银行|保险|证券|信托|消费金融)/.test(client)) return '金融';
  if (/(政府|财政厅|公安|网信|政务)/.test(client)) return '政务';
  if (/(医院|医疗|卫生)/.test(client)) return '医疗';
  return '综合';
};

const inferCaseLevelCoverage = (row: JindunCaseRow) =>
  row.section === '基本资质要求' ? '二级 / 三级' : '未注明';

const inferCaseScope = (row: JindunCaseRow) => {
  const systemMatch = row.name.match(/(\d+)(个系统|套系统)/);
  const systemText = systemMatch ? `覆盖 ${systemMatch[1]}${systemMatch[2]}，` : '';

  if (/框架合同|入围/.test(row.name)) {
    return `${systemText}框架合同类项目，支持多批次系统测评与持续服务，具体范围以合同关键页为准。`;
  }

  if (/风险评估/.test(row.service) || /风险评估/.test(row.name)) {
    return `${systemText}包含等级保护测评与安全防护评估相关工作，具体工作范围以合同关键页为准。`;
  }

  return `${systemText}当前已沉淀 ${row.service} 相关案例信息，具体工作范围以合同关键页为准。`;
};

const inferCaseTags = (row: JindunCaseRow) => {
  const tags = [
    `${inferIndustryFromClient(row.client)}行业`,
    row.section === '基本资质要求' ? '基本资质' : '评分案例'
  ];

  if (row.projectType) tags.push(row.projectType);
  if (/框架合同|入围/.test(row.name)) tags.push('框架合同');
  if (/风险评估/.test(row.service) || /风险评估/.test(row.name)) tags.push('风险评估');
  if (/(\d+)(个系统|套系统)/.test(row.name)) tags.push('多系统');

  return Array.from(new Set(tags));
};

const buildCaseProofDocuments = (row: JindunCaseRow): NonNullable<Material['proofDocuments']> => {
  if (row.section !== '基本资质要求') return [];

  return [
    {
      name: `${row.name} · 合同首页`,
      type: 'contract',
      fileId: 1
    },
    {
      name: `${row.name} · 服务内容页`,
      type: 'contract',
      fileId: 1
    },
    {
      name: `${row.name} · 金额/时间页`,
      type: 'contract',
      fileId: 1
    }
  ];
};

const buildCaseEvidenceRecord = (row: JindunCaseRow): PerformanceCaseEvidence => ({
  organizationId: 'org-jindun',
  projectName: row.name,
  clientName: row.client,
  projectType: row.projectType,
  industry: inferIndustryFromClient(row.client),
  serviceContent: row.service,
  contractAmount: row.amount,
  signedAt: row.signedAt,
  sourceSection: row.section,
  evidenceType: 'case_list',
  proofStatus: row.section === '基本资质要求' ? 'partial' : 'list_only',
  scopeSummary: inferCaseScope(row),
  highlights: inferCaseTags(row).join(' / '),
  quoteText: `合同/项目名称：${row.name}；签订时间：${row.signedAt}；使用单位：${row.client}；案例主要服务内容：${row.service}；合同总金额：${row.amount}。`,
  confidence: 0.93
});

function buildJindunCaseMaterials(): Material[] {
  return jindunCaseRows.map((row, index) => ({
    id: row.id,
    name: `[${row.section} ${row.listKey}] ${row.name}`,
    category: 'case',
    categoryLabel: '业绩案例',
    summary: `${row.client} · 签订 ${row.signedAt} · 合同总额 ${row.amount}`,
    contentType: 'text',
    fullText: `业绩案例列表（${row.section}）序号 ${row.listKey}。合同/项目名称：${row.name}。签订时间：${row.signedAt}。使用单位：${row.client}。案例主要服务内容：${row.service}。合同总金额：${row.amount}。`,
    keyInfo: [
      { key: '表格序号', value: row.listKey },
      { key: '列表章节', value: row.section },
      { key: '来源场景', value: row.section },
      { key: '项目名称', value: row.name },
      { key: '客户单位', value: row.client },
      { key: '甲方单位', value: row.client },
      { key: '案例主要服务内容', value: row.service },
      { key: '服务内容', value: row.service },
      { key: '服务范围说明', value: inferCaseScope(row) },
      { key: '合同金额', value: row.amount },
      { key: '签订日期', value: row.signedAt },
      { key: '等保等级覆盖', value: inferCaseLevelCoverage(row) },
      { key: '关键标签', value: inferCaseTags(row).join(' / ') },
      { key: '项目状态', value: '已公示于投标文件' }
    ],
    sourceFileId: 1,
    pageRange: row.pageHint,
    projectType: row.projectType,
    proofDocuments: buildCaseProofDocuments(row),
    listOrder: index + 1,
    caseEvidence: buildCaseEvidenceRecord(row)
  }));
}

function buildPersonnelSources(idx: number, name: string, role: string): PersonnelSourceItem[] {
  const fileId = 1;
  const makePreview = (label: string, accent: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
        <rect width="720" height="420" fill="#ffffff"/>
        <rect x="24" y="24" width="672" height="372" rx="14" fill="#f8fafc" stroke="#e2e8f0"/>
        <rect x="24" y="24" width="672" height="64" rx="14" fill="${accent}" opacity="0.12"/>
        <text x="48" y="66" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial" font-size="18" fill="#0f172a" font-weight="700">${label}</text>
        <text x="48" y="104" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial" font-size="14" fill="#64748b">${name} · ${role} · 证据预览（Demo）</text>
        <text x="48" y="152" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial" font-size="13" fill="#334155">此处展示原图/扫描件预览（原型占位）。点击「查看素材」定位到源文件页码。</text>
      </svg>`
    )}`;
  const items: PersonnelSourceItem[] = [
    {
      id: `jd-team-${idx}-src-table`,
      title: `人员配置表 · 第 ${idx} 行（姓名 / 学历 / 资质认证）`,
      kind: 'table',
      sourceFileId: fileId,
      pageRange: '第456页起',
      note: '《服务团队人员列表》'
    },
    {
      id: `jd-team-${idx}-src-cert`,
      title: `${name} — 网络安全等级测评师证书复印件`,
      kind: 'certificate',
      sourceFileId: fileId,
      pageRange: '人员资质文件分册',
      note: '与列表序号一致的资质复印件装订顺序',
      previewDataUrl: makePreview('证书复印件', '#2563eb')
    }
  ];
  if (role === '项目经理' || idx === 1) {
    items.push({
      id: `jd-team-${idx}-src-resume`,
      title: `${name} — 项目经理简历`,
      kind: 'resume',
      sourceFileId: fileId,
      pageRange: '第4175页起',
      note: '简历与项目经验证明',
      previewDataUrl: makePreview('简历页', '#16a34a')
    });
  }
  return items;
}

function buildJindunTeamMaterials(): Material[] {
  const base: Material[] = teamRows.map(([idx, name, edu, exp, cert, role]) => ({
    id: `jd-team-${idx}`,
    name: `${name} - ${role}`,
    category: 'team' as const,
    categoryLabel: '项目团队',
    summary: `投标文件「人员配置」表第 ${idx} 行：${cert}，测评相关经验 ${exp}。`,
    contentType: 'text' as const,
    keyInfo: [
      { key: '序号', value: String(idx) },
      { key: '姓名', value: name },
      { key: '职务', value: role },
      { key: '学历', value: edu },
      { key: '网络安全等级保护测评工作经验', value: exp },
      { key: '资质认证', value: cert }
    ],
    sourceFileId: 1,
    pageRange: '人员配置表（约第3347行文本位置）',
    listOrder: idx,
    personnelSources: buildPersonnelSources(idx, name, role)
  }));

  // Add multi-record examples: same person with multiple certifications/experience entries.
  // These rows share the same 姓名/职务 so the UI can collapse/expand them as "other entries".
  const chen = base.find((m) => m.id === 'jd-team-1');
  if (chen) {
    base.push({
      ...chen,
      id: 'jd-team-1-b',
      summary: '同一人员的第二条资质/经验记录（用于演示折叠展开）。',
      keyInfo: [
        { key: '序号', value: '1-2' },
        { key: '姓名', value: '陈大文' },
        { key: '职务', value: '项目经理' },
        { key: '学历', value: '本科' },
        { key: '网络安全等级保护测评工作经验', value: '13年' },
        { key: '资质认证', value: 'CISP（国家注册信息安全专业人员）' }
      ],
      // Keep near original ordering but let stable sort place it after the primary row.
      listOrder: (chen.listOrder ?? 1) + 0.01
    });
  }

  const li = base.find((m) => m.id === 'jd-team-2');
  if (li) {
    const getVal = (key: string) => li.keyInfo.find((kv) => kv.key === key)?.value ?? '';
    base.push({
      ...li,
      id: 'jd-team-2-b',
      summary: '同一人员的第二条资质/经验记录（用于演示折叠展开）。',
      keyInfo: [
        { key: '序号', value: '2-2' },
        { key: '姓名', value: getVal('姓名') || '—' },
        { key: '职务', value: getVal('职务') || '—' },
        { key: '学历', value: getVal('学历') || '—' },
        { key: '网络安全等级保护测评工作经验', value: '9年' },
        { key: '资质认证', value: '中级测评师（补充资质记录）' }
      ],
      listOrder: (li.listOrder ?? 2) + 0.01
    });
  }

  return base;
}

interface JindunResumeProjectRow {
  year: string;
  projectName: string;
  clientName?: string;
  role: string;
  domain: string;
  caseId?: string;
}

interface JindunResumeProfile {
  age: string;
  school: string;
  major: string;
  degree: string;
  professionalTitle: string;
  currentPosition: string;
  workYears: number;
  coreYears: number;
  assignedRole: string;
  joinedSummary: string;
  similarExperience: string;
  resumeSummary: string;
  projects: JindunResumeProjectRow[];
  resumePreview: SourcePreviewEvidence;
  educationPreview?: SourcePreviewEvidence;
  degreePreview?: SourcePreviewEvidence;
  socialSecurityPreview?: SourcePreviewEvidence;
}

const jindunResumeProfiles: Record<string, JindunResumeProfile> = {
  陈大文: {
    age: '36岁',
    school: '南京大学',
    major: '信息管理与信息系统专业',
    degree: '学士',
    professionalTitle: '高级工程师',
    currentPosition: '技术总监',
    workYears: 15,
    coreYears: 13,
    assignedRole: '项目经理',
    joinedSummary: '陈大文2010年入职金盾检测技术股份有限公司至今',
    similarExperience: '江苏省财政厅财政信息管理中心江苏省财政厅信息系统等级保护测评服务',
    resumeSummary:
      '陈大文，本科学历，毕业于南京大学信息管理与信息系统专业，现任技术总监，累计15年网络安全从业经验，其中13年聚焦等级保护测评，拟任本项目项目经理。',
    projects: [
      {
        year: '2025年',
        projectName: '中国光大银行股份有限公司南京分行南京分行2025年安全等级保护测评项目',
        clientName: '中国光大银行股份有限公司南京分行',
        role: '项目经理',
        domain: '等级保护测评',
        caseId: 'jd-case-r-1'
      },
      {
        year: '2023年',
        projectName: '中国农业银行股份有限公司江苏省分行2023年中国农业银行股份有限公司江苏省分行信息系统等级保护第三方测评服务项目',
        clientName: '中国农业银行股份有限公司江苏省分行',
        role: '项目经理',
        domain: '等级保护测评',
        caseId: 'jd-case-r-2'
      },
      {
        year: '2025年',
        projectName: '中国农业银行股份有限公司苏州分行2025年网络安全等级保护测评服务',
        clientName: '中国农业银行股份有限公司苏州分行',
        role: '项目经理',
        domain: '等级保护测评',
        caseId: 'jd-case-r-3'
      },
      {
        year: '2024年',
        projectName: '中国邮政储蓄银行北京分行2024年网络安全等级保护测评服务',
        clientName: '中国邮政储蓄银行北京分行',
        role: '项目经理',
        domain: '等级保护测评',
        caseId: 'jd-case-r-4'
      },
      {
        year: '2023年',
        projectName: '中银金融商务（昆山）有限公司2023年骨干网网络安全等级保护备案与测评',
        clientName: '中银金融商务（昆山）有限公司',
        role: '项目经理',
        domain: '等级保护测评',
        caseId: 'jd-case-r-5'
      },
      {
        year: '2020年',
        projectName: '兴业银行股份有限公司南京分行兴业南京分行2024年度信息系统等级保护测评服务',
        clientName: '兴业银行股份有限公司南京分行',
        role: '项目经理',
        domain: '等级保护测评',
        caseId: 'jd-case-r-6'
      },
      {
        year: '2024年',
        projectName: '江苏常熟农村商业银行股份有限公司常熟农村商业银行2024年等级保护测评项目',
        clientName: '江苏常熟农村商业银行股份有限公司',
        role: '项目经理',
        domain: '等级保护测评',
        caseId: 'jd-case-r-7'
      }
    ],
    resumePreview: makeTextPreview(
      '陈大文-项目经理简历',
      [
        '姓名：陈大文',
        '年龄：36岁',
        '毕业学校：南京大学',
        '专业：信息管理与信息系统专业',
        '学位：学士',
        '职称：高级工程师',
        '职务：技术总监',
        '现所在单位：金盾检测技术股份有限公司',
        '工作时间：15年',
        '拟在本项目担任职务：项目经理',
        '同类项目工作经验：江苏省财政厅财政信息管理中心江苏省财政厅信息系统等级保护测评服务'
      ],
      {
        subtitle: '服务团队人员资质文件摘录',
        pageLabel: '陈大文-项目经理简历',
        targetPage: 4175
      }
    ),
    educationPreview: makeTextPreview(
      '陈大文-学历信息摘录',
      ['毕业学校：南京大学', '专业：信息管理与信息系统专业', '学位：学士'],
      { subtitle: '项目经理简历', pageLabel: '陈大文-项目经理简历', targetPage: 4175 }
    ),
    degreePreview: makeTextPreview(
      '陈大文-学位信息摘录',
      ['学位：学士', '毕业学校：南京大学', '专业：信息管理与信息系统专业'],
      { subtitle: '项目经理简历', pageLabel: '陈大文-项目经理简历', targetPage: 4175 }
    )
  },
  邢伟: {
    age: '38岁',
    school: '滁州学院',
    major: '信息与计算机学专业',
    degree: '',
    professionalTitle: '高级工程师',
    currentPosition: '技术副总监',
    workYears: 15,
    coreYears: 9,
    assignedRole: '团队人员',
    joinedSummary: '2015年入职金盾检测技术股份有限公司至今',
    similarExperience: '江苏省财政厅财政信息管理中心江苏省财政厅信息系统等级保护测评服务',
    resumeSummary:
      '邢伟，本科学历，毕业于滁州学院信息与计算机学专业，现任技术副总监，累计15年从业经验，其中9年从事等级保护测评工作。',
    projects: [
      {
        year: '2023年',
        projectName: '中国光大银行股份有限公司南京分行',
        clientName: '中国光大银行股份有限公司南京分行',
        role: '测评师',
        domain: '等保测评'
      }
    ],
    resumePreview: makeTextPreview(
      '邢伟-团队人员简历',
      [
        '姓名：邢伟',
        '年龄：38岁',
        '毕业学校：滁州学院',
        '专业：信息与计算机学专业',
        '职称：高级工程师',
        '职务：技术副总监',
        '现所在单位：金盾检测技术股份有限公司',
        '工作时间：15年',
        '拟在本项目担任职务：团队人员',
        '主要经历：2015年入职金盾检测技术股份有限公司至今'
      ],
      { subtitle: '服务团队人员资质文件摘录', pageLabel: '邢伟-团队人员简历', targetPage: 4201 }
    ),
    educationPreview: makeTextPreview(
      '邢伟-学历信息摘录',
      ['毕业学校：滁州学院', '专业：信息与计算机学专业'],
      { subtitle: '团队人员简历', pageLabel: '邢伟-团队人员简历', targetPage: 4201 }
    )
  },
  邵君立: {
    age: '33岁',
    school: '南京林业大学南方学院',
    major: '计算机科学与技术',
    degree: '',
    professionalTitle: '高级工程师',
    currentPosition: '测评师',
    workYears: 8,
    coreYears: 8,
    assignedRole: '团队人员',
    joinedSummary: '2017年入职金盾检测技术股份有限公司至今',
    similarExperience: '江苏省财政厅财政信息管理中心江苏省财政厅信息系统等级保护测评服务',
    resumeSummary:
      '邵君立，本科学历，毕业于南京林业大学南方学院计算机科学与技术专业，现任测评师，累计8年等级保护测评相关经验。',
    projects: [
      {
        year: '2023年',
        projectName: '中国光大银行股份有限公司南京分行',
        clientName: '中国光大银行股份有限公司南京分行',
        role: '测评师',
        domain: '等保测评'
      }
    ],
    resumePreview: makeTextPreview(
      '邵君立-团队人员简历',
      [
        '姓名：邵君立',
        '年龄：33岁',
        '毕业学校：南京林业大学南方学院',
        '专业：计算机科学与技术',
        '职称：高级工程师',
        '职务：测评师',
        '现所在单位：金盾检测技术股份有限公司',
        '工作时间：8年',
        '拟在本项目担任职务：团队人员',
        '主要经历：2017年入职金盾检测技术股份有限公司至今'
      ],
      { subtitle: '服务团队人员资质文件摘录', pageLabel: '邵君立-团队人员简历', targetPage: 4202 }
    ),
    educationPreview: makeTextPreview(
      '邵君立-学历信息摘录',
      ['毕业学校：南京林业大学南方学院', '专业：计算机科学与技术'],
      { subtitle: '团队人员简历', pageLabel: '邵君立-团队人员简历', targetPage: 4202 }
    )
  },
  程嘉: {
    age: '27岁',
    school: '南京大学金陵学院',
    major: '计算机科学与技术',
    degree: '',
    professionalTitle: '高级工程师',
    currentPosition: '测评师',
    workYears: 5,
    coreYears: 5,
    assignedRole: '团队人员',
    joinedSummary: '2020年入职金盾检测技术股份有限公司至今',
    similarExperience: '江苏省财政厅财政信息管理中心江苏省财政厅信息系统等级保护测评服务',
    resumeSummary:
      '程嘉，本科学历，毕业于南京大学金陵学院计算机科学与技术专业，现任测评师，累计5年等级保护测评相关经验。',
    projects: [
      {
        year: '2023年',
        projectName: '中国光大银行股份有限公司南京分行',
        clientName: '中国光大银行股份有限公司南京分行',
        role: '测评师',
        domain: '等保测评'
      }
    ],
    resumePreview: makeTextPreview(
      '程嘉-团队人员简历',
      [
        '姓名：程嘉',
        '年龄：27岁',
        '毕业学校：南京大学金陵学院',
        '专业：计算机科学与技术',
        '职称：高级工程师',
        '职务：测评师',
        '现所在单位：金盾检测技术股份有限公司',
        '工作时间：5年',
        '拟在本项目担任职务：团队人员',
        '主要经历：2020年入职金盾检测技术股份有限公司至今'
      ],
      { subtitle: '服务团队人员资质文件摘录', pageLabel: '程嘉-团队人员简历', targetPage: 4203 }
    ),
    educationPreview: makeTextPreview(
      '程嘉-学历信息摘录',
      ['毕业学校：南京大学金陵学院', '专业：计算机科学与技术'],
      { subtitle: '团队人员简历', pageLabel: '程嘉-团队人员简历', targetPage: 4203 }
    )
  },
  叶茂: {
    age: '27岁',
    school: '江苏大学京江学院',
    major: '通信工程',
    degree: '',
    professionalTitle: '高级工程师',
    currentPosition: '测评师',
    workYears: 5,
    coreYears: 3,
    assignedRole: '团队人员',
    joinedSummary: '2020年入职金盾检测技术股份有限公司至今',
    similarExperience: '江苏省财政厅财政信息管理中心江苏省财政厅信息系统等级保护测评服务',
    resumeSummary:
      '叶茂，本科学历，毕业于江苏大学京江学院通信工程专业，现任测评师，累计5年从业经验，其中3年从事等级保护测评工作。',
    projects: [
      {
        year: '2024年',
        projectName: '中国邮政储蓄银行北京分行',
        clientName: '中国邮政储蓄银行北京分行',
        role: '测评师',
        domain: '等保测评'
      }
    ],
    resumePreview: makeTextPreview(
      '叶茂-团队人员简历',
      [
        '姓名：叶茂',
        '年龄：27岁',
        '毕业学校：江苏大学京江学院',
        '专业：通信工程',
        '职称：高级工程师',
        '职务：测评师',
        '现所在单位：金盾检测技术股份有限公司',
        '工作时间：5年',
        '拟在本项目担任职务：团队人员',
        '主要经历：2020年入职金盾检测技术股份有限公司至今'
      ],
      { subtitle: '服务团队人员资质文件摘录', pageLabel: '叶茂-团队人员简历', targetPage: 4204 }
    ),
    educationPreview: makeTextPreview(
      '叶茂-学历信息摘录',
      ['毕业学校：江苏大学京江学院', '专业：通信工程'],
      { subtitle: '团队人员简历', pageLabel: '叶茂-团队人员简历', targetPage: 4204 }
    )
  },
  陈洁: {
    age: '47岁',
    school: '解放军电子工程学院',
    major: '军事通信学',
    degree: '',
    professionalTitle: '高级工程师',
    currentPosition: '测评师',
    workYears: 5,
    coreYears: 20,
    assignedRole: '团队人员',
    joinedSummary: '2020年入职金盾检测技术股份有限公司至今',
    similarExperience: '江苏省财政厅财政信息管理中心江苏省财政厅信息系统等级保护测评服务',
    resumeSummary:
      '陈洁，硕士研究生学历，毕业于解放军电子工程学院军事通信学专业，现任测评师，团队列表载明其具备20年等级保护测评工作经验。',
    projects: [
      {
        year: '2023年',
        projectName: '中国光大银行股份有限公司南京分行',
        clientName: '中国光大银行股份有限公司南京分行',
        role: '测评师',
        domain: '等保测评'
      }
    ],
    resumePreview: makeTextPreview(
      '陈洁-团队人员简历',
      [
        '姓名：陈洁',
        '年龄：47岁',
        '毕业学校：解放军电子工程学院',
        '专业：军事通信学',
        '职称：高级工程师',
        '职务：测评师',
        '现所在单位：金盾检测技术股份有限公司',
        '工作时间：5年',
        '拟在本项目担任职务：团队人员',
        '主要经历：2020年入职金盾检测技术股份有限公司至今'
      ],
      { subtitle: '服务团队人员资质文件摘录', pageLabel: '陈洁-团队人员简历', targetPage: 4205 }
    ),
    educationPreview: makeTextPreview(
      '陈洁-学历信息摘录',
      ['毕业学校：解放军电子工程学院', '专业：军事通信学', '学历：硕士研究生'],
      { subtitle: '团队人员简历', pageLabel: '陈洁-团队人员简历', targetPage: 4205 }
    ),
    socialSecurityPreview: makeTextPreview(
      '陈洁-社保证明',
      ['投标文件在“陈洁-资质认证”后附有“社保”材料页。'],
      { subtitle: '服务团队人员资质文件摘录', pageLabel: '陈洁-社保', targetPage: 4206 }
    )
  }
};

const chenResumeProfile = jindunResumeProfiles['陈大文'];

const jindunResumeCaseRows = (chenResumeProfile?.projects ?? []).filter(
  (project): project is JindunResumeProjectRow & { caseId: string } => Boolean(project.caseId)
);

const jindunResumeCaseMaterials: Material[] = jindunResumeCaseRows.map((project, index) => ({
  id: project.caseId,
  name: project.projectName,
  category: 'case',
  categoryLabel: '项目经理业绩',
  summary: `${project.clientName} · ${project.year} · ${project.role}`,
  contentType: 'text',
  keyInfo: [
    { key: '项目名称', value: project.projectName },
    { key: '客户单位', value: project.clientName ?? '—' },
    { key: '签订日期', value: project.year },
    { key: '服务内容', value: project.domain },
    { key: '来源说明', value: '陈大文-项目经理的相关项目经验 / 合同关键页目录' }
  ],
  sourceFileId: 1,
  pageRange: '陈大文-项目经理的相关项目经验',
  projectType: '等保测评',
  proofDocuments: [
    {
      name: `${project.projectName} · 合同关键页`,
      type: 'contract',
      fileId: 1
    }
  ],
  caseEvidence: {
    organizationId: 'org-jindun',
    projectName: project.projectName,
    clientName: project.clientName ?? '',
    projectType: '等保测评',
    industry: '金融',
    serviceContent: '等级保护测评',
    signedAt: project.year,
    sourceSection: '项目经理相关项目经验',
    evidenceType: 'contract',
    proofStatus: 'partial',
    scopeSummary: '投标文件列示了合同关键页/合同名称，可作为项目经理履历证明。',
    highlights: '项目经理履历 / 合同关键页',
    quoteText: `${project.year} ${project.projectName}`,
    confidence: 0.92
  },
  previewEvidence: makeTextPreview(
    `${project.projectName} - 合同关键页目录`,
    [
      '来源：陈大文-项目经理的相关项目经验',
      `项目名称：${project.projectName}`,
      `甲方单位：${project.clientName ?? '—'}`,
      `担任何职：${project.role}`,
      `服务类型：${project.domain}`,
      `时间：${project.year}`
    ],
    {
      subtitle: `证据 ${index + 1}`,
      pageLabel: '陈大文-项目经理的相关项目经验',
      targetPage: 4181 + index
    }
  )
}));

function buildQualificationRecord(
  overrides: Partial<QualificationRecord> & Pick<QualificationRecord, 'organizationId' | 'category' | 'name'>
): QualificationRecord {
  return {
    subcategory: '',
    level: '',
    majorScope: '',
    standardCode: '',
    issuer: '',
    certificateNo: '',
    issuedAt: '',
    expiresAt: '',
    status: 'valid',
    honorLevel: '',
    description: '',
    rawText: '',
    isStructured: true,
    ...overrides
  };
}

const jindunCertificateMaterials: Material[] = [
  {
    id: 'jd-cert-1',
    name: '企业法人营业执照副本',
    listOrder: 1,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '主体证明，用于资格审查中的独立法人实体校验。',
    contentType: 'mixed',
    keyInfo: [
      { key: '统一社会信用代码', value: '91320000559284761U' },
      { key: '登记机关', value: '南京市市场监督管理局' },
      { key: '法定代表人', value: '孙晶华' }
    ],
    sourceFileId: 1,
    pageRange: '第16页',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '主体证明',
      subcategory: '营业执照',
      name: '企业法人营业执照副本',
      majorScope: '用于证明投标主体合法存续、具备独立法人资格。',
      issuer: '南京市市场监督管理局',
      issuedAt: '2025-07-23',
      status: 'valid',
      bucket: '主体证明',
      biddingRole: '准入',
      serviceDomains: ['通用'],
      proofType: '证书',
      verificationMethod: '通过统一社会信用代码进行工商信息核验',
      description: '对应资格审查中的主体合法性要求，通常与工商变更材料一起提交。',
      rawText: '企业法人营业执照副本'
    })
  },
  {
    id: 'jd-cert-2',
    name: '公司名称及法定代表人变更说明',
    listOrder: 2,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '主体证明补充材料，用于解释名称和法定代表人变更。',
    contentType: 'text',
    keyInfo: [
      { key: '证明形式', value: '说明函 + 变更登记通知书' },
      { key: '适用场景', value: '历史合同、证书、公章信息与现主体名称不一致时使用' }
    ],
    sourceFileId: 1,
    pageRange: '第17页',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '主体证明',
      subcategory: '变更说明',
      name: '公司名称及法定代表人变更说明',
      majorScope: '用于解释营业执照法定代表人变更、公司名称沿革等主体连续性问题。',
      issuer: '金盾检测技术股份有限公司',
      issuedAt: '2025-11-26',
      status: 'valid',
      bucket: '主体证明',
      biddingRole: '辅助证明',
      serviceDomains: ['通用'],
      proofType: '说明函',
      verificationMethod: '结合营业执照复印件与工商变更登记通知书交叉核验',
      description: '解决投标文件中历史业绩、旧公章或旧公司名称与当前主体名称不一致的问题。',
      rawText: '关于营业执照法定代表人变更的声明 / 关于本公司名称变更的重要事项说明'
    })
  },
  {
    id: 'jd-cert-3',
    name: '网络安全等级测评与检测评估机构服务认证证书',
    listOrder: 3,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '等保项目准入资质，对应招标文件合格投标人基本资质要求。',
    contentType: 'mixed',
    keyInfo: [
      { key: '资质认证名称', value: '网络安全等级测评与检测评估机构服务认证证书' },
      { key: '适用服务线', value: '等级保护测评' },
      { key: '证明形式', value: '证书复印件' }
    ],
    sourceFileId: 1,
    pageRange: '第37页',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '准入资质',
      subcategory: '等保测评准入',
      name: '网络安全等级测评与检测评估机构服务认证证书',
      majorScope: '用于证明企业具备开展网络安全等级保护测评服务的准入资格。',
      issuer: '公安部第三研究所（认证中心）',
      status: 'valid',
      bucket: '准入资质',
      biddingRole: '准入',
      serviceDomains: ['等保'],
      proofType: '证书',
      verificationMethod: '结合证书信息与认监委/主管单位公开信息核验',
      description: '在等保测评项目中通常属于一票否决型基础资质。',
      rawText: '具备国家认监委认定机构颁发的、有效期内的《网络安全等级测评与检测评估机构服务认证证书》'
    })
  },
  {
    id: 'jd-cert-4',
    name: '全国网络安全等级测评与检测评估机构目录截图',
    listOrder: 4,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '准入证明截图，用于证明企业在官方名录内。',
    contentType: 'mixed',
    keyInfo: [
      { key: '证明网站', value: 'www.djbh.net' },
      { key: '证明形式', value: '官方目录截图' },
      { key: '适用服务线', value: '等级保护测评' }
    ],
    sourceFileId: 1,
    pageRange: '第47页',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '准入资质',
      subcategory: '官方目录',
      name: '全国网络安全等级测评与检测评估机构目录截图',
      majorScope: '用于证明企业已列入全国网络安全等级测评与检测评估机构目录。',
      issuer: '网络安全等级保护网',
      status: 'valid',
      bucket: '准入资质',
      biddingRole: '准入',
      serviceDomains: ['等保'],
      proofType: '目录截图',
      verificationMethod: '官网目录截图与企业名称匹配核验',
      description: '与等保测评服务认证证书配套出现，是招标文件常见的双重准入证明。',
      rawText: '投标人须在“网络安全等级保护网（www.djbh.net）”上的《全国网络安全等级测评与检测评估机构目录》中，须提供截图证明'
    })
  },
  {
    id: 'jd-cert-5',
    name: '质量管理体系认证证书',
    listOrder: 5,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '管理体系认证，常作为评分项中的体系能力证明。',
    contentType: 'mixed',
    keyInfo: [
      {
        key: '资质认证名称',
        value: '质量管理体系认证证书，认证依据为GB/T 19001或ISO 9001'
      },
      { key: '颁发机构', value: '中鸿认证（江苏）有限公司' },
      { key: '颁发时间', value: '2024年01月18日' },
      { key: '认证依据', value: 'GB/T 19001 / ISO 9001' }
    ],
    sourceFileId: 1,
    pageRange: '第63页',
    expiryDate: '2027-01-17',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '管理体系认证',
      subcategory: '质量管理体系',
      name: '质量管理体系认证证书',
      standardCode: 'GB/T 19001 / ISO 9001',
      issuer: '中鸿认证（江苏）有限公司',
      issuedAt: '2024-01-18',
      expiresAt: '2027-01-17',
      status: 'valid',
      bucket: '管理体系认证',
      biddingRole: '评分',
      serviceDomains: ['通用'],
      proofType: '证书',
      verificationMethod: '国家认证认可监督管理委员会官网查验截图',
      description: '用于证明企业质量管理体系符合标准要求，是投标文件中提供的正式认证证书之一。',
      rawText: '质量管理体系认证证书，认证依据为GB/T 19001或ISO 9001'
    })
  },
  {
    id: 'jd-cert-6',
    name: '信息安全管理体系认证证书',
    listOrder: 6,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '管理体系认证，常用于安全管理能力评分。',
    contentType: 'mixed',
    keyInfo: [
      {
        key: '资质认证名称',
        value: '信息安全管理体系认证证书，认证依据为GB/T 22080或ISO 27001'
      },
      { key: '颁发机构', value: '华信创（北京）认证中心有限公司' },
      { key: '颁发时间', value: '2024年12月23日' },
      { key: '认证依据', value: 'GB/T 22080 / ISO 27001' }
    ],
    sourceFileId: 1,
    pageRange: '第63页',
    expiryDate: '2027-12-22',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '管理体系认证',
      subcategory: '信息安全管理体系',
      name: '信息安全管理体系认证证书',
      standardCode: 'GB/T 22080 / ISO 27001',
      issuer: '华信创（北京）认证中心有限公司',
      issuedAt: '2024-12-23',
      expiresAt: '2027-12-22',
      status: 'valid',
      bucket: '管理体系认证',
      biddingRole: '评分',
      serviceDomains: ['通用', '等保'],
      proofType: '证书',
      verificationMethod: '国家认证认可监督管理委员会官网查验截图',
      description: '用于证明企业具备信息安全管理体系能力，适合招投标中的安全管理能力响应。',
      rawText: '信息安全管理体系认证证书，认证依据为GB/T 22080或ISO 27001'
    })
  },
  {
    id: 'jd-cert-7',
    name: '信息技术服务管理体系认证证书',
    listOrder: 7,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '管理体系认证，常用于信息技术服务能力评分。',
    contentType: 'mixed',
    keyInfo: [
      {
        key: '资质认证名称',
        value: '信息技术服务管理体认证证书，认证依据为ISO/IEC 20000'
      },
      { key: '颁发机构', value: '华信创（北京）认证中心有限公司' },
      { key: '颁发时间', value: '2024年7月21日' },
      { key: '认证依据', value: 'ISO/IEC 20000' }
    ],
    sourceFileId: 1,
    pageRange: '第63页',
    expiryDate: '2027-07-20',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '管理体系认证',
      subcategory: '信息技术服务管理体系',
      name: '信息技术服务管理体系认证证书',
      standardCode: 'ISO/IEC 20000',
      issuer: '华信创（北京）认证中心有限公司',
      issuedAt: '2024-07-21',
      expiresAt: '2027-07-20',
      status: 'valid',
      bucket: '管理体系认证',
      biddingRole: '评分',
      serviceDomains: ['通用'],
      proofType: '证书',
      verificationMethod: '国家认证认可监督管理委员会官网查验截图',
      description: '用于证明企业在信息技术服务管理方面具备规范化体系能力。',
      rawText: '信息技术服务管理体认证证书，认证依据为ISO/IEC 20000'
    })
  },
  {
    id: 'jd-cert-8',
    name: '检验检测机构资质认定 CMA 证书',
    listOrder: 8,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '能力资质，常作为测评能力加分项。',
    contentType: 'mixed',
    keyInfo: [
      { key: '资质认证名称', value: '检验检测机构资质认定CMA证书' },
      { key: '颁发机构', value: '江苏省市场监督管理局' },
      { key: '颁发时间', value: '2021年6月21日（2023年9月21日）' },
      { key: '备注', value: '含延续日期表述' }
    ],
    sourceFileId: 1,
    pageRange: '第64页',
    expiryDate: '2026-09-20',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '能力资质',
      subcategory: '检验检测资质',
      name: '检验检测机构资质认定证书',
      issuer: '江苏省市场监督管理局',
      issuedAt: '2021-06-21',
      expiresAt: '2026-09-20',
      status: 'valid',
      bucket: '能力资质',
      biddingRole: '评分',
      serviceDomains: ['等保'],
      proofType: '证书',
      verificationMethod: '证书复印件与主管部门公开信息核验',
      description: '原文列示发证时间为“2021年6月21日（2023年9月21日）”，可理解为首发日期与延续/变更日期并存。',
      rawText: '检验检测机构资质认定CMA证书',
      isStructured: true
    })
  },
  {
    id: 'jd-cert-9',
    name: 'CNAS 检验机构认可证书（含等保测评能力）',
    listOrder: 9,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '能力资质，常作为高权重加分项。',
    contentType: 'mixed',
    keyInfo: [
      {
        key: '资质认证名称',
        value:
          '中国合格评定国家认可委员会（CNAS）颁发的检验机构认可证书，且认可得检验能力范围包括网络安全等级保护测评'
      },
      { key: '颁发机构', value: '中国合格评定国家认可委员会' },
      { key: '颁发时间', value: '2023年9月5日' }
    ],
    sourceFileId: 1,
    pageRange: '第64页',
    expiryDate: '2026-09-04',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '能力资质',
      subcategory: '认可资质',
      name: '检验机构认可证书',
      majorScope: '检验能力范围包括网络安全等级保护测评',
      issuer: '中国合格评定国家认可委员会',
      issuedAt: '2023-09-05',
      expiresAt: '2026-09-04',
      status: 'valid',
      bucket: '能力资质',
      biddingRole: '评分',
      serviceDomains: ['等保'],
      proofType: '证书',
      verificationMethod: '证书复印件与能力范围页核验',
      description: '该认可证书体现企业具备检验机构认可能力，且能力范围覆盖网络安全等级保护测评。',
      rawText: '中国合格评定国家认可委员会（CNAS）颁发的检验机构认可证书，且认可得检验能力范围包括网络安全等级保护测评'
    })
  },
  {
    id: 'jd-cert-10',
    name: '高新技术企业证书',
    listOrder: 10,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '荣誉品牌类证明，常用于商务包装与企业综合实力展示。',
    contentType: 'text',
    keyInfo: [
      { key: '资质级别', value: '国家级' },
      { key: '适用场景', value: '商务部分展示、企业介绍' }
    ],
    sourceFileId: 1,
    pageRange: '第946页',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '荣誉品牌',
      subcategory: '科技创新类',
      name: '高新技术企业证书',
      issuer: '江苏省科学技术厅等',
      status: 'valid',
      bucket: '荣誉品牌',
      biddingRole: '展示',
      serviceDomains: ['通用'],
      proofType: '证书',
      verificationMethod: '高新技术企业认定公示信息核验',
      description: '用于证明企业创新能力和品牌形象，通常在商务部分形成加分或形象背书。',
      rawText: '企业资质：具备高新技术企业、双软企业、专精特新企业'
    })
  },
  {
    id: 'jd-cert-11',
    name: '国家标准起草参与证明',
    listOrder: 11,
    category: 'certificate',
    categoryLabel: '企业资质',
    summary: '行业参与类材料，用于证明企业在标准制定和行业治理中的参与度。',
    contentType: 'text',
    keyInfo: [
      { key: '参与方向', value: '商用密码 / 信息系统密码应用安全' },
      { key: '证明形式', value: '说明材料或官方标准起草单位页' }
    ],
    sourceFileId: 1,
    pageRange: '第950页',
    qualification: buildQualificationRecord({
      organizationId: 'org-jindun',
      category: '行业参与',
      subcategory: '标准起草',
      name: '国家标准起草参与证明',
      majorScope: '用于证明企业参与国家级或行业级网络安全、密码应用相关标准制定。',
      issuer: '标准发布或归口单位',
      status: 'valid',
      bucket: '行业参与',
      biddingRole: '展示',
      serviceDomains: ['密评', '数据安全'],
      proofType: '说明函',
      verificationMethod: '标准发布页或起草单位名单核验',
      description: '在能源、核电等项目中，这类材料通常体现专业影响力与行业参与深度。',
      rawText: '我公司作为起草单位参与了国家标准 GB/T 39786-2021《信息安全技术 信息系统密码应用基本要求》'
    })
  }
];

const jindunProfileCompany: Material = {
  id: 'jd-profile-company',
  name: '金盾检测技术股份有限公司',
  category: 'company',
  categoryLabel: '企业简介',
  summary:
    '成立于2010年，法定代表人为孙晶华，总部位于南京；主营检验检测、互联网安全服务、信息技术咨询及系统运维等综合服务体系。',
  contentType: 'text',
  fullText: `# 金盾检测技术股份有限公司

## 企业介绍

金盾检测技术股份有限公司是一家专注于网络安全与信息技术服务的高新技术企业。公司成立于2010年，法定代表人为孙晶华，总部位于南京。其核心业务范围涵盖检验检测服务、互联网安全服务、信息技术咨询及系统运行维护，并具备输电、供电、受电电力设施的安装、维修和试验等专业能力，形成了覆盖网络安全评估、技术支撑与基础设施服务的综合服务体系。

作为江苏省网络安全重点企业和南京市瞪羚企业，公司展现了强劲的创新活力与发展潜力。在技术研发与创新方面，公司构建了坚实的科研平台，被认定为省级企业技术中心、市级企业技术中心及市级企业工程中心。其技术实力在国家级竞赛中得到印证，曾于2023年荣获数字中国创新大赛网络数据安全赛道铜奖。同时，公司在漏洞挖掘与响应领域具备专业能力，拥有中国信息安全测评中心颁发的漏洞报送证明，并向国家互联网应急中心（CNCERT）报送并获得原创漏洞证明，体现了其在网络安全前沿领域的主动贡献与技术深度。

公司长期为江苏省关键信息基础设施的安全保障提供专业支持，是江苏省委网信办“网安2020”、“网安2021”网络安全保障行动的指定检查服务机构，并入选江苏省公安厅网络安全应急支撑团队。这些资质反映了公司在区域网络安全治理和应急响应体系中的重要地位。此外，公司积极推动行业生态建设，担任江苏省信息网络安全协会副会长单位及中关村信息安全测评联盟副理事长单位，在行业标准制定与交流合作中发挥着积极作用。

凭借扎实的技术服务与规范的管理，公司获得了“质量标杆”的省级荣誉认可。金盾检测技术股份有限公司正以其全面的资质体系、专业的技术服务能力和深厚的行业积累，致力于为客户提供可靠的安全检测与技术服务解决方案。

## 资质信息概要

### 一、 企业主体与创新资质
*   合法经营主体：持有南京市市场监督管理局颁发的营业执照。
*   高新技术企业：获得国家高新技术企业认定。
*   创新成长企业：被认定为南京市瞪羚企业、江苏省网络安全重点企业。
*   研发平台：设有省级企业技术中心、市级企业技术中心及市级企业工程中心。

### 二、 网络安全专业资质与行业地位
*   政府技术支撑单位：江苏省委网信办“网安2020”、“网安2021”网络安全保障行动检查服务机构；江苏省公安厅网络安全应急支撑团队。
*   漏洞研究与响应能力：持有中国信息安全测评中心颁发的漏洞报送证明；拥有国家互联网应急中心（CNCERT）签发的原创漏洞证明。
*   行业组织职务：江苏省信息网络安全协会副会长单位；中关村信息安全测评联盟副理事长单位。

### 三、 荣誉与奖项
*   技术竞赛奖项：荣获2023数字中国创新大赛网络数据安全赛道铜奖（国家级）。
*   质量管理荣誉：获得省级“质量标杆”称号。`,
  keyInfo: [
    { key: '法定代表人', value: '孙晶华' },
    { key: '成立年份', value: '2010年' },
    { key: '总部', value: '南京' },
    { key: '素材类型', value: '公司简介（企业介绍 + 资质信息概要）' }
  ],
  sourceFileId: 1,
  pageRange: '投标人情况介绍（企业简介）'
};

const jindunCaseMaterials: Material[] = buildJindunCaseMaterials();
const jindunTeamMaterials: Material[] = buildJindunTeamMaterials();

const SECOND_FILE_ID = 2;
const SECOND_FILE_NAME =
  '南京市智慧城市基础设施建设工程（一期）投标文件+鼎信建设集团有限公司.docx';

const secondFileTeamMaterials: Material[] = [
  {
    id: 'dx-team-1',
    name: '王建国 - 项目经理',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '投标文件「项目管理团队」第 1 行：一级建造师（建筑工程）。',
    contentType: 'text',
    keyInfo: [
      { key: '序号', value: '1' },
      { key: '姓名', value: '王建国' },
      { key: '职务', value: '项目经理' },
      { key: '学历', value: '本科' },
      { key: '注册建造师等级', value: '一级建造师（建筑工程）' },
      { key: '安全员证书', value: 'B类安全员' },
      { key: '从业年限', value: '18年' }
    ],
    sourceFileId: SECOND_FILE_ID,
    pageRange: '第126页',
    listOrder: 1,
    personnelSources: []
  },
  {
    id: 'dx-team-2',
    name: '李明辉 - 技术负责人',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '投标文件「项目管理团队」第 2 行：高级工程师（结构工程）。',
    contentType: 'text',
    keyInfo: [
      { key: '序号', value: '2' },
      { key: '姓名', value: '李明辉' },
      { key: '职务', value: '技术负责人' },
      { key: '学历', value: '硕士' },
      { key: '注册建造师等级', value: '一级建造师（市政公用工程）' },
      { key: '职称', value: '高级工程师（结构工程）' },
      { key: '从业年限', value: '15年' }
    ],
    sourceFileId: SECOND_FILE_ID,
    pageRange: '第127页',
    listOrder: 2,
    personnelSources: []
  },
  {
    id: 'dx-team-3',
    name: '赵春华 - 质量员',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '投标文件「项目管理团队」第 3 行：质量员证书。',
    contentType: 'text',
    keyInfo: [
      { key: '序号', value: '3' },
      { key: '姓名', value: '赵春华' },
      { key: '职务', value: '质量员' },
      { key: '学历', value: '本科' },
      { key: '安全员证书', value: 'C类安全员' },
      { key: '职称', value: '中级工程师（土木工程）' },
      { key: '从业年限', value: '10年' }
    ],
    sourceFileId: SECOND_FILE_ID,
    pageRange: '第128页',
    listOrder: 3,
    personnelSources: []
  },
  {
    id: 'dx-team-4',
    name: '孙丽 - 安全员',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '投标文件「项目管理团队」第 4 行：注册安全工程师。',
    contentType: 'text',
    keyInfo: [
      { key: '序号', value: '4' },
      { key: '姓名', value: '孙丽' },
      { key: '职务', value: '安全员' },
      { key: '学历', value: '本科' },
      { key: '安全员证书', value: 'A类安全员' },
      { key: '注册安全工程师', value: '注册安全工程师（建筑施工安全）' },
      { key: '从业年限', value: '12年' }
    ],
    sourceFileId: SECOND_FILE_ID,
    pageRange: '第129页',
    listOrder: 4,
    personnelSources: []
  },
  {
    id: 'dx-team-5',
    name: '周强 - 造价员',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '投标文件「项目管理团队」第 5 行：注册造价工程师。',
    contentType: 'text',
    keyInfo: [
      { key: '序号', value: '5' },
      { key: '姓名', value: '周强' },
      { key: '职务', value: '造价员' },
      { key: '学历', value: '本科' },
      { key: '注册造价工程师', value: '一级造价工程师（土建）' },
      { key: 'BIM证书', value: 'BIM技术应用工程师（高级）' },
      { key: '从业年限', value: '9年' }
    ],
    sourceFileId: SECOND_FILE_ID,
    pageRange: '第130页',
    listOrder: 5,
    personnelSources: []
  }
];

export const initialMaterials: Material[] = [
  ...jindunCertificateMaterials,
  ...jindunCaseMaterials,
  ...jindunResumeCaseMaterials,
  ...jindunTeamMaterials,
  ...secondFileTeamMaterials,
  jindunProfileCompany
];

export const initialFiles: SourceFile[] = [
  {
    ...bidSourceFileBase,
    materialCount:
      jindunCertificateMaterials.length +
      jindunCaseMaterials.length +
      jindunResumeCaseMaterials.length +
      jindunTeamMaterials.length +
      1
  },
  {
    id: SECOND_FILE_ID,
    name: SECOND_FILE_NAME,
    size: '约 4.2MB',
    words: '约 8.5 万字符（抽取统计）',
    creator: '鼎信建设集团有限公司',
    status: 'completed' as const,
    materialCount: secondFileTeamMaterials.length
  }
];

export const filePreviewData: FilePreview[] = [
  {
    fileId: 1,
    totalPages: 4306,
    content: [
      '农银人寿保险股份有限公司',
      '信息系统安全等级保护测评（等保2.0）项目',
      '投标文件（第一册）',
      '招标编号：0747-2560SCCZC282',
      '投标人：金盾检测技术股份有限公司',
      '日期：2025年11月',
      '',
      '── 评标索引表（摘录）──',
      '商务部分 · 资质证书、业绩案例等见正文对应页码。',
      '',
      '── 资质认证列表（2.9.1）──',
      '序号 | 资质认证名称 | 颁发机构 | 颁发时间',
      '1 | 质量管理体系认证证书（GB/T 19001 或 ISO 9001）| 中鸿认证（江苏）有限公司 | 2024年01月18日',
      '2 | 信息安全管理体系认证证书（GB/T 22080 或 ISO 27001）| 华信创（北京）认证中心有限公司 | 2024年12月23日',
      '3 | 信息技术服务管理体认证（ISO/IEC 20000）| 华信创（北京）认证中心有限公司 | 2024年7月21日',
      '4 | 检验检测机构资质认定 CMA 证书 | 江苏省市场监督管理局 | 2021年6月21日（2023年9月21日）',
      '5 | CNAS 检验机构认可证书（能力范围含等保测评）| 中国合格评定国家认可委员会 | 2023年9月5日',
      '',
      '── 业绩案例列表（评标办法，摘录）──',
      '1-1 昆山农商银行2023年重要系统信息安全等级保护测评 | 2023年6月20日 | 31万元',
      '1-2 南京银行2024年度信息安全等级保护测评 | 2024年9月5日 | 25.6万元',
      '（以下案例详见右侧结构化列表与原文）',
      '',
      '── 服务团队人员列表（摘录）──',
      '项目经理：陈大文（高级测评师，本科，13年经验）',
      '团队人员共 56 人（初/中/高级测评师，详见右侧人员资质 Tab）',
      '',
      '── 投标人情况介绍（企业简介）──',
      '高新技术企业 · 南京总部 · 法定代表人孙晶华；含资质信息概要、网安行动支撑与荣誉等。',
      '（完整 Markdown 结构正文见企业简介 Tab）'
    ],
    pages: {
      1: [
        '农银人寿保险股份有限公司',
        '信息系统安全等级保护测评（等保2.0）项目',
        '投标文件（第一册）',
        '招标编号：0747-2560SCCZC282',
        '投标人：金盾检测技术股份有限公司',
        '日期：2025年11月',
        '',
        '── 目录页（摘录）──',
        '资质证书、业绩案例、服务团队人员资质文件均已装订在本投标文件中。'
      ],
      37: [
        '具备国家认监委认定机构颁发的、有效期内的《网络安全等级测评与检测评估机构服务认证证书》',
        '注：投标人根据招标文件合格投标人基本资质要求、《评标办法》、《技术要求与服务内容》的评审内容，提供相应资质认证复印件，并加盖公章。',
        '',
        '证书名称：网络安全等级测评与检测评估机构服务认证证书',
        '适用服务：等级保护测评',
        '投标人：金盾检测技术股份有限公司'
      ],
      47: [
        '全国网络安全等级测评与检测评估机构目录截图',
        '证明网站：www.djbh.net',
        '证明形式：官方目录截图',
        '',
        '金盾检测技术股份有限公司已列入全国网络安全等级测评与检测评估机构目录。'
      ],
      63: [
        '资质认证列表（2.9.1）',
        '序号 | 资质认证名称 | 颁发机构 | 颁发时间',
        '1 | 质量管理体系认证证书（GB/T 19001 或 ISO 9001）| 中鸿认证（江苏）有限公司 | 2024年01月18日',
        '2 | 信息安全管理体系认证证书（GB/T 22080 或 ISO 27001）| 华信创（北京）认证中心有限公司 | 2024年12月23日',
        '3 | 信息技术服务管理体认证（ISO/IEC 20000）| 华信创（北京）认证中心有限公司 | 2024年7月21日'
      ],
      64: [
        '资质认证列表（续）',
        '4 | 检验检测机构资质认定CMA证书 | 江苏省市场监督管理局 | 2021年6月21日（2023年9月21日）',
        '5 | 中国合格评定国家认可委员会（CNAS）颁发的检验机构认可证书 | 中国合格评定国家认可委员会 | 2023年9月5日'
      ],
      91: [
        '业绩案例列表（基本资质要求）',
        '1-1 江苏江南农村商业银行股份有限公司2023年等保测评项目咨询服务 | 2023年4月23日 | 77万元',
        '1-2 广州农村商业银行2023年度网络安全等级保护测评 | 2023年6月29日 | 36万元'
      ],
      125: [
        '业绩案例列表（评标办法）',
        '1-1 江苏昆山农村商业银行股份有限公司昆山农商银行2023年重要系统信息安全等级保护测评 | 2023年6月20日 | 31万元',
        '1-2 南京银行2024年度信息安全等级保护测评项目 | 2024年9月5日 | 25.6万元',
        '1-3 兴业南京分行2024年度信息系统等级保护测评服务项目 | 2024年06月13日 | 12.264151万元'
      ],
      456: [
        '人员配置',
        '序号 | 姓名 | 学历 | 网络安全等级保护测评工作经验 | 资质认证 | 本项目承担的相应责任',
        '1 | 陈大文 | 本科 | 13年 | 高级等级测评师证书 | 项目经理',
        '2 | 邢伟 | 本科 | 9年 | 高级等级测评师证书 | 团队人员',
        '3 | 邵君立 | 本科 | 8年 | 高级等级测评师证书 | 团队人员',
        '4 | 程嘉 | 本科 | 5年 | 高级等级测评师证书 | 团队人员',
        '5 | 叶茂 | 本科 | 3年 | 高级等级测评师证书 | 团队人员',
        '6 | 陈洁 | 硕士研究生 | 20年 | 高级等级测评师证书 | 团队人员'
      ],
      4175: [
        '陈大文-项目经理简历',
        '姓名：陈大文',
        '年龄：36岁',
        '毕业学校：南京大学',
        '专业：信息管理与信息系统专业',
        '学位：学士',
        '职称：高级工程师',
        '职务：技术总监',
        '现所在单位：金盾检测技术股份有限公司',
        '工作时间：15年',
        '拟在本项目担任职务：项目经理'
      ],
      4181: [
        '陈大文-项目经理的相关项目经验',
        '项目名称：中国光大银行股份有限公司南京分行南京分行2025年安全等级保护测评项目',
        '甲方单位：中国光大银行股份有限公司南京分行',
        '担任何职：项目经理',
        '服务类型：等级保护测评',
        '时间：2025年'
      ],
      4182: [
        '陈大文-项目经理的相关项目经验',
        '项目名称：中国农业银行股份有限公司江苏省分行2023年中国农业银行股份有限公司江苏省分行信息系统等级保护第三方测评服务项目',
        '甲方单位：中国农业银行股份有限公司江苏省分行',
        '担任何职：项目经理',
        '服务类型：等级保护测评',
        '时间：2023年'
      ],
      4183: [
        '陈大文-项目经理的相关项目经验',
        '项目名称：中国农业银行股份有限公司苏州分行2025年网络安全等级保护测评服务',
        '甲方单位：中国农业银行股份有限公司苏州分行',
        '担任何职：项目经理',
        '服务类型：等级保护测评',
        '时间：2025年'
      ],
      4184: [
        '陈大文-项目经理的相关项目经验',
        '项目名称：中国邮政储蓄银行北京分行2024年网络安全等级保护测评服务',
        '甲方单位：中国邮政储蓄银行北京分行',
        '担任何职：项目经理',
        '服务类型：等级保护测评',
        '时间：2024年'
      ],
      4185: [
        '陈大文-项目经理的相关项目经验',
        '项目名称：中银金融商务（昆山）有限公司2023年骨干网网络安全等级保护备案与测评',
        '甲方单位：中银金融商务（昆山）有限公司',
        '担任何职：项目经理',
        '服务类型：等级保护测评',
        '时间：2023年'
      ],
      4186: [
        '陈大文-项目经理的相关项目经验',
        '项目名称：兴业银行股份有限公司南京分行兴业南京分行2024年度信息系统等级保护测评服务',
        '甲方单位：兴业银行股份有限公司南京分行',
        '担任何职：项目经理',
        '服务类型：等级保护测评',
        '时间：2020年'
      ],
      4187: [
        '陈大文-项目经理的相关项目经验',
        '项目名称：江苏常熟农村商业银行股份有限公司常熟农村商业银行2024年等级保护测评项目',
        '甲方单位：江苏常熟农村商业银行股份有限公司',
        '担任何职：项目经理',
        '服务类型：等级保护测评',
        '时间：2024年'
      ],
      4201: [
        '邢伟-团队人员简历',
        '姓名：邢伟',
        '年龄：38岁',
        '毕业学校：滁州学院',
        '专业：信息与计算机学专业',
        '职称：高级工程师',
        '职务：技术副总监'
      ],
      4202: [
        '邵君立-团队人员简历',
        '姓名：邵君立',
        '年龄：33岁',
        '毕业学校：南京林业大学南方学院',
        '专业：计算机科学与技术',
        '职称：高级工程师',
        '职务：测评师'
      ],
      4203: [
        '程嘉-团队人员简历',
        '姓名：程嘉',
        '年龄：27岁',
        '毕业学校：南京大学金陵学院',
        '专业：计算机科学与技术',
        '职称：高级工程师',
        '职务：测评师'
      ],
      4204: [
        '叶茂-团队人员简历',
        '姓名：叶茂',
        '年龄：27岁',
        '毕业学校：江苏大学京江学院',
        '专业：通信工程',
        '职称：高级工程师',
        '职务：测评师'
      ],
      4205: [
        '陈洁-团队人员简历',
        '姓名：陈洁',
        '年龄：47岁',
        '毕业学校：解放军电子工程学院',
        '专业：军事通信学',
        '职称：高级工程师',
        '职务：测评师'
      ],
      4206: [
        '陈洁-社保',
        '社保证明材料页',
        '投标文件在“陈洁-资质认证”后附有“社保”材料页。'
      ],
      4300: [
        '服务团队人员资质文件',
        '网络安全等级保护测评师证书复印件',
        '复印件应能清晰显示人员姓名、有效期等关键信息。'
      ],
      4301: [
        '服务团队人员资质文件',
        '高级工程师职称相关材料',
        '用于证明人员职称信息。'
      ]
    }
  }
];

// ── Person / PersonQualification mock data (aligned with backend tables) ──

const certLevelMap: Record<string, { type: PersonQualification['qualificationType']; level: string }> = {
  '高级等级测评师证书': { type: '认证', level: '高级' },
  '中级等级测评师证书': { type: '认证', level: '中级' },
  '初级等级测评师证书': { type: '认证', level: '初级' }
};

const buildJindunPosition = (role: string, years: number) => {
  if (role === '项目经理') return '网络安全测评项目经理';
  if (years >= 10) return '高级网络安全测评工程师';
  return '网络安全测评工程师';
};

const buildJindunSpecialties = (role: string, level: string) => {
  const specialties = ['等保测评'];

  if (role === '项目经理') specialties.push('项目管理', '风险评估');
  else specialties.push(level === '初级' ? '现场实施' : '安全评估');

  return Array.from(new Set(specialties));
};

const buildDxPosition = (role: string) => {
  if (role.includes('经理')) return '项目管理工程师';
  if (role.includes('负责人')) return '工程技术管理工程师';
  if (role.includes('质量')) return '质量管理工程师';
  if (role.includes('安全')) return '安全管理工程师';
  if (role.includes('造价')) return '工程造价工程师';
  return '工程实施工程师';
};

const buildDxSpecialties = (role: string) => {
  if (role.includes('经理')) return ['项目管理', '工程统筹'];
  if (role.includes('负责人')) return ['技术管理', '工程实施'];
  if (role.includes('质量')) return ['质量管理', '过程控制'];
  if (role.includes('安全')) return ['安全管理', '施工合规'];
  if (role.includes('造价')) return ['成本控制', '工程造价'];
  return ['工程实施'];
};

function buildMockPersons(): Person[] {
  const persons: Person[] = [];

  for (const [idx, name, edu, exp, _cert, role] of teamRows) {
    const parsed = certLevelMap[_cert] ?? { type: '认证' as const, level: _cert };
    const years = parseInt(exp, 10) || 0;
    const resumeProfile = jindunResumeProfiles[name];
    const certPreviewDataUrl = makeCertPreview('网络安全等级保护测评师证书', name, '#2563eb');
    const teamListPreview = makeTextPreview(
      `${name}-服务团队人员列表摘录`,
      [
        `序号：${idx}`,
        `姓名：${name}`,
        `学历：${edu}`,
        `网络安全等级保护测评工作经验：${exp}`,
        `资质认证：${_cert}`,
        `本项目承担的相应责任：${role}`
      ],
      {
        subtitle: '人员配置',
        pageLabel: '服务团队人员列表',
        targetPage: 456
      }
    );

    const qualifications: PersonQualification[] = [
      {
        id: `jd-pq-${idx}-1`,
        personId: `jd-person-${idx}`,
        qualificationType: parsed.type,
        qualificationName: '网络安全等级保护测评师',
        level: parsed.level,
        majorScope: '网络安全等级保护测评',
        issuer: '',
        certificateNo: '',
        issuedAt: '',
        expiresAt: '',
        registrationStatus: '',
        status: 'valid',
        isPrimary: true,
        sourceFileId: 1,
        pageRange: '服务团队人员资质文件',
        previewDataUrl: certPreviewDataUrl,
        previewEvidence: {
          title: `${name}-等级测评师证书`,
          subtitle: '服务团队人员资质文件',
          pageLabel: '资质认证',
          targetPage: 4300,
          imageDataUrl: certPreviewDataUrl
        }
      }
    ];

    if (resumeProfile?.professionalTitle) {
      const titlePreviewDataUrl = makeCertPreview(
        `${resumeProfile.professionalTitle}职称材料`,
        name,
        '#0891b2'
      );
      qualifications.push({
        id: `jd-pq-${idx}-title`,
        personId: `jd-person-${idx}`,
        qualificationType: '职称',
        qualificationName: resumeProfile.professionalTitle,
        level: resumeProfile.professionalTitle.includes('高级') ? '高级' : '',
        majorScope: resumeProfile.major,
        issuer: '',
        certificateNo: '',
        issuedAt: '',
        expiresAt: '',
        registrationStatus: '',
        status: 'valid',
        sourceFileId: 1,
        pageRange: `${name}-${role === '项目经理' ? '项目经理' : '团队人员'}简历`,
        previewDataUrl: titlePreviewDataUrl,
        previewEvidence: {
          title: `${name}-${resumeProfile.professionalTitle}`,
          subtitle: '简历职称字段 / 职称材料',
          pageLabel: `${name}-${role === '项目经理' ? '项目经理' : '团队人员'}简历`,
          targetPage: 4301,
          imageDataUrl: titlePreviewDataUrl
        }
      });
    }

    const degreePreview = resumeProfile?.degreePreview;
    const educationPreview = resumeProfile?.educationPreview;

    const person: Person = {
      id: `jd-person-${idx}`,
      organizationId: 'org-jindun',
      organizationName: '金盾检测技术股份有限公司',
      name,
      age: resumeProfile?.age,
      gender: '',
      idNoMasked: '',
      education: edu,
      school: resumeProfile?.school,
      major: resumeProfile?.major ?? '',
      totalYearsOfExperience: resumeProfile?.workYears ?? years,
      currentPosition: resumeProfile?.currentPosition ?? (role === '项目经理' ? '项目经理' : '测评师'),
      professionalTitle: resumeProfile?.professionalTitle ?? '',
      specialties: buildJindunSpecialties(role, parsed.level),
      coreDomain: '等级保护测评',
      coreDomainYears: resumeProfile?.coreYears ?? years,
      projectExperiences: resumeProfile?.projects.map((project, projectIndex) => ({
        id: `jd-exp-${idx}-${projectIndex + 1}`,
        personId: `jd-person-${idx}`,
        projectName: project.projectName,
        clientName: project.clientName,
        year: project.year.replace('年', ''),
        role: project.role,
        domain: project.domain,
        caseId: project.caseId
      })),
      location: '南京',
      resumeSummary:
        resumeProfile?.resumeSummary ??
        `${name}，${edu}学历，服务团队列表载明具备${exp}网络安全等级保护测评工作经验，资质认证为${_cert}。`,
      qualifications,
      documents: {
        diploma: Boolean(educationPreview),
        degree: Boolean(degreePreview),
        socialSecurity: Boolean(resumeProfile?.socialSecurityPreview)
      },
      sourceFileId: 1,
      pageRange: resumeProfile
        ? `${name}-${role === '项目经理' ? '项目经理' : '团队人员'}简历`
        : '服务团队人员列表',
      sourcePreviewEvidence: resumeProfile?.resumePreview ?? teamListPreview,
      documentPreviewMap: {
        diploma: educationPreview,
        degree: degreePreview,
        socialSecurity: resumeProfile?.socialSecurityPreview
      }
    };

    persons.push(person);
  }

  // Add 鼎信 team persons
  const dxTeam: Array<{
    name: string; role: string; edu: string; years: number;
    quals: Array<{ name: string; type: PersonQualification['qualificationType']; level: string; issuer: string; no: string }>;
  }> = [
    {
      name: '王建国', role: '项目经理', edu: '本科', years: 18,
      quals: [
        { name: '一级建造师', type: '注册证', level: '一级', issuer: '住房和城乡建设部', no: 'JZ-2015-0431' },
        { name: 'B类安全员', type: '认证', level: '', issuer: '江苏省住房和城乡建设厅', no: 'AQ-B-2019-112' }
      ]
    },
    {
      name: '李明辉', role: '技术负责人', edu: '硕士', years: 15,
      quals: [
        { name: '一级建造师（市政公用工程）', type: '注册证', level: '一级', issuer: '住房和城乡建设部', no: 'JZ-2017-0822' },
        { name: '高级工程师（结构工程）', type: '职称', level: '高级', issuer: '江苏省人力资源和社会保障厅', no: 'ZC-JS-2019-3321' }
      ]
    },
    {
      name: '赵春华', role: '质量员', edu: '本科', years: 10,
      quals: [
        { name: 'C类安全员', type: '认证', level: '', issuer: '江苏省住房和城乡建设厅', no: 'AQ-C-2020-055' },
        { name: '中级工程师（土木工程）', type: '职称', level: '中级', issuer: '南京市人力资源和社会保障局', no: 'ZC-NJ-2018-1102' }
      ]
    },
    {
      name: '孙丽', role: '安全员', edu: '本科', years: 12,
      quals: [
        { name: 'A类安全员', type: '认证', level: '', issuer: '江苏省住房和城乡建设厅', no: 'AQ-A-2017-033' },
        { name: '注册安全工程师（建筑施工安全）', type: '执业资格', level: '', issuer: '应急管理部', no: 'ZAQ-2020-8712' }
      ]
    },
    {
      name: '周强', role: '造价员', edu: '本科', years: 9,
      quals: [
        { name: '一级造价工程师（土建）', type: '注册证', level: '一级', issuer: '住房和城乡建设部', no: 'ZJ-2021-1105' },
        { name: 'BIM技术应用工程师', type: '认证', level: '高级', issuer: '中国建筑科学研究院', no: 'BIM-2022-0088' }
      ]
    }
  ];

  dxTeam.forEach((item, i) => {
    const idx = i + 1;
    persons.push({
      id: `dx-person-${idx}`,
      organizationId: 'org-dingxin',
      organizationName: '鼎信建设集团有限公司',
      name: item.name,
      age: `${28 + item.years}岁`,
      gender: item.name === '孙丽' ? '女' : '男',
      idNoMasked: `310***${String(2000 + idx).slice(-4)}`,
      education: item.edu,
      school: ['同济大学', '东南大学', '河海大学', '南京工业大学', '江苏大学'][i % 5],
      major: '土木工程',
      totalYearsOfExperience: item.years,
      currentPosition: buildDxPosition(item.role),
      professionalTitle: item.quals.find((q) => q.type === '职称')?.name ?? '',
      specialties: buildDxSpecialties(item.role),
      coreDomain: '智慧城市基础设施',
      coreDomainYears: item.years,
      projectExperiences: [
        {
          id: `dx-exp-${idx}-1`,
          personId: `dx-person-${idx}`,
          projectName: '智慧城市基础设施建设项目',
          domain: '智慧城市基础设施',
          role: item.role
        }
      ],
      location: '南京',
      resumeSummary: `${item.name}，${item.edu}学历，${item.years}年工程相关经验，当前聚焦${buildDxSpecialties(item.role).join('、')}。`,
      documents: {
        idCard: true,
        diploma: true,
        degree: item.edu === '硕士',
        socialSecurity: item.role === '项目经理'
      },
      qualifications: item.quals.map((q, qi) => ({
        id: `dx-pq-${idx}-${qi + 1}`,
        personId: `dx-person-${idx}`,
        qualificationType: q.type,
        qualificationName: q.name,
        level: q.level,
        majorScope: '',
        issuer: q.issuer,
        certificateNo: q.no,
        issuedAt: '2020-01-01',
        expiresAt: '',
        registrationStatus: q.type === '注册证' ? '已注册' : '',
        status: 'valid' as const,
        isPrimary: qi === 0,
        sourceFileId: 2,
        pageRange: `第${126 + i}页`
      })),
      sourceFileId: 2,
      pageRange: `第${126 + i}页`
    });
  });

  return persons;
}

export const initialPersons: Person[] = buildMockPersons();
