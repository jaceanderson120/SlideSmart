import Footer from "@/components/page/Footer";
import PageContainer from "@/components/page/PageContainer";
import { useRouter } from "next/router";
import React from "react";

const Competitor = () => {
  const router = useRouter();
  const { competitor } = router.query;
  return (
    <>
      <PageContainer>
        <h1>{competitor}</h1>
      </PageContainer>
      <Footer />
    </>
  );
};

export default Competitor;
