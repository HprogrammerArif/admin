"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Undo, 
  Redo,
  Link as LinkIcon
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
      Markdown,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Get content as markdown
      const markdown = (editor.storage as any).markdown.getMarkdown();
      onChange(markdown);
    },
  });

  // Update editor content if value changes externally (e.g., when loading)
  useEffect(() => {
    const currentContent = (editor?.storage as any)?.markdown?.getMarkdown();
    if (editor && value !== currentContent) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
      <div className="bg-slate-50 p-2 border-b border-slate-200 flex flex-wrap gap-1 items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle bold"
          className="hover:bg-slate-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle italic"
          className="hover:bg-slate-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Toggle underline"
          className="hover:bg-slate-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6 bg-slate-300" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Toggle heading 1"
          className="hover:bg-slate-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Toggle heading 2"
          className="hover:bg-slate-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6 bg-slate-300" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Toggle bullet list"
          className="hover:bg-slate-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Toggle ordered list"
          className="hover:bg-slate-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Toggle blockquote"
          className="hover:bg-slate-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6 bg-slate-300" />

        <button
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded-md hover:bg-slate-200 ${editor.isActive("link") ? "bg-blue-100 text-blue-700" : "text-slate-700"}`}
          title="Set Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <div className="ml-auto flex gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-30"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-30"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto prose prose-slate max-w-none focus:outline-none" 
      />

      <style jsx global>{`
        .ProseMirror {
          min-height: 300px;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p {
          margin-bottom: 0.5rem;
        }
        .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
