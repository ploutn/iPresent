import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SongEditorProps {
    onSave: (content: string) => void;
    onCancel: () => void;
}

export function SongEditor({ onSave, onCancel }: SongEditorProps) {
    const [songBook, setSongBook] = useState('');
     const [song, setSong] = useState('');
    const [songBooks, setSongBooks] = useState<string[]>([
        'Default song book 1',
        'Default song book 2',
        'Default song book 3'
    ]);

     const handleCreateBook = () => {
      const newBook = prompt("Enter the name of your new song book");
       if(newBook){
          setSongBooks([...songBooks, newBook])
          setSongBook(newBook);
       }
   };

    const handleSave = useCallback(() => {
         onSave(song);
    }, [onSave,song]);

    return (
        <div className="space-y-4">
            <div className="flex space-x-4 items-center">
              <div className="flex-1">
                <Label htmlFor="song-book">Song book</Label>
                <Select onValueChange={setSongBook}>
                  <SelectTrigger  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg">
                      <SelectValue placeholder="Select song book" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    {songBooks.map((book, index) => (
                          <SelectItem key={index} value={book}>{book}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
               </div>
            <Button
                variant="outline"
                 onClick={handleCreateBook}
                className="bg-gray-700 hover:bg-gray-600 border-gray-600"
               >
                Create new book
           </Button>
          </div>
            <div className="space-y-2">
                <Label htmlFor="song-content">Song:</Label>
                <Textarea
                    id="song-content"
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                    className="w-full bg-gray-700 text-white p-4 rounded-lg resize-none border-gray-600"
                    rows={10}
                    placeholder="153. Тому, Хто смертю крестной

 Тому, Хто смертю крестной
І Кровию нас спас,
Споем благодаренье,
Споем сто тысяч раз!
Пусть ныне в сердце каждом
Любовь к Нему горит,
Пусть каждый неустанно
Христа благодарит!

Chorus / Приспів / Припев:
Я дякую, я дякую, я дякую
Тобі, Господь, я дякую.

Я в праці чую дивний голос Твій,
В солодких звуках рідної природи.
Я дякую, що Ти поміг пройти
Через страждання і земну негоду."
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={onCancel}
                     className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                     className="bg-blue-600 hover:bg-blue-700"
                >
                    Create
                </Button>
            </div>
        </div>
    );
}