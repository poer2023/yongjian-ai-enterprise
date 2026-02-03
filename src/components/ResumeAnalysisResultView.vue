<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  FileUser,
  Download,
  BookPlus,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  FileText,
  Star
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Multiple resumes support
const resumes = ref([
  { id: 1, name: '张三_Java开发工程师.pdf', active: true },
  { id: 2, name: '李四_前端开发.pdf', active: false },
  { id: 3, name: '王五_项目经理.docx', active: false },
]);

const activeResumeId = ref(1);

const selectResume = (id: number) => {
  activeResumeId.value = id;
  resumes.value.forEach(r => r.active = r.id === id);
};

// Mock analysis data
const candidateInfo = {
  name: '张三',
  gender: '男',
  age: 28,
  phone: '138****5678',
  email: 'zhang***@email.com',
  location: '南京',
  experience: '5年',
  education: '本科',
  expectedSalary: '18-22K',
  availableDate: '一周内到岗',
};

const matchScore = 85;
const matchLevel = computed(() => {
  if (matchScore >= 80) return { text: '高度匹配', class: 'high' };
  if (matchScore >= 60) return { text: '较为匹配', class: 'medium' };
  return { text: '匹配度低', class: 'low' };
});

const matchDetails = [
  { dimension: '学历要求', requirement: '本科及以上', actual: '本科 - 南京大学', match: true, score: 100 },
  { dimension: '工作年限', requirement: '3-5年', actual: '5年', match: true, score: 100 },
  { dimension: '核心技能', requirement: 'Java/Spring', actual: 'Java、Spring Boot、MySQL', match: true, score: 90 },
  { dimension: '行业经验', requirement: '软件/互联网', actual: '金融科技', match: true, score: 85 },
  { dimension: '证书要求', requirement: '等保测评师', actual: '无相关证书', match: false, score: 0 },
];

const educationList = [
  { school: '南京大学', major: '软件工程', degree: '本科', period: '2014.09 - 2018.06' },
];

const experienceList = [
  {
    company: '某金融科技公司',
    position: 'Java高级开发工程师',
    period: '2021.03 - 至今',
    description: '负责核心交易系统开发，带领3人小组完成支付网关重构，系统吞吐量提升200%',
  },
  {
    company: '某互联网公司',
    position: 'Java开发工程师',
    period: '2018.07 - 2021.02',
    description: '参与电商后台系统开发，独立完成订单管理模块，日处理订单10万+',
  },
];

const skillsEvaluation = [
  { skill: 'Java', level: 'expert', score: 95, comment: '熟练掌握Java核心技术及JVM调优' },
  { skill: 'Spring Boot', level: 'expert', score: 90, comment: '丰富的微服务架构经验' },
  { skill: 'MySQL', level: 'advanced', score: 85, comment: '良好的SQL优化能力' },
  { skill: '系统设计', level: 'advanced', score: 80, comment: '具备中大型系统设计能力' },
  { skill: '等保测评', level: 'beginner', score: 20, comment: '无相关经验，需培训' },
];

const interviewQuestions = [
  {
    category: '技术能力',
    questions: [
      { q: '请描述一次你进行JVM调优的经历，遇到了什么问题，如何解决的？', purpose: '验证JVM调优实战能力' },
      { q: '在支付网关重构中，你是如何保证系统的高可用性的？', purpose: '考察系统设计能力' },
    ]
  },
  {
    category: '项目经验',
    questions: [
      { q: '你在带领团队时遇到过什么困难？如何协调团队成员？', purpose: '了解管理经验和沟通能力' },
      { q: '订单管理模块中如何处理高并发场景？', purpose: '验证高并发处理经验' },
    ]
  },
  {
    category: '岗位匹配',
    questions: [
      { q: '你对等保测评行业有了解吗？为什么想加入这个领域？', purpose: '了解行业认知和动机' },
      { q: '如果需要学习等保相关知识，你的学习计划是什么？', purpose: '评估学习能力和态度' },
    ]
  },
];

const summary = {
  recommendation: 'A',
  highlights: [
    'Java技术栈扎实，有大型系统开发经验',
    '具备团队管理经验，沟通能力强',
    '有金融行业背景，对合规要求有一定认识',
    '期望薪资在预算范围内',
  ],
  risks: [
    '无等保测评相关证书和经验，需要培训',
    '金融科技与等保测评业务有差异，需适应期',
  ],
  nextSteps: [
    '安排技术面试，重点考察系统设计能力',
    '了解候选人对等保行业的学习意愿',
    '核实过往项目的具体贡献',
  ],
};

const goBack = () => {
  router.push({ name: 'resume-analysis-form' });
};

const handleExport = () => {
  alert('导出分析报告');
};

const handleAddToKnowledge = () => {
  alert('已添加到知识库');
};
</script>

<template>
  <div class="result-page">
    <!-- Top Header Bar -->
    <header class="top-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
        </button>
        <span class="file-name">简历分析报告</span>
      </div>
      <div class="header-actions">
        <button class="action-btn primary" @click="handleExport">
          <Download :size="16" />
          <span>导出报告</span>
        </button>
        <button class="action-btn secondary" @click="handleAddToKnowledge">
          <BookPlus :size="16" />
          <span>加入知识库</span>
        </button>
      </div>
    </header>

    <div class="content-wrapper">
      <!-- Left Sidebar: File List -->
      <aside class="left-sidebar">
        <div class="file-list">
          <div
            v-for="resume in resumes"
            :key="resume.id"
            class="file-item"
            :class="{ active: resume.id === activeResumeId }"
            @click="selectResume(resume.id)"
          >
            <FileUser :size="16" />
            <span class="file-item-name">{{ resume.name }}</span>
          </div>
        </div>
      </aside>

      <!-- Main Content: Report -->
      <main class="main-content">
        <div class="report-container">
          <div class="report-meta">
            分析时间：2026-02-03 14:30 | 目标岗位：项目经理
          </div>

          <!-- Section 1: Basic Info -->
          <section id="basic" class="report-section">
            <h2 class="section-title">
              <User :size="18" />
              一、基本信息
            </h2>
            <table class="info-table">
              <tbody>
                <tr>
                  <td class="label">姓名</td>
                  <td>{{ candidateInfo.name }}</td>
                  <td class="label">性别</td>
                  <td>{{ candidateInfo.gender }}</td>
                  <td class="label">年龄</td>
                  <td>{{ candidateInfo.age }}岁</td>
                </tr>
                <tr>
                  <td class="label">联系电话</td>
                  <td>{{ candidateInfo.phone }}</td>
                  <td class="label">邮箱</td>
                  <td colspan="3">{{ candidateInfo.email }}</td>
                </tr>
                <tr>
                  <td class="label">所在城市</td>
                  <td>{{ candidateInfo.location }}</td>
                  <td class="label">工作年限</td>
                  <td>{{ candidateInfo.experience }}</td>
                  <td class="label">学历</td>
                  <td>{{ candidateInfo.education }}</td>
                </tr>
                <tr>
                  <td class="label">期望薪资</td>
                  <td>{{ candidateInfo.expectedSalary }}</td>
                  <td class="label">到岗时间</td>
                  <td colspan="3">{{ candidateInfo.availableDate }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 2: Match Analysis -->
          <section id="match" class="report-section">
            <h2 class="section-title">
              <Star :size="18" />
              二、匹配度分析
            </h2>
            <div class="match-overview">
              <div class="match-score-box" :class="matchLevel.class">
                <div class="score-number">{{ matchScore }}</div>
                <div class="score-label">{{ matchLevel.text }}</div>
              </div>
              <div class="match-summary">
                <p>该候选人与目标岗位 <strong>高度匹配</strong>，核心技能满足要求，具备丰富的项目经验和团队管理能力。主要差距在于缺乏等保测评相关证书，建议录用后安排专项培训。</p>
              </div>
            </div>

            <table class="match-table">
              <thead>
                <tr>
                  <th>评估维度</th>
                  <th>岗位要求</th>
                  <th>候选人情况</th>
                  <th>匹配度</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in matchDetails" :key="item.dimension">
                  <td>{{ item.dimension }}</td>
                  <td>{{ item.requirement }}</td>
                  <td>{{ item.actual }}</td>
                  <td>
                    <span class="match-badge" :class="item.match ? 'success' : 'warning'">
                      <CheckCircle v-if="item.match" :size="14" />
                      <AlertCircle v-else :size="14" />
                      {{ item.score }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 3: Education -->
          <section id="education" class="report-section">
            <h2 class="section-title">
              <GraduationCap :size="18" />
              三、教育背景
            </h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>院校</th>
                  <th>专业</th>
                  <th>学历</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="edu in educationList" :key="edu.school">
                  <td>{{ edu.school }}</td>
                  <td>{{ edu.major }}</td>
                  <td>{{ edu.degree }}</td>
                  <td>{{ edu.period }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 4: Work Experience -->
          <section id="experience" class="report-section">
            <h2 class="section-title">
              <Briefcase :size="18" />
              四、工作经历
            </h2>
            <div class="experience-list">
              <div v-for="exp in experienceList" :key="exp.company" class="experience-item">
                <div class="exp-header">
                  <span class="exp-company">{{ exp.company }}</span>
                  <span class="exp-period">{{ exp.period }}</span>
                </div>
                <div class="exp-position">{{ exp.position }}</div>
                <div class="exp-desc">{{ exp.description }}</div>
              </div>
            </div>
          </section>

          <!-- Section 5: Skills -->
          <section id="skills" class="report-section">
            <h2 class="section-title">
              <Award :size="18" />
              五、技能评估
            </h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>技能项</th>
                  <th>水平</th>
                  <th>评分</th>
                  <th>评价</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="skill in skillsEvaluation" :key="skill.skill">
                  <td>{{ skill.skill }}</td>
                  <td>
                    <span class="level-badge" :class="skill.level">
                      {{ skill.level === 'expert' ? '精通' : skill.level === 'advanced' ? '熟练' : '初级' }}
                    </span>
                  </td>
                  <td>
                    <div class="score-bar">
                      <div class="score-fill" :style="{ width: skill.score + '%' }"></div>
                      <span class="score-text">{{ skill.score }}</span>
                    </div>
                  </td>
                  <td>{{ skill.comment }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 6: Interview Questions -->
          <section id="interview" class="report-section">
            <h2 class="section-title">
              <MessageSquare :size="18" />
              六、面试问题建议
            </h2>
            <div v-for="cat in interviewQuestions" :key="cat.category" class="question-category">
              <h3 class="category-title">{{ cat.category }}</h3>
              <div v-for="(item, index) in cat.questions" :key="index" class="question-item">
                <div class="question-text">
                  <span class="q-number">Q{{ index + 1 }}.</span>
                  {{ item.q }}
                </div>
                <div class="question-purpose">考察目的：{{ item.purpose }}</div>
              </div>
            </div>
          </section>

          <!-- Section 7: Summary -->
          <section id="summary" class="report-section">
            <h2 class="section-title">
              <FileText :size="18" />
              七、综合建议
            </h2>
            <div class="summary-box">
              <div class="recommendation-badge" :class="'level-' + summary.recommendation">
                推荐等级：{{ summary.recommendation }}
              </div>

              <div class="summary-section">
                <h4>候选人亮点</h4>
                <ul>
                  <li v-for="(item, index) in summary.highlights" :key="index">{{ item }}</li>
                </ul>
              </div>

              <div class="summary-section">
                <h4>风险提示</h4>
                <ul>
                  <li v-for="(item, index) in summary.risks" :key="index">{{ item }}</li>
                </ul>
              </div>

              <div class="summary-section">
                <h4>下一步建议</h4>
                <ol>
                  <li v-for="(item, index) in summary.nextSteps" :key="index">{{ item }}</li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

/* Top Header */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.file-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #2563eb;
  border: none;
  color: white;
}

.action-btn.primary:hover {
  background: #1d4ed8;
}

.action-btn.secondary {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.action-btn.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Content Wrapper */
.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Sidebar */
.left-sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 16px;
  flex-shrink: 0;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.file-item:hover {
  background: #f8fafc;
}

.file-item.active {
  background: #eff6ff;
  color: #2563eb;
}

.file-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.report-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 32px 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.report-meta {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

/* Report Sections */
.report-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.report-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #2563eb;
}

/* Tables */
.info-table,
.match-table,
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.info-table td,
.match-table th,
.match-table td,
.data-table th,
.data-table td {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
}

.info-table .label {
  background: #f8fafc;
  color: #64748b;
  font-weight: 500;
  width: 90px;
}

.match-table th,
.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-align: left;
}

/* Match Analysis */
.match-overview {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
}

.match-score-box {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.match-score-box.high {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.match-score-box.medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.match-score-box.low {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.score-number {
  font-size: 28px;
  font-weight: 700;
}

.score-label {
  font-size: 12px;
}

.match-summary {
  flex: 1;
  display: flex;
  align-items: center;
}

.match-summary p {
  margin: 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
}

.match-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.match-badge.success {
  background: #dcfce7;
  color: #16a34a;
}

.match-badge.warning {
  background: #fef3c7;
  color: #d97706;
}

/* Experience */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.experience-item {
  padding: 14px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #2563eb;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.exp-company {
  font-weight: 600;
  color: #1e293b;
}

.exp-period {
  font-size: 13px;
  color: #64748b;
}

.exp-position {
  font-size: 14px;
  color: #2563eb;
  margin-bottom: 6px;
}

.exp-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
}

/* Skills */
.level-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.level-badge.expert {
  background: #dbeafe;
  color: #2563eb;
}

.level-badge.advanced {
  background: #dcfce7;
  color: #16a34a;
}

.level-badge.beginner {
  background: #fef3c7;
  color: #d97706;
}

.score-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-fill {
  height: 6px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 3px;
  min-width: 20px;
}

.score-text {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

/* Interview Questions */
.question-category {
  margin-bottom: 20px;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 10px 0;
  padding-left: 10px;
  border-left: 3px solid #2563eb;
}

.question-item {
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;
}

.question-text {
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 4px;
}

.q-number {
  font-weight: 600;
  color: #2563eb;
}

.question-purpose {
  font-size: 13px;
  color: #64748b;
  font-style: italic;
}

/* Summary */
.summary-box {
  padding: 20px;
  background: #f8fafc;
  border-radius: 10px;
}

.recommendation-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.recommendation-badge.level-A {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.recommendation-badge.level-B {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.recommendation-badge.level-C {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.summary-section {
  margin-bottom: 16px;
}

.summary-section:last-child {
  margin-bottom: 0;
}

.summary-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 10px 0;
}

.summary-section ul,
.summary-section ol {
  margin: 0;
  padding-left: 20px;
}

.summary-section li {
  font-size: 14px;
  color: #475569;
  line-height: 1.7;
}
</style>
