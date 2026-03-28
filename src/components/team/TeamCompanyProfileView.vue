<script setup lang="ts">
import { ref } from 'vue';
import { Building2, Save, Edit3, Sparkles } from 'lucide-vue-next';

const isEditing = ref(false);
const isGenerating = ref(false);
const companyProfile = ref(`金盾检测技术股份有限公司成立于2012年，是一家专业从事建设工程质量检测、环境检测、职业卫生检测及技术咨询服务的综合性第三方检测机构。公司总部位于北京，在全国设有15个分支机构和实验室，检测服务网络覆盖华北、华东、华南等主要区域。

公司拥有CMA（中国计量认证）、CNAS（中国合格评定国家认可委员会实验室认可）、CATL（建设工程质量检测机构资质）等多项权威资质认证，检测能力涵盖建筑工程、市政工程、公路工程、水利工程、环境监测等20余个专业领域，可出具具有法律效力的检测报告。实验室配备价值超过8000万元的先进检测设备，包括电子万能试验机、X射线衍射仪、气相色谱质谱联用仪、原子吸收光谱仪等高精度仪器300余台套。

技术团队由120余名专业技术人员组成，其中高级工程师18人、注册结构工程师5人、注册岩土工程师3人，80%以上人员具有本科及以上学历。公司建立了完善的质量管理体系，通过ISO9001质量管理体系认证和ISO14001环境管理体系认证，确保检测数据的准确性和可靠性。

近五年累计完成各类检测项目超过15000项，服务客户包括中国建筑、中国中铁、万科集团、保利地产等大型央企和知名房地产企业，以及北京市政府、上海市住建委等政府机构。在国家重点工程项目中承担检测任务，包括北京大兴国际机场配套工程、雄安新区市政基础设施、京张高铁沿线建筑工程等，检测报告合格率达99.8%，客户满意度保持在95%以上。

公司注重科技创新，与清华大学、同济大学等高校建立产学研合作关系，参与编制国家及行业标准5项，获得发明专利12项、实用新型专利28项、软件著作权15项。自主研发的"智能检测数据管理系统"实现了检测流程全程数字化管理，大幅提升检测效率和数据追溯能力。

金盾检测始终坚持"科学、公正、准确、高效"的质量方针，以专业的技术能力、完善的质量保证体系和优质的客户服务，为建设工程质量安全保驾护航，是值得信赖的第三方检测服务合作伙伴。`);

const originalProfile = ref(companyProfile.value);
const charCount = ref(companyProfile.value.length);
const maxChars = 1000;

function handleEdit() {
  isEditing.value = true;
  originalProfile.value = companyProfile.value;
}

function handleSave() {
  isEditing.value = false;
  charCount.value = companyProfile.value.length;
}

function handleCancel() {
  companyProfile.value = originalProfile.value;
  isEditing.value = false;
}

function updateCharCount() {
  charCount.value = companyProfile.value.length;
}

function handleAIGenerate() {
  isGenerating.value = true;
  // Mock AI generation with delay
  setTimeout(() => {
    companyProfile.value = `金盾检测技术股份有限公司成立于2012年，是一家专业从事建设工程质量检测、环境检测、职业卫生检测及技术咨询服务的综合性第三方检测机构。公司总部位于北京，在全国设有15个分支机构和实验室，检测服务网络覆盖华北、华东、华南等主要区域。

公司拥有CMA（中国计量认证）、CNAS（中国合格评定国家认可委员会实验室认可）、CATL（建设工程质量检测机构资质）等多项权威资质认证，检测能力涵盖建筑工程、市政工程、公路工程、水利工程、环境监测等20余个专业领域，可出具具有法律效力的检测报告。实验室配备价值超过8000万元的先进检测设备，包括电子万能试验机、X射线衍射仪、气相色谱质谱联用仪、原子吸收光谱仪等高精度仪器300余台套。

技术团队由120余名专业技术人员组成，其中高级工程师18人、注册结构工程师5人、注册岩土工程师3人，80%以上人员具有本科及以上学历。公司建立了完善的质量管理体系，通过ISO9001质量管理体系认证和ISO14001环境管理体系认证，确保检测数据的准确性和可靠性。

近五年累计完成各类检测项目超过15000项，服务客户包括中国建筑、中国中铁、万科集团、保利地产等大型央企和知名房地产企业，以及北京市政府、上海市住建委等政府机构。在国家重点工程项目中承担检测任务，包括北京大兴国际机场配套工程、雄安新区市政基础设施、京张高铁沿线建筑工程等，检测报告合格率达99.8%，客户满意度保持在95%以上。

公司注重科技创新，与清华大学、同济大学等高校建立产学研合作关系，参与编制国家及行业标准5项，获得发明专利12项、实用新型专利28项、软件著作权15项。自主研发的"智能检测数据管理系统"实现了检测流程全程数字化管理，大幅提升检测效率和数据追溯能力。

金盾检测始终坚持"科学、公正、准确、高效"的质量方针，以专业的技术能力、完善的质量保证体系和优质的客户服务，为建设工程质量安全保驾护航，是值得信赖的第三方检测服务合作伙伴。`;
    charCount.value = companyProfile.value.length;
    isGenerating.value = false;
  }, 2000);
}

