<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Star,
  XCircle,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// 任务状态
const taskStatus = ref<'running' | 'paused' | 'completed'>('running');

// 今日统计
const todayStats = ref({
  greetings: 45,
  resumes: 12,
  replyRate: 26.7,
});

// 风险提示
const riskWarning = ref('');

// 简历列表
const resumes = ref([
  {
    id: 1,
    name: '张三',
    position: 'Java开发',
    experience: '3年',
    education: '本科',
    matchScore: 92,
    status: 'pending',
    salary: '20-25K',
    company: '某互联网公司',
  },
  {
    id: 2,
    name: '李四',
    position: 'Java开发',
    experience: '5年',
    education: '硕士',
    matchScore: 88,
    status: 'pending',
    salary: '25-35K',
    company: '某科技公司',
  },
  {
    id: 3,
    name: '王五',
    position: 'Java开发',
    experience: '2年',
    education: '本科',
    matchScore: 75,
    status: 'pending',
    salary: '15-20K',
    company: '某创业公司',
  },
  {
    id: 4,
    name: '赵六',
    position: 'Java开发',
    experience: '4年',
    education: '本科',
    matchScore: 85,
    status: 'collected',
    salary: '22-28K',
    company: '某金融公司',
  },
  {
    id: 5,
    name: '钱七',
    position: 'Java开发',
    experience: '1年',
    education: '大专',
    matchScore: 62,
    status: 'rejected',
    salary: '10-15K',
    company: '某外包公司',
  },
]);

// AI推荐TOP5
const aiRecommendations = ref([
  {
    name: '张三',
    score: 92,
    summary: '3年Java开发经验，熟悉Spring全家桶，有大型项目经验，技术栈匹配度高',
  },
  {
    name: '李四',
    score: 88,
    summary: '硕士学历，5年经验，有团队管理经验，技术深度好，薪资期望略高',
  },
  {
    name: '赵六',
    score: 85,
    summary: '金融行业背景，4年经验，对高并发有实战经验，稳定性好',
  },
]);

const goBack = () => {
  router.push({ name: 'boss-recruit-form' });
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待处理';
    case 'collected': return '已收藏';
    case 'rejected': return '已淘汰';
    default: return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'status-pending';
    case 'collected': return 'status-collected';
    case 'rejected': return 'status-rejected';
    default: return '';
  }
};

const getScoreClass = (score: number) => {
  if (score >= 85) return 'score-high';
  if (score >= 70) return 'score-medium';
  return 'score-low';
};

const handleView = (resume: any) => {
  console.log('查看简历:', resume);
};

const handleCollect = (resume: any) => {
  resume.status = 'collected';
};

const handleReject = (resume: any) => {
  resume.status = 'rejected';
};

const toggleTask = () => {
  taskStatus.value = taskStatus.value === 'running' ? 'paused' : 'running';
};
</script>

