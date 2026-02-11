import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';
import AiQnaView from '../components/AiQnaView.vue';
import AgentsView from '../components/AgentsView.vue';
import EnterpriseSearchView from '../components/EnterpriseSearchView.vue';
import TeamManageView from '../components/TeamManageView.vue';
import TeamOverviewView from '../components/TeamOverviewView.vue';
import BidSubscription from '../components/BidSubscription.vue';
import SalesStrategyConfig from '../components/SalesStrategyConfig.vue';

// 素材库模块
import CompanyInfoView from '../components/CompanyInfoView.vue';
import CertificateManageView from '../components/CertificateManageView.vue';
import TeamMemberView from '../components/TeamMemberView.vue';
import ProjectCaseView from '../components/ProjectCaseView.vue';
import AssetUploadView from '../components/assets/AssetUploadView.vue';

// HR模块
import BossRecruitFormView from '../components/boss-recruit/BossRecruitFormView.vue';
import BossRecruitWorkbench from '../components/boss-recruit/BossRecruitWorkbench.vue';
import ResumeAnalysisFormView from '../components/resume-analysis/ResumeAnalysisFormView.vue';
import ResumeAnalysisResultView from '../components/ResumeAnalysisResultView.vue';
import SalarySurveyFormView from '../components/salary-survey/SalarySurveyFormView.vue';
import SalarySurveyResultView from '../components/SalarySurveyResultView.vue';

// 投标模块
import BidInfoFormView from '../components/BidInfoFormView.vue';
import BidInfoDailyView from '../components/bid-info-daily/BidInfoDailyView.vue';
import BidAnalysisFormView from '../components/BidAnalysisFormView.vue';
import BidAnalysisResultView from '../components/bid-analysis-result/BidAnalysisResultView.vue';
import BidDocFormView from '../components/bid-doc-form/BidDocFormView.vue';
import BidDocSmartFormView from '../components/bid-doc-smart/BidDocSmartFormView.vue';
import BidDocOneclickFormView from '../components/bid-doc-oneclick/BidDocOneclickFormView.vue';
import BidDocGeneratingView from '../components/BidDocGeneratingView.vue';
import BidDocResultView from '../components/BidDocResultView.vue';
import BidDocSkeletonView from '../components/bid-doc-skeleton/BidDocSkeletonView.vue';
import BidDetailView from '../components/BidDetailView.vue';
import BidDailyReportView from '../components/bid-daily-report/BidDailyReportView.vue';
import BidSubscriptionView from '../components/bid-subscription/BidSubscriptionView.vue';
import CompetitionAnalysisView from '../components/competition-analysis/CompetitionAnalysisView.vue';
import CompetitionReportView from '../components/competition-analysis/CompetitionReportView.vue';
import BidIndustryReportView from '../components/bid-industry-report/BidIndustryReportView.vue';
import BidListDetailView from '../components/BidListDetailView.vue';
import KnowledgeBaseView from '../components/KnowledgeBaseView.vue';
import EnterpriseMaterialView from '../components/enterprise-material/EnterpriseMaterialView.vue';

