import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const BASE_URL = "https://ella-tronics-backend.onrender.com";



  return (
    <ApiContext.Provider value={{ BASE_URL }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useProductContext = () => useContext(ApiContext);
