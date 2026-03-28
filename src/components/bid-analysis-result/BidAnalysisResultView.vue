<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
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
import type { DocumentSection } from './types';
import {
  projectInfo as mockProjectInfo,
  qualifications as mockQualifications,
  scoreStandards as mockScoreStandards,
  timeline as mockTimeline,
  matchAssessment as mockMatchAssessment,
  suggestions as mockSuggestions,
  performanceRequirements as mockPerformanceRequirements,
  teamRequirements as mockTeamRequirements,
  commitmentRequirements as mockCommitmentRequirements,
  disqualificationItems as mockDisqualificationItems,
  actionPlan as mockActionPlan,
  documentSections as mockDocumentSections
} from './mockData';

const router = useRouter();
const route = useRoute();

const bidTitle = route.query.title as string || 'XX市政府信息系统安全等级保护测评服务项目';

// AI Analysis Report Text
const analysisReport = ref(`**【核心结论】本项目与我司核心能力高度契合，具备较强竞争优势，建议积极参与投标。**

**一、项目背景与需求分析**

本项目采购方为XX市政务服务中心，项目预算50万元，采用公开招标方式。要求投标人具备等级保护测评资质、ISO27001信息安全管理体系认证，并需提供3年内至少3个同类项目业绩。从招标文件看，采购方对测评机构的专业能力、技术方案的科学性以及服务质量的稳定性有较高要求，这与当前政府机构对信息安全工作日益重视的大背景相符。

项目的核心难点在于三个方面：首先是技术方案的完整性和先进性，需要投标人展示成熟的测评方法论和工具体系；其次是业绩证明的充分性，要求提供政府类同类项目案例，且需附带客户评价；第三是团队配置的专业性，项目负责人需持有CISP证书，测评团队需具备相应的技术资质和实战经验。这三个方面构成了本次投标的主要门槛，也是评标过程中的核心考量因素。

**二、我司核心竞争优势**

金盾检测作为专业的第三方检测机构，在本项目中具备显著的竞争优势。

首先，我司拥有完整的资质体系。公司持有CMA中国计量认证、CNAS实验室认可以及CATL建设工程质量检测机构资质，完全满足招标文件对等级保护测评资质和ISO27001认证的要求。这些权威认证不仅是准入门槛，更是我司专业能力的有力证明，能够在资格审查阶段确保顺利通过。

其次，在业绩方面，我司近五年累计完成各类检测项目超过15000项，其中包括大量政府机构和大型央企的信息安全测评项目。我们曾为北京市政府、上海市住建委等政府部门提供过等级保护测评服务，并在北京大兴国际机场配套工程、雄安新区市政基础设施等国家重点工程中承担检测任务。这些高质量的项目经验完全符合招标文件对"3年内至少3个同类项目业绩"的要求，且项目规模和客户层级均具有较强的说服力，在业绩评分中将占据明显优势。

第三，技术实力是我司的核心优势。公司配备价值超过8000万元的先进检测设备，包括电子万能试验机、X射线衍射仪、气相色谱质谱联用仪等高精度仪器300余台套，能够为信息系统安全测评提供全面的技术支撑。同时，我司自主研发的"智能检测数据管理系统"实现了检测流程全程数字化管理，大幅提升了测评效率和数据追溯能力，这在技术方案评分中将是重要的加分项。

第四，团队配置方面，我司拥有120余名专业技术人员，其中高级工程师18人、注册结构工程师5人、注册岩土工程师3人，80%以上人员具有本科及以上学历。我们可以为本项目配置持有CISP证书的项目负责人，并组建包括高级测评师在内的专业团队，确保项目实施的专业性和稳定性。团队成员在政府信息系统测评领域积累了丰富的实战经验，能够准确把握政府机构的特殊需求和安全要求。

**三、投标策略建议**

基于以上分析，我们建议采取以下投标策略。

在技术方案编制上，应重点突出我司的方法论优势和工具体系。建议详细阐述我司在等级保护测评领域的技术积累，包括测评流程的标准化、测评工具的智能化以及数据管理的数字化，展示我司在技术方案完整性和先进性方面的领先地位。同时，可以结合以往政府类项目的成功案例，说明我司对政府信息系统特点的深刻理解和丰富的实战经验。技术方案应当体现出对本项目具体需求的精准把握，避免泛泛而谈，要有针对性地提出解决方案。

在业绩证明方面，建议精选5个最具代表性的政府类等级保护测评项目，重点突出项目规模、服务质量和客户评价。可以提供北京市政府、上海市住建委等权威客户的推荐信或评价材料，增强业绩的说服力。同时，应详细说明这些项目的测评范围、技术难点和解决方案，展示我司的专业能力。业绩材料要做到真实可查、证据充分，避免因材料不全或真实性存疑而失分。

在团队配置上，建议配置经验丰富的项目负责人和高级测评师，并在投标文件中详细列出团队成员的资质证书、项目经验和技术专长。可以强调团队的稳定性和协作能力，说明我司完善的人才培养体系和质量管理体系，确保项目实施的可靠性。人员配置要与项目规模相匹配，既要体现专业性，又要避免过度配置导致成本过高。

在报价策略上，考虑到项目预算为50万元，建议报价控制在40-45万元之间，既体现合理的性价比，又避免因报价过低引起质疑。可以在报价说明中详细列出成本构成，包括人员投入、设备使用、差旅费用等，增强报价的透明度和合理性。报价应当充分考虑项目实施的实际成本，确保在中标后能够保质保量完成项目，避免因成本控制不当影响服务质量。

**四、风险提示与应对**

需要注意的是，本项目的竞争可能较为激烈，其他具备等级保护测评资质的机构也可能参与投标。因此，我们需要在投标文件中充分展示我司的差异化优势，特别是在技术方案的创新性、业绩案例的权威性和团队配置的专业性方面，形成明显的竞争优势。

此外，招标文件要求项目负责人持有CISP证书，我们需要提前确认人员安排，确保投标文件中的人员配置真实可靠。同时，应准备充分的资质证明材料，包括等级保护测评资质证书、ISO27001认证证书、业绩合同和验收报告等，确保投标文件的完整性和规范性。投标文件的编制要严格按照招标文件要求，避免因格式不规范或材料缺失导致废标。

在时间安排上，需要注意招标文件规定的各个时间节点，特别是答疑截止时间和投标截止时间，确保在规定时间内完成投标文件的编制和递交。建议提前准备，预留充足的时间进行内部审核和修改完善，避免因时间紧张导致投标文件质量不高。

**五、综合评估**

综合来看，本项目与金盾检测的核心业务高度契合，我司在资质、业绩、技术和团队等方面均具备显著优势，项目中标概率较高。建议公司高度重视本项目，组织精干力量编制高质量的投标文件，充分展示我司的专业能力和服务优势，力争成功中标。

同时，本项目的成功实施将进一步提升我司在政府信息安全测评领域的品牌影响力，为后续业务拓展奠定良好基础。政府类项目具有较强的示范效应，成功案例将有助于我司在同类市场中建立口碑，吸引更多优质客户。因此，无论从短期收益还是长期发展来看，本项目都具有重要的战略意义，值得我司全力以赴争取。`);

// Use mock data
const projectInfo = ref(mockProjectInfo);
const qualifications = ref(mockQualifications);
const scoreStandards = ref(mockScoreStandards);
const timeline = ref(mockTimeline);
const matchAssessment = ref(mockMatchAssessment);
const suggestions = ref(mockSuggestions);
const performanceRequirements = ref(mockPerformanceRequirements);
const teamRequirements = ref(mockTeamRequirements);
const commitmentRequirements = ref(mockCommitmentRequirements);
const disqualificationItems = ref(mockDisqualificationItems);
const actionPlan = ref(mockActionPlan);
const documentSections = ref<DocumentSection[]>(mockDocumentSections);

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
  highlightText.value = searchText;
  activeSection.value = targetSection;

  const element = document.getElementById(targetSection);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => {
    highlightText.value = null;
    activeSection.value = null;
  }, 2000);
};

const goBack = () => {
  router.push({ name: 'bid-subscription' });
};

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
    name: 'bid-doc-oneclick-form',
    query: { bidId: route.query.bidId, title: bidTitle },
  });
};

const handleExport = () => {
  alert('解读报告已导出为PDF');
};

// Resizable panels
const leftPanelWidth = ref(50);
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
        <button class="action-btn secondary" @click="handleExport">
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
          <!-- 纯文本分析报告 -->
          <div class="report-text-content">
            <div class="report-text">
              <div class="conclusion-box">
                <strong>【核心结论】</strong>本项目与我司核心能力高度契合，具备较强竞争优势，建议积极参与投标。
              </div>

              <h3>一、项目背景与需求分析</h3>
              <p>本项目采购方为XX市政务服务中心，项目预算50万元，采用公开招标方式。要求投标人具备等级保护测评资质、ISO27001信息安全管理体系认证，并需提供3年内至少3个同类项目业绩。从招标文件看，采购方对测评机构的专业能力、技术方案的科学性以及服务质量的稳定性有较高要求，这与当前政府机构对信息安全工作日益重视的大背景相符。</p>
              <p>项目的核心难点在于三个方面：首先是技术方案的完整性和先进性，需要投标人展示成熟的测评方法论和工具体系；其次是业绩证明的充分性，要求提供政府类同类项目案例，且需附带客户评价；第三是团队配置的专业性，项目负责人需持有CISP证书，测评团队需具备相应的技术资质和实战经验。这三个方面构成了本次投标的主要门槛，也是评标过程中的核心考量因素。</p>

              <h3>二、我司核心竞争优势</h3>
              <p>金盾检测作为专业的第三方检测机构，在本项目中具备显著的竞争优势。</p>
              <p>首先，我司拥有完整的资质体系。公司持有CMA中国计量认证、CNAS实验室认可以及CATL建设工程质量检测机构资质，完全满足招标文件对等级保护测评资质和ISO27001认证的要求。这些权威认证不仅是准入门槛，更是我司专业能力的有力证明，能够在资格审查阶段确保顺利通过。</p>
              <p>其次，在业绩方面，我司近五年累计完成各类检测项目超过15000项，其中包括大量政府机构和大型央企的信息安全测评项目。我们曾为北京市政府、上海市住建委等政府部门提供过等级保护测评服务，并在北京大兴国际机场配套工程、雄安新区市政基础设施等国家重点工程中承担检测任务。这些高质量的项目经验完全符合招标文件对"3年内至少3个同类项目业绩"的要求，且项目规模和客户层级均具有较强的说服力，在业绩评分中将占据明显优势。</p>
              <p>第三，技术实力是我司的核心优势。公司配备价值超过8000万元的先进检测设备，包括电子万能试验机、X射线衍射仪、气相色谱质谱联用仪等高精度仪器300余台套，能够为信息系统安全测评提供全面的技术支撑。同时，我司自主研发的"智能检测数据管理系统"实现了检测流程全程数字化管理，大幅提升了测评效率和数据追溯能力，这在技术方案评分中将是重要的加分项。</p>
              <p>第四，团队配置方面，我司拥有120余名专业技术人员，其中高级工程师18人、注册结构工程师5人、注册岩土工程师3人，80%以上人员具有本科及以上学历。我们可以为本项目配置持有CISP证书的项目负责人，并组建包括高级测评师在内的专业团队，确保项目实施的专业性和稳定性。团队成员在政府信息系统测评领域积累了丰富的实战经验，能够准确把握政府机构的特殊需求和安全要求。</p>

              <h3>三、投标策略建议</h3>
              <p>基于以上分析，我们建议采取以下投标策略。</p>
              <p>在技术方案编制上，应重点突出我司的方法论优势和工具体系。建议详细阐述我司在等级保护测评领域的技术积累，包括测评流程的标准化、测评工具的智能化以及数据管理的数字化，展示我司在技术方案完整性和先进性方面的领先地位。同时，可以结合以往政府类项目的成功案例，说明我司对政府信息系统特点的深刻理解和丰富的实战经验。技术方案应当体现出对本项目具体需求的精准把握，避免泛泛而谈，要有针对性地提出解决方案。</p>
              <p>在业绩证明方面，建议精选5个最具代表性的政府类等级保护测评项目，重点突出项目规模、服务质量和客户评价。可以提供北京市政府、上海市住建委等权威客户的推荐信或评价材料，增强业绩的说服力。同时，应详细说明这些项目的测评范围、技术难点和解决方案，展示我司的专业能力。业绩材料要做到真实可查、证据充分，避免因材料不全或真实性存疑而失分。</p>
              <p>在团队配置上，建议配置经验丰富的项目负责人和高级测评师，并在投标文件中详细列出团队成员的资质证书、项目经验和技术专长。可以强调团队的稳定性和协作能力，说明我司完善的人才培养体系和质量管理体系，确保项目实施的可靠性。人员配置要与项目规模相匹配，既要体现专业性，又要避免过度配置导致成本过高。</p>
              <p>在报价策略上，考虑到项目预算为50万元，建议报价控制在40-45万元之间，既体现合理的性价比，又避免因报价过低引起质疑。可以在报价说明中详细列出成本构成，包括人员投入、设备使用、差旅费用等，增强报价的透明度和合理性。报价应当充分考虑项目实施的实际成本，确保在中标后能够保质保量完成项目，避免因成本控制不当影响服务质量。</p>

              <h3>四、风险提示与应对</h3>
              <p>需要注意的是，本项目的竞争可能较为激烈，其他具备等级保护测评资质的机构也可能参与投标。因此，我们需要在投标文件中充分展示我司的差异化优势，特别是在技术方案的创新性、业绩案例的权威性和团队配置的专业性方面，形成明显的竞争优势。</p>
              <p>此外，招标文件要求项目负责人持有CISP证书，我们需要提前确认人员安排，确保投标文件中的人员配置真实可靠。同时，应准备充分的资质证明材料，包括等级保护测评资质证书、ISO27001认证证书、业绩合同和验收报告等，确保投标文件的完整性和规范性。投标文件的编制要严格按照招标文件要求，避免因格式不规范或材料缺失导致废标。</p>
              <p>在时间安排上，需要注意招标文件规定的各个时间节点，特别是答疑截止时间和投标截止时间，确保在规定时间内完成投标文件的编制和递交。建议提前准备，预留充足的时间进行内部审核和修改完善，避免因时间紧张导致投标文件质量不高。</p>

              <h3>五、综合评估</h3>
              <p>综合来看，本项目与金盾检测的核心业务高度契合，我司在资质、业绩、技术和团队等方面均具备显著优势，项目中标概率较高。建议公司高度重视本项目，组织精干力量编制高质量的投标文件，充分展示我司的专业能力和服务优势，力争成功中标。</p>
              <p>同时，本项目的成功实施将进一步提升我司在政府信息安全测评领域的品牌影响力，为后续业务拓展奠定良好基础。政府类项目具有较强的示范效应，成功案例将有助于我司在同类市场中建立口碑，吸引更多优质客户。因此，无论从短期收益还是长期发展来看，本项目都具有重要的战略意义，值得我司全力以赴争取。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
@import './styles.css';

/* Report Text Content */
.report-text-content {
  padding: 32px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.report-text {
  font-size: 15px;
  line-height: 2;
  color: #374151;
}

/* Conclusion Box - 核心结论 */
.conclusion-box {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 48px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  font-size: 16px;
  color: #1f2937;
  line-height: 1.8;
}

.conclusion-box strong {
  font-size: 16px;
  font-weight: 700;
  color: #1e40af;
}

/* Section Headings - 大章节标题 */
.report-text h3 {
  font-weight: 600;
  color: #1f2937;
  font-size: 17px;
  margin-top: 48px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.report-text h3:first-of-type {
  margin-top: 0;
}

/* Paragraphs */
.report-text p {
  margin-bottom: 18px;
  text-indent: 2em;
  text-align: justify;
  line-height: 2;
}

.report-text p:last-child {
  margin-bottom: 0;
}
</style>
