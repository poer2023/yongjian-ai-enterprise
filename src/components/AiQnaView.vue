<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Added router import
import {
  MessageSquare,
  Map,
  BookOpen,
  Plus,
  History,
  Copy,
  Trash2,
  Globe,
  Database,
  GraduationCap,
  ChevronRight,
  Image as ImageIcon,
  Paperclip,
  Send,
  ExternalLink,
  BrainCircuit,
  Briefcase,
  ChevronDown,
  Check
} from 'lucide-vue-next';

const router = useRouter(); // Init router

// Mock Data
const questionTitle = ref('帮我查找最近有哪些等保测评相关的招标项目');
const questionTime = ref('2026-02-03 10:30');

// Chat Input Logic
const inputValue = ref('');
const showSearchDropdown = ref(false);
// 标讯搜索 enabled by default, others disabled
const enabledSearchModes = ref<Set<string>>(new Set(['enterprise']));

const searchModes = [
  { id: 'enterprise', label: '标讯搜索', icon: Briefcase },
  { id: 'web', label: '联网搜索', icon: Globe },
  { id: 'knowledge', label: '知识库搜索', icon: BrainCircuit },
  { id: 'academic', label: '学术搜索', icon: GraduationCap },
];

const toggleSearchMode = (modeId: string) => {
  if (enabledSearchModes.value.has(modeId)) {
    enabledSearchModes.value.delete(modeId);
  } else {
    enabledSearchModes.value.add(modeId);
  }
};

const toggleSearchDropdown = () => {
  showSearchDropdown.value = !showSearchDropdown.value;
};

const isEnabled = (modeId: string) => {
  return enabledSearchModes.value.has(modeId);
};

const closeDropdown = () => {
  showSearchDropdown.value = false;
};

// References Data - Updated with Bid Search
const references = [
  {
    type: 'enterprise',
    title: 'XX市政府信息系统安全等级保护测评服务项目',
    content: '预算：50万元 | 截止：2024-02-15 | 发布单位：XX市政务服务中心。要求投标单位具备等保测评资质，与公司资质高度匹配。',
    id: 1
  },
  {
    type: 'enterprise',
    title: 'XX区卫生健康委员会等保测评项目',
    content: '预算：38万元 | 截止：2024-02-27 | 发布单位：XX区卫生健康委员会。政府医疗系统客户，资质要求明确。',
    id: 2
  },
  {
    type: 'enterprise',
    title: 'XX省电力公司网络安全评估服务',
    content: '预算：120万元 | 截止：2024-02-25 | 发布单位：XX省电力有限公司。电力行业大客户，预算充足。',
    id: 3
  },
  {
    type: 'kb',
    title: '等保测评业务投标指南',
    content: '等保测评项目投标需准备：等保测评机构资质证书、项目团队配置方案、测评方法论说明、典型案例介绍...',
    id: 4
  },
  {
    type: 'web',
    title: '2024年等保测评市场趋势分析',
    content: '根据最新数据，2024年等保测评市场规模预计达到150亿元，同比增长25%。政府、金融、医疗行业需求最为旺盛...',
    id: 5
  },
  {
    type: 'enterprise',
    title: 'XX集团密码应用安全性评估项目',
    content: '预算：45万元 | 截止：2024-02-20 | 发布单位：XX集团有限公司。大型国企客户，项目质量有保障。',
    id: 6
  }
];

const handleRefClick = (refItem: any) => {
  if (refItem.type === 'enterprise') {
    router.push({
      name: 'bid-detail',
      query: { id: refItem.id }
    });
  }
};

const steps = [
  { icon: Briefcase, text: '标讯搜索', detail: '等保测评 招标项目' },
  { icon: Database, text: '知识库搜索', detail: '等保测评 投标指南' },
  { icon: Globe, text: '联网搜索', detail: '等保测评 市场趋势' }
];

