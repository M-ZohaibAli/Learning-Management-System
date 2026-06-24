# Atlas LMS

A modern, client-side Learning Management System built with React 19, TypeScript, and Tailwind CSS. Atlas runs entirely in the browser with no backend required — all data persists in localStorage.

## Features

### Core Learning Experience
- **Course Catalog** — Browse 8 built-in courses across Web Development, Programming, Design, Data, and Mobile
- **Structured Curriculum** — Courses organized into modules, lessons, and quizzes
- **Video Lessons** — Support for YouTube embeds and MP4 videos with resume playback
- **Interactive Quizzes** — Auto-graded assessments with explanations and passing scores
- **Progress Tracking** — Lesson completion, quiz scores, time spent, and resume points
- **Certificates** — Verifiable PDF certificates with unique IDs upon course completion

### User Management
- **Multiple Profiles** — Create and switch between learner profiles
- **Profile Persistence** — All data stored locally in browser (localStorage)
- **Export/Import** — Backup and restore profiles as JSON files
- **Demo Mode** — Pre-seeded profiles for immediate exploration

### Instructor Tools
- **Visual Course Builder** — Create courses, modules, lessons, and quizzes in-browser
- **JSON Export/Import** — Portable course format for sharing and backup
- **Quiz Authoring** — Build multiple-choice questions with explanations

### Technical Highlights
- **Zero Backend** — Runs entirely client-side, deployable to any static host
- **Offline-Capable** — Works without network after initial load
- **Privacy-First** — No accounts, no tracking, no data leaves the browser
- **Modern Stack** — React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Single-File Build** — Vite plugin bundles everything into one HTML file

## Built-in Courses

| Course | Category | Level | Hours | Instructor |
|--------|----------|-------|-------|------------|
| React Fundamentals | Web Development | Beginner | 12 | Maren Solberg |
| JavaScript Essentials | Programming | Beginner | 14 | Theo Marchetti |
| Design Systems at Scale | Design | Intermediate | 9 | Ines Kowalski |
| Data Visualization with D3 | Data | Intermediate | 11 | Hiroshi Tanaka |
| SwiftUI for iOS | Mobile | Intermediate | 16 | Calista Renner |
| Systems Programming in Rust | Programming | Advanced | 22 | Dmitri Volkov |
| UX Research Foundations | Design | Beginner | 8 | Amara Okafor |
| Machine Learning Foundations | Data | Advanced | 24 | Lior Ben-David |

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/M-ZohaibAli/Learning-Management-System.git
cd Learning-Management-System

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Building for Production

```bash
npm run build
```

Outputs a single `index.html` file in `dist/` ready for deployment to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).

## Project Structure

```
src/
├── App.tsx              # Root component, routing, layout
├── main.tsx             # Entry point
├── index.css            # Global styles, Tailwind theme
├── router.tsx           # Hash-based router (no server needed)
├── types.ts             # TypeScript interfaces
├── store/
│   └── store.tsx        # Global state (localStorage persistence)
├── data/
│   └── courses.ts       # Built-in courses & demo profiles
├── components/
│   ├── ui.tsx           # Reusable UI components
│   └── Navbar.tsx       # Navigation header
└── pages/
    ├── Home.tsx         # Course catalog landing page
    ├── CourseDetail.tsx # Course overview & curriculum
    ├── LessonViewer.tsx # Video player with sidebar
    ├── QuizPage.tsx     # Interactive quiz taking
    ├── Dashboard.tsx    # Learner progress dashboard
    ├── CertificatePage.tsx # Certificate view & PDF download
    ├── Profiles.tsx     # Profile management
    └── Instructor.tsx   # Course authoring studio
```

## Data Persistence

All data is stored in `localStorage` under these keys:

| Key | Description |
|-----|-------------|
| `atlaslms_profiles_v1` | User profiles (progress, certificates, XP, streaks) |
| `atlaslms_active_v1` | Currently active profile ID |
| `atlaslms_custom_courses_v1` | Instructor-created courses |
| `atlaslms_demo_init_v1` | Demo initialization flag |

No cookies, no server sessions, no external dependencies.

## Deployment

### Static Hosting (Recommended)

The build output is a single `index.html` file with all assets inlined.

```bash
npm run build
# Deploy dist/index.html to:
# - Vercel: `vercel deploy dist`
# - Netlify: Drag & drop dist/ folder
# - GitHub Pages: Push dist/ to gh-pages branch
# - Cloudflare Pages: Connect repo, build command `npm run build`
```

### Docker

```dockerfile
FROM nginx:alpine
COPY dist/index.html /usr/share/nginx/html/index.html
EXPOSE 80
```

## Architecture Decisions

### Hash-Based Routing
Uses `window.location.hash` for navigation — works on any static host without server-side routing configuration.

### State Management
React Context + useReducer pattern with localStorage sync. All mutations go through typed actions in `store.tsx`.

### Styling
Tailwind CSS v4 with custom design tokens (`ink`, `accent` color scales). Custom animations for micro-interactions.

### Animations
Framer Motion for page transitions, staggered reveals, and interactive feedback.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgments

- **React Team** — For React 19 and the continued evolution of the framework
- **Tailwind CSS** — For the utility-first CSS framework
- **Framer Motion** — For declarative animations
- **Lucide** — For the beautiful icon set
- **jsPDF** — For client-side PDF generation
- **Vite** — For the lightning-fast build tool

---

Built with care for educators, learners, and independent creators who value privacy, simplicity, and craft.