import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';
import AiQnaView from '../components/AiQnaView.vue';
import AgentsView from '../components/AgentsView.vue';
import EnterpriseSearchView from '../components/EnterpriseSearchView.vue';

// 素材库模块
import CompanyInfoView from '../components/CompanyInfoView.vue';
import CertificateManageView from '../components/CertificateManageView.vue';
import TeamMemberView from '../components/TeamMemberView.vue';
import ProjectCaseView from '../components/ProjectCaseView.vue';

// HR模块
import BossRecruitFormView from '../components/BossRecruitFormView.vue';
import BossRecruitResultView from '../components/BossRecruitResultView.vue';
import ResumeAnalysisFormView from '../components/ResumeAnalysisFormView.vue';
import ResumeAnalysisResultView from '../components/ResumeAnalysisResultView.vue';
import SalarySurveyFormView from '../components/SalarySurveyFormView.vue';
import SalarySurveyResultView from '../components/SalarySurveyResultView.vue';

// 投标模块
import BidCenterView from '../components/BidCenterView.vue';
import BidInfoFormView from '../components/BidInfoFormView.vue';
import BidInfoDailyView from '../components/BidInfoDailyView.vue';
import BidAnalysisFormView from '../components/BidAnalysisFormView.vue';
import BidAnalysisResultView from '../components/BidAnalysisResultView.vue';
import BidDocFormView from '../components/BidDocFormView.vue';
import BidDocResultView from '../components/BidDocResultView.vue';

// Placeholder views - can be replaced with actual components later
const PlaceholderView = {
  template: `
    <div class="placeholder-view" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">{{ $route.meta.title }}</h1>
      <p>此页面正在建设中...</p>
    </div>
  `,
};

const routes = [
  // 基础页面
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' }
  },
  {
    path: '/chat',
    name: 'chat',
    component: AiQnaView,
    meta: { title: 'AI对话' }
  },
  {
    path: '/agents',
    name: 'agents',
    component: AgentsView,
    meta: { title: '智能体' }
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: PlaceholderView,
    meta: { title: '知识库' }
  },
  {
    path: '/enterprise-search',
    name: 'enterprise-search',
    component: EnterpriseSearchView,
    meta: { title: '企业搜索' }
  },

  // HR助手模块
  {
    path: '/hr/boss-recruit',
    name: 'boss-recruit-form',
    component: BossRecruitFormView,
    meta: { title: 'Boss直聘招聘' }
  },
  {
    path: '/hr/boss-recruit/result',
    name: 'boss-recruit-result',
    component: BossRecruitResultView,
    meta: { title: 'Boss直聘招聘结果' }
  },
  {
    path: '/hr/resume-analysis',
    name: 'resume-analysis-form',
    component: ResumeAnalysisFormView,
    meta: { title: '简历分析' }
  },
  {
    path: '/hr/resume-analysis/result',
    name: 'resume-analysis-result',
    component: ResumeAnalysisResultView,
    meta: { title: '简历分析结果' }
  },
  {
    path: '/hr/salary-survey',
    name: 'salary-survey-form',
    component: SalarySurveyFormView,
    meta: { title: '薪酬调查' }
  },
  {
    path: '/hr/salary-survey/result',
    name: 'salary-survey-result',
    component: SalarySurveyResultView,
    meta: { title: '薪酬调查结果' }
  },

  // 投标助手模块
  {
    path: '/bid/center',
    name: 'bid-center',
    component: BidCenterView,
    meta: { title: '标讯中心' }
  },
  {
    path: '/bid/info',
    name: 'bid-info-form',
    component: BidInfoFormView,
    meta: { title: '标讯订阅' }
  },
  {
    path: '/bid/info/daily',
    name: 'bid-info-daily',
    component: BidInfoDailyView,
    meta: { title: '标讯日报' }
  },
  {
    path: '/bid/analysis',
    name: 'bid-analysis-form',
    component: BidAnalysisFormView,
    meta: { title: '标讯解读' }
  },
  {
    path: '/bid/analysis/result',
    name: 'bid-analysis-result',
    component: BidAnalysisResultView,
    meta: { title: '标讯解读结果' }
  },
  {
    path: '/bid/doc',
    name: 'bid-doc-form',
    component: BidDocFormView,
    meta: { title: '标书生成' }
  },
  {
    path: '/bid/doc/result',
    name: 'bid-doc-result',
    component: BidDocResultView,
    meta: { title: '标书预览' }
  },

  // 素材库模块
  {
    path: '/material/company',
    name: 'company-info',
    component: CompanyInfoView,
    meta: { title: '企业信息' }
  },
  {
    path: '/material/certificate',
    name: 'certificate-manage',
    component: CertificateManageView,
    meta: { title: '资质证书' }
  },
  {
    path: '/material/team',
    name: 'team-member',
    component: TeamMemberView,
    meta: { title: '项目团队' }
  },
  {
    path: '/material/case',
    name: 'project-case',
    component: ProjectCaseView,
    meta: { title: '业绩案例' }
  },

  // 系统管理
  {
    path: '/team',
    name: 'team',
    component: PlaceholderView,
    meta: { title: '团队管理' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: PlaceholderView,
    meta: { title: '个人中心' }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
