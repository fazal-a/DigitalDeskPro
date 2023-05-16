import React, { createContext, useState, useEffect, useContext } from "react";

const UserDataContext = createContext();

const UserDataProvider = ({ children }) => {
  const [userData, setUserDataState] = useState(() => {
    const userDataFromLocalStorage = localStorage.getItem('userData');
    return userDataFromLocalStorage ? JSON.parse(userDataFromLocalStorage) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userData]);


  const setUserData = (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    setUserDataState(data);
  };

  const deleteUserData = () => {
    localStorage.removeItem('userData');
    setUserDataState(null);
  };

  return (
    <UserDataContext.Provider value={{ userData, setUserData, deleteUserData, isLoggedIn }}>
      {children}
    </UserDataContext.Provider>
  );
};
const useUserData = () => useContext(UserDataContext);

export { UserDataProvider, useUserData };
