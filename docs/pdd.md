## **产品设计文档 (PDD): Starry AI Navigator**

| **文档版本** | 1.0 |
| :--- | :--- |
| **项目名称** | Starry AI Navigator (星海AI领航员) |
| **创建日期** | 2023年10月27日 |
| **作者** | AI Assistant |
| **状态** | 初稿 |

### **1. 项目简介与愿景**

**1.1. 简介**
Starry AI Navigator 是一款专为开发者设计的 Web 应用，旨在将用户的 GitHub Starred 仓库从一个静态的收藏夹，转变为一个动态、智能、可深度检索的个人技术知识库。

**1.2. 愿景**
我们致力于解决开发者“收藏即遗忘”的核心痛点。通过将传统的精确筛选与先进的 AI 语义理解能力无缝融合，让每一位用户都能在数秒内，通过任何记忆的片段——无论是一个模糊的功能描述、一个具体的编程语言，还是一个大概的收藏时间——都能精准地从成百上千的收藏中找到他们需要的那个仓库。

### **2. 问题陈述 (The Why)**

开发者在 GitHub 上收藏了大量有价值的仓库，但 GitHub 原生的搜索功能在个人收藏范围内表现不佳，导致了以下问题：
*   **命名遗忘**: 用户常常只记得一个仓库的功能（“那个做图片压缩的Go库”），却忘了它的确切名称。
*   **上下文缺失**: 无法按收藏时间、项目活跃度、许可证等关键上下文进行筛选。
*   **搜索无力**: 原生搜索无法理解自然语言描述，只能进行简单的关键词匹配。
*   **知识沉没**: 大量有价值的仓库被收藏后便石沉大海，无法在需要时被重新激活和利用，造成了严重的知识浪费。

### **3. 目标用户与画像 (The Who)**

*   **P1: 资深开发者 (Alex)**
    *   **行为**: 收藏大量工具库、框架和设计模式参考项目。
    *   **痛点**: 需要快速在特定语言（如 Rust）中找到满足特定条件（如 MIT 协议、近6个月有更新）的库。
    *   **需求**: 强大的**精确筛选**能力。

*   **P2: 终身学习者 (Chloe)**
    *   **行为**: 广泛收藏各种领域的教程、示例代码和新兴技术。
    *   **痛点**: 经常忘记项目的具体名称，只记得其核心概念或用途（“我收藏过一个讲微服务Saga模式的仓库”）。
    *   **需求**: 强大的**智能（语义）搜索**能力。

*   **P3: 技术管理者/团队负责人 (Sam)**
    *   **行为**: 为团队技术选型收藏备选方案。
    *   **痛点**: 需要快速找到某领域内最受欢迎、最受信任（如Google/Meta出品）的解决方案。
    *   **需求**: 对 **Star 数**、**所有者** 和 **收藏时间** 的综合筛选能力。

### **4. 目标与成功指标 (The How)**

| 目标分类 | 目标描述 | 成功指标 (KPIs) |
| :--- | :--- | :--- |
| **产品目标** | 1. 提供快速、准确的仓库检索体验。<br>2. AI 能够准确理解用户的自然语言查询意图。<br>3. 用户可以轻松组合使用精确筛选和智能搜索。 | 1. P95 搜索响应时间 < 2秒。<br>2. 智能搜索结果首屏点击率 > 70%。<br>3. 混合搜索（精确+智能）使用率占总搜索次数的 20% 以上。 |
| **用户目标** | 1. 显著减少寻找已收藏仓库的时间。<br>2. 提高已收藏仓库的复用率和价值。 | 1. 用户留存率（次周留存 > 40%）。<br>2. 日均搜索次数/活跃用户 > 3。 |
| **技术目标** | 1. 实现项目零成本或极低成本运维。 | 1. 每月云服务账单 < $1。 |

### **5. 功能需求 (The What)**

#### **F1: 用户认证与数据同步**
*   **F1.1**: 用户通过 GitHub OAuth 2.0 进行授权登录。
*   **F1.2**: 首次授权后，系统自动在后台全量同步该用户的所有 Starred 仓库信息。
    *   **关键数据点**: 必须使用 `Accept: application/vnd.github.star+json` Header 来获取 `starred_at` 字段。
*   **F1.3**: 建立每日一次的定时任务 (Cron Trigger)，自动增量同步用户新增的 Starred 仓库。

#### **F2: 统一的融合式搜索界面**
*   **F2.1**: 页面核心为一个主搜索框，用于**智能搜索**，placeholder 为引导性自然语言，如：“描述你想找的仓库...”。
*   **F2.2**: 主搜索框下方提供一个可展开/折叠的“高级筛选”区域，用于**精确搜索**。
*   **F2.3**: 用户可以单独使用主搜索框，或单独使用高级筛选，或两者组合使用。

#### **F3: 精确搜索功能 (高级筛选)**
用户可以通过以下一个或多个条件组合进行筛选：

