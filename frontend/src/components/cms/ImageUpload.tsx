'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file as any);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Featured Image
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        {preview ? (
          <div className="relative">
            <div className="relative h-48 w-full mb-4">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onChange('');
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Upload a file
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}