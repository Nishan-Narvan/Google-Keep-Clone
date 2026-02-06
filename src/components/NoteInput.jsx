import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { MdArchive, MdDeleteOutline, MdEdit } from "react-icons/md";
import { notesAPI } from "../utils/api";
import { useAppContext } from "../context/AppContext";

const NoteInput = () => {
  const { mode } = useAppContext();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = useCallback(async () => {
    try {
      const response = await notesAPI.getAll();
      if (response.success) {
        setNotes(response.data.notes || []);
      }
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  }, []);

  const buttonMotionProps = useMemo(
    () => ({
      whileHover: { scale: 1.05, translateY: -10, boxShadow: "0px 3px 0px black", backgroundColor: "bg-green-500" },
      transition: { duration: 0.09, ease: "easeOut" },
    }),
    []
  );

  const createNote = useCallback(async () => {
    if (!title.trim() && !desc.trim()) {
      setError("Please enter title or content");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await notesAPI.create(title, desc);
      if (response.success) {
        setNotes((prev) => [response.data.note, ...prev]);
        setTitle("");
        setDesc("");
      }
    } catch (err) {
      setError(err.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  }, [title, desc]);

  const archiveNote = useCallback(
    async (index, noteId) => {
      setLoading(true);
      try {
        const response = await notesAPI.archive(noteId);
        if (response.success) {
          setNotes((prev) => prev.filter((_, i) => i !== index));
        }
      } catch (err) {
        setError(err.message || "Failed to archive note");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteNote = useCallback(
    async (index, noteId) => {
      setLoading(true);
      try {
        const response = await notesAPI.trash(noteId);
        if (response.success) {
          setNotes((prev) => prev.filter((_, i) => i !== index));
        }
      } catch (err) {
        setError(err.message || "Failed to delete note");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Editing state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title || "");
    setEditContent(note.content || "");
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (index, noteId) => {
    if (!editTitle.trim() && !editContent.trim()) {
      setError("Please enter title or content");
      return;
    }

    setLoading(true);
    try {
      const response = await notesAPI.update(noteId, editTitle, editContent);
      if (response.success) {
        // Update local list
        setNotes((prev) => prev.map((n) => (n.id === noteId ? response.data.note : n)));
        cancelEditing();
      }
    } catch (err) {
      setError(err.message || "Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Create Note Card */}
      <motion.div
        whileHover={{ scale: 1.05, translateY: -10, boxShadow: "0px 6px 0px black" }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl  w-full max-w-xl ml-15 bg-linear-to-br from-[#74c29b] via-[#355E3B] to-[#2F4F4F]
          backdrop-blur-sm bg-opacity-50 border border-white/20 shadow-lg shadow-[#1a2e1f]/50 ${
          mode ? "bg-gray-300" : "bg-[#1e3f29]"
        }`}
      >
        <div className="ml-6">
          <textarea
            placeholder="Title"
            className="text-3xl hover:border-none focus:outline-none w-full resize-none font-mono"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="ml-6">
          <textarea
            placeholder="Take a Note"
            className="hover:border-none focus:outline-none w-full resize-none font-mono"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="ml-6 mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center py-5 min-h-[3rem]">
          <motion.button
            whileHover={{ scale: 1.08, translateY: -4, boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="min-w-[8rem] h-10 flex items-center justify-center px-6 py-2.5 bg-linear-to-br from-[#4d815f] to-[#2F4F4F] text-white font-bold text-lg border-2 border-[#355E3B] focus:outline-none rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
            onClick={createNote}
            disabled={loading}
          >
            {loading ? "..." : "Add note"}
          </motion.button>
        </div>
      </motion.div>

      {/* Notes List */}
      <div
        className={` rounded-3xl w-full max-w-xl ml-15 shadow-sm mt-3 p-1.5 ${
          mode ? "bg-[#1e3f29]" : "bg-[#4d815f]"
        }`}
      >
        <ul className="space-y-2">
          {notes.map((note, index) => (
            <li key={note.id} className="my-2">
              <motion.div
                whileHover={{ scale: 1.05, translateY: -10, boxShadow: "0px 6px 0px black" }}
                transition={{ duration: 0.16 }}
                className={`w-full bg-linear-to-br from-[#74c29b] via-[#355E3B] to-[#2F4F4F]
                  backdrop-blur-sm bg-opacity-50 border border-white/20 shadow-lg shadow-[#1a2e1f]/50 rounded-2xl p-0 ${
                  mode ? "bg-[#e9ecf0]" : "bg-[#1c93e2]"
                }`}
              >
                {editingNoteId === note.id ? (
                  <div className="p-4 w-full">
                    <input
                      className="w-full text-2xl font-mono mb-2 p-1 rounded focus:outline-none"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <textarea
                      className="w-full resize-none p-1 rounded focus:outline-none"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Content"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-3">
                      <motion.button
                        {...buttonMotionProps}
                        onClick={() => saveEdit(index, note.id)}
                        className="min-w-[4rem] h-10 cursor-pointer flex items-center justify-center px-4 bg-linear-to-br from-[#4d815f] to-[#2F4F4F] text-white font-bold text-md border-2 border-[#355E3B] focus:outline-none rounded-lg shadow-lg hover:shadow-xl transition-all transform-0.5 disabled:opacity-50 whitespace-nowrap"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </motion.button>

                      <motion.button
                        {...buttonMotionProps}
                        onClick={cancelEditing}
                        className="min-w-[4rem] h-10 flex cursor-pointer items-center justify-center px-4 bg-white/70 text-black font-bold text-md border-2 border-[#cfcfcf]  transform-0.5 focus:outline-none rounded-lg shadow-sm disabled:opacity-50 whitespace-nowrap"
                        disabled={loading}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between p-4">
                    <div className="flex-1 pr-4">
                      <div className="text-3xl font-mono text-black/50">• {note.title}</div>
                      <div className="text-base mt-1 text-black/90">{note.content}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.button
                        type="button"
                        onClick={() => startEditing(note)}
                        {...buttonMotionProps}
                        className="p-2 bg-transparent cursor-pointer border-none outline-none hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 text-white"
                        title="Edit note"
                      >
                        <MdEdit className="text-xl" />
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => archiveNote(index, note.id)}
                        {...buttonMotionProps}
                        className="p-2 bg-transparent cursor-pointer border-none outline-none hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <MdArchive className="text-xl" />
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => deleteNote(index, note.id)}
                        {...buttonMotionProps}
                        className="p-2 bg-transparent text-red-400 cursor-pointer border-none outline-none hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <MdDeleteOutline className="text-xl" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoteInput;
