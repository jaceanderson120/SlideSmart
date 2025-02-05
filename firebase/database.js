import { auth, db, storage } from "@/firebase/firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Uploads a study guide to Firestore
// Input: studyGuide object with the following properties:
// - fileName: string with the name of the study guide file
// - extractedData: Object consisting of topics and their corresponding content
// - googleSearchResults: Object consisting of search results from Google
// - firebaseFileUrl: string with the URL of the study guide file in Firebase Storage
// - createdAt: Date
// Output: studyGuideId of the uploaded study guide if successful, null otherwise
const uploadStudyGuideToFirebase = async (studyGuide) => {
  let studyGuideId;
  try {
    await runTransaction(db, async (transaction) => {
      // Add a new document for the study guide to the "studyGuides" collection
      const studyGuideRef = doc(collection(db, "studyGuides"));
      transaction.set(studyGuideRef, {
        fileName: studyGuide.fileName,
        extractedData: studyGuide.extractedData,
        hiddenExplanations: studyGuide.hiddenExplanations || "",
        googleSearchResults: studyGuide.googleSearchResults || "",
        firebaseFileUrl: studyGuide.firebaseFileUrl,
        createdAt: studyGuide.createdAt,
        createdBy: studyGuide.createdBy,
        contributors: studyGuide.contributors,
        editors: studyGuide.editors,
        isPublic: studyGuide.isPublic,
        gotFromPublic: studyGuide.gotFromPublic,
      });

      // Get the ID of the new document from the document reference
      studyGuideId = studyGuideRef.id;

      // Update userStudyGuides collection with the new study guide ID
      const userDocRef = doc(db, "userStudyGuides", auth.currentUser.uid);
      transaction.set(
        userDocRef,
        {
          studyGuides: arrayUnion(studyGuideId),
        },
        { merge: true }
      );
    });
    return studyGuideId;
  } catch (error) {
    console.error("Error performing transaction:", error);
    return null;
  }
};

// Fetches the study guides associated with a user from Firestore
// Input: user object from Firebase Authentication
// Output: Array of study guides associated with the user
const getUserStudyGuides = async (user) => {
  if (user) {
    // Fetch the user's study guide IDs from the userStudyGuides collection
    const userDocRef = doc(db, "userStudyGuides", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const { studyGuides: studyGuideIds } = userDoc.data();

      // Fetch the study guide documents from the studyGuides collection
      const studyGuidesPromises = studyGuideIds.map(async (id) => {
        const studyGuideDocRef = doc(db, "studyGuides", id);
        const studyGuideDoc = await getDoc(studyGuideDocRef);
        const data = studyGuideDoc.data();
        if (!data) {
          return null;
        }
        return {
          id: studyGuideDoc.id,
          fileName: data.fileName,
          createdAt: data.createdAt.toDate().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          firebaseFileUrl: data.firebaseFileUrl,
          createdBy: data.createdBy,
          contributors: data.contributors,
          editors: data.editors,
          isPublic: data.isPublic,
          gotFromPublic: data.gotFromPublic,
        };
      });

      const guides = await Promise.all(studyGuidesPromises);
      return guides;
    }
  }
};

const getPublicStudyGuides = async (search_input) => {
  const snapshot = await getDocs(collection(db, "studyGuides"));

  // 2. Convert docs to an array of objects
  const allGuides = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 3. Filter locally for filenames containing the search string
  const filtered = allGuides.filter(
    (guide) =>
      guide.fileName?.toLowerCase().includes(search_input.toLowerCase()) &&
      guide.isPublic
  );

  return filtered;
};

// Fetches a specific study guide from Firestore
// Input: study guide ID
// Output: Object containing the fetched study guide and the file name
const fetchStudyGuide = async (id) => {
  const studyGuideDocRef = doc(db, "studyGuides", id);
  const studyGuideDoc = await getDoc(studyGuideDocRef);
  if (studyGuideDoc.exists()) {
    const data = studyGuideDoc.data();
    const fetchedStudyGuide = {
      id: studyGuideDoc.id,
      ...data,
      extractedData: JSON.parse(data.extractedData),
      googleSearchResults: JSON.parse(data.googleSearchResults || "{}"),
      hiddenExplanations: JSON.parse(data.hiddenExplanations || "{}"),
    };
    const fileName = data.fileName;
    return { fetchedStudyGuide, fileName };
  }
};

// Updates the file name of a study guide in Firestore
// Input: study guide ID and new file name
// Output: None
const updateStudyGuideFileName = async (id, fileName) => {
  const studyGuideDocRef = doc(db, "studyGuides", id);
  await updateDoc(studyGuideDocRef, { fileName });
};

