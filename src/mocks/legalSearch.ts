// Mock filter configurations for legal search

// Cases filters
export const casesFilters = {
  referenceLevel: [
    { label: '指导性案例', count: 7, value: 'zhidaoxing' },
    { label: '参考案例', count: 4, value: 'cankao' },
    { label: '典型案例', count: 7, value: 'dianxing' },
    { label: '普通案例', count: 42205, value: 'putong' },
  ],
  caseReason: [
    { label: '刑事案由', count: 39363, value: 'xingshi' },
    { label: '民事案由', count: 649, value: 'minshi' },
    { label: '行政案由', count: 2, value: 'xingzheng' },
  ],
  courtLevel: [
    { label: '初级人民法院', count: 129, value: 'chuji' },
    { label: '中级人民法院', count: 5277, value: 'zhongji' },
    { label: '高级人民法院', count: 24713, value: 'gaoji' },
    { label: '专门人民法院', count: 140, value: 'zhuanmen' },
  ],
  region: [
    { label: '北京市', count: 1146, value: 'beijing', children: [
      { label: '北京市高级人民法院', count: 234, value: 'beijing_gaoyuan' },
      { label: '北京市第一中级人民法院', count: 156, value: 'beijing_yizhong' },
      { label: '北京市第二中级人民法院', count: 178, value: 'beijing_erzhong' },
      { label: '北京市朝阳区人民法院', count: 89, value: 'beijing_chaoyang' },
      { label: '北京市海淀区人民法院', count: 76, value: 'beijing_haidian' },
    ]},
    { label: '上海市', count: 2345, value: 'shanghai', children: [
      { label: '上海市高级人民法院', count: 312, value: 'shanghai_gaoyuan' },
      { label: '上海市第一中级人民法院', count: 245, value: 'shanghai_yizhong' },
      { label: '上海市第二中级人民法院', count: 198, value: 'shanghai_erzhong' },
      { label: '上海市浦东新区人民法院', count: 156, value: 'shanghai_pudong' },
    ]},
    { label: '天津市', count: 1621, value: 'tianjin', children: [
      { label: '天津市高级人民法院', count: 189, value: 'tianjin_gaoyuan' },
      { label: '天津市第一中级人民法院', count: 134, value: 'tianjin_yizhong' },
    ]},
    { label: '河北省', count: 11046, value: 'hebei', children: [
      { label: '河北省高级人民法院', count: 567, value: 'hebei_gaoyuan' },
      { label: '石家庄市中级人民法院', count: 423, value: 'hebei_shijiazhuang' },
      { label: '唐山市中级人民法院', count: 356, value: 'hebei_tangshan' },
    ]},
    { label: '广东省', count: 8934, value: 'guangdong', children: [
      { label: '广东省高级人民法院', count: 456, value: 'guangdong_gaoyuan' },
      { label: '广州市中级人民法院', count: 512, value: 'guangdong_guangzhou' },
      { label: '深圳市中级人民法院', count: 478, value: 'guangdong_shenzhen' },
      { label: '广州市天河区人民法院', count: 234, value: 'guangdong_tianhe' },
    ]},
    { label: '江苏省', count: 7823, value: 'jiangsu', children: [
      { label: '江苏省高级人民法院', count: 389, value: 'jiangsu_gaoyuan' },
      { label: '南京市中级人民法院', count: 345, value: 'jiangsu_nanjing' },
      { label: '苏州市中级人民法院', count: 312, value: 'jiangsu_suzhou' },
    ]},
    { label: '浙江省', count: 6542, value: 'zhejiang', children: [
      { label: '浙江省高级人民法院', count: 278, value: 'zhejiang_gaoyuan' },
      { label: '杭州市中级人民法院', count: 298, value: 'zhejiang_hangzhou' },
      { label: '宁波市中级人民法院', count: 256, value: 'zhejiang_ningbo' },
    ]},
    { label: '山东省', count: 5678, value: 'shandong', children: [
      { label: '山东省高级人民法院', count: 234, value: 'shandong_gaoyuan' },
      { label: '济南市中级人民法院', count: 213, value: 'shandong_jinan' },
      { label: '青岛市中级人民法院', count: 198, value: 'shandong_qingdao' },
    ]},
    { label: '四川省', count: 4532, value: 'sichuan', children: [
      { label: '四川省高级人民法院', count: 189, value: 'sichuan_gaoyuan' },
      { label: '成都市中级人民法院', count: 234, value: 'sichuan_chengdu' },
    ]},
    { label: '湖北省', count: 3987, value: 'hubei', children: [
      { label: '湖北省高级人民法院', count: 167, value: 'hubei_gaoyuan' },
      { label: '武汉市中级人民法院', count: 198, value: 'hubei_wuhan' },
    ]},
  ],
  settlementYear: [
    { label: '2025年', count: 1133, value: '2025' },
    { label: '2024年', count: 1420, value: '2024' },
    { label: '2023年', count: 1399, value: '2023' },
    { label: '2022年', count: 748, value: '2022' },
    { label: '2021年', count: 3123, value: '2021' },
  ],
  trialProcedure: [
    { label: '一审', count: 38741, value: 'yishen' },
    { label: '二审', count: 5186, value: 'ershen' },
    { label: '再审', count: 201, value: 'zaishen' },
    { label: '其他', count: 123, value: 'qita' },
  ],
  documentType: [
    { label: '判决书', count: 38537, value: 'panjue' },
    { label: '裁定书', count: 3629, value: 'caiding' },
    { label: '决定书', count: 5, value: 'jueding' },
    { label: '通知书', count: 77, value: 'tongzhi' },
    { label: '其他', count: 7, value: 'qita' },
  ],
};

