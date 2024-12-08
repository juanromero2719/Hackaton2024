import React, { useState, useEffect, useRef } from "react";
import { ChatBubbleLeftIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            content: "Bienvenido a **MetAgro**, ¿en qué puedo ayudarte hoy?",
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        // Cargar historial del chat desde sessionStorage
        const storedHistory = sessionStorage.getItem("chatHistory");
        if (storedHistory) {
            setMessages(JSON.parse(storedHistory));
        }
    }, []);

    useEffect(() => {
        // Guardar historial del chat en sessionStorage
        sessionStorage.setItem("chatHistory", JSON.stringify(messages));
        scrollToBottom(); // Auto-scroll cuando se agrega un mensaje
    }, [messages]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = { role: "user", content: inputMessage };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputMessage("");
        setIsTyping(true); // Mostrar puntos de carga

        try {
            const response = await axios.post(
                "https://hackaton-back-production.up.railway.app/chat",
                {
                    message: inputMessage,
                    context: messages.length > 0 ? messages : undefined, // Enviar historial si existe
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            const botMessage = { role: "bot", content: response.data.response.content };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
            const errorMessage = { role: "bot", content: "Lo siento, ocurrió un error al procesar tu mensaje." };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false); // Ocultar puntos de carga
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            // Mostrar el botón si no estamos en la parte inferior
            setShowScrollButton(scrollTop + clientHeight < scrollHeight - 10);
        }
    };

    return (
        <>
            {/* Botón flotante */}
            <div className="fixed bottom-5 right-5 z-[9999]">
                <button
                    onClick={handleToggle}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg focus:outline-none transition"
                >
                    {isOpen ? <XMarkIcon className="h-6 w-6" /> : <ChatBubbleLeftIcon className="h-6 w-6" />}
                </button>
            </div>

            {/* Panel del Chat */}
            {isOpen && (
                <div
                    className="fixed bottom-20 right-5 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-[9999] border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-500 text-white py-3 px-4 rounded-t-lg shadow">
                        <h4 className="text-lg font-semibold">Asistente Virtual</h4>
                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]
                          [&::-webkit-scrollbar]:w-2
                          [&::-webkit-scrollbar-track]:rounded-full
                          [&::-webkit-scrollbar-track]:bg-gray-100
                          [&::-webkit-scrollbar-thumb]:rounded-full
                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                          light:[&::-webkit-scrollbar-track]:bg-neutral-700
                          light:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-lg min-w-[150px] rounded-lg p-3 text-sm ${
                                    msg.role === "user"
                                        ? "bg-blue-100 text-gray-800 self-start"
                                        : "bg-gray-100 text-gray-800 self-start"
                                } shadow-sm`}
                            >
                                <span className="block text-xs font-bold text-gray-500">
                                    {msg.role === "user" ? "Usuario:" : "Asistente:"}
                                </span>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        a: ({ href, children }) => (
                                            <a href={href} target="_blank" rel="noopener noreferrer"
                                               className="text-blue-500 underline">
                                                {children}
                                            </a>
                                        ),
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        ))}

                        {/* Loading Dots */}
                        {isTyping && (
                            <div className="flex items-center space-x-1 mt-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-1000"></div>
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce delay-2000"></div>
                            </div>
                        )}

                        {/* Referencia para el scroll automático */}
                        <div ref={messagesEndRef}></div>
                    </div>

                    {/* Scroll Button */}
                    {showScrollButton && (
                        <button
                            onClick={scrollToBottom}
                            className="absolute bottom-20 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg focus:outline-none transition"
                        >
                            <ChevronDownIcon className="h-6 w-6" />
                        </button>
                    )}

                    {/* Input */}
                    <div className="flex items-center p-3 border-t border-gray-200 bg-gray-50">
                        <div
                            className="flex flex-1 border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 focus:outline-none text-sm"
                                placeholder="Escribe tu mensaje aquí..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
