<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Search,
  MoreHorizontal,
  Building2,
  Upload,
  FileText,
  ScanSearch,
  GitBranch,
  Tags,
  Eye,
  Pencil,
  Copy,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  X,
  Image,
  FileType,
  ZoomIn,
  ZoomOut
} from 'lucide-vue-next';

// Types
interface KeyValuePair {
  key: string;
  value: string;
}

interface SourceFile {
  id: number;
  name: string;
  size: string;
  words: string;
  creator: string;
  status: 'completed' | 'processing';
  materialCount: number;
}

interface Material {
  id: string;
  name: string;
  category: 'certificate' | 'case' | 'team' | 'company' | 'honor' | 'technical';
  categoryLabel: string;
  summary: string;
  keyInfo: KeyValuePair[];
  sourceFileId: number;
  pageRange?: string;
  // Content type: image for scanned certificates, text for descriptions/resumes
  contentType: 'image' | 'text' | 'mixed';
  // Full text content for text-type materials
  fullText?: string;
}

// File preview content mock data
interface FilePreview {
  fileId: number;
  content: string[];
}

const filePreviewData: FilePreview[] = [
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
      '',
      '【证书三】',
      '登记号：2022SR0156789',
      '软件名称：政务服务一体化平台 V4.0',
      '著作权人：深圳市智联云科技术有限公司',
      '开发完成日期：2022年09月',
      '首次发表日期：2022年11月',
      '权利取得方式：原始取得',
      '',
      '═══════════════════════════════════════',
      '',
      '【证书四】',
      '登记号：2022SR0167890',
      '软件名称：AI智能文档处理系统 V1.0',
      '著作权人：深圳市智联云科技术有限公司',
      '开发完成日期：2022年11月',
      '首次发表日期：2023年01月',
      '权利取得方式：原始取得',
      '',
      '═══════════════════════════════════════',
      '',
      '【证书五】',
      '登记号：2021SR0234567',
      '软件名称：企业知识图谱管理系统 V2.0',
      '著作权人：深圳市智联云科技术有限公司',
      '开发完成日期：2021年08月',
      '首次发表日期：2021年10月',
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
      '发展成为国家高新技术企业。主导完成多个省部级重大',
      '信息化项目，获得"深圳市优秀创业者"等荣誉称号。',
      '',
      '═══════════════════════════════════════',
      '',
      '【技术总监】张伟',
      '',
      '学历：北京大学软件工程专业硕士',
      '职称：高级工程师',
      '认证：系统架构设计师',
      '从业年限：15年',
      '',
      '个人简介：',
      '曾任职于阿里巴巴集团担任技术专家。负责公司技术',
      '战略规划和核心产品研发，主导设计了智联云企业数据',
      '中台系统架构。精通分布式系统、微服务架构、大数据',
      '处理等技术领域。',
      '',
      '═══════════════════════════════════════',
      '',
      '【项目总监】李明',
      '',
      '学历：武汉大学信息管理专业本科',
      '职称：中级工程师',
      '认证：PMP、PRINCE2',
      '从业年限：12年',
      '',
      '个人简介：',
      '成功交付政务、金融、能源等行业大型信息化项目30余个，',
      '累计合同金额超过5亿元。擅长大型复杂项目的规划、执行',
      '和风险管控。',
      '',
      '═══════════════════════════════════════',
      '',
      '【产品总监】陈静',
      '',
      '学历：浙江大学人机交互专业硕士',
      '认证：NPDP产品经理',
      '从业年限：10年',
      '',
      '个人简介：',
      '曾任职于字节跳动担任高级产品经理。负责公司产品战略',
      '规划和用户体验设计，主导完成智能招投标分析平台、',
      '政务服务一体化平台等核心产品的设计工作。',
      '',
      '═══════════════════════════════════════',
      '',
      '【AI算法专家】刘洋',
      '',
      '学历：中国科学技术大学人工智能专业博士',
      '论文：ACL、EMNLP等顶会论文8篇',
      '专利：发明专利12项',
      '',
      '个人简介：',
      '曾在微软亚洲研究院从事自然语言处理研究。负责公司AI',
      '核心算法研发，主导开发了文档智能理解、知识图谱构建、',
      '智能问答等关键技术模块。',
      '',
      '═══════════════════════════════════════',
      '',
      '【质量总监】赵敏',
      '',
      '学历：华中科技大学软件工程专业硕士',
      '职称：中级工程师',
      '认证：ISO9001内审员、CMMI评估师',
      '从业年限：13年',
      '',
      '个人简介：',
      '曾任职于中软国际担任质量经理。负责公司ISO9001质量',
      '管理体系建设和持续改进，主导公司通过CMMI3级认证。',
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
      '和开放。平台已接入市级58个部门数据资源，累计汇聚',
      '数据超过80亿条。',
      '',
      '═══════════════════════════════════════',
      '',
      '【案例二】广东省公共资源交易智慧监管平台项目',
      '',
      '甲方单位：广东省公共资源交易中心',
      '合同金额：1950万元',
      '项目周期：2022.11 - 2023.09',
      '',
      '项目概述：',
      '运用大数据和人工智能技术实现对全省公共资源交易活动',
      '的智能监测和风险预警。平台已接入全省21个地市交易数据，',
      '实现对年交易额超3万亿元的公共资源交易活动实时监控。',
      '',
      '═══════════════════════════════════════',
      '',
      '【案例三】招商银行智能合同审核系统项目',
      '',
      '甲方单位：招商银行股份有限公司',
      '合同金额：1200万元',
      '项目周期：2023.01 - 2023.08',
      '',
      '项目概述：',
      '利用自然语言处理和机器学习技术实现合同文本的自动',
      '解析、条款抽取、风险识别和合规检查。系统上线后合同',
      '审核效率提升60%，关键条款识别准确率达95%以上。',
      '',
      '═══════════════════════════════════════',
      '',
      '【案例四】中国南方电网知识管理平台项目',
      '',
      '甲方单位：中国南方电网有限责任公司',
      '合同金额：1580万元',
      '项目周期：2022.08 - 2023.06',
      '',
      '项目概述：',
      '为南方电网总部及下属五省区电网公司建设统一的知识',
      '管理平台。平台已积累电力专业知识条目50万余条，构建',
      '电力知识图谱实体200万个、关系1000万条。',
      '',
      '═══════════════════════════════════════',
      '',
      '（更多案例详见完整文档...）',
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
      '公司以"让数据创造价值，让技术服务社会"为使命，致力于',
      '为政府和大型企业提供数字化解决方案和专业技术服务。',
      '',
      '═══════════════════════════════════════',
      '',
      '【发展历程】',
      '',
      '2010年  公司成立，启动第一个政务信息化项目',
      '2014年  通过ISO9001认证，中标首个省级项目',
      '2016年  获得CMMI3级认证',
      '2018年  获评国家高新技术企业',
      '2019年  发布智联云数据中台产品',
      '2020年  完成B轮融资，设立北京、上海分公司',
      '2022年  年营收突破2亿元',
      '2023年  累计获得软件著作权50余项',
      '',
      '═══════════════════════════════════════',
      '',
      '【核心技术能力】',
      '',
      '• 数据中台技术：自主研发，日处理数据量达PB级别',
      '• 自然语言处理：行业领先准确率',
      '• 知识图谱技术：大规模自动构建能力',
      '• 低代码开发平台：开发效率提升80%以上',
      '',
      '═══════════════════════════════════════',
      '',
      '【资质荣誉】',
      '',
      '• 国家高新技术企业',
      '• 广东省专精特新中小企业',
      '• ISO9001/ISO27001认证',
      '• CMMI3级认证',
      '• 软件著作权50余项',
      '• 发明专利15项',
      '',
      '═══════════════════════════════════════',
    ]
  }
];

// Folder data for enterprise materials
const folders = ref([
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
]);

