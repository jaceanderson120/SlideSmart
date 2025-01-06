import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, app } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getSparkStatus } from "@/utils/getSparkStatus";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSpark, setHasSpark] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user is signed in, false otherwise
      setCurrentUser(user); // Set the current user
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Check if user has spark subscription
  useEffect(() => {
    // Check if user has spark subscription
    const checkSpark = async () => {
      const newSparkStatus = auth.currentUser
        ? await getSparkStatus(app)
        : false;
      setHasSpark(newSparkStatus);
    };

    checkSpark();
  }, [app, auth.currentUser?.uid]);

  return (
    <Context.Provider
      value={{
        isLoggedIn,
        currentUser,
        loading,
        hasSpark,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
