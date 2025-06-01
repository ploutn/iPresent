/**
 * Accessibility utilities for iPresent application
 * Provides comprehensive accessibility features including:
 * - Screen reader announcements
 * - Keyboard navigation helpers
 * - Focus management
 * - ARIA utilities
 */

// Screen reader announcement utility
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  static saveFocus() {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  static restoreFocus() {
    const lastFocused = this.focusStack.pop();
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
  }

  static trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }
}

// Keyboard navigation helpers
export const KeyboardNavigation = {
  // Handle arrow key navigation in lists
  handleArrowNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case "ArrowUp":
        event.preventDefault();
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    onIndexChange(newIndex);
    items[newIndex]?.focus();
  },

  // Handle grid navigation (2D)
  handleGridNavigation: (
    event: KeyboardEvent,
    gridItems: HTMLElement[][],
    currentRow: number,
    currentCol: number,
    onPositionChange: (row: number, col: number) => void
  ) => {
    let newRow = currentRow;
    let newCol = currentCol;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        newRow = Math.min(currentRow + 1, gridItems.length - 1);
        newCol = Math.min(currentCol, gridItems[newRow].length - 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        newRow = Math.max(currentRow - 1, 0);
        newCol = Math.min(currentCol, gridItems[newRow].length - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentCol < gridItems[currentRow].length - 1) {
          newCol = currentCol + 1;
        } else if (currentRow < gridItems.length - 1) {
          newRow = currentRow + 1;
          newCol = 0;
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentCol > 0) {
          newCol = currentCol - 1;
        } else if (currentRow > 0) {
          newRow = currentRow - 1;
          newCol = gridItems[newRow].length - 1;
        }
        break;
      default:
        return;
    }

    onPositionChange(newRow, newCol);
    gridItems[newRow]?.[newCol]?.focus();
  },
};

// ARIA utilities
export const AriaUtils = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = "aria") => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create ARIA label from content
  createLabel: (content: string, context?: string) => {
    const cleanContent = content.replace(/[\n\r\t]/g, " ").trim();
    return context ? `${context}: ${cleanContent}` : cleanContent;
  },

  // Get role-appropriate announcement
  getRoleAnnouncement: (role: string, action?: string) => {
    const roleMap: Record<string, string> = {
      button: "button",
      link: "link",
      tab: "tab",
      menuitem: "menu item",
      option: "option",
      checkbox: "checkbox",
      radio: "radio button",
      slider: "slider",
      switch: "switch",
    };

    const roleText = roleMap[role] || role;
    return action ? `${roleText}, ${action}` : roleText;
  },
};

// Reduced motion detection
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// High contrast detection
export function prefersHighContrast(): boolean {
  return window.matchMedia("(prefers-contrast: high)").matches;
}

// Color scheme detection
export function getPreferredColorScheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Skip link utility
export function createSkipLink(
  targetId: string,
  text: string = "Skip to main content"
) {
  const skipLink = document.createElement("a");
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = "skip-link";
  skipLink.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });

  return skipLink;
}

// Accessibility testing utilities
export const A11yTesting = {
  // Check for missing alt text
  checkImages: () => {
    const images = document.querySelectorAll("img");
    const issues: string[] = [];

    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute("aria-hidden")) {
        issues.push(`Image ${index + 1} missing alt text`);
      }
    });

    return issues;
  },

  // Check for proper heading hierarchy
  checkHeadings: () => {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const issues: string[] = [];
    let lastLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (index === 0 && level !== 1) {
        issues.push("First heading should be h1");
      } else if (level > lastLevel + 1) {
        issues.push(`Heading level skipped: ${heading.textContent}`);
      }
      lastLevel = level;
    });

    return issues;
  },

  // Check for keyboard accessibility
  checkKeyboardAccess: () => {
    const interactive = document.querySelectorAll(
      "button, a, input, select, textarea, [tabindex]"
    );
    const issues: string[] = [];

    interactive.forEach((element, index) => {
      const tabIndex = element.getAttribute("tabindex");
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push(`Element ${index + 1} has positive tabindex`);
      }

      if (element.tagName === "A" && !element.getAttribute("href")) {
        issues.push(`Link ${index + 1} missing href attribute`);
      }
    });

    return issues;
  },
};
