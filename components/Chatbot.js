import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faWindowMinimize,
  faMinimize,
  faMaximize,
} from "@fortawesome/free-solid-svg-icons";
import { fontSize } from "@/constants/fontSize";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";

const Chatbot = (props) => {
  const [messages, setMessages] = useState(() => {
    // Retrieve messages from localStorage if available
    const savedMessages = localStorage.getItem("chatbotMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [{ text: "Hello! How can I help you today?", sender: "bot" }];
  });
  const [input, setInput] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);

  // Get study guide which is passed down from the parent component
  const { studyGuide } = props;
  const extractedData = studyGuide?.extractedData;

  // Get chatbot state from the parent component
  const { setIsChatbotShown } = props;

  // Ref to the chatbot container
  const chatbotContainerRef = useRef(null);

  // Ref to the end of the messages container
  const messagesEndRef = useRef(null);

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
    if (input.trim()) {
      setLoadingResponse(true);
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Fetch the response from API endpoint
      const chatbotResponse = await fetch("/api/chatbot-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, extractedData }),
      });

      if (chatbotResponse.ok) {
        const responseText = await chatbotResponse.json();
        // Add the response to the messages
        setLoadingResponse(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: responseText.output, sender: "bot" },
        ]);
      } else {
        setLoadingResponse(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, I am having trouble answering. Please try again.",
            sender: "bot",
          },
        ]);
        console.error("Failed to fetch chatbot response");
      }
    }
  };

  // Function to handle minimize button click
  const handleMinimizeClick = () => {
    // Add a size transition effect
    chatbotContainerRef.current.style.transition = "width 0.5s, height 0.5s";
    chatbotContainerRef.current.style.width = "0%";
    chatbotContainerRef.current.style.height = "0%";
    // Hide the chatbot after the transition ends
    chatbotContainerRef.current.addEventListener("transitionend", () => {
      setIsChatbotShown(false);
    });
  };

  // Function to handle maximize button click
  const handleMaximizeClick = () => {
    if (chatbotContainerRef.current) {
      if (chatbotContainerRef.current.style.width === "100%") {
        // Add a size transition effect
        chatbotContainerRef.current.style.transition =
          "width 0.5s, height 0.5s";
        chatbotContainerRef.current.style.width = "50%";
        chatbotContainerRef.current.style.height = "75%";
      } else {
        // Add a size transition effect
        chatbotContainerRef.current.style.transition =
          "width 0.5s, height 0.5s";
        chatbotContainerRef.current.style.width = "100%";
        chatbotContainerRef.current.style.height = "100%";
      }
    }
    setIsMaximized((prev) => !prev);
  };

  return (
    <ChatbotContainer ref={chatbotContainerRef}>
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
        {messages.map((message, index) =>
          message.sender === "user" ? (
            <UserMessageContainer key={index}>
              <UserMessage>{message.text}</UserMessage>
            </UserMessageContainer>
          ) : (
            <BotMessageContainer key={index}>
              <BotMessage>{message.text}</BotMessage>
            </BotMessageContainer>
          )
        )}
        {loadingResponse && (
          <BotMessageContainer>
            <BotMessage>
              <Dots />
            </BotMessage>
          </BotMessageContainer>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputArea>
        <Input
          type="text"
          value={input}
          placeholder="What can I help you with?"
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={loadingResponse}
        />
        <SendButton icon={faPaperPlane} onClick={handleSend}>
          Send
        </SendButton>
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
  background-color: #fff;
  overflow-y: auto;
  z-index: 1000;
`;

const ChatbotHeader = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #000000;
  background-color: #f03a4733;
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
  color: #ffffff;
  &:hover {
    color: #f03a47;
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
  border-radius: 4px;
  background-color: #f03a4733;
  color: #000000;
  max-width: 80%;
  line-height: 1.3;
`;

const BotMessage = styled.div`
  font-size: ${fontSize.default};
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: #7fa3ff58;
  color: #000000;
  max-width: 80%;
  line-height: 1.3;
`;

const InputArea = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid #000000;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  font-size: ${fontSize.default};
  color: #000000;
`;

const SendButton = styled(FontAwesomeIcon)`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #9c9c9c;
  cursor: pointer;

  &:hover {
    color: #f03a47;
    transition: color 0.3s;
  }
`;
