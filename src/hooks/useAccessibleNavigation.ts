import { useEffect, useRef, useState, useCallback } from "react";
import {
  KeyboardNavigation,
  announceToScreenReader,
  AriaUtils,
} from "../utils/accessibility";

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: NavigationItem[];
}

interface UseAccessibleNavigationOptions {
  items: NavigationItem[];
  orientation?: "horizontal" | "vertical";
  loop?: boolean;
  autoFocus?: boolean;
  announceChanges?: boolean;
}

export function useAccessibleNavigation({
  items,
  orientation = "vertical",
  loop = true,
  autoFocus = false,
  announceChanges = true,
}: UseAccessibleNavigationOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Generate unique IDs for ARIA relationships
  const navigationId = useRef(AriaUtils.generateId("nav"));
  const listboxId = useRef(AriaUtils.generateId("listbox"));

  // Get enabled items only
  const enabledItems = items.filter((item) => !item.disabled);
  const enabledIndices = items
    .map((item, index) => (item.disabled ? -1 : index))
    .filter((i) => i !== -1);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isKeyboardNavActive) return;

      const currentEnabledIndex = enabledIndices.indexOf(currentIndex);
      let newEnabledIndex = currentEnabledIndex;

      if (orientation === "vertical") {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            newEnabledIndex = loop
              ? (currentEnabledIndex + 1) % enabledIndices.length
              : Math.min(currentEnabledIndex + 1, enabledIndices.length - 1);
            break;
          case "ArrowUp":
            event.preventDefault();
            newEnabledIndex = loop
              ? currentEnabledIndex === 0
                ? enabledIndices.length - 1
                : currentEnabledIndex - 1
              : Math.max(currentEnabledIndex - 1, 0);
            break;
        }
      } else {
        switch (event.key) {
          case "ArrowRight":
            event.preventDefault();
            newEnabledIndex = loop
              ? (currentEnabledIndex + 1) % enabledIndices.length
              : Math.min(currentEnabledIndex + 1, enabledIndices.length - 1);
            break;
          case "ArrowLeft":
            event.preventDefault();
            newEnabledIndex = loop
              ? currentEnabledIndex === 0
                ? enabledIndices.length - 1
                : currentEnabledIndex - 1
              : Math.max(currentEnabledIndex - 1, 0);
            break;
        }
      }

      // Handle Home/End keys
      switch (event.key) {
        case "Home":
          event.preventDefault();
          newEnabledIndex = 0;
          break;
        case "End":
          event.preventDefault();
          newEnabledIndex = enabledIndices.length - 1;
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          const currentItem = items[currentIndex];
          if (currentItem?.onClick) {
            currentItem.onClick();
          }
          break;
        case "Escape":
          setIsKeyboardNavActive(false);
          break;
      }

      if (newEnabledIndex !== currentEnabledIndex) {
        const newIndex = enabledIndices[newEnabledIndex];
        setCurrentIndex(newIndex);

        // Focus the new item
        const newItem = itemRefs.current[newIndex];
        if (newItem) {
          newItem.focus();

          // Announce the change to screen readers
          if (announceChanges) {
            const item = items[newIndex];
            announceToScreenReader(
              `${item.label}, ${newIndex + 1} of ${items.length}`
            );
          }
        }
      }
    },
    [
      currentIndex,
      enabledIndices,
      isKeyboardNavActive,
      items,
      loop,
      orientation,
      announceChanges,
    ]
  );

  // Handle mouse interactions
  const handleMouseEnter = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsKeyboardNavActive(false);
  }, []);

  const handleFocus = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsKeyboardNavActive(true);
  }, []);

  const handleClick = useCallback(
    (item: NavigationItem) => {
      if (item.disabled) return;

      if (item.onClick) {
        item.onClick();
      }

      if (announceChanges) {
        announceToScreenReader(`${item.label} selected`);
      }
    },
    [announceChanges]
  );

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Auto focus first item if requested
  useEffect(() => {
    if (autoFocus && enabledIndices.length > 0) {
      const firstEnabledIndex = enabledIndices[0];
      const firstItem = itemRefs.current[firstEnabledIndex];
      if (firstItem) {
        firstItem.focus();
        setCurrentIndex(firstEnabledIndex);
        setIsKeyboardNavActive(true);
      }
    }
  }, [autoFocus, enabledIndices]);

  // Helper function to get item props
  const getItemProps = useCallback(
    (item: NavigationItem, index: number) => {
      const isSelected = index === currentIndex;
      const isEnabled = !item.disabled;

      return {
        ref: (el: HTMLElement | null) => {
          itemRefs.current[index] = el;
        },
        id: `${navigationId.current}-item-${index}`,
        role: "menuitem",
        tabIndex: isSelected && isEnabled ? 0 : -1,
        "aria-selected": isSelected,
        "aria-disabled": item.disabled,
        "aria-label": AriaUtils.createLabel(
          item.label,
          `Navigation item ${index + 1} of ${items.length}`
        ),
        onMouseEnter: () => handleMouseEnter(index),
        onFocus: () => handleFocus(index),
        onClick: () => handleClick(item),
        className: `nav-item ${isSelected ? "selected" : ""} ${
          item.disabled ? "disabled" : ""
        }`,
        "data-keyboard-nav": isKeyboardNavActive,
      };
    },
    [
      currentIndex,
      handleClick,
      handleFocus,
      handleMouseEnter,
      isKeyboardNavActive,
      items.length,
      navigationId,
    ]
  );

  // Helper function to get container props
  const getContainerProps = useCallback(() => {
    return {
      ref: containerRef,
      id: navigationId.current,
      role: "menu",
      "aria-orientation": orientation,
      "aria-activedescendant": `${navigationId.current}-item-${currentIndex}`,
      "aria-label": "Navigation menu",
      className: `navigation-container ${
        isKeyboardNavActive ? "keyboard-nav-active" : ""
      }`,
      tabIndex: -1,
    };
  }, [currentIndex, isKeyboardNavActive, navigationId, orientation]);

  return {
    currentIndex,
    isKeyboardNavActive,
    getItemProps,
    getContainerProps,
    setCurrentIndex,
    focusItem: (index: number) => {
      if (index >= 0 && index < items.length && !items[index].disabled) {
        setCurrentIndex(index);
        const item = itemRefs.current[index];
        if (item) {
          item.focus();
          setIsKeyboardNavActive(true);
        }
      }
    },
    announceCurrentItem: () => {
      const item = items[currentIndex];
      if (item) {
        announceToScreenReader(`Current item: ${item.label}`);
      }
    },
  };
}

