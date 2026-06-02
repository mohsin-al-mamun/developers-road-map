// ─────────────────────────────────────────────
// roadmap-data.ts
// Single source of truth for all roadmap content.
// Import this wherever you need topic data in Next.js.
// ─────────────────────────────────────────────

export type TopicColor = "acc" | "vi" | "sky" | "grn";
export type PhaseKey = "p1" | "p2" | "p3";
export type LevelKey = "beginner" | "intermediate" | "senior";

export interface DocLink {
  label: string;
  url: string;
}

export interface CodeExample {
  label: string;
  code: string;
}

export interface Subtopic {
  title: string;
  what: string;
  points: string[];
  gotchas?: string[];
  examples?: CodeExample[];
  docs: DocLink[];
  prompt: string;
}

export interface Level {
  label: string;
  desc: string;
  subtopics: Subtopic[];
}

export interface Topic {
  nav: string;
  phase: string;
  title: string;
  meta: string;
  color: TopicColor;
  intro: string;
  docNote: string;
  docs: DocLink[];
  levels: Record<string, Level>;
}

export interface NavSection {
  label: string;
  phase: PhaseKey;
  keys: string[];
}

export interface PhaseMeta {
  label: string;
  weeks: string;
  hours: string;
  title: string;
}

// ── Navigation structure ──────────────────────
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Phase 1 — Stack",
    phase: "p1",
    keys: ["react", "nextjs", "node", "typescript", "css"],
  },
  {
    label: "Phase 2 — Architecture",
    phase: "p2",
    keys: ["dsa", "sysfe", "sysbe", "db"],
  },
  {
    label: "Phase 3 — AI + Interviews",
    phase: "p3",
    keys: ["ai", "security", "devops"],
  },
];

export const PHASE_META: Record<PhaseKey, PhaseMeta> = {
  p1: {
    label: "Phase 1",
    weeks: "Weeks 1–10",
    hours: "~100 hrs",
    title: "Sharpen Your Stack",
  },
  p2: {
    label: "Phase 2",
    weeks: "Weeks 11–18",
    hours: "~136 hrs",
    title: "Architecture + DSA",
  },
  p3: {
    label: "Phase 3",
    weeks: "Weeks 19–24",
    hours: "~60 hrs",
    title: "AI + Interview Prep",
  },
};

// ── All topic data ────────────────────────────
export const TOPICS: Record<string, Topic> = {
  react: {
    nav: "nav-react",
    phase: "Phase 1 · Week 1–2",
    title: "React Internals",
    meta: "2 weeks · ~20 hrs",
    color: "acc",
    intro:
      "React is the foundation of everything else in your stack. Most developers use it without understanding what it actually does. This topic closes that gap — from the Virtual DOM to concurrent rendering, hooks internals to performance optimization.",
    docNote:
      "react.dev is the authoritative source. The new docs are among the best-written in the JS ecosystem. Read before using Claude.",
    docs: [
      { label: "react.dev → Learn React", url: "https://react.dev/learn" },
      {
        label: "react.dev → Escape Hatches",
        url: "https://react.dev/learn/escape-hatches",
      },
      {
        label: "react.dev → Reference: Hooks",
        url: "https://react.dev/reference/react",
      },
      {
        label: "React Fiber architecture (acdlite)",
        url: "https://github.com/acdlite/react-fiber-architecture",
      },
    ],
    levels: {
      beginner: {
        label: "Beginner",
        desc: "Core concepts every React developer must know solidly.",
        subtopics: [
          {
            title: "JSX and rendering",
            what: "JSX compiles to React.createElement(). Understanding this explains why certain patterns work or fail — and why React must be in scope in older setups.",
            points: [
              "JSX is syntactic sugar — compiles to React.createElement(type, props, ...children)",
              "Expressions in JSX must return a single value — no if statements, use ternary",
              "Fragments <></> avoid unnecessary DOM wrappers",
              "Keys in lists must be stable and unique — not array index when order can change",
              "Conditional rendering: &&, ternary, or early return — each has tradeoffs",
            ],
            docs: [
              {
                label: "react.dev → Describing the UI",
                url: "https://react.dev/learn/describing-the-ui",
              },
            ],
            prompt:
              "Explain what JSX compiles to and show me 3 common JSX mistakes developers make. Then quiz me with 5 questions.",
          },
          {
            title: "useState and component state",
            what: "State is data that triggers a re-render when it changes. Understanding when to use state vs derived values vs refs prevents a whole class of bugs.",
            points: [
              "State updates trigger re-renders — derived values should not be stored as state",
              "React 18+ batches state updates automatically — even inside async functions",
              "Never mutate state directly — always return a new value or new object reference",
              "Functional updates: setState(prev => prev + 1) for values depending on previous state",
              "Same component at same position in the tree shares state across re-renders",
            ],
            gotchas: [
              "Mutating state directly (e.g. state.items.push(x) then setState(state)) does NOT trigger a re-render — React uses reference equality; you must return a new object or array",
              "setState is async — reading state immediately after calling setState gives you the OLD value, not the updated one; use the functional form or useEffect to react to state changes",
              "Storing derived data in state (e.g. storing filteredList when you have list + filter) causes sync bugs — compute derived values during render instead",
              "When the same component renders at the same tree position, React preserves its state even if props change — to reset state, change the key prop",
            ],
            examples: [
              {
                label: "Mutation bug vs correct immutable update",
                code: `// ❌ WRONG — mutates the existing array, no re-render
const [items, setItems] = useState([1, 2, 3]);
items.push(4);
setItems(items); // same reference, React bails out

// ✅ CORRECT — new array reference triggers re-render
setItems(prev => [...prev, 4]);

// ❌ WRONG — mutating nested object
setUser(prev => { prev.name = 'Alice'; return prev; });

// ✅ CORRECT — spread to create new object
setUser(prev => ({ ...prev, name: 'Alice' }));`,
              },
            ],
            docs: [
              {
                label: "react.dev → State: A Component's Memory",
                url: "https://react.dev/learn/state-a-components-memory",
              },
            ],
            prompt:
              "Quiz me on React state. Include questions about batching, mutation bugs, and situations where you should NOT use state.",
          },
          {
            title: "useEffect and side effects",
            what: "Effects synchronize a component with an external system. They are the most misused hook — understanding their lifecycle prevents entire categories of bugs.",
            points: [
              "Effects run after every render where dependencies changed",
              'Empty dependency array []: runs once after mount — not "only on mount"',
              "Cleanup function: runs before next effect and on unmount — cancel timers, subscriptions",
              "Each render has its own effect closure — values captured at render time",
              "Do not use effects for derived state, event handling, or data transformations — better solutions exist",
            ],
            gotchas: [
              "Cleanup runs BEFORE the next effect fires, not only on unmount — a fetch inside useEffect should always return a cleanup that aborts it, otherwise you get state updates on unmounted components",
              "Passing an object or array literal as a dependency causes infinite loops — every render creates a new reference; use primitive values or wrap the value in useMemo",
              "Stale closure: state read inside an effect captures its value at render time — if state changes after the effect starts, the effect still sees the old value; use a ref or functional setState(prev => ...) to access latest",
              '[] does not mean "run once forever" — it means "run when no listed value changes"; ESLint exhaustive-deps will catch missing deps; never disable this rule silently',
            ],
            examples: [
              {
                label: "Cancel fetch on re-render / unmount",
                code: `useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => { if (err.name !== 'AbortError') setError(err); });
  return () => controller.abort();
}, [url]);`,
              },
              {
                label: "Stale closure bug → fix with functional update",
                code: `// ❌ count is always 0 inside the interval (stale closure)
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);

// ✅ functional update reads latest state
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(id);
}, []);`,
              },
            ],
            docs: [
              {
                label: "react.dev → Synchronizing with Effects",
                url: "https://react.dev/learn/synchronizing-with-effects",
              },
              {
                label: "react.dev → You Might Not Need an Effect",
                url: "https://react.dev/learn/you-might-not-need-an-effect",
              },
            ],
            prompt:
              "Show me 5 incorrect useEffect patterns. Explain why each is wrong and show the correct fix.",
          },
          {
            title: "Props and component composition",
            what: "Props flow down — this is React's fundamental data model. Composition over configuration keeps components reusable and avoids prop drilling early.",
            points: [
              "Props are read-only — a component must never modify its own props",
              "Children prop: <Parent><Child /></Parent> passes Child as props.children",
              "Spread props {...rest} when building wrapper or forwarding components",
              "Prop drilling becomes painful beyond 2–3 levels — reach for context or state manager",
              'Default props via destructuring: function Btn({ color = "blue" }) — clean and readable',
            ],
            docs: [
              {
                label: "react.dev → Passing Props",
                url: "https://react.dev/learn/passing-props-to-a-component",
              },
            ],
            prompt:
              "Show me a component that is over-configured with props. Refactor it using composition and explain the design improvement.",
          },
          {
            title: "Event handling",
            what: "React uses synthetic events wrapping native browser events. Event handling in React has important differences from vanilla JS that trip up beginners.",
            points: [
              "camelCase event names: onClick, onChange, onSubmit — not onclick",
              "Pass function reference — do not call it: onClick={handle} not onClick={handle()}",
              "e.preventDefault() works the same as in vanilla JS",
              "Event handlers read the latest state via closures during their render",
              "e.stopPropagation() prevents event bubbling to parent elements",
            ],
            docs: [
              {
                label: "react.dev → Responding to Events",
                url: "https://react.dev/learn/responding-to-events",
              },
            ],
            prompt:
              "Quiz me on React event handling. Include a tricky question about the difference between onClick={fn} and onClick={fn()} and one about synthetic events.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Patterns and APIs that make React applications maintainable at scale.",
        subtopics: [
          {
            title: "useRef and DOM access",
            what: "Refs give you a mutable value that does not trigger re-renders, or direct access to a DOM node. They are the escape hatch from React's declarative model.",
            points: [
              "useRef returns { current: value } — changing current does NOT cause re-render",
              "Use refs for: DOM access, storing interval IDs, third-party library instances",
              "forwardRef: lets a parent component pass a ref to a child's DOM node",
              "useImperativeHandle: customizes what the ref exposes — limits surface area",
              "Do not use refs as a substitute for state — if the UI depends on the value, use state",
            ],
            docs: [
              {
                label: "react.dev → Referencing Values with Refs",
                url: "https://react.dev/learn/referencing-values-with-refs",
              },
            ],
            prompt:
              "Show me the difference between using state and using a ref for a timer. Build both and explain when each is correct.",
          },
          {
            title: "useReducer for complex state",
            what: "useReducer is useState for complex state logic. It centralizes state transitions, making them predictable, testable, and easy to reason about.",
            points: [
              "dispatch(action) → reducer(state, action) → newState — pure function",
              "Better than useState when next state depends on multiple pieces of previous state",
              "Actions should describe what happened, not what to do — past tense naming",
              "Combine with context to build a lightweight global store without Redux",
              "Pure reducers are easy to unit test — no side effects, deterministic output",
            ],
            docs: [
              {
                label: "react.dev → useReducer",
                url: "https://react.dev/reference/react/useReducer",
              },
            ],
            prompt:
              "Convert a component using 4 useState calls into useReducer. Explain at what point this refactor becomes worth the added complexity.",
          },
          {
            title: "Context API and when to use it",
            what: "Context lets you pass data through the component tree without prop drilling. It is not a replacement for all state management — understand its specific tradeoffs.",
            points: [
              "createContext + Provider + useContext is the complete pattern",
              "ALL consumers re-render when context value changes — even with the same value",
              "Split contexts by update frequency: ThemeContext separate from UserContext",
              "Context is for: auth user, theme, locale, feature flags — slowly changing globals",
              "Do NOT use context for frequently updating state — causes performance problems",
            ],
            docs: [
              {
                label: "react.dev → Passing Data Deeply with Context",
                url: "https://react.dev/learn/passing-data-deeply-with-context",
              },
            ],
            prompt:
              "Build an auth context with login and logout. Then demonstrate the performance problem when you put rapidly-changing data in context.",
          },
          {
            title: "Custom hooks",
            what: "Custom hooks extract and share stateful logic between components. They are the primary code reuse mechanism in React — more powerful than components for logic.",
            points: [
              'Any function starting with "use" that calls other hooks is a custom hook',
              "Each call to a custom hook gets its own isolated state — not shared",
              "Extract: data fetching, form state, event listeners, timers, subscriptions",
              "Custom hooks can call other custom hooks — compose freely",
              "Return only what the component needs — keep the public interface minimal",
            ],
            docs: [
              {
                label: "react.dev → Reusing Logic with Custom Hooks",
                url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
              },
            ],
            prompt:
              "Build useLocalStorage, useDebounce, and usePrevious from scratch. Explain the design decisions and edge cases in each.",
          },
          {
            title: "Code splitting with React.lazy",
            what: "Code splitting breaks your bundle into smaller chunks loaded on demand. React.lazy() and Suspense make this straightforward and effective.",
            points: [
              'React.lazy(() => import("./Component")) — wraps dynamic import',
              "Must be wrapped in <Suspense fallback={...}> — shows while loading",
              "Route-level splitting: lazy-load entire page components — biggest impact",
              "Component-level: lazy-load heavy components (rich text editors, charts, maps)",
              "Next.js: use next/dynamic() — wraps React.lazy with SSR awareness and extra options",
            ],
            docs: [
              {
                label: "react.dev → React.lazy",
                url: "https://react.dev/reference/react/lazy",
              },
            ],
            prompt:
              "Implement route-based code splitting in a React SPA. Show me what metrics to check to verify it actually improved performance.",
          },
          {
            title: "Controlled vs uncontrolled components",
            what: "Controlled components store form state in React state. Uncontrolled components store it in the DOM. Both are valid patterns with specific use cases.",
            points: [
              "Controlled: value + onChange — React is the source of truth — enables live validation",
              "Uncontrolled: useRef to read on submit — DOM is the source of truth — simpler",
              "Controlled: better for computed fields, dependent fields, conditional visibility",
              "Uncontrolled: React Hook Form uses this for performance on large forms",
              "Converting between them: defaultValue (uncontrolled) vs value (controlled) prop",
            ],
            docs: [
              {
                label: "react.dev → Sharing State",
                url: "https://react.dev/learn/sharing-state-between-components",
              },
            ],
            prompt:
              "Build the same form both ways. Show me where controlled and uncontrolled approaches each have an advantage.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Internals, concurrent features, and architectural decisions that define senior-level React work.",
        subtopics: [
          {
            title: "React Fiber architecture",
            what: "Fiber is the internal reconciliation engine introduced in React 16. It reimagined rendering as a linked list of work units that can be paused, prioritized, and resumed — enabling all concurrent features.",
            points: [
              "Each component instance has a fiber node — stored in a linked list structure",
              "Render phase: interruptible — builds the work-in-progress tree without side effects",
              "Commit phase: non-interruptible — applies DOM mutations, runs effects synchronously",
              "Fiber enabled time-slicing: React yields to the browser between work units",
              "Double buffering: work-in-progress fiber tree swaps with current tree on commit",
            ],
            docs: [
              {
                label: "React Fiber deep dive (GitHub)",
                url: "https://github.com/acdlite/react-fiber-architecture",
              },
            ],
            prompt:
              "Explain React Fiber to me assuming I understand the Node.js event loop. Focus on what problem Fiber solved that the old stack reconciler could not handle.",
          },
          {
            title: "Concurrent mode and scheduler",
            what: "Concurrent mode allows React to work on multiple versions of the UI simultaneously, prioritizing urgent updates (user input) over background work (data fetching results).",
            points: [
              "startTransition: marks update as non-urgent — UI stays interactive during transition",
              "useTransition: returns [isPending, startTransition] — show loading indicator",
              "useDeferredValue: stale value during re-render, updated in background — no spinner needed",
              "Suspense + concurrent: seamless async without manual loading state",
              "Priority levels: immediate > user-blocking > normal > low > idle — scheduler manages these",
            ],
            docs: [
              {
                label: "react.dev → useTransition",
                url: "https://react.dev/reference/react/useTransition",
              },
            ],
            prompt:
              "Build a filterable list demo where useTransition makes a visible performance difference. Show me the before and after user experience.",
          },
          {
            title: "Hooks internals — the linked list",
            what: "Hooks are stored as a linked list attached to each fiber node. This implementation detail explains every rule of hooks and makes them feel inevitable rather than arbitrary.",
            points: [
              "First render: each hook call appends a node to fiber's memoizedState linked list",
              "Re-renders: React walks the same list in order — call order must be identical",
              "Calling a hook conditionally breaks the list — undefined behavior and cryptic bugs",
              "Each hook node stores: memoizedState (value), queue (pending updates), next (pointer)",
              "Dispatcher switches between mount implementation and update implementation automatically",
            ],
            docs: [
              {
                label: "react.dev → Rules of Hooks",
                url: "https://react.dev/reference/rules/rules-of-hooks",
              },
            ],
            prompt:
              "Explain why the rules of hooks exist by describing what React actually does internally. Give me an edge case that would silently break the linked list.",
          },
          {
            title: "Performance optimization — deep dive",
            what: "React re-renders are cheap — DOM reconciliation is the expensive part. Profile before optimizing. Premature optimization with memo() can cause bugs and hurt performance.",
            points: [
              "React.memo(): skips re-render if props pass shallow equality — only wrap if you measured a problem",
              "useMemo(fn, deps): memoize expensive computations — not for every value",
              "useCallback(fn, deps): stable function reference — needed when passing to memo'd children",
              "React Profiler (DevTools): measure render durations — find actual bottlenecks",
              "Context optimization: separate read context from write context to halve number of consumers",
            ],
            docs: [
              {
                label: "react.dev → memo",
                url: "https://react.dev/reference/react/memo",
              },
            ],
            prompt:
              "Create a component with a non-obvious re-render performance problem. Walk me through using React DevTools Profiler to find and fix it.",
          },
          {
            title: "Error boundaries",
            what: "Error boundaries catch JavaScript errors in child component trees and display fallback UI instead of a crashed application. Class components only — no hook equivalent yet.",
            points: [
              "Must be class components — getDerivedStateFromError and componentDidCatch",
              "Catches errors in: render, lifecycle methods, constructors of children",
              "Does NOT catch: event handlers, async code (use try/catch there), SSR errors",
              "getDerivedStateFromError: update state to trigger fallback UI render",
              "componentDidCatch: log error to Sentry or similar reporting service",
              "react-error-boundary library: practical solution for most apps — avoids writing class components",
            ],
            docs: [
              {
                label: "react.dev → Error Boundaries",
                url: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
              },
            ],
            prompt:
              "Build a production-grade error boundary with fallback UI, retry functionality, and error logging. Show me the cases where error boundaries cannot help.",
          },
          {
            title: "React 19 — new APIs",
            what: "React 19 introduces the Actions API, new hooks, and improvements that change how forms and async operations are handled — removing much of the useEffect + useState boilerplate.",
            points: [
              "use() hook: read a promise or context in render — replaces some useEffect patterns",
              "useActionState: manage form submission state, errors, and pending state together",
              "useFormStatus: read parent form submission status from child without prop drilling",
              "useOptimistic: instantly show optimistic UI before server confirms the mutation",
              "ref as a prop: forwardRef is no longer needed — ref is just a regular prop in React 19",
            ],
            docs: [
              {
                label: "react.dev → React 19 blog post",
                url: "https://react.dev/blog/2024/12/05/react-19",
              },
            ],
            prompt:
              "Show me how useActionState and useOptimistic work together in a form that creates a new item. Compare the code to the old useState + useEffect approach.",
          },
        ],
      },
    },
  },

  nextjs: {
    nav: "nav-nextjs",
    phase: "Phase 1 · Week 3–4",
    title: "Next.js App Router",
    meta: "2 weeks · ~20 hrs",
    color: "acc",
    intro:
      "App Router is a paradigm shift — not just a new folder structure. Server Components, streaming, four caching layers, and Server Actions change how you think about data fetching and rendering entirely. This topic covers everything from file conventions to production deployment.",
    docNote:
      "Caching behavior changed significantly between v13, v14, and v15. Always verify against nextjs.org/docs for your specific version — Claude may have outdated information here.",
    docs: [
      {
        label: "nextjs.org → App Router docs",
        url: "https://nextjs.org/docs/app",
      },
      {
        label: "nextjs.org → Caching (read all sections)",
        url: "https://nextjs.org/docs/app/building-your-application/caching",
      },
      {
        label: "nextjs.org → Rendering",
        url: "https://nextjs.org/docs/app/building-your-application/rendering",
      },
      {
        label: "nextjs.org → Data Fetching",
        url: "https://nextjs.org/docs/app/building-your-application/data-fetching",
      },
    ],
    levels: {
      beginner: {
        label: "Beginner",
        desc: "File conventions, routing, and the fundamental App Router mental model.",
        subtopics: [
          {
            title: "File conventions",
            what: "App Router uses special filenames to define UI at each route segment. Each file has a specific purpose and behavior — knowing all of them is non-negotiable.",
            points: [
              "page.tsx: unique UI for a route — makes the segment publicly accessible",
              "layout.tsx: shared UI that persists across navigations — does not re-mount",
              "loading.tsx: automatic Suspense boundary — shown while page.tsx loads",
              "error.tsx: error boundary for the segment — MUST be a Client Component",
              "not-found.tsx: rendered when notFound() is called or 404 occurs",
              "template.tsx: like layout but re-mounts on every navigation — useful for animations",
              "route.ts: API endpoint — handles HTTP methods, replaces pages/api/",
            ],
            gotchas: [
              "In Next.js 15+, params and searchParams are Promises — you must await them before destructuring; forgetting this gives you a Promise object, not the values",
              "error.tsx must be a Client Component ('use client') — if you forget, errors thrown in Server Components will silently not be caught by your boundary",
              "layout.tsx does NOT re-render on navigation between routes in the same segment — any state inside a layout persists across navigations, which can be a bug or a feature depending on intent",
              "route.ts and page.tsx cannot coexist at the same path — a route handler replaces the page entirely for that URL",
            ],
            examples: [
              {
                label: "Next.js 15 — awaiting params (required)",
                code: `// ❌ Next.js 15 — params is a Promise, this will be a Promise object
export default function Page({ params }: { params: { slug: string } }) {
  console.log(params.slug); // [object Promise]
}

// ✅ Correct — await params first
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}`,
              },
            ],
            docs: [
              {
                label: "nextjs.org → File Conventions",
                url: "https://nextjs.org/docs/app/api-reference/file-conventions",
              },
            ],
            prompt:
              "Quiz me on Next.js file conventions. Give me a scenario and ask me which file to create, where to put it, and why.",
          },
          {
            title: "Routing — dynamic, catch-all, and route groups",
            what: "App Router supports dynamic segments, catch-all routes, optional catch-all routes, and route groups — each with distinct matching behavior and use cases.",
            points: [
              "[slug]: matches a single dynamic segment — /blog/my-post",
              "[...slug]: required catch-all — matches /a and /a/b but NOT /",
              "[[...slug]]: optional catch-all — matches / AND /a AND /a/b",
              "(folder): route group — organizes routes without affecting URL structure",
              "Route groups useful for: multiple layouts, separating auth vs public routes",
              "generateStaticParams(): pre-renders dynamic routes at build time for static generation",
            ],
            docs: [
              {
                label: "nextjs.org → Dynamic Routes",
                url: "https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes",
              },
            ],
            prompt:
              "When would you use [...slug] vs [[...slug]]? Give me 3 real-world use cases for each pattern.",
          },
          {
            title: "Parallel and intercepting routes",
            what: "Parallel routes render multiple pages simultaneously in the same layout. Intercepting routes show a route in a modal without navigating away — like Instagram photos.",
            points: [
              "@folder: named slot — render matched route in that slot inside the layout",
              "default.tsx: fallback when no match for a parallel route slot",
              "Intercepting: (.) same level, (..) one level up, (...) from app root",
              "Classic use case: photo grid + full-screen photo modal on the same page",
              "Intercepting routes require careful layout setup — read the official docs carefully",
              "Both features are complex — diagram the URL and file structure before coding",
            ],
            docs: [
              {
                label: "nextjs.org → Parallel Routes",
                url: "https://nextjs.org/docs/app/building-your-application/routing/parallel-routes",
              },
            ],
            prompt:
              "Walk me through the file structure for a photo feed where clicking a photo shows a modal — but navigating directly to /photo/123 shows the full page.",
          },
          {
            title: "Image and font optimization",
            what: "next/image and next/font are zero-configuration optimizations that address the most common causes of poor Core Web Vitals scores.",
            points: [
              "next/image: automatic WebP/AVIF conversion, lazy loading by default, prevents layout shift",
              "Always set width and height OR use fill prop — required to prevent CLS",
              "priority prop: preloads above-the-fold images — use on hero images only",
              "next/font: self-hosts fonts at build time — eliminates FOUT and external requests",
              "CSS variable approach allows using the font class across your entire component tree",
              "sizes prop on next/image: tells browser which size to download at each breakpoint",
            ],
            docs: [
              {
                label: "nextjs.org → Image Optimization",
                url: "https://nextjs.org/docs/app/building-your-application/optimizing/images",
              },
              {
                label: "nextjs.org → Font Optimization",
                url: "https://nextjs.org/docs/app/building-your-application/optimizing/fonts",
              },
            ],
            prompt:
              "My Next.js page has a poor LCP score from a hero image. Walk me through fixing it correctly with next/image — including what mistakes to avoid.",
          },
          {
            title: "Metadata API",
            what: "Next.js has a built-in Metadata API for SEO that replaces next/head. It supports static metadata, dynamic generation, and even programmatically generated OG images.",
            points: [
              "Static: export const metadata: Metadata from layout.tsx or page.tsx",
              "Dynamic: export async function generateMetadata({ params }) — can fetch data",
              'Template: title: { template: "%s | Site Name", default: "Site Name" }',
              "opengraph-image.tsx at route level: generate OG images with React and ImageResponse",
              "robots.ts and sitemap.ts: generate these programmatically from your database",
              "Metadata merges from layout down to page — page values override layout values",
            ],
            docs: [
              {
                label: "nextjs.org → Metadata",
                url: "https://nextjs.org/docs/app/building-your-application/optimizing/metadata",
              },
            ],
            prompt:
              "Build a blog where each post has dynamic metadata including a programmatically generated OG image. Show me the generateMetadata implementation.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Server Components, data fetching, Server Actions, streaming, and Route Handlers.",
        subtopics: [
          {
            title: "Server Components vs Client Components",
            what: "The most important mental model in App Router. Server Components run on the server and ship zero JS. Client Components run in the browser. The boundary between them determines your bundle size.",
            points: [
              'App Router default: Server Component — add "use client" only when needed',
              "SC: can be async, access DB directly, import server-only packages — no browser APIs",
              'CC: "use client" at file top — enables hooks, event handlers, browser APIs',
              "SC can import CC, but CC cannot import SC (only as a prop or children)",
              'Push "use client" as deep in the tree as possible — smaller client JS bundle',
              '"use client" marks a module boundary — all imports in that file become client-side',
            ],
            gotchas: [
              '"use client" does not mean the component only runs on the client — it still renders on the server for the initial HTML (SSR), then hydrates on the client; it means "this component uses client APIs"',
              "Importing a Client Component into a Server Component is fine — the reverse is not; if you try to import a Server Component into a Client Component, it silently gets treated as a Client Component and loses its server benefits",
              "Context, useState, and useEffect are only available in Client Components — if you see 'hooks can only be used in Client Components', the file is missing 'use client' at the top",
              "Third-party packages that use useState/useEffect internally need a Client Component wrapper — most packages built before App Router don't have 'use client' in their source",
            ],
            examples: [
              {
                label: "Correct pattern — push 'use client' deep",
                code: `// ✅ Page is a Server Component — fetches data, zero client JS
export default async function Page() {
  const posts = await db.post.findMany();
  return (
    <div>
      <h1>Posts</h1>
      {posts.map(p => (
        // LikeButton is the only Client Component
        <article key={p.id}>
          <h2>{p.title}</h2>
          <LikeButton postId={p.id} initialLikes={p.likes} />
        </article>
      ))}
    </div>
  );
}

// ✅ Only the interactive part is a Client Component
'use client';
export function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  return <button onClick={() => setLikes(l => l + 1)}>{likes}</button>;
}`,
              },
            ],
            docs: [
              {
                label: "nextjs.org → Server Components",
                url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
              },
            ],
            prompt:
              "Give me 6 realistic scenarios. For each, tell me Server Component or Client Component with your reasoning.",
          },
          {
            title: "Data fetching patterns",
            what: "App Router favors fetching data directly in Server Components with async/await. This replaces getServerSideProps and getStaticProps with simpler, more composable patterns.",
            points: [
              "Async Server Components: async function Page() { const data = await db.query() }",
              "Parallel fetching: const [a, b] = await Promise.all([fetchA(), fetchB()]) — avoid waterfalls",
              "Sequential fetching: needed when second request depends on first result",
              "React cache(): deduplicates the same function call within a single render tree",
              "Avoid: passing data from parent to many children — fetch where you need it instead",
              "Streaming: wrap slow fetches in Suspense — show content as it arrives",
            ],
            docs: [
              {
                label: "nextjs.org → Data Fetching Patterns",
                url: "https://nextjs.org/docs/app/building-your-application/data-fetching/fetching",
              },
            ],
            prompt:
              "Design a dashboard with 3 independent data sources. Show me parallel fetching with Suspense and explain how to avoid a request waterfall.",
          },
          {
            title: "Server Actions and mutations",
            what: 'Server Actions are async functions marked with "use server" that run on the server but can be called from Client Components or HTML forms. They are the primary way to handle mutations.',
            points: [
              '"use server" at top of function (inline) or file (entire file exports become actions)',
              "Called from form action prop: works without JavaScript — progressive enhancement",
              "revalidatePath(path): purges Full Route Cache and Router Cache for a path after mutation",
              "revalidateTag(tag): purge specific cached fetches tagged with that key",
              "useActionState: manage isPending, error, and result state from an action call",
              "useOptimistic: update UI instantly before server confirms — feels faster to user",
            ],
            docs: [
              {
                label: "nextjs.org → Server Actions",
                url: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations",
              },
            ],
            prompt:
              "Build a complete task creation form with Server Action, input validation, optimistic update with useOptimistic, and error handling with useActionState.",
          },
          {
            title: "Streaming and Suspense boundaries",
            what: "Streaming sends parts of the page to the browser as they are ready — users see content faster instead of waiting for all data to resolve.",
            points: [
              "loading.tsx creates an automatic Suspense boundary for the entire route segment",
              "Granular streaming: wrap individual slow components in <Suspense fallback={<Skeleton />}>",
              "Multiple Suspense boundaries render in parallel — each shows as soon as its data arrives",
              "Error.tsx catches errors in streamed segments — must be Client Component",
              "Streaming changes TTFB significantly — critical for data-heavy pages",
              "Avoid Suspense waterfalls: do not nest Suspense boundaries unnecessarily",
            ],
            docs: [
              {
                label: "nextjs.org → Streaming",
                url: "https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming",
              },
            ],
            prompt:
              "Build a dashboard with 3 independently-loading sections. Each has a skeleton while loading. One occasionally errors. Show the complete implementation.",
          },
          {
            title: "Route Handlers",
            what: "Route Handlers (route.ts) are the App Router equivalent of API Routes. They run in the Edge or Node.js runtime and support all HTTP methods.",
            points: [
              "Export named functions: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS",
              "Request is the standard Web API Request — use req.json(), req.formData()",
              "Return NextResponse or Response — standard Web API Response",
              "Can colocate with page: /app/posts/[id]/route.ts lives next to /app/posts/[id]/page.tsx",
              "Edge runtime: faster cold starts, global distribution — no Node.js-specific APIs",
              "Read cookies and set response headers with NextResponse helpers",
            ],
            docs: [
              {
                label: "nextjs.org → Route Handlers",
                url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
              },
            ],
            prompt:
              "Build a Route Handler for GET (list) and POST (create) with authentication check, input validation, and typed JSON responses.",
          },
          {
            title: "Middleware",
            what: "Middleware runs before every matching request on the Edge runtime. It is the right place for auth guards, redirects, locale detection, and request modification.",
            points: [
              "middleware.ts at project root — next to app/ directory",
              "config.matcher: array of patterns — limit which routes trigger middleware",
              "NextResponse.redirect(): change the URL entirely",
              "NextResponse.rewrite(): change the served content but keep the URL",
              "Access cookies and headers — but NOT the database directly (Edge runtime limits)",
              "Keep middleware fast — it adds latency to EVERY matching request",
            ],
            docs: [
              {
                label: "nextjs.org → Middleware",
                url: "https://nextjs.org/docs/app/building-your-application/routing/middleware",
              },
            ],
            prompt:
              "Build middleware that protects all /dashboard/* routes using a session cookie. Handle the case where the cookie is missing vs expired vs invalid.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "The four caching layers, rendering modes, environment security, and deployment.",
        subtopics: [
          {
            title: "The four caching layers — complete guide",
            what: "Next.js has four distinct caching mechanisms that work together. Understanding each and how they interact is essential for predictable data freshness. Getting this wrong causes hard-to-debug stale data.",
            points: [
              "1. Request Memoization: deduplicates identical fetch() calls within ONE render tree — per-request, automatic",
              '2. Data Cache: persistent cross-request fetch() cache — in v15 you must opt IN with cache: "force-cache"',
              "3. Full Route Cache: server-stores rendered HTML + RSC payload — only for statically rendered routes",
              "4. Router Cache: client-side cache of RSC payloads for visited routes — duration: 30s (dynamic), 5min (static)",
              "revalidatePath(path): clears Full Route Cache + Router Cache for that path",
              "revalidateTag(tag): clears Data Cache entries and Full Route Cache for tagged fetches",
            ],
            gotchas: [
              "Next.js 15 changed Data Cache to OPT-IN — in v14 fetch() was cached by default; in v15 it is not — if you upgraded and your data is no longer cached, this is why",
              "Router Cache cannot be fully disabled in Next.js 14 — even after calling revalidatePath() on the server, the client may serve stale RSC payload for up to 30 seconds; use router.refresh() on the client to force-clear it",
              "revalidatePath('/') does NOT clear all routes — it only clears that exact path and its children; if you have a dynamic route like /posts/[slug], you must call revalidatePath('/posts/[slug]', 'page') or use revalidateTag instead",
              "Request Memoization only works within a SINGLE request — it does not cache across requests like Data Cache does; do not confuse the two",
            ],
            examples: [
              {
                label: "Next.js 15 — opt-in caching vs no-store",
                code: `// Next.js 15: fetch is NOT cached by default
const data = await fetch('/api/posts'); // fresh every request

// Opt-in to Data Cache
const data = await fetch('/api/posts', {
  cache: 'force-cache',
  next: { tags: ['posts'] }, // tag for revalidateTag()
});

// Explicitly uncached (same as default in v15)
const data = await fetch('/api/posts', { cache: 'no-store' });`,
              },
              {
                label: "Revalidate by tag after mutation",
                code: `// Server Action after creating a post
'use server'
import { revalidateTag } from 'next/cache';

export async function createPost(data: FormData) {
  await db.post.create({ ... });
  revalidateTag('posts'); // clears all fetches tagged 'posts'
}`,
              },
            ],
            docs: [
              {
                label: "nextjs.org → Caching (read entire page)",
                url: "https://nextjs.org/docs/app/building-your-application/caching",
              },
            ],
            prompt:
              "Explain all four caching layers. Then walk me through what happens to each cache layer when I: (1) call revalidatePath, (2) call revalidateTag, (3) a user navigates back.",
          },
          {
            title: "Static vs dynamic rendering and PPR",
            what: "Next.js automatically decides between static (build-time) and dynamic (per-request) rendering. Partial Prerendering combines both in a single route.",
            points: [
              "Static: no dynamic functions in route — rendered at build, cached in Full Route Cache",
              "Dynamic: using cookies(), headers(), searchParams, or unstable_noStore() — per-request",
              "generateStaticParams: pre-renders dynamic routes — [slug] pages rendered at build",
              "PPR (Partial Prerendering): static shell + dynamic Suspense holes — both on one page",
              "force-static and force-dynamic in route segment config override automatic detection",
              "ISR: revalidate: 60 in fetch options — background regeneration after TTL expires",
            ],
            docs: [
              {
                label: "nextjs.org → Static and Dynamic",
                url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default",
              },
            ],
            prompt:
              'I have a product page that is mostly static but has a personalized "recommended for you" section. Walk me through implementing this with PPR.',
          },
          {
            title: "Environment variables and security",
            what: "Environment variables in Next.js have strict server/client exposure rules. Getting this wrong leaks secrets to the browser — a serious security vulnerability.",
            points: [
              "Server-only: any env var WITHOUT NEXT_PUBLIC_ prefix — never sent to browser",
              "Client-exposed: ONLY vars with NEXT_PUBLIC_ — bundled into client JavaScript",
              "NEVER put: API keys, DB credentials, service secrets in NEXT_PUBLIC_ variables",
              "server-only package: throws a build error if the module is imported on the client",
              "Runtime env vars: process.env at request time for dynamic config (Vercel supports this)",
              "Type safety: declare env var types with t3-env or zod for runtime validation",
            ],
            docs: [
              {
                label: "nextjs.org → Environment Variables",
                url: "https://nextjs.org/docs/app/building-your-application/configuring/environment-variables",
              },
            ],
            prompt:
              "Show me exactly how a secret API key gets accidentally leaked in Next.js and the exact steps to prevent each leak vector.",
          },
          {
            title: "Performance optimization",
            what: "Next.js provides many built-in optimizations — but you need to know where to look and how to measure before and after.",
            points: [
              "Server Components by default: zero JS for static UI — the largest optimization available",
              "@next/bundle-analyzer: visualize what is in your client bundle — find large dependencies",
              "next/dynamic: lazy load heavy Client Components — code splitting for components",
              "Turbopack (Next.js 15): new bundler — significantly faster dev server HMR",
              "next/script strategy prop: beforeInteractive, afterInteractive, lazyOnload, worker",
              "@next/third-parties: type-safe wrappers for Google Analytics, YouTube, Maps",
            ],
            docs: [
              {
                label: "nextjs.org → Optimizing",
                url: "https://nextjs.org/docs/app/building-your-application/optimizing",
              },
            ],
            prompt:
              "My Next.js app has a 380KB JavaScript bundle. Walk me through diagnosing what is causing it and reducing it step by step.",
          },
          {
            title: "Deployment and output modes",
            what: "Next.js supports multiple deployment targets with different tradeoffs. Understanding each prevents surprises after deployment.",
            points: [
              "Vercel: zero-config — automatic ISR, Edge Functions, image optimization, analytics",
              "Node.js server: npm run build && npm start — full feature support, needs always-on server",
              'Docker: output: "standalone" in next.config.js — minimal self-contained image',
              'Static export: output: "export" — pure static files, NO server features (no ISR, no middleware)',
              "Edge runtime: faster cold starts globally — but limited Node.js APIs and package support",
              "Verify caching behavior in production — it differs from development in important ways",
            ],
            docs: [
              {
                label: "nextjs.org → Deployment",
                url: "https://nextjs.org/docs/app/building-your-application/deploying",
              },
            ],
            prompt:
              "I want to self-host Next.js 15 on a VPS using Docker. Walk me through the Dockerfile, nginx config, and what Next.js features I lose compared to Vercel.",
          },
        ],
      },
    },
  },

  node: {
    nav: "nav-node",
    phase: "Phase 1 · Week 5–6",
    title: "Node.js Depth",
    meta: "2 weeks · ~20 hrs",
    color: "grn",
    intro:
      "Most developers use Node.js without understanding what it is doing. The event loop, streams, worker threads, and memory model explain most production performance and debugging challenges — and are heavily tested at senior-level interviews.",
    docNote:
      "The nodejs.org event loop guide is one of the best-written pieces of technical documentation in the JS ecosystem. Read it end to end before anything else.",
    docs: [
      {
        label: "nodejs.org → Event loop guide",
        url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick",
      },
      {
        label: "nodejs.org → Streams API",
        url: "https://nodejs.org/api/stream.html",
      },
      {
        label: "nodejs.org → Worker Threads",
        url: "https://nodejs.org/api/worker_threads.html",
      },
      {
        label: "nodejs.org → Diagnostics guide",
        url: "https://nodejs.org/en/docs/guides/diagnostics",
      },
    ],
    levels: {
      beginner: {
        label: "Beginner",
        desc: "Node.js fundamentals — modules, HTTP, async patterns.",
        subtopics: [
          {
            title: "CommonJS vs ES Modules",
            what: "Node.js supports two module systems. Understanding the difference prevents import errors and affects how you configure bundlers, TypeScript, and testing tools.",
            points: [
              "CJS: require() / module.exports — synchronous, dynamic, works in .js files",
              "ESM: import / export — static, tree-shakeable, top-level await supported",
              'package.json "type": "module" makes .js files ESM by default',
              "Interop: CJS can import ESM with dynamic import() — ESM cannot require() CJS",
              "__dirname and __filename unavailable in ESM — use import.meta.url instead",
              "Named exports in CJS: module.exports = { a, b } — but default export is the pattern",
            ],
            docs: [
              {
                label: "nodejs.org → Modules",
                url: "https://nodejs.org/api/modules.html",
              },
            ],
            prompt:
              "Show me the exact error and fix when trying to require() an ESM-only package in a CJS project.",
          },
          {
            title: "HTTP module and server fundamentals",
            what: "Understanding Node's built-in HTTP module demystifies what Express and Fastify do under the hood. This knowledge helps you debug framework behavior.",
            points: [
              "http.createServer((req, res) => {}) — req and res are streams",
              "req is a Readable stream — body must be read in chunks or buffered",
              "res is a Writable stream — must call res.end() to complete the response",
              "Frameworks add: routing, middleware stack, body parsing, error handling on top",
              "Status codes matter: 200, 201, 400, 401, 403, 404, 409, 500 — know when to use each",
              "Keep-alive connections: HTTP/1.1 default — connection reuse improves throughput",
            ],
            docs: [
              {
                label: "nodejs.org → HTTP",
                url: "https://nodejs.org/api/http.html",
              },
            ],
            prompt:
              "Build a basic JSON API server from scratch using only node:http — no frameworks. Handle GET and POST with body parsing and proper error responses.",
          },
          {
            title: "Asynchronous patterns — callbacks to async/await",
            what: "Node.js evolved through three async patterns. Understanding all three is essential for reading legacy code and understanding what async/await compiles to.",
            points: [
              "Callbacks: error-first convention (err, data) — still used in many APIs",
              "Promises: .then()/.catch() — chainable, composable, avoids callback hell",
              "async/await: syntactic sugar over Promises — try/catch for errors",
              "util.promisify(): converts callback-style functions to Promise-returning",
              "Promise.all(): run multiple async operations in parallel — fail fast on any error",
              "Promise.allSettled(): run all, get all results regardless of failure",
            ],
            docs: [
              {
                label: "nodejs.org → util.promisify",
                url: "https://nodejs.org/api/util.html#utilpromisifyoriginal",
              },
            ],
            prompt:
              "Show me the same operation written with callbacks, promises, and async/await. Explain the error handling differences in each.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "The event loop, streams, EventEmitter, and error handling.",
        subtopics: [
          {
            title: "Event loop phases in depth",
            what: "The event loop is what makes Node.js non-blocking despite being single-threaded. It cycles through six phases — each processes a specific callback queue.",
            points: [
              "Phase 1 — Timers: setTimeout and setInterval callbacks whose delay has elapsed",
              "Phase 2 — Pending callbacks: I/O error callbacks deferred from last iteration",
              "Phase 3/4 — Idle/Prepare: internal use only",
              "Phase 5 — Poll: retrieves new I/O events — BLOCKS here if no timers are pending",
              "Phase 6 — Check: setImmediate callbacks — always runs after I/O phase",
              'Phase 7 — Close: socket "close" events and similar cleanup callbacks',
              "Between each phase: process.nextTick queue drains completely, then microtask (Promise) queue",
            ],
            gotchas: [
              "setTimeout(fn, 0) does NOT mean 'run immediately' — the minimum delay is ~1ms and it runs in the Timers phase, which may be after I/O callbacks and setImmediate depending on where you call it",
              "Blocking the event loop with CPU work (large JSON.parse, heavy regex, sync crypto) blocks ALL incoming requests — Node.js is single-threaded; one slow synchronous call blocks everything",
              "process.nextTick callbacks run between EVERY phase, not just at the end of a tick — if you recursively call nextTick, you starve I/O and timers indefinitely",
              "Async functions resume after await in the microtask queue — not in a new event loop iteration; this means they have higher priority than setImmediate and setTimeout",
            ],
            examples: [
              {
                label: "Execution order — predict the output",
                code: `console.log('1 — sync');

setTimeout(() => console.log('2 — setTimeout'), 0);

Promise.resolve().then(() => console.log('3 — Promise microtask'));

process.nextTick(() => console.log('4 — nextTick'));

setImmediate(() => console.log('5 — setImmediate'));

console.log('6 — sync');

// Output order:
// 1 — sync
// 6 — sync
// 4 — nextTick        (nextTick queue drains first)
// 3 — Promise microtask (microtask queue second)
// 2 — setTimeout      (Timers phase)
// 5 — setImmediate    (Check phase — after I/O)`,
              },
            ],
            docs: [
              {
                label: "nodejs.org → Event Loop in Depth",
                url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick",
              },
            ],
            prompt:
              "Give me a complex event loop problem with nextTick, setImmediate, Promise.resolve, and setTimeout(fn,0) all mixed together. Make me predict the output order.",
          },
          {
            title: "process.nextTick vs setImmediate vs Promises",
            what: "Three ways to schedule microtask and macrotask work — at very different points in the event loop. A common interview topic and a frequent source of subtle bugs.",
            points: [
              "process.nextTick: fires before the event loop continues to next phase — highest priority async",
              "Promise microtasks (.then): fire after nextTick queue drains — still before next I/O",
              "setImmediate: fires in Check phase — after I/O callbacks, before next Timers phase",
              "setTimeout(fn, 0): Timers phase — can fire before or after setImmediate depending on context",
              "Recursive nextTick: can starve the event loop — blocks I/O from executing",
              "Use nextTick for: critical deferred logic; setImmediate for: deferring to next event loop iteration",
            ],
            docs: [
              {
                label: "nodejs.org → nextTick vs setImmediate",
                url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick#process-nexttick-vs-setimmediate",
              },
            ],
            prompt:
              "Show me a real example where recursive process.nextTick causes visible latency problems in an HTTP server under load.",
          },
          {
            title: "Streams — readable, writable, transform",
            what: "Streams process data piece by piece instead of loading everything into memory at once. Essential for file handling, HTTP, and building efficient data pipelines at scale.",
            points: [
              "Readable: data source — fs.createReadStream, http.IncomingMessage, process.stdin",
              "Writable: data destination — fs.createWriteStream, http.ServerResponse",
              "Transform: readable + writable — reads input, produces transformed output (zlib.createGzip)",
              "pipeline(source, ...transforms, dest): chains streams with automatic error/cleanup handling",
              "Backpressure: writable cannot keep up with readable — streams manage via highWaterMark",
              "Avoid pipe() in modern code — pipeline() handles errors correctly unlike pipe()",
            ],
            docs: [
              {
                label: "nodejs.org → Streams",
                url: "https://nodejs.org/api/stream.html",
              },
            ],
            prompt:
              "Build a pipeline that reads a large JSON file, parses it in chunks, transforms the records, and writes them to a new file. Explain backpressure as it applies here.",
          },
          {
            title: "EventEmitter — internals and patterns",
            what: "EventEmitter is the backbone of Node.js — streams, HTTP, and most core modules extend it. Understanding it helps you work effectively with any Node.js API.",
            points: [
              "on(event, listener): register listener — can register multiple for same event",
              "emit(event, ...args): fires all registered listeners synchronously",
              "once(event, listener): auto-removes after first emission",
              "removeListener() / off(): critical to prevent memory leaks in long-lived processes",
              'Missing "error" listener: emit("error", err) crashes the process if none registered',
              "class MyEmitter extends EventEmitter {} — extend cleanly for custom emitters",
            ],
            docs: [
              {
                label: "nodejs.org → Events",
                url: "https://nodejs.org/api/events.html",
              },
            ],
            prompt:
              "Build a typed EventEmitter in TypeScript. Show me how a missing error listener causes a crash and a common memory leak pattern with listeners.",
          },
          {
            title: "Error handling — all patterns",
            what: "Node.js has multiple error propagation mechanisms. Using the wrong one causes silent failures, unhandled rejections, or process crashes in production.",
            points: [
              "Callback errors: first argument convention — always check (err) before using data",
              "Promise rejections: must be caught — unhandledRejection crashes in Node 15+",
              "try/catch: only works for synchronous code and async/await — not bare promises",
              'EventEmitter errors: must have "error" listener registered or crash on emit',
              'process.on("uncaughtException"): last resort — log and restart, not normal error handling',
              "Domain module: deprecated — do not use in new code",
            ],
            docs: [
              {
                label: "nodejs.org → Errors",
                url: "https://nodejs.org/api/errors.html",
              },
            ],
            prompt:
              "Show me every way an error can be silently swallowed in Node.js. For each pattern, show me the correct handling approach.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Worker threads, clustering, V8 memory, and production profiling.",
        subtopics: [
          {
            title: "Worker threads — true parallelism",
            what: "Worker threads bring true parallelism to CPU-intensive work in Node.js without spawning separate processes. Use them when the event loop would be blocked.",
            points: [
              "Each worker has its own V8 instance, event loop, and Node.js runtime",
              'Communication: postMessage / on("message") — data is structured-cloned',
              "SharedArrayBuffer: shared memory between main and workers — requires Atomics for synchronization",
              "Use for: image processing, cryptography, data parsing, regex on large inputs, anything CPU-blocking",
              "Worker pool pattern: maintain a pool of N workers — queue tasks, reuse workers",
              "Do NOT use for I/O-bound work — the event loop already handles that efficiently",
            ],
            docs: [
              {
                label: "nodejs.org → Worker Threads",
                url: "https://nodejs.org/api/worker_threads.html",
              },
            ],
            prompt:
              "Build a worker thread pool in Node.js that processes CPU-intensive tasks without blocking the event loop. Show the queuing mechanism.",
          },
          {
            title: "Cluster module and PM2 in production",
            what: "The cluster module allows Node.js to use all CPU cores. PM2 manages this in production with process monitoring and zero-downtime restarts.",
            points: [
              "cluster.fork(): spawns worker processes that share the same TCP port",
              "Primary distributes incoming connections round-robin to workers (default)",
              "Worker crash: primary respawns — zero downtime for the port",
              'IPC channel: primary and workers communicate via process.send() / process.on("message")',
              "PM2 cluster mode: pm2 start app.js -i max — forks one worker per CPU core",
              "Graceful shutdown: listen for SIGTERM, finish in-flight requests before exiting",
            ],
            docs: [
              {
                label: "nodejs.org → Cluster",
                url: "https://nodejs.org/api/cluster.html",
              },
            ],
            prompt:
              "Show me how cluster mode works with a simple HTTP server. What happens when a worker crashes mid-request? Show the PM2 equivalent.",
          },
          {
            title: "V8 memory model and garbage collection",
            what: "V8 uses a generational garbage collector. Understanding how it works lets you write GC-friendly code and diagnose memory leaks in production with the right tools.",
            points: [
              "New space (young generation): small, frequent minor GC — most objects die young",
              "Old space (old generation): objects that survived 2+ minor GCs — less frequent major GC",
              "Major GC (Mark-Compact): full heap scan — causes noticeable pauses in high-load servers",
              "Common leaks: globals, event listeners not removed, closures capturing large objects, unbounded caches",
              "process.memoryUsage(): rss, heapTotal, heapUsed, external — log periodically in production",
              "--max-old-space-size=4096: increase V8 heap limit for memory-intensive workloads",
            ],
            docs: [
              {
                label: "nodejs.org → Diagnostics",
                url: "https://nodejs.org/en/docs/guides/diagnostics",
              },
            ],
            prompt:
              "Deliberately create a memory leak in Node.js Express server. Then walk me through detecting and diagnosing it using Chrome DevTools heap snapshots.",
          },
          {
            title: "Performance profiling with clinic.js",
            what: "Production Node.js performance issues require proper tooling. clinic.js is the standard diagnostic suite for Node.js — built by NearForm.",
            points: [
              "clinic doctor: high-level diagnosis — event loop delays, memory issues, I/O bottlenecks",
              "clinic flame: CPU flame graph — find hot code paths consuming the most time",
              "clinic bubbleprof: async operation visualization — find what is blocking between async calls",
              "--prof flag: V8 profiler output — low-level CPU analysis, processed with node --prof-process",
              "perf_hooks module: high-resolution timing with performance.mark() and performance.measure()",
              "0x: interactive flame graph for Node.js — alternative to clinic flame",
            ],
            docs: [
              {
                label: "clinic.js docs",
                url: "https://clinicjs.org/documentation",
              },
            ],
            prompt:
              "My Node.js API has high tail latency (P99 is 10x P50) but average CPU is normal. Walk me through diagnosing this with clinic.js.",
          },
        ],
      },
    },
  },

  typescript: {
    nav: "nav-typescript",
    phase: "Phase 1 · Week 7–8",
    title: "TypeScript Advanced",
    meta: "2 weeks · ~20 hrs",
    color: "acc",
    intro:
      'Most developers use TypeScript as "JavaScript with annotations". Senior engineers use the type system to enforce business logic, eliminate entire bug categories at compile time, and create self-documenting APIs. This topic takes you from user to author of the type system.',
    docNote:
      "Read the TypeScript Handbook chapters in order — they build on each other. Use the TypeScript Playground to experiment with every example.",
    docs: [
      {
        label: "TS Handbook → Generics",
        url: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      },
      {
        label: "TS Handbook → Conditional Types",
        url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
      },
      {
        label: "TS Handbook → Mapped Types",
        url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html",
      },
      {
        label: "TS Reference → Utility Types",
        url: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
      },
      {
        label: "TypeScript Playground",
        url: "https://www.typescriptlang.org/play",
      },
    ],
    levels: {
      beginner: {
        label: "Beginner",
        desc: "Type system fundamentals every TypeScript developer must own.",
        subtopics: [
          {
            title: "Type vs Interface",
            what: "Types and interfaces are often interchangeable but have important behavioral differences. Knowing when to use each — and why — is a common senior interview question.",
            points: [
              "Interface: extendable with extends keyword, supports declaration merging",
              "Type alias: can alias any type — unions, intersections, primitives, tuples, functions",
              "Declaration merging: multiple interface declarations with same name merge automatically",
              "Type cannot merge — redefining a type alias is an error",
              "Prefer interface for: public API shapes, class contracts, anything that may be extended",
              "Prefer type for: unions, intersections, mapped types, complex compositions",
            ],
            gotchas: [
              "Declaration merging can bite you silently — if two files both declare 'interface Window', they merge; if one has a typo in a property, TypeScript may accept bad code because the correct property came from the other declaration",
              "type is NOT always slower than interface for the TypeScript compiler — the old advice that interfaces were faster is largely irrelevant in modern TypeScript; choose based on semantics, not performance",
              "Extending a type with & intersection does NOT give an error on conflicting properties — if two intersected types have the same property with different types, the result is 'never', which is silently unusable",
            ],
            examples: [
              {
                label: "The key behavioral differences",
                code: `// 1. Declaration merging — only interface supports this
interface User { name: string; }
interface User { age: number; }
// User is now { name: string; age: number } — valid

type Product = { name: string; };
type Product = { price: number }; // ❌ ERROR: duplicate identifier

// 2. Union types — only type aliases
type Status = 'active' | 'inactive' | 'pending'; // ✅
interface Status = 'active' | 'inactive'; // ❌ not valid syntax

// 3. Intersection conflict — silent never
type A = { value: string };
type B = { value: number };
type AB = A & B;
const x: AB = { value: 'hello' }; // ❌ value is never (string & number)`,
              },
            ],
            docs: [
              {
                label: "TS Handbook → Interfaces vs Types",
                url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces",
              },
            ],
            prompt:
              "Show me 3 cases where type and interface behave differently. Then quiz me on when to choose each with 5 scenarios.",
          },
          {
            title: "Union, intersection, and literal types",
            what: "Unions (A | B) and intersections (A & B) are the fundamental composition tools in TypeScript's type system.",
            points: [
              "Union: value is ONE of the types — handle each case separately",
              "Intersection: value satisfies ALL types — like extending multiple interfaces",
              'Literal types: "success" | "error" | 404 — not just string or number',
              "never type: empty union — a value that cannot exist — used for exhaustive checks",
              "unknown vs any: unknown requires narrowing before use — any skips type checking entirely",
              "Type narrowing: typeof, instanceof, in operator, custom type guards — how to narrow unions",
            ],
            docs: [
              {
                label: "TS Handbook → Union Types",
                url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types",
              },
            ],
            prompt:
              "Build a Result<T, E> type using discriminated union. Show me safe narrowing and why this pattern prevents runtime errors that exceptions cannot.",
          },
          {
            title: "Type narrowing and guards",
            what: "Type narrowing is how TypeScript refines a broad type to a specific one based on runtime checks you write. Custom type guards extend this to user-defined types.",
            points: [
              'typeof guard: typeof x === "string" narrows to string in that branch',
              "instanceof guard: x instanceof Date narrows to Date — works with classes",
              'in guard: "name" in obj narrows to types that have a name property',
              "Discriminated union narrowing: switch on shared literal field — TypeScript handles the rest",
              "Custom type guard: function isUser(x: unknown): x is User { ... }",
              "Assertion functions: function assertString(x: unknown): asserts x is string — throws if false",
            ],
            docs: [
              {
                label: "TS Handbook → Narrowing",
                url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
              },
            ],
            prompt:
              "I receive unknown data from an external API. Show me how to safely narrow it step by step to my expected type with proper validation.",
          },
          {
            title: "Enums vs const objects",
            what: "TypeScript enums have surprising behavior and generate runtime code. Const objects with as const are often a cleaner alternative.",
            points: [
              "Numeric enums: Direction.Up = 0, Direction.Down = 1 — reverse mapping exists on the runtime object",
              'String enums: Direction.Up = "UP" — no reverse mapping — safer',
              "const enums: inlined at compile time — no runtime object generated — cannot be referenced dynamically",
              "Enums generate JavaScript — adds to bundle size and can be surprising",
              'Prefer: const STATUS = { Active: "active", Inactive: "inactive" } as const',
              "as const: makes object deeply readonly with literal types inferred",
            ],
            docs: [
              {
                label: "TS Handbook → Enums",
                url: "https://www.typescriptlang.org/docs/handbook/enums.html",
              },
            ],
            prompt:
              "Show me the compiled JavaScript output of a numeric enum. Show me the const object alternative. When would you still choose an enum?",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Generics, utility types, conditional types, and building type-safe abstractions.",
        subtopics: [
          {
            title: "Generics and constraints",
            what: "Generics write functions and types that work across multiple types while preserving type information. Constraints narrow what a generic can accept.",
            points: [
              "<T> declares a type parameter — inferred from arguments in most cases",
              "<T extends object> constrains T to non-primitive types",
              "<T extends keyof U> constrains T to be a key of U",
              "Default generics: <T = string> makes the argument optional in type position",
              "<T, K extends keyof T>: multiple type parameters with relationships",
              "Generic functions vs generic types — different use cases and syntax",
            ],
            docs: [
              {
                label: "TS Handbook → Generics",
                url: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
              },
            ],
            prompt:
              "Implement a type-safe get() function that accepts an object and a key, returns the value at that key. Make it handle nested paths with dot notation.",
          },
          {
            title: "Conditional types and infer",
            what: "Conditional types build types that depend on other types — type-level if/else. The infer keyword extracts type variables from within complex types.",
            points: [
              "T extends U ? X : Y — evaluates to X if T is assignable to U, Y otherwise",
              "Distributive conditional types: (A | B) extends U distributes to (A extends U ? X : Y) | (B extends U ? X : Y)",
              "infer R: declare a type variable to be inferred within the extends clause",
              "ReturnType<T>: T extends (...args: any[]) => infer R ? R : never",
              "Awaited<T>: recursively unwraps T extends Promise<infer R> ? Awaited<R> : T",
              "NonNullable<T>: T extends null | undefined ? never : T",
            ],
            docs: [
              {
                label: "TS Handbook → Conditional Types",
                url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
              },
            ],
            prompt:
              "Implement Awaited<T>, Parameters<T>, and ReturnType<T> from scratch using only infer. Explain each step.",
          },
          {
            title: "Mapped types",
            what: "Mapped types create new object types by transforming every property of an existing type. They are how all the built-in utility types are implemented.",
            points: [
              "{ [K in keyof T]: T[K] } — identity map over all keys of T",
              "? modifier: { [K in keyof T]?: T[K] } — adds optional",
              "- modifier: { [K in keyof T]-?: T[K] } — removes optional (Required<T>)",
              "readonly modifier: { readonly [K in keyof T]: T[K] } — Readonly<T>",
              "Key remapping with as: { [K in keyof T as Uppercase<string & K>]: T[K] }",
              "Filter keys: { [K in keyof T as T[K] extends string ? K : never]: T[K] }",
            ],
            docs: [
              {
                label: "TS Handbook → Mapped Types",
                url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html",
              },
            ],
            prompt:
              "Implement Partial, Required, Readonly, Pick, and Omit from scratch. Then implement DeepPartial<T> that handles arbitrarily nested objects.",
          },
          {
            title: "Template literal types",
            what: "Template literal types compose string literal types — enabling type-safe string manipulation and API design patterns at the type level.",
            points: [
              "`${A}${B}`: string type combining two literal types",
              "Uppercase<S>, Lowercase<S>, Capitalize<S>, Uncapitalize<S> — built-in string intrinsic types",
              "Event handler typing: `on${Capitalize<string & keyof T>}` creates typed event listener names",
              'Path types: deeply typed dot notation — "user.address.city" with full inference',
              "CSS property typing: `${CSSProperty}-${CSSVariant}` for exhaustive combinations",
            ],
            docs: [
              {
                label: "TS Handbook → Template Literal Types",
                url: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
              },
            ],
            prompt:
              "Build a typed event system where event handler names are derived from data keys using template literal types. For example: { onClick: handler } from { click: Event }.",
          },
          {
            title: "Discriminated unions in depth",
            what: "Discriminated unions model types with mutually exclusive shapes. TypeScript narrows the type automatically in switch and if-else blocks.",
            points: [
              "Shared discriminant: a property with a unique literal type in each member",
              'TypeScript narrows automatically: switch(action.type) { case "ADD": ... }',
              "Exhaustive checking: a default: branch that calls assertNever(x: never) catches missing cases",
              'Better than optional fields: { type: "circle"; radius: number } vs { type: "rect"; width: number; height: number }',
              "Generic discriminated unions: Result<T, E> = { ok: true; value: T } | { ok: false; error: E }",
              "Common in: Redux actions, API responses, state machines, parser outputs",
            ],
            docs: [
              {
                label: "TS Handbook → Discriminated Unions",
                url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
              },
            ],
            prompt:
              "Design a complete API response type system using discriminated unions with exhaustive narrowing. Show me how TypeScript catches a missing case at compile time.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Declaration files, module augmentation, tsconfig mastery, and variance.",
        subtopics: [
          {
            title: "Declaration files and module augmentation",
            what: "Declaration files (.d.ts) describe the types of JavaScript code for TypeScript. Module augmentation adds or modifies types of existing modules.",
            points: [
              ".d.ts: type-only — no runtime code emitted, describes shape of external code",
              'declare module "express": augment types of an existing package',
              "Extend Express Request: declare global { namespace Express { interface Request { user: User } } }",
              "Ambient declarations: declare const MY_CONST: string — describes globals",
              '/// <reference types="...">: add global type dependencies in triple-slash comments',
              "DefinitelyTyped (@types/): community type packages for untyped npm packages",
            ],
            docs: [
              {
                label: "TS Handbook → Declaration Files",
                url: "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html",
              },
            ],
            prompt:
              "Show me how to augment the Express Request type to add a user property. Then show me how to augment a package that ships wrong types.",
          },
          {
            title: "tsconfig.json mastery",
            what: "tsconfig.json controls the entire TypeScript compiler. Wrong settings cause subtle bugs that pass type checking but fail at runtime.",
            points: [
              "strict: true — enables all strict checks — always use this in new projects",
              "strictNullChecks: null and undefined are distinct types — prevents NPEs",
              "noImplicitAny: every value must have a type — prevents silent any creep",
              "target: ES2022 for modern Node.js; ES2017 for broad browser compatibility",
              'moduleResolution: "bundler" for Vite/webpack; "node16" or "nodenext" for Node.js ESM',
              "paths: module path aliases — must match your bundler's alias configuration exactly",
            ],
            docs: [
              {
                label: "TS Reference → tsconfig options",
                url: "https://www.typescriptlang.org/tsconfig",
              },
            ],
            prompt:
              "Walk me through a production tsconfig.json for a Next.js 15 TypeScript project. Explain every non-default option you include and why.",
          },
          {
            title: "Satisfies operator and const assertions",
            what: "satisfies and as const are two powerful operators for getting precise literal types from values and validating types without losing inference.",
            points: [
              "as const: makes entire object deeply readonly with literal types inferred from values",
              "satisfies T: validates value matches type WITHOUT widening inferred type",
              "const config: Config = {...} — widens to Config, loses specific string literals",
              "const config = {...} satisfies Config — keeps specific types, validates against Config",
              "Combined: const config = { ... } as const satisfies AppConfig — both benefits",
              "Use for: route tables, color palettes, config objects, enum-like constants with type safety",
            ],
            docs: [
              {
                label: "TS 4.9 → satisfies operator",
                url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator",
              },
            ],
            prompt:
              "Build a config object for a Next.js app where satisfies gives better autocomplete and catches errors that a type annotation would miss.",
          },
          {
            title: "Variance and structural typing",
            what: "TypeScript's structural type system means compatibility is based on shape, not name. Variance describes how generic type relationships follow or invert the contained type's relationship.",
            points: [
              "Structural typing: { name: string } is assignable to { name: string; age?: number }",
              "Covariant position: return types — Cat extends Animal means () => Cat extends () => Animal",
              "Contravariant position: parameter types — inverted: (x: Animal) => void extends (x: Cat) => void",
              "Bivariant method parameters: TypeScript is lenient here — can hide bugs — prefer function properties",
              "in/out variance annotations (TS 4.7): explicit variance for generic parameters",
              "readonly arrays: ReadonlyArray<Cat> is covariant — safer than mutable Cat[]",
            ],
            docs: [
              {
                label: "TS Handbook → Type Compatibility",
                url: "https://www.typescriptlang.org/docs/handbook/type-compatibility.html",
              },
            ],
            prompt:
              "Explain covariance and contravariance with examples from a real codebase. Show me where TypeScript's bivariant method parameters can hide a runtime bug.",
          },
        ],
      },
    },
  },

  dsa: {
    nav: "nav-dsa",
    phase: "Phase 2 · Week 9–18",
    title: "DSA Foundations",
    meta: "8–10 weeks · ~60 hrs · daily practice required",
    color: "vi",
    intro:
      "DSA is the one area in this roadmap where AI cannot compress your timeline significantly. Solving problems under time pressure is pure muscle memory — it requires daily repetitions over weeks. Claude can teach you a pattern in 20 minutes. Executing it fluently under interview pressure takes weeks of practice.",
    docNote:
      "Neetcode.io has the best curated, ordered problem set. Use Claude as your mock interviewer — NOT as your answer key. Ask for a hint only if genuinely stuck. After solving, always ask Claude to review your solution.",
    docs: [
      {
        label: "Neetcode.io — curated problems",
        url: "https://neetcode.io/practice",
      },
      {
        label: "MDN → Array methods reference",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
      },
      {
        label: "MDN → Map",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
      },
      { label: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com" },
    ],
    levels: {
      beginner: {
        label: "Foundations",
        desc: "Essential patterns that appear in the majority of interview problems.",
        subtopics: [
          {
            title: "Big-O complexity analysis",
            what: "Time and space complexity analysis is mandatory in every technical interview. You must analyze your own solution before the interviewer asks.",
            points: [
              "O(1): constant — hash map lookup, array index access",
              "O(log n): logarithmic — binary search, balanced BST operations",
              "O(n): linear — single loop through input",
              "O(n log n): linearithmic — merge sort, heapsort, most efficient comparison sorts",
              "O(n²): quadratic — nested loops — almost always can be optimized",
              "Space complexity: additional memory used — O(1) if in-place modification",
              "Amortized: average cost — dynamic array append is O(1) amortized despite occasional O(n)",
            ],
            docs: [
              {
                label: "Big-O Cheat Sheet",
                url: "https://www.bigocheatsheet.com",
              },
            ],
            prompt:
              "Give me 5 code snippets. For each, I will analyze time and space complexity. Include at least one amortized and one tricky O(n log n) case.",
          },
          {
            title: "Arrays and two pointer pattern",
            what: "Two pointer is the most universally applicable pattern. It converts O(n²) brute force solutions to O(n) for sorted arrays and string problems.",
            points: [
              "Same direction: slow and fast pointers — remove duplicates in-place, find cycle in linked list",
              "Opposite ends: left and right converging — two-sum on sorted array, valid palindrome",
              "Sliding window is a variant: one pointer marks window start, one marks end",
              "Often requires pre-sorting — add the O(n log n) sort cost to your complexity analysis",
              "Classic problems: container with most water, trapping rain water, 3-sum",
            ],
            docs: [
              {
                label: "Neetcode → Two Pointers",
                url: "https://neetcode.io/practice",
              },
            ],
            prompt:
              "Give me a medium two-pointer problem. Do not show the solution. Give me exactly one conceptual hint only if I explicitly ask for it.",
          },
          {
            title: "Sliding window",
            what: "Sliding window maintains a contiguous window over an array or string, expanding and contracting as needed. Eliminates nested loops for subarray/substring problems.",
            points: [
              "Fixed size window: slide by one each iteration — max sum subarray of size k",
              "Variable size: expand right pointer until condition violated, then contract left pointer",
              "Track window state with a running counter, sum, or frequency hash map",
              "Right pointer always advances — left pointer only advances to restore validity",
              "Classic: longest substring without repeating characters, minimum window substring",
            ],
            docs: [],
            prompt:
              'Walk me through the thought process for "minimum window substring" without giving me the code. Ask me questions to guide my thinking.',
          },
          {
            title: "Hash maps and frequency counting",
            what: "When in doubt, a hash map usually converts an O(n²) nested loop solution to O(n). Frequency counters solve a huge class of string and array problems.",
            points: [
              "Use Map over plain objects for non-string keys — Map.has() is explicit and safe",
              "Set for O(1) existence checks — replaces array.includes() which is O(n)",
              "Frequency counter pattern: count occurrences, compare two frequency maps",
              "Two-sum: store value→index in map, check if complement exists on each iteration",
              "Group anagrams: sort characters as key, group values sharing the same sorted key",
            ],
            docs: [
              {
                label: "MDN → Map",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
              },
            ],
            prompt:
              "Give me two-sum and then a harder hash map variant I have not seen. I will solve both. Review my solution after each.",
          },
          {
            title: "Binary search — beyond sorted arrays",
            what: "Binary search eliminates half the search space each iteration. It applies to far more situations than just finding an element in a sorted array.",
            points: [
              "Core insight: monotonic condition — if condition(mid) is true, you can eliminate half the space",
              "Classic: sorted array search — left, right, mid = left + Math.floor((right-left)/2)",
              'On answer space: "what is the minimum X such that condition(X) is true?"',
              "Template variations: find exact value, find leftmost, find rightmost satisfying condition",
              "Classic advanced: search in rotated sorted array, find peak element, koko eating bananas",
            ],
            docs: [],
            prompt:
              "Give me a binary search problem where I search the answer space, not the array. Guide me to recognize the pattern without giving away the approach.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Trees, graphs, stacks, queues, heaps, and medium-difficulty patterns.",
        subtopics: [
          {
            title: "Stacks and monotonic stack",
            what: "Stacks (LIFO) enable elegant O(n) solutions to problems that seem to require O(n²) nested loops. The monotonic stack is the key advanced pattern.",
            points: [
              "Stack for: balanced parentheses, function call simulation, undo, DFS iteratively",
              "Monotonic increasing stack: pop elements smaller than current — next greater element",
              "Monotonic decreasing stack: pop elements larger than current — next smaller element",
              "Classic problems: largest rectangle in histogram, daily temperatures, asteroid collision",
              "Deque (double-ended): sliding window maximum — maintain decreasing monotonic deque",
            ],
            docs: [],
            prompt:
              'Explain the monotonic stack pattern with the "daily temperatures" problem. Then give me a new problem using the same pattern.',
          },
          {
            title: "Trees — DFS and BFS traversals",
            what: "Trees appear everywhere in interviews. DFS and BFS are the two fundamental traversal strategies — mastering both unlocks almost all tree problems.",
            points: [
              "DFS recursive: base case null check, process, recurse left, recurse right — clean and concise",
              "DFS iterative: explicit stack — avoids call stack overflow on very deep trees",
              "BFS: queue — processes level by level — ideal for shortest path, level-order output",
              "In-order (left, root, right): gives sorted output for BST — validate BST uses this",
              "Pre-order (root, left, right): serialize tree, copy tree structure",
              "Post-order (left, right, root): calculate heights, delete subtrees, evaluate expressions",
            ],
            docs: [
              {
                label: "Neetcode → Trees",
                url: "https://neetcode.io/practice",
              },
            ],
            prompt:
              "Give me a medium tree problem that requires choosing between DFS and BFS. Explain why the wrong choice makes it significantly harder.",
          },
          {
            title: "Graphs — representation and traversal",
            what: "Graphs generalize trees to arbitrary connections. They model networks, dependencies, maps, social connections, and scheduling problems.",
            points: [
              "Adjacency list: { node: [neighbors] } — most common in JS interviews — sparse graphs",
              "Adjacency matrix: grid[i][j] === 1 — dense graphs, O(1) edge lookup",
              "DFS on graph: needs a visited Set to avoid infinite loops on cycles",
              "BFS on graph: finds shortest path in unweighted graphs — visited Set still needed",
              "Topological sort: for Directed Acyclic Graphs — Kahn's algorithm (BFS) or DFS reverse post-order",
              "Union-Find (Disjoint Set): detect cycles, find connected components — near O(1) per operation with path compression",
            ],
            docs: [],
            prompt:
              "Give me a problem requiring topological sort. Teach me cycle detection in a directed graph as a prerequisite before I attempt it.",
          },
          {
            title: "Dynamic programming — fundamentals",
            what: "DP solves problems with overlapping subproblems and optimal substructure by caching results. The hard part is recognizing DP problems and defining the state.",
            points: [
              'Recognition: "can I break this into smaller subproblems that overlap?"',
              "Top-down (memoization): recursive + cache Map or array — easier to derive",
              "Bottom-up (tabulation): iterative, build from base case up — more memory efficient",
              "State definition: what variables uniquely identify a subproblem?",
              "Transition: how does answer(n) relate to answer(n-1) and answer(n-2)?",
              "Process: brute force recursion → identify redundant calls → memoize → convert to tabulation",
            ],
            docs: [],
            prompt:
              "Teach me DP progressively: fibonacci → coin change → longest common subsequence. For each, guide me to the insight without giving the solution.",
          },
          {
            title: "Heaps and priority queues",
            what: "A heap provides O(log n) insert and O(1) access to the min or max element. Essential for top-k problems, scheduling, and merging sorted sequences.",
            points: [
              "Min-heap: parent ≤ children — extract minimum in O(1), insert in O(log n)",
              "Max-heap: parent ≥ children — extract maximum in O(1), insert in O(log n)",
              "JavaScript has no built-in heap — implement MinHeap or use a library in interviews",
              "Top-k elements: maintain a min-heap of size k — O(n log k) instead of O(n log n)",
              "Merge k sorted lists: min-heap of (value, listIndex, elementIndex) — pop minimum, push next",
              "Median of data stream: one max-heap (lower half) + one min-heap (upper half)",
            ],
            docs: [],
            prompt:
              "Implement a min-heap in JavaScript from scratch with insert and extractMin. Then use it to solve top-k frequent elements.",
          },
        ],
      },
      senior: {
        label: "Senior / Hard",
        desc: "Advanced DP patterns, graph algorithms, and interview strategy.",
        subtopics: [
          {
            title: "Dynamic programming — advanced patterns",
            what: "Beyond the standard 1D DP are more complex variants that appear in hard interview questions.",
            points: [
              "2D DP: state depends on two indices — edit distance, longest common subsequence",
              "Interval DP: optimize over ranges — matrix chain multiplication, burst balloons",
              "DP on trees: compute for each node from children — diameter, max path sum, house robber III",
              "Bitmask DP: state includes a subset — traveling salesman, minimum cost to visit all nodes",
              "Space optimization: rolling array reduces O(n²) table to O(n) — LCS can use two rows",
            ],
            docs: [],
            prompt:
              "Give me a hard 2D DP problem I have not solved before. Walk me through state definition and the transition relation before I attempt the code.",
          },
          {
            title: "Advanced graph algorithms",
            what: "Beyond DFS/BFS are algorithms for weighted graphs and network analysis that appear in hard interviews and real system design.",
            points: [
              "Dijkstra: shortest path in weighted graph (non-negative edges) — O((V+E) log V) with min-heap",
              "Bellman-Ford: handles negative edge weights, detects negative cycles — O(VE)",
              "Prim/Kruskal: minimum spanning tree — useful for network design and clustering",
              "Tarjan: strongly connected components in directed graph — O(V+E)",
              "Floyd-Warshall: all-pairs shortest path — O(V³) — small dense graphs only",
              "A*: heuristic shortest path — used in pathfinding, game AI",
            ],
            docs: [],
            prompt:
              "Explain Dijkstra's algorithm step by step with a visual walkthrough. Then give me a problem where I need Bellman-Ford instead and explain why Dijkstra fails.",
          },
          {
            title: "Interview strategy and communication",
            what: "Technical correctness is necessary but not sufficient. Senior-level interviews evaluate how you think and communicate as much as whether you get the right answer.",
            points: [
              "First 2–3 minutes: clarify constraints, edge cases, expected input/output size",
              "Think out loud always — silence reads as being lost even if you are thinking correctly",
              "Brute force first: show you understand the problem before optimizing",
              'State complexity before coding: "this will be O(n log n) time, O(n) space"',
              "Walk through a test case after writing code — catch bugs before the interviewer does",
              "Handle edge cases explicitly: empty input, single element, all same, negative numbers",
            ],
            docs: [],
            prompt:
              "Conduct a full 45-minute mock coding interview with me. Give me a medium-hard problem. Evaluate both my solution quality and my communication process. Be strict.",
          },
        ],
      },
    },
  },

  sysfe: {
    nav: "nav-sysfe",
    phase: "Phase 2 · Week 11–13",
    title: "System Design — Frontend",
    meta: "3 weeks · ~24 hrs",
    color: "sky",
    intro:
      "Frontend system design interviews ask you to architect a complete UI system from scratch in 45 minutes. Your PM background is a genuine advantage — you naturally think about requirements, constraints, and tradeoffs before jumping to solutions.",
    docNote:
      "No single resource covers all frontend system design. Practice weekly with Claude as your interviewer — that repetition is the learning.",
    docs: [
      { label: "web.dev → Performance", url: "https://web.dev/performance" },
      { label: "web.dev → Core Web Vitals", url: "https://web.dev/vitals" },
      {
        label: "MDN → Accessibility",
        url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility",
      },
    ],
    levels: {
      beginner: {
        label: "Foundations",
        desc: "The framework and vocabulary for frontend system design interviews.",
        subtopics: [
          {
            title: "The RADIO framework",
            what: "RADIO is a structured approach to frontend system design: Requirements, Architecture, Data model, Interface definition, Optimization. It prevents jumping to solutions without understanding the problem.",
            points: [
              "Requirements: functional (what it does) vs non-functional (performance, a11y, offline support)",
              "Architecture: high-level component tree — identify major UI regions and their responsibilities",
              "Data model: what data exists, where it lives, who owns it",
              "Interface: component API — props, events, callbacks, context — how components talk",
              "Optimization: performance, error states, loading states, edge cases, accessibility",
            ],
            docs: [],
            prompt:
              "Use RADIO to walk me through designing an autocomplete search component for an e-commerce site.",
          },
          {
            title: "Component architecture principles",
            what: "How you structure components determines long-term maintainability. Senior engineers think in composition patterns before thinking in code.",
            points: [
              "Single responsibility: each component does exactly one thing — easy to test and replace",
              "Compound components: shared state via context — <Select><Option /></Select> pattern",
              "Composition over props: children and render props vs deeply nested config objects",
              "Presentational vs container split: separate data fetching from rendering",
              "Design tokens: consistent spacing, color, and type scales across components",
              "Props API design: be explicit, be minimal, prefer controlled over uncontrolled",
            ],
            docs: [],
            prompt:
              "I have a data table component with 25 props. Help me refactor it using compound components and composition patterns.",
          },
          {
            title: "State management — choosing the right tool",
            what: "State management is the hardest problem in frontend. The right solution depends entirely on the shape, ownership, and update frequency of your data.",
            points: [
              "Local state (useState): UI state one component needs — open/closed, hover, input value",
              "Lifted state: move to closest common ancestor when siblings need the same data",
              "Server state (React Query / SWR): cached, synchronized — separate from UI state",
              "Global client state (Zustand / Jotai): simple stores without Redux boilerplate",
              "URL state: underused and undervalued — filters, pagination, tabs belong in URL",
              "Derived state: compute from existing state on render — never store derived values",
            ],
            docs: [],
            prompt:
              "Design the state architecture for a project management app with real-time updates, filters, and a kanban board. Justify every state location decision.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Performance, real-time patterns, and accessibility.",
        subtopics: [
          {
            title: "Core Web Vitals and performance",
            what: "Performance is measurable and testable. Core Web Vitals are Google's metrics — interviewers at product companies reference these specifically in frontend design discussions.",
            points: [
              "LCP (Largest Contentful Paint): < 2.5s — hero images, server response time, render-blocking resources",
              "INP (Interaction to Next Paint): < 200ms — reduce main thread blocking, use web workers",
              "CLS (Cumulative Layout Shift): < 0.1 — reserve space for async images, fonts, ads",
              "Code splitting: React.lazy() for routes and heavy components — reduces initial bundle",
              "Virtualization: TanStack Virtual for lists > 100 items — only renders visible rows",
              'Prefetching: <link rel="prefetch"> or router-level prefetch for likely next pages',
            ],
            docs: [
              {
                label: "web.dev → Core Web Vitals",
                url: "https://web.dev/vitals",
              },
            ],
            prompt:
              "My Next.js app has a poor INP score of 400ms. Walk me through diagnosing which interactions are causing it and the strategies to fix each.",
          },
          {
            title: "Real-time data — WebSockets vs SSE",
            what: "Real-time features require choosing the right transport. Each has distinct performance characteristics, infrastructure requirements, and appropriate use cases.",
            points: [
              "Polling: simplest — works everywhere — high server load for sub-second frequency",
              "Long polling: server holds connection open until data available — reduces round trips",
              "WebSockets: full-duplex persistent connection — ideal for chat, collaborative editing, multiplayer",
              "Server-Sent Events: server-to-client only — simpler than WebSockets, works over HTTP/2",
              "Reconnection: both WebSockets and SSE need exponential backoff retry logic",
              "Use WebSockets when: bidirectional messages needed; SSE when: server-push only, simpler infra",
            ],
            docs: [],
            prompt:
              "I need real-time collaboration for a document editor. Compare WebSockets and operational transforms vs SSE and last-write-wins. Which do I choose and why?",
          },
          {
            title: "Accessibility (a11y) fundamentals",
            what: "Accessibility is increasingly required by law and is explicitly tested in senior frontend interviews. Building accessible components from the start is far easier than retrofitting.",
            points: [
              "Semantic HTML first: button for buttons, nav for navigation, h1→h6 hierarchy — not divs",
              "ARIA: only when semantic HTML cannot express the meaning — aria-label, aria-expanded, role",
              "Keyboard navigation: all interactive elements must be reachable by Tab key alone",
              "Focus management: move focus after modal opens, dialog closes, page transition completes",
              "Color contrast: WCAG AA requires 4.5:1 for normal text — test with Colour Contrast Analyser",
              "Screen reader testing: VoiceOver (Mac/iOS), NVDA (Windows) — test manually before shipping",
            ],
            docs: [
              {
                label: "MDN → ARIA",
                url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA",
              },
            ],
            prompt:
              "Build a modal dialog component that meets WCAG AA standards. Show me focus trapping, aria attributes, keyboard navigation, and screen reader announcement.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Micro-frontends, design systems, and interview practice scenarios.",
        subtopics: [
          {
            title: "Micro-frontend architecture",
            what: "Micro-frontends apply microservice thinking to the frontend — independent teams own independent UI slices with independent deployments. High complexity — only appropriate when team size justifies it.",
            points: [
              "Module Federation (Webpack 5): share components and packages across separately deployed apps",
              "iframe: strongest isolation — worst UX, performance, and CSS integration",
              "Web Components: framework-agnostic custom elements — browser-native but limited ecosystem",
              "Shared dependencies: must coordinate versions — mismatches cause runtime errors",
              "When appropriate: 5+ teams, independent deployments needed, technology heterogeneity",
              "Hidden cost: shared state, consistent UX, performance overhead, increased build complexity",
            ],
            docs: [],
            prompt:
              "My company has 8 frontend teams and deployments are causing conflicts. Walk me through the decision to adopt micro-frontends and which approach to use.",
          },
          {
            title: "Design system architecture",
            what: "Design systems are the highest-leverage frontend investment. A well-architected design system multiplies the velocity of every team that uses it.",
            points: [
              "Design tokens: CSS custom properties for color, spacing, typography — single source of truth",
              "Component variants: use data-variant or className patterns — avoid individual variant props",
              "Compound components: flexible composition without configuration hell",
              "Polymorphic components: as prop — renders as any element type with correct type safety",
              "Documentation: Storybook — stories as spec, testing, and documentation simultaneously",
              "Versioning and breaking changes: semver, changelogs, migration guides — treat as a product",
            ],
            docs: [],
            prompt:
              "Design the token architecture for a design system that supports multiple themes (light, dark, high-contrast). Show me the CSS custom property structure.",
          },
          {
            title: "Frontend system design — practice scenarios",
            what: "These are the most common frontend system design prompts at senior interviews. Practice each end-to-end with Claude as your interviewer.",
            points: [
              "News feed (Twitter/Instagram): infinite scroll, virtualization, optimistic likes, real-time",
              "Autocomplete: debouncing, caching, keyboard navigation, ARIA combobox pattern",
              "Collaborative editor (Google Docs): operational transforms, presence indicators, cursors",
              "Video player: adaptive bitrate, buffering states, captions, keyboard shortcuts",
              "Form builder (Typeform): drag-and-drop, field types, validation, multi-step",
              "E-commerce cart: optimistic updates, stock validation, discount codes, persistence",
            ],
            docs: [],
            prompt:
              "Conduct a 35-minute frontend system design interview for a real-time collaborative whiteboard. Evaluate my approach, probe my weak spots, and give detailed feedback.",
          },
        ],
      },
    },
  },

  sysbe: {
    nav: "nav-sysbe",
    phase: "Phase 2 · Week 13–16",
    title: "System Design — Backend",
    meta: "3 weeks · ~24 hrs",
    color: "sky",
    intro:
      "Backend system design interviews ask you to design systems that scale to millions of users, recover from failures, and stay consistent under load. You have 45 minutes to architect real systems from scratch — with the interviewer probing your decisions.",
    docNote:
      "Read Redis and PostgreSQL official docs for their data structures and indexing behavior — accurate details make your answers credible in interviews.",
    docs: [
      {
        label: "Redis docs → Data types",
        url: "https://redis.io/docs/data-types",
      },
      {
        label: "PostgreSQL → Indexes",
        url: "https://www.postgresql.org/docs/current/indexes.html",
      },
      { label: "BullMQ docs", url: "https://docs.bullmq.io" },
    ],
    levels: {
      beginner: {
        label: "Foundations",
        desc: "Core concepts and the system design interview framework.",
        subtopics: [
          {
            title: "System design interview framework",
            what: "A structured approach prevents jumping to solutions before understanding the problem. Interviewers evaluate your process as much as your final design.",
            points: [
              "Step 1 (5 min): Clarify requirements — functional and non-functional constraints",
              "Step 2 (5 min): Estimate scale — daily active users, requests/sec, storage, bandwidth",
              "Step 3 (10 min): High-level architecture — components, data flow, APIs",
              "Step 4 (15 min): Deep dive on one component — the interviewer picks or you propose",
              "Step 5 (5 min): Bottlenecks and failure modes — what breaks first at 10x scale?",
              "Always verbalize your thinking — interviewers cannot evaluate silence",
            ],
            docs: [],
            prompt:
              "Conduct a system design interview for a URL shortener. Start by asking me requirements and guide me through each step. Probe my decisions.",
          },
          {
            title: "Scalability fundamentals",
            what: "Scaling is about identifying the bottleneck first and applying the right remedy. Most production scaling problems have well-known solutions.",
            points: [
              "Horizontal scaling: more instances behind a load balancer — requires stateless design",
              "Vertical scaling: bigger machine — faster iteration but has a ceiling, single point of failure",
              "Stateless servers: session state in Redis, not in process memory — enables horizontal scaling",
              "Read replicas: route SELECT queries to replicas — write to primary only",
              "CDN: static assets and edge-cached responses — remove origin server load for popular content",
              "Database before everything: in most systems the database is the first bottleneck",
            ],
            docs: [],
            prompt:
              "Walk me through the architectural changes needed as my app grows from 1K to 10K to 100K to 1M daily active users.",
          },
          {
            title: "Load balancing and reverse proxies",
            what: "Load balancers distribute traffic across multiple server instances. They are the entry point to almost every distributed system.",
            points: [
              "Round-robin: distribute evenly — works when requests are similar in cost",
              "Least connections: send to instance with fewest active connections — better for variable-cost requests",
              "IP hash: same client always hits same server — needed for sticky sessions (avoid if possible)",
              "Health checks: load balancer removes unhealthy instances automatically",
              "nginx: high-performance reverse proxy and load balancer — widely used in self-hosted stacks",
              "Layer 4 vs Layer 7: L4 TCP-level, fast — L7 HTTP-aware, can route by path or header",
            ],
            docs: [],
            prompt:
              "Design the load balancing strategy for an API that handles both quick requests (< 10ms) and slow requests (> 1s). Why does round-robin fail here?",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Caching, databases, queues, and API design.",
        subtopics: [
          {
            title: "Caching strategies in depth",
            what: "Caching is the highest-leverage performance optimization in most distributed systems. The hard part is choosing the strategy and handling invalidation correctly.",
            points: [
              "Cache-aside (lazy): app checks cache → miss → load from DB → populate cache",
              "Write-through: write to cache and DB simultaneously — cache always consistent but slower writes",
              "Write-behind: write to cache, async flush to DB — fastest writes, risk of data loss on crash",
              "TTL expiry: simple, stale data possible — OK for user-facing data that can lag",
              "Event-driven invalidation: invalidate on mutation — complex but most accurate",
              "Cache stampede: many requests hit DB on cache miss — solve with probabilistic early expiry or distributed lock",
            ],
            docs: [{ label: "Redis docs", url: "https://redis.io/docs" }],
            prompt:
              "Design the caching architecture for a social media feed. Walk through data placement, cache invalidation on new post, and handling hot celebrities with millions of followers.",
          },
          {
            title: "Database design and indexing",
            what: "Database design decisions at the start are extremely hard to change later. Right indexes and the right data model prevent the majority of production performance problems.",
            points: [
              "Index every foreign key: without this, JOINs cause full table scans",
              "Index columns in WHERE, ORDER BY, and JOIN ON clauses",
              "Composite index column order: most selective and most frequently filtered first",
              "Partial index: only index rows meeting a condition — smaller, faster for filtered queries",
              "EXPLAIN ANALYZE: understand what the query planner actually does — seq scan is a red flag",
              "Partitioning: split large tables by range or list — improves query performance and data management",
            ],
            docs: [
              {
                label: "PostgreSQL → Indexes",
                url: "https://www.postgresql.org/docs/current/indexes.html",
              },
            ],
            prompt:
              "I have a social app with a feed query that joins users, posts, and likes tables. Walk me through the indexes needed and how to read EXPLAIN ANALYZE for this query.",
          },
          {
            title: "Message queues and async processing",
            what: "Message queues decouple producers from consumers — enabling async processing, load leveling, retry logic, and reliable delivery.",
            points: [
              "At-least-once delivery: messages may be delivered multiple times — workers MUST be idempotent",
              "Dead letter queue: failed messages after max retries — essential for debugging and recovery",
              "Fan-out pattern: one event, multiple independent consumers (email + push + analytics)",
              "Priority queues: process critical tasks (password reset) ahead of batch (reports)",
              "Backpressure: if consumers fall behind, slow down producers or add more consumer instances",
              "BullMQ: Redis-backed Node.js queue — best choice for most Next.js/Node.js applications",
            ],
            docs: [{ label: "BullMQ docs", url: "https://docs.bullmq.io" }],
            prompt:
              "Design a notification system that sends email, push notification, and in-app notification for each trigger. Show the complete queue architecture and failure handling.",
          },
          {
            title: "API design best practices",
            what: "API design decisions outlive the implementation. Good API design is a senior-level skill that affects every team consuming the API.",
            points: [
              "RESTful conventions: nouns not verbs, HTTP methods carry semantic meaning (GET=read, POST=create)",
              "Versioning: /api/v1/ in the URL path — simplest and most explicit approach",
              "Pagination: cursor-based for real-time/ordered data, offset-based for static datasets",
              "Rate limiting: per-user token bucket in Redis — return 429 with Retry-After header",
              "Idempotency keys: client-generated UUID for safe retries — critical for payment and order APIs",
              "Error responses: consistent structure { error: { code, message, details } } across all endpoints",
            ],
            docs: [],
            prompt:
              "Design the complete REST API for a food delivery app. Show endpoints, authentication, error responses, pagination, and rate limiting strategy.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Distributed consistency, reliability patterns, and design practice.",
        subtopics: [
          {
            title: "CAP theorem and consistency models",
            what: "Distributed systems cannot simultaneously guarantee consistency, availability, and partition tolerance. Senior engineers understand these tradeoffs and choose explicitly.",
            points: [
              "CAP theorem: can only guarantee 2 of 3 — in practice, partition tolerance is required, so choose CA or AP",
              "CP systems (PostgreSQL, Zookeeper): consistent but may reject requests during partition",
              "AP systems (Cassandra, CouchDB): always available but may return stale data",
              "Eventual consistency: all nodes converge to the same value — with how much lag?",
              "Strong consistency: every read sees the latest write — requires coordination cost",
              "CRDT: conflict-free replicated data types — eventual consistency without conflicts (useful in collaborative apps",
            ],
            docs: [],
            prompt:
              "Explain the CAP theorem with a real example from a distributed shopping cart. Then show me how you choose between strong and eventual consistency for different features in the same app.",
          },
          {
            title: "Reliability patterns",
            what: "Systems will fail. Senior engineers design for failure from the start — circuit breakers, retries, and graceful degradation are standard patterns.",
            points: [
              "Circuit breaker: stop calling a failing service — fail fast, avoid cascading failures",
              "Retry with exponential backoff and jitter: avoid thundering herd on service recovery",
              "Bulkhead: isolate failures — separate thread pool or connection pool per dependency",
              "Health checks: /health/live (liveness) and /health/ready (readiness) — Kubernetes uses both",
              "Graceful degradation: return cached data or reduced functionality when dependencies are down",
              "Chaos engineering: deliberately inject failures in production to find weaknesses proactively",
            ],
            docs: [],
            prompt:
              "Design the reliability architecture for a payment processing service. What happens during a database outage? During a queue failure? During a third-party payment provider outage?",
          },
          {
            title: "Backend system design — practice scenarios",
            what: "These are the most common backend system design prompts at senior-level interviews. Practice each end-to-end.",
            points: [
              "URL shortener: hashing strategy, redirect performance, analytics, custom aliases, scale",
              "Rate limiter: sliding window algorithm, Redis implementation, distributed coordination",
              "Notification system: fanout at scale, push/email/SMS, priority, idempotency",
              "Payment system: saga pattern, idempotency keys, reconciliation, audit log",
              "Search engine: inverted index, ranking, typeahead, fuzzy matching",
              "Video streaming: upload pipeline, chunking, CDN, adaptive bitrate, encoding queue",
            ],
            docs: [],
            prompt:
              "Walk me through designing a distributed rate limiter that works correctly across 100 server instances. I want to understand the Redis sliding window algorithm in detail with code.",
          },
        ],
      },
    },
  },

  db: {
    nav: "nav-db",
    phase: "Phase 2 · Week 15–16",
    title: "Databases and Caching",
    meta: "2 weeks · ~16 hrs",
    color: "sky",
    intro:
      "Most application performance problems originate in the database — slow queries, missing indexes, N+1 problems, connection exhaustion. This topic gives you the knowledge to diagnose and fix them without guessing.",
    docNote:
      "Read the PostgreSQL indexing documentation. Understanding how the query planner chooses indexes makes EXPLAIN ANALYZE output readable — which is essential for real debugging.",
    docs: [
      {
        label: "PostgreSQL → Indexes",
        url: "https://www.postgresql.org/docs/current/indexes.html",
      },
      {
        label: "PostgreSQL → Query Planning",
        url: "https://www.postgresql.org/docs/current/using-explain.html",
      },
      { label: "Prisma docs", url: "https://www.prisma.io/docs" },
      { label: "Redis docs", url: "https://redis.io/docs" },
    ],
    levels: {
      beginner: {
        label: "Beginner",
        desc: "Relational fundamentals and SQL fluency.",
        subtopics: [
          {
            title: "Relational database fundamentals",
            what: "Understanding how relational databases work — not just how to query them — is essential for writing efficient application code and making good schema decisions.",
            points: [
              "ACID: Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent tx), Durability (survives crash)",
              "Primary key: uniquely identifies each row — auto-increment integer or UUID (consider UUID for distributed systems)",
              "Foreign key: enforces referential integrity — ON DELETE CASCADE or RESTRICT",
              "Normalization: eliminate redundancy — 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies)",
              "NULL: represents absence of a value — IS NULL not = NULL — causes surprising JOIN behavior",
              "Indexes: B-tree structures that speed up reads at the cost of slower writes and more storage",
            ],
            docs: [],
            prompt:
              "Design a database schema for a multi-tenant SaaS application with users, organizations, projects, and tasks. Explain every constraint and relationship decision.",
          },
          {
            title: "SQL — advanced queries",
            what: "SQL fluency with joins, aggregations, and window functions is tested in almost every backend interview. You must write complex queries without an ORM.",
            points: [
              "INNER JOIN: rows matching in both tables — NULL rows excluded",
              "LEFT JOIN: all rows from left, NULL-filled if no right match",
              "GROUP BY + HAVING: aggregate then filter — HAVING filters after aggregation, WHERE before",
              "Window functions: ROW_NUMBER(), RANK(), LAG(), LEAD() — calculations across rows without collapsing",
              "Subquery vs CTE: CTEs (WITH clause) improve readability for complex queries",
              "DISTINCT vs GROUP BY: GROUP BY is more flexible — DISTINCT is simpler for deduplication only",
            ],
            docs: [],
            prompt:
              "Give me a complex SQL problem involving window functions and multiple JOINs. I will write the query from scratch. Then tell me what the query planner will do and how to optimize it.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Indexing, query optimization, N+1, and Redis data structures.",
        subtopics: [
          {
            title: "PostgreSQL indexing in depth",
            what: "Indexes trade write performance and storage for read performance. Knowing when and what to index — and understanding how the query planner uses them — is a senior-level skill.",
            points: [
              "B-tree (default): equality, range, LIKE prefix — covers 90% of use cases",
              "Hash index: equality checks only — marginally faster than B-tree for equality, rarely worth it",
              "Partial index: CREATE INDEX ... WHERE active = true — smaller, faster for filtered queries",
              "Composite index: column order matters — leftmost prefix rule — most filtered column first",
              "Covering index: INCLUDE columns to avoid table heap lookup — index-only scan",
              "EXPLAIN ANALYZE: look for Seq Scan on large tables — that is your optimization target",
            ],
            docs: [
              {
                label: "PostgreSQL → Index Types",
                url: "https://www.postgresql.org/docs/current/indexes-types.html",
              },
            ],
            prompt:
              "I have a slow query on a posts table with 5M rows. Show me how to use EXPLAIN ANALYZE, diagnose the problem, and create the right index to fix it.",
          },
          {
            title: "N+1 problem and ORM optimization",
            what: "The N+1 problem is the most common ORM-related performance bug. One conceptual query becomes N+1 database queries because each iteration triggers a new call.",
            points: [
              "N+1: fetch a list (1 query) then query each item individually (N queries) — O(n) queries total",
              "ORM eager loading: Prisma include, SQLAlchemy joinedload — single JOIN query",
              "DataLoader pattern: batch and deduplicate all DB calls per request — essential in GraphQL",
              "Query count logging: log all queries in development — find unexpected N+1s before production",
              "Prisma: add console.log to $use middleware or use prisma.queryRaw to see exact SQL",
              "Connection pooling: PgBouncer or Prisma connection limit — prevent connection exhaustion",
            ],
            docs: [
              {
                label: "Prisma → Relations",
                url: "https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries",
              },
            ],
            prompt:
              "Show me an N+1 bug in a real Prisma query for a blog API. Fix it completely. Then show me how to set up query logging to catch these automatically.",
          },
          {
            title: "Redis data structures and patterns",
            what: "Redis is not just a cache — it is a versatile in-memory data structure server. Choosing the right data structure for each use case makes the difference between elegant and hacky solutions.",
            points: [
              "String: counters, session tokens, rate limiting (INCR, EXPIRE)",
              "Hash: user profiles, settings — efficient partial updates with HSET/HGET",
              "List: message queues, activity feeds — LPUSH/RPOP for FIFO queue semantics",
              "Set: unique visitors, tags, followers — SUNION/SINTER/SDIFF for set operations",
              "Sorted Set: leaderboards, scheduled tasks — ZADD with score, ZRANGE for ordered retrieval",
              "HyperLogLog: approximate unique count — O(1) memory regardless of cardinality (perfect for analytics)",
            ],
            docs: [
              {
                label: "Redis → Data Types",
                url: "https://redis.io/docs/data-types",
              },
            ],
            prompt:
              "Design a leaderboard for 1 million players that updates in real-time and shows each player their rank. Walk me through the Redis sorted set implementation.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Transactions, isolation, connection pooling, and migrations.",
        subtopics: [
          {
            title: "Transactions and isolation levels",
            what: "Transactions protect data integrity but cause performance problems if misused. Isolation levels are the tradeoff between data safety and concurrent throughput.",
            points: [
              "Read Uncommitted: can read dirty data (uncommitted changes) — almost never used",
              "Read Committed (PostgreSQL default): only see committed data — prevents dirty reads",
              "Repeatable Read: snapshot at transaction start — prevents phantom reads in PostgreSQL",
              "Serializable: strictest — transactions appear to execute sequentially — slowest",
              "Deadlocks: two transactions each waiting for the other — PostgreSQL detects and cancels one",
              "Avoid long transactions: they hold locks, block other operations, prevent VACUUM",
            ],
            docs: [
              {
                label: "PostgreSQL → Transaction Isolation",
                url: "https://www.postgresql.org/docs/current/transaction-iso.html",
              },
            ],
            prompt:
              "Show me a deadlock scenario between two concurrent transactions in PostgreSQL. How does Postgres detect it? What application patterns prevent deadlocks?",
          },
          {
            title: "Connection pooling and PgBouncer",
            what: "Each PostgreSQL connection is a separate OS process. Without connection pooling, connection exhaustion under load is one of the most common production database failures.",
            points: [
              "PostgreSQL connections: each is a forked OS process — expensive (5-10MB each)",
              "max_connections default: 100 — often the first production failure point",
              "PgBouncer: lightweight proxy that pools connections between application and PostgreSQL",
              "Session mode: one DB connection per client session — same as no pooler, avoids prepared statement issues",
              "Transaction mode: connection returned after each transaction — recommended — supports the most clients",
              "Prisma: set ?connection_limit=10 in DATABASE_URL — critical for serverless/edge deployments",
            ],
            docs: [],
            prompt:
              'My Vercel Next.js app gets "too many connections" from PostgreSQL under load. Diagnose the root cause and walk me through the complete fix including PgBouncer setup.',
          },
          {
            title: "Database migrations and schema evolution",
            what: "Managing schema changes safely in production is a senior-level skill that prevents downtime and data loss during deployments.",
            points: [
              "Always backward compatible: new columns must have defaults or be nullable — never add NOT NULL without default to existing table",
              "Two-phase migrations: add column nullable → deploy code → backfill → add constraint",
              "Zero-downtime: avoid locking operations (adding index, ALTER COLUMN) on large tables during peak",
              "Concurrent indexes: CREATE INDEX CONCURRENTLY — takes longer but does not lock table",
              "Prisma migrate: prisma migrate deploy in CI/CD — never in application startup",
              "Rollback strategy: every migration should have a reversible down migration documented",
            ],
            docs: [
              {
                label: "Prisma → Migrations",
                url: "https://www.prisma.io/docs/concepts/components/prisma-migrate",
              },
            ],
            prompt:
              "I need to add a NOT NULL column to a 50 million row users table with zero downtime. Walk me through the exact steps and commands.",
          },
        ],
      },
    },
  },

  ai: {
    nav: "nav-ai",
    phase: "Phase 3 · Week 17–19",
    title: "AI Integration",
    meta: "2–3 weeks · ~24 hrs",
    color: "acc",
    intro:
      "The ability to build AI-powered features is what separates candidates in 2025 interviews. Streaming chat, RAG pipelines, tool-calling agents, and evaluation frameworks are increasingly expected at senior level. This is the fastest-moving area — always use the latest official docs.",
    docNote:
      "These APIs change frequently. Blog posts and tutorials go stale. Always use the official Vercel AI SDK docs and Anthropic API docs — not secondary sources.",
    docs: [
      { label: "Vercel AI SDK docs", url: "https://sdk.vercel.ai/docs" },
      { label: "Anthropic API reference", url: "https://docs.anthropic.com" },
      {
        label: "Anthropic → Prompt engineering guide",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
      },
      {
        label: "pgvector on GitHub",
        url: "https://github.com/pgvector/pgvector",
      },
    ],
    levels: {
      beginner: {
        label: "Foundations",
        desc: "LLM concepts, APIs, prompt engineering, and first streaming integration.",
        subtopics: [
          {
            title: "LLM fundamentals for developers",
            what: "Understanding how LLMs work at a conceptual level makes you a better AI feature developer and lets you explain AI capabilities and limitations to stakeholders accurately.",
            points: [
              "Tokens: unit of LLM processing — roughly 4 characters or 0.75 words in English",
              "Context window: total tokens (input + output) the model can process at once — know the limit",
              "Temperature: 0 = deterministic, 1 = creative — use 0 for structured output and factual extraction",
              "System prompt: instructions that frame every conversation — the most powerful prompt lever",
              "Hallucinations: models generate plausible-sounding but incorrect content — always validate critical outputs",
              "Latency: time-to-first-token vs total latency — streaming reduces perceived latency significantly",
            ],
            docs: [
              {
                label: "Anthropic → Model overview",
                url: "https://docs.anthropic.com/en/docs/about-claude/models",
              },
            ],
            prompt:
              "Explain how temperature affects LLM output quality. Show me a case where temperature 0 is required and one where higher temperature improves results.",
          },
          {
            title: "Prompt engineering — practical patterns",
            what: 'Well-crafted prompts dramatically improve output quality and consistency. This is a practical engineering discipline — not prompt "magic".',
            points: [
              'Role assignment: "You are a senior TypeScript engineer..." — sets domain and tone',
              "Be specific: vague prompts produce vague, inconsistent outputs",
              "Few-shot examples: show 2–3 examples of good input/output — most effective technique",
              'Chain of thought: "Think step by step" — improves accuracy on reasoning tasks',
              "Structured output: specify exact JSON schema — reduces hallucination of field names",
              'Negative constraints: "Do not include explanations" — often as important as positive instructions',
            ],
            docs: [
              {
                label: "Anthropic → Prompt engineering guide",
                url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
              },
            ],
            prompt:
              "Show me the same extraction task with a bad prompt and an improved prompt. Walk me through every change and why each one matters.",
          },
          {
            title: "Vercel AI SDK basics",
            what: "The Vercel AI SDK is the standard for building AI UIs in Next.js. It abstracts streaming, state management, and multi-provider support into a clean React API.",
            points: [
              "useChat: manages messages array, input state, streaming, and loading — the main UI hook",
              "streamText: server-side streaming with any supported model — call from Route Handler",
              "generateText: non-streaming server-side generation — for background jobs",
              "Supports: Anthropic, OpenAI, Google, and more via provider adapters",
              'Message format: { role: "user" | "assistant" | "system", content: string | ContentPart[] }',
              "onError callback + abort on unmount: proper cleanup for streaming responses",
            ],
            docs: [
              {
                label: "AI SDK → useChat",
                url: "https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat",
              },
              {
                label: "AI SDK → streamText",
                url: "https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text",
              },
            ],
            prompt:
              "Build a complete streaming chat UI in Next.js App Router with Vercel AI SDK and Claude. Walk me through every file from the API route to the React component.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Tool calling, structured output, RAG, and embeddings.",
        subtopics: [
          {
            title: "Tool calling and agent patterns",
            what: "Tool calling lets the AI decide when to invoke functions you define — turning a chatbot into an agent that can take real actions in the world.",
            points: [
              "Tools: name, description (critical for model's decision), Zod input schema, execute function",
              "Model reads the description to decide WHEN to call the tool — write descriptions for the model",
              "Your execute function runs, returns result — model uses result in next generation",
              "Multi-step agents: maxSteps prop — model calls multiple tools in sequence before responding",
              "Always validate tool inputs — they come from the model, treat as untrusted like user input",
              "Tool errors: surface them gracefully — model can recover and try a different approach",
            ],
            docs: [
              {
                label: "AI SDK → Tools and Tool Calling",
                url: "https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling",
              },
            ],
            prompt:
              "Build a type-safe agent that queries a product inventory using tool calling. Show me how tool description quality changes model behavior.",
          },
          {
            title: "Structured output with generateObject",
            what: "Getting reliable, typed output from an LLM requires structured generation with schema validation. Essential for any production AI feature that feeds data into application logic.",
            points: [
              "generateObject: produces validated JSON matching a Zod schema — type-safe response",
              "streamObject: streams structured data progressively as it generates — great for long outputs",
              'Output modes: "object", "array", "enum", "no-schema" — choose based on expected response shape',
              "System prompt + schema: double reinforcement — schema alone is not always sufficient",
              "Validation errors: SDK retries with the error in context — configure maxRetries",
              "Combine with zod-to-json-schema for complex schemas in system prompt",
            ],
            docs: [
              {
                label: "AI SDK → generateObject",
                url: "https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object",
              },
            ],
            prompt:
              "Build a feature that extracts structured contact information from unstructured text. Show me error handling when the model produces an invalid or partial response.",
          },
          {
            title: "Embeddings and vector search",
            what: "Embeddings are the foundation of semantic search and RAG. They convert text into numerical vectors where semantically similar text produces similar vectors.",
            points: [
              "Embeddings: dense float arrays (768–3072 dimensions) encoding semantic meaning",
              "Cosine similarity: measures angle between vectors — 1 = identical, 0 = unrelated, -1 = opposite",
              "Generate with: Anthropic voyage-3 or OpenAI text-embedding-3-large — choose by cost and quality",
              "pgvector: PostgreSQL extension — adds vector type and similarity operators",
              "CREATE INDEX USING ivfflat: approximate nearest neighbor — much faster for large datasets",
              "Chunking text: split by sentence or paragraph with overlap — chunk size affects retrieval quality",
            ],
            docs: [
              {
                label: "pgvector on GitHub",
                url: "https://github.com/pgvector/pgvector",
              },
              {
                label: "AI SDK → embed",
                url: "https://sdk.vercel.ai/docs/reference/ai-sdk-core/embed",
              },
            ],
            prompt:
              "Show me how to set up pgvector, generate embeddings for documents, store them, and query by semantic similarity. Include the SQL and the Node.js code.",
          },
          {
            title: "RAG — Retrieval Augmented Generation",
            what: "RAG gives an LLM access to your private data without fine-tuning. It embeds documents into vectors, retrieves relevant chunks at query time, and injects them into the prompt.",
            points: [
              "Step 1 — Ingestion: chunk documents, generate embeddings, store in pgvector",
              "Step 2 — Retrieval: embed user query, find top-k similar chunks by cosine similarity",
              "Step 3 — Augmentation: inject retrieved chunks into system prompt as context",
              "Step 4 — Generation: LLM answers using the injected context",
              "Chunking strategy: 512–1024 tokens with 50–100 token overlap — smaller chunks = more precise retrieval",
              "Reranking: second-pass model re-orders retrieved chunks by relevance — improves quality significantly",
            ],
            docs: [
              {
                label: "pgvector",
                url: "https://github.com/pgvector/pgvector",
              },
            ],
            prompt:
              "Walk me through building a complete RAG pipeline for a documentation chatbot: ingestion, retrieval, augmentation, and generation. Include the code for each step.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Evaluation frameworks, observability, and production AI systems.",
        subtopics: [
          {
            title: "LLM evaluation (evals)",
            what: "Production AI features need systematic evaluation — not just manual testing. Evals measure quality, consistency, and regression across prompt and model changes.",
            points: [
              "Golden dataset: curated input/output pairs — ground truth for regression testing",
              "LLM-as-judge: use Claude to score Claude's outputs — scalable automated evaluation",
              "Metrics: accuracy, helpfulness, faithfulness (RAG), toxicity, instruction following",
              "Run evals on every prompt change and every model version upgrade",
              "A/B testing: compare prompt versions with real traffic — statistical significance matters",
              "Adversarial testing: test with edge cases, ambiguous inputs, prompt injection attempts",
            ],
            docs: [
              {
                label: "Anthropic → Evals",
                url: "https://docs.anthropic.com/en/docs/test-and-evaluate/eval-tool",
              },
            ],
            prompt:
              "Design a complete evaluation framework for a customer support AI assistant. What metrics matter, how do you measure them, and how do you detect regression?",
          },
          {
            title: "AI observability and cost management",
            what: "Production AI features without observability are unmanageable. Latency, cost per request, and output quality must be monitored continuously.",
            points: [
              "Token accounting: log input + output tokens per request — cost is directly proportional",
              "Time to first token (TTFT): key metric for streaming UIs — users perceive this as latency",
              "Total generation time: affects completion rate — too slow increases abandonment",
              "LangSmith / Helicone / Braintrust: dedicated LLM observability platforms — structured traces",
              "Prompt caching: Anthropic supports caching repeated context — up to 90% cost reduction on large prompts",
              "Rate limiting: implement exponential backoff with jitter — Anthropic will 429 you under load",
            ],
            docs: [],
            prompt:
              "Design the observability setup for a production RAG feature. What do you monitor, what alerts do you set, and how do you track cost per query?",
          },
          {
            title: "AI safety and responsible production deployment",
            what: "Deploying AI features in production requires thinking about safety, reliability, and trust — not just capability.",
            points: [
              "Input validation: sanitize before sending to LLM — prevent prompt injection attacks",
              "Output validation: never trust LLM output for critical paths — validate before using in app logic",
              "Human-in-the-loop: for high-stakes decisions, route to human review — do not fully automate",
              "Content moderation: Anthropic has built-in safety — but add application-level checks for your domain",
              "Fallback behavior: if LLM fails or times out — degrade gracefully to non-AI path",
              "Privacy: never send PII to external APIs without explicit user consent and legal review",
            ],
            docs: [],
            prompt:
              "I am building an AI feature that can take actions on behalf of users (send emails, create tasks). Walk me through all the safety considerations and how to implement them.",
          },
        ],
      },
    },
  },

  security: {
    nav: "nav-security",
    phase: "Phase 3 · Week 19–20",
    title: "Security + Interview Prep",
    meta: "1–2 weeks · ~16 hrs",
    color: "vi",
    intro:
      "Security is tested explicitly at senior level and is increasingly required by law in many jurisdictions. Pair this with intensive mock interview practice — the final preparation step before you start applying.",
    docNote:
      "Read the OWASP Top 10 directly on owasp.org — interviewers use the same terminology and will notice if you are using second-hand descriptions.",
    docs: [
      { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten" },
      {
        label: "MDN → HTTP Security Headers",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security",
      },
      {
        label: "nextjs.org → Security Headers",
        url: "https://nextjs.org/docs/app/building-your-application/configuring/headers",
      },
    ],
    levels: {
      beginner: {
        label: "Foundations",
        desc: "The most critical vulnerabilities and their mitigations.",
        subtopics: [
          {
            title: "OWASP Top 10",
            what: "The OWASP Top 10 is the industry-standard list of the most critical web application security risks. Know all 10 — be able to explain 5 in depth with examples from Next.js and Node.js.",
            points: [
              "1. Injection (SQL, NoSQL, command): use parameterized queries — NEVER concatenate user input into queries",
              "2. Broken authentication: short session lifetimes, MFA, lockout after failed attempts, use established libraries",
              "3. Sensitive data exposure: encrypt in transit (TLS) and at rest, avoid logging sensitive fields",
              "4. XSS: React escapes by default — dangerouslySetInnerHTML is the exact danger zone",
              "5. Security misconfiguration: remove debug endpoints, default credentials, verbose error messages in production",
              "6. Vulnerable components: npm audit weekly, Dependabot for automated PR updates",
            ],
            docs: [
              {
                label: "OWASP Top 10",
                url: "https://owasp.org/www-project-top-ten",
              },
            ],
            prompt:
              "Quiz me on OWASP Top 10. Give me a realistic scenario for each of the top 6 vulnerabilities. Ask me to identify it and describe the fix.",
          },
          {
            title: "XSS and CSRF — mechanisms and defenses",
            what: "XSS and CSRF are the two most common web vulnerabilities. Understanding how they work mechanically — not just how to prevent them — is a senior-level expectation in interviews.",
            points: [
              "Reflected XSS: malicious script embedded in URL — server reflects it into HTML response",
              "Stored XSS: script saved to database — rendered for all users who view the content — high impact",
              "DOM XSS: client-side JS reads attacker-controlled data and writes it to innerHTML — no server",
              "React defense: JSX escapes HTML entities automatically — only dangerouslySetInnerHTML bypasses this",
              "CSRF: attacker tricks authenticated browser into making a state-changing request from another origin",
              "SameSite=Strict cookie: browser only sends the cookie for same-site navigations — stops CSRF cleanly",
            ],
            docs: [],
            prompt:
              "Show me a stored XSS attack end to end: from input to exploit to impact. Then show me the defense at every layer where it could be stopped.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "Authentication, authorization, and security headers.",
        subtopics: [
          {
            title: "Authentication — JWT, sessions, and OAuth",
            what: "Authentication is the most common source of security bugs. Know the tradeoffs between token-based and session-based auth, and understand OAuth 2.0 flows deeply.",
            points: [
              "JWT: stateless, signed — CANNOT be invalidated without blocklist or very short expiry",
              "Store JWT in httpOnly, Secure, SameSite=Strict cookie — NEVER in localStorage (XSS steals it)",
              "Access + refresh token pattern: 15-minute access token + 7-day refresh with rotation",
              "Refresh token rotation: each use issues a new refresh token — old one invalid — prevents reuse after theft",
              "OAuth 2.0 PKCE: correct flow for SPAs — authorization code + code verifier — prevents code interception",
              "Auth.js (NextAuth): handles CSRF, session rotation, multiple providers — use it rather than rolling your own",
            ],
            docs: [],
            prompt:
              "Walk me through the complete refresh token rotation flow. Show me what happens on a stolen refresh token and how rotation limits the damage.",
          },
          {
            title: "Authorization and RBAC",
            what: "Authentication (who are you?) and authorization (what can you do?) are different problems. Authorization bugs cause privilege escalation — users accessing other users' data.",
            points: [
              "RBAC: roles have permissions, users have roles — simple and auditable",
              "ABAC: policies based on user attributes, resource attributes, environment — flexible but complex",
              "Always enforce authorization server-side — client-side checks are UI convenience only",
              "Row-level security (PostgreSQL RLS): enforce access at the database layer — strongest defense",
              "Principle of least privilege: grant minimum permissions needed — never grant blanket access",
              "Insecure direct object reference (IDOR): always verify the requesting user owns the resource",
            ],
            docs: [],
            prompt:
              "Implement RBAC for a SaaS app with owner, admin, editor, and viewer roles. Show me server-side enforcement in Next.js middleware and in the data layer.",
          },
          {
            title: "HTTP security headers",
            what: "Security headers are browser-enforced policies that prevent entire classes of attacks with minimal implementation cost. They are tested in security audits and senior interviews.",
            points: [
              "Content-Security-Policy: allowlist of trusted script, style, font, image sources — stops XSS exploitation",
              "Strict-Transport-Security (HSTS): force HTTPS for max-age seconds including subdomains",
              "X-Frame-Options: DENY or SAMEORIGIN — prevents clickjacking attacks",
              "X-Content-Type-Options: nosniff — prevents MIME type confusion attacks",
              "Referrer-Policy: strict-origin-when-cross-origin — limits URL leakage in Referer header",
              "Permissions-Policy: deny access to camera, microphone, geolocation unless explicitly needed",
            ],
            docs: [
              {
                label: "MDN → HTTP Security Headers",
                url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security",
              },
            ],
            prompt:
              "Show me how to configure a comprehensive Content-Security-Policy for a Next.js app with a third-party analytics script. Explain what each directive prevents.",
          },
          {
            title: "Input validation and injection prevention",
            what: "Injection vulnerabilities consistently top the OWASP list. They are caused by mixing untrusted data with trusted commands — preventable with the right patterns.",
            points: [
              'SQL injection: use parameterized queries or ORM — never string concatenation: db.query("SELECT * FROM users WHERE id = " + id)',
              "NoSQL injection: MongoDB operators in JSON — validate and sanitize input before queries",
              "Command injection: never pass user input to exec() or spawn() directly — use argument arrays",
              "Path traversal: validate and normalize file paths — use path.resolve() and check it starts with expected base",
              "Server-side template injection: never pass user input to template engines directly",
              'Type coercion bugs: validate types explicitly — "1" == 1 in JS causes unexpected behavior',
            ],
            docs: [],
            prompt:
              "Show me a SQL injection attack against a Node.js Express API and the exact parameterized query fix. Then show me a NoSQL injection attack against MongoDB.",
          },
        ],
      },
      senior: {
        label: "Senior + Interview Prep",
        desc: "Dependency security, supply chain, and final interview preparation.",
        subtopics: [
          {
            title: "Dependency security and supply chain",
            what: "Modern applications have hundreds of dependencies. Supply chain attacks are increasing in frequency — managing this risk is a senior-level responsibility.",
            points: [
              "npm audit: find known CVEs in your dependency tree — run in CI pipeline",
              "npm audit --fix: auto-fix — always review the diff before committing",
              "package-lock.json: locks exact versions — ALWAYS commit this — do not add to .gitignore",
              "Dependabot / Renovate: automated dependency update PRs — keep dependencies current",
              "Supply chain attacks: malicious package publishing — use trusted packages, pin exact versions in CI",
              "SBOM (Software Bill of Materials): full inventory of dependencies — required in regulated industries",
            ],
            docs: [],
            prompt:
              "Walk me through setting up a complete dependency security workflow for a Next.js project: from npm audit to Dependabot to CI enforcement.",
          },
          {
            title: "Security in AI applications",
            what: "AI features introduce new attack surfaces that traditional security thinking does not fully address.",
            points: [
              "Prompt injection: user input manipulates AI behavior — sanitize before injection into system prompt",
              "Data exfiltration via LLM: model may be induced to reveal system prompt or other users' data",
              "PII in prompts: never send PII to external APIs without consent — log carefully",
              "Indirect prompt injection: malicious instructions in documents the AI reads (RAG content)",
              "Output validation: never trust LLM output in security-critical paths — validate before acting",
              "Rate limiting AI endpoints: LLM API calls are expensive — abuse can cause significant cost",
            ],
            docs: [],
            prompt:
              "Show me a prompt injection attack against a RAG-based customer support bot. Walk me through every layer of defense.",
          },
          {
            title: "Interview preparation — the final sprint",
            what: "The final weeks before applying. A structured preparation approach is more effective than unstructured practice.",
            points: [
              "Mock interviews: minimum 3 per week with Claude — rate your communication, not just your solution",
              "Behavioral prep: STAR format — Situation, Task, Action, Result — prepare 10 stories",
              "Portfolio: 1–2 live deployed projects with AI integration — demo-able, with a good README",
              "System design: run through every key scenario in this roadmap at least once end-to-end",
              "Salary research: levels.fyi, Glassdoor, Blind, Comprehensive.io — know your market rate",
              "Negotiation: total comp not just base — equity vesting, signing bonus, review cycles",
            ],
            docs: [],
            prompt:
              "Conduct a full 60-minute technical interview: one medium coding problem, one system design question, and three behavioral questions. Be strict. Give me detailed written feedback on every part.",
          },
        ],
      },
    },
  },

  css: {
    nav: "nav-css",
    phase: "Phase 1 · Week 9–10",
    title: "CSS & Design Systems",
    meta: "2 weeks · ~20 hrs",
    color: "vi",
    intro:
      "CSS is the most underestimated skill in frontend. Most developers learn just enough to make things work — and then struggle with every complex layout, animation, or theming requirement. This topic takes you from CSS user to CSS author: understanding the cascade, building reusable design systems, and writing CSS that scales.",
    docNote:
      "MDN CSS reference is the authoritative source — more accurate than any blog post. Read the spec sections for properties you use daily. The CSS Tricks Complete Guide to Flexbox and Grid are essential references.",
    docs: [
      {
        label: "MDN → CSS Reference",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference",
      },
      {
        label: "CSS Tricks → Flexbox Guide",
        url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      },
      {
        label: "CSS Tricks → Grid Guide",
        url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
      },
      { label: "web.dev → Learn CSS", url: "https://web.dev/learn/css" },
    ],
    levels: {
      beginner: {
        label: "Beginner",
        desc: "The cascade, layout fundamentals, and responsive design — correctly understood.",
        subtopics: [
          {
            title: "The cascade, specificity, and inheritance",
            what: 'The cascade is the algorithm that determines which CSS rule wins when multiple rules target the same element. Misunderstanding it is the root cause of most "why isn\'t my CSS working?" bugs.',
            points: [
              "Cascade order: importance → specificity → source order — later rules win when equal",
              "Specificity score: inline(1000) > ID(100) > class/attr/pseudo-class(10) > element(1)",
              "!important overrides everything — never use it in component code, only in utilities",
              "Inheritance: color, font-family, line-height inherit by default — layout properties do not",
              "inherit, initial, unset, revert keywords — explicitly control inherited values",
              ":where() has zero specificity — useful for resets and overridable base styles",
            ],
            gotchas: [
              "A single ID selector (#header) beats any number of class selectors (.nav.active.visible.open) — if you use IDs for styling, you almost always need !important to override them later",
              "Specificity is not additive across rules — it only compares the WINNING declaration from each rule; having 10 class selectors in one rule does not beat 1 ID selector",
              "Inherited properties like color pass through the tree silently — setting color on a parent affects all descendants unless they have their own color rule; this is often the cause of unexpected text colors inside third-party components",
              ":is() inherits the specificity of its MOST SPECIFIC argument — :is(#id, .class) has specificity of ID(100) even when matching only the .class element",
            ],
            examples: [
              {
                label: "Specificity calculation — which rule wins?",
                code: `/* Specificity: 0-1-0 (one class) */
.button { color: blue; }

/* Specificity: 0-2-0 (two classes) — wins over above */
.nav .button { color: red; }

/* Specificity: 1-0-0 (one ID) — beats ALL class selectors */
#header { color: green; }

/* ✅ Avoid specificity wars — use :where() for zero specificity */
:where(.button) { color: blue; } /* Specificity: 0-0-0 */
/* Any class selector can now override this */
.nav .button { color: red; } /* 0-2-0 wins easily */`,
              },
            ],
            docs: [
              {
                label: "MDN → Cascade and Inheritance",
                url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance",
              },
            ],
            prompt:
              "Show me 5 real CSS specificity bugs — rules not applying as expected. For each, explain why and show the clean fix without using !important.",
          },
          {
            title: "Box model and sizing",
            what: "Every element on a page is a rectangular box. The box model defines how width, height, padding, border, and margin interact — and getting this wrong causes constant layout headaches.",
            points: [
              "box-sizing: border-box makes width include padding and border — always use this globally",
              "Content box (default): width = content only — padding and border add to total size",
              "margin: auto on a block with defined width centers it horizontally",
              "margin collapse: adjacent vertical margins merge into the larger one — does not happen with flex/grid",
              "overflow: hidden on parent prevents margin collapse and contains floats",
              "min-width, max-width, min-height, max-height: set constraints, not fixed sizes",
            ],
            docs: [
              {
                label: "MDN → Box Model",
                url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model",
              },
            ],
            prompt:
              "Show me 4 box model gotchas that trip up developers. Explain margin collapse in depth with a real example where it causes a surprising layout bug.",
          },
          {
            title: "Flexbox — complete mental model",
            what: "Flexbox solves one-dimensional layout (row OR column). Understanding the parent/child relationship and the main/cross axis distinction makes every flex layout intuitive.",
            points: [
              "Flex container (parent): display: flex — controls axis, direction, wrapping, alignment",
              "Main axis: direction of flex-flow — justify-content aligns items along it",
              "Cross axis: perpendicular — align-items aligns items along it",
              "flex: 1 = flex-grow: 1, flex-shrink: 1, flex-basis: 0 — fills available space equally",
              "flex-grow: how much extra space the item takes — flex-shrink: how much it gives up",
              "gap replaces margin hacks between flex items — works in both flex and grid",
            ],
            docs: [
              {
                label: "CSS Tricks → Flexbox",
                url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
              },
            ],
            prompt:
              "Build a responsive navbar with flex. Then explain what happens to each item when the container is narrower than the content sum. How do flex-grow and flex-shrink resolve it?",
          },
          {
            title: "CSS Grid — complete mental model",
            what: "Grid solves two-dimensional layout (rows AND columns). It is the most powerful layout system in CSS — and the most underused. Once learned, it replaces most layout hacks.",
            points: [
              "grid-template-columns: repeat(3, 1fr) — three equal columns — fr is the fractional unit",
              "grid-template-areas: named layout regions — visual and readable",
              "auto-fill vs auto-fit: both repeat tracks — auto-fit collapses empty tracks to zero",
              "minmax(200px, 1fr): track is at least 200px but grows to fill space — responsive without media queries",
              "grid-column: 1 / -1 spans the full row — negative indices count from the end",
              "Subgrid: child grid aligns to parent tracks — solves alignment across nested components",
            ],
            docs: [
              {
                label: "CSS Tricks → Grid",
                url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
              },
            ],
            prompt:
              "Build a responsive card grid that goes from 1 to 2 to 3 columns without a single media query. Explain every property. Then show me where grid-template-areas makes complex layouts readable.",
          },
          {
            title: "Responsive design — media queries to container queries",
            what: "Responsive design has evolved from viewport-based media queries to container queries — components that respond to their own container size, not the screen size.",
            points: [
              "Mobile-first: start with smallest layout, add complexity with min-width breakpoints",
              "Common breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl) — but use content-driven",
              "Container queries (@container): component responds to its container width — not viewport",
              "containment: set container-type: inline-size to enable container queries on the parent",
              "Named containers: container: sidebar / inline-size shorthand assigns a name and type in one declaration — @container sidebar (min-width: 300px) targets only that named ancestor, preventing unintended matches when components are deeply nested inside multiple containment contexts",
              "clamp(min, preferred, max): fluid values without media queries — font-size: clamp(1rem, 2.5vw, 1.5rem)",
              "prefers-color-scheme, prefers-reduced-motion: respond to user OS preferences",
            ],
            docs: [
              {
                label: "MDN → Container Queries",
                url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
              },
            ],
            prompt:
              "Show me a card component that uses container queries to change its layout based on its container width, not the viewport. Explain why this is better than media queries for component libraries.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "CSS architecture, custom properties, animations, and modern tooling.",
        subtopics: [
          {
            title: "CSS custom properties and theming",
            what: "CSS custom properties (variables) enable dynamic theming, design tokens, and component-level customization that static preprocessor variables cannot achieve.",
            points: [
              "--var-name: value on :root — globally scoped — override in any selector to scope",
              "var(--color, fallback): second argument is the fallback if variable is not set",
              "Custom properties cascade and inherit — set on a parent, all children can use it",
              'Theming: [data-theme="dark"] { --bg: #000 } — switch themes by toggling an attribute',
              "Component customization: expose intentional variables for consumers to override",
              "@property: typed custom properties with animation support and syntax validation",
            ],
            docs: [
              {
                label: "MDN → CSS Custom Properties",
                url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties",
              },
            ],
            prompt:
              "Build a complete multi-theme system using only CSS custom properties. Show me how to scope variables to components and how to animate between themes.",
          },
          {
            title: "CSS architecture — BEM, Modules, utility-first",
            what: "As projects grow, unstructured CSS becomes unmaintainable. CSS architecture defines how you name, scope, and organize styles to prevent collision and enable scale.",
            points: [
              "BEM: .block__element--modifier — explicit, readable, no collisions — verbose but clear",
              "CSS Modules: locally scoped class names at build time — works great with React components",
              "Utility-first (Tailwind): compose styles from single-purpose utilities — no naming, no context switching",
              "CSS-in-JS (styled-components, Emotion): styles colocated with JS — dynamic props, full JS power",
              "When to use what: utilities for UI components, BEM for legacy, Modules for isolated components",
              "Avoid global styles except resets and design tokens — always scope to a component",
            ],
            docs: [
              {
                label: "Tailwind CSS docs",
                url: "https://tailwindcss.com/docs",
              },
            ],
            prompt:
              "Take a poorly structured CSS file with global selectors and specificity conflicts. Refactor it three ways: BEM, CSS Modules, and utility-first. Explain the tradeoffs.",
          },
          {
            title: "Animations and transitions",
            what: "CSS animations and transitions are GPU-accelerated when done correctly — but can destroy performance when done wrong. Knowing which properties to animate determines whether it is smooth or janky.",
            points: [
              "transition: property duration easing delay — animates between two states on trigger",
              "Only animate: transform and opacity — these are GPU composited and never trigger layout",
              "animation: name duration easing — keyframe sequences with full timeline control",
              "will-change: transform — hint to browser to promote to its own layer — use sparingly",
              "prefers-reduced-motion: wrap all decorative animations in this media query",
              "@keyframes: define animation steps with from/to or percentages",
              "Chrome DevTools Performance Panel: record a frame, look for Long Tasks (red bars >50ms) and Layout Shift contributions in the Experience row — this is how you confirm in real metrics that switching from left/top to transform eliminated jank, not just in theory",
            ],
            docs: [
              {
                label: "MDN → CSS Animations",
                url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations",
              },
              {
                label: "web.dev → Diagnose forced synchronous layouts",
                url: "https://developer.chrome.com/docs/devtools/performance/forced-synchronous-layouts",
              },
            ],
            prompt:
              "Show me an animation that causes layout thrashing. Fix it by switching to transform. Then open Chrome DevTools Performance Panel, record both versions, and show me how to read the Long Tasks and Layout Shift markers to confirm the improvement.",
          },
          {
            title: "Tailwind CSS v4 — deep dive",
            what: "Tailwind v4 introduced a CSS-first configuration approach, completely replacing the JavaScript config file. Understanding how it differs from v3 prevents confusion and unlocks the full system.",
            points: [
              '@import "tailwindcss" — single import replaces the three directives from v3',
              "@theme block: define design tokens directly in CSS — no tailwind.config.js needed",
              "CSS variables replace the JS config: --color-primary: #2563eb in @theme",
              "Arbitrary values: bg-[#f00], p-[13px] — escape hatch for one-off values",
              "Variants: hover:, focus:, dark:, md: — compose with utilities inline",
              "v4 breaking changes: config format, plugin API, and JIT are all changed — read migration guide",
            ],
            docs: [
              {
                label: "Tailwind CSS v4 docs",
                url: "https://tailwindcss.com/docs",
              },
              {
                label: "Tailwind v4 upgrade guide",
                url: "https://tailwindcss.com/docs/upgrade-guide",
              },
            ],
            prompt:
              "Show me how to set up a design token system in Tailwind v4 using the CSS-first @theme approach. Compare it to how you would have done the same thing in v3.",
          },
          {
            title: "Accessibility in CSS",
            what: "CSS directly impacts accessibility — focus visibility, color contrast, reduced motion, and print styles. Many a11y failures are CSS failures.",
            points: [
              ":focus-visible instead of :focus — shows ring only for keyboard navigation, not mouse clicks",
              "outline: none is an a11y crime — always replace it with a visible alternative",
              "Color contrast: WCAG AA requires 4.5:1 for normal text — use a contrast checker tool",
              "prefers-reduced-motion: @media (prefers-reduced-motion: reduce) — disable animations",
              "High contrast mode (forced-colors): test components in Windows high contrast",
              "Skip link: position off-screen normally, bring into view on focus — keyboard shortcut to main content",
            ],
            docs: [
              {
                label: "MDN → Accessibility",
                url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility",
              },
            ],
            prompt:
              "Audit a component's CSS for accessibility issues. Fix the focus styles, check contrast ratios, and add prefers-reduced-motion support. Show me what each change prevents.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Design systems, tokens, component APIs, and Storybook.",
        subtopics: [
          {
            title: "Design tokens — the foundation of a design system",
            what: "Design tokens are named values for every visual decision in your product — colors, spacing, typography, shadows. They are the single source of truth shared between design and code.",
            points: [
              "Primitive tokens: raw values — --color-blue-500: #3b82f6 — never used directly in components",
              "Semantic tokens: meaning-mapped — --color-background-primary: var(--color-blue-500)",
              "Component tokens: scoped to a component — --button-background: var(--color-background-primary)",
              "Token tiers: 3-layer system prevents hard-coded values anywhere in component code",
              "Tool sync: Tokens Studio for Figma exports JSON — Style Dictionary transforms to CSS/JS/iOS/Android",
              "Versioning: tokens are a public API — breaking changes require a major version bump",
            ],
            docs: [
              {
                label: "Style Dictionary docs",
                url: "https://amzn.github.io/style-dictionary",
              },
            ],
            prompt:
              "Design a 3-tier token system for a product with dark mode and high-contrast mode. Show me how changing one primitive token propagates through semantic and component tokens.",
          },
          {
            title: "Component variant APIs",
            what: "How you expose variants in a component API determines how easy or painful the component is to use. Senior engineers design APIs that are explicit, composable, and type-safe.",
            points: [
              "data-variant attribute: style variants in CSS — avoids className string manipulation",
              "cva (class-variance-authority): type-safe variant definitions with TypeScript inference",
              "Compound variants: styles that apply only when multiple variants combine — cva handles this",
              "Polymorphic as prop: render as any HTML element while keeping the component's styles",
              "Avoid too many boolean props: 6 booleans = 64 combinations — use variant strings instead",
              "Document the API: every prop, every variant, every compound — consumers cannot read your mind",
            ],
            docs: [{ label: "cva docs", url: "https://cva.style/docs" }],
            prompt:
              "Build a Button component with 4 variants (primary, secondary, ghost, destructive), 3 sizes, and loading/disabled states using cva. Show me how TypeScript infers valid prop combinations.",
          },
          {
            title: "Storybook — component documentation and testing",
            what: "Storybook is the industry standard for building, documenting, and testing UI components in isolation. It serves as a living style guide, a development environment, and a testing harness.",
            points: [
              "Story: a named render of a component with specific props — one story per variant",
              "args: story-level props that feed Controls — enable interactive prop tweaking",
              "autodocs: automatic documentation page generated from TypeScript types and JSDoc",
              "Interactions: simulate user events in stories with @storybook/test — test without a browser",
              "Visual testing: Chromatic compares screenshots between branches — catch regressions",
              "Accessibility addon: a11y checks run on every story — aria issues surfaced during development",
            ],
            docs: [
              { label: "Storybook docs", url: "https://storybook.js.org/docs" },
            ],
            prompt:
              "Set up Storybook for a component library. Write stories for a Button component with all variants. Add an interaction test that verifies the onClick fires. Show me how autodocs generates the docs page.",
          },
          {
            title: "Building a scalable design system",
            what: "A design system is a product — it has users (other developers), a versioned API, changelogs, and breaking changes. Building it correctly from the start prevents painful migrations later.",
            points: [
              "Monorepo structure: packages/tokens, packages/components, packages/docs — clear separation",
              "Semantic versioning: patch for bug fixes, minor for new components, major for breaking changes",
              "Changelog: every change documented — consumers need to understand what changed and why",
              "Migration guides: breaking changes must include a step-by-step migration path",
              "Peer dependencies: React and ReactDOM as peer deps — consumers provide their version",
              "Tree-shaking: named exports only — import { Button } not import DS — only ships what is used",
            ],
            docs: [
              {
                label: "Storybook → Design Systems for Developers",
                url: "https://storybook.js.org/tutorials/design-systems-for-developers/",
              },
            ],
            prompt:
              "Design the monorepo structure for a design system that exports tokens, components, and icons as separate packages. Show me the package.json relationships and how a consuming app imports from it.",
          },
        ],
      },
    },
  },

  devops: {
    nav: "nav-devops",
    phase: "Phase 3 · Week 21–24",
    title: "DevOps Basics",
    meta: "3 weeks · ~24 hrs",
    color: "grn",
    intro:
      "Every senior engineer needs to own their code from development to production. Docker, CI/CD pipelines, and deployment strategies are no longer optional knowledge — they are expected at interview and essential for shipping confidently. This topic gives you the practical foundation to containerize, automate, and deploy real applications.",
    docNote:
      'Docker and GitHub Actions official docs are comprehensive and well-maintained. Read the Docker "Getting Started" guide end-to-end before anything else — it covers the mental model, not just commands.',
    docs: [
      {
        label: "Docker → Getting Started",
        url: "https://docs.docker.com/get-started/",
      },
      {
        label: "GitHub Actions docs",
        url: "https://docs.github.com/en/actions",
      },
      { label: "Docker Compose docs", url: "https://docs.docker.com/compose/" },
      { label: "nginx docs", url: "https://nginx.org/en/docs/" },
    ],
    levels: {
      beginner: {
        label: "Beginner",
        desc: "Docker fundamentals — images, containers, Dockerfile, and Compose.",
        subtopics: [
          {
            title: "Docker core concepts — images and containers",
            what: "Docker packages an application and all its dependencies into a portable unit called an image. A container is a running instance of that image. Understanding this distinction eliminates most Docker confusion.",
            points: [
              "Image: read-only template built from a Dockerfile — shareable via registries (Docker Hub, GHCR)",
              "Container: running instance of an image — isolated process with its own filesystem and network",
              "docker build -t myapp:latest . — builds an image from the Dockerfile in current directory",
              "docker run -p 3000:3000 myapp — starts a container, maps host port 3000 to container port 3000",
              "docker ps — list running containers — docker ps -a includes stopped containers",
              "docker logs <container> — stream stdout/stderr — essential for debugging running containers",
              "Containers are ephemeral: data written inside is lost when container stops — use volumes for persistence",
            ],
            docs: [
              {
                label: "Docker → Get Started",
                url: "https://docs.docker.com/get-started/",
              },
            ],
            prompt:
              "Explain the difference between a Docker image and a container with an analogy. Then show me what happens step by step when I run docker run on an image that is not cached locally.",
          },
          {
            title: "Writing a production Dockerfile",
            what: "A Dockerfile is a set of instructions for building an image. The order of instructions matters — Docker caches each layer, and a poor layer order causes full rebuilds on every code change.",
            points: [
              "FROM: base image — use specific tags, never latest in production (FROM node:20-alpine)",
              "WORKDIR: sets working directory for all subsequent commands — use /app convention",
              "COPY package*.json ./ then RUN npm ci BEFORE copying source — cache deps layer separately",
              "COPY . . — copy source AFTER installing deps — source changes do not invalidate dep cache",
              "RUN npm run build — execute build step inside the container",
              "CMD vs ENTRYPOINT: CMD is the default command, easily overridden — ENTRYPOINT is fixed",
              "USER node: never run as root inside a container — security best practice",
              'Next.js standalone caveat: output: "standalone" emits a minimal server to .next/standalone but does NOT bundle static assets — you must explicitly COPY .next/static into .next/standalone/.next/static and COPY public/ into .next/standalone/public/, or client-side assets (JS chunks, images) will 404 at runtime',
            ],
            gotchas: [
              "COPY . . before npm ci is the most common Dockerfile mistake — every source file change invalidates the node_modules cache layer, causing a full npm install on every build; always copy package files first",
              "Using FROM node:20 (not alpine) in production adds ~800MB vs ~150MB for alpine — use alpine variants unless you need glibc-specific binaries",
              "Running as root inside the container means a container escape gives the attacker root on the host — always add USER node before CMD",
              ".dockerignore is not optional — without it, COPY . . includes node_modules, .git, .env, and .next into the image context, making builds slow and leaking secrets",
            ],
            examples: [
              {
                label: "Production Next.js 15 Dockerfile (multi-stage)",
                code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
              },
              {
                label: ".dockerignore (always include this)",
                code: `node_modules
.next
.git
.env
.env.local
npm-debug.log
README.md`,
              },
            ],
            docs: [
              {
                label: "Dockerfile reference",
                url: "https://docs.docker.com/reference/dockerfile/",
              },
              {
                label: "Next.js → Docker deployment",
                url: "https://nextjs.org/docs/app/building-your-application/deploying#docker-image",
              },
            ],
            prompt:
              "Write a production Dockerfile for a Next.js 15 app with output: standalone. Show the exact COPY commands needed to include static assets and the public folder. Explain why omitting them causes 404s in production but not in next start.",
          },
          {
            title: "Multi-stage builds",
            what: "Multi-stage builds produce smaller, more secure images by separating the build environment from the runtime environment. The final image contains only what is needed to run the app — not the build tools.",
            points: [
              "FROM node:20-alpine AS builder — name the build stage",
              "RUN npm run build in the builder stage — full build toolchain available",
              "FROM node:20-alpine AS runner — fresh base image for the runtime stage",
              "COPY --from=builder /app/.next/standalone ./ — copy only the output, not source or node_modules",
              "Static assets are NOT included in standalone output — you must add two explicit copies: COPY --from=builder /app/.next/static ./.next/static and COPY --from=builder /app/public ./public — skipping either causes client JS chunks or public files to 404 at runtime",
              "Final image contains no TypeScript, no dev dependencies, no source code — much smaller and safer",
              "Compare image sizes: single-stage Node.js app ~1GB, multi-stage ~150MB — significant difference",
              'next.config output: "standalone" works with this pattern — generates a self-contained server',
            ],
            docs: [
              {
                label: "Docker → Multi-stage builds",
                url: "https://docs.docker.com/build/building/multi-stage/",
              },
              {
                label: "Next.js → Standalone output",
                url: "https://nextjs.org/docs/app/api-reference/config/next-config-js/output",
              },
            ],
            prompt:
              "Show me the complete multi-stage Dockerfile for a Next.js 15 app with output: standalone, including all three COPY statements needed for the runner stage. Explain what breaks at runtime if you omit .next/static or public/.",
          },
          {
            title: "Docker Compose for local development",
            what: "Docker Compose defines and runs multi-container applications. For local development it replaces manual docker run commands with a single docker compose up that starts your entire stack.",
            points: [
              "compose.yml: defines services, networks, and volumes — checked into version control",
              "services: app, database, redis — each service becomes an isolated container",
              'depends_on long-form with condition: service_healthy — the short array form (depends_on: [db]) only waits for the container to start, not for Postgres to be ready to accept connections — use the object form: depends_on: { db: { condition: service_healthy } } paired with a healthcheck: { test: ["CMD-SHELL", "pg_isready -U postgres"], interval: 5s, retries: 5 } on the db service to guarantee true readiness',
              "volumes: named volumes persist data between container restarts — bind mounts sync local files",
              "environment: inject env vars — use .env file with docker compose, never hardcode secrets",
              "docker compose up -d — start all services in background — docker compose logs -f to follow",
            ],
            gotchas: [
              "depends_on: [db] only waits for the container process to start — Postgres takes 1-2 extra seconds to accept connections after the process starts; your app will crash with ECONNREFUSED if you use the short form",
              "Named volumes persist between docker compose down and up — but docker compose down -v deletes them permanently including your database data; never run -v unless you mean to wipe all data",
              "bind mounts on Mac/Windows are significantly slower than on Linux — heavy file I/O inside a bind-mounted directory (like running npm install inside the container) will be noticeably slow",
            ],
            examples: [
              {
                label: "compose.yml with healthcheck + depends_on (correct)",
                code: `services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy  # waits for healthcheck to pass
    env_file: .env

volumes:
  db_data:`,
              },
            ],
            docs: [
              {
                label: "Docker Compose docs",
                url: "https://docs.docker.com/compose/",
              },
              {
                label: "Compose → depends_on reference",
                url: "https://docs.docker.com/compose/how-tos/startup-order/",
              },
            ],
            prompt:
              "Write a docker-compose.yml for a Next.js app with a PostgreSQL database and Redis cache. Use long-form depends_on with condition: service_healthy and proper healthchecks on both db and redis. Explain what happens without the long-form syntax when the app tries to connect before Postgres is ready.",
          },
          {
            title: "Environment variables and secrets",
            what: "Managing configuration and secrets correctly in containerized applications is a security requirement, not just a best practice. The wrong approach leaks credentials.",
            points: [
              "Never bake secrets into images — they are visible in docker history and image layers",
              "ENV in Dockerfile: sets build-time defaults — visible in docker inspect — only for non-secrets",
              "Runtime injection: docker run -e DB_URL=$DB_URL — secrets never touch the image",
              ".env file: loaded by Docker Compose in development — NEVER commit .env to git",
              "Docker secrets (Swarm) and Kubernetes secrets: mounted as files, not env vars — more secure",
              "ARG vs ENV: ARG is build-time only, ENV persists at runtime — use ARG for build tokens only",
            ],
            docs: [
              {
                label: "12factor.net → Config",
                url: "https://12factor.net/config",
              },
              {
                label: "Docker → Secrets management",
                url: "https://docs.docker.com/compose/how-tos/use-secrets/",
              },
              {
                label: "Docker → ARG vs ENV",
                url: "https://docs.docker.com/reference/dockerfile/#arg",
              },
            ],
            prompt:
              "Show me 3 ways secrets can accidentally leak in Docker. For each, show me the correct pattern. Then show me how to pass a database password from the host into a container without it appearing in docker inspect.",
          },
        ],
      },
      intermediate: {
        label: "Intermediate",
        desc: "GitHub Actions CI/CD, deployment strategies, and self-hosting.",
        subtopics: [
          {
            title: "GitHub Actions — CI fundamentals",
            what: "GitHub Actions automates your workflow on every push or pull request. A well-configured CI pipeline catches bugs before they merge and gives every team member confidence to ship.",
            points: [
              "Workflow file: .github/workflows/ci.yml — triggered by push, pull_request, or schedule",
              "on: pull_request — runs on every PR, blocks merge if it fails — configure branch protection",
              "jobs: run in parallel by default — use needs: to define sequential dependency",
              "steps: sequential commands inside a job — uses: for actions, run: for shell commands",
              "actions/checkout: clone the repo — actions/setup-node: install Node — required in every JS workflow",
              "Matrix strategy: test on multiple Node versions with one workflow definition",
              "Caching: cache node_modules with actions/cache — cut CI time from 3 min to 30 sec",
            ],
            docs: [
              {
                label: "GitHub Actions docs",
                url: "https://docs.github.com/en/actions",
              },
            ],
            prompt:
              "Write a complete GitHub Actions CI workflow for a Next.js app that runs type checking, linting, and tests on every pull request. Explain how to add branch protection rules that block merging on failure.",
          },
          {
            title: "Building and pushing Docker images in CI",
            what: "An automated pipeline that builds a Docker image, pushes it to a registry, and deploys it is the foundation of modern CD. Understanding each step prevents the most common pipeline failures.",
            points: [
              "docker/build-push-action: build and push in one step — the standard GitHub Action for Docker",
              "GHCR (GitHub Container Registry): free for public, tied to your GitHub account — simple auth",
              "Image tagging strategy: tag with git SHA for traceability, latest for convenience",
              "docker/metadata-action: auto-generate tags from git ref, branch, and SHA",
              "secrets.GITHUB_TOKEN: built-in — no setup needed for GHCR auth",
              "Build cache: cache-from and cache-to with type=gha — reuse Docker layer cache across CI runs",
            ],
            docs: [
              {
                label: "docker/build-push-action",
                url: "https://github.com/docker/build-push-action",
              },
            ],
            prompt:
              "Write a GitHub Actions workflow that builds a Docker image on every push to main, tags it with the git SHA, and pushes it to GHCR. Include Docker layer caching to speed up builds.",
          },
          {
            title: "Deployment strategies",
            what: "How you deploy determines your downtime, rollback speed, and blast radius when something goes wrong. Senior engineers choose the strategy that matches the application's risk tolerance.",
            points: [
              "Rolling deployment: replace old instances one by one — zero downtime, mixed versions briefly",
              "Blue-green: two identical environments, switch traffic at the load balancer — instant rollback",
              "Canary: route a percentage of traffic to the new version — catch issues before full rollout",
              "Feature flags: deploy code but control activation separately — decouple deploy from release",
              "Rollback: blue-green is fastest (flip DNS) — rolling requires redeploying previous image",
              "Database migrations: always backward compatible with the previous version — deploy code after migrating",
            ],
            docs: [
              {
                label: "Martin Fowler → Blue-Green Deployment",
                url: "https://martinfowler.com/bliki/BlueGreenDeployment.html",
              },
              {
                label: "Martin Fowler → Canary Release",
                url: "https://martinfowler.com/bliki/CanaryRelease.html",
              },
              {
                label: "nginx → Upstream load balancing",
                url: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/",
              },
            ],
            prompt:
              "Compare rolling, blue-green, and canary deployments for a Next.js app with a PostgreSQL database. Which strategy handles database migrations most safely? Walk me through a failed deployment and how each strategy recovers.",
          },
          {
            title: "Self-hosting on a VPS with nginx",
            what: "Deploying to a VPS (DigitalOcean, Hetzner, Linode) gives you full control and is dramatically cheaper than managed platforms at scale. nginx handles SSL termination, reverse proxying, and static file serving.",
            points: [
              "nginx as reverse proxy: listens on port 80/443, forwards to your app on 3000 — never expose app directly",
              "Certbot + Let's Encrypt: free SSL certificates, auto-renewed — certbot --nginx handles everything",
              "PM2: process manager for Node.js — pm2 start, pm2 restart, pm2 logs — survives server reboots",
              "UFW firewall: allow only 22 (SSH), 80, 443 — block all other ports",
              "Systemd service vs PM2: systemd for Docker containers, PM2 for bare Node.js processes",
              "Zero-downtime restart: pm2 reload or Docker rolling update — no dropped connections",
            ],
            docs: [{ label: "nginx docs", url: "https://nginx.org/en/docs/" }],
            prompt:
              "Walk me through deploying a Next.js app on a fresh Ubuntu VPS from scratch: user setup, nginx config, SSL with Certbot, PM2 process management, and GitHub Actions deployment trigger.",
          },
          {
            title: "SSH and server security basics",
            what: "A poorly secured server is a liability. Basic server hardening takes 30 minutes and prevents the most common attacks against publicly exposed Linux servers.",
            points: [
              "Disable root SSH login: PermitRootLogin no in /etc/ssh/sshd_config — use a regular user with sudo",
              "SSH keys only: PasswordAuthentication no — password brute-force attacks are common",
              "fail2ban: automatically ban IPs with repeated failed SSH login attempts",
              "Unattended upgrades: automatic security patches — set it up on day one and forget",
              "UFW: uncomplicated firewall — ufw allow 22/tcp, ufw allow 80, ufw allow 443, ufw enable",
              "Regular backups: database dump to S3 or Backblaze daily — not optional if data matters",
            ],
            docs: [],
            prompt:
              "Walk me through hardening a fresh Ubuntu 22.04 server after initial setup. Show me every command and explain the threat each step mitigates.",
          },
        ],
      },
      senior: {
        label: "Senior",
        desc: "Container orchestration concepts, observability, and IaC basics.",
        subtopics: [
          {
            title: "Kubernetes concepts — without the ops overhead",
            what: "You do not need to manage a Kubernetes cluster to benefit from understanding it. Knowing the abstractions helps you work effectively with platform teams and make informed architecture decisions.",
            points: [
              "Pod: smallest deployable unit — one or more tightly coupled containers",
              "Deployment: desired state for pods — rolling updates, replicas, rollback strategy",
              "Service: stable network endpoint for a set of pods — ClusterIP, NodePort, LoadBalancer",
              "Ingress: HTTP routing at the cluster edge — path and hostname-based routing to services",
              "ConfigMap and Secret: decouple configuration from images — same image, different environments",
              "Horizontal Pod Autoscaler: scale pod count based on CPU/memory — or custom metrics",
            ],
            docs: [
              {
                label: "Kubernetes docs",
                url: "https://kubernetes.io/docs/home/",
              },
            ],
            prompt:
              "Explain Kubernetes to me using only concepts I already know from Docker. What problems does it solve that Docker Compose cannot? When would a team NOT use Kubernetes?",
          },
          {
            title: "Observability — logs, metrics, traces",
            what: "Observability is the ability to understand what your system is doing from the outside. Production systems without observability are black boxes — you only discover problems when users complain.",
            points: [
              "Logs: structured JSON preferred over plain text — include request ID for traceability",
              "Metrics: counters, gauges, histograms — response time P50/P95/P99, error rate, throughput",
              "Traces: distributed request tracking across services — find where latency comes from",
              "Three pillars: logs tell you what happened, metrics tell you how often, traces tell you where",
              "Tools: Datadog, Grafana + Prometheus, New Relic, or Axiom for smaller projects",
              "Alert on symptoms not causes: alert on error rate > 1%, not on CPU > 80%",
            ],
            docs: [],
            prompt:
              "Design an observability setup for a Next.js API with a PostgreSQL database. What do you log, what metrics do you expose, and what alert thresholds would you set? Show me the structured log format.",
          },
          {
            title: "Infrastructure as Code — Terraform basics",
            what: "Infrastructure as Code treats servers, databases, and networks as code — version-controlled, repeatable, and reviewable. Terraform is the industry standard for provisioning cloud infrastructure.",
            points: [
              "Declarative: you describe the desired state — Terraform figures out how to get there",
              "Provider: cloud-specific plugin — aws, google, digitalocean — each has resources and data sources",
              "Resource: infrastructure component — aws_instance, google_sql_database_instance",
              "State file: Terraform tracks what it created — store remotely (S3 + DynamoDB for AWS)",
              "Plan: preview changes before applying — terraform plan shows add/change/destroy",
              "Modules: reusable Terraform configurations — like functions for infrastructure",
            ],
            docs: [
              {
                label: "Terraform docs",
                url: "https://developer.hashicorp.com/terraform/docs",
              },
            ],
            prompt:
              "Write a minimal Terraform configuration that provisions a DigitalOcean droplet with a firewall, SSH key, and a domain record. Explain the state file and what happens if you manually change the server outside of Terraform.",
          },
          {
            title: "Cloud platforms — Vercel vs self-host vs AWS",
            what: "Choosing where to deploy is an architectural decision that determines your monthly bill, operational burden, and ceiling for growth. The right answer depends on team size, traffic shape, and how much infrastructure you want to own. Serverless platforms optimize for developer velocity at the cost of per-request pricing; self-hosted VPS optimizes for cost at the cost of ops effort; managed cloud (AWS/GCP) gives the best reliability ceiling but the highest complexity floor.",
            points: [
              "Vercel: zero-config Next.js — ISR, Edge Functions, automatic preview deploys — pricing scales with invocations, not servers — expensive above ~100K users/month",
              "Cold starts: Vercel Edge Functions have near-zero cold starts (~0ms) — serverless Node.js functions can spike 200–800ms — matters for P99 latency on infrequently hit routes",
              "Railway / Render: managed containers — more control than Vercel, less ops than a VPS — good middle ground for teams without a dedicated DevOps engineer",
              "VPS (Hetzner / DigitalOcean): cheapest per compute unit — a €20/month Hetzner CX32 outperforms a $80/month Vercel Pro plan for sustained traffic — requires PM2 or Docker and nginx setup",
              "AWS (ECS Fargate + RDS): production-grade managed services — ALB handles rolling deploys, RDS handles failover — complex setup, best reliability and scale ceiling",
              "Database: Neon (serverless Postgres) for dev/staging — no idle cost — RDS or self-hosted Postgres for high-traffic production where connection pooling matters",
              "Decision matrix: 1 developer, early-stage → Vercel/Railway; 2–5 developers, cost-sensitive → Hetzner VPS with Docker; 5+ developers, compliance or scale requirements → AWS/GCP with managed services",
            ],
            docs: [
              { label: "Vercel → Pricing", url: "https://vercel.com/pricing" },
              { label: "Hetzner Cloud", url: "https://www.hetzner.com/cloud/" },
              {
                label: "AWS → ECS Getting Started",
                url: "https://aws.amazon.com/ecs/getting-started/",
              },
              {
                label: "Neon → Serverless Postgres",
                url: "https://neon.tech/docs/introduction",
              },
            ],
            prompt:
              "I have a Next.js 15 app with 50K monthly users, a PostgreSQL database, and a Redis cache. Compare three deployment options in detail: (1) Vercel Pro + Neon + Upstash Redis, (2) a Hetzner VPS with Docker Compose + nginx, (3) AWS ECS Fargate + RDS + ElastiCache. For each: estimate monthly cost, list cold-start implications, describe the rollback procedure, and rate operational complexity from 1–5.",
          },
        ],
      },
    },
  },
};
