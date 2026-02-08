// Mock data for ResumeAnalysisFormView

import { UserCheck, FileUser, DollarSign } from 'lucide-vue-next';
import type { JobDescription, RecentTool } from './types';

export const jdLibrary: JobDescription[] = [
  {
    id: 1,
    jobName: 'Java开发工程师',
    salaryRange: '25K-35K',
    location: '上海',
    education: '本科及以上',
    experience: '3-5年',
    skills: ['Java', 'Spring Boot', 'MySQL', '微服务'],
    createdAt: '2026-01-15',
    responsibilities: [
      '负责公司核心业务系统的后端开发与维护',
      '参与系统架构设计和技术方案评审',
      '编写高质量、可维护的代码，确保系统稳定性',
      '配合团队完成项目交付，解决技术难题'
    ],
    requirements: [
      '本科及以上学历，计算机相关专业',
      '3-5年Java后端开发经验',
      '熟练掌握Spring Boot、Spring Cloud等主流框架',
      '具备良好的沟通能力和团队协作精神'
    ],
    hardRequirements: [
      '本科及以上学历',
      '3年以上Java开发经验',
      '熟悉MySQL数据库'
    ],
    bonusPoints: [
      '有大型互联网公司工作经验',
      '熟悉Kubernetes、Docker容器技术',
      '有分布式系统开发经验'
    ]
  },
  {
    id: 2,
    jobName: '产品经理',
    salaryRange: '30K-45K',
    location: '上海',
    education: '本科及以上',
    experience: '5年以上',
    skills: ['需求分析', '产品规划', '数据分析', 'Axure'],
    createdAt: '2026-01-18',
    responsibilities: [
      '负责产品全生命周期管理，从规划到上线',
      '深入分析用户需求，输出产品需求文档',
      '协调开发、设计、测试团队推进项目',
      '持续优化产品，提升用户体验和业务指标'
    ],
    requirements: [
      '本科及以上学历，5年以上产品经验',
      '具备优秀的逻辑思维和数据分析能力',
      '熟练使用Axure、Figma等原型工具',
      '有B端或SaaS产品经验优先'
    ],
    hardRequirements: [
      '本科及以上学历',
      '5年以上产品经理经验',
      '有完整产品0-1经验'
    ],
    bonusPoints: [
      '有AI/大数据产品经验',
      'MBA或相关管理学历',
      '有创业经历'
    ]
  },
  {
    id: 3,
    jobName: '前端开发工程师',
    salaryRange: '20K-30K',
    location: '上海',
    education: '本科及以上',
    experience: '2-4年',
    skills: ['Vue.js', 'React', 'TypeScript', 'CSS'],
    createdAt: '2026-01-20',
    responsibilities: [
      '负责公司Web前端开发工作',
      '与UI设计师协作，实现高质量的界面效果',
      '优化前端性能，提升用户体验',
      '参与前端技术选型和架构设计'
    ],
    requirements: [
      '本科及以上学历，计算机相关专业',
      '2-4年前端开发经验',
      '精通Vue.js或React框架',
      '熟悉TypeScript、Webpack等工具'
    ],
    hardRequirements: [
      '本科及以上学历',
      '2年以上前端开发经验',
      '熟悉Vue.js或React'
    ],
    bonusPoints: [
      '有移动端H5开发经验',
      '了解Node.js后端开发',
      '有开源项目贡献经历'
    ]
  },
  {
    id: 4,
    jobName: '网络安全工程师',
    salaryRange: '25K-40K',
    location: '上海',
    education: '本科及以上',
    experience: '3-5年',
    skills: ['渗透测试', '安全审计', 'CISP', '等保测评'],
    createdAt: '2026-01-25',
    responsibilities: [
      '负责公司信息安全体系建设与维护',
      '执行渗透测试和安全漏洞扫描',
      '制定安全策略和应急响应预案',
      '协助完成等保测评和安全审计工作'
    ],
    requirements: [
      '本科及以上学历，信息安全相关专业',
      '3-5年网络安全工作经验',
      '熟悉常见安全攻防技术和工具',
      '持有CISP、CISSP等安全认证优先'
    ],
    hardRequirements: [
      '本科及以上学历',
      '3年以上安全从业经验',
      '熟悉等保2.0要求'
    ],
    bonusPoints: [
      '持有CISP/CISSP/OSCP证书',
      '有甲方安全建设经验',
      '有CTF竞赛获奖经历'
    ]
  },
  {
    id: 5,
    jobName: 'UI设计师',
    salaryRange: '15K-25K',
    location: '上海',
    education: '大专及以上',
    experience: '2-3年',
    skills: ['Figma', 'Sketch', '视觉设计', '交互设计'],
    createdAt: '2026-02-01',
    responsibilities: [
      '负责公司产品的UI视觉设计',
      '制定和维护设计规范和组件库',
      '与产品、开发团队紧密协作',
      '持续优化用户界面和交互体验'
    ],
    requirements: [
      '大专及以上学历，设计相关专业',
      '2-3年UI设计工作经验',
      '精通Figma、Sketch等设计工具',
      '具备良好的审美能力和创意思维'
    ],
    hardRequirements: [
      '大专及以上学历',
      '2年以上UI设计经验',
      '有完整作品集'
    ],
    bonusPoints: [
      '有B端产品设计经验',
      '熟悉前端开发基础',
      '有动效设计能力'
    ]
  }
];

export const recentTools: RecentTool[] = [
  { icon: UserCheck, label: 'Boss招聘', route: 'boss-recruit-form' },
  { icon: FileUser, label: '简历分析', route: 'resume-analysis-form' },
  { icon: DollarSign, label: '薪酬调查', route: 'salary-survey-form' },
];

export const features = [
  '智能解析简历关键信息',
  '岗位匹配度精准评估',
  '自动生成面试问题建议',
  '候选人优劣势深度分析',
  '多维度人才画像呈现',
];

export const educationOptions = ['大专及以上', '本科及以上', '硕士及以上', '博士及以上'];

export const experienceOptions = ['不限', '1年以下', '1-3年', '2-4年', '3-5年', '5年以上', '10年以上'];
