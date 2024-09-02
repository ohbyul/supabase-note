"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

export default function NoteViewer({
  setActiveNoteId,
  fetchNotes,
  note, // {id: 1, title: "", content: ""}
}) {
  const [title, setTitle] = useState(note?.title);
  const [content, setContent] = useState(note?.content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTitle(note?.title);
    setContent(note?.content);
    setIsEditing(false);
  }, [note]);

  const onEdit = async () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.')
      return;
    }
    const { data, error } = await supabase
      .from('note')
      .update({ title, content })
      .eq('id', note.id)
    
    if (error) {
      alert(error.message)
      return;
    }

    setIsEditing(false);
    fetchNotes()
  }

  const onDelete = async () => {
    const { data, error } = await supabase
      .from('note')
      .delete()
      .eq('id', note.id)
    
    if (error) {
      alert(error.message)
      return;
    }

    setIsEditing(false);
    fetchNotes()
    setActiveNoteId(null)
  }

  return (
    <div className="w-2/3 p-2 flex flex-col gap-2 absolute top-0 bottom-0 right-0">
      {isEditing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="노트의 제목을 입력하세요"
            className="border rounded-md border-gray-300 text-xl p-2"
          />

          <textarea
            className="border rounded-md border-gray-300 text-lg p-2 grow"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </>
      ) : (
        <>
          <h1 className="rounded-md text-xl p-2">{title}</h1>

          <p className="border rounded-md border-gray-300 text-lg p-2 grow">
            {content}
          </p>
        </>
      )}

      <div className="w-full flex justify-end gap-2">
        {isEditing ? (
          <>
            <button
              onClick={()=>onEdit()}
              className="py-1 px-3 rounded-full border-2 border-green-600 hover:bg-green-200 transition-all duration-300 ease-in-out"
            >
              저장
            </button>
            <button
              onClick={()=>onDelete()}
              className="py-1 px-3 rounded-full border-2 border-red-600 hover:bg-red-200 transition-all duration-300 ease-in-out"
            >
              삭제
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="py-1 px-3 rounded-full border-2 border-green-600 hover:bg-green-200 transition-all duration-300 ease-in-out"
          >
            수정하기
          </button>
        )}
      </div>
    </div>
  );
}