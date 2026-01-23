// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Package,
    DollarSign,
    TrendingUp,
    MapPin,
    Palette,
    Calendar,
    BarChart3,
    Clock,
    AlertCircle,
    Eye,
    ShoppingBag,
    Tag,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';


const AdminDashboard = () => {
    const { BASE_URL } = useProductContext();

    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('week');

    const navigate = useNavigate();

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [statsResponse, activitiesResponse] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/dashboard-stats`, { withCredentials: true }),
                axios.get(`${BASE_URL}/api/admin/dashboard-activities`, { withCredentials: true })
            ]);

            if (statsResponse.data.success) {
                setStats(statsResponse.data.data);
            }

            if (activitiesResponse.data.success) {
                setActivities(activitiesResponse.data.data);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            if (err.response) {
                if ((err.response.status === 401) || (err.response.status === 403)) {
                    navigate('/login');
                    return;
                }
                if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                    return;
                }
                setError('Failed to load dashboard data. Please try again.');
            } else {
                setError('Server is not responding. Please try again.');
            }


        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        window.scrollTo(0, 0)
        fetchDashboardData();
    }, []);



    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Get status color
    const getStatusColor = (status) => {
        return status === 'available' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
    };

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 ml-17 sm:ml-55 mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        {/* Stats Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-300 rounded-2xl"></div>
                            ))}
                        </div>
                        {/* Chart Skeleton */}
                        <div className="h-80 bg-gray-300 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 ml-0 sm:ml-55 mt-14 pb-15">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-1">
                                Overview of your product inventory and performance
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                            >
                                <option value="week">Last 7 days</option>
                                <option value="month">Last 30 days</option>
                                <option value="quarter">Last 90 days</option>
                                <option value="year">Last year</option>
                            </select>

                            <button
                                onClick={fetchDashboardData}
                                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <div className="text-red-800">{error}</div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Products */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                +{stats?.percentages?.growthRate || 0}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {stats?.summary?.totalProducts || 0}
                        </div>
                        <div className="text-gray-600 font-medium">Total Products</div>
                        <div className="text-sm text-gray-500 mt-2">
                            {stats?.summary?.availableProducts || 0} available • {stats?.summary?.soldProducts || 0} sold
                        </div>
                    </div>

                    {/* Total Value */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {stats?.summary?.totalValue || 0}
                        </div>
                        <div className="text-gray-600 font-medium">Total Inventory Value</div>
                        <div className="text-sm text-gray-500 mt-2">
                            Avg: {stats?.summary?.averagePrice?.toFixed(2) || 0} ETB
                        </div>
                    </div>

                    {/* Available Products */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <ShoppingBag className="h-6 w-6 text-green-600" />
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('available')}`}>
                                {stats?.percentages?.availablePercentage || 0}%
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {stats?.summary?.availableProducts || 0}
                        </div>
                        <div className="text-gray-600 font-medium">Available Products</div>
                        <div className="text-sm text-gray-500 mt-2">
                            Value: {stats?.summary?.availableValue || 0} ETB
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Clock className="h-6 w-6 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                Last 7 days
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {stats?.summary?.recentProducts || 0}
                        </div>
                        <div className="text-gray-600 font-medium">Recent Additions</div>
                        <div className="text-sm text-gray-500 mt-2">
                            {stats?.summary?.recentProducts || 0} new products added
                        </div>
                    </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Top Locations */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Products by Location</h2>
                                <p className="text-gray-600 text-sm">Top locations with most products</p>
                            </div>
                            <MapPin className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="space-y-4">
                            {stats?.analytics?.productsByLocation?.map((location, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{location._id}</div>
                                            <div className="text-sm text-gray-500">{location.count} products</div>
                                        </div>
                                    </div>
                                    <div className="text-blue-600 font-semibold">
                                        {Math.round((location.count / stats.summary.totalProducts) * 100)}%
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Top Colors */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Popular Colors</h2>
                                <p className="text-gray-600 text-sm">Most used product colors</p>
                            </div>
                            <Palette className="h-6 w-6 text-purple-600" />
                        </div>

                        <div className="space-y-4">
                            {stats?.analytics?.topColors?.map((color, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg border border-gray-300"
                                            style={{ backgroundColor: color._id.toLowerCase() }}
                                            title={color._id}
                                        ></div>
                                        <div>
                                            <div className="font-medium text-gray-900">{color._id}</div>
                                            <div className="text-sm text-gray-500">{color.count} products</div>
                                        </div>
                                    </div>
                                    <div className="text-purple-600 font-semibold">
                                        {Math.round((color.count / stats.summary.totalProducts) * 100)}%
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                {stats?.analytics?.topColors?.length || 0} colors tracked
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities & Quick Actions */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                                <p className="text-gray-600 text-sm">Latest product additions and updates</p>
                            </div>
                            <Calendar className="h-6 w-6 text-gray-600" />
                        </div>

                        <div className="space-y-4">
                            {activities.slice(0, 5).map((activity, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="shrink-0">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.status === 'available' ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            {activity.status === 'available' ? (
                                                <ShoppingBag className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <Tag className="h-5 w-5 text-red-600" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{activity.title}</div>
                                        <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${activity.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {activity.status}
                                            </span>
                                            <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-blue-600">
                                        {activity.meta.price} ETB
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                            <p className="text-gray-600 text-sm">Manage your products efficiently</p>
                        </div>

                        <div className="space-y-3">
                            <Link
                                to="/admin/create-product"
                                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                                    <Package className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Add New Product</div>
                                    <div className="text-sm text-gray-600">Create a new product listing</div>
                                </div>
                            </Link>

                            <Link
                                to="/admin/product-list"
                                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                                    <Eye className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">View All Products</div>
                                    <div className="text-sm text-gray-600">Browse and manage inventory</div>
                                </div>
                            </Link>

                            <button
                                onClick={fetchDashboardData}
                                className="w-full flex items-center cursor-pointer gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                                    <BarChart3 className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Refresh Analytics</div>
                                    <div className="text-sm text-gray-600">Update dashboard data</div>
                                </div>
                            </button>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600 mb-2">Inventory Summary</div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Total Products</span>
                                        <span className="font-medium">{stats?.summary?.totalProducts || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Available</span>
                                        <span className="font-medium text-green-600">{stats?.summary?.availableProducts || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Sold</span>
                                        <span className="font-medium text-red-600">{stats?.summary?.soldProducts || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span className="font-medium text-gray-900">Total Value</span>
                                        <span className="font-bold text-blue-600">{stats?.summary?.totalValue || 0} ETB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;