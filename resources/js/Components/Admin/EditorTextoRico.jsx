// resources/js/Components/Admin/EditorTextoRico.jsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading2, Undo2, Redo2 } from 'lucide-react';

export default function EditorTextoRico({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: 'Escreve o bloco de instrução...' }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    // ✅ Sincroniza quando o `value` externo muda (ex.: depois da IA)
    useEffect(() => {
        if (!editor) return;
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    if (!editor) return null;

    const Btn = ({ onClick, active, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded-lg transition ${
                active
                    ? 'bg-[#0A2540] text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="card-fb overflow-hidden">
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 flex-wrap">
                <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
                    <Bold size={16} />
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
                    <Italic size={16} />
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
                    <Heading2 size={16} />
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
                    <List size={16} />
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
                    <ListOrdered size={16} />
                </Btn>
                <Btn onClick={() => editor.chain().focus().undo().run()}>
                    <Undo2 size={16} />
                </Btn>
                <Btn onClick={() => editor.chain().focus().redo().run()}>
                    <Redo2 size={16} />
                </Btn>
            </div>
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-3 min-h-[100px] focus:outline-none dark:prose-invert"
            />
        </div>
    );
}
