import React, { useEffect, useRef, useState, useCallback } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import HardBreak from '@tiptap/extension-hard-break'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import '../../../tiptap.css'

import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
  MdCode,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdChecklist,
  MdLink,
  MdImage,
  MdHorizontalRule,
  MdUndo,
  MdRedo,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdHighlight,
  MdFormatQuote,
} from 'react-icons/md'

export default function RichEditor({ output, setOutput }) {
  const editorRef = useRef(null)
  const updateTimer = useRef(null)

  // -----------------------------------------------------------
  // ✅ Custom HardBreak to map Shift+Enter → line break
  // -----------------------------------------------------------
  const HardBreakWithKey = HardBreak.extend({
    addKeyboardShortcuts() {
      return {
        'Shift-Enter': () => this.editor.chain().focus().setHardBreak().run(),
      }
    },
  })

  // -----------------------------------------------------------
  // ✅ Editor Setup (Clean, Stable, Optimal)
  // -----------------------------------------------------------
  const editor = useEditor({
    content: output || '<p>Start typing...</p>',

    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { class: 'rtp' } },
        heading: { HTMLAttributes: { class: 'rth' } },
        bulletList: true,
        orderedList: true,
      }),

      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Link.configure({ openOnClick: true }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),

      Dropcursor.configure({ width: 2, class: 'dropcursor' }),
      Gapcursor,
      HardBreakWithKey,
    ],

    editorProps: {
      attributes: {
        class:
          'rich-editor-content rounded-lg custom-scrollbar outline-none ' +
          'min-h-[200px] bg-transparent md:p-[0.9vw] sm:p-[1.4vw] p-[1.9vw]',
        spellcheck: 'true',
      },

      // ✅ Remove Tiptap default margins for perfect spacing
      handleDOMEvents: {
        beforeinput: () => false,
      },
    },

    // -----------------------------------------------------------
    // ✅ Debounced onChange (fixed jitter)
    // -----------------------------------------------------------
    onUpdate: ({ editor }) => {
      if (updateTimer.current) clearTimeout(updateTimer.current)
      updateTimer.current = setTimeout(() => {
        setOutput(editor.getHTML())
      }, 120)
    },
  })

  // Keep editor instance
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // -----------------------------------------------------------
  // ✅ Task list sync — consistent & efficient
  // -----------------------------------------------------------
  useEffect(() => {
    if (!editor) return

    const sync = root => {
      const container = document.querySelector(root)
      if (!container) return

      container.querySelectorAll('.task-list-item').forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]')
        checkbox?.checked ? li.classList.add('checked') : li.classList.remove('checked')
      })
    }

    sync('.rich-editor-content')
    sync('.rich-output')

    // observe live editor updates
    const target = document.querySelector('.rich-editor-content')
    if (!target) return

    const mo = new MutationObserver(() => sync('.rich-editor-content'))
    mo.observe(target, { childList: true, subtree: true, attributes: true })

    return () => mo.disconnect()
  }, [editor])

  useEffect(() => {
    if (!editor) return
    // Only update if editor is empty (first load)
    const html = output?.trim()
    if (html && editor.getHTML() !== html) {
      editor.commands.setContent(html, false) // false preserves undo history
    }
  }, [editor, output])

  if (!editor) return null

  const btnBase =
    'md:p-[0.7vw] sm:p-[1.2vw] xs:p-[1.7vw] md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw] transition flex items-center justify-center md:text-[1.3vw] sm:text-[2.3vw] xs:text-[3.3vw]'
  const btnActive = 'bg-white/12 scale-105'

  const textColors = ['#111827', '#ffffff', '#ef4444', '#16a34a', '#2563eb', '#f59e0b']
  const highlightColors = ['#fff9c4', '#ffd7d7', '#d4f8d4', '#dbeafe', '#ffe9d2']

  const isActive = (name, arg) => {
    try {
      if (!editor) return false
      return editor.isActive(name, arg)
    } catch (e) {
      return false
    }
  }

  return (
    <div className="w-full md:space-y-[0.9vw] sm:space-y-[1.4vw] xs:space-y-[1.9vw]">
      {/* Toolbar (unchanged layout) */}
      <div className="w-full flex flex-wrap items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] md:p-[0.9vw] sm:p-[1.4vw] xs:p-[1.9vw] backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-lg">
        {/* Formatting */}
        <div className="flex items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] border-r border-white/20 md:pr-[1vw] sm:pr-[1.5vw] xs:pr-[2vw]">
          <button
            type="button"
            aria-label="Bold"
            className={`${btnBase} ${isActive('bold') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <MdFormatBold />
          </button>

          <button
            type="button"
            aria-label="Italic"
            className={`${btnBase} ${isActive('italic') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <MdFormatItalic />
          </button>

          <button
            type="button"
            aria-label="Underline"
            className={`${btnBase} ${isActive('underline') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <MdFormatUnderlined />
          </button>

          <button
            type="button"
            aria-label="Strike"
            className={`${btnBase} ${isActive('strike') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strike"
          >
            <MdStrikethroughS />
          </button>

          <button
            type="button"
            aria-label="Code"
            className={btnBase}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Code"
          >
            <MdCode />
          </button>

          <button
            type="button"
            aria-label="Highlight"
            className={`${btnBase} ${isActive('highlight') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Highlight"
          >
            <MdHighlight />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] border-r border-white/20 md:pr-[1vw] sm:pr-[1.5vw] xs:pr-[2vw]">
          {['paragraph', 1, 2, 3, 4, 5].map(v => (
            <button
              key={String(v)}
              type="button"
              className={`${btnBase} hover:bg-white/10 transition ${
                (v === 'paragraph' && isActive('paragraph')) ||
                (v !== 'paragraph' && isActive('heading', { level: v }))
                  ? 'bg-white/12'
                  : ''
              }`}
              onClick={() => {
                if (v === 'paragraph') editor.chain().focus().setParagraph().run()
                else editor.chain().focus().toggleHeading({ level: v }).run()
              }}
            >
              {v === 'paragraph' ? 'P' : `H${v}`}
            </button>
          ))}
        </div>

        {/* Lists */}
        <div className="flex items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] border-r border-white/20 md:pr-[1vw] sm:pr-[1.5vw] xs:pr-[2vw]">
          <button
            type="button"
            aria-label="Bullet list"
            className={`${btnBase} ${isActive('bulletList') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <MdFormatListBulleted />
          </button>
          <button
            type="button"
            aria-label="Ordered list"
            className={`${btnBase} ${isActive('orderedList') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <MdFormatListNumbered />
          </button>
          <button
            type="button"
            aria-label="Task list"
            className={`${btnBase} ${isActive('taskList') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <MdChecklist />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] border-r border-white/20 md:pr-[1vw] sm:pr-[1.5vw] xs:pr-[2vw]">
          <button
            type="button"
            aria-label="Align left"
            className={`${btnBase} ${isActive('textAlign', { align: 'left' }) ? btnActive : ''}`}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <MdFormatAlignLeft />
          </button>
          <button
            type="button"
            aria-label="Align center"
            className={`${btnBase} ${isActive('textAlign', { align: 'center' }) ? btnActive : ''}`}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <MdFormatAlignCenter />
          </button>
          <button
            type="button"
            aria-label="Align right"
            className={`${btnBase} ${isActive('textAlign', { align: 'right' }) ? btnActive : ''}`}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <MdFormatAlignRight />
          </button>
          <button
            type="button"
            aria-label="Justify"
            className={`${btnBase} ${isActive('textAlign', { align: 'justify' }) ? btnActive : ''}`}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <MdFormatAlignJustify />
          </button>
        </div>

        {/* Blockquote Button */}
        <div className="flex items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] border-r border-white/20 md:pr-[1vw] sm:pr-[1.5vw] xs:pr-[2vw]">
          <button
            type="button"
            aria-label="Blockquote"
            className={`${btnBase} ${isActive('blockquote') ? btnActive : ''}`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <MdFormatQuote />
          </button>
        </div>

        {/* Color pickers */}
        <div className="flex items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] border-r border-white/20 md:pr-[1vw] sm:pr-[1.5vw] xs:pr-[2vw]">
          <div className="flex items-center gap-1">
            {textColors.map(color => (
              <button
                key={color}
                type="button"
                aria-label={`Text color ${color}`}
                className="md:w-[1.5vw] sm:w-[2.5vw] xs:w-[3.5vw] md:h-[1.5vw] sm:h-[2.5vw] xs:h-[3.5vw] rounded-full border border-white/20 hover:scale-110 transition ring-0 focus:ring-2 focus:ring-offset-1"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {highlightColors.map(color => (
              <button
                key={color}
                type="button"
                aria-label={`Highlight ${color}`}
                className="md:w-[1.5vw] sm:w-[2.5vw] xs:w-[3.5vw] md:h-[1.5vw] sm:h-[2.5vw] xs:h-[3.5vw] rounded-md border border-white/20 hover:scale-110 transition"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setHighlight({ color }).run()}
              />
            ))}
          </div>

          <button
            type="button"
            className={`${btnBase}`}
            onClick={() => editor.chain().focus().unsetColor().unsetHighlight().run()}
            title="Clear colors"
          >
            Clear
          </button>
        </div>

        {/* Insert */}
        <div className="flex items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] border-r border-white/20 md:pr-[1vw] sm:pr-[1.5vw] xs:pr-[2vw]">
          <button
            type="button"
            aria-label="Insert image"
            className={btnBase}
            onClick={() => {
              const src = prompt('Image URL:')
              if (src) editor.chain().focus().setImage({ src }).run()
            }}
          >
            <MdImage />
          </button>
          <button
            type="button"
            aria-label="Insert link"
            className={btnBase}
            onClick={() => {
              const url = prompt('Enter URL:')
              if (url) editor.chain().focus().setLink({ href: url }).run()
            }}
          >
            <MdLink />
          </button>
          <button
            type="button"
            aria-label="Horizontal rule"
            className={btnBase}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <MdHorizontalRule />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center md:gap-[.0.8vw] sm:gap-[1.3vw] xs:gap-[1.8vw] ml-auto">
          <button
            type="button"
            aria-label="Undo"
            className={btnBase}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <MdUndo />
          </button>
          <button
            type="button"
            aria-label="Redo"
            className={btnBase}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <MdRedo />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="border border-white/10 md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw] p-0 bg-white/5 backdrop-blur-xl">
        <EditorContent editor={editor} />
      </div>

      {/* Output Preview */}
      <div className="border border-white/10 md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw] md:p-[0.9vw] sm:p-[1.4vw] xs:p-[1.9vw] bg-white/5 backdrop-blur-xl min-h-[150px]">
        <div className="rich-output" dangerouslySetInnerHTML={{ __html: output }} />
      </div>
    </div>
  )
}