// File list data with material count (updated per plan)
const files = ref<SourceFile[]>([
  { id: 1, name: '营业执照副本_2024.pdf', size: '2.36MB', words: '0.12万字', creator: '管理员', status: 'completed', materialCount: 2 },
  { id: 2, name: 'ISO9001质量管理体系认证证书.pdf', size: '1.85MB', words: '0.08万字', creator: '管理员', status: 'completed', materialCount: 2 },
  { id: 3, name: '高新技术企业证书_2023-2026.pdf', size: '956KB', words: '0.05万字', creator: '管理员', status: 'completed', materialCount: 2 },
  { id: 4, name: '软件著作权登记证书汇编.pdf', size: '15.20MB', words: '2.30万字', creator: '技术部', status: 'completed', materialCount: 10 },
  { id: 5, name: '公司核心团队成员简介.docx', size: '3.45MB', words: '1.25万字', creator: 'HR部门', status: 'completed', materialCount: 6 },
  { id: 6, name: '2023年度典型项目案例集.pdf', size: '28.60MB', words: '8.50万字', creator: '市场部', status: 'completed', materialCount: 8 },
  { id: 7, name: '企业宣传手册_v3.2.pdf', size: '45.30MB', words: '0.85万字', creator: '品牌部', status: 'completed', materialCount: 5 },
  { id: 8, name: '技术服务合同模板_标准版.docx', size: '256KB', words: '0.35万字', creator: '法务部', status: 'completed', materialCount: 1 },
  { id: 9, name: '投标报价单模板.xlsx', size: '128KB', words: '-', creator: '商务部', status: 'processing', materialCount: 0 }
]);

