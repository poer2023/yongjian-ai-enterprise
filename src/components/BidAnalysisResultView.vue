<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileSearch,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  Building2,
  DollarSign,
  Users,
  FileText,
  Award,
  Clock,
  TrendingUp
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const bidTitle = route.query.title as string || 'XX市政府信息系统安全等级保护测评服务项目';

// 项目概况
const projectInfo = ref({
  name: 'XX市政府信息系统安全等级保护测评服务项目',
  purchaser: 'XX市政务服务中心',
  budget: 50,
  deadline: '2024-02-15',
  openTime: '2024-02-20 09:00',
  projectType: '服务类',
  bidMethod: '公开招标',
});

// 资质要求
const qualifications = ref([
  { id: 1, requirement: '具有等级保护测评资质', status: 'match', detail: '我方已具备' },
  { id: 2, requirement: 'ISO27001信息安全管理体系认证', status: 'match', detail: '有效期至2025-12' },
  { id: 3, requirement: '3年以上同类项目业绩（至少3个）', status: 'match', detail: '我方具备5个' },
  { id: 4, requirement: '注册资金500万元以上', status: 'match', detail: '我方1000万元' },
  { id: 5, requirement: '项目负责人需持有CISP证书', status: 'partial', detail: '待确认人员安排' },
]);

// 评分标准
const scoreStandards = ref([
  { item: '技术方案', score: 40, points: '测评方案完整性、工具先进性、方法论科学性', strategy: '重点突出自研工具和方法论优势' },
  { item: '项目业绩', score: 25, points: '同类项目数量、规模、客户评价', strategy: '列举TOP5政府类等保测评业绩' },
  { item: '团队配置', score: 20, points: '人员资质、经验、稳定性', strategy: '配置高级测评师，突出团队经验' },
  { item: '报价', score: 15, points: '价格合理性、性价比', strategy: '建议报价42万（预算的84%）' },
]);

// 时间节点
const timeline = ref([
  { date: '2024-02-12', event: '答疑截止', urgent: true },
  { date: '2024-02-15', event: '报名截止', urgent: true },
  { date: '2024-02-20 09:00', event: '开标时间', urgent: false },
  { date: '2024-03-01', event: '预计中标公示', urgent: false },
]);

// 匹配度评估
const matchAssessment = ref({
  score: 92,
  recommendation: '强烈建议投标',
  reasons: [
    '资质要求完全满足',
    '业绩经验丰富',
    '技术能力匹配',
    '预算范围合理',
  ],
});

// 投标建议
const suggestions = ref([
  '技术方案重点突出自研等保测评平台和自动化工具',
  '配置项目经理张三（高级等保测评师，10年经验）',
  '列举与政府类客户合作的成功案例',
  '建议报价区间：40-45万元',
  '注意答疑截止时间，如有疑问尽早提出',
]);

const goBack = () => {
  router.push({ name: 'bid-info-daily' });
};

const getStatusIcon = (status: string) => {
  return status === 'match' ? CheckCircle : status === 'partial' ? Clock : XCircle;
};

const getStatusClass = (status: string) => {
  return status === 'match' ? 'status-match' : status === 'partial' ? 'status-partial' : 'status-nomatch';
};

