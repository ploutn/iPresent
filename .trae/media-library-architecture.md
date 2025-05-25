# Media Library Architecture Design

## Current State Analysis

### Existing Components

- `MediaLibrary.tsx` - Basic media display component
- `MediaPage.tsx` - UI shell with placeholder content
- `useContentStore.ts` - General content storage with basic media support
- `Media` interface in types - Basic media type definition
- `VideoItem` interface - Simple video item structure

### Current Limitations

1. **No File Upload System**: No mechanism to import local media files
2. **Limited Storage**: Media items stored in general content store without specialized handling
3. **No File Management**: No organization, categorization, or metadata management
4. **Basic Preview**: Rudimentary preview functionality
5. **No Validation**: No file type or size validation
6. **No Thumbnails**: No automatic thumbnail generation
7. **No Local Storage**: No proper local file storage system

## Proposed Architecture

### 1. Media Store (`useMediaStore.ts`)

```typescript
interface MediaStore {
  // State
  mediaItems: MediaItem[];
  categories: MediaCategory[];
  uploadProgress: UploadProgress[];
  selectedItems: string[];
  viewMode: "grid" | "list";
  sortBy: "name" | "date" | "size" | "type";
  filterBy: MediaFilter;

  // Actions
  uploadMedia: (files: FileList) => Promise<void>;
  deleteMedia: (ids: string[]) => Promise<void>;
  updateMediaMetadata: (id: string, metadata: Partial<MediaMetadata>) => void;
  createCategory: (category: MediaCategory) => void;
  moveToCategory: (mediaIds: string[], categoryId: string) => void;
  generateThumbnail: (mediaId: string) => Promise<string>;
  searchMedia: (query: string) => MediaItem[];
  getMediaByCategory: (categoryId: string) => MediaItem[];
}
```

### 2. Enhanced Media Types

```typescript
interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  title: string;
  description?: string;
  type: "image" | "video" | "audio";
  mimeType: string;
  size: number;
  duration?: number; // for video/audio
  dimensions?: { width: number; height: number }; // for images/videos
  url: string; // local file path or URL
  thumbnailUrl?: string;
  metadata: MediaMetadata;
  categoryId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MediaMetadata {
  fileSize: number;
  resolution?: string;
  bitrate?: number;
  codec?: string;
  colorSpace?: string;
  exifData?: Record<string, any>;
}

interface MediaCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  parentId?: string;
  createdAt: Date;
}
```

### 3. File Storage System

- **Local Storage**: Use Electron's file system APIs to store media files
- **Directory Structure**:
  ```
  ~/iPresent/media/
  ├── images/
  ├── videos/
  ├── audio/
  └── thumbnails/
  ```
- **File Naming**: UUID-based naming to avoid conflicts
- **Metadata Storage**: JSON files alongside media files

### 4. Upload System Components

#### `MediaUploader.tsx`

- Drag-and-drop interface
- File validation (type, size, format)
- Progress tracking
- Batch upload support
- Error handling and retry logic

#### `MediaValidator.ts`

- File type validation
- Size limits enforcement
- Format compatibility checks
- Security scanning (basic)

### 5. Media Browser Components

#### `MediaBrowser.tsx`

- Grid/list view toggle
- Search and filtering
- Category navigation
- Bulk selection
- Context menu actions

#### `MediaPreview.tsx`

- Full-screen preview
- Metadata display
- Playback controls for video/audio
- Zoom and pan for images

#### `MediaThumbnail.tsx`

- Lazy loading
- Hover effects
- Selection indicators
- Type-specific icons

### 6. Integration Points

#### With Presentations

- Drag media into slides
- Media picker dialog
- Background image selection
- Video/audio embedding

#### With Content Store

- Media items as content items
- Scheduling media playback
- Live queue integration

### 7. Performance Optimizations

- **Lazy Loading**: Load thumbnails and metadata on demand
- **Virtual Scrolling**: Handle large media libraries efficiently
- **Caching**: Cache thumbnails and metadata
- **Background Processing**: Generate thumbnails in background

### 8. Security Considerations

- File type validation
- Size limits
- Sanitize file names
- Prevent path traversal attacks
- Virus scanning integration (future)

## Implementation Phases

### Phase 1: Core Infrastructure

1. Create `useMediaStore.ts` with basic CRUD operations
2. Implement file storage system
3. Create enhanced media types
4. Basic upload functionality

### Phase 2: Upload System

1. `MediaUploader` component with drag-and-drop
2. File validation and error handling
3. Progress tracking
4. Thumbnail generation

### Phase 3: Browser and Preview

1. `MediaBrowser` with grid/list views
2. Search and filtering
3. `MediaPreview` component
4. Category management

### Phase 4: Integration

1. Presentation integration
2. Content store integration
3. Performance optimizations
4. Polish and testing

## Success Criteria

- Users can upload images, videos, and audio files
- Media files are stored locally with proper organization
- Thumbnails are automatically generated
- Search and filtering work efficiently
- Media can be easily integrated into presentations
- Performance remains smooth with large media libraries
- File validation prevents invalid uploads
