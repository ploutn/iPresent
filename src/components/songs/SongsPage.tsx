import React, { useEffect, useState } from "react";
import { Song, SongSlide, ContentItem } from "../../types/index";
import { loadAndParseSongs } from "../../utils/songDataParser";
import { useContentStore } from "../../stores/useContentStore";
import { useSongStore } from "../../store/songStore";
import { Button } from "../../components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { AddSongModal } from "./AddSongModal";
import { EditSongModal } from "./EditSongModal";
import { Toaster, toast } from "sonner";

const SongsPage: React.FC = () => {
  const songs = useSongStore((state) => state.songs);
  const storeAddSong = useSongStore((state) => state.addSong);
  const storeUpdateSong = useSongStore((state) => state.updateSong);
  const storeDeleteSong = useSongStore((state) => state.deleteSong);
  const importSongsToStore = useSongStore((state) => state.importSongs);
  const storeSongsLoaded = useSongStore((state) => state.songs.length > 0);

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [songToEdit, setSongToEdit] = useState<Song | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const setSelectedItem = useContentStore((state) => state.setSelectedItem);

  useEffect(() => {
    const fetchSongs = async () => {
      if (storeSongsLoaded) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const loadedSongs = await loadAndParseSongs();
        importSongsToStore(loadedSongs);
        setError(null);
      } catch (err) {
        console.error("Failed to load songs:", err);
        setError(
          "Failed to load songs. Please check the console for more details."
        );
        toast.error("Failed to load songs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [importSongsToStore, storeSongsLoaded]);

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
  };

  const handleBackToList = () => {
    setSelectedSong(null);
    setSelectedItem(null);
  };

  const handleSlideSelect = (slide: SongSlide, song: Song) => {
    const slideContentItem: ContentItem = {
      id: slide.id,
      title: `${song.title} - ${slide.label}`,
      type: "song",
      content: slide.content,
      lyrics: slide.content,
      author: song.author,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
    };
    setSelectedItem(slideContentItem);
  };

  const openAddSongModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddNewSongToList = (newSongData: Song) => {
    const { id, createdAt, updatedAt, ...songToAdd } = newSongData;
    storeAddSong(songToAdd as Song); // Ensure type compatibility if storeAddSong expects a more specific type
    toast.success(`Song "${newSongData.title}" added successfully!`);
  };

  const openEditSongModal = (song: Song) => {
    console.log("Opening edit modal for song:", song);
    setSongToEdit(song);
    setIsEditModalOpen(true);
  };

  const handleUpdateSongInList = (updatedSong: Song) => {
    storeUpdateSong(updatedSong.id, updatedSong);
    if (selectedSong?.id === updatedSong.id) {
      setSelectedSong(updatedSong);
    }
    toast.success(`Song "${updatedSong.title}" updated successfully!`);
  };

  const handleDeleteSong = (songId: string, songTitle: string) => {
    console.log("Delete song clicked, ID:", songId);
    if (window.confirm(`Are you sure you want to delete "${songTitle}"?`)) {
      storeDeleteSong(songId);
      if (selectedSong?.id === songId) {
        setSelectedSong(null);
        setSelectedItem(null);
      }
      toast.success(`Song "${songTitle}" deleted successfully!`);
    }
  };

  if (loading) {
    return <div className="p-4">Loading songs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <Toaster richColors position="top-center" />
      {selectedSong ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={handleBackToList} variant="outline">
              &larr; Back to Songs List
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditSongModal(selectedSong!)}
              >
                <Edit2 className="h-4 w-4 mr-2" /> Edit Song
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleDeleteSong(selectedSong!.id, selectedSong!.title)
                }
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Song
              </Button>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">{selectedSong!.title}</h1>
          <p className="text-md text-gray-700 mb-4">{selectedSong!.author}</p>
          <h2 className="text-xl font-semibold mb-3">Slides</h2>
          {selectedSong!.slides.length === 0 ? (
            <p>No slides available for this song.</p>
          ) : (
            <ul className="space-y-2">
              {selectedSong!.slides.map((slide) => (
                <li
                  key={slide.id}
                  className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSlideSelect(slide, selectedSong!)}
                >
                  <h3 className="text-md font-semibold">{slide.label}</h3>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-2 rounded mt-1">
                    {slide.content}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Songs</h1>
            <Button onClick={openAddSongModal} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Song
            </Button>
          </div>
          {songs.length === 0 ? (
            <p>No songs found. Click "Add Song" to create one.</p>
          ) : (
            <ul className="space-y-3">
              {songs.map((song) => (
                <li
                  key={song.id}
                  className="p-3 border rounded hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="cursor-pointer flex-grow"
                      onClick={() => handleSongSelect(song)}
                    >
                      <h2 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                        {song.title}
                      </h2>
                      <p className="text-sm text-gray-600">{song.author}</p>
                      <p className="text-xs text-gray-500">
                        {song.slides.length} slides
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditSongModal(song);
                        }}
                        title="Edit Song"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSong(song.id, song.title);
                        }}
                        title="Delete Song"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSong={handleAddNewSongToList}
      />
      {isEditModalOpen && songToEdit && (
        <EditSongModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSongToEdit(null);
          }}
          onEditSong={handleUpdateSongInList}
          songToEdit={songToEdit} // No longer needs '!' if modal is conditionally rendered
        />
      )}
    </div>
  );
};

export default SongsPage;
