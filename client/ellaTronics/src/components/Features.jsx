import React, { useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaTruck, FaShieldAlt, FaHeadset, FaTags, FaBolt } from "react-icons/fa";

const Features = () => {

    const features = [
        { 
            name: 'Original Products', 
            icon: <FaShieldAlt size={50} className="text-green-500" />, 
            subtext: '100% authentic electronics'
        },
        { 
            name: '24/7 Support', 
            icon: <FaHeadset size={50} className="text-purple-500" />, 
            subtext: 'We are here to help anytime'
        },
        { 
            name: 'Best Prices', 
            icon: <FaTags size={50} className="text-yellow-500" />, 
            subtext: 'Affordable prices guaranteed'
        },
        { 
            name: 'Fast Delivery', 
            icon: <FaBolt size={50} className="text-red-500" />, 
            subtext: 'Receive your order quickly'
        },
    ];


    return (
        <div className=''>
            <div className='max-w-6xl mx-auto py-14 px-3 lg:px-0'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-3xl font-bold mb-5'>Features</h1>
                
                </div>
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-x-hidden'>
                    {features.map((feature, index) => (
                        <div key={index} className='w-full relative rounded-sm bg-gray-100 dark:bg-gray-800  h-65 flex flex-col items-center justify-center p-4 text-center'>
                            <div className='mb-3'>{feature.icon}</div>
                            <p className='font-medium text-xl text-gray-800 dark:text-gray-200'>{feature.name}</p>
                            <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>{feature.subtext}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Features;
