import { LearningArticle, learningArticles } from "../data/learningsData";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

const LOCAL_CUSTOM_ARTICLES_KEY = "prajjval_portfolio_custom_articles";

// Helper: load client-side custom articles stored in localStorage
function getLocalCustomArticles(): LearningArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_CUSTOM_ARTICLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper: save client-side custom articles to localStorage
function saveLocalCustomArticle(article: LearningArticle) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalCustomArticles();
    const index = existing.findIndex((a) => a.slug === article.slug);
    if (index >= 0) {
      existing[index] = article;
    } else {
      existing.unshift(article);
    }
    localStorage.setItem(LOCAL_CUSTOM_ARTICLES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to save article locally:", err);
  }
}

// Helper: delete client-side custom article
function deleteLocalCustomArticle(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalCustomArticles().filter((a) => a.slug !== slug);
    localStorage.setItem(LOCAL_CUSTOM_ARTICLES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to delete local article:", err);
  }
}

// Map Supabase DB row to LearningArticle
function mapDbRowToArticle(row: Record<string, unknown>): LearningArticle {
  return {
    slug: String(row.slug),
    title: String(row.title),
    category: (row.category as LearningArticle["category"]) || "LLD",
    date: String(row.date),
    readTime: String(row.read_time),
    difficulty: (row.difficulty as LearningArticle["difficulty"]) || "Advanced",
    summary: String(row.summary),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    keyTakeaways: Array.isArray(row.key_takeaways) ? (row.key_takeaways as string[]) : [],
    sections: Array.isArray(row.sections) ? (row.sections as LearningArticle["sections"]) : [],
  };
}

export const learningsService = {
  /**
   * Fetch all learning articles.
   * If Supabase is connected, fetches from database.
   * Falls back seamlessly to seed articles + local drafts.
   */
  async getAllLearnings(): Promise<LearningArticle[]> {
    const supabase = getSupabaseClient();

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("learnings")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapDbRowToArticle);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to static/local data:", err);
      }
    }

    // Fallback: Combine local custom articles with built-in seed articles
    const localCustom = getLocalCustomArticles();
    const staticArticles = learningArticles;

    // Filter out any static articles that were overridden by local custom edits
    const customSlugs = new Set(localCustom.map((a) => a.slug));
    const combined = [...localCustom, ...staticArticles.filter((a) => !customSlugs.has(a.slug))];

    return combined;
  },

  /**
   * Fetch a single article by its slug.
   */
  async getLearningBySlug(slug: string): Promise<LearningArticle | undefined> {
    const all = await this.getAllLearnings();
    return all.find((a) => a.slug === slug);
  },

  /**
   * Publish or update a learning article.
   */
  async saveLearning(article: LearningArticle): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();

    // 1. Always update local storage so user has immediate offline access
    saveLocalCustomArticle(article);

    // 2. If Supabase is active, upsert to database
    if (supabase && isSupabaseConfigured()) {
      try {
        const dbPayload = {
          slug: article.slug,
          title: article.title,
          category: article.category,
          date: article.date,
          read_time: article.readTime,
          difficulty: article.difficulty,
          summary: article.summary,
          tags: article.tags,
          key_takeaways: article.keyTakeaways || [],
          sections: article.sections,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("learnings").upsert(dbPayload, {
          onConflict: "slug",
        });

        if (error) {
          console.error("Supabase upsert error:", error);
          return { success: false, error: error.message };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Database save failed";
        return { success: false, error: msg };
      }
    }

    return { success: true };
  },

  /**
   * Delete an article by slug.
   */
  async deleteLearning(slug: string): Promise<{ success: boolean; error?: string }> {
    deleteLocalCustomArticle(slug);

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from("learnings").delete().eq("slug", slug);
        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to delete from database";
        return { success: false, error: msg };
      }
    }

    return { success: true };
  },

  /**
   * Seed all 6 built-in articles to Supabase with 1-click.
   */
  async seedArticlesToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, count: 0, error: "Supabase is not configured yet." };
    }

    try {
      const payloads = learningArticles.map((article) => ({
        slug: article.slug,
        title: article.title,
        category: article.category,
        date: article.date,
        read_time: article.readTime,
        difficulty: article.difficulty,
        summary: article.summary,
        tags: article.tags,
        key_takeaways: article.keyTakeaways || [],
        sections: article.sections,
      }));

      const { error } = await supabase.from("learnings").upsert(payloads, {
        onConflict: "slug",
      });

      if (error) {
        return { success: false, count: 0, error: error.message };
      }

      return { success: true, count: payloads.length };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Seeding failed";
      return { success: false, count: 0, error: msg };
    }
  },
};
