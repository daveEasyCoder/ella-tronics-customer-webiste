import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const BASE_URL = "http://localhost:3004";


//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(`${BASE_URL}/api/users/logout`, {
//         withCredentials: true
//       });
//       if (response.data.success) {
//         navigate("/login")
//       }
//     } catch (error) {
//       console.log(error);

//     }
//   }

  return (
    <ApiContext.Provider value={{ BASE_URL }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useProductContext = () => useContext(ApiContext);
