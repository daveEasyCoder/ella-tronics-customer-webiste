
import {
    MapPin,
    Eye,
    Calendar,
    Shield,
    TrendingUp,
    Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';

const ProductList = () => {
    const { products, loading, error } = useProductContext();




    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Loading Header */}
                    <div className="text-center mb-12 animate-pulse">
                        <div className="h-8 bg-gray-300 rounded-lg w-64 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded-lg w-96 mx-auto"></div>
                    </div>

                    {/* Loading Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                                <div className="h-64 bg-gray-300"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-gray-300 rounded-lg"></div>
                                    <div className="h-4 bg-gray-300 rounded-lg"></div>
                                    <div className="h-8 bg-gray-300 rounded-lg w-32"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[50vh] bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Products</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-[50vh] bg-gray-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-linear-to-r from-blue-100 to-indigo-100 rounded-2xl mb-4">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className=" text-3xl md:text-5xl font-bold text-gray-900 mb-3">
                        Discover Amazing Products
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse through our collection of premium products. All items are verified for quality assurance.
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-4">
                        <div className="flex items-center text-gray-500">
                            <Shield className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm">Verified Sellers</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div className="text-gray-500">
                            <span className="font-semibold text-blue-600">{products.length}</span> Products Available
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products?.slice(0, 8).map((product) => (
                        <div
                            key={product._id}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-100"
                        >
                            {/* Product Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src =
                                            "/imageNotFound.png";
                                    }}
                                />

                                {/* Status Badge */}
                                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold ${product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.status === 'available' ? 'Available' : 'Sold'}
                                </div>

                                {/* Price Tag Overlay */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                                    <div className="text-lg font-bold text-blue-600 flex items-center">
                                        <span>{product.price} ETB</span>
                                    </div>
                                </div>

                            </div>

                            {/* Product Info - Simplified */}
                            <div className="p-6">
                                {/* Product Name */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                                        {product.name}
                                    </h3>

                                    {/* Category/Location Row */}
                                    <div className="flex items-center justify-between">
                                        {/* Location */}
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-1.5" />
                                            <span className="text-sm font-medium">{product.location}</span>
                                        </div>

                                        {/* Color Indicator (if available) */}
                                        {product.color && (
                                            <div className="flex items-center">
                                                <div
                                                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                                    style={{ backgroundColor: product.color.toLowerCase() }}
                                                    title={`Color: ${product.color}`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Posted Date */}
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-400 text-xs">
                                            <Package className="h-3 w-3 mr-1.5" />
                                            <span className="font-medium">Listed</span>
                                        </div>
                                        <div className="flex items-center text-gray-400 text-xs">
                                            <Calendar className="h-3 w-3 mr-1.5" />
                                            <span>{formatDate(product.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <Link
                                    to={`/product-detail/${product._id}`}
                                    className="mt-5 w-full bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Full Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>


                <div className='flex items-center justify-center mt-8'>
                    <Link to='/products' className='border shadow-lg border-blue-600 border-md px-12 py-2 rounded-3xl text-blue-600 hover:bg-blue-600 hover:text-white duration-300 cursor-pointer'>View More</Link>
                </div>


            </div>
        </div>
    );
};

export default ProductList;