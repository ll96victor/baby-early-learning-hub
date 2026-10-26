import {
  DEFAULT_STATE,
  activeFilterLabels,
  categoryById,
  categoryCount,
  dataCounts,
  entryDescription,
  entryHref,
  entryLabel,
  formatCount,
  languageLabel,
  pick,
  platformLabel,
  preferenceLabel,
  pricingLabel,
  selectResources,
  tierLabel,
  verificationDescription,
  verificationLabel
} from './core.mjs';

const UI = {
  zh: {
    brand: '宝宝早教资源库',
    brandSub: '0～3岁 · 家长精选',
    navResources: '资源库',
    navGuide: '收录说明',
    navAbout: '关于本站',
    sideCategory: '资源分类',
    sideFilter: '进一步筛选',
    platformLabel: '使用平台',
    languageLabel: '资源语言',
    verificationLabel: '验证状态',
    ageNoteTitle: '👶 关于适用年龄',
    ageNoteBody: '本资源库面向 0～3 岁家庭，不细分更小年龄段。资源是否适合当前孩子，请家长结合实际发展情况陪同选择。',
    statusHelp: '状态标签怎么看',
    headline: '为宝宝精选互动早教资源',
    introBody: '0～3 岁家庭的早教资源目录。Lucas 优先，中文资源靠前，并如实记录声音、加载与验证状态。',
    resourceCount: '条资源 · 三个分层',
    filterButton: '筛选',
    reset: '清除筛选',
    resultTitle: '精选互动资源',
    sortLabel: '排序方式',
    loading: '正在读取资源数据…',
    loadErrorTitle: '暂时无法读取资源数据',
    loadErrorBody: '请确认你是通过本地服务器或线上网址打开本站，而不是直接双击 HTML 文件。',
    retry: '重试',
    emptyTitle: '没有符合条件的资源',
    emptySub: '试试清除筛选条件，或者搜索其他名称。',
    detailTitle: '资源详情',
    viewDetail: '查看详情',
    close: '关闭',
    howToOpen: '如何打开',
    verificationRecord: '验证记录',
    ageEvidence: '开发者标称年龄与家长建议',
    providerClaim: '开发者标称',
    parentGuidance: '家长建议',
    learningFocus: '学习重点',
    source: '官方来源',
    platformFact: '平台',
    languageFact: '内容语言',
    categoryFact: '玩法分类',
    pricingFact: '价格',
    entryFact: '入口类型',
    checkedFact: '核查日期',
    issuesTitle: '已记录的边界或异常',
    noIssues: '暂无独立异常记录，仍需以验证说明为准。',
    allPlatforms: '所有平台',
    allLanguages: '所有语言',
    allVerifications: '所有验证状态',
    sortFeatured: '精选优先',
    sortChinese: '中文优先',
    sortName: '名称排序',
    matches: '共 {n} 条',
    footerPrefix: '资源核查日期',
    footerIllustration: '插画为原创占位图',
    footerHosting: '本站不托管第三方游戏',
    repoLink: 'GitHub 仓库与收录标准',
    curationTitle: '收录说明',
    curationIntro: '本站把“官方说法、自动化测试、家长亲测”当成不同等级的证据，并把“验证状态”与“家庭偏好”分开记录。',
    tiersTitle: '三个展示分层',
    verificationTitle: '验证状态',
    entryTypesTitle: '入口类型',
    ageScopeTitle: '年龄范围',
    illustrationTitle: '插画与版权',
    aboutTitle: '关于本站',
    aboutIntro: '这是一个面向 0～3 岁家庭的静态资源导航站：没有账号、数据库、后台、评论或跟踪脚本。',
    aboutPoints: [
      '桌面端保留 B 型布局：左侧分类与筛选，右侧横向资源列表。',
      '手机端把分类放到顶部，并提供筛选抽屉。',
      '网站与 GitHub README 的 14 条资源清单来自同一份 data/resources.json。',
      '外部链接在新标签页打开，本站不托管、不嵌入第三方游戏。'
    ],
    dataTitle: '数据与版本',
    techTitle: '技术说明',
    techBody: '纯静态 HTML/CSS/JavaScript，可直接部署到 GitHub Pages；资源数据由 data/resources.json 驱动，数据校验与 README 同步由 Node 脚本完成。',
    linkNote: '此链接会在新标签页打开第三方官方网站。本站不托管游戏、不自动播放声音，也不收集儿童语音或个人信息。',
    home: '资源库',
    closeDrawer: '关闭筛选'
  },
  en: {
    brand: 'Baby Early Learning Library',
    brandSub: 'Ages 0–3 · Parent curated',
    navResources: 'Explore',
    navGuide: 'Curation policy',
    navAbout: 'About this site',
    sideCategory: 'Browse topics',
    sideFilter: 'Refine results',
    platformLabel: 'Platform',
    languageLabel: 'Content language',
    verificationLabel: 'Verification',
    ageNoteTitle: '👶 About age suitability',
    ageNoteBody: 'This library is for families with children aged 0–3 and does not use narrower age brackets. Parents should decide what suits each child and supervise play.',
    statusHelp: 'How to read the labels',
    headline: 'Gentle discoveries for little learners',
    introBody: 'A resource directory for families with children aged 0–3. Lucas comes first, Mandarin resources follow, and audio, loading and verification notes stay honest.',
    resourceCount: 'resources · three tiers',
    filterButton: 'Filters',
    reset: 'Clear filters',
    resultTitle: 'Curated interactive activities',
    sortLabel: 'Sort by',
    loading: 'Loading resource data…',
    loadErrorTitle: 'Resource data could not be loaded',
    loadErrorBody: 'Open the site through a local server or the live URL rather than double-clicking the HTML file.',
    retry: 'Try again',
    emptyTitle: 'No matching resources',
    emptySub: 'Clear the filters or try another search term.',
    detailTitle: 'Resource details',
    viewDetail: 'Details',
    close: 'Close',
    howToOpen: 'How to open it',
    verificationRecord: 'Verification record',
    ageEvidence: 'Provider age label and parent guidance',
    providerClaim: 'Provider label',
    parentGuidance: 'Parent guidance',
    learningFocus: 'Learning focus',
    source: 'Official sources',
    platformFact: 'Platform',
    languageFact: 'Content language',
    categoryFact: 'Activity',
    pricingFact: 'Pricing',
    entryFact: 'Entry type',
    checkedFact: 'Checked on',
    issuesTitle: 'Recorded limits or issues',
    noIssues: 'No separate issue is recorded; the verification note still applies.',
    allPlatforms: 'Any platform',
    allLanguages: 'Any language',
    allVerifications: 'Any verification state',
    sortFeatured: 'Featured first',
    sortChinese: 'Mandarin first',
    sortName: 'Name A–Z',
    matches: '{n} entries',
    footerPrefix: 'Resources checked on',
    footerIllustration: 'Original placeholder illustrations',
    footerHosting: 'This site does not host third-party games',
    repoLink: 'GitHub repository and curation policy',
    curationTitle: 'Curation policy',
    curationIntro: 'Provider claims, automated tests and parent experience are different levels of evidence. Verification state and family preference are recorded separately.',
    tiersTitle: 'Three display tiers',
    verificationTitle: 'Verification states',
    entryTypesTitle: 'Entry types',
    ageScopeTitle: 'Age range',
    illustrationTitle: 'Illustrations and copyright',
    aboutTitle: 'About this site',
    aboutIntro: 'A static resource directory for families with children aged 0–3: no accounts, database, backend, comments or tracking scripts.',
    aboutPoints: [
      'Desktop keeps layout B: topics and filters on the left, horizontal resource rows on the right.',
      'On mobile, topics move to the top with a filter drawer.',
      'The website and GitHub README use the same 14-entry data/resources.json.',
      'External links open in a new tab; this site does not host or embed third-party games.'
    ],
    dataTitle: 'Data and version',
    techTitle: 'Technical note',
    techBody: 'Plain static HTML/CSS/JavaScript, deployable to GitHub Pages. Resource data is driven by data/resources.json; validation and README syncing run through Node scripts.',
    linkNote: 'This opens the third-party official website in a new tab. This site does not host games, auto-play audio or collect children’s voices or personal information.',
    home: 'Resources',
    closeDrawer: 'Close filters'
  }
};

