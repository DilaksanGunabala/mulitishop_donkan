import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductBySlug } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import StarRating from '../../components/StarRating';
import WishlistButton from '../../components/WishlistButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openDrawer } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug)
      .then((data) => {
        if (!data) {
          toast.error('Product not found');
          navigate('/products');
          return;
        }
        setProduct(data);
      })
      .catch((err) => {
        toast.error(err.message);
        navigate('/products');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (!product) return null;

  const { name, price, category, description, images = [], id } = product;
  const imgSrc = images[activeImg] || 'https://via.placeholder.com/500x500?text=No+Image';

  const handleAddToCart = () => {
    addToCart(product);
    openDrawer();
    toast.success(`${name} added to cart!`);
  };

  return (
    <>
      <Helmet>
        <title>{name} — New Multi Shop</title>
        <meta name="description" content={description || `Buy ${name} at New Multi Shop.`} />
        <meta property="og:title" content={`${name} — New Multi Shop`} />
        <meta property="og:description" content={description || `Buy ${name} at New Multi Shop.`} />
        {images[0] && <meta property="og:image" content={images[0]} />}
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50 relative">
              <img
                src={imgSrc}
                alt={name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <WishlistButton productId={id} />
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImg === i ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-5">
            {category && (
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium">
                {category}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-3xl font-extrabold text-blue-600">
              Rs.{Number(price).toLocaleString('en-IN')}
            </p>

            {description && (
              <p className="text-gray-600 leading-relaxed">{description}</p>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg"
            >
              Add to Cart
            </button>

            <hr className="border-gray-100" />

            <div>
              <p className="font-semibold text-gray-700 mb-2">Rate this product</p>
              <StarRating productId={id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
