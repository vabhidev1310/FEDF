import { useEffect, useRef } from "react";

/**
 * useScrollReveal – Attaches an IntersectionObserver to elements that have
 * the class names: `reveal`, `reveal-left`, `reveal-right`, `reveal-scale`.
 * When they enter the viewport they gain the `visible` class which triggers
 * the CSS transition defined in index.css.
 *
 * @param {string} selector – CSS selector for elements to observe (default: all reveal variants)
 * @param {object} options  – IntersectionObserver options
 */
export function useScrollReveal(
  selector = ".reveal, .reveal-left, .reveal-right, .reveal-scale",
  options = { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
) {
  const observerRef = useRef(null);

  useEffect(() => {
    const elements = document.querySelectorAll(selector);

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Unobserve after reveal so it stays visible
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, options);

    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [selector]);
}

/**
 * useParallax – Lightweight mouse-parallax for a given ref element.
 * Moves element opposite to mouse direction to create depth.
 *
 * @param {number} strength – pixels of max movement (default: 20)
 */
export function useParallax(strength = 20) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const { innerWidth: W, innerHeight: H } = window;
      const x = ((e.clientX / W) - 0.5) * strength;
      const y = ((e.clientY / H) - 0.5) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [strength]);

  return ref;
}

/**
 * useTilt – 3D tilt effect driven by mouse position over element.
 *
 * @param {number} maxTilt – maximum tilt degrees (default: 10)
 */
export function useTilt(maxTilt = 10) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      el.style.transition = "transform 0.1s ease";
    };

    const handleLeave = () => {
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      el.style.transition = "transform 0.5s ease";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [maxTilt]);

  return ref;
}
