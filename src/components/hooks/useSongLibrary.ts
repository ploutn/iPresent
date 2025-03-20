import { useState, useCallback } from 'react';
import { Song, EditSongFormData } from '../../types/song';

export const useSongLibrary = () => {
    const [songs, setSongs] = useState<Song[]>([
        {
            id: '1',
            title: 'Amazing Grace',
            artist: 'John Newton',
            ccli: '1234567',
            key: 'G',
            tempo: 'Medium',
            tags: ['Hymn', 'Worship'],
            favorite: true,
            content: 'Amazing Grace, how sweet the sound',
        },
        // ... other initial songs
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleToggleFavorite = useCallback((id: string) => {
        setSongs(prevSongs =>
            prevSongs.map(song =>
                song.id === id ? { ...song, favorite: !song.favorite } : song
            )
        );
    }, []);

    const handleDeleteSong = useCallback((id: string) => {
        setSongs(prevSongs => prevSongs.filter(s => s.id !== id));
    }, []);

    const handleSaveSong = useCallback((song: string) => {
        // Parse the first line which should be in format: "3. Song Title"
        const firstLine = song.split('\n')[0].trim();
        
        // Extract number and title using regex
        const match = firstLine.match(/^(\d+)\s*\.\s*(.+)$/);
        
        let title = firstLine;
        let number = "";
        
        if (match) {
            number = match[1];
            title = match[2].trim();
        }
        
        const newSong: Song = {
            title: title,
            artist: "",
            ccli: number, // Store the song number in the ccli field
            key: "C",
            tempo: "Medium",
            tags: [],
            favorite: false,
            id: String(songs.length + 1),
            content: song,
        };
        setSongs(prevSongs => [...prevSongs, newSong]);
        return newSong;
    }, [songs]);

    const handleEditSongSave = useCallback((editedSong: EditSongFormData) => {
        setSongs(prevSongs => {
            if (editedSong.id) {
                return prevSongs.map(song =>
                    song.id === editedSong.id ? { ...editedSong as Song } : song
                );
            } else {
                const newSong: Song = {
                    ...editedSong,
                    id: String(prevSongs.length + 1),
                    content: ""
                };
                return [newSong, ...prevSongs];
            }
        });
    }, []);

    return {
        songs: filteredSongs,
        searchQuery,
        setSearchQuery,
        handleToggleFavorite,
        handleDeleteSong,
        handleSaveSong,
        handleEditSongSave,
    };
};
