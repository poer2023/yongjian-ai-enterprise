<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ChevronLeft,
  ChevronDown,
  Download,
  BookPlus,
  Users,
} from 'lucide-vue-next';

const router = useRouter();

// Policy group selection (strategy groups)
interface PolicyGroup {
  id: string;
  name: string;
  description: string;
}

const policyGroups: PolicyGroup[] = [
  { id: 'security', name: '网络安全组', description: '等保测评、渗透测试、安全运维' },
  { id: 'classified', name: '等保测评组', description: '等级保护测评、安全整改' },
];

const selectedGroup = ref('security');
const showGroupDropdown = ref(false);

const currentGroup = computed(() => {
  return policyGroups.find(g => g.id === selectedGroup.value);
});

const selectGroup = (id: string) => {
  selectedGroup.value = id;
  showGroupDropdown.value = false;
};

// Report content per group
const reportData: Record<string, {
  title: string;
  subtitle: string;
  generatedAt: string;
  period: string;
  sections: { heading: string; content: string[] }[];
}> = {
  security: {
    title: '网络安全行业分析报告',
    subtitle: '基于「网络安全组」策略组订阅数据的深度分析',
    generatedAt: '2026年2月10日',
    period: '2025年7月 — 2026年1月',
    sections: [
      {
        heading: '一、行业概览',
        content: [
          '网络安全行业在过去六个月内保持了高速增长态势。根据策略组监控数据，本报告期内共采集到网络安全相关招标公告 2,847 条，涉及总预算规模约 128.5 亿元，较上一报告期增长 15.3%。',
          '从行业驱动因素来看，《网络安全法》《数据安全法》以及等保2.0标准的持续落地执行，是推动市场需求稳步增长的核心动力。特别是关键信息基础设施保护条例的实施，使得政府机关、金融机构和国有企业的安全采购预算普遍提升了 20% 以上。',
          '当前市场中活跃的测评服务机构约 486 家，较去年同期增加 12.8%。行业项目平均预算为 45.2 万元，受竞争加剧影响较上期小幅下降 3.5%。',
        ],
      },
      {
        heading: '二、市场趋势分析',
        content: [
          '从月度趋势来看，2024年7月至12月，市场规模呈持续上升态势。其中7月市场规模为 8.2 亿元（198个项目），此后逐月攀升，至12月达到 13.2 亿元（345个项目），半年内增幅达 61%。',
          '分项目类型来看，等保测评类项目占比最高，达到 35%，其次是安全运维（22%）、渗透测试（18%）、安全咨询（15%）以及数据安全评估（10%）。值得注意的是，数据安全评估类项目同比增速最快，达到 42%，反映出数据安全法落地后的强劲市场需求。',
          '从预算分布来看，30-50 万元区间的项目数量最多，占比 21.5%；其次是 10-30 万元区间，占比 30.1%。100 万元以上的大型项目虽然数量仅占 14.9%，但贡献了超过 45% 的市场总额，是各企业重点争夺的对象。',
        ],
      },
      {
        heading: '三、竞争格局',
        content: [
          '当前网络安全招投标市场呈现"一超多强"的竞争格局。排名前5的企业合计中标金额占市场总量的 60% 以上，市场集中度较高。',
          '华安信息技术有限公司以 78 次中标、3,520 万元总金额位居榜首，中标率达 50.0%，在金融和政府行业具有明显优势。中科安全科技股份紧随其后，中标 62 次，总金额 2,890 万元，在政府和能源行业深耕。启明星辰科技、深信服科技股份、奇安信科技集团分列第三至第五名。',
          '我司在本报告期内投标 86 次，中标 42 次，中标率 48.8%，排名第六。中标总金额 1,850 万元，同比增长 23%。我司在等保测评领域具有较强竞争力，但在渗透测试和数据安全领域的中标率偏低，建议加强相关能力建设。',
          '从竞争态势来看，我司与华安信息正面竞争 28 次，胜率为 35.7%。对方在品牌影响力和全国化布局方面占优，但价格偏高且交付周期较长，我司可从性价比和本地化响应速度方面形成差异化优势。',
        ],
      },
      {
        heading: '四、区域市场分析',
        content: [
          '从区域分布来看，北京、上海、广东三地是竞争最激烈的核心市场，合计占全国市场份额的 38%。其中北京市场规模最大（18.5亿元，423个项目），竞争对手多达 85 家。',
          '长三角地区（江苏、浙江、上海）整体市场规模达 37.5 亿元，增速高于全国平均水平。我司在上海市场具有本地化优势，建议以此为根据地向江浙地区辐射拓展。',
          '中西部地区（四川、湖北等）竞争强度相对较低，但市场增速较快。四川市场规模 7.8 亿元，竞争对手仅 35 家，是值得重点拓展的蓝海市场。',
        ],
      },
      {
        heading: '五、客户结构分析',
        content: [
          '政府机关仍然是网络安全采购的最大客户群体，占比 30.1%（856个项目），平均预算 52.3 万元。金融机构虽然项目数量占比仅 14.9%，但平均预算达 85.6 万元，是利润贡献最高的客户群体。',
          '国有企业和事业单位分别占比 21.5% 和 18.8%，采购需求稳定，但决策周期较长。医疗机构和教育机构合计占比 14.8%，受政策驱动影响，等保测评需求增长迅速。',
          '建议根据客户群体的特点制定差异化策略：针对政府客户强调合规性和资质优势，针对金融客户突出技术深度和行业经验，针对中小型机构提供标准化、高性价比的服务方案。',
        ],
      },
      {
        heading: '六、政策法规动态',
        content: [
          '报告期内，影响行业的重要政策法规包括：',
          '（1）《关键信息基础设施安全保护条例》持续落地执行，关基运营者年度测评已成刚需，测评周期固定为每年一次，监管检查力度加大。这直接带动了等保测评市场约 30% 的增量需求。',
          '（2）金融行业网络安全等级保护指引（2024年3月发布）要求金融机构测评周期缩短、增加业务连续性要求，第三方测评机构准入门槛提高。这对持有金融行业相关资质的企业形成利好。',
          '（3）AI 安全标准制定工作加速推进，预计2026年下半年将出台针对智能系统的安全测评规范，届时将形成全新的细分市场，年市场规模预计超过 50 亿元。',
        ],
      },
      {
        heading: '七、风险与挑战',
        content: [
          '价格竞争加剧是当前面临的首要挑战。随着测评机构数量增加，部分企业采取低价竞标策略，行业平均利润率已从 3 年前的 35% 下降至目前的 25% 左右。建议通过提升服务质量、拓展增值服务来应对价格压力。',
          '人才短缺是制约行业发展的另一核心瓶颈。具备资质的测评师供不应求，人力成本年均增长约 15%。建议建立内部人才培养体系，加强校企合作，同时引入自动化工具降低对人工的依赖。',
          '新技术测评能力不足也值得关注。AI、区块链、量子计算等新技术的安全测评尚缺乏成熟的方法论和标准，需要提前储备技术能力和人才。',
        ],
      },
      {
        heading: '八、发展机遇与建议',
        content: [
          '展望下一阶段，以下几个方向值得重点关注：',
          '（1）数据安全评估服务：数据安全法落地后，数据分类分级和安全评估已成为强制要求。预计这一细分市场将带来约 30% 的增量，建议快速建立数据安全测评能力。',
          '（2）云安全测评：企业上云加速推进，云等保测评成为刚需。云安全市场年增长率达 35%，且技术门槛较高，具备先发优势的企业将获得显著竞争优势。',
          '（3）金融行业深耕：金融机构合规需求旺盛，预算充足，复购率高。金融行业安全采购年增长率超过 25%，建议组建专业服务团队深耕该领域。',
          '（4）中西部市场拓展：中西部地区竞争强度低、政策支持力度大，年增长率约 20%。建议布局区域分支机构，建立本地化服务能力。',
          '综合以上分析，建议我司在巩固等保测评核心优势的同时，加快数据安全和云安全能力建设，深耕金融行业客户，并适时向中西部市场拓展，以实现下一阶段 30% 以上的业务增长目标。',
        ],
      },
    ],
  },
  classified: {
    title: '等级保护测评行业分析报告',
    subtitle: '基于「等保测评组」策略组订阅数据的深度分析',
    generatedAt: '2026年2月10日',
    period: '2025年7月 — 2026年1月',
    sections: [
      {
        heading: '一、行业概览',
        content: [
          '等级保护测评是网络安全行业中规模最大、增长最稳定的细分领域。根据等保测评组监控数据，本报告期内共采集到等保测评相关招标公告 1,236 条，涉及总预算规模约 55.8 亿元，较上一报告期增长 18.2%。',
          '等保2.0标准自2019年发布以来，覆盖范围从传统信息系统扩展至云计算、物联网、工业控制系统和大数据平台。截至2026年初，全国已完成等级备案的信息系统超过 28 万个，年度测评需求旺盛。',
          '当前具备等保测评资质的机构约 210 家，市场供需基本平衡。但在部分地区（特别是中西部省份），合格的测评机构相对不足，存在明显的市场空白。',
        ],
      },
      {
        heading: '二、市场趋势分析',
        content: [
          '等保测评市场呈现出明显的季节性特征。每年第四季度（10-12月）是需求高峰期，项目数量约为第一季度的 1.8 倍。这与各单位年末合规检查周期密切相关。',
          '从测评等级来看，三级系统测评占比最高，达到 52%，平均预算为 45-85 万元；二级系统测评占比 38%，平均预算 15-30 万元；四级系统测评虽然占比仅 10%，但平均预算超过 120 万元。',
          '云上等保测评是增长最快的子类别。随着政务云、行业云的大规模部署，云等保测评需求同比增长 42%，预计未来两年仍将保持 30% 以上的增速。主流云平台（阿里云、腾讯云、华为云）上的等保合规需求尤为集中。',
          '复测市场稳步增长。根据规定，三级及以上系统需每年进行一次测评，这形成了稳定的复购需求。目前复测项目约占总项目数的 40%，且利润率高于首次测评，因为对客户环境的熟悉可以显著降低实施成本。',
        ],
      },
      {
        heading: '三、竞争格局',
        content: [
          '等保测评市场的竞争格局与网络安全整体市场有所不同，区域性特征更为明显。由于测评工作需要现场实施，本地化服务能力是核心竞争要素。',
          '全国性的大型测评机构（如华安信息、启明星辰等）虽然品牌影响力强，但在区域市场的覆盖深度有限。相反，区域性测评机构凭借本地客户关系和快速响应能力，在各自区域内往往占据优势地位。',
          '我司在等保测评领域中标率达 52.3%，高于公司整体中标率（48.8%），说明等保测评是我司的优势业务。在上海及周边市场，我司的客户满意度评分位列前三，复测客户留存率达 78%。',
          '主要竞争压力来自价格战。部分新进入市场的机构以低于成本价竞标，尤其在二级系统测评领域较为突出。建议我司坚持服务质量优先策略，在三级以上系统测评中建立技术壁垒。',
        ],
      },
      {
        heading: '四、客户需求分析',
        content: [
          '等保测评的客户群体高度集中在三大领域：政府机关及事业单位（45%）、金融机构（25%）和医疗教育机构（15%）。',
          '政府客户的典型需求特征是：采购流程规范、决策周期较长（通常 2-3 个月）、对资质要求严格、偏好综合服务方案（测评 + 整改 + 复测一站式服务）。这类客户的客单价在 50-80 万元之间。',
          '金融客户的需求特征是：预算充足、技术要求高、测评频率高（部分银行要求半年一次）、对数据安全和业务连续性要求严格。金融客户的客单价通常在 80-150 万元之间，且复购率极高。',
          '医疗和教育机构的需求正在快速释放。三级甲等医院和双一流高校的信息系统多数已完成等保三级备案，年度测评需求稳定。这类客户的价格敏感度较高，平均客单价在 30-50 万元之间。',
        ],
      },
      {
        heading: '五、政策合规要求更新',
        content: [
          '等保2.0标准（GB/T 22239-2019）发布后，测评工作的技术要求显著提升。新增的云计算安全扩展要求、物联网安全扩展要求、移动互联安全扩展要求等，均对测评机构的专业能力提出了更高要求。',
          '2024年下半年，公安部发布了《网络安全等级保护测评报告模板（2024版）》，对测评报告的规范性和完整性提出了更细致的要求。各地公安网安部门的检查力度也在加大，不合格报告的整改通知比例同比上升 25%。',
          '数据安全法与等保制度的融合趋势日益明显。部分地区已开始要求在等保测评中增加数据安全评估内容，形成"等保 + 数安"的综合测评模式。这一趋势预计将在2026年下半年全面推开，届时单个项目的服务范围和预算都将扩大。',
        ],
      },
      {
        heading: '六、技术发展趋势',
        content: [
          'AI辅助自动化测评正在从概念走向实践。目前已有部分测评机构引入AI工具用于自动化漏洞扫描、配置核查和报告初稿生成，可将测评周期缩短 30-40%，降低人力成本约 25%。预计2026-2027年，AI辅助测评将成为行业标配。',
          '云原生安全测评方法论日趋成熟。针对容器化部署、微服务架构、Serverless 应用等云原生场景的专项测评方法已在部分头部机构落地，技术壁垒较高。建议我司加快相关能力建设，抢占先发优势。',
          '零信任架构的推广也在影响等保测评的技术路线。零信任与等保标准的映射关系尚在探索阶段，预计2027年将形成相对成熟的评估框架。提前参与标准讨论和试点项目，将为未来业务布局奠定基础。',
        ],
      },
      {
        heading: '七、风险提示',
        content: [
          '（1）标准更新风险：等保标准和测评报告模板的频繁更新，要求测评团队持续学习和适应。建议建立常态化的内部培训机制，安排专人跟踪标准动态。',
          '（2）价格竞争风险：二级系统测评市场价格已接近成本线，继续参与低价竞争将侵蚀利润。建议将资源向三级及以上系统测评倾斜，同时拓展增值服务（整改咨询、安全运维等）提升客单价。',
          '（3）人才瓶颈：持有等保测评师资质证书的专业人员供不应求。行业统计显示，合格测评师的年薪涨幅已连续三年超过 15%。建议加大校招力度，建立"助理测评师—测评师—高级测评师"的职业发展通道。',
          '（4）质量管控压力：随着项目数量增加，并行项目管理的难度加大。个别项目出现报告质量下降的情况。建议引入自动化质检工具，建立三级审核制度。',
        ],
      },
      {
        heading: '八、战略建议',
        content: [
          '基于以上分析，对等保测评业务提出以下战略建议：',
          '（1）巩固核心优势：继续强化三级系统测评的技术深度和服务质量，将中标率提升至 55% 以上。重点维护政府和金融行业的复测客户，目标复购留存率达到 85%。',
          '（2）能力升级：在未来 6 个月内完成云等保测评能力建设，取得主流云平台的安全合作伙伴认证。同步启动数据安全评估能力储备，为"等保 + 数安"综合服务模式做准备。',
          '（3）区域拓展：在巩固上海市场的基础上，优先拓展江苏和浙江市场。建议在南京或杭州设立分支团队，目标一年内在长三角地区的市场份额提升 5 个百分点。',
          '（4）效率提升：引入 AI 辅助测评工具，目标将单项目平均交付周期从 25 天缩短至 18 天，释放产能用于承接更多项目。',
          '（5）服务延伸：推出"测评 + 整改 + 运维"一体化服务包，提升客单价 30% 以上。针对中小型客户推出标准化测评产品，以较低成本快速扩大市场覆盖面。',
        ],
      },
    ],
  },
};

