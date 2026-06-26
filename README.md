# Frontend Utility Suite

A production-grade single-page application (SPA) featuring three integrated utility tools — **Task Manager**, **Weather Dashboard**, and **Quiz Platform** — built entirely with vanilla JavaScript (ES6+ modules), semantic HTML5, and modern CSS3 with Tailwind CSS.

> **Live Demo:** [frontend-utility-suite.vercel.app](https://frontend-utility-suite.vercel.app)

---

## ✨ Features

### 📋 Task Manager
- Full **CRUD** (Create, Read, Update, Delete) with modal-based forms
- **Search & Filter** — real-time fuzzy search across titles, descriptions, and tags
- **Priority system** (High / Medium / Low) with color-coded badges
- **Status tabs** (All / Pending / Completed) with sort options
- **Overdue detection** — auto-highlights tasks past their due date
- **Tag system** — free-form categorization with inline display
- **Persistent storage** — all data synced instantly to `localStorage`

### 🌤️ Weather Dashboard
- **Real-time weather** via OpenWeatherMap REST API (free tier)
- **Mock data fallback** — 12 preset cities + randomized data generation with realistic latency simulation
- **5-day forecast** — horizontal scrollable grid with daily trends
- **Detailed metrics** — temperature, humidity, wind speed, UV index, feels-like temp
- **Search history** — last 5 cities tracked, clickable for instant re-fetch
- **Dynamic weather icons** — SVG icons mapped to weather conditions
- **API key configuration** — optional; app works fully without it

### 🧠 Quiz Platform
- **Two topics** — Frontend Web Development & General Trivia (30 questions total)
- **Three difficulty levels** — Easy (20s), Medium (15s), Hard (10s) per question
- **Real-time countdown timer** — SVG circular progress indicator with color transition
- **Instant feedback** — correct (green) / incorrect (red) highlighting after each answer
- **Progress tracking** — animated progress bar with question counter
- **Detailed results** — score, accuracy %, time taken, color-coded performance tier
- **Past performance** — history table with accuracy trends over time

### 🎨 Global UI/UX
- **Dark / Light mode** — persistent toggle with smooth transitions
- **Toast notification system** — 4 types (success, error, info, warning) with slide animations
- **Reusable modal component** — ESC/overlay dismiss, animated transitions
- **Collapsible sidebar** — responsive mobile navigation with backdrop overlay
- **Hash-based SPA routing** — seamless page transitions without reloads
- **Event delegation** — optimized DOM event handling across all interactive lists
- **Error handling** — try/catch on all API calls and localStorage operations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | None — Vanilla JavaScript (ES6+) |
| **Styling** | Tailwind CSS (CDN) + Custom CSS3 |
| **Markup** | Semantic HTML5 |
| **Module System** | ES6 Modules (`import`/`export`) |
| **Persistence** | localStorage (wrapped in `Store` class) |
| **Data API** | OpenWeatherMap REST API (free tier) |
| **Routing** | Custom hash-based SPA router |
| **CI/CD** | Vercel (automatic deploys from GitHub) |

---

## 📁 Project Architecture

```
frontend-utility-suite/
├── index.html                 # SPA entry point
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── package.json               # Dev server config
├── start.bat                  # Windows launch script
├── README.md
├── css/
│   └── style.css              # Custom styles & animations
└── js/
    ├── app.js                 # Entry point: router, theme, sidebar
    └── modules/
        ├── store.js           # localStorage wrapper with error handling
        ├── toast.js           # Toast notification system
        ├── modal.js           # Reusable modal component
        ├── router.js          # Hash-based SPA router
        ├── theme.js           # Dark/light mode manager
        ├── dashboard.js       # Dashboard overview
        ├── tasks.js           # Task Manager CRUD
        ├── weather.js         # Weather Dashboard
        └── quiz.js            # Quiz Platform
```

### Module Responsibilities

| Module | Role |
|--------|------|
| `store.js` | Singleton class wrapping `localStorage` with JSON serialization and try/catch safety |
| `toast.js` | Singleton toast notification system — auto-dismiss, click-to-dismiss, 4 styles |
| `modal.js` | Singleton modal — overlay/ESC close, animated open/close, configurable size |
| `router.js` | Hash-based SPA router — pattern matching with params, query string support |
| `theme.js` | Dark/light theme manager — persistent toggle, CSS class switching |
| `dashboard.js` | Aggregates stats from all 3 apps, displays quick action cards |
| `tasks.js` | Full CRUD with real-time search, priority & status filters, sort |
| `weather.js` | REST API client + mock data fallback, 5-day forecast, search history |
| `quiz.js` | State machine (welcome → quiz → results), timer, scoring, history |

---

## 🚀 Getting Started

### Prerequisites
- A modern browser (Chrome, Firefox, Edge, Safari)
- (Optional) Node.js for the dev server

### Run Locally

```bash
# Clone the repository
git clone https://github.com/Abhijeetkr70/Frontend_Utility_Suite.git
cd Frontend_Utility_Suite

# Start a local server (choose one)
npx serve . -l 3000
# or
python -m http.server 3000
```

Then open `http://localhost:3000` in your browser.

> **ES6 Module Note:** This app uses ES6 modules (`<script type="module">`). You must serve it over HTTP — opening `index.html` directly from the filesystem (`file://` protocol) will not work due to CORS restrictions on module scripts.

### Weather API Key (Optional)

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api) (free tier: 60 calls/min)
2. Get your API key from the dashboard
3. Click "Configure API Key" in the Weather dashboard and enter it
4. Without a key, the app uses realistic mock data automatically

---

## 🧪 Performance Considerations

- **Event Delegation:** All interactive lists (tasks, history items, quiz options) use event delegation on parent containers — zero per-item listeners
- **DOM Batching:** Full view re-renders use single `innerHTML` assignment to minimize layout thrashing
- **Module Loading:** ES6 modules are deferred and loaded asynchronously by the browser
- **CSS Animations:** Hardware-accelerated `transform` and `opacity` transitions for toast, modal, and sidebar
- **localStorage Efficiency:** Data is written only on mutations (not reads), with JSON serialization overhead minimized

---

## 🔮 Future Roadmap

- [x] PWA support (Service Worker + manifest)
- [x] Keyboard shortcuts for navigation
- [x] Export/Import data (JSON backup)
- [x] Confetti animation on perfect quiz score
- [x] Weather unit toggle (°C/°F)
- [x] Task bulk select & batch operations
- [ ] Drag-and-drop task reordering
- [ ] Markdown support in task descriptions
- [ ] Quiz question bank expansion (community contributions)
- [ ] Multi-language support (i18n)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [OpenWeatherMap](https://openweathermap.org/) for the free weather API
- [Vercel](https://vercel.com/) for seamless static site deployment
