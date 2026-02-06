<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  DollarSign,
  FileUser,
  UserCheck,
  Search,
  Upload,
  Flame,
  Plus,
  Trash2,
  FileText,
  X,
  MapPin,
  Check,
  Users,
  Briefcase
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import {
  jobCategories,
  provinces,
  salaryBasisOptions,
  salaryTypeOptions,
  tenureOptions,
  defaultEmployees,
  features,
  type EmployeeEntry
} from '../../mocks/salarySurvey';

const router = useRouter();

// Form data - Job Info
const jobName = ref('');
const jobCategory = ref('tech');
const workLocation = ref('上海');

// Collection scope
const scopeType = ref<'national' | 'regional'>('national');
const selectedRegions = ref<string[]>(['北京', '上海', '广东', '深圳']);
const showRegionDropdown = ref(false);

// Salary basis
const salaryBasis = ref('before_tax');
const salaryType = ref('monthly');

// Employee list
const employees = ref<EmployeeEntry[]>([...defaultEmployees]);
const newEmployee = ref({
  name: '',
  salary: '',
  tenure: '1-3'
});

// Uploaded file
const uploadedFile = ref<File | null>(null);

const recentTools = [
  { icon: UserCheck, label: 'Boss招聘' },
  { icon: FileUser, label: '简历分析' },
  { icon: DollarSign, label: '薪酬调查' },
];

const goBack = () => {
  router.push({ name: 'agents' });
};

// Region selection
const toggleRegion = (region: string) => {
  const index = selectedRegions.value.indexOf(region);
  if (index > -1) {
    selectedRegions.value.splice(index, 1);
  } else {
    selectedRegions.value.push(region);
  }
};

const isRegionSelected = (region: string) => {
  return selectedRegions.value.includes(region);
};

const selectAllRegions = () => {
  if (selectedRegions.value.length === provinces.length) {
    selectedRegions.value = [];
  } else {
    selectedRegions.value = [...provinces];
  }
};

// Employee management
const addEmployee = () => {
  if (!newEmployee.value.name.trim() || !newEmployee.value.salary) return;

  const salary = parseInt(newEmployee.value.salary);
  if (isNaN(salary)) return;

  employees.value.push({
    id: Date.now(),
    name: newEmployee.value.name.trim(),
    salary: salary,
    tenure: newEmployee.value.tenure
  });

  newEmployee.value = { name: '', salary: '', tenure: '1-3' };
};

const removeEmployee = (id: number) => {
  employees.value = employees.value.filter(e => e.id !== id);
};

// File upload
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0];
    // Mock: add some employees from the "uploaded file"
    const mockImportData = [
      { name: '员工E', salary: 28000, tenure: '3-5' },
      { name: '员工F', salary: 32000, tenure: '5-10' },
      { name: '员工G', salary: 18000, tenure: '1-3' },
    ];
    mockImportData.forEach((item, index) => {
      setTimeout(() => {
        employees.value.push({
          id: Date.now() + index,
          name: item.name,
          salary: item.salary,
          tenure: item.tenure
        });
      }, 300 * (index + 1));
    });
  }
};

const removeFile = () => {
  uploadedFile.value = null;
};

const getTenureLabel = (value: string) => {
  return tenureOptions.find(t => t.value === value)?.label || value;
};

const canSubmit = computed(() => {
  return jobName.value.trim() && employees.value.length > 0;
});

const handleSubmit = () => {
  router.push({
    name: 'salary-survey-result',
    query: {
      jobName: jobName.value,
      category: jobCategory.value,
      location: workLocation.value,
      scope: scopeType.value,
      regions: scopeType.value === 'regional' ? selectedRegions.value.join(',') : '',
      basis: salaryBasis.value,
      type: salaryType.value,
      count: employees.value.length.toString(),
    },
  });
};
</script>

<template>
  <div class="form-page">
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
        <div class="section-label">最近使用</div>
        <div
          v-for="(item, index) in recentTools"
          :key="index"
          class="template-item"
          :class="{ active: index === 2 }"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
          <Flame v-if="index === 2" :size="14" class="hot-icon" />
        </div>
      </div>
    </aside>

    <!-- Main Form Area -->
    <main class="form-main">
      <div class="form-header">
        <div class="form-icon">
          <DollarSign :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">岗位薪酬调查</h1>
          <p class="form-subtitle">配置调查参数，智能采集市场薪酬数据，精准对标分析</p>
        </div>
      </div>

      <div class="form-content">
        <!-- Section 1: Job Info -->
        <div class="config-section">
          <h3 class="section-title">
            <span class="step-badge">1</span>
            岗位信息
          </h3>

          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">
                <span class="required">*</span> 岗位名称
              </label>
              <input
                v-model="jobName"
                type="text"
                class="field-input"
                placeholder="如：Java开发工程师"
              />
            </div>

            <div class="form-field">
              <label class="field-label">岗位类别</label>
              <select v-model="jobCategory" class="field-select">
                <option v-for="cat in jobCategories" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label class="field-label">工作地点</label>
              <div class="location-input">
                <MapPin :size="16" class="location-icon" />
                <input
                  v-model="workLocation"
                  type="text"
                  class="field-input with-icon"
                  placeholder="如：上海"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Collection Scope -->
        <div class="config-section">
          <h3 class="section-title">
            <span class="step-badge">2</span>
            采集范围
          </h3>

          <div class="scope-options">
            <label class="radio-card" :class="{ active: scopeType === 'national' }">
              <input type="radio" v-model="scopeType" value="national" />
              <div class="radio-content">
                <span class="radio-title">全国范围</span>
                <span class="radio-desc">采集全国各地区薪酬数据</span>
              </div>
              <Check v-if="scopeType === 'national'" :size="18" class="check-icon" />
            </label>

            <label class="radio-card" :class="{ active: scopeType === 'regional' }">
              <input type="radio" v-model="scopeType" value="regional" />
              <div class="radio-content">
                <span class="radio-title">指定地区</span>
                <span class="radio-desc">选择特定省市进行对比分析</span>
              </div>
              <Check v-if="scopeType === 'regional'" :size="18" class="check-icon" />
            </label>
          </div>

          <!-- Region selector -->
          <div v-if="scopeType === 'regional'" class="region-selector">
            <div class="region-header">
              <span class="region-label">选择对比地区</span>
              <button class="select-all-btn" @click="selectAllRegions">
                {{ selectedRegions.length === provinces.length ? '取消全选' : '全选' }}
              </button>
            </div>
            <div class="region-grid">
              <button
                v-for="region in provinces"
                :key="region"
                class="region-tag"
                :class="{ selected: isRegionSelected(region) }"
                @click="toggleRegion(region)"
              >
                {{ region }}
                <Check v-if="isRegionSelected(region)" :size="12" />
              </button>
            </div>
            <p class="region-hint">已选择 {{ selectedRegions.length }} 个地区</p>
          </div>
        </div>

        <!-- Section 3: Salary Basis -->
        <div class="config-section">
          <h3 class="section-title">
            <span class="step-badge">3</span>
            可比口径
          </h3>

          <div class="basis-grid">
            <div class="basis-group">
              <label class="basis-label">薪资类型</label>
              <div class="basis-options">
                <button
                  v-for="opt in salaryBasisOptions"
                  :key="opt.value"
                  class="basis-btn"
                  :class="{ active: salaryBasis === opt.value }"
                  @click="salaryBasis = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div class="basis-group">
              <label class="basis-label">计算方式</label>
              <div class="basis-options">
                <button
                  v-for="opt in salaryTypeOptions"
                  :key="opt.value"
                  class="basis-btn"
                  :class="{ active: salaryType === opt.value }"
                  @click="salaryType = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Employee Salary Entry -->
        <div class="config-section">
          <h3 class="section-title">
            <span class="step-badge">4</span>
            员工薪酬录入
          </h3>
          <p class="section-hint">录入公司员工薪资，用于与市场数据对标分析</p>

          <!-- Add employee form -->
          <div class="add-employee-form">
            <div class="employee-field">
              <label class="mini-label">员工姓名</label>
              <input
                v-model="newEmployee.name"
                type="text"
                class="field-input"
                placeholder="如：张三"
              />
            </div>
            <div class="employee-field salary-field">
              <label class="mini-label">当前{{ salaryType === 'monthly' ? '月薪' : '年薪' }}</label>
              <div class="salary-input-wrapper">
                <input
                  v-model="newEmployee.salary"
                  type="number"
                  class="field-input"
                  placeholder="如：25000"
                />
                <span class="salary-unit">元/{{ salaryType === 'monthly' ? '月' : '年' }}</span>
              </div>
            </div>
            <div class="employee-field tenure-field">
              <label class="mini-label">入职年限</label>
              <select v-model="newEmployee.tenure" class="field-select">
                <option v-for="t in tenureOptions" :key="t.value" :value="t.value">
                  {{ t.label }}
                </option>
              </select>
            </div>
            <button
              class="add-btn"
              @click="addEmployee"
              :disabled="!newEmployee.name.trim() || !newEmployee.salary"
            >
              <Plus :size="18" />
              添加
            </button>
          </div>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-text">或</span>
          </div>

          <!-- Batch import -->
          <div class="batch-import">
            <label v-if="!uploadedFile" class="upload-area">
              <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" hidden />
              <Upload :size="24" />
              <div class="upload-text">
                <span class="upload-main">上传Excel批量导入</span>
                <span class="upload-hint">支持 .xlsx, .xls 格式，需包含姓名、薪资、年限列</span>
              </div>
            </label>
            <div v-else class="uploaded-file-card">
              <div class="file-info">
                <FileText :size="24" class="file-icon" />
                <div class="file-details">
                  <span class="file-name">{{ uploadedFile.name }}</span>
                  <span class="file-size">{{ (uploadedFile.size / 1024).toFixed(1) }} KB</span>
                </div>
              </div>
              <button class="remove-file-btn" @click="removeFile">
                <X :size="18" />
              </button>
            </div>
          </div>

          <!-- Employee list -->
          <div v-if="employees.length > 0" class="employee-table">
            <div class="table-header">
              <span class="col-name">员工姓名</span>
              <span class="col-salary">当前薪资</span>
              <span class="col-tenure">入职年限</span>
              <span class="col-action">操作</span>
            </div>
            <div class="table-body">
              <div v-for="emp in employees" :key="emp.id" class="table-row">
                <span class="col-name">
                  <Users :size="14" class="emp-icon" />
                  {{ emp.name }}
                </span>
                <span class="col-salary">¥{{ emp.salary.toLocaleString() }}</span>
                <span class="col-tenure">{{ getTenureLabel(emp.tenure) }}</span>
                <span class="col-action">
                  <button class="delete-btn" @click="removeEmployee(emp.id)">
                    <Trash2 :size="14" />
                  </button>
                </span>
              </div>
            </div>
          </div>
          <p class="employee-count">共 {{ employees.length }} 名员工</p>
        </div>

        <!-- Submit Button -->
        <div class="submit-container">
          <button class="submit-btn" @click="handleSubmit" :disabled="!canSubmit">
            开始薪酬调研
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-icon-wrapper">
        <DollarSign :size="28" class="info-main-icon" />
      </div>
      <h3 class="info-title">薪酬调查</h3>
      <p class="info-desc">全网薪酬数据采集分析，为薪酬决策提供数据支撑</p>
      <ul class="feature-list">
        <li v-for="(feature, index) in features" :key="index">
          <span class="bullet">●</span>
          {{ feature }}
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.form-page {
  display: flex;
  height: 100%;
  background: #f8fafc;
}

/* Left Sidebar */
.template-sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
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

.section-label {
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

/* Main Form Area */
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
  padding-right: 20px;
}

/* Config Sections */
.config-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.step-badge {
  width: 24px;
  height: 24px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.section-hint {
  font-size: 13px;
  color: #64748b;
  margin: -8px 0 16px 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  color: #64748b;
}

.required {
  color: #ef4444;
}

.field-input,
.field-select {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: border-color 0.2s;
  background: white;
}

.field-input:focus,
.field-select:focus {
  border-color: #2563eb;
}

.field-input::placeholder {
  color: #94a3b8;
}

.location-input {
  position: relative;
}

.location-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.field-input.with-icon {
  padding-left: 38px;
}

/* Scope Options */
.scope-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.radio-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-card input {
  display: none;
}

.radio-card:hover {
  border-color: #cbd5e1;
}

.radio-card.active {
  background: #eff6ff;
  border-color: #2563eb;
}

.radio-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.radio-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.radio-desc {
  font-size: 12px;
  color: #64748b;
}

.check-icon {
  color: #2563eb;
}

/* Region Selector */
.region-selector {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.region-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.region-label {
  font-size: 13px;
  color: #64748b;
}

.select-all-btn {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.select-all-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.region-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.region-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.region-tag:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.region-tag.selected {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

.region-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 12px 0 0 0;
}

/* Basis Grid */
.basis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.basis-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.basis-label {
  font-size: 13px;
  color: #64748b;
}

.basis-options {
  display: flex;
  gap: 8px;
}

.basis-btn {
  flex: 1;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.basis-btn:hover {
  border-color: #cbd5e1;
}

.basis-btn.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
  font-weight: 500;
}

/* Add Employee Form */
.add-employee-form {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.employee-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.employee-field.salary-field {
  flex: 1.2;
}

.employee-field.tenure-field {
  flex: 0.8;
}

.mini-label {
  font-size: 12px;
  color: #64748b;
}

.salary-input-wrapper {
  position: relative;
}

.salary-input-wrapper .field-input {
  padding-right: 60px;
}

.salary-unit {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: #94a3b8;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.add-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  font-size: 13px;
  color: #94a3b8;
}

/* Batch Import */
.upload-area {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.upload-main {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

/* Uploaded file card */
.uploaded-file-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.uploaded-file-card .file-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.uploaded-file-card .file-icon {
  color: #3b82f6;
}

.uploaded-file-card .file-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.uploaded-file-card .file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.uploaded-file-card .file-size {
  font-size: 12px;
  color: #64748b;
}

.uploaded-file-card .remove-file-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.uploaded-file-card .remove-file-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}

/* Employee Table */
.employee-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 0.5fr;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.table-body {
  max-height: 280px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 0.5fr;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 14px;
  color: #334155;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8fafc;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.emp-icon {
  color: #3b82f6;
}

.col-salary {
  font-weight: 600;
  color: #1e293b;
}

.col-tenure {
  color: #64748b;
  font-size: 13px;
}

.col-action {
  display: flex;
  justify-content: center;
}

.delete-btn {
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

.delete-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}

.employee-count {
  font-size: 13px;
  color: #64748b;
  margin: 12px 0 0 0;
  text-align: right;
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
  flex-shrink: 0;
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

/* Scrollbar styling */
.table-body::-webkit-scrollbar {
  width: 6px;
}

.table-body::-webkit-scrollbar-track {
  background: transparent;
}

.table-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
