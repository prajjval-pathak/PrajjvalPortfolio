import React, { useEffect, useState } from "react";
import { portfolioData } from "../data/portfolioData";
import { X, ExternalLink, Loader2 } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { personal } = portfolioData;

  const resumeViewUrl =
    personal.resumeUrl ||
    "https://drive.google.com/file/d/1VPOfpJJ3SzIY6GWe-tCgzGWyeyE-Tna6/view";
  const resumeEmbedUrl =
    personal.resumeEmbedUrl ||
    "https://drive.google.com/file/d/1VPOfpJJ3SzIY6GWe-tCgzGWyeyE-Tna6/preview";

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-darkest/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Resume PDF Viewer"
    >
      <div
        className="relative w-full max-w-5xl h-[88vh] bg-[#0c1b33] border border-teal/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-navy-light/60 bg-navy/95">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal"></span>
            </span>
            <h3 className="font-mono text-xs sm:text-sm font-semibold text-slate-lightest uppercase tracking-wider truncate">
              {personal.name} — Resume (PDF)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resumeViewUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-teal border border-teal/40 hover:bg-teal/10 transition-colors"
              title="Open in Google Drive"
            >
              <span>Open in Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-navy-light text-slate-light hover:text-teal transition-colors"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer Frame */}
        <div className="relative flex-1 w-full h-full bg-[#1e293b]/50">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0c1b33] text-slate-light z-10">
              <Loader2 className="w-8 h-8 text-teal animate-spin" />
              <p className="font-mono text-xs text-teal">
                Loading PDF Resume...
              </p>
            </div>
          )}
          <iframe
            src={resumeEmbedUrl}
            title={`${personal.name} Resume PDF`}
            className="w-full h-full border-0"
            allow="autoplay"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};