const ICONS = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20s-7-4.2-7-9.2A4 4 0 0 1 12 7a4 4 0 0 1 7 3.8C19 15.8 12 20 12 20Z"/></svg>',
  speech: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/></svg>',
  letters: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 19 10 5h4l5 14M7.5 14h9"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 18V6l10-2v11"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="15" r="2.5"/></svg>',
  keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M7 14h10"/></svg>',
  paw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="7" cy="9" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="17" cy="9" r="2"/><path d="M7.5 17c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1.5-1.2 2.5-2.7 2.5-1 0-1.8-.5-2.3-.5s-1.3.5-2.3.5C7.7 19.5 7.5 18.5 7.5 17Z"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20a8 8 0 1 1 8-8c0 2.5-1.5 3-3 3h-2a2 2 0 0 0-1.5 3.3c.5.6.2 1.7-1.5 1.7Z"/><circle cx="8" cy="9" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="9" r="1"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>'
};

const els = {
  categories: document.getElementById('categories'),
  mobileCategories: document.getElementById('mobileCategories'),
  platform: document.getElementById('platform'),
  language: document.getElementById('language'),
  verification: document.getElementById('verification'),
  sort: document.getElementById('sort'),
  search: document.getElementById('search'),
  clearSearch: document.getElementById('clearSearch'),
  resetTop: document.getElementById('resetTop'),
  cards: document.getElementById('cards'),
  resultCount: document.getElementById('resultCount'),
  categoryHint: document.getElementById('categoryHint'),
  activeFilters: document.getElementById('activeFilters'),
  listView: document.getElementById('listView'),
  gridView: document.getElementById('gridView'),
  allCount: document.getElementById('allCount'),
  footerMeta: document.getElementById('footerMeta'),
  repoLink: document.getElementById('repoLink'),
  sidebar: document.getElementById('sidebar'),
  drawerBackdrop: document.getElementById('drawerBackdrop'),
  closeDrawer: document.getElementById('closeDrawer'),
  openDrawer: document.getElementById('openDrawer'),
  detailDialog: document.getElementById('detailDialog'),
  modalBody: document.getElementById('modalBody'),
  closeDialog: document.getElementById('closeDialog'),
  zhSwitch: document.getElementById('zhSwitch'),
  enSwitch: document.getElementById('enSwitch')
};

