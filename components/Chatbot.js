import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

const Chatbot = (props) => {
  const [messages, setMessages] = useState(() => {
    // Retrieve messages from localStorage if available
    const savedMessages = localStorage.getItem("chatbotMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");

  // Get study guide which is passed down from the parent component
  const { studyGuide } = props;
  const extractedData = studyGuide?.extractedData;

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
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
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: responseText.output, sender: "bot" },
        ]);
      } else {
        console.error("Failed to fetch chatbot response");
      }
    }
  };

  return (
    <ChatbotContainer>
      <ChatbotHeader>Chat with Sola</ChatbotHeader>
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
      </MessagesContainer>
      <InputArea>
        <Input
          type="text"
          value={input}
          placeholder="What can I help you with?"
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
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
  bottom: 8%;
  right: 2%;
  height: 75%;
  width: 50%;
  border: 1px solid #f03a47;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow-y: auto;
  z-index: 1000;
`;

const ChatbotHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f03a47;
  background-color: #f03a4733;
  font-size: 2rem;
`;

const MessagesContainer = styled.div`
  display: flex;
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
  font-size: 1.25rem;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: #f03a4733;
  color: #000000;
  max-width: 80%;
`;

const BotMessage = styled.div`
  font-size: 1.25rem;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: #7fa3ff58;
  color: #000000;
  max-width: 80%;
`;

const InputArea = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid #f03a47;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 1.5rem;
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
