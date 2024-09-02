"use client";

import { useEffect, useState } from "react";

import EmptyNote from "@/components/empty-note";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import NewNote from "@/components/new-note";
import NoteViewer from "@/components/note-viewer";
import { supabase } from "@/utils/supabase";
import { Database } from "@/types_db";



export default function UI() {
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notes, setNotes] = useState<Database['public']['Tables']['note']['Row']>([]);
  
  const fetchNotes = async () => {
    const { data, error } = await supabase.from('note').select('*')
    if (error) {
      alert(error.message)
      return;
    }

    setNotes(data)
  }

  useEffect(() => {
    fetchNotes()
  },[])

  return (
    <main className="w-full h-screen flex flex-col">
      <Header />
      <div className="grow relative">
        <Sidebar
          activeNoteId={activeNoteId}
          setActiveNoteId={setActiveNoteId}
          setIsCreating={setIsCreating}
          notes={notes}
        />
        {isCreating ? (
          <NewNote
            fetchNotes={fetchNotes}
            setIsCreating={setIsCreating}
            setActiveNoteId={ setActiveNoteId}
          />
        ) : activeNoteId ? (
            <NoteViewer
              setActiveNoteId={setActiveNoteId}
              fetchNotes={fetchNotes}
              note={notes.find((note) => note.id === activeNoteId)}
            />
        ) : (
          <EmptyNote />
        )}
      </div>
    </main>
  );
}