const generateBidDoc = () => {
  router.push({
    name: 'bid-doc-form',
    query: { bidId: route.query.bidId, title: bidTitle },
  });
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
        <FileSearch :size="20" />
        <h1>标讯AI解读</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary">
          <Download :size="16" />
          导出报告
        </button>
        <button class="action-btn primary" @click="generateBidDoc">
          <FileText :size="16" />
          生成标书
        </button>
      </div>
    </div>

    <div class="result-content">
      <!-- 左侧：招标文件预览 -->
      <div class="preview-panel">
        <div class="panel-header">
          <h2>招标文件</h2>
          <span class="file-name">招标文件.pdf</span>
        </div>
        <div class="preview-content">
          <div class="doc-preview">
            <div class="preview-placeholder">
              <FileText :size="48" />
              <p>招标文件预览区域</p>
              <span>支持PDF、Word格式在线预览</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：AI解读报告 -->
      <div class="analysis-panel">
        <div class="panel-header">
          <h2>AI解读报告</h2>
        </div>
        <div class="analysis-content">
          <!-- 项目概况 -->
          <div class="report-section">
            <h3 class="section-title">
              <Building2 :size="16" />
              项目概况
            </h3>
            <div class="info-table">
              <div class="info-row">
                <span class="info-label">项目名称</span>
                <span class="info-value">{{ projectInfo.name }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">采购人</span>
                <span class="info-value">{{ projectInfo.purchaser }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">预算金额</span>
                <span class="info-value highlight">{{ projectInfo.budget }}万元</span>
              </div>
              <div class="info-row">
                <span class="info-label">报名截止</span>
                <span class="info-value">{{ projectInfo.deadline }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">开标时间</span>
                <span class="info-value">{{ projectInfo.openTime }}</span>
              </div>
            </div>
          </div>

          <!-- 资质要求 -->
          <div class="report-section">
            <h3 class="section-title">
              <Award :size="16" />
              资质要求清单
            </h3>
            <div class="qualification-list">
              <div v-for="qual in qualifications" :key="qual.id" class="qual-item" :class="getStatusClass(qual.status)">
                <component :is="getStatusIcon(qual.status)" :size="16" class="qual-icon" />
                <div class="qual-content">
                  <span class="qual-requirement">{{ qual.requirement }}</span>
                  <span class="qual-detail">{{ qual.detail }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 评分标准分析 -->
          <div class="report-section">
            <h3 class="section-title">
              <TrendingUp :size="16" />
              评分标准分析
            </h3>
            <div class="score-table">
              <div class="score-header">
                <span>评分项</span>
                <span>分值</span>
                <span>评分要点</span>
                <span>建议策略</span>
              </div>
              <div v-for="item in scoreStandards" :key="item.item" class="score-row">
                <span class="score-item">{{ item.item }}</span>
                <span class="score-value">{{ item.score }}分</span>
                <span class="score-points">{{ item.points }}</span>
                <span class="score-strategy">{{ item.strategy }}</span>
              </div>
            </div>
          </div>

          <!-- 时间节点 -->
          <div class="report-section">
            <h3 class="section-title">
              <Calendar :size="16" />
              时间节点
            </h3>
            <div class="timeline">
              <div v-for="(item, index) in timeline" :key="index" class="timeline-item" :class="{ urgent: item.urgent }">
                <span class="timeline-icon">📅</span>
                <span class="timeline-event">{{ item.event }}</span>
                <span class="timeline-date">{{ item.date }}</span>
              </div>
            </div>
          </div>

          <!-- 匹配度总评 -->
          <div class="report-section match-section">
            <div class="match-header">
              <div class="match-score">
                <span class="score-value">{{ matchAssessment.score }}</span>
                <span class="score-unit">%</span>
              </div>
              <div class="match-info">
                <span class="match-label">综合匹配度</span>
                <span class="match-rec">{{ matchAssessment.recommendation }}</span>
              </div>
            </div>
            <div class="match-reasons">
              <span v-for="(reason, index) in matchAssessment.reasons" :key="index" class="reason-tag">
                <CheckCircle :size="12" />
                {{ reason }}
              </span>
            </div>
          </div>

          <!-- 投标建议 -->
          <div class="report-section">
            <h3 class="section-title">
              <FileText :size="16" />
              投标建议
            </h3>
            <ol class="suggestion-list">
              <li v-for="(suggestion, index) in suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ol>
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
  background: #ecfdf5;
  border: none;
  border-radius: 6px;
  color: #10b981;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #d1fae5;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #10b981;
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
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #10b981;
  color: white;
}

.action-btn.primary:hover {
  background: #059669;
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

.preview-panel {
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

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.doc-preview {
  height: 100%;
  min-height: 400px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  text-align: center;
  color: #94a3b8;
}

.preview-placeholder svg {
  margin-bottom: 12px;
}

.preview-placeholder p {
  font-size: 14px;
  margin: 0 0 4px 0;
}

.preview-placeholder span {
  font-size: 12px;
}

.analysis-panel {
  width: 480px;
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

.report-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.section-title svg {
  color: #10b981;
}

.info-table {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  color: #64748b;
}

.info-value {
  font-size: 13px;
  color: #334155;
}

.info-value.highlight {
  font-weight: 600;
  color: #10b981;
}

.qualification-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qual-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
}

.qual-item.status-match {
  background: #ecfdf5;
}

.qual-item.status-match .qual-icon {
  color: #22c55e;
}

.qual-item.status-partial {
  background: #fef9c3;
}

.qual-item.status-partial .qual-icon {
  color: #ca8a04;
}

.qual-item.status-nomatch {
  background: #fee2e2;
}

.qual-item.status-nomatch .qual-icon {
  color: #dc2626;
}

.qual-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.qual-requirement {
  font-size: 13px;
  color: #334155;
}

.qual-detail {
  font-size: 12px;
  color: #64748b;
}

.score-table {
  font-size: 13px;
}

.score-header {
  display: grid;
  grid-template-columns: 80px 50px 1fr 1fr;
  gap: 12px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  color: #64748b;
}

.score-row {
  display: grid;
  grid-template-columns: 80px 50px 1fr 1fr;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.score-value {
  font-weight: 600;
  color: #10b981;
}

.score-points {
  font-size: 12px;
  color: #64748b;
}

.score-strategy {
  font-size: 12px;
  color: #2563eb;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.timeline-item.urgent {
  background: #fef3c7;
}

.timeline-event {
  flex: 1;
  font-size: 13px;
  color: #334155;
}

.timeline-date {
  font-size: 13px;
  color: #64748b;
}

.timeline-item.urgent .timeline-date {
  color: #d97706;
  font-weight: 500;
}

.match-section {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 12px;
  padding: 20px;
}

.match-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.match-score {
  display: flex;
  align-items: baseline;
}

.match-score .score-value {
  font-size: 36px;
  font-weight: 700;
  color: #16a34a;
}

.match-score .score-unit {
  font-size: 16px;
  color: #16a34a;
}

.match-info {
  display: flex;
  flex-direction: column;
}

.match-label {
  font-size: 13px;
  color: #64748b;
}

.match-rec {
  font-size: 16px;
  font-weight: 600;
  color: #16a34a;
}

.match-reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reason-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: white;
  border-radius: 12px;
  font-size: 12px;
  color: #16a34a;
}

.suggestion-list {
  padding-left: 20px;
  margin: 0;
}

.suggestion-list li {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  padding: 6px 0;
}
</style>
