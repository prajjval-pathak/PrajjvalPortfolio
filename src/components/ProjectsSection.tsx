import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { GithubIcon } from './Icons';

export const ProjectsSection: React.FC = () => {
  const { projects } = portfolioData;

  return (
    <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Selected projects">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-navy/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-teal lg:sr-only">
          Projects
        </h2>
      </div>

      <div>
        <ul className="interactive-list space-y-12">
          {projects.map((project, index) => (
            <li key={index} className="mb-12">
              <div className="interactive-row group relative grid gap-4 pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4">

                {/* Left decorative / project tag */}
                <div className="z-10 sm:col-span-2">
                  <div className="project-index rounded border border-navy-light/80 bg-navy-card/80 p-3 text-center shadow-sm sm:text-left">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-teal block font-semibold">
                      {project.featured ? 'Featured Project' : 'Architecture'}
                    </span>
                    <span className="text-xs text-slate-light font-mono mt-1 block">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Right project content */}
                <div className="interactive-content z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-slate-lightest">
                    <div className="flex items-center justify-between">
                      <a
                        className="inline-flex items-baseline font-semibold leading-tight text-slate-lightest hover:text-teal focus-visible:text-teal group/link text-lg"
                        href={project.liveUrl || '#'}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${project.title} live deployment`}
                      >
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
                        <span>
                          {project.title}{' '}
                          <ArrowUpRight className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px text-teal" />
                        </span>
                      </a>

                      <div className="flex items-center gap-3 relative z-20">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-slate hover:text-teal transition-colors"
                            aria-label="GitHub Repository"
                            title="View Source on GitHub"
                          >
                            <GithubIcon className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {project.subtitle && (
                      <div className="text-xs font-mono text-teal/90 mt-1">
                        {project.subtitle}
                      </div>
                    )}
                  </h3>

                  <p className="mt-3 text-sm leading-normal text-slate">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <ul className="mt-3 space-y-1 text-xs leading-normal text-slate-light">
                    {project.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start">
                        <Sparkles className="w-3 h-3 text-teal shrink-0 mr-2 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technology Badges */}
                  <ul className="portfolio-tech-list mt-4 flex flex-wrap gap-2" aria-label="Technologies used">
                    {project.technologies.map((tech, tIdx) => (
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
        </ul>
      </div>
    </section>
  );
};
