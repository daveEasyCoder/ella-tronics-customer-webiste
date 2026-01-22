import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4">Ella-Tronics</h2>
          <p className="text-gray-400">
            Your one-stop shop for premium electronics accessories: earphones, chargers, cables, and more.
          </p>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-white font-semibold mb-4">Products</h3>
          <ul className="space-y-2">
            <li><Link to="/products" className="hover:text-white">Earphones</Link></li>
            <li><Link to="/products" className="hover:text-white">AirPods</Link></li>
            <li><Link to="/products" className="hover:text-white">Chargers</Link></li>
            <li><Link to="/products" className="hover:text-white">Cables</Link></li>
            <li><Link to="/products" className="hover:text-white">Headsets</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Shipping</li>
            <li>Warranty</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Newsletter + Social */}
        <div>
          <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates & offers.</p>
          <form className="flex mb-4">
            <input type="email" placeholder="Your email" className="p-2 rounded-l bg-gray-800 border border-gray-700 focus:outline-none flex-1 text-white" />
            <button type="submit" className="bg-blue-600 p-2 rounded-r hover:bg-blue-700 transition">Subscribe</button>
          </form>
          <div className="flex gap-4 mt-2">
            <a href="#"><FaFacebookF size={20} className="hover:text-white" /></a>
            <a href="#"><FaTwitter size={20} className="hover:text-white" /></a>
            <a href="#"><FaInstagram size={20} className="hover:text-white" /></a>
            <a href="#"><FaLinkedinIn size={20} className="hover:text-white" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Ella-Tronics. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