const answerContent = `
<p>根据您的查询，我为您从标讯库中筛选出了近期与<strong>等保测评</strong>相关的招标项目。以下是匹配度较高的项目汇总：</p>

<h3>1. 高匹配项目推荐</h3>
<p>共发现 <strong>4个高匹配度</strong> 等保测评相关项目，总预算约 <strong>253万元</strong>：</p>
<ul>
  <li><strong>XX市政府信息系统安全等级保护测评服务项目</strong> - 预算50万，截止2月15日，与公司等保测评资质高度匹配</li>
  <li><strong>XX省电力公司网络安全评估服务</strong> - 预算120万，截止2月25日，电力行业大客户</li>
  <li><strong>XX集团密码应用安全性评估项目</strong> - 预算45万，截止2月20日，大型国企客户</li>
  <li><strong>XX区卫生健康委员会等保测评项目</strong> - 预算38万，截止2月27日，政府医疗系统</li>
</ul>

<h3>2. 投标建议</h3>
<ul>
  <li><strong>优先跟进：</strong>XX市政府项目资质匹配度最高（92%），且截止时间较近，建议优先准备投标材料</li>
  <li><strong>重点关注：</strong>XX省电力公司项目预算充足（120万），虽然竞争可能较激烈，但项目含金量高</li>
  <li><strong>资源评估：</strong>建议根据团队当前工作负荷，选择2-3个项目重点投标</li>
</ul>

<h3>3. 市场洞察</h3>
<p>根据近期标讯数据分析，等保测评类项目呈现以下趋势：</p>
<ul>
  <li>政府和医疗行业需求持续增长，占比达65%</li>
  <li>项目平均预算较去年同期上涨15%</li>
  <li>等保2.0相关项目数量明显增加</li>
</ul>

<p>如需查看项目详情或生成投标方案，请点击右侧参考来源中的具体项目，或使用<strong>AI标书生成</strong>功能快速生成投标文件。</p>
`;
</script>

