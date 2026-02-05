<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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
  TrendingUp,
  Briefcase,
  AlertTriangle,
  ClipboardCheck,
  ListChecks
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

// 资质要求 - 包含 searchText 用于高亮匹配
const qualifications = ref([
  { id: 1, requirement: '具有等级保护测评资质', status: 'match', detail: '我方已具备', targetSection: 'doc-professional-qualification', searchText: '等级保护测评机构资质证书' },
  { id: 2, requirement: 'ISO27001信息安全管理体系认证', status: 'match', detail: '有效期至2025-12', targetSection: 'doc-professional-qualification', searchText: 'ISO27001信息安全管理体系认证' },
  { id: 3, requirement: '3年以上同类项目业绩（至少3个）', status: 'match', detail: '我方具备5个', targetSection: 'doc-professional-qualification', searchText: '近三年内完成过至少3个同类项目业绩' },
  { id: 4, requirement: '注册资金500万元以上', status: 'match', detail: '我方1000万元', targetSection: 'doc-basic-qualification', searchText: '注册资金500万元人民币以上' },
  { id: 5, requirement: '项目负责人需持有CISP证书', status: 'partial', detail: '待确认人员安排', targetSection: 'doc-team-requirement', searchText: '项目负责人需持有CISP' },
]);

// 评分标准
const scoreStandards = ref([
  { item: '技术方案', score: 40, points: '测评方案完整性、工具先进性、方法论科学性', strategy: '重点突出自研工具和方法论优势' },
  { item: '项目业绩', score: 25, points: '同类项目数量、规模、客户评价', strategy: '列举TOP5政府类等保测评业绩' },
  { item: '团队配置', score: 20, points: '人员资质、经验、稳定性', strategy: '配置高级测评师，突出团队经验' },
  { item: '报价', score: 15, points: '价格合理性、性价比', strategy: '建议报价42万（预算的84%）' },
]);