// Current report
const currentReport = computed(() => {
  return reportData[selectedGroup.value] || reportData.security;
});

const goBack = () => {
  router.back();
};

const handleExport = () => {
  alert('行业分析报告已下载');
};

const handleAddToKnowledge = () => {
  alert('已加入知识库');
};
</script>

<template>
  <div class="report-page">
    <!-- Header -->
    <div class="report-header">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回</span>
      </button>
      <div class="header-title">
        <h1>行业分析报告</h1>
      </div>
      <div class="header-controls">
        <!-- Policy group selector -->
        <div class="group-selector-wrapper">
          <button class="group-selector-trigger" @click="showGroupDropdown = !showGroupDropdown">
            <Users :size="14" />
            <span>{{ currentGroup?.name }}</span>
            <ChevronDown :size="14" :class="{ 'rotate': showGroupDropdown }" />
          </button>
          <div v-if="showGroupDropdown" class="group-dropdown-menu">
            <div
              v-for="g in policyGroups"
              :key="g.id"
              :class="['group-dropdown-item', { active: selectedGroup === g.id }]"
              @click="selectGroup(g.id)"
            >
              <span class="group-name">{{ g.name }}</span>
              <span class="group-desc">{{ g.description }}</span>
            </div>
          </div>
        </div>
        <button class="header-btn outline" @click="handleExport">
          <Download :size="16" />
          下载
        </button>
        <button class="header-btn primary" @click="handleAddToKnowledge">
          <BookPlus :size="16" />
          加入知识库
        </button>
      </div>
    </div>

    <!-- Document preview area -->
    <div class="document-viewport">
      <div class="document-paper">
        <!-- Cover / Title -->
        <div class="doc-cover">
          <div class="doc-cover-badge">AI 生成报告</div>
          <h1 class="doc-title">{{ currentReport?.title }}</h1>
          <p class="doc-subtitle">{{ currentReport?.subtitle }}</p>
          <div class="doc-meta-bar">
            <span>报告周期：{{ currentReport?.period }}</span>
            <span class="meta-divider">|</span>
            <span>生成时间：{{ currentReport?.generatedAt }}</span>
          </div>
        </div>

        <hr class="doc-divider" />

        <!-- Table of contents -->
        <div class="doc-toc">
          <h3 class="toc-title">目录</h3>
          <div class="toc-list">
            <div
              v-for="(section, idx) in currentReport?.sections"
              :key="idx"
              class="toc-item"
            >
              <a :href="'#section-' + idx" class="toc-link">
                <span>{{ section.heading }}</span>
                <span class="toc-dots"></span>
                <span class="toc-page">{{ idx + 2 }}</span>
              </a>
            </div>
          </div>
        </div>

        <hr class="doc-divider" />

        <!-- Report body -->
        <div class="doc-body">
          <div
            v-for="(section, idx) in currentReport.sections"
            :key="idx"
            :id="'section-' + idx"
            class="doc-section"
          >
            <h2 class="section-heading">{{ section.heading }}</h2>
            <p
              v-for="(para, pIdx) in section.content"
              :key="pIdx"
              class="section-paragraph"
            >
              {{ para }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <hr class="doc-divider" />
        <div class="doc-footer">
          <p>本报告由 AI 智能体基于「{{ currentGroup?.name }}」策略组订阅数据自动生成，仅供参考。</p>
          <p>涌见 AI · 行业分析报告 · {{ currentReport?.generatedAt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #e8ecf1;
  z-index: 100;
}

/* ===== Header ===== */
.report-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
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
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Group selector */
.group-selector-wrapper {
  position: relative;
}

.group-selector-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.group-selector-trigger:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.group-selector-trigger .rotate {
  transform: rotate(180deg);
}

.group-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 280px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 200;
  overflow: hidden;
}

.group-dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f1f5f9;
}

.group-dropdown-item:last-child {
  border-bottom: none;
}

.group-dropdown-item:hover {
  background: #f8fafc;
}

.group-dropdown-item.active {
  background: #eff6ff;
}

.group-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.group-dropdown-item.active .group-name {
  color: #2563eb;
}

.group-desc {
  display: block;
  font-size: 12px;
  color: #94a3b8;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.header-btn.outline {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.header-btn.outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.header-btn.primary {
  background: #2563eb;
  border: none;
  color: white;
}

.header-btn.primary:hover {
  background: #1d4ed8;
}

/* ===== Document viewport — simulates a document reader ===== */
.document-viewport {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0;
}

.document-paper {
  width: 820px;
  margin: 0 auto 40px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);
  padding: 72px 80px 60px;
}

/* ===== Document cover ===== */
.doc-cover {
  text-align: center;
  padding: 48px 0 32px;
}

.doc-cover-badge {
  display: inline-block;
  padding: 4px 16px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  margin-bottom: 24px;
  letter-spacing: 1px;
}

.doc-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.doc-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 28px 0;
  line-height: 1.6;
}

.doc-meta-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 13px;
  color: #94a3b8;
}

.meta-divider {
  color: #cbd5e1;
}

/* ===== Divider ===== */
.doc-divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 28px 0;
}