// Regulations filters
export const regulationsFilters = {
  hierarchy: [
    { label: '法律', count: 3934, value: 'falv' },
    { label: '司法解释', count: 7854, value: 'sifajieshi' },
    { label: '行政法规', count: 11115, value: 'xingzhengfagui' },
    { label: '部门规章', count: 274864, value: 'bumanguizhang' },
    { label: '军事法规', count: 461, value: 'junshifagui' },
    { label: '党内法规', count: 2610, value: 'dangneifagui' },
    { label: '地方性法规', count: 1549787, value: 'difangxingfagui' },
    { label: '其他', count: 63630, value: 'qita' },
  ],
  effectiveness: [
    { label: '现行有效', count: 1752464, value: 'xianxingyouxiao' },
    { label: '失效', count: 151949, value: 'shixiao' },
    { label: '已被修改', count: 20283, value: 'yibeixiugai' },
    { label: '部分失效', count: 2619, value: 'bufenshixiao' },
    { label: '尚未生效', count: 442, value: 'shangweishengxiao' },
  ],
  region: [
    { label: '北京市', count: 403992, value: 'beijing' },
    { label: '天津市', count: 26305, value: 'tianjin' },
    { label: '河北省', count: 7166, value: 'hebei' },
    { label: '山西省', count: 16634, value: 'shanxi' },
    { label: '内蒙古自治区', count: 8409, value: 'neimenggu' },
    { label: '辽宁省', count: 8028, value: 'liaoning' },
    { label: '吉林省', count: 4794, value: 'jilin' },
    { label: '黑龙江省', count: 7218, value: 'heilongjiang' },
    { label: '上海市', count: 71030, value: 'shanghai' },
  ],
  industry: [
    { label: '农林牧渔', count: 202263, value: 'nonglinmuyu' },
    { label: '基础化工', count: 45433, value: 'jichuhuagong' },
    { label: '钢铁', count: 21030, value: 'gangtie' },
    { label: '有色金属', count: 16310, value: 'yousejinshu' },
    { label: '食品饮料', count: 187935, value: 'shipinyinliao' },
    { label: '纺织服饰', count: 43949, value: 'fangzhifushi' },
    { label: '轻工制造', count: 45763, value: 'qinggongzhizao' },
    { label: '医药生物', count: 80309, value: 'yiyaoshengwu' },
    { label: '公用事业', count: 91149, value: 'gongyongshiye' },
  ],
  sector: [
    { label: '人工智能', count: 18129, value: 'rengongzhineng' },
    { label: '区块链', count: 6542, value: 'qukuanlian' },
    { label: '物联网', count: 26783, value: 'wulianwang' },
    { label: '云计算', count: 21454, value: 'yunjisuan' },
    { label: '元宇宙', count: 503, value: 'yuanyuzhou' },
    { label: '5G', count: 14299, value: '5g' },
    { label: '大数据', count: 53571, value: 'dashuju' },
    { label: '集成电路', count: 11781, value: 'jichengdianlu' },
    { label: '芯片', count: 6176, value: 'xinpian' },
  ],
};