// 时间节点 - 包含 searchText 用于高亮匹配
const timeline = ref([
  { date: '2024-02-12', event: '答疑截止', urgent: true, targetSection: 'doc-timeline-nodes', searchText: '答疑截止时间：2024年2月12日' },
  { date: '2024-02-15', event: '报名截止', urgent: true, targetSection: 'doc-timeline-nodes', searchText: '投标文件递交截止时间：2024年2月15日' },
  { date: '2024-02-20 09:00', event: '开标时间', urgent: false, targetSection: 'doc-timeline-nodes', searchText: '开标时间：2024年2月20日09:00' },
  { date: '2024-03-01', event: '预计中标公示', urgent: false, targetSection: 'doc-timeline-nodes', searchText: '预计中标公示时间：2024年3月1日' },
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

// 业绩证明要求 - 包含 searchText 用于高亮匹配
const performanceRequirements = ref([
  { requirement: '近三年同类项目数量', value: '≥3个', status: 'match', detail: '我方具备5个', targetSection: 'doc-performance-requirement', searchText: '近三年内完成过至少3个同类项目业绩' },
  { requirement: '单个项目合同金额', value: '≥20万元', status: 'match', detail: '最高项目金额80万', targetSection: 'doc-performance-requirement', searchText: '单个项目合同金额不低于20万元' },
  { requirement: '业绩时间范围', value: '2021年1月后', status: 'match', detail: '均在有效期内', targetSection: 'doc-performance-requirement', searchText: '业绩时间范围：2021年1月后' },
  { requirement: '证明材料要求', value: '合同+验收报告', status: 'match', detail: '材料齐全', targetSection: 'doc-performance-requirement', searchText: '需提供合同复印件及验收报告' },
]);

// 项目团队配置要求 - 包含 searchText 用于高亮匹配
const teamRequirements = ref([
  { role: '项目负责人', count: '1人', requirement: 'CISP证书、5年以上经验', status: 'partial', detail: '张三符合，需确认档期', targetSection: 'doc-team-requirement', searchText: '项目负责人1人，需持有CISP证书' },
  { role: '高级测评师', count: '≥2人', requirement: 'CISP-PTE/PTS证书', status: 'match', detail: '李四、王五可安排', targetSection: 'doc-team-requirement', searchText: '高级测评师不少于2人' },
  { role: '测评工程师', count: '≥3人', requirement: '本科以上学历', status: 'match', detail: '人员充足', targetSection: 'doc-team-requirement', searchText: '测评工程师不少于3人' },
  { role: '项目助理', count: '1人', requirement: '无特殊要求', status: 'match', detail: '可安排', targetSection: 'doc-team-requirement', searchText: '项目助理1人' },
]);

// 承诺/响应要求 - 包含 searchText 用于高亮匹配
const commitmentRequirements = ref([
  { item: '服务期限', requirement: '合同签订后6个月内完成', canMeet: true, targetSection: 'doc-commitment', searchText: '合同签订后6个月内完成' },
  { item: '质保期', requirement: '验收后12个月免费技术支持', canMeet: true, targetSection: 'doc-commitment', searchText: '验收后12个月免费技术支持' },
  { item: '响应时间', requirement: '问题反馈24小时内响应', canMeet: true, targetSection: 'doc-commitment', searchText: '问题反馈24小时内响应' },
  { item: '驻场要求', requirement: '测评期间安排人员驻场', canMeet: true, targetSection: 'doc-commitment', searchText: '测评期间安排人员驻场' },
  { item: '保密承诺', requirement: '签署保密协议，不泄露客户信息', canMeet: true, targetSection: 'doc-commitment', searchText: '签署保密协议' },
]);

// 废标项/否决条款 - 包含 searchText 用于高亮匹配
const disqualificationItems = ref([
  { item: '未按要求密封投标文件', risk: 'high', note: '需检查密封袋规格', targetSection: 'doc-disqualification', searchText: '未按招标文件要求密封投标文件' },
  { item: '投标保证金未按时到账', risk: 'high', note: '截止2月15日14:00前', targetSection: 'doc-disqualification', searchText: '投标保证金未按时足额到账' },
  { item: '缺少等保测评资质证书', risk: 'high', note: '我方已具备', targetSection: 'doc-disqualification', searchText: '等级保护测评机构资质证书' },
  { item: '报价超过预算最高限价', risk: 'medium', note: '预算50万，建议报价42万', targetSection: 'doc-disqualification', searchText: '投标报价超过预算最高限价' },
  { item: '投标文件未加盖公章', risk: 'high', note: '需逐页盖章', targetSection: 'doc-disqualification', searchText: '投标文件未加盖投标人公章' },
  { item: '法定代表人授权书缺失', risk: 'medium', note: '需提前准备', targetSection: 'doc-disqualification', searchText: '法定代表人授权书' },
]);

// 下一步行动计划
const actionPlan = ref([
  { action: '确认项目负责人张三档期', responsible: '人力资源部', deadline: '2024-02-08' },
  { action: '准备业绩证明材料（合同+验收报告）', responsible: '商务部', deadline: '2024-02-10' },
  { action: '编制技术方案初稿', responsible: '技术部', deadline: '2024-02-12' },
  { action: '提交投标保证金', responsible: '财务部', deadline: '2024-02-14' },
  { action: '投标文件盖章、密封', responsible: '商务部', deadline: '2024-02-15上午' },
]);

// Document sections - real paragraph structure like actual bid documents
const documentSections = ref([
  {
    id: 'sec-overview',
    title: '一、项目概况',
    subsections: [
      {
        id: 'doc-project-info',
        title: '1.1 项目基本信息',
        content: `项目名称：XX市政府信息系统安全等级保护测评服务项目。采购人：XX市政务服务中心。项目类型：服务类。采购方式：公开招标。项目预算：人民币50万元整（￥500,000.00），本预算为最高限价，投标报价不得超过此金额。`
      }
    ]
  },
  {
    id: 'sec-qualification',
    title: '二、投标人资格要求',
    subsections: [
      {
        id: 'doc-basic-qualification',
        title: '2.1 基本资格要求',
        content: `（1）具有独立法人资格，持有有效的营业执照；（2）注册资金500万元人民币以上；（3）具有良好的商业信誉和健全的财务会计制度；（4）具有履行合同所必需的设备和专业技术能力；（5）近三年内在经营活动中没有重大违法记录。`
      },
      {
        id: 'doc-professional-qualification',
        title: '2.2 专业资质要求',
        content: `（1）具有中国网络安全审查技术与认证中心颁发的等级保护测评机构资质证书（必须）；（2）具有ISO27001信息安全管理体系认证证书；（3）近三年内完成过至少3个同类项目业绩，且单个项目合同金额不低于20万元。`
      },
      {
        id: 'doc-team-requirement',
        title: '2.3 项目团队要求',
        content: `（1）项目负责人1人，需持有CISP证书，具有5年以上等级保护测评项目管理经验；（2）高级测评师不少于2人，需持有CISP-PTE或CISP-PTS证书；（3）测评工程师不少于3人，本科以上学历，熟悉网络安全相关技术；（4）项目助理1人，负责项目协调与文档整理工作。`
      },
      {
        id: 'doc-performance-requirement',
        title: '2.4 业绩证明要求',
        content: `投标人须提供近三年内完成过至少3个同类项目业绩证明材料。单个项目合同金额不低于20万元。业绩时间范围：2021年1月后签订并完成验收的项目。需提供合同复印件及验收报告作为证明材料，加盖投标人公章。`
      }
    ]
  },
  {
    id: 'sec-timeline',
    title: '四、招标时间安排',
    subsections: [
      {
        id: 'doc-timeline-nodes',
        title: '4.1 关键时间节点',
        content: `招标公告发布时间：2024年2月1日。招标文件获取时间：2024年2月1日至2024年2月15日，每日09:00-17:00（节假日除外）。答疑截止时间：2024年2月12日17:00前，逾期不再受理。投标文件递交截止时间：2024年2月15日14:00，届时不再接收投标文件。开标时间：2024年2月20日09:00。开标地点：XX市公共资源交易中心三楼开标室。预计中标公示时间：2024年3月1日。`
      },
      {
        id: 'doc-disqualification',
        title: '4.3 废标条款',
        content: `有下列情形之一的，投标无效：（1）未按招标文件要求密封投标文件；（2）投标保证金未按时足额到账；（3）投标文件未加盖投标人公章；（4）缺少法定代表人授权书或授权书无效；（5）未提供有效的等级保护测评机构资质证书；（6）投标报价超过预算最高限价；（7）投标文件存在重大偏离或保留。`
      }
    ]
  },
  {
    id: 'sec-service',
    title: '六、服务要求',
    subsections: [
      {
        id: 'doc-commitment',
        title: '6.4 服务承诺要求',
        content: `（1）服务期限：合同签订后6个月内完成全部测评工作并提交测评报告；（2）质保期：验收后12个月免费技术支持，包括测评问题咨询、整改建议等；（3）响应时间：问题反馈24小时内响应，紧急问题4小时内响应；（4）驻场要求：测评期间安排人员驻场，配合采购人完成相关工作；（5）保密承诺：签署保密协议，严格保护采购人信息资产安全，不得泄露客户信息。`
      }
    ]
  }
]);

// Track active section and highlight text
const activeSection = ref<string | null>(null);
const highlightText = ref<string | null>(null);

// Escape special regex characters
const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Highlight content by wrapping matched text with <mark> tag
const highlightContent = (content: string, sectionId: string) => {
  if (!highlightText.value || activeSection.value !== sectionId) {
    return content;
  }
  const escaped = escapeRegExp(highlightText.value);
  return content.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="highlight-text">$1</mark>'
  );
};

// Scroll to section and highlight matching text
const scrollToAndHighlight = (targetSection: string, searchText: string) => {
  // Set highlight state
  highlightText.value = searchText;
  activeSection.value = targetSection;

  // Scroll to target section
  const element = document.getElementById(targetSection);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Clear highlight after 2 seconds
  setTimeout(() => {
    highlightText.value = null;
    activeSection.value = null;
  }, 2000);
};

const goBack = () => {
  router.push({ name: 'bid-info-daily' });
};

// Scroll to section (simple version for report section clicks)
const scrollToSection = (targetSection: string) => {
  const element = document.getElementById(targetSection);
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Resizable panels
const leftPanelWidth = ref(50); // percentage
const isDragging = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = (x / rect.width) * 100;
  leftPanelWidth.value = Math.min(Math.max(percentage, 30), 70);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
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

    <div class="result-content" ref="containerRef">
      <!-- 左侧：招标文件预览 -->
      <div class="preview-panel" :style="{ width: leftPanelWidth + '%' }">
        <div class="panel-header">
          <h2>招标文件</h2>
          <span class="file-name">招标文件.pdf</span>
        </div>
        <div class="preview-content">
          <div class="doc-preview">
            <div v-for="section in documentSections" :key="section.id" class="doc-section">
              <h3 class="doc-section-title">{{ section.title }}</h3>
              <div v-for="sub in section.subsections" :key="sub.id"
                   :id="sub.id"
                   class="doc-subsection"
                   :class="{ 'active': activeSection === sub.id }">
                <h4 class="doc-subsection-title">{{ sub.title }}</h4>
                <div class="doc-subsection-content"
                     v-html="highlightContent(sub.content, sub.id)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 拖动分隔条 -->
      <div class="resizer" @mousedown="startDrag" :class="{ dragging: isDragging }">
        <div class="resizer-line"></div>
      </div>

      <!-- 右侧：AI解读报告 -->
      <div class="analysis-panel" :style="{ width: (100 - leftPanelWidth) + '%' }">
        <div class="panel-header">
          <h2>AI解读报告</h2>
        </div>
        <div class="analysis-content">
          <!-- 匹配度总评 (moved to top) -->
          <div class="report-section match-section clickable" @click="scrollToSection('doc-project-info')">
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

          <!-- 投标建议 (moved to second) -->
          <div class="report-section clickable" @click="scrollToSection('doc-scoring-overview')">
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

          <!-- 项目概况 -->
          <div class="report-section clickable" @click="scrollToSection('doc-project-info')">
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
              <div v-for="qual in qualifications" :key="qual.id" class="qual-item clickable-item" :class="getStatusClass(qual.status)" @click="scrollToAndHighlight(qual.targetSection, qual.searchText)">
                <component :is="getStatusIcon(qual.status)" :size="16" class="qual-icon" />
                <div class="qual-content">
                  <span class="qual-requirement">{{ qual.requirement }}</span>
                  <span class="qual-detail">{{ qual.detail }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 业绩证明要求 -->
          <div class="report-section">
            <h3 class="section-title">
              <Briefcase :size="16" />
              业绩证明要求
            </h3>
            <div class="qualification-list">
              <div v-for="(item, index) in performanceRequirements" :key="index" class="qual-item clickable-item" :class="getStatusClass(item.status)" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <component :is="getStatusIcon(item.status)" :size="16" class="qual-icon" />
                <div class="qual-content">
                  <span class="qual-requirement">{{ item.requirement }}：{{ item.value }}</span>
                  <span class="qual-detail">{{ item.detail }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 项目团队配置要求 -->
          <div class="report-section">
            <h3 class="section-title">
              <Users :size="16" />
              项目团队配置要求
            </h3>
            <div class="team-table">
              <div class="team-header">
                <span>岗位</span>
                <span>人数</span>
                <span>要求</span>
                <span>匹配情况</span>
              </div>
              <div v-for="(item, index) in teamRequirements" :key="index" class="team-row clickable-item" :class="getStatusClass(item.status)" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <span class="team-role">{{ item.role }}</span>
                <span class="team-count">{{ item.count }}</span>
                <span class="team-req">{{ item.requirement }}</span>
                <span class="team-status">
                  <component :is="getStatusIcon(item.status)" :size="14" />
                  {{ item.detail }}
                </span>
              </div>
            </div>
          </div>

          <!-- 承诺/响应要求 -->
          <div class="report-section">
            <h3 class="section-title">
              <ClipboardCheck :size="16" />
              承诺/响应要求
            </h3>
            <div class="commitment-list">
              <div v-for="(item, index) in commitmentRequirements" :key="index" class="commitment-item clickable-item" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <CheckCircle v-if="item.canMeet" :size="16" class="commitment-icon can-meet" />
                <XCircle v-else :size="16" class="commitment-icon cannot-meet" />
                <div class="commitment-content">
                  <span class="commitment-label">{{ item.item }}</span>
                  <span class="commitment-detail">{{ item.requirement }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 废标项/否决条款 -->
          <div class="report-section">
            <h3 class="section-title warning">
              <AlertTriangle :size="16" />
              废标项/否决条款
            </h3>
            <div class="risk-list">
              <div v-for="(item, index) in disqualificationItems" :key="index" class="risk-item clickable-item" :class="'risk-' + item.risk" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <AlertTriangle :size="16" class="risk-icon" />
                <div class="risk-content">
                  <span class="risk-label">{{ item.item }}</span>
                  <span class="risk-note">{{ item.note }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 下一步行动计划 -->
          <div class="report-section clickable" @click="scrollToSection('doc-timeline-nodes')">
            <h3 class="section-title">
              <ListChecks :size="16" />
              下一步行动计划
            </h3>
            <div class="action-table">
              <div class="action-header">
                <span>行动事项</span>
                <span>责任部门</span>
                <span>截止时间</span>
              </div>
              <div v-for="(item, index) in actionPlan" :key="index" class="action-row">
                <span class="action-item">{{ item.action }}</span>
                <span class="action-responsible">{{ item.responsible }}</span>
                <span class="action-deadline">{{ item.deadline }}</span>
              </div>
            </div>
          </div>

          <!-- 评分标准分析 -->
          <div class="report-section clickable" @click="scrollToSection('doc-scoring-overview')">
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
              <div v-for="(item, index) in timeline" :key="index" class="timeline-item clickable-item" :class="{ urgent: item.urgent }" @click="scrollToAndHighlight(item.targetSection, item.searchText)">
                <span class="timeline-icon">📅</span>
                <span class="timeline-event">{{ item.event }}</span>
                <span class="timeline-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  flex-direction: column;
  background: #f8fafc;
  z-index: 100;
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
  background: #1d4ed8;
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
  padding: 24px;
  overflow: hidden;
  gap: 0;
}

.preview-panel {
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Resizer */
.resizer {
  width: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: col-resize;
  flex-shrink: 0;
  transition: background 0.2s;
}

.resizer:hover,
.resizer.dragging {
  background: rgba(59, 130, 246, 0.1);
}

.resizer-line {
  width: 4px;
  height: 40px;
  background: #e2e8f0;
  border-radius: 2px;
  transition: all 0.2s;
}

.resizer:hover .resizer-line,
.resizer.dragging .resizer-line {
  background: #3b82f6;
  height: 60px;
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
  padding: 24px 32px;
}

.doc-preview {
  /* no max-width constraint */
}

.doc-section {
  margin-bottom: 32px;
}

.doc-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #2563eb;
}

.doc-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-item {
  padding: 8px 12px;
  margin: 0;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  transition: all 0.3s ease;
  scroll-margin-top: 20px;
  background: #f8fafc;
}

.doc-item.active {
  background: #dbeafe;
  border-left: 3px solid #2563eb;
  font-weight: 500;
  color: #1e293b;
}

.doc-subsection {
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  scroll-margin-top: 20px;
  transition: all 0.3s ease;
}

.doc-subsection.active {
  /* Only yellow highlight on text, no border or background */
}

.doc-subsection-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 8px 0;
}

.doc-subsection-content {
  font-size: 13px;
  color: #475569;
  line-height: 1.8;
  white-space: pre-wrap;
}

/* Highlight text style */
.doc-subsection-content :deep(.highlight-text) {
  background: linear-gradient(120deg, #fef08a 0%, #fde047 100%);
  padding: 2px 4px;
  border-radius: 3px;
  animation: highlight-pulse 0.5s ease-out;
}

@keyframes highlight-pulse {
  0% { background: #fbbf24; }
  100% { background: #fef08a; }
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
  flex-shrink: 0;
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

/* Subtle scrollbar styling */
.preview-content::-webkit-scrollbar,
.analysis-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-track,
.analysis-content::-webkit-scrollbar-track {
  background: transparent;
}

.preview-content::-webkit-scrollbar-thumb,
.analysis-content::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-thumb:hover,
.analysis-content::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.report-section {
  margin-bottom: 24px;
}

.report-section.clickable {
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
}

.report-section.clickable:hover {
  background: #f8fafc;
}

.report-section.match-section.clickable:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
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
  color: #2563eb;
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
  color: #2563eb;
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

/* Clickable item styles */
.clickable-item {
  cursor: pointer;
  transition: all 0.2s;
}

.clickable-item:hover {
  transform: translateX(4px);
  box-shadow: -2px 0 0 0 #2563eb;
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
  color: #2563eb;
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
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
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
  color: #2563eb;
}

.match-score .score-unit {
  font-size: 16px;
  color: #2563eb;
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
  color: #2563eb;
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
  color: #2563eb;
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

/* 团队配置表格 */
.team-table {
  font-size: 13px;
}

.team-header {
  display: grid;
  grid-template-columns: 100px 60px 1fr 1fr;
  gap: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  color: #64748b;
}

.team-row {
  display: grid;
  grid-template-columns: 100px 60px 1fr 1fr;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
}

.team-row.status-match {
  background: #f0fdf4;
}

.team-row.status-partial {
  background: #fefce8;
}

.team-role {
  font-weight: 500;
  color: #334155;
}

.team-count {
  color: #64748b;
}

.team-req {
  font-size: 12px;
  color: #64748b;
}

.team-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #475569;
}

.team-row.status-match .team-status svg {
  color: #22c55e;
}

.team-row.status-partial .team-status svg {
  color: #ca8a04;
}

/* 承诺/响应要求 */
.commitment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.commitment-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #f0fdf4;
  border-radius: 8px;
}

.commitment-icon.can-meet {
  color: #22c55e;
  flex-shrink: 0;
  margin-top: 2px;
}

.commitment-icon.cannot-meet {
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 2px;
}

.commitment-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.commitment-label {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.commitment-detail {
  font-size: 12px;
  color: #64748b;
}

/* 废标项/风险警示 */
.section-title.warning {
  color: #dc2626;
}

.section-title.warning svg {
  color: #dc2626;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risk-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
}

.risk-item.risk-high {
  background: #fef2f2;
}

.risk-item.risk-high .risk-icon {
  color: #dc2626;
}

.risk-item.risk-medium {
  background: #fefce8;
}

.risk-item.risk-medium .risk-icon {
  color: #ca8a04;
}

.risk-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.risk-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.risk-label {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.risk-note {
  font-size: 12px;
  color: #64748b;
}

/* 行动计划表格 */
.action-table {
  font-size: 13px;
}

.action-header {
  display: grid;
  grid-template-columns: 1fr 100px 120px;
  gap: 12px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  color: #64748b;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 100px 120px;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.action-item {
  color: #334155;
}

.action-responsible {
  color: #64748b;
}

.action-deadline {
  color: #2563eb;
  font-weight: 500;
}
</style>
