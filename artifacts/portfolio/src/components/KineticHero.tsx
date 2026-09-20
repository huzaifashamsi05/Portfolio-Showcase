import { useEffect, useRef } from "react";
import gsap from "gsap";

interface KineticHeroProps {
  /** The headline text to reveal character-by-character on mount. */
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Beat 1 — opening kinetic-type reveal.
 *
 * Splits `text` into per-character spans and plays a one-time
 * entrance animation (opacity + rise + blur-out, staggered) the
 * moment the hero mounts — this is the very first thing a visitor
 * sees, so it autoplays rather than waiting on scroll input.
 *
 * `style` (e.g. a gradient + WebkitBackgroundClip: "text" treatment)
 * is applied to every individual character span rather than the
 * outer wrapper — background-clip: text does not paint through
 * nested inline-block children, only through the element it is set
 * on directly.
 *
 * Respects prefers-reduced-motion: renders the finished text
 * immediately with no animation.
 */
export function KineticHero({ text, className, style }: KineticHeroProps) {
  const charsRef = useRef<HTMLSpanElement[]>([]);
  charsRef.current = [];

  const addCharRef = (el: HTMLSpanElement | null) => {
    if (el && !charsRef.current.includes(el)) {
      charsRef.current.push(el);
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      charsRef.current.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(charsRef.current, { opacity: 0, y: 28, filter: "blur(6px)" });
      gsap.to(charsRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        delay: 0.15,
        stagger: { each: 0.035, from: "start" },
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, [text]);

  const charStyle: React.CSSProperties = {
    ...style,
    display: "inline-block",
    willChange: "transform, opacity, filter",
  };

  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span key={`${char}-${i}`} ref={addCharRef} style={charStyle}>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
