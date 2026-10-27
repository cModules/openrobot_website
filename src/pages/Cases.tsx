import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, ArrowRight, FileText, Target } from "lucide-react";
import { useCases } from "@/lib/useData";
import { useContact } from "@/lib/contact";

export default function Cases() {
  const { cases } = useCases();
  const contact = useContact();

  const [industry, setIndustry] = useState<string>("全部");

  // 行业筛选：从数据里聚合，不需要单独维护一份行业列表
  const industries = useMemo(() => {
    const set = new Set<string>();
    for (const item of cases) {
      if (item.industry?.trim()) set.add(item.industry.trim());
    }
    return ["全部", ...Array.from(set)];
  }, [cases]);

  const visible = useMemo(() => {
    if (industry === "全部") return cases;
    return cases.filter((item) => item.industry?.trim() === industry);
  }, [cases, industry]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              客户案例
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              我们如何把机器人自动化方案落到真实产线上
            </p>
          </div>

          {cases.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <Building2 className="w-14 h-14 text-slate-600 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-white mb-3">
                案例正在整理中
              </h2>
              <p className="text-slate-400 mb-8">
                想了解我们在类似场景下的做法？直接联系，我们会提供对应的方案说明。
              </p>
              <button
                type="button"
                onClick={() => contact.open("wechat")}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-all"
              >
                联系我们
              </button>
            </div>
          ) : (
            <>
              {industries.length > 2 ? (
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {industries.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setIndustry(name)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                        industry === name
                          ? "bg-accent-600 text-white"
                          : "bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visible.map((item) => (
                  <article
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-accent-500/50 transition-all flex flex-col"
                  >
                    {item.image ? (
                      <div className="aspect-video overflow-hidden bg-slate-800">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-accent-400 mb-3 flex-wrap">
                        {item.industry ? (
                          <span className="px-2 py-1 bg-accent-900/40 rounded">
                            {item.industry}
                          </span>
                        ) : null}
                        <span className="text-slate-500">{item.date}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2">
                        {item.title}
                      </h3>

                      {item.client ? (
                        <p className="text-sm text-slate-500 mb-3">
                          {item.client}
                        </p>
                      ) : null}

                      <p className="text-slate-400 text-sm mb-5 flex-1">
                        {item.summary}
                      </p>

                      {item.results?.length ? (
                        <ul className="space-y-2 mb-5">
                          {item.results.map((result) => (
                            <li
                              key={result}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <Target className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {item.tags?.length ? (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {item.coverPath ? (
                        <Link
                          to={`/case/${item.id}`}
                          className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          查看详情
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              {visible.length === 0 ? (
                <p className="text-center text-slate-400 mt-12">
                  该行业下暂无案例
                </p>
              ) : null}
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            有类似的需求？
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            告诉我们你的场景，我们会评估可行性并给出方案建议。
          </p>
          <button
            type="button"
            onClick={() => contact.open("wechat")}
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-lg transition-all inline-flex items-center gap-2"
          >
            联系我们
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
