
import './App.css'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'

import CreateProduct from './pages/adminPages/CreateProduct'
import ProductDetail from './pages/ProductDetail'
import AdminProductList from './pages/adminPages/AdminProductList'
import AdminProductDetail from './pages/adminPages/adminProductDetail'
import Admin from './pages/adminPages/Admin'
import EditProduct from './pages/adminPages/EditProduct'
import AdminDashboard from './pages/adminPages/AdminDashboard'
import ProductPage from './pages/ProductPage'
import AdminTestimonials from './pages/adminPages/AdminTestimonials'

function App() {


  const location = useLocation();
  const hideNavbarPath = ['/admin','/login'];
  const shouldHideNavbar = hideNavbarPath.some(path => location.pathname.startsWith(path))


  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/product-detail/:id' element={<ProductDetail />} />
        <Route path='/products' element={<ProductPage />} />
        {/* ADMIN ROUTES */}
        <Route path='/admin' element={<Admin />}>
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="product-list" element={<AdminProductList />} />
          <Route path="admin-product-detail/:id" element={<AdminProductDetail />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