<template>
  <div class="ai-qna-layout" @click="closeDropdown">
    <!-- Main Content -->
    <main class="local-main-content">
      <!-- Header -->
      <header class="qna-header">
        <div class="header-left">
          <div class="msg-icon">
            <MessageSquare :size="20" />
          </div>
          <div class="header-text">
            <h1 class="header-title">{{ questionTitle }}</h1>
            <span class="header-time">{{ questionTime }}</span>
          </div>
        </div>
      </header>

      <!-- Chat Container -->
      <div class="chat-container">
        <!-- User Question -->
        <div class="message-row user">
          <div class="message-bubble user-bubble">
            {{ questionTitle }}
          </div>
        </div>
        
        <!-- AI Answer -->
        <div class="message-row ai">
          <div class="ai-avatar-area">
             <div class="ai-avatar">
               <img src="https://api.dicebear.com/7.x/bottts/svg?seed=law" alt="AI" />
             </div>
          </div>
          
          <div class="message-content">
             <div class="answer-status-bar">
               <span class="status-tag">
                 <span class="check-icon">✓</span> 已完成回答
               </span>
               <div class="status-actions">
                 <button class="status-btn"><Copy :size="14" /> 复制</button>
                 <button class="status-btn"><Trash2 :size="14" /> 删除</button>
                 <button class="status-btn">参考来源 <ChevronRight :size="14" /></button>
               </div>
             </div>

             <!-- Reasoning/Steps -->
             <div class="reasoning-area">
                <div class="reasoning-summary">
                   <p>产品设计的本质涉及设计理念、用户需求、功能实现与美学平衡等多个层面。我将从核心定义出发，结合经典理论与实际案例，探讨其根本目标与方法论，帮助理解产品设计在现代创新中的关键作用。</p>
                </div>
                
                <div class="steps-list">
                   <div v-for="(step, idx) in steps" :key="idx" class="step-item">
                      <span class="step-name"><component :is="step.icon" :size="14" /> {{ step.text }}</span>
                      <span class="step-detail">{{ step.detail }}</span>
                      <span class="step-status">已获取</span>
                   </div>
                </div>
             </div>

             <!-- Main Answer Text -->
             <div class="answer-text" v-html="answerContent"></div>

             <div class="answer-footer">
                <div class="footer-actions">
                   <button class="footer-btn"><Plus :size="16" /> 新提问</button>
                   <button class="footer-btn"><History :size="16" /> 提问记录</button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area-wrapper">
         <div class="input-box">
             <textarea 
                v-model="inputValue" 
                class="chat-textarea" 
                placeholder="想了解什么法律知识，快来问问我！Shift+Enter/Ctrl+Enter换行"
                @click.stop="closeDropdown"
            ></textarea>
            
             <div class="input-actions">
                <!-- Left Actions -->
                <div class="left-actions">
                    <!-- Search Mode Selector -->
                    <div class="search-mode-selector" @click.stop="toggleSearchDropdown">
                        <div class="selected-icons">
                            <component
                            v-for="mode in searchModes"
                            :key="mode.id"
                            :is="mode.icon"
                            :size="18"
                            class="mode-icon"
                            :class="{ active: isEnabled(mode.id) }"
                            />
                        </div>
                        <ChevronDown :size="14" class="selector-chevron" />

                        <!-- Dropdown Menu -->
                        <div v-if="showSearchDropdown" class="search-dropdown">
                            <div
                            v-for="mode in searchModes"
                            :key="mode.id"
                            class="dropdown-item"
                            :class="{ selected: isEnabled(mode.id) }"
                            @click.stop="toggleSearchMode(mode.id)"
                            >
                            <component :is="mode.icon" :size="16" class="dropdown-icon" />
                            <span class="dropdown-label">{{ mode.label }}</span>
                            <Check v-if="isEnabled(mode.id)" :size="16" class="check-icon" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Actions -->
                <div class="right-actions">
                    <ImageIcon :size="20" class="tool-icon" />
                    <Paperclip :size="20" class="tool-icon" />
                    <button class="send-btn" :class="{ active: inputValue.length > 0 }">
                    <Send :size="18" />
                    </button>
                </div>
             </div>
         </div>
      </div>
    </main>

    <!-- Right Sidebar: References -->
    <aside class="references-sidebar">
      <div class="ref-header">
         <span class="ref-title">参考来源</span>
         <span class="ref-count">{{ references.length }}篇</span>
      </div>

      <div class="ref-list">
         <div
           v-for="ref in references"
           :key="ref.id"
           class="ref-card"
           :class="{ 'clickable': ref.type === 'enterprise' }"
           @click="handleRefClick(ref)"
         >
            <div class="ref-card-header">
               <span class="ref-icon">
                  <Database v-if="ref.type === 'kb'" :size="14" color="#2563eb" />
                  <Briefcase v-else-if="ref.type === 'enterprise'" :size="14" color="#16a34a" />
                  <Globe v-else :size="14" color="#0ea5e9" />
               </span>
               <span class="ref-source-name">
                 {{ ref.type === 'kb' ? '知识库' : ref.type === 'enterprise' ? '标讯搜索' : '互联网' }}
               </span>
            </div>
            <h4 class="ref-card-title">{{ ref.title }}</h4>
            <p class="ref-card-content">{{ ref.content }}</p>
            <button class="add-kb-btn">
               <Plus :size="12" /> 加入知识库
            </button>
         </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.ai-qna-layout {
  display: flex;
  height: 100%;
  width: 100%;
  background: #f8fafc;
  overflow: hidden;
}

/* Local Main Content */
.local-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0; 
}

