export interface ScheduleItem {
    id: string;
    contentId: string; // ID of the content item (song, announcement, etc.)
    contentType: 'song' | 'announcement' | 'image' | 'video'; // Type of content
    startTime: Date;
    endTime?: Date; // Optional end time
  }