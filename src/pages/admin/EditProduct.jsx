import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/productService';
import ImageUploader from '../../components/ImageUploader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const CATEGORIES = ['Fancy', 'Stationary', 'Others'];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    getProductById(id)
      .then((product) => {
        if (!product) {
          toast.error('Product not found');
          navigate('/admin/products');
          return;
        }
        setForm({
          name: product.name || '',
          price: product.price || '',
          category: product.category || 'Fancy',
          description: product.description || '',
          featured: product.featured || false,
          images: product.images || [],
        });
      })
      .catch((err) => toast.error(err.message));
  }, [id]);

  if (!form) return <LoadingSpinner message="Loading product..." />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRemoveExisting = (url) => {
    setRemovedImages((prev) => [...prev, url]);
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    setStatus(imageFiles.length > 0 ? 'uploading' : 'saving');
    try {
      await updateProduct(
        id,
        { ...form, price: parseFloat(form.price) },
        imageFiles,
        removedImages
      );
      toast.success('Product updated!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
      setStatus('idle');
    }
  };

  const saving = status !== 'idle';
  const btnLabel =
    status === 'uploading' ? 'Uploading images…' :
    status === 'saving'    ? 'Saving…' :
                             'Update Product';

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Product Name *">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
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
            <label htmlFor="featured" className="text-sm text-gray-700">Mark as Featured</label>
          </div>

          <FormField label="Images">
            <ImageUploader
              existingImages={form.images}
              onNewFiles={setImageFiles}
              onRemoveExisting={handleRemoveExisting}
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
