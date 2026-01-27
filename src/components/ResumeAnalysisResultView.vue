<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileUser,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Download,
  Share2
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 从路由获取参数
const position = route.query.position as string || '项目经理';
const fileName = route.query.file as string || '简历.pdf';

// 模拟的简历解析数据
const resumeData = ref({
  basicInfo: {
    name: '张三',
    age: 32,
    gender: '男',
    phone: '138****8888',
    email: 'zhangsan@example.com',
    location: '北京市朝阳区',
  },
  education: [
    {
      school: '北京理工大学',
      major: '计算机科学与技术',
      degree: '本科',
      period: '2010.09 - 2014.06',
    },
  ],
  experience: [
    {
      company: '某大型互联网公司',
      position: '高级项目经理',
      period: '2020.03 - 至今',
      description: '负责多个大型项目的管理工作，团队规模15-20人',
    },
    {
      company: '某科技公司',
      position: '项目经理',
      period: '2017.06 - 2020.02',
      description: '负责产品研发项目管理，成功交付10+个项目',
    },
    {
      company: '某软件公司',
      position: '技术主管',
      period: '2014.07 - 2017.05',
      description: '负责技术团队管理和项目开发',
    },
  ],
  skills: ['项目管理', 'Scrum', '团队管理', 'Java', 'Python', '需求分析'],
  certificates: ['PMP', '信息系统项目管理师（高级）'],
});

// AI分析结果
const analysisResult = ref({
  matchScore: 85,
  strengths: [
    { text: '工作经验符合要求', detail: '8年项目管理经验，超过岗位要求' },
    { text: '持有PMP证书', detail: '具备国际认可的项目管理认证' },
    { text: '有大型项目管理经验', detail: '曾管理15-20人规模团队' },
    { text: '具备技术背景', detail: '有技术主管经历，能与技术团队高效沟通' },
  ],
  weaknesses: [
    { text: '学历为本科', detail: '岗位优先考虑硕士及以上学历' },
    { text: '缺少网络安全行业背景', detail: '建议面试时深入了解安全领域认知' },
  ],
  interviewQuestions: [
    '请介绍一下您管理过的最大规模项目，包括团队规模、项目周期和主要成果',
    '您如何处理项目延期风险？请举一个具体的例子',
    '在跨部门协作中遇到资源冲突时，您通常如何解决？',
    '请描述一下您对敏捷开发方法论的理解和实践经验',
    '您如何激励团队成员，保持团队的高效运转？',
    '在您的职业生涯中，最具挑战性的项目是什么？您是如何克服困难的？',
    '您对网络安全行业有什么了解？为什么想加入这个领域？',
  ],
  recommendation: 'interview', // interview | backup | reject
  recommendationText: '建议面试',
  summary: '候选人具有丰富的项目管理经验和良好的技术背景，持有PMP等权威认证。虽然缺乏网络安全行业经验，但综合能力较强，建议安排面试进一步评估。',
});

const goBack = () => {
  router.push({ name: 'resume-analysis-form' });
};

const getRecommendationClass = (rec: string) => {
  switch (rec) {
    case 'interview': return 'rec-interview';
    case 'backup': return 'rec-backup';
    case 'reject': return 'rec-reject';
    default: return '';
  }
};
</script>

