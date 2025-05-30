import React, { useState, useCallback } from "react";
import { X, Search, Grid, List, Check } from "lucide-react";
import { useMediaStore, MediaItem } from "../../stores/useMediaStore";
import { MediaThumbnail } from "./MediaThumbnail";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { formatFileSize } from "../../utils/formatters";

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  allowedTypes?: ("image" | "video" | "audio")[];
  title?: string;
  description?: string;
  multiSelect?: boolean;
  selectedMediaIds?: string[];
  onMultiSelect?: (media: MediaItem[]) => void;
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = ["image", "video", "audio"],
  title = "Select Media",
  description = "Choose media from your library",
  multiSelect = false,
  selectedMediaIds = [],
  onMultiSelect,
}) => {
  const {
    getFilteredMedia,
    categories,
    viewMode,
    searchQuery,
    searchMedia,
    setFilter,
    clearFilter,
    setViewMode,
  } = useMediaStore();

  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [localSelectedIds, setLocalSelectedIds] =
    useState<string[]>(selectedMediaIds);

  // Filter media based on allowed types and current filters
  const filteredMedia = getFilteredMedia().filter((item) =>
    allowedTypes.includes(item.type)
  );

  // Apply local search filter
  const searchFilteredMedia = localSearchQuery
    ? filteredMedia.filter(
        (item) =>
          item.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          item.filename
            .toLowerCase()
            .includes(localSearchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(localSearchQuery.toLowerCase())
          )
      )
    : filteredMedia;

  // Apply category filter
  const categoryFilteredMedia =
    selectedCategory === "all"
      ? searchFilteredMedia
      : searchFilteredMedia.filter(
          (item) => item.categoryId === selectedCategory
        );

  // Apply type filter
  const typeFilteredMedia =
    selectedType === "all"
      ? categoryFilteredMedia
      : categoryFilteredMedia.filter((item) => item.type === selectedType);

  const handleMediaClick = useCallback(
    (media: MediaItem) => {
      if (multiSelect) {
        const newSelectedIds = localSelectedIds.includes(media.id)
          ? localSelectedIds.filter((id) => id !== media.id)
          : [...localSelectedIds, media.id];
        setLocalSelectedIds(newSelectedIds);
      } else {
        onSelect(media);
        onClose();
      }
    },
    [multiSelect, localSelectedIds, onSelect, onClose]
  );

  const handleConfirmSelection = useCallback(() => {
    if (multiSelect && onMultiSelect) {
      const selectedMedia = typeFilteredMedia.filter((media) =>
        localSelectedIds.includes(media.id)
      );
      onMultiSelect(selectedMedia);
    }
    onClose();
  }, [
    multiSelect,
    onMultiSelect,
    typeFilteredMedia,
    localSelectedIds,
    onClose,
  ]);

  const handleClearSelection = useCallback(() => {
    setLocalSelectedIds([]);
  }, []);

  const renderMediaGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {typeFilteredMedia.map((media) => {
        const isSelected = multiSelect
          ? localSelectedIds.includes(media.id)
          : false;

        return (
          <Card
            key={media.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleMediaClick(media)}
          >
            <CardContent className="p-2">
              <div className="relative">
                <MediaThumbnail
                  media={media}
                  className="w-full h-24 object-cover rounded"
                />
                {multiSelect && isSelected && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                {media.type === "video" && media.duration && (
                  <Badge
                    variant="secondary"
                    className="absolute bottom-1 right-1 text-xs"
                  >
                    {Math.floor(media.duration / 60)}:
                    {String(Math.floor(media.duration % 60)).padStart(2, "0")}
                  </Badge>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium truncate" title={media.title}>
                  {media.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {formatFileSize(media.size)}
                </p>
                {media.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {media.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {media.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{media.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderMediaList = () => (
    <div className="space-y-2">
      {typeFilteredMedia.map((media) => {
        const isSelected = multiSelect
          ? localSelectedIds.includes(media.id)
          : false;

        return (
          <Card
            key={media.id}
            className={`cursor-pointer transition-all hover:shadow-sm ${
              isSelected ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleMediaClick(media)}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MediaThumbnail
                    media={media}
                    className="w-12 h-12 object-cover rounded"
                  />
                  {multiSelect && isSelected && (
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{media.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {media.filename}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {media.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(media.size)}
                    </span>
                    {media.type === "video" && media.duration && (
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(media.duration / 60)}:
                        {String(Math.floor(media.duration % 60)).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    )}
                  </div>
                </div>
                {media.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {media.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {media.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{media.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search media..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {allowedTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            </div>
          </div>

          {/* Selection Info */}
          {multiSelect && (
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <span className="text-sm">
                {localSelectedIds.length} item
                {localSelectedIds.length !== 1 ? "s" : ""} selected
              </span>
              {localSelectedIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Clear Selection
                </Button>
              )}
            </div>
          )}

          {/* Media Grid/List */}
          <ScrollArea className="flex-1">
            {typeFilteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-2">
                  No media found matching your criteria
                </div>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : viewMode === "grid" ? (
              renderMediaGrid()
            ) : (
              renderMediaList()
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {multiSelect && (
            <Button
              onClick={handleConfirmSelection}
              disabled={localSelectedIds.length === 0}
            >
              Select {localSelectedIds.length} Item
              {localSelectedIds.length !== 1 ? "s" : ""}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