const state = { ...DEFAULT_STATE };
let data = null;
let optionsLocale = null;

function t(key) {
  return UI[state.locale][key] || key;
}

function pickText(value) {
  return pick(value, state.locale);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function statusClass(status) {
  return {
    family_tested: 'status-ok',
    agent_tested: 'status-info',
    developer_claimed: 'status-neutral',
    pending: 'status-pending',
    issue_reported: 'status-warning'
  }[status] || 'status-pending';
}

function thumb(resource, extra = '') {
  return `<div class="thumb ${extra}" style="--theme:${escapeAttr(resource.media.theme)}">
    <span class="spark" aria-hidden="true">✦</span>
    <span class="art" aria-hidden="true">${escapeHtml(resource.media.emoji)}</span>
    <span class="art-small" aria-hidden="true">${escapeHtml(resource.media.accent)}</span>
  </div>`;
}

function categoryNames(resource) {
  return resource.categories.map((id) => pickText(categoryById(data.categories, id).name));
}

function hydrateStaticText() {
  document.documentElement.lang = state.locale === 'zh' ? 'zh-CN' : 'en';
  document.title = `${pickText(data.meta.siteName)} · ${pickText(data.meta.tagline)}`;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = state.locale === 'zh'
      ? '面向 0～3 岁家庭的早教互动资源导航：14 条真实入口、双语说明、验证状态与家庭反馈。'
      : 'An early-learning resource directory for families with children aged 0–3: 14 real entries, bilingual notes, verification states and family feedback.';
  }
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  els.search.placeholder = state.locale === 'zh'
    ? '搜索中文儿歌、Lucas、随便敲键盘…'
    : 'Search titles, songs, animals, keyboard…';
  els.openDrawer.querySelector('span').textContent = t('filterButton');
  els.zhSwitch.classList.toggle('active', state.locale === 'zh');
  els.enSwitch.classList.toggle('active', state.locale === 'en');
  els.zhSwitch.setAttribute('aria-pressed', String(state.locale === 'zh'));
  els.enSwitch.setAttribute('aria-pressed', String(state.locale === 'en'));

  const counts = dataCounts(data);
  els.allCount.textContent = counts.total;
  els.footerMeta.textContent = `${t('footerPrefix')} ${data.meta.auditedAt} · ${t('footerIllustration')} · ${t('footerHosting')}`;
  els.repoLink.textContent = t('repoLink');
  els.repoLink.href = data.meta.repoUrl;
}

