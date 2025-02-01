import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faWindowMinimize,
  faMinimize,
  faMaximize,
  faPaperclip,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { fontSize } from "@/constants/fontSize";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import { LatexRenderer } from "./LatexRenderer";
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-toastify";
import { colors } from "@/constants/colors";

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
              : "Hi, I'm Professor Sola, a chatbot powered by the powerful GPT-4o model, ready to answer any questions! To interact with me, you must purchase the Spark Plan.",
            sender: "bot",
          },
        ];
  });
  const [input, setInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);

  // Get study guide which is passed down from the parent component
  const { studyGuide } = props;
  const extractedData = studyGuide?.extractedData;

  // Get chatbot state from the parent component
  const { setIsChatbotShown, isChatbotShown } = props;

  // Ref to the chatbot container
  const chatbotContainerRef = useRef(null);

  // Ref to the end of the messages container
  const messagesEndRef = useRef(null);

  // Ref to the file input
  const fileInputRef = useRef(null);

  // Scroll to the end of the messages container whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() || uploadedImage) {
      setLoadingResponse(true);
      let newMessages;
      if (uploadedImage) {
        newMessages = [
          ...messages,
          { text: input, image: uploadedImage, sender: "user" },
        ];

        // Reset the file input and uploaded image
        setUploadedImage(null);
        fileInputRef.current.value = "";
      } else {
        newMessages = [...messages, { text: input, sender: "user" }];
      }
      setMessages(newMessages);
      setInput("");

      // Get the last 5 messages to send to the API
      const messagesToSend = newMessages.slice(-5);

      // Use FormData to send the image file along with the messages
      const formData = new FormData();
      formData.append("messages", JSON.stringify(messagesToSend));
      formData.append("extractedData", JSON.stringify(extractedData));
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      // Fetch the response from API endpoint
      const chatbotResponse = await fetch("/api/chatbot-gpt", {
        method: "POST",
        body: formData,
      });

      if (chatbotResponse.ok) {
        // Add the bot's response to the messages
        const responseText = await chatbotResponse.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: responseText.output, sender: "bot" },
        ]);
      } else {
        // Add an error message if the response is not ok
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, I am having trouble answering. Please try again.",
            sender: "bot",
          },
        ]);
      }
      setLoadingResponse(false);
    }
  };

  // Function to handle minimize button click
  const handleMinimizeClick = () => {
    setIsChatbotShown(false);
  };

  // Function to handle maximize button click
  const handleMaximizeClick = () => {
    if (chatbotContainerRef.current) {
      if (chatbotContainerRef.current.style.width === "100%") {
        chatbotContainerRef.current.style.width = "50%";
        chatbotContainerRef.current.style.height = "75%";
      } else {
        chatbotContainerRef.current.style.width = "100%";
        chatbotContainerRef.current.style.height = "100%";
      }
    }
    setIsMaximized((prev) => !prev);
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Only allow image file types
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      setUploadedImage(file);
    }
  };

  return (
    <ChatbotContainer
      ref={chatbotContainerRef}
      style={{
        display: isChatbotShown ? "flex" : "none",
        transition: "width 0.5s, height 0.5s",
      }}
    >
      <ChatbotHeader>
        <IconContainer>
          <Icon icon={faWindowMinimize} onClick={handleMinimizeClick} />
          <Icon
            icon={isMaximized ? faMinimize : faMaximize}
            onClick={handleMaximizeClick}
          />
        </IconContainer>
        <HeaderText>Chat with Sola</HeaderText>
      </ChatbotHeader>
      <MessagesContainer>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            {message.sender === "user" ? (
              <UserMessageContainer>
                <UserMessage>
                  {message.image && (
                    <StyledImage src={URL.createObjectURL(message.image)} />
                  )}
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
            {index === messages.length - 2 && <div ref={messagesEndRef} />}
          </React.Fragment>
        ))}
        {loadingResponse && (
          <BotMessageContainer>
            <BotMessage>
              <Dots />
            </BotMessage>
          </BotMessageContainer>
        )}
      </MessagesContainer>
      <InputArea>
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
          icon={uploadedImage ? faX : faPaperclip}
          onClick={() => {
            if (!uploadedImage) {
              fileInputRef.current.click();
            } else {
              setUploadedImage(null);
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
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  right: 0;
  height: 75%;
  width: 50%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: ${colors.white};
  z-index: 1000;
`;

const ChatbotHeader = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid ${colors.black};
  background-color: ${colors.primary33};
`;

const IconContainer = styled.div`
  position: absolute;
  left: 8px;
  font-size: ${fontSize.default};
  display: flex;
  gap: 8px;
`;

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: ${colors.white};
  &:hover {
    color: ${colors.primary};
    transition: color 0.3s;
  }
`;

const HeaderText = styled.p`
  flex-grow: 1;
  text-align: center;
  margin: 0;
  font-size: ${fontSize.heading};
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: flex-start;
  padding: 16px;
  overflow-y: auto;
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
  font-size: ${fontSize.default};
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 8px 0px 8px 8px;
  background-color: ${colors.primary33};
  color: ${colors.black};
  max-width: 80%;
  line-height: 1.3;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
`;

const BotMessage = styled.div`
  font-size: ${fontSize.default};
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 0px 8px 8px 8px;
  background-color: ${colors.lightGray};
  color: ${colors.black};
  max-width: 80%;
  line-height: 1.3;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
`;

const InputArea = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid ${colors.black};
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  font-size: ${fontSize.default};
  color: ${colors.black};
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: ${colors.gray};
  cursor: pointer;

  &:hover {
    color: ${colors.primary};
    transition: color 0.3s;
  }
`;

const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 10px;
`;
