// src/components/ProductForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { CloudUpload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useProductContext } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CreateProduct = () => {
    const { BASE_URL } = useProductContext()
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        color: '',
        description: '',
        location: '',
        contact1: '',
        contact2: '',
        telegram: ''
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])
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
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            if (!image || !formData.name || !formData.price || !formData.location || !formData.contact1) {
                setError('Please fill all required fields: Name, Price, Location, Primary Contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            // Create FormData for file upload
            const formDataToSend = new FormData();

            // Append form fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append image file
            if (image) {
                formDataToSend.append('image', image);
            }


            // Make API call with progress tracking
            const response = await axios.post(`${BASE_URL}/api/products/create-product`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            if (response.data.success) {
                setSuccess(true);

                setFormData({
                    name: '',
                    price: '',
                    color: '',
                    description: '',
                    location: '',
                    contact1: '',
                    contact2: '',
                    telegram: ''
                });
                setImage(null);
                setImagePreview('');
                setUploadProgress(0);
                localStorage.setItem("adminProducts",JSON.stringify(response.data.data))
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            }

        } catch (err) {
            console.log(err);
            if (err.response) {
                if ((err.response.status === 401) || (err.response.status === 403)) {
                    navigate('/login');
                    return;
                }

                setError(err.response?.data?.message || 'Failed to create product. Please try again.');

            } else {
                setError('Connection problem! Please try again later.');
            }

        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        setFormData({
            name: '',
            price: '',
            color: '',
            description: '',
            location: '',
            contact1: '',
            contact2: '',
            telegram: ''
        });
        setImage(null);
        setImagePreview('');
        setError('');
        setSuccess(false);
        setUploadProgress(0);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:ml-55 pt-20 pb-15">
            <div className="max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Create New Product
                    </h1>
                    <p className="text-gray-600">
                        Fill in the details below to add a new product to your inventory
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                            <p className="text-green-800 font-medium">Product created successfully!</p>
                            <p className="text-green-600 text-sm">Your product has been added to the inventory.</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                            <p className="text-red-800 font-medium">Error</p>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {/* Two Column Layout for Large Screens */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Image Upload */}
                            <div>
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Product Image <span className="text-red-500">*</span>
                                    </label>

                                    {/* Image Upload Area */}
                                    <div className="relative">
                                        {imagePreview ? (
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <XCircle className="h-5 w-5" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 text-center">
                                                    {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
                                                </p>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <CloudUpload className="h-12 w-12 text-gray-400 mb-4" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, WebP, AVIF (MAX. 3MB)
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                                                    onChange={handleImageChange}
                                                // required
                                                />
                                            </label>
                                        )}
                                    </div>

                                    {/* Upload Progress */}
                                    {loading && uploadProgress > 0 && uploadProgress < 100 && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Uploading...</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Primary Contact <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="contact1"
                                            value={formData.contact1}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Phone number or email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Secondary Contact
                                        </label>
                                        <input
                                            type="text"
                                            name="contact2"
                                            value={formData.contact2}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Optional"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Telegram Username
                                        </label>
                                        <input
                                            type="text"
                                            name="telegram"
                                            value={formData.telegram}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="@username"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Details */}
                            <div>
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>

                                    {/* Description Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                            <span>Minimum 10 characters</span>
                                            <span className={formData.description.length > 500 ? 'text-orange-500' : ''}>
                                                {formData.description.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                $
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
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Color
                                        </label>
                                        <div className="flex items-center space-x-4">
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
                                                    className="w-10 h-10 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: formData.color.toLowerCase() }}
                                                ></div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="City, State, Country"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                Creating Product...
                                            </>
                                        ) : (
                                            'Create Product'
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-6 py-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Reset Form
                                    </button>
                                </div>

                                {/* Form Tips */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-800 mb-2">Tips:</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Fields marked with <span className="text-red-500">*</span> are required</li>
                                        <li>• Write a detailed description (minimum 10 characters)</li>
                                        <li>• Upload a clear, high-quality product image</li>
                                        <li>• Provide accurate contact information for buyers</li>
                                        <li>• Use descriptive product names</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>By creating a product, you agree to our terms of service</p>
                    <p className="mt-1">© 2024 Product Manager. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;