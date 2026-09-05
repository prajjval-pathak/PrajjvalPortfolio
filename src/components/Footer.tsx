import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="max-w-md pb-16 text-xs text-slate-dark sm:pb-0">
      <p className="leading-relaxed">
        Designed & developed by{" "}
        <span className="text-slate-light font-medium">Prajjval Pathak</span>.
        Built with{" "}
        <a
          href="https://react.dev/"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-slate-light hover:text-teal focus-visible:text-teal"
        >
          React
        </a>{" "}
        and{" "}
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-slate-light hover:text-teal focus-visible:text-teal"
        >
          Tailwind CSS
        </a>
        , inspired by{" "}
        <a
          href="https://v4.brittanychiang.com"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-slate-light hover:text-teal focus-visible:text-teal underline decoration-teal/30"
        >
          Brittany Chiang&apos;s v4 design
        </a>
        . Rendered in the Inter and Fira Code typefaces.
      </p>
    </footer>
  );
};
