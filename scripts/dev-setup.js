const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const venv = path.join(root, '.venv');
const env = {
  ...process.env,
  UV_CACHE_DIR: process.env.UV_CACHE_DIR || path.join(root, '.uv-cache'),
  UV_INDEX_URL: process.env.UV_INDEX_URL || 'https://pypi.tuna.tsinghua.edu.cn/simple',
  NPM_CONFIG_REGISTRY: process.env.NPM_CONFIG_REGISTRY || 'https://registry.npmmirror.com'
};

console.log('[setup] Checking environment...');

// 1. Setup Python environment with uv
try {
  if (!fs.existsSync(venv)) {
    console.log('[setup] Creating Python virtual environment with uv...');
  }
  console.log('[setup] Syncing Python dependencies with uv...');
  execSync('uv sync --python 3.11 --all-groups', { stdio: 'inherit', cwd: root, env });
} catch (e) {
  console.error('[setup] Failed to setup Python environment:', e.message);
}

// 2. Setup Frontend dependencies if missing
const frontendModules = path.join(root, 'frontend', 'node_modules');
if (!fs.existsSync(frontendModules)) {
  console.log('[setup] Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(root, 'frontend'), env });
}

console.log('[setup] Done.');
