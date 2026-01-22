// src/components/AboutUsSimple.jsx (Simplified working version)
import { Heart, Sparkles, Users, Target, Globe, Award, Zap, Star } from 'lucide-react';

const AboutUsSimple = () => {
    return (
        <div className="py-24 px-4 bg-linear-to-b from-white via-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="exo-texts text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        Our Story
                    </h1>
                    <p className="exo-texts text-lg text-gray-600 max-w-2xl mx-auto">
                        My journey to bring you quality products in a beautiful <br /> user-friendly digital space
                    </p>
                   
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Visual Section */}
                    <div className="relative">
                        <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded aspect-square flex items-center justify-center">
                            <img className='w-full h-full rounded hover:-rotate-2 transition-transform duration-150' src="/aboutImg.jpg" alt="image not found" />
                        </div>
                    </div>

                    {/* Right - Text Section */}
                    <div className="space-y-3">
                        <h2 className="exo-texts text-4xl font-bold text-gray-900">
                            Building a Better Marketplace
                        </h2>

                        <p className="exo-texts text-gray-500 text-lg">
                            In a world of mass-produced goods, we're building something different—a marketplace
                            where each product is chosen for its craftsmanship, presented with artistic care,
                            and delivered with attention to every detail
                        </p>

                        <div className="space-y-6 exo-texts">
                            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg">
                                <Target className="h-8 w-8 text-blue-600 mt-1" />
                                <div>
                                    <h3 className=" text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
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
                        <div className="exo-texts grid grid-cols-2 gap-6">
                            <div className="text-center p-6 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl">
                                <div className="text-2xl font-bold">Original</div>
                                <div className="text-white/90">Products</div>
                            </div>
                            <div className="text-center p-6 bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-2xl">
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