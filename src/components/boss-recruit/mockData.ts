import { UserCheck, FileUser, DollarSign } from 'lucide-vue-next';
import type { BossJD, RecentTool, CandidateFilter, RpaStrategy, Resume, BossAccount } from './types';

export const mockJdList: BossJD[] = [
  { id: 1, jobName: 'Java开发工程师', salaryRange: '25K-35K', location: '上海', experience: '3-5年', education: '本科', publishDate: '2026-02-01', viewCount: 156, resumeCount: 23, isFollowing: true, followStatus: 'running', todayGreetings: 45, todayResumes: 12, totalResumes: 89 },
  { id: 2, jobName: '前端开发工程师', salaryRange: '20K-30K', location: '上海', experience: '2-4年', education: '本科', publishDate: '2026-02-02', viewCount: 98, resumeCount: 15, isFollowing: true, followStatus: 'running', todayGreetings: 38, todayResumes: 8, totalResumes: 56 },
  { id: 3, jobName: '产品经理', salaryRange: '30K-45K', location: '上海', experience: '5年以上', education: '本科', publishDate: '2026-01-28', viewCount: 234, resumeCount: 42, isFollowing: true, followStatus: 'paused', todayGreetings: 0, todayResumes: 0, totalResumes: 42 },
  { id: 4, jobName: '网络安全工程师', salaryRange: '25K-40K', location: '上海', experience: '3-5年', education: '本科', publishDate: '2026-01-25', viewCount: 87, resumeCount: 12, isFollowing: false },
  { id: 5, jobName: 'UI设计师', salaryRange: '15K-25K', location: '上海', experience: '2-3年', education: '大专', publishDate: '2026-02-03', viewCount: 145, resumeCount: 31, isFollowing: false },
  { id: 6, jobName: '测试工程师', salaryRange: '18K-28K', location: '上海', experience: '2-4年', education: '本科', publishDate: '2026-01-30', viewCount: 76, resumeCount: 18, isFollowing: false },
  { id: 7, jobName: '数据分析师', salaryRange: '20K-30K', location: '上海', experience: '2-4年', education: '本科', publishDate: '2025-09-15', viewCount: 312, resumeCount: 67, isFollowing: false, jobStatus: 'closed', closedDate: '2025-12-20', totalResumes: 67 },
  { id: 8, jobName: '运维工程师', salaryRange: '18K-25K', location: '上海', experience: '3-5年', education: '本科', publishDate: '2025-08-01', viewCount: 198, resumeCount: 34, isFollowing: false, jobStatus: 'closed', closedDate: '2025-11-10', totalResumes: 34 },
  { id: 9, jobName: 'Go后端开发', salaryRange: '25K-40K', location: '上海', experience: '3-5年', education: '本科', publishDate: '2025-10-10', viewCount: 256, resumeCount: 51, isFollowing: false, jobStatus: 'closed', closedDate: '2026-01-05', totalResumes: 51 },
];

export const mockResumes: Resume[] = [
  { id: 1, name: '张三', position: 'Java开发', experience: '3年', education: '本科', matchScore: 92, status: 'pending', salary: '20-25K', company: '某互联网公司', lastActive: '2小时前' },
  { id: 2, name: '李四', position: 'Java开发', experience: '5年', education: '硕士', matchScore: 88, status: 'collected', salary: '25-35K', company: '某科技公司', lastActive: '1小时前' },
  { id: 3, name: '王五', position: 'Java开发', experience: '2年', education: '本科', matchScore: 75, status: 'pending', salary: '15-20K', company: '某创业公司', lastActive: '30分钟前' },
  { id: 4, name: '赵六', position: 'Java开发', experience: '4年', education: '本科', matchScore: 85, status: 'interview', salary: '22-28K', company: '某金融公司', lastActive: '3小时前' },
  { id: 5, name: '钱七', position: 'Java开发', experience: '1年', education: '大专', matchScore: 62, status: 'rejected', salary: '10-15K', company: '某外包公司', lastActive: '1天前' },
  { id: 6, name: '孙八', position: 'Java开发', experience: '6年', education: '本科', matchScore: 91, status: 'pending', salary: '28-38K', company: '某大厂', lastActive: '15分钟前' },
  { id: 7, name: '周九', position: 'Java开发', experience: '3年', education: '本科', matchScore: 78, status: 'collected', salary: '18-25K', company: '某电商公司', lastActive: '4小时前' },
  { id: 8, name: '吴十', position: 'Java开发', experience: '4年', education: '硕士', matchScore: 86, status: 'pending', salary: '25-32K', company: '某游戏公司', lastActive: '2小时前' },
];

export const mockHistoricalResumes: Resume[] = [
  { id: 101, name: '陈伟', position: '数据分析师', experience: '3年', education: '硕士', matchScore: 90, status: 'collected', salary: '22-28K', company: '某数据公司', lastActive: '2025-12-18' },
  { id: 102, name: '林芳', position: '运维工程师', experience: '4年', education: '本科', matchScore: 82, status: 'interview', salary: '20-25K', company: '某云计算公司', lastActive: '2025-11-08' },
  { id: 103, name: '黄磊', position: 'Go后端开发', experience: '5年', education: '本科', matchScore: 87, status: 'collected', salary: '30-40K', company: '某金融科技公司', lastActive: '2026-01-03' },
  { id: 104, name: '杨洁', position: '数据分析师', experience: '2年', education: '本科', matchScore: 71, status: 'rejected', salary: '15-20K', company: '某咨询公司', lastActive: '2025-12-15' },
];

export const recentTools: RecentTool[] = [
  { icon: UserCheck, label: 'Boss招聘', route: 'boss-recruit' },
  { icon: FileUser, label: '简历分析', route: 'resume-analysis-form' },
  { icon: DollarSign, label: '薪酬调查', route: 'salary-survey-form' },
];

export const features: string[] = [
  'Boss直聘账号一键授权',
  '自动同步已发布岗位信息',
  '批量开启智能招聘关注',
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
  hourlyLimit: 20,
  minInterval: 30,
  maxInterval: 120,
  errorHandling: 'pause',
  enabled: true,
};

// Mock Boss accounts
export const mockAccounts: BossAccount[] = [
  {
    id: 'acc-001',
    name: '张招聘',
    company: 'XX科技有限公司',
    avatar: '',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    status: 'active',
    followingCount: 3,
    todayResumes: 12,
  },
  {
    id: 'acc-002',
    name: '李HR',
    company: 'YY集团',
    avatar: '',
    expiresAt: '',
    status: 'expired',
    followingCount: 5,
    todayResumes: 0,
  },
];
