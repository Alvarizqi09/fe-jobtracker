"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Bold, Italic, Heading2 } from "lucide-react";

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export function CoverLetterEditor({ content, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: content ? content.replace(/\n/g, "<br/>") : "", // Pre-format newlines from Gemini raw text
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // When content prop drastically changes (e.g., generation completes)
  useEffect(() => {
    if (editor && content) {
      const formatted = content.includes("<")
        ? content
        : content.replace(/\n/g, "<br/>");
      if (editor.getHTML() !== formatted && !editor.isFocused) {
        editor.commands.setContent(formatted);
      }
    }
  }, [content, editor]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !editor) {
    return (
      <div className="min-h-[400px] border rounded-lg bg-card/50 animate-pulse" />
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-2 mb-4 sticky top-0 bg-card z-10 pb-2 border-b">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1.5 rounded transition-colors ${editor.isActive("bold") ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1.5 rounded transition-colors ${editor.isActive("italic") ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1.5 rounded transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
        >
          <Heading2 size={18} />
        </button>
      </div>
      <EditorContent editor={editor} className="flex-1 cursor-text" />
    </div>
  );
}
