<script setup lang="ts">
import { computed, ref } from 'vue';
import { AlignmentType, Document, Packer, Paragraph, TextRun } from 'docx';
import { ChevronDown, Download, FileText, Sparkles } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const mockSourceFilename = '信息系统安全等级保护测评服务项目招标文件.doc';

const uploadedFilename = computed(() => mockSourceFilename);

const additionalInfo = computed(() => {
  const value = route.query.additionalInfo;
  return typeof value === 'string' ? value : '';
});

const baseDocumentName = computed(() => uploadedFilename.value.replace(/\.[^.]+$/, '') || '智能投标文件');
const generatedDocumentName = computed(() => `${baseDocumentName.value}-AI生成版.docx`);
const generatedBidTitle = computed(() => `《${baseDocumentName.value}》投标文件（AI 初稿）`);
const generatedAt = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date()).replace(/\//g, '-');
const pluginManifestName = '涌见AI-Word插件.manifest.xml';
const isGuideExpanded = ref(false);

const guideSteps = [
  {
    title: '下载 Word 插件',
    description: '点击“下载 Word 插件”按钮，获取 manifest.xml 安装清单并保存到本地。',
  },
  {
    title: '在 Word 中加载插件',
    description: '打开 Word，进入“插入”或“我的加载项”，选择从文件或共享位置导入 manifest.xml。',
  },
  {
    title: '登录涌见AI账号获取历史标书',
    description: '在插件中登录涌见AI账号，拉取并查看已生成的 AI 标书历史记录，选择目标文档继续处理。',
  },
  {
    title: '使用插件继续处理',
    description: '在 Word 中使用插件推荐已匹配的企业素材，并可一键插入到对应章节，提升完善效率。',
  },
];

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadBidDocument = async () => {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: generatedBidTitle.value,
          bold: true,
          size: 34,
          font: '微软雅黑',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 320 },
      children: [
        new TextRun({
          text: `生成时间：${generatedAt}`,
          size: 22,
          color: '64748B',
          font: '微软雅黑',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: '一、项目概况', bold: true, size: 28, font: '微软雅黑' })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({ text: `本投标文件基于源文件《${uploadedFilename.value}》自动生成，已形成可交付初稿。`, size: 24, font: '微软雅黑' })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: '二、商务响应要点', bold: true, size: 28, font: '微软雅黑' })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({ text: '已补齐投标函、授权书、资质文件、报价说明等商务模块内容，并预留盖章与签字位置。', size: 24, font: '微软雅黑' })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: '三、技术方案摘要', bold: true, size: 28, font: '微软雅黑' })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({ text: '已生成项目理解、总体架构、实施计划、质量保障、售后服务等核心章节，可直接在 Word 中继续调整。', size: 24, font: '微软雅黑' })],
    }),
  ];

  if (additionalInfo.value) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: '四、补充需求记录', bold: true, size: 28, font: '微软雅黑' })],
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: additionalInfo.value, size: 24, font: '微软雅黑' })],
      }),
    );
  }

  children.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: '五、后续处理建议', bold: true, size: 28, font: '微软雅黑' })],
    }),
    new Paragraph({
      children: [new TextRun({ text: '建议加载 Word 插件后在本地继续完成格式修订、内容补强和最终导出。', size: 24, font: '微软雅黑' })],
    }),
  );

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, generatedDocumentName.value);
};

