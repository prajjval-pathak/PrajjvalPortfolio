import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { CodeSnippet } from "../../data/learningsData";

interface CodeSnippetBlockProps {
  snippet: CodeSnippet;
}

export const CodeSnippetBlock: React.FC<CodeSnippetBlockProps> = ({ snippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-slate-dark/60 bg-navy-darkest shadow-card">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-dark/40 bg-navy-card/80 px-4 py-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70 inline-block" />
          </div>
          <span className="ml-2 text-slate-light font-medium">
            {snippet.title || snippet.language.toUpperCase()}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 rounded px-2.5 py-1 text-slate hover:text-teal hover:bg-slate-dark/30 transition-all text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-teal" />
              <span className="text-teal font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-light leading-relaxed">
        <pre className="selection:bg-teal/20 selection:text-teal">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
};
