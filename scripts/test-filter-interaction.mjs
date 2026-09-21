import { execFileSync } from "node:child_process";

// Run against a built preview: node scripts/test-filter-interaction.mjs <preview URL>
const url = process.argv[2];
if (!url) throw new Error("Supply the URL of a running preview");
const session = `filters-${process.pid}`;
function browser(...args) {
  return execFileSync("agent-browser", ["--session", session, ...args], {
    encoding: "utf8",
    timeout: 15000,
  });
}
function expect(count, open) {
  browser("eval", `(() => {
    const count = document.querySelectorAll('tbody tr:not([hidden])').length;
    if (count !== ${count}) throw Error('Expected ${count} results, got ' + count);
    if (${JSON.stringify(open)} && !document.getElementById(${JSON.stringify(open)}).open) throw Error('Menu closed during label click');
    return 'passed';
  })()`);
}
try {
  browser("open", url);
  browser("click", "#tags summary");
  // Click the label text, not the checkbox. Closing on focusout here can hang Chromium.
  browser("click", '#tags label:has(input[value="Scale and statistics"]) span');
  expect(5, "tags");
  browser("click", '#tags label:has(input[value="Positive welfare"]) span');
  expect(14, "tags");
  browser("click", '#tags label:has(input[value="Scale and statistics"]) span');
  expect(9, "tags");
  browser("click", "#license summary");
  browser("click", '#license label:has(input[value="open"]) span');
  expect(3, "license");
  browser("click", '#license label:has(input[value="mixed"]) span');
  expect(6, "license");
  browser("press", "Escape");
  browser("eval", `(() => {
    if (document.getElementById('license').open || document.activeElement !== document.querySelector('#license summary')) throw Error('Escape failed');
  })()`);
  browser("click", "#clear");
  expect(63, "");
  console.log("PASS: label clicks, repeated selection, cross-filter results, Escape, and reset");
} finally {
  browser("close");
}
