import React from "react";
import styled from "styled-components";
import Head from "next/head";

const TOS = () => {
  return (
    <>
      <Head>
        <title>SlideSmart - TOS and Privacy Policy</title>
        <meta
          name="description"
          content="SlideSmart's Terms of Service and Privacy Policy"
        />
        <link rel="canonical" href="https://www.slidesmartai.com/tos" />
      </Head>
      <body>
        <main>
          <Container>
            <Title>Terms of Service</Title>
            <Text>
              <Strong>Effective Date:</Strong> 03/25/2025
            </Text>

            <Text>
              Welcome to SlideSmart. By accessing or using our service, you
              agree to the terms outlined in this document. If you do not agree
              to these terms, please refrain from using our services.
            </Text>

            <SectionTitle>1. Acceptance of Terms</SectionTitle>
            <Text>
              By using SlideSmart (“the Service”), you agree to be bound by
              these Terms of Service ("Terms"). These Terms apply to all
              visitors, users, and others who access the Service.
            </Text>

            <SectionTitle>2. YouTube API Services</SectionTitle>
            <Text>
              Our Service integrates with YouTube API Services, which are
              governed by YouTube’s Terms of Service. By using our API Client,
              you acknowledge and agree that you are also bound by the{" "}
              <Link href="https://www.youtube.com/t/terms">
                YouTube Terms of Service
              </Link>
              .
            </Text>

            <SectionTitle>3. Use of the Service</SectionTitle>
            <Text>
              You agree to use the Service solely for lawful purposes and in
              accordance with these Terms. The Service will comply with
              YouTube's embedding rules, ensuring that embedded players retain
              their intended functionality, including maintaining a minimum
              viewport of 200px by 200px, and that no restrictions are placed on
              video playback or other core YouTube functionalities.
            </Text>

            <SectionTitle>
              4. Ethical Standards and Responsible Use
            </SectionTitle>
            <Text>
              SlideSmart is committed to upholding ethical standards, especially
              around intellectual property, privacy, and academic integrity. We
              design our platform to respect educators and support responsible
              learning. Additionally, given the potential for GPT-generated
              content inaccuracies, we are working to develop measures to verify
              GPT-generated content against reliable sources.
            </Text>

            <SectionTitle>5. Data Privacy and Transparency</SectionTitle>
            <Text>
              We recognize the importance of safeguarding user-uploaded
              materials that may be sensitive or intended to remain private.
              SlideSmart is committed to transparency in data handling
              practices. While we do not store data for model training,
              user-uploaded data may be used by OpenAI to improve future models,
              in accordance with OpenAI’s policies and industry standards.
            </Text>

            <SectionTitle>6. User Responsibility</SectionTitle>
            <Text>
              Users should be careful when uploading information that is
              confidential or copyrighted. SlideSmart securely stores files that
              users upload and does not share them with anyone. The user is the
              only person who will ever have access to files they uploaded to
              create study guides.
            </Text>

            <SectionTitle>7. Data Usage and Privacy</SectionTitle>
            <Text>
              We do not sell any user data. Data that is sent to the Azure
              OpenAI API is not used to train or improve their models and is not
              used for marketing purposes. According to Azure OpenAI's policies,
              your prompts (inputs) and completions (outputs), your embeddings,
              and your training data:
            </Text>
            <List>
              <ListItem>are NOT available to other customers.</ListItem>
              <ListItem>are NOT available to OpenAI.</ListItem>
              <ListItem>are NOT used to improve OpenAI models.</ListItem>
              <ListItem>
                are NOT used to train, retrain, or improve Azure OpenAI Service
                foundation models.
              </ListItem>
              <ListItem>
                are NOT used to improve any Microsoft or 3rd party products or
                services without your permission or instruction.
              </ListItem>
            </List>

            <SectionTitle>8. AI-Generated Content</SectionTitle>
            <Text>
              Study guides generated by SlideSmart are created using artificial
              intelligence (AI). While we strive to provide accurate and useful
              content, AI-generated content may have limitations and may not
              always be accurate or complete. Users should verify the
              information and use it as a supplementary resource.
            </Text>

            <SectionTitle>9. Changes to the Terms</SectionTitle>
            <Text>
              We reserve the right to modify or replace these Terms at any time.
              We will provide notice of such changes by posting the updated
              terms on our website.
            </Text>

            <SectionTitle>10. Intellectual Property Rights</SectionTitle>
            <Text>
              All content, trademarks, and data on this site, including but not
              limited to software, databases, design, text, and graphics, are
              the property of SlideSmart or its content suppliers.
            </Text>

            <SectionTitle>11. Limitation of Liability</SectionTitle>
            <Text>
              To the fullest extent permitted by law, SlideSmart and its
              affiliates will not be liable for any damages arising from the use
              of the Service.
            </Text>

            <SectionTitle>12. Contact Information</SectionTitle>
            <Text>
              If you have any questions about these Terms, please contact us by
              email at slidesmartai@gmail.com.
            </Text>
          </Container>

          <Container>
            <Title>Privacy Policy</Title>
            <Text>
              <Strong>Effective Date:</Strong> 03/25/2025
            </Text>

            <Text>
              At SlideSmart, we respect your privacy and are committed to
              protecting your personal information. This Privacy Policy outlines
              the information we collect, how we use it, and your rights
              regarding your data.
            </Text>

            <SectionTitle>1. Information We Collect</SectionTitle>
            <Text>We collect the following types of information:</Text>
            <List>
              <ListItem>
                <Strong>Personal Information</Strong>: Data that identifies you
                as an individual, such as your name and email address.
              </ListItem>
              <ListItem>
                <Strong>YouTube API Data</Strong>: We only store{" "}
                <Strong>video IDs</Strong> retrieved from YouTube API Services.
                No other personal or public data from YouTube is stored.
              </ListItem>
            </List>

            <SectionTitle>2. YouTube API Services</SectionTitle>
            <Text>
              We use YouTube API Services to provide functionality within our
              Service. By using our Service, you also agree to YouTube’s{" "}
              <Link href="https://www.youtube.com/t/terms">
                Terms of Service
              </Link>{" "}
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
              <ListItem>
                Display and interact with YouTube video content
              </ListItem>
            </List>
            <Text>
              We store video IDs temporarily for up to 30 calendar days, as
              necessary to provide the service. After 30 days, video IDs are
              either refreshed or deleted in accordance with data retention
              policies.
            </Text>

            <SectionTitle>4. Data Storage and Security</SectionTitle>
            <Text>
              We take reasonable steps to protect the information we collect,
              including video IDs, against loss, unauthorized access, and
              misuse. However, we cannot guarantee complete security. Therefore,
              while we strive to protect your personal information, we cannot
              ensure absolute security and accept no liability for breaches
              beyond our reasonable control.
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
              parties, except as required by law, court order, government
              regulation, or when we believe such disclosure is necessary to
              protect our rights, privacy, safety, or property, as well as that
              of our users and the public. If third parties are involved, they
              will only receive the information necessary to perform their
              function.
            </Text>

            <SectionTitle>
              7. Ethical Standards and Data Transparency
            </SectionTitle>
            <Text>
              SlideSmart is committed to ethical practices, particularly
              regarding intellectual property and the privacy of educational
              materials. We are mindful of the privacy concerns of users who may
              upload sensitive content. Data stored by us may be used by OpenAI
              for model training, in line with OpenAI’s and our policies.
              SlideSmart ensures that its privacy policy aligns with YouTube’s
              data guidelines and promotes transparency regarding data use.
            </Text>

            <SectionTitle>8. User Responsibility</SectionTitle>
            <Text>
              Users should be careful when uploading information that is
              confidential or copyrighted. SlideSmart securely stores files that
              users upload and does not share them with anyone. The user is the
              only person who will ever have access to files they uploaded to
              create study guides.
            </Text>

            <SectionTitle>9. Data Usage and Privacy</SectionTitle>
            <Text>
              We do not sell any user data. Data that is sent to the Azure
              OpenAI API is not used to train or improve their models and is not
              used for marketing purposes. According to Azure OpenAI's policies,
              your prompts (inputs) and completions (outputs), your embeddings,
              and your training data:
            </Text>
            <List>
              <ListItem>are NOT available to other customers.</ListItem>
              <ListItem>are NOT available to OpenAI.</ListItem>
              <ListItem>are NOT used to improve OpenAI models.</ListItem>
              <ListItem>
                are NOT used to train, retrain, or improve Azure OpenAI Service
                foundation models.
              </ListItem>
              <ListItem>
                are NOT used to improve any Microsoft or 3rd party products or
                services without your permission or instruction.
              </ListItem>
            </List>
            <Text>
              Your fine-tuned Azure OpenAI models are available exclusively for
              your use. The Azure OpenAI Service is operated by Microsoft as an
              Azure service; Microsoft hosts the OpenAI models in Microsoft's
              Azure environment and the Service does NOT interact with any
              services operated by OpenAI (e.g. ChatGPT, or the OpenAI API).
            </Text>

            <SectionTitle>10. Contact Information</SectionTitle>
            <Text>
              If you have any questions or concerns about this Privacy Policy,
              please contact us by email at slidesmartai@gmail.com.
            </Text>

            <SectionTitle>11. Changes to the Privacy Policy</SectionTitle>
            <Text>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or for legal reasons. Any updates will be
              posted on our website.
            </Text>
          </Container>
        </main>
      </body>
    </>
  );
};

export default TOS;

const Container = styled.div`
  padding: 20px;
  line-height: 1.6;
  background-color: ${({ theme }) => theme.white};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.heading};
  margin-bottom: 10px;
  color: ${({ theme }) => theme.black};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.subheading};
  margin-top: 20px;
  color: ${({ theme }) => theme.black};
`;

const Text = styled.p`
  font-size: ${({ theme }) => theme.fontSize.default};
  margin-bottom: 15px;
  color: ${({ theme }) => theme.black};
`;

const List = styled.ul`
  margin-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.black};
`;

const Link = styled.a`
  color: #1a73e8;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Strong = styled.strong`
  color: ${({ theme }) => theme.black};
`;