function mountCategories() {
  els.categories.innerHTML = data.categories.map((category) => `
    <button class="cat-btn" type="button" data-cat="${escapeAttr(category.id)}" aria-pressed="false">
      <span class="cat-ico" aria-hidden="true">${ICONS[category.icon] || ICONS.grid}</span>
      <span class="cat-name">${escapeHtml(pickText(category.name))}</span>
      <span class="cat-num">${categoryCount(data.resources, category.id)}</span>
    </button>
  `).join('');
  els.mobileCategories.innerHTML = data.categories.map((category) => `
    <button class="mobile-cat" type="button" data-cat="${escapeAttr(category.id)}" aria-pressed="false">
      <span aria-hidden="true">${ICONS[category.icon] || ICONS.grid}</span>
      <span>${escapeHtml(pickText(category.name))}</span>
    </button>
  `).join('');
}

function updateCategories() {
  document.querySelectorAll('[data-cat]').forEach((button) => {
    const category = categoryById(data.categories, button.dataset.cat);
    const active = state.category === category.id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    const name = button.querySelector('.cat-name') || button.querySelector('span:last-child');
    if (name && button.classList.contains('cat-btn')) name.textContent = pickText(category.name);
    else if (button.classList.contains('mobile-cat')) {
      const label = button.querySelector('span:last-child');
      if (label) label.textContent = pickText(category.name);
    }
    const count = button.querySelector('.cat-num');
    if (count) count.textContent = categoryCount(data.resources, category.id);
  });
}

function selectOptions(entries) {
  return entries.map(([value, label]) => `<option value="${escapeAttr(value)}">${escapeHtml(label)}</option>`).join('');
}

function updateSelects() {
  if (optionsLocale !== state.locale) {
    els.platform.innerHTML = selectOptions([
      ['all', t('allPlatforms')],
      ...Object.entries(data.taxonomy.platforms).map(([id, item]) => [id, pickText(item.label)])
    ]);
    els.language.innerHTML = selectOptions([
      ['all', t('allLanguages')],
      ...['zh', 'en', 'zh-en', 'none'].map((id) => [id, pickText(data.taxonomy.languages[id].label)])
    ]);
    els.verification.innerHTML = selectOptions([
      ['all', t('allVerifications')],
      ...Object.entries(data.taxonomy.verification).map(([id, item]) => [id, pickText(item.label)])
    ]);
    els.sort.innerHTML = selectOptions([
      ['featured', t('sortFeatured')],
      ['chinese', t('sortChinese')],
      ['name', t('sortName')]
    ]);
    optionsLocale = state.locale;
  }
  els.platform.value = state.platform;
  els.language.value = state.language;
  els.verification.value = state.verification;
  els.sort.value = state.sort;
}

