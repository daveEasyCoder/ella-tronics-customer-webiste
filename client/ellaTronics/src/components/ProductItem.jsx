
import { Link } from 'react-router-dom';

const ProductItem = ({product}) => {
    return (
        <div
            key={product._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
        >
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src =
                            "/imageNotFound.png";
                    }}
                />
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${product.status === 'available'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {product.status === 'available' ? 'Available' : 'Sold'}
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
                {/* Location */}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {product.location}
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                </h3>

                {/* Color */}
                {product.color && (
                    <div className="hidden sm:flex items-center text-sm text-gray-600 mb-3">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: product.color.toLowerCase() }}></span>
                        {product.color}
                    </div>
                )}

                {/* Price */}
                <div className="flex justify-between items-center">
                    <div>
                        <span className="md:text-2xl font-bold text-blue-600">
                            Birr {product.price.toLocaleString()}
                        </span>
                    </div>
                    <Link
                        to={`/product-detail/${product._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                    >
                       <span className='flex items-center gap-1'>
                         <span>View</span> <span className='hidden sm:flex'>Details</span>
                       </span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductItem