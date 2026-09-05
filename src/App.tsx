import { useState, useEffect } from "react";
import { SpotlightEffect } from "./components/SpotlightEffect";
import { HeaderSidebar } from "./components/HeaderSidebar";
import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsCertificationsSection } from "./components/SkillsCertificationsSection";
import { EducationSection } from "./components/EducationSection";
import { Footer } from "./components/Footer";
import { ResumeModal } from "./components/ResumeModal";

export function App() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);

  useEffect(() => {
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
  }, []);

  return (
    <div className="relative bg-navy text-slate font-sans selection:bg-teal selection:text-navy-darkest min-h-screen">
      {/* Background Cursor Glow Spotlight */}
      <SpotlightEffect />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-12">
          {/* Sticky Left Sidebar Header */}
          <HeaderSidebar
            activeSection={activeSection}
            onOpenResumeModal={() => setIsResumeOpen(true)}
          />

          {/* Scrollable Right Main Content */}
          <main id="content" className="pt-20 lg:w-1/2 lg:py-24">
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

      {/* Resume Modal View */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

export default App;
