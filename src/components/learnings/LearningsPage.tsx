import React, { useState, useEffect } from "react";
import { learningArticles, LearningArticle } from "../../data/learningsData";
import { learningsService } from "../../services/learningsService";
import { LearningsList } from "./LearningsList";
import { LearningArticleView } from "./LearningArticleView";

interface LearningsPageProps {
  onBackToPortfolio: () => void;
  initialSlug?: string | null;
}

export const LearningsPage: React.FC<LearningsPageProps> = ({
  onBackToPortfolio,
  initialSlug,
}) => {
  const [articles, setArticles] = useState<LearningArticle[]>(learningArticles);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);

  // Load latest articles from Supabase / localStorage on mount
  useEffect(() => {
    let isMounted = true;
    learningsService.getAllLearnings().then((data) => {
      if (isMounted && data && data.length > 0) {
        setArticles(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync with URL hash
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#learnings/")) {
        const slug = hash.replace("#learnings/", "").trim();
        setSelectedSlug(slug || null);
      } else if (hash === "#learnings" || hash.startsWith("#learnings")) {
        setSelectedSlug(null);
      }
    };

    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const handleSelectArticle = (slug: string) => {
    setSelectedSlug(slug);
    window.location.hash = `#learnings/${slug}`;
  };

  const handleBackToList = () => {
    setSelectedSlug(null);
    window.location.hash = "#learnings";
  };

  const currentArticle: LearningArticle | undefined = selectedSlug
    ? articles.find((a) => a.slug === selectedSlug) ||
      learningArticles.find((a) => a.slug === selectedSlug)
    : undefined;

  if (selectedSlug && currentArticle) {
    return (
      <LearningArticleView
        article={currentArticle}
        onBack={handleBackToList}
        onSelectArticle={handleSelectArticle}
      />
    );
  }

  return (
    <LearningsList
      articles={articles}
      onSelectArticle={handleSelectArticle}
      onBackToPortfolio={onBackToPortfolio}
    />
  );
};