<template>
  <div class="result-page">
    <!-- Header -->
    <div class="result-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回配置</span>
      </button>
      <div class="header-title">
        <h1>Boss直聘招聘 - 任务监控</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn" :class="{ paused: taskStatus === 'paused' }" @click="toggleTask">
          <component :is="taskStatus === 'running' ? Pause : Play" :size="16" />
          {{ taskStatus === 'running' ? '暂停任务' : '继续任务' }}
        </button>
        <button class="action-btn secondary">
          <RefreshCw :size="16" />
          刷新数据
        </button>
      </div>
    </div>

    <div class="result-content">
      <!-- 左侧：任务状态和简历列表 -->
      <div class="main-panel">
        <!-- 任务状态面板 -->
        <div class="status-panel">
          <div class="status-header">
            <div class="status-indicator" :class="taskStatus">
              <span class="status-dot"></span>
              <span>{{ taskStatus === 'running' ? '运行中' : taskStatus === 'paused' ? '已暂停' : '已完成' }}</span>
            </div>
            <div v-if="riskWarning" class="risk-warning">
              <AlertTriangle :size="14" />
              {{ riskWarning }}
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ todayStats.greetings }}</div>
              <div class="stat-label">今日打招呼</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ todayStats.resumes }}</div>
              <div class="stat-label">收到简历</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ todayStats.replyRate }}%</div>
              <div class="stat-label">回复率</div>
            </div>
          </div>
        </div>

        <!-- 简历列表 -->
        <div class="resume-panel">
          <div class="panel-header">
            <h2>简历列表</h2>
            <span class="count-badge">{{ resumes.length }}份</span>
          </div>
          <div class="resume-table">
            <table>
              <thead>
                <tr>
                  <th>候选人</th>
                  <th>岗位</th>
                  <th>工作年限</th>
                  <th>学历</th>
                  <th>期望薪资</th>
                  <th>AI匹配度</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="resume in resumes" :key="resume.id">
                  <td>
                    <div class="candidate-info">
                      <span class="candidate-name">{{ resume.name }}</span>
                      <span class="candidate-company">{{ resume.company }}</span>
                    </div>
                  </td>
                  <td>{{ resume.position }}</td>
                  <td>{{ resume.experience }}</td>
                  <td>{{ resume.education }}</td>
                  <td>{{ resume.salary }}</td>
                  <td>
                    <div class="match-score" :class="getScoreClass(resume.matchScore)">
                      {{ resume.matchScore }}%
                    </div>
                  </td>
                  <td>
                    <span class="status-tag" :class="getStatusClass(resume.status)">
                      {{ getStatusText(resume.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button class="icon-btn" title="查看" @click="handleView(resume)">
                        <Eye :size="14" />
                      </button>
                      <button class="icon-btn" title="收藏" @click="handleCollect(resume)">
                        <Star :size="14" />
                      </button>
                      <button class="icon-btn danger" title="淘汰" @click="handleReject(resume)">
                        <XCircle :size="14" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 右侧：AI筛选建议 -->
      <div class="ai-panel">
        <div class="panel-header">
          <TrendingUp :size="18" />
          <h2>AI筛选建议</h2>
        </div>
        <div class="ai-subtitle">推荐面试候选人 TOP3</div>
        <div class="recommendation-list">
          <div v-for="(rec, index) in aiRecommendations" :key="index" class="recommendation-card">
            <div class="rec-header">
              <div class="rec-rank">#{{ index + 1 }}</div>
              <div class="rec-name">{{ rec.name }}</div>
              <div class="rec-score" :class="getScoreClass(rec.score)">{{ rec.score }}分</div>
            </div>
            <p class="rec-summary">{{ rec.summary }}</p>
            <button class="rec-action-btn">
              <CheckCircle :size="14" />
              安排面试
            </button>
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

.header-title h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
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
  background: #2563eb;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #1e40af;
}

.action-btn.paused {
  background: #22c55e;
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

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

.status-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.running {
  color: #22c55e;
}

.status-indicator.running .status-dot {
  background: #22c55e;
}

.status-indicator.paused {
  color: #f59e0b;
}

.status-indicator.paused .status-dot {
  background: #f59e0b;
  animation: none;
}

.status-indicator.completed {
  color: #3b82f6;
}

.status-indicator.completed .status-dot {
  background: #3b82f6;
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.risk-warning {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 6px;
  font-size: 13px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
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
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.panel-header h2 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.count-badge {
  padding: 2px 8px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 10px;
  font-size: 12px;
}

.resume-table {
  flex: 1;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

th {
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

td {
  font-size: 14px;
  color: #334155;
}

.candidate-info {
  display: flex;
  flex-direction: column;
}

.candidate-name {
  font-weight: 500;
}

.candidate-company {
  font-size: 12px;
  color: #94a3b8;
}

.match-score {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.score-high {
  background: #dcfce7;
  color: #16a34a;
}

.score-medium {
  background: #fef9c3;
  color: #ca8a04;
}

.score-low {
  background: #fee2e2;
  color: #dc2626;
}

.status-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.status-pending {
  background: #f1f5f9;
  color: #475569;
}

.status-collected {
  background: #eff6ff;
  color: #2563eb;
}

.status-rejected {
  background: #fee2e2;
  color: #dc2626;
}

.action-btns {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f1f5f9;
  color: #2563eb;
}

.icon-btn.danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

.ai-panel {
  width: 320px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  overflow-y: auto;
}

.ai-panel .panel-header {
  padding: 0;
  border: none;
  margin-bottom: 8px;
}

.ai-panel .panel-header h2 {
  color: #2563eb;
}

.ai-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 16px;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.rec-rank {
  width: 24px;
  height: 24px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.rec-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.rec-score {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.rec-summary {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.rec-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.rec-action-btn:hover {
  background: #1e40af;
}
</style>
