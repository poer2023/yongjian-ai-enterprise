<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  Plus,
  ChevronDown,
  Search,
  Clock,
  Send,
  FolderPlus,
  Upload,
  Link,
  ClipboardPaste
} from 'lucide-vue-next';
import FileItem from './enterprise-material/components/FileItem.vue';

// Folder data
const folders = ref([
  { id: 1, name: '测试' },
  { id: 2, name: '学科知识' },
  { id: 3, name: '学生档案' },
  { id: 4, name: '播客资料' },
  { id: 5, name: '山西ai专题' },
  { id: 6, name: '纸质扫描' },
  { id: 7, name: '文献定制' },
  { id: 8, name: '咖啡研究' },
  { id: 9, name: '商标法材料' },
  { id: 10, name: '行业报告' },
  { id: 11, name: '电子书' },
  { id: 12, name: 'AI赋能教育' },
  { id: 13, name: '古本文献' },
  { id: 14, name: 'AI行业' },
  { id: 15, name: '公司资料' }
]);

// File list data - compatible with SourceFile type
const files = ref([
  { id: 1, name: 'die religionsgesprache der reformationsz...', size: '9.36MB', words: '15.78万字', creator: '亚光', status: 'completed' as const, materialCount: 0 },
  { id: 2, name: '《上海市进一步扩大人工智能应用的若干措施...', size: '212.26KB', words: '0.13万字', creator: '包子-运营', status: 'completed' as const, materialCount: 0 },
  { id: 3, name: '《上海市加快推动"AI+制造"发展的实施方案...', size: '373.79KB', words: '0.43万字', creator: '包子-运营', status: 'completed' as const, materialCount: 0 },
  { id: 4, name: '上海市经济和信息化委员会关于印发《上海市...', size: '641.66KB', words: '0.65万字', creator: '包子-运营', status: 'completed' as const, materialCount: 0 },
  { id: 5, name: '中华人民共和国国民经济和社会发展第十四个...', size: '30.31MB', words: '4.91万字', creator: '包子-运营', status: 'completed' as const, materialCount: 0 },
  { id: 6, name: 'Agent上下文工程调研报告.pdf', size: '152.20KB', words: '0.39万字', creator: 'sinder', status: 'completed' as const, materialCount: 0 },
  { id: 7, name: 'DeepSeek 推动下生成式AI走势及其图书馆应...', size: '1.79MB', words: '0.85万字', creator: 'sinder', status: 'completed' as const, materialCount: 0 },
  { id: 8, name: 'opening up military innovation- causal eff...', size: '7.25MB', words: '6.54万字', creator: '黑莉-课题1', status: 'completed' as const, materialCount: 0 },
  { id: 9, name: '06.Profiles in neglect of older adult care ...', size: '206.51KB', words: '1.69万字', creator: '大量', status: 'completed' as const, materialCount: 0 }
]);

// Suggestions
const suggestions = ref([
  { text: '"1530年奥格斯堡非正式谈判中达成的\'八点协议\'主要内容有哪些？"', emoji: '🍪' },
  { text: '"教廷特使卡梅皮奥在公开立场与私下行为上的矛盾反映了怎样的政治现实？"', emoji: '👍' },
  { text: '"为何1530年的非官方宗教协商被视为后续《奥格斯堡和约》的实践雏形？"', emoji: '👍' }
]);

const searchQuery = ref('');
const chatInput = ref('');
const showAddMenu = ref(false);

const containerRef = ref<HTMLElement | null>(null);
const leftPanelWidth = ref(50);
const isDragging = ref(false);
const minWidth = 30;
const maxWidth = 70;

const handleSearch = () => {
  console.log('Searching:', searchQuery.value);
};

const handleSend = () => {
  if (chatInput.value.trim()) {
    console.log('Sending:', chatInput.value);
    chatInput.value = '';
  }
};

const handleSuggestionClick = (text: string) => {
  chatInput.value = text.replace(/^"|"$/g, '');
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;
  const containerRect = containerRef.value.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const mouseX = e.clientX - containerRect.left;
  let newWidth = (mouseX / containerWidth) * 100;
  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
  leftPanelWidth.value = newWidth;
};