</script>

<template>
  <div class="company-profile">
    <div class="content-header">
      <div class="header-main">
        <div class="icon-wrapper">
          <Building2 :size="22" />
        </div>
        <div>
          <div class="badge">企业核心信息</div>
          <h1 class="page-title">企业简介</h1>
          <p class="page-subtitle">此介绍将作为整个团队的核心提示词，请务必保证准确简洁</p>
        </div>
      </div>
      <div class="action-group">
        <button v-if="!isEditing" class="primary-btn" @click="handleEdit">
          <Edit3 :size="16" />
          编辑简介
        </button>
        <template v-else>
          <button class="ai-btn" @click="handleAIGenerate" :disabled="isGenerating">
            <Sparkles :size="16" />
            {{ isGenerating ? 'AI生成中...' : 'AI智能生成' }}
          </button>
          <button class="ghost-btn" @click="handleCancel">取消</button>
          <button class="primary-btn" @click="handleSave">
            <Save :size="16" />
            保存
          </button>
        </template>
      </div>
    </div>

    <div class="profile-card">
      <div class="card-header">
        <h2>企业介绍</h2>
        <span class="char-count" :class="{ warning: charCount > maxChars }">
          {{ charCount }} / {{ maxChars }} 字
        </span>
      </div>

      <div class="notice-box">
        <div class="notice-icon">💡</div>
        <div class="notice-content">
          <strong>重要提示：</strong>企业简介将作为所有AI智能体的核心背景知识，用于理解您的业务场景和需求。建议包含：企业定位、核心业务、行业经验、技术优势等关键信息。内容越准确，AI生成的结果越贴合实际。
        </div>
      </div>

      <div class="profile-content">
        <textarea
          v-if="isEditing"
          v-model="companyProfile"
          @input="updateCharCount"
          class="profile-textarea"
          :maxlength="maxChars"
          placeholder="请输入企业简介，建议300-1000字..."
        ></textarea>
        <div v-else class="profile-display">
          {{ companyProfile }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-profile {
  width: 100%;
  max-width: 940px;
}

.content-header,
.profile-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05);
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  margin-bottom: 18px;
}

.header-main {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
}

.page-title {
  margin: 10px 0 6px;
  font-size: 24px;
  color: #0f172a;
}

.page-subtitle {
  margin: 0;
  color: #64748b;
  line-height: 1.65;
}

.action-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.ghost-btn,
.primary-btn,
.ai-btn {
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.ghost-btn {
  border: 1px solid #cbd5e1;
  background: white;
  color: #475569;
}

.ghost-btn:hover {
  background: #f8fafc;
}

.primary-btn {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: white;
}

.primary-btn:hover {
  background: #1d4ed8;
}

.ai-btn {
  border: 1px solid #8b5cf6;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
}

.ai-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-btn svg {
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.profile-card {
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.char-count {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.char-count.warning {
  color: #dc2626;
}

.notice-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  margin-bottom: 20px;
}

.notice-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.notice-content {
  font-size: 14px;
  color: #78350f;
  line-height: 1.6;
}

.notice-content strong {
  color: #92400e;
}

.profile-content {
  min-height: 300px;
}

.profile-textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.8;
  color: #0f172a;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}

.profile-textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.profile-display {
  padding: 16px;
  font-size: 15px;
  line-height: 1.8;
  color: #334155;
  white-space: pre-wrap;
  background: #f8fafc;
  border-radius: 12px;
  min-height: 300px;
}

@media (max-width: 900px) {
  .content-header,
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
