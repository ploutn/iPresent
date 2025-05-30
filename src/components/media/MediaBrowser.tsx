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
  Calendar,
  HardDrive,
  Move,
  Copy,
  Download,
  Star,
  Archive,
  Folder,
  Plus,
} from "lucide-react";
import { useMediaStore, MediaItem } from "../../stores/useMediaStore";
import { MediaThumbnail } from "./MediaThumbnail";
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
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { formatFileSize, formatDate } from "../../utils/formatters";

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
    moveToCategory,
    createCategory,
  } = useMediaStore();

  const [showFilters, setShowFilters] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sizeRange, setSizeRange] = useState([0, 100]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");

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

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return;

    switch (action) {
      case "delete":
        await handleDeleteSelected();
        break;
      case "move":
        // This would open a category selection dialog
        break;
      case "tag":
        // This would open a tag management dialog
        break;
      case "download":
        // This would trigger bulk download
        break;
      default:
        break;
    }
    setBulkAction("");
  };

  const handleDateRangeFilter = () => {
    if (dateRange.start && dateRange.end) {
      setFilter({
        dateRange: {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end),
        },
      });
    }
  };

  const handleSizeRangeFilter = () => {
    const minSize = sizeRange[0] * 1024 * 1024; // Convert MB to bytes
    const maxSize = sizeRange[1] * 1024 * 1024;
    setFilter({
      sizeRange: { min: minSize, max: maxSize },
    });
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createCategory({
        name: newCategoryName.trim(),
        description: `Category for ${newCategoryName.trim()}`,
      });
      setNewCategoryName("");
      setShowCategoryDialog(false);
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

  const selectAll = () => {
    setSelectedItems(filteredMedia.map((item) => item.id));
  };

  const getFilterSummary = () => {
    const filters = [];
    if (filterBy.type) filters.push(`Type: ${filterBy.type}`);
    if (filterBy.categoryId) {
      const category = categories.find((c) => c.id === filterBy.categoryId);
      filters.push(`Category: ${category?.name || "Unknown"}`);
    }
    if (filterBy.dateRange) filters.push("Date range");
    if (filterBy.sizeRange) filters.push("Size range");
    if (filterBy.tags?.length) filters.push(`Tags: ${filterBy.tags.length}`);
    return filters.join(", ");
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
            {Object.keys(filterBy).length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                {Object.keys(filterBy).length}
              </Badge>
            )}
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

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("move")}>
                  <Move className="h-4 w-4 mr-2" />
                  Move to Category
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("tag")}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tags
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("download")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {Object.keys(filterBy).length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Filter className="h-4 w-4" />
          <span>Active filters: {getFilterSummary()}</span>
          <Button variant="ghost" size="sm" onClick={clearFilter}>
            Clear all
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Type</Label>
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
                  <Label className="text-sm font-medium mb-2 block">
                    Category
                  </Label>
                  <div className="flex gap-1">
                    <Select
                      value={filterBy.categoryId || "all"}
                      onValueChange={(value) =>
                        setFilter({
                          categoryId: value === "all" ? undefined : value,
                        })
                      }
                    >
                      <SelectTrigger className="flex-1">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCategoryDialog(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
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

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t pt-4 space-y-4">
                  {/* Date Range Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Date Range
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDateRangeFilter}
                        disabled={!dateRange.start || !dateRange.end}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* File Size Range Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      File Size Range (MB): {sizeRange[0]} - {sizeRange[1]}
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Slider
                        value={sizeRange}
                        onValueChange={setSizeRange}
                        max={100}
                        min={0}
                        step={1}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSizeRangeFilter}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Actions */}
      {selectedItems.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedItems.length} item
                  {selectedItems.length > 1 ? "s" : ""} selected
                </span>
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All ({filteredMedia.length})
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      Actions
                      <MoreVertical className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction("move")}>
                      <Folder className="h-4 w-4 mr-2" />
                      Move to Category
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("tag")}>
                      <Tag className="h-4 w-4 mr-2" />
                      Add Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("download")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("delete")}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                        {media.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {media.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {media.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
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
                    <div className="flex items-center gap-3">
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
                        <div className="flex items-center justify-between">
                          <h4
                            className="text-sm font-medium truncate"
                            title={media.title}
                          >
                            {media.title}
                          </h4>
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
                                onClick={() => setPreviewItem(media)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Tag className="h-4 w-4 mr-2" />
                                Edit Tags
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
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>
                            {getTypeIcon(media.type)} {media.type}
                          </span>
                          <span>{formatFileSize(media.size)}</span>
                          <span>{formatDate(media.createdAt)}</span>
                          {media.duration && (
                            <span>
                              {Math.floor(media.duration / 60)}:
                              {(media.duration % 60)
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          )}
                        </div>
                        {media.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
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
          onClose={() => setPreviewItem(null)}
          onDelete={(id) => {
            deleteMedia([id]);
            setPreviewItem(null);
          }}
          onUpdate={(id, updates) => {
            updateMediaItem(id, updates);
          }}
        />
      )}

      {/* Create Category Dialog */}
      {showCategoryDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Create New Category
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCategoryDialog(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCategory}
                    disabled={!newCategoryName.trim()}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