// Hook for breadcrumb navigation
export function useAccessibleBreadcrumb(items: NavigationItem[]) {
  const breadcrumbId = useRef(AriaUtils.generateId("breadcrumb"));

  const getBreadcrumbProps = useCallback(() => {
    return {
      id: breadcrumbId.current,
      role: "navigation",
      "aria-label": "Breadcrumb",
      className: "nav-breadcrumb",
    };
  }, []);

  const getBreadcrumbItemProps = useCallback(
    (item: NavigationItem, index: number, isLast: boolean) => {
      return {
        key: item.id,
        "aria-current": isLast ? "page" : undefined,
        className: `breadcrumb-item ${isLast ? "current" : ""}`,
        // Return render function instead of JSX
        renderContent: () => {
          if (isLast) {
            return {
              type: "span",
              props: {
                children: item.label,
              },
            };
          } else {
            return {
              type: "a",
              props: {
                href: item.href,
                onClick: item.onClick,
                className: "breadcrumb-link",
                "aria-label": `Go to ${item.label}`,
                children: item.label,
              },
            };
          }
        },
      };
    },
    []
  );

  return {
    getBreadcrumbProps,
    getBreadcrumbItemProps,
  };
}

// Hook for tab navigation
export function useAccessibleTabs(tabs: NavigationItem[], defaultTab?: string) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const tablistId = useRef(AriaUtils.generateId("tablist"));
  const tabpanelId = useRef(AriaUtils.generateId("tabpanel"));

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      const tab = tabs.find((t) => t.id === tabId);
      if (tab && tab.onClick) {
        tab.onClick();
      }
      announceToScreenReader(`${tab?.label} tab selected`);
    },
    [tabs]
  );

  const getTabListProps = useCallback(() => {
    return {
      id: tablistId.current,
      role: "tablist",
      "aria-label": "Tab navigation",
      className: "tab-list",
    };
  }, []);

  const getTabProps = useCallback(
    (tab: NavigationItem) => {
      const isSelected = tab.id === activeTab;

      return {
        id: `tab-${tab.id}`,
        role: "tab",
        tabIndex: isSelected ? 0 : -1,
        "aria-selected": isSelected,
        "aria-controls": `${tabpanelId.current}-${tab.id}`,
        "aria-disabled": tab.disabled,
        onClick: () => !tab.disabled && handleTabChange(tab.id),
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            !tab.disabled && handleTabChange(tab.id);
          }
        },
        className: `tab ${isSelected ? "active" : ""} ${
          tab.disabled ? "disabled" : ""
        }`,
        "aria-label": AriaUtils.createLabel(tab.label, "Tab"),
      };
    },
    [activeTab, handleTabChange, tabpanelId]
  );

  const getTabPanelProps = useCallback(
    (tab: NavigationItem) => {
      const isSelected = tab.id === activeTab;

      return {
        id: `${tabpanelId.current}-${tab.id}`,
        role: "tabpanel",
        tabIndex: 0,
        "aria-labelledby": `tab-${tab.id}`,
        hidden: !isSelected,
        className: `tab-panel ${isSelected ? "active" : ""}`,
        "aria-label": `${tab.label} panel`,
      };
    },
    [activeTab, tabpanelId]
  );

  return {
    activeTab,
    setActiveTab: handleTabChange,
    getTabListProps,
    getTabProps,
    getTabPanelProps,
  };
}
