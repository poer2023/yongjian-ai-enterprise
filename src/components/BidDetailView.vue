<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  FileText,
  FileSearch,
  BookmarkPlus,
  Download,
  Share2
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 从路由获取标讯ID
const bidId = computed(() => route.query.id || '1');

// Mock标讯详情数据
const bidDetail = ref({
  id: 1,
  title: 'XX市政府信息系统安全等级保护测评服务项目',
  publishDate: '2024-01-25',
  deadline: '2024-02-15 17:00',
  budget: 50,
  publisher: 'XX市政务服务中心',
  region: '北京市',
  projectType: '服务类',
  procurementMethod: '公开招标',
  matchLevel: 'high',
  matchScore: 92,
  // 招标公告全文
  content: `
一、项目基本情况

项目编号：XXZC-2024-001
项目名称：XX市政府信息系统安全等级保护测评服务项目
采购方式：公开招标
预算金额：50万元（人民币）

二、采购需求

1. 服务内容
（1）对XX市政务服务中心现有信息系统进行等级保护测评，包括但不限于：
- 政务服务平台系统（二级）
- 电子政务外网核心系统（三级）
- 数据交换共享平台（二级）
- 移动政务APP系统（二级）

（2）测评工作应包含以下内容：
- 安全物理环境测评
- 安全通信网络测评
- 安全区域边界测评
- 安全计算环境测评
- 安全管理中心测评
- 安全管理制度测评
- 安全管理机构测评
- 安全管理人员测评
- 安全建设管理测评
- 安全运维管理测评

2. 服务期限
合同签订之日起6个月内完成全部测评工作。

3. 资质要求
（1）投标人须具有独立法人资格；
（2）投标人须具有公安部颁发的《信息安全等级保护测评机构推荐证书》；
（3）投标人须具有ISO27001信息安全管理体系认证；
（4）投标人近三年内须有3个以上政府机关等保测评项目业绩；
（5）投标人须配备不少于5名持有CISP或CISM证书的专业技术人员。

三、投标人资格要求

1. 满足《中华人民共和国政府采购法》第二十二条规定；
2. 落实政府采购政策需满足的资格要求：本项目专门面向中小企业采购；
3. 本项目的特定资格要求：
（1）投标人须为在中华人民共和国境内注册的独立法人；
（2）投标人须具备有效的等保测评机构资质证书；
（3）投标人不得为列入失信被执行人、重大税收违法案件当事人名单、政府采购严重违法失信行为记录名单的供应商。

四、投标报名

1. 报名时间：2024年1月25日至2024年2月5日，每天9:00-17:00（法定节假日除外）
2. 报名地点：XX市政务服务中心采购办公室（XX区XX路XX号X楼X室）
3. 报名材料：
（1）法定代表人身份证明或授权委托书；
（2）营业执照副本复印件；
（3）资质证书复印件；
（4）近三年类似项目业绩证明材料。

五、招标文件获取

1. 获取时间：同报名时间
2. 获取地点：同报名地点
3. 招标文件售价：人民币500元/份，售后不退

六、投标截止时间及地点

1. 投标截止时间：2024年2月15日17:00（北京时间）
2. 投标地点：XX市公共资源交易中心开标室

七、开标时间及地点

1. 开标时间：2024年2月15日17:00（北京时间）
2. 开标地点：XX市公共资源交易中心开标室

八、联系方式

采购人：XX市政务服务中心
地  址：XX区XX路XX号
联系人：张先生
电  话：010-XXXXXXXX

采购代理机构：XX招标代理有限公司
地  址：XX区XX路XX号
联系人：李女士
电  话：010-XXXXXXXX

九、公告期限

自本公告发布之日起5个工作日。

十、其他补充事宜

1. 本项目采用综合评分法进行评审；
2. 中标人须在中标通知书发出之日起30日内与采购人签订政府采购合同；
3. 本公告及招标文件如有变更，将在XX市政府采购网发布更正公告。
  `,
  matchReasons: [
    { keyword: '等保测评', matched: true, description: '核心业务关键词匹配' },
    { keyword: '信息系统安全', matched: true, description: '业务领域匹配' },
    { keyword: '政府机关', matched: true, description: '目标客户类型匹配' },
    { keyword: '北京', matched: true, description: '服务地区匹配' },
    { keyword: 'CISP', matched: true, description: '资质要求匹配' }
  ],
  attachments: [
    { name: '招标文件.pdf', size: '2.3MB' },
    { name: '技术规范书.docx', size: '856KB' },
    { name: '资格要求说明.pdf', size: '128KB' }
  ]
});

