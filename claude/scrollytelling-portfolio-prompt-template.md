# Ultimate Scrollytelling Portfolio Prompt Template

For: Muhammad Huzaifa Shamsi — next-gen portfolio rebuild
Researched & drafted: Sept 2026

## Why this approach

"Scrollytelling" (scroll = story-telling) is the dominant portfolio/marketing-site trend going into 2026 — sites like Apple product pages, where scrolling pins a section and plays out a mini-film (video split into frames, captions crossfading, elements revealing) instead of a static page you just scroll past. It turns a portfolio from "a page that lists projects" into "an experience someone plays through."

Two techniques make this work, and most real sites mix both:

1. **Native CSS scroll-driven animations** (`animation-timeline: scroll()`, `view()`) — now baseline-supported across all major browsers. Zero JavaScript, hardware-accelerated. Handles ~80% of effects: fade-ins, parallax, progress bars, sticky reveals.
2. **GSAP + ScrollTrigger** (100% free since April 2025) for the complex 20%: pinned sections, scrubbed timelines, frame-by-frame canvas playback, synchronized captions. Pair it with **Lenis** for buttery smooth scroll — both should share the same animation clock so they don't fight each other.

The golden rule for 2026: **performance and restraint over spectacle**. 43% of sites fail Google's 200ms INP (responsiveness) threshold because of heavy scroll-hijacking. Every animation should use only `transform` and `opacity`, respect `prefers-reduced-motion`, and never trap the user mid-scroll.

## The "video split into pictures" technique (classic Apple hero effect)

This is the exact effect you're describing — a video turned into a scrubbable image sequence that plays forward/backward as the user scrolls, frame-perfectly synced.

**Pipeline:**
1. Export or record a short video of the subject (product shot, code animation, whatever the hero beat needs) — keep it under ~5 seconds of source material.
2. Extract frames with ffmpeg:
   ```
   ffmpeg -i source.mp4 -vf fps=24,scale=1600:-1 frame_%03d.webp
   ```
   24 frames/sec of scroll-scrubbing is plenty smooth; going higher just bloats load time for no visible gain.
3. Two ways to serve the frames:
   - **Individual WebP files** (`frame_001.webp` … `frame_090.webp`) — lets you preload the first few frames instantly and stream the rest, with a loading-progress indicator. Best when frame count is large or you want priority-loading of key frames.
   - **Packed spritesheet** (all frames tiled into one image) — one network request instead of 90, and compresses much better (a real-world AirPods sequence went from 15.2MB as separate PNGs to 1.5MB as one WebP spritesheet). Downside: nothing shows until the whole sheet is loaded, and you need the CSS `round()` function (decent but not universal browser support) or a JS fallback.
   - **Recommendation for your portfolio:** individual WebP frames + canvas rendering, since your total frame count per beat will likely be small (60–120 frames) and you get a nicer loading experience.
4. Draw the current frame to a `<canvas>` sized with `object-fit: cover` behavior (centered crop, correct aspect ratio at every viewport width).
5. A single GSAP timeline maps scroll progress (0→1) to frame index; ScrollTrigger pins the section for the scroll distance you want the "film" to play over, then releases.
6. Reduced-motion fallback: skip the canvas/pin entirely and just show one static representative frame.

Alternative (lighter to build, less scrubbable): serve the actual `.mp4` and drive `video.currentTime` from scroll position instead of frames — works well if you don't need buttery backward-scrub, needs short-GOP encoding (`-g 1` in ffmpeg) for instant seeking, and Safari needs seek-coalescing to avoid a request pile-up.

## Recommended tech stack

- **Framework:** React + Vite + TypeScript (matches your existing Portfolio-Showcase stack, so this can evolve the current site rather than a total rewrite)
- **Smooth scroll:** Lenis
- **Scroll animation engine:** GSAP + ScrollTrigger (free) — or the React wrapper **`@bsmnt/scrollytelling`** (`Root` / `Animation` / `Waypoint` / `ImageSequenceCanvas` components) if you want less hand-rolled timeline code
- **Simple reveals/parallax:** native CSS `animation-timeline: scroll()` — no library needed
- **Typography motion:** GSAP SplitText or CSS `@property` + variable fonts for kinetic/character-level type
- **Video/frame pipeline:** ffmpeg (frame extraction) + Squoosh or `sharp` (batch WebP compression)

