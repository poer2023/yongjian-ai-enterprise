<script setup lang="ts">
import { ref, computed } from 'vue';
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
  TrendingUp,
  Briefcase,
  MessageSquare,
  FileUser,
  Clock,
  Users,
  Calendar,
  Download
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// JD List
interface MonitoredJD {
  id: number;
  jobName: string;
  salaryRange: string;
  status: 'running' | 'paused';
  todayGreetings: number;
  todayResumes: number;
  totalResumes: number;
}

const jdList = ref<MonitoredJD[]>([
  { id: 1, jobName: 'Java开发工程师', salaryRange: '25K-35K', status: 'running', todayGreetings: 45, todayResumes: 12, totalResumes: 89 },
  { id: 2, jobName: '前端开发工程师', salaryRange: '20K-30K', status: 'running', todayGreetings: 38, todayResumes: 8, totalResumes: 56 },
  { id: 3, jobName: '产品经理', salaryRange: '30K-45K', status: 'paused', todayGreetings: 0, todayResumes: 0, totalResumes: 42 },
  { id: 4, jobName: '网络安全工程师', salaryRange: '25K-40K', status: 'running', todayGreetings: 28, todayResumes: 5, totalResumes: 31 },
]);

const selectedJdId = ref(1);

// Current JD data
const currentJd = computed(() => {
  return jdList.value.find(jd => jd.id === selectedJdId.value) || jdList.value[0];
});

// Dashboard stats for current JD
const dashboardStats = computed(() => {
  const jd = currentJd.value;
  return {
    todayGreetings: jd.todayGreetings,
    todayResumes: jd.todayResumes,
    replyRate: jd.todayGreetings > 0 ? ((jd.todayResumes / jd.todayGreetings) * 100).toFixed(1) : '0',
    totalResumes: jd.totalResumes,
    pendingCount: Math.floor(jd.totalResumes * 0.4),
    collectedCount: Math.floor(jd.totalResumes * 0.35),
    interviewCount: Math.floor(jd.totalResumes * 0.15),
    rejectedCount: Math.floor(jd.totalResumes * 0.1),
  };
});

// Resume list for current JD
interface Resume {
  id: number;
  name: string;
  position: string;
  experience: string;
  education: string;
  matchScore: number;
  status: 'pending' | 'collected' | 'interview' | 'rejected';
  salary: string;
  company: string;
  lastActive: string;
}

const resumes = ref<Resume[]>([
  { id: 1, name: '张三', position: 'Java开发', experience: '3年', education: '本科', matchScore: 92, status: 'pending', salary: '20-25K', company: '某互联网公司', lastActive: '2小时前' },
  { id: 2, name: '李四', position: 'Java开发', experience: '5年', education: '硕士', matchScore: 88, status: 'collected', salary: '25-35K', company: '某科技公司', lastActive: '1小时前' },
  { id: 3, name: '王五', position: 'Java开发', experience: '2年', education: '本科', matchScore: 75, status: 'pending', salary: '15-20K', company: '某创业公司', lastActive: '30分钟前' },
  { id: 4, name: '赵六', position: 'Java开发', experience: '4年', education: '本科', matchScore: 85, status: 'interview', salary: '22-28K', company: '某金融公司', lastActive: '3小时前' },
  { id: 5, name: '钱七', position: 'Java开发', experience: '1年', education: '大专', matchScore: 62, status: 'rejected', salary: '10-15K', company: '某外包公司', lastActive: '1天前' },
  { id: 6, name: '孙八', position: 'Java开发', experience: '6年', education: '本科', matchScore: 91, status: 'pending', salary: '28-38K', company: '某大厂', lastActive: '15分钟前' },
  { id: 7, name: '周九', position: 'Java开发', experience: '3年', education: '本科', matchScore: 78, status: 'collected', salary: '18-25K', company: '某电商公司', lastActive: '4小时前' },
  { id: 8, name: '吴十', position: 'Java开发', experience: '4年', education: '硕士', matchScore: 86, status: 'pending', salary: '25-32K', company: '某游戏公司', lastActive: '2小时前' },
]);