// Case results mock data
export const caseResults = [
  {
    id: 1,
    type: 'case',
    caseType: '刑事一审',
    documentType: '刑事判决书',
    title: '张某某生产、销售有毒、有害食品罪一审刑事判决书',
    court: '北京市朝阳区人民法院',
    caseNumber: '(2024)京0105刑初1234号',
    date: '2024-11-15',
    settleDate: '2024-11-15审结',
    tags: ['本院认为', '裁判结果', '量刑情节'],
    content: '本院认为，被告人张某某在生产、销售的食品中掺入有毒、有害的非食品原料，其行为已构成生产、销售有毒、有害食品罪。被告人在食品生产过程中违法添加工业明胶，严重危害人民群众身体健康，应依法惩处。',
    judgmentResult: '一、被告人张某某犯生产、销售有毒、有害食品罪，判处有期徒刑三年，并处罚金人民币三十万元。\n二、扣押在案的违法所得人民币十五万元予以没收，上缴国库。\n三、扣押在案的作案工具予以没收。',
    historicalDocs: [],
  },
  {
    id: 2,
    type: 'case',
    caseType: '刑事二审',
    documentType: '刑事裁定书',
    title: '李某某生产、销售不符合安全标准的食品罪二审刑事裁定书',
    court: '上海市第一中级人民法院',
    caseNumber: '(2024)沪01刑终567号',
    date: '2024-10-22',
    settleDate: '2024-10-22审结',
    tags: ['本院认为', '裁判结果', '历审文书'],
    content: '本院认为，原审判决认定上诉人李某某生产、销售不符合食品安全标准的食品，足以造成严重食物中毒事故或者其他严重食源性疾病的事实清楚，证据确实、充分，定罪准确，量刑适当。',
    judgmentResult: '驳回上诉，维持原判。\n本裁定为终审裁定。',
    historicalDocs: [
      { title: '李某某生产、销售不符合安全标准的食品罪一审刑事判决书', caseNumber: '(2024)沪0115刑初456号', court: '上海市浦东新区人民法院', date: '2024-08-15' },
    ],
  },
  {
    id: 3,
    type: 'case',
    caseType: '民事一审',
    documentType: '民事判决书',
    title: '王某某与某某食品公司产品责任纠纷一审民事判决书',
    court: '广州市天河区人民法院',
    caseNumber: '(2024)粤0106民初8901号',
    date: '2024-09-18',
    settleDate: '2024-09-18审结',
    tags: ['本院认为', '裁判结果', '赔偿责任'],
    content: '本院认为，被告某某食品公司生产的预包装食品不符合食品安全国家标准，原告因食用该产品造成身体损害，被告应承担产品责任。根据《食品安全法》第一百四十八条规定，判决被告赔偿原告医疗费、精神损害抚慰金等合计人民币35000元。',
    judgmentResult: '一、被告某某食品有限公司于本判决生效之日起十日内赔偿原告王某某医疗费、交通费、营养费共计人民币12000元。\n二、被告某某食品有限公司于本判决生效之日起十日内赔偿原告王某某精神损害抚慰金人民币23000元。\n三、驳回原告王某某的其他诉讼请求。',
    historicalDocs: [
      { title: '王某某与某某食品公司产品责任纠纷二审民事判决书', caseNumber: '(2024)粤0106民织892号', court: '广州市中级人民法院', date: '2024-12-05' },
    ],
  },
  {
    id: 4,
    type: 'case',
    caseType: '刑事一审',
    documentType: '刑事判决书',
    title: '陈某某等人生产、销售伪劣产品罪一审刑事判决书',
    court: '杭州市余杭区人民法院',
    caseNumber: '(2024)浙0110刑初2345号',
    date: '2024-08-30',
    settleDate: '2024-08-30审结',
    tags: ['本院认为', '裁判结果', '共同犯罪'],
    content: '本院认为，被告人陈某某等人以假充真、以次充好，生产销售伪劣食品，销售金额达人民币180万元，其行为已构成生产、销售伪劣产品罪。鉴于被告人到案后如实供述犯罪事实，依法可以从轻处罚。',
    judgmentResult: '一、被告人陈某某犯生产、销售伪劣产品罪，判处有期徒刑七年，并处罚金人民币一百万元。\n二、被告人张某某犯生产、销售伪劣产品罪，判处有期徒刑五年，并处罚金人民币六十万元。\n三、扣押在案的违法所得人民币一百八十万元予以没收。',
    historicalDocs: [
      { title: '陈某某等人生产、销售伪劣产品罪二审刑事裁定书', caseNumber: '(2024)浙01刑织678号', court: '浙江省高级人民法院', date: '2024-11-20' },
    ],
  },
  {
    id: 5,
    type: 'case',
    caseType: '行政一审',
    documentType: '行政判决书',
    title: '某某餐饮公司诉市场监督管理局行政处罚案一审行政判决书',
    court: '深圳市福田区人民法院',
    caseNumber: '(2024)粤0304行初678号',
    date: '2024-07-25',
    settleDate: '2024-07-25审结',
    tags: ['本院认为', '裁判结果', '行政诉讼'],
    content: '本院认为，被告市场监督管理局对原告某某餐饮公司作出的行政处罚决定，认定事实清楚，适用法律正确，程序合法，处罚幅度适当。原告主张其不存在使用过期食品原料的行为，缺乏证据支持，本院不予采信。',
    judgmentResult: '驳回原告某某餐饮管理有限公司的诉讼请求。\n案件受理费人民币50元，由原告某某餐饮管理有限公司负担。',
    historicalDocs: [
      { title: '某某餐饮公司诉市场监督管理局行政处罚案二审行政判决书', caseNumber: '(2024)粤03行绉123号', court: '深圳市中级人民法院', date: '2024-10-18' },
    ],
  },
  {
    id: 6,
    type: 'case',
    caseType: '民事二审',
    documentType: '民事判决书',
    title: '刘某某与某某超市买卖合同纠纷二审民事判决书',
    court: '成都市中级人民法院',
    caseNumber: '(2024)川01民终4567号',
    date: '2024-06-20',
    settleDate: '2024-06-20审结',
    tags: ['本院认为', '裁判结果', '十倍赔偿'],
    content: '本院认为，上诉人某某超市销售的进口食品未标注中文标签，不符合食品安全法的规定。根据《食品安全法》第一百四十八条第二款规定，消费者除要求赔偿损失外，还可以向生产者或者经营者要求支付价款十倍的赔偿金。',
    judgmentResult: '一、撤销成都市武侯区人民法院(2024)川0107民初1234号民事判决。\n二、上诉人某某超市于本判决生效之日起十日内向被上诉人刘某某支付价款十倍赔偿金人民币5800元。',
    historicalDocs: [
      { title: '刘某某与某某超市买卖合同纠纷一审民事判决书', caseNumber: '(2024)川0107民初1234号', court: '成都市武侯区人民法院', date: '2024-04-10' },
    ],
  },
  {
    id: 7,
    type: 'case',
    caseType: '刑事一审',
    documentType: '刑事判决书',
    title: '赵某某销售假冒注册商标的商品罪一审刑事判决书',
    court: '武汉市江汉区人民法院',
    caseNumber: '(2024)鄂0103刑初789号',
    date: '2024-05-15',
    settleDate: '2024-05-15审结',
    tags: ['本院认为', '裁判结果', '商标侵权'],
    content: '本院认为，被告人赵某某明知是假冒注册商标的食品仍予以销售，销售金额达人民币50万元，情节严重，其行为已构成销售假冒注册商标的商品罪。被告人销售的假冒品牌婴幼儿配方奶粉，严重威胁婴幼儿身体健康。',
    judgmentResult: '一、被告人赵某某犯销售假冒注册商标的商品罪，判处有期徒刑三年六个月，并处罚金人民币三十万元。\n二、扣押在案的假冒注册商标商品予以没收并销毁。',
    historicalDocs: [
      { title: '赵某某销售假冒注册商标的商品罪二审刑事裁定书', caseNumber: '(2024)鄂刑绉456号', court: '湖北省高级人民法院', date: '2024-08-25' },
      { title: '赵某某销售假冒注册商标的商品罪再审刑事裁定书', caseNumber: '(2024)鄂刑再12号', court: '湖北省高级人民法院', date: '2024-10-30' },
    ],
  },
  {
    id: 8,
    type: 'case',
    caseType: '民事一审',
    documentType: '民事判决书',
    title: '周某某与某某外卖平台网络服务合同纠纷一审民事判决书',
    court: '南京市鼓楼区人民法院',
    caseNumber: '(2024)苏0106民初3456号',
    date: '2024-04-10',
    settleDate: '2024-04-10审结',
    tags: ['本院认为', '裁判结果', '平台责任'],
    content: '本院认为，被告某某外卖平台未对入驻商家的食品经营资质进行有效审核，导致原告在平台上购买的食品存在安全问题，被告应承担相应的连带责任。根据《电子商务法》相关规定，判决被告赔偿原告损失。',
    judgmentResult: '一、被告某某网络科技有限公司于本判决生效之日起十日内赔偿原告周某某医疗费、误工费等损失共计人民币8500元。\n二、驳回原告周某某的其他诉讼请求。',
    historicalDocs: [
      { title: '周某某与某某外卖平台网络服务合同纠纷二审民事判决书', caseNumber: '(2024)苏01民织1234号', court: '南京市中级人民法院', date: '2024-07-28' },
    ],
  },
  {
    id: 9,
    type: 'case',
    caseType: '刑事一审',
    documentType: '刑事判决书',
    title: '孙某某非法经营罪一审刑事判决书',
    court: '郑州市金水区人民法院',
    caseNumber: '(2024)豫0105刑初901号',
    date: '2024-03-28',
    settleDate: '2024-03-28审结',
    tags: ['本院认为', '裁判结果', '食品经营'],
    content: '本院认为，被告人孙某某未取得食品经营许可证，擅自从事食品生产经营活动，情节严重，扰乱市场秩序，其行为已构成非法经营罪。被告人经营的黑作坊生产环境恶劣，严重威胁食品安全。',
    judgmentResult: '一、被告人孙某某犯非法经营罪，判处有期徒刑二年，缓刑三年，并处罚金人民币十万元。\n二、扣押在案的生产设备、原材料等予以没收。',
    historicalDocs: [
      { title: '孙某某非法经营罪二审刑事裁定书', caseNumber: '(2024)豫刑绉567号', court: '河南省高级人民法院', date: '2024-06-15' },
    ],
  },
  {
    id: 10,
    type: 'case',
    caseType: '民事一审',
    documentType: '民事调解书',
    title: '吴某某与某某学校餐饮服务合同纠纷一审民事调解书',
    court: '西安市雁塔区人民法院',
    caseNumber: '(2024)陕0113民初2234号',
    date: '2024-02-20',
    settleDate: '2024-02-20审结',
    tags: ['调解协议', '食品安全', '学校食堂'],
    content: '经本院主持调解，双方当事人自愿达成协议：被告某某学校向原告吴某某赔偿因学校食堂食品卫生问题造成的医疗费、营养费等损失共计人民币12000元，并承诺加强食堂卫生管理，确保学生用餐安全。',
    judgmentResult: '调解协议内容：\n一、被告某某学校于本调解书生效之日起十日内一次性支付原告吴某某医疗费、营养费、交通费等各项损失共计人民币12000元。\n二、被告某某学校承诺在三十日内对学校食堂进行全面整改，并接受卫生部门的监督检查。\n三、双方当事人就本案再无其他争议。',
    historicalDocs: [
      { title: '吴某某与某某学校餐饮服务合同纠纷诉前调解协议', caseNumber: '陕雁0113调字(2024)0088号', court: '西安市雁塔区人民法院', date: '2024-01-15' },
    ],
  },
];

