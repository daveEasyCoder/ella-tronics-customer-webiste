
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
import ProductItem from '../components/ProductItem';

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

    if (loading && products?.length === 0) {
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
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 md:mb-8 py-12 px-2 lg:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-linear-to-r from-blue-100 to-indigo-100 rounded-2xl mb-4">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-3">
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
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4">
                    {products?.slice(0, 8).map((product) => (
                      <ProductItem product={product} />
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