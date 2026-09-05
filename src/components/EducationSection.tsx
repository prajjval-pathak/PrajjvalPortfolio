import React from "react";
import { portfolioData } from "../data/portfolioData";
import { GraduationCap } from "lucide-react";

export const EducationSection: React.FC = () => {
  const { education } = portfolioData;

  return (
    <section
      id="education"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
      aria-label="Education"
    >
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-navy/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-teal lg:sr-only">
          Education
        </h2>
      </div>

      <div className="space-y-6">
        {education.map((edu, idx) => (
          <div
            key={idx}
            className="group relative rounded-lg border border-navy-light/60 bg-navy-card/40 p-5 transition-all hover:border-teal/40 hover:bg-navy-card/70"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-md bg-teal/10 text-teal shrink-0 mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-base font-semibold text-slate-lightest group-hover:text-teal transition-colors">
                    {edu.degree}
                  </h3>
                  <span className="text-xs font-mono text-teal/80 mt-1 sm:mt-0">
                    {edu.period}
                  </span>
                </div>
                <p className="text-sm text-slate-light mt-1 font-medium">
                  {edu.institution}
                </p>
                <p className="text-xs font-mono text-slate mt-0.5">
                  {edu.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
