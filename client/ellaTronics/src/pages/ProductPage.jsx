import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';

const ProductPage = () => {

  const { BASE_URL } = useProductContext()
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for filters (you can replace with actual data from API)
  const locations = ['All', 'AASTU', 'woliso', 'ASTU'];
  const colors = ['All', 'Black', 'White', 'Blue', 'Red', 'Gray', 'Gold', 'Green'];
  const statuses = ['All', 'Available', 'Sold'];

  // Fetch products
  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      setProducts(parsedProducts || []);
      setFilteredProducts(parsedProducts || []);
      setLoading(false);
    } else {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/products/get-all-products`);
      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedColor, selectedStatus])
  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(product =>
        product.location.toLowerCase() === selectedLocation
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(product =>
        product.status === selectedStatus.toLowerCase()
      );
    }

    // Color filter
    if (selectedColor !== 'all') {
      filtered = filtered.filter(product =>
        product.color.toLowerCase() === selectedColor
      );
    }

    setFilteredProducts(filtered);
  }, [products, priceRange, selectedLocation, selectedStatus, selectedColor, searchTerm]);

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedLocation('all');
    setSelectedStatus('all');
    setSelectedColor('all');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Electronic Products
          </h1>
          <p className="text-gray-600">
            Discover premium electronics at amazing prices
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>


              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Price Range: Birr {priceRange[0]} - {priceRange[1]}
                </h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Birr 0</span>
                  <span>Birr 10,000</span>
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Location</h3>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  {locations.map((location) => (
                    <option key={location} value={location.toLowerCase()}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status.toLowerCase())}
                      className={`px-3 py-2 rounded-lg transition ${selectedStatus === status.toLowerCase()
                        ? status === 'Available'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                        : 'hover:bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color.toLowerCase())}
                      className={`px-3 py-2 cursor-pointer rounded-lg transition ${selectedColor === color.toLowerCase()
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'hover:bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-gray-700">
                  Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
                  <span className="font-semibold">{products.length}</span> products
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="lg:w-3/4">
            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                          e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
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
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: product.color.toLowerCase() }}></span>
                          {product.color}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">
                            Birr {product.price.toLocaleString()}
                          </span>
                        </div>
                        <Link
                          to={`/product-detail/${product._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                        >
                          View Details
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;