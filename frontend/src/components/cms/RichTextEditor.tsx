'use client';

import { Textarea } from '@/components/ui/Textarea';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

export function RichTextEditor({
    value,
    onChange,
    label = 'Content',
    placeholder = 'Write your content here...'
}: RichTextEditorProps) {
    return (
        <div>
            <Textarea
                label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={15}
            />
        </div>
    );
}