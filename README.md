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
│   │   └── Layout/       # Header, Footer, Section, Base
│   ├── content/          # JSON data files
│   │   ├── index.json            # Homepage content
│   │   ├── ecosystem.json        # Ecosystem page content
│   │   ├── fps.json              # FPS page content
│   │   ├── token.json            # Token page content
│   │   ├── what-is-frankencoin.json
│   │   └── shared/               # Shared content
│   │       ├── site.json         # Site metadata
│   │       └── nav.json          # Navigation config
│   ├── pages/            # Route pages
│   │   ├── index.astro           # Homepage
│   │   ├── ecosystem.astro       # Ecosystem overview
│   │   ├── fps.astro             # Frankencoin Pool Shares
│   │   ├── token.astro           # Token information
│   │   ├── use-cases.astro       # Real-world use cases
│   │   └── what-is-frankencoin.astro
│   ├── styles/           # Global styles
│   │   ├── global.css
│   │   ├── tokens.css    # Design tokens (CSS custom properties)
│   │   ├── typography.css
│   │   └── fonts.css
│   └── utils/            # Utility functions
│       └── fetchOgData.ts
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

- **Homepage**: Hero section, live stats, what is Frankencoin, how it works, use cases overview
- **Use Cases**: Real-world applications in Payments, Business, and DeFi with partner showcases
- **What is Frankencoin**: Educational content about the stablecoin
- **Token**: Information about ZCHF token
- **Ecosystem**: Overview of the Frankencoin ecosystem
- **FPS**: Frankencoin Pool Shares information

### Interactive Components

- **Tooltip Component**: Copy-to-clipboard functionality with Alpine.js state management
- **TabMenu Component**: Tabbed interface for system workflow visualization
- **ChainCard Component**: Display blockchain network information
- **BadgeContainer**: Responsive stats display with hover effects
- **MediaArticlesContainer**: Carousel for media articles with Open Graph metadata fetching
- **Use Cases Filtering**: Category-based filtering with Alpine.js (Payments, Business, DeFi)

### Content Management

- **JSON-based Content**: All page content stored in structured JSON files under `src/content/`
- **Separation of Content and Logic**: Content updates don't require touching component code
- **Dynamic Data Fetching**: Live stats from Frankencoin API at build time
- **Open Graph Metadata**: Automatic fetching of article metadata for media section

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

## 📝 Content Updates

To update content on the website:

1. Navigate to the appropriate JSON file in `src/content/`
2. Edit the content following the existing structure
3. Build and preview locally to verify changes
4. Commit and push to deploy

All text content is stored in JSON files, making it easy to update without modifying component code.

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
