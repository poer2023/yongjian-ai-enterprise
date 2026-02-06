// Mock data for EnterpriseMaterialView.vue

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface SourceFile {
  id: number;
  name: string;
  size: string;
  words: string;
  creator: string;
  status: 'completed' | 'processing';
  materialCount: number;
}

export interface Material {
  id: string;
  name: string;
  category: 'certificate' | 'case' | 'team' | 'company' | 'honor' | 'technical';
  categoryLabel: string;
  summary: string;
  keyInfo: KeyValuePair[];
  sourceFileId: number;
  pageRange?: string;
  contentType: 'image' | 'text' | 'mixed';
  fullText?: string;
}

export interface FilePreview {
  fileId: number;
  content: string[];
}

export interface Folder {
  id: number;
  name: string;
}

// File preview content mock data
export const filePreviewData: FilePreview[] = [
  {
    fileId: 1,
    content: [
      '营 业 执 照',
      '',
      '统一社会信用代码：91440300MA5EXXXX',
      '',
      '名    称：深圳市智联云科技术有限公司',
      '类    型：有限责任公司',
      '法定代表人：王建国',
      '注册资本：5000万元人民币',
      '成立日期：2010年03月15日',
      '营业期限：2010年03月15日 至 长期',
      '',
      '住    所：深圳市南山区科技园南区',
      '          高新技术产业园A栋15层',
      '',
      '经营范围：计算机软件技术开发；信息系统集成服务；',
      '          企业管理咨询；技术咨询服务；数据处理',
      '          和存储服务；人工智能应用软件开发；',
      '          云计算装备技术服务。',
      '',
      '登记机关：深圳市市场监督管理局',
      '核准日期：2024年01月10日',
      '',
      '                        [公章]',
    ]
  },
  {
    fileId: 2,
    content: [
      '质量管理体系认证证书',
      'QUALITY MANAGEMENT SYSTEM CERTIFICATE',
      '',
      '证书编号：00124Q34567R0M',
      '',
      '兹证明',
      '',
      '深圳市智联云科技术有限公司',
      'Shenzhen Zhilian Yunke Technology Co., Ltd.',
      '',
      '地址：深圳市南山区科技园南区高新技术产业园A栋15层',
      '',
      '所建立的质量管理体系符合',
      '',
      'GB/T 19001-2016 / ISO 9001:2015',
      '',
      '标准的要求',
      '',
      '覆盖范围：',
      '计算机软件的设计、开发与技术服务',
      '信息系统集成服务',
      '',
      '初次发证日期：2018年06月20日',
      '有效期：2023年06月20日 至 2026年06月19日',
      '',
      '认证机构：中国质量认证中心（CQC）',
      '',
      '                [认证机构公章]',
    ]
  },
  {
    fileId: 3,
    content: [
      '高新技术企业证书',
      '',
      '证书编号：GR202344001234',
      '',
      '深圳市智联云科技术有限公司',
      '',
      '根据《高新技术企业认定管理办法》和',
      '《高新技术企业认定管理工作指引》有关规定，',
      '',
      '经广东省高新技术企业认定管理工作领导小组办公室',
      '组织专家评审，该企业符合《高新技术企业认定管理办法》',
      '规定的高新技术企业条件，特颁发此证书。',
      '',
      '企业注册地址：深圳市南山区',
      '所属技术领域：电子信息技术',
      '发证日期：2023年12月08日',
      '证书有效期：三年（2023年-2026年）',
      '',
      '广东省科学技术厅',
      '广东省财政厅',
      '国家税务总局广东省税务局',
      '',
      '                [联合公章]',
    ]
  },
  {
    fileId: 4,
    content: [
      '软件著作权登记证书汇编',
      '',
      '═══════════════════════════════════════',
      '',
      '【证书一】',
      '登记号：2023SR0012345',
      '软件名称：智联云企业数据中台系统 V3.0',
      '著作权人：深圳市智联云科技术有限公司',
      '开发完成日期：2023年03月',
      '首次发表日期：2023年05月',
      '权利取得方式：原始取得',
      '',
      '═══════════════════════════════════════',
      '',
      '【证书二】',
      '登记号：2023SR0023456',
      '软件名称：智能招投标分析平台 V2.5',
      '著作权人：深圳市智联云科技术有限公司',
      '开发完成日期：2023年06月',
      '首次发表日期：2023年08月',
      '权利取得方式：原始取得',
      '',
      '═══════════════════════════════════════',
    ]
  },
  {
    fileId: 5,
    content: [
      '公司核心团队成员简介',
      '',
      '═══════════════════════════════════════',
      '',
      '【总经理】王建国',
      '',
      '学历：清华大学计算机科学与技术专业硕士',
      '职称：高级工程师',
      '从业年限：20年',
      '',
      '个人简介：',
      '曾任职于华为技术有限公司、腾讯科技等知名企业。',
      '2010年创立深圳市智联云科技术有限公司，带领公司',
      '发展成为国家高新技术企业。',
      '',
      '═══════════════════════════════════════',
    ]
  },
  {
    fileId: 6,
    content: [
      '2023年度典型项目案例集',
      '',
      '═══════════════════════════════════════',
      '',
      '【案例一】深圳市政务服务数据管理平台项目',
      '',
      '甲方单位：深圳市政务服务数据管理局',
      '合同金额：2800万元',
      '项目周期：2023.03 - 2023.12',
      '',
      '项目概述：',
      '为深圳市政务服务数据管理局建设统一的政务服务数据',
      '管理平台，实现全市各部门政务数据的汇聚、治理、共享',
      '和开放。',
      '',
      '═══════════════════════════════════════',
    ]
  },
  {
    fileId: 7,
    content: [
      '深圳市智联云科技术有限公司',
      '企 业 宣 传 手 册',
      'v3.2',
      '',
      '═══════════════════════════════════════',
      '',
      '【公司概况】',
      '',
      '深圳市智联云科技术有限公司成立于2010年，是一家专注于',
      '政企数字化转型的国家高新技术企业。公司总部位于深圳市',
      '南山区科技园，在广州、北京、上海设有分支机构，现有员工',
      '380余人，其中研发人员占比超过60%。',
      '',
      '═══════════════════════════════════════',
    ]
  }
];