const goBack = () => {
  router.back();
};

const viewAnalysis = () => {
  router.push({
    name: 'bid-analysis-form',
    query: { bidId: bidDetail.value.id, title: bidDetail.value.title }
  });
};

const addToKnowledge = () => {
  console.log('添加到知识库:', bidDetail.value.title);
};

const downloadAttachment = (attachment: any) => {
  console.log('下载附件:', attachment.name);
};

const getMatchClass = (level: string) => {
  switch (level) {
    case 'high': return 'match-high';
    case 'medium': return 'match-medium';
    case 'low': return 'match-low';
    default: return '';
  }
};

const getMatchText = (level: string) => {
  switch (level) {
    case 'high': return '高匹配';
    case 'medium': return '中匹配';
    case 'low': return '低匹配';
    default: return '';
  }
};

const formatDate = (dateStr: string) => {
  return dateStr;
};
</script>

<template>
  <div class="bid-detail-page">
    <div class="detail-container">
      <!-- 顶部导航 -->
      <div class="detail-header">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
          <span>返回列表</span>
        </button>
        <div class="header-actions">
          <button class="header-btn" @click="addToKnowledge">
            <BookmarkPlus :size="16" />
            <span>添加到知识库</span>
          </button>
          <button class="header-btn primary" @click="viewAnalysis">
            <FileSearch :size="16" />
            <span>AI解读</span>
          </button>
        </div>
      </div>

      <div class="detail-content">
        <!-- 左侧主内容 -->
        <div class="main-content">
          <!-- 标题区域 -->
          <div class="title-section">
            <span class="match-badge" :class="getMatchClass(bidDetail.matchLevel)">
              {{ getMatchText(bidDetail.matchLevel) }} {{ bidDetail.matchScore }}分
            </span>
            <h1 class="bid-title">{{ bidDetail.title }}</h1>
          </div>

          <!-- 基本信息卡片 -->
          <div class="info-card">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-icon"><Building2 :size="16" /></div>
                <div class="info-label">发布单位</div>
                <div class="info-value">{{ bidDetail.publisher }}</div>
              </div>
              <div class="info-item">
                <div class="info-icon"><MapPin :size="16" /></div>
                <div class="info-label">所在地区</div>
                <div class="info-value">{{ bidDetail.region }}</div>
              </div>
              <div class="info-item">
                <div class="info-icon"><DollarSign :size="16" /></div>
                <div class="info-label">预算金额</div>
                <div class="info-value highlight">{{ bidDetail.budget }}万元</div>
              </div>
              <div class="info-item">
                <div class="info-icon"><Clock :size="16" /></div>
                <div class="info-label">截止时间</div>
                <div class="info-value warning">{{ bidDetail.deadline }}</div>
              </div>
              <div class="info-item">
                <div class="info-icon"><FileText :size="16" /></div>
                <div class="info-label">项目类型</div>
                <div class="info-value">{{ bidDetail.projectType }}</div>
              </div>
              <div class="info-item">
                <div class="info-icon"><Calendar :size="16" /></div>
                <div class="info-label">发布日期</div>
                <div class="info-value">{{ bidDetail.publishDate }}</div>
              </div>
            </div>
          </div>

          <!-- 招标公告全文 -->
          <div class="content-card">
            <div class="card-header">
              <h2 class="card-title">招标公告</h2>
            </div>
            <div class="announcement-content">
              <pre class="content-text">{{ bidDetail.content }}</pre>
            </div>
          </div>

          <!-- 附件列表 -->
          <div class="attachments-card">
            <div class="card-header">
              <h2 class="card-title">相关附件</h2>
            </div>
            <div class="attachments-list">
              <div
                v-for="(attachment, index) in bidDetail.attachments"
                :key="index"
                class="attachment-item"
                @click="downloadAttachment(attachment)"
              >
                <FileText :size="18" class="attachment-icon" />
                <div class="attachment-info">
                  <span class="attachment-name">{{ attachment.name }}</span>
                  <span class="attachment-size">{{ attachment.size }}</span>
                </div>
                <Download :size="16" class="download-icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧匹配分析 -->
        <div class="side-panel">
          <div class="match-analysis-card">
            <div class="card-header">
              <h3 class="card-title">匹配度分析</h3>
            </div>
            <div class="match-score-display">
              <div class="score-circle" :class="getMatchClass(bidDetail.matchLevel)">
                <span class="score-value">{{ bidDetail.matchScore }}</span>
                <span class="score-label">分</span>
              </div>
              <span class="score-text">{{ getMatchText(bidDetail.matchLevel) }}</span>
            </div>
            <div class="match-reasons">
              <div
                v-for="(reason, index) in bidDetail.matchReasons"
                :key="index"
                class="reason-item"
              >
                <div class="reason-keyword">
                  <span class="keyword-tag">{{ reason.keyword }}</span>
                  <span class="match-status matched" v-if="reason.matched">匹配</span>
                </div>
                <div class="reason-desc">{{ reason.description }}</div>
              </div>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="quick-actions-card">
            <button class="quick-action-btn primary" @click="viewAnalysis">
              <FileSearch :size="18" />
              <span>AI智能解读</span>
            </button>
            <button class="quick-action-btn" @click="addToKnowledge">
              <BookmarkPlus :size="18" />
              <span>添加到知识库</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bid-detail-page {
  height: 100%;
  background: #f5f6fa;
  overflow-y: auto;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
}

/* 顶部导航 */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: #f0a03d;
  color: #f0a03d;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.header-btn:hover {
  border-color: #f0a03d;
  color: #f0a03d;
}

.header-btn.primary {
  background: #f0a03d;
  border-color: #f0a03d;
  color: white;
}

.header-btn.primary:hover {
  background: #d8902f;
}

.star-filled {
  color: #f0a03d;
  fill: #f0a03d;
}

/* 主内容布局 */
.detail-content {
  display: flex;
  gap: 20px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.side-panel {
  width: 300px;
  flex-shrink: 0;
}

/* 标题区域 */
.title-section {
  background: white;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.match-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
}

.match-high {
  background: #dcfce7;
  color: #16a34a;
}

.match-medium {
  background: #fef3c7;
  color: #d97706;
}

.match-low {
  background: #fee2e2;
  color: #dc2626;
}

.bid-title {
  font-size: 20px;
  font-weight: 600;
  color: #222;
  line-height: 1.5;
  margin: 0;
}

/* 基本信息卡片 */
.info-card {
  background: white;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-icon {
  color: #f0a03d;
  margin-bottom: 4px;
}

.info-label {
  font-size: 12px;
  color: #999;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.info-value.highlight {
  color: #f0a03d;
}

.info-value.warning {
  color: #dc2626;
}

/* 招标公告卡片 */
.content-card,
.attachments-card {
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.announcement-content {
  padding: 24px;
}

.content-text {
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #444;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

/* 附件列表 */
.attachments-list {
  padding: 16px 24px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.attachment-item:last-child {
  margin-bottom: 0;
}

.attachment-item:hover {
  background: #fff9f0;
}

.attachment-icon {
  color: #f0a03d;
}

.attachment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.attachment-name {
  font-size: 14px;
  color: #333;
}

.attachment-size {
  font-size: 12px;
  color: #999;
}

.download-icon {
  color: #999;
}

.attachment-item:hover .download-icon {
  color: #f0a03d;
}

/* 匹配分析卡片 */
.match-analysis-card,
.quick-actions-card {
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.match-analysis-card .card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.match-analysis-card .card-title {
  font-size: 14px;
}

.match-score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.score-circle.match-high {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.score-circle.match-medium {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.score-circle.match-low {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.score-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.score-circle.match-high .score-value { color: #16a34a; }
.score-circle.match-medium .score-value { color: #d97706; }
.score-circle.match-low .score-value { color: #dc2626; }

.score-label {
  font-size: 12px;
  color: #666;
}

.score-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.match-reasons {
  padding: 16px 20px;
}

.reason-item {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.reason-item:last-child {
  border-bottom: none;
}

.reason-keyword {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.keyword-tag {
  padding: 2px 8px;
  background: #fff9f0;
  border: 1px solid #ffd699;
  border-radius: 4px;
  font-size: 12px;
  color: #b37700;
}

.match-status {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 3px;
}

.match-status.matched {
  background: #dcfce7;
  color: #16a34a;
}

.reason-desc {
  font-size: 12px;
  color: #888;
}

/* 快速操作卡片 */
.quick-actions-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  border-color: #f0a03d;
  color: #f0a03d;
}

.quick-action-btn.primary {
  background: #f0a03d;
  border-color: #f0a03d;
  color: white;
}

.quick-action-btn.primary:hover {
  background: #d8902f;
}

/* 响应式 */
@media (max-width: 1024px) {
  .detail-content {
    flex-direction: column;
  }

  .side-panel {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-wrap: wrap;
  }
}
</style>
