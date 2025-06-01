import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeVariant =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red";
export type ThemeSize = "compact" | "default" | "comfortable";

export interface ThemeConfig {
  mode: ThemeMode;
  variant: ThemeVariant;
  size: ThemeSize;
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  animations: boolean;
  reducedMotion: boolean;
}

interface ThemeContextType {
  config: ThemeConfig;
  setMode: (mode: ThemeMode) => void;
  setVariant: (variant: ThemeVariant) => void;
  setSize: (size: ThemeSize) => void;
  setCustomColors: (colors: ThemeConfig["customColors"]) => void;
  toggleAnimations: () => void;
  toggleReducedMotion: () => void;
  resetTheme: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => boolean;
}

const defaultThemeConfig: ThemeConfig = {
  mode: "system",
  variant: "default",
  size: "default",
  animations: true,
  reducedMotion: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "ipresent-theme-config";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultThemeConfig, ...parsed };
      }
    } catch (error) {
      console.warn("Failed to load theme config from localStorage:", error);
    }
    return defaultThemeConfig;
  });

  // Save config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn("Failed to save theme config to localStorage:", error);
    }
  }, [config]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove(
      "light",
      "dark",
      "theme-blue",
      "theme-green",
      "theme-purple",
      "theme-orange",
      "theme-red"
    );
    root.classList.remove("size-compact", "size-default", "size-comfortable");
    root.classList.remove("animations-disabled", "reduced-motion");

    // Apply mode
    if (config.mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(config.mode);
    }

    // Apply variant
    if (config.variant !== "default") {
      root.classList.add(`theme-${config.variant}`);
    }

    // Apply size
    root.classList.add(`size-${config.size}`);

    // Apply animation preferences
    if (!config.animations) {
      root.classList.add("animations-disabled");
    }
    if (config.reducedMotion) {
      root.classList.add("reduced-motion");
    }

    // Apply custom colors
    if (config.customColors) {
      if (config.customColors.primary) {
        root.style.setProperty("--primary-custom", config.customColors.primary);
      }
      if (config.customColors.secondary) {
        root.style.setProperty(
          "--secondary-custom",
          config.customColors.secondary
        );
      }
      if (config.customColors.accent) {
        root.style.setProperty("--accent-custom", config.customColors.accent);
      }
    }
  }, [config]);

  // Listen for system theme changes
  useEffect(() => {
    if (config.mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [config.mode]);

  const setMode = (mode: ThemeMode) => {
    setConfig((prev) => ({ ...prev, mode }));
  };

  const setVariant = (variant: ThemeVariant) => {
    setConfig((prev) => ({ ...prev, variant }));
  };

  const setSize = (size: ThemeSize) => {
    setConfig((prev) => ({ ...prev, size }));
  };

  const setCustomColors = (customColors: ThemeConfig["customColors"]) => {
    setConfig((prev) => ({ ...prev, customColors }));
  };

  const toggleAnimations = () => {
    setConfig((prev) => ({ ...prev, animations: !prev.animations }));
  };

  const toggleReducedMotion = () => {
    setConfig((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const resetTheme = () => {
    setConfig(defaultThemeConfig);
  };

  const exportTheme = () => {
    return JSON.stringify(config, null, 2);
  };

  const importTheme = (themeData: string): boolean => {
    try {
      const parsed = JSON.parse(themeData);
      // Validate the theme data
      if (typeof parsed === "object" && parsed !== null) {
        setConfig({ ...defaultThemeConfig, ...parsed });
        return true;
      }
    } catch (error) {
      console.warn("Failed to import theme:", error);
    }
    return false;
  };

  const value: ThemeContextType = {
    config,
    setMode,
    setVariant,
    setSize,
    setCustomColors,
    toggleAnimations,
    toggleReducedMotion,
    resetTheme,
    exportTheme,
    importTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Legacy compatibility hook
export function useThemeCompat() {
  const { config, setMode } = useTheme();
  return {
    theme: config.mode,
    setTheme: setMode,
  };
}
