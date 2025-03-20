//src/types/global.d.ts
import { ContentItem } from '.'; // Import

interface Window {
    electronAPI: {
        openPresentationWindow: () => void;
        setPresentationData: (data: ContentItem | null) => void; // Use ContentItem
        setBackgroundColor: (color: string) => void;
        setBackgroundImage: (image: string) => void;
        onPresentationData: (callback: (data: any) => void) => void;
        onBackgroundColor: (callback: (color: string) => void) => void;
        onBackgroundImageSet: (callback: (image: string) => void) => void;
        removeListener: (channel: string, callback: (data: any) => void) => void;
    };
}