import { useState, useCallback } from 'react';
import { EditSongFormData } from '../../types/song';

export const useEditSong = () => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddSongOpen, setIsAddSongOpen] = useState(false);
    const [currentEditSong, setCurrentEditSong] = useState<EditSongFormData>({
        title: '',
        artist: '',
        ccli: '',
        key: 'C',
        tempo: 'Medium',
        tags: [],
        favorite: false
    });
    const [newTag, setNewTag] = useState('');

    const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTag.trim()) {
            setCurrentEditSong(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    }, [newTag]);

    const removeTag = useCallback((tagToRemove: string) => {
        setCurrentEditSong(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    }, []);

    return {
        isEditDialogOpen,
        setIsEditDialogOpen,
        isAddSongOpen,
        setIsAddSongOpen,
        currentEditSong,
        setCurrentEditSong,
        newTag,
        setNewTag,
        handleAddTag,
        removeTag,
    };
};
