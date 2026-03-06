import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import styles from './AICoachPage.module.css';

/**
 * Predefined actionable career insights and strategic advice served contextually within the AI coaching interface.
 * Categories include profile optimization, application strategy, and timing methodologies.
 * @constant {Array<{icon: string, tip: string, category: string}>}
 */
const TIPS = [
    { icon: 'lightbulb', tip: 'Add in-demand skills from job descriptions to boost your profile match.', category: 'Profile Boost' },
    { icon: 'trending_up', tip: 'Apply to companies with 15–50 employees — acceptance rates are 3× higher for mid-level roles.', category: 'Strategy' },
    { icon: 'schedule', tip: 'Best time to apply is Tuesday–Thursday 9AM–11AM for faster responses.', category: 'Timing' },
];

/**
 * Conversational AI interface component providing personalized career guidance, resume feedback, and application strategies.
 * Maintains chronological chat state and interfaces asynchronously with backend LLM routing services.
 * 
 * @component
 * @returns {JSX.Element} The rendered AI Coach conversational interface.
 */
export default function AICoachPage() {
    const { user } = useAuth();
    const firstName = user?.profile?.firstName || user?.email?.split('@')[0] || 'there';
    const [messages, setMessages] = useState([
        { from: 'ai', text: `Hi ${firstName}! I'm your AI Career Coach. Ask me anything about job search strategy, interview prep, or career growth.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const endRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    /**
     * Dispatches user-provided query strings to the AI routing service, manages synchronous loading states,
     * and appends resulting completions or error states to the conversational transcript array.
     * 
     * @async
     * @function sendMessage
     * @returns {Promise<void>}
     */
    const sendMessage = async () => {
        const text = input.trim();
        if (!text || sending) return;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { from: 'user', text, time }]);
        setInput('');
        setSending(true);
        try {
            const res = await api.aiCoach.chat(text);
            const reply = res?.data?.message || res?.data?.reply || "I'm thinking about that…";
            setMessages(prev => [...prev, { from: 'ai', text: reply, time }]);
        } catch {
            setMessages(prev => [...prev, {
                from: 'ai',
                text: "I'm having trouble connecting right now. Please make sure the backend is running and your OpenAI key is configured.",
                time
            }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={styles.page}>
            {/* Insight Cards */}
            <div className={styles.tipsGrid}>
                {TIPS.map((t, i) => (
                    <div key={i} className={styles.tipCard}>
                        <span className={`material-icons-round ${styles.tipIcon}`}>{t.icon}</span>
                        <div>
                            <span className={styles.tipCategory}>{t.category}</span>
                            <p>{t.tip}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Interface */}
            <section className={styles.chatSection}>
                <div className={styles.chatHeader}>
                    <div className={styles.aiAvatar}>
                        <span className="material-icons-round">smart_toy</span>
                    </div>
                    <div>
                        <h2>JobFor AI Coach</h2>
                        <span className={styles.onlineBadge}><span /> Online · Powered by AI</span>
                    </div>
                </div>
                <div className={styles.messages}>
                    {messages.map((m, i) => (
                        <div key={i} className={`${styles.message} ${m.from === 'user' ? styles.userMsg : styles.aiMsg}`}>
                            {m.from === 'ai' && <div className={styles.msgAvatar}><span className="material-icons-round">smart_toy</span></div>}
                            <div className={styles.msgBubble}>
                                <p>{m.text}</p>
                                <span className={styles.msgTime}>{m.time}</span>
                            </div>
                        </div>
                    ))}
                    {sending && (
                        <div className={`${styles.message} ${styles.aiMsg}`}>
                            <div className={styles.msgAvatar}><span className="material-icons-round">smart_toy</span></div>
                            <div className={styles.msgBubble}>
                                <p style={{ color: '#888' }}>Thinking…</p>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>
                <div className={styles.chatInput}>
                    <input
                        type="text"
                        placeholder="Ask your AI Coach anything…"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        disabled={sending}
                    />
                    <button className={styles.sendBtn} onClick={sendMessage} disabled={sending}>
                        <span className="material-icons-round">send</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
