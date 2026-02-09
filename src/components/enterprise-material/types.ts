// Types for enterprise material components

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

// Attachment reference for supporting documents
export interface AttachmentRef {
  name: string;
  type: 'scan' | 'certificate' | 'contract' | 'report' | 'invoice';
  fileId?: number;
}

export interface Material {
  id: string;
  name: string;
  category: 'certificate' | 'case' | 'team' | 'company' | 'honor' | 'technical' | 'template';
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
}

// Expiry alert level
export type ExpiryLevel = 'expired' | 'week' | 'month' | 'quarter' | 'normal';

export interface ExpiryInfo {
  level: ExpiryLevel;
  label: string;
  daysLeft: number;
}

export interface FilePreview {
  fileId: number;
  content: string[];
}

export interface Folder {
  id: number;
  name: string;
}
