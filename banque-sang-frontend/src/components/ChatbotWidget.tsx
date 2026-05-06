import { useState, useRef, useEffect } from 'react';
import apiClient from '../config/axios';
import styles from './ChatbotWidget.module.css';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  'Quelles sont les conditions pour donner mon sang ?',
  'Je peux donner combien de fois par an ?',
  'Que faire avant un don ?',
  'Quels sont les groupes sanguins compatibles ?',
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      text: "Bonjour 👋 Je suis l'assistant SaveLife. Posez-moi vos questions sur le don de sang !",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // ✅ Envoi du message + contexte "donneur" requis par ton API
      const response = await apiClient.post('/chat', { 
        message: text.trim(),
        contexte: "donneur" 
      });

      // ✅ Lecture de la clé 'reponse' (et fallback si le format change)
      const botText = response.data.reponse || response.data.message || "Je n'ai pas pu récupérer de réponse.";

      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: botText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Erreur API:", err);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: '❌ Connexion impossible. Vérifiez que votre serveur tourne sur le port 8080.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        className={styles.fab}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Fenêtre du chat */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div>
              <h3>🤖 Assistant SaveLife</h3>
              <p className={styles.statusOnline}>● En ligne</p>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.role === 'user' ? styles.messageUser : styles.messageBot
                }`}
              >
                <div className={styles.messageBubble}>{msg.text}</div>
                <span className={styles.timestamp}>
                  {msg.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.messageBot}`}>
                <div className={styles.messageBubble}>
                  <span className={styles.typingIndicator}>● ● ●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTIONS */}
          {messages.length <= 2 && !loading && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className={styles.suggestionBtn}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <form className={styles.inputForm} onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className={styles.input}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={styles.sendBtn}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}