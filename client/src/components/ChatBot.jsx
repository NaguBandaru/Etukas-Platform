import { useState, useRef, useEffect, useContext } from 'react';
import { FiX, FiSend, FiUser, FiCpu, FiVolume2, FiSquare, FiMic, FiPauseCircle } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import './ChatBot.css';

const BotAvatar = () => (
    <div className="custom-bot-avatar">
        <FiCpu size={22} />
        <div className="bot-antenna"></div>
    </div>
);

const ChatBot = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Voice Assistance (Text to Speech)
    const speakMessage = (text, langCode = 'hi-IN') => {
        if (!('speechSynthesis' in window)) return;

        // If already speaking, stop it
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    // Speech Recognition (Voice Input)
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN'; // Default, will detect Hindi/Telugu text

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Initialize greeting based on auth status
    useEffect(() => {
        const name = isAuthenticated && user?.name ? user.name : 'Guest';
        setMessages([
            { id: 1, text: `Namaste ${name}! I'm Etukas AI. \nI can hear your voice and speak back in Hindi, Telugu, or English! \n\nClick the Mic 🎤 to ask a question.`, sender: 'bot' }
        ]);
    }, [isAuthenticated, user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const botResponse = getBotResponse(inputValue);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse.text, sender: 'bot', lang: botResponse.lang }]);
            setIsTyping(false);

            // Auto-speak the response
            speakMessage(botResponse.text, botResponse.lang);
        }, 1500);
    };

    const getBotResponse = (input) => {
        const lowerInput = input.toLowerCase();

        let isHindi = /[\u0900-\u097F]/.test(input) || lowerInput.includes('hindi') || lowerInput.includes('kaise');
        let isTelugu = /[\u0C00-\u0C7F]/.test(input) || lowerInput.includes('telugu') || lowerInput.includes('ela');

        const lang = isTelugu ? 'te-IN' : (isHindi ? 'hi-IN' : 'en-IN');

        if (isTelugu) {
            if (lowerInput.includes('order') || lowerInput.includes('ela')) {
                return { lang, text: "Etukas లో ఆర్డర్ చేయడం చాలా సులభం! కావాల్సిన వస్తువులను కార్ట్‌లో చేర్చి చెక్అవుట్ చేయండి." };
            }
            return { lang, text: "నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?" };
        }

        if (isHindi) {
            if (lowerInput.includes('order') || lowerInput.includes('kaise')) {
                return { lang, text: "Etukas पर ऑर्डर करना बहुत आसान है। अपना सामान चुनें और कार्ट में जाकर ऑर्डर प्लेस करें।" };
            }
            return { lang, text: "नमस्ते! मैं आपकी क्या मदद कर सकता हूँ?" };
        }

        if (lowerInput.includes('how to order') || lowerInput.includes('buy')) {
            return { lang, text: "Set your location, browse categories, add items to cart, and click checkout. Simple!" };
        }

        return { lang, text: "I'm listening! Ask me anything about construction or ordering." };
    };

    return (
        <div className="chatbot-wrapper">
            <button className={`chatbot-fab ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FiX size={24} /> : <BotAvatar />}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="bot-info">
                            <BotAvatar />
                            <div>
                                <h3>Etukas AI Help</h3>
                                <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                    <span className="online-dot"></span>
                                    <span>Voice & Mic Integrated</span>
                                </div>
                            </div>
                        </div>
                        {isSpeaking && (
                            <button className="stop-btn" onClick={stopSpeaking}>
                                <FiPauseCircle size={20} /> Stop
                            </button>
                        )}
                    </div>

                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                                {msg.text}
                                {msg.sender === 'bot' && (
                                    <button
                                        className={`voice-btn ${isSpeaking ? 'active' : ''}`}
                                        onClick={() => speakMessage(msg.text, msg.lang)}
                                    >
                                        {isSpeaking ? <FiSquare size={14} /> : <FiVolume2 size={16} />}
                                    </button>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-bubble bot typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <button
                            className={`mic-btn ${isListening ? 'listening' : ''}`}
                            onClick={toggleListening}
                            title="Voice Search"
                        >
                            <FiMic size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder={isListening ? "Listening..." : "Type or click Mic..."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="send-btn">
                            <FiSend size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
