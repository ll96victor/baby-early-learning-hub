import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadData } from '../tools/validate.mjs';
import { renderTable } from '../tools/sync-readme.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8').replace(/\r\n/g, '\n');
const data = loadData();

function block() {
  const start = readme.indexOf('<!-- RESOURCE_TABLE_START -->');
  const end = readme.indexOf('<!-- RESOURCE_TABLE_END -->');
  assert.ok(start !== -1 && end > start, 'README 缺少资源清单标记');
  return readme.slice(start + '<!-- RESOURCE_TABLE_START -->'.length, end).trim();
}

test('README 资源清单与 data/resources.json 同源', () => {
  assert.equal(block(), renderTable(data).trim());
});

test('README 包含线上地址与仓库地址', () => {
  assert.ok(readme.includes(data.meta.pagesUrl));
  assert.ok(readme.includes(data.meta.repoUrl));
});

test('README 清单 14 行且 Lucas 第一', () => {
  const rows = block().split('\n').filter((line) => line.startsWith('| ['));
  assert.equal(rows.length, 14);
  assert.ok(rows[0].includes('Lucas Baby Games'));
});

test('README 不含未授权品牌，并明确插画不是官方封面', () => {
  assert.ok(!readme.includes('小芽'));
  assert.ok(readme.includes('不是官方封面') || readme.includes('不是游戏官方截图'));
});

test('页面不依赖外部脚本或跟踪服务', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  assert.ok(!/<script[^>]+src=["']https?:/i.test(html), '不应从外部域名加载脚本');
  assert.ok(!/googletagmanager|google-analytics|baidu\.com\/hm\.js|clarity\.ms/i.test(html), '不应包含跟踪脚本');
  assert.ok(html.includes('./data/resources.json') || html.includes('./assets/app.js'));
});
