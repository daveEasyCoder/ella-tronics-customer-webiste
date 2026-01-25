import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useProductContext } from '../../context/ProductContext';

const AdminTestimonials = () => {
    const { BASE_URL } = useProductContext();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);

    useEffect(() => {
        fetchAllTestimonials();
        fetchStats();
    }, []);

    const fetchAllTestimonials = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/testimonials/get-testimonials?admin=true`);
            setTestimonials(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load testimonials');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/testimonials/testimonial-stats`);
            setStats(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            setActionLoading(true);
            const response = await axios.delete(`${BASE_URL}/api/testimonials/delete-testimonial/${id}`);
            if (response.data.success) {
                toast.success('Testimonial deleted');
                fetchAllTestimonials();
                fetchStats();
            }
        } catch (error) {
            toast.error('Failed to delete');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleApproval = async (id, currentStatus) => {
        try {
            setActionLoading(true);
            const response = await axios.put(`${BASE_URL}/api/testimonials/update-testimonial/${id}`, {
                approved: !currentStatus
            });
            if (response.data.success) {
                toast.success(`Testimonial ${currentStatus ? 'disapproved' : 'approved'}`);
                fetchAllTestimonials();
                fetchStats();
            }
        } catch (error) {
            toast.error('Failed to update');
        } finally {
            setActionLoading(false);
        }
    };

    const handleShowDetails = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedTestimonial(null);
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="p-6 sm:ml-50 mt-15">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Testimonials Management</h1>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                        <div className="text-gray-600">Total Testimonials</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                        <div className="text-gray-600">Approved</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-gray-600">Pending Review</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="text-3xl font-bold text-purple-600">
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <div className="text-gray-600">Avg Rating</div>
                    </div>
                </div>
            )}

            {/* Testimonials Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Message
                            </th>
                            <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rating
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {testimonials.map((testimonial) => (
                            <tr key={testimonial._id} className="hover:bg-gray-50">
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">
                                        {testimonial.name}
                                    </div>
                                </td>

                                <td className="hidden sm:table-cell px-3 sm:px-6 py-4">
                                    <div className="text-gray-700 max-w-xs">
                                        {testimonial.message.slice(0, 15) + ' ...'}
                                    </div>
                                </td>

                                <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </td>

                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${testimonial.approved
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {testimonial.approved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>

                                <td className="px-3 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between whitespace-nowrap text-sm font-medium space-y-1 sm:space-y-0 sm:space-x-2">
                                    <button
                                        onClick={() => handleShowDetails(testimonial)}
                                        className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer"
                                    >
                                        Show
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleToggleApproval(
                                                testimonial._id,
                                                testimonial.approved
                                            )
                                        }
                                        disabled={actionLoading}
                                        className={`cursor-pointer ${testimonial.approved
                                                ? 'text-yellow-600 hover:text-yellow-900'
                                                : 'text-green-600 hover:text-green-900'
                                            }`}
                                    >
                                        {testimonial.approved ? 'Disapprove' : 'Approve'}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(testimonial._id)}
                                        disabled={actionLoading}
                                        className="text-red-600 cursor-pointer hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* Detail Modal/Popup */}
            {showDetailModal && selectedTestimonial && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                        onClick={closeDetailModal}
                    ></div>

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Testimonial Details</h3>
                                        <p className="text-gray-600 mt-1">Full information about the testimonial</p>
                                    </div>
                                    <button
                                        onClick={closeDetailModal}
                                        className="text-gray-400 hover:text-gray-600 text-2xl w-13 h-13 cursor-pointer hover:bg-gray-100 rounded-full transition"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 space-y-6">
                                    {/* Name and Rating */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{selectedTestimonial.name}</h4>
                                            <div className="flex items-center mt-1">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-5 h-5 ${i < selectedTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-gray-700 font-medium">{selectedTestimonial.rating}.0/5</span>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedTestimonial.approved
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {selectedTestimonial.approved ? '✓ Approved' : '⏳ Pending'}
                                        </span>
                                    </div>

                                    {/* Full Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                "{selectedTestimonial.message}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial ID</label>
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <code className="text-sm text-gray-600 break-all">{selectedTestimonial._id}</code>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Submitted On</label>
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <p className="text-gray-800">
                                                    {new Date(selectedTestimonial.createdAt).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Last Updated */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <p className="text-gray-800">
                                                {new Date(selectedTestimonial.updatedAt).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">

                                    <button
                                        onClick={closeDetailModal}
                                        className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminTestimonials;