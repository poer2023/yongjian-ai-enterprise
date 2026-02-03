<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  Type,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Grid3X3,
  Code,
  Image,
  BarChart3,
  Table2,
  Search,
  FileText,
  LayoutGrid,
  Sparkles,
  Zap,
  Clock,
  Presentation,
  Edit3
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Outline data - bid document structure
const outlineItems = ref([
  { id: '1', title: '第一章 投标函', level: 1, children: [] },
  { id: '2', title: '第二章 法定代表人身份证明', level: 1, children: [] },
  { id: '3', title: '第三章 投标人基本情况', level: 1, children: [
    { id: '3.1', title: '3.1 企业概况', level: 2 },
    { id: '3.2', title: '3.2 资质证书', level: 2 },
    { id: '3.3', title: '3.3 财务状况', level: 2 },
  ]},
  { id: '4', title: '第四章 技术方案', level: 1, children: [
    { id: '4.1', title: '4.1 项目理解与需求分析', level: 2 },
    { id: '4.2', title: '4.2 总体技术方案', level: 2 },
    { id: '4.3', title: '4.3 系统架构设计', level: 2 },
    { id: '4.4', title: '4.4 功能模块设计', level: 2 },
  ]},
  { id: '5', title: '第五章 项目实施方案', level: 1, children: [
    { id: '5.1', title: '5.1 项目组织架构', level: 2 },
    { id: '5.2', title: '5.2 实施计划与进度', level: 2 },
    { id: '5.3', title: '5.3 质量保障措施', level: 2 },
  ]},
  { id: '6', title: '第六章 售后服务方案', level: 1, children: [
    { id: '6.1', title: '6.1 服务承诺', level: 2 },
    { id: '6.2', title: '6.2 培训方案', level: 2 },
    { id: '6.3', title: '6.3 运维支持', level: 2 },
  ]},
  { id: '7', title: '第七章 商务报价', level: 1, children: [] },
  { id: '8', title: '第八章 业绩案例', level: 1, children: [] },
  { id: '9', title: '第九章 项目团队', level: 1, children: [] },
]);

const activeOutlineId = ref('1');

const goBack = () => {
  router.push({ name: 'bid-doc-form' });
};

const selectOutline = (id: string) => {
  activeOutlineId.value = id;
};

const exportWord = () => {
  alert('Word文档已导出');
};
</script>

<template>
  <div class="result-page-fullscreen">
    <!-- Header -->
    <header class="result-header">
      <!-- Left blue section -->
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" />
        </button>
        <div class="header-tag">AI标书生成</div>
        <div class="header-title">智慧城市数据中台建设项目投标文件</div>
        <div class="header-status">已保存</div>
      </div>

      <!-- Right white section -->
      <div class="header-right">
        <div class="format-toolbar">
          <button class="toolbar-btn"><Type :size="16" /></button>
          <button class="toolbar-btn"><Undo2 :size="16" /></button>
          <button class="toolbar-btn"><Redo2 :size="16" /></button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn text-btn">H1</button>
          <button class="toolbar-btn text-btn">H2</button>
          <button class="toolbar-btn text-btn">H3</button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn"><Bold :size="16" /></button>
          <button class="toolbar-btn"><Italic :size="16" /></button>
          <button class="toolbar-btn"><Underline :size="16" /></button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn"><Grid3X3 :size="16" /></button>
          <button class="toolbar-btn"><Code :size="16" /></button>
        </div>
        <button class="export-btn" @click="exportWord">
          导出Word
        </button>
      </div>
    </header>

    <div class="result-body">
      <!-- Left Outline Panel -->
      <aside class="outline-panel">
        <h3 class="outline-title">大纲</h3>
        <div class="outline-list">
          <template v-for="item in outlineItems" :key="item.id">
            <div
              class="outline-item level-1"
              :class="{ active: activeOutlineId === item.id }"
              @click="selectOutline(item.id)"
            >
              {{ item.title }}
            </div>
            <template v-if="item.children">
              <div
                v-for="sub in item.children"
                :key="sub.id"
                class="outline-item level-2"
                :class="{ active: activeOutlineId === sub.id }"
                @click="selectOutline(sub.id)"
              >
                {{ sub.title }}
              </div>
            </template>
          </template>
        </div>
      </aside>

      <!-- Center Content Panel -->
      <main class="content-panel">
        <div class="document-container">
          <div class="document-wrapper">
            <article class="document-content">
              <h1 class="doc-title">智慧城市数据中台建设项目<br/>投标文件（技术标）</h1>

              <div class="doc-meta">
                <div class="meta-row">
                  <span class="meta-label">项目名称：</span>
                  <span>XX市智慧城市数据中台建设项目</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">项目编号：</span>
                  <span>XXZC-2026-0128</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">投标人：</span>
                  <span>深圳市智云科技有限公司</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">投标日期：</span>
                  <span>2026年2月15日</span>
                </div>
              </div>

              <h2 class="doc-heading">第一章 投标函</h2>

              <p class="doc-paragraph">
                致：XX市公共资源交易中心
              </p>

              <p class="doc-paragraph">
                根据贵方发布的《XX市智慧城市数据中台建设项目》（项目编号：XXZC-2026-0128）招标文件，我方经认真研究招标文件的全部内容，决定参加本项目的投标。
              </p>

              <p class="doc-paragraph">
                一、我方愿意按照招标文件规定的各项要求，以人民币（大写）壹仟贰佰捌拾万元整（小写：¥12,800,000.00元）的投标总价，承担本项目的全部工作内容，并在合同签订后180个日历日内完成项目交付。
              </p>

              <p class="doc-paragraph">
                二、我方承诺：如中标，将严格按照招标文件要求和投标文件承诺的内容履行合同义务，确保项目质量、进度和服务水平达到招标文件规定的标准。
              </p>

              <p class="doc-paragraph">
                三、我方同意所递交的投标文件在投标有效期（90天）内有效，在此期间如中标，我方将受此约束。
              </p>

              <p class="doc-paragraph">
                四、我方理解：贵方不一定接受最低报价的投标或收到的任何投标。
              </p>

              <div class="doc-signature">
                <p>投标人（盖章）：深圳市智云科技有限公司</p>
                <p>法定代表人或授权代表（签字）：___________</p>
                <p>日期：2026年2月15日</p>
              </div>

              <h2 class="doc-heading">第四章 技术方案</h2>

              <h3 class="doc-subheading">4.1 项目理解与需求分析</h3>

              <p class="doc-paragraph">
                本项目旨在建设XX市智慧城市数据中台，实现全市政务数据的统一汇聚、治理、共享和开放，为各委办局业务系统提供标准化的数据服务能力，支撑城市精细化治理和公共服务智能化升级。
              </p>

              <p class="doc-paragraph">
                通过深入分析招标文件，我方认为项目建设的核心目标包括：（1）构建统一的数据资源池，打破部门间数据壁垒；（2）建立数据标准规范体系，提升数据质量和可用性；（3）搭建数据服务平台，支撑跨部门业务协同；（4）强化数据安全保障，确保数据合规使用。
              </p>

              <h3 class="doc-subheading">4.2 总体技术方案</h3>

              <p class="doc-paragraph">
                我方采用"平台+应用+服务"的总体架构设计，以云原生技术为底座，构建弹性可扩展的数据中台体系。整体方案分为基础设施层、数据服务层、应用支撑层和业务应用层四个层次，同时配套建设安全保障体系和运维管理体系。
              </p>

              <p class="doc-paragraph">
                技术选型方面，数据存储采用分布式数据库集群，支持PB级数据存储和高并发访问；数据计算采用Spark+Flink混合计算引擎，满足批处理和实时计算双重需求；数据治理采用自研的智能数据治理平台，提供数据质量检测、血缘分析、标签管理等核心能力。
              </p>

              <h3 class="doc-subheading">4.3 系统架构设计</h3>

              <p class="doc-paragraph">
                系统采用微服务架构，基于Kubernetes容器编排平台实现服务的弹性伸缩和高可用部署。核心服务包括数据接入服务、数据存储服务、数据计算服务、数据治理服务、数据服务网关、统一门户等模块，各服务之间通过API网关进行统一管理和调度。
              </p>

              <p class="doc-paragraph">
                在高可用设计方面，采用主备双活架构，RPO≤0，RTO≤30分钟；关键组件均采用集群部署，单点故障自动切换；数据存储采用多副本机制，确保数据持久性和一致性。
              </p>
            </article>

            <!-- Edit icon -->
            <button class="doc-edit-btn">
              <Edit3 :size="14" />
            </button>
          </div>
        </div>
      </main>

      <!-- Right AI Tools Panel -->
      <aside class="ai-tools-panel">
        <!-- AI Text Edit -->
        <div class="tool-section">
          <div class="section-header">
            <Edit3 :size="16" class="section-icon blue" />
            <span class="section-title">AI文本编辑</span>
          </div>
          <p class="section-desc">选中文字后，点击对应文本编辑工具</p>
          <div class="ai-edit-grid">
            <button class="ai-edit-btn">改写</button>
            <button class="ai-edit-btn">扩写</button>
            <button class="ai-edit-btn">缩写</button>
            <button class="ai-edit-btn">翻译</button>
          </div>
        </div>

        <!-- Multi-modal AI Generation -->
        <div class="tool-section">
          <div class="section-header">
            <Sparkles :size="16" class="section-icon purple" />
            <span class="section-title">多模态AI生成</span>
          </div>
          <p class="section-desc">选中文字后，点击对应多模态生成工具</p>
          <div class="multimodal-grid">
            <button class="multimodal-btn">
              <BarChart3 :size="24" />
              <span>示意图</span>
            </button>
            <button class="multimodal-btn">
              <LayoutGrid :size="24" />
              <span>图表</span>
            </button>
            <button class="multimodal-btn">
              <Image :size="24" />
              <span>图片</span>
            </button>
            <button class="multimodal-btn">
              <Table2 :size="24" />
              <span>表格</span>
            </button>
            <button class="multimodal-btn">
              <Code :size="24" />
              <span>公式</span>
            </button>
          </div>
        </div>

        <!-- Academic Optimization -->
        <div class="tool-section">
          <div class="section-header">
            <FileText :size="16" class="section-icon green" />
            <span class="section-title">学术优化</span>
          </div>
          <div class="academic-grid">
            <button class="academic-btn">
              <Search :size="20" />
              <span>学术搜索</span>
            </button>
            <button class="academic-btn active">
              <FileText :size="20" />
              <span>文献格式</span>
            </button>
            <button class="academic-btn">
              <BarChart3 :size="20" />
              <span>图表排序</span>
            </button>
          </div>
        </div>

        <!-- Document to PPT -->
        <div class="tool-section ppt-section">
          <div class="section-header">
            <Presentation :size="16" class="section-icon orange" />
            <span class="section-title">文档转PPT</span>
          </div>
          <div class="ppt-features">
            <div class="ppt-feature">
              <Zap :size="14" class="feature-icon green" />
              <span class="feature-label">智能匹配</span>
              <span class="feature-tag green">100%忠于原文内容生成</span>
            </div>
            <div class="ppt-feature">
              <Sparkles :size="14" class="feature-icon red" />
              <span class="feature-label">专业排版</span>
              <span class="feature-desc">海量模版选择，专业图示效果</span>
            </div>
            <div class="ppt-feature">
              <Clock :size="14" class="feature-icon yellow" />
              <span class="feature-label">省时省力</span>
              <span class="feature-desc">只需几分钟，演讲、汇报轻松搞定</span>
            </div>
          </div>
          <button class="ppt-generate-btn">
            立即生成专业PPT
            <Presentation :size="18" />
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.result-page-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  z-index: 100;
}

/* Header */
.result-header {
  display: flex;
  height: 54px;
  background: white;
  border-bottom: 1px solid #e8ecf1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: #eef4ff;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 10px 20px;
  background: #eef4ff;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #eef4ff;
  border: none;
  border-radius: 10px;
  color: #4b83f0;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dde9ff;
}

.header-tag {
  padding: 6px 14px;
  background: white;
  color: #4b83f0;
  border: 1px solid #4b83f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.header-title {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 400;
}

.header-status {
  color: #999;
  font-size: 13px;
}

.format-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn.text-btn {
  font-size: 13px;
  font-weight: 600;
  width: auto;
  padding: 0 8px;
}

.toolbar-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.toolbar-divider {
  width: 1px;
  height: 16px;
  background: #e0e0e0;
  margin: 0 6px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #4b83f0;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 16px;
}

.export-btn:hover {
  background: #3a6fd8;
}

/* Body Layout */
.result-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Outline Panel */
.outline-panel {
  width: 340px;
  background: white;
  border-right: 1px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.outline-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 20px 24px 16px;
  margin: 0;
}

.outline-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 20px;
}

.outline-item {
  padding: 12px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.6;
  margin-bottom: 2px;
}

.outline-item:hover {
  background: #f8f9fb;
}

.outline-item.active {
  background: #eef4ff;
  color: #4b83f0;
}

.outline-item.level-1 {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 14px;
}

.outline-item.level-2 {
  padding-left: 28px;
  font-size: 13px;
  color: #666;
}

/* Content Panel */
.content-panel {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
  background: #f5f7fa;
}

.document-container {
  max-width: 820px;
  margin: 0 auto;
}

.document-wrapper {
  position: relative;
}

.document-content {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 48px 56px;
  min-height: 800px;
}

.doc-edit-btn {
  position: absolute;
  top: 48px;
  right: -40px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
}

.doc-edit-btn:hover {
  color: #4b83f0;
  border-color: #4b83f0;
}

.doc-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 28px 0;
  line-height: 1.5;
}

.doc-meta {
  text-align: left;
  font-size: 14px;
  color: #333;
  margin-bottom: 24px;
}

.doc-paragraph {
  font-size: 15px;
  color: #333;
  line-height: 2;
  margin: 0 0 20px 0;
  text-align: justify;
  text-indent: 2em;
}

.doc-heading {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 36px 0 20px 0;
}

.doc-subheading {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 28px 0 16px 0;
}

/* AI Tools Panel */
.ai-tools-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #e8ecf1;
  overflow-y: auto;
  padding: 20px;
}

.tool-section {
  margin-bottom: 28px;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.section-icon {
  flex-shrink: 0;
}

.section-icon.blue {
  color: #4b83f0;
}

.section-icon.purple {
  color: #9b59b6;
}

.section-icon.green {
  color: #27ae60;
}

.section-icon.orange {
  color: #e74c3c;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.section-desc {
  font-size: 12px;
  color: #999;
  margin: 0 0 14px 0;
}

/* AI Edit Buttons */
.ai-edit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.ai-edit-btn {
  padding: 12px 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-edit-btn:hover {
  border-color: #4b83f0;
  color: #4b83f0;
  background: #f8fbff;
}

/* Multi-modal Grid */
.multimodal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.multimodal-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px 10px;
  background: #f8f9fb;
  border: 1px solid #eee;
  border-radius: 8px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.multimodal-btn:hover {
  background: #eef4ff;
  border-color: #4b83f0;
  color: #4b83f0;
}

/* Academic Grid */
.academic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.academic-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 10px;
  background: #f8f9fb;
  border: 1px solid #eee;
  border-radius: 8px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.academic-btn:hover {
  background: #eef4ff;
  border-color: #4b83f0;
  color: #4b83f0;
}

.academic-btn.active {
  background: #eef4ff;
  border-color: #4b83f0;
  color: #4b83f0;
}

/* PPT Section */
.ppt-section {
  background: #fff;
  border-radius: 8px;
  padding: 0;
}

.ppt-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.ppt-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.feature-icon {
  flex-shrink: 0;
}

.feature-icon.green {
  color: #27ae60;
}

.feature-icon.red {
  color: #e74c3c;
}

.feature-icon.yellow {
  color: #f39c12;
}

.feature-label {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.feature-tag {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.feature-tag.green {
  background: #e8f8ef;
  color: #27ae60;
}

.feature-desc {
  color: #999;
  font-size: 11px;
}

.ppt-generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #f5a623, #e8852e);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.ppt-generate-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 166, 35, 0.3);
}
</style>