// Filter
const statusFilter = ref('all');
const filteredResumes = computed(() => {
  if (statusFilter.value === 'all') return resumes.value;
  return resumes.value.filter(r => r.status === statusFilter.value);
});

const goBack = () => {
  router.push({ name: 'boss-recruit-form' });
};

const selectJd = (id: number) => {
  selectedJdId.value = id;
};

const toggleJdStatus = (jd: MonitoredJD) => {
  jd.status = jd.status === 'running' ? 'paused' : 'running';
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待处理';
    case 'collected': return '已收藏';
    case 'interview': return '约面试';
    case 'rejected': return '已淘汰';
    default: return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'status-pending';
    case 'collected': return 'status-collected';
    case 'interview': return 'status-interview';
    case 'rejected': return 'status-rejected';
    default: return '';
  }
};

const getScoreClass = (score: number) => {
  if (score >= 85) return 'score-high';
  if (score >= 70) return 'score-medium';
  return 'score-low';
};

const handleView = (resume: Resume) => {
  console.log('查看简历:', resume);
};

const handleCollect = (resume: Resume) => {
  resume.status = 'collected';
};

const handleInterview = (resume: Resume) => {
  resume.status = 'interview';
};

const handleReject = (resume: Resume) => {
  resume.status = 'rejected';
};
</script>