// Updates the extracted data of a study guide in Firestore
// Input: study guide ID and new extracted data
// Output: None
const updateStudyGuideExtractedData = async (id, extractedData) => {
  // Ensure extracted data is a string
  if (typeof extractedData !== "string") {
    extractedData = JSON.stringify(extractedData);
  }
  const studyGuideDocRef = doc(db, "studyGuides", id);
  await updateDoc(studyGuideDocRef, { extractedData });
};

// Updates the hidden explanations of a study guide in Firestore
// Input: study guide ID and new hidden explanations
// Output: None
const updateStudyGuideHiddenExplanations = async (id, hiddenExplanations) => {
  const studyGuideDocRef = doc(db, "studyGuides", id);
  await updateDoc(studyGuideDocRef, { hiddenExplanations });
};

// Delete a study guide from Firestore
// Input: study guide ID
// Output: None
const deleteStudyGuide = async (id, storageUrl, userId) => {
  // Get the list of contributors for the study guide
  const studyGuideDocRef = doc(db, "studyGuides", id);
  const studyGuideDoc = await getDoc(studyGuideDocRef);
  const { contributors } = studyGuideDoc.data();

  // Delete the study guide document from the studyGuides collection
  await deleteDoc(doc(db, "studyGuides", id));

  // Delete the study guide ID from the userStudyGuides collection for each contributor and if the user has no study guides, delete the userStudyGuides document
  contributors.forEach(async (contributor) => {
    const contributorDocRef = doc(db, "userStudyGuides", contributor);
    await updateDoc(contributorDocRef, {
      studyGuides: arrayRemove(id),
    });
    const contributorDoc = await getDoc(contributorDocRef);
    const { studyGuides } = contributorDoc.data();
    if (studyGuides.length === 0) {
      await deleteDoc(contributorDocRef);
    }
  });

  // Delete the study guide file from Firebase Storage if it exists
  if (storageUrl != null) {
    const storageRef = ref(storage, storageUrl);
    await deleteObject(storageRef);
  }
};

// Store user information in Firestore users collection
// Input: user uid, display name, and email
// Output: None
const storeUserInfo = async (uid, name, email) => {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, { displayName: name, email: email });
};

// Get the display name of a user
// Input: user uid
// Output: user display name
const getUserDisplayName = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const { displayName } = userDoc.data();
    return displayName;
  }
};

// Get a user's uid from their email
// Input: user email
// Output: user uid
const getUserUidFromEmail = async (email) => {
  const usersCollectionRef = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersCollectionRef, where("email", "==", email))
  );
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  }
};

// Share a study guide with another user
// Input: study guide ID and user uid to share with
// Output: None
const shareStudyGuide = async (studyGuideId, uid, allowEditing) => {
  // Update the study guide document with the new contributors
  const studyGuideDocRef = doc(db, "studyGuides", studyGuideId);
  await updateDoc(studyGuideDocRef, {
    contributors: arrayUnion(uid),
  });

  if (allowEditing) {
    await updateDoc(studyGuideDocRef, {
      editors: arrayUnion(uid),
    });
  }

  // Update the userStudyGuides collection for each user with the new study guide ID
  const userDocRef = doc(db, "userStudyGuides", uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    await updateDoc(userDocRef, {
      studyGuides: arrayUnion(studyGuideId),
    });
  } else {
    await setDoc(userDocRef, {
      studyGuides: arrayUnion(studyGuideId),
    });
  }
};

// Check if a user has access to a study guide
// Input: study guide ID and user uid
// Output: Boolean indicating if the user has access to the study guide
const hasAccessToStudyGuide = async (studyGuideId, uid) => {
  const studyGuideDocRef = doc(db, "studyGuides", studyGuideId);
  const studyGuideDoc = await getDoc(studyGuideDocRef);
  if (studyGuideDoc.exists()) {
    const { createdBy, contributors } = studyGuideDoc.data();
    return createdBy === uid || contributors.includes(uid);
  }
};

// Upload a file to storage
// Input: file
// Output: URL of the uploaded file
const uploadFileToFirebase = async (file) => {
  const uniqueId = uuidv4();
  const uniqueFileName = `${uniqueId}_${file.name}`;
  const storageRef = ref(storage, `uploads/${uniqueFileName}`);
  let firebaseFileUrl = "";

  try {
    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, file);

    // Get the download URL of the uploaded file
    firebaseFileUrl = await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading file:", error);
  }

  return firebaseFileUrl;
};

export {
  uploadStudyGuideToFirebase,
  getUserStudyGuides,
  fetchStudyGuide,
  updateStudyGuideFileName,
  updateStudyGuideExtractedData,
  updateStudyGuideHiddenExplanations,
  deleteStudyGuide,
  storeUserInfo,
  getUserDisplayName,
  getUserUidFromEmail,
  shareStudyGuide,
  hasAccessToStudyGuide,
  uploadFileToFirebase,
  getPublicStudyGuides,
};
