import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SongsPage from "./SongsPage";
import { useSongStore } from "../../store/songStore";
import { useContentStore } from "../../stores/useContentStore";
import { Song } from "../../types";

// Mock the stores
vi.mock("../../store/songStore");
vi.mock("../../stores/useContentStore");
vi.mock("../../utils/songDataParser", () => ({
  loadAndParseSongs: vi.fn(),
}));

const mockSongs: Song[] = [
  {
    id: "1",
    title: "Song 1",
    author: "Author 1",
    type: "song",
    content: "Lyrics 1",
    slides: [
      { id: "s1-1", type: "verse", label: "Verse 1", content: "Lyrics 1" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Song 2",
    author: "Author 2",
    type: "song",
    content: "Lyrics 2",
    slides: [
      { id: "s2-1", type: "verse", label: "Verse 1", content: "Lyrics 2" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("SongsPage", () => {
  let mockAddSong: ReturnType<typeof vi.fn>;
  let mockUpdateSong: ReturnType<typeof vi.fn>;
  let mockDeleteSong: ReturnType<typeof vi.fn>;
  let mockImportSongs: ReturnType<typeof vi.fn>;
  let mockSetSelectedItem: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAddSong = vi.fn();
    mockUpdateSong = vi.fn();
    mockDeleteSong = vi.fn();
    mockImportSongs = vi.fn();
    mockSetSelectedItem = vi.fn();

    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      songs: [], // Start with no songs, will be populated by importSongs or actions
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: mockImportSongs,
    });

    (useContentStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setSelectedItem: mockSetSelectedItem,
    });

    // Mock loadAndParseSongs to resolve with mockSongs
    const { loadAndParseSongs } = require("../../utils/songDataParser");
    loadAndParseSongs.mockResolvedValue(mockSongs);
  });

  it("renders loading state initially and then displays songs", async () => {
    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      songs: [],
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: (songsToImport: Song[]) => {
        (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
          songs: songsToImport,
          addSong: mockAddSong,
          updateSong: mockUpdateSong,
          deleteSong: mockDeleteSong,
          importSongs: mockImportSongs,
        });
      },
    });

    render(<SongsPage />);
    expect(screen.getByText("Loading songs...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Song 1")).toBeInTheDocument();
      expect(screen.getByText("Song 2")).toBeInTheDocument();
    });
    expect(mockImportSongs).toHaveBeenCalledWith(mockSongs);
  });

  it("opens Add Song modal when Add Song button is clicked", async () => {
    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      songs: mockSongs,
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: mockImportSongs,
    });
    render(<SongsPage />);
    await waitFor(() => expect(screen.getByText("Song 1")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Add Song/i }));
    await waitFor(() => {
      expect(screen.getByText("Add New Song")).toBeInTheDocument(); // Modal title
    });
  });

  it("adds a new song through the modal", async () => {
    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      songs: mockSongs,
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: mockImportSongs,
    });
    render(<SongsPage />);
    await waitFor(() => expect(screen.getByText("Song 1")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Add Song/i }));
    await waitFor(() =>
      expect(screen.getByText("Add New Song")).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "New Test Song" },
    });
    fireEvent.change(screen.getByLabelText(/Author/i), {
      target: { value: "Test Author" },
    });
    fireEvent.change(screen.getByLabelText(/Lyrics/i), {
      target: { value: "Test lyrics content" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Song/i }));

    await waitFor(() => {
      expect(mockAddSong).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Test Song",
          author: "Test Author",
          content: "Test lyrics content",
        })
      );
    });
  });

  it("opens Edit Song modal when Edit button is clicked for a song", async () => {
    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      songs: mockSongs,
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: mockImportSongs,
    });
    render(<SongsPage />);
    await waitFor(() => expect(screen.getByText("Song 1")).toBeInTheDocument());

    // Get all edit buttons (icon buttons)
    const editButtons = screen.getAllByTitle(/Edit Song/i);
    fireEvent.click(editButtons[0]); // Click the first edit button

    await waitFor(() => {
      expect(
        screen.getByText(`Edit Song: ${mockSongs[0].title}`)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Title/i)).toHaveValue(mockSongs[0].title);
    });
  });

  it("updates a song through the edit modal", async () => {
    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      songs: mockSongs,
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: mockImportSongs,
    });
    render(<SongsPage />);
    await waitFor(() => expect(screen.getByText("Song 1")).toBeInTheDocument());

    const editButtons = screen.getAllByTitle(/Edit Song/i);
    fireEvent.click(editButtons[0]);
    await waitFor(() =>
      expect(
        screen.getByText(`Edit Song: ${mockSongs[0].title}`)
      ).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Updated Song Title" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mockUpdateSong).toHaveBeenCalledWith(
        mockSongs[0].id,
        expect.objectContaining({
          title: "Updated Song Title",
        })
      );
    });
  });

  it("deletes a song when delete button is clicked and confirmed", async () => {
    window.confirm = vi.fn(() => true); // Mock confirm to always return true
    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      songs: mockSongs,
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: mockImportSongs,
    });

    render(<SongsPage />);
    await waitFor(() => expect(screen.getByText("Song 1")).toBeInTheDocument());

    const deleteButtons = screen.getAllByTitle(/Delete Song/i);
    fireEvent.click(deleteButtons[0]); // Click delete for the first song

    expect(window.confirm).toHaveBeenCalledWith(
      `Are you sure you want to delete "${mockSongs[0].title}"?`
    );
    await waitFor(() => {
      expect(mockDeleteSong).toHaveBeenCalledWith(mockSongs[0].id);
    });
  });

  it("selects a song and displays its details", async () => {
    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      songs: mockSongs,
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: mockImportSongs,
    });
    render(<SongsPage />);
    await waitFor(() => expect(screen.getByText("Song 1")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Song 1"));

    await waitFor(() => {
      expect(screen.getByText(mockSongs[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockSongs[0].author)).toBeInTheDocument();
      expect(screen.getByText("Back to Songs List")).toBeInTheDocument();
    });
  });

  it("selects a slide and calls setSelectedItem", async () => {
    (useSongStore as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      songs: mockSongs,
      addSong: mockAddSong,
      updateSong: mockUpdateSong,
      deleteSong: mockDeleteSong,
      importSongs: mockImportSongs,
    });
    render(<SongsPage />);
    await waitFor(() => expect(screen.getByText("Song 1")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Song 1")); // Select the song first
    await waitFor(() =>
      expect(screen.getByText(mockSongs[0].slides[0].label)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(mockSongs[0].slides[0].label)); // Click on the slide label

    await waitFor(() => {
      expect(mockSetSelectedItem).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockSongs[0].slides[0].id,
          title: `${mockSongs[0].title} - ${mockSongs[0].slides[0].label}`,
          type: "song",
          content: mockSongs[0].slides[0].content,
        })
      );
    });
  });
});
