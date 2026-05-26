<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft, ExternalLink } from 'lucide-vue-next';

interface BidArticleSeed {
  id: number;
  title: string;
  publisher: string;
  publishDate: string;
  deadline: string;
  budget: string;
  region: string;
  projectNo: string;
  sourceUrl: string;
  serviceFocus: string;
}

interface ArticleMeta {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ArticleTable {
  columns: string[];
  rows: string[][];
}

interface ArticleSection {
  title?: string;
  paragraphs?: string[];
  table?: ArticleTable;
}

interface BidArticle {
  title: string;
  meta: ArticleMeta[];
  sections: ArticleSection[];
  appendixTitle: string;
  appendixParagraphs: string[];
  sourceUrl: string;
}

const router = useRouter();
const route = useRoute();

const bidArticleSeeds: BidArticleSeed[] = [
  {
    id: 301,
    title: '某国有银行上海分行网络安全渗透测试服务项目询价公告',
    publisher: '某国有银行上海分行',
    publishDate: '2026-02-04',
    deadline: '2026-02-08',
    budget: '68万',
    region: '上海市',
    projectNo: 'SHBANK-CG-20260204-01',
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '网络安全渗透测试、漏洞验证与整改复测'
  },
  {
    id: 302,
    title: '浦东新区政务云安全运维服务采购',
    publisher: '上海市浦东新区政务云管理中心',
    publishDate: '2026-02-04',
    deadline: '2026-02-12',
    budget: '156万',
    region: '上海市浦东新区',
    projectNo: 'PDZWY-CG-20260204-02',
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '政务云安全运维、监测响应与月度巡检'
  },
  {
    id: 303,
    title: '徐汇区教育局校园网络安全防护系统建设',
    publisher: '上海市徐汇区教育局',
    publishDate: '2026-02-04',
    deadline: '2026-02-09',
    budget: '45万',
    region: '上海市徐汇区',
    projectNo: 'XHJY-CG-20260204-03',
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '校园网络边界防护、终端安全与安全加固'
  },
  {
    id: 304,
    title: '青浦区公安局网络安全监测平台采购',
    publisher: '上海市青浦区公安局',
    publishDate: '2026-02-03',
    deadline: '2026-02-14',
    budget: '120万',
    region: '上海市青浦区',
    projectNo: 'QPGAB-CG-20260203-01',
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '安全监测平台建设、风险告警与事件处置'
  },
  {
    id: 305,
    title: '松江区政府数据中心安全加固项目',
    publisher: '上海市松江区政务服务中心',
    publishDate: '2026-02-03',
    deadline: '2026-02-15',
    budget: '72万',
    region: '上海市松江区',
    projectNo: 'SJZW-CG-20260203-02',
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '数据中心资产梳理、基线核查与安全加固'
  },
  {
    id: 306,
    title: '闵行区街道办网络安全咨询服务',
    publisher: '上海市闵行区街道办事处',
    publishDate: '2026-02-03',
    deadline: '2026-02-11',
    budget: '28万',
    region: '上海市闵行区',
    projectNo: 'MHJD-CG-20260203-03',
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '网络安全咨询、制度评审与整改建议'
  },
  {
    id: 307,
    title: '静安区商务楼宇网络安全检测服务',
    publisher: '上海市静安区商务委员会',
    publishDate: '2026-02-02',
    deadline: '2026-02-16',
    budget: '25万',
    region: '上海市静安区',
    projectNo: 'JASW-CG-20260202-01',
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '楼宇网络安全检测、风险排查与报告交付'
  },
  {
    id: 308,
    title: '奉贤区工业园区企业安全服务采购',
    publisher: '上海市奉贤区工业园区管理委员会',
    publishDate: '2026-02-02',
    deadline: '2026-02-18',
    budget: '55万',
    region: '上海市奉贤区',
    projectNo: 'FXGY-CG-20260202-02',
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '园区企业安全评估、培训辅导与复测服务'
  }
];

const restrictedRows = [
  ['1', '广州雄志科技有限公司'],
  ['2', '广州格源科技开发有限公司'],
  ['3', '翰威特咨询（上海）有限公司广州分公司'],
  ['4', '广东华鑫招标采购有限公司'],
  ['5', '肇庆市定江康宇有色金属再生资源有限公司'],
  ['6', '广州华群废旧物资回收有限公司'],
  ['7', '广州市财峰废旧物资回收有限公司'],
  ['8', '广东鹏驰会建设工程有限公司'],
  ['9', '广州市金洋广告有限公司'],
  ['10', '广州市沣华喷画广告有限公司'],
  ['11', '广州市海珠区大自然摄影冲印部'],
  ['12', '谢天慈（一级建造师注册编号：皖1342018201903343）'],
  ['14', '广东电白建设集团有限公司'],
  ['15', '广州市腾跃土石方工程有限公司及其下属所有公司'],
  ['16', '周正永（一级建造师注册编号：京1112017201743883）'],
  ['17', '李建国（监理工程师注册号：61003463）'],
  ['18', '星展银行（中国）有限公司（限制合作的业务范围为：流动资金贷款业务）']
];

const getRouteBidId = () => {
  const rawBidId = route.query.bidId;
  const normalized = Array.isArray(rawBidId) ? rawBidId[0] : rawBidId;
  return Number.parseInt(normalized ?? '', 10);
};

const getRouteQueryText = (key: string, fallback: string) => {
  const rawValue = route.query[key];
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  return value ? String(value) : fallback;
};

const selectedSeed = computed(() => {
  const bidId = getRouteBidId();
  const existingSeed = bidArticleSeeds.find((item) => item.id === bidId);

  if (existingSeed) {
    return existingSeed;
  }

  return {
    id: Number.isFinite(bidId) ? bidId : 301,
    title: getRouteQueryText('title', '订阅历史标讯详情'),
    publisher: getRouteQueryText('publisher', '采购单位'),
    publishDate: getRouteQueryText('date', '2026-02-04'),
    deadline: getRouteQueryText('deadline', '2026-02-15'),
    budget: getRouteQueryText('budget', '待披露'),
    region: getRouteQueryText('region', '上海市'),
    projectNo: `SUB-HISTORY-${Number.isFinite(bidId) ? bidId : 301}`,
    sourceUrl: 'https://ygcg.gzggzy.cn/m92/fw/20260526/401788.html',
    serviceFocus: '网络安全服务、风险评估、整改复核与报告交付'
  };
});

const currentArticle = computed<BidArticle>(() => {
  const seed = selectedSeed.value;

  return {
    title: seed.title,
    sourceUrl: seed.sourceUrl,
    meta: [
      { label: '发布单位', value: seed.publisher },
      { label: '发布时间', value: seed.publishDate },
      { label: '截止时间', value: seed.deadline },
      { label: '预算金额', value: seed.budget, highlight: true },
      { label: '项目编号', value: seed.projectNo },
      { label: '地区', value: seed.region }
    ],
    sections: [
      {
        paragraphs: [
          `${seed.publisher}现就“${seed.title}”进行公开采购，欢迎符合资格条件的供应商参与响应。`,
          `本项目采购内容围绕${seed.serviceFocus}展开，供应商须按照采购文件要求完成方案编制、服务实施、报告交付及后续整改配合工作。`
        ]
      },
      {
        title: '一、项目基本情况',
        paragraphs: [
          `项目编号：${seed.projectNo}`,
          `项目名称：${seed.title}`,
          `采购预算：${seed.budget}`,
          `采购方式：询价采购`,
          `服务地点：${seed.region}`,
          `服务期限：合同签订后至项目验收完成。`
        ]
      },
      {
        title: '二、供应商资格要求',
        paragraphs: [
          '1. 供应商须在中华人民共和国境内依法注册，具有独立承担民事责任的能力。',
          '2. 供应商须具备履行本项目所需的专业技术能力、人员配置和服务经验。',
          '3. 供应商近三年经营活动中无重大违法记录，未被列入严重失信主体名单。',
          '4. 本项目不接受联合体响应，成交后不得转包或违法分包。'
        ]
      },
      {
        title: '三、采购需求',
        paragraphs: [
          `1. 对采购人指定系统、网络、平台或服务对象开展${seed.serviceFocus}。`,
          '2. 按照国家及行业网络安全相关标准形成检测记录、问题清单、整改建议和正式报告。',
          '3. 配合采购人完成整改复核、会议汇报及验收材料整理。',
          '4. 项目实施过程中涉及的业务数据、系统信息和安全问题均应严格保密。'
        ]
      },
      {
        title: '四、报价文件递交',
        paragraphs: [
          `响应文件递交截止时间：${seed.deadline} 17:00（北京时间）。`,
          '递交方式：供应商应按采购文件要求提交加盖公章的响应文件，逾期送达或未按要求密封的响应文件将不予受理。',
          '报价有效期：自响应文件递交截止之日起不少于90日。'
        ]
      },
      {
        title: '五、评审办法',
        paragraphs: [
          '本项目采用综合评审方式，重点考察报价合理性、实施方案完整性、项目团队能力、同类案例经验及服务响应承诺。',
          '采购人将根据评审结果确定成交供应商，并按规定发布成交结果。'
        ]
      },
      {
        title: '六、联系方式',
        paragraphs: [
          `采购人：${seed.publisher}`,
          `地址：${seed.region}`,
          '联系人：采购管理办公室',
          '联系电话：021-00000000'
        ]
      },
      {
        title: '附件一：采购内容清单',
        table: {
          columns: ['序号', '服务项', '主要内容', '交付物'],
          rows: [
            ['1', '资产与范围确认', '梳理项目范围内系统、网络及安全设备', '资产范围确认表'],
            ['2', '安全检测与评估', seed.serviceFocus, '检测记录、问题清单'],
            ['3', '整改复核', '跟踪整改完成情况并复测关键问题', '整改复核报告'],
            ['4', '验收汇报', '提交最终报告并配合采购人完成验收', '正式报告、汇报材料']
          ]
        }
      },
      {
        title: '附件二：限制合作单位名单',
        table: {
          columns: ['序号', '单位名称及个人姓名'],
          rows: restrictedRows
        }
      }
    ],
    appendixTitle: '附件三： 非联合体承诺函',
    appendixParagraphs: [
      `致：${seed.publisher}`,
      `我司根据${seed.title}项目要求，做出如下承诺：`,
      '我司承诺以非联合体形式响应。',
      '响应人名称（全称，加盖法人公章）：',
      '法定代表人或授权代表签字：',
      '日期：    年    月    日'
    ]
  };
});

const source = computed(() => {
  const rawSource = route.query.source;
  return Array.isArray(rawSource) ? rawSource[0] ?? 'subscription' : rawSource ?? 'subscription';
});

const goBack = () => {
  if (source.value === 'daily') {
    router.push({ name: 'bid-info-daily' });
    return;
  }

  router.push({ name: 'bid-subscription' });
};
</script>

<template>
  <div class="bid-list-detail-page">
    <div class="detail-shell">
      <div class="detail-toolbar">
        <button type="button" class="back-btn" @click="goBack">
          <ChevronLeft :size="16" />
          <span>返回</span>
        </button>
      </div>

