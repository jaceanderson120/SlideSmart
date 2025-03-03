import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, app } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getSparkStatus } from "@/utils/getSparkStatus";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined); // Start in an undefined state to know when user status is UNKNOWN
  const [loadingUser, setLoadingUser] = useState(true);
  const [hasSpark, setHasSpark] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user is signed in, false otherwise
      setCurrentUser(user); // Set the current user, this is either null or a user object
      setLoadingUser(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Check if user has spark subscription
  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = getSparkStatus(app, setHasSpark);
      return () => unsubscribe();
    }
  }, [app, auth.currentUser?.uid]);

  return (
    currentUser !== undefined && (
      <Context.Provider
        value={{
          isLoggedIn,
          currentUser,
          loadingUser,
          hasSpark,
        }}
      >
        {children}
      </Context.Provider>
    )
  );
};

export const useStateContext = () => useContext(Context);
