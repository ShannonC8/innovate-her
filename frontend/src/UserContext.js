import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);  
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);  
  const [userName, setUserName] = useState(null);

  const setName = (name) => {
    setUserName(name)
  }

  const setUser = (id) => {
    setUserId(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUser, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};
