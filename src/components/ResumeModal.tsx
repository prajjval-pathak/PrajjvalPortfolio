import React from "react";
import { portfolioData } from "../data/portfolioData";
import {
  X,
  Download,
  Printer,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const {
    personal,
    experiences,
    projects,
    certifications,
    skillCategories,
    education,
  } = portfolioData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-navy-darkest/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1b33] border border-teal/30 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light/60 bg-navy/90">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-teal"></span>
            <h3 className="font-mono text-sm font-semibold text-slate-lightest uppercase tracking-wider">
              {personal.name} — Curriculum Vitae
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded hover:bg-navy-light text-slate-light hover:text-teal transition-colors"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-navy-light text-slate-light hover:text-teal transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Resume Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate leading-relaxed font-sans">
          {/* Header info */}
          <div className="border-b border-navy-light/60 pb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-lightest uppercase tracking-wide">
              {personal.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-xs font-mono text-slate-light mt-2">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-teal" /> {personal.phone}
              </span>
              <span>⋄</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal" /> {personal.location}
              </span>
              <span>⋄</span>
              <a
                href={personal.social.email}
                className="flex items-center gap-1 text-teal hover:underline"
              >
                <Mail className="w-3.5 h-3.5" /> {personal.email}
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-teal mt-2">
              <a
                href={personal.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-0.5"
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
              <span>—</span>
              <a
                href={personal.social.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-0.5"
              >
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
              <span>—</span>
              <a
                href={personal.social.leetcode}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-0.5"
              >
                LeetCode <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-teal border-b border-navy-light/40 pb-1 mb-3">
              SKILLS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {skillCategories.map((sc, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-1">
                  <span className="font-semibold text-slate-lightest w-36 shrink-0">
                    {sc.category}:
                  </span>
                  <span className="text-slate-light">
                    {sc.skills.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-teal border-b border-navy-light/40 pb-1 mb-3">
              EXPERIENCE
            </h2>
            <div className="space-y-5 text-xs">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-lightest text-sm">
                      {exp.company}{" "}
                      {exp.client && (
                        <span className="font-normal text-slate-light">
                          (Client: {exp.client})
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-teal text-[11px]">
                      {exp.period}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-slate-light italic mb-2">
                    <span>{exp.role}</span>
                    <span className="font-mono not-italic">{exp.location}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate text-xs leading-relaxed">
                    {exp.description.map((d, dIdx) => (
                      <li key={dIdx}>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-teal border-b border-navy-light/40 pb-1 mb-3">
              PROJECTS
            </h2>
            <div className="space-y-4 text-xs">
              {projects.map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-lightest">
                      {p.title}
                    </span>
                    <span className="font-mono text-teal text-[11px]">
                      Personal Project
                    </span>
                  </div>
                  <p className="text-slate my-1">{p.description}</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-light text-[11px]">
                    {p.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-teal border-b border-navy-light/40 pb-1 mb-3">
                CERTIFICATIONS
              </h2>
              <ul className="space-y-1 text-xs text-slate-light">
                {certifications.map((c, i) => (
                  <li key={i}>
                    • {c.title} ({c.code})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-teal border-b border-navy-light/40 pb-1 mb-3">
                EDUCATION
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((e, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-slate-lightest font-semibold">
                      <span>{e.degree}</span>
                      <span className="font-mono text-teal text-[11px]">
                        {e.period}
                      </span>
                    </div>
                    <p className="text-slate-light">
                      {e.institution}, {e.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-navy-light/60 bg-navy/90 flex justify-end gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-semibold rounded bg-teal text-navy-darkest hover:bg-teal/90 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};
