import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/productService';
import ImageUploader from '../../components/ImageUploader';
import { toast } from 'react-toastify';

const CATEGORIES = ['Fancy', 'Stationary', 'Baby Needs', 'Plastic Items', 'Others'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Fancy',
    description: '',
    featured: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | uploading | saving | done

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    setStatus(imageFiles.length > 0 ? 'uploading' : 'saving');
    try {
      await addProduct({ ...form, price: parseFloat(form.price) }, imageFiles);
      setStatus('done');
      toast.success('Product added!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
      setStatus('idle');
    }
  };

  const saving = status !== 'idle' && status !== 'done';
  const btnLabel =
    status === 'uploading' ? 'Uploading images…' :
      status === 'saving' ? 'Saving…' :
        'Add Product';

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Product Name *">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="input"
            />
          </FormField>

          <FormField label="Price (₹) *">
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className="input"
            />
          </FormField>

          <FormField label="Category">
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Product description..."
              className="input resize-none"
            />
          </FormField>

          <div className="flex items-center gap-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Mark as Featured
            </label>
          </div>

          <FormField label="Images">
            <ImageUploader
              onNewFiles={setImageFiles}
              onRemoveExisting={() => { }}
            />
          </FormField>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-70 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {btnLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
