// src/pages/admin/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  MapPin,
  Phone,
  MessageSquare,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Package,
  Share2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useProductContext } from '../../context/ProductContext';


const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { BASE_URL } = useProductContext();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/products/get-single-product/${id}`);
      
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProducts = JSON.parse(localStorage.getItem("adminProducts"));
    if (storedProducts) {
      const prod = storedProducts.find(p => p._id === id);
      if (prod) {
        setProduct(prod);
        setLoading(false);
      } else {
        fetchProductDetails();
      }
    } else {
      fetchProductDetails();
    }
  }, [id]);


  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Copy to clipboard
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(''), 2000);
    });
  };



  // Update product status
  const updateProductStatus = async (newStatus) => {
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/products/edit-product/${id}`, { status: newStatus });
      setProduct(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update product status.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 ml-17 sm:ml-55 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:ml-55">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/admin/product-list')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 sm:ml-55 mt-14">
      <div className="max-w-7xl mx-auto">
        {/* Header with Actions */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/product-list')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
                <p className="text-gray-600 mt-1">Complete product information and management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/admin/edit-product/${id}`)}
                className="px-4 py-2.5 text-xs sm:text-sm cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 font-medium"
              >
                <Edit className="h-4 w-4" />
                Edit Product
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow border border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                product.status === 'available' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {product.status === 'available' ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Available
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    Sold
                  </>
                )}
              </div>
              
              <div className="sm:text-xl font-bold text-blue-600  flex items-center">
                {product.price} ETB
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateProductStatus(
                  product.status === 'available' ? 'sold' : 'available'
                )}
                className={`px-4 py-2 hidden sm:block  rounded-lg sm:font-medium ${
                  product.status === 'available'
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                }`}
              >
                {product.status === 'available' ? 'Mark as Sold' : 'Mark as Available'}
              </button>
              
              <button
                onClick={() => navigate(`/admin/product-list/`)}
                className="px-4 py-2 hidden sm:flex bg-gray-100 cursor-pointer text-gray-700 rounded-lg hover:bg-gray-200 items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Product Lists
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image & Basic Info */}
          <div className="space-y-8">
            {/* Product Image */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Product Image</h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x600/4F46E5/FFFFFF?text=Product+Image';
                        e.target.className = 'w-full h-full object-cover';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Product Information</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Name & Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Product Name</label>
                    <div className="text-xl font-semibold text-gray-900">{product.name}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Price</label>
                      <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                        {product.price} ETB
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Color</label>
                      <div className="flex items-center gap-3">
                        {product.color ? (
                          <>
                            <div 
                              className="w-8 h-8 rounded border-2 border-gray-300 shadow-sm"
                              style={{ backgroundColor: product.color.toLowerCase() }}
                              title={product.color}
                            />
                            <span className="font-medium text-gray-900">{product.color}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      {product.location}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      product.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'available' ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Available for Sale
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Sold Out
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Description & Contact */}
          <div className="space-y-8">
            {/* Product Description */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Product Description</h2>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  {product.description ? (
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {product.description}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-center py-8">
                      No description provided for this product.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>
                
                <div className="space-y-4">
                  {/* Primary Contact */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Primary Contact</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(product.contact1, 'contact1')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {copied === 'contact1' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="font-mono text-lg text-gray-900">{product.contact1}</div>
                  </div>

                  {/* Secondary Contact */}
                  {product.contact2 && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-gray-700">Secondary Contact</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(product.contact2, 'contact2')}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          {copied === 'contact2' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-mono text-lg text-gray-900">{product.contact2}</div>
                    </div>
                  )}

                  {/* Telegram */}
                  {product.telegram && (
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-indigo-600" />
                          <span className="font-medium text-indigo-800">Telegram</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(product.telegram, 'telegram')}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          {copied === 'telegram' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-mono text-lg text-gray-900">{product.telegram}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Metadata */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Product Metadata</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(product.createdAt)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(product.updatedAt)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Product ID</label>
                    <div className="font-mono text-sm text-gray-600 truncate">{product._id}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Quick Actions</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(window.location.href, 'link')}
                        className="p-2 text-gray-600 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Copy link"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
         
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Need to make changes?</h3>
              <p className="text-sm text-gray-600">Edit product details or contact information</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/admin/edit-product/${id}`)}
                className="px-6 py-3 cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium"
              >
                <Edit className="h-4 w-4 inline mr-2" />
                Edit Product
              </button>
              
        
              
              <button
                onClick={() => navigate('/admin/product-list')}
                className="px-6 py-3 border border-gray-300 cursor-pointer text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                <ArrowLeft className="h-4 w-4 inline mr-2" />
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminProductDetail;