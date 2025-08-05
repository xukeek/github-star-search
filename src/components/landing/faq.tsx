import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GITHUB_REPO_URL } from "@/constants";

const faqs = [
  {
    question: "这个工具是免费的吗？",
    answer: (
      <>
        是的，Starry AI Navigator 完全免费且<a href={GITHUB_REPO_URL} target="_blank">开源</a>！你可以在个人和商业项目中使用，无需任何许可费用。你可以 fork、复制、修改和分发，无任何限制。
      </>
    ),
  },
  {
    question: "我需要提供 API Key 吗？",
    answer: (
      <>
        不需要！我们使用 Cloudflare Workers AI 提供的免费 Embedding 模型，无需你提供任何 API Key。只需要通过 GitHub OAuth 授权即可开始使用。
      </>
    ),
  },
  {
    question: "我的 GitHub Token 安全吗？",
    answer: (
      <>
        <p>绝对安全。我们采用了多重安全措施：</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>GitHub Token 不存储在客户端</li>
          <li>后端获取后立即使用并丢弃</li>
          <li>使用 Cloudflare Secrets 进行安全存储</li>
          <li>所有通信强制使用 HTTPS</li>
          <li>严格遵循 OAuth 2.0 安全标准</li>
        </ul>
      </>
    ),
  },
  {
    question: "AI 搜索的准确度如何？",
    answer: (
      <>
        我们的目标是实现首屏点击率超过 70%。通过将 AI 语义搜索与精确筛选相结合，即使是模糊的描述也能快速找到相关仓库。系统会根据你的搜索历史不断学习和优化。
      </>
    ),
  },
  {
    question: "支持搜索多少个 Stars？",
    answer: (
      <>
        <p>理论上没有上限！系统支持：</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>首次授权后自动全量同步所有 Stars</li>
          <li>每日自动增量同步新增的 Stars</li>
          <li>基于向量搜索，数据量越大效果越好</li>
          <li>响应时间始终保持在 2 秒以内</li>
        </ul>
      </>
    ),
  },
  {
    question: "有哪些搜索功能？",
    answer: (
      <>
        <p>我们提供两种互补的搜索方式：</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong>AI 智能搜索</strong>：自然语言描述，如"用 Go 写的图片压缩库"</li>
          <li><strong>精确筛选</strong>：按语言、Star数、收藏时间、许可证等筛选</li>
          <li><strong>混合搜索</strong>：两种方式可组合使用，获得最精准结果</li>
          <li><strong>实时结果</strong>：输入即搜索，无需等待</li>
        </ul>
      </>
    ),
  },
  {
    question: "如何部署自己的实例？",
    answer: (
      <>
        <p>部署非常简单，你只需要：</p>
        <ol className="list-decimal pl-6 mt-2 space-y-1">
          <li>Fork 项目到你的 GitHub</li>
          <li>在 Cloudflare 创建 D1 数据库和 Vectorize 索引</li>
          <li>配置 GitHub OAuth 应用</li>
          <li>部署到 Cloudflare Pages</li>
          <li>运行数据库迁移</li>
        </ol>
        <p className="mt-2">详细步骤请查看<a href={`${GITHUB_REPO_URL}/blob/main/README.md`} target="_blank">部署文档</a>。</p>
      </>
    ),
  },
  {
    question: "运行成本是多少？",
    answer: (
      <>
        <p>几乎为零！我们充分利用了 Cloudflare 的免费套餐：</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Cloudflare Pages：免费托管</li>
          <li>Cloudflare Workers：免费 100,000 次请求/天</li>
          <li>D1 数据库：免费 100,000 次读/写/天</li>
          <li>Vectorize：免费 300,000 次查询/月</li>
          <li>Workers AI：免费 10,000 次请求/天</li>
        </ul>
        <p className="mt-2">对于个人使用来说，完全在免费额度内。</p>
      </>
    ),
  },
  {
    question: "如何贡献和反馈？",
    answer: (
      <>
        欢迎贡献！你可以在 <a href={GITHUB_REPO_URL} target="_blank">GitHub</a> 上提交 Issue、Pull Request 或帮助改进文档。项目遵循标准的开源贡献指南。
      </>
    ),
  },
];

export function FAQ() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-100/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight">
            常见问题解答
          </h2>
          <Accordion type="single" collapsible className="w-full mt-10">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose dark:prose-invert w-full max-w-none">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
