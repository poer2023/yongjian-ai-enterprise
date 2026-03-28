<script setup lang="ts">
import SearchBox from './SearchBox.vue';
import { useRouter } from 'vue-router';
import {
  Bot,
  Clock,
  LayoutGrid,
  ChevronRight,
  Briefcase,
  MessageSquare,
  Database,
  UserCheck,
  FileUser,
  DollarSign,
  FileSearch,
  FileText,
  Zap,
  Target
} from 'lucide-vue-next';

const router = useRouter();

// 全部应用列表
const allAgents = [
  {
    id: 1,
    name: 'Boss直聘招聘',
    description: '智能RPA招聘助手，自动筛选简历打招呼',
    icon: UserCheck,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    routeName: 'boss-recruit'
  },
  {
    id: 2,
    name: '简历分析',
    description: '简历智能解析匹配，生成面试问题建议',
    icon: FileUser,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    routeName: 'resume-analysis-form'
  },
  {
    id: 3,
    name: '薪酬调查',
    description: '行业薪酬数据采集分析，精准定薪决策',
    icon: DollarSign,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    routeName: 'salary-survey-form'
  },
  {
    id: 4,
    name: '标讯解读',
    description: '招标文件智能解析，快速提取关键信息',
    icon: FileSearch,
    color: '#10b981',
    bgColor: '#ecfdf5',
    routeName: 'bid-analysis-form'
  },
  {
    id: 7,
    name: 'AI标书生成（一键版）',
    description: '一键上传招标文件，全自动生成投标文件',
    icon: Zap,
    color: '#f59e0b',
    bgColor: '#fffbeb',
    routeName: 'bid-doc-oneclick-form'
  },
  {
    id: 8,
    name: '招投标市场分析',
    description: '销售策略工具，分析招标单位、竞争对手和项目',
    icon: Target,
    color: '#ef4444',
    bgColor: '#fef2f2',
    routeName: 'competition-analysis'
  }
];

// 最近使用展示前4个应用
const recentAgents = allAgents.slice(0, 4);

const handleCardClick = (agent: any) => {
  if (agent.routeName) {
    router.push({ name: agent.routeName });
  }
};
</script>

<template>
  <div class="agents-view">
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <Bot :size="24" />
          </div>
          <div class="header-text">
            <h1 class="page-title">智能体应用市场</h1>
            <p class="page-subtitle">基于知识库、结合工作流、定制智能体应用</p>
          </div>
        </div>
        <SearchBox />
      </div>

      <!-- Recently Used Section -->
      <section class="section">
        <div class="section-header">
          <div class="section-title">
            <Clock :size="18" class="title-icon" />
            <span>最近使用</span>
          </div>
          <div class="section-action">
            <ChevronRight :size="16" />
            <span>使用记录</span>
          </div>
        </div>
        <div class="agent-grid">
          <div
            v-for="agent in recentAgents"
            :key="agent.id"
            class="agent-card"
            @click="handleCardClick(agent)"
          >
            <div class="agent-icon" :style="{ backgroundColor: agent.bgColor }">
              <component :is="agent.icon" :size="24" :style="{ color: agent.color }" />
            </div>
            <div class="agent-info">
              <span class="agent-name">{{ agent.name }}</span>
              <span class="agent-desc">{{ agent.description }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- All Applications Section -->
      <section class="section">
        <div class="section-header">
          <div class="section-title">
            <LayoutGrid :size="18" class="title-icon" />
            <span>全部应用</span>
          </div>
        </div>
        <div class="agent-grid">
          <div
            v-for="agent in allAgents"
            :key="agent.id"
            class="agent-card"
            @click="handleCardClick(agent)"
          >
            <div class="agent-icon" :style="{ backgroundColor: agent.bgColor }">
              <component :is="agent.icon" :size="24" :style="{ color: agent.color }" />
            </div>
            <div class="agent-info">
              <span class="agent-name">{{ agent.name }}</span>
              <span class="agent-desc">{{ agent.description }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.agents-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 24px 32px;
  background: #f8fafc;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  padding: 24px 32px;
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 0.3px;
}

.page-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
}

.title-icon {
  color: #3b82f6;
}

.section-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.section-action:hover {
  color: #3b82f6;
}

/* Agent Grid - 横向卡片布局 */
.agent-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .agent-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .agent-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .agent-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Agent Card - 横向布局 */
.agent-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.agent-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #dbeafe;
}

.agent-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.agent-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.agent-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
