export interface Song {
    id: string;
    title: string;
    artist: string;
    ccli: string;
    key: string;
    tempo: string;
    tags: string[];
    favorite: boolean;
    content?: string;
}

export interface EditSongFormData {
    id?: string;
    title: string;
    artist: string;
    ccli: string;
    key: string;
    tempo: string;
    tags: string[];
    favorite: boolean;
}