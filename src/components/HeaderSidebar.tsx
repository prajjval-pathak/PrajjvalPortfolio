import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Mail, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './Icons';

interface HeaderSidebarProps {
  activeSection: string;
  onOpenResumeModal: () => void;
}

export const HeaderSidebar: React.FC<HeaderSidebarProps> = ({ activeSection, onOpenResumeModal }) => {
  const { personal } = portfolioData;

  const navItems = [
    { id: 'about', label: 'ABOUT' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'skills-certifications', label: 'SKILLS & CERTS' },
    { id: 'education', label: 'EDUCATION' },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <div>
        {/* Name & Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-lightest sm:text-5xl">
          <a href="#" className="hover:text-teal transition-colors duration-200">
            {personal.name}
          </a>
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-light sm:text-xl flex items-center gap-2">
          <span>{personal.title}</span>
        </h2>
        <p className="mt-4 max-w-xs leading-normal text-slate text-sm sm:text-base">
          {personal.tagline}
        </p>

        {/* Status Indicator */}
        <div className="mt-6 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal"></span>
          </span>
          <span className="text-xs font-mono text-slate-light tracking-wide">
            Software Developer 2 · Oracle Bengaluru
          </span>
        </div>

        {/* Navigation */}
        <nav className="nav hidden lg:block" aria-label="In-page jump links">
          <ul className="mt-16 w-max space-y-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="group flex items-center py-1 text-left focus:outline-none"
                  >
                    <span
                      className={`nav-indicator mr-4 h-px transition-all duration-300 motion-reduce:transition-none ${
                        isActive
                          ? 'w-16 bg-teal'
                          : 'w-8 bg-slate-dark group-hover:w-16 group-hover:bg-slate-lightest'
                      }`}
                    />
                    <span
                      className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-200 ${
                        isActive
                          ? 'text-teal'
                          : 'text-slate group-hover:text-slate-lightest'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Social Links & Resume Button */}
      <div className="mt-8 flex flex-col gap-6">
        <button
          onClick={onOpenResumeModal}
          className="group inline-flex items-center gap-2 w-fit px-4 py-2 text-xs font-mono font-semibold tracking-wider text-teal border border-teal/40 rounded hover:bg-teal/10 transition-all duration-200"
        >
          <span>VIEW RESUME</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        <ul className="ml-1 flex items-center gap-5 text-slate" aria-label="Social media">
          <li>
            <a
              className="block hover:text-teal hover:-translate-y-1 transition-all duration-200"
              href={personal.social.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub (opens in a new tab)"
              title="GitHub"
            >
              <GithubIcon className="h-6 w-6" />
            </a>
          </li>
          <li>
            <a
              className="block hover:text-teal hover:-translate-y-1 transition-all duration-200"
              href={personal.social.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn (opens in a new tab)"
              title="LinkedIn"
            >
              <LinkedinIcon className="h-6 w-6" />
            </a>
          </li>
          <li>
            <a
              className="block hover:text-teal hover:-translate-y-1 transition-all duration-200"
              href={personal.social.leetcode}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LeetCode (opens in a new tab)"
              title="LeetCode"
            >
              <LeetCodeIcon className="h-5 w-5" />
            </a>
          </li>
          <li>
            <a
              className="block hover:text-teal hover:-translate-y-1 transition-all duration-200"
              href={personal.social.email}
              aria-label="Email"
              title="Email Prajjval"
            >
              <Mail className="h-6 w-6" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};
