import React, { useState } from "react";
import {
  Search,
  Grid,
  List,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  FolderOpen,
  Tag,
} from "lucide-react";
import { useMediaStore, MediaItem } from "../../stores/useMediaStore";
import { MediaThumbnail } from "./MediaThumbnail"; // Corrected import path
import { MediaPreview } from "./MediaPreview";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox"; // Corrected import path

interface MediaBrowserProps {
  onMediaSelect?: (media: MediaItem) => void;
  onMediaDoubleClick?: (media: MediaItem) => void;
  selectionMode?: boolean;
  className?: string;
}

export const MediaBrowser: React.FC<MediaBrowserProps> = ({
  onMediaSelect,
  onMediaDoubleClick,
  selectionMode = false,
  className = "",
}) => {
  const {
    getFilteredMedia,
    categories,
    viewMode,
    sortBy,
    sortOrder,
    filterBy,
    searchQuery,
    selectedItems,
    searchMedia,
    setFilter,
    clearFilter,
    setViewMode,
    setSortBy,
    setSelectedItems,
    toggleSelectedItem,
    clearSelection,
    deleteMedia,
    updateMediaItem,
  } = useMediaStore();

  const [showFilters, setShowFilters] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const filteredMedia = getFilteredMedia();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMediaClick = (media: MediaItem) => {
    if (selectionMode) {
      toggleSelectedItem(media.id);
    } else {
      onMediaSelect?.(media);
    }
  };

  const handleMediaDoubleClick = (media: MediaItem) => {
    if (!selectionMode) {
      onMediaDoubleClick?.(media);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length > 0) {
      await deleteMedia(selectedItems);
      clearSelection();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "audio":
        return "🎵";
      default:
        return "📄";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              searchMedia(e.target.value)
            }
            className="pl-10"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>

          {/* Sort */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [sort, order] = value.split("-") as [
                "name" | "date" | "size" | "type",
                "asc" | "desc"
              ];
              setSortBy(sort, order);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="date-desc">Newest</SelectItem>
              <SelectItem value="date-asc">Oldest</SelectItem>
              <SelectItem value="size-desc">Largest</SelectItem>
              <SelectItem value="size-asc">Smallest</SelectItem>
              <SelectItem value="type-asc">Type A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select
                  value={filterBy.type || "all"}
                  onValueChange={(value) =>
                    setFilter({
                      type:
                        value === "all"
                          ? undefined
                          : (value as "image" | "video" | "audio"),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category
                </label>
                <Select
                  value={filterBy.categoryId || "all"}
                  onValueChange={(value) =>
                    setFilter({
                      categoryId: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilter}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Actions */}
      {selectedItems.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
                selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No media found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || Object.keys(filterBy).length > 0
                ? "Try adjusting your search or filters"
                : "Upload some media files to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              : "space-y-2"
          }
        >
          {filteredMedia.map((media) => (
            <div key={media.id} className={viewMode === "grid" ? "" : "w-full"}>
              {viewMode === "grid" ? (
                /* Grid View */
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedItems.includes(media.id)
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  }`}
                  onClick={() => handleMediaClick(media)}
                  onDoubleClick={() => handleMediaDoubleClick(media)}
                >
                  <CardContent className="p-3">
                    <div className="relative">
                      {selectionMode && (
                        <Checkbox
                          checked={selectedItems.includes(media.id)}
                          className="absolute top-2 left-2 z-10 bg-white dark:bg-gray-800"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        />
                      )}

                      <MediaThumbnail
                        media={media}
                        className="w-full aspect-square object-cover rounded-md mb-2"
                        onPreview={() => setPreviewItem(media)}
                      />

                      <div className="space-y-1">
                        <h4
                          className="text-sm font-medium truncate"
                          title={media.title}
                        >
                          {media.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{getTypeIcon(media.type)}</span>
                          <span>{formatFileSize(media.size)}</span>
                        </div>
                        {media.duration && (
                          <div className="text-xs text-gray-500">
                            {formatDuration(media.duration)}
                          </div>
                        )}
                        {media.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {media.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs px-1 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {media.tags.length > 2 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1 py-0"
                              >
                                +{media.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* List View */
                <Card
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    selectedItems.includes(media.id)
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  }`}
                  onClick={() => handleMediaClick(media)}
                  onDoubleClick={() => handleMediaDoubleClick(media)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-4">
                      {selectionMode && (
                        <Checkbox
                          checked={selectedItems.includes(media.id)}
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        />
                      )}

                      <MediaThumbnail
                        media={media}
                        className="w-12 h-12 object-cover rounded flex-shrink-0"
                        onPreview={() => setPreviewItem(media)}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{media.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            {getTypeIcon(media.type)} {media.type}
                          </span>
                          <span>{formatFileSize(media.size)}</span>
                          {media.duration && (
                            <span>{formatDuration(media.duration)}</span>
                          )}
                          {media.dimensions && (
                            <span>
                              {media.dimensions.width}×{media.dimensions.height}
                            </span>
                          )}
                        </div>
                        {media.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {media.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        {media.createdAt.toLocaleDateString()}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) =>
                              e.stopPropagation()
                            }
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onMediaSelect?.(media)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleSelectedItem(media.id)}
                          >
                            <Tag className="h-4 w-4 mr-2" />
                            Add Tags
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteMedia([media.id])}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Media Preview Modal */}
      {previewItem && (
        <MediaPreview
          media={previewItem}
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          onDelete={(id) => {
            deleteMedia([id]);
            setPreviewItem(null);
          }}
        />
      )}
    </div>
  );
};
