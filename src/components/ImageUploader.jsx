import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';

export default function ImageUploader({ existingImages = [], onNewFiles, onRemoveExisting }) {
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    onNewFiles(files);
  };

  const removePreview = (idx) => {
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      onNewFiles(updated.map((p) => p.file));
      return updated;
    });
  };

  return (
    <div className="space-y-3">
      {/* Existing images */}
      {existingImages.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Existing Images</p>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((url) => (
              <div key={url} className="relative group">
                <img src={url} alt="existing" className="w-20 h-20 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New previews */}
      {previews.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">New Images</p>
          <div className="flex flex-wrap gap-2">
            {previews.map((p, idx) => (
              <div key={idx} className="relative group">
                <img src={p.url} alt="preview" className="w-20 h-20 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => removePreview(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
      >
        <FiUploadCloud size={18} />
        Click to upload images
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}
