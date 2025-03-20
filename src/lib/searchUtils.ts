
// src/lib/searchUtils.ts
import { ContentItem, Song, Media } from '../types';

export function searchContent(query: string, items: ContentItem[]): ContentItem[] {
  const searchTerm = query.toLowerCase();

  return items.filter(item => {
    // Common fields
    const titleMatch = item.title.toLowerCase().includes(searchTerm);
    const contentMatch = item.content.toLowerCase().includes(searchTerm);

    // Type-specific fields
    if (item.type === 'song') {
      const songItem = item as Song;
      return (
        titleMatch ||
        contentMatch ||
        songItem.lyrics.toLowerCase().includes(searchTerm) ||
        songItem.author.toLowerCase().includes(searchTerm) ||
        (songItem.ccliNumber?.toLowerCase().includes(searchTerm) || false)
      );
    }

    if (item.type === 'image' || item.type === 'video') {
      const mediaItem = item as Media;
      return (
        titleMatch ||
        contentMatch ||
        mediaItem.url.toLowerCase().includes(searchTerm)
      );
    }

    // Default search for announcements and other types
    return titleMatch || contentMatch;
  });
}