const downloadWordPlugin = () => {
  const manifest = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="TaskPaneApp">
  <Id>31d67a7d-8f07-4b06-9d1c-7c4e5d8e0011</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>涌见AI</ProviderName>
  <DefaultLocale>zh-CN</DefaultLocale>
  <DisplayName DefaultValue="涌见AI Word 插件"/>
  <Description DefaultValue="在 Word 中继续编辑 AI 生成标书的演示插件。"/>
  <Hosts>
    <Host Name="Document"/>
  </Hosts>
  <DefaultSettings>
    <SourceLocation DefaultValue="https://demo.yongjian.ai/word-plugin/taskpane"/>
  </DefaultSettings>
  <Permissions>ReadWriteDocument</Permissions>
</OfficeApp>`;

  const blob = new Blob([manifest], { type: 'application/xml;charset=utf-8' });
  downloadBlob(blob, pluginManifestName);
};

const toggleGuide = () => {
  isGuideExpanded.value = !isGuideExpanded.value;
};

const openPluginMock = () => {
  router.push({ name: 'word-plugin-materials-mock' });
};
</script>

<template>
  <div class="plugin-result-page">
    <div class="plugin-page-header">
      <div class="plugin-page-header-icon">
        <FileText :size="20" />
      </div>
      <div class="plugin-page-header-copy">
        <h1>AI标书生成</h1>
        <p>已完成生成，请安装 Word 插件并登录账号获取历史标书后继续处理</p>
      </div>
    </div>

    <div class="plugin-result-container">
      <header class="plugin-result-header">
        <h1 class="plugin-result-title">{{ generatedBidTitle }}</h1>
      </header>

      <section class="plugin-result-section">
        <div class="plugin-download-cards">
          <article class="plugin-download-card">
            <div class="plugin-download-card-row">
              <div class="plugin-download-leading">
                <FileText :size="20" />
                <div class="plugin-download-copy">
                  <h3>已完成标书</h3>
                  <p>{{ generatedDocumentName }}</p>
                  <div class="plugin-download-meta">
                    <span>Word 文档</span>
                    <span>{{ generatedAt }}</span>
                  </div>
                </div>
              </div>
              <button class="plugin-download-btn primary" @click="downloadBidDocument">
                <Download :size="16" />
                下载标书
              </button>
            </div>
          </article>

          <article class="plugin-download-card plugin-download-card--plugin">
            <div class="plugin-download-card-row">
              <div class="plugin-download-leading">
                <Sparkles :size="20" />
                <div class="plugin-download-copy">
                  <h3>Word 插件</h3>
                  <p>{{ pluginManifestName }}</p>
                  <div class="plugin-download-meta">
                    <span>Manifest 清单</span>
                    <span>用于 Word 加载项安装</span>
                  </div>
                </div>
              </div>

              <div class="plugin-download-actions">
                <button class="plugin-inline-mock-btn" @click="openPluginMock">打开插件 mock</button>
                <button class="plugin-guide-inline-btn" @click="toggleGuide">
                  <span>{{ isGuideExpanded ? '收起说明' : '展开说明' }}</span>
                  <ChevronDown :size="18" :class="{ expanded: isGuideExpanded }" />
                </button>
                <button class="plugin-download-btn" @click="downloadWordPlugin">
                  <Download :size="16" />
                  下载 Word 插件
                </button>
              </div>
            </div>

            <div v-if="isGuideExpanded" class="plugin-guide-panel">
              <div class="plugin-guide-panel-head">
                <h3>下载、安装与使用说明</h3>
                <p>按以下顺序完成插件安装、登录及素材插入处理。</p>
              </div>

              <ol class="plugin-guide-list">
                <li v-for="step in guideSteps" :key="step.title" class="plugin-guide-item">
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.description }}</p>
                </li>
              </ol>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.plugin-result-page {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 220px);
}

.plugin-page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 20px 32px;
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
}

.plugin-page-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #2563eb;
}

.plugin-page-header-copy h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
}

.plugin-page-header-copy p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

.plugin-result-container {
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 36px 40px 56px;
}

.plugin-result-header {
  padding: 0;
}

.plugin-result-title {
  margin: 22px 0 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.28;
  color: #0f172a;
}

.plugin-result-section {
  padding: 24px 0 0;
}

.plugin-download-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 4px;
}

.plugin-download-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  padding: 22px 26px;
}

.plugin-download-card-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px 24px;
}

.plugin-download-card-row > .plugin-download-leading {
  flex: 1 1 240px;
  min-width: 0;
}

.plugin-download-card-row > .plugin-download-btn.primary,
.plugin-download-card-row > .plugin-download-actions {
  flex-shrink: 0;
}

.plugin-download-leading {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
  width: 100%;
}

.plugin-download-leading svg {
  color: #2563eb;
  flex-shrink: 0;
  margin-top: 4px;
}

.plugin-download-copy {
  min-width: 0;
}

.plugin-download-copy h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

.plugin-download-copy p {
  margin: 0 0 10px;
  font-size: 15px;
  color: #475569;
  word-break: break-word;
}

.plugin-download-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  font-size: 12px;
  color: #94a3b8;
}

.plugin-download-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.plugin-download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 164px;
  padding: 12px 20px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: white;
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.plugin-download-btn:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.plugin-download-btn.primary {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.plugin-download-btn.primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.plugin-guide-inline-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 0;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.plugin-inline-mock-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  background: #f8fbff;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.plugin-inline-mock-btn:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.plugin-guide-inline-btn svg {
  transition: transform 0.2s ease;
}

.plugin-guide-inline-btn svg.expanded {
  transform: rotate(180deg);
}

.plugin-download-card--plugin .plugin-guide-panel {
  margin-top: 20px;
  padding-top: 20px;
  padding-left: 0;
  border-top: 1px solid #e2e8f0;
}

.plugin-guide-panel-head {
  margin-bottom: 12px;
}

.plugin-guide-panel-head h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.plugin-guide-panel-head p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
}

.plugin-guide-list {
  margin: 0;
  padding-left: 22px;
}

.plugin-guide-item {
  padding: 0 0 18px;
}

.plugin-guide-item h3 {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.plugin-guide-item p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #475569;
}

@media (max-width: 768px) {
  .plugin-page-header {
    padding: 16px 20px;
  }

  .plugin-result-container {
    padding: 24px 20px 40px;
  }

  .plugin-result-title {
    font-size: 30px;
  }

  .plugin-download-card {
    padding: 18px 18px;
  }

  .plugin-download-card-row {
    flex-direction: column;
    align-items: stretch;
  }

  .plugin-download-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .plugin-download-btn {
    width: 100%;
  }

  .plugin-guide-inline-btn {
    justify-content: center;
    padding: 12px 16px;
    border: 1px solid #dbeafe;
    border-radius: 12px;
    background: #f8fbff;
  }

  .plugin-inline-mock-btn {
    width: 100%;
  }
}
</style>
