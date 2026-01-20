// src/components/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'
import {
    ArrowLeft,
    MapPin,
    Phone,
    MessageSquare,
    Calendar,
    Tag,
    CheckCircle,
    Shield,
    Star,
    Share2,
    Heart,
    AlertCircle,
    DollarSign,
    Palette,
    FileText,
    Globe,
    Clock,
    Users,
    Package
} from 'lucide-react';
import { useProductContext } from '../context/ProductContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { BASE_URL } = useProductContext();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedText, setCopiedText] = useState("");
    

    // Fetch product details
    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`${BASE_URL}/api/products/get-single-product/${id}`);

            if (response.data.success) {
                setProduct(response.data.data);
                setActiveImage(response.data.data.image);
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
        if (id) {
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

    // Calculate time ago
    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return `${Math.floor(diffInDays / 30)} months ago`;
    };

    // Copy to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setCopiedText(text)
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Share product
    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `Check out this product: ${product.name}`,
                url: window.location.href,
            });
        } else {
            copyToClipboard(window.location.href);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading product details..." />;
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/')}
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
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            {/* Back Navigation */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Products
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Product Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.status === 'available' ? 'Available' : 'Sold'}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {getTimeAgo(product.createdAt)}
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span className="text-lg">{product.location}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-3 rounded-full border ${isFavorite ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`}
                            >
                                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-600' : ''}`} />
                            </button>

                            <button
                                onClick={shareProduct}
                                className="p-3 rounded-full border border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>

                            <div className="text-3xl font-bold text-blue-600">
                                {(product.price)} ETB
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images & Description */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Image */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                            <div className="relative h-[500px] bg-gray-50">
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Product+Image';
                                        e.target.className = 'w-full h-full object-cover';
                                    }}
                                />
                                <div className="absolute top-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                                        <div className="text-2xl font-bold text-blue-600 flex items-center">
                                            <span>{product.price} ETB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-gray-900">Product Description</h2>
                                </div>

                                <div className="prose prose-lg max-w-none">
                                    {product.description ? (
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {product.description}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 italic">No description provided.</div>
                                    )}
                                </div>

                                {/* Product Features */}
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {product.color && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Palette className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Color</div>
                                                    <div className="font-medium text-gray-900">{product.color}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Package className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <div className="text-sm text-gray-500">Condition</div>
                                                <div className="font-medium text-gray-900">Excellent</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <div className="text-sm text-gray-500">Verification</div>
                                                <div className="font-medium text-green-600 flex items-center">
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Verified Seller
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <div className="text-sm text-gray-500">Listed On</div>
                                                <div className="font-medium text-gray-900">{formatDate(product.createdAt)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Seller Info & Actions */}
                    <div className="space-y-8">
                        {/* Seller Information Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Seller Information</h3>
                                        <div className="flex items-center text-green-600 text-sm">
                                            <Shield className="h-4 w-4 mr-1" />
                                            Verified Seller
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information - Hidden by default */}

                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="text-sm text-blue-800 font-medium mb-2">Primary Contact</div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-5 w-5 text-blue-600" />
                                                <span className="font-mono text-gray-900">{product.contact1}</span>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(product.contact1)}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                {copied && copiedText === product.contact1 ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>

                                    {product.contact2 && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600 font-medium mb-2">Secondary Contact</div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-5 w-5 text-gray-600" />
                                                    <span className="font-mono text-gray-900">{product.contact2}</span>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(product.contact2)}
                                                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                                                >
                                                    {copied && copiedText === product.contact2 ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {product.telegram && (
                                        <div className="p-4 bg-indigo-50 rounded-lg">
                                            <div className="text-sm text-indigo-800 font-medium mb-2">Telegram</div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                                                    <span className="font-mono text-gray-900">{product.telegram}</span>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(product.telegram)}
                                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                                >
                                                    {copied && copiedText === product.telegram ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                            <div className="text-sm text-green-800">
                                                <p className="font-medium mb-1">Safety Tips</p>
                                                <p>• Meet in public places</p>
                                                <p>• Verify product before payment</p>
                                                <p>• Never share personal information</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                    <h3 className="text-xl font-bold text-gray-900">Location</h3>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-lg font-medium text-gray-900 mb-2">{product.location}</div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Globe className="h-4 w-4 mr-1" />
                                        Local Pickup Available
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <span className="font-medium">Note:</span> Confirm pickup location with seller before visiting.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    if (product.telegram) {
                                        // Extract username (remove @ if present)
                                        const username = product.telegram.replace('@', '');
                                        // Open Telegram in new tab
                                        window.open(`https://t.me/${username}`, '_blank', 'noopener,noreferrer');
                                    } else {
                                        alert("No telegram account found")
                                    }
                                }}
                                className='w-full cursor-pointer font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center bg-linear-to-r from-[#0088cc] to-[#0077b5] hover:from-[#0077b5] hover:to-[#0066a0] text-white'
                            >

                                <svg
                                    className="h-5 w-5 mr-3 fill-current"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                                Contact on Telegram
                            </button>

                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="h-6 w-6 text-green-600" />
                            <h3 className="text-xl font-bold text-gray-900">Buyer Protection</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                Verified seller identity
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                Secure communication
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                24/7 customer support
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-gray-900">Safety Tips</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li>• Meet in public, well-lit areas</li>
                            <li>• Inspect product thoroughly before payment</li>
                            <li>• Avoid advance payments</li>
                            <li>• Trust your instincts</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Tag className="h-6 w-6 text-purple-600" />
                            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={shareProduct}
                                className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                            >
                                <Share2 className="h-5 w-5" />
                                Share this Product
                            </button>
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                            >
                                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>

                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

const LoadingSpinner = ({ message = 'Loading...' }) => (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{message}</p>
        </div>
    </div>
);

export default ProductDetail;