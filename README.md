# Frankencoin Website

Official website for Frankencoin (ZCHF), a collateralized, oracle-free stablecoin that tracks the Swiss franc.

## 🌟 About Frankencoin

Frankencoin brings the strength of the Swiss franc on-chain as an ERC-20 token. In the last 50 years, the Swiss franc climbed more than 240% against the dollar, and now this stability is available in DeFi through Frankencoin (ZCHF).

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator with component islands
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Interactivity**: [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework
- **Deployment**: [Vercel](https://vercel.com/) - Serverless deployment platform
- **Language**: TypeScript for type safety

## Development Environments

- **Main**: [main](https://github.com/DinaRocio/frankencoin-site/tree/main)
- **Sandbox**: [sandbox](https://github.com/DinaRocio/frankencoin-site/tree/sandbox) (for testing new features)

## 📁 Project Structure

```text
/
├── public/
│   ├── images/           # Static images and assets
│   ├── fonts/           # Custom fonts (Avenir family)
│   └── favicon.svg
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── BadgeContainer/
│   │   ├── ChainCard/
│   │   ├── Tooltip/
│   │   ├── TabsMenu/
│   │   └── Layout/
│   ├── content/         # JSON data files
│   │   ├── index.json   # Homepage content
│   │   ├── ecosystem.json
│   │   └── fps.json
│   └── pages/           # Route pages
│       ├── index.astro  # Homepage
│       ├── ecosystem.astro
│       └── fps.astro
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🎨 Key Features

### Interactive Components

- **Tooltip Component**: Copy-to-clipboard functionality with Alpine.js
- **TabMenu Component**: Tabbed interface for system workflow visualization
- **ChainCard Component**: Display blockchain network information
- **BadgeContainer**: Responsive stats display with hover effects

### Content Management

- **JSON-based Content**: All content stored in structured JSON files

### Design System

- **Custom Typography**: Avenir font family implementation
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Brand Colors**: Swiss-inspired color palette
- **Component Library**: Reusable, composable components

## 🔗 Important Links

- **Live Website**: [frankencoin.com](https://frankencoin.com)
- **GitHub**: [Frankencoin Organization](https://github.com/Frankencoin-ZCHF)

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd frankencoin-site

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the site
npm run build

# Preview the build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
