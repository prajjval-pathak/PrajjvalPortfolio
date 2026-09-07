import React from "react";
export const AboutSection: React.FC = () => {
  const technologies = [
    "C# / .NET",
    "TypeScript",
    "React / Redux",
    "ASP.NET Core",
    "SQL Server",
    "Oracle PL/SQL",
  ];

  return (
    <section
      id="about"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
      aria-label="About me"
    >
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-navy/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-teal lg:sr-only">
          About
        </h2>
      </div>

      <div className="about-heading hidden items-center gap-4 lg:flex">
        <span className="font-mono text-base font-medium text-teal">01.</span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-lightest">
          About Me
        </h2>
        <span className="about-heading-rule" aria-hidden="true" />
      </div>

      <div className="about-layout mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(190px,0.65fr)] lg:gap-12">
        <div className="order-2 space-y-5 text-base leading-relaxed text-slate lg:order-1">
          <p>
            I’m Prajjval, a full-stack software developer who builds
            <span className="about-highlight">
              {" "}
              scalable enterprise platforms
            </span>
            , resilient cloud backends, and thoughtful web experiences. I’m
            currently a Software Developer 2 at
            <span className="about-highlight"> Oracle</span>.
          </p>
          <p>
            My work spans C#/.NET, React, TypeScript, SQL Server, and Oracle
            19c. I enjoy turning complex operational workflows into secure,
            maintainable products through layered APIs,
            <span className="about-highlight"> multi-tenant architecture</span>,
            and role-based access control.
          </p>
          <p>
            Recently, I’ve focused on high-scale risk-management systems,
            performance-focused SQL, and AI-enabled financial tooling. I care
            about clear engineering decisions, reliable delivery, and products
            that make difficult work feel simpler.
          </p>

          <div className="pt-2">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-light">
              Technologies I work with
            </p>
            <ul className="about-tech-grid mt-4 font-mono text-sm text-slate-light">
              {technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="about-photo-frame order-1 mx-auto w-full max-w-[15rem] lg:order-2 lg:mt-2 lg:max-w-none">
          <picture>
            <source
              media="(max-width: 1023px)"
              srcSet="/images/prajjval-pathak-portrait.png"
            />
            <img
              src="/images/prajjval-pathak.png"
              alt="Prajjval Pathak — Software Developer 2 at Oracle"
              title="Prajjval Pathak — Software Developer 2 at Oracle"
              className="about-photo"
              loading="eager"
            />
          </picture>
        </div>
      </div>
    </section>
  );
};
