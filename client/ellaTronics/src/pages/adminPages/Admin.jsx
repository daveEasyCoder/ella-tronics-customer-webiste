import React from 'react'
import { useState } from 'react'
import { FaList } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import {
    LayoutDashboard,
    PackagePlus,
    Package,
    ShieldCheck
} from "lucide-react";
import axios from 'axios'
import { useProductContext } from '../../context/ProductContext'



const Admin = () => {


    const { BASE_URL } = useProductContext()

    const [activeLink, setActiveLink] = useState(0);
    const sidebarLinks = [
        { name: "Dashboard", path: "dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Create Item", path: "create-product", icon: <PackagePlus className="w-5 h-5" /> },
        { name: "Products", path: "product-list", icon: <FaList className="w-5 h-5" /> },
    ];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const toggleActiveLink = (index) => {
        setActiveLink(index)
        toggleSidebar()
    }
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/admin/admin-logout`, {}, { withCredentials: true });
            if (response.data.success) {
                navigate("/login")
            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <>
            <div className={`w-18 sm:w-55 bg-white h-[100vh] shadow-lg fixed ${isSidebarOpen ? 'left-0' : '-left-20'} z-10 transition-all duration-150 sm:left-0 top-0 `}>
                <div className="pl-7 py-3.5 border-b border-b-gray-200">
                    <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <span className=''>Admin</span>
                    </h1>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {
                            sidebarLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        onClick={() => toggleActiveLink(index)}
                                        to={`/admin/${link.path}`}
                                        className={`flex ${index === activeLink ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors`}
                                    >
                                        {link.icon}
                                        <span className='hidden sm:block'>{link.name}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
            </div>

            <div className='flex items-center justify-between sm:justify-end fixed z-10 top-0 pl-6 left-0 sm:left-55 right-0 px-4 py-3 border-b bg-white border-b-gray-200'>
                <button onClick={toggleSidebar} className=' cursor-pointer  sm:hidden'>
                    {
                        isSidebarOpen ?
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg> :
                            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                    }

                </button>
                <div>
                    <button onClick={handleLogout} className='bg-blue-700 text-sm text-white rounded-sm px-4 py-1.5 hover:bg-blue-800 cursor-pointer'>Logout</button>
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Admin