<script setup lang="ts">
import { ref } from 'vue';
import {
  FileUser,
  Upload,
  X,
  Plus,
  Trash2,
  Briefcase,
  Check,
  Eye,
  Pencil,
  MessageSquare
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { TemplateSidebar, InfoSidebar, FormPageLayout } from '../shared';
import {
  jdLibrary as defaultJdLibrary,
  recentTools,
  features,
  educationOptions,
  experienceOptions
} from './mockData';
import type { JobDescription, NewJdForm } from './types';

const router = useRouter();

// Form data
const uploadedResumes = ref<File[]>([]);
const maxResumes = 50;
const selectedJdId = ref<number | null>(null);
const additionalRequirements = ref('');
const maxLength = 500;

// JD Library
const jdLibrary = ref<JobDescription[]>([...defaultJdLibrary]);

// Modal state
const showAddJdModal = ref(false);
const showJdDetailModal = ref(false);
const showEditJdModal = ref(false);
const selectedJdForDetail = ref<JobDescription | null>(null);
const editingJd = ref<JobDescription | null>(null);
const addMode = ref<'manual' | 'paste'>('manual');
const pasteContent = ref('');
const newJd = ref<NewJdForm>({
  jobName: '',
  salaryRange: '',
  location: '',
  education: '',
  experience: '',
  skills: '',
  responsibilities: '',
  requirements: '',
  hardRequirements: '',
  bonusPoints: ''
});
const editJd = ref<NewJdForm>({
  jobName: '',
  salaryRange: '',
  location: '',
  education: '',
  experience: '',
  skills: '',
  responsibilities: '',
  requirements: '',
  hardRequirements: '',
  bonusPoints: ''
});

const handleResumeUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const newFiles = Array.from(target.files);
    const remainingSlots = maxResumes - uploadedResumes.value.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);
    uploadedResumes.value = [...uploadedResumes.value, ...filesToAdd];
    target.value = '';
  }
};

const removeResume = (index: number) => {
  uploadedResumes.value.splice(index, 1);
};

const openAddJdModal = () => {
  showAddJdModal.value = true;
  addMode.value = 'manual';
  resetNewJdForm();
};

const closeAddJdModal = () => {
  showAddJdModal.value = false;
  resetNewJdForm();
};

const resetNewJdForm = () => {
  newJd.value = {
    jobName: '',
    salaryRange: '',
    location: '',
    education: '',
    experience: '',
    skills: '',
    responsibilities: '',
    requirements: '',
    hardRequirements: '',
    bonusPoints: ''
  };
  pasteContent.value = '';
};

const parseJdFromText = () => {
  if (!pasteContent.value.trim()) return;

  const text = pasteContent.value;
  const jobNameMatch = text.match(/岗位[名称]*[:：]\s*(.+?)[\n,，]/);
  const salaryMatch = text.match(/薪[资酬][范围]*[:：]\s*(.+?)[\n,，]/);
  const locationMatch = text.match(/[工作]*地[点址][:：]\s*(.+?)[\n,，]/);
  const educationMatch = text.match(/学历[要求]*[:：]\s*(.+?)[\n,，]/);
  const experienceMatch = text.match(/[工作]*经验[要求]*[:：]\s*(.+?)[\n,，]/);
  const responsibilitiesMatch = text.match(/岗位职责[:：]\s*([\s\S]*?)(?=任职要求|$)/);
  const requirementsMatch = text.match(/任职要求[:：]\s*([\s\S]*?)(?=硬性门槛|加分项|$)/);

  newJd.value.jobName = jobNameMatch?.[1]?.trim() || '';
  newJd.value.salaryRange = salaryMatch?.[1]?.trim() || '';
  newJd.value.location = locationMatch?.[1]?.trim() || '上海';
  newJd.value.education = educationMatch?.[1]?.trim() || '';
  newJd.value.experience = experienceMatch?.[1]?.trim() || '';
  newJd.value.responsibilities = responsibilitiesMatch?.[1]?.trim() || '';
  newJd.value.requirements = requirementsMatch?.[1]?.trim() || '';

  const skillKeywords = ['Java', 'Python', 'Vue', 'React', 'Spring', 'MySQL', 'AI', '大数据', '产品', '设计', '安全', '测试'];
  const foundSkills = skillKeywords.filter(skill => text.includes(skill));
  newJd.value.skills = foundSkills.join('、');

  addMode.value = 'manual';
};

const addJdToLibrary = () => {
  if (!newJd.value.jobName.trim()) return;

  const skillsArray = newJd.value.skills.split(/[,，、]/).map(s => s.trim()).filter(s => s);

  jdLibrary.value.unshift({
    id: Date.now(),
    jobName: newJd.value.jobName.trim(),
    salaryRange: newJd.value.salaryRange.trim() || '面议',
    location: newJd.value.location.trim() || '上海',
    education: newJd.value.education ?? '本科及以上',
    experience: newJd.value.experience ?? '不限',
    skills: skillsArray.length > 0 ? skillsArray : ['待补充'],
    createdAt: new Date().toISOString().split('T')[0] ?? '',
    responsibilities: newJd.value.responsibilities ? newJd.value.responsibilities.split(/[,，、\n]/).map(s => s.trim()).filter(s => s) : [],
    requirements: newJd.value.requirements ? newJd.value.requirements.split(/[,，、\n]/).map(s => s.trim()).filter(s => s) : [],
    hardRequirements: newJd.value.hardRequirements ? newJd.value.hardRequirements.split(/[,，、\n]/).map(s => s.trim()).filter(s => s) : [],
    bonusPoints: newJd.value.bonusPoints ? newJd.value.bonusPoints.split(/[,，、\n]/).map(s => s.trim()).filter(s => s) : []
  });

  closeAddJdModal();
};

const removeJd = (id: number) => {
  jdLibrary.value = jdLibrary.value.filter(jd => jd.id !== id);
  if (selectedJdId.value === id) {
    selectedJdId.value = null;
  }
};

const selectJd = (id: number) => {
  selectedJdId.value = selectedJdId.value === id ? null : id;
};

const openJdDetail = (jd: JobDescription) => {
  selectedJdForDetail.value = jd;
  showJdDetailModal.value = true;
};

const closeJdDetailModal = () => {
  showJdDetailModal.value = false;
  selectedJdForDetail.value = null;
};

// Edit JD functions
const openEditJdModal = (jd: JobDescription) => {
  editingJd.value = jd;
  editJd.value = {
    jobName: jd.jobName,
    salaryRange: jd.salaryRange,
    location: jd.location,
    education: jd.education,
    experience: jd.experience,
    skills: jd.skills.join('、'),
    responsibilities: jd.responsibilities?.join('、') || '',
    requirements: jd.requirements?.join('、') || '',
    hardRequirements: jd.hardRequirements?.join('、') || '',
    bonusPoints: jd.bonusPoints?.join('、') || ''
  };
  showEditJdModal.value = true;
};

const closeEditJdModal = () => {
  showEditJdModal.value = false;
  editingJd.value = null;
  editJd.value = {
    jobName: '',
    salaryRange: '',
    location: '',
    education: '',
    experience: '',
    skills: '',
    responsibilities: '',
    requirements: '',
    hardRequirements: '',
    bonusPoints: ''
  };
};

const saveEditJd = () => {
  if (!editingJd.value || !editJd.value.jobName.trim()) return;

  const skillsArray = editJd.value.skills.split(/[,，、]/).map(s => s.trim()).filter(s => s);
  const responsibilitiesArray = editJd.value.responsibilities ? editJd.value.responsibilities.split(/[,，、\n]/).map(s => s.trim()).filter(s => s) : [];
  const requirementsArray = editJd.value.requirements ? editJd.value.requirements.split(/[,，、\n]/).map(s => s.trim()).filter(s => s) : [];
  const hardRequirementsArray = editJd.value.hardRequirements ? editJd.value.hardRequirements.split(/[,，、\n]/).map(s => s.trim()).filter(s => s) : [];
  const bonusPointsArray = editJd.value.bonusPoints ? editJd.value.bonusPoints.split(/[,，、\n]/).map(s => s.trim()).filter(s => s) : [];

  const index = jdLibrary.value.findIndex(jd => jd.id === editingJd.value?.id);
  const existingJd = jdLibrary.value[index];
  if (index > -1 && existingJd) {
    jdLibrary.value[index] = {
      id: existingJd.id,
      createdAt: existingJd.createdAt,
      jobName: editJd.value.jobName.trim(),
      salaryRange: editJd.value.salaryRange.trim() || '面议',
      location: editJd.value.location.trim() || '上海',
      education: editJd.value.education || '本科及以上',
      experience: editJd.value.experience || '不限',
      skills: skillsArray.length > 0 ? skillsArray : ['待补充'],
      responsibilities: responsibilitiesArray,
      requirements: requirementsArray,
      hardRequirements: hardRequirementsArray,
      bonusPoints: bonusPointsArray
    };
  }

  closeEditJdModal();
};

const handleSubmit = () => {
  const selectedJd = jdLibrary.value.find(jd => jd.id === selectedJdId.value);
  router.push({
    name: 'resume-analysis-result',
    query: {
      position: selectedJd?.jobName || '',
      fileCount: uploadedResumes.value.length
    }
  });
};
</script>

<template>
  <FormPageLayout :icon="FileUser" title="简历分析" subtitle="AI智能解析简历，精准匹配岗位需求">
    <template #sidebar>
      <TemplateSidebar :recent-tools="recentTools" :active-index="1" />
    </template>

    <!-- Upload Resume -->
    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="required">*</span> 上传简历
          <span class="upload-count">（{{ uploadedResumes.length }}/{{ maxResumes }}）</span>
        </h3>
      </div>
      <label class="upload-area" :class="{ 'has-files': uploadedResumes.length > 0 }">
        <input type="file" @change="handleResumeUpload" accept=".pdf,.doc,.docx" hidden multiple />
        <Upload :size="32" />
        <div class="upload-text">
          <span class="upload-main">点击上传候选人简历</span>
          <span class="upload-hint">支持 PDF、Word 格式，最多上传 {{ maxResumes }} 份</span>
        </div>
      </label>
      <div v-if="uploadedResumes.length > 0" class="uploaded-files-list">
        <div v-for="(file, index) in uploadedResumes" :key="index" class="uploaded-file-item">
          <FileUser :size="14" />
          <span class="file-name">{{ file.name }}</span>
          <button class="remove-file-btn" @click="removeResume(index)">
            <X :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- JD Library -->
    <div class="form-section jd-library-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="required">*</span> 选择目标岗位
        </h3>
        <button class="add-jd-btn" @click="openAddJdModal">
          <Plus :size="16" />
          添加 JD
        </button>
      </div>
      <p class="section-hint">从 JD 库中选择目标岗位，用于简历匹配分析</p>

      <div class="jd-table">
        <div class="jd-table-header">
          <span class="col-select"></span>
          <span class="col-name">岗位名称</span>
          <span class="col-salary">薪资范围</span>
          <span class="col-location">工作地点</span>
          <span class="col-education">学历要求</span>
          <span class="col-experience">经验要求</span>
          <span class="col-skills">技能要求</span>
          <span class="col-action">操作</span>
        </div>
        <div class="jd-table-body">
          <div
            v-for="jd in jdLibrary"
            :key="jd.id"
            class="jd-table-row"
            :class="{ selected: selectedJdId === jd.id }"
            @click="selectJd(jd.id)"
          >
            <span class="col-select">
              <div class="jd-radio" :class="{ checked: selectedJdId === jd.id }">
                <Check v-if="selectedJdId === jd.id" :size="12" />
              </div>
            </span>
            <span class="col-name">
              <Briefcase :size="14" class="name-icon" />
              {{ jd.jobName }}
            </span>
            <span class="col-salary">{{ jd.salaryRange }}</span>
            <span class="col-location">{{ jd.location }}</span>
            <span class="col-education">{{ jd.education }}</span>
            <span class="col-experience">{{ jd.experience }}</span>
            <span class="col-skills">
              <span v-for="skill in jd.skills.slice(0, 3)" :key="skill" class="skill-tag">{{ skill }}</span>
              <span v-if="jd.skills.length > 3" class="skill-more">+{{ jd.skills.length - 3 }}</span>
            </span>
            <span class="col-action">
              <button class="jd-view-btn" @click.stop="openJdDetail(jd)" title="查看详情">
                <Eye :size="14" />
              </button>
              <button class="jd-edit-btn" @click.stop="openEditJdModal(jd)" title="编辑">
                <Pencil :size="14" />
              </button>
              <button class="jd-delete-btn" @click.stop="removeJd(jd.id)" title="删除">
                <Trash2 :size="14" />
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Requirements -->
    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">
          补充要求
        </h3>
      </div>
      <div class="textarea-wrapper">
        <textarea
          v-model="additionalRequirements"
          class="form-textarea"
          :maxlength="maxLength"
          placeholder="请输入补充筛选要求，如：优先考虑有大厂经验的候选人、需要有团队管理经验等..."
        ></textarea>
        <span class="char-count">{{ additionalRequirements.length }} / {{ maxLength }}</span>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="submit-container">
      <button class="submit-btn" @click="handleSubmit">
        开始分析
      </button>
    </div>

    <template #info-sidebar>
      <InfoSidebar :icon="FileUser" title="简历分析" description="AI智能解析简历，快速评估候选人与岗位的匹配度" :features="features" />
    </template>
  </FormPageLayout>

  <!-- Add JD Modal -->
  <div v-if="showAddJdModal" class="modal-overlay" @click.self="closeAddJdModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>添加岗位 JD</h3>
        <button class="modal-close" @click="closeAddJdModal">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <div class="mode-switch">
          <button class="mode-btn" :class="{ active: addMode === 'manual' }" @click="addMode = 'manual'">
            手动录入
          </button>
          <button class="mode-btn" :class="{ active: addMode === 'paste' }" @click="addMode = 'paste'">
            粘贴解析
          </button>
        </div>

        <div v-if="addMode === 'paste'" class="paste-section">
          <textarea v-model="pasteContent" class="paste-textarea" placeholder="粘贴招聘信息内容，AI 将自动解析为标准 JD 格式..."></textarea>
          <button class="parse-btn" @click="parseJdFromText" :disabled="!pasteContent.trim()">
            解析内容
          </button>
        </div>

        <div v-if="addMode === 'manual'" class="manual-form">
          <div class="form-row">
            <label class="form-label-sm">
              <span class="required">*</span> 岗位名称
            </label>
            <input v-model="newJd.jobName" type="text" class="form-input-sm" placeholder="如：Java开发工程师" />
          </div>

          <div class="form-row-2col">
            <div class="form-row">
              <label class="form-label-sm">薪资范围</label>
              <input v-model="newJd.salaryRange" type="text" class="form-input-sm" placeholder="如：25K-35K" />
            </div>
            <div class="form-row">
              <label class="form-label-sm">工作地点</label>
              <input v-model="newJd.location" type="text" class="form-input-sm" placeholder="如：上海" />
            </div>
          </div>

          <div class="form-row-2col">
            <div class="form-row">
              <label class="form-label-sm">学历要求</label>
              <select v-model="newJd.education" class="form-select-sm">
                <option value="">请选择</option>
                <option v-for="edu in educationOptions" :key="edu" :value="edu">{{ edu }}</option>
              </select>
            </div>
            <div class="form-row">
              <label class="form-label-sm">经验要求</label>
              <select v-model="newJd.experience" class="form-select-sm">
                <option value="">请选择</option>
                <option v-for="exp in experienceOptions" :key="exp" :value="exp">{{ exp }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label-sm">岗位职责</label>
            <textarea v-model="newJd.responsibilities" class="form-textarea-sm" placeholder="请输入岗位职责，如：负责核心业务系统开发与维护、参与架构设计..."></textarea>
          </div>

          <div class="form-row">
            <label class="form-label-sm">岗位要求</label>
            <textarea v-model="newJd.requirements" class="form-textarea-sm" placeholder="请输入岗位要求，如：3年以上Java开发经验、熟悉Spring Boot框架..."></textarea>
          </div>
        </div>
      </div>

      <div v-if="addMode === 'manual'" class="modal-footer">
        <button class="btn-cancel" @click="closeAddJdModal">取消</button>
        <button class="btn-confirm" @click="addJdToLibrary" :disabled="!newJd.jobName.trim()">
          添加到 JD 库
        </button>
      </div>
    </div>
  </div>

  <!-- JD Detail Modal -->
  <div v-if="showJdDetailModal && selectedJdForDetail" class="modal-overlay" @click.self="closeJdDetailModal">
    <div class="modal-content detail-modal">
      <div class="modal-header">
        <h3>岗位详情</h3>
        <button class="modal-close" @click="closeJdDetailModal">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <div class="detail-section">
          <div class="detail-header">
            <Briefcase :size="20" class="detail-icon" />
            <span class="detail-job-name">{{ selectedJdForDetail.jobName }}</span>
            <span class="detail-salary">{{ selectedJdForDetail.salaryRange }}</span>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">工作地点</span>
            <span class="detail-value">{{ selectedJdForDetail.location }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">学历要求</span>
            <span class="detail-value">{{ selectedJdForDetail.education }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">经验要求</span>
            <span class="detail-value">{{ selectedJdForDetail.experience }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">发布时间</span>
            <span class="detail-value">{{ selectedJdForDetail.createdAt }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4 class="detail-section-title">技能要求</h4>
          <div class="detail-skills">
            <span v-for="skill in selectedJdForDetail.skills" :key="skill" class="detail-skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="detail-section">
          <h4 class="detail-section-title">岗位职责</h4>
          <ul class="detail-list">
            <li>负责公司核心业务系统的开发与维护</li>
            <li>参与系统架构设计和技术方案评审</li>
            <li>编写高质量、可维护的代码</li>
            <li>配合团队完成项目交付，确保代码质量</li>
          </ul>
        </div>

        <div class="detail-section">
          <h4 class="detail-section-title">任职要求</h4>
          <ul class="detail-list">
            <li>{{ selectedJdForDetail.education }}学历，计算机相关专业优先</li>
            <li>{{ selectedJdForDetail.experience }}相关工作经验</li>
            <li v-for="skill in selectedJdForDetail.skills.slice(0, 3)" :key="skill">
              熟练掌握 {{ skill }} 相关技术
            </li>
            <li>具有良好的沟通能力和团队协作精神</li>
          </ul>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-confirm" @click="closeJdDetailModal">关闭</button>
      </div>
    </div>
  </div>

  <!-- Edit JD Modal -->
  <div v-if="showEditJdModal && editingJd" class="modal-overlay" @click.self="closeEditJdModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>编辑岗位 JD</h3>
        <button class="modal-close" @click="closeEditJdModal">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <div class="manual-form">
          <div class="form-row">
            <label class="form-label-sm">
              <span class="required">*</span> 岗位名称
            </label>
            <input v-model="editJd.jobName" type="text" class="form-input-sm" placeholder="如：Java开发工程师" />
          </div>

          <div class="form-row-2col">
            <div class="form-row">
              <label class="form-label-sm">薪资范围</label>
              <input v-model="editJd.salaryRange" type="text" class="form-input-sm" placeholder="如：25K-35K" />
            </div>
            <div class="form-row">
              <label class="form-label-sm">工作地点</label>
              <input v-model="editJd.location" type="text" class="form-input-sm" placeholder="如：上海" />
            </div>
          </div>

          <div class="form-row-2col">
            <div class="form-row">
              <label class="form-label-sm">学历要求</label>
              <select v-model="editJd.education" class="form-select-sm">
                <option value="">请选择</option>
                <option v-for="edu in educationOptions" :key="edu" :value="edu">{{ edu }}</option>
              </select>
            </div>
            <div class="form-row">
              <label class="form-label-sm">经验要求</label>
              <select v-model="editJd.experience" class="form-select-sm">
                <option value="">请选择</option>
                <option v-for="exp in experienceOptions" :key="exp" :value="exp">{{ exp }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label-sm">岗位职责</label>
            <textarea v-model="editJd.responsibilities" class="form-textarea-sm" placeholder="请输入岗位职责，如：负责核心业务系统开发与维护、参与架构设计..."></textarea>
          </div>

          <div class="form-row">
            <label class="form-label-sm">岗位要求</label>
            <textarea v-model="editJd.requirements" class="form-textarea-sm" placeholder="请输入岗位要求，如：3年以上Java开发经验、熟悉Spring Boot框架..."></textarea>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="closeEditJdModal">取消</button>
        <button class="btn-confirm" @click="saveEditJd" :disabled="!editJd.jobName.trim()">
          保存修改
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles.css';
</style>
