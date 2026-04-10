// Types for enterprise material components

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface SourcePreviewEvidence {
  title: string;
  subtitle?: string;
  pageLabel?: string;
  targetPage?: number;
  content?: string[];
  imageDataUrl?: string;
}

export type MaterialCategory =
  | 'certificate'
  | 'case'
  | 'team'
  | 'company'
  | 'honor'
  | 'technical'
  | 'template';

export type EnterpriseMaterialTab =
  | 'qualification'
  | 'personnel'
  | 'cases'
  | 'expiry'
  | 'profile';

export interface SourceFile {
  id: number;
  name: string;
  size: string;
  words: string;
  creator: string;
  status: 'completed' | 'processing';
  materialCount: number;
}

// Attachment reference for supporting documents
export interface AttachmentRef {
  name: string;
  type: 'scan' | 'certificate' | 'contract' | 'report' | 'invoice';
  fileId?: number;
  /** Optional preview image (data URL) for original image rendering in demo. */
  previewDataUrl?: string;
  previewEvidence?: SourcePreviewEvidence;
}

/** One row in the person's detail view — links back to a source file (Notion DB → page). */
export interface PersonnelSourceItem {
  id: string;
  title: string;
  kind?:
    | 'table'
    | 'certificate'
    | 'resume'
    | 'contract'
    | 'social_security'
    | 'id_card'
    | 'diploma'
    | 'screenshot'
    | 'other';
  sourceFileId: number;
  pageRange?: string;
  note?: string;
  /** Optional preview image (data URL) for original image rendering in demo. */
  previewDataUrl?: string;
  previewEvidence?: SourcePreviewEvidence;
}

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  categoryLabel: string;
  summary: string;
  keyInfo: KeyValuePair[];
  sourceFileId: number;
  pageRange?: string;
  contentType: 'image' | 'text' | 'mixed';
  fullText?: string;
  // Team member supporting documents
  idCardScan?: AttachmentRef;
  diplomaScan?: AttachmentRef;
  certScans?: AttachmentRef[];
  // Expiry date for certificates (ISO date string, e.g. '2026-06-19')
  expiryDate?: string;
  // Project case fields
  projectType?: '等保测评' | '密评' | '安全服务' | '系统集成' | '软件开发' | '运维服务' | '咨询规划';
  proofDocuments?: AttachmentRef[];
  /** Row index in bid-style tables such as 「资质认证列表」(序号) */
  listOrder?: number;
  /** Team member: full list of traceable artifacts with source file links */
  personnelSources?: PersonnelSourceItem[];
  qualification?: QualificationRecord;
  caseEvidence?: PerformanceCaseEvidence;
  previewEvidence?: SourcePreviewEvidence;
}

// Expiry alert level
export type ExpiryLevel = 'expired' | 'week' | 'month' | 'quarter' | 'normal';

export interface ExpiryInfo {
  level: ExpiryLevel;
  label: string;
  daysLeft: number;
}

export interface EnterpriseMaterialTabItem {
  key: EnterpriseMaterialTab;
  label: string;
}

export interface MaterialGroup {
  sourceFile: SourceFile | null;
  items: Material[];
}

export interface ProfileSection {
  key: string;
  title: string;
  description: string;
  groups: MaterialGroup[];
  total: number;
}

export interface ExpiryAlertItem extends ExpiryInfo {
  material: Material;
  sourceFile: SourceFile | undefined;
}

export interface FilePreview {
  fileId: number;
  content: string[];
  totalPages?: number;
  pages?: Record<number, string[]>;
}

export interface Folder {
  id: number;
  name: string;
}

export type QualificationBucket =
  | '主体证明'
  | '准入资质'
  | '能力资质'
  | '管理体系认证'
  | '荣誉品牌'
  | '行业参与';

export type QualificationRole = '准入' | '评分' | '展示' | '辅助证明';

export type QualificationDomain =
  | '通用'
  | '等保'
  | '密评'
  | '风险评估'
  | '审计'
  | '应急'
  | '数据安全';

export type QualificationProofType = '证书' | '官网截图' | '目录截图' | '说明函';

export interface QualificationRecord {
  organizationId: string;
  category: string;
  subcategory?: string;
  name: string;
  level?: string;
  majorScope?: string;
  standardCode?: string;
  issuer?: string;
  certificateNo?: string;
  issuedAt?: string;
  expiresAt?: string;
  status?: 'valid' | 'expired' | 'revoked';
  honorLevel?: string;
  description?: string;
  rawText?: string;
  isStructured?: boolean;
  bucket?: QualificationBucket;
  biddingRole?: QualificationRole;
  serviceDomains?: QualificationDomain[];
  proofType?: QualificationProofType;
  verificationMethod?: string;
}

export interface PerformanceCaseEvidence {
  organizationId: string;
  projectName: string;
  clientName: string;
  projectType?: Material['projectType'];
  industry?: string;
  region?: string;
  serviceContent?: string;
  contractAmount?: string;
  signedAt?: string;
  sourceSection?: string;
  evidenceType: 'case_list' | 'contract' | 'acceptance' | 'invoice' | 'user_reference' | 'mixed';
  proofStatus: 'list_only' | 'partial' | 'complete';
  scopeSummary?: string;
  highlights?: string;
  quoteText?: string;
  confidence?: number;
}

// ── Aligned with backend person / person_qualification tables ──

export interface PersonQualification {
  id: string;
  personId: string;
  qualificationType: '职称' | '注册证' | '执业资格' | '认证' | '其他';
  qualificationName: string;
  level: string;
  majorScope: string;
  issuer: string;
  certificateNo: string;
  issuedAt: string;
  expiresAt: string;
  registrationStatus: '已注册' | '未注册' | '转注中' | '';
  status: 'valid' | 'expired' | 'suspended';
  isPrimary?: boolean;
  sourceFileId?: number;
  pageRange?: string;
  previewDataUrl?: string;
  previewEvidence?: SourcePreviewEvidence;
}

export interface PersonProjectExperience {
  id: string;
  personId: string;
  projectName: string;   // 项目名称
  clientName?: string;   // 甲方单位
  year?: string;         // 年份（如 "2024"）
  role: string;          // 担任何职
  domain?: string;       // 领域类型（如 "等级保护测评"）
  caseId?: string;       // 关联的业绩案例 Material.id
}

/** Fixed-field document checklist for each person — model extracts per field */
export interface PersonDocuments {
  idCard?: boolean;              // 身份证
  diploma?: boolean;             // 毕业证
  degree?: boolean;              // 学位证
  socialSecurity?: boolean;      // 社保缴纳证明
}

export interface Person {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  age?: string;
  gender: string;
  idNoMasked: string;
  education: string;
  school?: string;
  major: string;
  totalYearsOfExperience: number;
  currentPosition: string;
  professionalTitle?: string;
  specialties: string[];
  coreDomain: string;
  coreDomainYears: number;
  projectExperiences?: PersonProjectExperience[];
  location: string;
  resumeSummary: string;
  qualifications: PersonQualification[];
  documents?: PersonDocuments;
  sourceFileId?: number;
  pageRange?: string;
  sourcePreviewEvidence?: SourcePreviewEvidence;
  documentPreviewMap?: Partial<Record<keyof PersonDocuments, SourcePreviewEvidence>>;
}
