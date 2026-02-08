// Salary survey form mock data

export const jobCategories = [
  { value: 'tech', label: '技术研发' },
  { value: 'product', label: '产品设计' },
  { value: 'operation', label: '运营推广' },
  { value: 'sales', label: '销售商务' },
  { value: 'hr', label: '人力资源' },
  { value: 'finance', label: '财务审计' },
  { value: 'admin', label: '行政管理' },
  { value: 'legal', label: '法务合规' },
];

export const provinces = [
  '北京', '上海', '广东', '深圳', '江苏', '浙江', '四川', '湖北',
  '山东', '河南', '湖南', '福建', '安徽', '陕西', '辽宁', '天津',
  '重庆', '河北', '云南', '广西', '贵州', '江西', '黑龙江', '吉林',
  '山西', '内蒙古', '新疆', '甘肃', '海南', '宁夏', '青海', '西藏',
];

export const salaryBasisOptions = [
  { value: 'before_tax', label: '税前' },
  { value: 'after_tax', label: '税后' },
];

export const salaryTypeOptions = [
  { value: 'monthly', label: '月薪' },
  { value: 'yearly', label: '年包' },
];

export const tenureOptions = [
  { value: '0-1', label: '1年以内' },
  { value: '1-3', label: '1-3年' },
  { value: '3-5', label: '3-5年' },
  { value: '5-10', label: '5-10年' },
  { value: '10+', label: '10年以上' },
];

export interface EmployeeEntry {
  id: number;
  name: string;
  salary: number;
  tenure: string;
}

export const defaultEmployees: EmployeeEntry[] = [
  { id: 1, name: '员工A', salary: 12000, tenure: '1-3' },
  { id: 2, name: '员工B', salary: 22000, tenure: '3-5' },
  { id: 3, name: '员工C', salary: 38000, tenure: '5-10' },
  { id: 4, name: '员工D', salary: 45000, tenure: '10+' },
];

export const recentTools = [
  { label: 'Boss招聘', route: 'boss-recruit-form' },
  { label: '简历分析', route: 'resume-analysis-form' },
  { label: '薪酬调查', route: 'salary-survey-form' },
];

export const features = [
  '全网薪酬数据智能采集',
  '多维度薪酬分布分析',
  'P25/P50/P75/P90分位值对标',
  '地区薪酬差异对比',
  '风险提示与调整建议',
  '一键导出分析报告',
];
