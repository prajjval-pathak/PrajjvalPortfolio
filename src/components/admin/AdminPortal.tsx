import React, { useState, useEffect } from "react";
import {
  Lock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Database,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Code2,
  Layers,
  Info,
  LogOut,
  Save,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  LearningArticle,
  LEARNING_CATEGORIES,
  ArticleSection,
} from "../../data/learningsData";
import { learningsService } from "../../services/learningsService";
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
} from "../../lib/supabase";
import { LearningArticleView } from "../learnings/LearningArticleView";

const ADMIN_SESSION_KEY = "prajjval_portfolio_admin_auth";

interface AdminPortalProps {
  onBackToPortfolio: () => void;
  onNavigateToLearnings: (slug?: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToPortfolio,
  onNavigateToLearnings,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation State
  const [activeTab, setActiveTab] = useState<"write" | "manage" | "database">("write");

  // Articles list for manage tab
  const [articles, setArticles] = useState<LearningArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  // Supabase Settings form state
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [settingsSavedMessage, setSettingsSavedMessage] = useState("");
  const [seedStatus, setSeedStatus] = useState<string>("");

  // Article Editor State
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<LearningArticle["category"]>("LLD");
  const [difficulty, setDifficulty] = useState<LearningArticle["difficulty"]>("Advanced");
  const [readTime, setReadTime] = useState("7 min read");
  const [date, setDate] = useState("Oct 2026");
  const [summary, setSummary] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [takeaways, setTakeaways] = useState<string[]>([""]);
  const [sections, setSections] = useState<ArticleSection[]>([
    {
      id: "section-1",
      title: "1. Overview & Problem Statement",
      paragraphs: [""],
    },
  ]);

  const [previewMode, setPreviewMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState("");

  // Load articles & Supabase credentials on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
      const creds = getSupabaseCredentials();
      setSupabaseUrl(creds.url);
      setSupabaseAnonKey(creds.anonKey);
    }
  }, [isAuthenticated]);

  const loadArticles = async () => {
    setIsLoadingArticles(true);
    try {
      const data = await learningsService.getAllLearnings();
      setArticles(data);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  // Authenticate Admin
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPasscode =
      import.meta.env.VITE_ADMIN_PASSCODE || "prajjval2026";

    if (passcode.trim() === expectedPasscode) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid admin passcode. Access denied.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  // Section manipulation helpers
  const handleAddSection = () => {
    const nextNum = sections.length + 1;
    setSections([
      ...sections,
      {
        id: `section-${nextNum}`,
        title: `${nextNum}. Section Title`,
        paragraphs: [""],
      },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleUpdateSection = (idx: number, updated: Partial<ArticleSection>) => {
    const next = [...sections];
    next[idx] = { ...next[idx], ...updated };
    setSections(next);
  };

  // Takeaway helpers
  const handleAddTakeaway = () => setTakeaways([...takeaways, ""]);
  const handleUpdateTakeaway = (idx: number, val: string) => {
    const next = [...takeaways];
    next[idx] = val;
    setTakeaways(next);
  };
  const handleRemoveTakeaway = (idx: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== idx));
  };

  // Prepare article object for publish/preview
  const buildCurrentArticle = (): LearningArticle => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const validTakeaways = takeaways.map((t) => t.trim()).filter(Boolean);

    return {
      slug: slug.trim() || `note-${Date.now()}`,
      title: title.trim() || "Untitled Note",
      category,
      difficulty,
      readTime: readTime.trim() || "5 min read",
      date: date.trim() || "Oct 2026",
      summary: summary.trim(),
      tags: tags.length ? tags : [category],
      keyTakeaways: validTakeaways,
      sections,
    };
  };

  // Publish / Save Article
  const handlePublish = async () => {
    if (!title.trim() || !slug.trim()) {
      alert("Please enter a title and slug before publishing.");
      return;
    }

    setIsPublishing(true);
    setPublishSuccessMessage("");

    const newArticle = buildCurrentArticle();
    const result = await learningsService.saveLearning(newArticle);

    setIsPublishing(false);

    if (result.success) {
      setPublishSuccessMessage(
        `Successfully published "${newArticle.title}"! It is now live in your Digital Garden.`
      );
      loadArticles();
      setTimeout(() => {
        setPublishSuccessMessage("");
      }, 5000);
    } else {
      alert(`Failed to publish: ${result.error || "Unknown error"}`);
    }
  };

  // Edit existing article
  const handleEditArticle = (art: LearningArticle) => {
    setEditingSlug(art.slug);
    setTitle(art.title);
    setSlug(art.slug);
    setCategory(art.category);
    setDifficulty(art.difficulty);
    setReadTime(art.readTime);
    setDate(art.date);
    setSummary(art.summary);
    setTagsInput(art.tags.join(", "));
    setTakeaways(art.keyTakeaways && art.keyTakeaways.length ? art.keyTakeaways : [""]);
    setSections(art.sections);
    setActiveTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form for new article
  const handleResetForm = () => {
    setEditingSlug(null);
    setTitle("");
    setSlug("");
    setCategory("LLD");
    setDifficulty("Advanced");
    setReadTime("7 min read");
    setDate("Oct 2026");
    setSummary("");
    setTagsInput("");
    setTakeaways([""]);
    setSections([
      {
        id: "section-1",
        title: "1. Overview & Problem Statement",
        paragraphs: [""],
      },
    ]);
  };

  // Delete article
  const handleDeleteArticle = async (delSlug: string) => {
    if (!confirm(`Are you sure you want to delete note "${delSlug}"?`)) return;
    const res = await learningsService.deleteLearning(delSlug);
    if (res.success) {
      loadArticles();
    } else {
      alert(`Failed to delete: ${res.error}`);
    }
  };

  // Save Supabase credentials from UI
  const handleSaveSupabaseSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    setSettingsSavedMessage("Supabase configuration saved successfully!");
    setTimeout(() => setSettingsSavedMessage(""), 4000);
  };

  // Seed Supabase with starter notes
  const handleSeedSupabase = async () => {
    setSeedStatus("Seeding articles to Supabase...");
    const res = await learningsService.seedArticlesToSupabase();
    if (res.success) {
      setSeedStatus(`Successfully seeded ${res.count} articles to Supabase!`);
      loadArticles();
    } else {
      setSeedStatus(`Seeding failed: ${res.error}`);
    }
  };

  // =========================================================================
  // LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy text-slate flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-dark/50 bg-navy-card/90 p-8 shadow-card backdrop-blur-md">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-teal/10 p-3 text-teal border border-teal/30">
              <Lock className="h-6 w-6" />
            </div>
          </div>

          <h2 className="text-center text-xl font-bold tracking-tight text-slate-lightest">
            Learning Studio — Admin Portal
          </h2>
          <p className="mt-2 text-center text-xs text-slate">
            Restricted to Prajjval Pathak. Enter your admin passcode to publish and manage notes.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-light mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter secret passcode..."
                className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-4 py-2.5 text-sm text-slate-lightest focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-teal py-2.5 text-xs font-mono font-bold text-navy-darkest hover:bg-teal/90 transition-all shadow-teal-glow"
            >
              UNLOCK ADMIN STUDIO
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-dark/30 text-center">
            <button
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate hover:text-teal transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-navy text-slate">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-dark/30 bg-navy/90 backdrop-blur-md px-6 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortfolio}
              className="group flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-mono text-slate hover:text-teal hover:bg-navy-card transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>PORTFOLIO</span>
            </button>
            <span className="text-slate-dark">•</span>
            <div className="flex items-center gap-2 text-slate-lightest font-mono text-xs sm:text-sm font-bold">
              <Sparkles className="h-4 w-4 text-teal" />
              <span>ADMIN PUBLISHING STUDIO</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono border-slate-dark/50 bg-navy-card/60">
              <span
                className={`h-2 w-2 rounded-full ${
                  isSupabaseConfigured() ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span className={isSupabaseConfigured() ? "text-emerald-400" : "text-amber-400"}>
                {isSupabaseConfigured() ? "Supabase Connected" : "Local Storage Mode"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded border border-slate-dark/40 px-3 py-1 text-xs font-mono text-slate hover:text-rose-400 hover:border-rose-400/40 transition-colors"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tab Switcher */}
      <div className="border-b border-slate-dark/20 bg-navy-card/30 px-6 py-2">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("write")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === "write"
                  ? "bg-teal/15 text-teal border border-teal/40"
                  : "text-slate hover:text-slate-lightest"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{editingSlug ? "EDIT NOTE" : "WRITE NEW NOTE"}</span>
            </button>

            <button
              onClick={() => setActiveTab("manage")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === "manage"
                  ? "bg-teal/15 text-teal border border-teal/40"
                  : "text-slate hover:text-slate-lightest"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>MANAGE NOTES ({articles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === "database"
                  ? "bg-teal/15 text-teal border border-teal/40"
                  : "text-slate hover:text-slate-lightest"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>DATABASE CONFIG</span>
            </button>
          </div>

          {editingSlug && (
            <button
              onClick={handleResetForm}
              className="text-xs font-mono text-amber-400 hover:underline"
            >
              + Create New (Clear Edit)
            </button>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {/* =========================================================================
            TAB 1: WRITE / EDIT NOTE
        ========================================================================= */}
        {activeTab === "write" && (
          <div>
            {publishSuccessMessage && (
              <div className="mb-6 rounded-xl border border-teal/40 bg-teal/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm text-teal font-medium">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{publishSuccessMessage}</span>
                </div>
                <button
                  onClick={() => onNavigateToLearnings(slug)}
                  className="flex items-center gap-1 text-xs font-mono font-bold text-teal underline ml-4"
                >
                  <span>View Live</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-lightest">
                  {editingSlug ? `Editing: ${title || editingSlug}` : "Create New Learning Note"}
                </h1>
                <p className="text-xs text-slate mt-1">
                  Draft your technical breakdown with live preview, code snippets, and architecture diagrams.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-dark/50 bg-navy-card px-3.5 py-2 text-xs font-mono font-semibold text-slate hover:text-teal hover:border-teal/50 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{previewMode ? "EDIT MODE" : "PREVIEW MODE"}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex items-center gap-2 rounded-lg bg-teal px-5 py-2 text-xs font-mono font-bold text-navy-darkest hover:bg-teal/90 transition-all shadow-teal-glow disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isPublishing ? "PUBLISHING..." : editingSlug ? "UPDATE NOTE" : "PUBLISH NOTE"}</span>
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="rounded-xl border border-slate-dark/40 bg-navy-card/20 p-6">
                <div className="text-xs font-mono text-teal mb-4 uppercase tracking-wider">
                  Live Preview Mode
                </div>
                <LearningArticleView
                  article={buildCurrentArticle()}
                  onBack={() => setPreviewMode(false)}
                  onSelectArticle={() => {}}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Basic Metadata Card */}
                <div className="rounded-xl border border-slate-dark/40 bg-navy-card/40 p-6 space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal">
                    1. Article Metadata
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-light mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Low-Level Design: Token Bucket Rate Limiter in C#"
                        className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3.5 py-2 text-sm text-slate-lightest focus:border-teal focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-light mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. rate-limiter-token-bucket-csharp"
                        className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3.5 py-2 text-sm font-mono text-teal focus:border-teal focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category, Difficulty, Read Time, Date */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-slate-light mb-1">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as LearningArticle["category"])}
                        className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3 py-2 text-xs font-mono text-slate-lightest focus:border-teal focus:outline-none"
                      >
                        {LEARNING_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.id} - {c.fullName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-light mb-1">
                        Difficulty
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as LearningArticle["difficulty"])}
                        className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3 py-2 text-xs font-mono text-slate-lightest focus:border-teal focus:outline-none"
                      >
                        <option value="Fundamentals">Fundamentals</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Deep Dive">Deep Dive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-light mb-1">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        placeholder="e.g. 7 min read"
                        className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3 py-2 text-xs font-mono text-slate-lightest focus:border-teal focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-light mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="e.g. Oct 2026"
                        className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3 py-2 text-xs font-mono text-slate-lightest focus:border-teal focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-light mb-1">
                      Summary / Lead Paragraph *
                    </label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="A short, compelling 2-sentence synopsis of what this note covers..."
                      className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3.5 py-2 text-sm text-slate-lightest focus:border-teal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-light mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. C#, LLD, Concurrency, Redis, System Design"
                      className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3.5 py-2 text-sm text-slate-lightest focus:border-teal focus:outline-none"
                    />
                  </div>
                </div>

                {/* Key Takeaways Card */}
                <div className="rounded-xl border border-slate-dark/40 bg-navy-card/40 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal">
                      2. Key Architectural Takeaways (Bullet points)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddTakeaway}
                      className="flex items-center gap-1 text-xs font-mono text-teal hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Takeaway</span>
                    </button>
                  </div>

                  {takeaways.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-teal font-mono text-xs">#{idx + 1}</span>
                      <input
                        type="text"
                        value={t}
                        onChange={(e) => handleUpdateTakeaway(idx, e.target.value)}
                        placeholder="e.g. Token Bucket allows burst traffic up to the bucket capacity."
                        className="flex-1 rounded-lg border border-slate-dark/60 bg-navy-darkest px-3 py-1.5 text-xs text-slate-lightest focus:border-teal focus:outline-none"
                      />
                      {takeaways.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTakeaway(idx)}
                          className="text-slate hover:text-rose-400 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sections Builder */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal">
                      3. Article Sections & Content ({sections.length})
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="flex items-center gap-1.5 rounded bg-teal/15 px-3 py-1.5 text-xs font-mono font-bold text-teal border border-teal/40 hover:bg-teal hover:text-navy-darkest transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>ADD SECTION</span>
                    </button>
                  </div>

                  {sections.map((section, sIdx) => (
                    <div
                      key={section.id}
                      className="rounded-xl border border-slate-dark/40 bg-navy-card/40 p-6 space-y-4 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-teal">
                          Section {sIdx + 1}
                        </span>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(sIdx)}
                            className="flex items-center gap-1 text-xs font-mono text-rose-400 hover:underline"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove Section</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-light mb-1">
                            Section Heading *
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) =>
                              handleUpdateSection(sIdx, { title: e.target.value })
                            }
                            placeholder="e.g. 1. Problem Statement & Functional Requirements"
                            className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3 py-2 text-sm text-slate-lightest focus:border-teal focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-light mb-1">
                            Anchor ID
                          </label>
                          <input
                            type="text"
                            value={section.id}
                            onChange={(e) =>
                              handleUpdateSection(sIdx, { id: e.target.value })
                            }
                            className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3 py-2 text-sm font-mono text-slate focus:border-teal focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Paragraphs */}
                      <div>
                        <label className="block text-xs font-mono text-slate-light mb-1">
                          Paragraphs (Separate paragraphs with an empty line)
                        </label>
                        <textarea
                          rows={4}
                          value={section.paragraphs?.join("\n\n") || ""}
                          onChange={(e) =>
                            handleUpdateSection(sIdx, {
                              paragraphs: e.target.value.split("\n\n").filter(Boolean),
                            })
                          }
                          placeholder="Write the technical explanation for this section..."
                          className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3.5 py-2 text-sm text-slate-lightest focus:border-teal focus:outline-none"
                        />
                      </div>

                      {/* Architecture Diagram */}
                      <div>
                        <label className="block text-xs font-mono text-slate-light mb-1">
                          System Diagram (Optional ASCII / Flowchart)
                        </label>
                        <textarea
                          rows={3}
                          value={section.diagram || ""}
                          onChange={(e) =>
                            handleUpdateSection(sIdx, { diagram: e.target.value })
                          }
                          placeholder="+-- Client --> [API Gateway] --> [Redis Token Bucket] --+"
                          className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3.5 py-2 text-xs font-mono text-teal focus:border-teal focus:outline-none"
                        />
                      </div>

                      {/* Code Snippet Builder */}
                      <div className="rounded-lg border border-slate-dark/50 bg-navy-darkest/60 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-slate-light flex items-center gap-1.5">
                            <Code2 className="h-4 w-4 text-teal" />
                            <span>Code Snippet (Optional)</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate mb-1">
                              Language
                            </label>
                            <input
                              type="text"
                              value={section.codeSnippet?.language || "csharp"}
                              onChange={(e) =>
                                handleUpdateSection(sIdx, {
                                  codeSnippet: {
                                    language: e.target.value,
                                    title: section.codeSnippet?.title || "",
                                    code: section.codeSnippet?.code || "",
                                  },
                                })
                              }
                              placeholder="csharp, typescript, lua, python, sql..."
                              className="w-full rounded border border-slate-dark/50 bg-navy-darkest px-2.5 py-1 text-xs font-mono text-slate-lightest focus:border-teal focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate mb-1">
                              File / Snippet Title
                            </label>
                            <input
                              type="text"
                              value={section.codeSnippet?.title || ""}
                              onChange={(e) =>
                                handleUpdateSection(sIdx, {
                                  codeSnippet: {
                                    language: section.codeSnippet?.language || "csharp",
                                    title: e.target.value,
                                    code: section.codeSnippet?.code || "",
                                  },
                                })
                              }
                              placeholder="e.g. TokenBucketRateLimiter.cs"
                              className="w-full rounded border border-slate-dark/50 bg-navy-darkest px-2.5 py-1 text-xs font-mono text-slate-lightest focus:border-teal focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate mb-1">
                            Code
                          </label>
                          <textarea
                            rows={5}
                            value={section.codeSnippet?.code || ""}
                            onChange={(e) =>
                              handleUpdateSection(sIdx, {
                                codeSnippet: {
                                  language: section.codeSnippet?.language || "csharp",
                                  title: section.codeSnippet?.title || "",
                                  code: e.target.value,
                                },
                              })
                            }
                            placeholder="public class RateLimiter { ... }"
                            className="w-full rounded border border-slate-dark/50 bg-navy-darkest px-3 py-2 text-xs font-mono text-slate-lightest focus:border-teal focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Publish Actions */}
                <div className="pt-6 border-t border-slate-dark/30 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex items-center gap-2 rounded-lg bg-teal px-8 py-3 text-xs font-mono font-bold text-navy-darkest hover:bg-teal/90 transition-all shadow-teal-glow disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isPublishing ? "PUBLISHING..." : editingSlug ? "UPDATE NOTE" : "PUBLISH NOTE"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: MANAGE NOTES
        ========================================================================= */}
        {activeTab === "manage" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-lightest">
                  Manage Published Learnings ({articles.length})
                </h1>
                <p className="text-xs text-slate mt-1">
                  View, edit, or delete existing articles across LLD, HLD, DS, AI, .NET, and JS.
                </p>
              </div>

              <button
                onClick={() => {
                  handleResetForm();
                  setActiveTab("write");
                }}
                className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-mono font-bold text-navy-darkest hover:bg-teal/90 transition-all shadow-teal-glow"
              >
                <Plus className="h-4 w-4" />
                <span>WRITE NEW NOTE</span>
              </button>
            </div>

            {isLoadingArticles ? (
              <div className="py-12 text-center text-xs font-mono text-teal animate-pulse">
                Loading articles...
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((art) => (
                  <div
                    key={art.slug}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-dark/40 bg-navy-card/40 p-4 sm:p-5 hover:border-slate-dark transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs font-mono mb-1">
                        <span className="rounded bg-teal/15 px-2 py-0.5 text-teal font-semibold">
                          {art.category}
                        </span>
                        <span className="text-slate">{art.readTime}</span>
                        <span>•</span>
                        <span className="text-slate">{art.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-lightest truncate">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate line-clamp-1 mt-1 font-mono">
                        slug: /{art.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onNavigateToLearnings(art.slug)}
                        className="flex items-center gap-1 rounded border border-slate-dark/50 bg-navy-darkest px-3 py-1.5 text-xs font-mono text-slate hover:text-teal hover:border-teal/50 transition-colors"
                        title="View live note"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      <button
                        onClick={() => handleEditArticle(art)}
                        className="flex items-center gap-1 rounded border border-slate-dark/50 bg-navy-darkest px-3 py-1.5 text-xs font-mono text-slate hover:text-teal hover:border-teal/50 transition-colors"
                        title="Edit note"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(art.slug)}
                        className="flex items-center gap-1 rounded border border-rose-500/30 bg-navy-darkest px-3 py-1.5 text-xs font-mono text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: DATABASE CONFIG (SUPABASE)
        ========================================================================= */}
        {activeTab === "database" && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-lightest">
                Supabase Cloud Database Settings
              </h1>
              <p className="text-xs text-slate mt-1 leading-relaxed">
                Connect your free Supabase PostgreSQL database so your published learnings persist forever and update live in real-time.
              </p>
            </div>

            {/* Status Card */}
            <div
              className={`rounded-xl border p-5 ${
                isSupabaseConfigured()
                  ? "border-emerald-400/40 bg-emerald-400/5 text-emerald-300"
                  : "border-amber-400/40 bg-amber-400/5 text-amber-300"
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                <Database className="h-4 w-4" />
                <span>
                  {isSupabaseConfigured()
                    ? "Supabase Connected & Active"
                    : "Running on Local Storage Fallback"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-light leading-relaxed">
                {isSupabaseConfigured()
                  ? "All notes published in this Studio are being saved directly to your Supabase PostgreSQL database in real-time."
                  : "Notes you write right now are saved in your local browser cache. Connect your Supabase project below to make them visible to all visitors on the web!"}
              </p>
            </div>

            {/* Quick Credentials Form */}
            <form
              onSubmit={handleSaveSupabaseSettings}
              className="rounded-xl border border-slate-dark/40 bg-navy-card/40 p-6 space-y-4"
            >
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal">
                Supabase API Keys
              </h3>

              <div>
                <label className="block text-xs font-mono text-slate-light mb-1">
                  Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzabcdefg.supabase.co"
                  className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3.5 py-2 text-sm text-slate-lightest focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-light mb-1">
                  Anon / Public Key
                </label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full rounded-lg border border-slate-dark/60 bg-navy-darkest px-3.5 py-2 text-sm text-slate-lightest focus:border-teal focus:outline-none"
                />
              </div>

              {settingsSavedMessage && (
                <p className="text-xs font-mono text-teal flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>{settingsSavedMessage}</span>
                </p>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-teal px-5 py-2 text-xs font-mono font-bold text-navy-darkest hover:bg-teal/90 transition-all shadow-teal-glow"
                >
                  <Save className="h-4 w-4" />
                  <span>SAVE CONFIGURATION</span>
                </button>

                {isSupabaseConfigured() && (
                  <button
                    type="button"
                    onClick={handleSeedSupabase}
                    className="flex items-center gap-1.5 text-xs font-mono text-teal border border-teal/40 px-3 py-1.5 rounded hover:bg-teal/10"
                  >
                    <span>🚀 Seed 6 Initial Notes to Supabase</span>
                  </button>
                )}
              </div>

              {seedStatus && (
                <p className="text-xs font-mono text-slate-light mt-2">{seedStatus}</p>
              )}
            </form>

            {/* Quick 2-Minute Setup Checklist */}
            <div className="rounded-xl border border-slate-dark/30 bg-navy-card/20 p-6 space-y-3 text-xs leading-relaxed text-slate">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-lightest flex items-center gap-2">
                <Info className="h-4 w-4 text-teal" />
                <span>2-Minute Setup Instructions</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-light">
                <li>
                  Create a free project at{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal underline"
                  >
                    supabase.com
                  </a>
                  .
                </li>
                <li>
                  Go to <strong>SQL Editor</strong> in the Supabase dashboard.
                </li>
                <li>
                  Paste the contents of{" "}
                  <code className="text-teal bg-navy-darkest px-1.5 py-0.5 rounded">
                    supabase_schema.sql
                  </code>{" "}
                  (located in your project root) and click <strong>RUN</strong>.
                </li>
                <li>
                  Go to <strong>Project Settings → API</strong>, copy the{" "}
                  <strong>Project URL</strong> and <strong>Anon Key</strong>, and paste them above!
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