// Materials mock data - complete with contentType and fullText
const materials = ref<Material[]>([
  // ========== File 1: 营业执照副本_2024.pdf → 2个素材 ==========
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
    fullText: '深圳市智联云科技术有限公司成立于2010年3月，注册资本5000万元人民币，是一家专注于企业数字化转型的高新技术企业。公司法定代表人为王建国先生，注册地址位于深圳市南山区科技园南区高新技术产业园A栋15层。公司经营范围涵盖计算机软件技术开发、信息系统集成服务、企业管理咨询、技术咨询服务、数据处理和存储服务、人工智能应用软件开发、云计算装备技术服务等领域。',
    keyInfo: [
      { key: '企业名称', value: '深圳市智联云科技术有限公司' },
      { key: '统一社会信用代码', value: '91440300MA5EXXXX' },
      { key: '法定代表人', value: '王建国' },
      { key: '注册资本', value: '5000万元人民币' },
      { key: '成立日期', value: '2010年03月15日' },
      { key: '营业期限', value: '长期' },
      { key: '注册地址', value: '深圳市南山区科技园南区高新技术产业园A栋15层' }
    ],
    sourceFileId: 1,
    pageRange: '第1页'
  },

  // ========== File 2: ISO9001质量管理体系认证证书.pdf → 2个素材 ==========
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
  {
    id: 'm2-2',
    name: 'ISO9001认证信息',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '质量管理体系认证详情，用于企业资质描述和质量管理章节',
    contentType: 'text',
    fullText: '本公司已通过 ISO 9001:2015 质量管理体系认证（证书编号：00124Q34567R0M），认证范围覆盖计算机软件的设计、开发与技术服务以及信息系统集成服务。该认证由中国质量认证中心（CQC）颁发，初次发证日期为2018年6月20日，当前证书有效期至2026年6月19日。公司严格按照 GB/T 19001-2016 / ISO 9001:2015 标准建立并持续改进质量管理体系，确保为客户提供高质量的软件产品和技术服务。',
    keyInfo: [
      { key: '证书编号', value: '00124Q34567R0M' },
      { key: '认证标准', value: 'GB/T 19001-2016 / ISO 9001:2015' },
      { key: '认证范围', value: '计算机软件设计开发、信息系统集成服务' },
      { key: '认证机构', value: '中国质量认证中心（CQC）' },
      { key: '有效期', value: '2023年06月20日 - 2026年06月19日' }
    ],
    sourceFileId: 2,
    pageRange: '第1页'
  },

  // ========== File 3: 高新技术企业证书_2023-2026.pdf → 2个素材 ==========
  {
    id: 'm3-1',
    name: '高新技术企业证书扫描件',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '国家高新技术企业证书扫描件，用于资质证明附件',
    contentType: 'image',
    keyInfo: [
      { key: '文件类型', value: '高企证书扫描件' },
      { key: '用途', value: '资质证明附件' }
    ],
    sourceFileId: 3,
    pageRange: '第1页'
  },
  {
    id: 'm3-2',
    name: '高新企业认定信息',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '高新技术企业认定详情，用于企业资质描述和技术实力章节',
    contentType: 'text',
    fullText: '本公司于2023年12月获得国家高新技术企业认定（证书编号：GR202344001234），技术领域为电子信息技术，证书有效期三年（2023年-2026年）。公司根据《高新技术企业认定管理办法》和《高新技术企业认定管理工作指引》的规定，经广东省高新技术企业认定管理工作领导小组办公室组织专家评审，在研发投入、知识产权、科技人员占比等方面均符合高新技术企业认定条件。',
    keyInfo: [
      { key: '证书编号', value: 'GR202344001234' },
      { key: '技术领域', value: '电子信息技术' },
      { key: '认定机关', value: '广东省科学技术厅、财政厅、税务局' },
      { key: '发证日期', value: '2023年12月08日' },
      { key: '有效期', value: '2023年 - 2026年（三年）' }
    ],
    sourceFileId: 3,
    pageRange: '第1页'
  },

  // ========== File 4: 软件著作权登记证书汇编.pdf → 10个素材（5证书×2） ==========
  // 软著1
  {
    id: 'm4-1-img',
    name: '智联云企业数据中台系统 V3.0 证书扫描件',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '软件著作权登记证书扫描件',
    contentType: 'image',
    keyInfo: [
      { key: '登记号', value: '2023SR0012345' },
      { key: '用途', value: '软著证明附件' }
    ],
    sourceFileId: 4,
    pageRange: '第1-2页'
  },
  {
    id: 'm4-1-txt',
    name: '智联云企业数据中台系统 V3.0 登记信息',
    category: 'technical',
    categoryLabel: '技术方案',
    summary: '软著登记信息，用于技术实力描述',
    contentType: 'text',
    fullText: '智联云企业数据中台系统 V3.0 是公司自主研发的企业级数据管理平台，登记号为 2023SR0012345，于2023年3月开发完成，2023年5月首次发表。该系统采用分布式架构设计，支持多源异构数据的采集、清洗、存储和分析，具备实时数据处理能力，日处理数据量可达TB级别。系统已在多个政企客户中成功部署应用。',
    keyInfo: [
      { key: '软件名称', value: '智联云企业数据中台系统 V3.0' },
      { key: '登记号', value: '2023SR0012345' },
      { key: '开发完成日期', value: '2023年03月' },
      { key: '首次发表日期', value: '2023年05月' },
      { key: '权利取得方式', value: '原始取得' }
    ],
    sourceFileId: 4,
    pageRange: '第1-2页'
  },
  // 软著2
  {
    id: 'm4-2-img',
    name: '智能招投标分析平台 V2.5 证书扫描件',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '软件著作权登记证书扫描件',
    contentType: 'image',
    keyInfo: [
      { key: '登记号', value: '2023SR0023456' },
      { key: '用途', value: '软著证明附件' }
    ],
    sourceFileId: 4,
    pageRange: '第3-4页'
  },
  {
    id: 'm4-2-txt',
    name: '智能招投标分析平台 V2.5 登记信息',
    category: 'technical',
    categoryLabel: '技术方案',
    summary: '软著登记信息，用于技术实力描述',
    contentType: 'text',
    fullText: '智能招投标分析平台 V2.5 是公司针对招投标领域开发的智能分析系统，登记号为 2023SR0023456，于2023年6月开发完成，2023年8月首次发表。该平台集成了自然语言处理和机器学习技术，能够自动解析招标文件、提取关键信息、智能匹配历史案例，显著提升投标效率和中标率。',
    keyInfo: [
      { key: '软件名称', value: '智能招投标分析平台 V2.5' },
      { key: '登记号', value: '2023SR0023456' },
      { key: '开发完成日期', value: '2023年06月' },
      { key: '首次发表日期', value: '2023年08月' },
      { key: '权利取得方式', value: '原始取得' }
    ],
    sourceFileId: 4,
    pageRange: '第3-4页'
  },
  // 软著3
  {
    id: 'm4-3-img',
    name: '政务服务一体化平台 V4.0 证书扫描件',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '软件著作权登记证书扫描件',
    contentType: 'image',
    keyInfo: [
      { key: '登记号', value: '2022SR0156789' },
      { key: '用途', value: '软著证明附件' }
    ],
    sourceFileId: 4,
    pageRange: '第5-6页'
  },
  {
    id: 'm4-3-txt',
    name: '政务服务一体化平台 V4.0 登记信息',
    category: 'technical',
    categoryLabel: '技术方案',
    summary: '软著登记信息，用于技术实力描述',
    contentType: 'text',
    fullText: '政务服务一体化平台 V4.0 是公司为政府部门打造的综合政务服务系统，登记号为 2022SR0156789，于2022年9月开发完成，2022年11月首次发表。该平台实现了"一网通办"的政务服务理念，整合多个部门业务系统，支持在线申报、智能审批、电子证照等功能，已在多个地市级政府成功上线运行。',
    keyInfo: [
      { key: '软件名称', value: '政务服务一体化平台 V4.0' },
      { key: '登记号', value: '2022SR0156789' },
      { key: '开发完成日期', value: '2022年09月' },
      { key: '首次发表日期', value: '2022年11月' },
      { key: '权利取得方式', value: '原始取得' }
    ],
    sourceFileId: 4,
    pageRange: '第5-6页'
  },
  // 软著4
  {
    id: 'm4-4-img',
    name: 'AI智能文档处理系统 V1.0 证书扫描件',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '软件著作权登记证书扫描件',
    contentType: 'image',
    keyInfo: [
      { key: '登记号', value: '2022SR0167890' },
      { key: '用途', value: '软著证明附件' }
    ],
    sourceFileId: 4,
    pageRange: '第7-8页'
  },
  {
    id: 'm4-4-txt',
    name: 'AI智能文档处理系统 V1.0 登记信息',
    category: 'technical',
    categoryLabel: '技术方案',
    summary: '软著登记信息，用于技术实力描述',
    contentType: 'text',
    fullText: 'AI智能文档处理系统 V1.0 是公司基于深度学习技术开发的文档智能处理系统，登记号为 2022SR0167890，于2022年11月开发完成，2023年1月首次发表。该系统支持多种格式文档的智能识别、信息提取、自动分类和结构化处理，OCR识别准确率达99%以上，广泛应用于金融、政务、法律等行业。',
    keyInfo: [
      { key: '软件名称', value: 'AI智能文档处理系统 V1.0' },
      { key: '登记号', value: '2022SR0167890' },
      { key: '开发完成日期', value: '2022年11月' },
      { key: '首次发表日期', value: '2023年01月' },
      { key: '权利取得方式', value: '原始取得' }
    ],
    sourceFileId: 4,
    pageRange: '第7-8页'
  },
  // 软著5
  {
    id: 'm4-5-img',
    name: '企业知识图谱管理系统 V2.0 证书扫描件',
    category: 'certificate',
    categoryLabel: '资质证书',
    summary: '软件著作权登记证书扫描件',
    contentType: 'image',
    keyInfo: [
      { key: '登记号', value: '2021SR0234567' },
      { key: '用途', value: '软著证明附件' }
    ],
    sourceFileId: 4,
    pageRange: '第9-10页'
  },
  {
    id: 'm4-5-txt',
    name: '企业知识图谱管理系统 V2.0 登记信息',
    category: 'technical',
    categoryLabel: '技术方案',
    summary: '软著登记信息，用于技术实力描述',
    contentType: 'text',
    fullText: '企业知识图谱管理系统 V2.0 是公司自主研发的知识管理平台，登记号为 2021SR0234567，于2021年8月开发完成，2021年10月首次发表。该系统基于图数据库技术，支持企业知识的自动抽取、关联构建和智能检索，帮助企业实现知识资产的数字化管理和智能化应用。',
    keyInfo: [
      { key: '软件名称', value: '企业知识图谱管理系统 V2.0' },
      { key: '登记号', value: '2021SR0234567' },
      { key: '开发完成日期', value: '2021年08月' },
      { key: '首次发表日期', value: '2021年10月' },
      { key: '权利取得方式', value: '原始取得' }
    ],
    sourceFileId: 4,
    pageRange: '第9-10页'
  },

  // ========== File 5: 公司核心团队成员简介.docx → 6个素材 ==========
  {
    id: 'm5-1',
    name: '王建国 - 总经理',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '公司创始人兼总经理，20年IT行业经验',
    contentType: 'text',
    fullText: '王建国，男，1975年生，公司创始人兼总经理。清华大学计算机科学与技术专业硕士，高级工程师职称。曾任职于华为技术有限公司、腾讯科技等知名企业，拥有20年IT行业从业经验。2010年创立深圳市智联云科技术有限公司，带领公司发展成为国家高新技术企业。主导完成多个省部级重大信息化项目，获得"深圳市优秀创业者"等荣誉称号。',
    keyInfo: [
      { key: '姓名', value: '王建国' },
      { key: '职务', value: '总经理' },
      { key: '学历', value: '清华大学计算机硕士' },
      { key: '职称', value: '高级工程师' },
      { key: '从业年限', value: '20年' }
    ],
    sourceFileId: 5,
    pageRange: '第1页'
  },
  {
    id: 'm5-2',
    name: '张伟 - 技术总监',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '技术总监，15年软件架构经验，负责技术战略规划',
    contentType: 'text',
    fullText: '张伟，男，1982年生，公司技术总监。北京大学软件工程专业硕士，高级工程师职称，系统架构设计师认证。曾任职于阿里巴巴集团担任技术专家，拥有15年软件开发和架构设计经验。负责公司技术战略规划和核心产品研发，主导设计了智联云企业数据中台系统架构，带领技术团队完成多个千万级项目交付。精通分布式系统、微服务架构、大数据处理等技术领域。',
    keyInfo: [
      { key: '姓名', value: '张伟' },
      { key: '职务', value: '技术总监' },
      { key: '学历', value: '北京大学软件工程硕士' },
      { key: '职称', value: '高级工程师' },
      { key: '认证', value: '系统架构设计师' },
      { key: '从业年限', value: '15年' }
    ],
    sourceFileId: 5,
    pageRange: '第2页'
  },
  {
    id: 'm5-3',
    name: '李明 - 项目总监',
    category: 'team',
    categoryLabel: '项目团队',
    summary: 'PMP认证项目总监，成功交付30+大型项目',
    contentType: 'text',
    fullText: '李明，男，1985年生，公司项目总监。武汉大学信息管理专业本科，中级工程师职称，PMP项目管理专业人士认证、PRINCE2认证。拥有12年项目管理经验，成功交付政务、金融、能源等行业大型信息化项目30余个，累计合同金额超过5亿元。擅长大型复杂项目的规划、执行和风险管控，具有丰富的团队管理和客户沟通经验。',
    keyInfo: [
      { key: '姓名', value: '李明' },
      { key: '职务', value: '项目总监' },
      { key: '学历', value: '武汉大学本科' },
      { key: '职称', value: '中级工程师' },
      { key: '认证', value: 'PMP、PRINCE2' },
      { key: '项目经验', value: '30+大型项目' }
    ],
    sourceFileId: 5,
    pageRange: '第3页'
  },
  {
    id: 'm5-4',
    name: '陈静 - 产品总监',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '产品总监，10年产品设计经验，主导多款核心产品',
    contentType: 'text',
    fullText: '陈静，女，1988年生，公司产品总监。浙江大学人机交互专业硕士，NPDP产品经理认证。曾任职于字节跳动担任高级产品经理，拥有10年产品设计和管理经验。负责公司产品战略规划和用户体验设计，主导完成智能招投标分析平台、政务服务一体化平台等核心产品的设计工作。对政务、企业服务领域有深入理解，擅长将复杂业务需求转化为简洁易用的产品方案。',
    keyInfo: [
      { key: '姓名', value: '陈静' },
      { key: '职务', value: '产品总监' },
      { key: '学历', value: '浙江大学人机交互硕士' },
      { key: '认证', value: 'NPDP产品经理' },
      { key: '从业年限', value: '10年' }
    ],
    sourceFileId: 5,
    pageRange: '第4页'
  },
  {
    id: 'm5-5',
    name: '刘洋 - 算法专家',
    category: 'team',
    categoryLabel: '项目团队',
    summary: 'AI算法专家，博士学历，多篇顶会论文',
    contentType: 'text',
    fullText: '刘洋，男，1990年生，公司AI算法专家。中国科学技术大学人工智能专业博士，曾在微软亚洲研究院从事自然语言处理研究。发表ACL、EMNLP等顶级会议论文8篇，拥有发明专利12项。负责公司AI核心算法研发，主导开发了文档智能理解、知识图谱构建、智能问答等关键技术模块，为公司产品提供核心技术支撑。',
    keyInfo: [
      { key: '姓名', value: '刘洋' },
      { key: '职务', value: 'AI算法专家' },
      { key: '学历', value: '中科大人工智能博士' },
      { key: '论文', value: '顶会论文8篇' },
      { key: '专利', value: '发明专利12项' }
    ],
    sourceFileId: 5,
    pageRange: '第5页'
  },
  {
    id: 'm5-6',
    name: '赵敏 - 质量总监',
    category: 'team',
    categoryLabel: '项目团队',
    summary: '质量总监，负责公司质量管理体系建设',
    contentType: 'text',
    fullText: '赵敏，女，1983年生，公司质量总监。华中科技大学软件工程专业硕士，中级工程师职称，ISO9001内审员、CMMI评估师认证。拥有13年软件质量管理经验，曾任职于中软国际担任质量经理。负责公司ISO9001质量管理体系建设和持续改进，主导公司通过CMMI3级认证。建立了完善的软件测试流程和质量控制标准，确保项目交付质量。',
    keyInfo: [
      { key: '姓名', value: '赵敏' },
      { key: '职务', value: '质量总监' },
      { key: '学历', value: '华中科技大学软件工程硕士' },
      { key: '职称', value: '中级工程师' },
      { key: '认证', value: 'ISO9001内审员、CMMI评估师' },
      { key: '从业年限', value: '13年' }
    ],
    sourceFileId: 5,
    pageRange: '第6页'
  },

  // ========== File 6: 2023年度典型项目案例集.pdf → 8个素材 ==========
  {
    id: 'm6-1',
    name: '深圳市政务服务数据管理平台项目',
    category: 'case',
    categoryLabel: '业绩案例',
    summary: '政务大数据平台建设，合同金额2800万元',
    contentType: 'text',
    fullText: '项目名称：深圳市政务服务数据管理平台项目\n\n甲方单位：深圳市政务服务数据管理局\n\n项目概述：本项目为深圳市政务服务数据管理局建设统一的政务服务数据管理平台，实现全市各部门政务数据的汇聚、治理、共享和开放。平台采用微服务架构，部署于政务云环境，支持日均千万级数据交换量。\n\n主要建设内容包括：数据汇聚中心、数据治理平台、数据共享交换平台、数据开放门户、数据安全管理系统等5大核心模块。项目于2023年3月启动，2023年12月完成验收，历时10个月。\n\n项目成果：平台已接入市级58个部门数据资源，累计汇聚数据超过80亿条，支撑"秒批"事项200余项，为深圳市数字政府建设提供了重要数据基础。项目获评2023年度深圳市优秀政务信息化项目。',
    keyInfo: [
      { key: '项目名称', value: '深圳市政务服务数据管理平台项目' },
      { key: '甲方单位', value: '深圳市政务服务数据管理局' },
      { key: '合同金额', value: '2800万元' },
      { key: '项目周期', value: '2023.03 - 2023.12' },
      { key: '项目状态', value: '已验收' }
    ],
    sourceFileId: 6,
    pageRange: '第1-8页'
  },
  {
    id: 'm6-2',
    name: '广东省公共资源交易智慧监管平台项目',
    category: 'case',
    categoryLabel: '业绩案例',
    summary: '省级公共资源交易监管平台，合同金额1950万元',
    contentType: 'text',
    fullText: '项目名称：广东省公共资源交易智慧监管平台项目\n\n甲方单位：广东省公共资源交易中心\n\n项目概述：本项目为广东省公共资源交易中心建设智慧监管平台，运用大数据和人工智能技术实现对全省公共资源交易活动的智能监测和风险预警。平台覆盖工程建设、政府采购、土地使用权、矿业权等四大领域交易活动。\n\n主要建设内容包括：交易数据采集系统、智能分析引擎、风险预警平台、可视化监控大屏、移动监管APP等。项目于2022年11月启动，2023年9月完成验收，历时11个月。\n\n项目成果：平台已接入全省21个地市交易数据，实现对年交易额超3万亿元的公共资源交易活动实时监控，累计预警潜在风险交易1200余起，有效提升了监管效能。',
    keyInfo: [
      { key: '项目名称', value: '广东省公共资源交易智慧监管平台项目' },
      { key: '甲方单位', value: '广东省公共资源交易中心' },
      { key: '合同金额', value: '1950万元' },
      { key: '项目周期', value: '2022.11 - 2023.09' },
      { key: '项目状态', value: '已验收' }
    ],
    sourceFileId: 6,
    pageRange: '第9-16页'
  },
  {
    id: 'm6-3',
    name: '招商银行智能合同审核系统项目',
    category: 'case',
    categoryLabel: '业绩案例',
    summary: '金融行业智能合同审核系统，合同金额1200万元',
    contentType: 'text',
    fullText: '项目名称：招商银行智能合同审核系统项目\n\n甲方单位：招商银行股份有限公司\n\n项目概述：本项目为招商银行总行法律合规部建设智能合同审核系统，利用自然语言处理和机器学习技术实现合同文本的自动解析、条款抽取、风险识别和合规检查。系统支持信贷合同、担保合同、投资协议等20余类合同模板。\n\n主要建设内容包括：合同OCR识别模块、合同要素抽取引擎、风险规则库、智能审核引擎、审批流程系统等。项目于2023年1月启动，2023年8月完成验收，历时8个月。\n\n项目成果：系统上线后合同审核效率提升60%，关键条款识别准确率达95%以上，年处理合同量超10万份，累计发现合同风险点3000余处，为银行合规经营提供了有力支撑。',
    keyInfo: [
      { key: '项目名称', value: '招商银行智能合同审核系统项目' },
      { key: '甲方单位', value: '招商银行股份有限公司' },
      { key: '合同金额', value: '1200万元' },
      { key: '项目周期', value: '2023.01 - 2023.08' },
      { key: '项目状态', value: '已验收' }
    ],
    sourceFileId: 6,
    pageRange: '第17-23页'
  },
  {
    id: 'm6-4',
    name: '中国南方电网知识管理平台项目',
    category: 'case',
    categoryLabel: '业绩案例',
    summary: '央企知识管理平台建设，合同金额1580万元',
    contentType: 'text',
    fullText: '项目名称：中国南方电网知识管理平台项目\n\n甲方单位：中国南方电网有限责任公司\n\n项目概述：本项目为南方电网总部及下属五省区电网公司建设统一的知识管理平台，实现电力行业知识的采集、组织、共享和应用。平台基于知识图谱技术构建电力专业知识体系，支持智能搜索和知识推荐。\n\n主要建设内容包括：知识采集系统、知识图谱引擎、智能问答系统、专家库管理、培训学习平台等。项目于2022年8月启动，2023年6月完成验收，历时11个月。\n\n项目成果：平台已积累电力专业知识条目50万余条，构建电力知识图谱实体200万个、关系1000万条，支撑日均访问量10万人次，成为南方电网员工知识获取和技能提升的重要工具。',
    keyInfo: [
      { key: '项目名称', value: '中国南方电网知识管理平台项目' },
      { key: '甲方单位', value: '中国南方电网有限责任公司' },
      { key: '合同金额', value: '1580万元' },
      { key: '项目周期', value: '2022.08 - 2023.06' },
      { key: '项目状态', value: '已验收' }
    ],
    sourceFileId: 6,
    pageRange: '第24-31页'
  },
  {
    id: 'm6-5',
    name: '东莞市智慧城管综合管理平台项目',
    category: 'case',
    categoryLabel: '业绩案例',
    summary: '智慧城管平台建设，合同金额980万元',
    contentType: 'text',
    fullText: '项目名称：东莞市智慧城管综合管理平台项目\n\n甲方单位：东莞市城市管理和综合执法局\n\n项目概述：本项目为东莞市城管局建设智慧城管综合管理平台，整合城市管理各业务系统，实现城市管理问题的智能发现、快速处置和综合研判。平台对接视频监控、物联传感、市民上报等多源数据，构建城市管理"一张图"。\n\n主要建设内容包括：数据整合平台、AI视频分析系统、问题工单系统、指挥调度中心、移动执法终端等。项目于2023年2月启动，2023年10月完成验收，历时9个月。\n\n项目成果：平台上线后城市管理问题发现时间缩短70%，处置效率提升50%，市民投诉量下降30%，为东莞市创建全国文明城市提供了有力支撑。',
    keyInfo: [
      { key: '项目名称', value: '东莞市智慧城管综合管理平台项目' },
      { key: '甲方单位', value: '东莞市城市管理和综合执法局' },
      { key: '合同金额', value: '980万元' },
      { key: '项目周期', value: '2023.02 - 2023.10' },
      { key: '项目状态', value: '已验收' }
    ],
    sourceFileId: 6,
    pageRange: '第32-38页'
  },
  {
    id: 'm6-6',
    name: '平安保险智能理赔辅助系统项目',
    category: 'case',
    categoryLabel: '业绩案例',
    summary: '保险智能理赔系统，合同金额850万元',
    contentType: 'text',
    fullText: '项目名称：平安保险智能理赔辅助系统项目\n\n甲方单位：中国平安财产保险股份有限公司\n\n项目概述：本项目为平安产险理赔中心建设智能理赔辅助系统，运用图像识别、知识图谱和规则引擎技术，实现车险理赔案件的智能定损、自动审核和风险识别。系统支持从报案到结案的全流程智能化处理。\n\n主要建设内容包括：影像智能识别系统、定损知识库、自动理算引擎、反欺诈模型、理赔质检平台等。项目于2023年4月启动，2023年11月完成验收，历时8个月。\n\n项目成果：系统上线后简易案件自动处理率达65%，平均结案周期缩短40%，理赔准确率提升至98%，年节约理赔成本约2000万元。',
    keyInfo: [
      { key: '项目名称', value: '平安保险智能理赔辅助系统项目' },
      { key: '甲方单位', value: '中国平安财产保险股份有限公司' },
      { key: '合同金额', value: '850万元' },
      { key: '项目周期', value: '2023.04 - 2023.11' },
      { key: '项目状态', value: '已验收' }
    ],
    sourceFileId: 6,
    pageRange: '第39-45页'
  },
  {
    id: 'm6-7',
    name: '广州市不动产登记信息系统升级项目',
    category: 'case',
    categoryLabel: '业绩案例',
    summary: '不动产登记系统升级，合同金额720万元',
    contentType: 'text',
    fullText: '项目名称：广州市不动产登记信息系统升级项目\n\n甲方单位：广州市规划和自然资源局\n\n项目概述：本项目对广州市不动产登记信息系统进行全面升级改造，实现与省级平台对接、与相关部门数据共享，支持不动产登记"一窗受理、并行办理"。系统采用新一代技术架构，提升系统性能和用户体验。\n\n主要建设内容包括：登记业务系统升级、数据迁移整合、电子证照对接、自助服务终端、移动查询APP等。项目于2023年5月启动，2023年12月完成验收，历时8个月。\n\n项目成果：系统升级后登记办理时限压缩至1个工作日内，实现"一次不用跑"事项覆盖率90%，群众满意度提升至95%以上。',
    keyInfo: [
      { key: '项目名称', value: '广州市不动产登记信息系统升级项目' },
      { key: '甲方单位', value: '广州市规划和自然资源局' },
      { key: '合同金额', value: '720万元' },
      { key: '项目周期', value: '2023.05 - 2023.12' },
      { key: '项目状态', value: '已验收' }
    ],
    sourceFileId: 6,
    pageRange: '第46-52页'
  },
  {
    id: 'm6-8',
    name: '珠海市政务服务一体化平台项目',
    category: 'case',
    categoryLabel: '业绩案例',
    summary: '政务服务一体化平台，合同金额680万元',
    contentType: 'text',
    fullText: '项目名称：珠海市政务服务一体化平台项目\n\n甲方单位：珠海市政务服务数据管理局\n\n项目概述：本项目为珠海市建设政务服务一体化平台，整合各部门政务服务事项，实现线上线下融合、市区镇村四级联动的一体化政务服务体系。平台对接粤省事、粤商通等省级平台，实现与省平台互联互通。\n\n主要建设内容包括：统一受理平台、事项管理系统、电子表单引擎、统一用户认证、服务评价系统等。项目于2022年12月启动，2023年8月完成验收，历时9个月。\n\n项目成果：平台上线后网上可办率达100%，"一件事"主题服务覆盖50个高频事项，办事材料精简60%，为珠海市营商环境优化做出重要贡献。',
    keyInfo: [
      { key: '项目名称', value: '珠海市政务服务一体化平台项目' },
      { key: '甲方单位', value: '珠海市政务服务数据管理局' },
      { key: '合同金额', value: '680万元' },
      { key: '项目周期', value: '2022.12 - 2023.08' },
      { key: '项目状态', value: '已验收' }
    ],
    sourceFileId: 6,
    pageRange: '第53-60页'
  },

  // ========== File 7: 企业宣传手册_v3.2.pdf → 5个素材 ==========
  {
    id: 'm7-1',
    name: '公司概况',
    category: 'company',
    categoryLabel: '公司简介',
    summary: '公司整体介绍，用于投标文件企业概况章节',
    contentType: 'text',
    fullText: '深圳市智联云科技术有限公司成立于2010年，是一家专注于政企数字化转型的国家高新技术企业。公司总部位于深圳市南山区科技园，在广州、北京、上海设有分支机构，现有员工380余人，其中研发人员占比超过60%，硕士及以上学历占比35%。\n\n公司以"让数据创造价值，让技术服务社会"为使命，致力于为政府和大型企业提供数字化解决方案和专业技术服务。经过十余年发展，公司已形成数据中台、智能政务、智慧城市、企业数智化四大业务板块，累计服务政企客户500余家，项目覆盖广东、北京、上海、浙江等20余个省市。',
    keyInfo: [
      { key: '成立时间', value: '2010年' },
      { key: '企业性质', value: '国家高新技术企业' },
      { key: '员工规模', value: '380余人' },
      { key: '研发占比', value: '60%以上' },
      { key: '服务客户', value: '500+政企客户' }
    ],
    sourceFileId: 7,
    pageRange: '第1-3页'
  },
  {
    id: 'm7-2',
    name: '发展历程',
    category: 'company',
    categoryLabel: '公司简介',
    summary: '公司发展历程时间线，用于企业介绍章节',
    contentType: 'text',
    fullText: '2010年：公司在深圳注册成立，启动第一个政务信息化项目\n2012年：完成首轮融资，团队扩展至50人\n2014年：通过ISO9001质量管理体系认证，中标首个省级项目\n2016年：获得CMMI3级认证，年营收突破5000万元\n2018年：获评国家高新技术企业，设立广州分公司\n2019年：发布智联云数据中台产品，年营收突破1亿元\n2020年：完成B轮融资，设立北京、上海分公司\n2021年：荣获广东省专精特新中小企业认定\n2022年：年营收突破2亿元，员工规模超过300人\n2023年：成功交付多个省市级重大信息化项目，累计获得软件著作权50余项',
    keyInfo: [
      { key: '成立年份', value: '2010年' },
      { key: '融资情况', value: 'B轮融资' },
      { key: '分支机构', value: '广州、北京、上海' },
      { key: '当前营收', value: '2亿元+' },
      { key: '软著数量', value: '50余项' }
    ],
    sourceFileId: 7,
    pageRange: '第4-6页'
  },
  {
    id: 'm7-3',
    name: '核心技术能力',
    category: 'technical',
    categoryLabel: '技术方案',
    summary: '公司核心技术优势描述，用于技术实力章节',
    contentType: 'text',
    fullText: '公司在数据智能领域积累了深厚的技术能力，拥有完全自主知识产权的核心技术体系：\n\n【数据中台技术】自主研发的企业级数据中台产品，支持多源异构数据接入、实时流批一体处理、智能数据治理，日处理数据量可达PB级别，已在多个大型政企客户中成功应用。\n\n【自然语言处理】基于深度学习的NLP技术，包括文档智能理解、实体识别、关系抽取、智能问答等，在政务、法律、金融等垂直领域准确率达到行业领先水平。\n\n【知识图谱技术】自主研发的知识图谱构建和应用平台，支持大规模知识自动抽取、图谱构建和智能推理，已构建多个行业知识图谱。\n\n【低代码开发平台】可视化快速开发平台，支持页面拖拽、流程编排、接口配置，开发效率提升80%以上。',
    keyInfo: [
      { key: '数据中台', value: '自主研发，PB级处理能力' },
      { key: 'NLP技术', value: '行业领先准确率' },
      { key: '知识图谱', value: '大规模自动构建能力' },
      { key: '低代码平台', value: '效率提升80%' },
      { key: '软著数量', value: '50余项' }
    ],
    sourceFileId: 7,
    pageRange: '第7-12页'
  },
  {
    id: 'm7-4',
    name: '服务能力',
    category: 'company',
    categoryLabel: '公司简介',
    summary: '公司服务范围和能力介绍',
    contentType: 'text',
    fullText: '公司具备从咨询规划、方案设计、系统开发、项目实施到运维服务的全生命周期服务能力：\n\n【咨询规划】深入理解客户业务需求，提供信息化规划和数字化转型咨询服务，帮助客户明确建设目标和实施路径。\n\n【方案设计】专业的解决方案团队，针对客户场景定制系统架构和功能方案，确保技术方案的先进性和可落地性。\n\n【系统开发】采用敏捷开发方法论，保证开发质量和交付效率，支持定制开发和产品配置两种交付模式。\n\n【项目实施】PMP认证的项目经理团队，严格的项目管理流程，确保项目按质按期交付。\n\n【运维服务】提供7×24小时运维保障服务，建立完善的SLA服务标准，平均响应时间15分钟内。',
    keyInfo: [
      { key: '服务模式', value: '全生命周期服务' },
      { key: '开发方法', value: '敏捷开发' },
      { key: '项目管理', value: 'PMP认证团队' },
      { key: '运维保障', value: '7×24小时' },
      { key: '响应时间', value: '15分钟内' }
    ],
    sourceFileId: 7,
    pageRange: '第13-16页'
  },
  {
    id: 'm7-5',
    name: '荣誉资质汇总',
    category: 'honor',
    categoryLabel: '荣誉奖项',
    summary: '公司获得的荣誉和资质列表',
    contentType: 'text',
    fullText: '公司凭借持续的技术创新和优质的服务质量，获得了众多荣誉和资质认证：\n\n【企业资质】\n• 国家高新技术企业（2023年认定）\n• 广东省专精特新中小企业\n• ISO9001质量管理体系认证\n• ISO27001信息安全管理体系认证\n• CMMI3级认证\n• 软件企业认定\n\n【行业荣誉】\n• 2023年广东省优秀软件产品\n• 2023年深圳市优秀政务信息化项目\n• 2022年度广东省守合同重信用企业\n• 2022年广州市数字政府建设优秀服务商\n• 2021年深圳市创新型中小企业\n\n【知识产权】\n• 软件著作权50余项\n• 发明专利15项\n• 实用新型专利8项',
    keyInfo: [
      { key: '高新技术企业', value: '2023年认定' },
      { key: 'CMMI', value: '3级认证' },
      { key: 'ISO认证', value: '9001、27001' },
      { key: '软件著作权', value: '50余项' },
      { key: '发明专利', value: '15项' }
    ],
    sourceFileId: 7,
    pageRange: '第17-20页'
  }
]);

