
import { Lock, Zap, Users, Globe } from 'lucide-react';

const WhyChooseUs = () => {
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Login Required</h3>
                        <p className="text-gray-600">Browse and contact sellers without creating an account</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Instant Contact</h3>
                        <p className="text-gray-600">Direct Telegram and phone access to sellers</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Local Community</h3>
                        <p className="text-gray-600">Buy and sell within your local area</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Globe className="h-8 w-8 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Completely Free</h3>
                        <p className="text-gray-600">No fees for buyers or sellers</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhyChooseUs