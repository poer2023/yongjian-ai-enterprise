<script setup lang="ts">
import { ref } from 'vue';
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Bell,
  FileSearch,
  FileText,
  Search,
  Plus,
  X,
  MapPin,
  Tag,
  Clock,
  Mail,
  MessageSquare,
  Save
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// 关键词配置
const keywords = ref<string[]>(['网络安全', '等保测评', '渗透测试']);
const newKeyword = ref('');

// 地区配置
const selectedRegions = ref<string[]>(['全国']);
const regionExpanded = ref(false);

// 所有可选地区（全部省份）
const allRegions = [
  '全国', '北京', '上海', '天津', '重庆',
  '江苏', '浙江', '广东', '山东', '四川',
  '湖北', '湖南', '河南', '河北', '福建',
  '安徽', '江西', '陕西', '山西', '辽宁',
  '吉林', '黑龙江', '云南', '贵州', '甘肃',
  '海南', '青海', '内蒙古', '广西', '西藏',
  '宁夏', '新疆'
];

const toggleRegion = (region: string) => {
  if (region === '全国') {
    selectedRegions.value = ['全国'];
  } else {
    const nationIndex = selectedRegions.value.indexOf('全国');
    if (nationIndex > -1) {
      selectedRegions.value.splice(nationIndex, 1);
    }

    const index = selectedRegions.value.indexOf(region);
    if (index > -1) {
      selectedRegions.value.splice(index, 1);
      if (selectedRegions.value.length === 0) {
        selectedRegions.value = ['全国'];
      }
    } else {
      selectedRegions.value.push(region);
    }
  }
};

// 项目类型
const selectedTypes = ref<string[]>(['服务类']);

// 预算范围
const budgetMin = ref('');
const budgetMax = ref('');

// 推送设置
const pushTimes = ref<string[]>(['09:00']);
const pushMethods = ref<string[]>(['site']);

const typeOptions = [
  { value: '货物类', label: '货物类' },
  { value: '服务类', label: '服务类' },
  { value: '工程类', label: '工程类' },
];

const timeOptions = [
  { value: '09:00', label: '每日 09:00' },
  { value: '12:00', label: '每日 12:00' },
  { value: '18:00', label: '每日 18:00' },
];

const methodOptions = [
  { value: 'site', label: '站内通知', icon: Bell },
  { value: 'email', label: '邮件推送', icon: Mail },
  { value: 'wechat', label: '企业微信', icon: MessageSquare },
];

const templateTypes = [
  { icon: Bell, label: '标讯订阅', active: true, routeName: 'bid-info-form' },
  { icon: FileSearch, label: '标讯解读', routeName: 'bid-analysis-form' },
  { icon: FileText, label: 'AI标书生成', routeName: 'bid-doc-form' },
];

const features = [
  '关键词智能监控',
  '多维度筛选过滤',
  '每日自动推送',
  'AI匹配度评估',
  '一键查看原文解读',
];

const goBack = () => {
  router.push({ name: 'agents' });
};

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const addKeyword = () => {
  if (newKeyword.value.trim() && !keywords.value.includes(newKeyword.value.trim())) {
    keywords.value.push(newKeyword.value.trim());
    newKeyword.value = '';
  }
};

const removeKeyword = (keyword: string) => {
  const index = keywords.value.indexOf(keyword);
  if (index > -1) {
    keywords.value.splice(index, 1);
  }
};

const toggleType = (value: string) => {
  const index = selectedTypes.value.indexOf(value);
  if (index > -1) {
    selectedTypes.value.splice(index, 1);
  } else {
    selectedTypes.value.push(value);
  }
};

const toggleTime = (value: string) => {
  const index = pushTimes.value.indexOf(value);
  if (index > -1) {
    pushTimes.value.splice(index, 1);
  } else {
    pushTimes.value.push(value);
  }
};

const toggleMethod = (value: string) => {
  const index = pushMethods.value.indexOf(value);
  if (index > -1) {
    pushMethods.value.splice(index, 1);
  } else {
    pushMethods.value.push(value);
  }
};

const handleSave = () => {
  const config = {
    keywords: keywords.value,
    regions: selectedRegions.value,
    types: selectedTypes.value,
    budget: { min: budgetMin.value, max: budgetMax.value },
    push: { times: pushTimes.value, methods: pushMethods.value },
  };
  console.log('Saving subscription:', config);
  alert('订阅配置已保存');
};

const viewDaily = () => {
  router.push({ name: 'bid-info-daily' });
};
</script>

<template>
  <div class="review-form-page">
    <!-- Left Sidebar -->
    <aside class="template-sidebar">
      <button class="back-btn" @click="goBack">
        <ChevronLeft :size="16" />
        <span>返回应用市场</span>
      </button>

      <div class="search-box">
        <Search :size="14" class="search-icon" />
        <input type="text" placeholder="搜索投标工具" class="search-input" />
      </div>

      <div class="template-section">
        <div class="section-title">投标工具</div>
        <div
          v-for="(item, index) in templateTypes"
          :key="index"
          class="template-item"
          :class="{ active: item.active }"
          @click="navigateTo(item.routeName)"
        >
          <component :is="item.icon" :size="16" class="item-icon" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </aside>

    <!-- Main Form Area -->
    <main class="form-main">
      <div class="form-header">
        <div class="form-icon">
          <Bell :size="20" />
        </div>
        <div class="form-title-area">
          <h1 class="form-title">标讯订阅</h1>
          <p class="form-subtitle">每日自动拉取最新标讯，AI智能匹配推送</p>
        </div>
      </div>

      <div class="form-content">
        <!-- 关键词配置 -->
        <div class="form-section">
          <div class="section-header">
            <Tag :size="16" />
            <span>关键词配置</span>
          </div>

          <div class="form-group">
            <label class="form-label">监控关键词</label>
            <div class="keyword-input">
              <input
                v-model="newKeyword"
                type="text"
                class="form-input"
                placeholder="输入关键词后按回车添加"
                @keyup.enter="addKeyword"
              />
              <button class="add-btn" @click="addKeyword">
                <Plus :size="16" />
              </button>
            </div>
            <div class="keyword-tags">
              <span v-for="keyword in keywords" :key="keyword" class="keyword-tag">
                {{ keyword }}
                <button class="remove-tag" @click="removeKeyword(keyword)">
                  <X :size="12" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- 地区配置 -->
        <div class="form-section">
          <div class="section-header">
            <MapPin :size="16" />
            <span>监控配置</span>
          </div>

          <div class="form-group">
            <div class="config-row">
              <label class="config-label">监控地区</label>
              <div class="config-options">
                <!-- 收起状态：只显示已选中的 + 展开按钮 -->
                <template v-if="!regionExpanded">
                  <button
                    v-for="region in selectedRegions"
                    :key="region"
                    class="option-tag active"
                    @click="toggleRegion(region)"
                  >
                    {{ region }}
                  </button>
                  <button class="expand-btn" @click="regionExpanded = true">
                    <ChevronDown :size="14" />
                  </button>
                </template>

                <!-- 展开状态：显示全部选项 + 收起按钮 -->
                <template v-else>
                  <button
                    v-for="region in allRegions"
                    :key="region"
                    class="option-tag"
                    :class="{ active: selectedRegions.includes(region) }"
                    @click="toggleRegion(region)"
                  >
                    {{ region }}
                  </button>
                  <button class="expand-btn" @click="regionExpanded = false">
                    <ChevronRight :size="14" />
                  </button>
                </template>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="config-row">
              <label class="config-label">项目类型</label>
              <div class="config-options">
                <button
                  v-for="type in typeOptions"
                  :key="type.value"
                  class="option-tag"
                  :class="{ active: selectedTypes.includes(type.value) }"
                  @click="toggleType(type.value)"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="config-row">
              <label class="config-label">预算范围</label>
              <div class="budget-inputs">
                <input
                  v-model="budgetMin"
                  type="text"
                  class="budget-input"
                  placeholder="最低"
                />
                <span class="budget-separator">-</span>
                <input
                  v-model="budgetMax"
                  type="text"
                  class="budget-input"
                  placeholder="最高"
                />
                <span class="budget-unit">万元</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="config-row">
              <label class="config-label">推送时间</label>
              <div class="config-options">
                <button
                  v-for="time in timeOptions"
                  :key="time.value"
                  class="option-tag"
                  :class="{ active: pushTimes.includes(time.value) }"
                  @click="toggleTime(time.value)"
                >
                  {{ time.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="submit-container">
          <button class="submit-btn secondary" @click="handleSave">
            <Save :size="16" />
            保存订阅
          </button>
          <button class="submit-btn primary" @click="viewDaily">
            <Bell :size="16" />
            查看今日标讯
          </button>
        </div>
      </div>
    </main>

    <!-- Right Info Card -->
    <aside class="info-sidebar">
      <div class="info-card">
        <div class="info-icon">🔔</div>
        <h3 class="info-title">标讯订阅</h3>
        <p class="info-desc">智能监控招标信息，每日自动推送商机</p>
        <ul class="feature-list">
          <li v-for="(feature, index) in features" :key="index">
            <span class="bullet">●</span>
            {{ feature }}
          </li>
        </ul>
      </div>
    </aside>
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #eff6ff;
  border: none;
  border-radius: 6px;
  color: #3b82f6;
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
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.search-icon {
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  color: #475569;
}

.template-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 12px;
  color: #94a3b8;
  padding: 8px 0 4px 0;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  background: #f1f5f9;
}

.template-item.active {
  background: #eff6ff;
  color: #3b82f6;
  font-weight: 500;
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
  margin-bottom: 32px;
}

.form-icon {
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.form-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.form-content {
  max-width: 100%;
  padding-right: 40px;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.section-header svg {
  color: #3b82f6;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.keyword-input {
  display: flex;
  gap: 8px;
}

.keyword-input .form-input {
  flex: 1;
}

.add-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #2563eb;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.keyword-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 16px;
  font-size: 13px;
}

.remove-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: rgba(59, 130, 246, 0.2);
  border: none;
  border-radius: 50%;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-tag:hover {
  background: #3b82f6;
  color: white;
}

.option-selector {
  display: flex;
  gap: 12px;
}

.option-selector.three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.option-selector.four-col {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.option-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.option-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-field {
  width: 120px;
  text-align: center;
}

.range-separator {
  color: #94a3b8;
}

.range-unit {
  color: #64748b;
  font-size: 14px;
}

/* 监控配置行样式 */
.config-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.config-label {
  font-size: 14px;
  color: #64748b;
  white-space: nowrap;
  min-width: 70px;
}

.config-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-tag {
  padding: 6px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.option-tag:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.option-tag.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.budget-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.budget-input {
  width: 80px;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
  outline: none;
  text-align: center;
}

.budget-input:focus {
  border-color: #3b82f6;
}

.budget-input::placeholder {
  color: #cbd5e1;
}

.budget-separator {
  color: #94a3b8;
}

.budget-unit {
  color: #64748b;
  font-size: 14px;
}

.submit-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-bottom: 40px;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn.primary {
  background: #3b82f6;
  color: white;
}

.submit-btn.primary:hover {
  background: #2563eb;
}

.submit-btn.secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.submit-btn.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.info-sidebar {
  width: 280px;
  padding: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.info-icon {
  font-size: 48px;
  margin-bottom: 16px;
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
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  padding: 6px 0;
}

.bullet {
  color: #3b82f6;
  font-size: 8px;
}
</style>