// Selected file state
const selectedFile = ref<SourceFile | null>(null);

// Expanded material for showing details
const expandedMaterialId = ref<string | null>(null);

// Toggle material expansion
const toggleMaterialExpand = (materialId: string) => {
  if (expandedMaterialId.value === materialId) {
    expandedMaterialId.value = null;
  } else {
    expandedMaterialId.value = materialId;
  }
};

// Get materials for selected file
const selectedFileMaterials = computed(() => {
  if (!selectedFile.value) return [];
  return materials.value.filter(m => m.sourceFileId === selectedFile.value?.id);
});

// Get file preview content for selected file
const selectedFilePreview = computed(() => {
  if (!selectedFile.value) return null;
  return filePreviewData.find(p => p.fileId === selectedFile.value?.id);
});

// Category color mapping
const getCategoryColor = (category: string) => {
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

const searchQuery = ref('');
const isDragOver = ref(false);
const currentPage = ref(1);
const zoomLevel = ref(100);

// Handle file click
const handleFileClick = (file: SourceFile) => {
  selectedFile.value = file;
};

// Close file detail
const closeFileDetail = () => {
  selectedFile.value = null;
};

// Drag and drop handlers
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  console.log('Files dropped:', e.dataTransfer?.files);
};

const containerRef = ref<HTMLElement | null>(null);
const leftPanelWidth = ref(50);
const isDragging = ref(false);
const minWidth = 30;
const maxWidth = 70;

