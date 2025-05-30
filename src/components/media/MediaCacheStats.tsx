import React from "react";
import { Trash2, RefreshCw, Database, TrendingUp } from "lucide-react";
import { useMediaCache } from "./MediaCacheProvider";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface MediaCacheStatsProps {
  className?: string;
}

export const MediaCacheStats: React.FC<MediaCacheStatsProps> = ({
  className,
}) => {
  const { stats, clearCache, refreshStats, formatSize } = useMediaCache();

  const maxCacheSize = 50 * 1024 * 1024; // 50MB
  const cacheUsagePercent = (stats.totalSize / maxCacheSize) * 100;
  const hitRatePercent = stats.hitRate * 100;

  const getHitRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCacheUsageColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Media Cache Statistics
            </CardTitle>
            <CardDescription>
              Performance metrics for media content caching
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshStats}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearCache}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cache
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cache Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cache Usage</span>
            <Badge variant="outline">
              {formatSize(stats.totalSize)} / {formatSize(maxCacheSize)}
            </Badge>
          </div>
          <Progress value={cacheUsagePercent} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{cacheUsagePercent.toFixed(1)}% used</span>
            <span>{stats.entryCount} entries</span>
          </div>
        </div>

        {/* Hit Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cache Hit Rate</span>
            <Badge
              variant="outline"
              className={getHitRateColor(hitRatePercent)}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {hitRatePercent.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={hitRatePercent} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{stats.totalHits} hits</span>
            <span>{stats.totalMisses} misses</span>
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalHits}
            </div>
            <div className="text-xs text-gray-500">Cache Hits</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.totalMisses}
            </div>
            <div className="text-xs text-gray-500">Cache Misses</div>
          </div>
        </div>

        {/* Cache Health Indicator */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <div className="text-sm font-medium">Cache Health</div>
            <div className="text-xs text-gray-500">
              {hitRatePercent >= 80
                ? "Excellent"
                : hitRatePercent >= 60
                ? "Good"
                : hitRatePercent >= 40
                ? "Fair"
                : "Poor"}
            </div>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              hitRatePercent >= 80
                ? "bg-green-500"
                : hitRatePercent >= 60
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />
        </div>

        {/* Performance Tips */}
        {hitRatePercent < 60 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Performance Tip
            </div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Low cache hit rate detected. Consider browsing media more
              systematically to improve caching efficiency.
            </div>
          </div>
        )}

        {cacheUsagePercent > 90 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="text-sm font-medium text-red-800 dark:text-red-200">
              Cache Nearly Full
            </div>
            <div className="text-xs text-red-700 dark:text-red-300 mt-1">
              Cache is {cacheUsagePercent.toFixed(1)}% full. Consider clearing
              cache to free up memory.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
