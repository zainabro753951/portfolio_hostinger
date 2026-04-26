import React, { memo, useEffect, useRef, useCallback, useState } from "react";
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
import Placeholder from "@tiptap/extension-placeholder";
import { motion, AnimatePresence } from "motion/react";
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
  ChevronDown,
} from "lucide-react";
import "../../../tiptap.css";

// ============================================================
// ✅ TOOLBAR BUTTON COMPONENT - Enhanced with glass morphism
// ============================================================
const ToolbarButton = memo(
  ({
    onClick,
    isActive,
    icon: Icon,
    label,
    children,
    className = "",
    disabled = false,
  }) => (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.08, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-8px rounded-10px transition-all duration-250 ease-out
        flex items-center justify-center
        ${
          isActive
            ? "bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{ padding: "8px", borderRadius: "10px" }}
      title={label}
      aria-label={label}
    >
      {children ||
        (Icon && (
          <Icon
            className="w-16px h-16px"
            style={{ width: "16px", height: "16px" }}
          />
        ))}

      {/* Active indicator dot */}
      {isActive && (
        <motion.span
          layoutId="activeIndicator"
          className="absolute -bottom-4px left-1/2 transform -translate-x-1/2 w-4px h-4px bg-cyan-400 rounded-full"
          style={{ width: "4px", height: "4px", bottom: "-4px" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  ),
);

ToolbarButton.displayName = "ToolbarButton";

// ============================================================
// ✅ COLOR PICKER BUTTON - Enhanced glass effect
// ============================================================
const ColorButton = memo(({ color, onClick, isHighlight, isActive }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.15, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`
      w-22px h-22px rounded-6px border-2 transition-all duration-200
      ${
        isActive
          ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-110"
          : "border-white/20 hover:border-white/60"
      }
    `}
    style={{
      width: "22px",
      height: "22px",
      borderRadius: "6px",
      backgroundColor: color,
      boxShadow:
        color === "#ffffff"
          ? "inset 0 0 0 1px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)"
          : "0 2px 8px rgba(0,0,0,0.2)",
    }}
    aria-label={`${isHighlight ? "Highlight" : "Text"} color ${color}`}
  />
));

ColorButton.displayName = "ColorButton";

// ============================================================
// ✅ TOOLBAR SECTION DIVIDER
// ============================================================
const ToolbarSection = memo(({ children, className = "" }) => (
  <div
    className={`flex items-center gap-6px px-10px border-r  border-white/10 last:border-0 ${className}`}
    style={{ gap: "6px", paddingLeft: "10px", paddingRight: "10px" }}
  >
    {children}
  </div>
));

ToolbarSection.displayName = "ToolbarSection";

// ============================================================
// ✅ DROPDOWN COMPONENT FOR HEADINGS
// ============================================================
const HeadingDropdown = memo(({ editor, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const headings = [
    { level: "paragraph", label: "Paragraph", icon: Type },
    { level: 1, label: "Heading 1", shortcut: "H1" },
    { level: 2, label: "Heading 2", shortcut: "H2" },
    { level: 3, label: "Heading 3", shortcut: "H3" },
    { level: 4, label: "Heading 4", shortcut: "H4" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentHeading = () => {
    if (isActive("heading", { level: 1 })) return "H1";
    if (isActive("heading", { level: 2 })) return "H2";
    if (isActive("heading", { level: 3 })) return "H3";
    if (isActive("heading", { level: 4 })) return "H4";
    return "P";
  };

  return (
    <div ref={dropdownRef} className="relative ">
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        isActive={isActive("heading")}
        className="flex items-center gap-4px min-w-50px "
        style={{ gap: "4px", minWidth: "50px" }}
      >
        <span className="text-13px font-semibold" style={{ fontSize: "13px" }}>
          {getCurrentHeading()}
        </span>
        <ChevronDown
          className={`w-14px h-14px transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ width: "14px", height: "14px" }}
        />
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute  top-full left-0 mt-8px z-50 min-w-160px py-6px px-4px rounded-12px
                       bg-slate-800/95 backdrop-blur-xl border border-white/10 shadow-2xl"
            style={{
              marginTop: "8px",
              minWidth: "160px",
              padding: "6px 4px",
              borderRadius: "12px",
            }}
          >
            {headings.map(({ level, label, icon: Icon, shortcut }) => (
              <motion.button
                key={level}
                type="button"
                whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.1)" }}
                onClick={() => {
                  if (level === "paragraph") {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().toggleHeading({ level }).run();
                  }
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-10px px-12px py-8px rounded-8px transition-colors
                  ${
                    (
                      level === "paragraph"
                        ? isActive("paragraph")
                        : isActive("heading", { level })
                    )
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-slate-300 hover:text-white"
                  }
                `}
                style={{
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                {Icon ? (
                  <Icon
                    className="w-16px h-16px"
                    style={{ width: "16px", height: "16px" }}
                  />
                ) : (
                  <span
                    className="text-12px font-bold w-20px"
                    style={{ fontSize: "12px", width: "20px" }}
                  >
                    {shortcut}
                  </span>
                )}
                <span className="text-13px" style={{ fontSize: "13px" }}>
                  {label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

HeadingDropdown.displayName = "HeadingDropdown";

// ============================================================
// ✅ COLOR PICKER DROPDOWN
// ============================================================
const ColorPickerDropdown = memo(({ editor, isActive, type = "text" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const colors =
    type === "text"
      ? [
          { color: "#ffffff", label: "White" },
          { color: "#e2e8f0", label: "Light Gray" },
          { color: "#94a3b8", label: "Gray" },
          { color: "#f87171", label: "Red" },
          { color: "#fb923c", label: "Orange" },
          { color: "#facc15", label: "Yellow" },
          { color: "#4ade80", label: "Green" },
          { color: "#22d3ee", label: "Cyan" },
          { color: "#60a5fa", label: "Blue" },
          { color: "#a78bfa", label: "Purple" },
          { color: "#f472b6", label: "Pink" },
        ]
      : [
          { color: "#fef08a", label: "Yellow" },
          { color: "#fecaca", label: "Red" },
          { color: "#bbf7d0", label: "Green" },
          { color: "#bfdbfe", label: "Blue" },
          { color: "#e9d5ff", label: "Purple" },
          { color: "#fbcfe8", label: "Pink" },
          { color: "#fed7aa", label: "Orange" },
          { color: "#a5f3fc", label: "Cyan" },
        ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        isActive={
          type === "text" ? isActive("textStyle") : isActive("highlight")
        }
        icon={type === "text" ? Type : Highlighter}
        label={type === "text" ? "Text Color" : "Highlight Color"}
        className="relative"
      >
        <div className="relative">
          {type === "text" ? (
            <Type
              className="w-16px h-16px"
              style={{ width: "16px", height: "16px" }}
            />
          ) : (
            <Highlighter
              className="w-16px h-16px"
              style={{ width: "16px", height: "16px" }}
            />
          )}
          <div
            className="absolute -bottom-2px left-1/2 transform -translate-x-1/2 w-12px h-3px rounded-full"
            style={{
              width: "12px",
              height: "3px",
              bottom: "-2px",
              background:
                type === "text"
                  ? editor?.getAttributes("textStyle").color || "#ffffff"
                  : editor?.getAttributes("highlight").color || "#fef08a",
            }}
          />
        </div>
      </ToolbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-8px z-50 p-12px rounded-12px
                       bg-slate-800/95 backdrop-blur-xl border border-white/10 shadow-2xl"
            style={{
              marginTop: "8px",
              padding: "12px",
              borderRadius: "12px",
            }}
          >
            <div className="grid grid-cols-4 gap-8px" style={{ gap: "8px" }}>
              {colors.map(({ color, label }) => (
                <div
                  key={color}
                  className="flex flex-col items-center gap-4px"
                  style={{ gap: "4px" }}
                >
                  <ColorButton
                    color={color}
                    isHighlight={type === "highlight"}
                    isActive={
                      type === "text"
                        ? editor?.getAttributes("textStyle").color === color
                        : editor?.getAttributes("highlight").color === color
                    }
                    onClick={() => {
                      if (type === "text") {
                        editor.chain().focus().setColor(color).run();
                      } else {
                        editor.chain().focus().setHighlight({ color }).run();
                      }
                      setIsOpen(false);
                    }}
                  />
                  <span
                    className="text-10px text-slate-400"
                    style={{ fontSize: "10px" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-10px pt-10px border-t border-white/10"
              style={{ marginTop: "10px", paddingTop: "10px" }}
            >
              <button
                type="button"
                onClick={() => {
                  if (type === "text") {
                    editor.chain().focus().unsetColor().run();
                  } else {
                    editor.chain().focus().unsetHighlight().run();
                  }
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-6px py-6px px-12px rounded-8px
                           text-12px text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                style={{
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              >
                <X
                  className="w-12px h-12px"
                  style={{ width: "12px", height: "12px" }}
                />
                Clear {type === "text" ? "Color" : "Highlight"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ColorPickerDropdown.displayName = "ColorPickerDropdown";

// ============================================================
// ✅ MAIN RICH EDITOR COMPONENT
// ============================================================
const RichEditor = ({ output, setOutput, placeholder = "Start typing..." }) => {
  const editorRef = useRef(null);
  const updateTimer = useRef(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // ✅ ADD THIS

  // Initialize editor
  const editor = useEditor({
    content: output || `<p>${placeholder}</p>`,
    extensions: [
      StarterKit.configure({
        underline: false, // ← StarterKit se hataya
        link: false,
        paragraph: { HTMLAttributes: { class: "rtp" } },
        heading: { HTMLAttributes: { class: "rth" } },
        bulletList: true,
        orderedList: true,
        codeBlock: {
          HTMLAttributes: {
            class: "rounded-xl bg-slate-900/80 p-16px font-mono text-14px",
          },
        },
      }),
      // ✅ Phir separately add kiya with custom config:
      Underline, // ← Alag se add kiya
      Link.configure({
        // ← Alag se add kiya with custom HTML
        openOnClick: true,
        HTMLAttributes: {
          class: "text-cyan-400 hover:text-cyan-300",
        },
      }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto shadow-lg",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start gap-8px",
        },
      }),

      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "rich-editor-content min-h-250px outline-none p-24px prose prose-invert max-w-none",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => {
      if (updateTimer.current) clearTimeout(updateTimer.current);

      updateTimer.current = setTimeout(() => {
        if (!editor.isDestroyed) {
          // ✅ extra safety
          const html = editor.getHTML();
          setOutput(html);

          const text = editor.getText();
          setCharCount(text.length);
          setWordCount(
            text
              .trim()
              .split(/\s+/)
              .filter((w) => w.length > 0).length,
          );
        }
      }, 150);
    },
  });

  // Keep editor reference
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Task list sync effect with improved handling
  useEffect(() => {
    if (!editor) return;

    const syncTaskList = () => {
      const checkboxes = document.querySelectorAll(
        '.task-list-item input[type="checkbox"]',
      );
      checkboxes.forEach((checkbox) => {
        const li = checkbox.closest(".task-list-item");
        if (li) {
          if (checkbox.checked) {
            li.classList.add("checked");
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
          } else {
            li.classList.remove("checked");
            li.style.textDecoration = "none";
            li.style.opacity = "1";
          }
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
      attributeFilter: ["checked"],
    });

    // Also listen for click events on checkboxes
    const handleClick = (e) => {
      if (e.target.matches('.task-list-item input[type="checkbox"]')) {
        setTimeout(syncTaskList, 0);
      }
    };
    target.addEventListener("click", handleClick);

    return () => {
      observer.disconnect();
      target.removeEventListener("click", handleClick);
    };
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
  const isActive = useCallback(
    (name, args) => {
      try {
        return editor.isActive(name, args);
      } catch (e) {
        return false;
      }
    },
    [editor],
  );

  // Handle image insertion
  const handleImageInsert = useCallback(() => {
    const src = prompt("Enter image URL:");
    if (src && src.trim()) {
      editor.chain().focus().setImage({ src: src.trim() }).run();
    }
  }, [editor]);

  // Handle link insertion
  const handleLinkInsert = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url && url.trim()) {
      editor.chain().focus().setLink({ href: url.trim() }).run();
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      setIsMounted(true); // ✅ ADD THIS
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(
        text
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length,
      );
    }
  }, [editor]);

  // Task list effect mein add karein:
  useEffect(() => {
    if (!editor || !isMounted) return; // ✅ isMounted check
    // ... rest of code
  }, [editor, isMounted]);

  // Sync effect mein bhi:
  useEffect(() => {
    if (!editor || !output || !isMounted) return; // ✅ isMounted check
    // ... rest of code
  }, [editor, output, isMounted]);

  // Handle undo/redo
  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  return (
    <div className="w-full space-y-4" style={{ gap: "16px" }}>
      {/* Main Toolbar - Glass Morphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-wrap items-center gap-8px p-12px rounded-16px
                   bg-slate-800/60 backdrop-blur-xl border border-white/10 
                   shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        style={{
          gap: "8px",
          padding: "12px",
          borderRadius: "16px",
          position: "relative",
          zIndex: 100,
        }}
      >
        {/* Formatting Section */}
        <ToolbarSection>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={isActive("bold")}
            icon={Bold}
            label="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={isActive("italic")}
            icon={Italic}
            label="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={isActive("underline")}
            icon={UnderlineIcon}
            label="Underline (Ctrl+U)"
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
            label="Inline Code"
          />
        </ToolbarSection>

        {/* Headings Section */}
        <ToolbarSection>
          <HeadingDropdown editor={editor} isActive={isActive} />
        </ToolbarSection>

        {/* Lists Section */}
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

        {/* Alignment Section */}
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

        {/* Colors Section */}
        <ToolbarSection>
          <ColorPickerDropdown
            editor={editor}
            isActive={isActive}
            type="text"
          />
          <ColorPickerDropdown
            editor={editor}
            isActive={isActive}
            type="highlight"
          />
        </ToolbarSection>

        {/* Insert Section */}
        <ToolbarSection>
          <ToolbarButton
            onClick={handleImageInsert}
            icon={ImageIcon}
            label="Insert Image"
          />
          <ToolbarButton
            onClick={handleLinkInsert}
            isActive={isActive("link")}
            icon={LinkIcon}
            label="Insert Link"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={Minus}
            label="Horizontal Rule"
          />
        </ToolbarSection>

        {/* Undo/Redo Section */}
        <ToolbarSection className="ml-auto">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            label="Undo"
            disabled={!canUndo}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            label="Redo"
            disabled={!canRedo}
          />
        </ToolbarSection>
      </motion.div>

      {/* Editor Content Area - Enhanced Glass */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="relative border border-white/10 rounded-16px overflow-hidden
                   bg-slate-900/40 backdrop-blur-md
                   shadow-[0_4px_24px_rgba(0,0,0,0.2)]
                   transition-all duration-300 hover:border-white/15"
        style={{ borderRadius: "16px" }}
      >
        <EditorContent editor={editor} />

        {/* Word count indicator */}
        <div
          className="absolute bottom-12px right-16px flex items-center gap-12px text-12px text-slate-500"
          style={{
            bottom: "12px",
            right: "16px",
            gap: "12px",
            fontSize: "12px",
          }}
        >
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </motion.div>

      {/* Output Preview - Glass Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="border border-white/10 rounded-16px p-20px 
                   bg-slate-900/40 backdrop-blur-md min-h-150px
                   shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
        style={{
          borderRadius: "16px",
          padding: "20px",
          minHeight: "150px",
        }}
      >
        <div
          className="flex items-center justify-between mb-12px"
          style={{ marginBottom: "12px" }}
        >
          <p
            className="text-12px text-slate-500 font-semibold uppercase tracking-wider"
            style={{ fontSize: "12px" }}
          >
            Live Preview
          </p>
          <div className="flex items-center gap-6px" style={{ gap: "6px" }}>
            <div
              className="w-6px h-6px rounded-full bg-green-500 animate-pulse"
              style={{ width: "6px", height: "6px" }}
            />
            <span
              className="text-11px text-slate-500"
              style={{ fontSize: "11px" }}
            >
              Live
            </span>
          </div>
        </div>
        <div
          className="rich-output prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              output ||
              `<p className="text-slate-500 italic">${placeholder}</p>`,
          }}
        />
      </motion.div>
    </div>
  );
};

export default memo(RichEditor);
