# LumenX 使用 uv 安装与启动

> **文档职责**：提供一套面向新用户的安装、配置与启动主流程，让读者可以按顺序执行命令，把项目跑起来。
>
> **适用场景**：第一次在本地安装 LumenX，或希望使用 `uv` 管理 Python 环境，并需要一份按步骤执行的简明操作文档。
>
> **阅读目标**：读完后可以独立完成环境安装、正确填写 `.env`，并成功启动前后端访问项目页面。

本文档面向第一次接触本项目的新用户，目标是：

- 使用 `uv` 管理 Python 环境
- 使用仓库内已配置好的国内镜像安装依赖
- 按步骤完成 `.env` 配置
- 成功启动前后端服务
- 在遇到常见问题时能直接定位和处理

---

## 1. 开始前确认

先确认本机已有以下工具：

- **Python**: `3.11+`
- **uv**: 用于创建虚拟环境和同步 Python 依赖
- **Node.js**: `18+`
- **npm**
- **FFmpeg**: 用于视频处理

本次实际验证环境：

- Python `3.11.15`
- `uv 0.11.5`
- Node.js `v25.9.0`
- npm `11.12.1`
- FFmpeg `8.1`

本仓库已经提前写好了国内镜像配置，你不需要额外手工配置：

- Python `uv` 镜像已经写入 [pyproject.toml](/Users/admin/Downloads/Code/lumenx/pyproject.toml)
- 默认 Python 源为：`https://pypi.tuna.tsinghua.edu.cn/simple`
- npm 镜像已经写入：
  - [.npmrc](/Users/admin/Downloads/Code/lumenx/.npmrc)
  - [frontend/.npmrc](/Users/admin/Downloads/Code/lumenx/frontend/.npmrc)
- npm registry 为：`https://registry.npmmirror.com/`

也就是说，后面的安装命令直接执行即可。

---

## 2. 创建 Python 虚拟环境

进入项目根目录：

```bash
cd /Users/admin/Downloads/Code/lumenx
```

创建 `.venv`：

```bash
uv venv --python 3.11 .venv
```

激活虚拟环境：

```bash
source .venv/bin/activate
```

说明：

- 如果你使用的是 macOS / Linux，上面这条命令即可
- 如果你之后重新打开终端，需要重新执行一次激活命令

---

## 3. 安装后端依赖

激活虚拟环境后，在项目根目录执行：

```bash
UV_CACHE_DIR=.uv-cache uv sync --all-groups
```

安装完成后，项目会使用：

- [.venv](/Users/admin/Downloads/Code/lumenx/.venv)
- [uv.lock](/Users/admin/Downloads/Code/lumenx/uv.lock)

可选验证：

```bash
UV_CACHE_DIR=.uv-cache uv pip list --python .venv/bin/python
python -m pytest tests/test_provider_registry.py -q
```

---

## 4. 安装前端依赖

先安装根目录工具依赖：

```bash
npm install
```

再安装前端依赖：

```bash
cd frontend
npm ci
cd ..
```

说明：

- 前端这里建议优先使用 `npm ci`
- 如果你之前安装中断过，不要直接复用旧的 `node_modules`

---

## 5. 安装 FFmpeg

当前机器上不要依赖仓库自带的 [bin/ffmpeg](/Users/admin/Downloads/Code/lumenx/bin/ffmpeg)，应直接安装系统版本。

如果你使用 Homebrew，国内网络环境下推荐：

```bash
HOMEBREW_API_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api \
HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles \
brew install ffmpeg
```

安装完成后验证：

```bash
which ffmpeg
ffmpeg -version | head -n 2
```

---

## 6. 配置环境变量

开发模式下，后端读取项目根目录的：

- [.env](/Users/admin/Downloads/Code/lumenx/.env)

你至少需要填写这一项：

```env
DASHSCOPE_API_KEY=sk-你的_dashscope_key
```

推荐最小可用配置：

```env
DASHSCOPE_API_KEY=sk-你的_dashscope_key
KLING_PROVIDER_MODE=dashscope
VIDU_PROVIDER_MODE=dashscope
PIXVERSE_PROVIDER_MODE=dashscope
```

说明：

