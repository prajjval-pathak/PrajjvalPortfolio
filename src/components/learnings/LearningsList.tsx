import React, { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  X,
  Code2,
  Cpu,
  Brain,
  Globe,
  Database,
} from "lucide-react";
import {
  learningArticles,
  LEARNING_CATEGORIES,
} from "../../data/learningsData";

interface LearningsListProps {
  onSelectArticle: (slug: string) => void;
  onBackToPortfolio: () => void;
}

export const LearningsList: React.FC<LearningsListProps> = ({
  onSelectArticle,
  onBackToPortfolio,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Category Icon helper
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case "LLD":
        return <Layers className="h-4 w-4" />;
      case "HLD":
        return <Cpu className="h-4 w-4" />;
      case "DS":
        return <Database className="h-4 w-4" />;
      case "AI":
        return <Brain className="h-4 w-4" />;
      case ".NET":
        return <Code2 className="h-4 w-4" />;
      case "JS":
        return <Globe className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Filtered articles based on search & category
  const filteredArticles = useMemo(() => {
    return learningArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "ALL" || article.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen text-slate">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-dark/30 bg-navy/90 backdrop-blur-md px-6 py-4 sm:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortfolio}
              className="group flex items-center gap-2 rounded px-3 py-1.5 text-xs font-mono font-medium text-slate hover:text-teal hover:bg-navy-card transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>PORTFOLIO</span>
            </button>
            <span className="text-slate-dark">•</span>
            <div className="flex items-center gap-2 text-slate-lightest font-mono text-sm font-bold">
              <Sparkles className="h-4 w-4 text-teal" />
              <span>LEARNINGS & TECH NOTES</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate">
            <span className="text-teal font-semibold">{learningArticles.length}</span> Notes Published
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-12 lg:py-16">
        {/* Digital Garden Hero Header */}
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-mono text-teal mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Digital Garden & Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-lightest">
            Engineering Notes & System Learnings
          </h1>

          <p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-light">
            A digital garden where I document practical deep-dives into{" "}
            <span className="text-teal font-medium">Low-Level Design (LLD)</span>,{" "}
            <span className="text-teal font-medium">Distributed Systems (HLD)</span>,{" "}
            <span className="text-teal font-medium">Data Structures</span>,{" "}
            <span className="text-teal font-medium">Enterprise AI & RAG</span>,{" "}
            <span className="text-teal font-medium">.NET Core Internals</span>, and{" "}
            <span className="text-teal font-medium">Modern JavaScript / React</span>.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-dark/30 bg-navy-card/40 p-4">
              <span className="text-xs font-mono text-slate">TOPICS COVERED</span>
              <div className="mt-1 text-2xl font-bold font-mono text-teal">6 Focus Areas</div>
            </div>
            <div className="rounded-lg border border-slate-dark/30 bg-navy-card/40 p-4">
              <span className="text-xs font-mono text-slate">CURATED ARTICLES</span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-lightest">
                {learningArticles.length} Notes
              </div>
            </div>
            <div className="rounded-lg border border-slate-dark/30 bg-navy-card/40 p-4">
              <span className="text-xs font-mono text-slate">DEPTH</span>
              <div className="mt-1 text-2xl font-bold font-mono text-teal">Production Ready</div>
            </div>
            <div className="rounded-lg border border-slate-dark/30 bg-navy-card/40 p-4">
              <span className="text-xs font-mono text-slate">READING TIME</span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-lightest">~8 min avg</div>
            </div>
          </div>
        </section>

        {/* Search & Topic Filters */}
        <section className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, algorithm (e.g. Rate Limiter, RBAC, LRU, Gemini, Span, Microtasks)..."
              className="w-full rounded-lg border border-slate-dark/50 bg-navy-card/70 py-3 pl-11 pr-10 text-sm text-slate-lightest placeholder:text-slate/60 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-slate hover:text-slate-lightest"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Topic Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono transition-all ${
                selectedCategory === "ALL"
                  ? "bg-teal text-navy-darkest font-bold shadow-teal-glow"
                  : "bg-navy-card text-slate hover:text-slate-lightest border border-slate-dark/30"
              }`}
            >
              <span>ALL TOPICS</span>
              <span className="text-[10px] opacity-80">({learningArticles.length})</span>
            </button>

            {LEARNING_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = learningArticles.filter((a) => a.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono transition-all ${
                    isSelected
                      ? "bg-teal text-navy-darkest font-bold shadow-teal-glow"
                      : "bg-navy-card text-slate hover:text-slate-lightest border border-slate-dark/30"
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Article Cards Grid */}
        <section>
          {filteredArticles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-dark/50 p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate" />
              <h3 className="mt-4 text-base font-semibold text-slate-lightest">
                No matching notes found
              </h3>
              <p className="mt-2 text-sm text-slate">
                Try searching with different terms or reset the topic filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded px-4 py-2 text-xs font-mono font-medium text-teal border border-teal/40 hover:bg-teal/10"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => {
                const catMeta = LEARNING_CATEGORIES.find(
                  (c) => c.id === article.category
                );

                return (
                  <article
                    key={article.slug}
                    onClick={() => onSelectArticle(article.slug)}
                    className="group relative flex flex-col justify-between rounded-xl border border-slate-dark/40 bg-navy-card/40 p-6 sm:p-7 hover:border-teal/50 hover:bg-navy-card hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-card"
                  >
                    <div>
                      {/* Top Badges & Meta */}
                      <div className="flex items-center justify-between gap-2 text-xs font-mono mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            catMeta?.accentColor ||
                            "text-teal bg-teal/10 border-teal/30"
                          }`}
                        >
                          {getCategoryIcon(article.category)}
                          <span>{article.category}</span>
                        </span>

                        <div className="flex items-center gap-2.5 text-slate">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{article.readTime}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{article.date}</span>
                          </span>
                        </div>
                      </div>

                      {/* Article Title */}
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-lightest group-hover:text-teal transition-colors duration-200">
                        {article.title}
                      </h2>

                      {/* Summary */}
                      <p className="mt-3 text-sm leading-relaxed text-slate line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    {/* Bottom: Tags & Read Link */}
                    <div className="mt-6 pt-4 border-t border-slate-dark/20 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-navy-darkest px-2 py-0.5 text-[10px] font-mono text-slate-light border border-slate-dark/40"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-[10px] font-mono text-slate">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono font-semibold text-teal group-hover:translate-x-1 transition-transform">
                        <span>Read Note</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
