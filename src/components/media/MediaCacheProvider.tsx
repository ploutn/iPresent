import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { mediaCache } from "../../utils/mediaCache";

interface CacheStats {
  totalSize: number;
  entryCount: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
}

interface MediaCacheContextType {
  stats: CacheStats;
  clearCache: () => void;
  refreshStats: () => void;
  formatSize: (bytes: number) => string;
}

const MediaCacheContext = createContext<MediaCacheContextType | undefined>(
  undefined
);

interface MediaCacheProviderProps {
  children: ReactNode;
}

export const MediaCacheProvider: React.FC<MediaCacheProviderProps> = ({
  children,
}) => {
  const [stats, setStats] = useState<CacheStats>({
    totalSize: 0,
    entryCount: 0,
    hitRate: 0,
    totalHits: 0,
    totalMisses: 0,
  });

  const refreshStats = () => {
    setStats(mediaCache.getStats());
  };

  const clearCache = () => {
    mediaCache.clear();
    refreshStats();
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    // Refresh stats periodically
    const interval = setInterval(refreshStats, 5000); // Every 5 seconds
    refreshStats(); // Initial load

    return () => clearInterval(interval);
  }, []);

  const value: MediaCacheContextType = {
    stats,
    clearCache,
    refreshStats,
    formatSize,
  };

  return (
    <MediaCacheContext.Provider value={value}>
      {children}
    </MediaCacheContext.Provider>
  );
};

export const useMediaCache = (): MediaCacheContextType => {
  const context = useContext(MediaCacheContext);
  if (context === undefined) {
    throw new Error("useMediaCache must be used within a MediaCacheProvider");
  }
  return context;
};
