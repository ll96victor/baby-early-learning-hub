#!/usr/bin/env node
/**
 * Generate the README resource table from the same data/resources.json
 * that the website loads. Run `node tools/sync-readme.mjs` after editing data,
 * or `node tools/sync-readme.mjs --check` in CI/tests.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  entryHref,
  entryLabel,
  featuredOrder,
  languageLabel,
  pick,
  platformLabel,
  preferenceLabel,
  tierLabel,
  verificationLabel
} from '../assets/core.mjs';
import { loadData } from './validate.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const README_PATH = join(ROOT, 'README.md');
const START = '<!-- RESOURCE_TABLE_START -->';
const END = '<!-- RESOURCE_TABLE_END -->';

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function renderTable(data) {
  const rows = featuredOrder(data, 'zh').map((resource) => {
    const name = pick(resource.name, 'zh');
    return [
      `[${escapeCell(name)}](${entryHref(resource)})`,
      tierLabel(data, resource.tier, 'zh'),
      entryLabel(data, resource, 'zh'),
      languageLabel(data, resource.contentLanguages, 'zh'),
      resource.platforms.map((id) => platformLabel(data, id, 'zh')).join(' / '),
      verificationLabel(data, resource.verification.status, 'zh'),
      preferenceLabel(data, resource.familyPreference, 'zh')
    ].map(escapeCell);
  });

  return [
    `共 **${data.resources.length}** 条，数据核查日期 **${data.meta.auditedAt}**。`,
    '',
    '| 资源 | 分层 | 入口 | 内容语言 | 平台 | 验证状态 | 家庭偏好 |',
    '|---|---|---|---|---|---|---|',
    ...rows.map((row) => `| ${row.join(' | ')} |`)
  ].join('\n');
}

export function replaceBlock(readme, table) {
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`README 缺少 ${START} / ${END} 标记`);
  }
  return `${readme.slice(0, start + START.length)}\n${table}\n${readme.slice(end)}`;
}

function main() {
  const data = loadData();
  const check = process.argv.includes('--check');
  const current = readFileSync(README_PATH, 'utf8').replace(/\r\n/g, '\n');
  const next = replaceBlock(current, renderTable(data));

  if (check) {
    if (current !== next) {
      console.error('✗ README 资源清单与 data/resources.json 不同步，请运行 node tools/sync-readme.mjs');
      process.exit(1);
    }
    console.log('✓ README 资源清单与数据源一致');
    return;
  }

  if (current === next) {
    console.log('✓ README 已是最新，无需修改');
    return;
  }
  writeFileSync(README_PATH, next, 'utf8');
  console.log(`✓ 已更新 README 资源清单（${data.resources.length} 条）`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
