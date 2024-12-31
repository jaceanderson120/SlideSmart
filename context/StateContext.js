import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user is signed in, false otherwise
      setCurrentUser(user); // Set the current user
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Context.Provider
      value={{
        isLoggedIn,
        currentUser,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
