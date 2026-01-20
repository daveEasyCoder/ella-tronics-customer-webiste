// import React from 'react'

// const List = () => {
//     return (
//         <div>
//             <div className="divide-y divide-gray-200">
//                 {filteredProducts.length === 0 ? (
//                     <div className="p-12 text-center">
//                         <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//                         <p className="text-gray-600 mb-6">
//                             {searchTerm || statusFilter !== 'all'
//                                 ? 'Try adjusting your search or filters'
//                                 : 'Start by adding your first product'}
//                         </p>
//                         <Link
//                             to="/admin/create-product"
//                             className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800"
//                         >
//                             + Add New Product
//                         </Link>
//                     </div>
//                 ) : (
//                     filteredProducts.map((product) => (
//                         <div key={product._id} className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors">
//                             {/* Image */}
//                             <div className="w-24 px-3">
//                                 <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
//                                     <img
//                                         src={product.image}
//                                         alt={product.name}
//                                         className="w-full h-full object-cover"
//                                         onError={(e) => {
//                                             e.target.src = 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Image';
//                                             e.target.className = 'w-full h-full object-contain p-2';
//                                         }}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Name - Increased width since Date column removed */}
//                             <div className="w-1/3 px-3">
//                                 <div className="font-medium text-gray-900 truncate" title={product.name}>
//                                     {product.name}
//                                 </div>
//                                 <div className="text-sm text-gray-500 truncate mt-1" title={product.description}>
//                                     {product.description?.length > 25 ? product.description.substring(0, 25) + '...' : product.description || 'No description'}
//                                 </div>
//                             </div>

//                             {/* Price */}
//                             <div className="w-32 px-3">
//                                 <div className="flex items-center gap-1 font-bold text-blue-600">
//                                     {(product.price)} ETB
//                                 </div>
//                             </div>

//                             {/* Color */}
//                             <div className="w-32 px-3">
//                                 {product.color ? (
//                                     <div className="flex items-center gap-2">
//                                         <div
//                                             className="w-6 h-6 rounded border border-gray-300"
//                                             style={{ backgroundColor: product.color.toLowerCase() }}
//                                             title={product.color}
//                                         />
//                                         <span className="text-gray-700">{product.color}</span>
//                                     </div>
//                                 ) : (
//                                     <span className="text-gray-400">—</span>
//                                 )}
//                             </div>

//                             {/* Status */}
//                             <div className="w-32 px-3">
//                                 <button
//                                     onClick={() => updateProductStatus(
//                                         product._id,
//                                         product.status === 'available' ? 'sold' : 'available'
//                                     )}
//                                     className={`inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${product.status === 'available'
//                                         ? 'bg-green-100 text-green-800 hover:bg-green-200'
//                                         : 'bg-red-100 text-red-800 hover:bg-red-200'
//                                         }`}
//                                 >
//                                     {product.status === 'available' ? (
//                                         <>
//                                             <CheckCircle className="h-4 w-4" />
//                                             Available
//                                         </>
//                                     ) : (
//                                         <>
//                                             <XCircle className="h-4 w-4" />
//                                             Sold
//                                         </>
//                                     )}
//                                 </button>
//                             </div>

//                             {/* Actions */}
//                             <div className="w-48 px-3">
//                                 <div className="flex items-center gap-2">
//                                     <Link
//                                         to={`/admin/admin-product-detail/${product._id}`}
//                                         className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                         title="View"
//                                     >
//                                         <Eye className="h-5 w-5" />
//                                     </Link>

//                                     <Link
//                                         to={`/admin/edit-product/${product._id}`}
//                                         className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                                         title="Edit"
//                                     >
//                                         <Edit className="h-5 w-5" />
//                                     </Link>

//                                     <button
//                                         onClick={() => {
//                                             setProductToDelete(product);
//                                             setShowDeleteModal(true);
//                                         }}
//                                         className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                         title="Delete"
//                                     >
//                                         <Trash2 className="h-5 w-5" />
//                                     </button>

//                                     <div className="relative group">
//                                         <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
//                                             <MoreVertical className="h-5 w-5" />
//                                         </button>
//                                         <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
//                                             <Link
//                                                 to={`/admin/admin-product-detail/${product._id}`}
//                                                 className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
//                                             >
//                                                 <Eye className="h-4 w-4" />
//                                                 View Details
//                                             </Link>
//                                             <Link
//                                                 to={`/admin/edit-product/${product._id}`}
//                                                 className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
//                                             >
//                                                 <Edit className="h-4 w-4" />
//                                                 Edit Product
//                                             </Link>
//                                             <button
//                                                 onClick={() => {
//                                                     setProductToDelete(product);
//                                                     setShowDeleteModal(true);
//                                                 }}
//                                                 className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                                 Delete Product
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     )
// }

// export default List