import { auth, db } from "@/library/firebase/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";

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
        googleSearchResults: studyGuide.googleSearchResults,
        firebaseFileUrl: studyGuide.firebaseFileUrl,
        createdAt: studyGuide.createdAt,
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
        return {
          id: studyGuideDoc.id,
          fileName: data.fileName,
        };
      });

      const guides = await Promise.all(studyGuidesPromises);
      return guides;
    }
  }
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
      googleSearchResults: JSON.parse(data.googleSearchResults),
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

export {
  uploadStudyGuideToFirebase,
  getUserStudyGuides,
  fetchStudyGuide,
  updateStudyGuideFileName,
};