// Folder data for enterprise materials
export const folders: Folder[] = [
  { id: 1, name: '资质证书' },
  { id: 2, name: '业绩案例' },
  { id: 3, name: '项目团队' },
  { id: 4, name: '公司简介' },
  { id: 5, name: '荣誉奖项' },
  { id: 6, name: '技术方案' },
  { id: 7, name: '合同模板' },
  { id: 8, name: '投标文件' },
  { id: 9, name: '产品资料' },
  { id: 10, name: '培训材料' },
  { id: 11, name: '财务报表' },
  { id: 12, name: '法律文书' }
];

// File list data with material count
export const files: SourceFile[] = [
  { id: 1, name: '营业执照副本_2024.pdf', size: '2.36MB', words: '0.12万字', creator: '管理员', status: 'completed', materialCount: 2 },
  { id: 2, name: 'ISO9001质量管理体系认证证书.pdf', size: '1.85MB', words: '0.08万字', creator: '管理员', status: 'completed', materialCount: 2 },
  { id: 3, name: '高新技术企业证书_2023-2026.pdf', size: '956KB', words: '0.05万字', creator: '管理员', status: 'completed', materialCount: 2 },
  { id: 4, name: '软件著作权登记证书汇编.pdf', size: '15.20MB', words: '2.30万字', creator: '技术部', status: 'completed', materialCount: 10 },
  { id: 5, name: '公司核心团队成员简介.docx', size: '3.45MB', words: '1.25万字', creator: 'HR部门', status: 'completed', materialCount: 6 },
  { id: 6, name: '2023年度典型项目案例集.pdf', size: '28.60MB', words: '8.50万字', creator: '市场部', status: 'completed', materialCount: 8 },
  { id: 7, name: '企业宣传手册_v3.2.pdf', size: '45.30MB', words: '0.85万字', creator: '品牌部', status: 'completed', materialCount: 5 },
  { id: 8, name: '技术服务合同模板_标准版.docx', size: '256KB', words: '0.35万字', creator: '法务部', status: 'completed', materialCount: 1 },
  { id: 9, name: '投标报价单模板.xlsx', size: '128KB', words: '-', creator: '商务部', status: 'processing', materialCount: 0 }
];

// Materials mock data - simplified version (full data in component)
export const materials: Material[] = [
  {
    id: 'm1-1',
    name: '营业执照扫描件',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '企业法人营业执照扫描件，用于标书附件和资格审查材料',
    contentType: 'image',
    keyInfo: [
      { key: '文件类型', value: '证照扫描件' },
      { key: '用途', value: '标书附件、资格审查' }
    ],
    sourceFileId: 1,
    pageRange: '第1页'
  },
  {
    id: 'm1-2',
    name: '企业基本信息',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '企业工商登记信息，用于投标人基本情况表和企业概况章节',
    contentType: 'text',
    fullText: '深圳市智联云科技术有限公司成立于2010年3月，注册资本5000万元人民币，是一家专注于企业数字化转型的高新技术企业。',
    keyInfo: [
      { key: '企业名称', value: '深圳市智联云科技术有限公司' },
      { key: '统一社会信用代码', value: '91440300MA5EXXXX' },
      { key: '法定代表人', value: '王建国' },
      { key: '注册资本', value: '5000万元人民币' },
      { key: '成立日期', value: '2010年03月15日' }
    ],
    sourceFileId: 1,
    pageRange: '第1页'
  },
  {
    id: 'm2-1',
    name: 'ISO9001认证证书扫描件',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '质量管理体系认证证书扫描件，用于资质证明附件',
    contentType: 'image',
    keyInfo: [
      { key: '文件类型', value: '认证证书扫描件' },
      { key: '用途', value: '资质证明附件' }
    ],
    sourceFileId: 2,
    pageRange: '第1页'
  },
];

// Category color mapping helper
export const getCategoryColor = (category: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    certificate: { bg: '#dbeafe', text: '#1d4ed8' },
    case: { bg: '#dcfce7', text: '#15803d' },
    team: { bg: '#fef3c7', text: '#b45309' },
    company: { bg: '#f3e8ff', text: '#7c3aed' },
    honor: { bg: '#ffe4e6', text: '#be123c' },
    technical: { bg: '#e0e7ff', text: '#4338ca' }
  };
  return colors[category] || { bg: '#f3f4f6', text: '#374151' };
};
