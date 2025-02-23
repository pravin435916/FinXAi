import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';

const TypingAnimation = () => (
  <div className="flex space-x-2 p-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const Chatbot = () => {
  const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can I help you today?", sender: "bot" }]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatMessage = (text) => {
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const jsonResponse = JSON.parse(jsonMatch[1]);

        return (
          <ul className="list-disc pl-4 space-y-2">
            {jsonResponse.response.map((item, index) => (
              <li key={index}>
                <strong>{item.Category}:</strong> {item.Recommendation}
              </li>
            ))}
          </ul>
        );
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    return text.split("\n").map((line, index) => <p key={index}>{line}</p>);
  };

  const sendMessageToAPI = async (userMessage) => {
    try {
      setLoading(true);
      setIsTyping(true);

      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulated typing delay
      setIsTyping(false);

      if (response.ok) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: "bot" }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "Error: Could not get response.", sender: "bot" }]);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Error: Server unreachable.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    setMessages(prev => [...prev, { id: Date.now(), text: inputMessage, sender: "user" }]);
    setInputMessage("");
    sendMessageToAPI(inputMessage.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-900">
      <div className=" text-white p-4">
        <h1 className="text-xl font-bold">AI Financial Advisor</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                {message.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>

              <div className={`rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'text-white shadow-sm rounded-tl-none'}`}>
                {formatMessage(message.text)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900">
                <Bot size={16} className="text-white" />
              </div>
              <div className=" shadow-sm rounded-lg rounded-tl-none">
                <TypingAnimation />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about finances..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors" disabled={!inputMessage.trim() || loading}>
            {loading ? "..." : <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Chatbot