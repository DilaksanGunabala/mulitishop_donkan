import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { writeBatch, doc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { slugify } from '../../utils/slugify';
import { FiUploadCloud, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const BATCH_SIZE = 490;
const REQUIRED_FIELDS = ['name', 'price', 'category'];

export default function BulkUpload() {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDone(false);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const validRows = [];
        const errs = [];

        data.forEach((row, i) => {
          const missing = REQUIRED_FIELDS.filter((f) => !row[f]?.toString().trim());
          if (missing.length > 0) {
            errs.push(`Row ${i + 2}: Missing fields: ${missing.join(', ')}`);
          } else {
            validRows.push({
              name: row.name.trim(),
              price: parseFloat(row.price),
              category: row.category.trim(),
              description: row.description?.trim() || '',
              featured: row.featured?.toLowerCase() === 'true',
              slug: slugify(row.name.trim()),
              images: [],
            });
          }
        });

        setRows(validRows);
        setErrors(errs);
      },
    });
  };

  const handleUpload = async () => {
    if (rows.length === 0) {
      toast.error('No valid rows to upload');
      return;
    }
    setUploading(true);
    try {
      const colRef = collection(db, 'products');
      let uploaded = 0;

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);
        chunk.forEach((row) => {
          const docRef = doc(colRef);
          batch.set(docRef, { ...row, createdAt: serverTimestamp() });
        });
        await batch.commit();
        uploaded += chunk.length;
      }

      toast.success(`Uploaded ${uploaded} products!`);
      setDone(true);
      setRows([]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Bulk Upload Products</h1>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700">
        <p className="font-semibold mb-2">CSV Format</p>
        <p>Required columns: <code className="bg-blue-100 px-1 rounded">name, price, category</code></p>
        <p>Optional columns: <code className="bg-blue-100 px-1 rounded">description, featured</code></p>
        <p className="mt-1">Categories: <code className="bg-blue-100 px-1 rounded">Fancy, Stationary, Others</code></p>
      </div>

      {/* File upload */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <FiUploadCloud size={20} />
          Select CSV File
        </button>
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4 space-y-1">
            <p className="font-semibold text-red-600 text-sm flex items-center gap-1">
              <FiAlertCircle size={16} /> {errors.length} row(s) have errors (will be skipped)
            </p>
            {errors.slice(0, 5).map((err, i) => (
              <p key={i} className="text-red-500 text-xs">{err}</p>
            ))}
            {errors.length > 5 && (
              <p className="text-red-400 text-xs">...and {errors.length - 5} more</p>
            )}
          </div>
        )}

        {/* Preview */}
        {rows.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              {rows.length} valid row(s) ready to upload
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {['name', 'price', 'category', 'description'].map((h) => (
                      <th key={h} className="px-3 py-2 font-medium capitalize">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 max-w-[150px] truncate">{row.name}</td>
                      <td className="px-3 py-2">₹{row.price}</td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2 max-w-[200px] truncate">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 5 && (
                <p className="text-center text-xs text-gray-400 py-2">
                  ...and {rows.length - 5} more rows
                </p>
              )}
            </div>
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <FiCheck size={18} /> Upload complete!
          </div>
        )}

        {rows.length > 0 && !done && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-60 font-semibold"
          >
            {uploading ? 'Uploading...' : `Upload ${rows.length} Products`}
          </button>
        )}
      </div>
    </div>
  );
}
