import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const getSparkStatus = (
  app: FirebaseApp,
  callback: (status: boolean) => void
) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");

  // Check the usersRef to see if the user has a free subscription (admins only)
  const userDocRef = doc(db, "users", userId);
  const unsubscribeUserDoc = onSnapshot(userDocRef, (userDoc) => {
    if (userDoc.exists()) {
      const user = userDoc.data();
      if (user?.role === "admin") {
        callback(true);
        return;
      }
    }

    const subscriptionsRef = collection(
      db,
      "customers",
      userId,
      "subscriptions"
    );
    const q = query(
      subscriptionsRef,
      where("status", "in", ["trialing", "active"])
    );

    const unsubscribeSubscriptions = onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.length > 0);
    });

    return () => {
      unsubscribeSubscriptions();
    };
  });

  return () => {
    unsubscribeUserDoc();
  };
};