const handleSearch = () => {
  console.log('Searching:', searchQuery.value);
};

const handleFileSelect = () => {
  console.log('File select triggered');
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;
  const containerRect = containerRef.value.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const mouseX = e.clientX - containerRect.left;
  let newWidth = (mouseX / containerWidth) * 100;
  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
  leftPanelWidth.value = newWidth;
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

onMounted(() => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<template>
  <div class="knowledge-base-page" ref="containerRef">
    <!-- Left: File Manager -->
    <div class="file-manager" :style="{ width: leftPanelWidth + '%' }">
      <!-- When file is selected, show file preview -->
      <template v-if="selectedFile">
        <!-- White header bar -->
        <div class="file-preview-header">
          <button class="back-btn" @click="closeFileDetail">
            <ArrowLeft :size="18" />
          </button>
          <div class="preview-file-info">
            <span class="preview-file-name">{{ selectedFile.name }}</span>
          </div>
        </div>
        <!-- File content preview -->
        <div class="file-preview-content">
          <div v-if="selectedFilePreview" class="preview-document">
            <div class="document-page">
              <div
                v-for="(line, index) in selectedFilePreview.content"
                :key="index"
                class="document-line"
                :class="{
                  'empty-line': line === '',
                  'title-line': index === 0 && selectedFile.id <= 3,
                  'red-title': line.includes('委员会') || line.includes('证书') || line.includes('执照') || line.includes('汇编') || line.includes('简介') || line.includes('案例集') || line.includes('手册'),
                  'doc-number': line.includes('编号') || line.includes('登记号')
                }"
              >{{ line || '\u00A0' }}</div>
            </div>
          </div>
          <div v-else class="preview-placeholder">
            <FileText :size="48" stroke-width="1" />
            <p>文件原文预览区域</p>
            <span class="preview-hint">此处展示 PDF/Word 文件内容</span>
          </div>
        </div>
        <!-- Pagination - fixed at bottom -->
        <div class="preview-pagination" v-if="selectedFilePreview">
          <button class="page-nav-btn" :disabled="currentPage <= 1" @click="currentPage--">
            <ChevronLeft :size="16" />
          </button>
          <div class="page-input-group">
            <input type="text" class="page-input" :value="currentPage" readonly />
            <span class="page-separator">/</span>
            <span class="total-pages">{{ selectedFile.id === 4 ? 10 : selectedFile.id === 5 ? 6 : selectedFile.id === 6 ? 60 : selectedFile.id === 7 ? 20 : 1 }}</span>
          </div>
          <button class="page-nav-btn" @click="currentPage++">
            <ChevronRight :size="16" />
          </button>
          <div class="zoom-controls">
            <button class="zoom-btn" @click="zoomLevel = Math.max(50, zoomLevel - 10)">
              <ZoomOut :size="16" />
            </button>
            <span class="zoom-level">{{ zoomLevel }}%</span>
            <button class="zoom-btn" @click="zoomLevel = Math.min(200, zoomLevel + 10)">
              <ZoomIn :size="16" />
            </button>
          </div>
        </div>
      </template>

      <!-- Default: File list view -->
      <template v-else>
        <!-- Header -->
        <div class="page-header">
          <div class="header-left">
            <div class="header-icon-circle">
              <Building2 :size="24" color="#3b82f6" />
            </div>
            <h1 class="page-title">企业素材库</h1>
          </div>
        </div>

        <!-- Search -->
        <div class="search-bar">
          <Search :size="18" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文件名、文件夹名称"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>

        <!-- Folders -->
        <div class="folders-grid">
          <div
            v-for="folder in folders"
            :key="folder.id"
            class="folder-item"
          >
            <div class="folder-icon-wrapper">
              <svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 0C1.11929 0 0 1.11929 0 2.5V45.5C0 46.8807 1.11929 48 2.5 48H57.5C58.8807 48 60 46.8807 60 45.5V10.5C60 9.11929 58.8807 8 57.5 8H31L23 0H2.5Z" fill="#F59E0B"/>
                <path d="M60 45.5C60 46.8807 58.8807 48 57.5 48H2.5C1.11929 48 0 46.8807 0 45.5V14.5C0 13.1193 1.11929 12 2.5 12H57.5C58.8807 12 60 13.1193 60 14.5V45.5Z" fill="#FCD34D"/>
              </svg>
            </div>
            <span class="folder-name">{{ folder.name }}</span>
          </div>
        </div>

        <!-- Files - Clickable List -->
        <div class="files-list">
          <div
            class="file-item-realign"
            :class="{ 'is-processing': file.status === 'processing' }"
            v-for="file in files"
            :key="file.id"
            @click="handleFileClick(file)"
          >
             <div class="file-col-icon">
                <div class="pdf-badge">
                  <span class="pdf-text">PDF</span>
                </div>
             </div>
             <div class="file-col-name" :title="file.name">{{ file.name }}</div>
             <div class="file-col-meta">{{ file.size }}</div>
             <div class="file-col-meta">{{ file.words }}</div>
             <div class="file-col-meta">{{ file.creator }}</div>
             <div class="file-col-actions">
               <button class="file-action-btn" @click.stop title="查看详情">
                 <FileText :size="16" />
               </button>
               <button class="file-action-btn" @click.stop title="更多操作">
                 <MoreHorizontal :size="16" />
               </button>
             </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Resizer -->
    <div
      class="resizer"
      :class="{ 'is-dragging': isDragging }"
      @mousedown="startDrag"
    >
      <div class="resizer-handle"></div>
    </div>

    <!-- Right Panel -->
    <div class="material-panel" :style="{ width: (100 - leftPanelWidth) + '%' }">
      <div class="material-panel-content">
        <!-- When file is selected, show extracted materials list -->
        <template v-if="selectedFile">
          <div class="materials-header">
            <h2 class="materials-title">
              AI 拆分素材
              <span class="materials-count">{{ selectedFileMaterials.length }} 个</span>
            </h2>
            <p class="materials-subtitle">以下素材已从文件中自动识别并提取，可在标书生成时调用</p>
          </div>

          <!-- Materials List -->
          <div class="materials-list">
            <div
              v-for="material in selectedFileMaterials"
              :key="material.id"
              class="material-item"
              @click="currentPage = parseInt(material.pageRange?.replace(/[^0-9]/g, '') || '1')"
            >
              <div class="material-header">
                <span class="page-tag">{{ material.pageRange || '—' }}</span>
                <span class="type-tag" :class="material.contentType">
                  <Image v-if="material.contentType === 'image'" :size="12" />
                  <FileType v-else-if="material.contentType === 'text'" :size="12" />
                  <FileText v-else :size="12" />
                  {{ material.contentType === 'image' ? '图片' : material.contentType === 'text' ? '文本' : '混合' }}
                </span>
              </div>
              <!-- Image type: show simulated thumbnail -->
              <div v-if="material.contentType === 'image'" class="material-thumbnail" @click.stop>
                <div class="thumbnail-doc">
                  <div class="doc-header">{{ material.name.includes('营业执照') ? '营业执照' : material.name.includes('ISO') ? '认证证书' : material.name.includes('高新') ? '高新企业证书' : '软件著作权' }}</div>
                  <div class="doc-content">
                    <div class="doc-line"></div>
                    <div class="doc-line short"></div>
                    <div class="doc-line"></div>
                    <div class="doc-line medium"></div>
                  </div>
                  <div class="doc-stamp">
                    <span>公章</span>
                  </div>
                </div>
                <span class="thumbnail-name">{{ material.name }}</span>
              </div>
              <!-- Text type: show editable text -->
              <div v-else class="material-body" contenteditable="true" @click.stop>{{ material.fullText || material.summary }}</div>
            </div>
          </div>
        </template>

        <!-- Default: Upload area -->
        <template v-else>
          <!-- Upload Area -->
          <div
            class="upload-area"
            :class="{ 'is-drag-over': isDragOver }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <div class="upload-icon">
              <Upload :size="32" stroke-width="1.5" />
            </div>
            <div class="upload-text">
              <span class="upload-main-text">拖放企业文件到此处，或</span>
              <button class="upload-btn" @click="handleFileSelect">选择文件</button>
            </div>
            <p class="upload-hint">支持 PDF、Word、Excel、图片等格式，单次可上传多个文件</p>

            <!-- Process Flow Card -->
            <div class="process-flow-card">
              <div class="flow-header">
                <span class="flow-icon">✨</span>
                <span>上传后，AI 将自动为您完成：</span>
              </div>
              <div class="flow-steps">
                <div class="flow-step">
                  <div class="step-icon">
                    <ScanSearch :size="20" />
                  </div>
                  <div class="step-label">智能识别</div>
                  <div class="step-desc">识别文件内容</div>
                </div>
                <div class="flow-arrow">
                  <ArrowRight :size="16" />
                </div>
                <div class="flow-step">
                  <div class="step-icon">
                    <GitBranch :size="20" />
                  </div>
                  <div class="step-label">自动拆分</div>
                  <div class="step-desc">拆分为原子素材</div>
                </div>
                <div class="flow-arrow">
                  <ArrowRight :size="16" />
                </div>
                <div class="flow-step">
                  <div class="step-icon">
                    <Tags :size="20" />
                  </div>
                  <div class="step-label">分类归档</div>
                  <div class="step-desc">归入对应分类</div>
                </div>
              </div>
              <p class="flow-footer">拆分后的素材可在「AI标书生成」等场景中自动匹配调用</p>
            </div>
          </div>

          <!-- Usage Tips -->
          <div class="usage-tips">
            <h3 class="tips-title">如何使用素材库？</h3>
            <div class="tips-list">
              <div class="tip-item">
                <span class="tip-number">1</span>
                <span class="tip-text">上传企业资质、业绩、团队等相关文件</span>
              </div>
              <div class="tip-item">
                <span class="tip-number">2</span>
                <span class="tip-text">点击左侧文件，查看 AI 自动拆分出的原子化素材</span>
              </div>
              <div class="tip-item">
                <span class="tip-number">3</span>
                <span class="tip-text">在「AI标书生成」时，系统自动匹配相关素材</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-base-page {
  flex: 1;
  height: 100%;
  display: flex;
  background: #eff6ff;
  overflow: hidden;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.file-manager {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  min-width: 480px;
  flex-shrink: 0;
  background-color: #eff6ff;
}

/* When showing file preview, remove padding */
.file-manager:has(.file-preview-header) {
  padding: 0;
}

/* Default state with padding */
.file-manager:not(:has(.file-preview-header)) {
  padding: 24px 32px;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.3px;
}

.add-file-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  transition: background 0.2s;
}

.add-file-btn:hover {
  background: #1d4ed8;
}

.add-file-wrapper {
  position: relative;
}

.add-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  min-width: 140px;
  z-index: 10;
}