<template>
  <div class="result-page">
    <!-- Left JD Sidebar -->
    <aside class="jd-sidebar">
      <div class="sidebar-header">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="16" />
          返回
        </button>
      </div>

      <div class="jd-list-header">
        <h3>监控岗位</h3>
        <span class="jd-count">{{ jdList.length }}个</span>
      </div>

      <div class="jd-list">
        <div
          v-for="jd in jdList"
          :key="jd.id"
          class="jd-item"
          :class="{ active: selectedJdId === jd.id }"
          @click="selectJd(jd.id)"
        >
          <div class="jd-item-header">
            <Briefcase :size="14" class="jd-icon" />
            <span class="jd-name">{{ jd.jobName }}</span>
          </div>
          <div class="jd-item-meta">
            <span class="jd-salary">{{ jd.salaryRange }}</span>
            <span class="jd-status-badge" :class="jd.status">
              <span class="status-dot"></span>
              {{ jd.status === 'running' ? '运行中' : '已暂停' }}
            </span>
          </div>
          <div class="jd-item-stats">
            <span><MessageSquare :size="11" /> {{ jd.todayGreetings }}</span>
            <span><FileUser :size="11" /> {{ jd.todayResumes }}</span>
            <span><Users :size="11" /> {{ jd.totalResumes }}</span>
          </div>
          <button
            class="jd-toggle-btn"
            :class="{ paused: jd.status === 'paused' }"
            @click.stop="toggleJdStatus(jd)"
          >
            <component :is="jd.status === 'running' ? Pause : Play" :size="12" />
            {{ jd.status === 'running' ? '暂停' : '启动' }}
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <div class="content-header">
        <div class="header-left">
          <h1>{{ currentJd.jobName }}</h1>
          <span class="header-salary">{{ currentJd.salaryRange }}</span>
          <span class="header-status" :class="currentJd.status">
            <span class="status-dot"></span>
            {{ currentJd.status === 'running' ? '运行中' : '已暂停' }}
          </span>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary">
            <RefreshCw :size="14" />
            刷新
          </button>
          <button class="action-btn secondary">
            <Download :size="14" />
            导出
          </button>
        </div>
      </div>

      <!-- Dashboard -->
      <div class="dashboard">
        <div class="stats-row">
          <div class="stat-card primary">
            <div class="stat-icon">
              <MessageSquare :size="20" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardStats.todayGreetings }}</div>
              <div class="stat-label">今日打招呼</div>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">
              <FileUser :size="20" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardStats.todayResumes }}</div>
              <div class="stat-label">今日收简历</div>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">
              <TrendingUp :size="20" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardStats.replyRate }}%</div>
              <div class="stat-label">回复率</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <Users :size="20" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardStats.totalResumes }}</div>
              <div class="stat-label">累计简历</div>
            </div>
          </div>
        </div>

        <div class="status-summary">
          <div class="summary-item">
            <span class="summary-dot pending"></span>
            <span class="summary-label">待处理</span>
            <span class="summary-value">{{ dashboardStats.pendingCount }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-dot collected"></span>
            <span class="summary-label">已收藏</span>
            <span class="summary-value">{{ dashboardStats.collectedCount }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-dot interview"></span>
            <span class="summary-label">约面试</span>
            <span class="summary-value">{{ dashboardStats.interviewCount }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-dot rejected"></span>
            <span class="summary-label">已淘汰</span>
            <span class="summary-value">{{ dashboardStats.rejectedCount }}</span>
          </div>
        </div>
      </div>

      <!-- Resume List -->
      <div class="resume-section">
        <div class="section-header">
          <h2>简历列表</h2>
          <div class="filter-tabs">
            <button
              class="filter-tab"
              :class="{ active: statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              全部
            </button>
            <button
              class="filter-tab"
              :class="{ active: statusFilter === 'pending' }"
              @click="statusFilter = 'pending'"
            >
              待处理
            </button>
            <button
              class="filter-tab"
              :class="{ active: statusFilter === 'collected' }"
              @click="statusFilter = 'collected'"
            >
              已收藏
            </button>
            <button
              class="filter-tab"
              :class="{ active: statusFilter === 'interview' }"
              @click="statusFilter = 'interview'"
            >
              约面试
            </button>
          </div>
        </div>

        <div class="resume-table">
          <div class="table-header">
            <span class="col-name">候选人</span>
            <span class="col-exp">工作年限</span>
            <span class="col-edu">学历</span>
            <span class="col-salary">期望薪资</span>
            <span class="col-score">匹配度</span>
            <span class="col-time">活跃时间</span>
            <span class="col-status">状态</span>
            <span class="col-action">操作</span>
          </div>
          <div class="table-body">
            <div v-for="resume in filteredResumes" :key="resume.id" class="table-row">
              <span class="col-name">
                <div class="candidate-info">
                  <span class="candidate-name">{{ resume.name }}</span>
                  <span class="candidate-company">{{ resume.company }}</span>
                </div>
              </span>
              <span class="col-exp">{{ resume.experience }}</span>
              <span class="col-edu">{{ resume.education }}</span>
              <span class="col-salary">{{ resume.salary }}</span>
              <span class="col-score">
                <div class="match-score" :class="getScoreClass(resume.matchScore)">
                  {{ resume.matchScore }}%
                </div>
              </span>
              <span class="col-time">
                <Clock :size="12" />
                {{ resume.lastActive }}
              </span>
              <span class="col-status">
                <span class="status-tag" :class="getStatusClass(resume.status)">
                  {{ getStatusText(resume.status) }}
                </span>
              </span>
              <span class="col-action">
                <div class="action-btns">
                  <button class="icon-btn" title="查看" @click="handleView(resume)">
                    <Eye :size="14" />
                  </button>
                  <button class="icon-btn" title="收藏" @click="handleCollect(resume)">
                    <Star :size="14" />
                  </button>
                  <button class="icon-btn success" title="约面试" @click="handleInterview(resume)">
                    <CheckCircle :size="14" />
                  </button>
                  <button class="icon-btn danger" title="淘汰" @click="handleReject(resume)">
                    <XCircle :size="14" />
                  </button>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.result-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: #f8fafc;
  z-index: 100;
}

/* Left JD Sidebar */
.jd-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
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

.jd-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.jd-list-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.jd-count {
  font-size: 12px;
  color: #64748b;
  padding: 2px 8px;
  background: #f1f5f9;
  border-radius: 10px;
}

.jd-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.jd-item {
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.jd-item:hover {
  background: #f8fafc;
}

.jd-item.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.jd-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.jd-icon {
  color: #3b82f6;
}

.jd-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.jd-item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.jd-salary {
  font-size: 13px;
  font-weight: 500;
  color: #16a34a;
}

.jd-status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.jd-status-badge.running {
  background: #dcfce7;
  color: #16a34a;
}

.jd-status-badge.paused {
  background: #fef3c7;
  color: #d97706;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.jd-status-badge.running .status-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.jd-item-stats {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 10px;
}

.jd-item-stats span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.jd-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 6px;
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.jd-toggle-btn:hover {
  background: #e2e8f0;
}

.jd-toggle-btn.paused {
  background: #dcfce7;
  color: #16a34a;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-salary {
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 12px;
}

.header-status.running {
  background: #dcfce7;
  color: #16a34a;
}

.header-status.paused {
  background: #fef3c7;
  color: #d97706;
}

.header-actions {
  display: flex;
  gap: 10px;
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

.action-btn.secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #f8fafc;
}

/* Dashboard */
.dashboard {
  padding: 20px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 10px;
}

.stat-card.primary .stat-icon {
  background: #dbeafe;
  color: #2563eb;
}

.stat-card.success .stat-icon {
  background: #dcfce7;
  color: #16a34a;
}

.stat-card.warning .stat-icon {
  background: #fef3c7;
  color: #d97706;
}

.stat-icon {
  width: 44px;
  height: 44px;
  background: #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.status-summary {
  display: flex;
  gap: 32px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.summary-dot.pending { background: #94a3b8; }
.summary-dot.collected { background: #3b82f6; }
.summary-dot.interview { background: #22c55e; }
.summary-dot.rejected { background: #ef4444; }

.summary-label {
  font-size: 13px;
  color: #64748b;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

/* Resume Section */
.resume-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
}

.filter-tab {
  padding: 6px 14px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover:not(.active) {
  color: #334155;
}

.filter-tab.active {
  background: white;
  color: #2563eb;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.resume-table {
  flex: 1;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 0.7fr 0.6fr 0.8fr 0.7fr 0.8fr 0.7fr 1fr;
  gap: 12px;
  padding: 14px 20px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.table-body {
  flex: 1;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 0.7fr 0.6fr 0.8fr 0.7fr 0.8fr 0.7fr 1fr;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 13px;
  color: #334155;
  transition: background 0.15s;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

.candidate-info {
  display: flex;
  flex-direction: column;
}

.candidate-name {
  font-weight: 500;
  color: #1e293b;
}

.candidate-company {
  font-size: 12px;
  color: #94a3b8;
}

.col-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.match-score {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.score-high { background: #dcfce7; color: #16a34a; }
.score-medium { background: #fef9c3; color: #ca8a04; }
.score-low { background: #fee2e2; color: #dc2626; }

.status-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.status-pending { background: #f1f5f9; color: #475569; }
.status-collected { background: #dbeafe; color: #2563eb; }
.status-interview { background: #dcfce7; color: #16a34a; }
.status-rejected { background: #fee2e2; color: #dc2626; }

.action-btns {
  display: flex;
  gap: 6px;
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

.icon-btn.success:hover {
  background: #dcfce7;
  color: #16a34a;
  border-color: #bbf7d0;
}

.icon-btn.danger:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

/* Scrollbar */
.jd-list::-webkit-scrollbar,
.table-body::-webkit-scrollbar {
  width: 6px;
}

.jd-list::-webkit-scrollbar-track,
.table-body::-webkit-scrollbar-track {
  background: transparent;
}

.jd-list::-webkit-scrollbar-thumb,
.table-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.jd-list::-webkit-scrollbar-thumb:hover,
.table-body::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
