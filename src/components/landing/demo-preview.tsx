import {
  MagnifyingGlassIcon,
  SparklesIcon,
  StarIcon,
  ClockIcon,
  CodeBracketIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const demoQueries = [
  "用 Go 写的图片压缩库",
  "MIT 协议的 React 组件",
  "机器学习相关的 Python 项目",
  "微服务架构的示例代码",
];

const demoResults = [
  {
    name: "imagemin/imagemin",
    description: "Minify images seamlessly with Node.js",
    language: "JavaScript",
    stars: "5.2k",
    owner: "imagemin",
    starredAt: "2 天前",
    topics: ["image", "optimization", "minify"],
  },
  {
    name: "disintegration/imaging",
    description: "Imaging is a simple image processing package for Go",
    language: "Go",
    stars: "4.8k",
    owner: "disintegration",
    starredAt: "1 周前",
    topics: ["image", "processing", "go"],
  },
  {
    name: "h2non/bimg",
    description: "Small Go package for fast high-level image processing",
    language: "Go",
    stars: "2.4k",
    owner: "h2non",
    starredAt: "3 天前",
    topics: ["image", "resize", "crop"],
  },
];

export function DemoPreview() {
  return (
    <div className="py-24 sm:py-32 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            产品演示
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            看看它是如何工作的
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            体验智能搜索的强大能力，即使你只记得模糊的描述，也能快速找到目标仓库。
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* 搜索界面演示 */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">智能搜索</h3>
                  <SparklesIcon className="w-5 h-5 text-purple-500" />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value="用 Go 写的图片压缩库"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm"
                      readOnly
                    />
                    <SparklesIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">试试这些查询:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {demoQueries.map((query, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md text-xs"
                        >
                          {query}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 高级筛选演示 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span>高级筛选</span>
                  <div className="ml-auto text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    可组合使用
                  </div>
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      编程语言
                    </label>
                    <select className="w-full p-2 bg-background border border-border rounded text-sm">
                      <option>Go</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Star 数
                    </label>
                    <input
                      type="text"
                      placeholder=">= 1000"
                      className="w-full p-2 bg-background border border-border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      收藏时间
                    </label>
                    <select className="w-full p-2 bg-background border border-border rounded text-sm">
                      <option>最近 1 个月</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      许可证
                    </label>
                    <select className="w-full p-2 bg-background border border-border rounded text-sm">
                      <option>MIT</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 搜索结果演示 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">搜索结果</h3>
                <div className="text-sm text-muted-foreground">
                  找到 {demoResults.length} 个结果
                </div>
              </div>

              <div className="space-y-3">
                {demoResults.map((repo, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">
                            {repo.name}
                          </h4>
                          {index === 0 && (
                            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <SparklesIcon className="w-3 h-3" />
                              AI 推荐
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {repo.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CodeBracketIcon className="w-3 h-3" />
                            {repo.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <StarIcon className="w-3 h-3" />
                            {repo.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {repo.starredAt}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {repo.topics.map((topic, topicIndex) => (
                            <span
                              key={topicIndex}
                              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}