// 合同模块
import ContractCompareResultView from '../components/contract-compare/ContractCompareResultView.vue';
import ContractReviewResultView from '../components/contract-review/ContractReviewResultView.vue';

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
    component: KnowledgeBaseView,
    meta: { title: '知识库' }
  },
  {
    path: '/enterprise-material',
    name: 'enterprise-material',
    component: EnterpriseMaterialView,
    meta: { title: '企业素材库' }
  },
  {
    path: '/enterprise-search',
    name: 'enterprise-search',
    component: EnterpriseSearchView,
    meta: { title: '标讯搜索' }
  },

  // HR助手模块
  {
    path: '/hr/boss-recruit',
    name: 'boss-recruit',
    component: BossRecruitFormView,
    meta: { title: 'Boss直聘招聘' }
  },
  {
    path: '/hr/boss-recruit/workbench',
    name: 'boss-recruit-workbench',
    component: BossRecruitWorkbench,
    meta: { title: 'Boss招聘工作台', fullScreen: true }
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
    meta: { title: '简历分析结果', fullScreen: true }
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
    meta: { title: '薪酬调查结果', fullScreen: true }
  },

  // 投标助手模块
  {
    path: '/bid/center',
    redirect: '/enterprise-search'
  },
  {
    path: '/bid/info',
    name: 'bid-info-form',
    redirect: { name: 'team-bid-subscription' }
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
    meta: { title: 'AI标书生成（表单版）' }
  },
  {
    path: '/bid/doc/smart',
    name: 'bid-doc-smart-form',
    component: BidDocSmartFormView,
    meta: { title: 'AI标书生成' }
  },
  {
    path: '/bid/doc/oneclick',
    name: 'bid-doc-oneclick-form',
    component: BidDocOneclickFormView,
    meta: { title: 'AI标书生成（一键版）' }
  },
  {
    path: '/bid/doc/generating',
    name: 'bid-doc-generating',
    component: BidDocGeneratingView,
    meta: { title: 'AI标书生成中' }
  },
  {
    path: '/bid/doc/skeleton',
    name: 'bid-doc-skeleton',
    component: BidDocSkeletonView,
    meta: { title: '标书骨架预览' }
  },
  {
    path: '/bid/doc/result',
    name: 'bid-doc-result',
    component: BidDocResultView,
    meta: { title: '标书预览' }
  },
  {
    path: '/bid/detail',
    name: 'bid-detail',
    component: BidDetailView,
    meta: { title: '标讯详情' }
  },
  {
    path: '/bid/daily-report',
    name: 'bid-daily-report',
    component: BidDailyReportView,
    meta: { title: '每日标讯报告', fullScreen: true }
  },
  {
    path: '/bid/subscription',
    name: 'bid-subscription',
    component: BidSubscriptionView,
    meta: { title: '标讯订阅' }
  },
  {
    path: '/bid/list-detail',
    name: 'bid-list-detail',
    component: BidListDetailView,
    meta: { title: '标讯列表', fullScreen: true }
  },
  {
    path: '/bid/industry-report',
    name: 'bid-industry-report',
    component: BidIndustryReportView,
    meta: { title: '行业分析报告', fullScreen: true }
  },
  {
    path: '/bid/competition-analysis',
    name: 'competition-analysis',
    component: CompetitionAnalysisView,
    meta: { title: '销售策略分析' }
  },
  {
    path: '/bid/competition-analysis/report',
    name: 'competition-report',
    component: CompetitionReportView,
    meta: { title: '销售策略分析报告', fullScreen: true }
  },

  // 合同模块
  {
    path: '/contract/compare/result',
    name: 'contract-compare-result',
    component: ContractCompareResultView,
    meta: { title: '合同对比结果', fullScreen: true }
  },
  {
    path: '/contract/review/result',
    name: 'contract-review-result',
    component: ContractReviewResultView,
    meta: { title: '合同审查结果', fullScreen: true }
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
  {
    path: '/material/upload',
    name: 'asset-upload',
    component: AssetUploadView,
    meta: { title: '添加素材' }
  },

  // 系统管理
  {
    path: '/team',
    component: TeamManageView,
    meta: { title: '团队管理' },
    redirect: { name: 'team-overview' },
    children: [
      { path: '', name: 'team-overview', component: TeamOverviewView, meta: { title: '团队概览' } },
      { path: 'members', name: 'team-members', component: PlaceholderView, meta: { title: '成员管理' } },
      { path: 'groups', name: 'team-groups', component: PlaceholderView, meta: { title: '小组管理' } },
      { path: 'agents', name: 'team-agents', component: PlaceholderView, meta: { title: '智能体管理' } },
      { path: 'benefits', name: 'team-benefits', component: PlaceholderView, meta: { title: '权益明细' } },
      { path: 'bid-subscription', name: 'team-bid-subscription', component: BidSubscription, meta: { title: '标讯订阅' } },
      { path: 'enterprise-library', name: 'team-enterprise-library', component: SalesStrategyConfig, meta: { title: '企业总库' } },
    ]
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
