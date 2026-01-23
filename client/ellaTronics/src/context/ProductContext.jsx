import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const production_url = "https://ella-tronics-backend.onrender.com";
  const development_url = "http://localhost:3004";
  const BASE_URL = production_url



  return (
    <ApiContext.Provider value={{ BASE_URL }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useProductContext = () => useContext(ApiContext);
