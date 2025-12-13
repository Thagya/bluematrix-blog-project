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
            <div className="mt-2 text-sm text-gray-500">
                <p className="mb-1">You can use basic HTML tags for formatting:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;
                </code>
            </div>
        </div>
    );
}