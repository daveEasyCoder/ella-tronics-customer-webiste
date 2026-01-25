import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProductContext } from '../context/ProductContext';

const Testimonial = () => {

    const { BASE_URL } = useProductContext()
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const scrollRef = useRef()

    const [formData, setFormData] = useState({
        name: '',
        message: '',
        rating: 5
    });
    const [submitting, setSubmitting] = useState(false);
    

    // Fetch testimonials
    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/testimonials/get-testimonials`);
            setTestimonials(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load testimonials');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.message.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setSubmitting(true);

            const response = await axios.post(`${BASE_URL}/api/testimonials/create-testimonial`, formData);

            if (response.data.success) {
                setFormData({ name: '', message: '', rating: 5 });
                setShowForm(false);
                toast.success(response.data.message || "Submitted successfully. It will appear after admin approval");
                fetchTestimonials();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit testimonial');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };





  const handleScroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollBy({ left: 200, behavior: "smooth" })
    } else {
      current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }





    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it. Hear from our satisfied customers who trust Ella-Tronics.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{testimonials.length}</div>
                        <div className="text-gray-700 font-medium">Total Reviews</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                            {testimonials.length > 0
                                ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
                                : '5.0'
                            }
                        </div>
                        <div className="text-gray-700 font-medium">Average Rating</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="w-full py-3 cursor-pointer bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                        >
                            {showForm ? 'Cancel' : 'Share Your Experience'}
                        </button>
                    </div>
                </div>

                {/* Testimonial Form */}
                {showForm && (
                    <div className="mb-12">
                        <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Share Your Experience
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

                                            required
                                        />
                                    </div>

                                    {/* Rating */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Rating
                                        </label>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className={`text-3xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500 transition`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Share your experience with Ella-Tronics..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : 'Submit Testimonial'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Testimonials Grid */}
                {testimonials.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">💬</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            No testimonials yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Be the first to share your experience!
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Share Your Story
                        </button>
                    </div>
                ) : (
                    <section className='py-10 lg:px-8'>
                        <div className='w-full max-w-6xl mx-auto'>

                            {/* Navigation Buttons - Hidden on mobile */}
                            <div className='flex justify-end gap-2 mt-4'>
                                <button
                                    id="prev-btn"
                                    onClick={() => handleScroll("right")}
                                    className='h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-all text-neutral-500'
                                    aria-label="Previous"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m12 19-7-7 7-7" />
                                        <path d="M19 12H5" />
                                    </svg>
                                </button>
                                <button
                                    id="next-btn"
                                    onClick={() => handleScroll("left")}
                                    className='h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-all text-neutral-500'
                                    aria-label="Next"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14" />
                                        <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Testimonials Grid */}
                            <div ref={scrollRef}  className='testimonial-container mx-auto flex overflow-x-scroll gap-6 sm:px-8 md:px-0 mt-12 md:mt-6'>
                                {testimonials.map((testimonial) => (
                                    <div
                                        key={testimonial._id}
                                        className="bg-zinc-50 w-90 hover:-translate-y-1 duration-150 flex-none border border-zinc-200 rounded-2xl p-6 space-y-6"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 24 24"
                                                        fill={i < testimonial.rating ? "#FF8F20" : "#E5E5E5"}
                                                    >
                                                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="text-xs text-neutral-500">
                                                {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <p className="text-sm/6 text-neutral-600">
                                            "{testimonial.message}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            {/* Placeholder for user image - you can add images to your testimonial schema if needed */}
                                            <div className="w-13 h-13 rounded-full bg-neutral-200 flex items-center justify-center">
                                                <span className="text-neutral-600 font-medium text-lg">
                                                    {testimonial.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-neutral-700">{testimonial.name}</p>
                                                <p className="text-xs font-medium text-neutral-500">
                                                    {testimonial.name.split(' ')[0] || 'Customer'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </section>

                )}

            </div>
        </div>
    );
};

export default Testimonial;