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
  const [search , setSearch]= useState('')

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('note').select('*').ilike('title',`%${search}%`)
    if (error) {
      alert(error.message)
      return;
    }
    setNotes(data)
  }

  useEffect(() => {
    fetchNotes()
  },[search])

  return (
    <main className="w-full h-screen flex flex-col">
      <Header />
      <div className="grow relative">
        <Sidebar
          activeNoteId={activeNoteId}
          setActiveNoteId={setActiveNoteId}
          setIsCreating={setIsCreating}
          notes={notes}
          search={search}
          setSearch={ setSearch}
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