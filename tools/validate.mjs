#!/usr/bin/env node
/**
 * Data contract for the single resource source of truth.
 * Run: node tools/validate.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = join(ROOT, 'data', 'resources.json');

const ENTRY_TYPES = ['play_web', 'store', 'source', 'official_info'];
const VERIFICATION_STATUSES = ['family_tested', 'agent_tested', 'developer_claimed', 'pending', 'issue_reported'];
const TIERS = ['featured', 'candidate', 'watch'];
const PRICING_STATUSES = ['developer_claimed_free', 'free_unverified', 'unknown', 'paid'];
const PLATFORMS = ['web', 'windows'];
const LANGUAGE_CODES = ['zh', 'en', 'none'];
const PREFERENCES = ['liked', 'neutral', 'unknown'];
const CATEGORY_ICONS = ['grid', 'heart', 'speech', 'letters', 'music', 'keyboard', 'paw', 'palette', 'sparkle'];
const EXPECTED_RESOURCE_COUNT = 14;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isBilingual(value) {
  return value && isNonEmptyString(value.zh) && isNonEmptyString(value.en);
}

function isHttpsUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function checkTaxonomy(data, errors) {
  const groups = ['entryTypes', 'verification', 'tiers', 'pricing', 'platforms', 'languages', 'familyPreferences'];
  for (const group of groups) {
    if (!data.taxonomy?.[group] || typeof data.taxonomy[group] !== 'object') {
      errors.push(`taxonomy.${group} 缺失`);
    }
  }
  if (!data.taxonomy) return;

  for (const key of ENTRY_TYPES) {
    const item = data.taxonomy.entryTypes?.[key];
    if (!item) errors.push(`entryTypes.${key} 缺失`);
    else {
      if (!isBilingual(item.label)) errors.push(`entryTypes.${key}.label 需要中英双语`);
      if (!isBilingual(item.description)) errors.push(`entryTypes.${key}.description 需要中英双语`);
    }
  }
  for (const key of VERIFICATION_STATUSES) {
    const item = data.taxonomy.verification?.[key];
    if (!item) errors.push(`verification.${key} 缺失`);
    else {
      if (!isBilingual(item.label)) errors.push(`verification.${key}.label 需要中英双语`);
      if (!isBilingual(item.description)) errors.push(`verification.${key}.description 需要中英双语`);
    }
  }
  for (const key of TIERS) {
    const item = data.taxonomy.tiers?.[key];
    if (!item) errors.push(`tiers.${key} 缺失`);
    else if (!isBilingual(item.label) || !isBilingual(item.description)) {
      errors.push(`tiers.${key} 需要中英 label 与 description`);
    }
  }
  for (const key of PRICING_STATUSES) {
    if (!data.taxonomy.pricing?.[key] || !isBilingual(data.taxonomy.pricing[key].label)) {
      errors.push(`pricing.${key} 需要双语 label`);
    }
  }
  for (const key of PLATFORMS) {
    if (!data.taxonomy.platforms?.[key] || !isBilingual(data.taxonomy.platforms[key].label)) {
      errors.push(`platforms.${key} 需要双语 label`);
    }
  }
  for (const key of [...LANGUAGE_CODES, 'zh-en']) {
    if (!data.taxonomy.languages?.[key] || !isBilingual(data.taxonomy.languages[key].label)) {
      errors.push(`languages.${key} 需要双语 label`);
    }
  }
  for (const key of PREFERENCES) {
    if (!data.taxonomy.familyPreferences?.[key] || !isBilingual(data.taxonomy.familyPreferences[key].label)) {
      errors.push(`familyPreferences.${key} 需要双语 label`);
    }
  }
}

function checkCategories(data, errors) {
  if (!Array.isArray(data.categories) || data.categories.length === 0) {
    errors.push('categories 不能为空');
    return;
  }
  const ids = new Set();
  for (const category of data.categories) {
    if (!isNonEmptyString(category.id)) errors.push('分类缺少 id');
    if (ids.has(category.id)) errors.push(`分类 id 重复：${category.id}`);
    ids.add(category.id);
    if (!CATEGORY_ICONS.includes(category.icon)) errors.push(`分类 ${category.id} 的 icon 无效：${category.icon}`);
    if (!isBilingual(category.name)) errors.push(`分类 ${category.id} 需要双语 name`);
    if (!isBilingual(category.description)) errors.push(`分类 ${category.id} 需要双语 description`);
  }
  if (data.categories[0]?.id !== 'all') errors.push('categories 第一项必须是 all');
  if (!ids.has('liked')) errors.push('categories 必须包含 liked');
  for (const id of ['chinese', 'english', 'music', 'keyboard', 'animals', 'art', 'sensory']) {
    if (!ids.has(id)) errors.push(`categories 缺少 ${id}`);
  }
  const validIds = new Set(data.categories.map((category) => category.id));
  for (const resource of data.resources || []) {
    for (const categoryId of resource.categories || []) {
      if (!validIds.has(categoryId)) errors.push(`${resource.id} 使用了无效分类：${categoryId}`);
      if (categoryId === 'all' || categoryId === 'liked') {
        errors.push(`${resource.id} 不能把派生分类 ${categoryId} 写入 categories`);
      }
    }
  }
}

function checkResource(resource, seenIds, errors) {
  const at = (field) => `${resource.id || '(无 id)'}.${field}`;
  if (!isNonEmptyString(resource.id) || !/^[a-z0-9-]+$/.test(resource.id)) {
    errors.push(`${at('id')} 必须是 kebab-case 小写 id`);
  }
  if (resource.id && seenIds.has(resource.id)) errors.push(`资源 id 重复：${resource.id}`);
  if (resource.id) seenIds.add(resource.id);

  if (!isBilingual(resource.name)) errors.push(`${at('name')} 需要中英双语`);
  if (!isBilingual(resource.summary)) errors.push(`${at('summary')} 需要中英双语`);

  if (!Array.isArray(resource.categories) || resource.categories.length === 0) {
    errors.push(`${at('categories')} 至少一个分类`);
  }
  if (new Set(resource.categories || []).size !== (resource.categories || []).length) {
    errors.push(`${at('categories')} 不能重复`);
  }
  if ((resource.categories || []).some((id) => id === 'chinese' || id === 'english') && !isBilingual(resource.learningFocus)) {
    errors.push(`${at('learningFocus')} 中文/英文启蒙分类必须写明确的学习重点`);
  }
  if (resource.learningFocus && !isBilingual(resource.learningFocus)) {
    errors.push(`${at('learningFocus')} 若存在必须中英双语`);
  }

  if (!Array.isArray(resource.contentLanguages) || resource.contentLanguages.length === 0) {
    errors.push(`${at('contentLanguages')} 至少一种语言`);
  }
  for (const code of resource.contentLanguages || []) {
    if (!LANGUAGE_CODES.includes(code)) errors.push(`${at('contentLanguages')} 含无效语言：${code}`);
  }
  if ((resource.contentLanguages || []).includes('none') && resource.contentLanguages.length > 1) {
    errors.push(`${at('contentLanguages')} 的 none 必须单独出现`);
  }
  if (!Array.isArray(resource.platforms) || resource.platforms.length === 0) {
    errors.push(`${at('platforms')} 至少一个平台`);
  }
  for (const platform of resource.platforms || []) {
    if (!PLATFORMS.includes(platform)) errors.push(`${at('platforms')} 含无效平台：${platform}`);
  }

  if (!ENTRY_TYPES.includes(resource.entryType)) errors.push(`${at('entryType')} 无效：${resource.entryType}`);
  if (!isHttpsUrl(resource.officialUrl)) errors.push(`${at('officialUrl')} 必须是 https URL`);
  if (resource.playUrl !== null && !isHttpsUrl(resource.playUrl)) errors.push(`${at('playUrl')} 必须是 https URL 或 null`);
  if (resource.demoUrl !== null && !isHttpsUrl(resource.demoUrl)) errors.push(`${at('demoUrl')} 必须是 https URL 或 null`);
  if (resource.entryType === 'play_web' && !resource.playUrl) errors.push(`${at('playUrl')} play_web 必须有直接网页入口`);
  if (resource.entryType !== 'play_web' && resource.playUrl) {
    errors.push(`${at('playUrl')} 只有 play_web 才能有直接游玩入口`);
  }
  if (resource.entryType === 'source' && resource.platforms?.includes('web') && resource.playUrl) {
    errors.push(`${at('playUrl')} 源码项目不得伪装成网页直达`);
  }

  if (!PRICING_STATUSES.includes(resource.pricing?.status)) errors.push(`${at('pricing.status')} 无效`);
  if (!isBilingual(resource.pricing?.note)) errors.push(`${at('pricing.note')} 需要中英双语`);

  const verification = resource.verification;
  if (!VERIFICATION_STATUSES.includes(verification?.status)) errors.push(`${at('verification.status')} 无效`);
  if (!isBilingual(verification?.device)) errors.push(`${at('verification.device')} 需要中英双语`);
  if (!isIsoDate(verification?.checkedAt)) errors.push(`${at('verification.checkedAt')} 需要 YYYY-MM-DD`);
  if (!isBilingual(verification?.observations)) errors.push(`${at('verification.observations')} 需要中英双语`);
  if (!Array.isArray(verification?.issues)) errors.push(`${at('verification.issues')} 必须是数组`);
  for (const issue of verification?.issues || []) {
    if (!isBilingual(issue)) errors.push(`${at('verification.issues')} 每条需要中英双语`);
  }
  if (verification?.status === 'issue_reported' && (verification.issues || []).length === 0) {
    errors.push(`${at('verification.issues')} 有异常记录时必须写出至少一条`);
  }

  if (!PREFERENCES.includes(resource.familyPreference)) errors.push(`${at('familyPreference')} 无效`);
  if (!TIERS.includes(resource.tier)) errors.push(`${at('tier')} 无效`);
  if (resource.tier === 'featured' && resource.familyPreference !== 'liked') {
    errors.push(`${at('familyPreference')} 精选条目必须有明确家庭正面反馈`);
  }
  if (!isBilingual(resource.ageEvidence?.parentGuidance)) errors.push(`${at('ageEvidence.parentGuidance')} 需要中英双语`);
  if (resource.ageEvidence?.providerClaim !== null && !isBilingual(resource.ageEvidence?.providerClaim)) {
    errors.push(`${at('ageEvidence.providerClaim')} 需要中英双语或 null`);
  }

  if (resource.media?.type !== 'original-illustration') errors.push(`${at('media.type')} 必须是 original-illustration`);
  if (!isNonEmptyString(resource.media?.emoji) || !isNonEmptyString(resource.media?.accent)) {
    errors.push(`${at('media')} 需要 emoji 与 accent`);
  }
  if (!isNonEmptyString(resource.media?.theme) || !resource.media.theme.includes('linear-gradient')) {
    errors.push(`${at('media.theme')} 需要 linear-gradient 主题`);
  }

  if (!Array.isArray(resource.sourceEvidence) || resource.sourceEvidence.length === 0) {
    errors.push(`${at('sourceEvidence')} 至少一条来源`);
  }
  for (const source of resource.sourceEvidence || []) {
    if (!isNonEmptyString(source.label)) errors.push(`${at('sourceEvidence.label')} 不能为空`);
    if (!isHttpsUrl(source.url)) errors.push(`${at('sourceEvidence.url')} 必须是 https URL`);
  }
}

function checkEditorialRules(data, errors) {
  const byId = new Map(data.resources.map((resource) => [resource.id, resource]));
  const lucas = byId.get('lucas');
  if (!lucas) errors.push('必须保留 lucas');
  else {
    if (lucas.tier !== 'featured') errors.push('lucas 必须是精选');
    if (lucas.familyPreference !== 'liked') errors.push('lucas 必须标记家庭喜欢');
    if (lucas.entryType !== 'store') errors.push('lucas 入口必须是官方商店');
    if (!lucas.officialUrl.includes('apps.microsoft.com')) errors.push('lucas 必须跳转官方商店');
  }

  const smash = byId.get('smash');
  if (!smash) errors.push('必须保留 smash');
  else {
    if (!smash.categories.includes('keyboard')) errors.push('BabySmash 必须归入随便敲键盘');
    if (smash.tier !== 'watch') errors.push('BabySmash 必须是观察层，不作为首推');
    if (smash.familyPreference !== 'neutral') errors.push('BabySmash 必须如实标记家庭兴趣一般');
  }

  for (const id of ['momo', 'tiny']) {
    const resource = byId.get(id);
    if (!resource) errors.push(`必须保留 ${id}`);
    else if (resource.tier !== 'watch') errors.push(`${id} 必须进入观察层`);
  }

  const english = data.resources.filter((resource) => resource.categories.includes('english'));
  if (english.length !== 1 || english[0].tier !== 'watch') {
    errors.push('英文启蒙当前只允许 Tiny Dino 一条观察库资源，避免把英文内容自动当成英语启蒙');
  }

  const serialized = JSON.stringify(data);
  if (serialized.includes('小芽')) errors.push('不得出现“小芽”品牌');
  if (/官方封面/.test(serialized)) errors.push('不得把占位插画称为官方封面');
  for (const pattern of [/0\s*[～~-]\s*1\s*岁/, /1\s*[～~-]\s*2\s*岁/, /2\s*[～~-]\s*3\s*岁/]) {
    if (pattern.test(serialized)) errors.push(`不得按更小年龄段细分：${pattern}`);
  }
}

export function validateData(data) {
  const errors = [];
  if (!data || typeof data !== 'object') return ['数据必须是对象'];
  if (data.meta?.schemaVersion !== 1) errors.push('meta.schemaVersion 必须为 1');
  if (!isNonEmptyString(data.meta?.version)) errors.push('meta.version 不能为空');
  if (!isHttpsUrl(data.meta?.repoUrl)) errors.push('meta.repoUrl 必须是 https URL');
  if (!isHttpsUrl(data.meta?.pagesUrl)) errors.push('meta.pagesUrl 必须是 https URL');
  if (!isBilingual(data.meta?.siteName)) errors.push('meta.siteName 需要中英双语');
  if (!isBilingual(data.meta?.tagline)) errors.push('meta.tagline 需要中英双语');
  if (!isIsoDate(data.meta?.auditedAt)) errors.push('meta.auditedAt 需要 YYYY-MM-DD');
  if (!isBilingual(data.meta?.ageScope)) errors.push('meta.ageScope 需要中英双语');
  if (!isBilingual(data.meta?.evidenceNotice)) errors.push('meta.evidenceNotice 需要中英双语');
  if (!isBilingual(data.meta?.illustrationNotice)) errors.push('meta.illustrationNotice 需要中英双语');

  checkTaxonomy(data, errors);

  if (!Array.isArray(data.resources)) {
    errors.push('resources 必须是数组');
    return errors;
  }
  if (data.resources.length !== EXPECTED_RESOURCE_COUNT) {
    errors.push(`资源数量必须为 ${EXPECTED_RESOURCE_COUNT}，当前 ${data.resources.length}`);
  }
  checkCategories(data, errors);

  const seenIds = new Set();
  for (const resource of data.resources) {
    checkResource(resource, seenIds, errors);
  }
  checkEditorialRules(data, errors);

  return [...new Set(errors)];
}

export function loadData(path = DATA_PATH) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const data = loadData();
  const errors = validateData(data);
  if (errors.length) {
    console.error(`✗ 数据校验失败（${errors.length} 项）：`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  const counts = data.resources.reduce((acc, resource) => {
    acc[resource.tier] = (acc[resource.tier] || 0) + 1;
    return acc;
  }, {});
  console.log(`✓ 数据校验通过：${data.resources.length} 条资源`);
  console.log(`  精选 ${counts.featured || 0} / 待验证 ${counts.candidate || 0} / 观察 ${counts.watch || 0}`);
  console.log(`  核查日期 ${data.meta.auditedAt}`);
}