function renderCard(resource) {
  const href = entryHref(resource);
  const platforms = resource.platforms.map((id) => platformLabel(data, id, state.locale)).join(' / ');
  const categoryPills = resource.categories.slice(0, 2)
    .map((id) => `<span class="pill category">${escapeHtml(pickText(categoryById(data.categories, id).name))}</span>`)
    .join('');
  const family = resource.familyPreference === 'liked'
    ? `<span class="family-badge">♥ ${escapeHtml(preferenceLabel(data, resource.familyPreference, state.locale))}</span>`
    : '';
  return `<article class="resource-card" data-id="${escapeAttr(resource.id)}">
    ${thumb(resource)}
    <div class="card-info">
      <div class="card-top">
        <span class="tier-badge tier-${escapeAttr(resource.tier)}">${escapeHtml(tierLabel(data, resource.tier, state.locale))}</span>
        ${family}
        <span class="card-title">${escapeHtml(pickText(resource.name))}</span>
      </div>
      <p class="card-description">${escapeHtml(pickText(resource.summary))}</p>
      <div class="pills">
        ${categoryPills}
        <span class="pill lang">${escapeHtml(languageLabel(data, resource.contentLanguages, state.locale))}</span>
        <span class="pill">${escapeHtml(platforms)}</span>
        <span class="status ${statusClass(resource.verification.status)}"><span class="status-dot"></span>${escapeHtml(verificationLabel(data, resource.verification.status, state.locale))}</span>
      </div>
    </div>
    <div class="card-actions">
      <a class="primary" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(entryLabel(data, resource, state.locale))} ↗</a>
      <button type="button" class="secondary-link" data-detail="${escapeAttr(resource.id)}">${escapeHtml(t('viewDetail'))}</button>
    </div>
  </article>`;
}

function updateCategoryHint() {
  if (state.category === 'all') {
    els.categoryHint.hidden = true;
    els.categoryHint.textContent = '';
    return;
  }
  const category = categoryById(data.categories, state.category);
  els.categoryHint.hidden = false;
  els.categoryHint.textContent = pickText(category.description);
}

function updateActiveFilters() {
  const labels = activeFilterLabels(data, state, state.locale);
  const hasFilters = labels.length > 0;
  els.activeFilters.classList.toggle('visible', hasFilters);
  els.activeFilters.innerHTML = hasFilters
    ? labels.map((label) => `<span>${escapeHtml(label)}</span>`).join('')
      + `<button class="reset-link" type="button" data-reset-filters>${escapeHtml(t('reset'))} ×</button>`
    : '';
}

function updateViewSwitch() {
  const isList = state.layout === 'list';
  els.listView.classList.toggle('active', isList);
  els.gridView.classList.toggle('active', !isList);
  els.listView.setAttribute('aria-pressed', String(isList));
  els.gridView.setAttribute('aria-pressed', String(!isList));
}

function emptyState() {
  return `<div class="state-box">
    <div class="state-icon" aria-hidden="true">🔎</div>
    <strong>${escapeHtml(t('emptyTitle'))}</strong>
    <p>${escapeHtml(t('emptySub'))}</p>
    <button class="ghost-btn" type="button" data-reset-filters>${escapeHtml(t('reset'))}</button>
  </div>`;
}

function render() {
  if (!data) return;
  hydrateStaticText();
  updateCategories();
  updateSelects();
  const list = selectResources(data, state, state.locale);
  els.cards.className = `resource-list${state.layout === 'grid' ? ' grid' : ''}`;
  els.cards.innerHTML = list.length ? list.map(renderCard).join('') : emptyState();
  els.resultCount.textContent = formatCount(t('matches'), list.length);
  els.clearSearch.classList.toggle('visible', Boolean(state.search));
  updateCategoryHint();
  updateActiveFilters();
  updateViewSwitch();
}

