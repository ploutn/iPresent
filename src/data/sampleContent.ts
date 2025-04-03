// src/data/sampleContent.ts
import { ContentItem, Song, Media, Announcement } from "../types";
import { v4 as uuidv4 } from "uuid";

// Sample song
export const sampleSong: Song = {
  id: uuidv4(),
  title: "Amazing Grace",
  type: "song",
  content: "",
  lyrics: `Amazing grace, how sweet the sound\nThat saved a wretch like me.\nI once was lost, but now I'm found.\nWas blind, but now I see.\n\n'Twas grace that taught my heart to fear,\nAnd grace my fears relieved.\nHow precious did that grace appear,\nThe hour I first believed.`,
  author: "John Newton",
  ccliNumber: "1234567",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Sample announcement
export const sampleAnnouncement: Announcement = {
  id: uuidv4(),
  title: "Church Picnic",
  type: "announcement",
  content:
    "Join us for our annual church picnic this Sunday after the service. Bring a dish to share and your favorite outdoor games!",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Sample image
export const sampleImage: Media = {
  id: uuidv4(),
  title: "Welcome Slide",
  type: "image",
  content: "",
  url: "https://images.unsplash.com/photo-1493934558420-a9347f2eab1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  thumbnail:
    "https://images.unsplash.com/photo-1493934558420-a9347f2eab1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Sample video
export const sampleVideo: Media = {
  id: uuidv4(),
  title: "Worship Video",
  type: "video",
  content: "",
  url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  thumbnail: "https://sample-videos.com/img/Sample-jpg-image-50kb.jpg",
  duration: 120,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Export all samples as an array
export const sampleContentItems: ContentItem[] = [
  sampleSong,
  sampleAnnouncement,
  sampleImage,
  sampleVideo,
];
