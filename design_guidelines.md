# SQL & Database Learning Platform - Design Guidelines

## Design Approach

**Reference-Based:** Apple-inspired educational platform (think Apple's Swift Playgrounds meets Duolingo's calm learning experience)

**Core Philosophy:** A calm, clear mentor that makes databases finally make sense through visual, interactive learning.

---

## Color System

- **Primary:** Orange (#FF8C00) - Used for CTAs, active states, progress indicators, highlights
- **Background:** Pure White (#FFFFFF)
- **Accent/Secondary:** Light Gray (#F5F5F5, #E5E5E5) for subtle backgrounds, disabled states
- **Text:** Dark Gray (#1A1A1A) for primary text, Medium Gray (#666666) for secondary
- **Success:** Soft Green for correct answers/validation
- **Error:** Soft Red for mistakes (supportive tone, not harsh)
- **Neutral:** Light borders and dividers (#E0E0E0)

---

## Typography

**Font Stack:** SF Pro Display (Apple), Inter, or system-ui fallback

**Hierarchy:**
- **Hero/Section Titles:** 2.5rem-3.5rem, font-weight 700, tight letter-spacing
- **Page Headings:** 2rem, font-weight 600
- **Subsection Headings:** 1.5rem, font-weight 600
- **Body Text:** 1rem (16px), font-weight 400, line-height 1.6
- **Code/SQL:** JetBrains Mono or Monaco, 0.95rem
- **Captions/Labels:** 0.875rem, font-weight 500

---

## Layout & Spacing

**Spacing Scale:** Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24 (generous spacing throughout)

**Container Widths:**
- Learning content: max-w-6xl
- SQL editors/playgrounds: max-w-7xl (full width when needed)
- Text-heavy explanations: max-w-3xl

**Section Padding:** py-16 md:py-24 for major sections

**Card Padding:** p-6 md:p-8

**Grid Layouts:**
- Learning paths: 3-column grid (lg:grid-cols-3)
- Scenarios: 2-column grid (lg:grid-cols-2)
- Feature cards: Single column on mobile, 2-3 columns desktop

---

## Visual Style

**Shadows:** Soft, layered shadows (never harsh)
- Cards: `shadow-lg shadow-gray-200/50`
- Elevated elements: `shadow-xl shadow-gray-300/30`
- Buttons: `shadow-md shadow-orange-400/20`

**Borders & Corners:**
- Border radius: rounded-xl (12px) for cards, rounded-lg (8px) for smaller elements
- Borders: 1px solid, light gray, minimal usage
- Focus rings: orange with offset

**Interactive States:**
- Hover: Subtle lift (transform: translateY(-2px)), shadow increase
- Active: Slight scale (0.98)
- Transitions: 200ms ease-out (smooth, never jarring)

---

## Component Library

### Navigation
- Clean top navbar, white background, subtle shadow on scroll
- Logo on left, main nav centered, user profile on right
- Mobile: Hamburger menu, full-screen overlay

### Learning Path Cards
- Large cards with rounded corners, soft shadow
- Progress ring/bar prominently displayed
- Icon/illustration at top, title, description, "Continue" CTA
- Locked state: Grayscale with lock icon

### SQL Editor Component
- Monaco editor with light theme
- Toolbar: Run Query (orange button), Reset (gray button), Save (icon)
- Results table below: Clean, zebra-striped rows, rounded container
- Error messages: Inline, friendly tone, orange accent

### Visual JOIN Playground
- Two-panel layout: Tables side-by-side
- Visual lines connecting PK-FK (animated on hover)
- Toggle buttons for JOIN types (segmented control style)
- Highlight matched/unmatched rows with subtle color overlays
- Result preview at bottom

### Schema Designer
- Form-based table creator: Clean inputs, add column button
- Drag-to-reorder columns
- Dropdowns for data types, checkboxes for PK/FK
- Visual validation feedback (green checkmarks, orange warnings)
- ER diagram view option (SVG-based relationship lines)

### Error Explainer Cards
- Orange left border accent
- Sections: "What went wrong" (heading), "Why" (body), "How to fix" (bulleted), "Learn more" (link)
- Friendly, conversational tone
- Icon: Lightbulb or helpful indicator

### Query Execution Visualizer
- Step-by-step breakdown with numbered circles
- Highlight current step in orange
- Show intermediate results for each step
- Collapse/expand details

### Progress Indicators
- Circular progress rings (orange fill)
- Linear bars with rounded ends
- Milestone badges with checkmarks
- Encouraging micro-copy ("Great work!", "Almost there!")

---

## Animations & Micro-interactions

**Use Sparingly:**
- Page transitions: Subtle fade-in (300ms)
- Card hovers: Gentle lift
- Button clicks: Quick scale feedback
- Progress updates: Smooth number counting, filling animations
- Success states: Confetti or checkmark animation (delightful, not distracting)

**Avoid:**
- Distracting background animations
- Excessive parallax
- Auto-playing carousels

---

## UX Principles

1. **Beginner-First Language:** Avoid jargon, explain in plain terms
2. **Visual > Text:** Diagrams, highlighted code, interactive demos over walls of text
3. **Immediate Feedback:** Real-time validation, instant query results
4. **Progressive Disclosure:** Start simple, reveal complexity gradually
5. **Zero Clutter:** One focus per screen, generous whitespace
6. **Supportive Tone:** Encouraging messages, never judgmental
7. **Clear Hierarchy:** Visual weight guides attention to primary actions

---

## Page-Specific Guidelines

### Landing Page (Marketing)
- Hero: Large heading "Master SQL & Database Design", orange CTA, subtle background gradient or illustration
- Features: 3-column grid showcasing core features with icons
- Social proof: Student testimonials (no photos needed, just quotes)
- CTA section: Orange background, white text, centered

### Dashboard (Learning Hub)
- Welcome header with user name and progress summary
- Learning paths: 3-column card grid
- "Continue where you left off" section at top
- Quick actions sidebar: Practice SQL, Join Playground

### Lesson Pages
- Left sidebar: Lesson navigation, progress indicator
- Main content: Explanation text (max-w-3xl), code examples, interactive demos
- Right sidebar: Key takeaways, hints (collapsible)
- Bottom: Next/Previous lesson navigation

### SQL Playground
- Full-width editor and results
- Minimal chrome, focus on code
- Persistent toolbar for actions
- Collapsible schema reference on left

---

## Images

**Do NOT use a large hero image.** This is a learning platform focused on clarity and interaction, not marketing imagery.

**Illustrations:**
- Simple, line-based icons for features (can use Heroicons)
- Custom SVG illustrations for concepts (database tables, JOIN diagrams) - use placeholder comments
- Optional: Small decorative graphics in empty states (friendly, minimal)

---

## Accessibility

- WCAG AA color contrast minimum
- Keyboard navigation for all interactive elements
- Focus indicators: 2px orange outline with offset
- Screen reader labels on icons
- Semantic HTML throughout