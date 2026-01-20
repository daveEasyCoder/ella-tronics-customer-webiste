// src/components/AboutUsSimple.jsx (Simplified working version)
import { Heart, Sparkles, Users, Target, Globe, Award, Zap, Star } from 'lucide-react';

const AboutUsSimple = () => {
    return (
        <div className="py-24 px-4 bg-linear-to-b from-white via-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Our Story
                    </h1>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                      My journey to bring you quality products in a <br /> beautiful, user-friendly digital space
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Visual Section */}
                    <div className="relative">
                        <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl aspect-square shadow-2xl flex items-center justify-center">
                          <img className='w-full h-full rounded' src="/aboutImg.jpg" alt="image not found" />
                        </div>
                    </div>

                    {/* Right - Text Section */}
                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold text-gray-900">
                            Building a Better Marketplace
                        </h2>

                        <p className="text-gray-500 text-lg">
                            In a world of mass-produced goods, we're building something different—a marketplace
                            where each product is chosen for its craftsmanship, presented with artistic care,
                            and delivered with attention to every detail
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg">
                                <Target className="h-8 w-8 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                                    <p className="text-gray-600">
                                        To provide a beautiful, professional showcase for my products and make shopping
                                        a seamless experience for every customer
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg">
                                <Globe className="h-8 w-8 text-purple-600 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                                    <p className="text-gray-600">
                                        To build a trusted brand where customers can discover exceptional products
                                        with confidence and ease
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl">
                                <div className="text-2xl font-bold">Original</div>
                                <div className="text-white/90">Products</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl">
                                <div className="text-3xl font-bold">100%</div>
                                <div className="text-white/90">Free</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUsSimple;