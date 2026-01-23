// src/pages/admin/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  DollarSign,
  MapPin,
  Phone,
  MessageSquare,
  FileText,
  XCircle,
  Upload,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useProductContext } from '../../context/ProductContext';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { BASE_URL } = useProductContext();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    color: '',
    location: '',
    contact1: '',
    contact2: '',
    telegram: '',
    status: 'available'
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  // Fetch product data
  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/products/get-single-product/${id}`);

      if (response.data.success) {
        const product = response.data.data;
        setFormData({
          name: product.name || '',
          price: product.price || '',
          description: product.description || '',
          color: product.color || '',
          location: product.location || '',
          contact1: product.contact1 || '',
          contact2: product.contact2 || '',
          telegram: product.telegram || '',
          status: product.status || 'available'
        });
        setImagePreview(product.image || '');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, WebP, AVIF)');
        return;
      }

      // Validate file size (3MB)
      if (file.size > 3 * 1024 * 1024) {
        setError('Image size should be less than 3MB');
        return;
      }

      setImage(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.name || !formData.price || !formData.location || !formData.contact1) {
        setError('Please fill all required fields: Name, Price, Location, Primary Contact');
        setSaving(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const formDataToSend = new FormData();

      // Append form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await axios.put(
        `${BASE_URL}/api/products/edit-product/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setSuccess('Product updated successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error updating product:', err);
      if (err.response) {
        if(err.response.status === 401 || err.response.status ===403){
          navigate('/admin-login');
          return;
        }
        setError(err.response?.data?.message || 'Failed to update product. Please try again.');
      } else {
        setError('Server not responding! Please try again later.');
      }

    } finally {
      setSaving(false);
    }
  };

  // Reset form to original data
  const handleReset = () => {
    fetchProductData();
    setImage(null);
    setImagePreview(formData.image || '');
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 sm:ml-55">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-300 rounded-xl"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 sm:ml-55 mt-15">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">Update product information and images</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-800">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div className="text-red-800">{error}</div>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Image Upload */}
            <div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Product Image</h2>
                </div>

                {/* Image Upload Area */}
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-64 object-contain bg-gray-50 rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        {image ? `${image.name} (${(image.size / 1024 / 1024).toFixed(2)} MB)` : 'Current product image'}
                      </p>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WebP, AVIF (MAX. 3MB)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Leave empty to keep current image
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden box-border"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                {/* Image Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Note:</span> Upload a new image to replace the current one.
                    Leave empty to keep the existing image.
                  </p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="available"
                      checked={formData.status === 'available'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 text-center transition-all ${formData.status === 'available'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}>
                      <div className="font-medium">Available</div>
                      <div className="text-sm mt-1">Product is for sale</div>
                    </div>
                  </label>

                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="sold"
                      checked={formData.status === 'sold'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 text-center transition-all ${formData.status === 'sold'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}>
                      <div className="font-medium">Sold</div>
                      <div className="text-sm mt-1">Product is sold out</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-8">
              {/* Product Information Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Product Information</h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border box-border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter product name"

                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <DollarSign className="h-5 w-5" />
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="0.00"
                        min="0"
                        step="0.01"

                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="e.g., Red, Blue, Black"
                      />
                      {formData.color && (
                        <div
                          className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: formData.color.toLowerCase() }}
                          title={formData.color}
                        ></div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="City, State, Country"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      placeholder="Describe your product in detail..."
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Optional but recommended</span>
                      <span>{formData.description.length}/500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

                <div className="space-y-6">
                  {/* Primary Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Contact <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Phone className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="contact1"
                        value={formData.contact1}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Phone number or email"
                        required
                      />
                    </div>
                  </div>

                  {/* Secondary Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Contact
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Phone className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="contact2"
                        value={formData.contact2}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Optional backup contact"
                      />
                    </div>
                  </div>

                  {/* Telegram */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <MessageSquare className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        name="telegram"
                        value={formData.telegram}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Updating Product...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Changes
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Form Tips */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Editing Tips:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Fields marked with <span className="text-red-500">*</span> are required</li>
              <li>• Upload a new image only if you want to replace the current one</li>
              <li>• Update contact information carefully - customers will see this</li>
              <li>• Set status to "Sold" when the product is no longer available</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;