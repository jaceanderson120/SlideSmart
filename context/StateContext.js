import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from "@/library/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Context = createContext();

export const StateContext = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user is signed in, false otherwise
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

    return(
        <Context.Provider
        value={{
            isLoggedIn
        }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);