/* Header */
.qna-header {
  height: 60px;
  background: white; 
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #f1f5f9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.msg-icon {
  width: 32px;
  height: 32px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.header-time {
  font-size: 11px;
  color: #94a3b8;
}

/* Chat Container */
.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 80px 240px 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row.user {
  justify-content: flex-end;
}

.user-bubble {
  background: #eff6ff;
  color: #1e40af;
  padding: 12px 20px;
  border-radius: 12px 12px 2px 12px;
  font-size: 15px;
  max-width: 80%;
  font-weight: 500;
}

.message-row.ai {
  gap: 16px;
  align-items: flex-start;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: #eff6ff;
}
.ai-avatar img { width: 100%; height: 100%; }

.message-content {
  flex: 1;
  max-width: 800px; 
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.answer-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}
.check-icon { color: #2563eb; }

.status-actions {
  display: flex;
  gap: 12px;
}

.status-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
}
.status-btn:hover { color: #2563eb; }

/* Reasoning Area */
.reasoning-area {
  background: #f8fafc;
  border-left: 3px solid #e2e8f0;
  padding: 12px 20px;
  border-radius: 0 8px 8px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reasoning-summary p {
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.step-name {
  color: #2563eb;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 80px;
}

.step-detail {
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  color: #475569;
}

.step-status {
  margin-left: auto;
  color: #94a3b8;
}

/* Answer Text */
.answer-text {
  font-size: 15px;
  line-height: 1.8;
  color: #1e293b;
}

:deep(h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  color: #0f172a;
}

:deep(p) { margin: 0 0 12px 0; }
:deep(ul) { padding-left: 20px; margin-bottom: 12px; }
:deep(li) { margin-bottom: 6px; }

.answer-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}
.footer-actions {
  display: flex;
  gap: 16px;
}
.footer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}
.footer-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

/* Input Area */
.input-area-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 80px;
  background: linear-gradient(180deg, rgba(248,250,252,0) 0%, #f8fafc 40%);
  pointer-events: none;
}

.input-box {
  pointer-events: auto;
  background: white;
  border: 1px solid #60a5fa;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.05);
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 200px;
  position: relative;
  transition: all 0.3s ease;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.input-box:focus-within {
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.1);
}

.chat-textarea {
  width: 100%;
  flex: 1;
  border: none;
  resize: none;
  font-size: 15px;
  line-height: 1.6;
  color: #334155;
  outline: none;
  background: transparent;
  padding: 0;
  margin-bottom: 20px;
  font-family: inherit;
}
.chat-textarea::placeholder { color: #94a3b8; }

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Action Pill */
.action-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #22c55e;
}

/* Search Mode Selector */
.search-mode-selector {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.search-mode-selector:hover { background: #e2e8f0; }

.selected-icons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mode-icon {
  color: #94a3b8;
  transition: color 0.2s;
}
.mode-icon.active { color: #3b82f6; }

.selector-chevron { color: #64748b; }

/* Dropdown Menu */
.search-dropdown {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  z-index: 100;
  min-width: 160px;
  padding: 8px;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
}
.dropdown-item:hover { background: #f8fafc; }
.dropdown-item.selected { background: #eff6ff; }

.dropdown-icon { color: #64748b; }
.dropdown-item.selected .dropdown-icon { color: #3b82f6; }

.dropdown-label {
  flex: 1;
  font-size: 14px;
  color: #334155;
  white-space: nowrap;
}
.dropdown-item.selected .dropdown-label {
  color: #3b82f6;
  font-weight: 500;
}

.check-icon { color: #3b82f6; }

/* Right Tools */
.tool-icon {
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
}
.tool-icon:hover { color: #64748b; }

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #cbd5e1;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: not-allowed;
  transition: all 0.2s;
}
.send-btn.active {
  background: #3b82f6;
  cursor: pointer;
}
.send-btn.active:hover { background: #2563eb; }

/* Right Sidebar */
.references-sidebar {
  width: 280px;
  background: white;
  border-left: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.ref-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ref-title {
  font-weight: 600;
  color: #1e293b;
}
.ref-count {
  font-size: 12px;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 10px;
  color: #64748b;
}

.ref-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.ref-card {
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
  transition: all 0.2s;
}
.ref-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-color: #e2e8f0;
}

.ref-card.clickable {
  cursor: pointer;
}
.ref-card.clickable:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.ref-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
}
.ref-source-name { color: #64748b; }

.ref-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.ref-card-content {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.add-kb-btn {
  margin-top: 4px;
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 11px;
  color: #475569;
  cursor: pointer;
}
.add-kb-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}
</style>
