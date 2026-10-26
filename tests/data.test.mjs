import test from 'node:test';
import assert from 'node:assert/strict';
import { loadData, validateData } from '../tools/validate.mjs';
import {
  entryCanBeDirectPlay,
  entryHref,
  entryLabel,
  featuredOrder,
  languageProfile,
  selectResources,
  DEFAULT_STATE
} from '../assets/core.mjs';

const data = loadData();

test('数据契约校验无错误', () => {
  assert.deepEqual(validateData(data), []);
});

test('保留 14 条资源且 id 唯一', () => {
  assert.equal(data.resources.length, 14);
  assert.equal(new Set(data.resources.map((resource) => resource.id)).size, 14);
});

test('Lucas 是第一条精选，并跳转官方商店', () => {
  const order = featuredOrder(data, 'zh');
  assert.equal(order[0].id, 'lucas');
  assert.equal(order[0].tier, 'featured');
  assert.equal(order[0].familyPreference, 'liked');
  assert.equal(entryLabel(data, order[0], 'zh'), '查看商店');
  assert.match(entryHref(order[0]), /^https:\/\/apps\.microsoft\.com\//);
  assert.equal(entryCanBeDirectPlay(order[0]), false);
});

test('中文候选排在英文候选之前，观察层不因中文自动进入主推', () => {
  const order = featuredOrder(data, 'zh').map((resource) => resource.id);
  assert.equal(order[1], 'digital');
  assert.equal(order[2], 'foxy');
  assert.ok(order.indexOf('momo') > order.indexOf('daniel'));
  assert.ok(order.indexOf('momo') > order.indexOf('rhythm'));
});

test('BabySmash 在随便敲键盘分类、观察层，且偏好如实为兴趣一般', () => {
  const smash = data.resources.find((resource) => resource.id === 'smash');
  assert.ok(smash.categories.includes('keyboard'));
  assert.equal(smash.tier, 'watch');
  assert.equal(smash.familyPreference, 'neutral');
  assert.equal(entryLabel(data, smash, 'zh'), '查看官方页面');
});

test('源码项目显示查看项目，且不是直接游玩入口', () => {
  for (const id of ['keyboardsmash', 'keysplash']) {
    const resource = data.resources.find((item) => item.id === id);
    assert.equal(entryLabel(data, resource, 'zh'), '查看项目');
    assert.equal(entryCanBeDirectPlay(resource), false);
    assert.match(entryHref(resource), /^https:\/\/github\.com\//);
  }
});

test('中文启蒙与英文启蒙都有学习重点，且不是按内容语言自动归类', () => {
  const chinese = data.resources.filter((resource) => resource.categories.includes('chinese'));
  const english = data.resources.filter((resource) => resource.categories.includes('english'));
  assert.ok(chinese.length >= 3);
  assert.equal(english.length, 1);
  for (const resource of [...chinese, ...english]) {
    assert.ok(resource.learningFocus?.zh);
    assert.ok(resource.learningFocus?.en);
  }
  assert.equal(english[0].id, 'tiny');
  assert.equal(english[0].tier, 'watch');
});

test('内容语言支持多语言数组与无语言要求', () => {
  const foxy = data.resources.find((resource) => resource.id === 'foxy');
  assert.equal(languageProfile(foxy.contentLanguages), 'zh-en');
  const rhythm = data.resources.find((resource) => resource.id === 'rhythm');
  assert.equal(languageProfile(rhythm.contentLanguages), 'none');
});

test('英文界面入口标签同样区分四类入口', () => {
  const labels = data.resources.map((resource) => entryLabel(data, resource, 'en'));
  for (const expected of ['Play on web', 'View store', 'View project', 'Official page']) {
    assert.ok(labels.includes(expected), `缺少英文入口标签：${expected}`);
  }
});

test('默认筛选返回全部 14 条', () => {
  const list = selectResources(data, { ...DEFAULT_STATE }, 'zh');
  assert.equal(list.length, 14);
});
