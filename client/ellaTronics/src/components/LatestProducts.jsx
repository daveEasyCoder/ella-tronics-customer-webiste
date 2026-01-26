import React from 'react'

const LatestProducts = () => {
    return (
        <div className='hidden md:block'>
            <h1 className="text-3xl md:text-5xl font-semibold text-center mx-auto">Our Latest Collections</h1>
            <p className="text-lg text-slate-500 text-center mt-2 max-w-lg mx-auto">Discover our newest designs curated to showcase fresh styles premium quality and modern trends.</p>
            <div className="flex items-center gap-2 h-[400px] w-full max-w-4xl mt-10 mx-auto">
                <div className="relative group grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="/collection1.avif"
                        alt="image" />
                </div>
                <div className="relative group grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="/collection2.avif"
                        alt="image" />
                </div>
                <div className="relative group grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="collection3.avif"
                        alt="image" />
                </div>
                <div className="relative group grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="/collection4.avif"
                        alt="image" />
                </div>
                <div className="relative group grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="/collection5.avif"
                        alt="image" />
                </div>
                <div className="relative group grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="/collection6.avif"
                        alt="image" />
                </div>
            </div>
        </div>
    )
}

export default LatestProducts