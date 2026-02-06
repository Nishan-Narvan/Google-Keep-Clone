import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { LuUndo2 } from "react-icons/lu";
import { notesAPI } from "../utils/api";
import { useAppContext } from "../context/AppContext";

const Trash = () => {
  const { mode, bgImage } = useAppContext();
  const [trashed, setTrashed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Shared button animation props
  const buttonMotionProps = useMemo(
    () => ({
      whileHover: { scale: 1.05, translateY: -10, boxShadow: "0px 3px 0px black" },
      transition: { duration: 0.09, ease: "easeOut" },
    }),
    []
  );

  // Shared note card animation
  const noteMotionProps = useMemo(
    () => ({
      whileHover: { scale: 1.02, translateY: -10, boxShadow: "0px 6px 0px black" },
      transition: { duration: 0.16 },
    }),
    []
  );

  // API calls
  const loadTrashed = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await notesAPI.getTrashed();
      setTrashed(response.success ? response.data.notes || [] : []);
    } catch (err) {
      setError(err.message || "Failed to load trashed notes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Edit handlers
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

  const saveEdit = useCallback(
    async (noteId) => {
      if (!editTitle.trim() && !editContent.trim()) {
        setError("Please enter title or content");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await notesAPI.update(noteId, editTitle, editContent);
        if (response.success) {
          setTrashed((prev) => prev.map((n) => (n.id === noteId ? response.data.note : n)));
          cancelEditing();
        }
      } catch (err) {
        setError(err.message || "Failed to update note");
      } finally {
        setLoading(false);
      }
    },
    [editTitle, editContent]
  );

  const handleRestore = useCallback(async (noteId) => {
    setLoading(true);
    try {
      await notesAPI.restore(noteId);
      setTrashed((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err.message || "Failed to restore note");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteForever = useCallback(async (noteId) => {
    setLoading(true);
    try {
      await notesAPI.delete(noteId);
      setTrashed((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err.message || "Failed to delete note");
    } finally {
      setLoading(false);
    }
  }, []);

  // Background
  const bgUrl = useMemo(
    () =>
      bgImage ||
      (mode
        ? "https://i.pinimg.com/originals/0b/e7/48/0be748204b77ec2211c3230442e468a9.gif"
        : "https://i.pinimg.com/originals/be/63/08/be63089e483cb06b226f6976723f5e5f.gif"),
    [mode, bgImage]
  );

  // Edit mode JSX
  const editUI = (
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
          onClick={() => saveEdit(editingNoteId)}
          className="min-w-[4rem] h-10 cursor-pointer flex items-center justify-center px-4 bg-linear-to-br from-[#4d815f] to-[#2F4F4F] text-white font-bold text-md border-2 border-[#355E3B] focus:outline-none rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 whitespace-nowrap"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </motion.button>

        <motion.button
          {...buttonMotionProps}
          onClick={cancelEditing}
          className="min-w-[4rem] h-10 flex cursor-pointer items-center justify-center px-4 bg-white/70 text-black font-bold text-md border-2 border-[#cfcfcf] focus:outline-none rounded-lg shadow-sm disabled:opacity-50 whitespace-nowrap"
          disabled={loading}
        >
          Cancel
        </motion.button>
      </div>
    </div>
  );

  // View mode JSX
  const viewUI = (note) => (
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
          {...buttonMotionProps}
          onClick={(e) => {
            e.stopPropagation();
            handleRestore(note.id);
          }}
          className="p-2 bg-transparent cursor-pointer border-none outline-none hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 text-white"
          title="Restore to notes"
          disabled={loading}
        >
          <LuUndo2 className="text-xl text-blue-200" />
        </motion.button>

        <motion.button
          type="button"
          {...buttonMotionProps}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteForever(note.id);
          }}
          className="p-2 bg-transparent text-red-400 cursor-pointer border-none outline-none hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          title="Delete permanently"
          disabled={loading}
        >
          <MdDeleteOutline className="text-xl" />
        </motion.button>
      </div>
    </div>
  );

  // Empty state JSX
  const emptyUI = (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-center ${mode ? "text-gray-200" : "text-gray-800"}`}
      >
        <div className="text-xl font-semibold mb-2">No notes in trash</div>
        <div className="text-sm opacity-75">Deleted notes will appear here</div>
      </motion.div>
    </div>
  );

  useEffect(() => {
    loadTrashed();
  }, [loadTrashed]);

  return (
    <div className="flex relative flex-1 w-full h-full justify-center items-start">
      <img
        src={bgUrl}
        className="absolute z-0 object-cover w-full h-full"
        alt="Background"
      />

      <div className="w-full flex justify-center px-4 mt-8">
        <div
          className={`rounded-3xl w-full max-w-xl ml-15 shadow-sm mt-3 p-1.5 ${
            mode ? "bg-[#1e3f29]" : "bg-[#4d815f]"
          }`}
        >
          {error && (
            <div className="mb-3 text-sm text-red-500 font-semibold">{error}</div>
          )}
          {loading && trashed.length === 0 ? (
            <div className="p-6 text-center text-gray-200">Loading trash...</div>
          ) : trashed.length === 0 ? (
            emptyUI
          ) : (
            <ul className="space-y-2">
              {trashed.map((note) => (
                <li key={note.id} className="my-2">
                  <motion.div
                    {...noteMotionProps}
                    className={`w-full bg-linear-to-br from-[#74c29b] via-[#355E3B] to-[#2F4F4F]
                      backdrop-blur-sm bg-opacity-50 border border-white/20 shadow-lg shadow-[#1a2e1f]/50 rounded-2xl p-0 ${
                        mode ? "bg-[#e9ecf0]" : "bg-[#1c93e2]"
                      }`}
                  >
                    {editingNoteId === note.id ? editUI : viewUI(note)}
                  </motion.div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trash;