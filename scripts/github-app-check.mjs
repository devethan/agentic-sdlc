import { createSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const envFile = ".env.local";

if (existsSync(envFile)) {
  const lines = readFileSync(envFile, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
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
    console.error(`Create ${envFile} or set the value in your shell environment.`);
    process.exit(1);
  }
}

const appId = process.env.GITHUB_APP_ID;
const installationId = process.env.GITHUB_INSTALLATION_ID;
const privateKey = readFileSync(process.env.GITHUB_PRIVATE_KEY_PATH, "utf8");
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const pullNumber = process.argv[2];

function base64Url(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function createJwt() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iat: now - 60,
    exp: now + 9 * 60,
    iss: appId,
  };
  const unsignedToken = `${base64Url(header)}.${base64Url(payload)}`;
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
    const message = body?.message ?? response.statusText;
    throw new Error(`${options.method ?? "GET"} ${path} failed: ${response.status} ${message}`);
  }

  return body;
}

async function main() {
  const jwt = createJwt();
  console.log("Created GitHub App JWT");

  const tokenResponse = await github(`/app/installations/${installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const token = tokenResponse.token;
  console.log("Created installation access token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const repository = await github(`/repos/${owner}/${repo}`, {
    headers: authHeaders,
  });

  console.log(`Repository access OK: ${repository.full_name}`);

  if (!pullNumber) {
    console.log("PR check skipped. Pass a PR number as the first argument to check PR access.");
    return;
  }

  const pull = await github(`/repos/${owner}/${repo}/pulls/${pullNumber}`, {
    headers: authHeaders,
  });
  const files = await github(`/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
    headers: authHeaders,
  });

  console.log(`PR access OK: #${pull.number} ${pull.title}`);
  console.log(`Changed files: ${files.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