## Story structure — "beats" not "sections"

Think like a director, not a page-builder. Each scroll-pinned block is a **beat**: what's on screen, what moves, what text appears, how long (in scroll distance) it plays for, and what it hands off to the next beat. For your portfolio, a first-pass beat sheet:

1. **Opening beat** — name/role kinetic-type reveal over a subtle animated backdrop (code particles / data visualization motif fits your Data Science angle)
2. **Journey beat** — an image-sequence "film" of your path: university → first line of code → first deployed project, captions crossfading in sync
3. **Skills beat** — bento-grid stagger reveal (not a static progress-bar list) grouped by category (Programming, Data Science, Frontend, Backend)
4. **Projects beat(s)** — one pinned scroll-scrub per flagship project (EduPulse, Portfolio, SecurERP …) — screenshot/demo frames scrubbing as you scroll, with a live-demo/GitHub CTA fixed in view
5. **Certifications/testimonials beat** — simple parallax + fade, no pinning needed (this is 80%-CSS territory)
6. **Contact/closing beat** — calm, no scroll-hijack, just a clean CTA — the "declining" pattern for 2026 is decorative flourishes at exactly the point someone wants to act

## Performance & accessibility checklist (non-negotiable)

- Animate only `transform` and `opacity` — never `top/left/width/height` in a scroll handler
- Every pinned/scrubbed section has a `prefers-reduced-motion` fallback (static frame, instant reveal)
- Frame images: WebP, sized to actual display resolution, lazy-loaded outside the first beat
- Lenis and ScrollTrigger synced to one shared ticker (don't let two scroll systems fight)
- Test INP on mobile — if a beat feels janky on a mid-range phone, cut frame count or simplify before adding more polish
- No autoplay sound, no scroll-jacking that prevents a user from skipping ahead if they want to

## Reusable AI prompt template

Use this block (fill the brackets) whenever you want an AI to generate or extend a beat — mirrors how these sites actually get built in 2026 (prompt → generate → preview → refine by prompt → drop to code):

```
Build a scrollytelling [SECTION NAME] for a portfolio site using React + Vite + TypeScript,
Lenis for smooth scroll, and GSAP ScrollTrigger for the pinned timeline.

Beat: [describe what happens in one sentence, like a director's shot list]
Duration: pin for [X]vh of scroll
Visuals: [image sequence of N frames from /frames/beatname/ | static image with parallax | kinetic text]
Captions: [what text appears, and at what scroll-progress percentage each line fades in/out]
Exit: [how this beat hands off to the next — crossfade, slide, hard cut]

Constraints:
- transform/opacity only, no layout-thrashing properties
- prefers-reduced-motion fallback required
- mobile: [simplify to X | disable pinning | keep as-is]
```

## Next steps (when you're ready)

1. Decide which beats from the story structure above you actually want (all 6, or start with just the opening + one project beat as a proof of concept)
2. Record/gather the short video clips or screen-recordings each image-sequence beat needs
3. I extract frames with ffmpeg and compress them
4. Build the beats one at a time in the existing Portfolio-Showcase repo (or a new branch, so the current live site stays safe while we iterate)
5. Test on mobile + reduced-motion before merging each beat to `main`

Sources:
- [Scrollytelling Trends 2026 — Svilenković](https://svilenkovic.com/3d/scrollytelling-trends-2026)
- [Web Animation Trends 2026: The Complete Report — MotionKit](https://motionkit.io/blog/web-animation-trends-2026)
- [Scroll Image Sequence — GSAP Vault](https://gsapvault.com/effects/scroll-image-sequence)
- [Using (almost) pure CSS for scroll-driven image sequence animations](https://geyer.dev/blog/css-image-sequence-animations/)
- [How to build an Apple-style scroll website with AI — Vulk](https://vulk.dev/blog/how-to-build-an-apple-style-scroll-website-with-ai)
- [basementstudio/scrollytelling (GitHub)](https://github.com/basementstudio/scrollytelling)
- [60+ GSAP ScrollTrigger.js Examples](https://freefrontend.com/scroll-trigger-js/)
