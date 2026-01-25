import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import axios from "axios";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const production_url = "https://ella-tronics-backend.onrender.com";
  const development_url = "http://localhost:3004";
  const BASE_URL = production_url
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);



  // Fetch all products
  const fetchProducts = async () => {

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BASE_URL}/api/products/get-all-products`);

      if (response.data.success) {
        setProducts(response.data.data);
        localStorage.setItem("products", JSON.stringify(response.data.data));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        console.log("Invalid products in localStorage:", e);
        localStorage.removeItem("products");
      }
    }
    fetchProducts();
  }, []);


  return (
    <ApiContext.Provider value={{ BASE_URL, products, loading, error, adminProducts, setAdminProducts, filteredProducts, setFilteredProducts, fetchProducts }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useProductContext = () => useContext(ApiContext);