      <article class="article-card">
        <header class="article-header">
          <div class="article-kicker">标讯详情</div>
          <h1>{{ currentArticle.title }}</h1>
          <dl class="article-meta-grid">
            <div
              v-for="item in currentArticle.meta"
              :key="item.label"
              class="article-meta-item"
            >
              <dt>{{ item.label }}</dt>
              <dd :class="{ highlight: item.highlight }">{{ item.value }}</dd>
            </div>
          </dl>
        </header>

        <div class="article-body">
          <section
            v-for="(section, sectionIndex) in currentArticle.sections"
            :key="section.title ?? sectionIndex"
            class="article-section"
          >
            <h2 v-if="section.title">{{ section.title }}</h2>
            <p v-for="paragraph in section.paragraphs" :key="paragraph">
              {{ paragraph }}
            </p>

            <div v-if="section.table" class="article-table-wrap">
              <table class="article-table">
                <thead>
                  <tr>
                    <th v-for="column in section.table.columns" :key="column">
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in section.table.rows" :key="rowIndex">
                    <td v-for="(cell, cellIndex) in row" :key="`${rowIndex}-${cellIndex}`">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="article-section appendix-section">
            <h2>{{ currentArticle.appendixTitle }}</h2>
            <p v-for="paragraph in currentArticle.appendixParagraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </section>
        </div>
      </article>

