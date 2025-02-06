import styled from "styled-components";
import { getCheckoutUrl, getPortalUrl } from "@/utils/stripePayment";
import app from "@/firebase/firebase";
import { useRouter } from "next/navigation"; // must be from next/navigation not next/router
import { useStateContext } from "@/context/StateContext";
import { useState } from "react";
import { fontSize } from "@/constants/fontSize";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import Footer from "@/components/Footer";
import Head from "next/head";
import PageContainer from "@/components/PageContainer";

const Pricing = () => {
  const { hasSpark } = useStateContext();
  const [redirectLoading, setRedirectLoading] = useState(false);
  const router = useRouter();

  // State to determine if useAuthRedirect has finished
  const [checkingAuth, setCheckingAuth] = useState(true);
  useAuthRedirect(() => {
    setCheckingAuth(false);
  });

  // Direct user to checkout page
  const handleUpgradeClick = async () => {
    setRedirectLoading(true);
    const priceId = "price_1QeKd4FfMETtMj8PHiCKlMcS";
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    setRedirectLoading(false);
    router.push(checkoutUrl);
  };

  // Direct user to manage subscription page
  const handleManageClick = async () => {
    setRedirectLoading(true);
    const portalUrl = await getPortalUrl(app);
    setRedirectLoading(false);
    router.push(portalUrl);
  };

  const basicPlanDesc = [
    { text: "Unlimited Study Guides", icon: faCheck },
    { text: "Edit + Share Study Guides", icon: faCheck },
    { text: "No Access to Sola: Our GPT-4o Powered Tutor", icon: faX },
    { text: "No Auto-Generation Tools", icon: faX },
    { text: "No Public Study Guide Saves", icon: faX },
  ];

  const sparkPlanDesc = [
    "All Basic Plan Features",
    "Unlimited Access to Sola: Our GPT-4o Powered Tutor",
    "Edit Mode with Unlimited Access to our Auto-Generation Tools",
    "Unlimited Public Study Guide Saves",
    "Unlimited YouTube Video Generation",
  ];

  return (
    <>
      <Head>
        <title>SlideSmart - Pricing</title>
        <meta
          name="description"
          content="Get better grades with SlideSmart. Compare our Basic and Spark plans to see which one is right for you."
        />
        <link rel="canonical" href="https://www.slidesmartai.com/pricing" />
      </Head>
      {!checkingAuth && (
        <>
          <PageContainer>
            <PricingContainer>
              <TopSection>
                <PageTitle>PRICING</PageTitle>
                <Subtitle>
                  Get <SubtitleSpan>better grades</SubtitleSpan> with SlideSmart
                </Subtitle>
              </TopSection>
              <BottomSection>
                <PricingCard>
                  <PricingCardTitle>Basic Plan</PricingCardTitle>
                  <PricingCardPrice>FREE</PricingCardPrice>
                  {!hasSpark ? (
                    <PricingCardInfo>
                      * This is your current plan. Upgrade to the Spark Plan for
                      more!
                    </PricingCardInfo>
                  ) : (
                    <PricingCardInfo>
                      * Cancel your Spark subscription if you are content with
                      using the Basic Plan.
                    </PricingCardInfo>
                  )}
                  <PricingCardLabel>Included with Basic:</PricingCardLabel>
                  <Underline />
                  {basicPlanDesc.map((item, index) => (
                    <PricingCardDescription key={index}>
                      <FontAwesomeIcon
                        icon={item.icon}
                        color={
                          item.icon === faX ? colors.primary70 : colors.primary
                        }
                        size="2x"
                      />
                      {item.text}
                    </PricingCardDescription>
                  ))}
                </PricingCard>
                <PricingCard>
                  <PricingCardTitle>Spark Plan</PricingCardTitle>
                  <PricingCardPrice>$9.99/month</PricingCardPrice>
                  {!hasSpark ? (
                    <Button
                      onClick={handleUpgradeClick}
                      disabled={redirectLoading}
                      loading={redirectLoading}
                    >
                      {redirectLoading ? (
                        <Dots color={colors.white} />
                      ) : (
                        "Upgrade Now!"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleManageClick}
                      disabled={redirectLoading}
                      loading={redirectLoading}
                    >
                      {redirectLoading ? (
                        <Dots color={colors.white} />
                      ) : (
                        "Manage Subscription"
                      )}
                    </Button>
                  )}
                  <PricingCardLabel>Included with Spark:</PricingCardLabel>
                  <Underline />
                  {sparkPlanDesc.map((desc, index) => (
                    <PricingCardDescription key={index}>
                      <FontAwesomeIcon
                        icon={faCheck}
                        color={colors.primary}
                        size="2x"
                      />
                      {desc}
                    </PricingCardDescription>
                  ))}
                </PricingCard>
              </BottomSection>
            </PricingContainer>
          </PageContainer>
          <Footer />
        </>
      )}
    </>
  );
};

export default Pricing;

const PricingContainer = styled.div`
  width: 100%;
  flex-grow: 1;
  background: linear-gradient(
    to bottom,
    ${colors.primary70},
    ${colors.primary33}
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  overflow-x: scroll;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-bottom: 16px;
  padding: 32px;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  gap: 48px;
  padding: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
`;

const PageTitle = styled.p`
  font-size: ${fontSize.heading};
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: ${fontSize.xlheading};
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubtitleSpan = styled.span`
  color: ${colors.primary};
  font-weight: bold;
`;

const PricingCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${colors.white};
  border-radius: 16px;
  padding: 32px;
  width: 30%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  word-wrap: break-word;

  @media (max-width: 768px) {
    width: 80%; // Adjust width for smaller screens
  }
`;

const PricingCardTitle = styled.p`
  font-size: ${fontSize.heading};
  font-weight: bold;
  margin-bottom: 32px;
`;

const PricingCardPrice = styled.p`
  font-size: ${fontSize.subheading};
  font-weight: bold;
  margin-bottom: 32px;
`;

const PricingCardInfo = styled.p`
  font-size: ${fontSize.default};
  color: ${colors.primary};
  text-align: left;
`;

const PricingCardLabel = styled.p`
  font-size: ${fontSize.label};
  color: ${colors.gray};
  margin-top: 32px;
  margin-bottom: 16px;
`;

const Underline = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.primary};
  margin-bottom: 16px;
`;

const PricingCardDescription = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${fontSize.default};
  color: ${colors.gray};
  gap: 16px;
  text-align: left;
  line-height: 1.3;
  margin-bottom: 16px;
`;
