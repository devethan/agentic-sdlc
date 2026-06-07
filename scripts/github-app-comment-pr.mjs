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
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

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

async function main() {
  const token = await getInstallationToken();
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const pullNumberArg = process.argv[2];
  if (!pullNumberArg) {
    const pulls = await github(`/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=10`, {
      headers: authHeaders,
    });
    const mergedPull = pulls.find((pull) => pull.merged_at);

    if (!mergedPull) {
      console.log("No recently merged PR found.");
      return;
    }

    console.log(`Latest merged PR: #${mergedPull.number} ${mergedPull.title}`);
    console.log(`Run: node scripts/github-app-comment-pr.mjs ${mergedPull.number}`);
    return;
  }

  const pullNumber = Number(pullNumberArg);
  if (!Number.isInteger(pullNumber) || pullNumber <= 0) {
    throw new Error("First argument must be a PR number.");
  }

  const body = [
    "GitHub App connectivity test from local agent.",
    "",
    "This comment verifies that the installed GitHub App can write to PR conversations via REST API.",
  ].join("\n");

  const comment = await github(`/repos/${owner}/${repo}/issues/${pullNumber}/comments`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ body }),
  });

  console.log(`Created PR comment: ${comment.html_url}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
