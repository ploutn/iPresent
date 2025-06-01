import { useState, useEffect } from "react";

export interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  orientation: "portrait" | "landscape";
  breakpoint: "mobile" | "tablet" | "desktop" | "wide";
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
};

export function useResponsive(
  customBreakpoints?: Partial<BreakpointConfig>
): ResponsiveState {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };

  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === "undefined") {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        isWide: false,
        orientation: "landscape",
        breakpoint: "tablet",
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
      isDesktop: width >= breakpoints.desktop && width < breakpoints.wide,
      isWide: width >= breakpoints.wide,
      orientation: width > height ? "landscape" : "portrait",
      breakpoint:
        width < breakpoints.mobile
          ? "mobile"
          : width < breakpoints.desktop
          ? "tablet"
          : width < breakpoints.wide
          ? "desktop"
          : "wide",
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        width,
        height,
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
        isDesktop: width >= breakpoints.desktop && width < breakpoints.wide,
        isWide: width >= breakpoints.wide,
        orientation: width > height ? "landscape" : "portrait",
        breakpoint:
          width < breakpoints.mobile
            ? "mobile"
            : width < breakpoints.desktop
            ? "tablet"
            : width < breakpoints.wide
            ? "desktop"
            : "wide",
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoints]);

  return state;
}

// Utility hook for media queries
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// Predefined media query hooks
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () =>
  useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsWide = () => useMediaQuery("(min-width: 1536px)");
export const useIsTouchDevice = () =>
  useMediaQuery("(hover: none) and (pointer: coarse)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
