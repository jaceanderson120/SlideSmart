import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage, faX } from "@fortawesome/free-solid-svg-icons";
import "react-activity/dist/library.css";
import { LatexRenderer } from "./LatexRenderer";
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-toastify";

const Chatbot = (props) => {
  const { hasSpark } = useStateContext();
  const [messages, setMessages] = useState(() => {
    // Retrieve messages from localStorage if available
    const savedMessages = localStorage.getItem("chatbotMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            text: hasSpark
              ? "Hello! How can I help you today?"
              : "Hi, I'm Professor Sola, a chatbot powered by the powerful GPT-4o model, ready to answer any questions and analyze any images! To interact with me, you must purchase the Spark Plan.",
            sender: "bot",
          },
        ];
  });
  const [input, setInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [messageInProgress, setMessageInProgress] = useState("");

  // Get study guide which is passed down from the parent component
  const { studyGuide } = props;
  const extractedData = studyGuide?.extractedData;

  // Get chatbot state from the parent component
  const { setIsChatbotShown } = props;

  // Ref to the file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to the bottom of the messages container whenever messages change
  const messagesContainerRef = useRef(null);
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages, messageInProgress]);

  const handleSend = async () => {
    if (!hasSpark) {
      toast.error("Upgrade to Spark to chat with me!");
      return;
    }
    if (input.trim() || uploadedImage) {
      setLoadingResponse(true);
      let newMessages;
      if (uploadedImage) {
        newMessages = [
          ...messages,
          { text: input, image: uploadedImageURL, sender: "user" },
        ];

        // Reset the file input and uploaded image
        setUploadedImage(null);
        setUploadedImageURL(null);
        fileInputRef.current.value = "";
      } else {
        newMessages = [...messages, { text: input, sender: "user" }];
      }
      setMessages(newMessages);
      setInput("");

      // Get the last 10 messages to send to the API
      const messagesToSend = newMessages.slice(-10);

      // Use FormData to send the image file along with the messages
      const formData = new FormData();
      formData.append("messages", JSON.stringify(messagesToSend));
      formData.append("extractedData", JSON.stringify(extractedData));
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      // Fetch the response from API endpoint
      try {
        const chatbotResponse = await fetch("/api/chatbot-gpt", {
          method: "POST",
          body: formData,
        });

        if (chatbotResponse.body) {
          const reader = chatbotResponse.body.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let chunk = "";

          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            chunk += decoder.decode(value, { stream: true });
            setMessageInProgress((prev) => prev + chunk);
          }
          // Set the final message once the stream is done
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: chunk, sender: "bot" },
          ]);
        }
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, I am having trouble answering. Please try again.",
            sender: "bot",
          },
        ]);
      }

      setMessageInProgress("");
      setLoadingResponse(false);
    }
  };

  // Function to handle minimize button click
  const handleMinimizeClick = () => {
    setIsChatbotShown(false);
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const supportedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (file) {
      // Only allow image file types
      if (!supportedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file.");
        return;
      }
      setUploadedImage(file);
      setUploadedImageURL(URL.createObjectURL(file));
    }
  };

  return (
    <ChatbotContainer>
      <ChatbotHeader>
        <IconContainer>
          <Icon icon={faX} onClick={handleMinimizeClick} />
        </IconContainer>
        <HeaderText>Chat with Sola</HeaderText>
      </ChatbotHeader>
      <MessagesContainer>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            {message.sender === "user" ? (
              <UserMessageContainer>
                <UserMessage>
                  {message.image && <StyledImage src={message.image} />}
                  {message.text}
                </UserMessage>
              </UserMessageContainer>
            ) : (
              <BotMessageContainer>
                <BotMessage>
                  <LatexRenderer>{message.text}</LatexRenderer>
                </BotMessage>
              </BotMessageContainer>
            )}
          </React.Fragment>
        ))}
        {messageInProgress !== "" && (
          <BotMessageContainer>
            <BotMessage>
              <LatexRenderer>{messageInProgress}</LatexRenderer>
            </BotMessage>
          </BotMessageContainer>
        )}
        <div ref={messagesContainerRef} style={{ height: 1 }} />
      </MessagesContainer>
      <InputArea>
        {uploadedImageURL && (
          <Thumbnail src={uploadedImageURL} alt="Uploaded" />
        )}
        <Input
          type="text"
          value={input}
          placeholder={
            hasSpark
              ? "What can I help you with?"
              : "Upgrade to Spark to chat with me!"
          }
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={!hasSpark || loadingResponse}
        />
        <StyledFontAwesomeIcon
          icon={uploadedImage ? faX : faImage}
          onClick={() => {
            if (!hasSpark) {
              toast.error("Upgrade to Spark to send images!");
              return;
            }
            if (!uploadedImage) {
              fileInputRef.current.click();
            } else {
              setUploadedImage(null);
              setUploadedImageURL(null);
              fileInputRef.current.value = "";
            }
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <StyledFontAwesomeIcon icon={faPaperPlane} onClick={handleSend} />
      </InputArea>
    </ChatbotContainer>
  );
};

export default Chatbot;

// Styles
const ChatbotContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 2px 2px ${({ theme }) => theme.shadow};
  overflow: hidden;
  height: 100%;
  max-height: 100%;
  position: absolute;
`;

const ChatbotHeader = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  padding: 8px;
  box-shadow: 0 2px 2px ${({ theme }) => theme.shadow};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.primary33};
  margin-top: 8px;
  margin-left: 8px;
  margin-right: 8px;
`;

const IconContainer = styled.div`
  position: absolute;
  left: 8px;
  font-size: ${({ theme }) => theme.fontSize.default};
  display: flex;
  gap: 8px;
  padding: 8px;
`;

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: ${({ theme }) => theme.black};
  &:hover {
    color: ${({ theme }) => theme.white};
    transition: color 0.3s;
  }
`;

const HeaderText = styled.p`
  flex-grow: 1;
  text-align: center;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.heading};
`;

const MessagesContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  padding: 16px;
  overflow-y: auto;
  overflow-anchor: none;
  scrollbar-color: ${({ theme }) => theme.primary70} transparent;
`;

const UserMessageContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  text-align: right;
`;

const BotMessageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  text-align: left;
`;

const UserMessage = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fontSize.default};
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 8px 0px 8px 8px;
  background-color: ${({ theme }) => theme.primary33};
  color: ${({ theme }) => theme.black};
  max-width: 90%;
  line-height: 1.3;
  box-shadow: 0 2px 2px ${({ theme }) => theme.shadow};
`;

const BotMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSize.default};
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 0px 8px 8px 8px;
  background-color: ${({ theme }) => theme.lightGray};
  color: ${({ theme }) => theme.black};
  max-width: 90%;
  line-height: 1.3;
  box-shadow: 0 2px 2px ${({ theme }) => theme.shadow};
  white-space: pre-wrap;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 2px 2px 2px 2px ${({ theme }) => theme.shadow};
  margin-bottom: 8px;
  margin-left: 8px;
  margin-right: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  background-color: transparent;
  font-size: ${({ theme }) => theme.fontSize.default};
  color: ${({ theme }) => theme.black};
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.gray};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.primary};
    transition: color 0.3s;
  }
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 10px;
  object-fit: contain;
`;

const Thumbnail = styled.img`
  height: 40px;
  width: auto;
  border-radius: 4px;
  margin-right: 8px;
`;
