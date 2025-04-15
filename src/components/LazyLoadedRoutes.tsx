import React from "react";
import { lazyLoad } from "../utils/performance";
import { ErrorBoundary } from "./ErrorBoundary";

// Lazy load main page components
const HomePage = lazyLoad(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage }))
);
const SettingsPage = lazyLoad(() =>
  import("./pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  }))
);
const MediaPage = lazyLoad(() =>
  import("./pages/MediaPage").then((module) => ({ default: module.MediaPage }))
);

// Define route configuration with error boundaries
export const routes = {
  home: {
    path: "/",
    element: (
      <ErrorBoundary>
        <HomePage />
      </ErrorBoundary>
    ),
  },
  settings: {
    path: "/settings",
    element: (
      <ErrorBoundary>
        <SettingsPage />
      </ErrorBoundary>
    ),
  },
  media: {
    path: "/media",
    element: (
      <ErrorBoundary>
        <MediaPage />
      </ErrorBoundary>
    ),
  },
};

/**
 * LazyLoadedRoutes component
 * This component provides a centralized way to manage lazy-loaded routes
 * with proper error boundaries and suspense fallbacks
 */
export function LazyLoadedRoutes({ currentRoute }: { currentRoute: string }) {
  // Find the matching route or default to home
  const route =
    Object.values(routes).find((r) => r.path === currentRoute) || routes.home;

  return route.element;
}
