// Mock data for BidDocFormView
import type {
  CompanyOption,
  BidDocType,
  OutlineMode,
  WritingStyle,
  LayoutTemplate,
  ConfigOption,
  FocusMode,
  MockCase,
  MockMember,
  MockCertificate
} from './types';

export const companyOptions: CompanyOption[] = [
  { key: 'company1', label: 'XX科技有限公司' },
  { key: 'company2', label: 'XX安全技术有限公司' },
];

export const bidDocTypes: BidDocType[] = [
  { key: 'service', icon: '服', label: '服务类' },
  { key: 'goods', icon: '货', label: '货物类' },
  { key: 'engineering', icon: '工', label: '工程类' },
];

export const outlineModes: OutlineMode[] = [
  { key: 'ai', label: 'AI智能生成', desc: '根据招标文件自动生成大纲' },
  { key: 'custom', label: '指定大纲', desc: '按您提供的目录结构生成' },
];

export const writingStyles: WritingStyle[] = [
  { key: 'formal', label: '正式', desc: '严谨规范的政府采购风格' },
  { key: 'professional', label: '专业', desc: '突出技术深度与专业性' },
  { key: 'rigorous', label: '严谨', desc: '逻辑清晰，论证充分' },
  { key: 'concise', label: '简洁', desc: '精炼表达，直击要点' },
  { key: 'detailed', label: '详尽', desc: '内容全面，细节丰富' },
];

export const layoutTemplates: LayoutTemplate[] = [
  { key: 'template1', label: '标准版式', preview: '📄' },
  { key: 'template2', label: '简约版式', preview: '📋' },
  { key: 'template3', label: '商务版式', preview: '📑' },
];

export const tableConfigs: ConfigOption[] = [
  { key: 'none', label: '无' },
  { key: 'few', label: '少量' },
  { key: 'moderate', label: '适量' },
  { key: 'many', label: '大量' },
];

export const chartConfigs: ConfigOption[] = [
  { key: 'none', label: '无' },
  { key: 'flowchart', label: '流程图' },
  { key: 'smartart', label: 'SmartArt' },
];

export const imageConfigs: ConfigOption[] = [
  { key: 'none', label: '无' },
  { key: 'few', label: '少量' },
  { key: 'moderate', label: '适量' },
];

export const focusModes: FocusMode[] = [
  { key: 'auto', label: 'AI智能匹配' },
  { key: 'manual', label: '手动指定素材' },
];

export const durationUnits: ConfigOption[] = [
  { key: 'days', label: '天' },
  { key: 'months', label: '月' },
];

export const warrantyOptions: ConfigOption[] = [
  { key: '1year', label: '1年' },
  { key: '2year', label: '2年' },
  { key: '3year', label: '3年' },
  { key: 'custom', label: '自定义' },
];

export const afterSalesOptions: ConfigOption[] = [
  { key: '7x24support', label: '7×24小时技术支持' },
  { key: 'onsite', label: '现场服务响应' },
  { key: 'training', label: '免费培训' },
  { key: 'upgrade', label: '免费升级' },
  { key: 'inspection', label: '定期巡检' },
  { key: 'hotline', label: '专属客服热线' },
];

export const mockCases: MockCase[] = [
  { id: 'case1', name: '某市政务云平台建设项目', amount: '2800万', year: '2023' },
  { id: 'case2', name: '某银行核心系统升级项目', amount: '1500万', year: '2022' },
  { id: 'case3', name: '某医院信息化改造项目', amount: '980万', year: '2023' },
];

export const mockMembers: MockMember[] = [
  { id: 'member1', name: '张工', role: '项目经理', cert: 'PMP认证' },
  { id: 'member2', name: '李工', role: '技术总监', cert: '高级系统架构师' },
  { id: 'member3', name: '王工', role: '安全专家', cert: 'CISSP认证' },
];

export const mockCertificates: MockCertificate[] = [
  { id: 'cert1', name: 'ISO 9001质量管理体系认证', validUntil: '2025-12' },
  { id: 'cert2', name: '信息系统集成三级资质', validUntil: '2024-08' },
  { id: 'cert3', name: 'CMMI 3级认证', validUntil: '2025-06' },
];

export const features: string[] = [
  '智能解析招标文件要求',
  '自动匹配企业资质与业绩',
  '响应评分点生成技术方案',
  '废标项自动检查提醒',
  '一键生成完整投标文件',
];
