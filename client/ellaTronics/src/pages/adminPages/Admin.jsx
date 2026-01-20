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


    const {BASE_URL} = useProductContext()
    
    const [activeLink, setActiveLink] = useState(0);
    const sidebarLinks = [
        { name: "Dashboard", path: "dashboard", icon: <LayoutDashboard  className="w-5 h-5" /> },
        { name: "Create Item", path: "create-product", icon: <PackagePlus className="w-5 h-5" /> },
        { name: "Products", path: "product-list", icon: <FaList className="w-5 h-5" /> },
    ];

    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/admin/admin-logout`, {}, { withCredentials: true });
            if(response.data.success){
                navigate("/login")
            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <>
            <div className="w-18 sm:w-55 bg-white h-screen shadow-lg fixed left-0 top-0 ">
                <div className="pl-7 py-3.5 border-b border-b-gray-200">
                    <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                         <ShieldCheck  className="w-5 h-5" />
                        <span className='hidden sm:block'>Admin</span>
                    </h1>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {
                            sidebarLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        onClick={() => setActiveLink(index)}
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

            <div className='flex items-center justify-end fixed z-10 top-0 left-18 sm:left-55 right-0 px-4 py-3 border-b bg-white border-b-gray-200'>
                <div>
                    <button onClick={handleLogout} className='bg-blue-700 text-sm text-white rounded-sm px-4 py-1.5 hover:bg-blue-800 cursor-pointer'>Logout</button>
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Admin