/* ===== Table of contents ===== */
.doc-toc {
  padding: 8px 0;
}

.toc-title {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 16px 0;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toc-item {
  line-height: 1;
}

.toc-link {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
  color: #475569;
  text-decoration: none;
  padding: 6px 0;
  transition: color 0.15s;
}

.toc-link:hover {
  color: #2563eb;
}

.toc-dots {
  flex: 1;
  border-bottom: 1px dotted #cbd5e1;
  margin-bottom: 3px;
}

.toc-page {
  font-size: 13px;
  color: #94a3b8;
  flex-shrink: 0;
}

/* ===== Document body ===== */
.doc-body {
  padding: 8px 0;
}

.doc-section {
  margin-bottom: 36px;
}

.doc-section:last-child {
  margin-bottom: 0;
}

.section-heading {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

.section-paragraph {
  font-size: 14.5px;
  color: #334155;
  line-height: 2;
  margin: 0 0 14px 0;
  text-align: justify;
  text-indent: 2em;
}

.section-paragraph:last-child {
  margin-bottom: 0;
}

/* ===== Document footer ===== */
.doc-footer {
  text-align: center;
  padding: 16px 0 0;
}

.doc-footer p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 4px 0;
  line-height: 1.6;
}

/* ===== Print styles ===== */
@media print {
  .report-header {
    display: none;
  }

  .document-viewport {
    padding: 0;
    background: white;
  }

  .document-paper {
    box-shadow: none;
    border-radius: 0;
    width: 100%;
    padding: 40px 60px;
    margin: 0;
  }
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .document-paper {
    width: 100%;
    padding: 40px 32px;
    border-radius: 0;
    margin: 0;
  }

  .document-viewport {
    padding: 0;
  }
}
</style>