| 筛选条件 | UI 组件 | 对应数据字段 | 运算符 |
| :--- | :--- | :--- | :--- |
| **关键词** | 文本输入框 | `name`, `description` | `LIKE '%keyword%'` |
| **编程语言** | 自动补全输入框 | `language` | `LOWER() = LOWER()` |
| **主题/标签** | 标签输入框 (多选) | `topics` (JSON) | `LIKE '%topic%'` (AND) |
| **Star 数** | 数字范围输入 | `stargazers_count` | `>=` , `<=` |
| **所有者/组织** | 文本输入框 | `owner` | `LOWER() = LOWER()` |
| **收藏时间** | 日期范围选择器 | `starred_at` | `>=` , `<=` |
| **许可证** | 下拉选择框 | `license` | `=` |
| **最后更新** | 日期范围选择器 | `pushed_at` | `>=` , `<=` |
| **是否归档** | 复选框 | `archived` | `=` |

#### **F4: 智能搜索功能**
*   **F4.1**: 用户在主搜索框输入自然语言描述。
*   **F4.2**: 后端接收到查询后，将用户在“高级筛选”中设定的条件作为**预过滤器**，在 D1 中查询出一个候选仓库 ID 集合。
*   **F4.3**: 将用户的自然语言查询通过 Embedding 模型（如 `bge-base-en-v1.5`）转换为向量。
*   **F4.4**: 在 Vector DB 中执行向量搜索，但**仅在候选仓库 ID 集合**中进行搜索。
*   **F4.5**: 系统根据语义相似度分数对结果进行排序，最终输出一个按用户意图排序的仓库列表。

#### **F5: 搜索结果展示**
*   **F5.1**: 结果以卡片列表形式展示，每个卡片包含仓库的核心信息：`名称`、`描述`、`语言`、`Star数`、`所有者`、`收藏时间`。
*   **F5.2**: 每个卡片提供直接跳转到原 GitHub 仓库的链接。
*   **F5.3**: **(关键体验)** 在智能搜索结果的卡片上，可以附带一个小的徽章或提示，如 “✨ AI 推荐”，以告知用户该排序是由 AI 驱动的。

### **6. 非功能性需求**
*   **性能**: API 响应时间 P95 应低于2秒。前端页面首次加载时间 (LCP) 应低于2.5秒。
*   **安全性**: 用户 GitHub Token 绝不存储在客户端。后端获取后应立即使用并丢弃，或使用 Cloudflare Secrets 进行安全存储。所有通信强制 HTTPS。
*   **可扩展性**: 整体架构基于 Serverless，应能随用户量自然扩展。
*   **成本**: 严格使用 Cloudflare 及其他服务的免费套餐，实现零成本运维。

### **7. 技术架构与选型**

**7.1. 架构图**
```mermaid
graph TD
    subgraph "用户浏览器"
        A[Next.js Frontend on Cloudflare Pages]
    end

    subgraph "Cloudflare Backend"
        A -->|HTTP API Request| B{API Route Handler (Worker)};
        B -->|SQL Pre-filtering| C[Cloudflare D1];
        B -->|Vector Search| D[Vector DB (e.g., Vectorize)];
        B -->|Embedding| E[Workers AI];
    end

    subgraph "后台同步 (Cron Trigger)"
        F[Sync Worker] -->|GitHub API| G[GitHub];
        F -->|Store Metadata| C;
        F -->|Vectorize & Store README| D;
    end
```

**7.2. 技术栈**
| 组件 | 技术选型 | 理由 |
| :--- | :--- | :--- |
| **Web 框架** | Next.js (App Router) + OpenNext | 优秀的开发体验，无缝部署到 Cloudflare Pages/Workers 生态。 |
| **部署平台** | Cloudflare Pages | 全球 CDN 加速，与 Workers、D1 等服务完美集成，免费额度慷慨。 |
| **后端逻辑** | Cloudflare Workers | Serverless，低延迟，高性能，与 AI/DB 无缝集成。 |
| **SQL 数据库** | Cloudflare D1 | 存储结构化元数据，与 Workers 原生集成，免费。 |
| **Vector 数据库** | Cloudflare Vectorize | 存储 README 向量，与 Workers 原生集成，性能最佳。 |
| **AI 模型** | Cloudflare Workers AI | 内置免费的 Embedding 模型，无需管理 API Key，低延迟。 |

### **8. 数据模型 (D1 Schema)**
```sql
CREATE TABLE IF NOT EXISTS repos (
    id INTEGER PRIMARY KEY,
    github_id INTEGER UNIQUE NOT NULL,

    -- Core Fields
    name TEXT NOT NULL,
    full_name TEXT NOT NULL UNIQUE,
    owner TEXT NOT NULL,
    description TEXT,
    language TEXT,
    stargazers_count INTEGER,
    topics TEXT, -- Stored as JSON string: '["topic1", "topic2"]'
    starred_at DATETIME NOT NULL,

    -- Advanced Fields
    license TEXT,
    pushed_at DATETIME,
    archived BOOLEAN,

    -- Other
    url TEXT,
    readme_content TEXT -- For vectorization
);
```