      <section class="source-card">
        <h2>原文网页</h2>
        <a :href="currentArticle.sourceUrl" target="_blank" rel="noreferrer">
          <span>在新窗口打开</span>
          <ExternalLink :size="14" />
        </a>
      </section>
    </div>
  </div>
</template>

<style scoped>
.bid-list-detail-page {
  min-height: 100%;
  overflow-y: auto;
  padding: 22px 32px 44px;
  background: #eef3ff;
  color: #24324a;
}

.detail-shell {
  width: min(100%, 920px);
  margin: 0 auto;
}

.detail-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid #d8e1f0;
  border-radius: 8px;
  background: #ffffff;
  color: #52627a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.back-btn:hover {
  border-color: #a8c4ff;
  background: #f8fbff;
  color: #2563eb;
}

.article-card,
.source-card {
  background: #ffffff;
  border: 1px solid #dce5f3;
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(96, 117, 154, 0.08);
}

.article-card {
  overflow: hidden;
}

.article-header {
  padding: 26px 30px 22px;
  border-bottom: 1px solid #edf1f7;
}

.article-kicker {
  margin-bottom: 10px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
}

.article-header h1 {
  margin: 0;
  color: #162238;
  font-size: 22px;
  line-height: 1.55;
  font-weight: 800;
}