.menu-item {
  padding: 10px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f3f4f6;
}

.search-bar {
  display: flex;
  align-items: center;
  height: 48px;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 0 4px 0 16px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.search-icon {
  color: #3b82f6;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #374151;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  height: 40px;
  padding: 0 24px;
  background: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 32px 16px;
  margin-bottom: 40px;
}

.folder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.15s;
}

.folder-item:hover {
  transform: translateY(-2px);
}

.folder-name {
  font-size: 13px;
  color: #4b5563;
  text-align: center;
  width: 100%;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item-realign {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid transparent;
  gap: 12px;
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.file-item-realign:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.file-item-realign.is-processing {
  opacity: 0.7;
}

.file-col-icon {
  width: 28px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.pdf-badge {
  width: 24px;
  height: 24px;
  background: #ef4444;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.pdf-text {
  font-size: 8px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}

.file-col-name {
  flex: 1;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 120px;
}

.file-col-meta {
  font-size: 13px;
  color: #9ca3af;
  white-space: nowrap;
}

.file-col-material-count {
  flex-shrink: 0;
}

.material-badge {
  font-size: 12px;
  padding: 4px 10px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
  font-weight: 500;
}

.processing-badge {
  font-size: 12px;
  padding: 4px 10px;
  background: #fef3c7;
  color: #b45309;
  border-radius: 12px;
  font-weight: 500;
}

.file-col-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.file-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s;
}

.file-action-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* File Preview Header - white background */
.file-preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.back-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.back-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.preview-file-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-file-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.file-preview-content {
  flex: 1;
  background: #f5f5f5;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 24px;
}

.preview-document {
  width: 100%;
  max-width: 800px;
}

.document-page {
  background: #fff;
  border: none;
  border-radius: 0;
  padding: 60px 80px;
  min-height: 600px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  font-family: "SimSun", "宋体", serif;
}

.document-line {
  font-size: 14px;
  line-height: 2;
  color: #1f2937;
  white-space: pre-wrap;
}

.document-line.empty-line {
  height: 28px;
}

.document-line.title-line {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}

.document-line.red-title {
  color: #dc2626;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
}

.document-line.doc-number {
  font-family: "Times New Roman", serif;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
}

.preview-placeholder p {
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
}

.preview-hint {
  font-size: 13px;
}

/* Pagination - fixed at bottom */
.preview-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.page-nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.page-nav-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-input {
  width: 40px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
  color: #374151;
  background: white;
}

.page-separator {
  color: #9ca3af;
  font-size: 13px;
}

.total-pages {
  font-size: 13px;
  color: #374151;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #e5e7eb;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.zoom-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.zoom-level {
  font-size: 13px;
  color: #374151;
  min-width: 40px;
  text-align: center;
}

.resizer {
  width: 1px;
  background: #dbeafe;
  position: relative;
  z-index: 10;
  cursor: col-resize;
  flex-shrink: 0;
}
.resizer:hover {
  width: 4px;
  background: #bfdbfe;
}

/* Right Panel */
.material-panel {
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.material-panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  gap: 24px;
}

/* Materials Header */
.materials-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.materials-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.materials-count {
  font-size: 13px;
  font-weight: 500;
  padding: 3px 10px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
}

.materials-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* Materials List */
.materials-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Materials List */
.materials-list {
  display: flex;
  flex-direction: column;
}

.material-item {
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}

.material-item:last-child {
  border-bottom: none;
}

.material-header {
  margin-bottom: 10px;
}

.page-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
  padding: 0 8px;
  background: #3b82f6;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}

.type-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  height: 24px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  margin-left: 8px;
}

.type-tag.image {
  background: #fef3c7;
  color: #b45309;
}

.type-tag.text {
  background: #dcfce7;
  color: #15803d;
}

.type-tag.mixed {
  background: #e0e7ff;
  color: #4338ca;
}

.material-thumbnail {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #f8fafc;
}

.thumbnail-doc {
  width: 80px;
  height: 110px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  flex-shrink: 0;
}

.doc-header {
  font-size: 8px;
  font-weight: 700;
  color: #dc2626;
  text-align: center;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.doc-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-line {
  height: 3px;
  background: #e5e7eb;
  border-radius: 1px;
}

.doc-line.short {
  width: 60%;
}

.doc-line.medium {
  width: 80%;
}

.doc-stamp {
  width: 24px;
  height: 24px;
  border: 2px solid #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  margin-top: 4px;
}

.doc-stamp span {
  font-size: 6px;
  color: #dc2626;
  font-weight: 600;
}

.thumbnail-name {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
}

.material-body {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.9;
  white-space: pre-wrap;
  outline: none;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: #f8fafc;
  transition: all 0.15s;
  cursor: text;
}

.material-body:focus {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Upload Area */
.upload-area {
  border: 2px dashed #bfdbfe;
  border-radius: 16px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
  transition: all 0.2s;
}

.upload-area.is-drag-over {
  border-color: #3b82f6;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
}

.upload-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.upload-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.upload-main-text {
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

.upload-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-btn:hover {
  background: #1d4ed8;
}

.upload-hint {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
}

/* Process Flow Card */
.process-flow-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
}

.flow-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 16px;
}

.flow-icon {
  font-size: 16px;
}

.flow-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 120px;
}

.step-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.step-desc {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.flow-arrow {
  color: #9ca3af;
  margin-top: 10px;
}

.flow-footer {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
}

/* Usage Tips */
.usage-tips {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px 24px;
}

.tips-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-text {
  font-size: 14px;
  color: #4b5563;
}
</style>
