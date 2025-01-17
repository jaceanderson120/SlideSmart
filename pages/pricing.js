import styled from "styled-components";
import Navbar from "../components/Navbar";
import { getCheckoutUrl, getPortalUrl } from "@/utils/stripePayment";
import app from "@/firebase/firebase";
import { useRouter } from "next/navigation"; // must be from next/navigation not next/router
import { useStateContext } from "@/context/StateContext";
import { useEffect, useState } from "react";
import { fontSize } from "@/constants/fontSize";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import Button from "@/components/Button";

const PROMO_CODE = process.env.NEXT_PUBLIC_PROMO_CODE;
const FREE_SPARK = process.env.NEXT_PUBLIC_FREE_SPARK;

const Pricing = () => {
  const { currentUser, loading, hasSpark } = useStateContext();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [hasPromoCode, setHasPromoCode] = useState(false);
  const [hasFreeSparkCode, setHasFreeSparkCode] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const router = useRouter();

  // Fetch user information
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
    if (!loading) {
      setUserName(currentUser?.displayName);
      setEmail(currentUser?.email);
    }
  }, [loading, currentUser]);

  // Direct user to checkout page
  const handleUpgradeClick = async () => {
    setRedirectLoading(true);
    const priceId = hasFreeSparkCode
      ? "price_1Qg9wpFfMETtMj8PSTm0FmAz"
      : hasPromoCode
      ? "price_1QeLrSFfMETtMj8PRMEzHVU6"
      : "price_1QeKd4FfMETtMj8PHiCKlMcS";
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

  // Check promo code
  const checkPromoCode = () => {
    if (promoCode === PROMO_CODE) {
      toast.success("Promo code applied successfully!");
      setHasPromoCode(true);
    } else if (promoCode === FREE_SPARK) {
      toast.success("Promo code applied successfully!");
      setHasFreeSparkCode(true);
    } else {
      toast.error("Invalid promo code");
      setHasPromoCode(false);
    }
  };

  return (
    <PageContainer>
      <Navbar />
      <PricingSection>
        <Title>Pricing Page</Title>
        <HorizontalContainer>
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
          <BoldText>{userName}</BoldText>
          <Text>({email})</Text>
        </HorizontalContainer>
        <HorizontalContainer>
          {" "}
          <BoldText>Subscription:</BoldText>
          <Text>{hasSpark ? "Spark Plan" : "None"}</Text>
        </HorizontalContainer>
        {!hasSpark && (
          <HorizontalContainer>
            <BoldText>Promo Code:</BoldText>
            <PromoCodeInput
              id="promoCodeInput"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={hasPromoCode || hasFreeSparkCode}
            />
            {!hasPromoCode && !hasFreeSparkCode && (
              <Button onClick={checkPromoCode}>Apply</Button>
            )}
          </HorizontalContainer>
        )}
        {!hasSpark && !redirectLoading && (
          <>
            <Button onClick={handleUpgradeClick}>Upgrade</Button>
            <PriceText>
              {hasFreeSparkCode
                ? "(FREE!)"
                : hasPromoCode
                ? "(for $1.00/month)"
                : "(for $9.99/month)"}
            </PriceText>
          </>
        )}
        {hasSpark && !redirectLoading && (
          <Button onClick={handleManageClick}>Manage Subscription</Button>
        )}
        {redirectLoading && <Dots size={32} color="black" />}
      </PricingSection>
    </PageContainer>
  );
};

export default Pricing;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const PricingSection = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f6f4f3;
  width: 100%;
  padding: 32px;
  gap: 20px;
`;

const Title = styled.div`
  font-size: ${fontSize.heading};
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 8px;
  text-align: center;
`;

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const BoldText = styled.p`
  font-size: ${fontSize.default};
  font-weight: bold;
`;

const Text = styled.p`
  font-size: ${fontSize.default};
`;

const PromoCodeInput = styled.input`
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: ${fontSize.default};
  color: #000000;
`;

const PriceText = styled.p`
  font-size: ${fontSize.secondary};
`;
