import type { Course } from "../types";

export const courses: Course[] = [
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Build modern, interactive user interfaces with React from the ground up.",
    longDescription:
      "Master components, hooks, state management, and the mental models behind production-grade React applications. By the end you'll ship real apps with confidence.",
    instructor: "Maren Solberg",
    instructorTitle: "Staff Engineer, ex-Stripe",
    category: "Web Development",
    level: "Beginner",
    hue: 158,
    rating: 4.8,
    students: 12480,
    hours: 12,
    modules: [
      {
        id: "m1",
        title: "Foundations",
        lessons: [
          {
            id: "intro",
            title: "Welcome to React",
            duration: "6 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/Tn6-PIqc4UM",
            content:
              "React is a JavaScript library for building user interfaces. In this lesson we cover what React is, why it became so popular, and the mental model of thinking in components.",
          },
          {
            id: "jsx",
            title: "Understanding JSX",
            duration: "9 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/7fPXI_MnBOY",
            content:
              "JSX lets you write HTML-like syntax inside JavaScript. Learn how JSX compiles, how to embed expressions, and the rules around attributes and self-closing tags.",
          },
          {
            id: "components",
            title: "Components & Props",
            duration: "11 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/IlBjJqpa4lU",
            content:
              "Components are the building blocks of React. Props let you compose them like functions. Learn composition patterns that scale.",
          },
        ],
        quiz: {
          id: "quiz1",
          title: "Foundations Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "What is React primarily used for?",
              options: ["Styling pages", "Building user interfaces", "Database management", "Server hosting"],
              correctIndex: 1,
              explanation: "React is a library focused on building component-based user interfaces.",
            },
            {
              id: "q2",
              question: "What does JSX allow you to do?",
              options: [
                "Write SQL queries",
                "Write HTML-like syntax in JavaScript",
                "Compile C++ code",
                "Manage CSS only",
              ],
              correctIndex: 1,
              explanation: "JSX is a syntax extension that looks like HTML but lives in JavaScript.",
            },
            {
              id: "q3",
              question: "How do you pass data from a parent to a child component?",
              options: ["Using state", "Using props", "Using context only", "Using refs"],
              correctIndex: 1,
            },
          ],
        },
      },
      {
        id: "m2",
        title: "State & Hooks",
        lessons: [
          {
            id: "usestate",
            title: "The useState Hook",
            duration: "12 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
            content:
              "State lets components remember information. Learn the useState hook, how to update state correctly, and why you should never mutate state directly.",
          },
          {
            id: "useeffect",
            title: "Side Effects with useEffect",
            duration: "14 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
            content:
              "useEffect lets you run code in response to changes. Learn dependency arrays, cleanup functions, and common pitfalls.",
          },
        ],
        quiz: {
          id: "quiz2",
          title: "Hooks Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "Which hook is used to add state to a function component?",
              options: ["useFetch", "useState", "useStyle", "useStore"],
              correctIndex: 1,
            },
            {
              id: "q2",
              question: "When does useEffect run by default with an empty dependency array?",
              options: ["On every render", "Only once after mount", "Never", "Only on unmount"],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "js-essentials",
    title: "JavaScript Essentials",
    description: "Master the language that powers the web, from variables to async programming.",
    longDescription:
      "A complete tour of modern JavaScript. Variables, functions, arrays, objects, the DOM, and asynchronous programming with promises and async/await.",
    instructor: "Theo Marchetti",
    instructorTitle: "Tech Lead, Vercel",
    category: "Programming",
    level: "Beginner",
    hue: 38,
    rating: 4.9,
    students: 18920,
    hours: 14,
    modules: [
      {
        id: "m1",
        title: "Language Foundations",
        lessons: [
          {
            id: "variables",
            title: "Variables & Types",
            duration: "10 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/9emXNzqCKyg",
            content:
              "Learn let, const, and var, plus JavaScript's primitive types. Understand scope and when to use each declaration.",
          },
          {
            id: "functions",
            title: "Functions & Arrow Syntax",
            duration: "11 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/N8ap4k_1QEQ",
            content:
              "Functions are the building blocks of JS. Explore declarations, expressions, arrow functions, and parameters.",
          },
        ],
        quiz: {
          id: "quiz1",
          title: "Foundations Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "Which keyword declares a block-scoped variable that cannot be reassigned?",
              options: ["var", "let", "const", "static"],
              correctIndex: 2,
            },
            {
              id: "q2",
              question: "What is the result of typeof 42?",
              options: ["'string'", "'number'", "'integer'", "'float'"],
              correctIndex: 1,
            },
          ],
        },
      },
      {
        id: "m2",
        title: "Async JavaScript",
        lessons: [
          {
            id: "promises",
            title: "Promises Explained",
            duration: "13 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/DHvZLI7Db8E",
            content:
              "Promises represent eventual results of async operations. Learn .then, .catch, and chaining.",
          },
          {
            id: "asyncawait",
            title: "Async / Await",
            duration: "10 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/V_Kr9OSfDeU",
            content:
              "async/await is syntactic sugar over promises that makes async code read like synchronous code.",
          },
        ],
        quiz: {
          id: "quiz2",
          title: "Async Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "What does the await keyword do?",
              options: [
                "Pauses execution until a promise resolves",
                "Creates a new thread",
                "Cancels a promise",
                "Loops forever",
              ],
              correctIndex: 0,
            },
            {
              id: "q2",
              question: "A function using await must be declared with which keyword?",
              options: ["sync", "async", "defer", "yield"],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "design-systems",
    title: "Design Systems at Scale",
    description: "Build cohesive, accessible, and scalable design systems for product teams.",
    longDescription:
      "Tokens, components, documentation, governance. Learn how mature teams build and evolve design systems that ship products faster without sacrificing craft.",
    instructor: "Ines Kowalski",
    instructorTitle: "Design Director, Linear",
    category: "Design",
    level: "Intermediate",
    hue: 280,
    rating: 4.7,
    students: 8420,
    hours: 9,
    modules: [
      {
        id: "m1",
        title: "Foundations & Tokens",
        lessons: [
          {
            id: "tokens",
            title: "Design Tokens 101",
            duration: "8 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/a5KYlHNKQB8",
            content:
              "Tokens are the atomic decisions of your design system. Learn naming, theming, and how to expose them to engineers.",
          },
          {
            id: "scale",
            title: "Scaling Components",
            duration: "12 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/_2LLXnUdUIc",
            content:
              "Composition over configuration. Build primitives that compose into complex interfaces without becoming rigid.",
          },
        ],
        quiz: {
          id: "quiz1",
          title: "Foundations Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "What is the primary purpose of a design token?",
              options: [
                "Replace CSS variables",
                "Capture design decisions as named entities",
                "Generate icons",
                "Document components",
              ],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "data-viz",
    title: "Data Visualization with D3",
    description: "Turn raw data into clear, beautiful, and truthful visual stories.",
    longDescription:
      "From bar charts to network graphs. Learn the grammar of graphics, scales, axes, transitions, and the ethics of visualization.",
    instructor: "Hiroshi Tanaka",
    instructorTitle: "Visualization Engineer",
    category: "Data",
    level: "Intermediate",
    hue: 200,
    rating: 4.6,
    students: 5210,
    hours: 11,
    modules: [
      {
        id: "m1",
        title: "The Grammar of Graphics",
        lessons: [
          {
            id: "scales",
            title: "Scales & Axes",
            duration: "10 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/0Lgj0jOvjQw",
            content: "Scales map data to pixels. Axes communicate scale. Build them with intention.",
          },
          {
            id: "bars",
            title: "Bar & Column Charts",
            duration: "9 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/0Lgj0jOvjQw",
            content: "The workhorse of visualization. Use them well and they rarely lie.",
          },
        ],
        quiz: {
          id: "quiz1",
          title: "Basics Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "What does a scale do in D3?",
              options: [
                "Renders SVG shapes",
                "Maps an input domain to an output range",
                "Fetches data",
                "Styles elements",
              ],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "swiftui",
    title: "SwiftUI for iOS",
    description: "Build native iOS apps with declarative SwiftUI and modern Apple design.",
    longDescription:
      "Layouts, state, navigation, animations, and platform integrations. Build production iOS apps using Apple's modern UI framework.",
    instructor: "Calista Renner",
    instructorTitle: "iOS Engineer, ex-Airbnb",
    category: "Mobile",
    level: "Intermediate",
    hue: 320,
    rating: 4.8,
    students: 6780,
    hours: 16,
    modules: [
      {
        id: "m1",
        title: "Declarative UI",
        lessons: [
          {
            id: "views",
            title: "Views & Modifiers",
            duration: "8 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
            content: "SwiftUI composes via modifiers. Learn the chain pattern that makes complex UIs readable.",
          },
          {
            id: "state",
            title: "State & Binding",
            duration: "11 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
            content: "The @State family drives reactivity. Understand when to reach for each.",
          },
        ],
        quiz: {
          id: "quiz1",
          title: "SwiftUI Basics",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "Which property wrapper drives local view state?",
              options: ["@Binding", "@State", "@ObservedObject", "@Environment"],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "rust-systems",
    title: "Systems Programming in Rust",
    description: "Memory-safe systems programming without the garbage collector overhead.",
    longDescription:
      "Ownership, borrowing, lifetimes, async, and unsafe. Build fast, reliable systems software with Rust's unique approach to memory safety.",
    instructor: "Dmitri Volkov",
    instructorTitle: "Principal Engineer",
    category: "Programming",
    level: "Advanced",
    hue: 18,
    rating: 4.9,
    students: 4310,
    hours: 22,
    modules: [
      {
        id: "m1",
        title: "Ownership & Borrowing",
        lessons: [
          {
            id: "ownership",
            title: "Ownership 101",
            duration: "13 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
            content: "Rust's killer feature. Learn how the compiler tracks memory so you don't have to.",
          },
          {
            id: "borrowing",
            title: "References & Slices",
            duration: "10 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/9emXNzqCKyg",
            content: "Borrowing is the heart of safe Rust. Master it and the rest gets easier.",
          },
        ],
        quiz: {
          id: "quiz1",
          title: "Ownership Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "How many owners can a value have at once?",
              options: ["Zero or one", "Exactly one", "Many", "Unlimited"],
              correctIndex: 0,
            },
          ],
        },
      },
    ],
  },
  {
    id: "ux-research",
    title: "UX Research Foundations",
    description: "Understand users deeply through interviews, usability testing, and synthesis.",
    longDescription:
      "From research questions to insights to design impact. Practical methods for product teams who want to ship things people actually love.",
    instructor: "Amara Okafor",
    instructorTitle: "Head of Research",
    category: "Design",
    level: "Beginner",
    hue: 250,
    rating: 4.7,
    students: 7820,
    hours: 8,
    modules: [
      {
        id: "m1",
        title: "Research Methods",
        lessons: [
          {
            id: "interviews",
            title: "User Interviews",
            duration: "9 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/a5KYlHNKQB8",
            content: "Five techniques to surface real motivations without leading the witness.",
          },
          {
            id: "usability",
            title: "Usability Testing",
            duration: "11 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/_2LLXnUdUIc",
            content: "Watch people use your product. Take notes. Resist the urge to help.",
          },
        ],
        quiz: {
          id: "quiz1",
          title: "Methods Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "How many participants are typically needed for a usability study?",
              options: ["1", "3-5", "20-30", "100+"],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "ml-foundations",
    title: "Machine Learning Foundations",
    description: "From linear regression to transformers, with intuition and math you'll actually remember.",
    longDescription:
      "Build a strong mental model of how ML systems actually work. Linear models, neural networks, training loops, evaluation, and the messy reality of shipping ML.",
    instructor: "Lior Ben-David",
    instructorTitle: "ML Researcher",
    category: "Data",
    level: "Advanced",
    hue: 220,
    rating: 4.9,
    students: 9120,
    hours: 24,
    modules: [
      {
        id: "m1",
        title: "Linear Models",
        lessons: [
          {
            id: "regression",
            title: "Linear Regression",
            duration: "12 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/0Lgj0jOvjQw",
            content: "The simplest, most useful model in ML. Master it before reaching for deep learning.",
          },
          {
            id: "classification",
            title: "Classification Basics",
            duration: "14 min",
            videoType: "youtube",
            videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
            content: "Logistic regression, decision boundaries, and why accuracy isn't enough.",
          },
        ],
        quiz: {
          id: "quiz1",
          title: "Linear Models Check",
          passingScore: 60,
          questions: [
            {
              id: "q1",
              question: "Which loss function is typical for classification?",
              options: ["MSE", "Cross-entropy", "MAE", "Huber"],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
];

export const demoProfiles = [
  {
    id: "demo-aria",
    name: "Aria Chen",
    email: "aria@atlaslms.io",
    role: "learner" as const,
    avatar: "AC",
    color: "from-emerald-400 to-teal-500",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    streak: 12,
    xp: 4820,
  },
  {
    id: "demo-marcus",
    name: "Marcus Whitfield",
    email: "marcus@atlaslms.io",
    role: "learner" as const,
    avatar: "MW",
    color: "from-sky-400 to-indigo-500",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    streak: 5,
    xp: 2150,
  },
  {
    id: "demo-sol",
    name: "Sol Bergström",
    email: "sol@atlaslms.io",
    role: "instructor" as const,
    avatar: "SB",
    color: "from-amber-400 to-orange-500",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    streak: 0,
    xp: 0,
  },
];