const stopDrag = () => {
  isDragging.value = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

onMounted(() => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<template>
  <div class="knowledge-base-page" ref="containerRef">
    <!-- Left: File Manager -->
    <div class="file-manager" :style="{ width: leftPanelWidth + '%' }">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="3" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="5" cy="19" r="3" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="19" cy="19" r="3" stroke="#3b82f6" stroke-width="2"/>
              <path d="M12 8V12" stroke="#3b82f6" stroke-width="2"/>
              <path d="M12 12L5 16" stroke="#3b82f6" stroke-width="2"/>
              <path d="M12 12L19 16" stroke="#3b82f6" stroke-width="2"/>
            </svg>
          </div>
          <h1 class="page-title">团队知识库</h1>
        </div>
        <div class="add-file-wrapper">
          <button class="add-file-btn" @click="showAddMenu = !showAddMenu">
            <Plus :size="18" stroke-width="2.5" />
            <span>添加文件</span>
            <ChevronDown :size="16" stroke-width="2.5" />
          </button>
          <div v-if="showAddMenu" class="add-menu">
            <div class="menu-item">
              <FolderPlus :size="16" />
              <span>新建文件夹</span>
            </div>
            <div class="menu-item">
              <Upload :size="16" />
              <span>本地上传</span>
            </div>
            <div class="menu-item">
              <Link :size="16" />
              <span>网址导入</span>
            </div>
            <div class="menu-item">
              <Search :size="16" />
              <span>搜索添加</span>
            </div>
            <div class="menu-item">
              <ClipboardPaste :size="16" />
              <span>文本粘贴</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <Search :size="18" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文件名、文件夹名称"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>

      <!-- Folders -->
      <div class="folders-grid">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="folder-item"
        >
          <div class="folder-icon-wrapper">
            <svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 0C1.11929 0 0 1.11929 0 2.5V45.5C0 46.8807 1.11929 48 2.5 48H57.5C58.8807 48 60 46.8807 60 45.5V10.5C60 9.11929 58.8807 8 57.5 8H31L23 0H2.5Z" fill="#F59E0B"/>
              <path d="M60 45.5C60 46.8807 58.8807 48 57.5 48H2.5C1.11929 48 0 46.8807 0 45.5V14.5C0 13.1193 1.11929 12 2.5 12H57.5C58.8807 12 60 13.1193 60 14.5V45.5Z" fill="#FCD34D"/>
            </svg>
          </div>
          <span class="folder-name">{{ folder.name }}</span>
        </div>
      </div>

      <!-- Files List -->
      <div class="files-list">
        <FileItem
          v-for="file in files"
          :key="file.id"
          :file="file"
        />
      </div>
    </div>

    <!-- Resizer -->
    <div
      class="resizer"
      :class="{ 'is-dragging': isDragging }"
      @mousedown="startDrag"
    >
      <div class="resizer-handle"></div>
    </div>

    <!-- Right Panel -->
    <div class="chat-panel" :style="{ width: (100 - leftPanelWidth) + '%' }">
      <div class="chat-content">
        <div class="chat-header-hint">你可以这样提问</div>

        <!-- Suggestions -->
        <div class="suggestions-list">
          <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-item"
            @click="handleSuggestionClick(suggestion.text)"
          >
            <span class="suggestion-text">{{ suggestion.text }}</span>
            <span class="suggestion-emoji">{{ suggestion.emoji }}</span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <div class="action-buttons-row">
          <button class="pill-btn">
            <Plus :size="14" stroke-width="2.5" />
            <span>新提问</span>
          </button>
          <button class="pill-btn">
            <Clock :size="14" stroke-width="2.5" />
            <span>提问记录</span>
          </button>
        </div>
        <div class="input-container">
          <textarea
            v-model="chatInput"
            placeholder="想了解什么知识，快来问问我！ Shift+Enter/Ctrl+Enter换行"
            class="main-input"
            @keydown.enter.prevent="handleSend"
          ></textarea>
          <button class="send-btn" @click="handleSend">
            <Send :size="18" fill="white" stroke="white" />
          </button>
        </div>
        <p class="disclaimer-text">回复的内容由AI生成，非人工编辑；其内容准确性和完整性无法保证，不代表我们的态度和观点。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-base-page {
  flex: 1;
  height: 100%;
  display: flex;
  background: #eff6ff;
  overflow: hidden;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* --- Left Panel --- */
.file-manager {
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  overflow-x: hidden;
  overflow-y: auto;
  min-width: min(480px, 100%);
  min-height: 0;
  flex-shrink: 0;
  background-color: #eff6ff;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.3px;
}

.add-file-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  transition: background 0.2s;
}

.add-file-btn:hover {
  background: #1d4ed8;
}

.add-file-wrapper {
  position: relative;
}

.add-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  min-width: 160px;
  z-index: 10;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item svg {
  color: #6b7280;
}

/* Search - same as enterprise material */
.search-bar {
  display: flex;
  align-items: center;
  height: 48px;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 0 4px 0 16px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.search-icon {
  color: #3b82f6;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 15px;
  color: #374151;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  height: 40px;
  padding: 0 24px;
  background: #1d4ed8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* Folders - same as enterprise material */
.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 32px 16px;
  margin-bottom: 40px;
}

.folder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.15s;
}

.folder-item:hover {
  transform: translateY(-2px);
}

.folder-name {
  font-size: 13px;
  color: #4b5563;
  text-align: center;
  width: 100%;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

/* Files List - same as enterprise material */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  width: 100%;
}

/* --- Resizer --- */
.resizer {
  width: 1px;
  background: #dbeafe;
  position: relative;
  z-index: 10;
  cursor: col-resize;
  flex-shrink: 0;
}

.resizer:hover {
  width: 4px;
  background: #bfdbfe;
}

/* --- Right Chat Panel --- */
.chat-panel {
  background: white;
  display: flex;
  flex-direction: column;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.chat-header-hint {
  margin-bottom: 40px;
  font-size: 16px;
  color: #4b5563;
  font-weight: 500;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 700px;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02);
  border: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.suggestion-item:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,0.06);
  border-color: #e5e7eb;
  transform: translateY(-2px);
}

.suggestion-text {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.suggestion-emoji {
  margin-left: 16px;
  font-size: 20px;
}

/* Input Area */
.chat-input-area {
  background: white;
  padding: 24px 40px;
}

.action-buttons-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  justify-content: flex-end;
}

.pill-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: white;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  font-weight: 500;
  transition: all 0.2s;
}

.pill-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.input-container {
  display: flex;
  flex-direction: column;
  min-height: 140px;
  background: white;
  border: 1px solid #bfdbfe;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.05);
  position: relative;
  transition: border-color 0.2s;
}

.input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

.main-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1f2937;
  resize: none;
  flex: 1;
  font-family: inherit;
  line-height: 1.6;
}

.main-input::placeholder {
  color: #9ca3af;
}

.send-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background: #cbd5e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn:hover {
  background: #94a3b8;
}

.send-btn.active {
  background: #3b82f6;
}

.disclaimer-text {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 20px;
  transform: scale(0.95);
}
</style>