.article-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 18px;
  margin: 22px 0 0;
}

.article-meta-item {
  min-width: 0;
}

.article-meta-item dt {
  margin-bottom: 5px;
  color: #8a97aa;
  font-size: 12px;
}

.article-meta-item dd {
  margin: 0;
  color: #25364f;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 600;
}

.article-meta-item dd.highlight {
  color: #059669;
}

.article-body {
  padding: 28px 30px 32px;
}

.article-section + .article-section {
  margin-top: 28px;
}

.article-section h2 {
  margin: 0 0 12px;
  color: #1d2b45;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 800;
}

.article-section p {
  margin: 0;
  color: #42516a;
  font-size: 14px;
  line-height: 2.05;
}

.article-section p + p {
  margin-top: 6px;
}

.article-table-wrap {
  margin-top: 14px;
  overflow-x: auto;
  border: 1px solid #e5ebf4;
  border-radius: 4px;
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #ffffff;
}

.article-table th,
.article-table td {
  border: 1px solid #e5ebf4;
  padding: 12px 14px;
  color: #43516a;
  font-size: 13px;
  line-height: 1.75;
  text-align: left;
  vertical-align: top;
  word-break: break-word;
}

.article-table th {
  background: #f6f8fb;
  color: #64748b;
  font-weight: 700;
}

.article-table th:first-child,
.article-table td:first-child {
  width: 72px;
  text-align: center;
}

.appendix-section {
  padding-top: 4px;
}

.source-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 16px;
  padding: 20px 24px;
}

.source-card h2 {
  margin: 0;
  color: #1d2b45;
  font-size: 16px;
  font-weight: 800;
}

.source-card a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.source-card a:hover {
  color: #1d4ed8;
}

@media (max-width: 900px) {
  .bid-list-detail-page {
    padding: 18px 16px 32px;
  }

  .article-header,
  .article-body {
    padding-left: 20px;
    padding-right: 20px;
  }

  .article-meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .article-meta-grid {
    grid-template-columns: 1fr;
  }

  .source-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
