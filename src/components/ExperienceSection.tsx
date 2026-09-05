import React from "react";
import { portfolioData } from "../data/portfolioData";
import { ArrowUpRight } from "lucide-react";

interface ExperienceSectionProps {
  onOpenResumeModal: () => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  onOpenResumeModal,
}) => {
  const { experiences } = portfolioData;

  return (
    <section
      id="experience"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
      aria-label="Work experience"
    >
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-navy/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-teal lg:sr-only">
          Experience
        </h2>
      </div>

      <div>
        <ol className="interactive-list space-y-12">
          {experiences.map((exp, index) => (
            <li key={index} className="mb-12">
              <div className="interactive-row group relative grid pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4">

                {/* Timeline period */}
                <header
                  className="interactive-period z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-dark sm:col-span-2"
                  aria-label={exp.period}
                >
                  <span className="font-mono text-slate-light/80">
                    {exp.period}
                  </span>
                </header>

                {/* Content */}
                <div className="interactive-content z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-slate-lightest">
                    <div>
                      <a
                        className="inline-flex items-baseline font-medium leading-tight text-slate-lightest hover:text-teal focus-visible:text-teal group/link text-base"
                        href={exp.companyUrl || "#"}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${exp.role} at ${exp.company}`}
                      >
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
                        <span>
                          {exp.role} ·{" "}
                          <span className="inline-block text-teal">
                            {exp.company}
                            {exp.client && (
                              <span className="text-slate-light font-normal text-sm ml-1.5">
                                (Client: {exp.client})
                              </span>
                            )}
                            <ArrowUpRight className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" />
                          </span>
                        </span>
                      </a>
                    </div>
                    <div className="text-xs font-mono text-slate-light mt-1">
                      {exp.location}
                    </div>
                  </h3>

                  {/* Bullet points */}
                  <ul className="mt-3 space-y-2 text-sm leading-normal text-slate">
                    {exp.description.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start">
                        <span className="text-teal mr-2 select-none text-xs mt-1">
                          ▹
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Key Tech Badges */}
                  <ul
                    className="portfolio-tech-list mt-4 flex flex-wrap gap-2"
                    aria-label="Technologies used"
                  >
                    {exp.technologies.map((tech, tIdx) => (
                      <li key={tIdx}>
                        <div className="flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-mono font-medium leading-5 text-teal">
                          {tech}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* View Full Resume link button */}
        <div className="mt-12">
          <button
            onClick={onOpenResumeModal}
            className="inline-flex items-center font-medium leading-tight text-slate-lightest font-mono text-sm group hover:text-teal transition-colors"
          >
            <span>View Full Résumé Details</span>
            <ArrowUpRight className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
          </button>
        </div>
      </div>
    </section>
  );
};
