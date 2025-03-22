import Modal from "react-modal";
import styled, { useTheme } from "styled-components";
import Button from "../Button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

Modal.setAppElement("#__next");

const VerifyModal = ({ isOpen, onClose, onConfirm, email }) => {
  const [enteredCode, setEnteredCode] = useState("");
  const [code, setCode] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const theme = useTheme();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      backgroundColor: theme.lightGray,
      border: "none",
      boxShadow: `4px 4px 4px ${theme.shadow}`,
      width: "90%",
      maxWidth: "400px",
      height: "auto",
      padding: "24px",
      borderRadius: "16px",
    },
  };

  const handleConfirm = () => {
    setEnteredCode("");
    if (Number(enteredCode) === code) {
      toast.success("Email verified successfully!");
      onConfirm();
      onClose();
    } else {
      toast.error("The code you entered is incorrect. Please try again.");
    }
  };

  // Handle sending another code
  const handleSendCode = async (firstTime) => {
    if (!firstTime) {
      setResendDisabled(true); // disable sending another code
    }
    const res = await fetch("/api/send-verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: email,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      setCode(data.code);
      toast.success("Verification code sent successfully.");
    } else {
      toast.error("Failed to send verification email. Please try again later.");
    }

    // Re-enable the button after 30 seconds
    setTimeout(() => {
      setResendDisabled(false);
    }, 15000);
  };

  // On opening the dialog, send a verification code
  useEffect(() => {
    if (isOpen) {
      handleSendCode(true);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Verify Your Email"
        style={customStyles}
      >
        <ModalContent>
          <ModalTitle>Verify Your Email</ModalTitle>
          <ModalInput
            placeholder="Enter your verification code..."
            value={enteredCode}
            onChange={(event) => setEnteredCode(event.target.value)}
          />
          <ModalText>
            Please enter your verification code above to confirm your email and
            complete your registration.
          </ModalText>
          {!resendDisabled && (
            <ModalText>
              Didn't receive a code? Check your spam or{" "}
              <Button
                padding="0px"
                backgroundColor="transparent"
                hoverBackgroundColor="transparent"
                textColor={({ theme }) => theme.primary}
                hoverTextColor={({ theme }) => theme.primary}
                style={{
                  fontSize: theme.fontSize.secondary,
                  fontWeight: "bold",
                }}
                onClick={() => handleSendCode(false)}
              >
                send another code
              </Button>
              .
            </ModalText>
          )}
          <ButtonSection>
            <Button
              onClick={() => {
                setEnteredCode("");
                onClose();
              }}
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              padding="12px"
              fontSize={({ theme }) => theme.fontSize.secondary}
              textColor={({ theme }) => theme.gray}
              hoverTextColor={({ theme }) => theme.primary}
              style={{ border: `1px solid ${({ theme }) => theme.gray}` }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              backgroundColor={({ theme }) => theme.primary}
              hoverBackgroundColor={({ theme }) => theme.primary}
              padding="12px"
              fontSize={({ theme }) => theme.fontSize.secondary}
              textColor={({ theme }) => theme.white}
              hoverTextColor={({ theme }) => theme.black}
              disabled={resendDisabled}
            >
              Confirm
            </Button>
          </ButtonSection>
        </ModalContent>
      </Modal>
    </>
  );
};

const ButtonSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  text-align: center;
`;

const ModalTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.subheading};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.secondary};
  line-height: 1.3;
  color: ${({ theme }) => theme.gray};
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

const ModalInput = styled.input`
  font-size: ${({ theme }) => theme.fontSize.secondary};
  padding: 8px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 2px 2px ${({ theme }) => theme.shadow};
  width: 100%;
`;

export default VerifyModal;
