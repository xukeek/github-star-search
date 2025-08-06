# Starry AI Navigator - 部署指南

基于产品设计文档实现的GitHub Starred仓库智能搜索应用。

## 功能特性

✅ **已实现功能**：

1. **GitHub OAuth 认证** - 用户通过GitHub登录，安全存储访问令牌
2. **仓库同步** - 自动同步用户的所有starred仓库，包含完整元数据
3. **精确搜索** - 支持多种筛选条件的高级搜索功能
4. **AI 语义搜索** - 基于Cloudflare Workers AI的自然语言搜索
5. **向量化存储** - 使用Cloudflare Vectorize存储仓库内容向量
6. **搜索界面** - 融合式搜索界面（主搜索框+高级筛选）
7. **仪表板** - 用户友好的管理界面
8. **定时同步** - 每日自动同步所有用户的仓库

## 技术架构

- **前端**: Next.js 15 + React Server Components + Tailwind CSS
- **后端**: Cloudflare Workers + OpenNext
- **数据库**: Cloudflare D1 (SQLite)
- **向量数据库**: Cloudflare Vectorize
- **AI模型**: Cloudflare Workers AI (BGE-base-en-v1.5)
- **会话存储**: Cloudflare KV
- **认证**: GitHub OAuth 2.0

## 部署步骤

### 1. 环境准备

```bash
# 克隆项目
git clone <your-repo-url>
cd starry-ai-navigator

# 安装依赖
pnpm install

# 登录Cloudflare
npx wrangler login
```

### 2. 配置GitHub OAuth

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建新的OAuth App：
   - Application name: `Starry AI Navigator`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-domain.com/sso/github/callback`
3. 获取Client ID和Client Secret

### 3. 设置环境变量

创建 `.dev.vars` 文件：

```bash
NEXTJS_ENV=development
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4. 创建Cloudflare资源

```bash
# 创建D1数据库
npx wrangler d1 create starry-ai-navigator-db

# 创建KV存储
npx wrangler kv namespace create "starry-sessions"

# 创建Vectorize索引
npx wrangler vectorize create starry-ai-navigator-index --dimensions=768 --metric=cosine
```

### 5. 更新wrangler.jsonc

将创建的资源ID更新到 `wrangler.jsonc` 中：

```json
{
  "d1_databases": [
    {
      "binding": "NEXT_TAG_CACHE_D1",
      "database_name": "starry-ai-navigator-db",
      "database_id": "你的数据库ID"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "NEXT_INC_CACHE_KV",
      "id": "你的KV存储ID"
    }
  ],
  "vectorize": [
    {
      "binding": "VECTORIZE_INDEX",
      "index_name": "starry-ai-navigator-index"
    }
  ]
}
```

### 6. 数据库迁移

```bash
# 生成类型定义
pnpm run cf-typegen

# 运行数据库迁移
pnpm run db:migrate:dev
```

### 7. 部署应用

```bash
# 构建并部署
pnpm run deploy
```

## 使用指南

### 首次使用

1. 访问部署的应用URL
2. 点击"Sign in with GitHub"登录
3. 授权应用访问你的GitHub数据
4. 在Dashboard中点击"Start Initial Sync"同步仓库
5. 同步完成后即可使用搜索功能

### 搜索功能

**AI智能搜索**：
- 输入自然语言描述，如："React组件库"、"Python机器学习"
- 点击"AI Search"按钮获得语义搜索结果

**精确搜索**：
- 使用高级筛选器进行精确搜索
- 支持语言、Star数、时间范围等多种条件

**融合搜索**：
- 可以组合使用AI搜索和筛选条件
- 系统会先应用筛选条件，再在结果中进行语义搜索

### 管理功能

- **手动同步**：随时在Dashboard中手动同步仓库
- **同步状态**：查看最后同步时间和仓库数量
- **自动同步**：系统每日凌晨2点自动同步所有用户数据

## 开发

```bash
# 本地开发
pnpm dev

# 类型检查
pnpm run cf-typegen

# 数据库操作
pnpm run db:generate [migration-name]  # 生成迁移
pnpm run db:migrate:dev                # 应用迁移
```

## 成本估算

使用Cloudflare的免费套餐：
- **Workers**: 100,000 请求/天
- **D1**: 25 GB 存储，500万读取/天
- **KV**: 100,000 读取/天，1,000 写入/天
- **Vectorize**: 30万查询/月，500万存储向量
- **Workers AI**: 10,000 神经元/天

对于个人使用或小团队，完全可以在免费额度内运行。

## 故障排除

### 同步失败
- 检查GitHub token是否有效
- 查看网络连接状况
- 检查API速率限制

### 搜索无结果
- 确认仓库已正确同步
- 检查向量化是否成功
- 尝试使用精确搜索

### 部署问题
- 确认所有环境变量设置正确
- 检查wrangler.jsonc配置
- 查看部署日志获取详细错误信息

## 贡献

欢迎提交Issue和Pull Request来改进项目！

## 许可证

MIT License