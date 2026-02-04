<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  FileUser,
  UserCheck,
  DollarSign,
  Search,
  Upload,
  Flame,
  X,
  Plus,
  Trash2,
  FileText,
  Briefcase,
  MapPin,
  GraduationCap,
  Clock,
  Check,
  Eye
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// JD Library data structure
interface JobDescription {
  id: number;
  jobName: string;
  salaryRange: string;
  location: string;
  education: string;
  experience: string;
  skills: string[];
  createdAt: string;
}

// Form data - support multiple resumes (max 50)
const uploadedResumes = ref<File[]>([]);
const maxResumes = 50;
const selectedJdId = ref<number | null>(null);

// JD Library with mock data
const jdLibrary = ref<JobDescription[]>([
  {
    id: 1,
    jobName: 'Java开发工程师',
    salaryRange: '25K-35K',
    location: '上海',
    education: '本科及以上',
    experience: '3-5年',
    skills: ['Java', 'Spring Boot', 'MySQL', '微服务'],
    createdAt: '2026-01-15'
  },
  {
    id: 2,
    jobName: '产品经理',
    salaryRange: '30K-45K',
    location: '上海',
    education: '本科及以上',
    experience: '5年以上',
    skills: ['需求分析', '产品规划', '数据分析', 'Axure'],
    createdAt: '2026-01-18'
  },
  {
    id: 3,
    jobName: '前端开发工程师',
    salaryRange: '20K-30K',
    location: '上海',
    education: '本科及以上',
    experience: '2-4年',
    skills: ['Vue.js', 'React', 'TypeScript', 'CSS'],
    createdAt: '2026-01-20'
  },
  {
    id: 4,
    jobName: '网络安全工程师',
    salaryRange: '25K-40K',
    location: '上海',
    education: '本科及以上',
    experience: '3-5年',
    skills: ['渗透测试', '安全审计', 'CISP', '等保测评'],
    createdAt: '2026-01-25'
  },
  {
    id: 5,
    jobName: 'UI设计师',
    salaryRange: '15K-25K',
    location: '上海',
    education: '大专及以上',
    experience: '2-3年',
    skills: ['Figma', 'Sketch', '视觉设计', '交互设计'],
    createdAt: '2026-02-01'
  }
]);

// Add JD form data
const showAddJdModal = ref(false);
const showJdDetailModal = ref(false);
const selectedJdForDetail = ref<JobDescription | null>(null);
const addMode = ref<'manual' | 'paste'>('manual');
const pasteContent = ref('');
const newJd = ref({
  jobName: '',
  salaryRange: '',
  location: '',
  education: '',
  experience: '',
  skills: ''
});

const recentTools = [
  { icon: UserCheck, label: 'Boss招聘' },
  { icon: FileUser, label: '简历分析' },
  { icon: DollarSign, label: '薪酬调查' },
];

const features = [
  '智能解析简历关键信息',
  '岗位匹配度精准评估',
  '自动生成面试问题建议',
  '候选人优劣势深度分析',
  '多维度人才画像呈现',
];

const educationOptions = ['大专及以上', '本科及以上', '硕士及以上', '博士及以上'];
const experienceOptions = ['不限', '1年以下', '1-3年', '2-4年', '3-5年', '5年以上', '10年以上'];

const goBack = () => {
  router.push({ name: 'agents' });
};

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
    skills: ''
  };
  pasteContent.value = '';
};

const parseJdFromText = () => {
  if (!pasteContent.value.trim()) return;

  // Mock parsing - in real implementation, this would use AI to parse
  const text = pasteContent.value;

  // Simple pattern matching for demo
  const jobNameMatch = text.match(/岗位[名称]*[:：]\s*(.+?)[\n,，]/);
  const salaryMatch = text.match(/薪[资酬][范围]*[:：]\s*(.+?)[\n,，]/);
  const locationMatch = text.match(/[工作]*地[点址][:：]\s*(.+?)[\n,，]/);
  const educationMatch = text.match(/学历[要求]*[:：]\s*(.+?)[\n,，]/);
  const experienceMatch = text.match(/[工作]*经验[要求]*[:：]\s*(.+?)[\n,，]/);

  newJd.value.jobName = jobNameMatch?.[1]?.trim() || '';
  newJd.value.salaryRange = salaryMatch?.[1]?.trim() || '';
  newJd.value.location = locationMatch?.[1]?.trim() || '上海';
  newJd.value.education = educationMatch?.[1]?.trim() || '';
  newJd.value.experience = experienceMatch?.[1]?.trim() || '';

  // Extract skills from keywords
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
    education: newJd.value.education || '本科及以上',
    experience: newJd.value.experience || '不限',
    skills: skillsArray.length > 0 ? skillsArray : ['待补充'],
    createdAt: new Date().toISOString().split('T')[0]
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
  <div class="review-form-page">
    <!-- Left Sidebar -->
    <aside class="template-sidebar">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回智能体应用市场</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索其他智能体" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">最近使用</div>
        <div
          v-for="(item, index) in recentTools"
          :key="index"
          class="template-item"
          :class="{ active: index === 1 }"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
          <Flame v-if="index === 1" :size="14" class="hot-icon" />
        </div>
      </div>
    </aside>

    <!-- Main Form Area -->
    <main class="form-main">
      <div class="form-header">
        <div class="form-icon">
          <FileUser :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">简历分析</h1>
          <p class="form-subtitle">AI智能解析简历，精准匹配岗位需求</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 上传简历 -->
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
          <!-- Uploaded files list -->
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
                  <button class="jd-delete-btn" @click.stop="removeJd(jd.id)">
                    <Trash2 :size="14" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button
            class="submit-btn"
            :disabled="!selectedJdId"
            @click="handleSubmit"
          >
            开始分析
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-icon-wrapper">
        <FileUser :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">简历分析</h3>
      <p class="info-desc">AI智能解析简历，快速评估候选人与岗位的匹配度</p>
      <ul class="feature-list">
        <li v-for="(feature, index) in features" :key="index">
          <span class="bullet">●</span>
          {{ feature }}
        </li>
      </ul>
    </aside>

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
          <!-- Mode Switch -->
          <div class="mode-switch">
            <button
              class="mode-btn"
              :class="{ active: addMode === 'manual' }"
              @click="addMode = 'manual'"
            >
              手动录入
            </button>
            <button
              class="mode-btn"
              :class="{ active: addMode === 'paste' }"
              @click="addMode = 'paste'"
            >
              粘贴解析
            </button>
          </div>

          <!-- Paste Mode -->
          <div v-if="addMode === 'paste'" class="paste-section">
            <textarea
              v-model="pasteContent"
              class="paste-textarea"
              placeholder="粘贴招聘信息内容，AI 将自动解析为标准 JD 格式...

示例格式：
岗位名称：Java开发工程师
薪资范围：25K-35K
工作地点：上海
学历要求：本科及以上
经验要求：3-5年
技能要求：Java, Spring Boot, MySQL..."
            ></textarea>
            <button class="parse-btn" @click="parseJdFromText" :disabled="!pasteContent.trim()">
              解析内容
            </button>
          </div>

          <!-- Manual Form -->
          <div v-if="addMode === 'manual'" class="manual-form">
            <div class="form-row">
              <label class="form-label-sm">
                <span class="required">*</span> 岗位名称
              </label>
              <input
                v-model="newJd.jobName"
                type="text"
                class="form-input-sm"
                placeholder="如：Java开发工程师"
              />
            </div>

            <div class="form-row-2col">
              <div class="form-row">
                <label class="form-label-sm">薪资范围</label>
                <input
                  v-model="newJd.salaryRange"
                  type="text"
                  class="form-input-sm"
                  placeholder="如：25K-35K"
                />
              </div>
              <div class="form-row">
                <label class="form-label-sm">工作地点</label>
                <input
                  v-model="newJd.location"
                  type="text"
                  class="form-input-sm"
                  placeholder="如：上海"
                />
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
              <label class="form-label-sm">技能要求</label>
              <input
                v-model="newJd.skills"
                type="text"
                class="form-input-sm"
                placeholder="多个技能用逗号分隔，如：Java, Spring Boot, MySQL"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
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
  </div>
</template>

<style scoped>
.review-form-page {
  display: flex;
  height: 100%;
  background: #f8fafc;
}

.template-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #eff6ff;
  border: none;
  border-radius: 8px;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #dbeafe;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.search-icon {
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #475569;
}

.search-input::placeholder {
  color: #94a3b8;
}

.template-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-section .section-title {
  font-size: 12px;
  color: #94a3b8;
  padding: 12px 0 8px 0;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  background: #f8fafc;
}

.template-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.template-item.active .item-icon {
  color: #2563eb;
}

.hot-icon {
  color: #f97316;
  margin-left: auto;
}

.form-main {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -24px -32px 32px -32px;
  padding: 20px 32px;
  background: #eff6ff;
}

.form-icon {
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
  margin: 0;
}

.form-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.form-content {
  max-width: 100%;
}

/* Form Sections */
.form-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.section-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.required {
  color: #ef4444;
}

.upload-count {
  font-weight: 400;
  color: #64748b;
  font-size: 13px;
}

/* Upload Area */
.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  color: #64748b;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.upload-text {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}

.upload-main {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

/* Uploaded files list */
.uploaded-files-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
}

.uploaded-file-item .file-name {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-file-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* JD Library */
.add-jd-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-jd-btn:hover {
  background: #1d4ed8;
}

/* JD Table */
.jd-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.jd-table-header {
  display: grid;
  grid-template-columns: 40px 1.2fr 0.8fr 0.7fr 0.8fr 0.7fr 1.2fr 50px;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.jd-table-body {
  max-height: 320px;
  overflow-y: auto;
}

.jd-table-row {
  display: grid;
  grid-template-columns: 40px 1.2fr 0.8fr 0.7fr 0.8fr 0.7fr 1.2fr 50px;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  transition: background 0.15s;
}

.jd-table-row:last-child {
  border-bottom: none;
}

.jd-table-row:hover {
  background: #f8fafc;
}

.jd-table-row.selected {
  background: #eff6ff;
}

.col-select {
  display: flex;
  justify-content: center;
}

.jd-radio {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.jd-radio.checked {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #1e293b;
}

.name-icon {
  color: #3b82f6;
  flex-shrink: 0;
}

.col-salary {
  font-weight: 600;
  color: #16a34a;
}

.col-location,
.col-education,
.col-experience {
  color: #64748b;
}

.col-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-tag {
  padding: 2px 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 11px;
  color: #475569;
}

.jd-table-row.selected .skill-tag {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1d4ed8;
}

.skill-more {
  padding: 2px 6px;
  font-size: 11px;
  color: #94a3b8;
}

.col-action {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.jd-view-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.jd-view-btn:hover {
  background: #eff6ff;
  border-color: #93c5fd;
  color: #2563eb;
}

.jd-delete-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.jd-delete-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}

/* Scrollbar styling */
.jd-table-body::-webkit-scrollbar {
  width: 6px;
}

.jd-table-body::-webkit-scrollbar-track {
  background: transparent;
}

.jd-table-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.jd-table-body::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Submit */
.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-bottom: 40px;
}

.submit-btn {
  width: 280px;
  padding: 14px 48px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* Right Info Sidebar */
.info-sidebar {
  width: 260px;
  padding: 40px 24px;
  background: transparent;
  border-left: 1px solid #e2e8f0;
}

.info-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.info-main-icon {
  color: white;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.info-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  padding: 6px 0;
  line-height: 1.4;
}

.bullet {
  color: #2563eb;
  font-size: 8px;
  margin-top: 5px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 560px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
}

/* Mode Switch */
.mode-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.mode-btn {
  flex: 1;
  padding: 10px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover:not(.active) {
  background: #f8fafc;
}

.mode-btn.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
  font-weight: 500;
}

/* Paste Section */
.paste-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.paste-textarea {
  width: 100%;
  min-height: 200px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

.paste-textarea:focus {
  border-color: #2563eb;
}

.paste-textarea::placeholder {
  color: #94a3b8;
}

.parse-btn {
  align-self: flex-end;
  padding: 10px 20px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.parse-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.parse-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Manual Form */
.manual-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label-sm {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.form-input-sm,
.form-select-sm {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: border-color 0.2s;
}

.form-input-sm:focus,
.form-select-sm:focus {
  border-color: #2563eb;
}

.form-input-sm::placeholder {
  color: #94a3b8;
}

/* Modal Buttons */
.btn-cancel {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f8fafc;
}

.btn-confirm {
  padding: 10px 20px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-confirm:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* JD Detail Modal */
.detail-modal {
  width: 600px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 20px;
}

.detail-icon {
  color: #2563eb;
}

.detail-job-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.detail-salary {
  margin-left: auto;
  font-size: 18px;
  font-weight: 600;
  color: #16a34a;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #94a3b8;
}

.detail-value {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}

.detail-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.detail-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-skill-tag {
  padding: 6px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 13px;
  color: #1d4ed8;
}

.detail-list {
  margin: 0;
  padding-left: 20px;
  color: #475569;
  font-size: 14px;
  line-height: 2;
}

.detail-list li {
  margin-bottom: 4px;
}
</style>