<template>
  <div class="result-page">
    <!-- Header -->
    <div class="result-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回</span>
      </button>
      <div class="header-title">
        <FileUser :size="20" />
        <h1>简历分析结果</h1>
        <span class="position-tag">{{ position }}</span>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary">
          <Share2 :size="16" />
          分享
        </button>
        <button class="action-btn primary">
          <Download :size="16" />
          导出报告
        </button>
      </div>
    </div>

    <div class="result-content">
      <!-- 左侧：简历预览 -->
      <div class="resume-panel">
        <div class="panel-header">
          <h2>简历内容</h2>
          <span class="file-name">{{ fileName }}</span>
        </div>
        <div class="resume-content">
          <!-- 基本信息 -->
          <div class="resume-section">
            <h3>基本信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">姓名</span>
                <span class="info-value">{{ resumeData.basicInfo.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">年龄</span>
                <span class="info-value">{{ resumeData.basicInfo.age }}岁</span>
              </div>
              <div class="info-item">
                <span class="info-label">性别</span>
                <span class="info-value">{{ resumeData.basicInfo.gender }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">电话</span>
                <span class="info-value">{{ resumeData.basicInfo.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">邮箱</span>
                <span class="info-value">{{ resumeData.basicInfo.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">所在地</span>
                <span class="info-value">{{ resumeData.basicInfo.location }}</span>
              </div>
            </div>
          </div>

          <!-- 教育背景 -->
          <div class="resume-section">
            <h3>教育背景</h3>
            <div v-for="(edu, index) in resumeData.education" :key="index" class="timeline-item">
              <div class="timeline-header">
                <span class="timeline-title">{{ edu.school }}</span>
                <span class="timeline-period">{{ edu.period }}</span>
              </div>
              <div class="timeline-subtitle">{{ edu.major }} · {{ edu.degree }}</div>
            </div>
          </div>

          <!-- 工作经历 -->
          <div class="resume-section">
            <h3>工作经历</h3>
            <div v-for="(exp, index) in resumeData.experience" :key="index" class="timeline-item">
              <div class="timeline-header">
                <span class="timeline-title">{{ exp.company }}</span>
                <span class="timeline-period">{{ exp.period }}</span>
              </div>
              <div class="timeline-subtitle">{{ exp.position }}</div>
              <p class="timeline-desc">{{ exp.description }}</p>
            </div>
          </div>

          <!-- 技能 -->
          <div class="resume-section">
            <h3>专业技能</h3>
            <div class="skill-tags">
              <span v-for="skill in resumeData.skills" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- 证书 -->
          <div class="resume-section">
            <h3>证书资质</h3>
            <div class="cert-list">
              <div v-for="cert in resumeData.certificates" :key="cert" class="cert-item">
                <CheckCircle :size="14" />
                {{ cert }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：AI分析报告 -->
      <div class="analysis-panel">
        <div class="panel-header">
          <h2>AI分析报告</h2>
        </div>
        <div class="analysis-content">
          <!-- 匹配度评分 -->
          <div class="score-section">
            <div class="score-circle" :class="{ high: analysisResult.matchScore >= 80 }">
              <span class="score-value">{{ analysisResult.matchScore }}</span>
              <span class="score-unit">分</span>
            </div>
            <div class="score-info">
              <div class="score-label">岗位匹配度</div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: analysisResult.matchScore + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- 优势分析 -->
          <div class="analysis-section">
            <h3 class="section-title success">
              <CheckCircle :size="16" />
              优势分析
            </h3>
            <ul class="analysis-list">
              <li v-for="(item, index) in analysisResult.strengths" :key="index">
                <div class="list-main">{{ item.text }}</div>
                <div class="list-detail">{{ item.detail }}</div>
              </li>
            </ul>
          </div>

          <!-- 不足之处 -->
          <div class="analysis-section">
            <h3 class="section-title warning">
              <AlertCircle :size="16" />
              不足之处
            </h3>
            <ul class="analysis-list">
              <li v-for="(item, index) in analysisResult.weaknesses" :key="index">
                <div class="list-main">{{ item.text }}</div>
                <div class="list-detail">{{ item.detail }}</div>
              </li>
            </ul>
          </div>

          <!-- 推荐面试问题 -->
          <div class="analysis-section">
            <h3 class="section-title info">
              <HelpCircle :size="16" />
              推荐面试问题
            </h3>
            <ol class="question-list">
              <li v-for="(question, index) in analysisResult.interviewQuestions" :key="index">
                {{ question }}
              </li>
            </ol>
          </div>

          <!-- 综合建议 -->
          <div class="recommendation-section">
            <div class="rec-badge" :class="getRecommendationClass(analysisResult.recommendation)">
              {{ analysisResult.recommendationText }}
            </div>
            <p class="rec-summary">{{ analysisResult.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #eff6ff;
  border: none;
  border-radius: 6px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dbeafe;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2563eb;
}

.header-title h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.position-tag {
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 13px;
  color: #64748b;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #2563eb;
  color: white;
}

.action-btn.primary:hover {
  background: #1e40af;
}

.action-btn.secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #f8fafc;
}

.result-content {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 24px;
  overflow: hidden;
}

.resume-panel {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.panel-header h2 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.file-name {
  font-size: 13px;
  color: #64748b;
}

.resume-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.resume-section {
  margin-bottom: 24px;
}

.resume-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #94a3b8;
}

.info-value {
  font-size: 14px;
  color: #334155;
}

.timeline-item {
  padding: 12px 0;
  border-bottom: 1px solid #f8fafc;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.timeline-period {
  font-size: 12px;
  color: #94a3b8;
}

.timeline-subtitle {
  font-size: 13px;
  color: #64748b;
}

.timeline-desc {
  font-size: 13px;
  color: #64748b;
  margin: 8px 0 0 0;
  line-height: 1.5;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 13px;
  color: #475569;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.cert-item svg {
  color: #22c55e;
}

.analysis-panel {
  width: 420px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.analysis-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.score-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

.score-circle {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.score-circle.high {
  border: 3px solid #22c55e;
}

.score-value {
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
}

.score-unit {
  font-size: 12px;
  color: #64748b;
}

.score-info {
  flex: 1;
}

.score-label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.score-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #2563eb);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.analysis-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.section-title.success {
  color: #16a34a;
}

.section-title.warning {
  color: #d97706;
}

.section-title.info {
  color: #2563eb;
}

.analysis-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.analysis-list li {
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;
}

.list-main {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 4px;
}

.list-detail {
  font-size: 13px;
  color: #64748b;
}

.question-list {
  padding-left: 20px;
  margin: 0;
}

.question-list li {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  padding: 6px 0;
}

.recommendation-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.rec-badge {
  display: inline-block;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.rec-interview {
  background: #dcfce7;
  color: #16a34a;
}

.rec-backup {
  background: #fef9c3;
  color: #ca8a04;
}

.rec-reject {
  background: #fee2e2;
  color: #dc2626;
}

.rec-summary {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}
</style>
