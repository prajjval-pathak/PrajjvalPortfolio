import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Check,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Hash,
} from "lucide-react";
import {
  LearningArticle,
  learningArticles,
  LEARNING_CATEGORIES,
} from "../../data/learningsData";
import { CodeSnippetBlock } from "./CodeSnippetBlock";
import { CalloutBlock } from "./CalloutBlock";

interface LearningArticleViewProps {
  article: LearningArticle;
  onBack: () => void;
  onSelectArticle: (slug: string) => void;
}

export const LearningArticleView: React.FC<LearningArticleViewProps> = ({
  article,
  onBack,
  onSelectArticle,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>("");

  // Find previous and next articles
  const currentIndex = learningArticles.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? learningArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < learningArticles.length - 1
      ? learningArticles[currentIndex + 1]
      : null;

  // Other articles in the same category
  const relatedArticles = learningArticles.filter(
    (a) => a.category === article.category && a.slug !== article.slug
  );

  // Active category meta
  const categoryMeta = LEARNING_CATEGORIES.find((c) => c.id === article.category);

  // Track active section on scroll for Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = article.sections.length - 1; i >= 0; i--) {
        const sec = article.sections[i];
        const el = document.getElementById(sec.id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSectionId(sec.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article]);

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [article.slug]);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/learnings/${article.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen text-slate">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="sticky top-0 z-20 border-b border-slate-dark/30 bg-navy/90 backdrop-blur-md py-3 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-xs font-mono text-slate hover:text-teal transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>ALL LEARNINGS</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded border border-slate-dark/40 bg-navy-card/80 px-3 py-1 text-xs font-mono text-slate hover:border-teal hover:text-teal transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-teal" />
                  <span className="text-teal">Copied Link!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Note</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Topics & Digital Garden Explorer (Desktop) */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Category Card */}
              <div className="rounded-lg border border-slate-dark/40 bg-navy-card/40 p-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal">
                  Current Topic
                </span>
                <h3 className="mt-1 text-base font-bold text-slate-lightest">
                  {categoryMeta?.fullName || article.category}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate">
                  {categoryMeta?.description}
                </p>
              </div>

              {/* All Topics Quick Switcher */}
              <div className="rounded-lg border border-slate-dark/30 bg-navy-card/30 p-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-lightest mb-3 flex items-center gap-2">
                  <Bookmark className="h-3.5 w-3.5 text-teal" />
                  <span>Topics</span>
                </h4>
                <div className="space-y-1">
                  {LEARNING_CATEGORIES.map((cat) => {
                    const isCurrent = cat.id === article.category;
                    const catArticles = learningArticles.filter((a) => a.category === cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          if (catArticles.length > 0) {
                            onSelectArticle(catArticles[0].slug);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left ${
                          isCurrent
                            ? "bg-teal/10 text-teal font-medium"
                            : "text-slate hover:text-slate-lightest hover:bg-navy-card"
                        }`}
                      >
                        <span className="font-mono">{cat.id}</span>
                        <span className="text-[10px] opacity-75">{catArticles.length} notes</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Related Notes in this Topic */}
              {relatedArticles.length > 0 && (
                <div className="rounded-lg border border-slate-dark/30 bg-navy-card/30 p-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-lightest mb-3">
                    More in {article.category}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {relatedArticles.map((rel) => (
                      <li key={rel.slug}>
                        <button
                          onClick={() => onSelectArticle(rel.slug)}
                          className="hover:text-teal text-left line-clamp-2 transition-colors text-slate-light"
                        >
                          • {rel.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Center Column: Main Article Body */}
          <main className="lg:col-span-6 xl:col-span-7">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-light">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  categoryMeta?.accentColor || "text-teal bg-teal/10 border-teal/30"
                }`}
              >
                {article.category}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-dark/50 bg-navy-card/60 text-[11px] text-slate-light">
                {article.difficulty}
              </span>
              <span className="flex items-center gap-1 text-slate">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.readTime}</span>
              </span>
              <span className="flex items-center gap-1 text-slate">
                <Calendar className="h-3.5 w-3.5" />
                <span>{article.date}</span>
              </span>
            </div>

            {/* Article Title */}
            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-lightest leading-tight">
              {article.title}
            </h1>

            {/* Article Summary Lead */}
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-light border-l-2 border-teal pl-4 italic">
              {article.summary}
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-navy-card px-2 py-0.5 text-[11px] font-mono text-slate border border-slate-dark/30"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Key Takeaways Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="mt-8 rounded-xl border border-teal/30 bg-teal/5 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-teal">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Key Architectural Takeaways</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-light">
                  {article.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="text-teal font-bold text-xs mt-1">✓</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Table of Contents for Mobile / Tablet */}
            <div className="mt-8 lg:hidden rounded-lg border border-slate-dark/40 bg-navy-card/60 p-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal mb-2">
                Table of Contents
              </h3>
              <ul className="space-y-1.5 text-xs font-mono">
                {article.sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                      onClick={() => scrollToSection(sec.id)}
                      className="text-slate hover:text-teal text-left"
                    >
                      {sec.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Article Sections */}
            <article className="mt-10 space-y-12">
              {article.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 border-t border-slate-dark/20 pt-8 first:border-t-0 first:pt-0"
                >
                  <h2 className="group flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-lightest">
                    <span>{section.title}</span>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className="opacity-0 group-hover:opacity-100 text-teal transition-opacity"
                      aria-label="Link to section"
                    >
                      <Hash className="h-4 w-4" />
                    </button>
                  </h2>

                  {/* Paragraphs */}
                  {section.paragraphs && (
                    <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-slate-light">
                      {section.paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Bullet points */}
                  {section.bulletPoints && (
                    <ul className="mt-4 space-y-2 text-sm sm:text-base text-slate-light list-disc list-inside">
                      {section.bulletPoints.map((bp, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {bp}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Architecture Diagram */}
                  {section.diagram && (
                    <div className="my-6 rounded-lg border border-slate-dark/50 bg-navy-darkest p-4 overflow-x-auto shadow-card">
                      <div className="text-[11px] font-mono text-teal uppercase tracking-wider mb-2">
                        System Architecture Diagram
                      </div>
                      <pre className="font-mono text-xs sm:text-sm text-slate-lightest leading-relaxed">
                        {section.diagram}
                      </pre>
                    </div>
                  )}

                  {/* Post-Diagram Paragraphs */}
                  {section.postDiagramParagraphs && (
                    <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-slate-light">
                      {section.postDiagramParagraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Callout box */}
                  {section.callout && <CalloutBlock callout={section.callout} />}

                  {/* Code Snippet */}
                  {section.codeSnippet && (
                    <CodeSnippetBlock snippet={section.codeSnippet} />
                  )}

                  {/* Subsections */}
                  {section.subsections && (
                    <div className="mt-6 space-y-6 pl-4 border-l border-slate-dark/30">
                      {section.subsections.map((sub) => (
                        <div key={sub.id} id={sub.id} className="scroll-mt-24">
                          <h3 className="text-lg font-semibold text-slate-lightest">
                            {sub.title}
                          </h3>
                          {sub.paragraphs && (
                            <div className="mt-2 space-y-3 text-sm text-slate-light">
                              {sub.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                              ))}
                            </div>
                          )}
                          {sub.codeSnippet && (
                            <CodeSnippetBlock snippet={sub.codeSnippet} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </article>

            {/* Next / Previous Article Navigation */}
            <div className="mt-16 border-t border-slate-dark/40 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <button
                  onClick={() => onSelectArticle(prevArticle.slug)}
                  className="group flex flex-col items-start p-4 rounded-lg border border-slate-dark/40 bg-navy-card/40 hover:border-teal/50 hover:bg-navy-card text-left transition-all"
                >
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate group-hover:text-teal">
                    <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    <span>PREVIOUS NOTE</span>
                  </span>
                  <span className="mt-1.5 text-sm font-semibold text-slate-lightest line-clamp-1 group-hover:text-teal">
                    {prevArticle.title}
                  </span>
                  <span className="mt-1 text-xs text-slate font-mono">
                    {prevArticle.category} · {prevArticle.readTime}
                  </span>
                </button>
              ) : (
                <div />
              )}

              {nextArticle && (
                <button
                  onClick={() => onSelectArticle(nextArticle.slug)}
                  className="group flex flex-col items-end p-4 rounded-lg border border-slate-dark/40 bg-navy-card/40 hover:border-teal/50 hover:bg-navy-card text-right transition-all sm:col-start-2"
                >
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate group-hover:text-teal">
                    <span>NEXT NOTE</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="mt-1.5 text-sm font-semibold text-slate-lightest line-clamp-1 group-hover:text-teal">
                    {nextArticle.title}
                  </span>
                  <span className="mt-1 text-xs text-slate font-mono">
                    {nextArticle.category} · {nextArticle.readTime}
                  </span>
                </button>
              )}
            </div>

            {/* Bottom Back Button */}
            <div className="mt-10 text-center">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-teal/40 bg-teal/10 text-xs font-mono font-semibold text-teal hover:bg-teal hover:text-navy-darkest transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>EXPLORE ALL LEARNING NOTES</span>
              </button>
            </div>
          </main>

          {/* Right Column: Sticky Table of Contents (Desktop) */}
          <aside className="hidden xl:col-span-2 xl:block">
            <div className="sticky top-20">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-lightest mb-3 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-teal" />
                <span>On This Page</span>
              </h3>
              <nav className="space-y-1 text-xs">
                {article.sections.map((sec) => {
                  const isActive = activeSectionId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`block w-full text-left py-1 px-2 rounded transition-colors truncate ${
                        isActive
                          ? "text-teal font-medium bg-teal/10 border-l-2 border-teal"
                          : "text-slate hover:text-slate-lightest hover:bg-navy-card/50"
                      }`}
                      title={sec.title}
                    >
                      {sec.title}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 border-t border-slate-dark/30 pt-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-xs font-mono text-slate hover:text-teal transition-colors flex items-center gap-1"
                >
                  ↑ Back to top
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
