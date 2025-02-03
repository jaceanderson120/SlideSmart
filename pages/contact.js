import Button from "@/components/Button";
import { useState } from "react";
import styled from "styled-components";
import { useStateContext } from "@/context/StateContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { colors } from "@/constants/colors";
import { fontSize } from "@/constants/fontSize";
import { toast } from "react-toastify";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
// import useAuthRedirect from "@/hooks/useAuthRedirect";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const Contact = () => {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const { currentUser } = useStateContext();

  // State to determine if useAuthRedirect has finished
  const [checkingAuth, setCheckingAuth] = useState(true);
  useAuthRedirect(() => {
    setCheckingAuth(false);
  });

  const sendEmail = () => {
    if (!firstName || !lastName || !email || !subject || !body) {
      toast.error("Please fill out all fields.");
      return;
    }

    setSendingEmail(true);

    const accountName = currentUser.displayName;
    const accountEmail = currentUser.email;

    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountName,
        accountEmail,
        firstName,
        lastName,
        email,
        subject,
        body,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error("Failed to send email. Please try again later.");
        } else {
          toast.success("Email sent successfully!");
          setFirstName("");
          setLastName("");
          setEmail("");
          setSubject("");
          setBody("");
        }
      })
      .catch((error) => console.error("Error sending email:", error))
      .finally(() => setSendingEmail(false));
  };

  return (
    !checkingAuth && (
      <>
        <PageContainer>
          <Navbar />
          <Section>
            <LeftSection>
              <PageTitle>CONTACT US</PageTitle>
              <Subtitle>
                SlideSmart is here <br></br>{" "}
                <SubtitleSpan>to help you</SubtitleSpan>
              </Subtitle>
              <Subtext>
                Feel free to contact our support team if you have any inquiries
                relating to the application.
              </Subtext>
              <Subtext>
                Your form sends us an email. Once we receive your email, we will
                respond to you as soon as possible.
              </Subtext>
            </LeftSection>
            <RightSection>
              <FormBox>
                <InputContainer>
                  <InputLabel>First name</InputLabel>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={sendingEmail}
                  />
                </InputContainer>
                <InputContainer>
                  <InputLabel>Last name</InputLabel>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={sendingEmail}
                  />
                </InputContainer>
                <InputContainer>
                  <InputLabel>Email</InputLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={sendingEmail}
                  />
                </InputContainer>
                <InputContainer>
                  <InputLabel>Subject</InputLabel>
                  <Input
                    type="text"
                    placeholder="Enter the subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={sendingEmail}
                  />
                </InputContainer>
                <InputContainer>
                  <InputLabel>Message</InputLabel>
                  <TextArea
                    type="text"
                    placeholder="Enter your message"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={sendingEmail}
                  />
                </InputContainer>
                <ButtonContainer>
                  {!sendingEmail ? (
                    <Button onClick={sendEmail} padding="16px">
                      Submit
                    </Button>
                  ) : (
                    <Dots />
                  )}
                </ButtonContainer>
              </FormBox>
            </RightSection>
          </Section>
        </PageContainer>
        <Footer />
      </>
    )
  );
};

export default Contact;

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: ${colors.lightGray};
`;

const Section = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  align-items: flex-start;
  text-align: center;
  padding: 32px;
`;

const LeftSection = styled.div`
  display: flex;
  width: 40%;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 16px;
  padding: 48px;
`;

const RightSection = styled.div`
  display: flex;
  width: 60%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  text-align: center;
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

const Subtext = styled.p`
  font-size: ${fontSize.default};
  color: ${colors.gray};
  line-height: 1.3;
`;

const FormBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 80%;
  gap: 16px;
  margin: 16px;
  padding: 48px;
  border-radius: 8px;
  background-color: ${colors.white};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const Input = styled.input`
  font-size: ${fontSize.default};
  padding: 8px;
  border: 1px solid ${colors.gray};
  border-radius: 8px;
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: ${fontSize.secondary};
  color: ${colors.gray};
`;

const TextArea = styled.textarea`
  font-size: ${fontSize.default};
  padding: 8px;
  border: 1px solid ${colors.gray};
  border-radius: 8px;
  width: 100%;
  height: 100px;
  resize: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;
