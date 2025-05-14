import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchStudyGuide, hasAccessToStudyGuide } from "@/firebase/database";

const useFetchStudyGuide = (id, currentUser, loadingUser) => {
  const [studyGuide, setStudyGuide] = useState(null);
  const [fileName, setFileName] = useState("");
  const [hasFlashCards, setHasFlashCards] = useState(false);
  const [hasFirebaseUrl, setHasFirebaseUrl] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      if (loadingUser) return;

      if (!currentUser) {
        router.push("/login");
        return;
      }

      if (id && currentUser) {
        const hasAccess = await hasAccessToStudyGuide(id, currentUser.uid);

        const { fetchedStudyGuide, fileName, hasFlashCards } =
          await fetchStudyGuide(id);

        if (!hasAccess && !fetchedStudyGuide.isPublic) {
          router.push("/dashboard");
          return;
        }

        setStudyGuide(fetchedStudyGuide);
        setFileName(fileName);
        setHasFlashCards(!!hasFlashCards);
        setHasFirebaseUrl(!!fetchedStudyGuide.firebaseFileUrl);
      }
    };

    checkAccessAndFetchData();
  }, [id, currentUser, loadingUser, router]);

  return {
    studyGuide,
    setStudyGuide,
    fileName,
    setFileName,
    hasFlashCards,
    setHasFlashCards,
    hasFirebaseUrl,
    setHasFirebaseUrl,
  };
};

export default useFetchStudyGuide;
