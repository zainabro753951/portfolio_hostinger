import React, { memo, useEffect, useRef, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import HardBreak from "@tiptap/extension-hard-break";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import { motion } from "motion/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Quote,
  Type,
  X,
} from "lucide-react";
import "../../../tiptap.css";

// Toolbar button component
const ToolbarButton = memo(
  ({ onClick, isActive, icon: Icon, label, children, className = "" }) => (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
        isActive
          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
          : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
      } ${className}`}
      title={label}
      aria-label={label}
    >
      {children || <Icon className="w-4 h-4" />}
    </motion.button>
  ),
);

ToolbarButton.displayName = "ToolbarButton";

// Color picker button
const ColorButton = memo(({ color, onClick, isHighlight }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="w-6 h-6 rounded-md border border-white/20 hover:border-white/40 transition-colors"
    style={{
      backgroundColor: color,
      boxShadow:
        color === "#ffffff" ? "inset 0 0 0 1px rgba(255,255,255,0.3)" : "none",
    }}
    aria-label={`Color ${color}`}
  />
));

ColorButton.displayName = "ColorButton";

// Toolbar section divider
const ToolbarSection = memo(({ children }) => (
  <div className="flex items-center gap-1 px-2 border-r border-white/10 last:border-0">
    {children}
  </div>
));

ToolbarSection.displayName = "ToolbarSection";

// Custom HardBreak extension
const HardBreakWithKey = HardBreak.extend({
  addKeyboardShortcuts() {
    return {
      "Shift-Enter": () => this.editor.chain().focus().setHardBreak().run(),
    };
  },
});

const RichEditor = ({ output, setOutput }) => {
  const editorRef = useRef(null);
  const updateTimer = useRef(null);

  // Initialize editor
  const editor = useEditor({
    content: output || "<p>Start typing...</p>",
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { class: "rtp" } },
        heading: { HTMLAttributes: { class: "rth" } },
        bulletList: true,
        orderedList: true,
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Link.configure({ openOnClick: true }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Dropcursor.configure({ width: 2, class: "dropcursor" }),
      Gapcursor,
      HardBreakWithKey,
    ],
    editorProps: {
      attributes: {
        class:
          "rich-editor-content min-h-[200px] outline-none p-4 prose prose-invert max-w-none",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => {
      if (updateTimer.current) clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(() => {
        setOutput(editor.getHTML());
      }, 120);
    },
  });

  // Keep editor reference
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Task list sync effect
  useEffect(() => {
    if (!editor) return;

    const syncTaskList = () => {
      document.querySelectorAll(".task-list-item").forEach((li) => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked
            ? li.classList.add("checked")
            : li.classList.remove("checked");
        }
      });
    };

    syncTaskList();

    const target = document.querySelector(".rich-editor-content");
    if (!target) return;

    const observer = new MutationObserver(syncTaskList);
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, [editor]);

  // Sync external output changes
  useEffect(() => {
    if (!editor || !output) return;
    const currentContent = editor.getHTML();
    if (output.trim() && currentContent !== output) {
      editor.commands.setContent(output, false);
    }
  }, [editor, output]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (updateTimer.current) clearTimeout(updateTimer.current);
    };
  }, []);

  if (!editor) return null;

  // Check if format is active
  const isActive = (name, args) => {
    try {
      return editor.isActive(name, args);
    } catch (e) {
      return false;
    }
  };

  // Text colors
  const textColors = [
    { color: "#111827", label: "Dark" },
    { color: "#ffffff", label: "White" },
    { color: "#ef4444", label: "Red" },
    { color: "#22c55e", label: "Green" },
    { color: "#3b82f6", label: "Blue" },
    { color: "#f59e0b", label: "Amber" },
  ];

  // Highlight colors
  const highlightColors = [
    { color: "#fef08a", label: "Yellow" },
    { color: "#fecaca", label: "Red" },
    { color: "#bbf7d0", label: "Green" },
    { color: "#bfdbfe", label: "Blue" },
    { color: "#fed7aa", label: "Orange" },
  ];

  // Heading levels
  const headings = [
    { level: "paragraph", label: "P", icon: Type },
    { level: 1, label: "H1" },
    { level: 2, label: "H2" },
    { level: 3, label: "H3" },
    { level: 4, label: "H4" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 backdrop-blur-xl bg-slate-800/50 border border-white/10 rounded-xl shadow-lg">
        {/* Formatting */}
        <ToolbarSection>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={isActive("bold")}
            icon={Bold}
            label="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={isActive("italic")}
            icon={Italic}
            label="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={isActive("underline")}
            icon={UnderlineIcon}
            label="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={isActive("strike")}
            icon={Strikethrough}
            label="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={isActive("code")}
            icon={Code}
            label="Code"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={isActive("highlight")}
            icon={Highlighter}
            label="Highlight"
          />
        </ToolbarSection>

        {/* Headings */}
        <ToolbarSection>
          {headings.map(({ level, label, icon }) => (
            <ToolbarButton
              key={level}
              onClick={() => {
                if (level === "paragraph") {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level }).run();
                }
              }}
              isActive={
                level === "paragraph"
                  ? isActive("paragraph")
                  : isActive("heading", { level })
              }
              icon={
                icon ||
                (() => <span className="text-xs font-bold">{label}</span>)
              }
              label={label}
            />
          ))}
        </ToolbarSection>

        {/* Lists */}
        <ToolbarSection>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={isActive("bulletList")}
            icon={List}
            label="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={isActive("orderedList")}
            icon={ListOrdered}
            label="Numbered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={isActive("taskList")}
            icon={CheckSquare}
            label="Task List"
          />
        </ToolbarSection>

        {/* Alignment */}
        <ToolbarSection>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={isActive("textAlign", { align: "left" })}
            icon={AlignLeft}
            label="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={isActive("textAlign", { align: "center" })}
            icon={AlignCenter}
            label="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={isActive("textAlign", { align: "right" })}
            icon={AlignRight}
            label="Align Right"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={isActive("textAlign", { align: "justify" })}
            icon={AlignJustify}
            label="Justify"
          />
        </ToolbarSection>

        {/* Blockquote */}
        <ToolbarSection>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={isActive("blockquote")}
            icon={Quote}
            label="Blockquote"
          />
        </ToolbarSection>

        {/* Colors */}
        <ToolbarSection>
          <div className="flex items-center gap-1">
            {textColors.map(({ color, label }) => (
              <ColorButton
                key={color}
                color={color}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
          </div>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <div className="flex items-center gap-1">
            {highlightColors.map(({ color }) => (
              <ColorButton
                key={color}
                color={color}
                isHighlight
                onClick={() =>
                  editor.chain().focus().setHighlight({ color }).run()
                }
              />
            ))}
          </div>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().unsetColor().unsetHighlight().run()
            }
            icon={X}
            label="Clear Colors"
            className="ml-1"
          />
        </ToolbarSection>

        {/* Insert */}
        <ToolbarSection>
          <ToolbarButton
            onClick={() => {
              const src = prompt("Enter image URL:");
              if (src) editor.chain().focus().setImage({ src }).run();
            }}
            icon={ImageIcon}
            label="Insert Image"
          />
          <ToolbarButton
            onClick={() => {
              const url = prompt("Enter URL:");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            icon={LinkIcon}
            label="Insert Link"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={Minus}
            label="Horizontal Rule"
          />
        </ToolbarSection>

        {/* Undo/Redo */}
        <ToolbarSection className="ml-auto">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            label="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            label="Redo"
          />
        </ToolbarSection>
      </div>

      {/* Editor Content */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/30 backdrop-blur-sm">
        <EditorContent editor={editor} />
      </div>

      {/* Output Preview */}
      <div className="border border-white/10 rounded-xl p-4 bg-slate-900/30 backdrop-blur-sm min-h-[120px]">
        <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
          Preview
        </p>
        <div
          className="rich-output prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: output }}
        />
      </div>
    </div>
  );
};

export default memo(RichEditor);
