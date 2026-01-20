// src/pages/admin/ProductList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Eye,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';

const AdminProductList = () => {

  const { BASE_URL } = useProductContext()
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/products/admin-get-all-products`, { withCredentials: true });

      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.response) {
        if ((err.response.status === 401) || (err.response.status === 403)) {
          navigate('/login');
          return;
        }
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
          return;
        }
        setError('Failed to load products. Please try again later.');
      } else {
        setError('Server is not responding. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = products;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(product => product.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [products, searchTerm, statusFilter, sortConfig]);



  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/api/products/delete-product/${id}`, { withCredentials: true });
      setProducts(products.filter(product => product._id !== id));
      setProductToDelete(null);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting product:', err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
      } else {
        setError('Failed to delete product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update product status
  const updateProductStatus = async (id, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/products/edit-product/${id}`, { status: newStatus }, { withCredentials: true });
      setProducts(products.map(product =>
        product._id === id ? { ...product, status: newStatus } : product
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || 'Failed to update product status.');
      } else {
        setError('Failed to update product status.');
      }
    }
  };

  // Table headers - REMOVED Date Added column
  const tableHeaders = [
    { key: 'image', label: 'Image', width: 'w-24', sortable: false },
    { key: 'name', label: 'Product Name', width: 'w-1/3', sortable: true },
    { key: 'price', label: 'Price', width: 'w-32', sortable: true },
    { key: 'color', label: 'Color', width: 'w-32', sortable: true },
    { key: 'status', label: 'Status', width: 'w-32', sortable: true },
    { key: 'actions', label: 'Actions', width: 'w-48', sortable: false }
  ];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 ml-17 sm:ml-55">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            {/* Table skeleton */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b">
                  <div className="grid grid-cols-6 gap-4">
                    {[...Array(6)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 ml-17 sm:ml-55 mt-14 pb-15">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} • Total value: {(products.reduce((sum, p) => sum + p.price, 0))}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/create-product"
                className="px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 font-medium"
              >
                + Add New Product
              </Link>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-35"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSortConfig({ key: 'createdAt', direction: 'desc' });
                }}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
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

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-gray-200">
            <div className="hidden md:flex items-center px-6 py-4 bg-gray-50">
              {tableHeaders.map((header) => (
                <div
                  key={header.key}
                  className={`${header.width} px-3`}
                >
                  {header.sortable ? (
                    <button
                      onClick={() => handleSort(header.key)}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900"
                    >
                      {header.label}
                      {sortConfig.key === header.key && (
                        sortConfig.direction === 'asc'
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">
                      {header.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start by adding your first product"}
                </p>
                <Link
                  to="/admin/create-product"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800"
                >
                  + Add New Product
                </Link>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col md:flex-row md:items-center px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors gap-4 md:gap-0"
                >
                  {/* Image */}
                  <div className="w-full md:w-24 px-0 md:px-3 md:flex  md:justify-start">
                    <div className="w-full h-55 object-cover md:w-16 md:h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Image";
                          e.target.className = "w-full h-full object-contain p-2";
                        }}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="w-full md:w-1/3 px-0 md:px-3">
                    <div
                      className="font-medium text-gray-900 truncate"
                      title={product.name}
                    >
                      {product.name}
                    </div>
                    <div
                      className="text-sm text-gray-500 truncate mt-1"
                      title={product.description}
                    >
                      {product.description?.length > 25
                        ? product.description.substring(0, 25) + "..."
                        : product.description || "No description"}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-full md:w-32 px-0 md:px-3">
                    <div className="flex items-center gap-1 font-bold text-blue-600">
                      {product.price} ETB
                    </div>
                  </div>

                  {/* Color */}
                  <div className="w-full md:w-32 px-0 md:px-3">
                    {product.color ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: product.color.toLowerCase() }}
                          title={product.color}
                        />
                        <span className="text-gray-700">{product.color}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="w-full md:w-32 px-0 md:px-3">
                    <button
                      onClick={() =>
                        updateProductStatus(
                          product._id,
                          product.status === "available" ? "sold" : "available"
                        )
                      }
                      className={`inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${product.status === "available"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                    >
                      {product.status === "available" ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Available
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Sold
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="w-full md:w-48 px-0 md:px-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/admin-product-detail/${product._id}`}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>

                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>

                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      <div className="relative group">
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <Link
                            to={`/admin/admin-product-detail/${product._id}`}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                          <Link
                            to={`/admin/edit-product/${product._id}`}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Product
                          </Link>
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setShowDeleteModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-blue-100">Total Products</div>
          </div>

          <div className="bg-linear-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold">
              {products.filter(p => p.status === 'available').length}
            </div>
            <div className="text-green-100">Available</div>
          </div>

          <div className="bg-linear-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold">
              {products.filter(p => p.status === 'sold').length}
            </div>
            <div className="text-red-100">Sold</div>
          </div>

          <div className="bg-linear-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold">
              {(products.reduce((sum, p) => sum + p.price, 0))}
            </div>
            <div className="text-purple-100">Total Value</div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">"{productToDelete.name}"</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete._id)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;