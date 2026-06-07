import { createSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const envFile = ".env.local";

if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

const requiredEnv = [
  "GITHUB_APP_ID",
  "GITHUB_INSTALLATION_ID",
  "GITHUB_PRIVATE_KEY_PATH",
  "GITHUB_OWNER",
  "GITHUB_REPO",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required env: ${key}`);
    process.exit(1);
  }
}

const privateKey = readFileSync(process.env.GITHUB_PRIVATE_KEY_PATH, "utf8");
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

function base64UrlJson(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function createJwt() {
  const now = Math.floor(Date.now() / 1000);
  const unsignedToken = [
    base64UrlJson({ alg: "RS256", typ: "JWT" }),
    base64UrlJson({
      iat: now - 60,
      exp: now + 9 * 60,
      iss: process.env.GITHUB_APP_ID,
    }),
  ].join(".");

  const signature = createSign("RSA-SHA256")
    .update(unsignedToken)
    .sign(privateKey, "base64url");

  return `${unsignedToken}.${signature}`;
}

async function github(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed: ${response.status} ${body?.message ?? response.statusText}`);
  }

  return body;
}

async function getInstallationToken() {
  const jwt = createJwt();
  const response = await github(`/app/installations/${process.env.GITHUB_INSTALLATION_ID}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  return response.token;
}

function findFirstAddedLine(files) {
  for (const file of files) {
    if (!file.patch) continue;

    let newLine = 0;
    for (const patchLine of file.patch.split("\n")) {
      const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(patchLine);
      if (hunk) {
        newLine = Number(hunk[1]);
        continue;
      }

      if (patchLine.startsWith("+") && !patchLine.startsWith("+++")) {
        return {
          path: file.filename,
          line: newLine,
        };
      }

      if (!patchLine.startsWith("-")) {
        newLine += 1;
      }
    }
  }

  return null;
}

async function main() {
  const pullNumber = Number(process.argv[2]);
  if (!Number.isInteger(pullNumber) || pullNumber <= 0) {
    throw new Error("Usage: node scripts/github-app-review-pr.mjs <PR_NUMBER>");
  }

  const token = await getInstallationToken();
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const pull = await github(`/repos/${owner}/${repo}/pulls/${pullNumber}`, {
    headers: authHeaders,
  });
  const files = await github(`/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
    headers: authHeaders,
  });
  const target = findFirstAddedLine(files);

  if (!target) {
    throw new Error("Could not find an added line in the PR diff.");
  }

  const review = await github(`/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      commit_id: pull.head.sha,
      body: "GitHub App line-review connectivity test from local agent.",
      event: "COMMENT",
      comments: [
        {
          path: target.path,
          line: target.line,
          side: "RIGHT",
          body: "Line-level review connectivity test from the local GitHub App agent.",
        },
      ],
    }),
  });

  console.log(`Created PR review: ${review.html_url}`);
  console.log(`Commented on ${target.path}:${target.line}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