function resetFilters() {
  state.category = 'all';
  state.platform = 'all';
  state.language = 'all';
  state.verification = 'all';
  state.search = '';
  state.sort = 'featured';
  els.search.value = '';
  render();
}

function loadError(error) {
  console.error(error);
  els.cards.className = 'resource-list';
  els.cards.innerHTML = `<div class="state-box">
    <div class="state-icon" aria-hidden="true">⚠️</div>
    <strong>${escapeHtml(t('loadErrorTitle'))}</strong>
    <p>${escapeHtml(t('loadErrorBody'))}</p>
    <button class="primary" type="button" data-retry>${escapeHtml(t('retry'))}</button>
  </div>`;
}

function openDetails(id) {
  const resource = data.resources.find((item) => item.id === id);
  if (!resource) return;
  const categories = categoryNames(resource).map((name) => `<span class="pill category">${escapeHtml(name)}</span>`).join('');
  const issues = resource.verification.issues.length
    ? `<p class="issue-title">${escapeHtml(t('issuesTitle'))}</p><ul class="issue-list">${resource.verification.issues.map((issue) => `<li>${escapeHtml(pickText(issue))}</li>`).join('')}</ul>`
    : `<p class="meta-line">${escapeHtml(t('noIssues'))}</p>`;
  const provider = resource.ageEvidence.providerClaim
    ? `<p><b>${escapeHtml(t('providerClaim'))}：</b>${escapeHtml(pickText(resource.ageEvidence.providerClaim))}</p>`
    : '';
  const learning = resource.learningFocus
    ? `<section class="detail-section"><h3>${escapeHtml(t('learningFocus'))}</h3><p>${escapeHtml(pickText(resource.learningFocus))}</p></section>`
    : '';
  const family = resource.familyPreference === 'liked'
    ? `<span class="family-badge">♥ ${escapeHtml(preferenceLabel(data, resource.familyPreference, state.locale))}</span>`
    : `<span class="tier-badge tier-${escapeAttr(resource.tier)}">${escapeHtml(preferenceLabel(data, resource.familyPreference, state.locale))}</span>`;
  const sources = resource.sourceEvidence.map((source) => `<a class="url" href="${escapeAttr(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} ↗</a>`).join(' ');
  els.modalBody.innerHTML = `
    <div class="detail-top">
      ${thumb(resource, 'detail-thumb')}
      <div>
        <div class="badge-row">
          <span class="tier-badge tier-${escapeAttr(resource.tier)}">${escapeHtml(tierLabel(data, resource.tier, state.locale))}</span>
          ${family}
          <span class="status ${statusClass(resource.verification.status)}"><span class="status-dot"></span>${escapeHtml(verificationLabel(data, resource.verification.status, state.locale))}</span>
        </div>
        <h2 id="detailHeading">${escapeHtml(pickText(resource.name))}</h2>
        <p class="detail-sub">${escapeHtml(pickText(resource.summary))}</p>
        <p class="status-desc">${escapeHtml(verificationDescription(data, resource.verification.status, state.locale))}</p>
      </div>
    </div>
    <div class="facts">
      <div class="fact"><b>${escapeHtml(t('platformFact'))}</b>${escapeHtml(resource.platforms.map((id) => platformLabel(data, id, state.locale)).join(' / '))}</div>
      <div class="fact"><b>${escapeHtml(t('languageFact'))}</b>${escapeHtml(languageLabel(data, resource.contentLanguages, state.locale))}</div>
      <div class="fact"><b>${escapeHtml(t('categoryFact'))}</b>${categories}</div>
      <div class="fact"><b>${escapeHtml(t('pricingFact'))}</b>${escapeHtml(pricingLabel(data, resource.pricing.status, state.locale))}</div>
      <div class="fact"><b>${escapeHtml(t('entryFact'))}</b>${escapeHtml(entryLabel(data, resource, state.locale))}</div>
      <div class="fact"><b>${escapeHtml(t('checkedFact'))}</b>${escapeHtml(resource.verification.checkedAt)}</div>
    </div>
    <p class="meta-line">${escapeHtml(pickText(resource.pricing.note))}</p>
    <section class="detail-section">
      <h3>${escapeHtml(t('howToOpen'))}</h3>
      <p>${escapeHtml(entryDescription(data, resource, state.locale))}</p>
      <p class="url">${escapeHtml(entryHref(resource))}</p>
    </section>
    <section class="detail-section">
      <h3>${escapeHtml(t('verificationRecord'))}</h3>
      <p>${escapeHtml(pickText(resource.verification.observations))}</p>
      <p class="meta-line">${escapeHtml(pickText(resource.verification.device))} · ${escapeHtml(resource.verification.checkedAt)}</p>
      ${issues}
    </section>
    <section class="detail-section">
      <h3>${escapeHtml(t('ageEvidence'))}</h3>
      ${provider}
      <p><b>${escapeHtml(t('parentGuidance'))}：</b>${escapeHtml(pickText(resource.ageEvidence.parentGuidance))}</p>
      <p class="meta-line">${escapeHtml(pickText(data.meta.ageScope))}</p>
    </section>
    ${learning}
    <section class="detail-section">
      <h3>${escapeHtml(t('source'))}</h3>
      <p>${sources}</p>
    </section>
    <div class="detail-cta">
      <a class="primary" href="${escapeAttr(entryHref(resource))}" target="_blank" rel="noopener noreferrer">${escapeHtml(entryLabel(data, resource, state.locale))} ↗</a>
      <button type="button" class="ghost-btn" data-close-inside>${escapeHtml(t('close'))}</button>
    </div>
    <p class="link-note">${escapeHtml(t('linkNote'))}</p>
  `;
  els.detailDialog.showModal();
}

function openInfoModal(type) {
  if (type === 'curation') {
    const tiers = Object.entries(data.taxonomy.tiers).map(([, item]) => `<li><b>${escapeHtml(pickText(item.label))}</b> — ${escapeHtml(pickText(item.description))}</li>`).join('');
    const verifications = Object.entries(data.taxonomy.verification).map(([, item]) => `<li><b>${escapeHtml(pickText(item.label))}</b> — ${escapeHtml(pickText(item.description))}</li>`).join('');
    const entries = Object.entries(data.taxonomy.entryTypes).map(([, item]) => `<li><b>${escapeHtml(pickText(item.label))}</b> — ${escapeHtml(pickText(item.description))}</li>`).join('');
    els.modalBody.innerHTML = `
      <h2 id="detailHeading">${escapeHtml(t('curationTitle'))}</h2>
      <p class="detail-sub">${escapeHtml(t('curationIntro'))}</p>
      <section class="detail-section"><h3>${escapeHtml(t('ageScopeTitle'))}</h3><p>${escapeHtml(pickText(data.meta.ageScope))}</p></section>
      <section class="detail-section"><h3>${escapeHtml(t('tiersTitle'))}</h3><ul class="curation-list">${tiers}</ul></section>
      <section class="detail-section"><h3>${escapeHtml(t('verificationTitle'))}</h3><ul class="curation-list">${verifications}</ul></section>
      <section class="detail-section"><h3>${escapeHtml(t('entryTypesTitle'))}</h3><ul class="curation-list">${entries}</ul></section>
      <section class="detail-section"><h3>${escapeHtml(t('illustrationTitle'))}</h3><p>${escapeHtml(pickText(data.meta.illustrationNotice))}</p></section>
      <div class="detail-cta"><button type="button" class="primary" data-close-inside>${escapeHtml(t('close'))}</button></div>
    `;
  } else {
    els.modalBody.innerHTML = `
      <h2 id="detailHeading">${escapeHtml(t('aboutTitle'))}</h2>
      <p class="detail-sub">${escapeHtml(t('aboutIntro'))}</p>
      <section class="detail-section"><h3>${escapeHtml(t('navResources'))}</h3><ul class="curation-list">${UI[state.locale].aboutPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul></section>
      <section class="detail-section"><h3>${escapeHtml(t('dataTitle'))}</h3><p>${escapeHtml(t('techBody'))}</p><p class="meta-line">schema v${escapeHtml(data.meta.schemaVersion)} · v${escapeHtml(data.meta.version)} · ${escapeHtml(data.meta.auditedAt)}</p></section>
      <section class="detail-section"><h3>${escapeHtml(t('source'))}</h3><p><a class="url" href="${escapeAttr(data.meta.repoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(data.meta.repoUrl)} ↗</a></p><p><a class="url" href="${escapeAttr(data.meta.pagesUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(data.meta.pagesUrl)} ↗</a></p></section>
      <div class="detail-cta"><button type="button" class="primary" data-close-inside>${escapeHtml(t('close'))}</button></div>
    `;
  }
  els.detailDialog.showModal();
}

