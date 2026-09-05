import React from "react";
import { portfolioData } from "../data/portfolioData";
import { Award, CheckCircle2 } from "lucide-react";

export const SkillsCertificationsSection: React.FC = () => {
  const { certifications, skillCategories } = portfolioData;

  return (
    <section
      id="skills-certifications"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
      aria-label="Skills and Certifications"
    >
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-navy/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-teal lg:sr-only">
          Skills & Certifications
        </h2>
      </div>

      <div className="space-y-10">
        {/* Certifications Card Grid */}
        <div>
          <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-slate-lightest mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-teal" />
            <span>Cloud Certifications</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="relative rounded-lg border border-navy-light/90 bg-navy-card/50 p-4 transition-all duration-200 hover:border-teal/50 hover:bg-navy-card/80 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded font-mono text-[11px] font-bold tracking-wider text-teal bg-teal/10 px-2 py-0.5 mb-1.5">
                      {cert.code}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-lightest group-hover:text-teal transition-colors">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-slate-light mt-1 font-mono">
                      Issuer: {cert.issuer}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-teal/80 shrink-0 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categorized Skills */}
        <div>
          <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-slate-lightest mb-4">
            Technical Arsenal
          </h3>
          <div className="space-y-6">
            {skillCategories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-navy-card/30 border border-navy-light/40 p-4"
              >
                <h4 className="text-xs font-mono font-semibold text-teal tracking-wider uppercase mb-3">
                  // {cat.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center rounded-md bg-navy-light/50 hover:bg-teal/10 px-2.5 py-1 text-xs font-mono text-slate-lightest hover:text-teal border border-slate-dark/30 hover:border-teal/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
