# Prajjval Pathak — Personal Portfolio

A sleek, modern portfolio website inspired by [Brittany Chiang's v4 design](https://v4.brittanychiang.com), tailored for **Prajjval Pathak** (Software Developer 2 at Oracle).

## 🚀 Features

- **Iconic Brittany Chiang Aesthetic**: Dark navy `#0a192f` background, `#64ffda` teal/cyan accents, and slate typography (`Inter` & `Fira Code`).
- **Interactive Mouse Spotlight**: Dynamic radial gradient glow following cursor movement.
- **Split-Screen Desktop Layout**:
  - Sticky Left Sidebar with live section indicator bars that expand as you scroll.
  - Scrollable Right Main Content showcasing About, Experience, Projects, Certifications & Skills, and Education.
- **Resume Modal & Print Preview**: Embedded interactive modal view with one-click print/PDF export.
- **Resume Highlighted**:
  - **Oracle**: SD2 experience (500+ enterprise clients, 8k+ users, 70% SQL performance optimization).
  - **TCS / Humana**: Healthcare authorization platform with C#/.NET Core & React.
  - **Projects**: WealthWise (AI-driven stock analysis with Google Gemini & ASP.NET Core) & Game Discovery App.
  - **Certifications**: Microsoft Azure Developer Associate (AZ-204) & Azure Fundamentals (AZ-900).
- **Responsive & Accessible**: Fully optimized for mobile, tablet, and widescreen desktop layouts.

---

## 🛠️ Tech Stack

- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Vite**
- **Lucide Icons**

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Customizing Data & Links

All content, social links, project repositories, and experiences can be updated directly in [`src/data/portfolioData.ts`](./src/data/portfolioData.ts).

---

## 🔍 SEO & Search Engine Optimization

The portfolio is fully optimized for top search rankings on Google, Bing, and other search engines for queries like **"Prajjval Pathak"**, **"Prajjval Pathak Oracle"**, and related technical skills.

### Key SEO Enhancements

1. **Schema.org JSON-LD Structured Data**: Embedded `Person`, `WebSite`, and `ProfilePage` graphs linking your Oracle role, alma mater, skills, and social profiles (LinkedIn, GitHub, LeetCode) to establish your personal entity knowledge graph.
2. **Social Graph Meta Tags**: Rich Open Graph (OG) and Twitter Card tags for high-converting link previews on LinkedIn, Twitter/X, Discord, Slack, and WhatsApp.
3. **Search Crawlability**:
   - `public/robots.txt` allowing indexing and pointing to the sitemap.
   - `public/sitemap.xml` for fast search bot discovery.
   - `public/site.webmanifest` for mobile PWA indexing signals.
   - `<noscript>` fallback with full semantic content for search bots that do not execute client-side JavaScript.

### How to Submit to Google for Fast Indexing

1. Deploy the site to your production domain or hosting service (e.g. Vercel, Netlify, GitHub Pages, or custom domain).
2. Go to [Google Search Console](https://search.google.com/search-console/).
3. Add your domain property and verify ownership.
4. Go to **Sitemaps** in the left menu and submit `sitemap.xml` (e.g. `https://yourdomain.com/sitemap.xml`).
5. Use the **URL Inspection** tool to request immediate indexing of your root URL.
