/**
 * Pure data helpers shared by the browser app, the README generator and the tests.
 * Keep this file free of DOM access so both Node and the browser can import it.
 */

export const DEFAULT_STATE = Object.freeze({
  locale: 'zh',
  category: 'all',
  platform: 'all',
  language: 'all',
  verification: 'all',
  search: '',
  layout: 'list',
  sort: 'featured'
});

const TIER_WEIGHT = { featured: 300, candidate: 200, watch: 100 };
const VERIFICATION_WEIGHT = {
  family_tested: 5,
  agent_tested: 4,
  developer_claimed: 3,
  pending: 2,
  issue_reported: 1
};
const FAMILY_WEIGHT = { liked: 20, unknown: 0, neutral: -10 };

export function pick(value, locale = 'zh') {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[locale] || value.zh || value.en || '';
}

export function categoryById(categories, id) {
  return categories.find((category) => category.id === id) || categories[0];
}

export function languageProfile(codes) {
  const list = Array.isArray(codes) ? codes : [];
  const hasZh = list.includes('zh');
  const hasEn = list.includes('en');
  if (hasZh && hasEn) return 'zh-en';
  if (hasZh) return 'zh';
  if (hasEn) return 'en';
  return 'none';
}

export function languageSearchable(codes) {
  return languageProfile(codes);
}

export function languageLabel(data, codes, locale = 'zh') {
  const profile = languageProfile(codes);
  return pick(data.taxonomy.languages[profile].label, locale);
}

export function platformLabel(data, platform, locale = 'zh') {
  return pick(data.taxonomy.platforms[platform].label, locale);
}

export function verificationLabel(data, status, locale = 'zh') {
  return pick(data.taxonomy.verification[status].label, locale);
}

export function verificationDescription(data, status, locale = 'zh') {
  return pick(data.taxonomy.verification[status].description, locale);
}

export function tierLabel(data, tier, locale = 'zh') {
  return pick(data.taxonomy.tiers[tier].label, locale);
}

export function tierDescription(data, tier, locale = 'zh') {
  return pick(data.taxonomy.tiers[tier].description, locale);
}

export function preferenceLabel(data, preference, locale = 'zh') {
  return pick(data.taxonomy.familyPreferences[preference].label, locale);
}

export function pricingLabel(data, status, locale = 'zh') {
  return pick(data.taxonomy.pricing[status].label, locale);
}

export function entryLabel(data, resource, locale = 'zh') {
  return pick(data.taxonomy.entryTypes[resource.entryType].label, locale);
}

export function entryDescription(data, resource, locale = 'zh') {
  return pick(data.taxonomy.entryTypes[resource.entryType].description, locale);
}

export function entryHref(resource) {
  if (resource.entryType === 'play_web' && resource.playUrl) return resource.playUrl;
  return resource.officialUrl;
}

export function entryCanBeDirectPlay(resource) {
  return resource.entryType === 'play_web' && Boolean(resource.playUrl);
}

export function inCategory(resource, categoryId) {
  if (categoryId === 'all') return true;
  if (categoryId === 'liked') return resource.familyPreference === 'liked';
  return resource.categories.includes(categoryId);
}

export function categoryCount(resources, categoryId) {
  return resources.filter((resource) => inCategory(resource, categoryId)).length;
}

export function normalizeText(value) {
  return String(value || '')
    .toLocaleLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchText(data, resource) {
  const categoryWords = resource.categories.flatMap((id) => {
    const category = data.categories.find((item) => item.id === id);
    return category ? [category.name.zh, category.name.en] : [];
  });
  const platformWords = resource.platforms.flatMap((id) => [
    data.taxonomy.platforms[id].label.zh,
    data.taxonomy.platforms[id].label.en
  ]);
  return normalizeText([
    resource.id,
    resource.name.zh,
    resource.name.en,
    resource.summary.zh,
    resource.summary.en,
    resource.learningFocus?.zh,
    resource.learningFocus?.en,
    ...categoryWords,
    ...platformWords,
    entryLabel(data, resource, 'zh'),
    entryLabel(data, resource, 'en'),
    tierLabel(data, resource.tier, 'zh'),
    tierLabel(data, resource.tier, 'en')
  ].filter(Boolean).join(' '));
}

export function matchesLanguage(resource, filter) {
  if (filter === 'all') return true;
  const profile = languageProfile(resource.contentLanguages);
  if (filter === 'zh') return profile === 'zh' || profile === 'zh-en';
  if (filter === 'en') return profile === 'en' || profile === 'zh-en';
  if (filter === 'zh-en') return profile === 'zh-en';
  if (filter === 'none') return profile === 'none';
  return true;
}

export function filterResources(data, state) {
  const query = normalizeText(state.search);
  return data.resources.filter((resource) => {
    if (!inCategory(resource, state.category)) return false;
    if (state.platform !== 'all' && !resource.platforms.includes(state.platform)) return false;
    if (!matchesLanguage(resource, state.language)) return false;
    if (state.verification !== 'all' && resource.verification.status !== state.verification) return false;
    if (query && !searchText(data, resource).includes(query)) return false;
    return true;
  });
}

function languageWeight(resource) {
  const profile = languageProfile(resource.contentLanguages);
  if (profile === 'zh') return 40;
  if (profile === 'zh-en') return 30;
  return 20;
}

function featuredWeight(resource) {
  return (TIER_WEIGHT[resource.tier] || 0)
    + languageWeight(resource)
    + (VERIFICATION_WEIGHT[resource.verification.status] || 0)
    + (FAMILY_WEIGHT[resource.familyPreference] || 0);
}

function compareName(a, b, locale) {
  return pick(a.name, locale).localeCompare(pick(b.name, locale), locale === 'zh' ? 'zh-CN' : 'en');
}

export function sortResources(list, mode = 'featured', locale = 'zh') {
  const copy = [...list];
  if (mode === 'name') {
    copy.sort((a, b) => compareName(a, b, locale) || a.id.localeCompare(b.id));
    return copy;
  }
  if (mode === 'chinese') {
    copy.sort((a, b) => {
      // The owner asked for Lucas to keep the first position on the home page.
      if (a.id === 'lucas') return -1;
      if (b.id === 'lucas') return 1;
      return (languageWeight(b) - languageWeight(a))
        || ((TIER_WEIGHT[b.tier] || 0) - (TIER_WEIGHT[a.tier] || 0))
        || ((VERIFICATION_WEIGHT[b.verification.status] || 0) - (VERIFICATION_WEIGHT[a.verification.status] || 0))
        || compareName(a, b, locale)
        || a.id.localeCompare(b.id);
    });
    return copy;
  }
  copy.sort((a, b) => {
    // Lucas is pinned first because the owner reported a clear positive family experience.
    if (a.id === 'lucas') return -1;
    if (b.id === 'lucas') return 1;
    return (featuredWeight(b) - featuredWeight(a))
      || compareName(a, b, locale)
      || a.id.localeCompare(b.id);
  });
  return copy;
}

export function selectResources(data, state, locale = state.locale || 'zh') {
  return sortResources(filterResources(data, state), state.sort, locale);
}

export function featuredOrder(data, locale = 'zh') {
  return sortResources(data.resources, 'featured', locale);
}

export function formatCount(template, count) {
  return String(template).replace('{n}', String(count));
}

export function activeFilterLabels(data, state, locale = 'zh') {
  const labels = [];
  if (state.category !== 'all') {
    labels.push(pick(categoryById(data.categories, state.category).name, locale));
  }
  if (state.platform !== 'all') {
    labels.push(platformLabel(data, state.platform, locale));
  }
  if (state.language !== 'all') {
    labels.push(pick(data.taxonomy.languages[state.language].label, locale));
  }
  if (state.verification !== 'all') {
    labels.push(verificationLabel(data, state.verification, locale));
  }
  return labels;
}

export function dataCounts(data) {
  return {
    total: data.resources.length,
    featured: data.resources.filter((resource) => resource.tier === 'featured').length,
    candidate: data.resources.filter((resource) => resource.tier === 'candidate').length,
    watch: data.resources.filter((resource) => resource.tier === 'watch').length
  };
}
