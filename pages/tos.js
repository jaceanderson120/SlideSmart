import React from "react";
import styled from "styled-components";

const TOS = () => {
  return (
    <>
      <Container>
        <Title>Terms of Service</Title>
        <Text>
          <Strong>Effective Date:</Strong> 10/23/2024
        </Text>

        <Text>
          Welcome to SlideSmart. By accessing or using our service, you agree to
          the terms outlined in this document. If you do not agree to these
          terms, please refrain from using our services.
        </Text>

        <SectionTitle>1. Acceptance of Terms</SectionTitle>
        <Text>
          By using SlideSmart (“the Service”), you agree to be bound by these
          Terms of Service ("Terms"). These Terms apply to all visitors, users,
          and others who access the Service.
        </Text>

        <SectionTitle>2. YouTube API Services</SectionTitle>
        <Text>
          Our Service integrates with YouTube API Services, which are governed
          by YouTube’s Terms of Service. By using our API Client, you
          acknowledge and agree that you are also bound by the{" "}
          <Link href="https://www.youtube.com/t/terms">
            YouTube Terms of Service
          </Link>
          .
        </Text>

        <SectionTitle>3. Use of the Service</SectionTitle>
        <Text>
          You agree to use the Service only for lawful purposes and in
          accordance with these Terms. The Service will comply with YouTube's
          embedding rules, ensuring that embedded players retain their intended
          functionality, including maintaining a minimum viewport of 200px by
          200px, and that no restrictions are placed on video playback or other
          core YouTube functionalities.
        </Text>

        <SectionTitle>4. Changes to the Terms</SectionTitle>
        <Text>
          We reserve the right to modify or replace these Terms at any time. We
          will provide notice of such changes by posting the updated terms on
          our website.
        </Text>

        <SectionTitle>5. Intellectual Property Rights</SectionTitle>
        <Text>
          All content, trademarks, and data on this site, including but not
          limited to software, databases, design, text, and graphics, are the
          property of SlideSmart or its content suppliers.
        </Text>

        <SectionTitle>6. Limitation of Liability</SectionTitle>
        <Text>
          To the fullest extent permitted by law, SlideSmart and its affiliates
          will not be liable for any damages arising from the use of the
          Service.
        </Text>

        <SectionTitle>7. Contact Information</SectionTitle>
        <Text>
          If you have any questions about these Terms, please contact us by
          email at brayden@thepettigrews.org.
        </Text>
      </Container>

      <Container>
        <Title>Privacy Policy</Title>
        <Text>
          <Strong>Effective Date:</Strong> 10/23/2024
        </Text>

        <Text>
          At SlideSmart, we respect your privacy and are committed to protecting
          your personal information. This Privacy Policy outlines the
          information we collect, how we use it, and your rights regarding your
          data.
        </Text>

        <SectionTitle>1. Information We Collect</SectionTitle>
        <Text>We collect the following types of information:</Text>
        <List>
          <ListItem>
            <Strong>Personal Information</Strong>: Data that identifies you as
            an individual, such as your name and email address (only if
            applicable).
          </ListItem>
          <ListItem>
            <Strong>YouTube API Data</Strong>: We only store{" "}
            <Strong>video IDs</Strong> retrieved from YouTube API Services. No
            other personal or public data from YouTube is stored.
          </ListItem>
        </List>

        <SectionTitle>2. YouTube API Services</SectionTitle>
        <Text>
          We use YouTube API Services to provide functionality within our
          Service. By using our Service, you also agree to YouTube’s{" "}
          <Link href="https://www.youtube.com/t/terms">Terms of Service</Link>{" "}
          and{" "}
          <Link href="http://www.google.com/policies/privacy">
            Google's Privacy Policy
          </Link>
          .
        </Text>

        <SectionTitle>3. Use of Information</SectionTitle>
        <Text>The information we collect is used to:</Text>
        <List>
          <ListItem>Provide and maintain the Service</ListItem>
          <ListItem>Display and interact with YouTube video content</ListItem>
        </List>
        <Text>
          We store video IDs temporarily for up to 30 calendar days, as
          necessary to provide the service. After 30 days, video IDs are either
          refreshed or deleted in accordance with data retention policies.
        </Text>

        <SectionTitle>4. Data Storage and Security</SectionTitle>
        <Text>
          We take reasonable steps to protect the information we collect,
          including video IDs, against loss, unauthorized access, and misuse.
          However, we cannot guarantee complete security.
        </Text>

        <SectionTitle>5. Cookies and Similar Technologies</SectionTitle>
        <Text>
          We may use cookies or similar technologies to enhance the user
          experience. These technologies might also be used by third-party
          service providers.
        </Text>

        <SectionTitle>6. Data Sharing</SectionTitle>
        <Text>
          We do not share your personal information or video IDs with third
          parties, except as required by law or for the operation of our
          Service. If third parties are involved, they will only receive the
          information necessary to perform their function.
        </Text>

        <SectionTitle>7. Contact Information</SectionTitle>
        <Text>
          If you have any questions or concerns about this Privacy Policy,
          please contact us by email at brayden@thepettigrews.org.
        </Text>

        <SectionTitle>8. Changes to the Privacy Policy</SectionTitle>
        <Text>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for legal reasons. Any updates will be posted on
          our website.
        </Text>
      </Container>
    </>
  );
};

export default TOS;

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 10px;
  color: #333;
`;

const SectionTitle = styled.h2`
  font-size: 1.5em;
  margin-top: 20px;
  color: #555;
`;

const Text = styled.p`
  font-size: 1em;
  margin-bottom: 15px;
  color: #666;
`;

const List = styled.ul`
  margin-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  color: #666;
`;

const Link = styled.a`
  color: #1a73e8;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Strong = styled.strong`
  color: #000;
`;
