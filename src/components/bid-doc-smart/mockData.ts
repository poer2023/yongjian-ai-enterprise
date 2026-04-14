// Mock data for BidDocSmartFormView

import { Zap, FileText, FileSearch, Bell } from 'lucide-vue-next';
import type { Enterprise, ScoringItem, Qualification, TimelineItem, RiskItem, ParsedAnalysis, BidDocType, RecentTool, OutlineMode, MatchedTemplate } from './types';

export const enterprises: Enterprise[] = [
  {
    id: 1,
    name: '深圳市智联云科技术有限公司',
    certCount: 6,
    caseCount: 8,
    teamCount: 6,
    recentCerts: ['高新技术企业', 'ISO9001', 'CMMI3']
  },
  {
    id: 2,
    name: '北京华信安全科技有限公司',
    certCount: 8,
    caseCount: 12,
    teamCount: 10,
    recentCerts: ['等保三级', 'ISO27001', 'CMMI5']
  },
  {
    id: 3,
    name: '上海数智信息技术有限公司',
    certCount: 5,
    caseCount: 6,
    teamCount: 8,
    recentCerts: ['软件企业认证', 'ISO9001', '双软认证']
  },
  {
    id: 4,
    name: '广州云端网络科技有限公司',
    certCount: 4,
    caseCount: 5,
    teamCount: 5,
    recentCerts: ['高新技术企业', 'ISO9001']
  }
];

export const parsedAnalysis: ParsedAnalysis = {
  scoringItems: [
    { name: '技术方案', score: 40, key: '架构设计、安全方案、创新性' },
    { name: '项目业绩', score: 20, key: '同类项目经验、合同金额' },
    { name: '团队资质', score: 15, key: 'PMP认证、高级职称' },
    { name: '企业资质', score: 15, key: 'CMMI3、ISO认证' },
    { name: '商务报价', score: 10, key: '价格竞争力' },
  ],
  qualifications: [
    { name: '信息系统集成三级及以上资质', status: 'matched', matched: 'ISO 9001质量管理体系认证' },
    { name: 'CMMI 3级及以上认证', status: 'matched', matched: 'CMMI 3级认证' },
    { name: '近三年同类项目业绩不少于2个', status: 'matched', matched: '已匹配3个同类项目' },
    { name: '项目经理具备PMP认证', status: 'matched', matched: '张工 - PMP认证' },
  ],
  timeline: [
    { event: '投标截止', date: '2024-03-15 14:30', urgent: true },
    { event: '开标时间', date: '2024-03-15 15:00', urgent: true },
    { event: '项目启动', date: '中标后10日内', urgent: false },
    { event: '项目验收', date: '合同签订后180日', urgent: false },
  ],
  risks: [
    { level: 'high', desc: '投标保证金需在截止前3日到账' },
    { level: 'medium', desc: '技术方案需包含应急预案章节' },
    { level: 'low', desc: '报价需精确到小数点后两位' },
  ],
};

export const mockParsedData = {
  bidTitle: '某市政务云平台建设项目技术投标文件',
  bidDocType: 'service',
  bidPrice: 2800,
  projectDuration: 180,
  durationUnit: 'days',
  warrantyPeriod: '2year',
  projectUnderstanding: '本项目旨在建设覆盖全市的政务云平台，实现政务数据的统一管理、共享交换和安全防护。核心需求包括：云基础设施建设、政务应用迁移、数据治理平台搭建、安全防护体系构建。',
  technicalHighlights: '我司在政务云领域具有丰富经验，已成功交付多个省市级政务云项目。核心优势包括：自主可控的云平台技术、完善的数据安全体系、7×24小时运维保障能力。',
};

export const recentTools: RecentTool[] = [
  { icon: Zap, label: 'AI标书插件版', active: true, route: 'bid-doc-smart-form' },
  // { icon: FileText, label: 'AI标书生成（表单版）', active: false, route: 'bid-doc-form' },
  { icon: FileSearch, label: '标讯解读', active: false, route: 'bid-analysis-form' },
  { icon: Bell, label: '标讯订阅', active: false, route: 'bid-subscription' },
];

export const bidDocTypes: BidDocType[] = [
  { key: 'service', icon: '服', label: '服务类' },
  { key: 'goods', icon: '货', label: '货物类' },
  { key: 'engineering', icon: '工', label: '工程类' },
];

export const durationUnits = [
  { key: 'days', label: '天' },
  { key: 'months', label: '月' },
];

export const warrantyOptions = [
  { key: '1year', label: '1年' },
  { key: '2year', label: '2年' },
  { key: '3year', label: '3年' },
];

export const outlineModes: OutlineMode[] = [
  { key: 'template', label: '素材库模板匹配', desc: '从企业素材库中匹配类似项目大纲' },
  { key: 'ai', label: 'AI智能生成', desc: '根据招标文件自动生成大纲' },
  { key: 'custom', label: '手动指定大纲', desc: '按您提供的目录结构生成' },
];

export const matchedTemplates: MatchedTemplate[] = [
  { id: 'tpl1', name: '政务云平台建设方案模板', projectName: '某市政务云平台建设项目', matchScore: 95, pages: 120 },
  { id: 'tpl2', name: '智慧城市数据中心方案模板', projectName: '某市智慧城市数据中心项目', matchScore: 82, pages: 150 },
  { id: 'tpl3', name: '信息化系统集成方案模板', projectName: '某区信息化系统集成项目', matchScore: 76, pages: 100 },
];

export const features = [
  '只需上传招标文件即可发起生成',
  '支持填写补充需求与特殊要求',
  '提交后直接进入等待页',
  '不再跳转大纲与编辑器页面',
  '适合插件调用与快速演示流程',
];