function setDrawer(open) {
  els.sidebar.classList.toggle('open', open);
  els.drawerBackdrop.hidden = !open;
  els.drawerBackdrop.classList.toggle('open', open);
  document.body.classList.toggle('drawer-open', open);
  els.openDrawer.setAttribute('aria-expanded', String(open));
  if (open) {
    const firstCategory = els.sidebar.querySelector('[data-cat]');
    if (firstCategory) firstCategory.focus({ preventScroll: true });
  } else {
    els.openDrawer.focus({ preventScroll: true });
  }
}

function bindEvents() {
  els.search.addEventListener('input', (event) => {
    state.search = event.target.value;
    render();
  });
  els.clearSearch.addEventListener('click', () => {
    state.search = '';
    els.search.value = '';
    render();
    els.search.focus();
  });
  els.resetTop.addEventListener('click', resetFilters);
  for (const key of ['platform', 'language', 'verification', 'sort']) {
    els[key].addEventListener('change', (event) => {
      state[key] = event.target.value;
      render();
    });
  }
  els.listView.addEventListener('click', () => {
    state.layout = 'list';
    render();
  });
  els.gridView.addEventListener('click', () => {
    state.layout = 'grid';
    render();
  });
  els.zhSwitch.addEventListener('click', () => {
    state.locale = 'zh';
    render();
  });
  els.enSwitch.addEventListener('click', () => {
    state.locale = 'en';
    render();
  });
  els.openDrawer.addEventListener('click', () => setDrawer(true));
  els.closeDrawer.addEventListener('click', () => setDrawer(false));
  els.drawerBackdrop.addEventListener('click', () => setDrawer(false));
  els.closeDialog.addEventListener('click', () => els.detailDialog.close());
  els.detailDialog.addEventListener('click', (event) => {
    if (event.target === els.detailDialog) els.detailDialog.close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && els.sidebar.classList.contains('open')) setDrawer(false);
  });
  document.addEventListener('click', (event) => {
    const target = event.target;
    const category = target.closest('[data-cat]');
    if (category) {
      state.category = category.dataset.cat;
      render();
      if (window.matchMedia('(max-width: 760px)').matches) setDrawer(false);
      return;
    }
    if (target.closest('[data-reset-filters]')) {
      resetFilters();
      return;
    }
    if (target.closest('[data-retry]')) {
      window.location.reload();
      return;
    }
    const detail = target.closest('[data-detail]');
    if (detail) {
      openDetails(detail.dataset.detail);
      return;
    }
    const modal = target.closest('[data-modal]');
    if (modal) {
      if (els.sidebar.classList.contains('open')) setDrawer(false);
      openInfoModal(modal.dataset.modal);
      return;
    }
    if (target.closest('[data-close-inside]')) {
      els.detailDialog.close();
    }
  });
}

async function loadData() {
  const response = await fetch('./data/resources.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function init() {
  bindEvents();
  try {
    data = await loadData();
  } catch (error) {
    loadError(error);
    return;
  }
  mountCategories();
  render();
}

init();
