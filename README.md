# Frankencoin Website

Official website for Frankencoin (ZCHF), a collateralized, oracle-free stablecoin that tracks the Swiss franc.

## 🌟 About Frankencoin

Frankencoin brings the strength of the Swiss franc on-chain as an ERC-20 token. In the last 50 years, the Swiss franc climbed more than 240% against the dollar, and now this stability is available in DeFi through Frankencoin (ZCHF).

The website is designed to be accessible to non-technical audiences, traditional finance professionals, and journalists—focusing on real-world use cases and practical applications rather than purely technical or crypto-focused messaging.

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/) v5 - Static site generator with server-side rendering
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- **Interactivity**: [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework for client-side reactivity
- **Deployment**: Node.js standalone mode via [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/)
- **Language**: TypeScript for type safety

## 📁 Project Structure

```text
/
├── public/
│   ├── images/           # Static images, logos, and assets
│   ├── fonts/            # Custom fonts (Avenir family)
│   └── favicon.svg
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── BadgeContainer/
│   │   ├── ChainCard/
│   │   ├── Tooltip/
│   │   ├── TabsMenu/
│   │   ├── MediaArticlesContainer/
│   │   ├── VideoCarouselContainer/
│   │   ├── FAQContainer/
│   │   └── Layout/       # Header, Footer, Section, Base
│   ├── content/          # JSON data files (content-first architecture)
│   │   ├── index.json            # Homepage content (hero, features, etc.)
│   │   ├── media.json            # Articles, videos, and metadata overrides
│   │   ├── use-cases.json        # Real-world use cases
│   │   ├── faq.json              # Frequently asked questions
│   │   ├── governance.json       # Governance & FPS page content
│   │   ├── ecosystem.json        # Ecosystem page content
│   │   ├── token.json            # Token page content
│   │   ├── what-is-frankencoin.json
│   │   └── shared/               # Shared content across pages
│   │       ├── site.json         # Site metadata & SEO
│   │       ├── nav.json          # Navigation config
│   │       ├── footer.json       # Footer content
│   │       └── ui.json           # UI text labels
│   ├── pages/            # Route pages
│   │   ├── index.astro           # Homepage
│   │   ├── governance.astro      # Governance & FPS (uses governance.json)
│   │   ├── ecosystem.astro       # Ecosystem overview
│   │   ├── token.astro           # Token information
│   │   ├── use-cases.astro       # Real-world use cases
│   │   └── what-is-frankencoin.astro
│   ├── styles/           # Global styles
│   │   ├── global.css
│   │   ├── tokens.css    # Design tokens (CSS custom properties)
│   │   ├── typography.css
│   │   └── fonts.css
│   └── utils/            # Utility functions
│       └── fetchOgData.ts        # Open Graph metadata fetcher
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build production site to `./dist/`               |
| `npm run preview`         | Preview production build locally                 |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🎨 Key Features

### Pages

- **Homepage** (`/`): Hero section, live stats, what is Frankencoin, how it works, foundation/FPS overview, trust & security, media articles, videos, and FAQs
- **Governance** (`/governance`): FPS information, governance model, how to acquire FPS, and participation details
- **Use Cases** (`/use-cases`): Real-world applications categorized by Payments, Business, and DeFi with partner showcases and filterable interface
- **What is Frankencoin** (`/what-is-frankencoin`): Educational content about the stablecoin for non-technical audiences
- **Token** (`/token`): ZCHF token information across different blockchain networks
- **Ecosystem** (`/ecosystem`): Overview of the Frankencoin ecosystem
- **FPS** (`/fps`): Frankencoin Pool Shares detailed information

### Interactive Components

- **Tooltip Component**: Copy-to-clipboard functionality with Alpine.js state management
- **TabMenu Component**: Tabbed interface for system workflow visualization
- **ChainCard Component**: Display blockchain network information
- **BadgeContainer**: Responsive stats display with hover effects
- **MediaArticlesContainer**: Carousel for media articles with Open Graph metadata fetching
- **Use Cases Filtering**: Category-based filtering with Alpine.js (Payments, Business, DeFi)

### Content Management

- **Content-First Architecture**: All page content separated into dedicated JSON files under `src/content/`
  - `media.json` - Articles, videos, and metadata overrides
  - `use-cases.json` - Real-world use cases with partner information
  - `faq.json` - Frequently asked questions by category
  - `governance.json` - Governance and FPS content
- **Separation of Content and Logic**: Content updates don't require touching component code
- **Dynamic Data Fetching**: Live stats from Frankencoin API at build time
- **Open Graph Metadata**: Automatic fetching of article metadata with manual override support

### Design System

- **Custom Typography**: Avenir font family with predefined type scales
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Brand Colors**: Swiss-inspired color palette via CSS custom properties
- **Component Library**: Reusable, composable components with TypeScript interfaces

## 🔗 Important Links

- **Live Website**: [frankencoin.com](https://frankencoin.com)
- **Web App**: [app.frankencoin.com](https://app.frankencoin.com/)
- **Documentation**: [docs.frankencoin.com](https://docs.frankencoin.com/)
- **API**: [api.frankencoin.com](https://api.frankencoin.com/)
- **GitHub**: [Frankencoin Organization](https://github.com/Frankencoin-ZCHF)
- **DeFiLlama**: [defillama.com/protocol/frankencoin](https://defillama.com/protocol/frankencoin)
- **CoinGecko**: [coingecko.com/en/coins/frankencoin](https://www.coingecko.com/en/coins/frankencoin)

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/Frankencoin-ZCHF/frankencoin-site.git
cd frankencoin-site

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:3000` (or the next available port if 3000 is in use).

### Building for Production

```bash
# Build the site
npm run build

# Preview the build
npm run preview
```

### Environment Variables

- `SITE`: Base URL for the site (default: `https://frankencoin.com`)
- `PORT`: Development server port (default: `3000`)

## 📝 Content Management

All website content is managed through JSON files in `src/content/`. This content-first architecture separates content from code, making updates simple and safe.

### Adding New Articles

Articles appear in the "In the Media" section on the homepage.

**File:** `src/content/media.json`

1. Add the article URL to the `articles` array:

```json
{
  "articles": [
    "https://example.com/new-article-url",
    "https://existing-article.com/..."
  ]
}
```

2. The system automatically fetches Open Graph metadata (title, description, image, etc.) from the URL at build time.

3. **Optional:** To override specific metadata fields, add an entry to the `articleMetadata` object:

```json
{
  "articleMetadata": {
    "https://example.com/new-article-url": {
      "title": "Custom Title Override",
      "description": "Custom description...",
      "image": "https://example.com/custom-image.jpg",
      "publishedDate": "Jan 15, 2026",
      "siteName": "Publication Name"
    }
  }
}
```

**Note:** Only include fields you want to override. The system will use fetched Open Graph data for any fields not specified.

### Adding New Videos

Videos appear in the "Frankencoin Explained" section on the homepage.

**File:** `src/content/media.json`

Add YouTube video URLs to the `videos` array:

```json
{
  "videos": [
    "https://www.youtube.com/watch?v=VIDEO_ID",
    "https://youtu.be/ANOTHER_VIDEO_ID"
  ]
}
```

The video carousel will automatically display the new videos.

### Adding New Use Cases

Use cases are displayed on the `/use-cases` page with category filtering.

**File:** `src/content/use-cases.json`

Add a new use case to the `cases` array:

```json
{
  "cases": [
    {
      "category": "Payments",
      "title": "New Use Case Title",
      "description": "Description of the use case...",
      "image": "/images/use-case-image.webp",
      "logo": "/images/partner-logo.svg",
      "partnerName": "Partner Company Name",
      "link": "https://partner-website.com"
    }
  ]
}
```

**Available categories:** `Payments`, `Business`, `DeFi`

### Managing FAQs

FAQs are organized by category and displayed on the homepage.

**File:** `src/content/faq.json`

Add a new question to an existing category:

```json
{
  "categories": [
    {
      "category": "Basics",
      "questions": [
        {
          "question": "Your new question?",
          "answer": "Your answer here. You can use [markdown links](https://example.com) in answers."
        }
      ]
    }
  ]
}
```

Or add a new category:

```json
{
  "categories": [
    {
      "category": "New Category Name",
      "questions": [
        {
          "question": "First question in new category?",
          "answer": "Answer with [markdown links](https://example.com) supported."
        }
      ]
    }
  ]
}
```

**Markdown support:** Use `[text](url)` for links in answers. They'll automatically open in new tabs.

### Updating Homepage Content

**File:** `src/content/index.json`

The homepage content includes:
- `hero` - Hero section with title, subtitle, and CTA
- `stats` - Live statistics (fetched from API at build time)
- `what_is` - "What is Frankencoin" section
- `core_features` - Feature cards
- `how_it_works` - How it works explanation
- `foundation` - FPS and foundation information
- `trust_security` - Trust & security section
- `in_the_media` - Media section headers
- `videos` - Video section headers

Edit the relevant section in the JSON file to update content.

### Updating Governance Page

**File:** `src/content/governance.json`

The governance page includes:
- `header` - Page title, subtitle, image, and CTA buttons
- `caps` - FPS metrics (price, supply, market cap)
- `stats_list` - Reserve statistics
- `sections` - Content sections explaining governance

To add a new CTA button:

```json
{
  "header": {
    "cta": [
      {
        "label": "Button Text",
        "href": "https://app.frankencoin.com/path",
        "external": true
      }
    ]
  }
}
```

### Content Best Practices

1. **Always validate JSON syntax** before committing (use a JSON validator or your IDE)
2. **Use meaningful names** for images and upload them to `/public/images/`
3. **Keep descriptions concise** and accessible to non-technical audiences
4. **Test locally** after content changes to verify formatting
5. **Use relative links** (`/#section-id`) for internal navigation
6. **Use absolute URLs** with `https://` for external links
7. **Optimize images** before uploading (use `.webp` format when possible)

### Live Data vs Static Content

Some data is fetched live at build time:

- **Homepage stats** (TVL, Total Supply, FPS Market Cap) - from `https://api.frankencoin.com/ecosystem/frankencoin/info`
- **Governance metrics** (FPS Price, Supply, Reserve data) - from `https://api.frankencoin.com/ecosystem/fps/info`
- **Article metadata** - from Open Graph tags on article URLs

These update automatically when you rebuild the site.

## 🔧 Quick Reference

Common content management tasks:

| Task | File | Action |
|------|------|--------|
| Add article | `src/content/media.json` | Add URL to `articles` array |
| Add video | `src/content/media.json` | Add YouTube URL to `videos` array |
| Override article metadata | `src/content/media.json` | Add entry to `articleMetadata` object |
| Add use case | `src/content/use-cases.json` | Add object to `cases` array |
| Add FAQ | `src/content/faq.json` | Add question to appropriate category |
| Update hero text | `src/content/index.json` | Edit `hero` section |
| Update governance CTAs | `src/content/governance.json` | Edit `header.cta` array |
| Update navigation | `src/content/shared/nav.json` | Edit `links` array |
| Update site metadata | `src/content/shared/site.json` | Edit SEO fields |

After making changes, rebuild the site to see updates.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly locally
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