// Regulation results mock data
export const regulationResults = [
  {
    id: 101,
    type: 'regulation',
    title: '中华人民共和国食品安全法（2021年修正）',
    category: '法律',
    authority: '全国人大常委会 | 中华人民共和国主席令第81号',
    publishDate: '2021-04-29公布',
    effectiveDate: '2021-04-29施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 102,
    type: 'regulation',
    title: '中华人民共和国食品安全法实施条例（2019年修订）',
    category: '行政法规',
    authority: '国务院 | 国务院令第721号',
    publishDate: '2019-10-11公布',
    effectiveDate: '2019-12-01施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 103,
    type: 'regulation',
    title: '最高人民法院、最高人民检察院关于办理危害食品安全刑事案件适用法律若干问题的解释',
    category: '司法解释',
    authority: '最高人民法院 最高人民检察院 | 法释〔2021〕24号',
    publishDate: '2021-12-31公布',
    effectiveDate: '2022-01-01施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 104,
    type: 'regulation',
    title: '食品生产许可管理办法',
    category: '部门规章',
    authority: '国家市场监督管理总局 | 总局令第24号',
    publishDate: '2020-01-02公布',
    effectiveDate: '2020-03-01施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 105,
    type: 'regulation',
    title: '食品经营许可和备案管理办法',
    category: '部门规章',
    authority: '国家市场监督管理总局 | 总局令第78号',
    publishDate: '2023-06-15公布',
    effectiveDate: '2023-12-01施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 106,
    type: 'regulation',
    title: '网络餐饮服务食品安全监督管理办法',
    category: '部门规章',
    authority: '国家食品药品监督管理总局 | 总局令第36号',
    publishDate: '2017-11-06公布',
    effectiveDate: '2018-01-01施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 107,
    type: 'regulation',
    title: '食品安全抽样检验管理办法（2019年修订）',
    category: '部门规章',
    authority: '国家市场监督管理总局 | 总局令第15号',
    publishDate: '2019-08-08公布',
    effectiveDate: '2019-10-01施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 108,
    type: 'regulation',
    title: '北京市食品安全条例',
    category: '地方性法规',
    authority: '北京市人民代表大会常务委员会',
    publishDate: '2023-09-22公布',
    effectiveDate: '2023-12-01施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 109,
    type: 'regulation',
    title: '婴幼儿配方乳粉产品配方注册管理办法（2023年修订）',
    category: '部门规章',
    authority: '国家市场监督管理总局 | 总局令第77号',
    publishDate: '2023-11-24公布',
    effectiveDate: '2024-01-01施行',
    status: '现行有效',
    statusClass: 'valid',
  },
  {
    id: 110,
    type: 'regulation',
    title: '食品标识监督管理办法（征求意见稿）',
    category: '部门规章',
    authority: '国家市场监督管理总局',
    publishDate: '2024-06-15公布',
    effectiveDate: '2025-01-01施行',
    status: '尚未生效',
    statusClass: 'pending',
  },
];

