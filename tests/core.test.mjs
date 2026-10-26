import test from 'node:test';
import assert from 'node:assert/strict';
import { loadData } from '../tools/validate.mjs';
import {
  activeFilterLabels,
  categoryCount,
  dataCounts,
  filterResources,
  formatCount,
  matchesLanguage,
  normalizeText,
  selectResources,
  sortResources,
  DEFAULT_STATE
} from '../assets/core.mjs';

const data = loadData();
const ids = (list) => list.map((resource) => resource.id);

test('分类筛选：家庭喜欢只有 Lucas', () => {
  assert.deepEqual(ids(filterResources(data, { ...DEFAULT_STATE, category: 'liked' })), ['lucas']);
});

test('分类筛选：随便敲键盘 3 条且包含 BabySmash', () => {
  const result = ids(filterResources(data, { ...DEFAULT_STATE, category: 'keyboard' }));
  assert.equal(result.length, 3);
  assert.ok(result.includes('smash'));
  assert.equal(categoryCount(data.resources, 'keyboard'), 3);
});

test('分类筛选：中文启蒙包含 Digital、Foxy、Momo', () => {
  const result = ids(filterResources(data, { ...DEFAULT_STATE, category: 'chinese' }));
  assert.deepEqual(new Set(result), new Set(['digital', 'foxy', 'momo']));
});

test('内容语言筛选不会把界面语言混进资源语言', () => {
  const zh = ids(filterResources(data, { ...DEFAULT_STATE, language: 'zh' }));
  assert.deepEqual(new Set(zh), new Set(['digital', 'foxy', 'momo']));
  const both = ids(filterResources(data, { ...DEFAULT_STATE, language: 'zh-en' }));
  assert.deepEqual(both, ['foxy']);
  const none = ids(filterResources(data, { ...DEFAULT_STATE, language: 'none' }));
  assert.deepEqual(new Set(none), new Set(['rhythm', 'keysplash', 'keyboardsmash', 'smash']));
});

test('平台筛选：Windows 条目包含商店与源码项目', () => {
  const result = ids(filterResources(data, { ...DEFAULT_STATE, platform: 'windows' }));
  assert.ok(result.includes('lucas'));
  assert.ok(result.includes('colors'));
  assert.ok(result.includes('keyboardsmash'));
  assert.ok(!result.includes('daniel'));
});

test('验证状态筛选：有异常记录 5 条', () => {
  const result = ids(filterResources(data, { ...DEFAULT_STATE, verification: 'issue_reported' }));
  assert.deepEqual(new Set(result), new Set(['foxy', 'digital', 'daniel', 'rhythm', 'momo']));
});

test('搜索支持英文名称、中文分类与大小写', () => {
  assert.deepEqual(ids(filterResources(data, { ...DEFAULT_STATE, search: 'BabySmash' })), ['smash']);
  assert.deepEqual(ids(filterResources(data, { ...DEFAULT_STATE, search: 'LUCAS' })), ['lucas']);
  const keyboard = ids(filterResources(data, { ...DEFAULT_STATE, search: '随便敲键盘' }));
  assert.deepEqual(new Set(keyboard), new Set(['smash', 'keyboardsmash', 'keysplash']));
});

test('搜索空白不会误伤结果', () => {
  assert.equal(filterResources(data, { ...DEFAULT_STATE, search: '   ' }).length, 14);
  assert.equal(normalizeText('  Lucas   Baby  '), 'lucas baby');
});

test('排序：精选、中文优先、名称排序结果稳定', () => {
  const featured = ids(sortResources(data.resources, 'featured', 'zh'));
  assert.equal(featured[0], 'lucas');
  assert.equal(featured.length, 14);

  const chinese = ids(sortResources(data.resources, 'chinese', 'zh'));
  assert.equal(chinese[0], 'lucas');
  const firstFour = chinese.slice(0, 4);
  assert.ok(firstFour.includes('digital'));
  assert.ok(firstFour.includes('foxy'));
  assert.ok(firstFour.includes('momo'));

  const byName = sortResources(data.resources, 'name', 'en');
  const names = byName.map((resource) => resource.name.en.toLowerCase());
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, 'en')));
});

test('筛选与排序组合：中文 + 网页 + 有异常记录', () => {
  const result = selectResources(data, {
    ...DEFAULT_STATE,
    language: 'zh',
    platform: 'web',
    verification: 'issue_reported'
  }, 'zh');
  assert.deepEqual(new Set(ids(result)), new Set(['digital', 'foxy', 'momo']));
});

test('语言匹配规则：中英条目同时出现在中文和英文筛选', () => {
  const foxy = data.resources.find((resource) => resource.id === 'foxy');
  assert.equal(matchesLanguage(foxy, 'zh'), true);
  assert.equal(matchesLanguage(foxy, 'en'), true);
  assert.equal(matchesLanguage(foxy, 'zh-en'), true);
  const daniel = data.resources.find((resource) => resource.id === 'daniel');
  assert.equal(matchesLanguage(daniel, 'zh'), false);
});

test('筛选标签与计数', () => {
  const labels = activeFilterLabels(data, {
    ...DEFAULT_STATE,
    category: 'keyboard',
    platform: 'windows',
    language: 'none',
    verification: 'pending'
  }, 'zh');
  assert.deepEqual(labels, ['随便敲键盘', 'Windows 应用', '无语言要求', '待验证']);
  assert.equal(formatCount('共 {n} 条', 3), '共 3 条');
  const counts = dataCounts(data);
  assert.deepEqual(counts, { total: 14, featured: 1, candidate: 10, watch: 3 });
});
