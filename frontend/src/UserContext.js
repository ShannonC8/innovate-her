// UserContext.js
import React, { createContext, useState, useContext } from "react";

// Create a Context for User
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);  // Custom hook to access the user context
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);  // State to store the user_id
  
  const setUser = (id) => {
    setUserId(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