- 只填 `DASHSCOPE_API_KEY` 也可以运行
- `KLING_PROVIDER_MODE`、`VIDU_PROVIDER_MODE`、`PIXVERSE_PROVIDER_MODE` 不填时，后端默认按 `dashscope` 处理
- 如果你修改了 `.env`，需要**重启后端**，旧进程不会自动重新加载配置

---

## 7. 启动后端

在项目根目录执行：

```bash
source .venv/bin/activate
python -m uvicorn src.apps.comic_gen.api:app --host 127.0.0.1 --port 17177
```

你也可以使用项目脚本：

```bash
./start_backend.sh
```

后端启动成功后可访问：

- `http://127.0.0.1:17177/docs`

后端验证命令：

```bash
curl -I -s http://127.0.0.1:17177/docs
curl -s http://127.0.0.1:17177/config/env
curl -s http://127.0.0.1:17177/debug/config
```

---

## 8. 启动前端

在新终端执行：

```bash
cd /Users/admin/Downloads/Code/lumenx/frontend
npm run dev -- --hostname 127.0.0.1 --port 3000
```

前端启动成功后访问：

- `http://127.0.0.1:3000`

前端验证命令：

```bash
curl -I -s http://127.0.0.1:3000
curl -s -o /tmp/lumenx_home.out -w "%{http_code}\n" http://127.0.0.1:3000/
```

---

## 9. 一次性执行清单

如果你是第一次安装，直接按下面顺序执行即可：

```bash
# 1. 进入项目
cd /Users/admin/Downloads/Code/lumenx

# 2. 创建并激活 Python 虚拟环境
uv venv --python 3.11 .venv
source .venv/bin/activate

# 3. 安装后端依赖
UV_CACHE_DIR=.uv-cache uv sync --all-groups

# 4. 安装前端依赖
npm install
cd frontend
npm ci
cd ..

# 5. 安装 FFmpeg
HOMEBREW_API_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api \
HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles \
brew install ffmpeg

# 6. 编辑 .env，至少填入 DASHSCOPE_API_KEY
```

填好 [.env](/Users/admin/Downloads/Code/lumenx/.env) 后，再分别启动后端和前端：

```bash
# 终端 1：启动后端
cd /Users/admin/Downloads/Code/lumenx
source .venv/bin/activate
python -m uvicorn src.apps.comic_gen.api:app --host 127.0.0.1 --port 17177
```

```bash
# 终端 2：启动前端
cd /Users/admin/Downloads/Code/lumenx/frontend
npm run dev -- --hostname 127.0.0.1 --port 3000
```

启动后访问：

- 前端：`http://127.0.0.1:3000`
- 后端：`http://127.0.0.1:17177/docs`

---

## 10. 常见问题

### 1. 现象：前端打开后提示 Internal Server Error

处理命令：

```bash
cd /Users/admin/Downloads/Code/lumenx/frontend
npm ci
rm -rf .next
npm run dev -- --hostname 127.0.0.1 --port 3000
```

### 2. 现象：前端页面样式异常

处理命令：

```bash
cd /Users/admin/Downloads/Code/lumenx/frontend
rm -rf .next
npm run dev -- --hostname 127.0.0.1 --port 3000
```

如果依赖曾经损坏，再执行：

```bash
npm ci
```

### 3. 现象：环境配置弹窗不消失

先确认 [.env](/Users/admin/Downloads/Code/lumenx/.env) 已填写：

```env
DASHSCOPE_API_KEY=sk-你的_dashscope_key
```

然后执行：

```bash
cd /Users/admin/Downloads/Code/lumenx
source .venv/bin/activate
python -m uvicorn src.apps.comic_gen.api:app --host 127.0.0.1 --port 17177
```

再刷新前端页面，并验证后端是否读到配置：

```bash
curl -s http://127.0.0.1:17177/config/env
```

### 4. 现象：FFmpeg 不可用

处理命令：

```bash
HOMEBREW_API_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api \
HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles \
brew install ffmpeg
```

安装后验证：

```bash
which ffmpeg
ffmpeg -version | head -n 2
```

---

## 11. 相关文档

- [环境安装排障记录.md](/Users/admin/Downloads/Code/lumenx/docs/环境安装排障记录.md)
- [README.md](/Users/admin/Downloads/Code/lumenx/README.md)
