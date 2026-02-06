import { UserCheck, FileUser, DollarSign } from 'lucide-vue-next';
import type { BossJD, RecentTool, CandidateFilter, RpaStrategy } from './types';

export const mockJdList: BossJD[] = [
  { id: 1, jobName: 'Java开发工程师', salaryRange: '25K-35K', location: '上海', experience: '3-5年', education: '本科', publishDate: '2026-02-01', viewCount: 156, resumeCount: 23, isMonitoring: false },
  { id: 2, jobName: '前端开发工程师', salaryRange: '20K-30K', location: '上海', experience: '2-4年', education: '本科', publishDate: '2026-02-02', viewCount: 98, resumeCount: 15, isMonitoring: false },
  { id: 3, jobName: '产品经理', salaryRange: '30K-45K', location: '上海', experience: '5年以上', education: '本科', publishDate: '2026-01-28', viewCount: 234, resumeCount: 42, isMonitoring: true },
  { id: 4, jobName: '网络安全工程师', salaryRange: '25K-40K', location: '上海', experience: '3-5年', education: '本科', publishDate: '2026-01-25', viewCount: 87, resumeCount: 12, isMonitoring: false },
  { id: 5, jobName: 'UI设计师', salaryRange: '15K-25K', location: '上海', experience: '2-3年', education: '大专', publishDate: '2026-02-03', viewCount: 145, resumeCount: 31, isMonitoring: true },
  { id: 6, jobName: '测试工程师', salaryRange: '18K-28K', location: '上海', experience: '2-4年', education: '本科', publishDate: '2026-01-30', viewCount: 76, resumeCount: 18, isMonitoring: false },
];

export const recentTools: RecentTool[] = [
  { icon: UserCheck, label: 'Boss招聘' },
  { icon: FileUser, label: '简历分析' },
  { icon: DollarSign, label: '薪酬调查' },
];

export const features: string[] = [
  'Boss直聘账号一键授权',
  '自动同步已发布岗位信息',
  '批量开启智能招聘监控',
  'AI自动筛选候选人打招呼',
  '简历自动收集整理分析',
];

// City options for filter
export const cityOptions: string[] = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都',
  '武汉', '西安', '天津', '重庆', '长沙', '郑州', '青岛', '厦门'
];

// Education options
export const educationOptions = [
  { value: '', label: '不限' },
  { value: 'college', label: '大专' },
  { value: 'bachelor', label: '本科' },
  { value: 'master', label: '硕士' },
  { value: 'phd', label: '博士' },
];

// Experience options
export const experienceOptions = [
  { value: '', label: '不限' },
  { value: '1-3', label: '1-3年' },
  { value: '3-5', label: '3-5年' },
  { value: '5-10', label: '5-10年' },
  { value: '10+', label: '10年以上' },
];

// Error handling options
export const errorHandlingOptions = [
  { value: 'pause', label: '暂停运行' },
  { value: 'skip', label: '跳过继续' },
  { value: 'notify', label: '通知处理' },
];

// Default filter configuration
export const defaultFilter: CandidateFilter = {
  keywords: [],
  cities: [],
  education: '',
  experience: '',
  salaryMin: null,
  salaryMax: null,
};

// Default RPA strategy
export const defaultRpaStrategy: RpaStrategy = {
  startTime: '09:00',
  endTime: '18:00',
  dailyLimit: 100,
  errorHandling: 'pause',
  enabled: true,
};