// Filter section configurations
export const casesFilterSections = [
  { key: 'referenceLevel', label: '参照级别' },
  { key: 'caseReason', label: '案由' },
  { key: 'courtLevel', label: '法院层级' },
  { key: 'region', label: '地域及法院' },
  { key: 'settlementYear', label: '审结年份' },
  { key: 'trialProcedure', label: '审判程序' },
  { key: 'documentType', label: '文书类型' },
];

export const regulationsFilterSections = [
  { key: 'hierarchy', label: '效力位阶' },
  { key: 'effectiveness', label: '时效性' },
  { key: 'region', label: '地区' },
  { key: 'industry', label: '申万行业' },
  { key: 'sector', label: '产业分类' },
];

// Types
export interface FilterItem {
  label: string;
  count: number;
  value: string;
  children?: FilterItem[];
}

export interface FilterSection {
  key: string;
  label: string;
}

export interface CaseResult {
  id: number;
  type: string;
  caseType: string;
  documentType: string;
  title: string;
  court: string;
  caseNumber: string;
  date: string;
  settleDate: string;
  tags: string[];
  content: string;
  judgmentResult: string;
  historicalDocs: Array<{
    title: string;
    caseNumber: string;
    court: string;
    date: string;
  }>;
}

export interface RegulationResult {
  id: number;
  type: string;
  title: string;
  category: string;
  authority: string;
  publishDate: string;
  effectiveDate: string;
  status: string;
  statusClass: string;
}
