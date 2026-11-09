import { useState, useEffect, lazy, Suspense } from "react";
import { SpotlightEffect } from "./components/SpotlightEffect";
import { HeaderSidebar } from "./components/HeaderSidebar";
import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsCertificationsSection } from "./components/SkillsCertificationsSection";
import { EducationSection } from "./components/EducationSection";
import { Footer } from "./components/Footer";
import { ResumeModal } from "./components/ResumeModal";
import { BookOpen, ArrowRight } from "lucide-react";

const LearningsPage = lazy(() =>
  import("./components/learnings/LearningsPage").then((m) => ({
    default: m.LearningsPage,
  }))
);

const AdminPortal = lazy(() =>
  import("./components/admin/AdminPortal").then((m) => ({
    default: m.AdminPortal,
  }))
);

export function App() {
  const [view, setView] = useState<"portfolio" | "learnings" | "admin">(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#admin")) return "admin";
    if (hash.startsWith("#learnings")) return "learnings";
    return "portfolio";
  });
  const [activeSection, setActiveSection] = useState<string>("about");
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);

  // Sync route with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#admin")) {
        setView("admin");
      } else if (hash.startsWith("#learnings")) {
        setView("learnings");
      } else {
        setView("portfolio");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Section observer for single-page portfolio scrolling
  useEffect(() => {
    if (view !== "portfolio") return;

    const sectionIds = [
      "about",
      "experience",
      "projects",
      "skills-certifications",
      "education",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [view]);

  const handleNavigateToLearnings = (slug?: string) => {
    window.location.hash = slug ? `#learnings/${slug}` : "#learnings";
    setView("learnings");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToPortfolio = () => {
    window.location.hash = "#";
    setView("portfolio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative bg-navy text-slate font-sans selection:bg-teal selection:text-navy-darkest min-h-screen">
      {/* Background Cursor Glow Spotlight */}
      <SpotlightEffect />

      {view === "admin" ? (
        <Suspense
          fallback={
            <div className="min-h-screen bg-navy flex items-center justify-center text-teal font-mono text-xs animate-pulse">
              Loading Admin Studio...
            </div>
          }
        >
          <AdminPortal
            onBackToPortfolio={handleBackToPortfolio}
            onNavigateToLearnings={handleNavigateToLearnings}
          />
        </Suspense>
      ) : view === "learnings" ? (
        <Suspense
          fallback={
            <div className="min-h-screen bg-navy flex items-center justify-center text-teal font-mono text-xs animate-pulse">
              Loading Learnings & Tech Notes...
            </div>
          }
        >
          <LearningsPage onBackToPortfolio={handleBackToPortfolio} />
        </Suspense>
      ) : (
        <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
          <div className="lg:flex lg:justify-between lg:gap-12">
            {/* Sticky Left Sidebar Header */}
            <HeaderSidebar
              activeSection={activeSection}
              onOpenResumeModal={() => setIsResumeOpen(true)}
              onNavigateToLearnings={handleNavigateToLearnings}
            />

            {/* Scrollable Right Main Content */}
            <main id="content" className="pt-20 lg:w-1/2 lg:py-24">
              {/* Digital Garden / Learnings Highlight Banner */}
              <div
                onClick={() => handleNavigateToLearnings()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleNavigateToLearnings();
                  }
                }}
                className="mb-12 group cursor-pointer rounded-xl border border-teal/30 bg-teal/5 p-4 sm:p-5 hover:border-teal/60 hover:bg-teal/10 transition-all duration-300 shadow-card"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-lg bg-teal/20 p-2.5 text-teal shrink-0 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal">
                          Learnings & Digital Garden
                        </span>
                        <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-mono text-teal font-semibold">
                          NEW
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-slate-light leading-relaxed">
                        Deep-dives on{" "}
                        <span className="text-teal font-medium">LLD</span>,{" "}
                        <span className="text-teal font-medium">HLD</span>,{" "}
                        <span className="text-teal font-medium">DS</span>,{" "}
                        <span className="text-teal font-medium">AI & RAG</span>,{" "}
                        <span className="text-teal font-medium">.NET</span>, and{" "}
                        <span className="text-teal font-medium">JS</span>.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-teal shrink-0 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

              <AboutSection />
              <ExperienceSection
                onOpenResumeModal={() => setIsResumeOpen(true)}
              />
              <ProjectsSection />
              <SkillsCertificationsSection />
              <EducationSection />
              <Footer />
            </main>
          </div>
        </div>
      )}

      {/* Resume Modal View */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

export default App;
