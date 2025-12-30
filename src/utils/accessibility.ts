// src/utils/accessibility.ts

/**
 * Accesibilidad y mejores prácticas WCAG
 */

/**
 * Anunciar cambios dinámicos a lectores de pantalla
 */
export function announceChange(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only"; // Visually hidden
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remover después de que se anuncie
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Foco management
 */
export function setFocus(element: HTMLElement) {
  element.focus();

  // Scroll into view si es necesario
  if (!isInViewport(element)) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/**
 * Verificar si un elemento está visible
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Keyboard navigation
 */
export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  items: HTMLElement[]
) {
  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  let nextIndex = currentIndex;

  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % items.length;
    event.preventDefault();
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + items.length) % items.length;
    event.preventDefault();
  }

  if (nextIndex !== currentIndex) {
    setFocus(items[nextIndex]);
  }
}

/**
 * Skip to content link
 */
export function createSkipLink() {
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.className = "skip-link sr-only focus:not-sr-only";
  skipLink.textContent = "Ir al contenido principal";
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Verify color contrast (WCAG AA)
 */
export function getContrastRatio(rgb1: string, rgb2: string): number {
  const getLuminance = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)!.map((x) => {
      const val = parseInt(x) / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Respetar preferencias de movimiento reducido
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
