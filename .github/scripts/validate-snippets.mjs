import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const snippetsPath = fileURLToPath(
  new URL("../../.vscode/github-actions.code-snippets", import.meta.url),
);
const readmePath = fileURLToPath(new URL("../../README.md", import.meta.url));
const repositoryPath = fileURLToPath(new URL("../../", import.meta.url));
const source = readFileSync(snippetsPath, "utf8");
const readme = readFileSync(readmePath, "utf8");
const snippets = JSON.parse(source);
const entries = Object.entries(snippets);

assert.equal(entries.length, 42, "Unexpected snippet count");

const prefixes = new Set();
const expandedBodies = new Map();

function expandDefaults(lines) {
  const values = new Map();
  let expanded = lines.join("\n");

  expanded = expanded.replace(
    /\$\{(\d+)\|([^}]*)\|\}/g,
    (_match, index, choices) => {
      const value = choices.split(",")[0];
      values.set(Number(index), value);
      return value;
    },
  );
  expanded = expanded.replace(
    /\$\{(\d+):([^}]*)}/g,
    (_match, index, value) => {
      values.set(Number(index), value);
      return value;
    },
  );
  expanded = expanded.replace(/\$\{(\d+)}/g, (_match, index) => {
    return values.get(Number(index)) ?? "";
  });
  expanded = expanded.replace(/\$(\d+)/g, (_match, index) => {
    return values.get(Number(index)) ?? "";
  });

  return expanded.replaceAll("\\$", "$");
}

for (const [name, snippet] of entries) {
  assert.equal(typeof snippet.prefix, "string", `${name}: prefix must be a string`);
  assert.match(snippet.prefix, /^gha-/, `${name}: prefix must start with gha-`);
  assert(!prefixes.has(snippet.prefix), `Duplicate prefix: ${snippet.prefix}`);
  prefixes.add(snippet.prefix);

  assert(Array.isArray(snippet.body), `${name}: body must be an array`);
  assert(snippet.body.length > 0, `${name}: body must not be empty`);
  assert(
    snippet.body.every((line) => typeof line === "string"),
    `${name}: every body line must be a string`,
  );
  assert.equal(
    typeof snippet.description,
    "string",
    `${name}: description must be a string`,
  );
  assert(
    snippet.scope.split(",").includes("yaml"),
    `${name}: scope must include yaml`,
  );

  const body = snippet.body.join("\n");
  assert(
    !snippet.body.includes("permissions:"),
    `${name}: permissions must be scoped to a job`,
  );
  const definitions = [
    ...body.matchAll(/\$\{(\d+)(?=[:|}])/g),
  ].map((match) => Number(match[1]));
  if (definitions.length > 0) {
    const defined = new Set(definitions);
    const maximum = Math.max(...defined);
    for (let index = 1; index <= maximum; index += 1) {
      assert(defined.has(index), `${name}: missing placeholder definition ${index}`);
    }
  }

  const unescapedShellVariables = [
    ...body.matchAll(/(?<!\\)\$([A-Za-z_][A-Za-z0-9_]*)/g),
  ];
  assert.equal(
    unescapedShellVariables.length,
    0,
    `${name}: literal shell variables must escape the dollar sign`,
  );

  assert(
    readme.includes(`\`${snippet.prefix}\``),
    `README is missing ${snippet.prefix}`,
  );

  const expanded = expandDefaults(snippet.body);
  assert.doesNotMatch(
    expanded,
    /\$\{?\d/,
    `${name}: default expansion contains an unresolved tabstop`,
  );
  assert.equal(
    expanded.match(/\$\{\{/g)?.length ?? 0,
    expanded.match(/}}/g)?.length ?? 0,
    `${name}: default expansion contains an unbalanced GitHub expression`,
  );
  expandedBodies.set(name, expanded);
}

const forbiddenValues = [/\busing: node20\b/];
for (const forbidden of forbiddenValues) {
  assert(!forbidden.test(source), `Stale value matched ${forbidden}`);
}

for (const expected of [
  "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
  "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
  "actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9",
  "actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a",
  "actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c",
  "using: node24",
]) {
  assert(source.includes(expected), `Missing current value: ${expected}`);
}

function repositoryTextFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }

    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...repositoryTextFiles(path));
    } else if (/\.(?:c?js|mjs|tsx?|json|code-snippets|md|ya?ml)$/i.test(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

for (const path of repositoryTextFiles(repositoryPath)) {
  const contents = readFileSync(path, "utf8");
  const references = contents.matchAll(
    /\bactions\/[A-Za-z0-9_./-]+@([^\s"'`},]+)/g,
  );
  for (const reference of references) {
    assert.match(
      reference[1],
      /^[0-9a-f]{40}$/,
      `${relative(repositoryPath, path)}: ${reference[0]} must use a full commit SHA`,
    );
  }
}

const branding = snippets["GitHub Actions - Action - Branding"].body;
const colors = branding[1].match(/\$\{1\|(.+)\|}/)?.[1].split(",");
const icons = branding[2].match(/\$\{2\|(.+)\|}/)?.[1].split(",");
assert.deepEqual(colors, [
  "white",
  "black",
  "yellow",
  "blue",
  "green",
  "orange",
  "red",
  "purple",
  "gray-dark",
]);
assert.equal(icons.length, 257, "Branding icon list is incomplete");
assert.equal(new Set(icons).size, icons.length, "Branding icons must be unique");

const composite = snippets["GitHub Actions - Composite Action"].body.join("\n");
assert.match(composite, /value: \$\{\{ steps\.\$\{10:step_id}\.outputs\.result }}/);
assert.match(composite, /id: \$10/);
assert.match(composite, /result=.*GITHUB_OUTPUT/);
assert(!composite.includes("actions/checkout"), "Composite action must not alter checkout state");

const expandedComposite = expandedBodies.get("GitHub Actions - Composite Action");
assert.match(expandedComposite, /value: \$\{\{ steps\.step_id\.outputs\.result }}/);
assert.match(expandedComposite, /id: step_id/);
assert.match(expandedComposite, /echo "result=\$INPUT_VALUE" >> "\$GITHUB_OUTPUT"/);

const oidcPermissions = expandedBodies.get(
  "GitHub Actions - Workflow Job Permissions - OIDC",
);
assert.match(oidcPermissions, /contents: read/);
assert.match(oidcPermissions, /id-token: write/);

const reusableOutput = expandedBodies.get(
  "GitHub Actions - Reusable Workflow - Output",
);
assert.match(
  reusableOutput,
  /value: \$\{\{ jobs\.producer\.outputs\.result }}/,
);

const selfHostedJob = expandedBodies.get(
  "GitHub Actions - Workflow Job - Self-Hosted Runner",
);
assert.match(selfHostedJob, /runs-on: \[self-hosted, linux, x64]/);

const containerJob = expandedBodies.get(
  "GitHub Actions - Workflow Job - Container",
);
assert.match(containerJob, /runs-on: ubuntu-latest/);
assert.match(containerJob, /container:\n      image: node:24/);

console.log(`Validated ${entries.length} GitHub Actions snippets.`);
